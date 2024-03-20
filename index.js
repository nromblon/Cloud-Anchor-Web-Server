import "dotenv/config";
import express from 'express';
import connectToDB from './src/models/conn.js';
import router from "./src/routes/mainRouter.js";

async function main() {
    try {
        await connectToDB();
        console.log('Now Connected to MongoDB');
    }
    catch (err) {
        console.error(err);
        return;
    }
    const app = express();
    const PORT = process.env.PORT;

    app.use(router);

    app.listen(PORT, () => {
        console.log(`Server is now listening on PORT ${PORT}`);
    });
}

main();