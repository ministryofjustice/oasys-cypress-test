declare type Environment = {
    url: string,
    name: string,
    database: {
        connection: string,
        user: string,
        password: string
    },
    rest: {
        clientId: string,
        clientSecret: string,
        baseUrl: string
    },
    iomStub: string,
}
