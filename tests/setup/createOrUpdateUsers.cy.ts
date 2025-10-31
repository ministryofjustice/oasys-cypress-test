import * as oasys from 'oasys'
import { User, standardPassword } from 'classes/user'

describe('Create or update users', () => {



    it('Create or update users', () => {

        // NOTE: Admin user is handled by a separate script.

        for (const user of oasys.Users.userList) {
            createOrUpdateUser(user)
        }

    })
})

function createOrUpdateUser(user: User) {

    if (user.profile) {
        oasys.login(oasys.Users.admin, user.profile.provider)
        const userAccounts = new oasys.Pages.Maintenance.UserAccounts().goto()
        userAccounts.userName.setValue(user.username)
        userAccounts.search.click()
        userAccounts.userNameColumn.getCount('rows')

        cy.get<number>('@rows').then((rows) => {
            // Create or edit user account details
            const maintainUser = new oasys.Pages.Maintenance.MaintainUser()
            if (rows == 0) {
                userAccounts.createAccount.click()
                maintainUser.userName.setValue(user.username)
            } else {
                userAccounts.userNameColumn.clickFirstRow()
            }
            maintainUser.surname.setValue(user.surname)
            maintainUser.forename1.setValue(user.forename1)
            maintainUser.emailAddress.setValue(`${user.username}@eor.local`)
            maintainUser.save.click()

            // New account goes to profile automatically.  Open profile if editing existing user.
            if (rows > 0) {
                maintainUser.close.click()
                const userProfile = new oasys.Pages.Maintenance.UserProfile().goto()
                userProfile.userName.setValue(user.username)
                userProfile.surname.setValue('') 
                userProfile.forename1.setValue('')
                userProfile.search.click()
                userProfile.userNameColumn.clickFirstRow()
            }

            const maintainProfile = new oasys.Pages.Maintenance.MaintainFullUserProfile()
            maintainProfile.lau.setValueByIndex(1)
            maintainProfile.mainTeam.setValueByIndex(1)
            maintainProfile.frameworkRole.setValue(user.profile.frameworkRole)
            maintainProfile.defaultCountersigner.setValue(user.profile.defaultCountersigner?.lovLookup ?? '%')

            maintainProfile.roles.clickButton('removeall')
            maintainProfile.roles.addItems(user.profile.roles)

            maintainProfile.save.click()
            maintainProfile.close.click()
            oasys.logout()

            oasys.Db.setPassword(user.username, standardPassword)
        })
    }

}
