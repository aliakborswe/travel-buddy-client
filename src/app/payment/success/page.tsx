"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react";

interface PaymentData {
  plan?: string;
  amount?: number;
  status?: string;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const paymentIntent = searchParams.get("payment_intent");

  useEffect(() => {
    if (!paymentIntent) {
      router.push("/premium");
      return;
    }

    // Confirm payment with backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        paymentIntentId: paymentIntent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPaymentData(data.data);
        }
      })
      .catch((err) => {
        console.error("Payment confirmation error:", err);
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [paymentIntent, router]);

  if (verifying) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin mx-auto mb-4 text-blue-600' />
          <p className='text-xl text-gray-600'>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-green-50 to-white py-12'>
      <div className='container mx-auto px-4 max-w-3xl'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4'>
            <CheckCircle2 className='h-12 w-12 text-green-600' />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Payment Successful!
          </h1>
          <p className='text-xl text-gray-600'>
            Welcome to TravelBuddy Premium
          </p>
        </div>

        <Card className='mb-6 border-green-200'>
          <CardHeader className='bg-green-50'>
            <CardTitle className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-yellow-500' />
              Premium Features Unlocked
            </CardTitle>
            <CardDescription>
              You now have access to all premium features
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <p className='font-medium'>Verified Badge</p>
                  <p className='text-sm text-gray-600'>
                    Stand out with a verified profile
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <p className='font-medium'>Unlimited Plans</p>
                  <p className='text-sm text-gray-600'>
                    Create as many travel plans as you want
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <p className='font-medium'>Priority Matching</p>
                  <p className='text-sm text-gray-600'>
                    Get matched faster with compatible travelers
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <p className='font-medium'>Advanced Filters</p>
                  <p className='text-sm text-gray-600'>
                    Search with detailed criteria
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <p className='font-medium'>Direct Messaging</p>
                  <p className='text-sm text-gray-600'>
                    Chat directly with travel buddies
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='h-5 w-5 text-green-600 mt-0.5' />
                <div>
                  <p className='font-medium'>Priority Support</p>
                  <p className='text-sm text-gray-600'>
                    Get help faster when you need it
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {paymentData && (
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Transaction ID</span>
                <span className='font-mono text-xs'>
                  {paymentIntent?.slice(0, 20)}...
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Plan</span>
                <span className='font-medium capitalize'>
                  {paymentData.plan || "Premium"}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Amount</span>
                <span className='font-medium'>
                  ${((paymentData.amount || 999) / 100).toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Status</span>
                <span className='font-medium text-green-600'>Paid</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'>
          <h3 className='font-semibold text-blue-900 mb-2'>
            What&apos;s Next?
          </h3>
          <ul className='space-y-2 text-blue-800'>
            <li className='flex items-center gap-2'>
              <ArrowRight className='h-4 w-4' />
              Complete your profile to get better matches
            </li>
            <li className='flex items-center gap-2'>
              <ArrowRight className='h-4 w-4' />
              Create your first travel plan
            </li>
            <li className='flex items-center gap-2'>
              <ArrowRight className='h-4 w-4' />
              Explore and connect with travelers
            </li>
          </ul>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href='/dashboard'>
            <Button size='lg' className='w-full sm:w-auto'>
              Go to Dashboard
            </Button>
          </Link>
          <Link href='/travel-plans/add'>
            <Button size='lg' variant='outline' className='w-full sm:w-auto'>
              Create Travel Plan
            </Button>
          </Link>
          <Link href='/explore'>
            <Button size='lg' variant='outline' className='w-full sm:w-auto'>
              Explore Travelers
            </Button>
          </Link>
        </div>

        <p className='text-center text-sm text-gray-500 mt-8'>
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <Loader2 className='h-12 w-12 animate-spin mx-auto mb-4 text-blue-600' />
            <p className='text-xl text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
