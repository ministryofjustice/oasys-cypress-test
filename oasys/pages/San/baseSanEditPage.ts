import { SanPage } from 'classes/san/sanPage'
import * as SanElement from 'classes/san/sanElements'

export class BaseSanEditPage extends SanPage {

    name = 'BaseSanEditPage'

    saveAndContinue = new SanElement.Button('YES')

}
