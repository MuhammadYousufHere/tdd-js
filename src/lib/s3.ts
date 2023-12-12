import { S3Client } from '@aws-sdk/client-s3'
import getConfig from '@config/get-config'

const config = getConfig()

const s3Client = new S3Client({
  region: config.S3_REGION!,
  credentials: {
    accessKeyId: config.S3_ACCESS_ID!,
    secretAccessKey: config.S3_ACCESS_KEY!,
  },
})

export default s3Client
export { s3Client }
