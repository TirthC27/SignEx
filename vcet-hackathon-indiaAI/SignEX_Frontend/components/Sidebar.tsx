'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 pt-20 sm:pt-28 text-slate-800 max-sm:hidden md:w-[240px] lg:w-[280px] shadow-xl border-r border-slate-200/50">
      {/* Navigation Links */}
      <div className="flex flex-1 flex-col gap-3 pt-4">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return (
                <Link
                  href={item.route}
                  key={item.label}
                  className={cn(
                    'group flex gap-3 md:gap-4 items-center p-3 md:p-4 rounded-lg md:rounded-xl justify-start transition-all duration-300 hover:shadow-md',
                    {
                      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg': isActive,
                      'hover:bg-white/80 hover:shadow-sm': !isActive,
                    }
                  )}
                >
                  <div className={cn(
                    'p-1.5 md:p-2 rounded-lg transition-all duration-300',
                    {
                      'bg-white/20': isActive,
                      'bg-slate-100 group-hover:bg-blue-100': !isActive,
                    }
                  )}>
                    <Image
                      src={item.imgURL}
                      alt={item.label}
                      width={18}
                      height={18}
                      className={cn(
                        'md:w-5 md:h-5 transition-colors duration-300',
                        {
                          'text-white': isActive,
                          'text-slate-600 group-hover:text-blue-600': !isActive,
                        }
                      )}
                    />
                  </div>
                  <div className="flex-1 hidden md:block lg:block">
                    <p className={cn(
                      'font-medium transition-colors duration-300 text-sm md:text-base',
                      {
                        'text-white': isActive,
                        'text-slate-700 group-hover:text-slate-900': !isActive,
                      }
                    )}>
                      {item.label}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/80"></div>
                  )}
                </Link>
          );
        })}
      </div>

    </section>
  );
};

export default Sidebar;
