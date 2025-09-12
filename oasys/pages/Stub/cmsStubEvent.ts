import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class CmsStubEvent extends Page {

    name = 'CMSStubEvent'
    title = 'Training - CMS Stub'

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    sentenceType = new Element.Select('#P200_SENTENCE_CODE')
    sentenceDate = new Element.Textbox<OasysDate>('#P200_SENTENCE_DATE')
    sentenceMonths = new Element.Textbox('#P200_SENTENCE_LENGTH')
    sentenceHours = new Element.Textbox('#P200_COMBINED_LENGTH')
    releaseType = new Element.Select('#P200_RELEASE_TYPE_ELM')
    releaseDate = new Element.Textbox<OasysDate>('#P200_RELEASE_DATE')
    court = new Element.Select('#P200_COURT_CODE')
    courtType = new Element.Textbox('#P200_COURT_TYPE_DESC')
    licenceCondition = new Element.Textbox('#P200_LICENCE')
    offences = new Element.Link('Offences')
    sentenceDetail = new Element.Link('Sentence Detail')
    createSentenceDetail = new Element.Button('Create')
    sentenceDetailCategoryColumn = new Element.Column(Element.ColumnType.Column, 'Category')
    sentenceDetailTypeColumn = new Element.Column(Element.ColumnType.Column, 'Sentence Detail Type')
    sentenceDetailDisplayOrderColumn = new Element.Column(Element.ColumnType.Column, 'Display Order')
    sentenceDetailDeleteColumn = new Element.Column(Element.ColumnType.ButtonColumn, '')
    createOffence = new Element.Button('Create')
    offenceColumn = new Element.Column(Element.ColumnType.Column, '')
    offenceDescriptionColumn = new Element.Column(Element.ColumnType.Column, 'Offence Group')
    subcodeColumn = new Element.Column(Element.ColumnType.Column, '')
    subcodeDescriptionColumn = new Element.Column(Element.ColumnType.Column, 'Sub Offence')
    additionalOffenceColumn = new Element.Column(Element.ColumnType.Column, 'Additional Offence')
    deleteColumn = new Element.Column(Element.ColumnType.ButtonColumn, 'Delete')

}
