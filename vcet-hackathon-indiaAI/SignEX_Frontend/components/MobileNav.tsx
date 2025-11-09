'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer sm:hidden">
            <Image
              src="/icons/hamburger.svg"
              width={24}
              height={24}
              alt="hamburger icon"
              className="text-white"
            />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Image
                src="/icons/logo.svg"
                width={24}
                height={24}
                alt="SignEX logo"
                className="text-white"
              />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">SignEX</p>
              <p className="text-xs text-slate-600 -mt-1">Professional</p>
            </div>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-3 pt-4 text-slate-800">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          'group flex gap-4 items-center p-4 rounded-xl w-full max-w-60 transition-all duration-300',
                          {
                            'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg': isActive,
                            'hover:bg-white/80 hover:shadow-sm': !isActive,
                          }
                        )}
                      >
                        <div className={cn(
                          'p-2 rounded-lg transition-all duration-300',
                          {
                            'bg-white/20': isActive,
                            'bg-slate-100 group-hover:bg-blue-100': !isActive,
                          }
                        )}>
                          <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={cn(
                              'transition-colors duration-300',
                              {
                                'text-white': isActive,
                                'text-slate-600 group-hover:text-blue-600': !isActive,
                              }
                            )}
                          />
                        </div>
                        <p className={cn(
                          'font-medium transition-colors duration-300',
                          {
                            'text-white': isActive,
                            'text-slate-700 group-hover:text-slate-900': !isActive,
                          }
                        )}>
                          {item.label}
                        </p>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-white/80"></div>
                        )}
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
