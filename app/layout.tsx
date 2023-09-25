import type { Metadata } from 'next';
import ActiveStatus from './components/activeStatus';
import AuthContext from './context/AuthContext';
import ToasterContext from './context/ToasterContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Messenger clone',
  description: 'Messenger clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
