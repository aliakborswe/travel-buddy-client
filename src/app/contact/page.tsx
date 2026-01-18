import React from "react";

export default function ContactPage() {
  return (
    <main className='max-w-2xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Contact Us</h1>
      <p className='mb-8 text-center text-gray-700'>
        Have questions, feedback, or need support? Reach out to the Travel Buddy
        team!
      </p>
      <form className='bg-white shadow-md rounded-lg p-6 space-y-4'>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>
        <div>
          <label
            htmlFor='message'
            className='block text-sm font-medium text-gray-700'
          >
            Message
          </label>
          <textarea
            id='message'
            name='message'
            rows={4}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition'
        >
          Send Message
        </button>
      </form>
      <div className='mt-10 text-center text-gray-600'>
        <p>
          Email:{" "}
          <a
            href='mailto:support@travelbuddy.app'
            className='text-blue-600 hover:underline'
          >
            support@travelbuddy.app
          </a>
        </p>
        <p>Address: 123 Traveler Lane, Adventure City, World</p>
      </div>
    </main>
  );
}
