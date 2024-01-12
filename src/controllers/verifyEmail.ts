import { Request, Response } from 'express'

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  console.log(req)
  console.log(res)
}
