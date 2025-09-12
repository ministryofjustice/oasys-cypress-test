import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Sdr extends Page {

    name = 'SDR'
    menu: Menu = { type: 'Floating', level1: 'Pre-Sentence Report' }

    saveAndPreview = new Element.Button('Save and Preview')
    convertToNilReport = new Element.Button('Convert to Nil Report')
    signAndLock = new Element.Button('Sign & Lock')
    abandonPsr = new Element.Button('Abandon PSR')
    viewReport = new Element.Button('View Report')
    save = new Element.Button('Save')
    close = new Element.Button('Close')
    status = new Element.Textbox('#P0_COURT_REPORT_STATUS_DESC')
    offenderNameForAutotext = new Element.Textbox('#P0_AUTOTEXT_NAME')
    offenderName = new Element.Textbox('#P0_RO_OFFENDER_NAME')
    dateOfBirth = new Element.Textbox<OasysDate>('#P0_RO_DATE_OF_BIRTH')
    age = new Element.Textbox('#P0_RO_AGE')
    addressLine1 = new Element.Textbox('#P0_RO_ADDRESS_LINE_1')
    addressLine2 = new Element.Textbox('#P0_RO_ADDRESS_LINE_2')
    addressLine3 = new Element.Textbox('#P0_RO_ADDRESS_LINE_3')
    addressLine4 = new Element.Textbox('#P0_RO_ADDRESS_LINE_4')
    addressLine5 = new Element.Textbox('#P0_RO_ADDRESS_LINE_5')
    addressLine6 = new Element.Textbox('#P0_RO_ADDRESS_LINE_6')
    postcode = new Element.Textbox('#P0_RO_POST_CODE')
    sentencingCourt = new Element.Textbox('#P0_COURT_DESC')
    courtType = new Element.Textbox('#P0_COURT_TYPE')
    localJusticeArea = new Element.Textbox('#P0_LOCAL_JUSTICE_AREA')
    dateReportRequested = new Element.Textbox<OasysDate>('#P0_COURT_DATE_REPORT_REQSTD')
    dateReportRequired = new Element.Textbox<OasysDate>('#P0_COURT_DATE_REPORT_REQRD')
    purposeOfSentencing = new Element.Textbox('#P0_PURPOSE_OF_SENTENCING')
    levelOfSeriousness = new Element.Textbox('#P0_LEVEL_OF_SERIOUSNESS')
    excludeColumn = new Element.Column(Element.ColumnType.CheckboxColumn, 'Exclude')
    offenceDescriptionColumn = new Element.Column(Element.ColumnType.Column, 'Offence Description')
    offenceDateColumn = new Element.Column(Element.ColumnType.Column, 'Offence Date')
    addOffence = new Element.Button('Add Offence')
    psrWriterName = new Element.Textbox('#P0_AUTHOR_NAME')
    officialTitle = new Element.Textbox('#P0_AUTHOR_POSITION')
    officeLocation = new Element.Textbox('#P0_OFFICE_DETAILS')
    dateReportSigned = new Element.Textbox<OasysDate>('#P0_DATE_REPORT_SIGNED')
    sourcesOfInformation = new Element.TextEditor('#P200_SOURCES_OF_INFO_LABEL')
    offenceAnalysis = new Element.TextEditor('#P200_OFFENCE_ANALYSIS_LABEL')
}
