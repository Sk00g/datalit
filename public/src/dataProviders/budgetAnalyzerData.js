import { DataProviderBase } from "../lib/datalit/binding/dataProviderBase.js";
import { BindingType } from "../lib/datalit/enums.js";
import { stringify } from "querystring";

export class BudgetAnalyzerData extends DataProviderBase {
    constructor() {
        super("budgetAnalyzerDataProvider");

        this.total = 315;
    }

    hasEndpoint(key) {
        console.log(`checking endpoint ${key} in ${this.title}`);

        return key === "totalExpenseCount";
    }

    getEndpointType(key) {
        console.log(`checking endpoint ${key} type in ${this.title}`);

        if (key === "totalExpenseCount") return BindingType.READ_ONLY;
    }

    initializeEndpoint(key) {
        if (key === "totalExpenseCount") {
            this.dispatchEvent("dataUpdated", { value: `${this.total}` });
        }
    }
}

//             http://api.openweathermap.org/data/2.5/weather?id=5931800&APPID=4cb795818fcbf849f23882cc0947031b
