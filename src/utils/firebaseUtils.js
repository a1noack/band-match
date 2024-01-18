import { collection, getDocs } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db } from "./firebaseConfig";
import { GeoPoint, query, where } from "@firebase/firestore";

export const uploadToFirebase = async (fileToUpload) => {
  const storage = getStorage();
  console.log("Uploading to Firebase");
  if (!fileToUpload) return;

  // Generate a unique file name or path here
  const fileRef = ref(storage, `images/${fileToUpload.name}-${Date.now()}`);

  try {
    // uploadBytesResumable returns an upload task
    const uploadTask = uploadBytesResumable(fileRef, fileToUpload);

    // Use a promise to handle completion
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Error during upload", error);
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file", error);
    return null;
  }
};

export const fetchDocuments = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));

  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    entity_name: doc.data().name,
    entity_email: doc.data().email,
    entity_type: doc.data().accountType,
  }));
  console.log(documents);
  return documents;
};

export const fetchVenueNames = async (user) => {
  const latitude = user?.geometry?._lat;
  const longitude = user?.geometry?._long;
  const distance = +process.env.REACT_APP_NEAR_BY_AREA;
  const lat = 0.0144927536231884;
  const lon = 0.0181818181818182;

  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;

  const greaterLat = latitude + lat * distance;
  const greaterLon = longitude + lon * distance;

  const lesserGeopoint = new GeoPoint(lowerLat, lowerLon);
  const greaterGeopoint = new GeoPoint(greaterLat, greaterLon);

  const docRef = collection(db, "venues");
  const dataQuery = query(
    docRef,
    where("geometry", ">", lesserGeopoint),
    where("geometry", "<", greaterGeopoint)
  );

  const snapshots = await getDocs(dataQuery);
  const names = snapshots.docs.map((doc) => ({
    venue_name: doc.data().name,
    venue_location: doc.data().location,
    venue_image: doc.data().images,
    geometry: doc.data().geometry,
  }));

  return names;
};
