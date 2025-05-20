import React, { useState } from 'react';
import { type LoaderFunctionArgs, useSearchParams } from "react-router";
import { PagerComponent } from '@syncfusion/ej2-react-grids';

import { Header, TripCard } from "components";
import { getTripById, getAllTrips } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import { cn, parseTripData, getFirstWord } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
  const offset = (page - 1) * limit;

  const { allTrips, total } = await getAllTrips(limit, offset);

  return {
    trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })),
    total,
  };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const allTrips = loaderData.trips as Trip[] | [];

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || '1');

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and Edit AI-geneated travel plans"
        ctaText='Create a trip'
        ctaUrl='/trips/create'
      />

      <section>
        <h1 className='p-24-semibold text-dark-100 mb-8'>Manage Created Trips</h1>

        <div className='trip-grid mb-6'>
          {allTrips.map(({ id, name, imageUrls, itinerary, interests, 
            travelStyle, estimatedPrice }, index) => (
            <TripCard
              key={index}
              id={id}
              name={name}
              imageUrl={imageUrls[1]}
              location={itinerary?.[0]?.location ?? ""}
              tags={[interests, travelStyle]}
              price={estimatedPrice}
            />
          ))}
        </div>

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass='!mb-4'
        />
      </section>
    </main>
  );
};

export default Trips;
