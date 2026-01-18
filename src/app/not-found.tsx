import PlaneLogo from "@/components/PlaneLogo";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='flex '>
        <div>
          <h1 className='text-7xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-lg mb-2 tracking-tight'>
            404
          </h1>
          <h2 className='text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4'>
            Page Not Found
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md'>
            Oops! The page you are looking for doesn’t exist or has been moved.
            <br />
            Please check the URL or return to the homepage.
          </p>
          <Link href='/'>
            <span className='px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition font-semibold text-lg'>
              Go Home
            </span>
          </Link>
        </div>
        <PlaneLogo />
      </div>
    </div>
  );
}
