////////////////////////////////////////////////////////////////////////

var noveco_fontsize = 1.02;
var noveco_col_corp_turk   = "#82baba";
var noveco_col_corp_rose   = "#c395ac";
var noveco_col_corr_red1   = "#efdce5";
var noveco_col_corr_red2   = "#e48ab5";
var noveco_col_corr_green1 = "#aee26f";
var noveco_col_corr_green2 = "#daf3be";
var noveco_col_corr_yellow = "#ffffcc";
var noveco_col_corr_white  = "#ffffff";
var noveco_col_corr_gray   = "#cccccc";

////////////////////////////////////////////////////////////////////////

function noveco_disable_timeout(selector, duration)
{
	$(selector).each(
		(index, elem) => {
			$(elem).attr('disabled', true);
			setTimeout(() => { $(elem).attr('disabled', false); }, duration);
		}
	);
}

////////////////////////////////////////////////////////////////////////

function noveco_get_reward(num)
{
	return $("#noveco-reward" + num).val();
}

////////////////////////////////////////////////////////////////////////

function noveco_syl_check(num, tok, all)
{
	$(".noveco-audio" + num + "-tok" + tok).each(
		(index, elem) => {
			elem.volume = 1.0;
			elem.play();
		}
	);
	$(".noveco-row" + num + "-tok" + tok).each(
		(index, elem) => {
			if (elem.checked)
			{
				$(elem).css({"outline" : "3px dashed"});
				if ($(elem).hasClass("noveco-solution"))
				{
					$(elem).css({"outline-color" : noveco_col_corr_green1});
				}
				else
				{
					$(elem).css({"outline-color" : noveco_col_corr_red2});
				}
			}
			else
			{
				$(elem).css({
					"outline-color" : noveco_col_corr_gray,
					"outline" : "0px dashed"
				});
			}
		}
	);
};

////////////////////////////////////////////////////////////////////////

function noveco_row_check(num, all)
{
	var sum_ok = 0;
	var click_ok = 0;
	for (i = 0; i < all; i++)
	{
		$(".noveco-row" + i).each(
			(index, elem) => {
				if (elem.checked)
				{
					$(elem).css({"outline" : "3px dashed"});
					if ($(elem).hasClass("noveco-solution"))
					{
						if (i == num)
						{
							click_ok = 1;
						}
						sum_ok = sum_ok + 1;
						$(elem).css({"outline-color" : noveco_col_corr_green1});
					}
					else
					{
						$(elem).css({"outline-color" : noveco_col_corr_red2});
					}
				}
				else
				{
					$(elem).css({
						"outline-color" : noveco_col_corr_gray,
						"outline" : "0px dashed"
					});
				}
			}
		);
	}
	delem = $("#noveco-display");
	if (sum_ok == all)
	{
		delem.show();
		delem.css({"background" : noveco_col_corr_green1});
			delem.html("<span class='noveco-reward-sum'>" + sum_ok + " / " + all + "</span><br>" +
				"<span class='noveco-reward-last'>" + noveco_get_reward(sum_ok - 1) + "</span>");
	}
	else
	{
		if (click_ok)
		{
			delem.css({"background" : noveco_col_corr_green1});
			delem.html("<span class='noveco-reward-sum'>" + sum_ok + " / " + all + "</span><br>" +
				"<span class='noveco-reward-next'>" + noveco_get_reward(sum_ok - 1) + "</span>");
		}
		else
		{
			delem.css({"background" : noveco_col_corr_white});
			delem.html("<span class='noveco-reward-sum'>" + sum_ok + " / " + all + "</span>");
		}
	}
};

////////////////////////////////////////////////////////////////////////

