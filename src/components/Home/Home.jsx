import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import style from '../Home/Home.module.css'
import swal from 'sweetalert';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Home() {

  // Do something that could throw
  let token = localStorage.getItem('userTocken')
  let decode = jwtDecode(token)
  let userID = decode._id;
  // ========> (Display all notes)
  const [Notes, setNotes] = useState([])
  async function getNotes() {
    const { data } = await axios.get('https://route-egypt-api.herokuapp.com/getUserNotes', {
      headers: {
        userID,
        Token: token
      }
    });
    if (data.message == 'success') {
      setNotes(data.Notes)
    }
    console.log(Notes)
  }

  // =============> ({Add new Notes})
  const [addNewNote, setaddNote] = useState({ "title": "", "desc": "", "userID": userID, "token": token })
  async function addNote(e) {
    e.preventDefault();
    let { data } = await axios.post('https://route-egypt-api.herokuapp.com/addNote', addNewNote)
    if (data.message == "success") {
      getNotes()
      document.getElementById('add-form').reset()
      const MySwal = withReactContent(Swal)
      MySwal.fire({
        title: <strong> Success !</strong>,
        html: <i>Your note has been added.</i>,
        icon: 'success',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
    } else {
      swal("Oops", "Something went wrong!", "error")
    }
  }
  function getNote({ target }) {
    setaddNote({ ...addNewNote, [target.name]: target.value })
  }

  // ========>([Delete this note])
  function deleteNote(NoteID) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete('https://route-egypt-api.herokuapp.com/deleteNote', {
          data: {
            NoteID,
            token
          }
        }).then((response) => {
          // console.log(response);
          if (response.data.message == 'deleted') {
            getNotes();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message,
            })
          }
        })
      }
    })
  }

  // ============> get id of data and write this in input
  function getNoteById(i) {
    console.log(Notes[i])
    document.getElementById('title-edit').value = Notes[i].title
    document.getElementById('doc-edit').value = Notes[i].desc
    setaddNote({ ...addNewNote, "title": Notes[i].title, "desc": Notes[i].desc, NoteID: Notes[i]._id })
    console.log(addNewNote)
  }

  async function updateNote(e) {
    e.preventDefault()
    let { data } = await axios.put(`https://route-egypt-api.herokuapp.com/updateNote`, addNewNote)
    getNotes()
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: 'Updated has been saved' 
    })
  }
  useEffect(() => {
    getNotes()
  }, [])

  return (
    <>
      {/* Add Model and btn Model  */}
      <div className={`${style.home}`} >

        <div className="container mb-3">
          <div className="col-md-12 text-end">
            <a className={`${style.add} p-2  btn btn-outline-info`} data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add New</a>
          </div>
        </div>

        {/* <!-- Add Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <form id="add-form" onSubmit={addNote} >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="   modal-header">
                  <h5 className={`${style.title} text-dark`} id="exampleModalLabel">Add new Note</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                  <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* <!-- Edit Modal --> */}
        <div className="modal fade" id="EditModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <form id="add-form" onSubmit={updateNote}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="   modal-header">
                  <h5 className={`${style.title} text-dark`} id="exampleModalLabel">Edit Note</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" id='title-edit' />
                  <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="doc-edit" cols="30" rows="10"></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Update Note</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ==========Notes Details========== */}
        <div className="container-fluid">
          <div className="row">
            {
              Notes.map((note, i) => {
                return (
                  <div key={i} className="col-md-3 ">
                    <div className={`${style.note} shadow-lg p-3 mb-5   rounded-1`}>
                      <div className={`${style.header}`}>
                        <h3 className='mt-2'>{note.title}</h3>
                        <div className={`${style.option}`}>
                          <a>
                            <i onClick={() => deleteNote(note._id)} className={`${style.iconTrash} fas fa-trash-alt  px-3 del`}></i>
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#exampleModal1">
                            <i onClick={() => getNoteById(i)} className={`${style.iconEdit} fas fa-edit edit`} data-bs-toggle="modal" data-bs-target="#EditModal"></i>
                          </a>
                        </div>
                      </div>

                      <p className='mt-3'>{note.desc}</p>
                    </div>
                  </div>

                )
              })
            }

          </div>
        </div>
      </div>
    </>
    // className="add btn  btn-lg"
  )
}