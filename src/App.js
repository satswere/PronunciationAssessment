import logo from './logo.svg';
import './App.css';
import PronunciationAssessment from './components/PronunciationAssessment';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
       
       
        <PronunciationAssessment> </PronunciationAssessment>
      </header>
    </div>
  );
}

export default App;
