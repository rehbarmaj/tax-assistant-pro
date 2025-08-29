"use client";

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" onClick={handlePrint} className="print-hidden">
      <Printer className="mr-2" /> Print
    </Button>
  );
};
