'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './global.css';
import { Viewport } from 'next';

interface RootLayoutProps {
    children: React.ReactNode;
}
const queryClient = new QueryClient()

export const viewport: Viewport = {
    themeColor: '#000',
  }


export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                <QueryClientProvider client={queryClient}>

                    <LayoutProvider>{children}</LayoutProvider>
                    <ReactQueryDevtools initialIsOpen={false} />

                    </QueryClientProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
