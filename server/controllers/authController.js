import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { generateToken } from '../lib/generateToken.js';

export const register = async (req, res) => {

    const { userName, email, password } = req.body;

   try {

       if(!userName || !email || !password) {
        return res.json({ success : false, message : 'All fields are required' })
      }

       const isExist = await User.findOne({ email });

      if(isExist) {
         return res.json({ success : false, message : 'Account already exist' });
      }

      const name = await User.findOne({ userName });

      if(name) {
         return res.json({ success : false, message : 'Username already exist' }); 
      }
      

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hash });

    const token = generateToken(user._id) 

        
    res.json({ success : true, message : 'Account created successfully', userData : user, token });

    } catch (error) {
       res.json({ success : false, message : error.message })
   }
};

export const login = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

   if (!user) return res.json({ success : false, message : 'User not found' });

   const match = await bcrypt.compare(password, user.password);

   if (!match) return res.json({ success : false, message : 'Invalid Password' });

   const token = generateToken(user._id);

   console.log("Final Level")

  res.json({ success : true , message : 'Login Successfully', userData : user, token})

  } catch (error) {
     res.json({ success : false,  message : error.message})
  }

};

