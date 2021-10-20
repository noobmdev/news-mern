// validate request data
exports.validateSchema = (payload, schema) => {
  const result = schema.validate(payload, {
    abortEarly: false,
  });
  const { error } = result;
  let errors;
  if (error?.details?.length) {
    errors = error.details.map((i) => ({ [i.context.key]: i.message }));
  }

  return {
    isValid: error == null,
    errors,
  };
};
