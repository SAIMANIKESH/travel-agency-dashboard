import React from 'react';
import { TbLogout2 } from 'react-icons/tb';

import { logoutUser } from '~/appwrite/auth';
import { useNavigate } from 'react-router';

const PageLayout = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <main className=''>
      <button
        className="cursor-pointer text-gray-100 hover:text-black"
        onClick={handleLogOut}
      >
        <TbLogout2 title="Log out" className="size-6 md:mt-1" />
      </button>
    </main>
  );
};

export default PageLayout;
