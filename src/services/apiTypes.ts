import type { APIData } from "../types";

export interface APIResponse {
	count: number,
	next: string,
	previous: string,
	results: APIData[]
}