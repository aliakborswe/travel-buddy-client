/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Globe,
  Heart,
  MapPin,
  Plane,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50'>
      <section className='relative overflow-hidden bg-linear-to-r from-blue-600 to-blue-800 py-20 md:py-32'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-8'>
            <div className='flex flex-col justify-center space-y-8'>
              <h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl'>
                Find Your Perfect{" "}
                <span className='text-yellow-300'>Travel Companion</span>
              </h1>
              <p className='text-xl text-blue-100 md:text-2xl'>
                Connect with like-minded travelers, plan amazing trips, and
                create unforgettable memories together.
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link href='/explore'>
                  <Button
                    size='lg'
                    className='w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100'
                  >
                    <Search className='mr-2 h-5 w-5' />
                    Find Travel Buddies
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto '
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className='hidden lg:flex items-center justify-center'>
              <div className='relative h-96 w-96'>
                <div className='absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm' />
                <div className='absolute inset-8 rounded-full bg-white/20 backdrop-blur-sm' />
                <div className='absolute inset-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center'>
                  <Plane className='h-32 w-32 text-white' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching CTA */}
      <section className='py-16 sm:py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Ready to Find Your Match?
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Create a plan or explore trips and connect instantly.
            </p>
          </div>
          <div className='mt-8 flex items-center justify-center gap-4'>
            <Link href='/travel-plans/add'>
              <Button>
                <Plane className='mr-2 h-5 w-5' /> Create a Plan
              </Button>
            </Link>
            <Link href='/matching'>
              <Button variant='outline'>Find a Buddy</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className='py-16 sm:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Frequently Asked Questions
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Quick answers to common questions.
            </p>
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Is TravelBuddy free?</CardTitle>
                <CardDescription>
                  Yes! You can browse and create plans for free. Premium unlocks
                  extras.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How do matches work?</CardTitle>
                <CardDescription>
                  We match based on destination, dates, budget, and interests.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className='py-16 sm:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              How It Works
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Simple steps to your next adventure.
            </p>
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Users className='h-6 w-6 text-blue-600' />
                  Create Your Profile
                </CardTitle>
                <CardDescription>
                  Share your interests, travel style, and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className='text-sm text-gray-600'>
                Build trust with a complete profile and get better matches.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Calendar className='h-6 w-6 text-blue-600' />
                  Post a Travel Plan
                </CardTitle>
                <CardDescription>
                  Pick destinations, dates, and budget.
                </CardDescription>
              </CardHeader>
              <CardContent className='text-sm text-gray-600'>
                Get discovered by travelers with similar plans.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <Globe className='h-6 w-6 text-blue-600' />
                  Match & Go
                </CardTitle>
                <CardDescription>
                  Chat, plan, and travel together.
                </CardDescription>
              </CardHeader>
              <CardContent className='text-sm text-gray-600'>
                We’ll help you connect safely and securely.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='py-16 sm:py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Popular Destinations
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Join trips trending this season.
            </p>
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[
              "Bali, Indonesia",
              "Kyoto, Japan",
              "Paris, France",
              "Santorini, Greece",
              "Cusco, Peru",
              "Cappadocia, Türkiye",
            ].map((d) => (
              <Card key={d}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-red-500' />
                    {d}
                  </CardTitle>
                  <CardDescription>
                    Active travelers planning trips here now.
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex items-center justify-between text-sm text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <Star className='h-4 w-4 text-yellow-500' />
                    4.8
                  </div>
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4 text-green-600' />
                    Trending
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 sm:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Why TravelBuddy
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Features that make your trips better.
            </p>
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                icon: <Shield className='h-6 w-6 text-blue-600' />,
                title: "Safe Connections",
                desc: "Verified users, reports, and moderation.",
              },
              {
                icon: <CheckCircle2 className='h-6 w-6 text-blue-600' />,
                title: "Smart Matching",
                desc: "Match by interests, budget, and dates.",
              },
              {
                icon: <Heart className='h-6 w-6 text-blue-600' />,
                title: "Community First",
                desc: "Meet friendly explorers worldwide.",
              },
            ].map((f) => (
              <Card key={(f as any).title}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-3'>
                    {(f as any).icon}
                    {(f as any).title}
                  </CardTitle>
                  <CardDescription>{(f as any).desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 sm:py-20 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              What Travelers Say
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Real stories from the community.
            </p>
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                name: "Aisha",
                text: "I found the perfect buddy for my Japan trip!",
              },
              {
                name: "Liam",
                text: "Matched within a day and had an amazing hike.",
              },
              {
                name: "Sofia",
                text: "Safe, simple, and super friendly people.",
              },
            ].map((t) => (
              <Card key={t.name}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Star className='h-5 w-5 text-yellow-500' />
                    5.0
                  </CardTitle>
                  <CardDescription>— {t.name}</CardDescription>
                </CardHeader>
                <CardContent className='text-gray-700'>{t.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 sm:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Simple Pricing
            </h2>
            <p className='mt-3 text-lg text-gray-600'>
              Start free, upgrade anytime.
            </p>
          </div>
          <div className='mt-12 grid gap-6 sm:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>
                  Browse, create plans, and match with limits.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex items-center justify-between'>
                <div className='text-3xl font-bold'>$0</div>
                <Link href='/register'>
                  <Button>Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className='border-blue-600'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  Premium <TrendingUp className='h-5 w-5 text-blue-600' />
                </CardTitle>
                <CardDescription>
                  Unlimited matches, priority support, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex items-center justify-between'>
                <div className='text-3xl font-bold'>
                  $9.99
                  <span className='text-base font-medium text-gray-500'>
                    /mo
                  </span>
                </div>
                <Link href='/premium'>
                  <Button className='bg-blue-600 hover:bg-blue-700'>
                    Upgrade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className='border-t bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Globe className='h-5 w-5 text-blue-600' />
              TravelBuddy
            </div>
            <div className='flex items-center gap-6 text-sm text-gray-600'>
              <Link href='/explore'>Explore</Link>
              <Link href='/travel-plans/add'>Create Plan</Link>
              <Link href='/login'>Login</Link>
              <Link href='/register'>Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
