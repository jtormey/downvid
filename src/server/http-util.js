exports.safeHandle = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    console.error(`Encountered error while handling request: ${error.message}`)
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
