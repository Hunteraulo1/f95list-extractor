import { build } from "esbuild";
// @ts-ignore bug resolveJsonModule
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

build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	minifySyntax: true,
	minifyWhitespace: true,
	sourcemap: false,
	target: "esNext",
	outfile: "dist/toolExtractor.user.js",
	banner: {
		js: banner,
	},
}).catch(() => process.exit(1));
