import * as csso from "csso";
import { type BuildOptions, type SameShape, build, context } from "esbuild";
import * as sass from "sass";
import { version } from "./package.json";

const banner = `
// ==UserScript==
// @name         Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      ${process.env.NODE_ENV === "development" ? `${version}-dev` : version}
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
	minifyWhitespace: process.env.NODE_ENV !== "development",
	minifyIdentifiers: process.env.NODE_ENV !== "development",
	sourcemap: process.env.NODE_ENV === "development",
	charset: "utf8",
	format: "iife",
	target: "esnext",
	outfile: "dist/toolExtractor.user.js",
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

if (process.env.NODE_ENV === "development") {
	const ctx = await context(buildOptions);
	await ctx.watch();
} else {
	build(buildOptions).catch(() => process.exit(1));
}
