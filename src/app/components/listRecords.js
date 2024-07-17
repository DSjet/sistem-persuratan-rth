// app/components/ListItems.js
"use client";

import { useEffect, useState } from "react";
import db from "../../../utils/firestore";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import DeleteRecords from "./deleteRecord";
import { Table, Pagination } from "flowbite-react";

const ListRecords = ({ isHidden = false }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Surat Keterangan",
      tanggal_pengajuan: "2022-10-10",
      status: "Diterima",
    },
    {
      id: 2,
      name: "Surat Keterangan",
      tanggal_pengajuan: "2022-10-10",
      status: "Diproses",
    },
    {
      id: 3,
      name: "Surat Pindah",
      tanggal_pengajuan: "2022-10-10",
      status: "Ditolak",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      // setItems(
      //   querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      // );
    };

    fetchItems();
  }, []);

  return (
    <div className={`${isHidden ? "invisible" : ""}`}>
      <div className="relative border w-full text-center p-4 -z-[0]">
        <div className="overflow-x-auto">
          <Table className="">
            <Table.Head>
              <Table.HeadCell>Jenis Surat</Table.HeadCell>
              <Table.HeadCell>Tanggal Pengajuan</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {items.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                  id={item.id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </Table.Cell>
                  <Table.Cell>{item.tanggal_pengajuan}</Table.Cell>
                  <Table.Cell className="text-white">
                    {item.status === "Diterima" ? (
                      <span className="bg-green-500 py-1 px-2 rounded-full">
                        {item.status}
                      </span>
                    ) : item.status === "Diproses" ? (
                      <span className="bg-yellow-500 py-1 px-2 rounded-full">
                        {item.status}
                      </span>
                    ) : (
                      <span className="bg-red-500 py-1 px-2 rounded-full">
                        {item.status}
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* <ul>
        {items.map((item) => (
          <li key={item.id} className="border-t-2 p-2">
            <p>{item.name}</p>
            <DeleteRecords id={item.id} />
          </li>
        ))}
      </ul> */}
      </div>
      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={100}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default ListRecords;
