import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  return (
    <section id='faq' className='max-w-2xl mx-auto py-12 px-4'>
      <h2 className='text-3xl font-bold mb-8 text-center'>
        Frequently Asked Questions
      </h2>
      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>What is TravelBuddy?</AccordionTrigger>
          <AccordionContent>
            TravelBuddy is a platform that helps you find travel companions,
            plan trips, and connect with other travelers worldwide.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>How do I find a travel buddy?</AccordionTrigger>
          <AccordionContent>
            Sign up, create your profile, and use our matching feature to find
            travelers with similar interests and destinations.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>Is TravelBuddy free to use?</AccordionTrigger>
          <AccordionContent>
            Yes, you can use TravelBuddy for free. We also offer premium
            features for an enhanced experience.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>How is my privacy protected?</AccordionTrigger>
          <AccordionContent>
            We take your privacy seriously. Please read our Privacy Policy for
            details on how we protect your data.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-5'>
          <AccordionTrigger>How do I contact support?</AccordionTrigger>
          <AccordionContent>
            You can contact our support team anytime at support@travelbuddy.app
            or through the Contact page.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
