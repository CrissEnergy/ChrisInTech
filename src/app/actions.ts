'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

const classInquirySchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  phone: z.string().regex(/^\+233\d{9}$/, { message: "Phone number must be in +233XXXXXXXXX format." }),
  city: z.string().min(1, { message: "City/Town is required." }),
  region: z.string().min(1, { message: "Region is required." }),
  course: z.enum(['web-fundamentals', 'wordpress-dev'], { required_error: "Please select a course." }),
  schedule: z.enum(['weekend-mornings'], { required_error: "Please select a schedule." }),
  startDate: z.string().min(1, { message: "Please select a start date." }),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced'], { required_error: "Please select your skill level." }),
  goals: z.array(z.string()).min(1, { message: "Please select at least one goal." }),
  experience: z.string().optional(),
  paymentMethod: z.enum(['mobile-money'], { required_error: "Please select a payment method." }),
  howHeard: z.string().optional(),
  questions: z.string().optional(),
  newsletter: z.boolean().default(false),
});


export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    message?: string[];
  };
  success: boolean;
};

export type ClassInquiryState = {
  message: string;
  errors?: z.ZodError<z.infer<typeof classInquirySchema>>['flatten']['fieldErrors'];
  success: boolean;
}

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const { firestore } = initializeFirebase();
    const messagesCollection = collection(firestore, 'contact_messages');
    
    const dataToSave = {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
    };

    await addDoc(messagesCollection, dataToSave)
      .catch((error) => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: messagesCollection.path,
            operation: 'create',
            requestResourceData: dataToSave,
          })
        );
        // This throw is important to trigger the catch block below
        throw error;
      });

    return {
      message: 'Your message has been sent successfully!',
      success: true,
    };
  } catch (error) {
    console.error('Error saving message to Firestore:', error);
    return {
      message: 'There was an error sending your message. Please try again.',
      success: false,
    };
  }
}

export async function submitClassInquiry(
  prevState: ClassInquiryState,
  formData: FormData
): Promise<ClassInquiryState> {

  const validatedFields = classInquirySchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    region: formData.get('region'),
    course: formData.get('course'),
    schedule: formData.get('schedule'),
    startDate: formData.get('startDate'),
    skillLevel: formData.get('skillLevel'),
    goals: formData.getAll('goals'),
    experience: formData.get('experience'),
    paymentMethod: formData.get('paymentMethod'),
    howHeard: formData.get('howHeard'),
    questions: formData.get('questions'),
    newsletter: formData.get('newsletter') === 'on',
  });

  if (!validatedFields.success) {
    return {
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const { firestore } = initializeFirebase();
    const inquiriesCollection = collection(firestore, 'class_inquiries');
    
    const dataToSave = {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
    };

    await addDoc(inquiriesCollection, dataToSave)
    .catch((error) => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: inquiriesCollection.path,
          operation: 'create',
          requestResourceData: dataToSave,
        })
      );
      throw error;
    });

    return {
      message: 'Thank you for your interest! We will be in touch shortly.',
      success: true,
    };
  } catch (error) {
    console.error('Error saving class inquiry to Firestore:', error);
    return {
      message: 'There was an error submitting your inquiry. Please try again.',
      success: false,
    };
  }
}
