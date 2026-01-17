"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import type { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinks = isAuthenticated
    ? user?.role === "admin"
      ? [
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Admin Dashboard" },
          { href: "/admin/users", label: "Manage Users" },
          { href: "/admin/plans", label: "Manage Plans" },
          { href: `/profile/${user._id}`, label: "Profile" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/explore", label: "Explore" },
          { href: "/matching", label: "Find Buddy" },
          { href: "/travel-plans", label: "My Plans" },
          { href: `/profile/${user?._id}`, label: "Profile" },
        ]
    : [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/about", label: "About" },
      ];

  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <Plane className='h-6 w-6 text-blue-600' />
            <span className='text-xl font-bold text-gray-900'>TravelBuddy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-6'>
            <ModeToggle />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === link.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <Button onClick={handleLogout} variant='outline' size='sm'>
                Logout
              </Button>
            ) : (
              <div className='flex items-center space-x-3'>
                <Link href='/login'>
                  <Button variant='ghost' size='sm'>
                    Login
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button size='sm'>Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className='md:hidden'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 space-y-3'>
            <ModeToggle />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='block py-2 text-sm font-medium text-gray-700 hover:text-blue-600'
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                variant='outline'
                size='sm'
                className='w-full'
              >
                Logout
              </Button>
            ) : (
              <div className='space-y-2'>
                <Link
                  href='/login'
                  className='block'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant='ghost' size='sm' className='w-full'>
                    Login
                  </Button>
                </Link>
                <Link
                  href='/register'
                  className='block'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button size='sm' className='w-full'>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
