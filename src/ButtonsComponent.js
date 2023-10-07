import React from 'react';
import { db } from './firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

async function writeTestData() {
  try {
    const docRef = await addDoc(collection(db, 'testCollection'), {
      Name: 'Adam Noack',
      Location: 'United States'
      // ... other fields
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

async function readTestData() {
  const querySnapshot = await getDocs(collection(db, 'testCollection'));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });
}

function ButtonsComponent() {
  return (
    <div>
      <button onClick={writeTestData}>Write Test Data</button>
      <button onClick={readTestData}>Read Test Data</button>
    </div>
  );
}

export default ButtonsComponent;