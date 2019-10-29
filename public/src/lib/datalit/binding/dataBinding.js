import { BindingState, BindingType } from "../enums.js";
import { Events } from "../events/events.js";

export class DataBinding {
    constructor(control, property, dataProvider, dataPath, type = BindingType.READ_ONLY) {
        this._state = BindingState.INACTIVE;

        this._type = type;
        this._control = control;
        this._property = property;
        this._dataProvider = dataProvider;
        this._dataPath = dataPath;

        // Subscribe to data provider updates
        Events.register(this._dataProvider, "dataUpdated", (event, data) => this.handleProviderUpdate(event, data));

        // Subscribe to control propertyChanged updates
        Events.register(this._control, "propertyChanged", (event, data) => this.handlePropertyUpdate(event, data));

        this._dataProvider.initializeEndpoint(dataPath);
    }

    handleProviderUpdate(event, data) {
        console.log(`Handle data update from ${this._dataProvider.title}.${this._dataPath}`);

        this._control[this._property] = data.value;
    }

    handlePropertyUpdate(event, data) {
        if (data.property === this._property) {
            console.log(`Handle property update from ${this._control.debugName}.${this._property}`);
        }
    }
}
