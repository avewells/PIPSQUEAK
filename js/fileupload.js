var $ = require('jquery');					
			global.document = window.document;
			global.navigator = window.navigator;
			require('jquery-ui');

// Uploads user file and loads it into CodeMirror editor
function loadFile(input) {
	var editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
		mode: 'text/html',
		tabMode: 'indent',
		lineNumbers: true,
		lineWrapping: true,
		autoCloseTags: true
	});
	var reader = new FileReader();
	reader.onload = function(e) {
		editor.setValue(e.target.result);
	}
	reader.readAsText(input.files[0]);
}

// Uploads user video file and loads it into video player
function loadVideo() {
	var fullPath = document.getElementById("myFile").value;
	if (fullPath) {
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
	}

	var player = document.getElementById("video");
	var mp4vid = document.getElementById("mp4");
	var webmvid = document.getElementById("webm");
	var ogvvid = document.getElementById("ogv");
	alert(fullPath);
	alert(filename);
	$(mp4vid).attr('src', fullPath);
	$(webmvid).attr('src', fullPath);
	$(ogvvid).attr('src', fullPath);
	player.load();
	player.play(); 
}