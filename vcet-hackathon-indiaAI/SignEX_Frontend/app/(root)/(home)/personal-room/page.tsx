"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const InfoCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 border-animate card-hover group fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h3 className="text-lg font-bold text-slate-800 sm:min-w-[120px] group-hover:text-slate-900 transition-colors duration-300">
          {title}:
        </h3>
        <p className="text-slate-700 font-medium break-all group-hover:text-slate-800 transition-colors duration-300">
          {description}
        </p>
      </div>
      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 group-hover:w-full rounded-full"></div>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id;
  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border-animate fade-in">
        <h1 className="text-4xl font-bold text-slate-800 mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
          Personal Meeting Room
        </h1>
        <p className="text-lg text-slate-600 font-medium">Your dedicated meeting space</p>
      </div>

      {/* Meeting Details */}
      <div className="space-y-6 max-w-5xl">
        <div className="slide-in-up" style={{animationDelay: '100ms'}}>
          <InfoCard 
            title="Topic" 
            description={`${user?.username || user?.firstName || 'Your'}'s Meeting Room`} 
          />
        </div>
        <div className="slide-in-up" style={{animationDelay: '200ms'}}>
          <InfoCard 
            title="Meeting ID" 
            description={meetingId || 'Loading...'} 
          />
        </div>
        <div className="slide-in-up" style={{animationDelay: '300ms'}}>
          <InfoCard 
            title="Invite Link" 
            description={meetingLink} 
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-6 sm:flex-row slide-in-up" style={{animationDelay: '400ms'}}>
        <Button 
          className="btn-gradient px-10 py-4 rounded-2xl text-lg font-bold border-animate group relative overflow-hidden" 
          onClick={startRoom}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <span className="relative z-10">Start Meeting</span>
        </Button>
        <Button
          className="btn-outline px-10 py-4 rounded-2xl text-lg font-bold"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
              description: "Meeting link copied to clipboard",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </div>
  );
};

export default PersonalRoom;