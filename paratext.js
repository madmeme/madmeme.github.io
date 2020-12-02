////////////////////////////////////////////////////////////////////////

function para_umlaut(elem_id, text)
{
	let elem = $("#para-input-" + elem_id);
	elem.val(elem.val() + text);
	elem.focus();
}

////////////////////////////////////////////////////////////////////////

function para_fontsize_inc()
{
	document.para_fontsize += 0.01;
	if (document.para_fontsize > 1.5)
	{
		document.para_fontsize = 1.5;
	}
	$("#content").css({"font-size" : document.para_fontsize + "em"});
}

////////////////////////////////////////////////////////////////////////

function para_fontsize_dec()
{
	document.para_fontsize -= 0.01;
	if (document.para_fontsize < 0.75)
	{
		document.para_fontsize = 0.75;
	}
	$("#content").css({"font-size" : document.para_fontsize + "em"});
}

////////////////////////////////////////////////////////////////////////

function para_init()
{
	document.para_reveal = 0;
	if (location.search == "?all")
	{
		document.para_reveal = 9999;
	}
	else
	{
		document.para_reveal = parseInt((location.search + "?").split("?")[1]);
		if (!Number.isInteger(document.para_reveal)) document.para_reveal = 0;
	}
	para_tabs_init();	//< generated
	para_vals_init();	//< generated
	para_check_init();	//< generated
	Object.keys(document.para_vals).forEach(function(key) {
		$(".para-elem-" + key).html(document.para_vals[key][0]);
	});
	$(".para-edit").css("display", "none");
	$(".para-graph").css("display", "none");
	$("#para-graph-0").css("display", "block");
	document.para_fontsize = 1;	//< 3 valued init, no, yes elements
	document.para_first = {};	//< 3 valued init, no, yes elements
	para_graph_check(0);
}

////////////////////////////////////////////////////////////////////////

function para_flip(that, texta, textb)
{
	let elem = $(that);
	if (elem.hasClass("para-focus"))
	{
		return;
	}
	if (textb.length > 0)
	{
		elem.html(textb);
	}
	elem.addClass("para-focus");
	setTimeout(() => {
		elem.html(texta);
		elem.removeClass("para-focus");
	}, 2000.);
}

////////////////////////////////////////////////////////////////////////

function para_signal(that, texta, textb, elems)
{
	let elem = $(that);
	if (elem.hasClass("para-focus"))
	{
		return;
	}
	for (i in elems)
	{
		if (Number(i) == 0) continue;
		let sig = $(".para-elem-" + elems[i]);
		setTimeout(() => {
			sig.addClass("para-highlight");
			setTimeout(() => {
				sig.removeClass("para-highlight");
			}, 2000.);
		}, 100.*Number(i));
	}
	if (textb.length > 0)
	{
		elem.html(textb);
	}
	elem.addClass("para-focus");
	setTimeout(() => {
		elem.html(texta);
		elem.removeClass("para-focus");
	}, elems.length*100. + 2000.);
}

////////////////////////////////////////////////////////////////////////

function para_elem_check(elem_id)
{
	if (document.para_elem_check[elem_id])
	{
		return document.para_elem_check[elem_id]();
	}
	console.log("id has no func");
	return true;
}

////////////////////////////////////////////////////////////////////////

function para_graph_check(graph_id)
{
	let result = document.para_graph_check[graph_id]();
	let next_id = Number(graph_id) + 1;
	if (result || graph_id < document.para_reveal)
	{
		if (graph_id >= document.para_reveal)
		{
			$("#para-info-" + graph_id).css("display", "none");
		}
		$("#para-info-" + next_id).css("display", "block");
		let elem = $("#para-graph-" + next_id);
		elem.removeClass("ani-fadein ani-fadeout");
		elem.addClass("ani-fadein");
		elem.css("display", "block");
		if (next_id < document.para_elem_graph_num)
		{
			para_graph_check(next_id);
		}
	}
	else
	{
		for (let i = next_id; i < document.para_elem_graph_num; i++)
		{
			let elem = $("#para-graph-" + i);
			elem.removeClass("ani-fadein ani-fadeout");
			elem.addClass("ani-fadeout");
			setTimeout(((j) => {
				$("#para-info-" + j).css("display", "none");
				$("#para-elem-" + j).css("display", "none");
			})(i), 2000.);
		}
	}
	return result;
}

