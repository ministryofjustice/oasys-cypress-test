import * as oasys from 'oasys'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection61().goto(true)
    page.what.setValue(maxStrings ? oasys.oasysString(4000) : '6.1 What')
    page.whereAndWhen.setValue('6.1 WhereAndWhen')
    page.how.setValue(maxStrings ? oasys.oasysString(4000) : '6.1 How')
    page.victims.setValue(maxStrings ? oasys.oasysString(4000) : '6.1 Victims')
    page.anyoneElse.setValue(maxStrings ? oasys.oasysString(4000) : '6.1 AnyoneElse')
    page.why.setValue(maxStrings ? oasys.oasysString(4000) : '6.1 Why')
    page.sourcesOfInformation.setValue(maxStrings ? oasys.oasysString(4000) : '6.1 SourcesOfInformation')
}
