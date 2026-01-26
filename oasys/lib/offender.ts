/**
 * __oasys.Offender.*function*__  
 * 
 * Offender functions including create (probation/prison) and search
 * @module Offender
 */

import * as oasys from 'oasys'
import { testEnvironment } from '../../localSettings'

/**
 * Create a probation offender using the details provided in an Offender type object.
 * 
 * Any '#auto...' data items will be generated and updated in the object (without affecting the original instance of that object).
 * A Cypress alias is required to allow the test to refer to the updated object to access the generated data.
 * 
 * The object needs to include all mandatory items for a probation offender, but if there is no CRN property, a new one will be generated.
 * If there is a NOMIS ID this will be ignored.
 * 
 * Address lines 4 and 5 are automatically populated with the OASys version and test script name respectively.
 * 
 * The Cypress alias should be a string such as `offender1` but subsequent use requires the following code,
 * where the values are only available within a `cy.get().then()` structure (note the `@` symbol):
 * 
 * > `cy.get('@offender1').then((result:object) => {`  
 * > &nbsp;&nbsp;&nbsp;&nbsp;`let offender = result as lib.Offender`  
 * > &nbsp;&nbsp;&nbsp;&nbsp;`cy.log(offender.probationCrn)`  
 * > `})`
 */
export function createProb(source: OffenderDef, alias: string) {

    // Get a copy of the offender data (to avoid changing it for other offenders in the same test based on the same source offender),
    let offender = JSON.parse(JSON.stringify(source)) as OffenderDef

    // Populate any null key fields (PNC, CRN, NOMIS ID and Surname).
    cy.task('populateAutoData', offender).as(alias)

    cy.get<OffenderDef>(`@${alias}`).then((offender) => {

        expect(offender).not.null  // null result would indicate errors checking the database
        offender.dateOfBirth = oasys.oasysDateAsString(offender.dateOfBirth) // Calculate date if a # value has been specified

        // Delete the NOMIS Id if there is one to avoid attempting to populate it on the stub screen
        let nomisId: string
        if (offender.nomisId != undefined) {
            nomisId = offender.nomisId
            delete offender.nomisId
        }

        const cmsStub = new oasys.Pages.Stub.CmsStub()
        cmsStub.goto(true)
        cmsStub.createStub.click()

        const maintainCmsStub = new oasys.Pages.Stub.MaintainCmsStub()

        let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
        if (stubDetails.event) delete stubDetails.event
        if (stubDetails.aliases) delete stubDetails.aliases

        maintainCmsStub.setValues(stubDetails, true)
        cy.get<string>('@appVersion').then((version) => {
            maintainCmsStub.addressLine4.setValue(version)
        })
        maintainCmsStub.addressLine5.setValue(Cypress.currentTest.title)
        maintainCmsStub.save.click()

        // Add the event/offence/sentence if included in the offender details
        if (offender.event) {

            maintainCmsStub.event.click()
            maintainCmsStub.sentenceTypeColumn.clickFirstRow()

            const cmsStubEvent = new oasys.Pages.Stub.CmsStubEvent()
            if (offender.event.eventDetails) {
                cmsStubEvent.setValues(offender.event.eventDetails, true)
            }
            cmsStubEvent.save.click()

            if (offender.event.sentenceDetails) {

                cmsStubEvent.sentenceDetail.click()
                enterSentenceDetails(cmsStubEvent, offender.event.sentenceDetails)
            }

            if (offender.event.offences) {

                cmsStubEvent.offences.click()
                enterOffences(cmsStubEvent, offender.event.offences)
            }

            cmsStubEvent.close.click()
        }

        if (offender.aliases) {

            maintainCmsStub.offenderAlias.click()
            enterAliases(maintainCmsStub, offender.aliases)
        }

        // Now create the offender record in OASys
        const offenderSearch = new oasys.Pages.Offender.OffenderSearch()
        offenderSearch.goto(true)
        offenderSearch.search.click()
        offenderSearch.searchCms.setValue('Yes')
        offenderSearch.probationCrn.setValue(offender.probationCrn)
        offenderSearch.search.click()

        new oasys.Pages.Offender.CmsSearchResults().cmsEventNumberColumn.clickFirstRow()
        new oasys.Pages.Offender.CmsOffenderDetails().createOffender.click()

        cy.log(`Created offender with PNC: ${offender.pnc}, surname: '${offender.surname}', forename: '${offender.forename1}', CRN: ${offender.probationCrn}, date of birth: ${offender.dateOfBirth}`)

        // Reinstate the NOMIS ID on the offender object
        if (nomisId != undefined) {
            offender.nomisId = nomisId
        }
    })

}

