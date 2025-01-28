import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import { Suspense, useRef, useState, useEffect } from 'react';
import {Image, Money} from '@shopify/hydrogen';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {METAOBJECT_QUERY} from '~/lib/fragments';
import { objectDestructuring } from '~/utility/objectdestructuring';
import { MetaObject } from '~/interfeces/MetaObject';
import { Slides } from '~/interfeces/Slides';
import {Autoplay, Pagination, Navigation} from 'swiper/modules';
import Icon from '~/components/shared/Icon';




export const meta: MetaFunction = () => {
  return [{title: 'Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}, MetaObject] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
    context.storefront.query(METAOBJECT_QUERY, {
      cache: context.storefront.CacheLong(),
      variables: {
        id: context.env.METAOBJECT_ID, // Adjust to your header menu handle
      },
    })
  ]);

  return {
    featuredCollection: collections.nodes[0],
    MetaObject
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}



export default function Homepage() {
  

  const data = useLoaderData<typeof loader>();
  const imagesBanner = objectDestructuring(data);
  console.log("cuantas veces recorre el home")
  console.log(imagesBanner);

  

  return (
    <div className="w-full">
      <SliderBanner slides={imagesBanner} />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}



function SliderBanner({
  slides
}:{
  slides: Slides[]
}){

  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    480: {
      slidesPerView: 1.5,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1800: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  };

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    swiperRef.current = swiperRef.current && swiperRef.current.swiper;
  }, []);

  const handlePrevClick = () => {
    console.log("Prev")
    console.log(swiperRef.current)
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };
  
  const handleNextClick = () => {
    console.log("Next");
    console.log(swiperRef.current)
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className='relative '>
      <Swiper
        ref={swiperRef}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }} 
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        touchRatio={1} // Sensibilidad del drag
        simulateTouch={true} // Habilita interacción táctil
        touchStartPreventDefault={true} // Previene eventos de toque predeterminados
        threshold={10} // Arrastre mínimo requerido antes de moverse
        modules={[Autoplay, Pagination, Navigation]}
      >
        {
          slides?.map((element, index) => (
            <SwiperSlide key={index+1}>
              <Image className='hidden md:block' src={element?.banner_desk}/>
              <Image className='block md:hidden' src={element?.banner_mobile}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <button className='w-10 absolute right-0 z-40 top-[50%] hidden md:block' onClick={handleNextClick}>
        <Icon icon={'arrow-right1'} size={'24'} color="white" />
      </button>
      <button className='w-10 absolute left-0 z-[999999999] top-[50%] hidden md:block' onClick={handlePrevClick}>
        <Icon icon={'arrow-left1'} size={'24'} color="white" />
      </button>
    </div>
  )
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
