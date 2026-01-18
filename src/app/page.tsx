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
import PlaneLogo from "@/components/PlaneLogo";
import { FAQSection } from "@/components/faq/FAQSection";

export default function Home() {
  return (
    <div className='min-h-screen bg-linear-to-b from-white via-blue-50/30 to-gray-50'>
      <section className='relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 md:py-32'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-8'>
            <div className='flex flex-col justify-center space-y-8 animate-[fadeIn_0.8s_ease-in]'>
              <h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg'>
                Find Your Perfect{" "}
                <span className='bg-linear-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent'>
                  Travel Companion
                </span>
              </h1>
              <p className='text-xl text-blue-50/90 md:text-2xl drop-shadow-md'>
                Connect with like-minded travelers, plan amazing trips, and
                create unforgettable memories together.
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link href='/explore'>
                  <Button
                    size='lg'
                    className='w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'
                  >
                    <Search className='mr-2 h-5 w-5' />
                    Find Travel Buddies
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm'
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className='hidden lg:flex items-center justify-center'>
              <div className='relative h-96 w-96'>
                <div className='absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm animate-pulse' />
                <div className='absolute inset-8 rounded-full bg-white/40 backdrop-blur-sm animate-[pulse_3s_ease-in-out_infinite]' />
                <div className='absolute inset-16 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]'>
                  <PlaneLogo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matching CTA */}
      <section className='py-16 sm:py-20 bg-linear-to-br from-white to-blue-50/50'>
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
              <Button className='hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl'>
                <Plane className='mr-2 h-5 w-5' /> Create a Plan
              </Button>
            </Link>
            <Link href='/matching'>
              <Button
                variant='outline'
                className='hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg'
              >
                Find a Buddy
              </Button>
            </Link>
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
            <Card className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-100/50 hover:border-blue-300'>
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
            <Card className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-100/50 hover:border-blue-300'>
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
            <Card className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-100/50 hover:border-blue-300'>
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
              <Card
                key={d}
                className='hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer border-gray-200/50 bg-linear-to-br from-white to-gray-50/50'
              >
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 group-hover:text-blue-600 transition-colors'>
                    <MapPin className='h-5 w-5 text-red-500 group-hover:scale-110 transition-transform' />
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
              <Card
                key={(f as any).title}
                className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-100/50 hover:border-blue-300 bg-linear-to-br from-white to-blue-50/20'
              >
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
              <Card
                key={t.name}
                className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-yellow-200/50 bg-linear-to-br from-white to-yellow-50/20'
              >
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
            <Card className='hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-200/50 bg-linear-to-br from-white to-gray-50'>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>
                  Browse, create plans, and match with limits.
                </CardDescription>
              </CardHeader>
              <CardContent className='flex items-center justify-between'>
                <div className='text-3xl font-bold'>$0</div>
                <Link href='/register'>
                  <Button className='hover:scale-105 transition-transform duration-300'>
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className='border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-600 bg-linear-to-br from-blue-50/50 to-white relative overflow-hidden before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-500/10 before:to-transparent before:opacity-0 before:hover:opacity-100 before:transition-opacity'>
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
                <Link href='/premium' className='relative'>
                  <Button className='bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
                    Upgrade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
