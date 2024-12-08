import axios from "axios";

const API_URL = "http://localhost:3000";

export const getPosts = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/posts`);
    return data;
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    return [];
  }
};

export const createPost = async (post) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, post);
    return response.data;
  } catch (error) {
    console.error("Error al crear el post:", error);
    throw error;
  }
};

export const likePost = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${id}/like`);
    return response.data; 
  } catch (error) {
    console.error("Error al dar like:", error);
    throw error;
  }
};


export const deletePost = async (id) => {
  try {
    await axios.delete(`${API_URL}/posts/${id}`);
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    throw error;
  }
};