/**
 * Create a prison offender using the details provided in an Offender type object.
 * 
 * Any '#auto...' data items will be evaluated and updated in the object (without affecting the original instance of that object).
 * A Cypress alias is required to allow the test to refer to the updated object to access the evaluated data.
 * 
 * The object needs to include all mandatory items for a probation offender, but if there is no NOMISId property, a new one will be generated.
 * If there is a probation CRN this will be ignored.
 *  
 * Address lines 4 and 5 are automatically populated with the OASys version and test script name respectively.
 * 
 * The Cypress alias should be a string such as `offender1` but subsequent use requires the following code,
 * where the values are only available within a `cy.get().then()` structure (note the `@` symbol):
 * 
 * > `cy.get<Offender>('@offender1').then((offender) => {`  
 * > &nbsp;&nbsp;&nbsp;&nbsp;`cy.log(offender.probationCrn)`  
 * > `})`
 */
export function createPris(source: OffenderDef, alias: string) {

    // Get a copy of the offender data (to avoid changing it for other offenders in the same test based on the same source offender),
    let offender = JSON.parse(JSON.stringify(source)) as OffenderDef

    // Populate any null key fields (PNC, CRN, NOMIS ID and Surname).
    cy.task('populateAutoData', offender).as(alias)

    cy.get<OffenderDef>(`@${alias}`).then((offender) => {

        expect(offender).not.null  // null result would indicate errors checking the database
        offender.dateOfBirth = oasys.oasysDateAsString(offender.dateOfBirth) // Calculate date if a # value has been specified

        enterPrisonStubDetailsAndCreateReceptionEvent(offender)
        searchAndSelectByNomisId(offender.nomisId, true)

        cy.log(`Created offender with PNC: ${offender.pnc}, surname: '${offender.surname}', forename: '${offender.forename1}', NOMISId: ${offender.nomisId}, date of birth: ${offender.dateOfBirth}`)
    })
}

/**
 * Create a reception event for an offender.
 * The offender should already have been created in Probation with a Cypress alias, this alias (beginning with '@') is used as the parameter for this function.
 * 
 * The offender should already have a NOMIS Id, but no stub record.
 */
export function createReceptionEvent(offenderAlias: string) {

    cy.get<OffenderDef>(offenderAlias).then((offender) => {

        enterPrisonStubDetailsAndCreateReceptionEvent(offender)
        cy.log(`Created reception event for offender with PNC: ${offender.pnc}, surname: '${offender.surname}', NOMISId: ${offender.nomisId}`)
    })
}

/**
 * Enter prison offender details on the stub page, and trigger a reception event.
 */
export function enterPrisonStubDetailsAndCreateReceptionEvent(offender: OffenderDef) {

    // Delete the probation CRN if there is one to avoid attempting to populate it on the stub screen
    let crn: string
    if (offender.probationCrn != undefined) {
        crn = offender.probationCrn
        delete offender.probationCrn
    }
    const cmsStub = new oasys.Pages.Stub.CmsStub()
    cmsStub.goto(true)
    cmsStub.createStub.click()

    const cms = new oasys.Pages.Stub.MaintainCmsStub()

    let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
    if (stubDetails.event) delete stubDetails.event
    if (stubDetails.aliases) delete stubDetails.aliases

    cms.setValues(stubDetails, true)
    cy.get<string>('@appVersion').then((version) => {
        cms.addressLine4.setValue(version)
    })
    cms.addressLine5.setValue(Cypress.currentTest.title)

    // Set a default reception code if not defined in the offender
    if (offender.receptionCode == null) {
        cms.receptionCode.setValue('LATE RETURN (INVOLUNTARY)')
    }
    cms.save.click()

    if (offender.event != null) {

        cms.event.click()
        cms.sentenceTypeColumn.clickFirstRow()

        const cmsStubEvent = new oasys.Pages.Stub.CmsStubEvent()
        cmsStubEvent.setValues(offender.event.eventDetails, true)
        cmsStubEvent.save.click()

        if (offender.event.sentenceDetails != null) {
            cmsStubEvent.sentenceDetail.click()
            enterSentenceDetails(cmsStubEvent, offender.event.sentenceDetails)
        }

        if (offender.event.offences != null) {
            // Use first offence only for prison offenders if there is more than one
            let offence = offender.event.offences.constructor.name == 'Array' ? offender.event.offences[0] : offender.event.offences
            cmsStubEvent.offences.click()
            enterOffence(cmsStubEvent, offence)
        }

        cmsStubEvent.close.click()
    }

    if (offender.aliases != null) {
        cms.offenderAlias.click()
        enterAliases(cms, offender.aliases)
    }

    cms.receptionEvent.click()
    cy.contains('p', 'Are you sure you want to generate a reception event for this stub?')
    cy.get('#apexConfirmBtn').click()

    cms.save.click()
    cms.close.click()

    // Reinstate the crn on the offender object if there was one.
    if (crn != undefined) {
        offender.probationCrn = crn
    }
}

