import CallList from '@/components/CallList';

const UpcomingPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="white-card-elevated rounded-xl p-6 fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Upcoming Meetings
        </h1>
        <p className="text-gray-600">View and manage your scheduled meetings</p>
      </div>

      {/* Content */}
      <div className="white-card-elevated rounded-xl p-6 fade-in" style={{animationDelay: '200ms'}}>
        <CallList type="upcoming" />
      </div>
    </div>
  );
};

export default UpcomingPage;