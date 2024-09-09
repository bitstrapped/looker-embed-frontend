import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";

function Embed() {
  const { embedType } = useParams();
  const [signedUrl, setSignedUrl] = useState("");
  const embedContainer = useRef(null);

  useEffect(() => {
    if (embedType) {
      // Check if embedType is defined
      const fetchSignedUrl = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9607/get_embed_url?type=${embedType}`
          );
          setSignedUrl(response.data.embed_url);
        } catch (error) {
          console.error(`Error fetching signed URL for ${embedType}:`, error);
        }
      };
      fetchSignedUrl();
    }
  }, [embedType]);

  useEffect(() => {
    if (signedUrl && embedContainer.current) {
      // Embed the content using iframe with the signed URL
      const iframe = document.createElement("iframe");
      iframe.src = signedUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.title = `Looker ${
        embedType ? embedType.charAt(0).toUpperCase() + embedType.slice(1) : ""
      } Embed`;

      // Clean up previous iframes
      embedContainer.current.innerHTML = "";
      embedContainer.current.appendChild(iframe);
    }
  }, [signedUrl, embedType]);

  return (
    <div>
      {embedType ? ( // Conditional rendering based on embedType
        <h1>
          Looker {embedType.charAt(0).toUpperCase() + embedType.slice(1)} Embed
        </h1>
      ) : (
        <h1>Loading type...</h1>
      )}
      {signedUrl ? (
        <div
          ref={embedContainer}
          style={{ width: "100%", height: "100vh", position: "relative" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="nav-bar">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>{" "}
          |{" "}
          <Link className="nav-link" to="/explore">
            Explore
          </Link>
        </nav>
        <Routes>
          <Route path="/:embedType" element={<Embed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
