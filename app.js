var budgetController = (function(){
    //expense and income are object contructors
    var Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value;
    };

    //data structure to have all the data
    var data = {
        //store instances of the objects Expenses and Income
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    //expose the variables to the rest of the controllers
    return {
        addItem: function(type, desc, val) {
            var newItem, ID;

            //ID will be the last id + 1. [1 4 9 15] ID = 16
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0
            }

            if(type === 'exp') {
                newItem = new Expense(ID, desc, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, desc, val);
            }

            data.allItems[type].push(newItem);
        },

        testing: function(){
            console.log(data);
        }
    }

})();

var UIController = (function(){
    //private object
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    //public method
    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp, dropdown menu
                description: document.querySelector(DOMstrings.inputDescription).value, //text field
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

var controller = (function(budgetCtrl, UICtrl){

    var setupEventListener = function(){
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function() {
        var input, newItem;

        //1 get input field data
        input = UICtrl.getInput();
        //2 add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3 add item to the ui

        //4 calculate budget

        //5 display budget on the ui
    }

    return {
        init: function(){
            setupEventListener();
        }
    }

})(budgetController, UIController);

//Initialize the controller
controller.init();
