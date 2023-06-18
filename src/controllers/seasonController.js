import dataBase from "../dataBase.js";
import { ObjectId } from "mongodb";

const createSeason = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }
    const {anime, n_Season, season_name} = req.body;
    let { season_cover } = req.body;

    try {
        const animeTest = await dataBase.collection("animes").findOne({Name: anime});
        if(!animeTest) return res.status(422).send("Anime não encontrado");

        if(season_cover === "Inherit") season_cover = animeTest.Cover;
        // console.log(season_cover);
    
        const season = await dataBase.collection("seasons").findOne({$and: [{Anime: anime}, {Name: season_name}, {Season: n_Season}]});
        if(season) return res.status(409).send("Temporada já cadastrada.");

        await dataBase.collection("seasons").insertOne({Anime: anime, Season: n_Season, Cover: season_cover, Name: season_name});
        return res.status(201).send("Temporada adicionada");
    }catch(error){
        return res.status(500).send(error);
    }
}

const readSeasons = async (req, res) => {
    const {name, season} = req.params;
    if(!name || !season) return res.status(404).send("Não encontrado");
    // console.log(req.params);

    try {
        const seasonInfo = await dataBase.collection("seasons").findOne({$and: [{Anime: name}, {Name: season}]});
        const episodesList = await dataBase.collection("episodes").find({$and: [{Anime: name}, {Season: season}]}).toArray();

        const busca = {Season: seasonInfo, Episodes: episodesList};
        return res.status(200).send(busca)
    } catch (error) {
        return res.status(500).send(error);
    }
}

const readSeason = async (req, res) =>{
    const {season} = req.params;
    if(!season) return res.status(404).send("Não encontrado");

    try {
        const seasonInfo = await dataBase.collection("seasons").findOne({Name: season});

        const busca = {Season: seasonInfo, Episodes: episodesList};
        return res.status(200).send(busca)
    } catch (error) {
        return res.status(500).send(error);
    }
}

const updateSeason = async (req, res) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(422).send("Não autorizado.");
    const token = auth.replace('Baerer ', '');
    try {
        const verify = await dataBase.collection("adminsessions").findOne({token: token});
        if(!verify) return res.status(401).send("Você não tem permissão de administrador");
    } catch (error) {
        return res.status(500).send(error);
    }

    const {anime, n_Season, season_cover, season_name} = req.body;
    const { id } = req.headers;
    if(!id) return res.status(422).send("Id não encontrado");

    try {
        const test = await dataBase.collection("animes").findOne({Name: anime});
        if(!test) return res.status(404).send("Anime não encontrado");
    } catch (error) {
        return res.status(500).send(error);
    }

    try{
        const season = await dataBase.collection("seasons").findOne({_id: new ObjectId(id)});
        if(!season) return res.status(404).send("Temporada não encontrada");
        
        await dataBase.collection("seasons").updateOne({_id: new ObjectId(id)}, {$set: {Anime: anime, Season: n_Season, Cover: season_cover, Name: season_name}});
        await dataBase.collection("episodes").updateMany({Season: season.Name}, {$set: {Season: season_name}});
        return res.status(201).send("Temporada atualizada");
    }catch(error){
        return res.status(500).send(error);
    }
}

const deleteSeason = async (req, res) => {
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
        const season = await dataBase.collection("seasons").findOne({_id: new ObjectId(id)});
        if(!season){
            return res.status(404).send("Temporada não encontrada");
        }else{
            await dataBase.collection("episodes").deleteMany({Season: season.Name})
            await dataBase.collection("seasons").deleteOne({_id: new ObjectId(id)});
            return res.status(202).send("Temporada deletada");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}


export {
    createSeason, 
    readSeasons,
    readSeason,
    updateSeason,
    deleteSeason
}