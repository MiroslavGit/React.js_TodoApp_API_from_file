import React from "react";
import Form from "./components/Form";
import TodoList from "./components/TodoList";

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      name: "",
      password: "",
      DataisLoaded: false,
    };
  }

  componentDidMount() {
    this.setState(
      (state) => {
        const StoragaName = localStorage.getItem("name");
        const StoragaPassword = localStorage.getItem("password");

        let name = state.name;
        let password = state.password;

        name = StoragaName;
        password = StoragaPassword;

        return { name, password };
      },
      () =>
        console.log(
          "Set state from storage",
          this.state.name,
          this.state.password
        )
    );

    this.checkLogin(
      localStorage.getItem("name"),
      localStorage.getItem("password")
    );
  }

  render() {
    return (
      <div>
        <button id="add" onClick={this.logOut}>
          Logout
        </button>
        <h3 className="title">TODO</h3>

        {this.state.login ? (
          <div>
            <Form />
            <h5 htmlFor="input" className="subtitle">
              What needs to be done?
            </h5>
            <TodoList />
          </div>
        ) : (
          <div>
            <div className="subtitle">Please login ! </div>
            <form onSubmit={this.handleSubmit}>
              <div className="wrapper">
                <input
                  id="input"
                  type="text"
                  onChange={(e) => this.handleChangeName(e.target.value)}
                />
                <label className="name">Name</label>
                <input
                  id="input"
                  type="password"
                  onChange={(e) => this.handleChangePassword(e.target.value)}
                />
                <label className="password">Password</label>
              </div>
              <div className="wrapper">
                <button className="add login" id="add">
                  Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  handleChangeName = (name) => {
    this.setState({ name: name }, () => console.log(this.state.name));
  };

  handleChangePassword = (password) => {
    this.setState({ password: password }, () =>
      console.log(this.state.password)
    );
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.checkLogin(this.state.name, this.state.password);

    localStorage.setItem("name", this.state.name);
    localStorage.setItem("password", this.state.password);
  };

  checkLogin = (name, password) => {
    this.setState({ login: name === "name" && password === "pass" });
  };

  logOut = (e) => {
    this.setState({ name: null, password: null, login: false }, () => {
      localStorage.clear();
    });
  };
}

export default TodoApp;
