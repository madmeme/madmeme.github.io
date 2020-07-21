function flip_split(text)
{
	var n = text.indexOf("#");
	var m = text.substr(n + 1).indexOf("#");
	return [
		text.substr(0, n - 1),
		text.substr(n + 1, m),
		text.substr(n + m + 2, text.length - m - n - 2)
	];
}

function prev_card()
{
	document.flip_num = document.flip_num - 1
	if (document.flip_num < 0)
	{
		document.flip_num = document.flip_text.length - 1;
	}
	flip_text();
}

function next_card()
{
	document.flip_num = document.flip_num + 1
	if (document.flip_num >= document.flip_text.length)
	{
		document.flip_num = 0;
	}
	flip_text();
}

function flip_card()
{
	$(".flip-card").each((i,e) => {
			$(e).toggleClass("flip-show-front flip-show-back");
	});
}

function flip_text()
{
	text_front = flip_split(document.flip_text[document.flip_num][0]);
	text_back = flip_split(document.flip_text[document.flip_num][1]);
	text_card(
		text_front[0], text_front[1], text_front[2],
		text_back[0], text_back[1], text_back[2],
	);
}

function text_card(
	taf,
	tbf,
	tcf,
	tab,
	tbb,
	tcb
)
{
	$(".text-fade").each(
		(i, e) => {
			$(e).removeClass("ani-fadein ani-fadeout");
			$(e).addClass("ani-fadeout");
		}
	);
	setTimeout(
		() => {
			$(".text-a-space").html((taf.length > tab.length ? taf : tab));
			$("#text-a-front").html(taf);
			$("#text-a-back" ).html(tab);
			$(".text-b-space").html((tbf.length > tbb.length ? tbf : tbb));
			$("#text-b-front").html(tbb);
			$("#text-b-back" ).html(tbf);
			$(".text-c-space").html((tcf.length > tcb.length ? tcf : tcb));
			$("#text-c-front").html(tcf);
			$("#text-c-back" ).html(tcb);
			$(".text-fade").each(
				(i, e) => {
					$(e).removeClass("ani-fadein ani-fadeout");
					$(e).addClass("ani-fadein");
				}
			);
		},
		250.
	);
}
