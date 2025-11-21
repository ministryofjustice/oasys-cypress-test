export class CheckboxGroup<T extends string> {

    selector: string
    options: (T | '-')[]

    constructor(selector: string, options: (T | '-')[]) {

        this.selector = selector
        this.options = options
    }

    setValue(values: T[]) {

        for (let i = 0; i < this.options.length; i++) {
            const itemSuffix = i == 0 ? '' : `-${i + 1}`

            if (this.options[i] != '-') {   // '-' is used as a separator in the list of IDs
                if (values.includes(this.options[i] as T)) {
                    cy.get(`${this.selector}${itemSuffix}`).check()
                } else {
                    cy.get(`${this.selector}${itemSuffix}`).uncheck()
                }
            }
        }
    }
}

