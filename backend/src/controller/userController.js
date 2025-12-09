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
        const {id, oldPassword, newPassword} = req.body;
        console.log(oldPassword, "old password is here");

        const isExist = await User.findOne({_id:id});

        if(!isExist){
            res.status(401).json({
                message:"User not found!"
            })
            return
        }

        const compare = await bcrypt.compare(oldPassword, isExist.password);

        console.log(compare, "he he compare");

        if(!compare){
            res.status(401).json({
                message:"Password does not matched!"
            })
            return
        };

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const updated = await User.updateOne({
            _id:id
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

export const updateProfile = async (req, res) => {
  console.log(req.body, "hey");
  try {
    const id = req.body.id; // Ensure you're using the correct identifier (you had `id = req.body` previously)

    const {
      name,
      phoneNumber,
      shopName,
      categories,
      serviceName,
      serviceCategory,
      serviceArea,
      shopDescription,
      serviceRedius,

       address,
      hourlyRate,
      yearsofExperience,
      serviceDescription,
      category,
      website,
      shopLogo,
    } = req.body;

    // Perform the update operation
    const updated = await User.updateOne(
      { _id: id },
      {
        $set: {
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
          shopDescription,
          addresss:  address,

          category,
          website,
          shopLogo,
        },
      }
    );

    // Return a simple success message or the update count
    res.status(200).json({
      message: "Profile updated successfully",
      updatedCount: updated.nModified, // `nModified` will tell you how many documents were modified
    });
  } catch (error) {
    console.log(error, "Tumi aamar personal error");
    res.status(500).json({
      error: error.message || error,
      message: "An error occurred while updating the profile",
    });
  }
};




export const myProfile = async(req, res)=>{
    try {
        const id = req.params.id;
        const proflie = await User.findOne({_id:id});
        res.status(200).json({
            message:"Success",
            data:proflie
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
}