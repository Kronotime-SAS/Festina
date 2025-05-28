
import { Form, NavLink } from '@remix-run/react';

interface Menu{
    title: string;
    url: string;
}

interface MenuCustom {
    menu: Menu[];
}

export const NavigationCustom: React.FC<MenuCustom> = ({ menu }) => {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (
   <ul>
        {
            menu?.map(
                (item, index) => (
                    
                    <li key={index}>
                        {
                            item.title == "logout"?
                                <Form className="account-logout" method="POST" action="/account/logout">
                                    &nbsp;<button type="submit" style={{"cursor":"pointer"}}>Cerrar Sesión</button>
                                </Form>
                            :
                                <NavLink to={item.url} style={isActiveStyle}>{item.title}</NavLink>
                        }
                        
                    </li>
                )
            )
        }
   </ul> 
  )
}


