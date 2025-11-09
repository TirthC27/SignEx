'use client';

const StatsOverview = () => {
  const stats = [
    {
      title: 'Total Meetings',
      value: '127',
      change: '+12%',
      changeType: 'positive',
      icon: '/icons/schedule.svg',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Hours This Month',
      value: '48.5',
      change: '+8%',
      changeType: 'positive', 
      icon: '/icons/Video.svg',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Active Participants',
      value: '342',
      change: '+15%',
      changeType: 'positive',
      icon: '/icons/add-personal.svg',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Recordings',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: '/icons/recordings.svg',
      gradient: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="white-card-elevated rounded-xl p-6 card-hover group fade-in"
          style={{animationDelay: `${index * 100}ms`}}
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
              <img 
                src={stat.icon} 
                alt={stat.title}
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300 ${
              stat.changeType === 'positive' 
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                : 'text-red-700 bg-red-50 border border-red-200'
            }`}>
              {stat.change}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm font-medium group-hover:text-gray-700 transition-colors duration-300">
              {stat.title}
            </p>
          </div>
          
          {/* Gradient accent line at bottom */}
          <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${stat.gradient} transition-all duration-300 group-hover:w-full`}></div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
