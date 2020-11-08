var offset = 0;
var cur = 1;

var nowDTime= new Date();
var startDTime = new Date(2020, 03, 25, 8, 45);
var endDTime = new Date(2020, 03, 25, 13, 0);

$(function(){

	$("#openhse-qna").click(function(){
		if ((nowDTime>=startDTime)&&(nowDTime<=endDTime)) {
			window.open('https://www.youtube.com/user/RVHSLIVE');
		}
		return false;
	});

	$("#openhse-vid-controls .play").click(function(){
		if (!$(this).hasClass("pause")) {
			$('#openhse-vid').trigger('play');
		} else {
			$('#openhse-vid').trigger('pause');
		}
		$(this).toggleClass("pause");
	});
	
	$("#openhse-vid-controls .audio").click(function(){
		$('#openhse-vid').prop('muted', !$(this).hasClass("mute"));		
		$(this).toggleClass("mute");	
	});	
	
	offset = $("#prospectus-cnt #prospectus-slider").width();
	$("#prospectus-cnt #prospectus-slider > UL LI").width(offset);
	
	$("#prospectus-slider UL").css("marginLeft","0px");
	$(".cur").text("1");
  $(".prospectus-controls").on("click",".btn",function(){
		if ($( "#prospectus-slider UL:animated" ).length>0) return;
		var moveOffset = 0;
		var curOffset = parseInt($("#prospectus-slider UL").css("marginLeft"));

    if ($(this).hasClass("next")) {
			if (parseInt(cur)<22) {	
				cur = cur + 1; 
				moveOffset = curOffset - offset;
			}
			else { return false; }
		} else {
			if (parseInt(cur)>1) {	
				cur = cur - 1; 
				moveOffset = curOffset + offset;
			}
			else { return false; }
		}
		    
		$("#prospectus-slider UL").animate({
			marginLeft:moveOffset+"px"
		},1000,function(){
			$(".cur").text(cur);
		});
  });
	
	$("#morevid").click(function(){
		$(".rvhs-exp-list").addClass("active");
		$(this).hide();
	});	
});