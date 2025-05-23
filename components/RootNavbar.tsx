import React from 'react';
import { TbLogout2 } from 'react-icons/tb';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from 'react-router';

import { logoutUser } from '~/appwrite/auth';
import { cn } from '~/lib/utils';

const RootNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = useLoaderData();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/sign-in');
  };

  return (
    <nav
      className={cn(
        location.pathname === `/travel/${params.tripId}`
          ? "bg-white"
          : "glassmorphism",
        "w-full fixed z-50"
      )}
    >
      <header className="root-nav wrapper">
        <Link to="/" className="link-logo">
          <img src="/icons/logo.svg" alt="Logo" className="size-[30px]" />
          <h1>Tourvista</h1>
        </Link>

        <aside>
          {user.status === "admin" && (
            <Link
              to="/dashboard"
              className={cn(
                "text-base font-normal text-cyan-400 border hover:border-none hover:text-white hover:bg-[#1f8498] p-2 px-3 rounded-xl",
                {
                  "text-dark-100": location.pathname.startsWith("/travel"),
                }
              )}
            >
              Admin Panel
            </Link>
          )}

          <img
            src={user?.imageUrl || "/images/david.webp"}
            alt="User"
            title={`${user.name}`}
            referrerPolicy="no-referrer"
          />

          <button
            className="cursor-pointer text-black rounded-full p-2 hover:bg-blur-500 transition-all duration-300"
            onClick={handleLogout}
            title="Log out"
          >
            {/* <TbLogout2 title="Log out" className="size-6 md:mt-1 rotate-180" /> */}
            <img
              src="/icons/logout.svg"
              alt="Logout"
              className="size-6 rotate-180"
            />
          </button>
        </aside>
      </header>
    </nav>
  );
};

export default RootNavbar;
