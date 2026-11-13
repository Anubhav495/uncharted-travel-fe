import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants';

const createConfig = require('../next.config');

it('isolates development output while keeping production build and serving paths aligned', () => {
    const development = createConfig(PHASE_DEVELOPMENT_SERVER);
    const build = createConfig(PHASE_PRODUCTION_BUILD);
    const production = createConfig(PHASE_PRODUCTION_SERVER);

    expect(development.distDir).not.toBe(build.distDir);
    expect(production.distDir).toBe(build.distDir);
    expect(production.distDir).toBe('.next');
    expect(development.webpack).toBe(build.webpack);
    expect(development.images).toEqual(build.images);
});
