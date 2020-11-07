(function() {
  var ctr=ive_controller('mydocs_slidebox');
  if (!ctr.build_func) {
    ctr.build_func=function(opts) {
      if (!this.dom) return; // relayout fires this method, don't know why
      var $srcdom=$('ul.gv_main',this.dom);
      if ($srcdom.length) {
	// first build
	this.options=opts; // keep the orignal opts
	this.idata.orig_html=$srcdom.parent().clone().html(); // keep the orig dom html
      }
      else {
	// rebuild
	for(k in opts) this.options[k]=opts[k]; // overwrite opts
	$('.iveo_output',this.dom).html(this.idata.orig_html);
	$srcdom=$('ul.gv_main',this.dom);
      }
      
      this.options.frame_gap = 0;
      if (this.options.frame) { this.options.frame_gap = 1; }

      // create using jquery 
      $srcdom.galleryView({
	easing:'easeOutExpo',
	panel_animation: this.options.anim||'slide',
	panel_width: this.options.panel_width||550,
	panel_height: this.options.panel_height||400,
	panel_scale: this.options.panel_scale||'crop',
	transition_interval: this.options.transition_interval||4000,
	frame_width: 55,
	frame_gap: this.options.frame_gap,
	show_overlays: true
      })

      $('.gv_overlay,.gv_showOverlay',this.dom).css({opacity:0.6});

      if (!this.options.thumbnails) {
	$('.gv_filmstripWrap,.gv_navWrap',this.dom).hide();
	$('.gv_galleryWrap',this.dom).height($('.gv_panelWrap',this.dom).outerHeight());
      }
      if (!this.options.description) $('.gv_showOverlay,.gv_overlay').hide();
      if (this.options.autoplay) $('.gv_navWrap .gv_navPlay',this.dom).click();
      if (!this.options.frame) $('.gv_galleryWrap',this.dom).css({ 'background-color':'inherit'});
    };
  }

  if (!ctr.resize_func) {
    ctr.resize_func=function(dom,w,h) {
      var args={};
      if (typeof w!='undefined') args.panel_width=w;
      if (typeof h!='undefined') args.panel_height=h-$('.gv_filmstripWrap:visible',dom).height()||0;
      ctr.build(dom,args);
    }
  }
})();
