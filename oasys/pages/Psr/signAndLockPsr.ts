import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class SignAndLockPsr extends Page {

    name = 'SignAndLockPSR'

    sign = new Element.Button('Sign')
    cancel = new Element.Button('Cancel')
}
