import React, { useEffect, useState } from 'react';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useNavigate } from 'react-router';

import { Header } from "components";
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from '~/lib/utils';
import { world_map } from '~/constants/world_map';
import { account } from '~/appwrite/client';
// import type { Route } from './+types/create-trip';

// export const loader = async () => {};

const CreateTrip = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    budget: '',
    duration: 0,
    groupType: ''
  });

  useEffect(() => {
    const fetchCountriesData = async () => {
      axiosRetry(axios, {
        retries: 3,
        retryDelay: (retryCount) => retryCount * 2000,
        retryCondition: (error) =>
          error.code === "ECONNABORTED" ||
          axiosRetry.isNetworkOrIdempotentRequestError(error),
      });

      try {
        const url = "https://restcountries.com/v3.1/all";
        const response = await axios.get(url, { timeout: 20000 });

        const countries = response.data.map((country: any) => ({
          name: country.flag + " " + country.name.common,
          coordinates: country.latlng,
          value: country.name.common,
          openStreetMap: country.maps?.openStreetMap,
        }));

        setCountries(countries);
      } catch (error: any) {
        console.error("❌ Retry failed:", error?.message);
      }
    };

    fetchCountriesData();
  }, []);

  const countryData = countries.map(country => ({
    text: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: '#EA382E',
      coordinates: countries.find(country => country.name === formData.country)?.coordinates || [],
    }
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError('Please provide values for all fields');
      setLoading(false);
      return;
    } else {
      setError(null);
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError('Duration must be between 1 and 10 days');
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      console.error(`${user?.name} not authenticated`);
      setLoading(false);
      return;
    }

    try {
      const { country, duration, travelStyle, interest, budget, groupType } = formData;

      const url = `/api/create-trip`;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          numberOfDays: duration,
          travelStyle,
          interests: interest,
          budget, groupType,
          userId: user.$id
        })
      }

      const response = await fetch(url, options);
      const result: CreateTripResponse = await response.json();

      if (result?.id) navigate(`/trips/${result.id}`);
      else console.error('Failed to generate a trip.');
      
    } catch (e: any) {
      console.error('Error generating trip', e);
    } finally {
      setLoading(false);
    }

    console.log('Form Submitted');
  };

  const handleChange = (key: keyof TripFormData, value: string | undefined) => {
    setFormData({ ...formData, [key]: value })
  };

  return (
    <main className="flec flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI-Generated travel plans"
      />

      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="country">Country</label>

            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();
                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>

          <div className="">
            <label htmlFor="duration">Duration</label>

            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              max="10"
              placeholder="Enter number of days"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {selectItems.map((key) => (
            <div key={key} className="">
              <label htmlFor={key}>{formatKey(key)}</label>

              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                className="combo-box"
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
              />
            </div>
          ))}

          <div className="">
            <label htmlFor="location">Location on the World Map</label>

            <MapsComponent id="location" className="!mr-20">
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="bg-gray-200 h-px w-full" />
          {error && <p className="error">*Error: {error}</p>}

          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                alt={`${loading ? "loader" : "magic-star"}`}
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
