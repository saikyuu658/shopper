import  {Request, Response} from 'express';



function upload ( req: Request, res: Response) {
    console.log(req.body)

    res.status(200).send('Parabens')
}

export default {
    upload
}