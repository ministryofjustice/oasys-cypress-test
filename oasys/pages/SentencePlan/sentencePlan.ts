import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from 'pages/baseAssessmentPage'

export abstract class SentencePlan extends BaseAssessmentPage {

    signAndLock = new Element.Button('Sign & Lock')
    countersign = new Element.Button('Countersign')
    countersignOverview = new Element.Button('Countersign Overview')
    printSentencePlan = new Element.Button('Print Sentence Plan')
}
