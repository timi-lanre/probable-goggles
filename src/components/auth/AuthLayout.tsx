
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5D3BC] via-[#F0E6D1] to-[#E5D3BC]">
      {/* Logo positioned top left like landing page */}
      <nav className="relative z-10 flex justify-between items-center px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
            alt="Advisor Connect"
            className="h-16 w-auto object-contain"
          />
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Welcome section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
