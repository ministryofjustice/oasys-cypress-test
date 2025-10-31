import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class StandaloneRsr extends Page {

    name = 'StandaloneRsr'
    title = 'RSR Predictor'
    menu: Menu = { type: 'Subform', level1: 'RSR' }

    save = new Element.Button('Save')
    close = new Element.Button('Close')
    calculateRsrScore = new Element.Button('Calculate RSR Score')

    offence = new Element.Textbox<string>('#P5_CT_OFFENCE_CODE_TEXT')
    offenceDescription = new Element.Textbox<string>('#LOVDSC_P5_CT_OFFENCE_CODE_TEXT')
    subcode = new Element.Textbox<string>('#P5_CT_OFFENCE_SUBCODE_TEXT')
    subcodeDescription = new Element.Textbox<string>('#LOVDSC_P5_CT_OFFENCE_SUBCODE_TEXT')
    offenceLov = new Element.Link("//input[@id='P5_CT_OFFENCE_CODE_TEXT']/following::a/img")
    subcodeLov = new Element.Link("//input[@id='P5_CT_OFFENCE_SUBCODE_TEXT']/following::a/img")
    /**
     *  Date of first sanction
     */
    o1_8 = new Element.Textbox<OasysDate>('#P5_QU_1_8_2')
    /**
     *  Age at first conviction (calculated from 1.8)
     */
    o1_8Age = new Element.Textbox<string>('#P5_QU_1_8')
    /**
     *  Number of sanctions for all offences
     */
    o1_32 = new Element.Textbox<number>('#P5_QU_1_32')
    /**
     *  How many of the sanctions involved violent offences?
     */
    o1_40 = new Element.Textbox<string>('#P5_QU_1_40')
    /**
     *  Date of current conviction
     */
    o1_29 = new Element.Textbox<OasysDate>('#P5_QU_1_29')
    /**
     *  Ever committed a sexual offence
     */
    o1_30 = new Element.Select<YesNoAnswer>('#P5_QU_1_30')
    /**
     *  Does of the current offence have sexual motivation
     */
    o1_41 = new Element.Select<YesNoAnswer>('#P5_QU_1_41')
    /**
     *  Does the current offence involve a victim who was a stranger?
     */
    o1_42 = new Element.Select<YesNoAnswer>('#P5_QU_1_42')
    /**
     *  Date of most recent sexual offence
     */
    o1_33 = new Element.Textbox<OasysDate>('#P5_QU_1_33')
    /**
     *  Number of adult sexual offences
     */
    o1_34 = new Element.Textbox<number>('#P5_QU_1_34')
    /**
     *  Number of previous/current sanctions involving direct contact child sexual/sexually motivated offences
     */
    o1_35 = new Element.Textbox<number>('#P5_QU_1_35')
    /**
     *  Number of previous/current sanctions involving indecent child image sexual/sexually motivated offences or indirect child contacts
     */
    o1_36 = new Element.Textbox<number>('#P5_QU_1_36')
    /**
     *  Number of non-contact sexual offences
     */
    o1_37 = new Element.Textbox<number>('#P5_QU_1_37')
    /**
     *  Date of commencement of community sentence
     */
    o1_38 = new Element.Textbox<OasysDate>('#P5_QU_1_38')
    /**
     *  Have you completed an Offender interview?
     */
    o1_39 = new Element.Select<YesNoAnswer>('#P5_QU_1_39')
    /**
     * Did the offence involve carrying or using a weapon
    */
    o2_2 = new Element.Select<YesNoAnswer>('#P5_QU_2_2')
    /**
     * Specify which weapon
    */
    o2_2Weapon = new Element.Textbox('#P5_QU_2_2_TXT')
    /**
     *  Is the offender living in suitable accommodation?
     */
    o3_4 = new Element.Select<ProblemsMissingAnswer>('#P5_QU_3_4')
    /**
     *  Is the person unemployed?
     */
    o4_2 = new Element.Select<'0-No' | '0-Not available for work' | '2-Yes' | 'Missing'>('#P5_QU_4_2')
    /**
     *  What is the person's current relationship with partner?
     */
    o6_4 = new Element.Select<ProblemsMissingAnswer>('#P5_QU_6_4')
    /**
     *  Is there evidence of current or previous domestic abuse?
     */
    o6_7 = new Element.Select<YesNoAnswer>('#P5_QU_6_7DA')
    o6_7VictimPartner = new Element.Select<YesNoAnswer>('#P5_QU_6_7_1_1DA')
    o6_7VictimFamily = new Element.Select<YesNoAnswer>('#P5_QU_6_7_1_2DA')
    o6_7PerpetratorPartner = new Element.Select<YesNoAnswer>('#P5_QU_6_7_2_1DA')
    o6_7PerpetratorFamily = new Element.Select<YesNoAnswer>('#P5_QU_6_7_2_2DA')
    /**
     * Is the person's current use of alcohol a problem
     */
    o9_1 = new Element.Select<ProblemsMissingAnswer>('#P5_QU_9_1')
    /**
     * Is there evidence of binge drinking
     */
    o9_2 = new Element.Select<ProblemsMissingAnswer>('#P5_QU_9_2')
    /**
     * Is impulsivity a problem for the offender
     */
    o11_2 = new Element.Select<ProblemsAnswer>('#P5_QU_11_2')
    /**
     * Is temper control a problem for the offender
     */
    o11_4 = new Element.Select<ProblemsAnswer>('#P5_QU_11_4')
    /**
     * Does the offender have pro-criminal attitudes
     */
    o12_1 = new Element.Select<ProblemsAnswer>('#P5_QU_12_1')

    weaponPrevious = new Element.Select<YesNoAnswer>('#P5_WEAPON_PREV')
    murderPrevious = new Element.Select<YesNoAnswer>('#P5_MURDER_PREV')
    woundingPrevious = new Element.Select<YesNoAnswer>('#P5_WOUND_PREV')
    burglaryPrevious = new Element.Select<YesNoAnswer>('#P5_BURGLARY_PREV')
    arsonPrevious = new Element.Select<YesNoAnswer>('#P5_ARSON_PREV')
    damagePrevious = new Element.Select<YesNoAnswer>('#P5_CRIMINAL_PREV')
    kidnappingPrevious = new Element.Select<YesNoAnswer>('#P5_KIDNAP_PREV')
    firearmPrevious = new Element.Select<YesNoAnswer>('#P5_FIREARM_PREV')
    robberyPrevious = new Element.Select<YesNoAnswer>('#P5_ROBBERY_PREV')
    /**
     * OSP - Indecent Image and Indirect Sexual Reoffending Risk
     */
    ospIic = new Element.Textbox<string>('#P5_OSPIIC_TEXTAREA')
    /**
     * OSP - Direct Contact Sexual Reoffending Risk
     */
    ospDc = new Element.Textbox<string>('#P5_OSPDC_TEXTAREA')
    /**
     * RSR Score
     */
    rsrScore = new Element.Textbox<string>('#P5_RSR_TEXT_1')
}
