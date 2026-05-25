import * as csso from "csso";
import { type BuildOptions, build, context, type SameShape } from "esbuild";
import * as sass from "sass";
import { version } from "./package.json";

const isDev = process.env.NODE_ENV === "development";

const dashboardOrigin = process.env.DASHBOARD_ORIGIN?.trim();
if (!dashboardOrigin) {
	const hint = isDev
		? "Définissez DASHBOARD_ORIGIN dans .env.development (ex. http://localhost:5173)."
		: "Définissez DASHBOARD_ORIGIN dans .env ou .env.production.";
	throw new Error(`DASHBOARD_ORIGIN manquant au build. ${hint}`);
}

const banner = `
// ==UserScript==
// @name         Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      ${isDev ? `${version}-dev` : version}
// @description  Extract all LC/F95z thread data
// @author       Hunteraulo
// @source       https://github.com/Hunteraulo1/f95list-extractor
// @downloadURL  https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/toolExtractor.user.js
// @updateURL    https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/toolExtractor.user.js
// @match        http*://lewdcorner.com/threads/*
// @match        http*://*.lewdcorner.com/threads/*
// @match        http*://f95zone.to/threads/*
// @match        http*://*.f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==
`;

const buildOptions: SameShape<BuildOptions, BuildOptions> = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: false,
	minifySyntax: false,
	minifyWhitespace: !isDev,
	minifyIdentifiers: !isDev,
	sourcemap: false,
	charset: "utf8",
	format: "iife",
	target: "esnext",
	outfile: "dist/toolExtractor.user.js",
	define: {
		__DASHBOARD_ORIGIN__: JSON.stringify(dashboardOrigin),
	},
	banner: {
		js: banner,
	},
	plugins: [
		{
			name: "scss",
			setup(build) {
				build.onLoad({ filter: /\.scss$/ }, async (args) => {
					const result = sass.compile(args.path);
					const minified = csso.minify(result.css).css;

					return {
						contents: `
              const style = document.createElement('style');
              style.textContent = \`${minified}\`;
              document.head.appendChild(style);
            `,
						loader: "js",
					};
				});
			},
		},
	],
};

if (isDev) {
	const ctx = await context(buildOptions);
	await ctx.watch();
} else {
	build(buildOptions).catch(() => process.exit(1));
}
