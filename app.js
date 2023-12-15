const express = require("express");
const admin = require("firebase-admin");
const moment = require("moment-timezone");
const generateRandomKey = require("./generateRandomKey");

const app = express();
const port = process.env.PORT || 3001;

// Initialize Firebase Admin SDK with your credentials
const serviceAccount = require("./firebase-credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/home.html`);
});

// Generate and store a random key in Firestore
app.get("/.netlify/functions/app/randomKey", async (req, res) => {
  try {
    // Generate a random key using the imported function
    const randomKey = generateRandomKey(5);

    // Initialize Firestore
    const firestore = admin.firestore();

    // Generate a unique document ID using a timestamp in the 'Asia/Karachi' timezone
    const timestamp = moment()
      .tz("Asia/Karachi")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const documentId = `key_${timestamp}`;

    // Store the random key in Firestore
    const keyRef = firestore.collection("keys").doc(documentId);
    await keyRef.set({ value: randomKey });

    res.json({ key: randomKey, message: "key generated and stored"  });
    console.log("Key Generated");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
