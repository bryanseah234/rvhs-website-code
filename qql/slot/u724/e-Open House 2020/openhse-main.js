$(function(){
	if ($("BODY").hasClass("PTP119601")) {
		$(".main_area").prepend('<div id="opennhse-header"><a href="/" id="schlogo" alt="RVHS Logo">RVHS</a><span id="rvhsoh-rwdmenu"></span><h2>Welcome to our e-Open House for Secondary 1 Admission!</h2><div id="opennhse-search-cnt"><a href="/others/search&func=search"><span id="openhse-header-search"></span></a></div><ul id="opennhse-navi"></ul></div>');
		
		$(".main_area").append('<div id="openhse-footer"><ul class="col3-layout"><li><h2 id="openhse-footer-schname">River Valley High School</h2><ul id="rvhs-contact"><li>6 Boon Lay Avenue Singapore 649961</li><li>6567 8115</li><li>rvhs@moe.edu.sg (for general enquiries) </li></ul></li><li><ul id="links"><li><a href="/others/privacy-statement" target="">Privacy Statement</a></li><li><a href="https://www.tech.gov.sg/report_vulnerability" target="_blank">Report Vulnerability</a></li><li><a href="/others/terms-of-use" target="">Terms of Use</a></li><li><a href="/others/sitemap" target="">Sitemap</a></li></ul></li><li><h2>Follow Us</h2><ul id="rvhs-social"><li><a id="facebook" href="https://www.facebook.com/River-Valley-High-School-Singapore-Official-352563478111277/" target="_blank">Facebook</a></li><li><a id="instg" href="https://www.instagram.com/rivervalleysg/?hl=en" target="_blank">Instagram</a></li><li><a id="yt" href="https://www.youtube.com/channel/UC3R6nzwepYfL_CRdPGWGwvA/" target="_blank">Youtube</a></li></ul></li></ul><p>COPYRIGHT © 2016 - RIVER VALLEY HIGH SCHOOL. ALL RIGHTS RESERVED</p></div>');
		
		var target = "";
		if ($("#openhse-vid-cnt").length>0) target = "_blank";
		
		var aboutsubpages = '<ul><li><a href="/e-open-house/about-rv/a-world-class-educational-institution" target="'+target+'">A World-Class Educational Institution</a></li><li><a href="/e-open-house/about-rv/vision-mission-motto" target="'+target+'">Vision, Mission, Motto</a></li><li><a href="/e-open-house/about-rv/school-values-and-spirit" target="'+target+'">School Values and Spirit</a></li><li><a href="/e-open-house/about-rv/school-history" target="'+target+'">School History</a></li><li><a href="/e-open-house/about-rv/school-partners" target="'+target+'">School Partners</a></li><li><a href="/e-open-house/about-rv/contact-info" target="'+target+'">Contact Info</a></li></ul>';
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/about-rv'>About RV<br>关于立化</a>"+aboutsubpages+"</li>");
			
		var rvipsubpages = '<ul><li><a href="/e-open-house/rvip/school-prospectus" target="'+target+'">School Prospectus</a></li><li><a href="/e-open-house/rvip/integrated-programme" target="'+target+'">Integrated Programme</a></li><li><a href="/e-open-house/rvip/rvip-flagship-programmes" target="'+target+'">RVIP Flagship Programmes</a><li><a href="/e-open-house/rvip/academic-programme" target="'+target+'">Academic Programme</a></li><li><a href="/e-open-house/rvip/non-academic-programme" target="'+target+'">Non-Academic Programme</a></li><li><a href="/e-open-house/rvip/co-curricular-activities-curriculum" target="'+target+'">Co-Curricular Activities Curriculum</a></li><li><a href="/e-open-house/rvip/internationalisation-programme" target="'+target+'">Internationalisation Programme</a></li><li><a href="/e-open-house/rvip/rvhs-ict-programme" target="'+target+'">RVHS ICT Programme</a></li></ul>';		
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/rvip'>RVIP<br>立化综合课程</a>"+rvipsubpages+"</li>");
		
		$("#opennhse-navi").append("<li><a href='/e-open-house/home#experience'>The RV Experience<br>立化学习旅程</a></li>");
		
		var achievementsubpages = '<ul><li><a href="/e-open-house/achievements/scholarship-recipients" target="'+target+'">Scholarship Recipients</a></li><li><a href="/e-open-house/achievements/outstanding-achievements" target="'+target+'">Outstanding Achievements&nbsp;</a></li><li><a href="/e-open-house/achievements/2019-achievements" target="'+target+'">2019 Achievements</a></li><li><a href="/e-open-house/achievements/2018-achievements" target="'+target+'">2018 Achievements</a></li><li><a href="/e-open-house/achievements/2019-gce-a-level-results" target="'+target+'">2019 GCE A-Level Results</a></li></ul>';		
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/achievements'>Achievements<br>荣誉榜</a>"+achievementsubpages+"</li>");
		
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/facilities'>Facilities<br>学校设施</a></li>");
		
		var ourstoriessubpages = '<ul><li><a href="/e-open-house/our-stories/rv60" target="'+target+'">RV60</a></li><li><a href="/e-open-house/our-stories/123243" target="'+target+'">立化情 • 青春彼岸</a></li><li><a href="/e-open-house/our-stories/rv-times" target="'+target+'">RV Times</a></li><li><a href="/e-open-house/our-stories/rv-montage" target="'+target+'">RV Montage</a></li><li><a href="/e-open-house/our-stories/westories" target="'+target+'">WEStories</a></li></ul>';
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/about-rv'>Our Stories<br>立化故事</a>"+ourstoriessubpages+"</li>");
		
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/dsa'>DSA<br>直接招生计划</a></li>");
		$("#opennhse-navi").append("<li><a target='"+target+"' href='/e-open-house/faqs'>FAQs<br>答客问</a></li>");
	
		$(".PTP119601 #opennhse-header #rvhsoh-rwdmenu").click(function(){
			$(".PTP119601 #opennhse-header #opennhse-navi").toggleClass("active");			
		});
		
		$(".main_area").on("click","#opennhse-navi > LI > A",function(){
			if ($(".PTP119601 #opennhse-header #opennhse-navi").hasClass("active")) {
				var par = $(this).closest("LI");
				if ($(par).find("UL").length>0) {
					$(par).toggleClass("active");
					return false;
				} 
			}
		});
	}
});