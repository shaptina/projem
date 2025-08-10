import './globals.css';
import React from 'react';

export const metadata = {
  title: 'FreeCAD Üretim Platformu',
  description: 'CNC/CAM/CAD üretim platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const devBypass = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';
  return (
    <html lang="tr">
      <body>
        {devBypass && (
          <div style={{ background: '#fde68a', padding: '8px', textAlign: 'center' }}>
            Geliştirici modu aktif: Oturum otomatik sağlanır
          </div>
        )}
        {children}
      </body>
    </html>
  );
}


