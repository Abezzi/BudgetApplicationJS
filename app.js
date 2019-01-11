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
        addItem: function(type, des, val) {
            var newItem, ID;

            //ID will be the last id + 1. [1 4 9 15] ID = 16
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0
            }

            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
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
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
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

        addListItem: function(obj, type){
            var html, newHtml, element;
            //console.log("entered add lsiti tem funcition");
            //create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArray;
            //return a list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            //use the slice method of the array into the list and transform the result into an array aswell
            fieldsArray = Array.prototype.slice.call(fields);
            //go through all the elements (description and value) and set the field to empty
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
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
        UICtrl.addListItem(newItem, input.type);

        //clear fields
        UICtrl.clearFields();

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
