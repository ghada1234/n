
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Send, SwitchCamera, AlertTriangle, ScanBarcode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeMealAction } from '@/app/(app)/meal-analyzer/actions';
import { lookupBarcode } from '@/ai/flows/barcode-lookup';

type FacingMode = 'user' | 'environment';
type AnalysisMode = 'photo' | 'barcode';

interface AnalyzeFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAnalysisComplete: (analysis: { mealName: string, calories: number }) => void;
}

export default function AnalyzeFoodDialog({ isOpen, onOpenChange, onAnalysisComplete }: AnalyzeFoodDialogProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('photo');
  const [barcodeDetector, setBarcodeDetector] = useState<any>(null); // Use 'any' for experimental API
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const [isBarcodeSupported, setIsBarcodeSupported] = useState(false);

  useEffect(() => {
    // This check must be in useEffect to avoid server-side rendering errors
    setIsBarcodeSupported(typeof window !== 'undefined' && 'BarcodeDetector' in window);
  }, []);

  const resetState = () => {
    setCapturedImage(null);
    setIsLoading(false);
    setAnalysisMode('photo');
    if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
        detectionInterval.current = null;
    }
  }

  const handleOpenChange = (open: boolean) => {
    if(!open) {
      resetState();
    }
    onOpenChange(open);
  }
  
  const handleBarcodeLookup = useCallback(async (barcodeValue: string) => {
    if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
        detectionInterval.current = null;
    }
    setIsLoading(true);
    toast({
        title: "Barcode Detected!",
        description: `Looking up ${barcodeValue}...`
    });

    try {
        const result = await lookupBarcode({ barcode: barcodeValue });
        if (result && !result.notFound && result.productName) {
            onAnalysisComplete({ mealName: result.productName, calories: result.calories || 0 });
        } else {
            throw new Error("Product not found.");
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Barcode Lookup Failed',
            description: "Could not find a product for this barcode. Please try again.",
        });
        // Optional: restart detection after a delay if lookup fails
        // setTimeout(() => startBarcodeDetection(), 1000); 
    } finally {
        setIsLoading(false);
    }
  }, [onAnalysisComplete, toast]);

  const startBarcodeDetection = useCallback(() => {
    if (!barcodeDetector || !videoRef.current || detectionInterval.current) return;

    detectionInterval.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) { // 2 is HAVE_CURRENT_DATA
            try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                    handleBarcodeLookup(barcodes[0].rawValue);
                }
            } catch (e) {
                console.error("Barcode detection failed: ", e);
                // Could be a transient error, do not stop interval
            }
        }
    }, 500);
  }, [barcodeDetector, handleBarcodeLookup]);

  useEffect(() => {
    if (!isOpen) {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
        return;
    }

    const getCameraPermission = async (mode: FacingMode) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasCameraPermission(false);
            return;
        }
        try {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            setHasCameraPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Setup barcode detector
            if (isBarcodeSupported) {
                // @ts-ignore - BarcodeDetector is experimental
                const detector = new window.BarcodeDetector({ formats: ['ean_13', 'upc_a', 'upc_e', 'ean_8'] });
                setBarcodeDetector(detector);
            }

        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
        }
    };

    getCameraPermission(facingMode);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
        detectionInterval.current = null;
      }
    };
  }, [isOpen, toast, facingMode, isBarcodeSupported]);


  useEffect(() => {
    if (analysisMode === 'barcode' && barcodeDetector && isOpen) {
        startBarcodeDetection();
    } else {
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
            detectionInterval.current = null;
        }
    }
    return () => {
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
            detectionInterval.current = null;
        }
    };
  }, [analysisMode, barcodeDetector, startBarcodeDetection, isOpen]);

  const toggleAnalysisMode = () => {
    setAnalysisMode(prev => prev === 'photo' ? 'barcode' : 'photo');
    setCapturedImage(null);
  }
  
  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setCapturedImage(null);
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('photoDataUri', capturedImage);

    const result = await analyzeMealAction(null, formData);

    if (result?.message === 'success' && result.data) {
      onAnalysisComplete({ mealName: result.data.mealName, calories: result.data.calories });
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          result.message || 'An unexpected error occurred during analysis.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Analyze with AI</DialogTitle>
          <DialogDescription>
            {analysisMode === 'photo' 
                ? "Take a picture of your meal to automatically identify it and estimate its calories."
                : "Scan a product's barcode to look up its nutritional information."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              {capturedImage && analysisMode === 'photo' ? (
                <img
                  src={capturedImage}
                  alt="Captured meal"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {analysisMode === 'barcode' && (
                  <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                      <div className='w-3/4 h-1/2 border-4 border-dashed border-primary rounded-lg animate-pulse' />
                  </div>
                )}
                </>
              )}
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center text-white">
                  <Camera className="h-12 w-12" />
                  <p className="mt-2">Camera access is required.</p>
                </div>
              )}
               {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-center text-white">
                  <Loader2 className="h-12 w-12 animate-spin" />
                  <p className="mt-2">{analysisMode === 'barcode' ? "Looking up barcode..." : "Analyzing..."}</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center gap-4">
              <div>
                {isBarcodeSupported && (
                    <Button onClick={toggleAnalysisMode} disabled={isLoading || !hasCameraPermission} variant="outline">
                        {analysisMode === 'photo' ? <ScanBarcode className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                        {analysisMode === 'photo' ? 'Scan Barcode' : 'Take Photo'}
                    </Button>
                )}
              </div>
              <div className='flex justify-center gap-4'>
                {analysisMode === 'photo' && capturedImage ? (
                    <>
                    <Button variant="outline" onClick={handleRetake}>
                        Retake
                    </Button>
                    <Button onClick={handleAnalyze} disabled={isLoading}>
                        {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        <Send className="mr-2 h-4 w-4" />
                        )}
                        Analyze
                    </Button>
                    </>
                ) : analysisMode === 'photo' ? (
                    <>
                    <Button onClick={handleCapture} disabled={!hasCameraPermission || isLoading}>
                    <Camera className="mr-2 h-4 w-4" /> Capture
                    </Button>
                    <Button onClick={handleSwitchCamera} disabled={!hasCameraPermission || isLoading} variant="outline">
                    <SwitchCamera className="mr-2 h-4 w-4" /> Switch
                    </Button>
                    </>
                ) : null }
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
