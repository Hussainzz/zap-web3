export default (fn: any) => (req: any, res: any, next: any) => {
  fn(req, res, next).catch((err: any) => {
    console.error(err); // Print the error message to the console
    next(err); // Call the next middleware function with the error
  });
};