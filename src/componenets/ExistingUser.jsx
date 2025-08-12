import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";

function ExistingUser() {
  const [capturedImagePath, setCapturedImagePath] = useState(null);
  const [fingerTemplateId, setFingerTemplateId] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const handleScreenCapture = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/capture-screen");
      const filename = response.data.filename;
      if (filename) {
        const imageUrl = `http://127.0.0.1:5000/sample/${filename}`;
        setCapturedImagePath(imageUrl);
        setFingerTemplateId(filename);
      }
    } catch (error) {
      alert("Failed to trigger screen capture.");
    }
  };

  const verifyFinger = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/fingerprint-match",
        { test_image: fingerTemplateId }
      );
      setMatchResult(response.data);
      if (response.data && response.data.user) {
        setUserDetails(response.data.user);
        setShowResult(true);
      } else {
        Swal.fire({
        icon: 'warning',
        title: 'No Match',
        text: 'No matching user found, Please Long press your finger.',
        confirmButtonColor: '#3085d6',
      });
      }
    } catch (error) {
     Swal.fire({
      icon: 'error',
      title: 'Verification Failed',
      text: 'Fingerprint verification failed',
      confirmButtonColor: '#d33',
    });
    }
    finally {
    // Clear file & reset UI after every verification attempt
    setFingerTemplateId("");
    setCapturedImagePath("");
  }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setCapturedImagePath(null);
    setFingerTemplateId("");
    setMatchResult(null);
    setUserDetails({});
    setShowResult(false);
  };
