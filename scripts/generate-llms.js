const fs = require('fs');
const os = require('os');
const path = require('path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
const siteUrl = 'https://unchartedtravel.in';
const generatedNotice = '> Generated from src/data/treks/ by npm run generate:llms. Do not edit by hand.';

// Compile only the public trek catalogue and shared FAQ builder. This works on
// Node 18+ without a TS runtime, and keeps the site's TypeScript data authoritative.
function loadTrekContent() {
    const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'uncharted-llms-'));

    try {
        const program = ts.createProgram([
            path.join(projectRoot, 'src/data/treks/index.ts'),
            path.join(projectRoot, 'src/lib/trekFaqs.ts'),
        ], {
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            target: ts.ScriptTarget.ES2017,
            rootDir: path.join(projectRoot, 'src'),
            outDir: outputDirectory,
            baseUrl: projectRoot,
            paths: { '@/*': ['src/*'] },
            types: [],
            skipLibCheck: true,
            noEmitOnError: true,
        });
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.some((item) => item.category === ts.DiagnosticCategory.Error)) {
            throw new Error(ts.formatDiagnostics(diagnostics, {
                getCanonicalFileName: (fileName) => fileName,
                getCurrentDirectory: () => projectRoot,
                getNewLine: () => '\n',
            }));
        }
        const result = program.emit();
        if (result.emitSkipped) throw new Error('Could not compile trek data for llms.txt.');

        return {
            treks: require(path.join(outputDirectory, 'data/treks/index.js')).treks,
            buildTrekFaqs: require(path.join(outputDirectory, 'lib/trekFaqs.js')).buildTrekFaqs,
        };
    } finally {
        fs.rmSync(outputDirectory, { recursive: true, force: true });
    }
}

function inline(value) {
    return String(value).replace(/\s+/g, ' ').trim();
}

function tableCell(value) {
    return inline(value).replace(/\|/g, '\\|');
}

function addList(lines, heading, items) {
    if (!items?.length) return;
    lines.push(`### ${heading}`, '', ...items.map((item) => `- ${inline(item)}`), '');
}

function buildLlmsFiles(treks, buildTrekFaqs) {
    const summary = [
        '# Uncharted Travel', '', generatedNotice, '',
        '> Himalayan treks with local guides and operators in Himachal Pradesh and Uttarakhand.', '',
        '## About', '',
        `- Homepage: ${siteUrl}/`,
        `- All destinations: ${siteUrl}/destinations`,
        '- Contact: hello@unchartedtravel.in | +91 8318217817', '',
        '## Treks Offered', '',
        '| Trek | URL | Listed price | Duration | Difficulty | Location |',
        '|---|---|---|---|---|---|',
        ...treks.map((trek) => `| ${[
            trek.title, `${siteUrl}/destinations/${trek.slug}`, trek.price,
            trek.duration, trek.difficulty, trek.location,
        ].map(tableCell).join(' | ')} |`), '',
        '## Booking', '',
        'Open a trek page, choose a guide or operator, and submit an enquiry to confirm availability, the final price, and arrangements.', '',
        '## More Information', '',
        `- Complete trek details and FAQs: ${siteUrl}/llms-full.txt`,
        `- Sitemap: ${siteUrl}/sitemap.xml`,
        `- Robots: ${siteUrl}/robots.txt`, '',
    ];
    const full = ['# Uncharted Travel — full trek details', '', generatedNotice, ''];

    for (const trek of treks) {
        full.push(
            `## ${inline(trek.title)}`, '',
            `- URL: ${siteUrl}/destinations/${trek.slug}`,
            `- Gallery: ${siteUrl}/destinations/${trek.slug}/gallery`,
            `- Listed price: ${inline(trek.price)}`,
            `- Duration: ${inline(trek.duration)}`,
            `- Difficulty: ${inline(trek.difficulty)}`,
            `- Location: ${inline(trek.location)}`,
        );
        for (const [label, value] of [
            ['Maximum altitude', trek.maxAltitude],
            ['Base camp', trek.basecamp],
            ['Trekking distance', trek.trekDistance],
            ['Best time to visit', trek.bestTimeToVisit],
        ]) {
            if (value) full.push(`- ${label}: ${inline(value)}`);
        }
        full.push('');
        if (trek.overview) full.push('### Overview', '', inline(trek.overview), '');
        addList(full, 'Highlights', trek.highlights);

        if (trek.guides?.length) {
            addList(full, 'Guides', trek.guides.map((guide) => [
                guide.name,
                guide.experience && `${guide.experience} experience`,
                guide.languages?.length && `Languages: ${guide.languages.join(', ')}`,
                guide.description,
            ].filter(Boolean).join(' — ')));
        } else if (trek.guideName) {
            addList(full, 'Guides', [trek.guideName]);
        }
        addList(full, 'Operators', trek.companies?.map((company) => company.name));

        if (trek.itinerary?.length) {
            full.push('### Itinerary', '');
            for (const day of trek.itinerary) {
                full.push(`- Day ${day.day}: ${inline(day.title)}`);
                for (const [label, value] of [
                    ['Description', day.description], ['Distance', day.distance],
                    ['Elevation', day.elevation], ['Meals', day.meals],
                ]) {
                    if (value) full.push(`  - ${label}: ${inline(value)}`);
                }
            }
            full.push('');
        }
        addList(full, 'Inclusions', trek.inclusions);
        addList(full, 'Exclusions', trek.exclusions);
        if (trek.arrivalInstructions) {
            addList(full, trek.arrivalInstructions.title, trek.arrivalInstructions.steps);
        }
        full.push('### Frequently Asked Questions', '');
        for (const item of buildTrekFaqs(trek)) {
            full.push(`Q: ${inline(item.q)}`, `A: ${inline(item.a)}`, '');
        }
        full.push('---', '');
    }

    return { 'llms.txt': summary.join('\n'), 'llms-full.txt': full.join('\n') };
}

function generateLlmsFiles({ check = false } = {}) {
    const { treks, buildTrekFaqs } = loadTrekContent();
    const files = buildLlmsFiles(treks, buildTrekFaqs);
    const staleFiles = [];
    for (const [name, content] of Object.entries(files)) {
        const file = path.join(projectRoot, 'public', name);
        if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) continue;
        if (check) staleFiles.push(name);
        else fs.writeFileSync(file, content);
    }
    if (staleFiles.length) {
        throw new Error(`${staleFiles.join(', ')} is out of date. Run npm run generate:llms.`);
    }
    return treks.length;
}

module.exports = { loadTrekContent, buildLlmsFiles, generateLlmsFiles };

if (require.main === module) {
    try {
        if (process.argv.slice(2).some((arg) => arg !== '--check')) {
            throw new Error('Usage: npm run generate:llms [-- --check]');
        }
        const check = process.argv.includes('--check');
        const count = generateLlmsFiles({ check });
        console.log(`${check ? 'Verified' : 'Generated'} llms.txt and llms-full.txt from ${count} treks.`);
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
