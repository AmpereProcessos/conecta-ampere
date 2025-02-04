import type { Db } from "mongodb";
import clientPromise from "./mongo-client";

let cachedDb: Db | null = null;
export default async function connectToProjectsDatabase() {
	if (cachedDb) {
		return cachedDb;
	}
	const client = await clientPromise;
	const db = client.db("projetos");
	cachedDb = db;
	return db;
}
