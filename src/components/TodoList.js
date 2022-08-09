import React from "react";
import { serverUrl } from "./../actions/action";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      items: [],
      DataisLoaded: false,
      changeStateDiv: false,
      selectedId: 0,
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

    this.setState((state) => {
      let items = state.items;

      items.map((i) => {
        return (i.status = true);
      });

      return {
        items,
      };
    });
  }

  render() {
    if (!this.state.DataisLoaded)
      return (
        <div>
          <h1 className="eror-api"> Loading... </h1>
        </div>
      );

    return (
      <div>
        <div className="filter">
          <button
            id="add"
            value="all"
            onClick={(e) => this.filter(e.target.value)}
          >
            All |
          </button>
          <button
            id="add"
            value="active"
            onClick={(e) => this.filter(e.target.value)}
          >
            Active |
          </button>
          <button
            id="add"
            value="done"
            onClick={(e) => this.filter(e.target.value)}
          >
            Already Done
          </button>
        </div>

        <ul>
          {this.state.items.map((item) =>
            item.status === true ? (
              <li id="output" key={item.id}>
                {item.state === 0 ? (
                  <p className="dateOfCreated">State: Not started </p>
                ) : item.state === 1 ? (
                  <p className="dateOfCreated">State: In progres </p>
                ) : (
                  <p className="dateOfCreated">State: Finished </p>
                )}
                {item.text}
                <button
                  id="deleteButton"
                  className="delete"
                  onClick={(e) => this.handleDelete(item)}
                >
                  <i class="fa-solid fa-trash-can"></i>Remove
                </button>
                <button
                  id="softButton"
                  className="soft"
                  onClick={(e) => this.setItemState(item)}
                >
                  <i class="fa-solid fa-circle-check"></i>Set state
                </button>
                {item.id === this.state.selectedId ? (
                  <div>
                    <button
                      className="setButton"
                      onClick={(e) => this.setItemStateTo(item, 0)}
                    >
                      Not started
                    </button>
                    <button
                      className="setButton"
                      onClick={(e) => this.setItemStateTo(item, 1)}
                    >
                      In progress
                    </button>
                    <button
                      className="setButton"
                      onClick={(e) => this.setItemStateTo(item, 2)}
                    >
                      Finished
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}
              </li>
            ) : (
              <div></div>
            )
          )}
        </ul>
      </div>
    );
  }

  handleDelete = async (item) => {
    try {
      const res = await fetch(`${serverUrl}/${item.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log(error);
    }
  };

  setItemState = (item) => {
    this.setState((state) => {
      state.selectedId = item.id;
      return state.selectedId;
    });
  };

  setItemStateTo = (item, newNumberOfState) => {
    this.setState((state) => {
      let items = state.items;

      items.map((i) => {
        return item.id === i.id
          ? (items[items.indexOf(i)].state = newNumberOfState)
          : (items[items.indexOf(i)].state = items[items.indexOf(i)].state);
      });

      fetch(`${serverUrl}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, newState: item.state }),
      })
        .then((response) => response.json())
        .catch((err) => console.error(err));

      return { items };
    });
  };

  filter = (setNewState) => {
    setNewState === "all"
      ? this.setState((state) => {
          let items = state.items;

          items.map((i) => {
            return (i.status = true);
          });

          return {
            items,
          };
        })
      : setNewState === "active"
      ? this.setState((state) => {
          let items = state.items;

          items.map((i) => {
            return i.state === 1 ? (i.status = true) : (i.status = false);
          });

          return {
            items,
          };
        })
      : this.setState((state) => {
          let items = state.items;

          items.map((i) => {
            return i.state === 2 ? (i.status = true) : (i.status = false);
          });

          return {
            items,
          };
        });
  };
}

export default TodoList;
