import express, { Application, Request, Response, NextFunction } from 'express';
import { router } from './router';


const app:Application = express();


app.use('/api/v1', router);

app.get('/', (req:Request, res:Response, next: NextFunction) => {
    res.json({key:'nodejs with typescript working'})
})

const port = 4001
app.listen(port, () => console.log(`server running on ${port}`))