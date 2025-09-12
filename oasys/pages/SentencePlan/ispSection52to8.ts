﻿import { Page } from 'classes/page'
import * as Element from 'classes/elements'
import { SentencePlan } from './sentencePlan'

export class IspSection52to8 extends SentencePlan {

    name = 'ISPSection52to8'
    title = 'Initial Sentence Plan'
    menu: Menu = { type: 'Floating', level1: 'Initial Sentence Plan', level2: 'Section 5.2 to 8' }

    liaisonArrangements = new Element.Textbox('#textarea_IP_15')
    supervisionArrangements = new Element.Textbox('#textarea_IP_16')
    agreeWithPlan = new Element.Select('#itm_IP_17')
    whyNotAgree = new Element.Textbox('#textarea_IP_17_t')
    offenderComments = new Element.Textbox('#textarea_IP_19')
    offenderName = new Element.Textbox('#itm_IP_20')
    offenderSigned = new Element.Select('#itm_IP_21')
    signature = new Element.Textbox('#itm_IP_22')
    dateSigned = new Element.Textbox<OasysDate>('#itm_IP_23')
    whyNotSign = new Element.Textbox('#textarea_IP_24')
    assessorComments = new Element.Textbox('#textarea_IP_25')
    assessorName = new Element.Textbox('#itm_IP_26')
    position = new Element.Textbox('#itm_IP_27')
    assessmentDate = new Element.Textbox<OasysDate>('#itm_IP_28')
    enterContributorDetails = new Element.Button('Enter Contributor Details')
    nameColumn = new Element.Column(Element.ColumnType.Column, 'Name')
    roleColumn = new Element.Column(Element.ColumnType.Column, 'Role / department / partnership agency')
    attendColumn = new Element.Column(Element.ColumnType.Column, 'Did they attend the sentence planning board')
    deleteColumn = new Element.Column(Element.ColumnType.ButtonColumn, 'Delete')
    publicProtectionConference = new Element.Select('#itm_IP_37')
    conferenceDate = new Element.Textbox<OasysDate>('#itm_IP_38')
    conferenceChair = new Element.Textbox('#itm_IP_39')
    dateAssessmentSent = new Element.Textbox<OasysDate>('#itm_IP_43')
    countersignerComments = new Element.Textbox('#textarea_IP_40')
    countersignerSupervisor = new Element.Textbox('#itm_IP_41')
    dateAgreed = new Element.Textbox<OasysDate>('#itm_IP_42')
}
