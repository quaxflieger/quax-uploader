import './style.css'
import {create, registerPlugin} from 'filepond';
// Import the Image Preview plugin
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Get a reference to the file input element
const inputElement = document.querySelector('input[type="file"]');

// Create a FilePond instance
registerPlugin(FilePondPluginImagePreview);

const pond = create(
  inputElement,
  {
    credits: [],
    allowMultiple: true,
    // disabled: true,
    imagePreviewMinHeight: 64,
    imagePreviewMaxHeight: 128,
  }
);