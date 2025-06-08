import './style.css'
import * as FilePond from 'filepond';

// Get a reference to the file input element
const inputElement = document.querySelector('input[type="file"]');

// Create a FilePond instance
const pond = FilePond.create(
  inputElement,
  {
    credits: [],
  }
);