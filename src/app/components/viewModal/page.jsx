import db from "../../../../utils/firestore";
import { collection, doc, updateDoc } from "@firebase/firestore";
import Overlay from "../overlay/overlay";
import Button from "../button/button";
import Input from "../input/input";
import Image from "next/image";
import statusPengajuan from "../../../../consts/statusPengajuan";

const ViewModal = ({ setShowModal, activeItem }) => {
  const handleReject = async () => {
    try {
      // update current item's status to DITOLAK
      const docRef = updateDoc(doc(db, "pengajuans", activeItem.id), {
        status: statusPengajuan.DITOLAK,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    activeItem["nomor_surat"] = e.target.nomor_surat.value;
    try {
      // update current item's status to DITOLAK
      const docRef = updateDoc(doc(db, "pengajuans", activeItem.id), {
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

    const endpoint = endpointMaps[activeItem.jenis_surat];
    // call localhost:3000/api/surat_kematian api using fetch function
    fetch(`http://localhost:3000/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activeItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
            <div className="text-md font-semibold">Ajukan surat</div>
            <p className="text-gray-600 leading-5 text-sm mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum ac lobortis lacus, et condimentum diam.{" "}
            </p>
            {/* iterate key and values of the activeItem object */}
            {Object.keys(activeItem).map((key) => {
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
            })}
            <small>Nomor Surat</small>
            <Input
              required
              name="nomor_surat"
              type="text"
              className="my-2"
              placeholder="Nomor Surat"
            />
            <div className="flex gap-4">
              <Button
                onClick={handleReject}
                text="Tolak"
                className="bg-red-600"
              />
              <Button type="submit" text="Terima" className="bg-green-600" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
