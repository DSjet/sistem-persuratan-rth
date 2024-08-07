// app/components/ListItems.js
"use client";

import { useEffect, useState } from "react";
import db from "../../../utils/firestore";
import app from "../../../lib/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Table, Spinner } from "flowbite-react";
import { getAuth } from "firebase/auth";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/id";

const ListRecords = ({
  isHidden = false,
  setShowViewModal = () => {},
  setActiveItem = () => {},
  startDate = new Date(2020, 1, 1),
  endDate = new Date(2024, 1, 1),
  selectedStatuses = [
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
  ],
  fetchCount,
}) => {
  const [pengajuans, setPengajuans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (localUser) => {
      if (localUser) {
        setUser(localUser);
        setIsLoading(true);

        console.log("startDate", startDate);
        console.log("endDate", endDate);

        const startTimestamp = moment(startDate).startOf("day").format("X");

        const endTimestamp = moment(endDate).endOf("day").format("X");

        const first = query(
          collection(db, "pengajuans"),
          orderBy("tanggal_pengajuan"),
          where("user.id", "==", localUser.uid),
          where("tanggal_pengajuan", ">=", startTimestamp),
          where("tanggal_pengajuan", "<=", endTimestamp),
          where(
            "status",
            "in",
            selectedStatuses.map((element) => element.value)
          )
        );

        const items = await getDocs(first);

        setPengajuans(items.docs.map((doc) => doc.data()));

        setIsLoading(false);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, startDate, endDate, selectedStatuses, fetchCount]);

  const fetchItems = async () => {
    // get items where user.id, == user.id
  };

  return (
    <div className={`${isHidden ? "invisible" : ""}`}>
      <div className="relative border w-full text-center p-4 -z-[0]">
        <div className="overflow-x-auto">
          {!isLoading ? (
            pengajuans.length ? (
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
                  {pengajuans.map((item) => {
                    return (
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
                            locale="id"
                            date={new Date(
                              parseInt(item.tanggal_pengajuan)
                            ).toString()}
                            format="DD MMMM YYYY"
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
                    );
                  })}
                </Table.Body>
              </Table>
            ) : (
              <div className="text-center">No data</div>
            )
          ) : (
            <Spinner aria-label="Default status example" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListRecords;
