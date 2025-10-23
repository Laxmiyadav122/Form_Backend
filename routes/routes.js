const express = require('express');
const router = express.Router();
const Model = require('../model/model');

// router.post('/post', async(req, res) =>{
//    const data = new Model({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     age: req.body.age,
//     gender: req.body.gender,
//     phone: req.body.phone,
//     address: req.body.address,
//    })
//    try{
//     const dataToSave = await data.save();
//     res.status(200).json(dataToSave)
//    }
//    catch(error){
//     res.status(400).json({message: error.message})
//    }
// });

router.post('/post', async (req, res) => {
    try {
      const newData = new Model(req.body);
      await newData.save();
      return res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ errors: ["Email already exists! Please use another email."] });
      }
  
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors: messages });  // <-- Must send array of error messages
      }
        return res.status(500).json({ errors: ["Server error. Please try again."] });
    }
  });
  
  

router.get('/getAll', async(req, res) =>{
    try{
        const data = await Model.find();
        res.json(data);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})

router.put('/update/:id', async(req, res) =>{
    try{
        const id = req.params.id;
        const updateData = req.body;
        const options = {new: true};

        const result = await Model.findByIdAndUpdate(
            id, updateData, options
        )
        res.send(result)
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});

router.delete('/delete/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.json({ message: "Document deleted successfully" });

    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});
module.exports = router;