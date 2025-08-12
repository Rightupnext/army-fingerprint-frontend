import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Swal from "sweetalert2";

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: "user",
};

const extractFilename = (path) => {
  return path.split("\\").pop();
};

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    rollNo: "",
    rallyNo: "",
    centerName: "",
    aadharNumber: "",
    identificationMarks: "",
    qualifications: "",
    trade: "",
    address: "",
  });

  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImagePath, setCapturedImagePath] = useState(null);
  const [fingerTemplateId, setFingerTemplateId] = useState("");

  const webcamRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    if (fingerTemplateId) {
      formDataObj.append("finger_Template_id", fingerTemplateId);
    }

    if (capturedImage) {
      const blob = dataURLtoBlob(capturedImage);
      formDataObj.append("photo", blob, "photo.jpg");
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/users",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Form submitted successfully!",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        rollNo: "",
        rallyNo: "",
        centerName: "",
        aadharNumber: "",
        identificationMarks: "",
        qualifications: "",
        trade: "",
        address: "",
      });
      setCapturedImage(null);
      setCapturedImagePath(null);
      setFingerTemplateId("");
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit form.",
      });
    }
  };

  const handleScreenCapture = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/capture-screen");
      const filename = response.data.filename;
      if (filename) {
        const imageUrl = `http://127.0.0.1:5000/sample/${filename}`;
        setCapturedImagePath(imageUrl);
        setFingerTemplateId(filename);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Screen capture error:", error);
      alert("Failed to trigger screen capture.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-amber-700 mb-8 text-center">
        ADD USER FORM
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First & Last Name */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Email & Mobile Number */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* RollNo, RallyNo, CenterName */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Roll No"
            autoComplete="off"
            className="w-1/4 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="rallyNo"
            value={formData.rallyNo}
            onChange={handleChange}
            placeholder="Rally No"
            autoComplete="off"
            className="w-1/4 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="centerName"
            value={formData.centerName}
            onChange={handleChange}
            placeholder="Center Name"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Aadhar Number & Identification Marks */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            name="aadharNumber"
            value={formData.aadharNumber}
            maxLength={16}
            onChange={handleChange}
            placeholder="Aadhar Number (12 digits)"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="identificationMarks"
            value={formData.identificationMarks}
            onChange={handleChange}
            placeholder="Identification Marks"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Qualifications & Trade */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="Qualifications (e.g. 10th, Diploma)"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="trade"
            value={formData.trade}
            onChange={handleChange}
            placeholder="Trade (e.g. Electrician)"
            autoComplete="off"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Address */}
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          rows={4}
          autoComplete="off"
          className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        {/* Capture section */}
        <div className="flex flex-col md:flex-row  space-y-6 md:space-y-0 ">
          {/* Webcam & capture button */}
          <div className="flex flex-col items-center space-y-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-60 rounded-md border border-gray-300 object-cover"
            />
            <button
              type="button"
              onClick={capture}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-amber-700 transition"
            >
              Capture Photo
            </button>
          </div>

          {/* Captured images and screen capture button */}
          <div className="flex flex-col items-center space-y-4 w-full ">
            {capturedImage ? (
              <div className="text-center">
                <h3 className="mb-2 font-semibold text-gray-700">
                  Captured Photo:
                </h3>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-64 h-48 rounded-md border border-gray-300 object-contain"
                />
              </div>
            ) : null}

            {capturedImagePath ? (
              <div className="text-center">
                <h3 className="mb-2 font-semibold text-gray-700">
                  Captured Finger Screen Image:
                </h3>
                <img
                  src={capturedImagePath}
                  alt="Captured screen"
                  className="w-64 h-48 rounded-md border border-gray-300 object-contain"
                />
              </div>
            ) : (
              <div className="w-xl h-full flex items-center justify-center rounded-md border-2 border-dashed border-amber-600 text-amber-600 font-semibold">
                Please Capture Finger Screen
              </div>
            )}

            <button
              type="button"
              onClick={handleScreenCapture}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-amber-700 transition"
            >
              Fingerprint Capture
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-amber-600 text-white rounded-md text-lg font-semibold hover:bg-amber-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
