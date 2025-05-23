import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'});

export const createProduct = async (
  name: string,
  description: string,
  images: string[],
  price: number,
  tripId: string
) => {
  const product = await stripe.products.create({
    name,
    description,
    images,
  });

  const priceObject = await stripe.prices.create({
    unit_amount: price * 100,
    currency: 'usd',
    product: product.id,
  });

  const baseUrl = process.env.VITE_BASE_URL;
  console.log('baseUrl', baseUrl);

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: priceObject.id, quantity: 1 }],
    metadata: { tripId },
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${baseUrl}/travel/${tripId}/success`,
      },
    },
  });

  return paymentLink;
}