import { Request, Response } from 'express'

export async function read(req: Request, res: Response): Promise<void> {
  const authorization = req.headers['authorization']?.split(' ')[1]

  //   @ts-ignore
  const [username, password] = new Buffer.from(authorization, 'base64')
    .toString()
    .split(':')

  console.log({ username, password })

  res.send('signin route')
}
