const withMDX = require("@next/mdx")({
    extension: /\.md$/,
});

module.exports = (phase, {defaultConfig}) => withMDX({
    ...defaultConfig,
    pageExtensions: ['page.tsx', 'page.ts', 'api.ts', 'api.tsx'],
})
