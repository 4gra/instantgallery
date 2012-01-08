var nextobj = false;
var prevobj = false;
var shift = 0;
var nextshift = 1;
var prevshift = 2;

function load(pic, goal){
	// Prev
	if(pic.prev === false) $("#prev").fadeOut()
	else $("#prev").fadeIn()
	$("#prev img").attr("src", "../thumbs/"+pic.prev+".jpg")
	$("#prev").attr("href", pic.prev+".html")
	
	// Prepare next
	var preparenext = function(){
		$.getJSON(pic.next+".json", function(data, status){
			nextobj = data;
			if(shift == 0){
				$("#shift").attr("src", "../pictures/"+nextobj.current+".jpg");
				nextshift = 1;
			}else{
				$("#main").attr("src", "../pictures/"+nextobj.current+".jpg");
				nextshift = 0;
			}
			if(prevobj == false){
				$.getJSON(pic.prev+".json", dopref);
			}else{
				dopref(prevobj);
			}
		});
		var dopref = function(data, status){
			prevobj = data;
			if(shift != 2){
				$("#shift2").attr("src", "../pictures/"+prevobj.current+".jpg");
				prevshift = 2;
			}else{
				if(nextshift == 0){
					$("#shift").attr("src", "../pictures/"+prevobj.current+".jpg");
					prevshift = 1;
				}else{
					$("#main").attr("src", "../pictures/"+prevobj.current+".jpg");
					prevshift = 0;					
				}
			}
		}
	}
	
	// Transition
	$(".exif").animate({opacity: 0}, 500);
	if(goal == 1){
		$("#shift2").animate({'opacity': 0}, 1000);
		$("#main").animate({'opacity': 0}, 1000, preparenext);
		$("#shift").animate({'opacity': 1}, 1000);
		shift = 1;
	}else if(goal == 2){
		if(shift == 0){
			$("#main").animate({'opacity': 0}, 1000, preparenext);
			$("#shift").animate({'opacity': 0}, 1000);
		}else{
			$("#shift").animate({'opacity': 0}, 1000, preparenext);
			$("#main").animate({'opacity': 0}, 1000);
		}
		$("#shift2").animate({'opacity': 1}, 1000);
		shift = 2;
	}else if(goal == 0){
		if(shift == 1){
			$("#shift").animate({'opacity': 0}, 1000, preparenext);
			$("#shift2").animate({'opacity': 0}, 1000);
		}else{
			$("#shift2").animate({'opacity': 0}, 1000, preparenext);
			$("#shift").animate({'opacity': 0}, 1000);
		}
		$("#main").animate({'opacity': 1}, 1000);
		shift = 0;
	}
	console.log(pic.exifhtml);
	if(pic.exifhtml)
		$("#exifarea").html(pic.exifhtml);
	else
		$("#exifarea").html("");
		
	// Next
	if(pic.next === false) $("#next").fadeOut();
	else $("#next").fadeIn();
	$("#next img").attr("src", "../thumbs/"+pic.next+".jpg");
	$("#next").attr("href", pic.next+".html");
}

$(document).ready(function(){
	if(location.hash.length > 3){
		location.href = location.hash.substr(1)+".html";
	}
	$("#main, #shift, #shift2, .exif").bind("click", function(){
		if($(".exif").css("opacity") == 0){
			if($("#map").length > 0) r = 1
			else r = 0.7
			$(".exif").animate({opacity: r}, 1000);
		}else{
			$(".exif").animate({opacity: 0}, 1000);
		}
	});
	$("#main").css("opacity", 0);
	$(".thumb").bind("mouseenter", function(){
		if($(this).children("span").css("opacity") == 0.5){
			$(this).children("span").animate({opacity: 0.9}, 100);
		}
	});
	$(".thumb").bind("mouseleave", function(){
		$(this).children("span").animate({opacity: 0.5}, 100);
	});
	$("#main").bind("load", function(){
		$("#main").css("position", "absolute").css("top", "8px").css("left", "50%").css("margin-left", parseInt($("#main").width()*(-1/2))+"px")
		$("#main").fadeIn();
	});
	$("#shift, #shift2").bind("load", function(){
		$(this).css("position", "absolute").css("top", "8px").css("left", "50%").css("margin-left", parseInt($(this).width()*(-1/2))+"px")
	});
	$(window).resize(function() {
		$("#main, #shift, #shift2").each(function(k,v){
			$(v).css("position", "absolute").css("top", "8px").css("left", "50%").css("margin-left", parseInt($(v).width()*(-1/2))+"px")
		});
	});
	
	$("#next").bind("click", function(){
		if(!nextobj){ return true; }
		prevobj = current;
		location.hash = nextobj.current;
		current = nextobj;
		nextobj = false;
		load(current, nextshift);
		return false;
	});
	$("#prev").bind("click", function(){
		if(!prevobj){ return true; }
		nextobj = current;
		location.hash = prevobj.current;
		current = prevobj;
		prevobj = false;
		load(current, prevshift);
		return false;
	});
	load(current, 0);
});
