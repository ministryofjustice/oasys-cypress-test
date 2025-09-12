import * as oasys from 'oasys'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection9().goto(true)
    page.concernsEscape.setValue('Yes')
    page.concernsEscapeDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'ConcernsEscapeDetails')
    page.concernsEscapePrevious.setValue('Yes')
    page.concernsEscapePreviousDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'ConcernsEscapePreviousDetails')
    page.concernsControl.setValue('Yes')
    page.concernsControlDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'ConcernsControlDetails')
    page.concernsControlPrevious.setValue('Yes')
    page.concernsControlPreviousDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'ConcernsControlPreviousDetails')
    page.concernsTrust.setValue('Yes')
    page.concernsTrustDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'ConcernsTrustDetails')
    page.concernsTrustPrevious.setValue('Yes')
    page.concernsTrustPreviousDetails.setValue(maxStrings ? oasys.oasysString(4000) : 'ConcernsTrustPreviousDetails')
}
