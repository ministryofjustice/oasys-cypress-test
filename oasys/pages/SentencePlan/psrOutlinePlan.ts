import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class PsrOutlinePlan extends Page {

    name = 'PSROutlinePlan'
    title = 'Offender Objectives'
    menu: Menu = { type: 'Floating', level1: 'PSR Outline Plan' }

    signAndLock = new Element.Button('Sign & Lock')
    countersign = new Element.Button('Countersign')
    current = new Element.Link('Current')
    objectiveDescriptionColumn = new Element.Column(Element.ColumnType.Column, 'Objective Description')
    statusColumn = new Element.Column(Element.ColumnType.Column, 'Status')
    upColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Up')
    downColumn = new Element.Column(Element.ColumnType.ImageColumn, 'Down')
    pullFromPreviousPlan = new Element.Button('Pull From Previous Plan')
    addObjective = new Element.Button('Add Objective')
    criminogenicNeedsSummary = new Element.Link('Criminogenic Needs SummaryÂ(Active)')
    ogrs3 = new Element.Link('OGRS3 / OGP / OVP')
}
