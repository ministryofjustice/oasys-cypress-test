import { OAuth2Client } from '@badgateway/oauth2-client'     //  See https://github.com/badgateway/oauth2-client#readme for documentation
import axios from 'axios'                                    //      https://www.npmjs.com/package/axios
import * as dayjs from 'dayjs'

import { restApiUrls } from 'environments'
import { testEnvironment } from '../../localSettings'

const restConfig = testEnvironment.rest

const client = new OAuth2Client({

    clientId: restConfig.clientId,
    clientSecret: restConfig.clientSecret,
    server: restConfig.baseUrl,
    tokenEndpoint: restApiUrls.filter((endpoint) => endpoint.endpoint == 'token')[0].url,
})

var token = ''

/**
 * Generic function to get a response from any of the endpoints defined in environments.ts.
 * Parameter is an EndpointParams object, which includes the endpoint name, crn, laoPrivilege, plus other parameters that may be relevant depending on the endpoint.
 * 
 * The RestResponse return value includes the url called, status code, returned data and error message if any.
 * 
 * This function is called via cypress.config.ts using `cy.task('getRestData', parameters)`
 */
export async function getRestData(parameters: EndpointParams): Promise<RestResponse> {

    // Construct the URL with parameters
    restApiUrls.filter((endpoint) => endpoint.endpoint == parameters.endpoint)[0].url
    let url = (' ' + restApiUrls.filter((endpoint) => endpoint.endpoint == parameters.endpoint)[0].url).slice(1)  // have to force copying to a new object to avoid problems with replace function
    Object.keys(parameters).forEach((parameter) => {
        if (parameter != 'endpoint') {
            url = url.replace(`{${parameter}}`, parameters[parameter])
        }
    })

    var restResponse: RestResponse = { url: url, statusCode: null, result: null, message: null, responseTime: null }

    try {
        await getTokenIfRequired()
        let start = dayjs()
        const response = await axios.request({
            baseURL: restConfig.baseUrl,
            url: url,
            headers: { 'authorization': 'Bearer ' + token },
            validateStatus: () => true
        })



        restResponse.statusCode = getStatusCode(response.status)
        restResponse.result = response.data
        if (response.status != 200) {
            restResponse.message = response.data.message
        }
        restResponse.responseTime = dayjs().diff(start)
    }
    catch (err) {
        restResponse.statusCode = 'error'
        restResponse.message = err.message
    }

    return restResponse
}

async function getTokenIfRequired() {

    // TODO  check for expiry

    if (token == '') {
        const tokenObject = await client.clientCredentials()
        token = tokenObject.accessToken
    }
}

/**
 * Generic function to get multiple responses from any of the endpoints defined in environments.ts.
 * Parameter is an EndpointParams object array, which includes the endpoint name, crn, laoPrivilege, plus other parameters that may be relevant depending on the endpoint.
 * 
 * The RestResponse array return value includes url called, status code, returned data and error message if any.
 * 
 * This function is called via cypress.config.ts using `cy.task('getMultipleRestData', parameters)`
 */
export async function getMultipleRestData(parameters: EndpointParams[]): Promise<RestResponse[]> {

    const response: RestResponse[] = []

    for (let i = 0; i < parameters.length; i++) {
        const r = await getRestData(parameters[i])
        response.push(r)
    }
    return response
}

function getStatusCode(status: number): RestStatus {

    switch (status) {
        case 0: return 'error'
        case 200: return 'ok'
        case 400: return 'badRequest'
        case 403: return 'forbidden'
        case 404: return 'notFound'
        case 409: return 'conflict'
    }
}