import * as oasys from 'oasys'

export function minimal(withDateFirstSanction: boolean = true) {

    const page = new oasys.Pages.Assessment.RoshaPredictors()
    page.goto(true)
    if (withDateFirstSanction) {
        page.dateFirstSanction.setValue({ years: -2 })
    }
    page.o1_32.setValue('1')
    page.o1_40.setValue(0)
    page.o1_29.setValue({ days: -7 })
    page.o1_30.setValue('No')
    page.o1_38.setValue({ months: 18 })
}

export function fullyPopulated(withDateFirstSanction: boolean = true) {

    const page = new oasys.Pages.Assessment.RoshaPredictors()
    page.goto(true)
    if (withDateFirstSanction) {
        page.dateFirstSanction.setValue({ years: -2 })
    }
    page.o1_32.setValue('5')
    page.o1_40.setValue('1')
    page.o1_29.setValue({ days: -7 })
    page.o1_30.setValue('Yes')
    page.o1_41.setValue('Yes')
    page.o1_44.setValue('Yes')
    page.o1_33.setValue({ years: -5 })
    page.o1_34.setValue('0')
    page.o1_45.setValue('0')
    page.o1_46.setValue('0')
    page.o1_37.setValue('2')
    page.o1_38.setValue({ months: 18 })
    page.o1_39.setValue('Yes')
    page.o2_2.setValue('Yes')
    page.o2_2Weapon.setValue('A knife')
    page.o3_4.setValue('1-Some problems')
    page.o4_2.setValue('2-Yes')
    page.o6_4.setValue('2-Significant problems')
    page.o6_7.setValue('Yes')
    page.o6_7VictimPartner.setValue('No')
    page.o6_7VictimFamily.setValue('Yes')
    page.o6_7PerpetratorPartner.setValue('No')
    page.o6_7PerpetratorFamily.setValue('No')
    page.o6_8.setValue('In a relationship, living together')
    page.o7_2.setValue('1-Some problems')
    page.o8_1.setValue('No')
    page.o9_1.setValue('1-Some problems')
    page.o9_2.setValue('0-No problems')
    page.o11_2.setValue('0-No problems')
    page.o11_4.setValue('1-Some problems')
    page.o12_1.setValue('1-Some problems')
}