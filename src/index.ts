import { type ProjectConfig, ProjectCreator } from "./create-project.js";
import { resolveTemplate } from "./template-resolver.js";

export type { CreateProjectResult, ProjectConfig } from "./create-project.js";
export { ProjectCreator } from "./create-project.js";
export { resolveTemplate } from "./template-resolver.js";
export type {
  Template,
  TemplateOptions,
  TemplatePrompt,
  TemplateVars,
} from "./templates/index.js";
export { templates } from "./templates/index.js";

/**
 * プロジェクト作成のオプション．
 */
export type CreateProjectOptions = Omit<ProjectConfig, "template"> & {
  /**
   * テンプレート ID．
   * 組み込みテンプレート名，git URL，ローカルパスを指定できる．
   */
  templateId: string;
};

/**
 * minitype プロジェクトを作成する．
 */
export const createProject = async (
  options: CreateProjectOptions,
): ReturnType<ProjectCreator["create"]> => {
  const template = await resolveTemplate(options.templateId);
  return new ProjectCreator({ ...options, template }, false).create();
};
