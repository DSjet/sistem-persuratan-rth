"use client";

import { useState, useEffect } from "react";
import { app } from "../../../lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function Masuk() {
  const [user, setUser] = useState(null);
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

  return (
    <main>
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 m-5">
        <Carousel slideInterval={3000}>
          <img src="/images/PEMERINTAH.png" alt="..." />
          <img src="/images/PEMERINTAH_(1).png" alt="..." />
          <img src="/images/JEMBATAN_GANTUNG_BATANG_LUBUH.png" alt="..." />
          <img src="/images/slidekades.jpg" alt="..." />
        </Carousel>
      </div>

      <div className="w-64 mx-auto" onClick={signInWithGoogle}>
        <div className="p-2 flex gap-4 items-center justify-center outline-1 outline rounded-full">
          <Image
            src="/images/logo/Google.svg"
            alt="home icon"
            width={15}
            height={15}
          />
          Masuk dengan Google
        </div>
        <Button
          text="Lihat Panduan"
          className="!w-48 my-2"
          onClick={() => {
            // redirect to https://bit.ly/modulpenggunaSIMAPER

            window.open("https://bit.ly/modulpenggunaSIMAPER", "_blank");
          }}
        />
      </div>
    </main>
  );
}
