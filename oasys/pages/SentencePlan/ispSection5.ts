import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { SentencePlan } from './sentencePlan'
import * as CommonTables from 'pages/commonTables'

export class IspSection5 extends SentencePlan {

    name = 'ISPSection5'
    title = 'Offender Objectives'
    menu: Menu = { type: 'Floating', level1: 'Initial Sentence Plan', level2: 'Section 5' }

    current = new Element.Link('Current')
    future = new Element.Link('Future')
    completed = new Element.Link('Completed')
    objectiveDescriptionColumn = new Element.Column(Element.ColumnType.Column, 'Objective Description')
    statusColumn = new Element.Column(Element.ColumnType.Column, 'Status')
    upColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Up')
    downColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Down')
    addObjective = new Element.Button('Add Objective')
    clearCurrentObjectives = new Element.Button('Clear Current Objectives')

    criminogenicNeedsSummary = new Element.Link('[accesskey="4"]')
    ogrs3 = new Element.Link('[accesskey="5"]')
    rosh = new Element.Link('[accesskey="6"]')
    riskManagement = new Element.Link('[accesskey="7"]')

    sanCrimTable = new CommonTables.SummarySheetCrimTable('R3982355349224802', 'ISP SAN Criminogenic Needs')

    predictorsTable = new CommonTables.PredictorsTable('R3328116188259315','Isp Predictor Scores')
    weighedScoresTable = new CommonTables.WeightedScoresTable('R2896618293122266', 'Isp Weighted Scores')
}
