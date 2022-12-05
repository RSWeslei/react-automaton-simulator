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
      <header className="App-header">
        <h1>Automato Finito Nao Deterministico</h1>
        <div className="form">
          <input type="text" className='inputs' placeholder="Digite a string" />
          <input id='stateInput' type="number" className='inputs' placeholder="Quantidade de estados" />
          <input id='alphabetInput' type="number" className='inputs' placeholder="Tamanho do alfabeto" />
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
          >Gerar Tabela</button>
          {state.createTable ? <Table statesLenght={state.statesLenght} alphabetLenght={state.alphabetLenght} /> : null}
        </div>
      </header>
      
    </div>
  );
}
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

function determenization(matrix, simbols, isFinalState) {
  // console.log(matrix);
  // console.log(simbols);
  // console.log(isFinalState);
  let allStates = [];

  const n = Math.pow(2, matrix.length);
  // generate all states combinations
  for (let i = 0; i < n; i++) {
    let state = [];
    for (let j = 0; j < matrix.length; j++) {
      if ((i & (1 << j)) > 0) {
        state.push(j);
      }
    }
    allStates.push(state);
  }
  // sort allStates
  allStates.sort((a, b) => {
    if (a.length > b.length) {
      return 1;
    }
    if (a.length < b.length) {
      return -1;
    }
    return 0;
  });
  console.log(allStates);

  let newMatrix = [];

  // now generate the new matrix
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
  // console.log(newMatrix);

  let newStates = [];
  for (let i = 0; i < newMatrix.length; i++) {
    let state = []
    for (let j = 0; j < newMatrix[i].length; j++) {
      for (let k = 0; k < allStates.length; k++) {
        if (newMatrix[i][j].toString() === allStates[k].toString()) {
          state.push(k);
          // put the corresponding letter
          // state.push(String.fromCharCode(65 + k));
        }
      }
    }
    newStates.push(state);
  }

  console.log(newStates);

  let newFinalStates = [];
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
    newFinalStates.push(isFinal);
  }
  console.log(newFinalStates);



  return [newStates, newFinalStates];
}

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
  
  [fullMatrix, isFinalState] = determenization(fullMatrix, simbols, isFinalState);

  // remove the first state
  // fullMatrix.shift();
  // isFinalState.shift();

  console.log(fullMatrix);
  console.log(isFinalState);


  let history = [];
  // console.log(fullMatrix);
  // console.log(isFinalState);
  let current = fullMatrix[1];
 
  let last;
  for (let i = 0; i < string.length; i++) {
    let letter = string[i];
    // console.log("Letter: ", letter);
    let finded = false;
    for (let j = 0; j < current.length; j++) {
      if ((letter === simbols[j]) && current[j] !== '') {
        history.push({
          letter: `${string.slice(0, i)}[${letter}]${string.slice(i+1, string.length)}`,
          from: 'q' + fullMatrix.indexOf(current),
          to: 'q' + current[j]
        });
        let next = Number(current[j])
        // console.log("Founded: ", current);
        // console.log('Next', next);
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
  // console.log("Last: ", last);
  if (!isFinalState[last]) {
    return alert('String invalida por nao ser final');
  }
  return alert('String valida');
}

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
              <tr key={state}>
                <input type="checkbox" className='checkbox' />
                <td style={{fontSize:'20px'}}>{'q' + state}</td>
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
