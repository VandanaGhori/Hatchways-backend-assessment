module.exports = {
    sendSuccessResponse : function (success) {
        return { 'success' : success }
    },
    sendErrorResponse : function (error) {
        return { 'error' : error }
    }
}