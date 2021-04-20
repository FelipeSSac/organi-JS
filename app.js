//objeto para armazenar os dados no html
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}
	//retorna true ou false para ser usado no if 
	validarDados() {
		//pega os valores dos atributos
		//i = todos atributos
		for (let i in this) {
			//se algum atributo estiver com erro ou falta de informacao retorna false
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}
//objeto que define os valores no localStorage
class Bd {
	//verifica se existe algum anterior e atribui o id para contagem de objetos atribuidos ao localStorage
	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}
	//atribui mais 1 no contador 'id' permitindo inserir o proximo (anterior + 1)
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}
	//atribui o contador 'id' na variavel id
	gravar(d) {
		let id = this.getProximoId()
		//transforma o objeto 'Despesa' em stringJSON e atribui na localStorage na posição id
		localStorage.setItem(id, JSON.stringify(d))
		//atribui o novo valor para id (com a quantidade de objetos adicionados na localStorage)
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistro() {
		//array de despesas
		let despesas = Array()
		let id = localStorage.getItem('id')
		//recuperar todas as despesas cadastradas em localStorage
		for (let i = 1; i <= id; i++) {
			//recuperar a despesa
			//de JSON para objetos
			let despesa = JSON.parse(localStorage.getItem(i))
			//verificar indices nulos e pular
			if (despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}
	pesquisar(despesa) {

		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistro()

		//ano
		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descricao
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}
		console.log(despesasFiltradas)
		return despesasFiltradas
	}
	remover(id) {
		localStorage.removeItem(id)
	}
}
//cria o objeto Bd
let bd = new Bd()

//funcao onclick do botao adicionar
function cadastrarDespesa() {
	//Limpar os campos

	//atribui os valores em variaveis
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
	//cria um objetos com os valores
	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)
	if (despesa.validarDados()) {
		//executa a função para atribuir em JSON com parametro se referindo ao objeto
		bd.gravar(despesa)
		document.getElementById('modalHead').className = 'modal-header text-success'
		document.getElementById('modalTitle').innerHTML = 'Sucesso na gravação'
		document.getElementById('modalBody').innerHTML = 'Despesa cadastrada com sucesso'
		document.getElementById('modalBtn').className = 'btn btn-success'

		$('#modalRegistaDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else {
		//se retornar false, não preenche o localStorage e transmite a msg a seguir
		document.getElementById('modalHead').className = 'modal-header text-danger'
		document.getElementById('modalTitle').innerHTML = 'Erro na gravação'
		document.getElementById('modalBody').innerHTML = 'Existem campos obrigatórios não preenchidos'
		document.getElementById('modalBtn').className = 'btn btn-danger'
		$('#modalRegistaDespesa').modal('show')

	}


}
//sera chamada sempre quando houver o onload do body 'consulta.html'
function carregaListaDespesas(despesas = Array(), filtro = false) {

	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistro()
	}
	//seleciona o <tbody>
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	//percorrer o array depesas para listar os itens e adequalos a table
	despesas.forEach(function (d) {
		//criando linha <tr>
		let linha = listaDespesas.insertRow()
		//ajustar o tipo
		switch (d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Alimentação'
				break
			case '5': d.tipo = 'Transporte'
				break
		}
		//criando coluna <td>
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
		//botao de exclusao
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function () {
			this.id
			let id = this.id.replace('id_despesa_', '')
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)

		console.log(d)

	})
}
//botao pesquisa vai filtrar os dados
function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}