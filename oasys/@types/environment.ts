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
    standardUserPassword: string,
    globalAdminUserPassword: string,
}

declare type AppConfig = {

    versionHistory: AppVersion[],
    probForceCrn: boolean,
    significantReleaseDates: SignificantReleaseDates,
    offences: {},
}

declare type AppVersion = {
    version: string,
    date: string,
}

declare type SignificantReleaseDates = {
    r6_20: PlainDate,
    r6_30: PlainDate,
    r6_35: PlainDate,
}