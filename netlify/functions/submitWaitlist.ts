// netlify/functions/submitWaitlist.ts
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import admin from "firebase-admin";

// Ensure you have your service account key configured in Netlify environment variables
// For example, FIREBASE_SERVICE_ACCOUNT_JSON
// or FIREBASE_CONFIG_AND_CREDENTIALS (for firebase-admin >= v9.1.0)

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
    try {
        // Option B: Parsing a JSON string from environment variable
        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Firebase Admin SDK initialized successfully.");
        } else {
            console.error("Firebase service account JSON (FIREBASE_SERVICE_ACCOUNT_JSON) not found in environment variables.");
        }
    } catch (e) {
        console.error("Firebase Admin SDK initialization error during initializeApp:", e);
    }
} else {
    console.log("Firebase Admin SDK already initialized.");
}

let db: admin.firestore.Firestore;
try {
    db = admin.firestore();
    console.log("Firestore instance created successfully.");
} catch (e) {
    console.error("Failed to create Firestore instance:", e);
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // --- Add this check at the very beginning of the handler ---
    if (!db) {
        console.error("CRITICAL: Firestore database is not initialized. Check Firebase Admin SDK setup and credentials.");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server configuration error: Could not connect to the database." }),
        };
    }

    if (event.httpMethod === "POST") {
        try {
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Request body is missing." }),
                };
            }

            const { 
                email, 
                featurePreferences,
            } = JSON.parse(event.body);

            // --- Input Validation ---
            if (!email || typeof email !== 'string' || !email.includes('@')) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Valid email is required." }),
                };
            }

            if (!Array.isArray(featurePreferences)) {
                 return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Feature preferences must be an array." }),
                };
            }
            
            if (!featurePreferences.every(item => typeof item === 'string')) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "All feature preferences must be strings." }),
                };
            }

            // --- Prepare data for Firestore ---
            const waitlistEntry = {
                email: email.toLowerCase(),
                selectedFeatures: featurePreferences,
                submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            // --- Save to Firestore ---
            const existingEntryQuery = await db.collection("waitlistEntries").where("email", "==", waitlistEntry.email).limit(1).get();

            if (!existingEntryQuery.empty) {
                const existingDocId = existingEntryQuery.docs[0].id;
                await db.collection("waitlistEntries").doc(existingDocId).update({
                    selectedFeatures: waitlistEntry.selectedFeatures,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log("Updated existing entry for email: ", waitlistEntry.email, "with ID:", existingDocId);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Your preferences have been updated!", id: existingDocId }),
                };
            } else {
                const docRef = await db.collection("waitlistEntries").add(waitlistEntry);
                console.log("New waitlist entry written for email: ", waitlistEntry.email, "with ID: ", docRef.id);
                return {
                    statusCode: 201,
                    body: JSON.stringify({ message: "Successfully added to waitlist!", id: docRef.id }),
                };
            }

        } catch (error) {
            console.error("Error processing request: ", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown server error occurred";
            const clientErrorMessage = process.env.NODE_ENV === 'development' ? errorMessage : "Failed to process your request.";
            return {
                statusCode: 500,
                body: JSON.stringify({ message: clientErrorMessage, details: process.env.NODE_ENV === 'development' ? error : undefined }),
            };
        }
    } else {
        return {
            statusCode: 405,
            headers: { 'Allow': 'POST' },
            body: JSON.stringify({ message: "Only POST requests are allowed." }),
        };
    }
};

export { handler };
