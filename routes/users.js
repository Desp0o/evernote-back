import {pool} from "../db.js"

export const userLogin = (req, res) => {

   const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
   const checkEmailValues = [req.body.email];
  

  pool.query(checkEmailQuery, checkEmailValues, (checkEmailError, checkEmailResults) => {

    if (checkEmailError) {
      console.error('Database error (email check):', checkEmailError);
      return res.status(500).json({ error: 'Database error (email check)' });
    }

    //check if user with email is exist
    if (checkEmailResults.length > 0) {
      return res.status(200).send('You Logged Successfully');
    }


    // if user is not exist register 
    const insertQuery = 'INSERT INTO users (`displayName`, `email`, `uid`, `photoURL`) VALUES (?, ?, ?, ?)';
    const insertValues = [req.body.displayName, req.body.email, req.body.uid, req.body.photoURL];

    pool.query(insertQuery, insertValues, (insertError, insertData) => {
      if (insertError) {
        console.error('Database error (insert):', insertError);
        return res.status(500).json({ error: 'Database error (insert)' });
      }
      return res.status(200).send('You have successfully registered');
    });

  })
  
};