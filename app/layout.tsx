import type { Metadata } from 'next';
import { Kalam } from 'next/font/google';
import './globals.css';

const kalam = Kalam({ variable: '--font-kalam', subsets: ['latin'], weight: ['300', '400', '700'] });
export const metadata: Metadata = {
  title: 'Libri di Carta',
  description: 'La tua libreria personale di romanzi.',
  openGraph: { title: 'Libri di Carta', description: 'La tua libreria personale di romanzi.', images: ['/social-preview.png'], locale: 'it_IT', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body className={kalam.variable}>{children}</body></html>;
}
