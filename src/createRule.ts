import type MarkdownIt from "markdown-it";

import type { Options } from ".";
import { fetchHtmlSync } from "./fetch";
import { parse } from "./parse";
import { renderToHtml } from "./render";
import { isGithubUrl } from "./utils";

export function createRule(options: Options | undefined, md: MarkdownIt): void {
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
    const rawHtml = fetchHtmlSync(c, options);
    const parsed = parse(rawHtml, c);
    const res = (options?.renderer ? options.renderer : renderToHtml)(parsed);
    return res;
  };
}
