import DashboardHeader from '@/components/DashboardHeader';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import StatsOverview from '@/components/StatsOverview';

const Home = () => {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="fade-in">
        <DashboardHeader />
      </div>
      
      {/* Stats Overview */}
      <div className="slide-in-up" style={{animationDelay: '200ms'}}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Overview
        </h2>
        <StatsOverview />
      </div>
      
      {/* Quick Actions */}
      <div className="slide-in-up" style={{animationDelay: '400ms'}}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <QuickActions />
      </div>
      
      {/* Recent Activity */}
      <div className="slide-in-up" style={{animationDelay: '600ms'}}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Activity
        </h2>
        <RecentActivity />
      </div>
    </div>
  );
};

export default Home;
