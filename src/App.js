import React, { Component } from 'react';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import { DB_CONFIG } from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.addNote = this.addNote.bind(this);
        this.removeNote = this.removeNote.bind(this);

        this.app = firebase.initializeApp(DB_CONFIG);
        this.database = this.app.database().ref().child('notes');

        // We're going to setup the React state of our component
        this.state = {
          notes: [],
        }
    }

    componentWillMount() {
        const previousNotes = this.state.notes;

        // DataSnapShot
        this.database.on('child_added', snap => {
            previousNotes.push({
                id: snap.key,
                noteContent: snap.val().noteContent,
                timeStamp: snap.val().timeStamp,
            })

            this.setState({
                notes: previousNotes
            })
        })

        this.database.on('child_removed', snap => {
            for (var i=0; i < previousNotes.length; i++) {
                if (previousNotes[i].id === snap.key) {
                    previousNotes.splice(i, 1);
                }
            }

            this.setState({
                notes: previousNotes
            })
        })
    }

    addNote(note) {
        this.database.push().set({ noteContent: note });
        //console.log('addNote');
        this.getTimestamp();
    }

    checkNote(noteId) {
        console.log('note Id id ',noteId);
    }

    removeNote(noteId) {
        this.database.child(noteId).remove();
    }

    getTimestamp() {
        let timeStamp = Date();
        console.log(timeStamp);
    }


    render() {
        return (
            <div className="noteWrapper">
                <div className="notesHeader">
                    <div className="heading">React To-Do List</div>
                </div>
                <ul className="notesBody">
                    {
                        this.state.notes.map((note) => {
                            return (
                                <Note noteContent={note.noteContent}
                                      //noteTimestamp={note.noteTimestamp}
                                      noteId={note.id}
                                      key={note.id}
                                      removeNote={this.removeNote}/>
                            )
                        })
                    }
                    <li className="hiddenLi"></li>
                </ul>
                <div className="notesFooter">
                    <NoteForm addNote={this.addNote}/>
                </div>
            </div>
        );
    }
}

export default App;
