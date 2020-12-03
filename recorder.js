////////////////////////////////////////////////////////////////////////

class Recorder
{
	constructor(idname, rec_time = 5000.0)
	{
		this.idname = idname;
		this.rec_obj = null;
		this.rec_data = [];
		this.rec_time = rec_time;
		this.rec_words = null;
		this.button();

		this.rec_func = (stream, that) => {
			that.rec_obj = new MediaRecorder(stream);
			that.rec_obj.addEventListener(
				"dataavailable",
				event => {
					that.rec_data.push(event.data);
				}
			);
			that.rec_obj.addEventListener(
				"start",
				() => {
					that.rec_data = [];
				}
			);
			that.rec_obj.addEventListener(
				"stop",
				() => {
					const blob = new Blob(that.rec_data);
					const aurl = URL.createObjectURL(blob);
					that.rec_words = new Audio(aurl);
					that.rec_words.volume = 1.0;
					that.rec_words.play();
				}
			);
			that.rec_obj.start();
			that.rec_obj.stop();
		}
		this.stream_func = (stream) => { this.rec_func(stream, this); }

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		{
			navigator
				.mediaDevices
				.getUserMedia({audio: true, video: false})
				.then(this.stream_func)
				.catch(function (e) { alert(e.name + ": " + e.message); })
				;
		}
		else
		{
			navigator.getAudio = (
				navigator.getUserMedia ||
				navigator.webKitGetUserMedia ||
				navigator.moxGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia
			);
			if (navigator.getAudio)
			{
				navigator.getAudio(
					{audio: true, video: false},
					this.stream_func,
					function () { alert("Audio is not accessible."); }
				);
			}
		};
	}

	button(enable_btn = true, image_btn = 0)
	{
		$("#" + this.idname + "-recbtn").prop("disabled", !enable_btn);
		$("#" + this.idname + "-playbtn").prop("disabled", !enable_btn);
		if (image_btn  == 0) $("#" + this.idname + "-mic"   ).show(); else $("#" + this.idname + "-mic"   ).hide();
		if (image_btn  == 1) $("#" + this.idname + "-speaka").show(); else $("#" + this.idname + "-speaka").hide();
		if (image_btn  == 2) $("#" + this.idname + "-speakb").show(); else $("#" + this.idname + "-speakb").hide();
		if (image_btn  == 3) $("#" + this.idname + "-speakc").show(); else $("#" + this.idname + "-speakc").hide();
		if (image_btn  == 4) $("#" + this.idname + "-speakd").show(); else $("#" + this.idname + "-speakd").hide();
		if (image_btn  == 5) $("#" + this.idname + "-loud"  ).show(); else $("#" + this.idname + "-loud"  ).hide();
	}

	record()
	{
		this.rec_obj.start();
		setTimeout(() => { this.rec_obj.stop(); }, 1.0*this.rec_time);
		if (this.idname)
		{
			/****************/ this.button(false, 1);      // 0.0
			/****************/ $('#' + this.idname + '-playbtn').hide() // 0.0
			setTimeout(() => { this.button(false, 2);      }, 0.3*this.rec_time);
			setTimeout(() => { this.button(false, 3);      }, 0.6*this.rec_time);
			setTimeout(() => { this.button(false, 4);      }, 0.9*this.rec_time);
			setTimeout(() => { this.button(false, 5);      }, 1.0*this.rec_time);
			setTimeout(() => { this.button(true,  0);      }, 2.0*this.rec_time);
			setTimeout(() => { $('#' + this.idname + '-playbtn').show() }, 2.1*this.rec_time);
		}
	}

	play()
	{
		this.rec_words.volume = 1.0;
		this.rec_words.play();
		if (this.idname)
		{
			/****************/ this.button(false, 5);         // 0.0
			/****************/ $('#' + this.idname + '-playbtn').hide()    // 0.0
			setTimeout(() => { this.button(true , 0); },      1.0*this.rec_time);
			setTimeout(() => { $('#' + this.idname + '-playbtn').show() }, 1.1*this.rec_time);
		}
	}
};

////////////////////////////////////////////////////////////////////////
