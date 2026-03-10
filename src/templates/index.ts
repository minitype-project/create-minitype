import { conferencePaper } from "./conference-paper.js";
import { cv } from "./cv.js";
import { invoice } from "./invoice.js";
import { report } from "./report.js";
import { technicalBook } from "./technical-book.js";
import { thesis } from "./thesis.js";
import type { Template } from "./types.js";

export const TEMPLATES: Record<string, Template> = {
  report,
  "technical-book": technicalBook,
  "conference-paper": conferencePaper,
  thesis,
  invoice,
  cv,
};

export type { Template };
