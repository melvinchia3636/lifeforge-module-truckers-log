import { createForgeContractBuilder } from '@lifeforge/server-utils'

import * as schema from './schema.drizzle'

const forge = createForgeContractBuilder({
  schema,
  modulePathAlias: 'ets2-record'
})

export default forge
