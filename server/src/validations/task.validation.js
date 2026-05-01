import { z } from "zod";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const emailSchema = z.string().email();

const assigneeIdentifierSchema = z
    .string()
    .trim()
    .refine(
        (value) => emailSchema.safeParse(value).success || objectIdPattern.test(value),
        "Assignee must be a valid email or user ID"
    );

export const createTaskSchema = z.object({
    title: z.string().min(1, "Task title is required").trim(),
    description: z.string().trim().optional(),
    status: z.enum(['To Do', 'In Progress', 'Completed']).optional(),

    dueDate: z.coerce.date({
        required_error: "Due date is required",
        invalid_type_error: "That's not a date!",
    }),
    project: z.string().regex(objectIdPattern, "Invalid Project ID"),
    assignedTo: assigneeIdentifierSchema.optional(),
});


export const updateTaskSchema = createTaskSchema.partial();


export const updateTaskStatusSchema = z.object({
    status: z.enum(['To Do', 'In Progress', 'Completed'])
});
