import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jbmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-terminal' });

export const metadata: Metadata = {
  title: 'opposite — productivity, perfected.',
  description: 'the app that does the opposite of what you want. enterprise ready.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${grotesk.variable} ${jbmono.variable}`}>{children}</body>
    </html>
  );
}
