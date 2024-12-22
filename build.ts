import type { BuildConfig } from "bun";
import { version } from "./package.json";

const banner = `
// ==UserScript==
// @name         Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  Extract all LC/F95z thread data
// @author       Hunteraulo
// @source       https://github.com/Hunteraulo1/f95list-extractor
// @downloadURL  https://github.com/Hunteraulo1/f95list-extractor/raw/refs/heads/main/dist/toolExtractor.user.js
// @updateURL    https://github.com/Hunteraulo1/f95list-extractor/raw/refs/heads/main/dist/toolExtractor.user.js
// @match        http*://lewdcorner.com/threads/*
// @match        http*://*.lewdcorner.com/threads/*
// @match        http*://f95zone.to/threads/*
// @match        http*://*.f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==
`;

const config: BuildConfig = {
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	minify: true,
	naming: "toolExtractor.user.js",
	banner,
	plugins: [
		{
			name: "scss",
			setup(build) {
				build.onLoad({ filter: /\.scss$/ }, async (args) => {
					const contents = await Bun.file(args.path).text();
					// Vous pouvez ajouter ici la compilation SCSS si nécessaire
					return {
						contents,
						loader: "css",
					};
				});
			},
		},
	],
};

await Bun.build(config);
