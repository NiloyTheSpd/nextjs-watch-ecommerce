import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import SessionProvider from '@/components/providers/SessionProvider';
import { auth } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WatchStore - Premium Timepieces',
  description: 'Discover our exclusive collection of luxury, sport, classic, and smartwatches.',
  keywords: ['watches', 'luxury watches', 'sport watches', 'smartwatches'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
