import { Facebook, Github, Globe, Linkedin } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className='border-t border-border py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='space-y-4'>
            <Link href='/' className='flex items-center gap-2 text-gray-700'>
              <Globe className='h-5 w-5 text-blue-600' />
              TravelBuddy
            </Link>
            <p className='text-sm text-muted-foreground'>
              Connect with like-minded travelers, plan amazing trips, and create
              unforgettable memories together.
            </p>
          </div>

          <div>
            <h4 className='mb-4 font-semibold'>Links</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <Link
                  href='/explore'
                  className='hover:text-blue-600 transition-colors duration-200 hover:scale-105 inline-block'
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href='/travel-plans/add'
                  className='hover:text-blue-600 transition-colors duration-200 hover:scale-105 inline-block'
                >
                  Create Plan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-4 font-semibold'>Support</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <Link href='/about#faq' className='hover:text-foreground'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-foreground'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-4 font-semibold'>Legal</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                <Link href='/privacy' className='hover:text-foreground'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms-of-service'
                  className='hover:text-foreground'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} Neo Wallet. All rights reserved.
          </p>
          {/* social media links */}
          <div className='space-x-4 flex'>
            <Link
              href='https://github.com/aliakborswe'
              className='hover:text-foreground flex items-center'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Github className='h-5 w-5' />
            </Link>
            <Link
              href='https://linkedin.com/aliakborswe/'
              className='hover:text-foreground flex items-center'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Linkedin className='h-5 w-5' />
            </Link>
            <Link
              href='https://facebook.com/aliakborse/'
              className='hover:text-foreground flex items-center'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Facebook className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
