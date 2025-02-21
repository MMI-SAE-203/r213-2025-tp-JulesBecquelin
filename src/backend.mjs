import PocketBase from 'pocketbase' ;
const pb = new PocketBase('http://127.0.0.1:8090') ;

export async function getOffres() {
    try {
        let data = await pb.collection('maison').getFullList({
            sort: '-created',
        });
        data = data.map((i) => {
            i.img= pb.files.getURL(i,i.images);
            return i;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des maisons', error);
    }
}

export async function getOffre(id) {
    try {
        let data = await pb.collection('maison').getOne(id);
        data.imageUrl = pb.files.getURL(data, data.image);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}
export async function getSurface(surface){
    const Surfacerecords = await pb.collection('maison').getFullList( { filter : `surface>${surface}` }) ;
    return Surfacerecords
};

export async function addOffre(house) {
    try {
        await pb.collection('maison').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function filterByPrix(prixMin, prixMax) {
    try {
        let data = await pb.collection('maison').getFullList({
            sort: '-created',
            filter: `prix >= ${prixMin} && prix <= ${prixMax}`
        });
        data = data.map((maison) => {
            maison.imageUrl = pb.files.getURL(maison, maison.image);
            return maison;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en filtrant la liste des maisons', error);
        return [];
    }
}



export async function allAgents(){
    const agentrecord = await pb.collection('agent').getFullList();
    return agentrecord;
}

export async function getAgent(id) {
    const agentrecord = await pb.collection('agent').getOne(id)
    return agentrecord
}

export async function allMaisonsByAgentId(id) {
    const sortedRecordsAgent = await pb.collection('maison').getFullList({
        filter: `relation.id='${id}'`,
        expand: 'relation'
    });
    return sortedRecordsAgent;
}