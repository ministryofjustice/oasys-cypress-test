import { Page } from 'classes/page'
import * as Element from 'classes/elements'

export class Login extends Page {
    name = 'Login'
    title = 'Login'

    username = new Element.Textbox('#P101_USERNAME')
    password = new Element.Textbox('#P101_PASSWORD')
    login = new Element.Button('#P101_LOGIN_BTN')
    forgotPassword = new Element.Button('#P101_FORGOT_PWD')
    errorMessageInvalidLogin = new Element.Text('Your logon attempt has been unsuccessful. Please contact your System Administrator')
}
