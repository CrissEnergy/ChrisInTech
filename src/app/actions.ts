'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

const classInquirySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
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
  errors?: {
    name?: string[];
    email?: string[];
  };
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
    
    await addDoc(messagesCollection, {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
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
    name: formData.get('name'),
    email: formData.get('email'),
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

    await addDoc(inquiriesCollection, {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
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
