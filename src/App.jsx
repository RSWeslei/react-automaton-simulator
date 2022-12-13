import './App.css';
import React, {  useState } from "react"

const App = () => {
  const [state, setState] = useState({
    createTable: false,
    statesLenght: 0,
    alphabetLenght: 0
  });
  return (
    <div className="App">
      <div className="body">
        <div className='header-content'>
          <h2 className='title-header'>Automato Finito Não Deterministico</h2>
        </div>
        <div className='content'>
          <div className="form">
            <div className='form-content'>
              <label>String que você pretente validar</label>
              <input type="text" className='inputs' id='stringInput' placeholder="Digite a string" />
              <label>Quantidade total de estados</label>
              <input id='stateInput' type="number" className='inputs' placeholder="Quantidade de estados" />
              <label>Quantidade total do alfabeto</label>
              <input id='alphabetInput' type="number" className='inputs' placeholder="Tamanho do alfabeto" />
            </div>
            <button
              className='verifyBtn'
              type="submit"
              onClick={() => { 
                let values = getValues();
                setState({
                  createTable: true,
                  statesLenght: values[0],
                  alphabetLenght: values[1]
                })
              }}
            >
              Gerar Tabela
            </button>
          </div>
            {state.createTable  
              ? <div className='table'>
                <Table statesLenght={state.statesLenght} alphabetLenght={state.alphabetLenght} />
              </div> 
              : null
            }
        </div>
      </div>
    </div>
  );
}
// Essa funcao pega os valores dos inputs e retorna um array com eles
function getValues() {
  let stateInput = document.getElementById('stateInput');
  let alphabetInput = document.getElementById('alphabetInput');
  return [stateInput.value, alphabetInput.value];
}

// Retorna um array com os valores da matriz para fazer a logica
function getMatriz () 
{
  let matrix = [];
  let simbols = [];
  let finalStates = [];
  let inputs = document.getElementsByClassName('matrixInputs');
  let alphabet = document.getElementsByClassName('inputSimbol');

  // Pega os valores da matriz, e os trata
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i]?.value;
    input = input.split(',')
    for (let i = 0; i < input.length; i++) {
      input[i] = input[i].replace (/[^\d]/g, '');
    }
    input = input.sort((a, b) => {  
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });
    matrix.push(input);
  }

  for (let i = 0; i < alphabet.length; i++) {
    let input = alphabet[i]?.value;
    if (input !== '' && input.trim()) {
      simbols.push(input);
    }
  }

  if (simbols.length !== alphabet.length) {
    return alert('Preencha todos os campos');
  }

  let fullMatrix = [];
  const size = matrix.length / simbols.length;

  for (let i = 0; i < size; i++) { 
    fullMatrix.push(matrix.slice(i * simbols.length, (i + 1) * simbols.length));
  }

  let checkboxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
      finalStates.push(checkboxes[i].checked);
    }

  return [fullMatrix, simbols, finalStates];
}

// Funcao que determiniza o automato
function determinization(matrix, simbols, isFinalState) {
  let allStates = [];
  const n = Math.pow(2, matrix.length);

  // Aqui e criado um array com todos os estados possiveis
  for (let i = 0; i < n; i++) {
    let state = [];
    for (let j = 0; j < matrix.length; j++) {
      if ((i & (1 << j)) > 0) {
        state.push(j);
      }
    }
    allStates.push(state);
  }

  // Ordena o array de estados
  allStates.sort((a, b) => {
    if (a.length > b.length) {
      return 1;
    }
    if (a.length < b.length) {
      return -1;
    }
    return 0;
  });

  let newMatrix = [];
  // Cria a nova matriz de estados
  for (let i = 0; i < allStates.length; i++) {
    let state = allStates[i];
    let newState = [];
    for (let j = 0; j < simbols.length; j++) {
      let newStates = [];
      for (let k = 0; k < state.length; k++) {
        let index = state[k];
        let states = matrix[index][j];
        for (let l = 0; l < states.length; l++) {
          let state = states[l];
          if (!newStates.includes(state) && state !== '') {
            newStates.push(state);
          }
        }
      }
      newState.push(newStates);
    }
    newMatrix.push(newState);
  }

  console.log("Matriz antiga: ", matrix);

  let newStates = [];
  for (let i = 0; i < newMatrix.length; i++) {
    let state = []
    for (let j = 0; j < newMatrix[i].length; j++) {
      for (let k = 0; k < allStates.length; k++) {
        if (newMatrix[i][j].toString() === allStates[k].toString()) {
          state.push(k);
        }
      }
    }
    newStates.push(state);
  }

  console.log("Matriz nova: ", newStates);

  let finalStates = [];
  for (let i = 0; i < allStates.length; i++) {
    let state = allStates[i];
    let isFinal = false;
    for (let j = 0; j < state.length; j++) {
      let index = state[j];
      if (isFinalState[index]) {
        isFinal = true;
        break;
      }
    }
    finalStates.push(isFinal);
  }

  return [newStates, finalStates];
}

