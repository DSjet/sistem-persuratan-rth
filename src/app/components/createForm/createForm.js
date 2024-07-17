import { db } from "../../../../utils/firestore";
import app from "../../../../lib/firebaseConfig";
import { addDoc, collection } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import Overlay from "../overlay/overlay";
import Button from "../button/button";
import Input from "../input/input";
import Image from "next/image";

const CreateForm = ({ setShowModal }) => {
  const auth = getAuth(app);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("active user", auth.currentUser);

    // get the form data
    const formData = new FormData(e.currentTarget);
    const userId = auth.currentUser?.uid;
    const name = formData.get("name");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");

    // add the data to firestore
    try {
      const docRef = await addDoc(collection(db, "komoditas"), {
        name,
        quantity,
        unit,
        userId,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="w-full z-10">
      <Overlay setShowModal={setShowModal} />
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-5">
        <div className=" bg-white rounded-lg w-full p-5">
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
              id="countries"
              class="border-[1px] border-gray-300 bg-gray-100 rounded-md py-2 px-4 text-base w-full my-2"
            >
              <option selected value="pindah">
                Surat Pindah
              </option>
              <option value="kurang_mampu">Surat Kurang Mampu</option>
              <option value="usaha">Surat Usaha</option>
              <option value="kematian">Surat Kematian</option>
            </select>

            <Input
              name="name"
              type="text"
              className="my-2"
              placeholder="Nama"
            />
            <Input
              name="tempat_lahir"
              type="text"
              className="my-2"
              placeholder="Tempat Lahir"
            />
            <Input
              name="unit"
              type="text"
              className="my-2"
              placeholder="Satuan"
            />
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
