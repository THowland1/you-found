export class HandledError extends Error {
  constructor(error: Error) {
    super();
    this.message = error.message;
    this.name = error.name;
    this.stack = error.stack;
  }
}
