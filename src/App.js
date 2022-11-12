import './App.css';

function App() {
  let createTable = false;
  let statesLenght = 4;
  let alphabetLenght = 4;
  return (
    <div className="App">
      <header className="App-header">
        <h1>Automato Finito Deterministico</h1>
        <div className="form">
          <input type="text" className='inputs' placeholder="Digite a string" />
          <input type="number" className='inputs' placeholder="Quantidade de estados" />
          <input type="number" className='inputs' placeholder="Tamanho do alfabeto" />
          <button className='verifyBtn' type="submit" onClick={createTable = true} >Gerar tabela</button>
          
          {createTable ? <Table statesLenght={statesLenght} alphabetLenght={alphabetLenght} /> : null}

        </div>
      </header>
    </div>
  );
}

function getUnique(string) {
  let unique = '';
  for (let i = 0; i < string.length; i++) {
    if (unique.indexOf(string[i]) == -1) {
      unique += string[i];
    }
  }
  return unique;
}

function Table(props) {
  let states = [];
  for (let i = 0; i < props.statesLenght; i++) {
    states.push(i);
  }
  let alphabet = [];
  for (let i = 0; i < props.alphabetLenght; i++) {
    alphabet.push(i);
  }
  let uniqueAlphabet = getUnique('alphabet');
  return (
    <div>
      <table>
        {states.map((state) => {
          return (
            <tr>
              <td>{'S'+state}</td>
              {alphabet.map((letter) => {
                return (
                  <td>
                    {state == 0 ? <td><input className='inputSimbol' type="text" placeholder="Simbolo" /></td> : null}
                    <input type="text" className='inputs' placeholder="" />
                  </td>
                )
              })}
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default App;
