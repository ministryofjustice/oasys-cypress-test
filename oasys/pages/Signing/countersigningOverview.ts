import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CountersigningOverview extends Page {

    name = 'Countersigning overview'

    returnToAssessment = new Element.Button('Return to Assessment')
    header = new Element.Text('#R2817922970188407 > h2')
    details = new Element.Text('#R2817922970188407')
}
