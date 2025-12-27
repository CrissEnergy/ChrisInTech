'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  useFirebase,
  useCollection,
  useMemoFirebase
} from '@/firebase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/mock-data';
import { getStorage } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const technologyCategories = [
    {
      title: 'Frontend',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Next.js'],
    },
    {
      title: 'Backend',
      skills: ['Node.js', 'Python', 'PHP', 'SQL'],
    },
    {
      title: 'Tools & Others',
      skills: ['Git', 'Webpack', 'Figma', 'Adobe XD', 'REST APIs', 'WordPress', 'Supabase', 'Firebase'],
    },
    {
      title: 'Data Analysis',
      skills: ['Python', 'R', 'Stata', 'Spss', 'EViews'],
    },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { firestore, auth, user, isUserLoading, firebaseApp } = useFirebase();
  const storage = firebaseApp ? getStorage(firebaseApp) : null;

  const projectsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'projects') : null),
    [firestore]
  );
  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsCollection);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (currentProject) {
      setSelectedTechnologies(currentProject.technologies || []);
      setImagePreview(currentProject.imageUrl || null);
    } else {
      setSelectedTechnologies([]);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [currentProject, isDialogOpen]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/admin/login');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTechChange = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !storage || isSubmitting) return;

    setIsSubmitting(true);
    let imageUrl = currentProject?.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`;

    try {
        if (imageFile) {
            const imageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        const formData = new FormData(e.currentTarget);
        const projectData = {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          technologies: selectedTechnologies,
          liveLink: formData.get('liveLink') as string,
          githubLink: formData.get('githubLink') as string,
          imageUrl: imageUrl,
        };

        if (currentProject) {
          // Update project
          const projectRef = doc(firestore, 'projects', currentProject.id);
          updateDoc(projectRef, projectData)
            .then(() => {
              toast({ title: 'Project Updated', description: `${projectData.title} has been successfully updated.` });
            })
            .catch(error => {
              errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: projectRef.path,
                  operation: 'update',
                  requestResourceData: projectData,
                })
              )
            });
        } else {
          // Add new project
          const projectsColRef = collection(firestore, 'projects');
          addDoc(projectsColRef, projectData)
            .then(() => {
              toast({ title: 'Project Added', description: `${projectData.title} has been successfully added.` });
            })
            .catch(error => {
              errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: projectsColRef.path,
                  operation: 'create',
                  requestResourceData: projectData,
                })
              )
            });
        }

        setIsDialogOpen(false);
        setCurrentProject(null);
    } catch (error) {
        console.error("Error submitting form:", error);
        toast({ title: 'Submission Error', description: 'Could not save the project. Please try again.', variant: 'destructive'});
    } finally {
        setIsSubmitting(false);
    }
  };

  const openAddDialog = () => {
    setCurrentProject(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = () => {
    if (projectToDelete && firestore) {
      const projectRef = doc(firestore, 'projects', projectToDelete.id);
      deleteDoc(projectRef)
        .then(() => {
          toast({ title: 'Project Deleted', description: `${projectToDelete.title} has been removed.`, variant: 'destructive' });
          setIsDeleteDialogOpen(false);
          setProjectToDelete(null);
        })
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: projectRef.path,
                  operation: 'delete',
                })
            );
        });
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleLogout} variant="outline">Logout</Button>
          <Button size="sm" className="h-8 gap-1" onClick={openAddDialog}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Project
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Manage your projects. Add, edit, or delete projects from your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingProjects ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : projects?.length ? (
                projects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={project.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={project.imageUrl || '/placeholder.svg'}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map(tech => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">
                      {project.description}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(project)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(project)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No projects found. Add one to get started!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setCurrentProject(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
           <DialogHeader>
              <DialogTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              <DialogDescription>
                {currentProject ? 'Update the details of your project.' : 'Fill in the details for your new project.'}
              </DialogDescription>
            </DialogHeader>
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-6 -mr-6">
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" defaultValue={currentProject?.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={currentProject?.description} required />
                </div>
                <div className="space-y-4">
                    <Label>Technologies</Label>
                    <div className="space-y-4">
                      {technologyCategories.map((category) => (
                        <div key={category.title}>
                          <h4 className="mb-2 font-medium text-sm text-muted-foreground">{category.title}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {category.skills.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tech-${skill}`}
                                  checked={selectedTechnologies.includes(skill)}
                                  onCheckedChange={() => handleTechChange(skill)}
                                />
                                <Label htmlFor={`tech-${skill}`} className="text-sm font-normal">
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Image</Label>
                  <div className="flex items-center gap-4">
                      {imagePreview && <Image src={imagePreview} alt="Project preview" width={80} height={80} className="rounded-md object-cover" />}
                      <Input id="image" name="image" type="file" onChange={handleImageChange} accept="image/*" className="w-full" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="liveLink">Live URL</Label>
                      <Input id="liveLink" name="liveLink" defaultValue={currentProject?.liveLink} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="githubLink">GitHub URL</Label>
                      <Input id="githubLink" name="githubLink" defaultValue={currentProject?.githubLink} />
                  </div>
                </div>

              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t mt-auto">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (currentProject ? 'Save Changes' : 'Add Project')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project
              <span className="font-semibold"> {projectToDelete?.title}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
