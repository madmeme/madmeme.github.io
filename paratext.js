////////////////////////////////////////////////////////////////////////

var paratext_dt_fade = 1;
var paratext_dt_flip = 5;
var paratext_dt_signal = 3;
var paratext_dt_enable = 3;
var paratext_chscale = 0.80;

////////////////////////////////////////////////////////////////////////

function paratext_elem_check(elem)
{
	let label = $("#" + $(elem).attr("id") + "-label");
	let text = $("." + $(elem).attr("id") + "-text");
	let deco = $("#" + $(elem).attr("id") + "-deco");
	if ($(elem).prop("checked"))
	{
		$(label).removeClass("highlight-nocheck");
		$(label).html(text.val());
	}
	else
	{
		$(label).addClass("highlight-nocheck");
		$(label).html(deco.val());
	}
}

function paratext_elem_user(elem)
{
	if ($(elem).hasClass("paratext-react"))
	{
		return $(elem).html();
	}
	let text = "";
	$(elem).children("select").each((i,e) => {
		text = text + $(e).children("option:selected").val() + " ";
	});
	$(elem).children("input").each((i,e) => {
		if ($(e).attr("type") == "checkbox")
		{
			text = text + $("#" + $(e).attr("id") + "-label").html() + " ";
		}
		else if ($(e).attr("type") == "radio")
		{
			text = text + $("#" + $(e).attr("id") + "-label").html() + " ";
		}
		else if ($(e).attr("type") == "text")
		{
			text = text + $(e).val() + " ";
		}
	});
	$(elem).children("button").each((i,e) => {
		text = text + $("#" + $(e).children("span").attr("id") + "-deco").val() + " ";
	});
	return text.trim();
}

function paratext_elem_enable(enabled, found, elem)
{
	if (found)
	{
		if (elem)
		{
			$(elem).removeClass("highlight-wrong");
		}
	}
	else
	{
		if (elem)
		{
			$(elem).addClass("highlight-wrong");
		}
		return false;
	}
	return enabled;
}

function paratext_signals_enable(enabled, found, eids)
{
	for (i = 0; i < eids.length; i++)
	{
		$(".signal-" + eids[i]).each((i,elem) => {
			if ($(elem).hasClass("paratext-react"))
			{
				enabled = paratext_elem_enable(enabled, found, elem);
			}
			$(elem).children("select").each((i,e) => {
				enabled = paratext_elem_enable(enabled, found, e);
			});
			$(elem).children("input").each((i,e) => {
				if ($(e).attr("type") == "checkbox")
				{
					enabled = paratext_elem_enable(enabled, found, $("#" + $(e).attr("id") + "-label"));
				}
				else if ($(e).attr("type") == "radio")
				{
					enabled = paratext_elem_enable(enabled, found, $("#" + $(e).attr("id") + "-label"));
				}
				else if ($(e).attr("type") == "text")
				{
					enabled = paratext_elem_enable(enabled, found, e);
				}
			});
			$(elem).children("button").each((i,e) => {
				enabled = paratext_elem_enable(enabled, found, $(e).children("span"));
			});
		});
	}
	return enabled;
}

////////////////////////////////////////////////////////////////////////

