import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  const [books, setBooks] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [bookId, setBookId] = useState();
  
  const createBook = async () => {
    setEditMode(false);

    const bookData = {
      title: title,
      release_year: year,
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create_book/", {
        method: "POST",
        // Converting JavaScript Object to JSON
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(bookData)
      })

      setTitle('');
      setYear('');

      const data = await response.json();
      setBooks((prev) => [...prev, data]);

      console.log(data);

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const editBook = (book) => {
    setEditMode(true);
    setTitle(book.title);
    setYear(book.release_year);
    setBookId(book.id);
  }

  const updateBook = async (pk) => {
    const updatedBookData = {
      title : title,
      release_year : year,
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/book/${pk}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updatedBookData)
      });

      setTitle('');
      setYear('');

      const data = await response.json();
      setBooks((prev) => prev.map((book) => {
        if (book.id === pk) {
          return data;
        } else {
          return book;
        }
      }));
      
      setEditMode(false);

      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  const deleteBook = async (pk, book_title) => {
    const response = confirm("Are you sure want to delete?");
    
    if (response === true) {
      try {
        const resp = await fetch(`http://127.0.0.1:8000/api/book/${pk}`, {
          method: 'DELETE'
        });

        setBooks((prev) => prev.filter((book) => book.id !== pk));

        alert(`${book_title} book has been deleted.`);
        
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 p-5">
            <div className='border border-1 border-secondary p-5 w-75 m-auto'>
              <h2 className='text-center'>Book WebAPP</h2>
              <hr />

              <div className='mt-5 mb-3'>
                <label className='mb-3 fw-medium'>Enter Book Title: </label>
                <input type="text" className='form-control' name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Book title...' />
              </div>
              <div className='mb-3'>
                <label className='mb-3 fw-medium'>Enter Year: </label>
                <input type="number" className='form-control' name="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder='Release Year...' />
                &nbsp;
              </div>
              <div className='mb-3'>
                {
                  editMode ? 
                  <button className='btn btn-dark btn-sm' onClick={() => updateBook(bookId)} type='submit'>Update Book</button>
                    :
                  <button className='btn btn-dark btn-sm' onClick={createBook} type='submit'>Create Book</button>
                }
              </div>
            </div>
          </div>
          {books ?
            <div className="col-md-6 p-5">
              <table className='table table-bordered border border-1 border-secondary '>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Book Title</th>
                    <th>Release Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, key) => (
                    <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{book.title}</td>
                      <td>{book.release_year}</td>
                      <td>
                        <button className='btn btn-warning btn-sm' onClick={() => editBook(book)}>
                          Edit
                        </button>
                        &nbsp;
                        &nbsp;
                        <button className='btn btn-danger btn-sm' onClick={() => deleteBook(book.id, book.title)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            : 'No data Found'
          }
        </div>
      </div>
    </>
  )
}

export default App
