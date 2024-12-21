const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/appIntern");
  console.log("database connected");
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    enum: ["HR", "Manager", "Sales"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  course: {
    type: String,
    enum: ["MCA", "BCA", "BSC"],
    required: true,
  },
  createdDate: {
    type: Date,
    default: function () {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
});

const User = mongoose.model("User", userSchema);

const app = express();

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/demo", async (req, res) => {
  let user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.mobile = req.body.mobile;
  user.designation = req.body.designation;
  user.gender = req.body.gender;
  user.course = req.body.course;
  user.createdDate = req.body.createdDate;
  const doc = await user.save();
  res.json(doc);
});

app.get("/demo", async (req, res) => {
  const docs = await User.find({});
  res.json(docs)
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});