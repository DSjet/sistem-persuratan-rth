// app/components/ListItems.js
"use client";

import { useEffect, useState } from "react";
import db from "../../../utils/firestore";
import app from "../../../lib/firebaseConfig";
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Table, Spinner } from "flowbite-react";
import { getAuth } from "firebase/auth";
import moment from "moment";
import Moment from "react-moment";
import "moment/locale/id";

const AdminListRecords = ({
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
}) => {
  const [pengajuans, setPengajuans] = useState([]);
  const [user, setUser] = useState(null);
  const [lastItem, setLastItem] = useState(null);
  const [firstItem, setFirstItem] = useState(null);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (localUser) => {
      if (localUser) {
        setUser(localUser);
        setIsLoading(true);
        // filter where tanggal_pengajuan is between startDate and endDate, and status is in selectedStatuses
        // then convert to int

        const startTimestamp = moment(startDate).startOf("day").format("X");

        const endTimestamp = moment(endDate).endOf("day").format("X");
        let items = null;
        const q = query(
          collection(db, "pengajuans"),
          where("tanggal_pengajuan", ">=", startTimestamp),
          where("tanggal_pengajuan", "<=", endTimestamp),
          where(
            "status",
            "in",
            selectedStatuses.map((element) => element.value)
          )
          // limit(itemPerPage)
        );

        // get collection count
        const countQuery = query(
          collection(db, "pengajuans"),
          where("tanggal_pengajuan", ">=", startTimestamp),
          where("tanggal_pengajuan", "<=", endTimestamp),
          where(
            "status",
            "in",
            selectedStatuses.map((element) => element.value)
          )
        );

        const count = await getCountFromServer(countQuery);

        setPageCount(count);

        items = await getDocs(q);

        setLastItem(items.docs[items.docs.length - 1]);

        items = items.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        console.log(items);

        setPengajuans(items);

        setIsLoading(false);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, startDate, endDate, selectedStatuses]);

  const handleShowModal = (selectedItem) => {
    console.log(selectedItem.id);
    setActiveItem(selectedItem);
    setShowViewModal(true);
  };

  // const handlePageChange = (targetPage) => {
  //   console.log(targetPage);
  //   if (page > currentPage && page != pageCount / itemPerPage) {
  //     handleNext();
  //   } else if (page < currentPage && page != 1) {
  //     handleBefore();
  //   }
  //   return setCurrentPage(page);
  // };

  // const handleNext = async () => {
  //   const startTimestamp = moment(startDate).startOf("day").format("X");

  //   const endTimestamp = moment(endDate).endOf("day").format("X");
  //   const q = query(
  //     collection(db, "pengajuans"),
  //     where("tanggal_pengajuan", ">=", startTimestamp),
  //     where("tanggal_pengajuan", "<=", endTimestamp),
  //     where(
  //       "status",
  //       "in",
  //       selectedStatuses.map((element) => element.value)
  //     ),
  //     startAfter(lastItem)
  //     // limit(itemPerPage)
  //   );

  //   let items = await getDocs(q);

  //   setLastItem(items.docs[items.docs.length - 1]);

  //   setFirstItem(items.docs[0]);

  //   items = items.docs.map((doc) => doc.data());

  //   setPengajuans(items);
  // };

  // const handleBefore = async () => {
  //   const startTimestamp = moment(startDate).startOf("day").format("X");

  //   const endTimestamp = moment(endDate).endOf("day").format("X");

  //   const q = query(
  //     collection(db, "pengajuans"),
  //     where("tanggal_pengajuan", ">=", startTimestamp),
  //     where("tanggal_pengajuan", "<=", endTimestamp),
  //     where(
  //       "status",
  //       "in",
  //       selectedStatuses.map((element) => element.value)
  //     ),
  //     endBefore(firstItem)
  //     // limit(itemPerPage)
  //   );

  //   let items = await getDocs(q);

  //   setFirstItem(items.docs[0]);
  //   setLastItem(items.docs[items.docs.length - 1]);

  //   items = items.docs.map((doc) => doc.data());
  //   console.log(items);

  //   setPengajuans(items);
  // };

  return (
    <div className={`${isHidden ? "invisible" : ""}`}>
      <div className="relative border w-full text-center p-4 -z-[0]">
        <div className="overflow-x-auto">
          {!isLoading ? (
            pengajuans.length ? (
              <Table className="">
                <Table.Head>
                  <Table.HeadCell>Pengaju</Table.HeadCell>
                  <Table.HeadCell>Jenis Surat</Table.HeadCell>
                  <Table.HeadCell>Tanggal Pengajuan</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {pengajuans.map((item) => (
                    <Table.Row
                      key={item.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                      id={item.id}
                      onClick={() => handleShowModal(item)}
                    >
                      <Table.Cell>{item.user.name}</Table.Cell>
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
                  ))}
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
      <div className="flex overflow-x-auto sm:justify-center">
        {/* {pageCount && ( */}
        {/* <Pagination
          // currentPage={currentPage}
          // totalPages={pageCount / itemPerPage}
          onPageChange={handlePageChange}
          layout="navigation"
        /> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default AdminListRecords;
