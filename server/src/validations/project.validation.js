import { z } from "zod";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const emailSchema = z.string().email();

const teamMemberIdentifierSchema = z
    .string()
    .trim()
    .refine(
        (value) => emailSchema.safeParse(value).success || objectIdPattern.test(value),
        "Team member must be a valid email or user ID"
    );

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required").trim(),
    description: z.string().trim().optional(),
    teamMembers: z.array(teamMemberIdentifierSchema).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
