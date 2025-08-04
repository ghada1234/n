
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Send, SwitchCamera, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeMealAction } from '@/app/(app)/meal-analyzer/actions';
import type { MealAnalyzerOutput } from '@/ai/flows/meal-analyzer';

type FacingMode = 'user' | 'environment';

interface AnalyzeFoodDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAnalysisComplete: (analysis: { mealName: string, calories: number }) => void;
}

export default function AnalyzeFoodDialog({ isOpen, onOpenChange, onAnalysisComplete }: AnalyzeFoodDialogProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');

  const resetState = () => {
    setCapturedImage(null);
    setIsLoading(false);
  }

  const handleOpenChange = (open: boolean) => {
    if(!open) {
      resetState();
    }
    onOpenChange(open);
  }

  useEffect(() => {
    if (!isOpen) return;

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
            video: { facingMode: mode },
            });
            setHasCameraPermission(true);

            if (videoRef.current) {
            videoRef.current.srcObject = stream;
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
    };
  }, [isOpen, toast, facingMode]);
  
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
          <DialogTitle>Analyze Meal with AI</DialogTitle>
          <DialogDescription>
            Take a picture of your meal to automatically identify it and estimate its calories.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured meal"
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              )}
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center text-white">
                  <Camera className="h-12 w-12" />
                  <p className="mt-2">Camera access is required.</p>
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

            <div className="flex justify-center gap-4">
              {capturedImage ? (
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
              ) : (
                <>
                <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
                 <Button onClick={handleSwitchCamera} disabled={!hasCameraPermission} variant="outline">
                  <SwitchCamera className="mr-2 h-4 w-4" /> Switch
                </Button>
                </>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
