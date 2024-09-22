import { Suspense } from "react";


import type { Metadata } from 'next'
 
// either Static metadata
export const metadata: Metadata = {
  title: '...',
}
 

  // Make sure you export the default layout component
  export default function ClientsLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        {/* Render the page content */}
        {children}
        </Suspense>
    );
  }
  