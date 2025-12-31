export default function AboutPage() {
  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-gray-900'>
          About TravelBuddy
        </h1>
        <p className='mt-4 text-gray-700 leading-7'>
          TravelBuddy is a community for travelers to connect, plan trips, and
          explore the world together. We help you find compatible travel
          companions based on destination, dates, interests, and travel style.
        </p>
        <h2 className='mt-8 text-2xl font-semibold text-gray-900'>
          What We Value
        </h2>
        <ul className='mt-3 space-y-2 text-gray-700'>
          <li>
            <strong>Safety:</strong> Verified profiles, reporting, and
            moderation to keep the community safe.
          </li>
          <li>
            <strong>Connection:</strong> Meaningful matches based on interests
            and preferences.
          </li>
          <li>
            <strong>Accessibility:</strong> Start free and upgrade anytime for
            premium features.
          </li>
        </ul>
        <h2 className='mt-8 text-2xl font-semibold text-gray-900'>
          How It Works
        </h2>
        <ol className='mt-3 list-decimal list-inside space-y-2 text-gray-700'>
          <li>Create your profile and share your travel style.</li>
          <li>Post a travel plan or explore existing trips.</li>
          <li>Match, chat, and start your next adventure together.</li>
        </ol>
        <div className='mt-10'>
          <a
            href='/explore'
            className='inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            Explore Plans
          </a>
        </div>
        <p className='mt-12 text-sm text-gray-500'>
          Have questions? Reach us at support@travelbuddy.app
        </p>
      </div>
    </div>
  );
}
