import React, { useEffect } from 'react';
import { Link, type LoaderFunctionArgs } from 'react-router';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import confetti from 'canvas-confetti';

import type { Route } from "./+types/payment-success";
import { LEFT_CONFETTI, RIGHT_CONFETTI } from '~/constants';

export async function loader ({ params }: LoaderFunctionArgs) { return params; };

const PaymentSuccess = ({ loaderData }: Route.ComponentProps) => {
  
  useEffect(() => {
    confetti(LEFT_CONFETTI);
    confetti(RIGHT_CONFETTI);
  }, []);

  return (
    <main className='payment-success wrapper'>
      <section>
        <article>
          <img src='/icons/check.svg' alt='Check' className='size-24' />
          <h1>Thank you & Welcome Abroad!</h1>

          <p>Your trip is booked - can't wait to have you on this adventure, 
            Get ready to explore & make memories! ✨
          </p>

          <Link to={`/travel/${loaderData?.tripId}`} className='w-full'>
            <ButtonComponent className='button-class !h-11 !w-full'>
              <img src='/icons/itinerary-button.svg' alt='Itinerary' className='size-5' />
              <span className='text-white p-16-semibold'>View trip details</span>
            </ButtonComponent>
          </Link>

          <Link to={`/`} className='w-full'>
            <ButtonComponent className='button-class !h-11 !w-full'>
              <img src='/icons/arrow-left.svg' alt='arrow-left' className='size-5' />
              <span className='p-16-semibold'>Return to Homepage</span>
            </ButtonComponent>
          </Link>
        </article>
      </section>
    </main>
  );
};

export default PaymentSuccess;
