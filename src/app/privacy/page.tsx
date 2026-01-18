import React from "react";

export default function PrivacyPage() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Privacy Policy</h1>
      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-2'>Introduction</h2>
        <p>
          At Travel Buddy, your privacy is important to us. This Privacy Policy
          explains how we collect, use, and protect your information when you
          use our platform.
        </p>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Information We Collect</h2>
        <ul className='list-disc ml-6'>
          <li>
            Personal information (name, email, etc.) provided during
            registration
          </li>
          <li>Travel preferences and plans you share</li>
          <li>Usage data and cookies for improving our services</li>
        </ul>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>
          How We Use Your Information
        </h2>
        <ul className='list-disc ml-6'>
          <li>To match you with compatible travelers</li>
          <li>To improve and personalize your experience</li>
          <li>To communicate important updates and offers</li>
        </ul>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Your Rights</h2>
        <p>
          You can access, update, or delete your personal information at any
          time. Contact us at{" "}
          <a
            href='mailto:support@travelbuddy.app'
            className='text-blue-600 hover:underline'
          >
            support@travelbuddy.app
          </a>{" "}
          for privacy-related requests.
        </p>
      </section>
      <section>
        <h2 className='text-xl font-semibold mb-2'>Policy Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. Please review it
          regularly for any changes.
        </p>
      </section>
    </main>
  );
}
