import type { Project } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Landmark, AlertTriangle } from 'lucide-react';

interface FinanceOverviewProps {
  projects: Project[];
}

export function FinanceOverview({ projects }: FinanceOverviewProps) {
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalRemaining = totalRevenue - totalPaid;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Landmark className="mr-2 h-6 w-6 text-primary" />
          Finance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 bg-primary/5 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Total Expected</h3>
          <p className="text-2xl font-semibold text-primary">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="p-4 bg-green-500/5 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Total Paid</h3>
          <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="p-4 bg-orange-500/5 rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Total Remaining</h3>
          <p className="text-2xl font-semibold text-orange-600">{formatCurrency(totalRemaining)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
