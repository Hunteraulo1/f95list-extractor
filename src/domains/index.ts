import { isF95z } from "../utils";
import { extractDataF95z, extractTagsF95z } from "./f95z";
import { extractDataLC, extractTagsLC } from "./lc";

export const extractTags = () =>
	isF95z() ? extractTagsF95z() : extractTagsLC();

export const extractData = () =>
	isF95z() ? extractDataF95z() : extractDataLC();
