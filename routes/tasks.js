
import {pool} from "../db.js"

export const createTask = (req, res) => {

    const email = req.body.user.email
    const userId = req.body.user.uid

    const userQuery = "SELECT * FROM users WHERE email = ?";

    pool.query(userQuery, [email], (userErr, userData) => {
        if (userErr) {
            return res.status(500).json({ error: "Internal server error" });
        }

        if (userData.length > 0) {
            const noteQuery = "INSERT INTO tasks (`taskContent`, `completed`, `taskUid`) VALUES (?, ?, ?)";
            const completed = JSON.stringify(req.body.completed)
            pool.query(noteQuery, [req.body.taskContent, completed, userId], (noteErr, noteData) => {
                if (noteErr) {
                    return res.status(500).json("Error creating note");
                }
                return res.status(200).json("Task has been created successfully.");
            });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
};

export const getTasks = (req, res) => {

    const getNotesQuery = "SELECT * FROM `tasks` WHERE `taskUid` = ?"

    
    pool.query(getNotesQuery, [req.query.uid], (err, data)=>{
       
        if(err){
            return res.status(500).send(err);
        }

        return res.status(200).json(data);
    })
}
   
export const updateTask = (req, res) => {
    const status = JSON.stringify(req.body.completed)
    console.log(status);
    console.log(req.body.taskId);
    // Check if the note with the given ID belongs to the authenticated user
    const updateNoteQuery = "UPDATE tasks SET completed = ? WHERE taskId = ?";
        
        

        pool.query(updateNoteQuery, [status, req.body.taskId ], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json("Error updating note: " + updateErr);
            }

            return res.status(200).json("Task updated successfully");
        });
};


export const deleteTask = (req, res) => {
    const userId = req.query.user; // Assuming you have the user ID from the authentication middleware
    const taskId = req.query.taskId;
    
    // Check if the task with the given ID belongs to the authenticated user
    const checkOwnershipQuery = "SELECT taskId FROM tasks WHERE taskUid = ?";
    pool.query(checkOwnershipQuery, [userId], (userErr, userData) => {
        if (userErr) {
            return res.status(500).json("Error in user query: " + userErr);
        }

        const deleteTaskQuery = "DELETE FROM tasks WHERE taskId = ?";
        
        pool.query(deleteTaskQuery, [taskId], (deleteErr, deleteResult) => {
            
            if (deleteErr) {
                return res.status(500).json("Error deleting task: " + deleteErr);
            }

            // if (deleteResult.affectedRows === 0) {
            //     // No rows were deleted, indicating that the note with the given ID was not found
            //     return res.status(404).json({ message: 'Note not found' });
            // }

            return res.status(200).json("Task deleted successfully" + taskId);
        });
    });
};
