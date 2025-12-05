import { z } from 'zod';

const emailSchema = z.email({ message: 'Invalid email address' });

const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(64, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

const nameSchema = z.string()
  .min(2, { message: 'Name must be at least 2 characters long' })
  .max(100, { message: 'Name must be at most 100 characters long' })
  // .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' });

const otpSchema = z.string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only numbers');

const idSchema = z.string().min(3,'_id is required');
const altSchema = z.string().min(3,'Alt is required');
const titleSchema = z.string().min(3,'Title is required.'); 
const slugSchema = z.string().min(3,'Slug is required');
const categorySchema = z.string().min(3,'Category required')
const mrpSchema = z.union([
  z.number().positive('Expected positive value, received negative'),
  z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val>=0, 'Please enter a positive number')
])
const descriptionSchema = z.string().min(3,'Description is required')
const sellingPriceSchema = z.union([
  z.number().positive('Expected positive value, received negative'),
  z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val>=0, 'Please enter a positive number')
])
const discountPercentageSchema=z.union([
  z.number().positive('Expected positive value, received negative'),
  z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val>=0, 'Please enter a positive number')
])
const mediasSchema = z.array(z.string())
const productSchema = z.string().min(3, 'Product is required.')
const colorSchema = z.string().min(3, 'Color is required.')
const sizeSchema = z.string().min(1, 'Size is required.')
const skuSchema = z.string().min(3, 'SKU is required.')
const codeSchema = z.string().min(3, 'SKU is required.')
const minShoppingAmountSchema=z.union([
  z.number().positive('Expected positive value, received negative'),
  z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val>=0, 'Please enter a positive number')
])
const amountSchema =z.union([
  z.number().positive('Expected positive value, received negative'),
  z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val>=0, 'Please enter a positive number')
])
const validitySchema = z.coerce.date()
const userIdSchema = z.string().min(3, 'User ID is required.')
const ratingSchema = z.union([
  z.number().positive('Expected positive value, received negative'),
  z.string().transform((val)=>Number(val)).refine((val)=>!isNaN(val) && val>=0, 'Please enter a positive number')
])
const reviewSchema = z.string().min(3, 'Review is required.')
const CouponCodeSchema = z.string().min(3, 'Coupon Code is required.')
const phoneSchema = z.string()
  .regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' });
  const countrySchema = z.string().min(3, { message: 'Country name must be at least 3 characters long' });
  const addressSchema = z.string().min(5, { message: 'Address must be at least 5 characters long' });
  const citySchema = z.string().min(3, { message: 'City name must be at least 3 characters long' });
  const pinCodeSchema = z.string().min(3, { message: 'Pin code must be at least 3 characters long' });
  const landmarkSchema = z.string().min(3, { message: 'Landmark must be at least 3 characters long' });
  const stateSchema = z.string().min(3, { message: 'State name must be at least 3 characters long' });
  const orderNoteSchema = z.string().min(3, { message: 'Order note must be at least 3 characters long' }).optional();


const zodSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name:nameSchema,
  userId:userIdSchema,
  otp:otpSchema,
  _id:idSchema,
  alt:altSchema,
  title:titleSchema,
  slug:slugSchema,
  category:categorySchema,
  discountPercentage:discountPercentageSchema,
  sellingPrice:sellingPriceSchema,
  mrp:mrpSchema,
  description:descriptionSchema,
  media:mediasSchema,
  product:productSchema,
  color:colorSchema,
  size:sizeSchema,
  sku:skuSchema,
  code:codeSchema,
  minShoppingAmount:minShoppingAmountSchema,
  validity:validitySchema,
  rating: ratingSchema,
  review: reviewSchema,
  code: CouponCodeSchema,
  phone: phoneSchema,
  country: countrySchema,
  address: addressSchema,
  city: citySchema,
  pinCode: pinCodeSchema,
  landmark: landmarkSchema,
  state: stateSchema,
  orderNote: orderNoteSchema,
  amount: amountSchema
});

export default zodSchema;