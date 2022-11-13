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
        <h1>Automato Finito Deterministico</h1>
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
    if (input !== '' && input.trim()) {
      matrix.push(input);
    }
  }
  for (let i = 0; i < simbol.length; i++) {
    let input = simbol[i]?.value;
    if (input !== '' && input.trim()) {
      simbols.push(input);
    }
  }
  if (matrix.length !== inputs.length || simbols.length !== simbol.length) {
    return alert('Preencha todos os campos');
  }
  console.log(matrix);
  console.log(simbols);
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
      <table>
        <tbody>
          {states.map((state) => {
            return (
              <tr key={state}>
                <td style={{ fontSize:'20px'}}>{'S' + state}</td>
                {alphabet.map((letter) => {
                  return (
                    <td key={letter}>
                      {state === 0 ? <td><input className='inputSimbol' type="text" placeholder="Simbolo" /></td> : null}
                      <input type="text" className='matrixInputs' placeholder="" />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <button type="submit" className='verifyBtn' onClick={() => { getMatrix() }}>Verificar</button>
      <button type="submit" className='verifyBtn' style={{backgroundColor:'red'}} onClick={() => { cleanTable() }}>Limpar tabela</button>
    </div>
  )
}

export default App;
