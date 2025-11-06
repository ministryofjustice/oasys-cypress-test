import * as dayjs from 'dayjs'

declare namespace Cypress {
    interface Cypress {
        dayjs: dayjs.Dayjs
    }
}

export {}