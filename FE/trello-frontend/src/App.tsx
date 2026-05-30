import { BrowserRouter, Routes, Route } from "react-router"

const users = [
  {id: 1, name: 'Alice', age: 30},
  {id: 2, name: 'Joe', age: 69},
  {id: 3, name: 'Deo', age: 40}

]
const App = () => {
  return (
    <>
    {
      users.map((user) => (
        <ul key={Math.random()}>
          <li>{user.id}</li>
        </ul>
      ))
    }
    </>
  )
}

export default App