import * as oasys from 'oasys'

export function fullyPopulated(params?: PopulateAssessmentParams) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection8().goto(true)
    page.concernsSuicide.setValue('Yes')
    page.concernsSelfHarm.setValue('Yes')
    page.suicideHarmDetails.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'SuicideHarmDetails')
    if (params?.provider == 'pris') {
        page.acct.setValue('Yes')
    }
    page.bookNumber.setValue(params?.maxStrings ? oasys.oasysString(32) : 'BookNumber')
    page.concernsSuicidePast.setValue('Yes')
    page.concernsSelfHarmPast.setValue('Yes')
    page.suicideHarmDetailsPast.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'SuicideHarmDetailsPast')
    page.concernsCustody.setValue('Yes')
    page.concernsHostel.setValue('Yes')
    page.custodyHostelDetails.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'CustodyHostelDetails')
    page.concernsCustodyPrevious.setValue('Yes')
    page.concernsHostelPrevious.setValue('Yes')
    page.custodyHostelDetailsPrevious.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'CustodyHostelDetailsPrevious')
    page.concernsVulnerability.setValue('Yes')
    page.vulnerabilityDetails.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'VulnerabilityDetails')
    page.concernsVulnerabilityPrevious.setValue('Yes')
    page.vulnerabilityDetailsPrevious.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'VulnerabilityDetailsPrevious')
    page.roshOthers.setValue('Yes')
    page.riskDetails.setValue(params?.maxStrings ? oasys.oasysString(4000) : 'RiskDetails')
}
