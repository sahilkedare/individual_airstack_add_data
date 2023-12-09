import logo from './logo.svg';
import './App.css';
import { init } from "@airstack/airstack-react";
import Component from './Component';
import EtherscanMetrics from './EtherscanMetrics';

init("1f658796ad3724726bc36250b6dd8daf5");

function App() {
  return (
    <div className="App">
     {/* <Component/> */}
     <EtherscanMetrics walletAddress="0xDDDa8055aa402769499a6695cC90c84160d3148f"/>
    </div>
  );
}

export default App;
