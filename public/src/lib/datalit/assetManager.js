import configData from "../../../assets/assetConfig.js";
import imageMap from "../../../assets/imageMap.js";
import themeMap from "../../../assets/themeMap.js";

// Handles all assets for the application.
class AssetManager {
    constructor() {
        this._images = {};
        this._themes = {};
        this._imageDir = configData.imageDir;
        this._themeDir = configData.themeDir;

        for (let file of configData.imagePaths) {
            let key = file;
            if (file.search(".") != -1) key = file.split(".")[0];
            this._images[key] = new Image();
            this._images[key].src = "../" + configData.baseDir + "/" + configData.imageDir + "/" + file;
        }

        for (let file of configData.themePaths) {
            let key = file;
            if (file.search(".") != -1) key = file.split(".")[0];
            fetch(`http://localhost:9080/${configData.baseDir}/${configData.themeDir}/${file}`)
                .then(rsp => rsp.json())
                .then(rsp => {
                    if (rsp.isBase) this.BaseTheme = rsp;
                    this._themes[key] = rsp;
                });
        }

        // Public maps so intellisense is awesome
        this.Images = imageMap;
        this.Themes = themeMap;
    }

    getImage(name) {
        if (name.search(".") != -1) name = name.split(".")[0];

        if (!(name in this._images)) {
            throw new Error(`Image file ${name} not found in directory ${this._imageDir}`);
        }

        return this._images[name];
    }

    getTheme(name) {
        if (!(name in this._themes)) {
            throw new Error(`Theme ${name} not found in directory ${this._themeDir}`);
        }

        return this._themes[name];
    }
}

export const Assets = new AssetManager();
