export function extractPers () {
    //todo implement
    const pers = {
        version: "0.0.1",
        data: {}
    };
    return pers;
}

export function applyPers (pers) {
    //todo implement
    return pers;
}

export function savePers (pers) {
    localStorage.setItem("personalization_team-bookmarks", JSON.stringify(pers));
}

export function getPers () {
    return JSON.parse(localStorage.getItem("personalization_team"));
}
