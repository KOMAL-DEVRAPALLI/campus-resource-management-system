const BASE_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
  // console.log("BASE URL:", BASE_URL);
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
    return;
  }

  const text = await response.text();  // 🔥 read raw first

  try {
    return JSON.parse(text); // try parsing
  } catch (err) {
    console.error("NON-JSON RESPONSE:", text);
    throw new Error("Server error (non-JSON response)");
  }
};


export const apiRequest = async (url, method, data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 FORCE ADD
    },
    body: data ? JSON.stringify(data) : null,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

export const apiGet = async (url) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`, // 🔥 FORCE ADD
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};