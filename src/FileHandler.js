import React, { useState } from "react";
import axios from "axios";
import './FileHandler.css'

function FileHandler() {
  const [inputtedFile, setInputtedFile] = useState("")
  const [file, setFile] = useState("")
  const [fileWorksheet, setFileWorksheet] = useState("")
  const [wc, setWC] = useState(-1)
  const [headerRow, setHeaderRow] = useState(-1)
  const [displayedName, setDisplayedName] = useState("")

  var xlsx = require('xlsx')

  function checkValid() {
    if (headerRow >= 1) {
      const submitData = xlsx.utils.sheet_to_json(fileWorksheet, { range: headerRow - 1 }); //com uses 4
      let result = [submitData[0]]

      var ret = {};
      for (var key in result[0]) {
        ret[result[0][key]] = key;
      }

      return ('English Text' in ret);
    }
    return false
  }

  function handleChange(event) {
    event.preventDefault();
    if (event.target.files) {
      setInputtedFile(event.target.files[0])
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        setFileWorksheet(worksheet)
        const txt = xlsx.utils.sheet_to_json(worksheet);
        setFile(txt)
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (checkValid()) {
      const submitData = xlsx.utils.sheet_to_json(fileWorksheet, { range: headerRow }); //com uses 4


      const config = {
        headers: { 'Access-Control-Allow-Origin': '*' }
      };
      axios
        .post(`${process.env.REACT_APP_API_KEY}/files`, {
          input: submitData,
        }, config)
        .then((res) => {
          setWC(res.data);
        })
        .catch((er) => {
          console.log(er);
        });
    } else {
      alert("Wrong Header Row Selected")
    }
  }

  return (
    <div className="page">
      {(typeof wc.wordCount !== 'undefined') &&(
        wc.wordCount.map((wordCount, i) => (
          <h1 className="wordcount" key={i}>Word Count: {wordCount}</h1>
        ))
      )}

      <h2>Fill Out Form Below To Find Word Count!</h2>

      <form className="form" onSubmit={handleSubmit}>
        <h1>Excel File Upload</h1>
        <input type="file" accept=".xlsx" onChange={handleChange}/>
        <div className="numInput">
          <p>What row in Excel has the exact text 'English Text'. It should be the same row right before the prompts starts.</p>
          <input
            type="number"
            id="message"
            name="message"
            min={1}
            max={file.length}
            placeholder="Enter number here"
            onChange={(e) => setHeaderRow(Number(e.target.value) - 1)}
          />
        </div>
        <br></br>

        {(file === "" || setHeaderRow > file.length || setHeaderRow <= 0) ? (
          <button type="submit" disabled>Submit!</button>
        ) : (
          <button type="submit">Submit!</button>
        )}
      </form>


    </div>
  );
}

export default FileHandler;
