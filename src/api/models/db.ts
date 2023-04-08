import dotenv from 'dotenv'
import { Pool } from 'pg'

// Configure process.env
dotenv.config()

// Get all the useful variables from the .env file
const {
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_USER,
    POSTGRES_DB
} = process.env

const Connection = new Pool({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    port: 5432,
})

export default Connection
