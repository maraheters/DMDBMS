import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { logoutUser } from '@/actions/auth.actions';

interface HeaderProps {
  user?: {
    email: string;
    roleId: number;
  } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CarMarket</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/listings" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Browse Cars
            </Link>
            <Link href="/listings/new" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Sell Your Car
            </Link>
            {user?.roleId === 1 && (
               <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                 <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.email}</span>
                 <form action={logoutUser}>
                    <Button variant="ghost" size="sm">Logout</Button>
                 </form>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

