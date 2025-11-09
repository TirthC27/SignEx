import Link from 'next/link';
import Image from 'next/image';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PermissionCardProps {
  title: string;
  iconUrl?: string;
}

const Alert = ({ title, iconUrl }: PermissionCardProps) => {
  return (
    <section className="flex-center h-screen w-full bg-gray-50">
      <Card className="w-full max-w-[520px] bg-white shadow-xl border border-gray-200 p-8">
        <CardContent>
          <div className="flex flex-col gap-8 text-center">
            <div className="flex flex-col gap-6">
              {iconUrl && (
                <div className="flex-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Image src={iconUrl} width={40} height={40} alt="icon" className="text-white" />
                  </div>
                </div>
              )}
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-2">{title}</p>
                <p className="text-gray-600">Please check your meeting details and try again</p>
              </div>
            </div>

            <Button asChild className="btn-gradient px-8 py-3 rounded-xl font-semibold">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;
