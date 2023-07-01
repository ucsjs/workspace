import * as fs from "fs";
import * as path from "path";
import * as MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { glob } from "glob";

class GenerateDocs {
    async convertMarkdownToHTML(){
        const markdown = MarkdownIt({
            html: true,
            linkify: true,
            breaks: true,
            typographer: true,
            highlight: (str, lang) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return (
                        '<pre><code class="hljs">' +
                        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                        "</code></pre>"
                        );
                    } catch (__) {}
                }

                return (`<pre><code class="hljs">${markdown.utils.escapeHtml(str)}</code></pre>`);
            }
        });
    
        const docsFiles = await glob(['./docs/**/*.md', './docs/*.md']);
    
        for(let file of docsFiles){
            const content = await fs.readFileSync(path.resolve(file), "utf8");
            let rendered = await markdown.render(content);
            rendered = this.addAnchorLinks(rendered);
            await fs.writeFileSync(file.replace(".md", ".html"), rendered, "utf8");
        } 
    }

    async generateIndex(){
        const docsFiles = await glob(['./docs/**/*.html', './docs/*.html']);
        let index = {};

        for(let file of docsFiles){
            const pathFile = encodeURIComponent(file.replace(process.cwd(), "").replace("docs/", "").replace(/\\/g, "/"));
            index[this.convertLinkToCleanURL(pathFile)] = path.resolve(file);
        }

        await fs.writeFileSync("docs/index.json", JSON.stringify(index, null, 4));
    }

    convertLinkToCleanURL(link: string): string {
        const decodedLink = decodeURIComponent(link);
        const pathParts = decodedLink.split('/');
    
        const cleanPathParts = pathParts.map(part => {
            const cleanPart = part
            .replace(/\d+\s*-\s*/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();

            return cleanPart;
        });
    
        const cleanURL = cleanPathParts.join('-');
        return cleanURL;
    }

    addAnchorLinks(html: string): string {
        const headerTags = ['h1', 'h2', 'h3'];
        const modifiedHtml = headerTags.reduce((html, tag) => {
        const regex = new RegExp(`(<${tag}[^>]*>)(.*?)(<\/${tag}>)`, 'gi');
        const matches = html.match(regex);
    
        if (matches) {
            matches.forEach(match => {
                const text = match.replace(/<\/?[^>]+(>|$)/g, '');
                const id = text.toLowerCase().replace(/\s/g, '-').replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                const anchorLink = `<a id="${id}"></a>`;
                html = html.replace(match, `${match}${anchorLink}`);
            });
        }
    
        return html;
        }, html);
    
        return modifiedHtml;
    }
}

(async () => {
    let generator = new GenerateDocs();
    await generator.convertMarkdownToHTML();
    await generator.generateIndex();
})();