import type { Project } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverallFinanceSummaryProps {
  projects: Project[];
}

export function OverallFinanceSummary({ projects }: OverallFinanceSummaryProps) {
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalRemaining = totalRevenue - totalPaid;
  const completedProjectsValue = projects
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Overall Financials</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Total Expected Revenue" value={formatCurrency(totalRevenue)} color="text-primary" />
        <InfoBox title="Total Paid" value={formatCurrency(totalPaid)} color="text-green-600" />
        <InfoBox title="Total Remaining" value={formatCurrency(totalRemaining)} color="text-orange-600" />
        <InfoBox title="Value of Completed Projects" value={formatCurrency(completedProjectsValue)} color="text-purple-600" />
      </CardContent>
    </Card>
  );
}

interface InfoBoxProps {
  title: string;
  value: string;
  color?: string;
}

function InfoBox({ title, value, color = "text-foreground" }: InfoBoxProps) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
