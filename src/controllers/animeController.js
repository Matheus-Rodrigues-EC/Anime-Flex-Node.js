import dataBase from "../dataBase.js";
import { ObjectId } from "mongodb";

const addAnime = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }
    const {cover, name} = req.body;

    try{
        const anime = await dataBase.collection("animes").findOne({Name: name});
        if(anime) return res.status(409).send("Anime já cadastrado.");

        await dataBase.collection("animes").insertOne({Cover: cover, Name: name});
        return res.status(201).send("Anime cadastrado");
    }catch(error){
        return res.status(500).send(error);
    }

}

const updateAnime = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }
    const {id, cover, name} = req.body;
    try{
        const anime = await dataBase.collection("animes").findOne(new ObjectId(id));
        if(anime){
            await dataBase.collection("animes").updateOne({_id: new ObjectId(id)}, {$set: {Cover: cover, Name: name}})
            return res.status(202).send("Anime atualizado");
        }else{
            return res.status(404).send("Anime não encontrado");
        }
    }catch(error){
        return res.status(500).send(error);
    }
}

const removeAnime = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }
    const { id } = req.headers;
    if(!id) return res.status(422).send("Id não encontrado")

    try{
        const anime = await dataBase.collection("animes").findOne({_id: new ObjectId(id)});
        if(!anime) {
            return res.status(404).send("Anime não encontrado.");
        }else{
            await dataBase.collection("episodes").deleteMany({Anime: anime.Name});
            await dataBase.collection("seasons").deleteMany({Anime: anime.Name});
            await dataBase.collection("animes").deleteOne({_id: new ObjectId(id)});
            return res.status(202).send("Anime Deletado");
        }
    }catch(error){
        return res.status(500).send(error);
    }
}


export {
    addAnime, 
    removeAnime, 
    updateAnime
}