import { NextResponse } from "next/server";

class APIResponse {
  success<TData>(data: TData, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
  }

  message(message: string, status = 200) {
    return NextResponse.json({ message }, { status });
  }

  error(message: string, status = 500) {
    return NextResponse.json({ success: false, error: message }, { status });
  }

  badRequest(message = "Bad Request") {
    return this.error(message, 400);
  }

  unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  forbidden(message = "Forbidden") {
    return this.error(message, 403);
  }

  notFound(message = "Not Found") {
    return this.error(message, 404);
  }

  internalServerError(message = "Internal Server Error") {
    return this.error(message, 500);
  }
}

export const apiResponse = new APIResponse();
