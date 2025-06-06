
import type { Project, Task } from './types';
import { collection, getDocs, writeBatch, doc,getCountFromServer } from 'firebase/firestore';
import { db } from './firebase.config';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    clientName: 'Adebayo Oluwaseun',
    projectTopic: 'Impact of AI on SME Growth in Lagos',
    progress: 75,
    totalAmount: 150000,
    paidAmount: 100000,
    status: 'In Progress',
    deadline: '2024-08-30',
    createdAt: '2024-05-01T10:00:00Z', // Ensure ISO 8601 format
  },
  {
    id: 'proj-2',
    clientName: 'Ngozi Okonjo',
    projectTopic: 'Renewable Energy Adoption in Rural Nigeria',
    progress: 40,
    totalAmount: 120000,
    paidAmount: 50000,
    status: 'Correction',
    deadline: '2024-09-15',
    createdAt: '2024-06-10T11:00:00Z',
  },
  {
    id: 'proj-3',
    clientName: 'Chinedu Eze',
    projectTopic: 'Fintech Solutions for Financial Inclusion',
    progress: 100,
    totalAmount: 200000,
    paidAmount: 200000,
    status: 'Completed',
    createdAt: '2024-04-15T12:00:00Z',
  },
  {
    id: 'proj-4',
    clientName: 'Fatima Bello',
    projectTopic: 'E-commerce Trends in Northern Nigeria',
    progress: 10,
    totalAmount: 100000,
    paidAmount: 10000,
    status: 'Pending',
    deadline: '2024-10-01',
    createdAt: '2024-07-01T13:00:00Z',
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Literature Review for Adebayo',
    projectId: 'proj-1',
    projectName: 'Impact of AI on SME Growth in Lagos',
    status: 'In Progress',
    isCorrection: false,
    dueDate: '2024-07-30',
    createdAt: '2024-07-15T14:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Address feedback for Ngozi (Chapter 2)',
    projectId: 'proj-2',
    projectName: 'Renewable Energy Adoption in Rural Nigeria',
    status: 'To Do',
    isCorrection: true,
    dueDate: '2024-08-05',
    createdAt: '2024-07-20T15:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Draft methodology for Fatima',
    projectId: 'proj-4',
    projectName: 'E-commerce Trends in Northern Nigeria',
    status: 'To Do',
    isCorrection: false,
    createdAt: '2024-07-22T16:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Final proofreading for Chinedu',
    projectId: 'proj-3',
    projectName: 'Fintech Solutions for Financial Inclusion',
    status: 'Done',
    isCorrection: false,
    createdAt: '2024-06-01T17:00:00Z',
  },
];

// This function can be called manually or through a UI element if needed.
export async function seedInitialData() {
  if (!db) {
    console.error("Firestore (db) is not initialized. Cannot seed data.");
    return;
  }

  try {
    const projectsCol = collection(db, 'projects');
    const tasksCol = collection(db, 'tasks');

    const projectsSnapshot = await getCountFromServer(projectsCol);
    const tasksSnapshot = await getCountFromServer(tasksCol);

    const batch = writeBatch(db);
    let operationsCount = 0;

    if (projectsSnapshot.data().count === 0) {
      console.log('Seeding initial projects...');
      initialProjects.forEach(project => {
        const projectRef = doc(db, 'projects', project.id);
        batch.set(projectRef, project);
        operationsCount++;
      });
    }

    if (tasksSnapshot.data().count === 0) {
      console.log('Seeding initial tasks...');
      initialTasks.forEach(task => {
        const taskRef = doc(db, 'tasks', task.id);
        batch.set(taskRef, task);
        operationsCount++;
      });
    }

    if (operationsCount > 0) {
      await batch.commit();
      console.log('Initial data seeded successfully.');
    } else {
      console.log('Database already contains data or no initial data to seed. No seeding performed.');
    }
  } catch (error) {
    console.error("Error seeding data: ", error);
  }
}
