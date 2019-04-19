import configData from "../../../assets/assetConfig.js";

// Handles all assets for the application.
class AssetManager {
    constructor() {
        this._images = {};
        this._imageDir = configData.imageDir;

        for (let file of configData.imagePaths) {
            let key = file;
            if (file.search(".") != -1) key = file.split(".")[0];
            this._images[key] = new Image();
            this._images[key].src = "../" + configData.baseDir + "/" + configData.imageDir + "/" + file;
        }
    }

    getImage(name) {
        if (name.search(".") != -1) name = name.split(".")[0];

        if (!(name in this._images)) {
            throw new Error(`Image file ${name} not found in directory ${this._imageDir}`);
        }

        return this._images[name];
    }

    // getData(name) {
    //     if (!(name in this._dataFiles)) {
    //         throw new Error(`Data file ${name} not found in directory ${this._dataDir}`);
    //     }

    //     return fetch(
    //         "http://localhost:9080/public/" + configData.baseDir + "/" + configData.dataDir + "/" + name
    //     ).then(rsp => {
    //         return rsp.json();
    //     }).then();

    //     return JSON.parse(this._dataFiles[name]);
    // }
}

export const Assets = new AssetManager();