function paratext_paragraph_check(pid)
{
	let enabled = true;
	$("#" + pid + " .paratext-select").each((i,e) => {
		let found = false;
		$("." + $(e).attr("id") + "-text").each((i,f) => {
			if ($(e).children("option:selected").val() == $(f).val())
			{
				found = true;
			}
		});
		enabled = paratext_elem_enable(enabled, found, e);
	});
	$("#" + pid + " .paratext-input").each((i,e) => {
		let found = false;
		$("." + $(e).attr("id") + "-text").each((i,f) => {
			if ($(e).val() == $(f).val())
			{
				found = true;
			}
		});
		enabled = paratext_elem_enable(enabled, found, e);
	});
	$("#" + pid + " .paratext-check").each((i,e) => {
		if (
			($("#" + $(e).attr("id") + "-flag").val() == "X" && !$(e).prop("checked")) ||
			($("#" + $(e).attr("id") + "-flag").val() == "x" && $(e).prop("checked"))
		)
		{
			enabled = false;
		}
		paratext_elem_check(e);
	});
	if ($("#" + pid + " .paratext-radio").length > 0)
	{
		let names = "";
		$("#" + pid + " .paratext-radio").each((i,e) => {
			if (names.search($(e).attr("name") + " ") == -1)
			{
				names = names + $(e).attr("name") + " ";
			}
			paratext_elem_check(e);
		});
		names = names.trim();
		names = names.split(" ");
		for (j = 0; j < names.length; j++)
		{
			let found = false;
			$("#" + pid + " .paratext-radio").each((i,e) => {
				if (names[j] == $(e).attr("name") && $("#" + $(e).attr("id") + "-flag").val() == "O" && $(e).prop("checked"))
				{
					found = true;
				}
			});
			if (found == false)
			{
				enabled = false;
			}
		}
	}
	$("#" + pid + " .paratext-choice").each((i,e) => {
		text = "";
		for (i = 0; i < Number($(e).val()); i++)
		{
			let f = $("#" + $(e).attr("id") + "-" + i);
			if (f.children("option:selected").length > 0)
			{
				text = text + $(f).children("option:selected").val();
			}
			else
			{
				text = text + $(f).val();
			}
			text = text + " ";
		}
		text = text.trim();
		found = false;
		$("." + $(e).attr("id") + "-text").each((j,f) =>{
			if (text == $(f).val())
			{
				found = true;
			}
		});
		for (i = 0; i < Number($(e).val()); i++)
		{
			let f = $("#" + $(e).attr("id") + "-" + i);
			enabled = paratext_elem_enable(enabled, found, f);
		}
	});
	$("#" + pid + " .paratext-react").each((i,e) => {
		let eids = $("#" + $(e).attr("id") + "-elem").val().trim().split(" ");
		text = "";
		for (i = 0; i < eids.length; i++)
		{
			$(".signal-" + eids[i]).each((i,f) => {
				text = text + paratext_elem_user(f) + " ";
			});
		}
		text = text.trim();
		let tids = $("." + $(e).attr("id") + "-text");
		let vids = $("." + $(e).attr("id") + "-vals");
		let found = false;
		for (i = 0; i < vids.length; i++)
		{
			if ($(vids[i]).val() == text)
			{
				found = true;
				$(e).html($(tids[i % tids.length]).val());
				break;
			}
		}
		if (!found)
		{
			enabled = false;
			$(e).html($("#" + $(e).attr("id") + "-deco").val());
		}
		enabled = paratext_signals_enable(enabled, found, eids);
	});
	$("#" + pid + " .paratext-perm").each((i,e) => {
		let eids = $("#" + $(e).attr("id") + "-elem").val().trim().split(" ");
		let count = [];
		for (i = 0; i < eids.length; i++)
		{
			$(".signal-" + eids[i]).each((i,f) => {
				let text = paratext_elem_user(f);
				if (count[text] == undefined)
				{
					count[text] = 1;
				}
				else
				{
					count[text] += 1;
				}
			});
		}
		let vids = $("." + $(e).attr("id") + "-vals");
		for (i = 0; i < vids.length; i++)
		{
			if (count[$(vids[i]).val()])
			{
				count[$(vids[i]).val()] -= 1;
			}
		}
		let found = true;
		for (text in count)
		{
			if (count[text] > 0)
			{
				found = false;
			}
		}
		if (found)
		{
			$(e).html($("." + $(e).attr("id") + "-text").val());
		}
		else
		{
			$(e).html($("#" + $(e).attr("id") + "-deco").val());
		}
		enabled = paratext_signals_enable(enabled, found, eids);
	});
	$("#" + pid + " .paratext-combo").each((i,e) => {
		let eids = $("#" + $(e).attr("id") + "-elem").val().trim().split(" ");
		let vids = $("." + $(e).attr("id") + "-vals");
		let found = true;
		for (i = 0; i < eids.length; i++)
		{
			$(".signal-" + eids[i]).each((i,f) => {
				let text = paratext_elem_user(f);
				let inside = false;
				for (i = 0; i < vids.length; i++)
				{
					if ($(vids[i]).val() == text)
					{
						inside = true;
						break;
					}
				}
				if (!inside)
				{
					found = false;
				}
			});
		}
		if (found)
		{
			$(e).html($("." + $(e).attr("id") + "-text").val());
		}
		else
		{
			$(e).html($("#" + $(e).attr("id") + "-deco").val());
		}
		enabled = paratext_signals_enable(enabled, found, eids);
	});
	$("#" + pid + " .paratext-count").each((i,e) => {
		let eids = $("#" + $(e).attr("id") + "-elem").val().trim().split(" ");
		let nmax = parseInt($("#" + $(e).attr("id") + "-nmax").val());
		let count = [];
		for (i = 0; i < eids.length; i++)
		{
			$(".signal-" + eids[i]).each((i,f) => {
				let text = paratext_elem_user(f);
				if (count[text] == undefined)
				{
					count[text] = 1;
				}
				else
				{
					count[text] += 1;
				}
			});
		}
		let vids = $("." + $(e).attr("id") + "-vals");
		let found = true;
		for (text in count)
		{
			if (count[text] > nmax)
			{
				found = false;
				break;
			}
			let inside = false;
			for (i = 0; i < vids.length; i++)
			{
				if ($(vids[i]).val() == text)
				{
					inside = true;
					break;
				}
			}
			if (!inside)
			{
				found = false;
				break;
			}
		}
		if (found)
		{
			$(e).html($("." + $(e).attr("id") + "-text").val());
		}
		else
		{
			$(e).html($("#" + $(e).attr("id") + "-deco").val());
		}
		enabled = paratext_signals_enable(enabled, found, eids);
	});
	return enabled;
}

