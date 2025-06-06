import type { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, CalendarDays, CornerDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const pendingTasks = tasks
    .filter(task => task.status === 'To Do' || task.status === 'In Progress')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5); // Show up to 5 tasks

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <ListChecks className="mr-2 h-6 w-6 text-primary" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <p className="text-muted-foreground">No pending tasks. Great job!</p>
        ) : (
          <ul className="space-y-3">
            {pendingTasks.map(task => (
              <li key={task.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>
                    {task.projectName && (
                      <p className="text-xs text-muted-foreground flex items-center">
                        <CornerDownRight className="h-3 w-3 mr-1" /> {task.projectName}
                      </p>
                    )}
                  </div>
                  <Badge variant={task.status === 'In Progress' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <CalendarDays className="h-3 w-3 mr-1" /> Due: {formatDate(task.dueDate)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
