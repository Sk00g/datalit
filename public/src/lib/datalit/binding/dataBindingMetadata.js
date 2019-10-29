export class DataBindingMetadata {
    constructor(controlPath, controlProperty, dataPath) {
        // Metadata fields declared in markup
        this.controlPath = controlPath;
        this.controlProperty = controlProperty;
        this.dataPath = dataPath;

        console.log(
            `parsed data binding MD on ${JSON.stringify(controlPath)}.${controlProperty} | DATA SOURCE ${dataPath}`
        );
    }
}
