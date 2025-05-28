import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import { Profile } from '~/components/customer/Profile';
import { NavigationCustom } from '~/components/shared/Navigation/NavigationCustom';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Cliente no encontrado');
  }

  return json(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  console.log(customer);

  const heading = customer
    ? customer.firstName
      ? `Bienvenido, ${customer.firstName}`
      : `Bienvenido a tu cuenta.`
    : 'Detalles de la cuenta';

  return (
    <div className="account">
      <h1>{heading}</h1>
      <br />
      <AccountMenu />
      <br />
      <br />
      <Outlet context={{customer}} />
    </div>
  );
}

function AccountMenu() {
  

  return (
    <>
      <NavigationCustom menu={
        [
          {
            title: "Perfil",
            url: "/account/profile"
          },
          {
            title: "Ordenes",
            url: "/account/orders"
          },
          {
            title: "Direcciones",
            url: "/account/addresses"
          },
          {
            title: "logout",
            url: ""
          }
        ]
      } />
      <Profile/>
    </>
    
  );
}