function noveco_input_check(num, reward)
{
	var ielem = $("#noveco-input" + num);
	var selem = $("#noveco-solution" + num);
	var helem = $("#noveco-hint" + num);
	var text = $.trim(ielem.val());
	var sol = $.trim(selem.val());
	if (text == sol)
	{
		color_str = noveco_col_corr_green1;
	}
	else if (text == sol.substr(0, text.length))
	{
		color_str = noveco_col_corr_white;
	}
	else if (text.toLowerCase() == sol.substr(0, text.length).toLowerCase())
	{
		color_str = noveco_col_corr_yellow;
	}
	else
	{
		color_str = noveco_col_corr_red1;
	}
	ielem.css({"background" : color_str});
	var len = Math.min(text.length, sol.length);
	if (text == sol)
	{
		helem.show();
		helem.html("<span class='noveco-reward-sol'>" + reward + "</span>");
	}
	else
	{
		var hint = "";
		var wrong = 0;
		for (i = 0; i < len; i++)
		{
			if (sol[i] == " ")
			{
				if (text[i] != " ")
				{
					wrong += 1;
				}
				hint += "<span class='noveco-hint-space'> </span>";
			}
			else if (text[i] == sol[i])
			{
				hint += text[i];
				wrong = 1;
			}
			else if (text[i].toLowerCase() == sol[i].toLowerCase())
			{
				hint += "<span class='noveco-hint-case'>" + text[i] + "</span>";
				wrong = 1;
			}
			else if (wrong > 0 && wrong % 2 == 0)
			{
				hint += "<span class='noveco-hint-letter'>" + sol[i] + "</span>";
				wrong += 1;
			}
			else
			{
				hint += "<span class='noveco-hint-place'></span>";
				wrong += 1;
			}
		}
		if (text.length < sol.length)
		{
			for (i = text.length; i < sol.length; i++)
			{
				if (sol[i] == " ")
				{
					hint += "<span class='noveco-hint-space'> </span>";
				}
				else
				{
					hint += "<span class='noveco-hint-place'></span>";
				}
			}
		}
		for (i = sol.length; i < text.length; i++)
		{
			hint += "<span class='noveco-hint-overflow'>&#9679;</span>";
		}
		helem.html(hint);
	}
};

////////////////////////////////////////////////////////////////////////

function noveco_audiovol(volval)
{
	$("audio").each((index, elem) => {
		elem.volume = volval/100.0;
	});
	$("#noveco-audiovol").text(volval);
}

function noveco_reclen(delay)
{
	$("#noveco-reclen").text(delay);
}

////////////////////////////////////////////////////////////////////////

function noveco_fontsize_inc()
{
	noveco_fontsize += 0.01;
	if (noveco_fontsize > 1.1)
	{
		noveco_fontsize = 1.1;
	}
	$("#noveco-content *").css({"font-size" : noveco_fontsize + "em"});
}

function noveco_fontsize_dec()
{
	noveco_fontsize -= 0.01;
	if (noveco_fontsize < 0.9)
	{
		noveco_fontsize = 0.9;
	}
	$("#noveco-content *").css({"font-size" : noveco_fontsize + "em"});
}

////////////////////////////////////////////////////////////////////////

function noveco_show_umlautbtn(num)
{
	$(".noveco-umlaut").hide();
	$("#noveco-umlaut" + num).show();
}

function noveco_input_umlaut(num, text)
{
	var ielem = $("#noveco-input" + num);
	ielem.val(ielem.val() + text);
	ielem.focus();
	ielem.change();
}

////////////////////////////////////////////////////////////////////////

function noveco_audio_play(num, gap_time = 0)
{
	var audio_duration = 10;
	$(".noveco-audio" + num).each(
		(index, elem) => {
			if (elem.paused)
			{
				setTimeout(() => { elem.play(); }, audio_duration);
				audio_duration += elem.duration*1000.0 + gap_time;
			}
		}
	);
	return audio_duration;
}

function noveco_audio_play_row(num, gap_time = 0)
{
	var audio_duration = noveco_audio_play(num, gap_time);
	$(".noveco-row" + num).show();
	noveco_disable_timeout(".noveco-recorder", audio_duration);
	return audio_duration;
}

function noveco_audio_play_syl(num, gap_time = 0)
{
	var audio_duration = noveco_audio_play_row(num, gap_time);
	noveco_disable_timeout(".noveco-radio", audio_duration);
	return audio_duration;
}
