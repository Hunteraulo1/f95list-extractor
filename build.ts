import { build } from "esbuild";
// @ts-ignore bug resolveJsonModule
import { version } from "./package.json";

const banner = `
// ==UserScript==
// @name         LC Tool Extractor
// @version      v${version}
// @description  Extract all LC thread data
// @author       Hunteraulo
// @match        https://lewdcorner.com/threads/*
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
	outfile: `dist/lcToolExtractor-v${version}.user.js`,
	banner: {
		js: banner,
	},
}).catch(() => process.exit(1));
