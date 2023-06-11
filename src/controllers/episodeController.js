import dataBase from "../dataBase.js";
import { ObjectId } from "mongodb";

const createEpisode = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }
    const  {anime, season_name, episode_name, episode_number, episode_cover, url} = req.body;

    try {
        const season = await dataBase.collection("seasons").findOne({Name: season_name});
        if(!season) return res.status(422).send("Temporada não encontrada");
    } catch (error) {
        return res.status(500).send(error);
    }

    try{
        const episode = await dataBase.collection("episodes").findOne({$and: [{Anime: anime}, {Season: season_name}, {Number: episode_number}]});
        if(episode) return res.status(409).send("Episódio já cadastrado");

        await dataBase.collection("episodes").insertOne({
                                                            Anime: anime,
                                                            Season: season_name,
                                                            Name: episode_name, 
                                                            Number: episode_number,
                                                            Cover: episode_cover,
                                                            URL: url
                                                        })
        return res.status(201).send("Episódio adicionado.");
    }catch(error){
        return res.status(500).send(error);
    }
}

const readEpisode = async (req, res) => {
    const {anime, season, episode} = req.params;
    if(!anime || !season || !episode) return res.status(404).send("Não encontrado");

    try {
        const episodeInfo = await dataBase.collection("episodes").findOne({$and: [{Anime: anime}, {Season: season}, {Name: episode}]});
        if(!episodeInfo) return res.status(404).send("Episódio não encontrado");
        return res.status(200).send(episodeInfo);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const updateEpisode = async (req, res) => {
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
    if(!id) return res.status(422).send("Id não encontrado");
    const  {season_name, episode_name, episode_number, episode_cover, url} = req.body;

    try {
        const season = await dataBase.collection("seasons").findOne({Name: season_name});
        if(!season) return res.status(404).send("Temporada não encontrada");
        const epid = await dataBase.collection("episodes").findOne({_id: new ObjectId(id)});
        if(!epid) return res.status(404).send("Episódio não encontrado");
        const ep = await dataBase.collection("episodes").find({Name: episode_name}).toArray();
        if(ep.length > 1) return res.status(409).send("Episódio já cadastrado");

        await dataBase.collection("episodes").updateOne({_id: new ObjectId(id)}, {$set: {
                                                                                    Season: season_name,
                                                                                    Name: episode_name, 
                                                                                    Number: episode_number,
                                                                                    Cover: episode_cover,
                                                                                    URL: url
                                                                                }});

        return res.status(202).send("Episódio atualizado")
    } catch (error) {
        return res.status(500).send(error)
    }
}

const deleteEpisode = async (req, res) => {
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
    if(!id) return res.status(422).send("Id não encontrado");
    try {
        const ep = await dataBase.collection("episodes").findOne({_id: new ObjectId(id)});
        if(!ep) return res.status(404).send("Episódio não encontrado");

        await dataBase.collection("episodes").deleteOne({_id: new ObjectId(id)});
        return res.status(202).send("Episódio deletado.");
    } catch (error) {
        return res.status(500).send(error);
    }
}

export {
    createEpisode,
    readEpisode,
    updateEpisode,
    deleteEpisode
}