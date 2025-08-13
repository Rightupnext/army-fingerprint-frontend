import React, { useState } from "react";
import {
  FiDownload,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import { BiFingerprint } from "react-icons/bi";
import axios from "axios";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import imgLeft from "../assets/img2.png";
import imgRight from "../assets/img1.png";

const BiometricGetUser = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImagePath, setCapturedImagePath] = useState(null);
  const [fingerTemplateId, setFingerTemplateId] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const handleScreenCapture = async () => {
    try {
      setIsCapturing(true);
      const response = await axios.post("http://127.0.0.1:5000/capture-screen");
      const filename = response.data.filename;
      if (filename) {
        const imageUrl = `http://127.0.0.1:5000/sample/${filename}`;
        setCapturedImagePath(imageUrl);
        setFingerTemplateId(filename);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Capture Failed",
        text: "Failed to capture fingerprint",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const verifyFinger = async () => {
    if (!fingerTemplateId) return;

    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/fingerprint-match",
        { test_image: fingerTemplateId }
      );

      if (response.data && response.data.user) {
        setUserDetails(response.data.user);
      } else {
        Swal.fire({
          icon: "warning",
          title: "No Match",
          text: "No matching user found. Please try again.",
        });
        setUserDetails(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: "Fingerprint verification failed",
      });
    } finally {
      setIsLoading(false);

      // Reset capture to prepare for the next process
      setCapturedImagePath(null);
      setFingerTemplateId(""); // ready for next capture
    }
  };

  const generateAdmitCardPDF = () => {
    if (!userDetails || Object.keys(userDetails).length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Data",
        text: "No user data available for PDF generation.",
      });
      return;
    }

    const doc = new jsPDF({ format: "a4", unit: "mm" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const fullName = `${userDetails.firstName || ""} ${
      userDetails.lastName || ""
    }`;

    // ---------------------- Outer Border ----------------------
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // ---------------------- Segment 1: Candidate Details ----------------------
    const segment1Y = 10;
    const segment1Height = 90;
    doc.rect(7, segment1Y, pageWidth - 14, segment1Height);

    // Left and right images
    doc.addImage(imgLeft, "PNG", 10, 10, 20, 20);
    doc.addImage(imgRight, "PNG", pageWidth - 30, 10, 20, 20);

    // Main title centered between images
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    const title = "ADMIT CARD FOR STAGE-II (WRITTEN EXAM)";
    const titleTextWidth = doc.getTextWidth(title);
    const titleX = 10 + 20 + (pageWidth - 30 - 20 - titleTextWidth) / 2; // center between images
    let y = 25;
    doc.text(title, titleX, y);
    y += 10;

    // Centre info
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`CENTRE NAME: ${userDetails.centerName || ""}`, 10, y);
    y += 8;

    // Candidate details table
    const details = [
      [`Name: ${fullName}`, `Roll No: ${userDetails.rollNo || ""}`],
      [
        `Biometric No: ${userDetails.mobileNumber || ""}`,
        `Aadhaar No: ${userDetails.aadharNumber || ""}`,
      ],
      [
        `Address: ${userDetails.address || ""}`,
        `Trade: ${userDetails.trade || ""}`,
      ],
      [
        `Identification Marks: ${userDetails.identificationMarks || ""}`,
        `Qualification: ${userDetails.qualifications || "N/A"}`,
      ],
    ];

    details.forEach(([left, right]) => {
      doc.text(left, 10, y);
      if (right) doc.text(right, 100, y);
      y += 8;
    });

    // Candidate photo
    if (userDetails.photo) {
      const img = `data:image/jpeg;base64,${userDetails.photo}`;
      doc.addImage(img, "JPEG", pageWidth - 50, 25, 30, 30);
    }

    // Signatures
    y += 15;
    doc.text("(Indl Sign)", 20, y);
    doc.text("Unit Seal", 90, y);
    doc.text("(Presiding Officer Sign)", 150, y);

    // ---------------------- Segment 2: Instructions ----------------------
    const segment2Y = segment1Y + segment1Height + 5;
    const segment2Height = 60;
    doc.rect(7, segment2Y, pageWidth - 14, segment2Height);

    y = segment2Y + 8;
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
    instructions.forEach((line, i) => doc.text(line, 10, y + 8 + i * 6));

    // ---------------------- Segment 3: Examiner’s Copy ----------------------
    const segment3Y = segment2Y + segment2Height + 5;
    const segment3Height = 85;
    doc.rect(7, segment3Y, pageWidth - 14, segment3Height);

    // Initialize vertical position
    let ey = segment3Y + 8;

    // Add left and right images for Examiner's Copy
    doc.addImage(imgLeft, "PNG", 10, ey - 5, 20, 20);
    doc.addImage(imgRight, "PNG", pageWidth - 30, ey - 5, 20, 20);

    // Centered title between images
    const leftX = 10;
    const leftWidth = 20;
    const rightX = pageWidth - 30;
    const sectionTitle = "EXAMINER’S COPY";
    const availableWidth = rightX - (leftX + leftWidth);
    const sectionTextWidth = doc.getTextWidth(sectionTitle);
    const textX = leftX + leftWidth + (availableWidth - sectionTextWidth) / 2;

    doc.setFont("Helvetica", "bold");
    doc.text(sectionTitle, textX, ey);
    ey += 25; // leave space for images and title

    // Examiner details
    doc.setFont("Helvetica", "normal");
    const examinerDetails = [
      [`CENTRE NAME: ${userDetails.centerName || ""}`, ""],
      [`Name: ${fullName}`, `Roll No: ${userDetails.rollNo || ""}`],
      [
        `Biometric No: ${userDetails.mobileNumber || ""}`,
        `Aadhaar No: ${userDetails.aadharNumber || ""}`,
      ],
      [
        `Address: ${userDetails.address || ""}`,
        `Trade: ${userDetails.trade || ""}`,
      ],
      [
        `Identification Marks: ${userDetails.identificationMarks || ""}`,
        `Qualification: ${userDetails.qualifications || ""}`,
      ],
    ];

    examinerDetails.forEach(([left, right]) => {
      doc.text(left, 10, ey);
      if (right) doc.text(right, 100, ey);
      ey += 8;
    });

    // Examiner signatures
    doc.text("Signature of Candidate", 10, ey + 10);
    doc.text("Candidate will sign in front of examiner", 110, ey + 10);

    // Examiner photo
    if (userDetails.photo) {
      const img = `data:image/jpeg;base64,${userDetails.photo}`;
      doc.addImage(img, "JPEG", pageWidth - 50, ey - 40, 30, 30);
    }

    // Save PDF
    doc.save(`admit_card_${userDetails.rollNo || "preview"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Fingerprint Capture */}
          <div className="p-6 border-r border-border">
            <div className="aspect-square bg-gray-200 rounded-lg border-2 border-border flex items-center justify-center mb-6">
              {!capturedImagePath ? (
                <BiFingerprint className="w-32 h-32 text-green-600 animate-pulse" />
              ) : (
                <div className="relative">
                  <img
                    src={capturedImagePath}
                    alt="Captured Fingerprint"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2">
                    <FiCheck className="text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleScreenCapture}
                disabled={isCapturing}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturing ? "Capturing..." : "Capture Print"}
              </button>

              <button
                onClick={verifyFinger}
                disabled={!fingerTemplateId}
                className="w-full py-3 px-4 bg-teal-500 text-white rounded-md hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Right Column - User Details */}
          <div className="p-6 relative">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Processing Please Wait...
                  </p>
                </div>
              </div>
            ) : !userDetails ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Complete fingerprint capture to view user details</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-800">
                    User Details
                  </h2>
                  <button
                    onClick={generateAdmitCardPDF}
                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    <FiDownload /> Download Admit Card PDF
                  </button>
                </div>

                {/* User Images */}
                <div className="flex items-center gap-4">
                  {userDetails.photo && (
                    <img
                      src={`http://127.0.0.1:5000/uploads/${userDetails.photo}`}
                      alt="Profile"
                      className="w-40 h-60 rounded-full object-cover"
                    />
                  )}
                  {userDetails.finger_Template_id && (
                    <img
                      src={`http://127.0.0.1:5000/dataset/${userDetails.finger_Template_id}`}
                      alt="Fingerprint"
                      className="w-40 h-60 rounded object-contain border border-gray-300"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {userDetails.firstName} {userDetails.lastName}
                    </h3>
                    <p className="text-gray-500">Registered User</p>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <strong>Email :</strong>{" "}
                    <span>{userDetails.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Phone :</strong>{" "}
                    <span>{userDetails.mobileNumber || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Address :</strong>{" "}
                    <span>{userDetails.address || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Roll No :</strong>{" "}
                    <span>{userDetails.rollNo || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Rally No :</strong>{" "}
                    <span>{userDetails.rallyNo || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Trade :</strong>{" "}
                    <span>{userDetails.trade || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Centre Name :</strong>{" "}
                    <span>{userDetails.centerName || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Aadhar No :</strong>{" "}
                    <span>{userDetails.aadharNumber || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Qualification :</strong>{" "}
                    <span>{userDetails.qualifications || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Identification Marks :</strong>{" "}
                    <span>{userDetails.identificationMarks || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Created At :</strong>{" "}
                    <span>
                      {userDetails.created_at
                        ? new Date(userDetails.created_at).toLocaleString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            }
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong>Updated At :</strong>{" "}
                    <span>
                      {userDetails.updated_at
                        ? new Date(userDetails.updated_at).toLocaleString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            }
                          )
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricGetUser;
