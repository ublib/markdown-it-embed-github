import type { PluginSimple } from "markdown-it";

import type { GitHubSourceDescriptor } from "./parse";
import { fetchHtmlSync } from "./fetch";
import { parse } from "./parse";
import { renderToHtml } from "./render";
import { isGithubUrl } from "./utils";

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
  md.block.ruler.before(
    "paragraph",
    "github_link_block",
    (state, startLine) => {
      const line = state
        .getLines(startLine, startLine + 1, state.blkIndent, false)
        .trim();

      if (!isGithubUrl(line)) {
        return false;
      }

      const token = state.push("github_link", "", 0);
      token.content = line;
      token.map = [startLine, startLine + 1];

      state.line = startLine + 1;

      return true;
    },
  );

  md.renderer.rules.github_link = (tokens, idx) => {
    const c = tokens[idx].content;
    const rawHtml = fetchHtmlSync(c);
    const parsed = parse(rawHtml, c);
    const res = (options?.renderer ? options.renderer : renderToHtml)(parsed);
    return res;
  };
};

export default previewGitHubSource;
