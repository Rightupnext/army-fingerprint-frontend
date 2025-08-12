import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./AddUserForm.css";
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

    // Add fingerprint image filename as finger_Template_id
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
      // SweetAlert success
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Form submitted successfully!",
      });

      // Reset all form fields and states
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
      alert("Failed to submit form."); // SweetAlert error
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
      const filename = response.data.filename; // backend sends { filename: "...", message: "Screen captured" }
      if (filename) {
        const imageUrl = `http://127.0.0.1:5000/sample/${filename}`;
        setCapturedImagePath(imageUrl); // Show preview image
        setFingerTemplateId(filename); // Save filename for form submission
      }
      console.log(response.data);
    } catch (error) {
      console.error("Screen capture error:", error);
      alert("Failed to trigger screen capture.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ADD USER FORM</h2>
      <form onSubmit={handleSubmit} className="form-layout">
        {/* Rows of inputs */}
        <div className="row">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="input-field"
            autoComplete="off"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-field"
            autoComplete="off"
          />
        </div>

        <div className="row">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
            autoComplete="off"
          />
          <input
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="input-field"
            autoComplete="off"
          />
        </div>

        <div className="row">
          <input
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Roll No"
            className="input-field short"
            autoComplete="off"
          />
          <input
            name="rallyNo"
            value={formData.rallyNo}
            onChange={handleChange}
            placeholder="Rally No"
            className="input-field short"
            autoComplete="off"
          />
          <input
            name="centerName"
            value={formData.centerName}
            onChange={handleChange}
            placeholder="Center Name"
            className="input-field long"
            autoComplete="off"
          />
        </div>

        <div className="row">
          <input
            name="aadharNumber"
            value={formData.aadharNumber}
            maxLength={16}
            onChange={handleChange}
            placeholder="Aadhar Number (12 digits)"
            className="input-field medium"
            autoComplete="off"
          />
          <input
            name="identificationMarks"
            value={formData.identificationMarks}
            onChange={handleChange}
            placeholder="Identification Marks"
            className="input-field medium"
            autoComplete="off"
          />
        </div>

        <div className="row">
          <input
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="Qualifications (e.g. 10th, Diploma)"
            className="input-field medium"
            autoComplete="off"
          />
          <input
            name="trade"
            value={formData.trade}
            onChange={handleChange}
            placeholder="Trade (e.g. Electrician)"
            className="input-field medium"
            autoComplete="off"
          />
        </div>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          rows={4}
          className="textarea-field"
          autoComplete="off"
        />

        {/* Webcam and captured images */}
        <div className="capture-section">
          <div className="left-panel">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="webcam"
            />
            <button type="button" onClick={capture} className="btn">
              Capture Photo
            </button>
          </div>

          <div className="right-panel">
            {capturedImage && (
              <div className="captured-image-section">
                <h3>Captured Photo:</h3>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="captured-image"
                />
              </div>
            )}

            {capturedImagePath ? (
              <div className="captured-image-section">
                <h3>Captured Finger Screen Image:</h3>
                <img
                  src={capturedImagePath}
                  alt="Captured screen"
                  className="captured-image"
                />
              </div>
            ) : (
              <div className="captured-image-section empty">
                Plaese Captured Finger Screen
              </div>
            )}

            <button type="button" onClick={handleScreenCapture} className="btn">
              Finger print Capture
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