function paratext_paragraph_enable()
{
	let all = false;
	let num = parseInt((location.search + "?").split("?")[1]);
	if (location.search == "?all")
	{
		all = true;
	}
	else if (!Number.isInteger(num))
	{
		num = 0;
	}
	let enabled = true;
	let lastp = undefined;
	let count = 0;
	$(".paratext-paragraph").each((i,e) => {
		if (all == false && count >= num && enabled == false)
		{
			$(e).removeClass("ani-fadein ani-fadeout");
			$(e).addClass("ani-fadeout");
			setTimeout(() => {
					$(e).css('display', 'none');
				},
				paratext_dt_fade*1000.0
			);
			if (lastp)
			{
				$(lastp).children(".paratext-narrator").each((i,f) => {
					setTimeout(() => {
							$(f).css('display', 'block');
							$(f).removeClass("ani-fadein");
							$(f).addClass("ani-fadein");
						},
						paratext_dt_fade*1000.0
					);
				});
				lastp = undefined;
			}
		}
		else
		{
			if (lastp)
			{
				if (all == true)
				{
					$(lastp).children(".paratext-narrator").each((i,f) => {
						$(f).css('display', 'block');
						$(f).removeClass("ani-fadein");
						$(f).addClass("ani-fadein");
					});
				}
				else
				{
					$(lastp).children(".paratext-narrator").each((i,f) => {
						$(f).css('display', 'none');
					});
				}
			}
			$(e).css('display', 'block');
			$(e).removeClass("ani-fadein ani-fadeout");
			$(e).addClass("ani-fadein");
			enabled = paratext_paragraph_check($(e).attr("id"));
			lastp = e;
		}
		count = count + 1;
	});
}

