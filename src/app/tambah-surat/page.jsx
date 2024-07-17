import React from "react";
import AddRecord from "../components/addRecord";
import Link from "next/link";

const TambahSuratPage = () => {
  return (
    <div>
      <AddRecord />
      <Link href="/">Kembali</Link>
    </div>
  );
};

export default TambahSuratPage;
