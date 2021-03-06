var budgetController = (function(){
    //expense and income are object contructors
    var Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += parseInt(cur.value);
        });
        data.totals[type] = sum;
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
        },
        budget: {
            budget: 0,
            percentage: -1
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

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                //remove a number at the number index, and the amount is the second param
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            //calulate the total
           calculateTotal('inc');
           calculateTotal('exp');

            //calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calcualte the percent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(curr) {
                return curr.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        ExpensesPercentagesLabel: '.item__percentage',
        budgetDateLabel: '.budget__title--month'
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
                html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorId) {
            var element;
            element = document.getElementById(selectorId);

            element.parentNode.removeChild(element);
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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

        //the param is an array
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.ExpensesPercentagesLabel);

            var nodeListForEach = function(list, callback){
                for(var i = 0 ; i < list.length ; i++){
                    callback(list[i], i);
                }
            }

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayDate: function() {
            var now, year, month, months;

            now = new Date(); // if you dont pass parameters it returns the date of today

            month = now.getMonth();
            year = now.getFullYear();
            months = ['January','Febreruary','March','April','May', 'June', 'July','Agost','September','August', 'November', 'December'];

            document.querySelector(DOMstrings.budgetDateLabel).textContent = months[month] + ' ' + year;
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }

    var updateBudget = function() {
        //calculate budget
        budgetCtrl.calculateBudget();

        //return the total budget.
        var budget = budgetCtrl.getBudget();

        //display the budget in the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        //calculate percentages.
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();

        //console.log(percentages);
        //read percentages from the budget.

        //update the ui.
        UICtrl.displayPercentages(percentages);
    };

    //this function is call when you press enter or click in the button next to the input fields.
    var ctrlAddItem = function() {
        var input, newItem;

        //1 get input field data
        input = UICtrl.getInput();

        //check if have data in the fields after entering more
        if(input.description != "" && !isNaN(input.value) && input.value > 0) {
            //2 add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3 add item to the ui
            UICtrl.addListItem(newItem, input.type);

            //clear fields
            UICtrl.clearFields();

            //calcualte and update budget
            updateBudget();

            //update percentages.
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, id;

        itemId = event.target.parentNode.parentNode.parentNode.id;

        if(itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            //delete teh item from the data strcture
            budgetCtrl.deleteItem(type, id);
            //delete from the user interface
            UICtrl.deleteListItem(itemId);
            //update and change the budget value

            updateBudget();
            updatePercentages();
        }
    };

    return {
        init: function(){
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListener();
        }
    }

})(budgetController, UIController);

//Initialize the controller
controller.init();
