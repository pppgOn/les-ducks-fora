export const api_path = 'https://choucroutedoree.nuit-info.ofni.asso.fr/api'

export const getThemeList = async () => {
    let response = await fetch(api_path+'/quizz/themelist').then((val) => val);
    let data = null
    if(response.status == 200){
        data = response.json().value;
    }
    return data;
    
}