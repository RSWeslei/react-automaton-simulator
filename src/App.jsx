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
              <input type="text" className='inputs' placeholder="Digite a string" />
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
//
function getValues() {
  let stateInput = document.getElementById('stateInput');
  let alphabetInput = document.getElementById('alphabetInput');
  return [stateInput.value, alphabetInput.value];
}

function getMatrix () {
  let matrix = [];
  let simbols = [];
  let inputs = document.getElementsByClassName('matrixInputs');
  let simbol = document.getElementsByClassName('inputSimbol');
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i]?.value;
    input = input.split(',')
    for (let i = 0; i < input.length; i++) {
      input[i] = input[i].replace (/[^\d]/g, '');
    }
    matrix.push(input);
  }
  for (let i = 0; i < simbol.length; i++) {
    let input = simbol[i]?.value;
    if (input !== '' && input.trim()) {
      simbols.push(input);
    }
  }
  if (simbols.length !== simbol.length) {
    return alert('Preencha todos os campos');
  }
  return [matrix, simbols];
}

// Fun��o que determiniza o automato
function determenizar(matrix, simbols, isFinalState) {
  let allStates = [];
  const n = Math.pow(2, matrix.length);

  // Aqui � criado um array com todos os estados possiveis
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
  // Cria a nova matriz co
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

// Fun��o que verifica se a string � aceita pelo automato
function isValidString(alphabet) {
  let string = document.getElementsByClassName('inputs')[0].value;
  let isFinalState = [];
  let matrix = alphabet[0];
  let simbols = alphabet[1];

  let fullMatrix = [];
  let size = matrix.length / simbols.length;

  for (let i = 0; i < size; i++) {
    fullMatrix.push(matrix.slice(i * simbols.length, (i + 1) * simbols.length));
  }
  
  let checkboxes = document.getElementsByClassName('checkbox');
  for (let i = 0; i < checkboxes.length; i++) {
    isFinalState.push(checkboxes[i].checked);
  }
  
  [fullMatrix, isFinalState] = determenizar(fullMatrix, simbols, isFinalState);

  let history = []; // Array que guarda o hist�rico de estados e transi��es
  let current = fullMatrix[1];
 
  let last;
  for (let i = 0; i < string.length; i++) {
    let letter = string[i];
    let finded = false;
    for (let j = 0; j < current.length; j++) {
      if ((letter === simbols[j]) && current[j] !== '') {
        history.push({
          letter: `${string.slice(0, i)}[${letter}]${string.slice(i+1, string.length)}`,
          from: 'q' + fullMatrix.indexOf(current),
          to: 'q' + current[j]
        });
        let next = Number(current[j])
        current = fullMatrix[next];
        finded = true;
        last = next;
        break;
      }
    }
    if (!finded) {
      console.log("History", history);
      return alert('String invalida');
    }
  }
  console.log("History", history);
  if (!isFinalState[last]) {
    return alert('String invalida por nao ser final');
  }
  return alert('String valida');
}

// Fun��o que limpa os inputs
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

// Fun��o que cria a tabela
function Table(props) {
  if (props.statesLenght === 0 || props.alphabetLenght === 0) {
    return null;
  }
  let states = [];
  for (let i = 0; i < props.statesLenght; i++) {
    states.push(i);
  }
  let alphabet = [];
  for (let i = 0; i < props.alphabetLenght; i++) {
    alphabet.push(i);
  }
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
      <button type="submit" className='verifyBtn' onClick={() => { isValidString(getMatrix()) }}>Verificar</button>
      <button type="submit" className='verifyBtn' style={{backgroundColor:'red'}} onClick={() => { cleanTable() }}>Limpar tabela</button>
    </div>
  )
}

export default App;
