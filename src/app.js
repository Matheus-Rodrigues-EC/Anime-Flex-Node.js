import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

import admin from './routers/adminRoutes.js';
import anime from './routers/animeRoutes.js';
import season from './routers/seasonRoutes.js';
import episode from './routers/episodeRoutes.js';
import member from './routers/memberRoutes.js';
import comment from './routers/commentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(admin);
app.use(anime);
app.use(season);
app.use(episode);

app.use(member);

app.use(comment);

app.listen(process.env.PORT, () => {
    console.log("Server is running at port: " + process.env.PORT);
})
