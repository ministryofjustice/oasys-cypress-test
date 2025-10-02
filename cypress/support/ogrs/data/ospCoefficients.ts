import { Decimal } from 'decimal.js'

export const ospCoefficients = {
    osp_c: {
        OSPCIntercept: new Decimal(-8.216503478),
        OSPCFactor: new Decimal(0.2545385404),
        ospFemale: new Decimal(1).div(261),
    },
    osp_i: {
        OSPIFemale: new Decimal(0),
        OSPINoSanctions: new Decimal(0.000152),
        OSPITwoPlusIIOC: new Decimal(0.057949),
        OSPIOneIIOC: new Decimal(0.02805),
        OSPITwoPlusChildContact: new Decimal(0.007151),
        OSPIOneChildContact: new Decimal(0.003476),
        OSPIOthers: new Decimal(0.001061),
    }
}