import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { BaseAssessmentPage } from '../baseAssessmentPage'
import * as CommonTables from 'pages/commonTables'

export class SummarySheet extends BaseAssessmentPage {

    name = 'SummarySheet'
    title = 'Summary Sheet'
    menu: Menu = { type: 'Floating', level1: 'Summary Sheet' }

    summarySheet = new Element.Button('Summary Sheet')
    crimTable = new CommonTables.SummarySheetCrimTable('R4170407686105861', 'Summary Sheet Criminogenic Needs')
    sanCrimTable = new CommonTables.SummarySheetCrimTable('R3727391167347737', 'Summary Sheet SAN Criminogenic Needs')

    lowScoringSection1 = new Element.Select('#f01_0001')
    lowScoringSection2 = new Element.Select('#f01_0002')
    lowScoringSection3 = new Element.Select('#f01_0003')
    lowScoringSection4 = new Element.Select('#f01_0004')
    lowScoringSection5 = new Element.Select('#f01_0005')
    lowScoringSection6 = new Element.Select('#f01_0006')
    lowScoringSection7 = new Element.Select('#f01_0007')
    lowScoringSection8 = new Element.Select('#f01_0008')
    lowScoringSection9 = new Element.Select('#f01_0009')
    lowScoringSection10 = new Element.Select('#f01_0010')
    reasonsForLowScoringAreas = new Element.Textbox('#P1_LOW_SCORE_REASON')

    predictorsTable = new CommonTables.PredictorsTable('R152474483953316113', 'Summary Sheet Predictor Scores')
    weighedScoresTable = new CommonTables.WeightedScoresTable('R4262411784053323', 'Summary Sheet Weighted Scores')
    likelihoodHarmOthersTable = new SummarySheetLikelihoodHarmOthersTable('R4310220450481626', 'Summary Sheet Likelihood of Serious Harm to Others')
    concernsTable = new SummarySheetConcernsTable('R3161211058051917', 'Summary Sheet Concerns')
    maturityScreening = new Element.Text('#R8016111128177844')
    learningScreeningTool = new Element.Text('#R4877071776276308')

    opd = new Element.Text('#P1_MESSAGE_LABEL')
    opdOverrideMessage = new Element.Text('#P1_OVERRIDE_MESSAGE_LABEL')
    opdOverride = new Element.Select('#P1_OPD_SCREEN_OUT_OVERRIDE')
    opdOverrideReason = new Element.Textbox('#P1_OPD_SCREEN_OUT_OVERRIDE_REASON')
    dateCompleted = new Element.Text('#R4282622772349750 > div.regionbuttonstop > h2 > span')
}

export class SummarySheetLikelihoodHarmOthersTable extends Element.Table {

    risk = new Element.Column(Element.ColumnType.Column, `#PARENT_SECTION_QUESTION_${this.id}`, this.id)
    community = new Element.Column(Element.ColumnType.Column, `#RISK_IN_COMMUNITY_${this.id}`, this.id)
    custody = new Element.Column(Element.ColumnType.Column, `#RISK_IN_CUSTODY_${this.id}`, this.id)
}

export class SummarySheetConcernsTable extends Element.Table {

    concern = new Element.Column(Element.ColumnType.Column, '', this.id)
}