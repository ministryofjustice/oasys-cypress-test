import * as oasys from 'oasys'


export function fullyPopulated(maxStrings: boolean = false) {

    const page = new oasys.Pages.SentencePlan.RspSection1to2().goto(true)
    page.reviewNumber.setValue(1)
    page.reviewDate.setValue({})
    page.typeOfAssessment.setValue('Transfer')
    page.transferDate.setValue({ months: 1 })
    page.rp7.setValue('Yes')
    page.rp8.setValue('No')
    page.rp9.setValue('1')
    page.rp10.setValue('55')
    page.rp11.setValue('Yes')
    page.rp12.setValue('No')
    page.rp13.setValue('Yes')
    page.rp14.setValue('No')
    page.rp15.setValue('Yes')
    page.rp16.setValue('No')
    page.rp17.setValue('Yes')
    page.rp18.setValue('No')
    page.rp19.setValue('Standard')
    page.rp20.setValue(maxStrings ? oasys.oasysString(4000) : 'Incentive level details')
    page.rp21.setValue('Yes')
    page.rp22.setValue('No')
    page.rp23.setValue('Yes')
    page.rp24.setValue(maxStrings ? oasys.oasysString(4000) : 'Further offences details')
    page.rp25.setValue('Yes')
}
