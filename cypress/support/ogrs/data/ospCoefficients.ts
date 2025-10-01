import { Decimal } from 'decimal.js'

export const ospCoefficients = {
    osp_c: {
        OSPCYear1Intercept: new Decimal(-8.817398615),
        OSPCYear2Intercept: new Decimal(-8.216503478),
        OSPCYear1Factor: new Decimal(0.2545385404),
        OSPCYear2Factor: new Decimal(0.2545385404),
        ospFemale: new Decimal(1).div(261),
    },
    osp_i: {
        OSPI1Female: new Decimal(0),
        OSPI2Female: new Decimal(0),
        OSPI1NoSanctions: new Decimal(9.8E-05),
        OSPI2NoSanctions: new Decimal(0.000152),
        OSPI1TwoPlusIIOC: new Decimal(0.038087),
        OSPI2TwoPlusIIOC: new Decimal(0.057949),
        OSPI1OneIIOC: new Decimal(0.018237),
        OSPI2OneIIOC: new Decimal(0.02805),
        OSPI1TwoPlusChildContact: new Decimal(0.004615),
        OSPI2TwoPlusChildContact: new Decimal(0.007151),
        OSPI1OneChildContact: new Decimal(0.00224),
        OSPI2OneChildContact: new Decimal(0.003476),
        OSPI1Others: new Decimal(0.000683),
        OSPI2Others: new Decimal(0.001061),
    }
}