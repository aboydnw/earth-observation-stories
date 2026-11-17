Beyond Tree Cover · editorial prototype

BUILD COMPLETE — NEXT STEPS

This is a local publication, not a live website yet. Review all included data and images before sharing; publish only what you have permission to share and preserve attribution and license notices. Upload this publication only, never your editable project folder or backups.

1. Choose hosting. Use Publish to the web in Earth Stories for GitHub Pages, or upload this folder or its ZIP to a static host. Keep index.html at the site root and keep every asset at its existing relative path.

Netlify is an advanced option, not a guaranteed fit. Drop can stall on files above 10 MB or projects above 50 MB; this viewer includes 34-39 MB runtime files. Netlify warns that files above 10 MB are not well-supported by its CDN and may fail upload, so test before relying on it. Details: https://docs.netlify.com/build/configure-builds/troubleshooting-tips/#large-files-or-sites

If you choose Netlify: install current Node.js LTS with npm, extract the ZIP, and open a terminal in the publication folder containing index.html. Run: 
  npx netlify-cli@latest login
The CLI may ask to install itself; approve account access in your browser (the CLI saves sign-in). Then run:
  npx netlify-cli@latest deploy --dir . --no-build
Choose or create the correct site and team. This uploads a draft without rebuilding. Test it, then publish live with:
  npx netlify-cli@latest deploy --dir . --prod --no-build
Check site visibility before sharing. Setup: https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/
Command reference: https://cli.netlify.com/commands/deploy/

Cloudflare Pages is not suitable for current exports: its 25 MiB per-file limit (dashboard and CLI) is smaller than the bundled DuckDB runtime files. Details: https://developers.cloudflare.com/pages/get-started/direct-upload/

GitHub Pages: use Publish to the web in Earth Stories. GitHub's browser file uploader has a 25 MiB per-file limit, so manual uploads of this release need Git or the GitHub API. Extract the ZIP and upload these files (including .nojekyll) to a repository root, then enable Settings > Pages > Deploy from a branch for that branch and /(root). Do not upload the ZIP itself. Free GitHub accounts require a public repository. Instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

2. Open the hosted URL and test every chapter. Interactive maps need a web server; double-clicking index.html may not work. For large map data, check the host's file limits and HTTP byte-range support. Connected sources still require internet and must permit requests from the new site.

3. In Earth Stories, enter the final address under Verify and share after deployment, build again, and replace the hosted files so link previews and embeds use the correct URL. Then run Check published link before sharing. Direct GitHub publishing fills in its address automatically.

Interactive story: index.html
Embeddable story: embed.html
Embed instructions: EMBED.txt
Archival edition: archival.html
Link preview text: share/post-text.md
Build: 9385c40a7311661b
Project: beyond-tree-cover
Manifest: publication.json
Report: publication-report.html
