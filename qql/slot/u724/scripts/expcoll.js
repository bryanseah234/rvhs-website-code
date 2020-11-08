$(function(){
	$(".content_area").on("click",".expcoll H2",function(){
		var par = $(this).closest(".expcoll");
		if ($(this).hasClass("show"))	{	
			$(par).find("DIV:first").slideUp();
			$(par).removeClass("exopen");
			$(this).removeClass("show"); 
		}
		else				{	
			$(par).find("DIV:first").slideDown();
			$(par).addClass("exopen");
			$(this).addClass("show"); 	
		}
	});
	
	$("SPAN.expall").click(function(){
		$(".expcoll").each(function(){
			if (!$(this).hasClass("exopen")) {
				$(this).find("H2:first").click();
			}
		});
	});
	
	$("SPAN.collall").click(function(){
		$(".expcoll").each(function(){
			if ($(this).hasClass("exopen")) {
				$(this).find("H2:first").click();
			}
		});
	});
});// JavaScript Document