# Generated trek documents

`npm run generate:llms` rebuilds `public/llms.txt` and `public/llms-full.txt`
from the catalogue exported by `src/data/treks/index.ts`. The detailed document
uses the same FAQ builder as the trek pages (`src/lib/trekFaqs.ts`). Edit those
source files rather than the generated documents.

The generator runs automatically before `npm run build`. It uses the existing
TypeScript compiler in a temporary directory and supports Node.js 18+ without
adding a runtime dependency. Its temporary files are removed after compilation.

Run `npm run generate:llms -- --check` to check for stale documents without
rewriting them. The command exits unsuccessfully if either document differs
from the current trek content. Commit both generated documents with data changes.
