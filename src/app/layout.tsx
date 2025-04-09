import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

// Load the Inter font
const inter = Inter({ subsets: ['latin'] });

// Define the metadata for our application
export const metadata = {
  title: 'SaborMX - Discover Mexico\'s Food and Drink Scene',
  description: 'Find the best restaurants, bars, and cafes in Mexico',
};

// This Root Layout component wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
