const express = require('express');
const router = express.Router();
const Model = require('../model/model');
const jwt = require('jsonwebtoken');
// const auth = require('../middleware/auth');
const bcrypt = require("bcrypt");

router.post('/post', async (req, res) => {
    try {
        const existingUser = await Model.findOne({email: req.body.email});
        if(existingUser){
            return res.status(400).json({errors: ["Email already exists"]});
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        req.body.password = hashedPassword;

      const newData = new Model(req.body);
      await newData.save();

      return res.status(201).json({ message: "Form submitted successfully" });
    }  catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors });
        }
        
        // Handle duplicate key error (unique constraint)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ errors: [`${field} already exists`] });
        }
        
        // Generic server error
        console.log("error: ", error);
        return res.status(500).json({ errors: ["Server error"] });
    }
  });
  
  

router.get('/getAll', async(req, res) =>{
    try{
        const data = await Model.find().select("-password");
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})

// router.put('/update/:id', async(req, res) =>{
//     try{
//         const id = req.params.id;
//         const updateData = req.body;
//         const options = {new: true};

//         const result = await Model.findByIdAndUpdate(
//             id, updateData, options
//         )
//         res.send(result)
//     }
//     catch(error){
//         res.status(400).json({message: error.message});
//     }
// });


router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (req.body.password && req.body.password.trim() !== "") {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }else{
            delete req.body.password;
        }

        const updatedUser = await Model.findByIdAndUpdate(id, req.body, { new: true });

        res.json({ message: "User updated successfully", data: updatedUser });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete/:id', async(req, res) => {
    try{
        const id = req.params.id;
        await Model.findByIdAndDelete(id)
        res.json({ message: "Document deleted successfully" });

    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});

router.post("/login", async(req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await Model.findOne({email});

        if(!user){
            return res.status(400).json({error: ["User not found"]});
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({errors: ["Invalid password"]});
        }
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "4h"}
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }catch(error){
        res.status(500).json({error: ["Server error"]});
    }
})
module.exports = router;