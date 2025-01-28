import { Slides } from '~/interfeces/Slides';


export const objectDestructuring = (data: any) => {
    console.log(data);
    let arrayReturn: Slides[] = [];
    let { MetaObject: {
        metaobject: {
          fields: [
            {
              key,
              reference,
              references: {
                edges
              }
            }
          ]
        }
    } } = data;

    console.log(edges);
    console.log(key);
    

    switch(key){
       case "imagenes_slider":
        edges.map(({node}: any) => {
            let images: Slides = {
                banner_desk: "",
                banner_mobile: ""
            };

            if(node?.fields?.find( ({key}: {key: string}) => key == "banner_desk") != undefined){
                images.banner_desk = node?.fields?.find( ({key}: {key: string}) => key == "banner_desk")?.reference?.image?.url;
            }
            
            if(node?.fields?.find( ({key}: {key: string}) => key == "banner_mobile")){
                images.banner_mobile = node?.fields?.find( ({key}: {key: string}) => key == "banner_mobile")?.reference?.image?.url;
            }

            arrayReturn.push(images);
        })
        break;
    }

    
    

    return arrayReturn;
}