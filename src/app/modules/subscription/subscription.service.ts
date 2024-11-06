import { JwtPayload } from "jsonwebtoken";
import Stripe from "stripe";
import stripe from "../../../config/stripe";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { ISubscription } from "./subscription.interface";
import { Subscription } from "./subscription.model";

// create payment intent
const createPaymentIntentToStripe = async(
    user: JwtPayload, priceId:string ): Promise<{ paymentIntent: Stripe.PaymentIntent }> =>{

    // Create customer
    const customer = await stripe.customers.create({email : user.email});
    if (!customer) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created customer");

    // Create subscription
    const subscription: Stripe.Subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
    });
    if (!subscription) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created customer");

    // Check if latest_invoice exists and is of type Invoice
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    return { paymentIntent: latestInvoice.payment_intent as Stripe.PaymentIntent };
}

// create subscription
const createSubscriptionToDB = async(payload: Partial<ISubscription>): Promise<ISubscription>=>{
    const subscription = await Subscription.create(payload);
    if(!subscription) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created subscription");
    return subscription;
}

// create subscription update intent
const updatePaymentIntentToStripe = async (payload: Partial<ISubscription>): Promise<{ paymentIntent: Stripe.PaymentIntent }>=>{

    const { subscribeId, priceId  } = payload;

    // Retrieve the existing subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(payload.subscribeId as string);
    if (!subscription) throw new ApiError( StatusCodes.NOT_FOUND, 'Invalid Subscription ID');

    // Update the subscription in Stripe with the new priceId
    const updatedSubscription: Stripe.Subscription = await stripe.subscriptions.update(
        subscribeId as string,
        {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: priceId,
                }
            ],
            expand: ['latest_invoice.payment_intent'],
        }
    );
    if (!subscription) throw new ApiError( StatusCodes.NOT_FOUND, 'Failed to Update Subscription.Please try again');

    // Check if latest_invoice exists and is of type Invoice
    const latestInvoice = updatedSubscription.latest_invoice as Stripe.Invoice;

    return { paymentIntent: latestInvoice.payment_intent as Stripe.PaymentIntent };
}

// update subscription
const updateSubscriptionToDB = async( id:string, payload: ISubscription ): Promise<ISubscription> =>{

    const updatedSubscription = await Subscription.findByIdAndUpdate(
        {_id: id},
        payload,
        {new : true}
    )

    if(!updatedSubscription) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to updated Subscription")
    return updatedSubscription;
}

// cancel subscription from the stripe and update status on the subscription database.
const cancelSubscriptionToDBAndStripe = async (subscribeId: Partial<ISubscription> ): Promise<ISubscription | null> => {

    // Check if the subscription exists in the database
    const subscription = await Subscription.findOne({ subscribeId });
    if (!subscription) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid Subscription ID');

    const updatedSubscription = await stripe.subscriptions.update(
        subscribeId as string,
        {
            cancel_at_period_end: true
        }
    );
    if (!updatedSubscription) throw new ApiError(StatusCodes.NOT_FOUND, 'Failed To canceled subscription on the stripe');

    // Update the subscription details in the database
    const updatedSub = await Subscription.findOneAndUpdate(
        { subscribeId : subscribeId },
        {status: "Cancel" },
        { new: true }
    );
    if (!updatedSub) throw new ApiError(StatusCodes.NOT_FOUND, 'Failed update subscription');

    return updatedSub;
}

export const SubscriptionService = {
    createPaymentIntentToStripe,
    createSubscriptionToDB,
    updatePaymentIntentToStripe,
    updateSubscriptionToDB,
    cancelSubscriptionToDBAndStripe
}