/**
 * Create a discharge event for an offender.
 * The offender should already have been created with a Cypress alias, this alias (beginning with '@') is used as the parameter for this function.
 * 
 * Assumes that there is already a CMS stub record.
 */
export function createDischargeEvent(offenderAlias: string) {

    cy.get<OffenderDef>(offenderAlias).then((offender) => {
        createDischargeEventForOffenderObject(offender)
    })
}

/**
 * Open an existing offender on the CMS stub, and generate a discharge event.
 */
export function createDischargeEventForOffenderObject(offender: OffenderDef) {

    openStubByNomisId(offender.nomisId)

    const cms = new oasys.Pages.Stub.MaintainCmsStub()
    cms.dischargeCode.setValue('END OF CUSTODY LICENCE')
    cms.releaseEvent.click()
    cy.contains('p', 'Are you sure you want to generate a release event for this stub?')
    cy.get('#apexConfirmBtn').click()

    cy.log(`Created discharge event for offender with PNC: ${offender.pnc}, surname: '${offender.surname}', NOMISId: ${offender.nomisId}`)
}

/**
 * Navigates to the CMS stub, searches for a NOMIS Id and opens the stub record
 */
export function openStubByNomisId(nomisId: string) {

    const cmsStub = new oasys.Pages.Stub.CmsStub()
    cmsStub.goto(true)
    cmsStub.nomisId.setValue(nomisId)
    cmsStub.search.click()
    cmsStub.nomisIdColumn.clickFirstRow()

    cy.log(`Opened stub record for ${nomisId}`)
}

/**
 * Add an existing offender to the stub (used when transferring to another probation provider).
 */
export function addProbationOffenderToStub(offender: OffenderDef) {

    const cmsStub = new oasys.Pages.Stub.CmsStub()
    cmsStub.goto(true)
    cmsStub.createStub.click()

    const maintainCmsStub = new oasys.Pages.Stub.MaintainCmsStub()

    let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
    if (stubDetails.event) delete stubDetails.event
    if (stubDetails.aliases) delete stubDetails.aliases
    if (stubDetails.nomisId) delete stubDetails.nomisId

    maintainCmsStub.setValues(stubDetails, true)
    cy.get<string>('@appVersion').then((version) => {
        maintainCmsStub.addressLine4.setValue(version)
    })
    maintainCmsStub.addressLine5.setValue(Cypress.currentTest.title)
    maintainCmsStub.save.click()
    maintainCmsStub.close.click()

    cy.log(`Added offender ${JSON.stringify(offender)} to stub`)
}

/**
 * Navigate to the Offender Search page, then search and select an offender by PNC.
 * 
 * Selects the first result if the search returns multiple rows.
 */
export function searchAndSelectByPnc(pnc: string, provider?: string) {

    const params = { pnc: pnc }
    if (provider != undefined) {
        params['provider'] = provider
    }
    offenderSearchAndSelect(params)
}

/**
 * Navigate to the Offender Search page, then search and select an offender by NOMIS Id.
 * 
 * Selects the first result if the search returns multiple rows.
 */
export function searchAndSelectByNomisId(nomisId: string, suppressLog: Boolean = false) {
    offenderSearchAndSelect({ prisonNomisNumber: nomisId }, suppressLog)
}

/**
 * Navigate to the Offender Search page, then search and select an offender by Probation CRN.
 * 
 * Selects the first result if the search returns multiple rows.
 */
export function searchAndSelectByCrn(crn: string) {
    offenderSearchAndSelect({ probationCrn: crn })
}

/**
 * Navigate to the Offender Search page, then search and select an offender by surname and optional first name.
 * 
 * Selects the first result if the search returns multiple rows.
 */
export function searchAndSelectByName(surname: string, forename: string = '') {
    offenderSearchAndSelect({ surname: surname, forename: forename })
}

/**
 * Navigate to the Offender Search page, search for the specified offender then select the first row in the result table.
 * 
 * Parameter can be either:
 * 
 * - a pre-defined Offender object, referred to by an alias name '@...'.  In this case it uses (in order of preference) the PNC, Probation CRN or NOMIS Id
 *     on the assumption that at least one of these has been set and is unique.
 * - a Values object containing name/value pairs, using the element names defined for the Offender Search page
 *
 * Selects the first result if the search returns multiple rows.
 */
