import React, { useState } from 'react';
import { Link, type LoaderFunctionArgs, useSearchParams } from 'react-router';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { PagerComponent } from '@syncfusion/ej2-react-grids';

import { cn, parseTripData } from '~/lib/utils';
import { Header, TripCard } from 'components';
import { getAllTrips } from '~/appwrite/trips';
import type { Route } from "../../../.react-router/types/app/routes/admin/+types/trips";
import { getUser } from '~/appwrite/auth';

const FeaturedDestination = ({ containerClass = '', bigCard = false, rating, title, activityCount, bgImage }: DestinationProps) => (
  <section className={cn('rounded-[14px] overflow-hidden bg-cover bg-center size-full min-w-[280px]', containerClass, bgImage)}>
    <div className='bg-linear200 h-full'>
      <article className='featured-card'>
        <div className={cn('bg-white rounded-20 font-bold text-red-100 w-fit py-px px-3 text-sm')}>
          {rating}
        </div>

        <article className='flex flex-col gap-3'>
          <h2 className={cn('text-lg font-semibold text-white', {'p-30-bold': bigCard})}>
            {title}
          </h2>

          <figure className='flex gap-2 items-center'>
            <img src='/images/david.webp' alt='user' 
              className={cn('size-5 rounded-full aspect-square', {'size-8': bigCard})}
            />
            <p className={cn('text-xs font-normal text-white', {'text-lg': bigCard})}>
              {activityCount} activities
            </p>
          </figure>
        </article>
      </article>
    </div>
  </section>
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const offset = (page - 1) * limit;

  const [user, { allTrips, total }] = await Promise.all([
    getUser(),
    getAllTrips(limit, offset),
  ]);

  return {
    trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })),
    total,
  }
};

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData.trips as Trip[] | [];

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || '1');

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  const year = new Date().getFullYear();

  return (
    <main className="flex flex-col">
      <section className="travel-hero">
        <div>
          <section className="wrapper">
            <article>
              <h1 className="p-72-bold text-dark-100">
                Plan Your Trip with Ease
              </h1>

              <p className="text-dark-200">
                Customize your travel itinerary in minutes—pick your
                destination, set your preferences, and explore with confidence.
              </p>
            </article>

            <Link to="#trips">
              <ButtonComponent
                type="button"
                className="button-class !h-11 !w-full md:!w-[240px]"
              >
                <span className="p-16-semibold text-white">Gest Started</span>
              </ButtonComponent>
            </Link>
          </section>
        </div>
      </section>

      <section className="pt-20 wrapper flex flex-col gap-10 h-full">
        <Header
          title="Featured Travel Destinations"
          description="Check out some of the best places you visit around the world"
        />
        <div className="featured">
          <article>
            <FeaturedDestination
              containerClass="h-1/3 lg:h-1/2"
              bigCard
              rating={4.2}
              title="Barcelona Tour"
              activityCount={154}
              bgImage="bg-card-1"
            />

            <div className="travel-featured">
              <FeaturedDestination
                bigCard
                rating={4.5}
                title="London Tour"
                activityCount={512}
                bgImage="bg-card-2"
              />
              <FeaturedDestination
                bigCard
                rating={3.8}
                title="Australia Tour"
                activityCount={200}
                bgImage="bg-card-3"
              />
            </div>
          </article>

          <div className="flex flex-col gap-[30px]">
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              rating={4.1}
              title="Spain Tour"
              activityCount={130}
              bgImage="bg-card-4"
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              rating={4.9}
              title="Japan Tour"
              activityCount={400}
              bgImage="bg-card-5"
            />
            <FeaturedDestination
              containerClass="w-full h-[240px]"
              rating={4.2}
              title="Italy Tour"
              activityCount={300}
              bgImage="bg-card-6"
            />
          </div>
        </div>
      </section>

      <section id="trips" className="py-20 wrapper flex flex-col gap-10">
        <Header
          title="Explore Our Handpicked Trips"
          description="Discover the world with our curated travel experiences for your travel style"
        />

        <div className="trip-grid">
          {trips.map(
            ({
              id,
              name,
              imageUrls,
              itinerary,
              interests,
              travelStyle,
              estimatedPrice,
            }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name!}
                imageUrl={imageUrls[1]}
                location={itinerary?.[0]?.location ?? ""}
                tags={[interests!, travelStyle!]}
                price={estimatedPrice!}
              />
            )
          )}
        </div>

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>

      <footer className="h-28 bg-white">
        <div className="wrapper footer-container">
          <Link to="/">
            <img src="/icons/logo.svg" alt="logo" className="size-[30px]" />
            <h1>Tourvista</h1>
          </Link>

          <div>
            <span className='text-[10px] md:text-base'>© {year} Tourvista, Inc.</span>
            {["• Terms", "• Privacy"].map((item) => (
              <Link
                to="/"
                key={item}
                className="hover:text-blue-500"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
};

export default TravelPage;
