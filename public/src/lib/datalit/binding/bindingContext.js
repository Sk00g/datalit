import utils from "../utils";
import { DataBinding } from "./dataBinding";

export class BindingContext {
    constructor(host, commandDefinitions = {}, dataProviders = {}) {
        this._host = host;
        this._commands = commandDefinitions;
        this._commandBindings = [];
        this._dataBindingMetadatas = [];

        this._dataProviders = dataProviders;
        this._dataBindings = [];
    }

    addCommandBindings(bindings) {
        this._commandBindings = this._commandBindings.concat(bindings);
    }

    addDataBindingMetadatas(metadata) {
        this._dataBindingMetadatas = this._dataBindingMetadatas.concat(metadata);
    }

    initializeBindings() {
        // Prepare command bindings based on the provided command definitions
        for (let bind of this._commandBindings) {
            let nameMatch = Object.keys(this._commands).find(key => key === bind.name);
            if (!nameMatch) {
                console.log(`no match found for binding: ${bind.name}`);
                continue;
            }

            // console.log(
            //     `successful match for ${nameMatch} of path ${bind.path}.${bind.property} to definition ${this._commands[nameMatch]}`
            // );
            let targetControl = utils.getDescendentProperty(this._host, bind.path);
            targetControl[bind.property] = this._commands[nameMatch];
        }

        // Take markup generated binding metadata and create binding objects
        for (let bind of this._dataBindingMetadatas) {
            let sourceKey = bind.dataPath.split(":")[0];
            let sourcePath = bind.dataPath.split(":")[1];
            let keyMatch = Object.keys(this._dataProviders).find(key => key === sourceKey);

            if (!keyMatch || !this._dataProviders[keyMatch].hasEndpoint(sourcePath)) {
                console.log(
                    `no match found for data binding ${bind.controlPath}.${bind.controlProperty} -> ${bind.dataPath}`
                );
                continue;
            }

            let sourceMatch = this._dataProviders[keyMatch];

            let targetControl = utils.getDescendentProperty(this._host, bind.controlPath);
            if (!targetControl || targetControl[bind.controlProperty] === undefined) {
                console.log(`no match found for control ${targetControl.debugName}.${bind.controlProperty}`);
                continue;
            }

            let sourceType = sourceMatch.getEndpointType(sourcePath);
            this._dataBindings.push(
                new DataBinding(targetControl, bind.controlProperty, sourceMatch, sourcePath, sourceType)
            );

            console.log(
                `successful match for binding ${targetControl.debugName}.${bind.controlProperty} to ${sourceMatch.title}->${sourcePath} (${sourceType})`
            );
        }
    }
}
