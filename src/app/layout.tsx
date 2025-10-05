// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Epol Stock',
  description: 'Premium Portal — Jual Akun & Gaming Services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
