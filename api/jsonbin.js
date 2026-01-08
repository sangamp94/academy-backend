import fetch from "node-fetch";

const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export async function getData() {
  const res = await fetch(BASE_URL + "/latest", {
    headers: {
      "X-Master-Key": API_KEY
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data from JSONBin");
  }

  const data = await res.json();
  return data.record;
}

export async function updateData(newData) {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(newData)
  });

  if (!res.ok) {
    throw new Error("Failed to update JSONBin");
  }

  return res.json();
}
