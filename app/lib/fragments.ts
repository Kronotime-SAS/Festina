// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    appliedGiftCards {
      lastCharacters
      amountUsed {
        ...Money
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
      nodes {
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

export const CHARACTERS_QUERY = `#graphql:rickAndMorty
  query {
    characters(page: 1) {
      results {
        name
        id
      }
    }
  }
`;

export const QUERY_ADMIN_API = `#graphql:adminAPI
  query {
    products(first: 20){
      edges{
        node{
          id
          title
        }
      }
    }
  }
`;

export const METAOBJECT_QUERY = `#graphql
  fragment image on Image{
    ...on Image {
      url
    }
  }
  fragment TypeFile on GenericFile{
    ...on GenericFile {
        alt
        url
    }
  }
  fragment TypeMediaImage on MediaImage{
    ...on MediaImage {
      alt
      image { 
        ...image
      }
    }
  }
  fragment Reference on MetafieldReference{
    ...TypeFile
    ...TypeMediaImage
  }
  fragment NodeMetafield on  MetafieldReferenceEdge{
    node{
      ...TypeMediaImage
    }
  }
  fragment MetaObjectField on MetaobjectField{
    ...on MetaobjectField{
      key
      reference {
        ...Reference
      }
      references(first:20) {
        edges{
          ...NodeMetafield
        }
      }
    }
  }

  fragment MetaObject on Metaobject{
    ...on Metaobject {
          fields {
            ...on MetaobjectField {
              key
              type
              reference{
                ...on Metaobject{
                  fields{
                    ...on MetaobjectField{
                      key
                    }
                  }
                }
              }
              references(first:20){
                edges{
                  node{
                    ...on Metaobject{
                      fields{
                        ...MetaObjectField
                      }
                    }
                  }
                }
              }
            }
          }  
        }
  }

  query MetaObject($id: ID){
    metaobject(id: $id) {
      type
      handle
      ...MetaObject
    }
  }
` as const;