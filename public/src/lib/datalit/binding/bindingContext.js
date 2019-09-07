import utils from "../utils";

export class BindingContext {
    constructor(host, commandDefinitions = {}) {
        this._host = host;
        this._commands = commandDefinitions;
        this._commandBindings = [];
    }

    addCommandBindings(bindings) {
        this._commandBindings = this._commandBindings.concat(bindings);
    }

    initializeBindings() {
        for (let bind of this._commandBindings) {
            let nameMatch = Object.keys(this._commands).find(key => key === bind.name);
            if (!nameMatch) {
                console.log(`no match found for binding: ${bind.name}`);
                continue;
            }

            console.log(
                `successful match for ${nameMatch} of path ${bind.path}.${bind.property} to definition ${this._commands[nameMatch]}`
            );
            let targetControl = utils.getDescendentProperty(this._host, bind.path);
            targetControl[bind.property] = this._commands[nameMatch];
        }
    }
}
