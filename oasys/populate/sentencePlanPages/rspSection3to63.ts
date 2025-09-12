import * as oasys from 'oasys'
import * as AccreditedProgramme from './accreditedProgramme'


export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.RspSection3to63().goto(true)
    page.motivationChanged.setValue('Yes')
    page.capacityChanged.setValue('Yes')
    page.capacityChangedHow.setValue(maxStrings ? oasys.oasysString(4000) : 'How changed')
    page.workCarriedOut.setValue(maxStrings ? oasys.oasysString(4000) : 'Work carried out')
    page.workToIncrease.setValue(maxStrings ? oasys.oasysString(4000) : 'Work to increase motivation')
    page.inhibitingFactors.setValue(maxStrings ? oasys.oasysString(4000) : 'Inhibiting factors')
    page.positiveFactorsAchieved.setValue(maxStrings ? oasys.oasysString(4000) : 'Positive factors achieved')
    page.positiveFactorsToDevelop.setValue(maxStrings ? oasys.oasysString(4000) : 'Postive factors to develop')
    page.victimWorkDone.setValue(maxStrings ? oasys.oasysString(4000) : 'Victim work done')
    page.victimImpactAwareness.setValue(maxStrings ? oasys.oasysString(4000) : 'Victim impact awareness')
    page.discriminationWorkDone.setValue(maxStrings ? oasys.oasysString(4000) : 'Discrimination work done')
    page.discriminationWorkRequired.setValue(maxStrings ? oasys.oasysString(4000) : 'Discrimination work required')

    AccreditedProgramme.programme1()
    AccreditedProgramme.programme2()
}

