import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { adminDb } from './firebaseConfig';

const SECRET_KEY = 'your_secret_key';

export const registerUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, role: 'user' };
    await adminDb.collection('users').add(user);
    return user;
};

export const authenticateUser = async (username, password) => {
    const userSnapshot = await adminDb.collection('users').where('username', '==', username).get();
    if (userSnapshot.empty) return null;
    const user = userSnapshot.docs[0].data();
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    const token = jwt.sign({ id: userSnapshot.docs[0].id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    return { token, user };
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};
