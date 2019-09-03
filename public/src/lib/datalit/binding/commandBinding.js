export class CommandBinding {
    constructor(name, hostPath, property) {
        this.name = name;
        this.path = hostPath;
        this.property = property;

        // console.log(`created binding with name ${name} and path ${JSON.stringify(hostPath)}.${property}`);
    }
}