////////////////////////////////////////////////////////////////////////

function para_edit_show(elem_id)
{
	if ($("#para-edit-" + elem_id).css("display") != "none")
	{
		para_edit_hide();
	}
	else
	{
		para_edit_hide();
		let elem0 = $("#para-edit-" + elem_id);
		let elem1 = $(".para-elem-" + elem_id);
		let elem2 = $("#para-input-" + elem_id);
		elem0.removeClass("edit-fadeout");
		elem0.addClass("para-input edit-fadein");
		elem0.css("display", "block");
		elem1.addClass("para-focus");
		if (elem2.length > 0)
		{
			if (elem1.html() == document.para_vals[elem_id][0])
			{
				elem2.val("");
			}
			else
			{
				elem2.val(elem1.html());
			}
			elem2.focus();
		}
	}
}

////////////////////////////////////////////////////////////////////////

function para_edit_hide()
{
	let elem = $(".para-input");
	elem.addClass("edit-fadeout");
	elem.removeClass("para-input");
	setTimeout(() => { elem.css("display", "none"); }, 500.);
	$(".para-focus").removeClass("para-focus");
}

////////////////////////////////////////////////////////////////////////

function para_edit_input(elem_id, input)
{
	let elem = $(".para-elem-" + elem_id);
	let text = $(input).val().trim();
	if (text.length == 0)
	{
		elem.html(document.para_vals[elem_id][0]);
	}
	else
	{
		elem.html(text);
		if (para_elem_check(elem_id))
		{
			para_graph_check(document.para_elem_grnum[elem_id]);
			para_edit_hide();
		}
	}
}

////////////////////////////////////////////////////////////////////////

function para_edit_change(elem_id, input)
{
	let elem = $(".para-elem-" + elem_id);
	let text = $(input).val().trim();
	if (text.length == 0)
	{
		elem.html(document.para_vals[elem_id][0]);
	}
	else
	{
		elem.html(text);
	}
	if (para_elem_check(elem_id))
	{
		para_graph_check(document.para_elem_grnum[elem_id]);
		para_edit_hide();
	}
}

////////////////////////////////////////////////////////////////////////

function para_edit_select(elem_id, elem)
{
	para_edit_hide();
	$(".para-elem-" + elem_id).html($(elem).html());
	para_graph_check(document.para_elem_grnum[elem_id]);
}

////////////////////////////////////////////////////////////////////////

function para_rule_highlight(elem_id, result)
{
	let elem = $(".para-elem-" + elem_id);
	if (result)
	{
		elem.removeClass("para-wrong");
		elem.addClass("para-right");
		setTimeout(() => { elem.removeClass("para-right"); }, 2000.);
	}
	else
	{
		elem.addClass("para-wrong");
	}
}

////////////////////////////////////////////////////////////////////////

function para_rule_write(elem_id, result)
{
	// |init|no|yes
	// |init,no|yes
	// |init,no,yes
	if (document.para_vals[elem_id] !== undefined)
	{
		let elem = $(".para-elem-" + elem_id);
		let vals = document.para_vals[elem_id];
		if (vals.length == 0)
		{
			elem.html("");
		}
		else if (vals.length == 1)
		{
			elem.html(vals[0]);
		}
		else if (document.para_first[elem_id] !== undefined)
		{
			if (result)
			{
				if (vals[2])
				{
					elem.html(vals[2]);
				}
				else
				{
					elem.html(vals[1]);
				}
			}
			else
			{
				if (vals[2])
				{
					elem.html(vals[1]);
				}
				else
				{
					elem.html(vals[0]);
				}
			}
		}
		else
		{
			elem.html(vals[0]);
			document.para_first[elem_id] = true;
		}
	}
}

////////////////////////////////////////////////////////////////////////

function para_rule_isin(elem_id, tabs)
{
	let text = $(".para-elem-" + elem_id).html();
	for (i in tabs)
	{
		if (document.para_tabs[tabs[i]].includes(text))
		{
			return true;
		}
	}
	return false;
}

////////////////////////////////////////////////////////////////////////

