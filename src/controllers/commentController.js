import { ObjectId } from "mongodb";
import dataBase from "../dataBase.js";

const create = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Token não encontrado");
    const { ep_id } = req.headers;
    if(!ep_id) return res.status(422).send("Id não encontrado");

    const token = auth.replace('Baerer ', '');
    const { text } = req.body;
    let logged;

    try {
        logged = await dataBase.collection("sessions").findOne({token: token});
        if(!logged) return res.status(401).send("Usuário não logado.");
        const ep = await dataBase.collection("episodes").findOne({_id: new ObjectId(ep_id)});
        if(!ep) return res.status(404).send("Episódio não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }

    try{
        const user = await dataBase.collection("members").findOne({_id: logged.userId});
        if(!user) return res.status(404).send("Usuário não encontrado");
        await dataBase.collection("comments").insertOne({
                                                            Ep_id: ep_id, 
                                                            Name: user.name, 
                                                            Comment: text
                                                        });
        return res.sendStatus(201);
    }catch(error){
        return res.status(500).send(error)
    }
}

const readOne = async (req, res) => {
    const { id } = req.headers;
    if(!id) return res.status(422).send("Não foi possível processar sua requisição");

    try {
        const comment = await dataBase.collection("comments").findOne({_id: new ObjectId(id)});
        if(!comment) return res.status(404).send("Comentário não encontrado");
        return res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const readAll = async (req, res) => {
    const { ep_id } = req.headers;
    if(!ep_id) return res.status(422).send("Não foi possível processar sua requisição");

    try {
        const comments = await dataBase.collection("comments").find({Ep_id: ep_id}).toArray();
        if(!comments) return res.status(404).send("Comentário não encontrado");
        return res.status(200).send(comments);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const update = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Token não encontrado");
    const { id } = req.headers;
    if(!id) return res.status(422).send("Id não encontrado");

    const token = auth.replace('Baerer ', '');
    const { text } = req.body;
    let logged;

    try {
        logged = await dataBase.collection("sessions").findOne({token: token});
        if(!logged) return res.status(401).send("Usuário não logado.");
        const comment = await dataBase.collection("comments").findOne({_id: new ObjectId(id)});
        if(!comment) return res.status(404).send("Comentário não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }

    try{
        const user = await dataBase.collection("members").findOne({_id: logged.userId});
        if(!user) return res.status(404).send("Usuário não encontrado");
        await dataBase.collection("comments").updateOne({_id: new ObjectId(id)}, {$set: {Comment: text}});
        return res.status(202).send("Comentário atualizado.");
    }catch(error){
        return res.status(500).send(error)
    }
}

const remove = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    const { id } = req.headers;
    try {
        const admin = await dataBase.collection("adminsessions").findOne({token});
        const user = await dataBase.collection("sessions").findOne({token});
        if(!admin && !user) return res.status(401).send("Não autorizado");
        const verify = await dataBase.collection("comments").findOne({_id: new ObjectId(id)});
        if(!verify) return res.status(404).send("Comentário não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }
    
    try {
        await dataBase.collection("comments").deleteOne({_id: new ObjectId(id)});
        return res.status(202).send("Comentário deletado");
    } catch (error) {
        return res.status(500).send(error);
    }
}

export {create, readOne, readAll, update, remove}