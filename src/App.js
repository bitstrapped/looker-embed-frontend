// src/App.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [signedUrl, setSignedUrl] = useState("");
  const embedContainer = useRef(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const response = await axios.get("http://localhost:9607/get_embed_url");
        setSignedUrl(response.data.embed_url);
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };
    fetchSignedUrl();
  }, []);

  useEffect(() => {
    if (signedUrl && embedContainer.current) {
      // Embed the dashboard using iframe with the signed URL
      const iframe = document.createElement("iframe");
      iframe.src = signedUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.title = "Looker Dashboard Embed";

      // Clean up previous iframes
      embedContainer.current.innerHTML = "";
      embedContainer.current.appendChild(iframe);
    }
  }, [signedUrl]);

  return (
    <div className="App">
      <h1>Looker Dashboard Embed</h1>
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

export default App;
