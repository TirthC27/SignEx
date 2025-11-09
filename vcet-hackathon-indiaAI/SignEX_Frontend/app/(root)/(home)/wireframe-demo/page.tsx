import WireframeCard from '@/components/WireframeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WireframeDemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Wireframe Card Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A modern wireframe card component with Google.com iframe integration, 
            featuring custom animations and interactive elements.
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Wireframe Card */}
          <div className="lg:col-span-2">
            <WireframeCard />
          </div>

          {/* Info Card */}
          <div className="space-y-6">
            <Card className="white-card-elevated">
              <CardHeader>
                <CardTitle className="text-xl">Features</CardTitle>
                <CardDescription>
                  What makes this wireframe card special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Interactive wireframe design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Google.com iframe</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Custom animations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Responsive design</span>
                </div>
              </CardContent>
            </Card>

            <Card className="white-card-elevated">
              <CardHeader>
                <CardTitle className="text-xl">Usage</CardTitle>
                <CardDescription>
                  How to use this component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Google.com loads in an iframe</p>
                  <p>• Fullscreen toggle available</p>
                  <p>• Loading animation while iframe loads</p>
                  <p>• Hover effects on wireframe elements</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Wireframe Examples */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            More Wireframe Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Simple Wireframe Card */}
            <Card className="white-card card-hover">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>

            {/* Complex Wireframe Card */}
            <Card className="white-card card-hover">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>

            {/* Animated Wireframe Card */}
            <Card className="white-card card-hover">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 shimmer"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 shimmer"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3 shimmer"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WireframeDemoPage;
