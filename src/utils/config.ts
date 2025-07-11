import { z } from 'zod';

const configSchema = z.object({
  VITE_API_URL: z.string().url('VITE_API_URL must be a valid URL').default('http://localhost:4000/api'),
});

let config: z.infer<typeof configSchema>;

try {
  config = configSchema.parse(import.meta.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment configuration:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set correctly.');
    throw error;
  }
  throw error;
}

export { config };

export const {
  VITE_API_URL,
} = config;

export const API_URL = VITE_API_URL;
