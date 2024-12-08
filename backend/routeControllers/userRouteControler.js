import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs"
import jwtToken from "../utils/jwtWebToken.js";
export const userRegister=async(req,res)=>{
    try {
        const { fullname , username , email , gender , password , profilepic } = req.body;
        const user =await User.findOne({username,email})

        if(user) return res.status(500).send({success:false,message:"Username or Email Already exists"})
        
        // else
        const hashPassword = bcryptjs.hashSync(password,10) //paswword to be hashed and salt round meaing secure(10 is considered secured)

        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // save to database

        const newUser = new User({
            fullname,
            username,
            email,
            password:hashPassword,
            gender,
            profilepic: gender==="male" ? profileBoy : profileGirl
        })

        if(newUser){
            await newUser.save();
//jwt auth
            jwtToken(newUser._id,res)

        }
        else{
            res.status(500).send({success:false,message:"Invalid user data"})
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email
        })

    } catch (error) {
        res.status(500).send({success:false,message:error})
        console.log(error);
    }
}

export const userLogin=async(req,res)=>{
    try {
        const { email , password }=req.body
        const user = await User.findOne({email})

        if(!user){
            return  res.status(500).send({success:false,message: "Email is not registered"})
        }
        const comparePass=bcryptjs.compareSync(password,user.password || "")

        if(!comparePass){
            return  res.status(500).send({success:false,message:"Password doesnt match"})
        }

        jwtToken(user._id,res) //created token

        res.status(200).send({
            _id: user._id,
            fullname:user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message:"Successfully Login"
        })

    } catch (error) {
        res.status(500).send({success:false,message:error})
        console.log(error); 
    }
}

export const userLogout=async(req,res)=>{
    try {
        res.cookie("jwt","",{
            maxAge:0
        })
        res.status(200).send({message:"User logout"})
    } catch (error) {
        res.status(500).send({success:false,message:error})
        console.log(error); 
    }
}



































// import User from "../Models/userModels.js";
// import bcryptjs from "bcryptjs"
// export const userRegister = async (req, res) => {
//     try {
//         console.log("Request Body:", req.body); // Debugging

//         const { fullname, username, email, gender, password, profilepic } = req.body;

//         // Validate required fields
//         if (!fullname || !username || !email || !password || !gender) {
//             return res.status(400).send({ 
//                 success: false, 
//                 message: "All fields are required: fullname, username, email, password, and gender." 
//             });
//         }

//         // Check if the user already exists
//         const user = await User.findOne({ username, email });

//         if (user) {
//             return res.status(400).send({ 
//                 success: false, 
//                 message: "Username or Email already exists" 
//             });
//         }

//         // Hash the password
//         const hashPassword = bcryptjs.hashSync(password, 10); // 10 is the salt round

//         // Determine profile picture
//         const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
//         const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;
//         const profile = gender === "male" ? profileBoy : profileGirl;

//         // Save to database
//         const newUser = new User({
//             fullname,
//             username,
//             email,
//             password: hashPassword,
//             gender,
//             profilepic:  gender==="male" ? profileBoy : profileGirl,
//         });

//         await newUser.save();

//         // Send response
//         res.status(201).send({
//             _id: newUser._id,
//             fullname: newUser.fullname,
//             username: newUser.username,
//             profilepic: newUser.profilepic,
//             email: newUser.email,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "An error occurred. Please try again." });
//     }
// };
