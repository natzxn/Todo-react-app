import React, { useContext, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { TodoContext } from "../context";
import moment from "moment";
import firebase from "../firebase";
import { getFirestore, updateDoc, doc } from "firebase/firestore";

function EditTodo(): JSX.Element {
  console.log('hi')
  // STATE
  const [text, setText] = useState<string>(() => {
    return "";
  });
  
  const [day, setDay] = useState<Date>(() => new Date());
  const [time, setTime] = useState<Date>(() => new Date());

  // CONTEXT
  const contextValue = useContext(TodoContext);
  const selectedTodo = contextValue?.selectedTodo;


  // EDIT TEXT DAY AND TIME
 useEffect(() => {
  
    // efekt uruchamiany gdy selectedtodo sie zmienia. Przyjmuje wartość selectedtodo z kontekstu i aktualizuje lokalny stan komponentu
    if (selectedTodo) {
      setText(selectedTodo.text);
      setDay(moment(selectedTodo.date).toDate());
      setTime(moment(selectedTodo.time).toDate());
    }
  }, [selectedTodo]);

  // UPDATE THE DATA WHEN EDITING TODO
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (selectedTodo) {
      
      const db = getFirestore(firebase);
      const todoRef = doc(db, "todos", selectedTodo.id);

      updateDoc(todoRef, {
        text,
        date: moment(day).valueOf(),
        day: moment(day).format("d"),
        time: moment(time).valueOf(),
      });
    }
  };

  const handleCloseEdit = () => {
    
    // Funkcja zamykająca EditTodo bez zmiany danych
    // W tym przypadku możesz dodać ewentualne dodatkowe czynności przed zamknięciem
    // Na razie nie robimy żadnych zmian, ale możesz dostosować to do swoich potrzeb
    setText("");
    setDay(new Date());
    setTime(new Date());
    // Dodatkowe czynności (jeśli są potrzebne) przed zamknięciem EditTodo
    // ...
    // Zamykanie EditTodo
    // W tym przypadku przekładasz wartość false do selectedTodo w kontekście, aby zamknąć EditTodo
    contextValue?.setSelectedTodo(null);
  };

  // renderuje komponent edittodo gdy istnieje selectedTodo i wyświetla formularz edycji
  return  ( 
    <div>
      {selectedTodo && ( 
        <div className="EditTodo">
          <div className="header">
            <img
              width="25"
              height="25"
              src="https://img.icons8.com/office/25/pencil-tip.png"
              alt="pencil-tip"
            />{" "}
            Edit Todo
          </div>
          <div className="container">
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale="en-gb"
            >
              <form onSubmit={handleEditSubmit} className="TodoForm">
                <div className="text">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue.trim() !== "" || inputValue === "") {
                        setText(inputValue);
                      }
                    }}
                    placeholder="Edit todo..."
                    autoFocus
                    maxLength={45}
                    required
                  />
                </div>
                <div className="pick-day">
                  <div className="title">
                    <img
                      width="35"
                      height="35"
                      src="https://img.icons8.com/fluency/35/calendar--v1.png"
                      alt="calendar--v1"
                    />
                    <p>Choose a day</p>
                  </div>
                  <DatePicker
                    value={moment(day)}
                    onChange={(newDay) => newDay && setDay(newDay.toDate())}
                  />
                </div>
                <div className="pick-time">
                  <div className="title">
                    <img
                      width="35"
                      height="35"
                      src="https://img.icons8.com/fluency/35/clock--v1.png"
                      alt="clock--v1"
                    />
                    <p>Choose time</p>
                  </div>
                  <TimePicker
                    value={moment(time)}
                    onChange={(newTime) => newTime && setTime(moment(newTime).toDate())}
                  />
                </div>
                <div className="buttons">
                <div className="confirm">
                  <button type="submit">Confirm</button>
                </div>
                <div className="cancel" onClick={handleCloseEdit}>
                <img
                  width="22"
                  height="22"
                  src="https://img.icons8.com/fluency-systems-regular/22/multiply.png"
                  alt="multiply"
                />
              </div>
                  </div>
              </form>
            </LocalizationProvider>
          </div>
        </div>
      )}
    </div>
  ); 
}

export default EditTodo;
