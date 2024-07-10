import { getFirestore } from "firebase/firestore";
import firebaseApp from '../lib/firebaseConfig';

const db = getFirestore(firebaseApp);
export default db;