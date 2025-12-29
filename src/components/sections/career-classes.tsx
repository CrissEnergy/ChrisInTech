'use client';

import { GraduationCap, Info } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitClassInquiry, type ClassInquiryState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

const ghanaRegions = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern",
  "Greater Accra", "North East", "Northern", "Oti", "Savannah",
  "Upper East", "Upper West", "Volta", "Western", "Western North"
];

const startDates = [
  "July 2024", "August 2024", "September 2024", "October 2024"
];

const howHeardOptions = [
  "Social Media", "Friend/Referral", "Google Search", "Advertisement", "Other"
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? 'Submitting Registration...' : 'Submit Registration'}
    </Button>
  );
}

export function CareerClasses() {
  const initialState: ClassInquiryState = { message: '', success: false, errors: {} };
  const [state, formAction] = useActionState(submitClassInquiry, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        title: 'Validation Error',
        description: state.message,
        variant: 'destructive',
      });
    } else if (state.message && state.success) {
       toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
      });
      formRef.current?.reset();
      setIsDialogOpen(false);
    }
  }, [state, toast]);
  
  const handleClearForm = () => {
    formRef.current?.reset();
    // This is a bit of a hack to reset the action state.
    // A more robust solution might involve a key on the form or a dedicated state reset action.
    (formAction as any)(); 
  };


  return (
    <section id="classes" className="w-full py-20 lg:py-32 bg-slate-900/20">
      <AnimateOnScroll className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            Career Online Classes
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-foreground/80 md:text-xl">
            In-depth web development training and personalized mentoring to help you launch or advance your career in tech.
          </p>
          <div className="mt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Join Classes</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Class Registration</DialogTitle>
                  <DialogDescription>
                    Complete the form below to register your interest. Fields marked with <span className="text-destructive">*</span> are required.
                  </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction}>
                  <ScrollArea className="h-[65vh] pr-6">
                    <div className="space-y-8 py-4">
                      {/* Course Fee Display */}
                      <div className="rounded-lg border border-primary/50 bg-primary/10 p-4 text-center">
                        <p className="font-bold text-lg text-primary">Course Fee: GHS 300</p>
                        <p className="text-sm text-foreground/80 mt-1">
                          <Info className="inline h-4 w-4 mr-1" />
                          Payment is made via Mobile Money in Ghana. Details will be sent upon registration.
                        </p>
                      </div>

                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                            <Input id="firstName" name="firstName" />
                            {state.errors?.firstName && <p className="text-sm text-destructive">{state.errors.firstName.join(', ')}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                            <Input id="lastName" name="lastName" />
                            {state.errors?.lastName && <p className="text-sm text-destructive">{state.errors.lastName.join(', ')}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                            <Input id="email" name="email" type="email" />
                            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email.join(', ')}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number (+233) <span className="text-destructive">*</span></Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+233541234567" />
                             {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone.join(', ')}</p>}
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="city">City/Town <span className="text-destructive">*</span></Label>
                            <Input id="city" name="city" />
                            {state.errors?.city && <p className="text-sm text-destructive">{state.errors.city.join(', ')}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="region">Region <span className="text-destructive">*</span></Label>
                            <Select name="region">
                              <SelectTrigger><SelectValue placeholder="Select your region" /></SelectTrigger>
                              <SelectContent>
                                {ghanaRegions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            {state.errors?.region && <p className="text-sm text-destructive">{state.errors.region.join(', ')}</p>}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />

                      {/* Course Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Course Selection</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label>Course Interest <span className="text-destructive">*</span></Label>
                                <RadioGroup name="course">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="web-fundamentals" id="c1" /><Label htmlFor="c1">Web Development Fundamentals</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="wordpress-dev" id="c2" /><Label htmlFor="c2">WordPress Development</Label></div>
                                </RadioGroup>
                                {state.errors?.course && <p className="text-sm text-destructive">{state.errors.course.join(', ')}</p>}
                            </div>
                             <div className="space-y-3">
                                <Label>Preferred Schedule <span className="text-destructive">*</span></Label>
                                <RadioGroup name="schedule">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="weekend-mornings" id="s1" /><Label htmlFor="s1">Weekend Mornings (Sat 10:00am)</Label></div>
                                </RadioGroup>
                                {state.errors?.schedule && <p className="text-sm text-destructive">{state.errors.schedule.join(', ')}</p>}
                            </div>
                        </div>
                         <div className="space-y-2 max-w-sm">
                            <Label htmlFor="startDate">Preferred Start Date <span className="text-destructive">*</span></Label>
                            <Select name="startDate">
                                <SelectTrigger><SelectValue placeholder="Select a month" /></SelectTrigger>
                                <SelectContent>
                                    {startDates.map(date => <SelectItem key={date} value={date}>{date}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {state.errors?.startDate && <p className="text-sm text-destructive">{state.errors.startDate.join(', ')}</p>}
                        </div>
                      </div>

                      <Separator />
                      
                      {/* Background & Experience */}
                      <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b pb-2">Background & Experience</h3>
                          <div className="space-y-3">
                              <Label>Current Skill Level <span className="text-destructive">*</span></Label>
                              <RadioGroup name="skillLevel" className="flex gap-4">
                                  <div className="flex items-center space-x-2"><RadioGroupItem value="beginner" id="sk1" /><Label htmlFor="sk1">Beginner</Label></div>
                                  <div className="flex items-center space-x-2"><RadioGroupItem value="intermediate" id="sk2" /><Label htmlFor="sk2">Intermediate</Label></div>
                                  <div className="flex items-center space-x-2"><RadioGroupItem value="advanced" id="sk3" /><Label htmlFor="sk3">Advanced</Label></div>
                              </RadioGroup>
                              {state.errors?.skillLevel && <p className="text-sm text-destructive">{state.errors.skillLevel.join(', ')}</p>}
                          </div>
                          <div className="space-y-3">
                            <Label>Primary Goals <span className="text-destructive">*</span></Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2"><Checkbox id="g1" name="goals" value="career" /><Label htmlFor="g1">Start a tech career</Label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="g2" name="goals" value="freelance" /><Label htmlFor="g2">Freelance work</Label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="g3" name="goals" value="business-site" /><Label htmlFor="g3">Build a business website</Label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="g4" name="goals" value="upgrade-skills" /><Label htmlFor="g4">Upgrade my skills</Label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="g5" name="goals" value="other" /><Label htmlFor="g5">Other</Label></div>
                            </div>
                             {state.errors?.goals && <p className="text-sm text-destructive">{state.errors.goals.join(', ')}</p>}
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="experience">Previous Experience (if any)</Label>
                              <Textarea id="experience" name="experience" placeholder="e.g., online courses, personal projects, relevant job roles..."/>
                          </div>
                      </div>
                      
                      <Separator />

                      {/* Payment & Additional Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Payment & Enrollment</h3>
                         <div className="space-y-3">
                            <Label>Payment Method <span className="text-destructive">*</span></Label>
                             <RadioGroup name="paymentMethod">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="mobile-money" id="p1" /><Label htmlFor="p1">Mobile Money (MTN, Vodafone, AT)</Label></div>
                            </RadioGroup>
                             {state.errors?.paymentMethod && <p className="text-sm text-destructive">{state.errors.paymentMethod.join(', ')}</p>}
                         </div>
                          <div className="space-y-2 max-w-sm">
                            <Label htmlFor="howHeard">How did you hear about us?</Label>
                            <Select name="howHeard">
                                <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                                <SelectContent>
                                    {howHeardOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="questions">Any questions or specific topics you want to cover?</Label>
                           <Textarea id="questions" name="questions" placeholder="Ask anything..."/>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                           <Checkbox id="newsletter" name="newsletter" />
                           <Label htmlFor="newsletter">Opt-in for our newsletter for updates and tips.</Label>
                        </div>
                      </div>

                    </div>
                  </ScrollArea>
                  <DialogFooter className="pt-6 border-t mt-4 gap-2">
                    <Button type="button" variant="ghost" onClick={handleClearForm}>Clear Form</Button>
                    <div className="flex-grow"></div>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <SubmitButton />
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
