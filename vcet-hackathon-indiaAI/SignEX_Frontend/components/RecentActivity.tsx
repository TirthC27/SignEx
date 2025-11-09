'use client';

import Image from 'next/image';
import Link from 'next/link';

const RecentActivity = () => {
  // Mock data - replace with real data from your API
  const recentMeetings = [
    {
      id: '1',
      title: 'Team Standup',
      time: '2 hours ago',
      duration: '30 min',
      participants: 8,
      status: 'completed',
      thumbnail: '/images/avatar-1.jpeg'
    },
    {
      id: '2', 
      title: 'Client Presentation',
      time: 'Yesterday',
      duration: '1h 15min',
      participants: 12,
      status: 'completed',
      thumbnail: '/images/avatar-2.jpeg'
    },
    {
      id: '3',
      title: 'Project Review',
      time: '2 days ago', 
      duration: '45 min',
      participants: 6,
      status: 'completed',
      thumbnail: '/images/avatar-3.png'
    }
  ];

  const upcomingMeetings = [
    {
      id: '4',
      title: 'Weekly Sync',
      time: 'Today, 2:00 PM',
      participants: 5,
      status: 'upcoming'
    },
    {
      id: '5',
      title: 'Design Review',
      time: 'Tomorrow, 10:00 AM', 
      participants: 7,
      status: 'upcoming'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Meetings */}
      <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Meetings</h3>
          <Link 
            href="/previous" 
            className="btn-outline px-3 py-2 rounded-lg text-sm"
          >
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentMeetings.map((meeting, index) => (
            <div 
              key={meeting.id} 
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="relative">
                <Image
                  src={meeting.thumbnail}
                  alt="Meeting thumbnail"
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">{meeting.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{meeting.time}</span>
                  <span>•</span>
                  <span>{meeting.duration}</span>
                  <span>•</span>
                  <span>{meeting.participants} participants</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  href={`/meeting/${meeting.id}`}
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Image
                    src="/icons/play.svg"
                    alt="Play"
                    width={16}
                    height={16}
                    className="text-white"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-xl p-6 shadow-sm fade-in" style={{animationDelay: '200ms'}}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Upcoming</h3>
          <Link 
            href="/upcoming" 
            className="btn-outline px-3 py-2 rounded-lg text-sm"
          >
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {upcomingMeetings.map((meeting, index) => (
            <div 
              key={meeting.id} 
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
              style={{animationDelay: `${(index + 3) * 100}ms`}}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Image
                  src="/icons/schedule.svg"
                  alt="Scheduled"
                  width={18}
                  height={18}
                  className="text-white"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">{meeting.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{meeting.time}</span>
                  <span>•</span>
                  <span>{meeting.participants} participants</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="btn-primary px-3 py-2 rounded-lg text-sm">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
