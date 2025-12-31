"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className='min-h-screen bg-linear-to-b from-gray-50 to-white py-12'>
      <div className='container mx-auto px-4 max-w-2xl'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4'>
            <XCircle className='h-12 w-12 text-red-600' />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Payment Cancelled
          </h1>
          <p className='text-xl text-gray-600'>
            Your payment was not completed
          </p>
        </div>

        <Card className='mb-6 border-red-200'>
          <CardHeader className='bg-red-50'>
            <CardTitle>What happened?</CardTitle>
            <CardDescription>
              Your payment process was interrupted or cancelled
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <p className='text-gray-700 mb-4'>
              Don&apos;t worry! No charges were made to your payment method. You
              can try again whenever you&apos;re ready.
            </p>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='font-medium text-blue-900 mb-2'>
                Why subscribe to Premium?
              </h4>
              <ul className='space-y-1 text-sm text-blue-800'>
                <li>✓ Get verified badge for trusted connections</li>
                <li>✓ Create unlimited travel plans</li>
                <li>✓ Priority matching with compatible travelers</li>
                <li>✓ Access advanced search filters</li>
                <li>✓ Direct messaging with travel buddies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Common Issues</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start gap-3'>
              <HelpCircle className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='font-medium'>Payment method declined</p>
                <p className='text-sm text-gray-600'>
                  Check with your bank or try a different payment method
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <HelpCircle className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='font-medium'>Technical issue</p>
                <p className='text-sm text-gray-600'>
                  Try refreshing the page or using a different browser
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <HelpCircle className='h-5 w-5 text-gray-400 mt-0.5' />
              <div>
                <p className='font-medium'>Changed your mind</p>
                <p className='text-sm text-gray-600'>
                  No problem! You can continue using the free plan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='flex flex-col sm:flex-row gap-4 justify-center mb-6'>
          <Link href='/premium'>
            <Button size='lg' className='w-full sm:w-auto'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Try Again
            </Button>
          </Link>
          <Link href='/dashboard'>
            <Button size='lg' variant='outline' className='w-full sm:w-auto'>
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <Card className='bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageCircle className='h-5 w-5 text-blue-600' />
              Need Help?
            </CardTitle>
            <CardDescription>
              Our support team is here to assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-700 mb-4'>
              If you experienced any issues or have questions about our Premium
              plans, please don&apos;t hesitate to reach out.
            </p>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button variant='outline' size='sm' asChild>
                <a href='mailto:support@travelbuddy.com'>Email Support</a>
              </Button>
              <Button variant='outline' size='sm' asChild>
                <Link href='/about'>Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className='text-center text-sm text-gray-500 mt-8'>
          You can continue using TravelBuddy with a free account or upgrade at
          any time.
        </p>
      </div>
    </div>
  );
}
