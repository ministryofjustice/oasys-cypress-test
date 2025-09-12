import * as oasys from 'oasys'

export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.Rosh.RoshFullAnalysisSection62().goto(true)
    page.what.setValue(maxStrings ? oasys.oasysString(4000) : '6.2  What')
    page.whereAndWhen.setValue(maxStrings ? oasys.oasysString(4000) : '6.2  WhereAndWhen')
    page.how.setValue(maxStrings ? oasys.oasysString(4000) : '6.2  How')
    page.victims.setValue(maxStrings ? oasys.oasysString(4000) : '6.2  Victims')
    page.anyoneElse.setValue(maxStrings ? oasys.oasysString(4000) : '6.2  AnyoneElse')
    page.why.setValue(maxStrings ? oasys.oasysString(4000) : '6.2  Why')
    page.sourcesOfInformation.setValue(maxStrings ? oasys.oasysString(4000) : '6.2 SourcesOfInformation')
}
