"use client";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import Link from "next/link";
import { Button } from "./ui/button";
const navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className='p-2 md:p-4 shadown-md border-b'>
      <div className='w-full flex justify-between items-center max-w-[1640px] mx-auto'>
        <a href='#' className='text-xl font-bold'>
          Mystery Message
        </a>
        {session ? (
          <>
            <span className='mr-4 hidden md:block'>
              Welcome, {user?.username || user?.email}
            </span>
            <Button className='w-full md:w-auto' onClick={() => signOut()}>
              Log out
            </Button>
          </>
        ) : (
          <Link href={"/sign-in"}>
            <Button>Log in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default navbar;