const generateAdmitCardPDF = () => {
  if (!userDetails || Object.keys(userDetails).length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'No Data',
      text: 'No user data available for PDF generation.',
    });
    return;
  }

  const doc = new jsPDF({
    format: "a4",
    unit: "mm",
  });

  const fullName = `${userDetails.firstName || ""} ${userDetails.lastName || ""}`;

  // Outer Border (Full Page)
  doc.rect(5, 5, 200, 280); // A4 width ~210mm, height ~297mm, margin 5mm

  // === Segment 1: Candidate Details ===
  const segment1Y = 10;
  const segment1Height = 90;
  doc.rect(7, segment1Y, 196, segment1Height);

  // Main Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ADMIT CARD FOR STAGE-II (WRITTEN EXAM)", 45, 15);

  // Centre Info
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`CENTRE NAME: ${userDetails.centerName || ""}`, 10, 25);

  // Top Details
  const details = [
    [`Name: ${fullName}`, `Roll No: ${userDetails.rollNo || ""}`],
    [`Biometric No: ${userDetails.mobileNumber || ""}`, `Aadhaar No: ${userDetails.aadharNumber || ""}`],
    [`Address: ${userDetails.address || ""}`, `Trade: ${userDetails.trade || ""}`],
    [
      `Identification Marks - (a): ${userDetails.identificationMarks || ""}`,
      `Qualification: ${userDetails.qualifications || "N/A"}`,
    ],
    // [`(b): ${userDetails.identificationMarks || ""}`, ``],
  ];

  let y = 35;
  details.forEach(([left, right]) => {
    doc.text(left, 10, y);
    if (right) doc.text(right, 90, y);
    y += 8;
  });

  // Placeholder for signature & seal
  doc.text("(Indl Sign)", 20, y + 10);
  doc.text("Unit Seal", 90, y + 10);
  doc.text("(Presiding Officer Sign)", 150, y + 10);

  // Candidate Image
  if (userDetails.photo) {
    const img = `data:image/jpeg;base64,${userDetails.photo}`;
    doc.addImage(img, "JPEG", 160, 25, 30, 30);
  }

  // === Segment 2: Instructions ===
  const segment2Y = segment1Y + segment1Height + 5;
  const segment2Height = 60;
  doc.rect(7, segment2Y, 196, segment2Height);

  y = segment2Y + 5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.text("GENERAL INSTRUCTIONS TO CANDIDATES", 10, y);

  doc.setFont("Helvetica", "normal");
  const instructions = [
    "1. Candidates will bring the admit card along with Aadhaar Card.",
    "2. Candidates should carry a black ball point pen and writing materials.",
    "3. Calculator, Log tables, mobiles, etc. are strictly not allowed inside the exam hall.",
    "4. No entry after exam has started.",
    "5. Admit card does not guarantee eligibility to attend the exam.",
    "6. Register email ID and mobile with Recruitment Centre to get updates.",
  ];
  instructions.forEach((line, i) => doc.text(line, 10, y + 10 + i * 6));

  // === Segment 3: Examiner’s Copy ===
  const segment3Y = segment2Y + segment2Height + 5;
  const segment3Height = 85;
  doc.rect(7, segment3Y, 196, segment3Height);

  let ey = segment3Y + 5;
  doc.setFont("Helvetica", "bold");
  doc.text("EXAMINER’S COPY", 90, ey);
  ey += 8;

  doc.setFont("Helvetica", "normal");
  doc.text(`CENTRE NAME: ${userDetails.centerName || ""}`, 10, ey);
  ey += 8;
  doc.text(`Name: ${fullName}`, 10, ey);
  doc.text(`Roll No: ${userDetails.rollNo || ""}`, 90, ey);
  ey += 8;
  doc.text(`Biometric No: ${userDetails.mobileNumber || ""}`, 10, ey);
  doc.text(`Aadhaar No: ${userDetails.aadharNumber || ""}`, 90, ey);
  ey += 8;
  doc.text(`Address: ${userDetails.address || ""}`, 10, ey);
  doc.text(`Trade: ${userDetails.trade || ""}`, 90, ey);
  ey += 8;

  doc.text(`Identification Marks : ${userDetails.identifications || ""}`, 10, ey);
  doc.text(`Qualification: ${userDetails.qualifications || ""}`, 90, ey);
  ey += 8;

  doc.text("Signature of Candidate", 10, ey + 10);
  doc.text("Candidate will sign in front of examiner", 110, ey + 10);

  // Examiner photo
  if (userDetails.photo) {
    const img = `data:image/jpeg;base64,${userDetails.photo}`;
    doc.addImage(img, "JPEG", 160, ey - 40, 30, 30);
  }

  doc.save(`admit_card_${userDetails.rollNo || "preview"}.pdf`);
};

  return (
    <>
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-center text-3xl font-extrabold text-amber-700 mb-8 underline">
        USER DETAILS
      </h2>

      {!showResult ? (
        <div className="flex flex-col items-center space-y-6">
          {capturedImagePath ? (
            <img
              src={capturedImagePath}
              alt="Captured screen"
              className="w-96 h-64 object-contain rounded-md border border-gray-300 shadow-sm"
            />
          ) : (
            <div className="w-96 h-64 flex items-center justify-center rounded-md border-2 border-dashed border-amber-600 text-amber-600 font-semibold">
              Please capture Finger Screen
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleScreenCapture}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
            >
              Fingerprint Capture
            </button>
            <button
              onClick={verifyFinger}
              disabled={!fingerTemplateId}
              className={`px-6 py-2 rounded-md text-white transition ${
                fingerTemplateId
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("User details submitted (implement update logic here)");
          }}
          className="space-y-8"
        >
          {/* Header with photos and download button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-6">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <img
                src={`http://127.0.0.1:5000/uploads/${userDetails.photo}`}
                alt="User"
                className="w-[300px] h-[200px] object-cover rounded-lg shadow-md border border-gray-300"
              />
              <img
                src={`http://127.0.0.1:5000/dataset/${userDetails.finger_Template_id}`}
                alt="Fingerprint"
                className="w-[300px] h-[200px] object-contain rounded-lg shadow-md border border-gray-300 bg-gray-50"
              />
            </div>
            <div>
              <button
              onClick={generateAdmitCardPDF}
                type="button"
                className="px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
              >
                Download Admit Card PDF
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "firstName",
              "lastName",
              "email",
              "mobileNumber",
              "rollNo",
              "rallyNo",
              "centerName",
              "aadharNumber",
              "identificationMarks",
              "qualifications",
              "trade",
              "address",
              "created_at",
              "updated_at",
            ].map((field) => {
              const label = field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());

              const isDisabled = ["createdAt", "updatedAt"].includes(field);

              return (
                <div key={field} className="flex flex-col">
                  <label
                    htmlFor={field}
                    className="mb-1 text-sm font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  {field === "address" ? (
                    <textarea
                      id={field}
                      name={field}
                      value={userDetails[field] || ""}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={isDisabled}
                      className={`resize-none rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        isDisabled
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={userDetails[field] || ""}
                      onChange={handleInputChange}
                      disabled={isDisabled}
                      className={`rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        isDisabled
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 justify-center md:justify-start">
            {/* <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
            >
              Save Changes
            </button> */}
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              New Capture
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  );
}

export default ExistingUser;
