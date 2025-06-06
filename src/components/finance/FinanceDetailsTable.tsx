import type { Project } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FinanceDetailsTableProps {
  projects: Project[];
}

export function FinanceDetailsTable({ projects }: FinanceDetailsTableProps) {
  if (projects.length === 0) {
    return <p className="text-muted-foreground">No project data available for financial breakdown.</p>;
  }

  return (
    <ScrollArea className="rounded-md border shadow-md">
      <Table>
        <TableCaption>A detailed list of project payments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Client Name</TableHead>
            <TableHead>Project Topic</TableHead>
            <TableHead className="text-right">Total (NGN)</TableHead>
            <TableHead className="text-right">Paid (NGN)</TableHead>
            <TableHead className="text-right">Balance (NGN)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const balance = project.totalAmount - project.paidAmount;
            return (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.clientName}</TableCell>
                <TableCell>{project.projectTopic}</TableCell>
                <TableCell className="text-right">{formatCurrency(project.totalAmount)}</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(project.paidAmount)}</TableCell>
                <TableCell className={`text-right ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(balance)}
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === 'Completed' ? 'default' : (project.status === 'Correction' ? 'destructive' : 'secondary')}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.deadline ? formatDate(project.deadline) : 'N/A'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
