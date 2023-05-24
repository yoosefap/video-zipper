import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';

export default class VideoZipper {
    #file;
    #url;
    #blob;
    #loaded = false;
    #quality = 'medium';
    #crf;
    #name = 'output';
    #extension = 'mp4';
    #outputName = null;
    #progressFunc;
    #startFunc;
    #successFunc;
    #endFunc;
    #failFunc;
    #ffmpeg;
    #qualities = {
        veryHigh: {name: 'Very High', mp4: 12, webm: 18},
        high: {name: 'High', mp4: 18, webm: 24},
        medium: {name: 'Medium', mp4: 23, webm: 29},
        low: {name: 'Low', mp4: 28, webm: 32},
        veryLow: {name: 'Very Low', mp4: 34, webm: 38}
    };

    constructor(options = {},load = false) {
        // Assign options values to private properties
        this.#quality = options.quality || 'medium';
        this.#crf = options.crf || null;
        this.#progressFunc = options.progress || null;
        this.#successFunc = options.success || null;
        this.#startFunc = options.start || null;
        this.#endFunc = options.end || null;
        this.#failFunc = options.fail || null;
        this.#name = options.name || 'output';

        // Create an instance of FFmpeg and load it
        this.#ffmpeg = createFFmpeg({log: true, progress: (p) => this.#callProgress(p.ratio)});

        if(!!load)
        this.load();
    }

    #callFunc(func, input = null) {
        if (func && input !== null) {
            func(input);
        } else if (func) {
            func();
        }
    }

    #callProgress(ratio) {
        const percent = Math.round(ratio * 100);
        this.#callFunc(this.#progressFunc, percent);
    }

    progress(func) {
        this.#progressFunc = func;
    }

    start(func) {
        this.#startFunc = func;
    }

    end(func) {
        this.#endFunc = func;
    }

    fail(func) {
        this.#failFunc = func;
    }

    #setFile(file) {
        this.#file = file;
        this.#extension = this.#file.name.split('.').pop();
    }

    #getQuality() {
        return this.#qualities[this.#quality] || null;
    }

    #getCRF() {
        if (this.#crf && Number.isInteger(this.#crf)) {
            return this.#crf.toString();
        }
        const quality = this.#getQuality();
        if (quality && quality[this.#extension]) {
            return quality[this.#extension].toString();
        }
        return this.#qualities.medium[this.#extension].toString();
    }

    async load() {
        await this.#ffmpeg.load();
        this.#loaded = true;
    }

    #getName() {
        return `${this.#name}.${this.#extension}`;
    }

// compress the video file
    async compress(file, outputName = null) {
        // If FFmpeg is not loaded, log an error message and return
        if (!this.#loaded) {
            console.error("FFmpeg isn't loaded yet");
            return;
        }

        // Set the output file name and call the start function
        this.#outputName = outputName || this.#getName();
        this.#callFunc(this.#startFunc, this);
        this.#callProgress(0);
        this.#setFile(file);

        try {
            // Write the input file to the virtual file system
            this.#ffmpeg.FS('writeFile', this.#file.name, await fetchFile(this.#file));
            // Run the FFmpeg command based on the input file extension
            if (this.#extension === 'webm') {
                await this.#ffmpeg.run(
                    '-i', this.#file.name,
                    '-c:v', 'libvpx-vp9',
                    '-crf', this.#getCRF(),
                    '-b:v', '0',
                    '-row-mt', '1',
                    `${this.#outputName}`
                );
            } else {
                await this.#ffmpeg.run(
                    '-i', this.#file.name,
                    '-c:v', 'libx264',
                    '-crf', this.#getCRF(),
                    `${this.#outputName}`
                );
            }

            // Read the output file from the virtual file system and create a blob and URL
            const data = this.#ffmpeg.FS('readFile', this.#outputName);
            this.#blob = new Blob([data.buffer], {type: `video/${this.#extension}`});
            this.#url = URL.createObjectURL(this.#blob);
        } catch (ex) {
            console.error(ex);
            // Call the fail function if an error occurs
            this.#callFunc(this.#failFunc, ex);
        }

        // Call the success and end functions
        this.#callFunc(this.#successFunc, this);
        this.#callFunc(this.#endFunc, this);

        return this;
    }

// download the compressed video
    download() {
        const el = document.createElement('a');
        el.href = this.#url;
        el.target = '_blank';
        el.download = this.#outputName;
        el.click();
    }

// get the URL of the compressed video
    getUrl() {
        return this.#url;
    }

// get the compressed video as a blob
    getBlob() {
        return this.#blob;
    }

// get the original file
    getMainFile() {
        return this.#file;
    }
}