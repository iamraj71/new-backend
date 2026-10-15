import express from 'express';
import { addUser, getUser, getSingleUser, deleteUSer, login, updateUser} from '../controller/userDataController.js';
import authanticateToken from '../utils/authmiddleware.js';
import upload from '../utils/uploadmiddleware.js';

const router = express.Router();

router.post('/api/add-user',upload.single('image'), addUser);
router.get('/api/get-user', getUser);
router.get('/api/get-singleuser/:uid', authanticateToken, getSingleUser);
router.put('/api/update-user/:uid', authanticateToken, updateUser);
router.delete('/api/delete-user/:uid', authanticateToken, deleteUSer);
router.post('/api/login', login);

export default router;
