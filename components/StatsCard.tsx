import React from 'react';
import { calculateTrendPercentage, cn } from '~/lib/utils';

const StatsCard = ({
  headerTitle, 
  total, 
  lastMonthCount, 
  currentMonthCount} : StatsCard) => {

  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount, lastMonthCount);

  const isDecrement = trend === "decrement";
  const isIncrement = trend === "increment";
  return (
    <article className='stats-card'>
      <h3 className='text-base font-medium'>
        {headerTitle}
      </h3>

      <div className='content'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl'>{total}</h2>

          <div className='flex items-center gap-2'>
            <figure className='flex items-center gap-1'>
              <img alt={trend} className='size-5'
                src={`/icons/${isDecrement ? 'arrow-down-red.svg' : 'arrow-up-green.svg'}`}  
              />
              <figcaption className={
                cn('text-sm font-medium', isDecrement ? 'text-red-500' : 'text-success-700')
              }>
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className='text-sm font-medium text-gray-100 truncate'>
              vs last month
            </p>
          </div>
        </div>

        <img alt='trend graph' className='xl:w-32 w-full h-full md:h-32 xl:h-full'
          src={`/icons/${isDecrement ? 'decrement.svg' : 'increment.svg'}`} 
        />
      </div>
    </article>
  );
};

export default StatsCard;
