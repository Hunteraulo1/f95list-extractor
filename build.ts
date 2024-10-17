import { build } from "esbuild";
// @ts-ignore bug resolveJsonModule
import { version } from "./package.json";

const banner = `
// ==UserScript==
// @name         LC Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      v${version}
// @description  Extract all LC thread data
// @author       Hunteraulo
// @source       https://github.com/Hunteraulo1/f95list-extractor
// @downloadURL  https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/lcToolExtractor.user.js
// @updateURL    https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/lcToolExtractor.user.js
// @match        http*://lewdcorner.com/threads/*
// @match        http*://*.lewdcorner.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==
`;

build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	minifySyntax: true,
	minifyWhitespace: true,
	sourcemap: false,
	target: "esNext",
	outfile: "dist/lcToolExtractor.user.js",
	banner: {
		js: banner,
	},
}).catch(() => process.exit(1));
