
'use client';

import { useRef } from 'react';
import PageHeader from '@/components/page-header';
import ProgressCharts from '@/components/progress/progress-charts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-4 w-4"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function ProgressPage() {
  const progressRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownloadPdf = () => {
    const input = progressRef.current;
    if (!input) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find the content to download.',
      });
      return;
    }

    toast({
      title: 'Generating PDF...',
      description: 'Your progress report will be downloaded shortly.',
    });

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const height = pdfWidth / ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
      pdf.save('progress-report.pdf');
    });
  };

  const handleShareWhatsApp = () => {
    let message = `Hey! 👋 Check out my progress from Nutrition Navigator:\n\n`;
    message += `*My Progress Report* 📈\n\n`;
    message += `I'm making great strides towards my goals! Feeling stronger and healthier every day. 💪\n\n`;
    message += "Generated with ❤️ by Nutrition Navigator!";

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Progress"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleShareWhatsApp} variant="outline" size="sm">
              <WhatsAppIcon />
              Share
            </Button>
            <Button onClick={handleDownloadPdf} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        }
      />
      <div ref={progressRef}>
        <ProgressCharts />
      </div>
    </div>
  );
}
