"use client";
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../lib/firebaseConfig";
import ListRecords from "./components/listRecords";
import Link from "next/link";
import Button from "./components/button/button";
import CreateForm from "./components/createForm/createForm";
import Input from "./components/input/input";

function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const [showCreateForm, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/masuk");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div className="bg-white text-black m-5">
      {showCreateForm && <CreateForm setShowModal={setShowModal} />}
      <div className="flex flex-wrap">
        <Button
          text="Buat Pengajuan"
          className="!w-48 my-2"
          onClick={() => setShowModal(true)}
        />
        <Input
          name="name"
          type="text"
          className="my-2 ml-5 !w-[350px]"
          placeholder="Filter"
        />
      </div>

      <ListRecords isHidden={showCreateForm} />
    </div>
  );
}

export default Home;
