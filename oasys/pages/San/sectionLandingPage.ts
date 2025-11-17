import { SanPage } from 'classes/san/sanPage'
import * as SanElement from 'classes/san/sanElements'

export class SectionLandingPage extends SanPage {

    name = ''
    title = ''

    menu: Menu = { type: 'San', level1: '' }

    information = new SanElement.Link('Information')
    analysis = new SanElement.Link('Practitioner analysis')

    constructor(section: SanSection) {
        super()
        this.name = section
        this.menu.level1 = section
        this.title = `${section} - Strengths and needs`
    }
}
