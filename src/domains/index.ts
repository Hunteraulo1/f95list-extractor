import { isF95z } from "../utils";
import { extractDataF95z, extractTagsF95z } from "./f95z";
import { extractDataLC, extractTagsLC } from "./lc";

const extractTags = () => (isF95z() ? extractTagsF95z() : extractTagsLC());

const extractData = () => (isF95z() ? extractDataF95z() : extractDataLC(false));

const extractFullData = () =>
	isF95z() ? extractDataF95z() : extractDataLC(true);

export { extractData, extractFullData, extractTags };
