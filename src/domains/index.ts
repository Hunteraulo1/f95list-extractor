import type { ExtractListPayload } from "../types";
import { isF95z } from "../utils";
import {
	extractDataF95z,
	extractTagsF95z,
	getExtractPayloadF95z,
} from "./f95z";
import { extractDataLC, extractTagsLC, getExtractPayloadLC } from "./lc";

const extractTags = () => (isF95z() ? extractTagsF95z() : extractTagsLC());

const extractData = () => (isF95z() ? extractDataF95z() : extractDataLC(false));

const extractFullData = () =>
	isF95z() ? extractDataF95z() : extractDataLC(true);

const getExtractPayload = (): ExtractListPayload | null =>
	isF95z() ? getExtractPayloadF95z() : getExtractPayloadLC();

export { extractData, extractFullData, extractTags, getExtractPayload };
