import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class SigningStatus extends Page {

    name = 'SigningStatus'

    mark1To9AsMissing = new Element.Button('Mark 1 to 9 as Missing')
    continueWithSigning = new Element.Button('Continue with Signing')
    returnToAssessment = new Element.Button('Return to Assessment')
    confirmSignAndLock = new Element.Button('Confirm Sign & Lock')
    noSaraReason = new Element.Select<'There was no suitably trained assessor available' | 'There are no indications within the current OASys that a SARA is required e.g. domestic abuse has occurred outside of Intimate Partner Abuse'>('#P3_SARA_REASON_ELM')

    cancel = new Element.Button('Cancel')
    header = new Element.Text('.regionbuttonslefttop')
}
