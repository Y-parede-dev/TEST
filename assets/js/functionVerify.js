const dataBase = require('../../BDD/dbConnect');

const requeteSQL=(requete)=>{
    dataBase.query(requete,
        function(err,result){
            if(err){
                console.log(err);
            return err.sqlMessage;
            };
    });
}; 
const verifInfoRequete = (userM, file, elt ,idCourant)=>{
    if(userM.prenom!= elt.prenom){
        const sqlRequete = `UPDATE users SET prenom = "${userM.prenom}" WHERE id = ${idCourant};`;
       requeteSQL(sqlRequete);
        if(userM.nom != elt.nom) {
            const sqlRequete = `UPDATE users SET nom = "${userM.nom}" WHERE id = ${idCourant};`;
            requeteSQL(sqlRequete);
            if(userM.adresse_email != elt.adresse_email){
                const sqlRequete = `UPDATE users SET adresse_email = "${userM.adresse_email}" WHERE id = ${idCourant};`;
                requeteSQL(sqlRequete);
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            }else{
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            };
        }else {
            if(userM.adresse_email != elt.adresse_email){
                const sqlRequete = `UPDATE users SET adresse_email = "${userM.adresse_email}"WHERE id = ${idCourant};`;
                requeteSQL(sqlRequete);
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            }else{
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            };
        };
    }else{
        if(userM.nom != elt.nom){
            const sqlRequete = `UPDATE users SET nom = "${userM.nom}" WHERE id = ${idCourant};`;
            requeteSQL(sqlRequete);
            if(userM.adresse_email != elt.adresse_email){
                const sqlRequete = `UPDATE users SET adresse_email = "${userM.adresse_email}"WHERE id = ${idCourant};`;
                requeteSQL(sqlRequete);
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            }else {
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            };
        }else{
            if(userM.adresse_email != elt.adresse_email){
                const sqlRequete = `UPDATE users SET adresse_email = "${userM.adresse_email}"WHERE id = ${idCourant};`;
                requeteSQL(sqlRequete);
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            }else{
                if(file && file.filename != elt.image_url){
                    const sqlRequete = `UPDATE users SET image_url = "${file.filename}"WHERE id = ${idCourant};`;
                    requeteSQL(sqlRequete);
                };
            };
        };
    };
};
module.exports = verifInfoRequete;