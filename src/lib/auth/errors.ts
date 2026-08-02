export class MagicLinkExpiredError extends Error {
  constructor(message = 'Magic link is verlopen.') {
    super(message);
    this.name = 'MagicLinkExpiredError';
  }
}

export class MagicLinkInvalidError extends Error {
  constructor(message = 'Magic link is ongeldig.') {
    super(message);
    this.name = 'MagicLinkInvalidError';
  }
}

export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthValidationError';
  }
}
