import VideoZipper from './video-zipper.js';
import CircularProgressBar from "circular-progress-bar";

let compressor = new VideoZipper({
    quality: 'medium',
});

let progressElement = document.getElementById('progress');
let preview = document.getElementById('preview');
const progress = new CircularProgressBar();
progress.appendTo(progressElement);

document.getElementById('file').addEventListener("input", (e) => {

    let file = e.target.files[0];

    compressor.start(() => {
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
    });
});