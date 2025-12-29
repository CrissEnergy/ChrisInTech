'use client';

import { GraduationCap } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Inquiry'}
    </Button>
  );
}

export function CareerClasses() {
  const initialState: ClassInquiryState = { message: '', success: false };
  const [state, formAction] = useActionState(submitClassInquiry, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Uh oh!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });

      if (state.success) {
        formRef.current?.reset();
        // Close the dialog on successful submission
        closeButtonRef.current?.click();
      }
    }
  }, [state, toast]);

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
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">Join Classes</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Join a Class</DialogTitle>
                  <DialogDescription>
                    Submit your details below to express your interest. We'll get back to you with the next steps!
                  </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  {state.errors?.name && (
                     <p className="text-sm text-destructive col-start-2 col-span-3">{state.errors.name.join(', ')}</p>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" className="col-span-3" required />
                  </div>
                   {state.errors?.email && (
                     <p className="text-sm text-destructive col-start-2 col-span-3">{state.errors.email.join(', ')}</p>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="secondary" ref={closeButtonRef}>Cancel</Button>
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
