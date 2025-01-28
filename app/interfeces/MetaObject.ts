import { MetafieldReference, Node } from '@shopify/hydrogen/storefront-api-types';

interface Edges{
    node: NodeMetaObject
}

interface NodeMetaObject{
    fields: MetaObject
}

export interface MetaObject{
    key: string;
    type: string;
    reference: MetafieldReference;
    references: Edges[];
}



