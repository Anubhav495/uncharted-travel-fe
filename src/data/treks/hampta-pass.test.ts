/** @jest-environment node */

import { statSync } from 'fs';
import path from 'path';
import { hamptaPassTrek } from './hampta-pass';

describe('Hampta Pass images', () => {
    it.each([hamptaPassTrek.image, ...(hamptaPassTrek.gallery || [])])(
        'ships the referenced photo at %s',
        (imagePath) => {
            expect(statSync(path.join(process.cwd(), 'public', imagePath)).isFile()).toBe(true);
        }
    );
});
