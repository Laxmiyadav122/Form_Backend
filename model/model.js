const mongoose = require('mongoose');
const validator = require('validator');


const dataSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: [2, "Name must be at least 2 characters long"]
    },

    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    
    password: { 
        type: String, 
        required: true 
    },
    
    age: { 
        type: Number, 
    },
    
    gender: { 
        type: String, 
        enum: ["Male", "Female", "Other"],   //enumeration
        retuired: true
    },
    
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
          validator: function(v) {
            return /^\d{10}$/.test(v);
          },
          message: props => `${props.value} is not a valid 10-digit phone number`
        }
      },      
    
    address: { 
        type: String 
    }
});

module.exports = mongoose.model('CRUDTASK', dataSchema);








// const mongoose = require('mongoose');
// const validator = require('validator');

// const dataSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, "Name is required"],
//     minlength: [2, "Name must be at least 2 characters long"],
//     maxlength: [20, "Name cannot exceed 20 characters"]
//   },

//   email: { 
//     type: String, 
//     required: [true, "Email is required"],
//     unique: true,
//     validate: [validator.isEmail, "Please enter a valid email address"]
//   },
  
//   password: { 
//     type: String, 
//     required: [true, "Password is required"],
//     minlength: [6, "Password must be at least 6 characters long"],
//     maxlength: [15, "Password cannot exceed 15 characters"]
//   },
  
//   age: { 
//     type: Number, 
//     min: [1, "Age must be at least 1"],
//     max: [120, "Age cannot exceed 120"],
//     required: [true, "Age is required"]
//   },
  
//   gender: { 
//     type: String, 
//     enum: {
//       values: ["Male", "Female", "Other"],
//       message: "Gender must be Male, Female, or Other"
//     },  
//     required: [true, "Gender is required"]
//   },
  
//   phone: {
//     type: String,
//     required: [true, "Phone number is required"],
//     validate: {
//       validator: function(v) {
//         return /^\d{10}$/.test(v);
//       },
//       message: props => "Phone number must be exactly 10 digits"
//     }
//   },      
  
//   address: { 
//     type: String,
//     maxlength: [30, "Address cannot exceed 30 characters"],
//     required: [true, "Address is required"]
//   }
// });

// module.exports = mongoose.model('CRUDTASK', dataSchema);
