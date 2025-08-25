// src/utilities/items-api.js
import sendRequest from './send-request';

// GET all items
export async function getAllItems() {
  const res = await sendRequest('/api/items');
  return res.data; // assuming your backend returns { success, data }
}

// GET single item by id
export async function getItem(id) {
  const res = await sendRequest(`/api/items/${id}`);
  return res.data.item || res.data; // match your backend structure
}

// UPDATE item by id
export async function updateItem(id, itemData) {
  const res = await sendRequest(`/api/items/${id}`, 'PUT', itemData);
  return res.data.item || res.data;
}

// CREATE new item
export async function createItem(itemData) {
  const res = await sendRequest('/api/items', 'POST', itemData);
  return res.data.item || res.data;
}

// DELETE item
export async function deleteItem(id) {
  const res = await sendRequest(`/api/items/${id}`, 'DELETE');
  return res.data;
}
