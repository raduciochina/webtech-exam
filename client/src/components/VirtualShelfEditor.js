import { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { virtualshelfActions, bookActions } from "../actions";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

const virtualshelfListSelector = (state) => state.virtualshelf.virtualshelfList;
const bookListSelector = (state) => state.book.bookList;

function VirtualShelfEditor() {
  //virtualshelf
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [isNewVirtualshelf, setIsNewVirtualshelf] = useState(true);
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const dt = useRef(null);
  const virtualshelfList = useSelector(virtualshelfListSelector, shallowEqual);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(virtualshelfActions.getVirtualshelves());
  }, [dispatch]);

  const addNew = () => {
    setIsDialogShown(true);
    setDescription("");
    setDate(new Date());
    setSelected(null);
    setIsNewVirtualshelf(true);
  };

  const saveVirtualshelf = () => {
    if (isNewVirtualshelf) {
      dispatch(virtualshelfActions.addVirtualshelf({ description, date }));
    } else {
      dispatch(
        virtualshelfActions.updateVirtualshelf(selected, { description, date })
      );
    }

    setIsDialogShown(false);
    setDescription("");
    setDate(new Date());
    setSelected(null);
  };

  const deleteVirtualshelf = (rowData) => {
    dispatch(virtualshelfActions.deleteVirtualshelf(rowData.id));
  };

  const editVirtualshelf = (rowData) => {
    setSelected(rowData.id);
    setDescription(rowData.description);
    setDate(rowData.date);
    setIsDialogShown(true);
    setIsNewVirtualshelf(false);
  };

  const hideDialog = () => {
    setIsDialogShown(false);
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const tableHeader = (
    <div>
      <Button
        type="button"
        icon="pi pi-file"
        onClick={() => exportCSV(false)}
        className="mr-2"
        data-pr-tooltip="CSV"
      />
    </div>
  );

  const tableFooter = (
    <div>
      <Button label="Add" icon="pi pi-plus" onClick={addNew} />
    </div>
  );

  const addDialogFooter = (
    <div>
      <Button label="Save" icon="pi pi-save" onClick={saveVirtualshelf} />
    </div>
  );

  const opsColumn = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => deleteVirtualshelf(rowData)}
        />
        <br></br>
        <Button
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => editVirtualshelf(rowData)}
        />
        <br></br>
        <Button
          icon="pi 
                    pi-align-justify"
          className="p-button-info"
          onClick={() => bookVirtualshelf(rowData)}
        />
      </>
    );
  };

  //book
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [url, setUrl] = useState("");
  const [isNewBook, setIsNewBook] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBookDialogShown, setIsBookDialogShown] = useState(false);
  const [isBookShown, setIsBookShown] = useState(false);
  const [virtualshelfId, setVirtualshelfId] = useState(null);

  const bookList = useSelector(bookListSelector, shallowEqual);

  const addNewBook = () => {
    setIsBookDialogShown(true);
    setTitle("");
    setGenre("");
    setUrl("");
    setSelectedBook(null);
    setIsNewBook(true);
  };

  const hideBookDialog = () => {
    setIsBookDialogShown(false);
    setIsBookShown(false);
  };

  const saveBook = () => {
    if (isNewBook) {
      dispatch(
        bookActions.addBook(virtualshelfId, {
          title,
          genre,
          url,
        })
      );
    } else {
      dispatch(
        bookActions.updateBook(virtualshelfId, selectedBook, {
          title,
          genre,
          url,
        })
      );
    }
    setTitle("");
    setGenre("");
    setUrl("");
    setSelectedBook(null);
    setIsBookDialogShown(false);
  };

  const addBookDialogFooter = (
    <div>
      <Button label="Save" icon="pi pi-save" onClick={saveBook} />
    </div>
  );

  const bookTableFooter = (
    <div>
      <Button label="Add" icon="pi pi-plus" onClick={addNewBook} />
    </div>
  );

  const opsBookColumn = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => deleteBook(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => updateBook(rowData)}
        />
      </>
    );
  };
  const deleteBook = (rowData) => {
    dispatch(bookActions.deleteBook(virtualshelfId, rowData.id));
  };

  const updateBook = (rowData) => {
    setSelectedBook(rowData.id);
    setTitle(rowData.title);
    setGenre(rowData.genre);
    setUrl(rowData.url);
    setIsNewBook(false);
    setIsBookDialogShown(true);
  };

  const bookVirtualshelf = (rowData) => {
    setIsBookShown(true);
    dispatch(bookActions.getBooks(rowData.id));
    setVirtualshelfId(rowData.id);
  };

  const genreSelectItems = [
    { label: "Tragedy", value: "TRAGEDY" },
    { label: "Drama", value: "DRAMA" },
    { label: "Comedy", value: "COMEDY" },
    { label: "Action", value: "ACTION" },
  ];

  return (
    <div>
      <DataTable
        ref={dt}
        value={virtualshelfList}
        footer={tableFooter}
        header={tableHeader}
        selectionMode="multiple"
      >
        <Column header="Description" field="description" sortable />
        <Column header="Date" field="date" sortable />
        <Column body={opsColumn} />
      </DataTable>
      {isDialogShown ? (
        <Dialog
          visible={isDialogShown}
          onHide={hideDialog}
          footer={addDialogFooter}
          header="A virtual shelf"
        >
          <InputText
            onChange={(evt) => setDescription(evt.target.value)}
            value={description}
            name="description"
            placeholder="description"
          />

          <Calendar
            onChange={(evt) => setDate(evt.target.value)}
            value={date}
            name="date"
            placeholder="date"
          />
        </Dialog>
      ) : null}

      {isBookShown ? (
        <Dialog visible={isBookShown} onHide={hideBookDialog} header="books">
          <DataTable value={bookList} footer={bookTableFooter}>
            <Column header="Title" field="title" sortable />
            <Column header="Genre" field="genre" sortable />
            <Column header="URL" field="url" sortable />

            <Column body={opsBookColumn} />
          </DataTable>
        </Dialog>
      ) : null}

      {isBookDialogShown ? (
        <Dialog
          visible={isBookDialogShown}
          onHide={hideBookDialog}
          footer={addBookDialogFooter}
          header="book"
        >
          <InputText
            onChange={(evt) => setTitle(evt.target.value)}
            value={title}
            name="title"
            placeholder="title"
          />

          {/* <InputText
            onChange={(evt) => setGenre(evt.target.value)}
            value={genre}
            name="genre"
            placeholder="genre"
          /> */}
          <Dropdown
            optionLabel="label"
            value={genre}
            options={genreSelectItems}
            onChange={(e) => setGenre(e.value)}
            placeholder="Select a Genre"
          />

          <InputText
            onChange={(evt) => setUrl(evt.target.value)}
            value={url}
            name="url"
            placeholder="url"
          />
        </Dialog>
      ) : null}
    </div>
  );
}

export default VirtualShelfEditor;
