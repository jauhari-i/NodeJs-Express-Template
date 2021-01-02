import { getConfig } from '../config/global_config'
import { createPool } from 'mysql'
const mysqlConfig = getConfig('/mysqlConfig')

const db = createPool({
  connectionLimit: mysqlConfig.connectionLimit,
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
})

export { db }
