const btn = document.querySelector('button'),
  chunks = [];

function record() {
    count = 0;
  chunks.length = 0;
  var options = {mimeType: 'video/webm;codecs=h264'};
  let stream = document.querySelector('canvas').captureStream(30),
    recorder = new MediaRecorder(stream, options);
  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  btn.onclick = e => {
    recorder.stop();
    btn.textContent = 'start recording';
    btn.onclick = record;
  };
  recorder.start();
  btn.textContent = 'stop recording';
}

function exportVideo(e) {
    var blob = new Blob(chunks);
    var vid = document.createElement('video');
    vid.id = 'recorded'
    vid.controls = true;
    vid.src = URL.createObjectURL(blob);
    document.body.appendChild(vid);
    vid.play();
  }
  btn.onclick = record;