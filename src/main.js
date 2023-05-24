import VideoZipper from './video-zipper.js';
import CircularProgressBar from "circular-progress-bar";

let compressor = new VideoZipper({
    quality: 'low',
});
compressor.load().then(()=>{
    console.log('loaded');
    document.getElementById('loading').style.display = 'none'
});

let progressElement = document.getElementById('progress');
let downloadElement = document.getElementById('download');
let preview = document.getElementById('preview');
const progress = new CircularProgressBar();
progress.appendTo(progressElement);

document.getElementById('file').addEventListener("input", (e) => {

    let file = e.target.files[0];

    compressor.start(() => {
        downloadElement.style.display = 'none';
        preview.style.display = 'none';
        progressElement.style.display = 'block';
        progress.value = 0;
    });

    compressor.progress((percent) => {
        console.log(percent.toString() + '%');
        progress.value = percent;
    });

    compressor.compress(file).then(($this) => {
        progressElement.style.display = 'none';
        preview.src = compressor.getUrl();
        preview.play();
        preview.style.display = 'block';
        downloadElement.style.display = 'block';
    });
});

downloadElement.addEventListener('click', () => {
    compressor.download();
});