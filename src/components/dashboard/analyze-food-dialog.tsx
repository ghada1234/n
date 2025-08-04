
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Camera, ScanBarcode, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { lookupBarcode } from '@/ai/flows/barcode-lookup';
import { analyzeFood } from '@/ai/flows/analyze-food-flow';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';


interface AnalyzeFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAnalysisComplete: (result: { dishName: string; calories: number; portionSize: string; protein: number; carbs: number; fat: number; }) => void;
}

const isBarcodeDetectorSupported = () => {
    if (typeof window === 'undefined') return false;
    return 'BarcodeDetector' in window;
};

export default function AnalyzeFoodDialog({
  isOpen,
  onOpenChange,
  onAnalysisComplete,
}: AnalyzeFoodDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isBarcodeSupported, setIsBarcodeSupported] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'photo' | 'barcode'>('photo');
  const [barcode, setBarcode] = useState<string | null>(null);
  const detectionInterval = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    setIsBarcodeSupported(isBarcodeDetectorSupported());
  }, []);

  useEffect(() => {
    if (!isOpen) {
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
        }
      return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
        }
    }
  }, [isOpen, facingMode, toast]);
  
  const handleBarcodeLookup = useCallback(async (barcodeValue: string) => {
    setIsLoading(true);
    setBarcode(barcodeValue);
    try {
        const result = await lookupBarcode({ barcode: barcodeValue });
        if (result.notFound || !result.productName) {
            toast({
              variant: 'destructive',
              title: 'Product Not Found',
              description: `Could not find a product with barcode: ${barcodeValue}`,
            });
        } else {
            onAnalysisComplete({
                dishName: result.productName,
                calories: result.calories ?? 0,
                protein: result.protein ?? 0,
                carbs: result.carbs ?? 0,
                fat: result.fat ?? 0,
                portionSize: "1 serving" // Default portion size for barcodes
            });
        }
    } catch (error) {
        console.error('Barcode lookup failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  }, [onAnalysisComplete, toast]);

  const startBarcodeDetection = useCallback(() => {
    if (!isBarcodeSupported || !videoRef.current) return;
    
    // @ts-ignore
    const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'upc_a', 'upc_e'] });

    detectionInterval.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
                const detectedBarcode = barcodes[0].rawValue;
                if(detectionInterval.current) clearInterval(detectionInterval.current);
                handleBarcodeLookup(detectedBarcode);
            }
        } catch (error) {
            console.error('Barcode detection error:', error);
            if(detectionInterval.current) clearInterval(detectionInterval.current);
        }
    }, 500);
  }, [isBarcodeSupported, handleBarcodeLookup]);

  useEffect(() => {
    if (isOpen && hasCameraPermission && analysisMode === 'barcode' && !isLoading) {
        startBarcodeDetection();
    }
    return () => {
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
        }
    }
  }, [isOpen, hasCameraPermission, analysisMode, startBarcodeDetection, isLoading]);

  const handleCaptureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not capture image from camera.',
      });
      setIsLoading(false);
      return;
    }
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await analyzeFood({ photoDataUri });
      if (result) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Food analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Analyze Food</DialogTitle>
          <DialogDescription>
            Use your camera to identify a dish or scan a barcode.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as 'photo' | 'barcode')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="photo">Take Photo</TabsTrigger>
                <TabsTrigger value="barcode" disabled={!isBarcodeSupported}>Scan Barcode</TabsTrigger>
            </TabsList>
            <TabsContent value="photo">
                <div className="relative mt-2">
                  <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                   {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="text-white mt-2">Analyzing...</p>
                    </div>
                  )}
                </div>
            </TabsContent>
            <TabsContent value="barcode">
                <div className="relative mt-2">
                  <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                  {isLoading && (
                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                       <p className="text-white mt-2">Looking up barcode...</p>
                     </div>
                   )}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-4/5 h-2/5 border-2 border-primary rounded-lg shadow-lg" />
                   </div>
                </div>
            </TabsContent>
        </Tabs>

        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access in your browser to use this feature.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={switchCamera} disabled={isLoading || !hasCameraPermission}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Switch Camera
            </Button>

            {analysisMode === 'photo' ? (
                <Button onClick={handleCaptureAndAnalyze} disabled={isLoading || !hasCameraPermission}>
                    <Camera className="mr-2 h-4 w-4" />
                    Analyze Photo
                </Button>
            ) : (
                <Button onClick={() => setBarcode(null)} disabled={isLoading || !hasCameraPermission}>
                    <ScanBarcode className="mr-2 h-4 w-4" />
                    Rescan
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
