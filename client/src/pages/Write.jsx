import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.title || "");
  const [title, setTitle] = useState(state?.des || ""); // Changed desc to des
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${localStorage.getItem("token")}`,
        },
      };

      const res = await axios.post(
        "http://localhost:8800/api/upload",
        formData,
        config
      );

      console.log(res.data);
      return res.data;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err; // Re-throw the error to handle it in the caller function if needed
    }
  };

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const imgUrl = await upload();

    const config = {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    };

    try {
      if (state) {
        const data = await axios.put(
          `http://localhost:8800/api/posts/${state.id}`,
          {
            title,
            des: value, // Changed desc to des
            cat,
            img: file ? imgUrl : "",
          },
          config
        );
        console.log(data);
      } else {
        const data = await axios.post(
          `http://localhost:8800/api/posts/`,
          {
            title,
            des: value, // Changed desc to des
            cat,
            img: file ? imgUrl : "",
            date_: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Changed data to date_
          },
          config
        );

        console.log(data);
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          {/* Radio buttons for category selection */}
          {/* You can add or remove categories as needed */}
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;

