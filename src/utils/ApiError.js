class ApiError extends Error {
    constructor(
        statusCode,
        message = "something is worng",
        stack="",
        error=[]
    ){
        super(Error);
        statusCode = this.statusCode;
        data = null;
        message = this.message;
        error = this.error;
        this.success = false;

        if ( stack ) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError};