import { User } from 'classes/user'

/**
 * Defines a standard set of users and providers for regression testing
 *
 * NOTE add new users to the list at the bottom, then run the createOrUpdateUsers script for user setup.
 * The separate createOrUpdateAdminUser script will create or update the admin user profiles.
 * 
 * All users will be configured to use the first LAU and Team in the select lists.
 * 
*/

/**
 * Roles required:
 * 
 *  - Sys Admin (Central)
 *  - NPS Assessor
 *  - HMPS Assessor
 *  - Trainer
 *  - SARA
 *  - SAN Service
 *  - Case Admin Prison
 */

/////////////// Providers //////////////
export const probationNonSan = 'Bedfordshire'
export const probationNonSanCode = 'BED'
export const probationSan = 'Durham'
export const probationSanCode = 'DRH'
export const prisonNonSan = 'Kirklevington (HMP)'
export const prisonNonSanCode = '680'
export const prisonSan = 'Altcourse (HMP)'
export const prisonSanCode = '520'

///////////// GLOBAL ADMIN //////
// This user is used only for setting up the admin users that will be used by Cypress
export const globalAdminUser = 'OASYS_ADMIN'
export const globalAdminPassword = 'password'


/**
 * AUTOADMIN-xx
 *   - Forename/surname: Autotest Testing-xx
 *   - Roles: Sys Admin (Central)
 */
export const admin: User = new User({ username: 'AUTOADMIN', forename1: 'Autotest', surname: 'ADMIN' })

