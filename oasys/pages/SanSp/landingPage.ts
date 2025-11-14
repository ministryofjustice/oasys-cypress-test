import { SanPage } from 'classes/san/sanPage'
import * as SanElement from 'classes/san/sanElements'

export class LandingPage extends SanPage {

    name = 'LandingPage'
    title = 'Remember to close any other applications'

    confirmCheck = new SanElement.Checkbox ('#confirm-privacy-checkbox')
    confirm = new SanElement.Button('confirm')
    returnToOASys = new SanElement.Link('Return to OASys')
}
