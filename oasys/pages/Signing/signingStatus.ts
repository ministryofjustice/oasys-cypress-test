import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class SigningStatus extends Page {

    name = 'SigningStatus'

    mark1To9AsMissing = new Element.Button('Mark 1 to 9 as Missing')
    continueWithSigning = new Element.Button('Continue with Signing')
    returnToAssessment = new Element.Button('Return to Assessment')
    confirmSignAndLock = new Element.Button('Confirm Sign & Lock')
    cancel = new Element.Button('Cancel')
    header = new Element.Text('.regionbuttonslefttop')
}
