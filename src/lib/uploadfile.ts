import sharp from 'sharp'
import { Request } from 'express'
import { config } from '@/config/env'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/config/s3'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '@/utils/errorHandler'
import { v4 as uuid } from 'uuid'

export async function uploadFileS3(
  file: Pick<Request, 'file'>['file'],
  username: string
) {
  try {
    if (file) {
      let imageKey = ''
      const imgBuffer = await sharp(file?.buffer)
        .resize({
          width: 400,
          height: 400,
          fit: 'fill',
        })
        .png({ quality: 50 })
        .toBuffer()
      imageKey = `${username}-${uuid()}`
      const params = {
        Bucket: config.s3Bucket,
        Key: imageKey,
        Body: imgBuffer,
        ContentType: file?.mimetype,
      }
      const command = new PutObjectCommand(params)
      const res = await s3Client.send(command)
      if (res.$metadata.httpStatusCode === StatusCodes.OK) {
        return imageKey
      }
      throw new BadRequestError('error uploading user file', 'uploadFileS3()')
    }
    return null
  } catch (error) {
    console.log('error uploading file', error)
  }
}
