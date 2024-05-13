class FormCreator {
    type: FormField = "input";

    constructor(type: FormField) {
        this.type = type;
    }
}

type FormField = "input" | "list" | "checkbox";

interface FormCreator {
    type: FormField;
    setter: () => {};
    
}
