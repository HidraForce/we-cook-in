"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";


const UserMenu = ({ user, onSignOut }: { user: User; onSignOut: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative rounded-2xl" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-yellow-300 rounded-2xl transition-colors"
      >
        <FontAwesomeIcon icon={faCircleUser} className="w-5 h-5" />
        <span className="max-md:hidden text-sm max-w-[100px] truncate">{user.email}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 text-black">
          <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-amber-100 transition-colors ">
            Dashboard
          </Link>
          <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-amber-100 transition-colors">
            Profile
          </Link>
          <hr className="my-1 border-gray-200" />
          <button onClick={onSignOut} className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition-colors">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const menuItems = ["Home", "Products", "About", "Contact"];

  return (
    <header className="bg-amber-500 text-white p-4 relative rounded-b-[2px] shadow-lg z-30  ">
      {/* DESKTOP */}
      <div className="flex justify-between items-center max-md:hidden">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          <span className="ml-2 font-bold">We Cook In</span>
        </Link>

        <nav className="flex">
          {menuItems.map((item) => (
            <Link key={item} href="#" className="px-3 py-2 hover:bg-red-400 rounded-3xl transition-colors">
              {item}
            </Link>
          ))}
        </nav>

        {user ? (
          <UserMenu user={user} onSignOut={handleSignOut} />
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="px-4 py-2 bg-orange-600 hover:bg-yellow-300 rounded-2xl text-white">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-red-700 hover:bg-yellow-300 rounded-2xl text-white">Sign Up</Link>
          </div>
        )}
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex justify-between items-center">
        <button
          className="px-3 py-2 hover:bg-red-400 rounded transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/">
          <Image src="/images/logo-mobile.png" alt="Logo" width={50} height={50} className="rounded-full" />
        </Link>

        {user ? (
          <UserMenu user={user} onSignOut={handleSignOut} />
        ) : (
          <button className="px-4 py-2 bg-orange-600 hover:bg-yellow-300 rounded text-white" onClick={() => router.push("/login")}>
            <FontAwesomeIcon icon={faCircleUser} aria-hidden="true" />
            <span className="sr-only">User Account</span>
          </button>
        )}
      </div>

      <div
        id="mobile-nav"
        className={`absolute top-24 left-0 w-full px-4 transition-all duration-300 z-40 ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={item}
              href="#"
              onClick={() => setIsOpen(false)}
              className={`block w-full text-center py-3 rounded-xl bg-amber-100 text-black shadow-md transition-all duration-300
                ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};