"use client";

import { useState } from "react";
import db from "../../utils/firestore";
import {
  collection,
  addDoc,
  // getDocs,
  // DocumentSnapshot,`
} from "firebase/firestore";
import ListRecords from "./listRecords";

const AddRecord = () => {
  const [value, setValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "items"), {
        name: value,
      });
      console.log("Document written with ID: ", docRef.id);
      setValue(""); // Clear the form
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new item"
        />
        <button type="submit">Add Item</button>
      </form>
      <ListRecords />
    </div>
  );
};

export default AddRecord;
