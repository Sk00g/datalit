(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var __id_counter = 0;

class Expense {
    constructor(initialValues = {}) {
        this.id = __id_counter++;

        this.amount = 0;
        this.date = new Date();
        this.note = "";
        // this.source_id = null;
        // this.tags = [];

        for (const [key, value] of Object.entries(initialValues)) if (this.hasOwnProperty(key)) this[key] = value;
    }

    /* Validates its own properties after applying the given list of updates
    :return -> A tuple with the validation result ([BOOL VALID], [LIST ERROR MESSAGES]) 
            An error message is an object of structure: { property: [STR], message: [STR] }
    */
    validate(propUpdates = {}) {
        let errorList = [];

        for (const [key, value] of Object.entries(this)) {
            let newValue = propUpdates.hasOwnProperty(key) ? propUpdates[key] : value;

            switch (key) {
                case "amount":
                    if (typeof newValue !== "number")
                        errorList.push({ property: key, message: `'amount' must be a number` });
                    else if (newValue <= 0)
                        errorList.push({ property: key, message: `'amount' must be greater than 0` });
                    break;
                case "note":
                    if (typeof newValue !== "string")
                        errorList.push({ property: key, message: `'note' must be a string` });
                    else if (newValue.length > 256)
                        errorList.push({ property: key, message: `'note' must be less than 256 characters` });
                    var date = new Date();

                    break;
                case "date":
                    if (typeof newValue !== "object" || newValue.constructor.name !== "Date")
                        errorList.push({ property: key, message: `'date' must be a Date object` });
                    else if (newValue - new Date() > 0)
                        errorList.push({ property: key, message: `'date' must not be in the future` });
                    break;
            }
        }

        return { valid: errorList.length == 0, errors: errorList };
    }
}

module.exports = Expense;

},{}]},{},[1]);
