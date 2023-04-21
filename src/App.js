import './App.css';
import { HashRouter , Link, Route, Routes} from "react-router-dom";

const Stand = ()=>{
  return(
    // <Stand/>
    <div className="stand">stand</div>
  )
}

const Sit = ()=>{
  return(
    // <Sit/>
    <div className="sit">sit</div>
  )
}

const Home = ()=>{
  return(
    // <Home/>
    <div className="home">home</div>
  )
}

const openElectron = async () => {
  const response = await window.versions.openElectron()
}

const showError = async () => {
  const response = await window.error.show()
  console.log(response) // prints out 'pong'
}

const getData = async () => {
  const response = await window.data.get({ product: 'notebooke' })
  console.log(response) // prints out 'pong'
}

function App() {

  return (
    <HashRouter >
      <div className="App">
        <button onClick={() => {
          openElectron()
        }}>
          Open BrowserWindow
        </button>
        <button onClick={() => {
          showError()
        }}>
          Show error
        </button>
        <button onClick={() => {
          getData()
        }}>
          get data
        </button>
        <div className="menu">
          <Link to="/"><h2>Home</h2></Link>
          <Link to="/one"><h2>Stand</h2></Link>
          <Link to="/two"><h2>Sit</h2></Link>
        </div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/one" element={<Stand />} />
          <Route exact path="/two" element={<Sit />} />
        </Routes>     
      </div>
    </HashRouter >
  )
}

export default App;
