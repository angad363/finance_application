import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import plaid from "./plaid";

import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import accounts from './accounts';
import categories from "./categories";
import transactions from "./transactions"
import summary from "./summary";
import subscriptions from "./subscriptions";

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

const routes = app
    .route("/plaid", plaid)
    .route("/summary", summary)
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/transactions", transactions)
    .route("/subscriptions", subscriptions)


export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;