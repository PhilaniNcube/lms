"use client"
import {useRouter, usePathname} from 'next/navigation'
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';


const NavbarRoutes = () => {

  const pathname = usePathname()


  const isTeacherPage = pathname?.startsWith("/teacher")
  const isPlayerPage = pathname?.includes('/chapter')

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button aria-label="Log Out" type="button" size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button
            aria-label="Teacher Mode"
            type="button"
            size="sm"
            variant="ghost"
          >
            Teacher Mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
export default NavbarRoutes;
