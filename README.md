# Video Zipper

[![npm version](https://img.shields.io/npm/v/video-zipper.svg)](https://www.npmjs.com/package/video-zipper)
[![npm downloads](https://img.shields.io/npm/dt/video-zipper.svg)](https://www.npmjs.com/package/video-zipper)
[![GitHub license](https://img.shields.io/github/license/yoosefap/video-zipper.svg)](https://github.com/yoosefap/video-zipper/blob/master/LICENSE)

Videos need to be compressed before uploading to websites and various platforms to increase their loading and playback speed. In this regard, the `video-zipper` library has been developed in JavaScript, which allows you to compress your videos on the client side using WebAssembly technology and prepare them for upload.

## Installation

To install this library, you can use the following command:

```bash
npm install video-zipper --save
```


## Usage

To use this library, simply create an instance of the `VideoCompressor` class and then use the `compress` function to compress your desired video in MP4 format. For example:

```javascript
import VideoZipper from 'video-zipper';

const compressor = new VideoZipper();

// get the progress of the compression process
compressor.progress((percent) => {
    console.log('percent: ' + percent);
});

file = document.getElementById('file').files[0];
compressor.compress(file)
  .then(() => {
    console.log('Video compressed successfully!');
    
    // Download file
    compressor.download();
    
    // Get local URL (URL blob)
    const url = compressor.getUrl();
    
    // Get blob
    const blob = compressor.getBlob();
    
    // for Upload file
    const fd = new FormData();
    fd.append('file', blob);
    // Use fetch or any other library to upload the file using the FormData object
  })
  .catch(err => console.error(err));
```

In this example, the `compress` function receives an MP4 format video and compresses it using WebAssembly.The progress function is used to get the progress of the compression process and display it as a percentage. After compression, the compressed MP4 format video is saved to the specified path. You can then use the `getUrl` and `getBlob` functions to get the URL blob or blob of the compressed video, respectively. You can also upload the compressed video using the `FormData` object.

### help
#### properties and methods of the VideoZipper class

| Property/Method | Description |
| --- | --- |
| constructor(options) | Initializes the VideoZipper instance with the given options. |
| progress(func) | Sets the function to be called during compression progress. |
| start(func) | Sets the function to be called when compression starts. |
| end(func) | Sets the function to be called when compression ends. |
| fail(func) | Sets the function to be called when compression fails. |
| load() | Loads the instance of FFmpeg. |
| compress(file, outputName) | Compresses the given file using FFmpeg and returns the VideoZipper instance. |
| download() | Downloads the compressed video. |
| getUrl() | Returns the URL of the compressed video. |
| getBlob() | Returns the compressed video as a blob. |
| getMainFile() | Returns the original video file. |




#### acceptable options for the VideoZipper
| Option | Type | Description                                                                                                         | Default Value |
| --- | --- |---------------------------------------------------------------------------------------------------------------------| --- |
| `quality` | string | The selected quality option for compression. Acceptable values are: "veryLow", "low", "medium", "high", "veryHigh". | `"medium"` |
| `crf` | number | The Constant Rate Factor (CRF) value for compression.                                                               | `28` |
| `name` | string | The base name for the output file.                                                                                  | `"compressed"` |
| `outputDir` | string | The output directory for the compressed file.                                                                       | Same directory as the original file |
| `format` | string | The output file format. Acceptable values are: "mp4", "webm".                                                       | Same format as the original file |
| `progressFunc` | function | The function to call when progress is made during compression.                                                      | `null` |
| `startFunc` | function | The function to call when compression starts.                                                                       | `null` |
| `successFunc` | function | The function to call when compression is successful.                                                                | `null` |
| `endFunc` | function | The function to call when compression ends.                                                                         | `null` |
| `failFunc` | function | The function to call when compression fails.                                                                        | `null` |

By using these options, you can customize the compression settingssuch as quality and CRF, and set functions to be called on progress, start, success, end, and failure of the compression process.

## Prerequisites

To ensure that this library works correctly, you need to add the following two headers to your server:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These headers are necessary to ensure that the library can access the necessary resources and functions.

## Support

This library is supported in modern browsers such as Google Chrome, Mozilla Firefox, and Microsoft Edge.

## Contribution

If you find any issues with this library, you can create a new issue or submit a pull request to fix it.

## License

This library is published under the [MIT](https://opensource.org/licenses/MIT) license.