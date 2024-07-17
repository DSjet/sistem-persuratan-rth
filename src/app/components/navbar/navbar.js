"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "../button/button";

import { useState, useEffect } from "react";
import { app } from "../../../lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push("/masuk");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <nav className="w-full bg-green-100 h-20">
      <ul className="w-full flex items-center justify-between px-10 shadow-sm">
        <li className="flex items-center py-5">
          <Link href="/">
            <Image
              src="/images/logo/logo_kabupaten_rokan_hulu.png"
              alt="home icon"
              width={40}
              height={40}
            />
          </Link>
          <p className="text-green-700 font-bold ml-4">SIMAPER</p>
        </li>
        {user ? (
          <li
            className="static py-5"
            onMouseEnter={() => setLogoutModal(true)}
            onMouseLeave={() => setLogoutModal(false)}
          >
            <div className="flex items-center gap-2">
              <p>Hai, {user.displayName.split(" ")[0]}</p>
              <Image
                className="rounded-full"
                src={user.photoURL}
                alt="home icon"
                width={40}
                height={40}
              />
            </div>
            <div
              className={`${
                logoutModal ? "block" : "hidden"
              } absolute flex top-20 right-10 p-4 gap-2 bg-white shadow-md rounded-full`}
              onClick={handleLogout}
            >
              <p>Keluar</p>
              <Image
                src="/images/icons/Sign_in_square_fill.svg"
                alt="home icon"
                width={25}
                height={25}
              />
            </div>
          </li>
        ) : (
          <li className="py-5">
            <Button text={"Masuk"} onClick={signInWithGoogle} />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
