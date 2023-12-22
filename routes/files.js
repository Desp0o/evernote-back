import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db.js";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Adjust the destination folder as needed
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)
    );
  },
});

const uploadMiddleware = multer({ storage: storage });

export const addFile = (req, res) => {
  const q = "INSERT INTO files(`fileUid`, `file`, fileMimeType, originalName) VALUES (?, ?, ?, ?)";

  uploadMiddleware.single("file")(req, res, (err) => {
    if (err) {
      return res.status(500).json(err.message);
    }

    const values = [
      req.body.fileUid,
      req.file ? req.file.filename : null, // Use the filename from Multer
      req.file.mimetype,
      req.file.originalname
    ];
    pool.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json("File has been uploaded.");
    });
  });
};

export const getFiles = (req, res) => {
  const userQuery = "SELECT * FROM users WHERE email = ?";

  pool.query(userQuery, [req.query.user], (userErr, userData) => {
    if (userErr) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (userData.length > 0) {
      const getNotesQuery = "SELECT * FROM `files` WHERE `fileUid` = ?";
      pool.query(getNotesQuery, [req.query.uid], (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.status(200).json(data);
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
};


export const deleteFile = (req, res) => {
  const fileUid = req.params.id; // Assuming fileUid is passed in the request parameters
  // Step 1: Find the file record in the database
  const selectQuery = "SELECT `file` FROM files WHERE `id` = ?";
  pool.query(selectQuery, [fileUid], (selectErr, selectData) => {
    if (selectErr) {
      return res.status(500).json({ error: selectErr.message });
    }

    if (selectData.length === 0) {
      return res.status(404).json({ error: "File not found." });
    }

    const filename = selectData[0].file;
    

    // Step 2: Delete the file from the server
    const filePath = path.join("uploads", filename); // Update the path accordingly

    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== "ENOENT") {
        // Handle unlink error (except for file not found)
        return res.status(500).json({ error: unlinkErr.message });
      }

      // Step 3: Delete the file record from the database
      const deleteQuery = "DELETE FROM files WHERE `id` = ?";
      pool.query(deleteQuery, [fileUid], (deleteErr, deleteData) => {
        if (deleteErr) {
          return res.status(500).json({ error: deleteErr.message });
        }

        return res.json("File has been deleted.");
      });
    });
  });
};