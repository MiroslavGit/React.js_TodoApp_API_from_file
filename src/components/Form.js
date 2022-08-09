import React from "react";
import { serverUrl } from "./../actions/action";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      items: [],
      text: "",
      DataisLoaded: false,
    };
  }

  async componentDidMount() {
    try {
      const respons = await fetch(serverUrl);
      const json = await respons.json();
      this.setState({
        items: json,
        DataisLoaded: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="wrapper">
          <input id="input" type="text" onChange={this.handleChange} />
          <button className="add" id="add">
            Add #{this.state.items.length + 1}
          </button>
        </form>
      </div>
    );
  }

  handleChange = (e) => {
    this.setState({
      text: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      text: this.state.text,
      state: 0,
      id: Date.now(),
    };

    this.setState((state) => {
      let items = state.items;
      items.push(newItem);

      return {
        items,
        text: "",
      };
    });

    fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: this.state.text }),
    }).then((response) => response.json());
  };
}

export default Form;
