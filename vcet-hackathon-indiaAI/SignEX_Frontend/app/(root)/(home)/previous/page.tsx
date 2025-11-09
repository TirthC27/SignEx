import CallList from "@/components/CallList";

const PreviousPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Previous Meetings
        </h1>
        <p className="text-gray-600">Review your completed meetings</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm fade-in" style={{animationDelay: '200ms'}}>
        <CallList type="ended" />
      </div>
    </div>
  );
};

export default PreviousPage;