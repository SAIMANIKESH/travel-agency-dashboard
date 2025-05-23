import React from 'react';
import { redirect, Outlet } from "react-router";

import { storeUserData, getExistingUser } from '~/appwrite/auth';
import { account } from '~/appwrite/client';
import RootNavbar from 'components/RootNavbar';

export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user.$id) return redirect('/sign-in');

    const existingUser = await getExistingUser(user.$id);
    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
    console.error('Error fetching user data: ', error);
    return redirect('/sign-in');
  }
}

const PageLayout = () => {
  return (
    <div className='bg-light-200'>
      <RootNavbar />
      <Outlet />
    </div>
  );
};

export default PageLayout;
