export default class ErrorConstructor extends Error {
  constructor(code, message) {
    super()
    this.code = code
    this.message = message
  }
}

export const handleError = (err, res) => {
  const { code, message } = err
  if (!code) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      success: false,
    })
  } else {
    return res.status(code).json({
      success: false,
      code,
      message,
    })
  }
}
