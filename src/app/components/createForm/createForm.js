"use client";
import db from "../../../../utils/firestore";
import app from "../../../../lib/firebaseConfig";
import { addDoc, collection } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import Overlay from "../overlay/overlay";
import Button from "../button/button";
import Input from "../input/input";
import Image from "next/image";
import statusPengajuan from "../../../../consts/statusPengajuan";

import { useState } from "react";

const CreateForm = ({ setShowModal, fetchData = () => {} }) => {
  const auth = getAuth(app);
  const [pengikut, setPengikut] = useState([]);
  const [jenisSurat, setJenisSurat] = useState("");

  const kolomSurat = {
    "Surat Keterangan Pindah": [
      "nama_lengkap",
      "jenis_kelamin",
      "tempat_lahir",
      "tanggal_lahir",
      "kewarganegaraan",
      "pekerjaan",
      "status_perkawinan",
      "pendidikan",
      "agama",
      "alamat_asal",
      "desa_asal",
      "kecamatan_asal",
      "kabupaten_asal",
      "provinsi_asal",
      "alamat_pindah",
      "desa_pindah",
      "kecamatan_pindah",
      "kabupaten_pindah",
      "provinsi_pindah",
      "alasan_pindah",
    ],
    "Surat Keterangan Kematian": [
      "nama_lengkap",
      "tempat_lahir",
      "tanggal_lahir",
      "pekerjaan",
      "jenis_kelamin",
      "agama",
      "alamat_terakhir",
      "umur",
      "waktu_kematian",
      "tempat_kematian",
      "penyebab_kematian",
    ],
    "Surat Keterangan Usaha": [
      "nama_lengkap",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "kewarganegaraan",
      "pekerjaan",
      "nik",
      "alamat",
      "bidang_usaha",
      "nama_usaha",
    ],
    "Surat Keterangan Kurang Mampu": [
      "nama_lengkap",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "kewarganegaraan",
      "pekerjaan",
      "agama",
      "alamat",
      "nik",
    ],
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // get the form data
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (jenisSurat === "Surat Keterangan Pindah") {
      data["pengikut_arr"] = [...pengikut.keys()].map((i) => ({
        nama: data[`nama_pengikut_${i + 1}`],
        jenis_kelamin: data[`jenis_kelamin_pengikut_${i + 1}`],
        tempat_lahir: data[`tempat_lahir_pengikut_${i + 1}`],
        tanggal_lahir: data[`tanggal_lahir_pengikut_${i + 1}`],
        nik: data[`nik_pengikut_${i + 1}`],
        status: data[`status_perkawinan_pengikut_${i + 1}`],
        pekerjaan: data[`pekerjaan_pengikut_${i + 1}`],
        ket: data[`keterangan_pengikut_${i + 1}`],
      }));

      console.log("data", data);

      // remove redundant data
      pengikut.forEach((_, index) => {
        delete data[`nama_pengikut_${index + 1}`];
        delete data[`jenis_kelamin_pengikut_${index + 1}`];
        delete data[`tempat_lahir_pengikut_${index + 1}`];
        delete data[`tanggal_lahir_pengikut_${index + 1}`];
        delete data[`nik_pengikut_${index + 1}`];
        delete data[`status_perkawinan_pengikut_${index + 1}`];
        delete data[`pekerjaan_pengikut_${index + 1}`];
        delete data[`keterangan_pengikut_${index + 1}`];
      });
    }

    data["jenis_surat"] = jenisSurat;

    data["user"] = {
      id: auth.currentUser.uid,
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
    };
    data["status"] = statusPengajuan.DIAJUKAN;
    data["tanggal_pengajuan"] = Date.now().toString();

    // add the data to firestore
    try {
      const docRef = await addDoc(collection(db, "pengajuans"), data);
      console.log("Document written with ID: ", docRef.id);

      setShowModal(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleTambahPengikut = () => {
    console.log("tambah pengikut", pengikut);
    setPengikut([...pengikut, {}]);
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
          <form className="w-full" onSubmit={onSubmit}>
            <div className="text-md font-semibold">Ajukan surat</div>
            <p className="text-gray-600 leading-5 text-sm mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum ac lobortis lacus, et condimentum diam.{" "}
            </p>
            <select
              id="jenis_surat"
              class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
              onChange={(e) => {
                setJenisSurat(e.target.value);
              }}
            >
              <option selected value="">
                --Jenis Surat--
              </option>
              <option value="Surat Keterangan Pindah">
                Surat Keterangan Pindah
              </option>
              <option value="Surat Keterangan Kurang Mampu">
                Surat Keterangan Kurang Mampu
              </option>
              <option value="Surat Keterangan Usaha">Surat Usaha</option>
              <option value="Surat Keterangan Kematian">
                Surat Keterangan Kematian
              </option>
            </select>

            {jenisSurat === "Surat Keterangan Pindah" && (
              <>
                <Input
                  name="nama_lengkap"
                  type="text"
                  className="my-2"
                  placeholder="Nama Lengkap"
                  required
                />
                <select
                  name="jenis_kelamin"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Jenis Kelamin--
                  </option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                <Input
                  name="tempat_lahir"
                  type="text"
                  className="my-2"
                  placeholder="Tempat Lahir"
                  required
                />
                <Input
                  required
                  name="tanggal_lahir"
                  type="date"
                  className="my-2"
                />
                <select
                  required
                  name="kewarganegaraan"
                  className="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Kewarganegaraan--
                  </option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="WNA">WNA</option>
                </select>
                <Input
                  required
                  name="pekerjaan"
                  type="text"
                  className="my-2"
                  placeholder="Pekerjaan"
                />
                <select
                  required
                  name="status_perkawinan"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Status Perkawinan--
                  </option>
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
                <select
                  required
                  name="pendidikan"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Pendidikan--
                  </option>
                  <option value="Tidak/Belum Sekolah">
                    Tidak/Belum Sekolah
                  </option>
                  <option value="Belum Tamat SD/Sederajat">
                    Belum Tamat SD/Sederajat
                  </option>
                  <option value="Tamat SD/Sederajat">Tamat SD/Sederajat</option>
                  <option value="SLTP/Sederajat">SLTP/Sederajat</option>
                  <option value="SLTA/Sederajat">SLTA/Sederajat</option>
                  <option value="Diploma I/II">Diploma I/II</option>
                  <option value="Diploma III">
                    Akademi/Diploma III/Sarjana Muda
                  </option>
                  <option value="Strata I">Diploma IV/Strata I</option>
                  <option value="Strata II">Strata II</option>
                  <option value="Strata III">Strata III</option>
                </select>
                <select
                  required
                  name="agama"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Agama--
                  </option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katholik">Katholik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <Input
                  required
                  name="alamat_asal"
                  type="text"
                  className="my-2"
                  placeholder="Alamat Asal"
                />
                <Input
                  required
                  name="desa_asal"
                  type="text"
                  className="my-2"
                  placeholder="Desa/Kelurahan Asal"
                />
                <Input
                  required
                  name="kecamatan_asal"
                  type="text"
                  className="my-2"
                  placeholder="Kecamatan Asal"
                />
                <Input
                  required
                  name="kabupaten_asal"
                  type="text"
                  className="my-2"
                  placeholder="Kabupaten Asal"
                />
                <Input
                  required
                  name="provinsi_asal"
                  type="text"
                  className="my-2"
                  placeholder="Provinsi Asal"
                />
                <Input
                  required
                  name="alamat_pindah"
                  type="text"
                  className="my-2"
                  placeholder="Alamat Pindah"
                />
                <Input
                  required
                  name="desa_pindah"
                  type="text"
                  className="my-2"
                  placeholder="Desa/Kelurahan Pindah"
                />
                <Input
                  required
                  name="kecamatan_pindah"
                  type="text"
                  className="my-2"
                  placeholder="Kecamatan Pindah"
                />
                <Input
                  required
                  name="kabupaten_pindah"
                  type="text"
                  className="my-2"
                  placeholder="Kabupaten Pindah"
                />
                <Input
                  required
                  name="provinsi_pindah"
                  type="text"
                  className="my-2"
                  placeholder="Provinsi Pindah"
                />
                <Input
                  required
                  name="alasan_pindah"
                  type="text"
                  className="my-2"
                  placeholder="Alasan Pindah"
                />
                {pengikut.map((_, index) => (
                  <div className="" key={index}>
                    <small>Pengikut {index + 1}</small>
                    <Input
                      required
                      name={`nama_pengikut_${index + 1}`}
                      type="text"
                      className="my-2"
                      placeholder={`Nama Pengikut ${index + 1}`}
                    />
                    <select
                      required
                      name={`jenis_kelamin_pengikut_${index + 1}`}
                      class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                    >
                      <option selected disabled value="">
                        --Jenis Kelamin--
                      </option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <Input
                      required
                      name={`tempat_lahir_pengikut_${index + 1}`}
                      type="text"
                      className="my-2"
                      placeholder={`Tempat Lahir Pengikut ${index + 1}`}
                    />
                    <Input
                      required
                      name={`tanggal_lahir_pengikut_${index + 1}`}
                      type="date"
                      className="my-2"
                      placeholder={`Tanggal Lahir Pengikut ${index + 1}`}
                    />
                    <Input
                      required
                      name={`nik_pengikut_${index + 1}`}
                      type="string"
                      className="my-2"
                      placeholder={`NIK Pengikut ${index + 1}`}
                    />
                    <select
                      required
                      name={`status_perkawinan_pengikut_${index + 1}`}
                      class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                    >
                      <option selected disabled value="">
                        --Status Perkawinan--
                      </option>
                      <option value="Belum Kawin">Belum Kawin</option>
                      <option value="Kawin">Kawin</option>
                      <option value="Cerai Hidup">Cerai Hidup</option>
                      <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                    <Input
                      name={`pekerjaan_pengikut_${index + 1}`}
                      type="string"
                      className="my-2"
                      placeholder={`Pekerjaan Pengikut ${index + 1}`}
                    />
                    <Input
                      name={`keterangan_pengikut_${index + 1}`}
                      type="string"
                      className="my-2"
                      placeholder={`Keterangan Pengikut ${index + 1}`}
                    />
                  </div>
                ))}
                <div
                  className="flex items-center"
                  onClick={() => {
                    handleTambahPengikut();
                  }}
                >
                  <div className="bg-green-500 rounded-full p-1 block w-[40px] h-[40px]">
                    <Image
                      src="images/icons/plus.svg"
                      alt="home icon"
                      width={40}
                      height={40}
                      onClick={() => setShowModal(true)}
                    />
                  </div>
                  <small className="ml-4">Tambah Pengikut</small>
                </div>
              </>
            )}

            {jenisSurat === "Surat Keterangan Kematian" && (
              <>
                <Input
                  required
                  name="nama_lengkap"
                  type="text"
                  className="my-2"
                  placeholder="Nama Lengkap"
                />
                <Input
                  required
                  name="tempat_lahir"
                  type="text"
                  className="my-2"
                  placeholder="Tempat Lahir"
                />
                <Input
                  required
                  name="tanggal_lahir"
                  type="date"
                  className="my-2"
                />
                <Input
                  required
                  name="pekerjaan"
                  type="text"
                  className="my-2"
                  placeholder="Pekerjaan"
                />
                <select
                  required
                  name="jenis_kelamin"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Jenis Kelamin--
                  </option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

                <select
                  required
                  name="agama"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Agama--
                  </option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katholik">Katholik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <Input
                  required
                  name="alamat_terakhir"
                  type="text"
                  className="my-2"
                  placeholder="Alamat Terakhir"
                />
                <Input
                  required
                  name="umur"
                  type="number"
                  className="my-2"
                  placeholder="Umur"
                />
                <Input
                  required
                  name="waktu_kematian"
                  type="datetime-local"
                  className="my-2"
                  placeholder="Waktu Kematian"
                />
                <Input
                  required
                  name="tempat_kematian"
                  className="my-2"
                  placeholder="Tempat Kematian"
                />
                <Input
                  required
                  name="penyebab_kematian"
                  className="my-2"
                  placeholder="Penyebab Kematian"
                />
              </>
            )}

            {jenisSurat === "Surat Keterangan Usaha" && (
              <>
                <Input
                  required
                  name="nama_lengkap"
                  type="text"
                  className="my-2"
                  placeholder="Nama Lengkap"
                />
                <Input
                  required
                  name="tempat_lahir"
                  type="text"
                  className="my-2"
                  placeholder="Tempat Lahir"
                />
                <Input
                  required
                  name="tanggal_lahir"
                  type="date"
                  className="my-2"
                />
                <select
                  required
                  name="jenis_kelamin"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Jenis Kelamin--
                  </option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

                <select
                  required
                  name="kewarganegaraan"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Kewarganegaraan--
                  </option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="WNA">WNA</option>
                </select>
                <Input
                  required
                  name="pekerjaan"
                  type="text"
                  className="my-2"
                  placeholder="Pekerjaan"
                />
                <Input
                  required
                  name="nik"
                  type="text"
                  className="my-2"
                  placeholder="NIK"
                />
                <Input
                  required
                  name="alamat"
                  type="text"
                  className="my-2"
                  placeholder="Alamat"
                />
                <Input
                  required
                  name="bidang_usaha"
                  type="text"
                  className="my-2"
                  placeholder="Bidang Usaha"
                />
                <Input
                  required
                  name="nama_usaha"
                  type="text"
                  className="my-2"
                  placeholder="Nama Usaha"
                />
              </>
            )}

            {jenisSurat === "Surat Keterangan Kurang Mampu" && (
              <>
                <Input
                  required
                  name="nama_lengkap"
                  type="text"
                  className="my-2"
                  placeholder="Nama Lengkap"
                />
                <Input
                  required
                  name="tempat_lahir"
                  type="text"
                  className="my-2"
                  placeholder="Tempat Lahir"
                />
                <Input
                  required
                  name="tanggal_lahir"
                  type="date"
                  className="my-2"
                />
                <select
                  required
                  name="jenis_kelamin"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Jenis Kelamin--
                  </option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

                <select
                  required
                  name="kewarganegaraan"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option selected value="">
                    --Kewarganegaraan--
                  </option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="WNA">WNA</option>
                </select>
                <Input
                  required
                  name="pekerjaan"
                  type="text"
                  className="my-2"
                  placeholder="Pekerjaan"
                />
                <select
                  required
                  name="agama"
                  class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
                >
                  <option disabled selected value="">
                    --Agama--
                  </option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katholik">Katholik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <Input
                  required
                  name="alamat"
                  type="text"
                  className="my-2"
                  placeholder="Alamat"
                />
                <Input
                  required
                  name="nik"
                  type="text"
                  className="my-2"
                  placeholder="NIK"
                />
              </>
            )}

            <Button text="Ajukan" type="submit" className="my-2" />
            <Button
              text="Batal"
              className="my-2"
              variation="secondary"
              onClick={() => setShowModal(false)}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
