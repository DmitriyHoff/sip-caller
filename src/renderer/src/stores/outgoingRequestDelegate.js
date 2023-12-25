/**
 * Delegate providing custom handling of outgoing requests.
 */
export default {
    /**
     * Received a 2xx positive final response to this request.
     * @param response - Incoming response.
     */
    onAccept: (response) => {
        console.log('Accept: ', { response })
    },

    /**
     * Received a 1xx provisional response to this request. Excluding 100 responses.
     * @param response - Incoming response.
     */
    onProgress: (response) => {
        console.log('OnProgress: ', { response })
        window.api.sendSipBeginCall()
    },

    /**
     * Received a 3xx negative final response to this request.
     * @param response - Incoming response.
     */
    onRedirect: (response) => {
        console.log('onRedirect: ', { response })
    },

    /**
     * Received a 4xx, 5xx, or 6xx negative final response to this request.
     * @param response - Incoming response.
     */
    onReject: (response) => {
        console.log('onReject: ', { response })
    },

    /**
     * Received a 100 provisional response.
     * @param response - Incoming response.
     */
    onTrying: (response) => {
        console.log('onTrying: ', { response })
    }
}
