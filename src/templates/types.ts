export interface TemplateVars {
  projectName: string;
  author: string;
  minitypePath: string;
  year: string;
}

export interface Template {
  displayName: string;
  description: string;
  files: (vars: TemplateVars) => Record<string, string | Buffer>;
}
