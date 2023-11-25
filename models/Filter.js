const FilterOperator = Object.freeze({
    Equals: Symbol('='),
    LessThan: Symbol('<'),
    GreaterThan: Symbol('>'),
    LessThanOrEqual: Symbol('<='),
    GreaterThanOrEqual: Symbol('>='),
    Truthy: Symbol('?'),
    
    resolveOperator(symbol) {
        switch (symbol) {
            case '<=':
                return FilterOperator.LessThanOrEqual;
            case '>=':
                return FilterOperator.GreaterThanOrEqual;
        }
        
        switch (symbol.substring(0, 1)) {
            case '=':
                return FilterOperator.Equals;
            case '<':
                return FilterOperator.LessThan;
            case '>':
                return FilterOperator.GreaterThan;
            case '?':
                return FilterOperator.Truthy;
        }
        
        return null;
    }
});

class Filter {
    constructor(terms) {
        this.term = '';
        this.field = '*';
        this.operator = null;
        this.filteredCount = 0;
        
        if (terms.length > 0 &&
            terms.charAt(0) === '{' &&
            terms.charAt(terms.length - 1) === '}') {
            terms = terms.substring(1, terms.length - 1);
            const colonIndex = terms.indexOf(':');
            if (colonIndex > -1) {
                this.field = terms.substring(0, colonIndex);
                this.operator = FilterOperator.resolveOperator(terms.substring(colonIndex + 1, colonIndex + 3));
                if (this.operator === FilterOperator.LessThanOrEqual ||
                    this.operator === FilterOperator.GreaterThanOrEqual) {
                    this.term = terms.substring(colonIndex + 3, terms.length);
                } else {
                    this.term = terms.substring(colonIndex + 2, terms.length);
                }
            } else {
                // TODO
            }
        } else {
            this.term = terms;
        }
    }
    
    matchFilter(inst) {
        if (inst === null || inst === undefined) {
            console.warn('Trying to match filter against null object');
            return false;
        }
        
        function stringIncludes(o1, o2) {
            return o1.toString().toLowerCase()
                .includes(o2.toString().toLowerCase());
        }
        
        if (this.field === '*') {
            for (const [key, val] of Object.entries(inst)) {
                if (stringIncludes(val, this.term)) {
                    return true;
                }
            }
            
            return false;
        }
        
        if (inst.hasOwnProperty(this.field)) {
            if (this.operator === null) {
                return stringIncludes(inst[this.field], this.term);
            } else {
                switch (this.operator) {
                    case FilterOperator.Equals:
                        return stringIncludes(inst[this.field], this.term);
                    case FilterOperator.LessThan:
                        return +inst[this.field] < +this.term;
                    case FilterOperator.GreaterThan:
                        return +inst[this.field] > +this.term;
                    case FilterOperator.LessThanOrEqual:
                        return +inst[this.field] <= +this.term;
                    case FilterOperator.GreaterThanOrEqual:
                        return +inst[this.field] >= +this.term;
                    case FilterOperator.Truthy:
                        return Boolean(inst[this.field]);
                    default:
                        return false;
                }
            }
        } else {
            console.warn('Trying to match filter to object with no field: ' + this.field);
        }
        
        return false;
    }
    
    toString() {
        if (this.operator === null) {
            return this.term;
        } else {
            return `{${this.field}:${this.operator.description}${this.term}}`;
        }
    }
}

export {FilterOperator, Filter}