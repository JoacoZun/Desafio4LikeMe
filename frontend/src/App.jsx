import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";
import { getPosts, createPost, likePost, deletePost } from "./api";

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

  // Función para obtener los posts
  const fetchPosts = async () => {
    const posts = await getPosts();
    setPosts(posts);
  };

  // Función para agregar un post
  const agregarPost = async () => {
    if (!titulo.trim() || !imgSrc.trim() || !descripcion.trim()) {
      alert("Todos los campos son obligatorios y no pueden estar vacíos.");
      return;
    }
    const post = { titulo, img: imgSrc, descripcion, likes: 0 };
    try {
      await createPost(post);
      fetchPosts();
      setTitulo("");
      setImgSRC("");
      setDescripcion("");
    } catch (error) {
      console.error("Error al agregar el post:", error);
      alert("Ocurrió un error al intentar agregar el post.");
    }
  };

// Función para dar like
const like = async (id) => {
  try {
    console.log("Dando like al post con id:", id); // Agrega esta línea para verificar el ID
    await likePost(id);
    fetchPosts(); // Refresca los posts
  } catch (error) {
    console.error("Error al dar like:", error);
    alert("No se pudo dar like al post.");
  }
};

  // Función para eliminar un post
  const eliminarPost = async (id) => {
    try {
      await deletePost(id);
      fetchPosts();
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      alert("No se pudo eliminar el post.");
    }
  };

  // Hook para cargar los posts al iniciar la aplicación
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post key={i} post={post} like={like} eliminarPost={eliminarPost} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
