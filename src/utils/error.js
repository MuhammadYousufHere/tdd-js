class CustomError extends Error {
  constructor(message, extraInfo) {
    super(message)
    this.extraInfo = extraInfo
  }
}

export default CustomError
