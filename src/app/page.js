"use client";
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../lib/firebaseConfig";
import ListRecords from "./components/listRecords";
import Link from "next/link";
import Button from "./components/button/button";
import CreateForm from "./components/createForm/createForm";
import Input from "./components/input/input";

function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showCreateForm, setShowModal] = useState(false);

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
    <div className="bg-white h-screen text-black m-5">
      {showCreateForm && <CreateForm setShowModal={setShowModal} />}
      <div className="flex gap-4 mb-5">
        <Button
          text="Buat Pengajuan"
          className="w-40"
          onClick={() => setShowModal(true)}
        />
        <Input name="name" type="text" className="my-2" placeholder="Filter" />
      </div>

      <ListRecords isHidden={showCreateForm} />
    </div>
  );
}

export default Home;
