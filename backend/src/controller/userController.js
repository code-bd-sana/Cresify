import bcrypt from 'bcrypt'
import User from '../models/UserModel.js';

export const saveUser = async(req, res)=>{


    try {

  const data = await req.body;


const isExist = await User.findOne({email:data.email});

if(isExist){
    res.status(401).json({
        message:"User already exist!"
    })
}

  const plainPassword = data.password;
  const hashPassword = await bcrypt.hash(plainPassword, 10);
  data.password = hashPassword;

  const newUser = User(data);
  const saved = await newUser.save();


  res.status(200).json({
    message:"Success",
    data:saved
  })

        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
};



export const loginUser = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const isExist = await User.findOne({ email });

        if(!isExist){
            return res.status(401).json({
                message: "User not found!"
            });
        }

        const compare = await bcrypt.compare(password, isExist.password);
        if(!compare){
            return res.status(401).json({
                message: "Wrong password!"
            });
        }

        // remove password
        const { password: pwd, ...safeUser } = isExist._doc;

        res.status(200).json({
            message: "Success",
            data: safeUser
        });

    } catch (error) {
       res.status(500).json({
            message: error?.message,
            error
       }) 
    }
}

export const changePassword = async(req, res)=>{
    try {
        const {email, oldPassword, newPassword} = req.body;

        const isExist = await User.findOne({email:email});

        if(!isExist){
            res.status(401).json({
                message:"User not found!"
            })
        }

        const compare = await bcrypt.compare(oldPassword, isExist.password);

        if(!compare){
            res.status(401).json({
                message:"Password does not matched!"
            })
        };

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const updated = await User.updateOne({
            email:email
        }, {$set:{
            password:hashPassword
        }});


        res.status(201).json({
           message:"Success" ,
           data:updated
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
};

export const updateProfile = async(req, res)=>{
    try {
        const id = req.params.id;
        const {name, phoneNumber, shopName, categories, serviceName, serviceCategory, serviceArea, serviceRedius, hourlyRate,  yearsofExperience, serviceDescription  } = req.body;

        const updated = User.updateOne({
            _id:id
        }, {$set:{

            name,
            phoneNumber,
            shopName,
            categories,
            serviceName,
            serviceCategory,
            serviceArea,
            serviceRedius,
            hourlyRate,
            yearsofExperience,
            serviceDescription,



        }});

        res.status(200).json({
            message:"Success",
            data:updated
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
}