const ERROR_LIST = {
    propertySet: "Set property '$0': '$1' is invalid, expecting '$2'",
    propertyNotFound: "'$0' property not found: '$1'",
    arrangeAuthority: "Arrange authority breach: '$0' is not a Section or Page",
    objectInterfaceMismatch: "Object '$0' doesn't match appropriate interface with properties: '$1'",
    notYetImplemented: "This feature is not yet implemented",
    typeMismatch: "Type '$0' is invalid for parameter '$1', expecting '$2'",
    illogical: "Property '$0' cannot be '$1' while property '$2' is '$3'"
};

export function datalitError(name, params) {
    let message = ERROR_LIST[name];
    for (let i = 0; i < params.length; i++) {
        message = message.replace("$" + i, params[i]);
    }
    throw new Error(message);
}
