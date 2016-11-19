exports.awaitIfAsync = async function (object) {
  if (object instanceof Promise) {
    return await object
  }

  return object
}
