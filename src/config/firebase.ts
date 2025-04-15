import admin from "firebase-admin";
import serviceAccount from "../../credential.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export { admin as firebaseAdmin };
