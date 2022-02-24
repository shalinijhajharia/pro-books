import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import {Routes,Route,Link} from "react-router-dom";
import BookList from "./components/BookList";
import BooksSearch from "./components/BooksSearch";
function Empty()
{
  return <h1>There's Nothing to display</h1>
}
function App() {
  return (
    <>   
     <Routes>
     <Route path="/search" element={<BooksSearch />}/>
            
          <Route path="/" element={<BookList />} />

        <Route path="*" element={<Empty/>}/>
        
        </Routes>


    </>

   );
}

export default App;