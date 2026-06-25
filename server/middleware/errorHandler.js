function getMongooseValidationMessage(error) {
  return Object.values(error.errors || {})
    .map((validationError) => validationError.message)
    .join(' ');
}

function errorHandler(error, _req, res, _next) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: getMongooseValidationMessage(error) });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: '요청 값이 올바르지 않습니다.' });
  }

  const status = error.status || 500;
  const message = status === 500 ? '서버 오류가 발생했습니다.' : error.message;

  return res.status(status).json({ message });
}

export default errorHandler;
