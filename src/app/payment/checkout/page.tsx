"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        toast("Payment failed", error.message || "Payment processing failed");
      }
    } catch {
      toast("Error", "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <PaymentElement />
      <Button
        type='submit'
        disabled={!stripe || isProcessing}
        className='w-full'
        size='lg'
      >
        {isProcessing ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const plan = searchParams.get("plan") || "monthly";
  const amount = plan === "yearly" ? 99.99 : 9.99;

  useEffect(() => {
    // Create payment intent
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        plan,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClientSecret(data.data.clientSecret);
        } else {
          setError("Failed to initialize payment");
        }
      })
      .catch(() => {
        setError("Failed to connect to payment service");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [amount, plan]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-blue-600' />
          <p className='text-gray-600'>Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='max-w-md w-full mx-4'>
          <CardHeader>
            <CardTitle className='text-red-600'>Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/premium")} className='w-full'>
              Back to Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container mx-auto px-4 max-w-2xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Complete Your Payment
          </h1>
          <p className='mt-2 text-gray-600'>
            Subscribe to TravelBuddy Premium and unlock all features
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 mb-6'>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Plan</span>
                <span className='font-medium capitalize'>{plan}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Billing</span>
                <span className='font-medium'>
                  {plan === "yearly" ? "Annually" : "Monthly"}
                </span>
              </div>
              <div className='border-t pt-2 mt-2'>
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-green-600' />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>✓ Verified badge</li>
                <li>✓ Unlimited travel plans</li>
                <li>✓ Priority matching</li>
                <li>✓ Advanced search filters</li>
                <li>✓ Direct messaging</li>
                <li>✓ Priority support</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter your payment information securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                  },
                }}
              >
                <CheckoutForm />
              </Elements>
            )}
          </CardContent>
        </Card>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Powered by Stripe. Your payment information is secure and encrypted.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-blue-600' />
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
