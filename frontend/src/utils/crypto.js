import CryptoJS from "crypto-js";

// Use same key as backend
const SECRET_KEY = "qwertyuiop"; // Replace with your actual key

const handleSubmit = async (e) => {
  e.preventDefault();

  const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
  const body = authMode === 'signup' ? { email, password, age } : { email, password };

  // Encrypt body before sending
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(body), SECRET_KEY).toString();

  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: encryptedData })
    });

    const encryptedResponse = await res.text(); // response is AES encrypted
    const bytes = CryptoJS.AES.decrypt(encryptedResponse, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    const decrypted = JSON.parse(decryptedText);

    if (decrypted.token) {
      login(decrypted.token, decrypted.role); // also save role
      navigate('/');
    } else {
      alert(decrypted.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error("Error:", error);
    alert('Request failed.');
  }
};
