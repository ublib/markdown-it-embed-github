import type { GitHubSourceDescriptor } from "./parse";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";

import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);

export function renderToHtml(descriptor: GitHubSourceDescriptor): string {
  const { filename, lang, commitHashOrBranch, lines, codeLines } = descriptor;
  const [org, repo, ...rest] = filename.split("/");

  const commitLink = `https://github.com/${org}/${repo}/commit/${commitHashOrBranch}`;

  let codeLink = `https://github.com/${org}/${repo}/blob/${commitHashOrBranch}/${rest.join(
    "/",
  )}`;
  if (lines) {
    codeLink += `#L${lines.start + 1}`;
    if (lines.end && lines.end !== lines.start) {
      codeLink += `-L${lines.end}`;
    }
  }

  const c = lines
    ? codeLines.slice(lines.start, lines.end).join("\n")
    : codeLines.join("\n");

  const code = hljs.highlight(c, {
    language: lang,
  }).value.split("\n").map((line, i) => {
    return `<span class="line-number">${i + 1 + (lines?.start ?? 0)}</span>${line}`;
  });

  return `
<div class="github-source">
  <div class="meta">
    <img src="https://cdn0.iconfinder.com/data/icons/shift-logotypes/32/Github-512.png" width="25px" style="display: inline; margin-right: 0.5rem; vertical-align: middle;">
    <span class="file-info">
      <a href="${codeLink}" target="_blank"
        ><span class="filename">${filename}</span></a
      ><span class="line-info"
        >Lines ${lines?.start ? lines.start + 1 : 1} to ${lines?.end ?? code.length} in <a href="${commitLink}" target="_blank"><span class="commit">${commitHashOrBranch.slice(0, 10)}</span></a></span>
    </span>
  </div>
  <pre class="code">${code.join("\n")}</pre>
</div>`;
}