export const adminProfiles: { provider: string, frameworkRole: FrameworkRole, defaultCountersigner: User, roles: string[] }[] = [
    { provider: probationNonSan, frameworkRole: 'Not Allocated', defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
    { provider: probationSan, frameworkRole: 'Not Allocated', defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
    { provider: prisonNonSan, frameworkRole: 'Not Allocated', defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
    { provider: prisonSan, frameworkRole: 'Not Allocated', defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
]


///////////// PROBATION NON-SAN /////////////

/**
 * AUTOHEADPDU-xx
 *   - Forename/surname: Autotest HEADPDU-xx
 *   - Framework role: Head of PDU
 *   - Provider: Probation non-SAN
 *   - Default countersigner: none
 *   - Roles: NPS Assessor, Trainer, SARA
 */
export const probHeadPdu: User = new User(
    { username: 'AUTOHEADPDU', forename1: 'Autotest', surname: 'HEADPDU' },
    { provider: probationNonSan, frameworkRole: 'Head of PDU', defaultCountersigner: null, roles: ['NPS Assessor', 'Trainer', 'SARA'] }
)

/**
 * AUTOPSO-xx
 *   - Forename/surname: Autotest PSO-xx
 *   - Framework role: Approved PSO, approved PQiP, NQO or unapproved PO
 *   - Provider: Probation non-SAN
 *   - Default countersigner: none
 *   - Roles: NPS Assessor, Trainer
 */
export const probPso: User = new User(
    { username: 'AUTOPSO', forename1: 'Autotest', surname: 'PSO' },
    { provider: probationNonSan, frameworkRole: 'Approved PSO, approved PQiP, NQO or unapproved PO', defaultCountersigner: null, roles: ['NPS Assessor', 'Trainer'] }
)


///////////// PRISON NON-SAN /////////////

/**
 * AUTOHOMDS-xx
 *   - Forename/surname: Autotest HOMDS-xx
 *   - Framework role: HOMDs
 *   - Provider: Prison non-SAN
 *   - Default countersigner: none
 *   - Roles: HMPS Assessor, Trainer
 */
export const prisHomds: User = new User(
    { username: 'AUTOHOMDS', forename1: 'Autotest', surname: 'HOMDS' },
    { provider: prisonNonSan, frameworkRole: 'HOMDs', defaultCountersigner: null, roles: ['HMPS Assessor', 'Trainer'] }
)


///////////// PROBATION SAN /////////////

/**
 * AUTOSANHEADPDU-xx
 *   - Forename/surname: Autotest SanUserTwo-xx
 *   - Framework role: Head of PDU
 *   - Provider: Probation SAN
 *   - Default countersigner: none
 *   - Roles: NPS Assessor, SAN Service, Trainer
 */
export const probSanHeadPdu: User = new User(
    { username: 'AUTOSANHEADPDU', forename1: 'Autotest', surname: 'SANHEADPDU' },
    { provider: probationSan, frameworkRole: 'Head of PDU', defaultCountersigner: null, roles: ['NPS Assessor', 'SAN Service', 'Trainer'] })

/**
 * AUTOSANPO-xx
 *   - Forename/surname: Autotest SanUserFour-xx
 *   - Framework role: Approved PO
 *   - Provider: Probation SAN
 *   - Default countersigner: none
 *   - Roles: NPS Assessor, SAN Service, SARA, Trainer
 */
export const probSanPo: User = new User(
    { username: 'AUTOSANPO', forename1: 'Autotest', surname: 'SANPO' },
    { provider: probationSan, frameworkRole: 'Approved PO', defaultCountersigner: null, roles: ['NPS Assessor', 'SAN Service', 'SARA', 'Trainer'] }
)

/**
 * AUTOSANPSO-xx
 *   - Forename/surname: Autotest SANPSO-xx
 *   - Framework role: Approved PSO, approved PQiP, NQO or unapproved PO
 *   - Provider: Probation SAN
 *   - Default countersigner: sanPo (AUTOSANPO-xx)
 *   - Roles: NPS Assessor, SAN Service, Trainer
 */
export const probSanPso: User = new User(
    { username: 'AUTOSANPSO', forename1: 'Autotest', surname: 'SANPSO' },
    { provider: probationSan, frameworkRole: 'Approved PSO, approved PQiP, NQO or unapproved PO', defaultCountersigner: probSanPo, roles: ['NPS Assessor', 'SAN Service', 'Trainer'] }
)

/**
 * AUTOSANUNAPPR-xx
 *   - Forename/surname: Autotest SANUNAPPR-xx
 *   - Framework role: Unapproved PSO & unapproved PQiP
 *   - Provider: Probation SAN
 *   - Default countersigner: none
 *   - Roles: NPS Assessor, SAN Service, Trainer
 */
export const probSanUnappr: User = new User(
    { username: 'AUTOSANUNAPPR', forename1: 'Autotest', surname: 'SANUNAPPR' },
    { provider: probationSan, frameworkRole: 'Unapproved PSO & unapproved PQiP', defaultCountersigner: null, roles: ['NPS Assessor', 'SAN Service', 'Trainer'] })


///////////// PRISON SAN /////////////

/**
 * AUTOSANPRISHOMDS-xx
 *   - Forename/surname: Autotest AutoPrisonSanThree-xx
 *   - Framework role: HOMDs
 *   - Provider: Prison SAN
 *   - Default countersigner: none
 *   - Roles: HMPS Assessor, SAN Service, Trainer
 */
export const prisSanHomds: User = new User(
    { username: 'AUTOSANPRISHOMDS', forename1: 'Autotest', surname: 'SANPRISHOMDS' },
    { provider: prisonSan, frameworkRole: 'HOMDs', defaultCountersigner: null, roles: ['HMPS Assessor', 'SAN Service', 'Trainer'] }
)

/**
 * AUTOSANPRISPOM-xx
 *   - Forename/surname: Autotest AutoPrisonSanTwo-xx
 *   - Framework role: Approved Prison POM, approved PQiP, NQO or unapproved Probation POM
 *   - Provider: Prison SAN
 *   - Default countersigner: sanPrisHomds (AUTOSANPRISHOMDS-xx)
 *   - Roles: HMPS Assessor, SAN Service, Trainer
 */
export const prisSanPom: User = new User(
    { username: 'AUTOSANPRISPOM', forename1: 'Autotest', surname: 'SANPRISPOM' },
    {
        provider: prisonSan, frameworkRole: 'Approved Prison POM, approved PQiP, NQO or unapproved Probation POM',
        defaultCountersigner: prisSanHomds, roles: ['HMPS Assessor', 'SAN Service', 'Trainer']
    }
)

/**
 * AUTOSANPRISUNAPPR-xx
 *   - Forename/surname: Autotest SANPRISUNAPPR-xx
 *   - Framework role: Unapproved Prison POM & unapproved PQiP
 *   - Provider: Prison SAN
 *   - Default countersigner: sanPrisPom (AUTOSANPRISPOM-xx)
 *   - Roles: HMPS Assessor, SAN Service, Trainer
 */
export const prisSanUnappr: User = new User(
    { username: 'AUTOSANPRISUNAPPR', forename1: 'Autotest', surname: 'SANPRISUNAPPR' },
    { provider: prisonSan, frameworkRole: 'Unapproved Prison POM & unapproved PQiP', defaultCountersigner: prisSanPom, roles: ['HMPS Assessor', 'SAN Service', 'Trainer'] }
)

/**
 * AUTOSANPRISCADM-xx
 *   - Forename/surname: Autotest SANCADM-xx
 *   - Framework role: Not Allocated
 *   - Provider: Prison SAN
 *   - Default countersigner: none
 *   - Roles: Case Admin Prison, Trainer
 */
export const prisSanCAdm: User = new User(
    { username: 'AUTOSANPRISCADM', forename1: 'Autotest', surname: 'SANPRISCADM' },
    { provider: prisonSan, frameworkRole: 'Not Allocated', defaultCountersigner: null, roles: ['Case Admin Prison', 'Trainer'] }
)

// List of users used by create/update script
export const userList: User[] = [
    probHeadPdu,
    probPso,
    prisHomds,
    probSanHeadPdu,
    probSanPo,
    probSanPso,
    probSanUnappr,
    prisSanHomds,
    prisSanPom,
    prisSanUnappr,
    prisSanCAdm
]