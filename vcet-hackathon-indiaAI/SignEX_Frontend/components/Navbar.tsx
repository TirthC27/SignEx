import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-10 shadow-sm border-b border-slate-200/30">
      {/* Logo Section */}
      <Link href="/" className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
          <Image
            src="/icons/logo.svg"
            width={20}
            height={20}
            alt="SignEX logo"
            className="text-white sm:w-6 sm:h-6"
          />
        </div>
        <div className="hidden xs:block">
          <p className="text-lg sm:text-xl font-bold text-slate-800">SignEX</p>
          <p className="text-xs text-slate-600 -mt-1 hidden sm:block">Professional</p>
        </div>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* User Section */}
        <SignedIn>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-800">Welcome back</p>
              <p className="text-xs text-slate-600">Ready to connect</p>
            </div>
            <div className="relative">
              <div className="p-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                <UserButton
                  afterSignOutUrl="/sign-in"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-9 sm:h-9 rounded-full",
                      userButtonPopoverCard: "shadow-xl",
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </SignedIn>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
