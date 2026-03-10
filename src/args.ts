export interface ParsedArgs {
  projectName?: string;
  template?: string;
  minitypePath?: string;
  author?: string;
  yes: boolean;
  help: boolean;
  listTemplates: boolean;
  jsonOutput: boolean;
}

export function parseArgs(argv: string[] = process.argv.slice(2)): ParsedArgs {
  const result: ParsedArgs = {
    yes: false,
    help: false,
    listTemplates: false,
    jsonOutput: false,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--yes" || arg === "-y") {
      result.yes = true;
    } else if (arg === "--list-templates") {
      result.listTemplates = true;
    } else if (arg === "--json") {
      result.jsonOutput = true;
      result.yes = true;
    } else if (arg === "--template" || arg === "-t") {
      result.template = argv[++i];
    } else if (arg === "--minitype-path") {
      result.minitypePath = argv[++i];
    } else if (arg === "--author" || arg === "-a") {
      result.author = argv[++i];
    } else if (!arg.startsWith("--")) {
      // Positional argument: project name
      if (!result.projectName) {
        result.projectName = arg;
      }
    }
    i++;
  }

  return result;
}
