// const { createElement } = require("react");

const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

amount.oninput = () => {
  let value = amount.value.replace(/\D+/g, "");

  // Transforma o valor em centavos (Exemplo 150/100 = 1.5 que é equivalente a R$ 1,50)
  value = Number(value) / 100;

  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    // Criando o valor da despesas

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");

    const small = document.createElement("small");
    small.textContent = "R$";

    expenseAmount.append(
      small,
      `${newExpense.amount.toUpperCase().replace("R$", "")}`
    );

    // Cria o ícone remove
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "./img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    //Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    //Adiciona o item na list
    expenseList.append(expenseItem);

    formClear();

    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despensas");
    console.log(error);
  }
}

function updateTotals() {
  try {
    const itens = expenseList.children;

    expensesQuantity.textContent = `${itens.length} ${
      itens.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    for (let item = 0; item < itens.length; item++) {
      const itemAmount = itens[item].querySelector(".expense-amount");

      // Remove caracteres não númericos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte o valor para float.
      value = parseFloat(value);

      //Verificar se é um número válido.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calculat o total. O valor não parecer ser um número"
        );
      } else {
        // Incrementa o valor total
        total += Number(value);
      }
    }

    // Cria a span pra adicionar o R$ formatado
    const sybolBTL = document.createElement("small");
    sybolBTL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = "";

    // Adiciona o símbolo da moeda e o valor formatado
    expenseTotal.append(sybolBTL, total);
  } catch (error) {
    alert("Não foi possível atualizar os totais.");
    console.log(error);
  }
}

expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-icon")) {
    const item = e.target.closest(".expense");
    item.remove();
  }

  updateTotals();
});

function formClear() {
  amount.value = " ";
  category.value = " ";
  expense.value = " ";

  expense.focus();
}
