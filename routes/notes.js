
import {pool} from "../db.js"

export const createNote = (req, res) => {
    const userQuery = "SELECT * FROM users WHERE email = ?";

    pool.query(userQuery, [req.body.user.email], (userErr, userData) => {
        if (userErr) {
            return res.status(500).json({ error: "Internal server error" });
        }

        if (userData.length > 0) {
            const noteQuery = "INSERT INTO notes (`noteTitle`, `content`, `uid`) VALUES (?, ?, ?)";
            pool.query(noteQuery, [req.body.noteTitle, req.body.content, req.body.user.uid], (noteErr, noteData) => {
                if (noteErr) {
                    return res.status(500).json("Error creating note");
                }
                return res.status(200).json("Note has been created successfully.");
            });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
};

export const getNotes = (req, res) => {

    const getNotesQuery = "SELECT * FROM `notes` WHERE `uid` = ?"
    pool.query(getNotesQuery, [req.query.uid], (err, data)=>{
        if(err){
            return res.status(500).send(err);
        }

        return res.status(200).json(data);
    })
}
     
export const getSingleNote = (req, res) => {
    const userQuery = "SELECT * FROM users WHERE uid = ?"
    pool.query(userQuery, [req.query.uid], (userErr, userData)=>{
        if(userErr){
            return res.status(500).json("your error is in user " + userErr)
        }

        const noteQuery = "SELECT * FROM notes WHERE noteId = ?"
        pool.query(noteQuery, [req.query.noteId], (noteErr, noteData)=>{
            
            if(noteErr){
                return res.status(500).json(noteErr)
            }

            return res.status(200).json(noteData)
        })
    })
}

export const deleteSingleNote = (req, res) => {
    const userId = req.query.uid; // Assuming you have the user ID from the authentication middleware
    const noteId = req.query.noteId;

    // Check if the note with the given ID belongs to the authenticated user
    const checkOwnershipQuery = "SELECT uid FROM notes WHERE uid = ?";
    pool.query(checkOwnershipQuery, [userId], (ownershipErr, ownershipResult) => {
        if (ownershipErr) {
            return res.status(500).json(ownershipErr);
        }

        if (ownershipResult.length === 0 || ownershipResult[0].uid !== userId) {
            // The note was not found or does not belong to the authenticated user
            return res.status(403).json({ message: 'You do not have permission to delete this note' });
        }

        // If ownership is confirmed, proceed with the deletion
        const deleteNoteQuery = "DELETE FROM notes WHERE noteId = ?";
        pool.query(deleteNoteQuery, [noteId], (deleteErr, deleteResult) => {
            if (deleteErr) {
                return res.status(500).json(deleteErr);
            }

            if (deleteResult.affectedRows === 0) {
                // No rows were deleted, indicating that the note with the given ID was not found
                return res.status(404).json({ message: 'Note not found' });
            }

            return res.status(200).json('Note deleted successfully!!!');
        });
    });
};

export const updateNote = (req, res) => {
    const userId = req.query.uid; // Assuming you have the user ID from the authentication middleware
    const noteId = req.query.noteId;

    // Check if the note with the given ID belongs to the authenticated user
    const checkOwnershipQuery = "SELECT uid FROM notes WHERE uid = ?";
    pool.query(checkOwnershipQuery, [userId], (userErr, userData) => {
        if (userErr) {
            return res.status(500).json("Error in user query: " + userErr);
        }

        const updateNoteQuery = "UPDATE notes SET noteTitle = ?, content = ? WHERE noteId = ?";

        pool.query(updateNoteQuery, [req.body.noteTitle, req.body.content, req.query.noteId ], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json("Error updating note: " + updateErr);
            }

            return res.status(200).json("Note updated successfully");
        });
    });
};