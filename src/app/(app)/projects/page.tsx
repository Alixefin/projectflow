
'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface StatBoxProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

function ProjectStatBox({ title, value, icon, bgColor = "bg-muted/30", textColor = "text-foreground" }: StatBoxProps) {
  return (
    <Card className={`shadow-sm ${bgColor} flex-1`}>
      <CardContent className="p-4">
        <div className="flex items-center mb-1">
          {icon}
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground ml-2">{title}</h3>
        </div>
        <p className={`text-xl sm:text-2xl font-semibold ${textColor}`}>{value}</p>
      </CardContent>
    </Card>
  );
}


export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!db) {
        toast({ title: "Error", description: "Database not initialized. Cannot fetch projects.", variant: "destructive" });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const projectsCollection = collection(db, 'projects');
        const q = query(projectsCollection, orderBy('createdAt', 'desc'));
        const projectsSnapshot = await getDocs(q);
        const projectsList = projectsSnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        })) as Project[];
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
        toast({ title: "Error", description: "Could not fetch projects.", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchProjects();
  }, [toast]);

  const handleAddProject = async (data: Omit<Project, 'id' | 'createdAt'>) => {
    if (!db) {
      toast({ title: "Error", description: "Database not initialized. Cannot add project.", variant: "destructive" });
      return;
    }
    setLoading(true); 
    try {
      const newProjectData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'projects'), newProjectData);
      setProjects(prev => [{ ...newProjectData, id: docRef.id }, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsFormOpen(false);
      toast({ title: "Success", description: "Project added successfully." });
    } catch (error) {
      console.error("Error adding project: ", error);
      toast({ title: "Error", description: "Could not add project.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEditProject = async (data: Omit<Project, 'id' | 'createdAt'>) => {
    if (!editingProject || !db) {
      toast({ title: "Error", description: !db ? "Database not initialized." : "No project selected for editing.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const projectRef = doc(db, 'projects', editingProject.id);
      const { id, createdAt, ...updateData } = { ...editingProject, ...data };
      await updateDoc(projectRef, updateData);
      
      setProjects(prev =>
        prev.map(p => (p.id === editingProject.id ? { id: editingProject.id, createdAt: editingProject.createdAt, ...updateData } : p))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
      setEditingProject(null);
      setIsFormOpen(false);
      toast({ title: "Success", description: "Project updated successfully." });
    } catch (error) {
      console.error("Error updating project: ", error);
      toast({ title: "Error", description: "Could not update project.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDeleteProject = async (projectId: string) => {
     if (!db) {
      toast({ title: "Error", description: "Database not initialized. Cannot delete project.", variant: "destructive" });
      return;
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast({ title: "Success", description: "Project deleted successfully." });
      } catch (error) {
        console.error("Error deleting project: ", error);
        toast({ title: "Error", description: "Could not delete project.", variant: "destructive" });
      }
      setLoading(false);
    }
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };
  
  const filteredProjects = projects.filter(project => 
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectTopic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProjects = projects.length;
  const correctionProjectsCount = projects.filter(p => p.status === 'Correction').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  if (loading && projects.length === 0) { 
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full md:w-1/2" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-24 flex-1" />
          <Skeleton className="h-24 flex-1" />
          <Skeleton className="h-24 flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Project Management</h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingProject(null);}}>
          <DialogTrigger asChild>
            <Button onClick={openAddForm}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject ? handleEditProject : handleAddProject}
              onCancel={() => { setIsFormOpen(false); setEditingProject(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Input 
        type="text"
        placeholder="Search projects by client or topic..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <ProjectStatBox 
          title="Total Projects" 
          value={totalProjects} 
          icon={<Users className="h-5 w-5 text-blue-500" />}
          bgColor="bg-blue-500/5"
          textColor="text-blue-600"
        />
        <ProjectStatBox 
          title="Needs Correction" 
          value={correctionProjectsCount} 
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          bgColor="bg-red-500/5"
          textColor="text-red-600"
        />
        <ProjectStatBox 
          title="Completed" 
          value={completedProjectsCount} 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          bgColor="bg-green-500/5"
          textColor="text-green-600"
        />
      </div>

      {filteredProjects.length === 0 && !loading ? (
         <p className="text-muted-foreground text-center py-8">
          {searchTerm ? 'No projects match your search.' : 'No projects yet. Click "Add New Project" to get started!'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditForm}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}

