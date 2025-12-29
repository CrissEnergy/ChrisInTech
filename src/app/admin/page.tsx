'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, Trash2, Download, Eye, ArrowUpDown } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

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
  logoImageUrl: string;
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  course: 'web-fundamentals' | 'wordpress-dev';
  schedule: 'weekend-mornings';
  startDate: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  experience?: string;
  paymentMethod: 'mobile-money';
  howHeard?: string;
  questions?: string;
  newsletter: boolean;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

type SortKey = keyof Omit<ContactMessage, 'id' | 'message' | 'phone' | 'timestamp'> | 'date';
type SortDirection = 'asc' | 'desc';


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
  const [logoImageUrl, setLogoImageUrl] = useState('');
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleteMessageDialogOpen, setIsDeleteMessageDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewMessageDialogOpen, setIsViewMessageDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');


  const [inquiryToDelete, setInquiryToDelete] = useState<ClassInquiry | null>(null);
  const [isDeleteInquiryDialogOpen, setIsDeleteInquiryDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ClassInquiry | null>(null);
  const [isViewInquiryDialogOpen, setIsViewInquiryDialogOpen] = useState(false);


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
    if (profileSettings) {
      setProfileImageUrl(profileSettings.aboutImageUrl || '');
      setLogoImageUrl(profileSettings.logoImageUrl || '');
    }
  }, [profileSettings]);
  
  const formatDate = (timestamp: ContactMessage['timestamp'] | ClassInquiry['timestamp']) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedMessages = useMemo(() => {
    if (!messages) return [];
    return [...messages].sort((a, b) => {
      let valA, valB;
      if (sortKey === 'date') {
        valA = a.timestamp?.seconds ?? 0;
        valB = b.timestamp?.seconds ?? 0;
      } else {
        valA = a[sortKey as keyof ContactMessage] as string | undefined ?? '';
        valB = b[sortKey as keyof ContactMessage] as string | undefined ?? '';
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [messages, sortKey, sortDirection]);

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
        'First Name': inquiry.firstName,
        'Last Name': inquiry.lastName,
        'Email': inquiry.email,
        'Phone': inquiry.phone,
        'City/Town': inquiry.city,
        'Region': inquiry.region,
        'Course': inquiry.course,
        'Schedule': inquiry.schedule,
        'Start Date': inquiry.startDate,
        'Skill Level': inquiry.skillLevel,
        'Goals': inquiry.goals.join(', '),
        'Experience': inquiry.experience,
        'Payment Method': inquiry.paymentMethod,
        'How Heard': inquiry.howHeard,
        'Questions': inquiry.questions,
        'Newsletter': inquiry.newsletter ? 'Yes' : 'No',
        'Date': formatDate(inquiry.timestamp),
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
    const tableData = inquiries.map(inquiry => [
      inquiry.firstName,
      inquiry.lastName,
      inquiry.email,
      inquiry.phone,
      inquiry.city,
      inquiry.region,
      inquiry.course,
      inquiry.schedule,
      inquiry.startDate,
      inquiry.skillLevel,
      inquiry.goals.join(', '),
      inquiry.experience || 'N/A',
      inquiry.paymentMethod,
      inquiry.howHeard || 'N/A',
      inquiry.questions || 'N/A',
      inquiry.newsletter ? 'Yes' : 'No',
      formatDate(inquiry.timestamp),
    ]);
    doc.autoTable({
      head: [['First Name', 'Last Name', 'Email', 'Phone', 'City', 'Region', 'Course', 'Schedule', 'Start Date', 'Skill', 'Goals', 'Experience', 'Payment', 'Source', 'Questions', 'Newsletter', 'Date']],
      body: tableData,
      styles: { fontSize: 5 },
      headStyles: { fontSize: 6 },
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
        const permissionError = new FirestorePermissionError({
          path: profileDocRef.path,
          operation: 'update',
          requestResourceData: { aboutImageUrl: profileImageUrl },
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSavingProfile(false);
      });
  };

  const handleLogoImageSave = async () => {
    if (!logoImageUrl || !firestore) return;

    setIsSavingLogo(true);
    const profileDocRef = doc(firestore, 'settings', 'profile');
    
    setDoc(profileDocRef, { logoImageUrl: logoImageUrl }, { merge: true })
      .then(() => {
        toast({
          title: 'Site Logo Updated',
          description: 'Your new site logo URL has been saved.',
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: profileDocRef.path,
          operation: 'update',
          requestResourceData: { logoImageUrl: logoImageUrl },
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSavingLogo(false);
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

    const projectData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      technologies: selectedTechnologies,
      liveLink: liveLink,
      imageUrl: imageUrl,
    };

    try {
      if (currentProject) {
        const projectRef = doc(firestore, 'projects', currentProject.id);
        await updateDoc(projectRef, projectData);
        toast({ title: 'Project Updated', description: `${projectData.title} has been successfully updated.` });
      } else {
        const projectsColRef = collection(firestore, 'projects');
        await addDoc(projectsColRef, projectData);
        toast({ title: 'Project Added', description: `${projectData.title} has been successfully added.` });
      }
    } catch(error) {
       const ref = currentProject ? doc(firestore, 'projects', currentProject.id) : collection(firestore, 'projects');
       errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: ref.path,
          operation: currentProject ? 'update' : 'create',
          requestResourceData: projectData,
        })
      );
    } finally {
      setIsDialogOpen(false);
      setCurrentProject(null);
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
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: projectRef.path,
                  operation: 'delete',
                })
            );
        })
        .finally(() => {
            setIsDeleteDialogOpen(false);
            setProjectToDelete(null);
        });
    }
  };
  
  const openDeleteMessageDialog = (message: ContactMessage) => {
    setMessageToDelete(message);
    setIsDeleteMessageDialogOpen(true);
  };

  const openViewMessageDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewMessageDialogOpen(true);
  };
  
  const handleDeleteMessage = () => {
    if (messageToDelete && firestore) {
      const messageRef = doc(firestore, 'contact_messages', messageToDelete.id);
      deleteDoc(messageRef)
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: messageRef.path,
              operation: 'delete',
            })
          );
        })
        .finally(() => {
          setIsDeleteMessageDialogOpen(false);
          setMessageToDelete(null);
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
        .catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: inquiryRef.path,
              operation: 'delete',
            })
          );
        })
        .finally(() => {
           setIsDeleteInquiryDialogOpen(false);
           setInquiryToDelete(null);
        });
    }
  };

  const openViewInquiryDialog = (inquiry: ClassInquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewInquiryDialogOpen(true);
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
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="relative ml-auto flex-1 md:grow-0">
         {user && (
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          )}
        </div>
      </header>
       <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Welcome, Admin!</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  This is your dashboard to manage your portfolio content. You can add new projects, view messages, and manage class inquiries.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                 <Button onClick={openAddDialog}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Project
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Projects</CardTitle>
                <CardDescription>You have {projects?.length || 0} projects on your portfolio.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
               <CardHeader className="pb-2">
                <CardTitle>Messages</CardTitle>
                <CardDescription>You have {messages?.length || 0} unread messages.</CardDescription>
              </CardHeader>
            </Card>
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
           <div className="grid gap-4 md:grid-cols-2">
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
                        <TableHead>#</TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('date')}>
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" onClick={() => handleSort('name')}>
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                           <Button variant="ghost" onClick={() => handleSort('email')}>
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingMessages ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell className="flex gap-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : sortedMessages.length ? (
                        sortedMessages.map((message, index) => (
                          <TableRow key={message.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium whitespace-nowrap">{formatDate(message.timestamp)}</TableCell>
                            <TableCell>{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openViewMessageDialog(message)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View Message</span>
                              </Button>
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
                          <TableCell colSpan={5} className="text-center">
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingInquiries ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell className="flex gap-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : inquiries?.length ? (
                        inquiries.map(inquiry => (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium whitespace-nowrap">{formatDate(inquiry.timestamp)}</TableCell>
                            <TableCell>{inquiry.firstName} {inquiry.lastName}</TableCell>
                            <TableCell>{inquiry.email}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openViewInquiryDialog(inquiry)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View Inquiry</span>
                              </Button>
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
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <Card>
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
            <Card>
              <CardHeader>
                  <CardTitle>Site Logo</CardTitle>
                  <CardDescription>Update your site logo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-image-url">Logo Image URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo-image-url"
                      value={logoImageUrl}
                      onChange={(e) => setLogoImageUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      disabled={isSavingLogo}
                    />
                    <Button onClick={handleLogoImageSave} disabled={isSavingLogo}>
                      {isSavingLogo ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 text-center bg-slate-900/50">
                    {isLoadingProfile ? (
                        <Skeleton className="h-20 w-40" />
                    ) : logoImageUrl ? (
                      <Image
                        src={logoImageUrl}
                        alt="Site logo preview"
                        width={150}
                        height={40}
                        className="mix-blend-screen object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground h-20 w-40 justify-center">
                        <span>No Logo URL</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
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

      {/* View Message Dialog */}
      <Dialog open={isViewMessageDialogOpen} onOpenChange={setIsViewMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Email: {selectedMessage?.email}
              {selectedMessage?.phone && ` | Phone: ${selectedMessage.phone}`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] pr-6">
            <p className="py-4">{selectedMessage?.message}</p>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewMessageDialogOpen(false)}>
              Close
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

      {/* View Inquiry Dialog */}
      <Dialog open={isViewInquiryDialogOpen} onOpenChange={setIsViewInquiryDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Class Inquiry Details</DialogTitle>
            <DialogDescription>
              Full details for the inquiry from {selectedInquiry?.firstName} {selectedInquiry?.lastName}.
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <ScrollArea className="max-h-[70vh] pr-6">
              <div className="space-y-6 text-sm">
                
                {/* Personal Info */}
                <div>
                  <h4 className="font-semibold text-base mb-2 text-primary">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><strong>Name:</strong> {selectedInquiry.firstName} {selectedInquiry.lastName}</div>
                    <div><strong>Email:</strong> {selectedInquiry.email}</div>
                    <div><strong>Phone:</strong> {selectedInquiry.phone}</div>
                    <div><strong>City/Town:</strong> {selectedInquiry.city}</div>
                    <div><strong>Region:</strong> {selectedInquiry.region}</div>
                  </div>
                </div>

                <Separator />

                {/* Course Selection */}
                <div>
                  <h4 className="font-semibold text-base mb-2 text-primary">Course Selection</h4>
                   <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><strong>Course:</strong> <span className="capitalize">{selectedInquiry.course.replace('-', ' ')}</span></div>
                    <div><strong>Schedule:</strong> Weekend Mornings</div>
                    <div><strong>Start Date:</strong> {selectedInquiry.startDate}</div>
                  </div>
                </div>

                <Separator />

                {/* Background */}
                <div>
                  <h4 className="font-semibold text-base mb-2 text-primary">Background & Experience</h4>
                  <div className="grid grid-cols-1 gap-y-2">
                    <div><strong>Skill Level:</strong> <span className="capitalize">{selectedInquiry.skillLevel}</span></div>
                    <div><strong>Goals:</strong> {selectedInquiry.goals.join(', ')}</div>
                    {selectedInquiry.experience && <div><strong>Experience:</strong> <p className="text-muted-foreground pl-2">{selectedInquiry.experience}</p></div>}
                  </div>
                </div>

                <Separator />
                
                {/* Payment & Additional Info */}
                <div>
                  <h4 className="font-semibold text-base mb-2 text-primary">Payment & Additional Info</h4>
                  <div className="grid grid-cols-1 gap-y-2">
                    <div><strong>Payment Method:</strong> Mobile Money</div>
                    {selectedInquiry.howHeard && <div><strong>How Heard:</strong> {selectedInquiry.howHeard}</div>}
                    {selectedInquiry.questions && <div><strong>Questions:</strong> <p className="text-muted-foreground pl-2">{selectedInquiry.questions}</p></div>}
                    <div><strong>Newsletter:</strong> {selectedInquiry.newsletter ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewInquiryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    

    