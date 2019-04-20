class Person {
    constructor() {
        console.log("made person");
    }
}

class Teacher extends Person {
    constructor() {
        super();
        console.log("who is a teacher");
    }
}

scott = new Person();
katie = new Teacher();

console.log(scott instanceof Person);
console.log(scott instanceof Teacher);
console.log(katie instanceof Person);
console.log(katie instanceof Teacher);
