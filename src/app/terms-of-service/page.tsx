import React from "react";

export default function TermsOfServicePage() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Terms of Service</h1>
      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-2'>Acceptance of Terms</h2>
        <p>
          By using Travel Buddy, you agree to these Terms of Service. Please
          read them carefully before using our platform.
        </p>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>User Responsibilities</h2>
        <ul className='list-disc ml-6'>
          <li>Provide accurate and truthful information</li>
          <li>Respect other users and their privacy</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Prohibited Activities</h2>
        <ul className='list-disc ml-6'>
          <li>Harassment, abuse, or discrimination</li>
          <li>Posting false or misleading information</li>
          <li>Unauthorized commercial activities</li>
        </ul>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Limitation of Liability</h2>
        <p>
          Travel Buddy is not liable for any damages or losses resulting from
          your use of the platform. Use at your own risk.
        </p>
      </section>
      <section>
        <h2 className='text-xl font-semibold mb-2'>Changes to Terms</h2>
        <p>
          We may update these Terms of Service at any time. Continued use of the
          platform constitutes acceptance of the new terms.
        </p>
      </section>
    </main>
  );
}
