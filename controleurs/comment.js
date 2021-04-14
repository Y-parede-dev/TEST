const dataBase = require("../BDD/dbConnect");

exports.postComment = (req,res,next) => {
    const comment = req.body;
    const sqlRequete = `INSERT INTO comment(content, user_id, post_id)
                        VALUES("${comment.content}", ${comment.user_id}, ${comment.post_id});`;
    dataBase.query(sqlRequete, function(err, result){
        if(err){
            res.status(400).json({message:"probleme avec le post comment"});
            console.log(err);
            return;
        }else{
            res.status(200).json({message:"commentaire poster"});
            return;
        };
    });
};
exports.getComment = (req,res,next) => {
    const sqlRequete = `SELECT comment.content AS comment_content, comment.id AS comment_id,
     comment.post_id AS post_id_comment, users.id AS comment_user_id,users.nom AS comment_user,users.prenom AS comment_user_prenom,
      users.image_url AS avatar_user FROM comment JOIN users ON users.id = comment.user_id ORDER BY comment.id DESC;`;
    dataBase.query(sqlRequete, function(err, result){
        if(err){
            res.status(400).json({message:'PROBLEME AVEC LE GET'});
            console.log(err);
            return;
        }else{
            res.status(200).json({message:"Voici les commentaires", result});
            return;
        };
    });
};
exports.getCommentOnePost = (req,res,next) => {
    const sqlRequete = `SELECT comment.content AS comment_content, comment.id AS comment_id,
                    comment.post_id AS post_id_comment, users.id AS comment_user_id,
                    users.nom AS comment_user,users.prenom AS comment_user_prenom,
                    users.image_url AS avatar_user FROM users, comment
                    WHERE comment.post_id = ${req.params.id}
                    AND users.id = comment.user_id ORDER BY comment.id DESC;`;
    dataBase.query(sqlRequete, function(err, result){
        if(err){
            res.status(400).json({message:'PROBLEME AVEC LE GET'});
            console.log(err);
            return;
        }else{
            res.status(200).json({message:"Voici les commentaire de se post", result});
            return;
        };
    });
};
exports.modifyComment = (req,res,next)=>{
    const comment = req.body;
    const sqlRequeteUpp = `UPDATE comment SET content = "${comment.content}" WHERE id = ${comment.comment_id};`;
    dataBase.query(sqlRequeteUpp, function(err, result){
        if(err){
            console.log(err)
            res.status(400).json({message:"erreur Uppdate"});
            return;
        }else{
            res.status(200).json({message:"Uppdated Comment"});

        };
    });
};
exports.deleteComment = (req, res, next)=>{
    const comment = req.body;
    const sqlRequete = `DELETE FROM comment WHERE id = ${comment.comment_id};`;
    dataBase.query(sqlRequete,function(err,result){
        if(err){
            console.log(err);
        }else{
            res.status(200).json({message:'supression ok'});
        };
    });
};