"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="group bg-white rounded-xl min-h-[280px] w-full flex flex-col justify-between px-6 py-8 xl:max-w-[568px] shadow-sm hover:shadow-md transition-all duration-300 fade-in relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 float"></div>
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 delay-200"></div>
      
      <article className="flex flex-col gap-6 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Image 
            src={icon} 
            alt="meeting type" 
            width={24} 
            height={24} 
            className="text-white transition-transform duration-300 group-hover:scale-125" 
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
              {title}
            </h1>
            <p className="text-base font-medium text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
              {date}
            </p>
          </div>
        </div>
      </article>
      
      <article className="flex justify-between items-center mt-6 relative z-10">
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages.map((img, index) => (
            <div
              key={index}
              className={cn("transition-all duration-300 group-hover:scale-110", { absolute: index > 0 })}
              style={{ 
                top: 0, 
                left: index * 26,
                animationDelay: `${index * 100}ms`
              }}
            >
              <Image
                src={img}
                alt="attendees"
                width={38}
                height={38}
                className="rounded-full border-3 border-white shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
          ))}
          <div className="flex-center absolute left-[130px] size-10 rounded-full border-3 border-white bg-gradient-to-br from-slate-600 to-slate-700 text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
            +5
          </div>
        </div>
        
        {!isPreviousMeeting && (
          <div className="flex gap-3 ml-auto">
            <Button 
              onClick={handleClick} 
              className="btn-gradient px-6 py-3 rounded-xl border-animate relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center">
                {buttonIcon1 && (
                  <Image src={buttonIcon1} alt="feature" width={16} height={16} className="transition-transform duration-300 group-hover/btn:scale-110" />
                )}
                {buttonIcon1 && <span className="ml-2 font-semibold">{buttonText}</span>}
                {!buttonIcon1 && <span className="font-semibold">{buttonText}</span>}
              </div>
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                  description: "Meeting link copied to clipboard",
                });
              }}
              className="btn-outline px-6 py-3 rounded-xl group/copy"
            >
              <Image
                src="/icons/copy.svg"
                alt="copy"
                width={16}
                height={16}
                className="transition-transform duration-300 group-hover/copy:scale-110"
              />
              <span className="ml-2 font-semibold">Copy Link</span>
            </Button>
          </div>
        )}
      </article>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:translate-x-full"></div>
    </section>
  );
};

export default MeetingCard;
