import { connect } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

export default function connectToDB (dbName = DB_NAME) {
    return connect(MONGO_URI, {dbName: dbName});
};