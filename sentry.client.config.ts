// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.3,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay(),
    new CaptureConsoleIntegration({
      // array of methods that should be captured
      // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
      levels: ['error'],
    }),
  ],
  ignoreErrors: ['User rejected the request'],
  beforeSend(event) {
    try {
      //Ignore errors from chrome extension
      if (
        event.exception?.values &&
        event.exception.values[0].stacktrace &&
        event.exception.values[0].stacktrace.frames &&
        event.exception.values[0].stacktrace.frames[0].filename &&
        event.exception.values[0].stacktrace.frames[0].filename.includes(
          'app://inject'
        )
      ) {
        return null
      }
    } catch (e) {}

    return event
  },
})
