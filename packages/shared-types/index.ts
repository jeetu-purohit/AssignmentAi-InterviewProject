import { z } from "zod";

// 1. The payload sent from the React form to the API
export const AssignmentSchema = z.object({
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.array(z.string()).min(1, "Select at least one question type"),
  numQuestions: z.number().int().positive("Must be greater than 0"),
  totalMarks: z.number().int().positive("Must be greater than 0"),
  additionalInstructions: z.string().optional(),
});

// 2. The AI's generated output structure
export const QuestionSchema = z.object({
  text: z.string(),
  difficulty: z.enum(["Easy", "Moderate", "Hard"]),
  marks: z.number(),
});

export const SectionSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  questions: z.array(QuestionSchema),
});

export const QuestionPaperSchema = z.object({
  sections: z.array(SectionSchema),
});

// 3. Export TypeScript types automatically inferred from Zod
export type CreateAssignmentDTO = z.infer<typeof AssignmentSchema>;
export type QuestionPaper = z.infer<typeof QuestionPaperSchema>;