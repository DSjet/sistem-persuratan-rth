"use client";

import db from "../../../../utils/firestore";
import { collection, doc, updateDoc } from "@firebase/firestore";
import Overlay from "../overlay/overlay";
import Button from "../button/button";
import Input from "../input/input";
import Image from "next/image";
import statusPengajuan from "../../../../consts/statusPengajuan";
import moment from "moment";
import { useState } from "react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import app from "@/lib/firebaseConfig";

const kolomSurat = {
  "Surat Keterangan Pindah": [
    { key: "nama_lengkap", label: "Nama Lengkap" },
    { key: "jenis_kelamin", label: "Jenis Kelamin" },
    { key: "tempat_lahir", label: "Tempat Lahir" },
    { key: "tanggal_lahir", label: "Tanggal Lahir" },
    { key: "kewarganegaraan", label: "Kewarganegaraan" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "status_perkawinan", label: "Status Perkawinan" },
    { key: "pendidikan", label: "Pendidikan" },
    { key: "agama", label: "Agama" },
    { key: "alamat_asal", label: "Alamat Asal" },
    { key: "desa_asal", label: "Desa Asal" },
    { key: "kecamatan_asal", label: "Kecamatan Asal" },
    { key: "kabupaten_asal", label: "Kabupaten Asal" },
    { key: "provinsi_asal", label: "Provinsi Asal" },
    { key: "alamat_pindah", label: "Alamat Pindah" },
    { key: "desa_pindah", label: "Desa Pindah" },
    { key: "kecamatan_pindah", label: "Kecamatan Pindah" },
    { key: "kabupaten_pindah", label: "Kabupaten Pindah" },
    { key: "provinsi_pindah", label: "Provinsi Pindah" },
    { key: "alasan_pindah", label: "Alasan Pindah" },
    { key: "pengikut_arr", label: "Pengikut" },
  ],
  "Surat Keterangan Kematian": [
    { key: "nama_lengkap", label: "Nama Lengkap" },
    { key: "tempat_lahir", label: "Tempat Lahir" },
    { key: "tanggal_lahir", label: "Tanggal Lahir" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "jenis_kelamin", label: "Jenis Kelamin" },
    { key: "agama", label: "Agama" },
    { key: "alamat_terakhir", label: "Alamat Terakhir" },
    { key: "umur", label: "Umur" },
    { key: "waktu_kematian", label: "Waktu Kematian" },
    { key: "tempat_kematian", label: "Tempat Kematian" },
    { key: "penyebab_kematian", label: "Penyebab Kematian" },
  ],
  "Surat Keterangan Usaha": [
    { key: "nama_lengkap", label: "Nama Lengkap" },
    { key: "tempat_lahir", label: "Tempat Lahir" },
    { key: "tanggal_lahir", label: "Tanggal Lahir" },
    { key: "jenis_kelamin", label: "Jenis Kelamin" },
    { key: "kewarganegaraan", label: "Kewarganegaraan" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "nik", label: "NIK" },
    { key: "alamat", label: "Alamat" },
    { key: "bidang_usaha", label: "Bidang Usaha" },
    { key: "nama_usaha", label: "Nama Usaha" },
  ],
  "Surat Keterangan Kurang Mampu": [
    { key: "nama_lengkap", label: "Nama Lengkap" },
    { key: "tempat_lahir", label: "Tempat Lahir" },
    { key: "tanggal_lahir", label: "Tanggal Lahir" },
    { key: "jenis_kelamin", label: "Jenis Kelamin" },
    { key: "kewarganegaraan", label: "Kewarganegaraan" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "agama", label: "Agama" },
    { key: "alamat", label: "Alamat" },
    { key: "nik", label: "NIK" },
  ],
};

const kolomPengikut = [
  { key: "nama", label: "Nama" },
  { key: "jenis_kelamin", label: "Jenis Kelamin" },
  { key: "tempat_lahir", label: "Tempat Lahir" },
  { key: "tanggal_lahir", label: "Tanggal Lahir" },
  // { key: "ttl", label: "Tempat Tanggal Lahir" },
  { key: "nik", label: "NIK" },
  { key: "status", label: "Status" },
  { key: "pekerjaan", label: "Pekerjaan" },
  { key: "ket", label: "Keterangan" },
];

