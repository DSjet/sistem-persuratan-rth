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

import Select from "react-select";
import { Datepicker } from "flowbite-react";

function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const [showCreateForm, setShowModal] = useState(false);

  const [activeItem, setActiveItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([
    {
      value: 0,
      label: "Diajukan",
    },
    {
      value: 1,
      label: "Diterima",
    },
    {
      value: 2,
      label: "Ditolak",
    },
  ]);

  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());

  const options = [
    {
      value: 0,
      label: "Diajukan",
    },
    {
      value: 1,
      label: "Diterima",
    },
    {
      value: 2,
      label: "Ditolak",
    },
  ];

  return (
    <div className="bg-white text-black m-5">
      {showCreateForm && <CreateForm setShowModal={setShowModal} />}

      <p className="leading-5 mb-2">Filter</p>

      <div className="mb-2 gap-2">
        <Select
          isMulti={true}
          defaultValue={selectedOptions}
          options={options}
          onChange={setSelectedOptions}
          isSearchable={false}
          className={`${showCreateForm ? "invisible" : ""} mb-3`}
        />
        <Datepicker
          className={`${showCreateForm ? "invisible" : ""}`}
          onSelectedDateChanged={setDateStart}
          maxDate={dateEnd}
        />
        <small>Hingga</small>
        <Datepicker
          className={`${showCreateForm ? "invisible" : ""}`}
          onSelectedDateChanged={setDateEnd}
          minDate={dateStart}
        />
      </div>
      <div className="flex flex-wrap">
        <Button
          text="Buat Pengajuan"
          className="!w-48 my-2"
          onClick={() => setShowModal(true)}
        />
      </div>

      <ListRecords
        isHidden={showCreateForm}
        setShowViewModal={setShowModal}
        setActiveItem={setActiveItem}
        selectedStatuses={selectedOptions}
        startDate={dateStart}
        endDate={dateEnd}
      />
    </div>
  );
}

export default Home;
