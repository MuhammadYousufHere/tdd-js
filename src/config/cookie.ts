export const authCookieOptions = {
  httpOnly: true,
  sameSite: false,
  expires: new Date(Date.now() + 86400000), // 1 day life
  secure: true,
  signed: true,
}
