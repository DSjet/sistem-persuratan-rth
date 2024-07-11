"use client";
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../lib/firebaseConfig";
import ListRecords from "@/components/listRecords";
import Image from "next/image";
import Link from "next/link";

function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/masuk");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/masuk");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div className="bg-white h-screen w-screen text-black flex flex-col justify-center items-center">
      <h1>Dashboard</h1>
      <Link
        href="/tambah-surat"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {" "}
        Tambah Surat
      </Link>
      <ListRecords />
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}
      {/* <ListRecords /> */}
    </div>
  );
}

export default Home;