function para_rule_const(elem_id, vals, tabs)
{
	let text = $(".para-elem-" + elem_id).html();
	if (vals[0].length > 0)
	{
		if (vals.includes(text))
		{
			para_rule_highlight(elem_id, true);
			return true;
		}
	}
	else
	{
		if (para_rule_isin(elem_id, tabs))
		{
			para_rule_highlight(elem_id, true);
			return true;
		}
	}
	para_rule_highlight(elem_id, false);
	return false;
}

////////////////////////////////////////////////////////////////////////

function para_rule_perm(elem_id, elems, tabs)
{
	let texts = {};
	for (i in elems)
	{
		if (!para_rule_isin(elems[i], tabs))
		{
			para_rule_write(elem_id, false);
			para_rule_highlight(elem_id, false);
			return false;
		}
	}
	for (i in elems)
	{
		let text = $(".para-elem-" + elems[i]).html();
		if (texts[text] !== undefined)
		{
			para_rule_write(elem_id, false);
			para_rule_highlight(elem_id, false);
			return false;
		}
		texts[text] = true;
	}
	para_rule_write(elem_id, true);
	para_rule_highlight(elem_id, true);
	return true;
}

////////////////////////////////////////////////////////////////////////

function para_rule_index(elems, tabn)
{
	if (elems.length == 1)
	{
		return document.para_tabs[tabn].indexOf($(".para-elem-" + elems[0]).html());
	}
	let texts = [];
	for (i in elems)
	{
		texts.push($(".para-elem-" + elems[i]).html());
	}
	return document.para_tabs[tabn].indexOf(texts.join(" "));
}

////////////////////////////////////////////////////////////////////////

function para_rule_map(elem_id, elems, tabs)
{
	if (tabs.length == 1)
	{
		let pos0 = para_rule_index(elems, tabs[0]);
		return [pos0, document.para_tabs[tabs[0]].length];
	}
	else if (elems.length == tabs.length)
	{
		let index = 0;
		let size = document.para_tabs[tabs[0]].length;
		for (i in tabs)
		{
			if (document.para_tabs[tabs[i]].length > size)
			{
				index = i;
				size = document.para_tabs[tabs[i]].length;
			}
		}
		let pos0 = para_rule_index([elems[index]], tabs[index]);
		if (pos0 < 0)
		{
			return [-1, 0];
		}
		for (i in elems)
		{
			let pos1 = para_rule_index([elems[i]], tabs[i]);
			if ((pos0 % document.para_tabs[tabs[i]].length) != pos1)
			{
				return [-1, 0];
			}
		}
		return [pos0, size];
	}
	return [-1, 0];
}

////////////////////////////////////////////////////////////////////////

function para_rule_map_check(elem_id, elems, tabn, tabs)
{
	let pos_size = para_rule_map(elem_id, elems, tabs);
	if (pos_size[0] < 0)
	{
		para_rule_write(elem_id, false);
		para_rule_highlight(elem_id, false);
		return false;
	}
	let text = $(".para-elem-" + elem_id).html();
	let tab = document.para_tabs[tabn];
	for (i = pos_size[0]; i < tab.length; i += pos_size[1])
	{
		if (text == tab[i])
		{
			para_rule_highlight(elem_id, true);
			return true;
		}
	}
	para_rule_highlight(elem_id, false);
	return false;
}

////////////////////////////////////////////////////////////////////////

function para_rule_map_imply(elem_id, elems, tabn, tabs)
{
	let pos_size = para_rule_map(elem_id, elems, tabs);
	if (pos_size[0] < 0)
	{
		para_rule_write(elem_id, false);
		para_rule_highlight(elem_id, false);
		return false;
	}
	$(".para-elem-" + elem_id).html(document.para_tabs[tabn][pos_size[0] % document.para_tabs[tabn].length])
	para_rule_highlight(elem_id, true);
	return true;
}

////////////////////////////////////////////////////////////////////////

function para_rule_match(elem_id, elems, tabs)
{
	let pos_size = para_rule_map(elem_id, elems, tabs);
	if (pos_size[0] < 0)
	{
		para_rule_write(elem_id, false);
		para_rule_highlight(elem_id, false);
		return false;
	}
	para_rule_write(elem_id, true);
	para_rule_highlight(elem_id, true);
	return true;
}
