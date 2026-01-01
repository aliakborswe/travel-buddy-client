"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS, SUBSCRIPTION_PLANS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm({
  subscriptionType,
  onSuccess,
  clientSecret,
}: {
  subscriptionType: "monthly" | "yearly";
  onSuccess: (paymentIntentId: string) => void;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Payment failed");
        setLoading(false);
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/dashboard`,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        // Check if error is due to already succeeded payment
        if (confirmError.code === "payment_intent_unexpected_state") {
          // Extract payment intent ID from client secret
          const piId = clientSecret.split("_secret_")[0];
          onSuccess(piId);
        } else {
          setError(confirmError.message || "Payment failed");
          setIsProcessing(false);
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <PaymentElement />
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm'>
          {error}
        </div>
      )}
      <Button
        type='submit'
        disabled={!stripe || loading || isProcessing}
        className='w-full'
      >
        {loading ? (
          <>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            Processing...
          </>
        ) : (
          `Subscribe ${subscriptionType === "monthly" ? "Monthly" : "Yearly"}`
        )}
      </Button>
    </form>
  );
}

export default function PremiumPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { toast, Toaster } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(
    null
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser, router]);

  if (!ready || !currentUser) {
    return null;
  }

  const handleSelectPlan = async (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    setLoading(true);

    try {
      const amount =
        plan === "monthly"
          ? SUBSCRIPTION_PLANS.MONTHLY.price
          : SUBSCRIPTION_PLANS.YEARLY.price;

      const response: any = await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CREATE_INTENT,
        {
          subscriptionType: plan,
          amount: amount,
          currency: "USD",
        },
        accessToken || undefined
      );

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      toast("Failed to initialize payment", "Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CONFIRM,
        { paymentIntentId },
        accessToken || undefined
      );
      toast("Payment successful", "You are now a premium member!", "success");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to confirm payment:", error);
    }
  };

  if (currentUser.isPremium) {
    return (
      <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center'>
          <Crown className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            You're Already Premium!
          </h1>
          <p className='text-gray-600 mb-8'>
            You have access to all premium features.
          </p>
          {currentUser.subscriptionEndDate && (
            <p className='text-sm text-gray-500 mb-6'>
              Your subscription is active until{" "}
              {new Date(currentUser.subscriptionEndDate).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              )}
            </p>
          )}
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <Crown className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Upgrade to Premium
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Unlock exclusive features and get verified to connect with more
            travelers
          </p>
        </div>

        {!selectedPlan ? (
          /* Plan Selection */
          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12'>
            {/* Monthly Plan */}
            <Card className='hover:shadow-xl transition-shadow'>
              <CardHeader>
                <CardTitle className='text-2xl'>Monthly Plan</CardTitle>
                <CardDescription>
                  Perfect for trying premium features
                </CardDescription>
                <div className='mt-4'>
                  <span className='text-4xl font-bold'>
                    ${SUBSCRIPTION_PLANS.MONTHLY.price}
                  </span>
                  <span className='text-gray-600'>/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3 mb-6'>
                  {SUBSCRIPTION_PLANS.MONTHLY.features.map((feature) => (
                    <li key={feature} className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-green-500 shrink-0 mt-0.5' />
                      <span className='text-gray-700'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className='w-full'
                  onClick={() => handleSelectPlan("monthly")}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Select Monthly"}
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className='hover:shadow-xl transition-shadow border-2 border-yellow-400 relative'>
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-yellow-400 to-orange-500'>
                Best Value
              </Badge>
              <CardHeader>
                <CardTitle className='text-2xl'>Yearly Plan</CardTitle>
                <CardDescription>
                  Save 2 months with annual billing
                </CardDescription>
                <div className='mt-4'>
                  <span className='text-4xl font-bold'>
                    ${SUBSCRIPTION_PLANS.YEARLY.price}
                  </span>
                  <span className='text-gray-600'>/year</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3 mb-6'>
                  {SUBSCRIPTION_PLANS.YEARLY.features.map((feature) => (
                    <li key={feature} className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-green-500 shrink-0 mt-0.5' />
                      <span className='text-gray-700'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className='w-full bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                  onClick={() => handleSelectPlan("yearly")}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Select Yearly"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Payment Form */
          <div className='max-w-2xl mx-auto'>
            <Card>
              <CardHeader>
                <CardTitle>
                  Complete Your{" "}
                  {selectedPlan === "monthly" ? "Monthly" : "Yearly"}{" "}
                  Subscription
                </CardTitle>
                <CardDescription>
                  You'll be charged $
                  {selectedPlan === "monthly"
                    ? SUBSCRIPTION_PLANS.MONTHLY.price
                    : SUBSCRIPTION_PLANS.YEARLY.price}{" "}
                  {selectedPlan === "monthly" ? "per month" : "per year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      subscriptionType={selectedPlan}
                      onSuccess={handlePaymentSuccess}
                      clientSecret={clientSecret}
                    />
                  </Elements>
                )}
                <Button
                  variant='ghost'
                  className='w-full mt-4'
                  onClick={() => {
                    setSelectedPlan(null);
                    setClientSecret(null);
                  }}
                >
                  Choose Different Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Overview */}
        <div className='mt-16 max-w-4xl mx-auto'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Why Go Premium?
          </h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <Card>
              <CardHeader>
                <Crown className='w-10 h-10 text-yellow-500 mb-2' />
                <CardTitle className='text-lg'>Verified Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 text-sm'>
                  Stand out with a verified badge that builds trust with other
                  travelers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Check className='w-10 h-10 text-green-500 mb-2' />
                <CardTitle className='text-lg'>Unlimited Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 text-sm'>
                  Create unlimited travel plans and connect with more buddies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Crown className='w-10 h-10 text-purple-500 mb-2' />
                <CardTitle className='text-lg'>Priority Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 text-sm'>
                  Get faster responses and dedicated support from our team
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
