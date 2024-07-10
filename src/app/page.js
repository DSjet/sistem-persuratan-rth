// src/app/page.js

import AddRecord from "@/components/addRecord";
import ListRecords from "@/components/listRecords";

export default function Home() {
  return (
    <div className="bg-white h-screen w-screen text-black flex flex-col justify-center items-center">
      <h1>Welcome to My Next.js App</h1>
      <AddRecord />
      {/* <ListRecords /> */}
    </div>
  );
}
