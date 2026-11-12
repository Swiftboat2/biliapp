import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** URL que abre el docente al escanear el QR del aula. */
export const courseUrl = (courseId: string) => `${window.location.origin}/curso/${courseId}`;

/** Código QR real (escaneable) que lleva a la página del curso para firmar la hora. */
export function CourseQR({ courseId, size = 220 }: { courseId: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(courseUrl(courseId), { width: size * 2, margin: 1, color: { dark: '#131b2e', light: '#ffffff' } })
      .then((url) => alive && setSrc(url))
      .catch(() => alive && setSrc(null));
    return () => {
      alive = false;
    };
  }, [courseId, size]);
  return src ? <img src={src} width={size} height={size} alt="Código QR del curso" style={{ display: 'block' }} /> : <div style={{ width: size, height: size }} />;
}
