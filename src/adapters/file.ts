import { z } from "zod";

export const uploadBodySchema = z.object({
	name: z.string().min(1),
	contentType: z.string().regex(/\w+\/[-+.\w]+/),
	file: z.instanceof(File),
});

export type UploadBodySchema = z.infer<typeof uploadBodySchema>;
