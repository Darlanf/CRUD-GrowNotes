// variaveis globais
const form  = document.getElementById('form-recados');
const tBody = document.getElementById('table-body');
const editModal = new bootstrap.Modal(`#edit-modal`);

const allAlerts = document.getElementById("my-alert");

const myAlert = (message, type) => {
  const createdAlert = document.createElement("div");
  createdAlert.innerHTML = [
    `<div class="mt-3 alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  allAlerts.append(createdAlert);
};

function closeMyAlerts () {
  allAlerts.innerHTML = "";
};

const logado = localStorage.getItem(`logado`);
if (!logado) {
    myAlert(`Crie uma conta!`, `danger`);
    setTimeout(() => {
        closeMyAlerts();
      }, 2000);
    location.href = `conta.html`;
};

const bemVindo = document.getElementById('bem-vindo-logado');
bemVindo.innerHTML = `Bem vindo, ${logado}!`;

// salvar recados
const salvarRecado = (event) => {
    event.preventDefault();
    
    const description = form.descricao.value;
    const detail = form.detalhes.value;
    
    const errors = [];

    if (!description || description.length < 3) {
        errors.push(`<p>Descrição inválida!`);
        myAlert(`Descrição inválida! Preencha com pelo menos 3 caracteres`, `warning`);
        setTimeout(() => {
            closeMyAlerts();
          }, 2000);
    }
    if (!detail || detail.length < 3) {
        errors.push(`<p>Detalhamento inválido!`)
        myAlert(`Detalhamento inválido! Preencha com pelo menos 3 caracteres`, `warning`);
        setTimeout(() => {
            closeMyAlerts();
          }, 2000);
    }
    if (errors.length > 0) {
        return;        
    }
    
    // salvar itens no Array
    recados.push({
        id: Math.floor(Date.now() / 1000),
        descricao: description,
        detalhes: detail,
    });

    // atualiza recados no localStorage
    atualizarLocalStorage(recados); 

    // mostrar recados na tela
    mostrarTabela();

    myAlert(`Recado salvo com sucesso!`, `dark`);
    setTimeout(() => {
        closeMyAlerts();
      }, 2000);

    // limpar formulário

    form.reset();

};

// salvar no localStorage
const atualizarLocalStorage = (recados) => {
    const usuarios = JSON.parse(localStorage.getItem(`usuarios`));
    usuarios.forEach(usuario => {
        if (usuario.login == logado){
            usuario.recados = recados       
        }        
    });
    localStorage.setItem(`usuarios`, JSON.stringify(usuarios));
};

// buscar os recados
const buscarRecados = () => {
    const usuarios = JSON.parse(localStorage.getItem(`usuarios`));
    const usuarioLogado = usuarios.find(usuario => usuario.login == logado);
    return usuarioLogado.recados;
}
let recados = buscarRecados()

//mostrar na página
const mostrarTabela = () => {

    tBody.innerHTML = ``;
    let num = 1;

    for (const recado of recados) {
        tBody.innerHTML += `
        <tr>
            <th class="bg-th">${num}</th>
            <td>${recado.descricao}</td>
            <td>${recado.detalhes}</td>
            <td class="btn-acoes">
                <button class="btn" type="button" name="apagar" id="btn-erase" value="Apagar" onclick="apagarRecado(${recado.id})">
                    <i class="bi bi-trash3-fill"></i>
                </button>
                <button class="btn" type="button" name="editar" id="btn-edit" value="Editar" onclick="editarModal(${recado.id})">
                    <i class="bi bi-pencil-fill"></i>
                </button>
            </td>

        </tr>
        `;
        num++;
    }
};
mostrarTabela();

//apagar recados
const apagarRecado = (id) => {
    const vaiApagar = confirm(`Voce gostaria de apagar este recado?`);
    if (!vaiApagar) {
        myAlert(`Não apagaremos!`, `warning`);
        setTimeout(() => {
            closeMyAlerts();
          }, 2000);
        return;
    };
    const indexRecado = recados.findIndex((recado) => recado.id === id);
    if(indexRecado < 0) {
        return;
    }
    recados.splice(indexRecado, 1);
    atualizarLocalStorage(recados);
    myAlert(`Recado removido!`, `dark`);
    setTimeout(() => {
        closeMyAlerts();
      }, 2000);
    mostrarTabela();
};

//editar recados
const editarModal = (id) => {
    const vaiEditar = confirm(`Voce gostaria de editar esse recado?`);
    if (!vaiEditar) {
        myAlert(`Edição cancelada!`, `warning`);
        setTimeout(() => {
            closeMyAlerts();
          }, 2000);
        return;
    };
    const editBtn = document.getElementById(`btn-modal`);
    if (editBtn) {
        editBtn.setAttribute("onclick",  ` editarRecado(${id})`);
    }
    editModal.show()
}

const editarRecado = (id) => {
    
    const indexRecado = recados.findIndex((recado) => recado.id === id);
    if (indexRecado < 0) {
        return;
    };
    
    const editDescription = document.getElementById(`edit-description`).value;
    const editDetails = document.getElementById(`edit-details`).value;

    if (!editDescription || editDescription.length < 3) {
        myAlert(`Nova descrição inválida! Preencha com pelo menos 3 caracteres`, `danger`);
        setTimeout(() => {
            closeMyAlerts();
          }, 2000);
          return;
    };
    
    if (!editDetails || editDetails.length < 3) {
        myAlert(`Novo detalhamento inválido! Preencha com pelo menos 3 caracteres`, `danger`);
        setTimeout(() => {
            closeMyAlerts();
          }, 2000);
          return;
    };
    
    recados[indexRecado].descricao = editDescription;
    recados[indexRecado].detalhes = editDetails;
    
    atualizarLocalStorage(recados);
    mostrarTabela();
    editModal.hide();
};

//sair da pagina e deslogar usuario.   
const logout = document.getElementById(`btn-logout`);

if (logout) {
    
    logout.addEventListener(`click`, (event) => {
        event.preventDefault();
        const isOut = confirm(`Deseja sair?`);
        if (!isOut) {
            myAlert(`Fique um pouco mais!`, `dark`);
            setTimeout(() => {
                closeMyAlerts();
            }, 2000);
            return;
        }
        myAlert(`Até breve!`, `dark`)
        setTimeout(() => {
            closeMyAlerts();
        }, 2000); 
        
        localStorage.removeItem(`logado`);
        location.href = `index.html`;
    });
}

form === null || form === void 0 ? void 0 : form.addEventListener(`submit`, salvarRecado);
document.addEventListener(`DOMContentLoaded`, mostrarTabela);