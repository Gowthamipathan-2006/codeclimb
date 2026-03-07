
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Award } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  onDownload?: () => void;
}

const Certificate = ({ studentName, courseName, completionDate, certificateId, onDownload }: CertificateProps) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;

    // Use html2canvas-like approach via canvas
    const el = certRef.current;
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = el.offsetWidth * scale;
    canvas.height = el.offsetHeight * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw certificate as image using SVG foreignObject
    const data = new XMLSerializer().serializeToString(el);
    const svgBlob = new Blob([
      `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <foreignObject width="100%" height="100%" style="transform: scale(${scale}); transform-origin: top left;">
          <div xmlns="http://www.w3.org/1999/xhtml">${el.outerHTML}</div>
        </foreignObject>
      </svg>`
    ], { type: 'image/svg+xml' });
    
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = `CodeClimb_Certificate_${courseName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;

    onDownload?.();
  };

  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      <div
        ref={certRef}
        className="bg-card border-4 border-double border-primary/30 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary/20 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary/20 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-primary/20 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-primary/20 rounded-br-xl" />

        {/* Header */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Award className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-primary mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
          CodeClimb
        </h2>
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-6">Certificate of Completion</p>

        {/* Body */}
        <p className="text-muted-foreground text-sm mb-2">This is to certify that</p>
        <h3 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {studentName}
        </h3>
        <p className="text-muted-foreground text-sm mb-2">has successfully completed the course</p>
        <h4 className="text-xl font-bold text-primary mb-6">{courseName}</h4>

        {/* Date & Signature */}
        <div className="flex justify-between items-end mt-8 px-4">
          <div className="text-center">
            <div className="w-32 border-t-2 border-primary/20 mb-1" />
            <p className="text-muted-foreground text-xs">Date: {formattedDate}</p>
          </div>
          <div className="text-center">
            <p className="text-primary font-bold italic text-sm mb-1">CodeClimb Team</p>
            <div className="w-32 border-t-2 border-primary/20 mb-1" />
            <p className="text-muted-foreground text-xs">Authorized Signature</p>
          </div>
        </div>

        {/* Certificate ID */}
        <p className="text-muted-foreground/50 text-[10px] mt-6">Certificate ID: {certificateId}</p>
      </div>

      <Button onClick={handleDownload} className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute">
        <Download className="h-4 w-4 mr-2" />
        Download Certificate as PNG
      </Button>
    </div>
  );
};

export default Certificate;
