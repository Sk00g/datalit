const ERROR_LIST = {
    propertySet: "Set property '$0': '$1' is invalid, expecting '$2'",
    propertyNotFound: "'$0' property not found: '$1'",
    arrangeAuthority: "Arrange authority breach: '$0' is not a Section or Page"
};

export function datalitError(name, params) {
    let message = ERROR_LIST[name];
    for (let i = 0; i < params.length; i++) {
        message = message.replace("$" + i, params[i]);
    }
    throw new Error(message);
}
