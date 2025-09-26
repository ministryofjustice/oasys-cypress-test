import { defineConfig } from 'cypress'
import { populateAutoData } from './cypress/support/autoData'
import * as oasysDb from './cypress/support/oasysDb'
import * as restApi from './cypress/support/restApi'
import * as restApiDb from './cypress/support/restApiDb'
import { DbOffenderWithAssessments } from 'restApi/dbClasses'
import * as fs from 'fs-extra'
import * as pdf from './cypress/support/pdf'
import { getLatestElogAndUnprocEventTime } from './cypress/support/oasysDb'
import { noDatabaseConnection } from './localSettings'
import { ogrsTest, OgrsTestParameters, OgrsTestScriptResult } from './cypress/support/ogrs/orgsTest'

const reportFolder = 'report'
const persistedData = {}

module.exports = defineConfig({

  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: reportFolder,
    overwrite: false,
    html: false,
    json: true,
  },
  screenshotOnRunFailure: true,
  screenshotsFolder: 'report/screenshots',
  numTestsKeptInMemory: 0,
  redirectionLimit: 200,

  e2e: {
    watchForFileChanges: false,
    experimentalInteractiveRunEvents: true,
    specPattern: 'tests/',
    redirectionLimit: 500,
    video: false,
    chromeWebSecurity: false,
    fixturesFolder: 'tests/data',

    setupNodeEvents(on, config) {

      on('task', {

        /**
         * Populate an object with generated data.  Returns null if there's a database error when generating values.
         */
        populateAutoData(off: OffenderDef): Promise<object> {

          return new Promise((resolve) => {
            populateAutoData(off).then((success) => {
              if (success) resolve(off)
              else resolve(null)
            })
          })
        },

        /**
         * Get the current application version number from the database. Returns a DbResponse type object including the version or error message.
         */
        getAppVersion(): Promise<DbResponse> {

          return new Promise((resolve) => {
            const query = `select version_number from system_config where cm_release_type_elm = 'APPLICATION' order by release_date desc fetch first 1 row only`
            oasysDb.selectSingleValue(query).then((result) => {
              resolve(result)
            })
          })
        },

        /**
         * Run a query to return data from the database. Returns a DbResponse type object including the a 2-d string array or error message.
         */
        getData(query: string): Promise<DbResponse> {

          return new Promise((resolve) => {
            oasysDb.selectData(query).then((result) => {
              resolve(result)
            })
          })
        },

        /**
         * Run a query to return a row from the database. Returns a DbResponse type object including the count or error message.
         */
        selectCount(query: string): Promise<DbResponse> {

          return new Promise((resolve) => {
            oasysDb.selectCount(query).then((result) => {
              resolve(result)
            })
          })
        },

        /**
         * Set the password for a user, and activate the profile.
         */
        setPassword(user: { username: string, password: string }) {

          return new Promise((resolve) => {
            oasysDb.setPassword(user.username, user.password).then((result) => {
              resolve(result)
            })
          })
        },

        /**
         * Run a query to return a single value from the database. Returns a DbResponse type object including the value or error message.
         */
        getValue(query: string): Promise<DbResponse> {

          return new Promise((resolve) => {
            oasysDb.selectSingleValue(query).then((result) => {
              resolve(result)
            })
          })
        },

        /**
         * Call a RestAPI endpoint defined by the EndpointParams object, and return a RestResponse object including the return data, status and messages.
         */
        getRestData(parameters: EndpointParams): Promise<RestResponse> {

          return new Promise((resolve) => {
            restApi.getRestData(parameters).then((response) => {
              resolve(response)
            })
          })
        },

        /**
         * Call multiple RestAPI endpoints defined by the EndpointParams object array, and return a RestResponse object array including the return data, status and messages for each.
         */
        getMultipleRestData(parameters: EndpointParams[]): Promise<RestResponse[]> {

          return new Promise((resolve) => {
            restApi.getMultipleRestData(parameters).then((response) => {
              resolve(response)
            })
          })
        },

        /**
         * Get the data required to generate an expected set of RestAPI endpoint responses for an offender.
         */
        getOffenderWithAssessments(crnDetails: { crnSource: 'pris' | 'prob', crn: string }): Promise<DbOffenderWithAssessments> {

          return new Promise((resolve) => {
            restApiDb.getOffenderWithAssessments(crnDetails).then((response) => {
              resolve(response)
            })
          })
        },

        /** 
         * Wait for a PDF to download, then return the filename and text contents.  Parameter is a trigger function to initiate the PDF download.
         */
        startPdfWatcher() {
          pdf.startPdfWatcher()
          return null
        },

        /** 
         * Wait for a PDF to download, then return the filename and text contents.  Parameter is a trigger function to initiate the PDF download.
         */
        getPdf(): Promise<{ filename: string, contents: string[] }> {

          return new Promise((resolve) => {
            pdf.getPdf().then((response) => {
              resolve(response)
            })
          })
        },

        /** 
         * Write a message to the console
         */
        consoleLog(message: string) {

          console.log(message)
          return null
        },

        /**
         * Save a value for later use in a different spec file during the same test run.  Specified as an object containing key and value (string)
         */
        storeValue(item: { key: string, value: string }) {
          persistedData[item.key] = item.value
          return null
        },

        /**
         * Retrieve a value by key
         */
        retrieveValue(key: string): Promise<string> {
          return new Promise((resolve) => {
            resolve(persistedData[key] ?? null)
          })
        },

        ogrsAssessmentCalcTest(parameters: OgrsTestParameters): Promise<OgrsTestScriptResult> {
          return new Promise((resolve) => {
            ogrsTest(parameters).then((response) => {
              resolve(response)
            })
          })
        }

      })

      on('before:run', (details) => {
        if (!noDatabaseConnection) {
          getLatestElogAndUnprocEventTime('store')
        }
        fs.remove(reportFolder)
      })

      on('after:run', (results) => {
        if (!noDatabaseConnection) {
          getLatestElogAndUnprocEventTime('check').then(() => {
            oasysDb.closeConnection()
          })
        }
      })

      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.preferences.default = { plugins: { always_open_pdf_externally: true } }
        // launchOptions.args.push('--disable-features=OptimizationGuideModelDownloading,OptimizationHintsFetching,OptimizationTargetPrediction,OptimizationHints')
        // launchOptions.args.push('--js-flags="--max_old_space_size=1024 --max_semi_space_size=1024"')
        return launchOptions
      })
    },
  },
})

