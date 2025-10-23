export function decodeToken(token) {
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}

// // Example Usage
// const token = localStorage.getItem("token"); // or sessionStorage
// const userData = decodeToken(token);

// if (userData) {
//     return userData;
// }