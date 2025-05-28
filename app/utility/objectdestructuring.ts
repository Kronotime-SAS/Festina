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
    

    switch(key){
       case "imagenes_slider":
        edges.map(({node}: any) => {
            let images: Slides = {
                banner_desk: "",
                banner_mobile: "",
                url: "",
                order: 0,
            };

            console.log("aqui estoy reset valores en imagen slider")

            console.log(node);

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