import { z } from "zod";

export const CATEGORIES = [
  "Space",
  "Animals",
  "Human Body",
  "History",
  "Geography",
  "Science",
  "Technology",
  "Food",
  "Language",
  "Ocean",
  "Music",
  "Sports",
  "Art",
  "Nature",
  "Math",
  "Psychology",
  "Culture",
  "Medicine",
  "Economics",
  "Architecture",
  "Astronomy",
  "Chemistry",
  "Climate & Weather",
  "Engineering",
  "Environment",
  "Geology",
  "Inventions",
  "Law & Government",
  "Literature",
  "Mythology",
  "Philosophy",
  "Photography & Film",
  "Religion",
  "Transportation",
  "World Records",
  "Archaeology",
  "Biology",
  "Energy",
  "Communication",
  "Agriculture",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const FactSchema = z.object({
  id: z.string(),
  category: z.enum(CATEGORIES),
  text: z.string(),
  source: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
  tags: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
  publishedAt: z.string().datetime(),
});

export type Fact = z.infer<typeof FactSchema>;
