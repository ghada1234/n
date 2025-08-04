'use client';

import { useState, useRef, useEffect } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Camera, Loader2, Send, SwitchCamera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeMealAction } from './actions';
import type { MealAnalyzerOutput } from '@/ai/flows/meal-analyzer';

type FacingMode = 'user' | 'environment';

export default function MealAnalyzerPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalyzerOutput | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');

  useEffect(() => {
    const getCameraPermission = async (mode: FacingMode) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description:
            'Your browser does not support camera access. Please try a different browser.',
        });
        return;
      }
      try {
        // Stop any existing stream
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
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission(facingMode);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast, facingMode]);
  
  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setCapturedImage(null);
    setAnalysis(null);
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
        setAnalysis(null);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('photoDataUri', capturedImage);

    const result = await analyzeMealAction(null, formData);

    if (result?.message === 'success' && result.data) {
      setAnalysis(result.data);
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
    <div className="space-y-8">
      <PageHeader title="AI Meal Analyzer" />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Camera</CardTitle>
            <CardDescription>
              Point your camera at a meal to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <p className="text-sm">
                    Please allow camera permissions to use this feature.
                  </p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings to use this
                  feature.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-4">
              {capturedImage ? (
                <>
                  <Button variant="outline" onClick={handleRetake}>
                    Retake Photo
                  </Button>
                  <Button onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Analyze Meal
                  </Button>
                </>
              ) : (
                <>
                <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                  <Camera className="mr-2 h-4 w-4" /> Capture Photo
                </Button>
                 <Button onClick={handleSwitchCamera} disabled={!hasCameraPermission} variant="outline">
                  <SwitchCamera className="mr-2 h-4 w-4" /> Switch Camera
                </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutritional Analysis</CardTitle>
            <CardDescription>
              Here is the AI-powered nutritional breakdown of your meal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="mt-4">Analyzing your meal...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-headline">
                    {analysis.mealName}
                  </h3>
                  <p className="text-lg text-primary">
                    ~{analysis.calories} calories
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Macronutrients</h4>
                    <dl className="mt-2 grid grid-cols-3 gap-4 rounded-lg border p-4 text-center">
                      <div className="flex flex-col">
                        <dt className="text-sm text-muted-foreground">
                          Protein
                        </dt>
                        <dd className="font-bold">
                          {analysis.macros.protein}g
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm text-muted-foreground">
                          Carbs
                        </dt>
                        <dd className="font-bold">
                          {analysis.macros.carbohydrates}g
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm text-muted-foreground">Fat</dt>
                        <dd className="font-bold">{analysis.macros.fat}g</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold">Micronutrients</h4>
                    <p className="mt-2 whitespace-pre-wrap rounded-lg border p-4 text-sm font-light">
                      {analysis.micros}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Camera className="h-12 w-12" />
                <p className="mt-4">
                  Capture a photo of your meal to see its nutritional analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
