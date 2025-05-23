import { Category, ChartComponent, ColumnSeries, 
DataLabel, SplineAreaSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from "@syncfusion/ej2-react-charts";
import { ColumnDirective, ColumnsDirective, GridComponent, Inject } from "@syncfusion/ej2-react-grids";
import { redirect } from "react-router";

import { Header, StatsCard, TripCard } from "../../../components";
import { getUser, getAllUsers } from "~/appwrite/auth";
import type { Route } from './+types/dashboard';
import { getUsersAndTripsStats, getTripsByTravelStyle, getUserGrowthPerDay } from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { useryAxis, userXAxis, tripXAxis, tripyAxis } from './../../constants';

export const clientLoader = async () => {
  const [user, dashboardStats, trips, userGrowth,
    tripsByTravelStyle, allUsers,
  ] = await Promise.all([
    await getUser(),
    await getUsersAndTripsStats(),
    await getAllTrips(4, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    await getAllUsers(4, 0),
  ]);

  const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetail),
    imageUrls: imageUrls ?? [],
  }));

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map(({ $id, name, itineraryCount, imageUrl }) => ({
    id: $id,
    name,
    imageUrl,
    count: itineraryCount ?? Math.floor(Math.random() * 100),
  }));

  return { user, dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers: mappedUsers };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } = loaderData;

  const trips = allTrips.map(({ name, interests, imageUrls }) => ({
    name,
    interests,
    imageUrl: imageUrls[1],
  }));

  const usersAndTrips = [
    {
      title: 'Latest User Sign-ups',
      dataSource: allUsers,
      field: 'count',
      headerText: 'Trips Created',
    },
    {
      title: 'Trips based on Interests',
      dataSource: trips,
      field: 'interests',
      headerText: 'Interests',
    },
  ];

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name || "Guest"} 👋`}
        description="Track activity, trends and popular destinations in real time🔥"
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>

        <div className="trip-grid">
          {allTrips.map(({id, name, imageUrls, itinerary,
            interests, travelStyle, estimatedPrice }) => (
            <TripCard
              key={id}
              id={id.toString()}
              name={name!}
              imageUrl={imageUrls[1]}
              location={itinerary?.[0]?.location ?? ""}
              tags={[interests!, travelStyle!]}
              price={estimatedPrice!}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              name="Column"
              type="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />

            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              name="Wave"
              type="SplineArea"
              fill="rgba(71, 132, 238, 0.3)"
              border={{ width: 2, color: "#4784EE" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="Trip Trends"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />

          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              name="day"
              type="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>

      <section className="user-trip wrapper">
        {usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
          <div key={i} className="flex flex-col gap-5">
            <h3 className="p-20-semibold text-dark-100">{title}</h3>

            <GridComponent
              dataSource={dataSource}
              gridLines="Both"
            >
              <ColumnsDirective>
                <ColumnDirective
                  field='name'
                  headerText='Name'
                  width="200"
                  textAlign="Left"
                  template={(rowData: UserData) => (
                    <div className="flex items-center gap-2">
                      <img
                        src={rowData.imageUrl}
                        alt='user'
                        className="size-8 aspect-square rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <span>{rowData.name}</span>
                    </div>
                  )}
                />

                <ColumnDirective
                  field={field}
                  headerText={headerText}
                  textAlign="Left"
                  width="150"
                />
              </ColumnsDirective>
            </GridComponent>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
