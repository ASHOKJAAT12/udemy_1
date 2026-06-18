class ApiResponse {
    constructor(
        statusCode,
        data,
        message,
        success
    ) {
        statusCode = this.statusCode;
        data = this.data;
        message = this.message;
        success = statusCode > 400;
    }
}

export { ApiResponse };