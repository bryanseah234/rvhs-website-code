$(function(){
	$(".main_area .mobile-menu").html("");
	$(".main_area .mobile-menu").append($(".main_area UL.sitemenu").clone(true));
	
	$(".mobile-menu UL.sitemenu LI TABLE.dropmenu").each(function(){		
		//$(this).remove();
		var cid = $(this).attr("id").split("_");
		$("<table class='mob_submenu' id='submenu_"+cid[1]+"'></table>").insertAfter($(this));
		$("#submenu_"+cid[1]).html($(this).html());
		
		$(this).remove();
		
	});
	$(".mobile-menu .mob_submenu td a").each(function(){
		$(this).attr('id', 'mo_' + $(this).attr("id"));
	});
	$(".mobile-menu .mob_submenu .dropmenu.drop_right_").each(function(){
		$(this).attr('id', 'mo_' + $(this).attr("id"));
	});
	$(".top-menu").before().click(function(event){
		$(".main_area .mobile-menu").toggleClass('active');
	});  
	
	$(".mobile-menu").on("click","a.sitemenu",function(e){
		if($(this).next(".mob_submenu").length>0){
			e.preventDefault();
			if($(this).next(".mob_submenu.active").length>0){
				$(this).next(".mob_submenu").removeClass('active');
			}
			else{
				$(".mob_submenu").removeClass('active');
				$(this).next(".mob_submenu").addClass('active');
			}
		}
	});
        $('.mobile-menu ul.sitemenu table.mob_submenu .dropmenu').prev('a').click(function(e){
    	   e.preventDefault();
           $(this).next().toggleClass('active');
        });
	
});