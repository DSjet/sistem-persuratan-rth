// app/components/ListItems.js
"use client";

import { useEffect, useState } from "react";
import db from "../../../utils/firestore";
import app from "../../../lib/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Table, Pagination } from "flowbite-react";
import { getAuth } from "firebase/auth";
import Moment from "react-moment";

const ListRecords = ({ isHidden = false }) => {
  const [pengajuans, setPengajuans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (localUser) => {
      if (localUser) {
        setUser(localUser);
        const first = query(
          collection(db, "pengajuans"),
          where("user.id", "==", localUser.uid),
          orderBy("tanggal_pengajuan")
        );

        const items = await getDocs(first);

        setPengajuans(items.docs.map((doc) => doc.data()));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const fetchItems = async () => {
    // get items where user.id, == user.id
  };

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
              {pengajuans.map((item) => (
                <Table.Row
                  key={item.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                  id={item.id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.jenis_surat}
                  </Table.Cell>
                  <Table.Cell>
                    <Moment
                      unix={true}
                      locale="id"
                      date={item.tanggal_pengajuan}
                      format="Do MMMM YYYY"
                    />
                  </Table.Cell>
                  <Table.Cell className="text-white">
                    {item.status === 1 ? (
                      <span className="bg-green-500 py-1 px-2 rounded-full">
                        {"Diterima"}
                      </span>
                    ) : item.status === 0 ? (
                      <span className="bg-yellow-500 py-1 px-2 rounded-full">
                        {"Diajukan"}
                      </span>
                    ) : (
                      <span className="bg-red-500 py-1 px-2 rounded-full">
                        {"Ditolak"}
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
          layout="navigation"
          currentPage={currentPage}
          totalPages={3}
          onPageChange={onPageChange}
          showIcons
        />
      </div>
    </div>
  );
};

export default ListRecords;
