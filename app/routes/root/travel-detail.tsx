import React from 'react';
import { Link, type LoaderFunctionArgs } from 'react-router';
import { ButtonComponent, ChipDirective, ChipListComponent, ChipsDirective } from '@syncfusion/ej2-react-buttons';

import { getAllTrips, getTripById } from '~/appwrite/trips';
import type { Route } from "./+types/travel-detail";
import { cn, getFirstWord, parseTripData } from '~/lib/utils';
import { InfoPill, TripCard } from 'components';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) throw new Error('Trip ID is required');
  
  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0) // Fetching 4 trips for the popular trips section to put at bottom
  ]);

  return {
    trip,
    allTrips: trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls: imageUrls ?? [],
    })),
  };
};

const TravelDetail = ({ loaderData }: Route.ComponentProps) => {
  const imageUrls = loaderData?.trip?.imageUrls || [];
  const tripData = parseTripData(loaderData?.trip?.tripDetail);
  const paymentLink = loaderData?.trip?.payment_link;

  const { name, duration, itinerary, travelStyle, groupType, budget, interests, 
    estimatedPrice, description, bestTimeToVisit, weatherInfo, country } = tripData || {};

  const allTrips = loaderData?.allTrips as Trip[] | [];

  const pillItems = [
    { text: travelStyle, bg: '!bg-pink-50 !text-pink-400' },
    { text: groupType, bg: '!bg-blue-50 !text-blue-400' },
    { text: budget, bg: '!bg-green-50 !text-green-400' },
    { text: interests, bg: '!bg-navy-50 !text-navy-500' },
  ];

  const visitTimeAndWeatherInfo = [
    { title: 'Best Time to Visit', info: bestTimeToVisit },
    { title: 'Weather Info', info: weatherInfo },
  ];

  return (
    <main className="travel-detail pt-40 wrapper">
      <div className="travel-div">
        <Link to="/" className="back-link">
          <img src="/icons/arrow-left.svg" alt="back" />
          <span className="text-dark-100">Go Back</span>
        </Link>
      </div>

      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day${duration > 1 && "'s"} plan`}
              image="/icons/calendar.svg"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 4)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/icons/location-mark.svg"
            />
          </div>
        </header>

        <section className="gallery">
          {imageUrls.map((url: string, i: number) => (
            <img
              src={url}
              key={i}
              className={cn(
                "w-full rounded-xl ",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((item, i) => (
                <ChipDirective
                  key={i}
                  cssClass={cn(
                    "!rounded-full !text-base !font-medium !px-4",
                    item.bg
                  )}
                  text={getFirstWord(item.text)}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <li key={i}>
                  <img
                    src="/icons/star.svg"
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}

            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-100 !text-yellow-600 !rounded-full !text-base !font-medium !px-3.5 !pt-0.5"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>

        <section className="title">
          <article>
            <h3>
              {duration}-Day{duration > 1 && "'s"} {travelStyle} Trip to{" "}
              {country}
            </h3>
            <p>
              {budget}, {groupType} and {interests}{" "}
            </p>
          </article>

          <h2 className="bg-sky-100 rounded-xl px-3 h-5 md:h-7">
            {estimatedPrice}
          </h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>

        <ul className="itinerary">
          {itinerary?.map((dayPlan, i) => (
            <li key={i}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>

              <ul>
                {dayPlan.activities.map((activity, j) => (
                  <li key={j}>
                    <span className="flex-shring-0 p-18-semibold">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((item, i) => (
          <section key={i} className="visit">
            <div>
              <h3 className="p-40-semibold text-dark-100">{item.title}:</h3>

              <ul>
                {item.info?.map((text, j) => (
                  <li key={j}>
                    <p className="flex-grow">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <a href={paymentLink} className="flex">
          <ButtonComponent className="button-class !w-full !h-[45px]" type="submit">
            <span className="p-16-semibold text-white">
              Pay to join the trip
            </span>
            <span className="price-pill">{estimatedPrice}</span>
          </ButtonComponent>
        </a>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>

        <div className="trip-grid">
          {allTrips.map(
            (
              {
                id,
                name,
                imageUrls,
                itinerary,
                interests,
                travelStyle,
                estimatedPrice,
              },
              index
            ) => (
              <TripCard
                key={index}
                id={id}
                name={name}
                imageUrl={imageUrls[1]}
                location={itinerary?.[0]?.location ?? ""}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default TravelDetail;
