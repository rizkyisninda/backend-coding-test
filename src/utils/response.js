class Response {
    constructor(success, message, data, errorCode) {
        this.success = success
        this.message = message
        this.data = data
        this.error_code = errorCode
    }
}

module.exports = Response