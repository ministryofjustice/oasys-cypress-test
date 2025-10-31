export const informalTest: Environment = {
    url: 'http://10.0.1.9:8080/ords/f?p=100',
    name: 'Informal test',
    database: {
        connection: '10.0.1.9:1521/xe.local',
        user: 'eor',
        password: 'eor'
    },
    rest: {
        clientId: 'eDe6OWafE9MK8jcEXSkO8Q..',
        clientSecret: 'eddeyvcnMwzRwSgxJpc67w..',
        baseUrl: 'https://10.0.1.9:8443/ords/oasys/'
    },
    iomStub: 'http://10.0.1.9:8100',
}

export const systemTest: Environment  = {
    url: 'http://10.0.1.22:8080/ords/f?p=100',
    name: 'System test',
    database: {
        connection: '10.0.1.22:1521/centos7.dbaora.com',
        user: 'eor',
        password: 'eor'
    },
    rest: {
        clientId: 'wAf6HycRZ-0WH7lhrrz9_A..',
        clientSecret: 'zi3O-uY7Rdn_zTBp1COzaQ..',
        baseUrl: 'https://10.0.1.22:8443/ords/oasys/'
    },
    iomStub: 'http://10.0.1.9:8100',
}
