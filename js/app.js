class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  submitBudgetForm() {
    if (!this.validateNumberInput(this.budgetInput.value)) {
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p>Value cannot be empty or negative.</p>`;
      setTimeout(() => {
        this.budgetFeedback.classList.remove('showItem');
      }, 4000)
      return;
    }
    this.storeBudget(this.budgetInput.value);
    this.showBudget();
    this.budgetInput.value = '';
  }

  validateNumberInput(numberValue) {
    return (!isNaN(numberValue) && numberValue > 0);
  }

  validateFormInput(textValue) {
    return (textValue !== '' && typeof textValue === 'string');
  }

  showBudget() {
    this.budgetAmount.innerHTML = parseFloat(this.budgetAmount.textContent) + parseFloat(this.budgetInput.value);
    this.showBalance();
  }

  storeBudget(income) {
    let currentBudget = this.getTotalBudget() ?? 0;
    currentBudget = parseFloat(currentBudget) + parseFloat(income);
    localStorage.setItem('budget', JSON.stringify(currentBudget));
  }

  getTotalBudget() {
    return JSON.parse(localStorage.getItem('budget')) ?? 0;
  }

  getTotalExpense() {
    let sum;
    sum = this.itemList.reduce((acc, curr) => {
      acc = acc - curr.amount;
      return acc;
    }, 0)
    return sum;
  }

  storeExpenseList() {
    localStorage.setItem('expensesList', JSON.stringify(this.itemList));
  }

  storeExpense(expense) {
    let itemList = this.getExpensesList();
    itemList.push(expense);
    localStorage.setItem('expensesList', JSON.stringify(itemList));
  }

  showBalance() {
    this.balanceAmount.textContent = parseFloat(this.getTotalBudget()) + parseFloat(this.getTotalExpense());
    this.budgetAmount.textContent = parseFloat(this.getTotalBudget());
    if (this.balanceAmount.textContent < 0) {
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    } else if (this.balanceAmount.textContent > 0) {
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    } else {
      this.balance.classList.remove('showRed', 'showGreen');
      this.balance.classList.add('showBlack');
    }
  }

  getExpensesList() {
    this.itemList = JSON.parse(localStorage.getItem('expensesList')) ?? [];
    return this.itemList;
  }


  renderExpenseList() {
    this.itemList = this.getExpensesList();
    let child = '';
    let totalExpensesAmount = 0;
    this.expenseList.innerHTML = `<div class="expense-list__info d-flex justify-content-between text-capitalize">
        <h5 class="list-item">expense title</h5>
        <h5 class="list-item">expense value</h5>
        <h5 class="list-item"></h5>
       </div>`;
    for (const expensesKey of this.itemList) {
      totalExpensesAmount = parseFloat(totalExpensesAmount) + parseFloat(expensesKey.amount);
      child += `<div><div class="expense-item d-flex justify-content-between align-items-baseline">

     <h6 class="expense-title mb-0 text-uppercase list-item">${expensesKey.text}</h6>
     <h5 class="expense-amount mb-0 list-item">- $ ${expensesKey.amount}</h5>

     <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${expensesKey.id}">
     <i class="fas fa-edit" data-id="${expensesKey.id}"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${expensesKey.id}">
     <i class="fas fa-trash" data-id="${expensesKey.id}"></i>
     </a>
     </div>
     </div>
</div>`;
    }
    this.expenseAmount.textContent = -totalExpensesAmount;
    this.showBalance();
    this.expenseList.innerHTML += child;
    this.addEventListeners();
  }

  addEventListeners() {
    const deleteIcons = document.querySelectorAll('.delete-icon');
    for (const deleteIcon of deleteIcons) {
      deleteIcon.addEventListener('click', e => {
        e.preventDefault();
        this.deleteExpense(e.target);
      });
    }
    const editIcons = document.querySelectorAll('.edit-icon');
    for (const editIcon of editIcons) {
      editIcon.addEventListener('click', e => {
        e.preventDefault();
        this.editExpense(e.target);
      });
    }
  }

  showExpense() {
    this.expenseAmount.textContent = this.expenseAmount.textContent - parseFloat(this.amountInput.value);
    this.renderExpenseList();
    this.addEventListeners();
    this.showBalance();
  }

  deleteExpense(expense) {
    console.log(this.itemList);
    console.log(expense.dataset.id);
    this.itemList = this.itemList.filter(item => item.id !== expense.dataset.id);
    this.storeExpenseList();
    this.renderExpenseList();
  }

  editExpense(expense) {
    console.log(expense.dataset);
  }

  submitExpenseForm() {
    if (this.amountInput.value.includes('-')) {
      this.amountInput.value.replace('-', '');
    }
    if (!this.validateNumberInput(this.amountInput.value) && !this.validateFormInput(this.expenseInput.value.toString())) {
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>Value cannot be empty.</p>`;
      setTimeout(() => {
        this.expenseFeedback.classList.remove('showItem');
      }, 4000)
      return;
    }
    this.storeExpense({id: Date.now(), type: 'expense', amount: this.amountInput.value, text: this.expenseInput.value});
    this.showExpense();
    this.expenseInput.value = '';
    this.amountInput.value = '';
  }
}

function eventListeners() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');
  const ui = new UI();
  budgetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    ui.submitBudgetForm();
  })
  ui.renderExpenseList();
  ui.addEventListeners();


  expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    ui.submitExpenseForm();
  });

}

document.addEventListener('DOMContentLoaded', function () {
  eventListeners();
})
