import type { PluginSimple } from "markdown-it";

import type { GitHubSourceDescriptor } from "./parse";
import { createRule } from "./createRule";

export interface Options {
  renderer?: (descriptor: GitHubSourceDescriptor) => string;

  /** @default ["javascript", "typescript"] */
  languages?: string[];
}

type Plugin = (options?: Options) => PluginSimple;

/**
 * @examples
 *
 * basic usage:
 * ```ts
 * import markdownIt from "markdown-it";
 * markdownIt.use(previewGitHubSource());
 * ```
 *
 * with options:
 * ```ts
 * import markdownIt from "markdown-it";
 * markdownIt.use(
 *   previewGitHubSource({
 *     renderer: (descriptor) => `<div>${descriptor.filename}</div>`
 *   })
 * );
 * ```
 */
const previewGitHubSource: Plugin = options => (md) => {
  createRule(options, md);
};

export default previewGitHubSource;
