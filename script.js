// Selecionando os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Selecinando os elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

// Capturando o evento para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D+/g, "");

  // Transforma o valor em centavos (Exemplo 150/100 = 1.5 que é equivalente a R$ 1,50)
  value = Number(value) / 100;

  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro)
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

// Adiciona um novo item a lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Criar o ícone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona o nome e a categoria na div das informações da despesa
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

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const itens = expenseList.children;

    // Atualiza a quantidade de itens da lista
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

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado
    const item = e.target.closest(".expense");
    item.remove();
  }

  updateTotals();
});

// Limpa os inputs do formulário
function formClear() {
  amount.value = " ";
  category.value = " ";
  expense.value = " ";

  expense.focus();
}
