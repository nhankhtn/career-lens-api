export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    stack = "",
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Common HTTP status codes
export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Common error messages
export const ErrorMessages = {
  INVALID_INPUT: "Invalid input data",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  INTERNAL_ERROR: "Internal server error",
} as const;

export const wrapApiError = (error: any) => {
  if (error instanceof ApiError) {
    return error;
  } else {
    return new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ErrorMessages.INTERNAL_ERROR,
      error.stack
    );
  }
};
