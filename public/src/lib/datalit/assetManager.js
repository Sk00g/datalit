import configData from "../../../assets/assetConfig.js";
import imageMap from "../../../assets/imageMap.js";
import themeMap from "../../../assets/themeMap.js";
import markupMap from "../../../assets/markupMap.js";
import enums from "./enums.js";
import utils from "./utils.js";

// Handles all assets for the application.
class AssetManager {
    constructor() {
        this._images = {};
        this._themes = {};
        this._markups = {};
        this._imageDir = configData.imageDir;
        this._themeDir = configData.themeDir;
        this._markupDir = configData.markupDir;

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
                    rsp = this.parseThemeData(rsp);
                    if (rsp.isBase) this.BaseTheme = rsp;
                    this._themes[key] = rsp;
                });
        }

        for (let file of configData.markupPaths) {
            let key = file;
            if (file.search(".") != -1) key = file.split(".")[0];
            fetch(`http://localhost:9080/${configData.baseDir}/${configData.markupDir}/${file}`)
                .then(rsp => rsp.json())
                .then(rsp => {
                    rsp = this.parseMarkupData(rsp);
                    this._markups[key] = rsp;
                });
        }

        // Public maps so intellisense is awesome
        this.Images = imageMap;
        this.Themes = themeMap;
        this.Markups = markupMap;
    }

    parseThemeData(themeObj) {
        let jsonString = JSON.stringify(themeObj);

        jsonString = jsonString.replace(/\$[^"]{1,}/g, (str, offset, input) => {
            // console.log(`str: ${str} | offset: ${offset}`);
            // console.log(`Tokens: ${JSON.stringify(tokens)}`);
            // console.log(`Replace value: ${resolveObjectPath(tokens, themeObj)}`);
            let tokens = str.substr(1, str.length).split(".");
            return utils.resolveObjectPath(tokens, themeObj);
        });

        return JSON.parse(jsonString);
    }

    parseMarkupData(markupObj) {
        let jsonString = JSON.stringify(markupObj);

        /* $[CHAR]= -> represents replacement with existing value
            e - Enum from enums.js
            t - Template value, similar to theme data
        */
        jsonString = jsonString.replace(/\$[et]=[^"]{1,}/g, (str, offset, input) => {
            let tokens = str.substr(3, str.length - 3).split(".");
            return enums[tokens[0]][tokens[1]];
        });

        return JSON.parse(jsonString);
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

    getMarkup(name) {
        if (!(name in this._markups)) {
            throw new Error(`Theme ${name} not found in directory ${this._markupDir}`);
        }

        return this._markups[name];
    }
}

export const Assets = new AssetManager();