export function searchAndSelect(alias: string): null
export function searchAndSelect(data: PageData): null
export function searchAndSelect(p1: string | PageData) {

    if (typeof p1 == 'string') {

        cy.get<OffenderDef>(p1).then((offender) => {

            if (offender.pnc != null) {
                offenderSearchAndSelect({ pnc: offender.pnc })
            }
            else if (offender.probationCrn != null) {
                offenderSearchAndSelect({ probationCrn: offender.probationCrn })
            }
            else if (offender.nomisId != null) {
                offenderSearchAndSelect({ prisonNomisNumber: offender.nomisId })
            }
        })
    }
    else {
        offenderSearchAndSelect(p1)
    }
}

function offenderSearchAndSelect(data: PageData, suppressLog: Boolean = false) {

    const offenderSearch = new oasys.Pages.Offender.OffenderSearch()

    offenderSearch.goto(true).setValues(data, true)
    offenderSearch.search.click()
    offenderSearch.surnameColumn.clickFirstRow()

    if (!suppressLog) cy.log(`Search and select offender: ${JSON.stringify(data)}`)
}

function enterSentenceDetails(cmsStubEvent: oasys.Pages.Stub.CmsStubEvent, sentenceDetails: SentenceDetails | SentenceDetails[]) {

    if (sentenceDetails.constructor.name == 'Array') {
        Array.prototype.forEach.call(sentenceDetails, ((sentenceDetail: SentenceDetails) => { enterSentenceDetail(cmsStubEvent, sentenceDetail) }))
    }
    else {
        enterSentenceDetail(cmsStubEvent, sentenceDetails as SentenceDetails)
    }
}

function enterSentenceDetail(cmsStubEvent: oasys.Pages.Stub.CmsStubEvent, sentenceDetails: SentenceDetails) {

    cmsStubEvent.createSentenceDetail.click()
    const cmsStubSentenceDetail = new oasys.Pages.Stub.CmsStubSentenceDetail()
    cmsStubSentenceDetail.setValues(sentenceDetails, true)
    cmsStubSentenceDetail.save.click()
    cmsStubSentenceDetail.close.click()
}

function enterOffences(cmsStubEvent: oasys.Pages.Stub.CmsStubEvent, offences: Offence | Offence[]) {

    if (offences.constructor.name == 'Array') {
        Array.prototype.forEach.call(offences, ((offence: Offence) => { enterOffence(cmsStubEvent, offence) }))
    }
    else {
        enterOffence(cmsStubEvent, offences as Offence)
    }
}

function enterOffence(cmsStubEvent: oasys.Pages.Stub.CmsStubEvent, offence: Offence) {

    cmsStubEvent.createOffence.click()
    const cmsStubOffence = new oasys.Pages.Stub.CmsStubOffence()
    cmsStubOffence.setValues(offence, true)
    cmsStubOffence.save.click()
    cmsStubOffence.close.click()
}

function enterAliases(maintainCMSStub: oasys.Pages.Stub.MaintainCmsStub, aliases: Alias | Alias[]) {

    if (aliases.constructor.name == 'Array') {
        Array.prototype.forEach.call(aliases, ((alias: Alias) => { enterAlias(maintainCMSStub, alias) }))
    }
    else {
        enterAlias(maintainCMSStub, aliases as Alias)
    }
}

function enterAlias(maintainCMSStub: oasys.Pages.Stub.MaintainCmsStub, alias: Alias) {

    maintainCMSStub.createAlias.click()
    const cmsStubAlias = new oasys.Pages.Stub.CmsStubAlias()
    cmsStubAlias.setValues(alias, true)
    cmsStubAlias.save.click()
    cmsStubAlias.close.click()
}

/**
 * Add a record in the IOM stub (using the configured address for the current environment). Sets the following values:
 *  - probation CRN
 *  - IOM (Y or N)
 *  - number of records
 *  - error type (OK/Record is not found/Forbidden/Internal Server Error)
 *  - MAPPA (Y or N)
 */
export function createIomStub(probationCrn: string, isIom: 'Y' | 'N', records: number,
    error: 'OK' | 'Record is not found' | 'Forbidden' | 'Internal Server Error', mappa: 'Y' | 'N' | '') {

    cy.visit(testEnvironment.iomStub)
    cy.wait(5000)
    const stub = new oasys.Pages.Offender.IomStub()
    stub.probationCrn.setValue(probationCrn)
    stub.isIom.setValue(isIom)
    stub.records.setValue(records.toString())
    stub.error.setValue(error)
    stub.mappa.setValue(mappa)

    stub.add.click()
    cy.log(`Added offender to IOM stub - CRN: ${probationCrn}, IOM: ${isIom}, number of records: ${records}, error code: ${error}, mappa: ${mappa}`)
}