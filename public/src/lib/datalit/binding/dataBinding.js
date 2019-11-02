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

        // Rapid flag toggles to prevent cyclic event raising
        this._dataDrivenEvent = false;

        // Subscribe to data provider updates
        if (this._type == BindingType.READ_ONLY || this._type == BindingType.TWO_WAY)
            Events.register(this._dataProvider, "dataUpdated", (event, data) => this.handleProviderUpdate(event, data));

        // Subscribe to control propertyChanged updates
        if (this._type == BindingType.WRITE_ONLY || this._type == BindingType.TWO_WAY)
            Events.register(this._control, "propertyChanged", (event, data) => this.handlePropertyUpdate(event, data));

        this._dataProvider.initializeEndpoint(dataPath);
    }

    handleProviderUpdate(event, data) {
        if (data.endpoint === this._dataPath) {
            console.log(`Handle data update from ${this._dataProvider.title}.${this._dataPath}`);

            this._dataDrivenEvent = true;
            this._control[this._property] = data.newValue;

            // In case there is no change and propertyChanged event is not fired
            this._dataDrivenEvent = false;
        }
    }

    handlePropertyUpdate(event, data) {
        if (data.property === this._property) {
            if (this._dataDrivenEvent) {
                this._dataDrivenEvent = false;
                return;
            }

            console.log(`Handle property update from ${this._control.debugName}.${this._property} -> ${data.newValue}`);

            
        }
    }
}
