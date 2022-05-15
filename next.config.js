module.exports = (phase, {defaultConfig}) => ({
    ...defaultConfig,
    pageExtensions: ['page.tsx', 'page.ts', 'api.ts', 'api.tsx'],
})