// Funcao que verifica se o automato � deterministico
function isDeterministic(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].length > 1) {
        console.log('Nao deterministico');
        return false;
      }
    }
  }
  return true;
}

// Funcao que verifica se a string e aceita pelo automato
function isValidString(alphabet) {
  let string = document.getElementById('stringInput').value;
  let matrix = alphabet[0];
  let simbols = alphabet[1];
  let finalStates = alphabet[2];

  let currentState;

  if (string === '') {
    if(finalStates[0]) {
      return alert('String aceita');
    } 
    return alert('String nao aceita');
  }

  if (!isDeterministic(matrix)) {
    [matrix, finalStates] = determinization(matrix, simbols, alphabet[2]);
    currentState = matrix[1];
  } else {
    currentState = matrix[0];
  }

  let history = []; // Array que guarda o historico de estados e transicoes
 
  let last;
  for (let i = 0; i < string.length; i++) {
    let letter = string[i];
    let finded = false;
    for (let j = 0; j < currentState.length; j++) {
      if ((letter === simbols[j]) && currentState[j] !== '') {
        history.push({
          letter: `${string.slice(0, i)}[${letter}]${string.slice(i+1, string.length)}`,
          from: 'q' + matrix.indexOf(currentState),
          to: 'q' + currentState[j]
        });
        let next = Number(currentState[j])
        currentState = matrix[next];
        finded = true;
        last = next;
        break;
      }
    }
    if (!finded) {
      console.log("History", history);
      return alert('String nao aceita');
    }
  }
  console.log("History", history);
  if (!finalStates[last]) {
    return alert('String nao aceita');
  }
  return alert('String valida');
}

// Funcao que limpa os inputs
function cleanTable() {
  let inputs = document.getElementsByClassName('matrixInputs');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = null;
  }
  let simbol = document.getElementsByClassName('inputSimbol');
  for (let i = 0; i < simbol.length; i++) {
    simbol[i].value = null;
  }
  let finalState = document.getElementsByClassName('checkbox');
  for (let i = 0; i < finalState.length; i++) {
    finalState[i].checked = false;
  }
}

// Funcao que cria a tabela
function Table(props) {
  if (props.statesLenght === 0 || props.alphabetLenght === 0) {
    return null;
  }
  let states = Array.from(Array(Number(props.statesLenght)).keys()) // Cria de 0 ... n-1, sendo n o numero de estados
  let alphabet = Array.from(Array(Number(props.alphabetLenght)).keys()) // Cria de 0 ... n-1, sendo n o numero de simbolos
  return (
    <div>
      <table >
        <tbody>
          {states.map((state) => {
            return (
              <tr key={state} className="tr-table">
                <div className='check'>
                  <label >Estado final</label>
                  <input type="checkbox" className='checkbox' />
                  <label style={{fontSize:'19px'}}>{'q' + state}</label>
                </div>
                {alphabet.map((letter) => {
                  return (
                    <td key={letter}>
                      {state === 0 ? 
                        <td>
                          <input className='inputSimbol' type="text" placeholder="Simbolo" />
                        </td> 
                        : null}
                      <input type="text" className='matrixInputs' placeholder="" />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <button type="submit" className='verifyBtn' onClick={() => { isValidString(getMatriz()) }}>Verificar</button>
      <button type="submit" className='verifyBtn' style={{backgroundColor:'red'}} onClick={() => { cleanTable() }}>Limpar tabela</button>
    </div>
  )
}

export default App;