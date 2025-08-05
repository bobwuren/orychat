import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-600 mb-2">Page non trouvée</h2>
          <p className="text-gray-600 mb-6">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/dashboard">
                Retour au tableau de bord
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
