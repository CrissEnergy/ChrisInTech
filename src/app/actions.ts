'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
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
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      message: validatedFields.data.message,
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
