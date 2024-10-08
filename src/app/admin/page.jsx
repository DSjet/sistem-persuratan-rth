"use client";

import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../lib/firebaseConfig";
import AdminListRecords from "../components/adminListRecords";
import ViewModal from "../components/viewModal/page";
import Select from "react-select";
import { Datepicker } from "flowbite-react";

function Home() {
  const auth = getAuth(app);
  const router = useRouter();
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);
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
      {showViewModal && (
        <ViewModal
          setFetchCount={setFetchCount}
          fetchCount={fetchCount}
          setShowModal={setShowViewModal}
          activeItem={activeItem}
        />
      )}

      <p className="leading-5 mb-2">Filter</p>

      <Select
        isMulti={true}
        defaultValue={selectedOptions}
        options={options}
        onChange={setSelectedOptions}
        isSearchable={false}
        className={`${showViewModal ? "invisible" : ""}`}
      />

      <Datepicker
        className={`${showViewModal ? "invisible" : ""}`}
        onSelectedDateChanged={setDateStart}
        maxDate={dateEnd}
      />
      <small>Hingga</small>
      <Datepicker
        className={`${showViewModal ? "invisible" : ""} mb-10`}
        onSelectedDateChanged={setDateEnd}
        minDate={dateStart}
      />

      <AdminListRecords
        isHidden={showViewModal}
        setShowViewModal={setShowViewModal}
        setActiveItem={setActiveItem}
        selectedStatuses={selectedOptions}
        startDate={dateStart}
        endDate={dateEnd}
        fetchCount={fetchCount}
      />
    </div>
  );
}

export default Home;
