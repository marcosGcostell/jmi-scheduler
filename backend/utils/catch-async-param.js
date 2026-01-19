export default fn => (req, res, next, val) => {
  fn(req, res, next, val).catch(next);
};
