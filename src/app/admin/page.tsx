'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, Trash2, Download } from 'lucide-react';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import {
  useFirebase,
  useCollection,
  useMemoFirebase,
  useDoc
} from '@/firebase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/mock-data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { MultiSelect, type Option } from '@/components/ui/multi-select';
import { ScrollArea } from '@/components/ui/scroll-area';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

const technologyOptions: Option[] = [
  { value: 'HTML5', label: 'HTML5' },
  { value: 'CSS3', label: 'CSS3' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'React', label: 'React' },
  { value: 'Vue.js', label: 'Vue.js' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Python', label: 'Python' },
  { value: 'PHP', label: 'PHP' },
  { value: 'SQL', label: 'SQL' },
  { value: 'Git', label: 'Git' },
  { value: 'Webpack', label: 'Webpack' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Adobe XD', label: 'Adobe XD' },
  { value: 'REST APIs', label: 'REST APIs' },
  { value: 'WordPress', label: 'WordPress' },
  { value: 'Supabase', label: 'Supabase' },
  { value: 'Firebase', label: 'Firebase' },
  { value: 'R', label: 'R' },
  { value: 'Stata', label: 'Stata' },
  { value: 'Spss', label: 'Spss' },
  { value: 'EViews', label: 'EViews' },
];

type SiteProfile = {
  aboutImageUrl: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

type ClassInquiry = {
  id: string;
  name: string;
  email: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { firestore, auth, user, isUserLoading } = useFirebase();

  const projectsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'projects') : null),
    [firestore]
  );
  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsCollection);

  const contactMessagesCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'contact_messages') : null),
    [firestore, user]
  );
  const { data: messages, isLoading: isLoadingMessages } = useCollection<ContactMessage>(contactMessagesCollection);

  const classInquiriesCollection = useMemoFirebase(
    () => (firestore && user ? collection(firestore, 'class_inquiries') : null),
    [firestore, user]
  );
  const { data: inquiries, isLoading: isLoadingInquiries } = useCollection<ClassInquiry>(classInquiriesCollection);


  const profileSettingsDoc = useMemoFirebase(
    () => (firestore ? doc(firestore, 'settings', 'profile') : null),
    [firestore]
  );
  const { data: profileSettings, isLoading: isLoadingProfile } = useDoc<SiteProfile>(profileSettingsDoc);
  
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleteMessageDialogOpen, setIsDeleteMessageDialogOpen] = useState(false);

  const [inquiryToDelete, setInquiryToDelete] = useState<ClassInquiry | null>(null);
  const [isDeleteInquiryDialogOpen, setIsDeleteInquiryDialogOpen] = useState(false);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (currentProject) {
      setSelectedTechnologies(currentProject.technologies || []);
    } else {
      setSelectedTechnologies([]);
    }
  }, [currentProject, isDialogOpen]);

  useEffect(() => {
    if (profileSettings?.aboutImageUrl) {
      setProfileImageUrl(profileSettings.aboutImageUrl);
    }
  }, [profileSettings]);
  
  const formatDate = (timestamp: ContactMessage['timestamp'] | ClassInquiry['timestamp']) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const handleExportExcel = () => {
    if (!inquiries || inquiries.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'There are no class inquiries to export.',
        variant: 'destructive',
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      inquiries.map(inquiry => ({
        Name: inquiry.name,
        Email: inquiry.email,
        Date: formatDate(inquiry.timestamp),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Inquiries');
    XLSX.writeFile(workbook, 'ClassInquiries.xlsx');
  };

  const handleExportPdf = () => {
     if (!inquiries || inquiries.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'There are no class inquiries to export.',
        variant: 'destructive',
      });
      return;
    }
    const doc = new jsPDF() as jsPDFWithAutoTable;
    doc.autoTable({
      head: [['Name', 'Email', 'Date']],
      body: inquiries.map(inquiry => [inquiry.name, inquiry.email, formatDate(inquiry.timestamp)]),
    });
    doc.save('ClassInquiries.pdf');
  };

  const handleProfileImageSave = async () => {
    if (!profileImageUrl || !firestore) return;

    setIsSavingProfile(true);
    const profileDocRef = doc(firestore, 'settings', 'profile');
    
    setDoc(profileDocRef, { aboutImageUrl: profileImageUrl }, { merge: true })
      .then(() => {
        toast({
          title: 'Profile Image Updated',
          description: 'Your new profile image URL has been saved.',
        });
      })
      .catch((error) => {
        console.error("Error saving profile image URL:", error);
        const permissionError = new FirestorePermissionError({
          path: profileDocRef.path,
          operation: 'update',
          requestResourceData: { aboutImageUrl: profileImageUrl },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: 'Save Error',
          description: error.message || 'Could not save the profile image URL.',
          variant: 'destructive'
        });
      })
      .finally(() => {
        setIsSavingProfile(false);
      });
  };

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
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || isSubmitting) return;

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const liveLink = formData.get('liveLink') as string;
    const imageUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(liveLink)}?w=400&h=300`;

    try {
        const projectData = {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          technologies: selectedTechnologies,
          liveLink: liveLink,
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
  
  const openDeleteMessageDialog = (message: ContactMessage) => {
    setMessageToDelete(message);
    setIsDeleteMessageDialogOpen(true);
  };
  
  const handleDeleteMessage = () => {
    if (messageToDelete && firestore) {
      const messageRef = doc(firestore, 'contact_messages', messageToDelete.id);
      deleteDoc(messageRef)
        .then(() => {
          toast({ title: 'Message Deleted', description: 'The message has been removed.', variant: 'destructive' });
          setIsDeleteMessageDialogOpen(false);
          setMessageToDelete(null);
        })
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: messageRef.path,
              operation: 'delete',
            })
          );
        });
    }
  };

  const openDeleteInquiryDialog = (inquiry: ClassInquiry) => {
    setInquiryToDelete(inquiry);
    setIsDeleteInquiryDialogOpen(true);
  };

  const handleDeleteInquiry = () => {
    if (inquiryToDelete && firestore) {
      const inquiryRef = doc(firestore, 'class_inquiries', inquiryToDelete.id);
      deleteDoc(inquiryRef)
        .then(() => {
          toast({ title: 'Inquiry Deleted', description: 'The inquiry has been removed.', variant: 'destructive' });
          setIsDeleteInquiryDialogOpen(false);
          setInquiryToDelete(null);
        })
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: inquiryRef.path,
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your public profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-image-url">Profile Image URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="profile-image-url"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={isSavingProfile}
                  />
                  <Button onClick={handleProfileImageSave} disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Image</Label>
                 <div
                  className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 text-center"
                >
                  {isLoadingProfile ? (
                      <Skeleton className="h-40 w-40 rounded-full" />
                  ) : profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt="Profile preview"
                      width={160}
                      height={160}
                      className="h-40 w-40 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground h-40 w-40 justify-center">
                      <span>No Image URL</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-5">
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
      </div>

       <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>
              View messages submitted through your contact form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingMessages ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : messages?.length ? (
                    messages.map(message => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium whitespace-nowrap">{formatDate(message.timestamp)}</TableCell>
                        <TableCell>{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>{message.phone || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteMessageDialog(message)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete message</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No messages received yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Class Inquiries</CardTitle>
              <CardDescription>
                View inquiries for your web development classes.
              </CardDescription>
            </div>
             <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportPdf}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingInquiries ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : inquiries?.length ? (
                    inquiries.map(inquiry => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium whitespace-nowrap">{formatDate(inquiry.timestamp)}</TableCell>
                        <TableCell>{inquiry.name}</TableCell>
                        <TableCell>{inquiry.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteInquiryDialog(inquiry)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete inquiry</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No class inquiries received yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>


      {/* Add/Edit Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setCurrentProject(null); }}>
        <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
           <DialogHeader>
              <DialogTitle>{currentProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              <DialogDescription>
                {currentProject ? 'Update the details of your project.' : 'Fill in the details for your new project.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-6">
              <form id="project-form" onSubmit={handleFormSubmit} className="grid gap-6 pl-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" defaultValue={currentProject?.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={currentProject?.description} required />
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <MultiSelect
                    options={technologyOptions}
                    onValueChange={setSelectedTechnologies}
                    defaultValue={selectedTechnologies}
                    placeholder="Select technologies"
                    className="w-full"
                  />
                </div>
                 <div className="space-y-2">
                      <Label htmlFor="liveLink">Live URL</Label>
                      <Input id="liveLink" name="liveLink" defaultValue={currentProject?.liveLink} placeholder="https://example.com" required/>
                  </div>
              </form>
            </div>
            <DialogFooter className="pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" form="project-form" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (currentProject ? 'Save Changes' : 'Add Project')}
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Project Confirmation Dialog */}
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

      {/* Delete Message Confirmation Dialog */}
      <Dialog open={isDeleteMessageDialogOpen} onOpenChange={setIsDeleteMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMessage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Inquiry Confirmation Dialog */}
      <Dialog open={isDeleteInquiryDialogOpen} onOpenChange={setIsDeleteInquiryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inquiry?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this inquiry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteInquiryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteInquiry}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
