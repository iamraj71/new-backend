import userData from '../model/user.js'
import bcrypt from 'bcrypt'
import generatetoken from '../utils/jwtutils.js'
import multer from "multer"
import cloudinary,{proxyAgent} from '../config/cloudinary.js'

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder : 'imagess', agent:proxyAgent},
            (error,result)=>{
                if (error) return reject(error)
                resolve(result)
            })  
            stream.end(buffer)
    })
}


export const addUser = async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password || '', 10);
        let image = ""  
        if(req.file) {
            const result = await uploadToCloudinary(req.file.buffer)
            image   = result.secure_url
        }
        const userDataval = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
           image:image,
            password: password,
        };

        const saveUSerData = await userData.create(userDataval);
        return res.status(200).json({ message: 'user added successflly', data: saveUSerData });
    } catch (error) {
        return res.status(500).json({ errorMessage: error.message })
    }
};

export const getUser = async (req, res) => {
    try {
        const getuserData = await userData.find();
        return res.status(200).json({ message: 'user get successfulyy', data: getuserData });
    } catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const getsingleUserdata = await userData.findById(id);
        return res.status(200).json({ message: 'user get successfully', data: getsingleUserdata });
    } catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        };

        const updatedUser = await userData.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'user updated successfully', data: updatedUser });
    } catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
};

export const deleteUSer = async (req, res) => {
    try {
        const id = req.params.uid;
        const deleteuserData = await userData.findByIdAndDelete(id);
        return res.status(200).json({ message: 'user deleted successfully', data: deleteuserData });
    } catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const uData = await userData.findOne({ email: req.body.email });
        if (!uData) {
            return res.status(200).json({ message: 'User Not Found', status: 0 });
        }

        const comparePassword = await bcrypt.compare(req.body.password, uData.password);
        if (!comparePassword) {
            return res.status(200).json({ message: 'Password not match', status: 0 });
        }

        const token = generatetoken(uData);
        return res.status(200).json({ message: 'Login succesfully', status: 1, data: uData, token: token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