const ViewModal = ({ setShowModal, activeItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleReject = async () => {
    try {
      // update current item's status to DITOLAK
      const docRef = updateDoc(doc(db, "pengajuans", activeItem?.id), {
        status: statusPengajuan.DITOLAK,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    activeItem["nomor_surat"] = e.target.nomor_surat.value;
    try {
      // update current item's status to DITOLAK
      const docRef = await updateDoc(doc(db, "pengajuans", activeItem?.id), {
        status: statusPengajuan.DITERIMA,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    const endpointMaps = {
      "Surat Keterangan Pindah": "surat_pindah",
      "Surat Keterangan Kematian": "surat_kematian",
      "Surat Keterangan Usaha": "surat_usaha",
      "Surat Keterangan Kurang Mampu": "surat_kurang_mampu",
    };

    activeItem["tahun"] = new Date().getFullYear().toString();

    const endpoint = endpointMaps[activeItem?.jenis_surat];
    // call localhost:3000/api/surat_kematian api using fetch function
    fetch(`http://localhost:3000/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activeItem),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Success:", data);
        const docRef = await updateDoc(doc(db, "pengajuans", activeItem?.id), {
          filePath: data.data.filePath,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setShowModal(false);
      });
  };

  const handleDownloadFile = async () => {
    const storage = getStorage(app);
    const storageRef = ref(storage, activeItem?.filePath);
    console.log(activeItem);
    const downloadURL = await getDownloadURL(storageRef);
    window.open(downloadURL, "_blank");
  };

  return (
    <div className="w-full z-10">
      <Overlay setShowModal={setShowModal} />
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-5">
        <div className=" bg-white rounded-lg w-full p-5 h-[520px] overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="outline outline-1 outline-gray-300 p-2 rounded-lg">
              <Image
                src="/images/icons/Arhive_fill.svg"
                alt="add icon"
                width={20}
                height={20}
              />
            </div>
            <div className="cursor-pointer" onClick={() => setShowModal(false)}>
              <Image
                src="/images/icons/X.svg"
                alt="close icon"
                width={20}
                height={20}
              />
            </div>
          </div>
          <form className="w-full" onSubmit={handleAccept}>
            <div className="text-md font-semibold">Pengajuan</div>
            {activeItem?.jenis_surat == "Surat Keterangan Pindah"
              ? kolomSurat["Surat Keterangan Pindah"]?.map((key, idx) => {
                  if (key.key == "pengikut_arr") {
                    return (
                      <div className="items-center mb-4" key={idx}>
                        {activeItem["pengikut_arr"].map((item, index) => {
                          return kolomPengikut?.map((column) => {
                            return (
                              <div className="gap-4 my-2" key={index}>
                                <small>
                                  {column["label"]} Pengikut {index + 1}
                                </small>
                                <Input
                                  required
                                  name={`${column[key]}_pengikut_${index + 1}`}
                                  type="text"
                                  className="my-2"
                                  placeholder="Nama Pengikut"
                                  value={item[column.key]}
                                  disabled={true}
                                />
                              </div>
                            );
                          });
                        })}
                      </div>
                    );
                  }
                  return (
                    <div className="items-center mb-4" key={idx}>
                      <small>{key.label}</small>
                      <Input
                        required
                        name={key.key}
                        type="text"
                        className="my-2"
                        placeholder={key.label}
                        value={activeItem[key.key]}
                        disabled={true}
                      />
                    </div>
                  );
                })
              : kolomSurat[activeItem?.jenis_surat]?.map((key, idx) => {
                  return (
                    <div className="items-center mb-4" key={idx}>
                      <small>{key.label}</small>
                      <Input
                        required
                        name={key.key}
                        type="text"
                        className="my-2"
                        placeholder={key.label}
                        value={activeItem[key.key]}
                        disabled={true}
                      />
                    </div>
                  );
                })}
            {/* {Object.keys(activeItem).map((key) => {
              console.log(key);
              if (!["id", "user", "status"].includes(key)) {
                const normalizedKey = key.split("_").join(" ");
                return (
                  <div className="items-center mb-4">
                    <small>
                      {normalizedKey.charAt(0).toUpperCase() +
                        normalizedKey.slice(1)}
                    </small>
                    <Input
                      required
                      name={key}
                      type="text"
                      className="my-2"
                      placeholder={key}
                      value={activeItem[key]}
                    />
                  </div>
                );
              }
            })} */}
            <small>Nomor Surat</small>
            <Input
              required
              name="nomor_surat"
              type="text"
              className="my-2"
              placeholder="Nomor Surat"
            />
            {activeItem?.status == 0 ? (
              <div className="flex gap-4">
                <Button
                  onClick={handleReject}
                  text="Tolak"
                  variation="danger"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  text="Terima"
                  variation="primary"
                  disabled={isLoading}
                />
              </div>
            ) : activeItem?.status == 1 ? (
              <Button
                text="Unduh Surat"
                variation="primary"
                disabled={isLoading}
                onClick={handleDownloadFile}
              />
            ) : (
              <div></div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
