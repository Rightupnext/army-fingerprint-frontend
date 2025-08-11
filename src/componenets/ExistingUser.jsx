import React, { useState } from "react";
import axios from "axios";
import "./Existing.css";

function ExistingUser() {
  const [capturedImagePath, setCapturedImagePath] = useState(null);
  const [fingerTemplateId, setFingerTemplateId] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const handleScreenCapture = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/capture-screen");
      const filename = response.data.filename; // Use 'filename' from backend
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

  const verifyFinger = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/fingerprint-match",
        { test_image: fingerTemplateId }
      );
      console.log("Match result:", response.data);
      setMatchResult(response.data);
    } catch (error) {
      console.error("Error verifying fingerprint:", error);
      alert("Fingerprint verification failed");
    }
  };

  return (
    <div className="match_container">
      {/* Left side: fingerprint capture */}
      <div className="left-panel">
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
          <div className="match_captured-image-section empty">
            Please capture Finger Screen
          </div>
        )}

        <button type="button" className="btn" onClick={handleScreenCapture}>
          Fingerprint Capture
        </button>

        <button type="submit" className="submit-btn" onClick={verifyFinger} disabled={!fingerTemplateId}>
          Submit
        </button>
      </div>

      {/* Right side: A4 sized user details */}
      <div className="match_right-panel">
        {matchResult && matchResult.user ? (
          <div className="match-result">
            <h2>Match Result</h2>
            <div className="user-details">
              <img src={`http://127.0.0.1:5000/uploads/${matchResult.user.photo}`}/>
              <p><strong>First Name:</strong> {matchResult.user.firstName}</p>
              <p><strong>Last Name:</strong> {matchResult.user.lastName}</p>
              <p><strong>Email:</strong> {matchResult.user.email}</p>
              <p><strong>Mobile:</strong> {matchResult.user.mobileNumber}</p>
              <p><strong>Center:</strong> {matchResult.user.centerName}</p>
              <p><strong>Aadhar Number:</strong> {matchResult.user.aadharNumber}</p>
              <p><strong>Identification Marks:</strong> {matchResult.user.identificationMarks}</p>
              <p><strong>Qualifications:</strong> {matchResult.user.qualifications}</p>
              <p><strong>Trade:</strong> {matchResult.user.trade}</p>
              <p><strong>Roll No:</strong> {matchResult.user.rollNo}</p>
              <p><strong>Rally No:</strong> {matchResult.user.rallyNo}</p>
            </div>
          </div>
        ) : (
          <div className="no-match-message">No match data to display.</div>
        )}
      </div>
    </div>
  );
}

export default ExistingUser;
