import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'SIGNex',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-h-screen flex-1 flex-col px-4 pb-6 pt-20 sm:px-6 sm:pt-24 md:pt-28 lg:px-12 max-md:pb-14">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
