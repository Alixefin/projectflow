'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function DateTimeWidget() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const day = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
  const date = currentDateTime.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold font-headline">{day}</p>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center text-lg font-medium">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <span>{time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
