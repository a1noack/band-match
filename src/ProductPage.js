// Example: ProductPage.js
import React from 'react';

async function ProductPage() {
    const prompt = document.getElementById('prompt').value;
    const response = await fetch('https://us-central1-your-project-id.cloudfunctions.net/generateImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    const imageElement = document.getElementById('generated-image');
    imageElement.src = data.image;
    imageElement.style.display = 'block';
}

export default ProductPage;