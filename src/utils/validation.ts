import { z } from 'zod';

export const nodeSchema = z.object({
  type: z.enum(['user', 'habit']),
  name: z.string().min(3).max(20),
  userData: z.object({
    username: z.string().min(3).max(50),//add more fields as need with their validations
  }).optional(),
  habitType: z.enum(['reading', 'exercise', 'coding', 'other']).optional(),
  parentId: z.string().optional(),
});

export type NodeType = z.infer<typeof nodeSchema>;
