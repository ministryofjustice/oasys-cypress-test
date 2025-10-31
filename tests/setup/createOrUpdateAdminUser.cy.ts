import * as oasys from 'oasys'
import { standardPassword } from 'classes/user'

describe('Create or update admin user', () => {


    it('Create or update admin user', () => {

        // Check if user exists
        oasys.Db.selectCount(`select count(*) from oasys_user where oasys_user_code = '${oasys.Users.admin.username}'`, 'userCount')

        cy.get<number>('@userCount').then((userCount) => {
            let newUser = userCount == 0

            oasys.Users.adminProfiles.forEach((profile) => {

                oasys.login(oasys.Users.globalAdminUser, oasys.Users.globalAdminPassword, profile.provider)

                if (newUser) {
                    new oasys.Pages.Maintenance.UserAccounts().goto().createAccount.click()
                    const maintainUser = new oasys.Pages.Maintenance.MaintainUser()
                    maintainUser.userName.setValue(oasys.Users.admin.username)
                    maintainUser.surname.setValue(oasys.Users.admin.surname)
                    maintainUser.forename1.setValue(oasys.Users.admin.forename1)
                    maintainUser.emailAddress.setValue(`${oasys.Users.admin.username}@eor.local`)
                    maintainUser.save.click()
                    newUser = false
                } else {
                    // New account goes to profile automatically.  Open profile if editing existing user.
                    const userProfile = new oasys.Pages.Maintenance.UserProfile().goto()

                    userProfile.providerEstablishment.setValue('<All Provider / Establishments>')
                    userProfile.userName.setValue(oasys.Users.admin.username)
                    userProfile.surname.setValue('') 
                    userProfile.forename1.setValue('') 
                    userProfile.search.click()
                    userProfile.userNameColumn.clickFirstRow()
                }

                const maintainProfile = new oasys.Pages.Maintenance.MaintainFullUserProfile()
                maintainProfile.forename1.setValue(oasys.Users.admin.forename1)
                maintainProfile.surname.setValue(oasys.Users.admin.surname)
                maintainProfile.lau.setValueByIndex(1)
                maintainProfile.mainTeam.setValueByIndex(1)
                maintainProfile.frameworkRole.setValue(profile.frameworkRole)
                maintainProfile.defaultCountersigner.setValue(profile.defaultCountersigner?.lovLookup ?? '%')

                maintainProfile.roles.clickButton('removeall')
                maintainProfile.roles.addItems(profile.roles)

                maintainProfile.save.click()
                maintainProfile.close.click()

                oasys.logout()
            })

            oasys.Db.setPassword(oasys.Users.admin.username, standardPassword)
        })
    })
})
