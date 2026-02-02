import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    speciality: { type: String, default: "" },
    degree: { type: String, default: "" },
    experience: { type: String, default: "" },
    about: { type: String, default: "" },
    available: { type: Boolean, default: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, default: { line1: "", line2: "" } },
    date: { type: Number, default: () => Date.now() },
  },
  { minimize: false }
);

const lecturerModel =
  mongoose.models.lecturer || mongoose.model("lecturer", lecturerSchema);
export default lecturerModel;