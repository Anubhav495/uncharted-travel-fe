// /src/pages/api/submitWaitlist.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// --- Firebase Admin SDK Initialization ---
// This block runs only once when the serverless function starts up.
// It's designed to be robust for the Vercel environment.
if (!admin.apps.length) {
    try {
        // When deployed to Vercel, it will find the environment variables
        // you set in the project dashboard.
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}'
        );
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully for Vercel.");
    } catch (e) {
        console.error("CRITICAL: Firebase Admin SDK initialization failed.", e);
    }
}

// Get a reference to the Firestore database service.
const db = admin.firestore();

// The main handler function for our API route.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // We only want to process POST requests for this endpoint.
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Extract the data from the incoming request body.
        const { email, featurePreferences } = req.body;

        // --- Input Validation ---
        // Ensure the data is in the expected format before proceeding.
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: "A valid email address is required." });
        }
        if (!Array.isArray(featurePreferences) || !featurePreferences.every(item => typeof item === 'string')) {
            return res.status(400).json({ message: "Feature preferences must be a valid array of strings." });
        }
        
        // --- Prepare the data object for Firestore ---
        const waitlistEntry = {
            email: email.toLowerCase(), // Store emails in lowercase for consistency
            selectedFeatures: featurePreferences,
            submittedAt: admin.firestore.FieldValue.serverTimestamp(), // Use server time
        };

        // --- Check if a user with this email already exists ---
        const existingEntryQuery = await db.collection("waitlistEntries").where("email", "==", waitlistEntry.email).limit(1).get();
        
        // If the user exists, update their preferences.
        if (!existingEntryQuery.empty) {
            const existingDocId = existingEntryQuery.docs[0].id;
            await db.collection("waitlistEntries").doc(existingDocId).update({
                selectedFeatures: waitlistEntry.selectedFeatures,
                updatedAt: admin.firestore.FieldValue.serverTimestamp() // Add an 'updatedAt' timestamp
            });
            console.log("Updated existing waitlist entry for:", waitlistEntry.email);
            return res.status(200).json({ message: "Your preferences have been successfully updated!", id: existingDocId });
        
        // If the user is new, create a new entry.
        } else {
            const docRef = await db.collection("waitlistEntries").add(waitlistEntry);
            console.log("Created new waitlist entry for:", waitlistEntry.email);
            return res.status(201).json({ message: "Successfully added to the waitlist!", id: docRef.id });
        }

    } catch (error) {
        // Catch any unexpected errors during the process.
        console.error("Error processing waitlist submission: ", error);
        return res.status(500).json({ message: "An internal server error occurred. Please try again later." });
    }
}