function paratext_paragraph_setup()
{
	setInterval(
		() => {
			paratext_paragraph_enable();
		},
		paratext_dt_enable*1000.0
	);
	$(".paratext-input").each((i,e) => {
		let tlen = 0;
		$("." + $(e).attr("id") + "-text").each((i,e) => {
			tlen = $(e).val().length > tlen ? $(e).val().length : tlen;
		});
		let dlen = $("#" + $(e).attr("id") + "-deco").val().length;
		let num = (tlen > dlen ? tlen : dlen) + 1;
		$(e).css({"width": num*paratext_chscale + "ch"});
	});
	$(".paratext-flip").each((i,e) => {
		let tlen = 0;
		$("." + $(e).attr("id") + "-text").each((i,e) => {
			tlen = $(e).val().length > tlen ? $(e).val().length : tlen;
		});
		let dlen = $("#" + $(e).attr("id")+ "-deco").val().length;
		let num = (tlen > dlen ? tlen : dlen) + 1;
		$(e).css({"width": num*paratext_chscale + "ch"});
	});
	$(".paratext-label").each((i,e) => {
		let tlen = 0;
		$("." + $(e).attr("id").replace("-label", "-text")).each((i,e) => {
			tlen = $(e).val().length > tlen ? $(e).val().length : tlen;
		});
		let dlen = $("#" + $(e).attr("id").replace("-label", "-deco")).val().length;
		let num = (tlen > dlen ? tlen : dlen) + 1;
		$(e).css({"width": num*paratext_chscale + "ch"});
	});
	$(".paratext-react").each((i,e) => {
		let tlen = 0;
		$("." + $(e).attr("id") + "-text").each((i,e) => {
			tlen = $(e).val().length > tlen ? $(e).val().length : tlen;
		});
		let dlen = $("#" + $(e).attr("id") + "-deco").val().length;
		let num = (tlen > dlen ? tlen : dlen) + 1;
		$(e).css({"width": num*paratext_chscale + "ch"});
	});
}

////////////////////////////////////////////////////////////////////////

function paratext_highlight_on(uid)
{
	let ids = $("#" + uid + "-signal").val().trim().split(" ");
	let col = 1;
	ids.forEach((id) => {
		$(".signal-" + id).each((i,e) => {
			$(e).addClass("ani-fadein highlight-signal" + col);
		});
		col = col + 1;
	});
	setTimeout(() => {
			paratext_highlight_off(uid)
		},
		paratext_dt_signal*1000.0
	);
}

function paratext_highlight_off(uid)
{
	let ids = $("#" + uid + "-signal").val().trim().split(" ");
	let col = 1;
	ids.forEach((id) => {
		$(".signal-" + id).each((i,e) => {
			$(e).removeClass("ani-fadein highlight-signal" + col);
		});
		col = col + 1;
	});
}

////////////////////////////////////////////////////////////////////////

function paratext_flip(uid)
{
	let flip = $("#" + uid);
	let text = $("." + uid + "-text");
	let deco = $("#" + uid + "-deco");
	let j = 0;
	text.each((i,e) => {
		if ($(e).val() == flip.html())
		{
			j = (i + 1)%text.length;
		}
	});
	if (flip.html() == deco.val())
	{
		setTimeout(() => {
				flip.html(deco.val());
			},
			paratext_dt_flip*1000.0
		);
	}
	flip.html($(text[j]).val());
}

////////////////////////////////////////////////////////////////////////

function paratext_input_check(uid)
{
	let inpu = $("#" + uid);
	let text = $("." + uid + "-text");
}

function paratext_input_focus(uid)
{
	let inpu = $("#" + uid);
	let deco = $("#" + uid + "-deco");
	if (inpu.val() == deco.val())
	{
		inpu.val("");
	}
}

function paratext_input_blur(uid)
{
	let inpu = $("#" + uid);
	let deco = $("#" + uid + "-deco");
	if (inpu.val() == "")
	{
		inpu.val(deco.val())
	}
}

////////////////////////////////////////////////////////////////////////

function paratext_select(uid)
{
	let sele = $("#" + uid);
	let vals = $("." + uid + "-vals");
	let j = 0;
	vals.each((i,e) => {
		if ($(e).val() == sele.html())
		{
			j = (i + 1)%vals.length;
		}
	});
	sele.html($(vals[j]).val());
}

////////////////////////////////////////////////////////////////////////

function paratext_check(uid)
{
	let check = $("#" + uid);
	let label = $("#" + uid + "-label");
	let text = $("." + uid + "-text");
	let deco = $("#" + uid + "-deco");
}

////////////////////////////////////////////////////////////////////////

function paratext_radio(uid)
{
	let radio = $("#" + uid);
	let label = $("#" + uid + "-label");
	let text = $("." + uid + "-text");
	let deco = $("#" + uid + "-deco");
	//~ $("." + radio.attr("name")).each((i,e) => {
		//~ $(e).html($("#" + $(e).attr("id").replace("-label", "-deco")).val());
	//~ });
	//~ if (radio.prop("checked"))
	//~ {
		//~ label.html(text.val());
	//~ }
}

////////////////////////////////////////////////////////////////////////
