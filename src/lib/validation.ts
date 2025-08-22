import { z } from 'zod';
import { validatePassword } from './password-validation';

const passwordValidator = z.string().refine(
  (password: string) => {
    const result = validatePassword(password);
    return result.isValid;
  },
  {
    message: 'Password does not meet security requirements',
  }
);
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase(),
  
  password: passwordValidator,
});

export const signinSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase(),
  
  password: z.string()
    .min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must not exceed 200 characters'),
  
  description: z.string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  
  price: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price must not exceed 999,999.99'),
  
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock must not exceed 999,999'),
  
  sku: z.string()
    .max(50, 'SKU must not exceed 50 characters')
    .regex(/^[A-Z0-9-_]+$/, 'SKU can only contain uppercase letters, numbers, hyphens, and underscores')
    .optional(),
  
  brand: z.string()
    .max(100, 'Brand must not exceed 100 characters')
    .optional(),
  
  categoryId: z.number()
    .int('Category ID must be a whole number')
    .positive('Category ID must be positive')
    .optional(),
  
  discountPrice: z.number()
    .positive('Discount price must be positive')
    .optional(),
});

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string(),
    size: z.number().max(5 * 1024 * 1024, 'File size must not exceed 5MB'),
    type: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], {
      message: 'Only JPEG, PNG, and WebP images are allowed',
    }),
  }),
});

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeSql(input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}
