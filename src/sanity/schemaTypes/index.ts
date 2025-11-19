import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import characterDesign from './characterDesign'
import webdevelopement from './webdevelopement'
import logoBrandig from './logoBrandig'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,characterDesign,webdevelopement,logoBrandig],
}

