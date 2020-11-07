/* vim: ts=2

	GalleryView - jQuery Content Gallery Plugin
	Author:		Jack Anderson
	Version:	3.0 DEVELOPMENT

  	See README.txt for instructions on how to markup your HTML
*/

// Make sure Object.create is available in the browser (for our prototypal inheritance)
// Courtesy of Douglas Crockford
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

(function ($) {
	// custom image object
	var gvImage = function (img) {

		this.src = { 
			panel: img.attr('tobesrc'),
			frame: img.attr('frame') || img.attr('tobesrc'),
			natwidth: img.attr('gvwidth'),
			natheight: img.attr('gvheight')
		};
		this.scale = {
			panel: null,
			frame: null
		};
		this.height = 0;
		this.width = 0;
		this.attrs = {
			title: img.attr('title'),
			description: img.attr('longdesc')
		};
		this.href = null;
		this.dom_obj = null;
		
		return this;
	},
	
	// utility function wrapper
	gv = {
		getInt: function(i) {
			i = parseInt(i, 10);
			return isNaN(i) ? 0 : i;
		},
		innerWidth: function(elem) {
//		  console.log(elem.get(0).width);
			return this.getInt(elem.css('width'));	
		},
		outerWidth: function(elem) {
			return 	this.innerWidth(elem) + 
					this.extraWidth(elem);
		},
		extraWidth: function(elem) {
			return	this.getInt(elem.css('paddingLeft')) +
					this.getInt(elem.css('paddingRight')) +
					this.getInt(elem.css('borderLeftWidth')) +
					this.getInt(elem.css('borderRightWidth'));	
		},
		innerHeight: function(elem) {
			return this.getInt(elem.css('height'));
		},
		outerHeight: function(elem) {
			return 	this.innerHeight(elem) + 
					this.extraHeight(elem);
		},
		extraHeight: function(elem) {
			return 	this.getInt(elem.css('paddingTop')) +
					this.getInt(elem.css('paddingBottom')) +
					this.getInt(elem.css('borderTopWidth')) +
					this.getInt(elem.css('borderBottomWidth'));
		}
	},
	
	/*
		GalleryView - Object
			The main gallery class
	*/		
	GalleryView = {
		// array of dom elements
		elems: [
			'.gv_galleryWrap',	'.gv_gallery',		'.gv_panelWrap',		'.gv_panel',
			'img.gv_image',		'.gv_infobar',		'.gv_filmstripWrap',	'.gv_filmstrip',
			'.gv_frame',		'.gv_thumbnail', 	'.gv_caption', 			'img.gv_thumb',
			'.gv_navWrap',		'.gv_navNext',		'.gv_navPrev',			'.gv_navPlay',
			'.gv_panelNavNext',	'.gv_panelNavPrev',	'.gv_overlay',			'.gv_showOverlay'
		],
		
		// create a jQuery element and apply attributes
		createElem: function(attrs,elem) {
			elem = document.createElement(elem);
			var $elem = $(elem);
			return $elem.attr(attrs);
		},
		
		getPos: function (el) {
			var self = this,
				dom = this.dom,
				el = el[0],
				el_id = el.id,
				left = 0,
				top = 0,
				gPos, gLeft, gTop;
				
			if (!el) { return { top: 0, left: 0 }; }
			
			if (el.offsetParent) {
				do {
					left += el.offsetLeft;
					top += el.offsetTop;
				} while (el = el.offsetParent);
			}
			
			//If we want the position of the gallery itself, return it
			if (el_id === self.id) { return { left: left, top: top }; }
			
			//Otherwise, get position of element relative to gallery
			else {
				gPos = self.getPos(dom.galleryWrap);
				gLeft = gPos.left;
				gTop = gPos.top;
				return { left: left - gLeft, top: top - gTop };
			}
		},

		mouseIsOverGallery: function (x, y) {
			var self = this,
				dom = this.dom,
				pos = this.getPos(dom.gv_galleryWrap),
				top = pos.top,
				left = pos.left;
				
			return x > left && x < left + gv.outerWidth(dom.gv_galleryWrap) && y > top && y < top + gv.outerHeight(dom.gv_galleryWrap);
		},

		mouseIsOverPanel: function (x, y) {
			var self = this,
				dom = this.dom,
				pos = this.getPos(dom.gv_panelWrap),
				gPos = this.getPos(dom.gv_galleryWrap),
				top = pos.top + gPos.top,
				left = pos.left + gPos.left;
				
			return x > left && x < left + gv.outerWidth(dom.gv_panelWrap) && y > top && y < top + gv.outerHeight(dom.gv_panelWrap);
		},
		
		// create gvImage objects for each image in gallery
		storeImages: function() {
			var self = this;
			this.sourceImgs = $('li>img',this.$el);
			this.numImages = this.sourceImgs.length;
			this.gvImages = [];
			this.sourceImgs.each(function(i,img) {
				self.gvImages[i] = new gvImage($(img));
			});
		},
		
		setDimensions: function() {
			var self = this,
				dom = this.dom,
				widths = {
					prev: gv.innerWidth(dom.gv_navPrev),
					play: gv.innerWidth(dom.gv_navPlay),
					next: gv.innerWidth(dom.gv_navNext),
					filmstrip: this.opts.frame_width,
					fsMax: 0,
					fsFull: 0
				},
				heights = {
					prev: gv.innerHeight(dom.gv_navPrev),
					play: gv.innerHeight(dom.gv_navPlay),
					next: gv.innerHeight(dom.gv_navNext),
					filmstrip: this.opts.frame_height + (this.opts.show_captions ? gv.outerHeight(dom.gv_caption) : 0),
					fsMax: 0,
					fsFull: 0
				},
				panels = [];
			
			// nav
			if(this.filmstripOrientation === 'vertical' && (this.opts.frame_width + gv.extraWidth(dom.gv_frame)) < (widths.prev + widths.play + widths.next)) {
				// console.log('stacking');
				dom.gv_navWrap.css({
					width: Math.max(widths.prev, widths.play, widths.next),
					height: heights.prev + heights.play + heights.next
				});
			} else {
				dom.gv_navWrap.css({
					width: widths.prev + widths.play + widths.next,
					height: Math.max(heights.prev,heights.play,heights.next)
				});
			}
			
			// panels
			dom.gv_panel.css({
				width: this.opts.panel_width,
				height: this.opts.panel_height
			});
			dom.gv_panelWrap.css({
				width: gv.outerWidth(dom.gv_panel),
				height: gv.outerHeight(dom.gv_panel)
			});
			dom.gv_overlay.css({
				width: this.opts.panel_width
			});
			
			
			
			$.each(this.gvImages,function(i,img) {
				dom.gv_panelWrap.append(dom.gv_panel.clone(true));
			});
			
			dom.gv_panels = dom.gv_panelWrap.find('.gv_panel');
			dom.gv_panels.remove();
			
			// filmstrip
			dom.gv_thumbnail.css({
				width: this.opts.frame_width,
				height: this.opts.frame_height
			});
			dom.gv_frame.css({
				width: gv.outerWidth(dom.gv_thumbnail),
				height: gv.outerHeight(dom.gv_thumbnail) + (this.opts.show_captions ? gv.outerHeight(dom.gv_caption) : 0),
				marginRight: this.opts.frame_gap,
				marginBottom: this.opts.frame_gap
			});
			
			
			if(this.filmstripOrientation === 'horizontal') {
				this.filmstripSize = Math.floor((gv.outerWidth(dom.gv_panelWrap) - gv.outerWidth(dom.gv_navWrap)) / (gv.outerWidth(dom.gv_frame) + this.opts.frame_gap));
				widths.fsMax = this.filmstripSize * (gv.outerWidth(dom.gv_frame) + this.opts.frame_gap);
				widths.fsFull = this.gvImages.length * (gv.outerWidth(dom.gv_frame) + this.opts.frame_gap);
				widths.filmstrip = Math.min(widths.fsMax,widths.fsFull);
			} else {
				this.filmstripSize = Math.floor((gv.outerHeight(dom.gv_panelWrap) - gv.outerHeight(dom.gv_navWrap)) / (gv.outerHeight(dom.gv_frame) + this.opts.frame_gap));
				heights.fsMax = this.filmstripSize * (gv.outerHeight(dom.gv_frame) + this.opts.frame_gap);
				heights.fsFull = this.gvImages.length * (gv.outerHeight(dom.gv_frame) + this.opts.frame_gap);
				heights.filmstrip = Math.min(heights.fsMax,heights.fsFull);
			}
			dom.gv_filmstripWrap.css({
				width: widths.filmstrip,
				height: heights.filmstrip
			});
			
			// gallery
			if(this.opts.show_filmstrip) {
				if(this.filmstripOrientation === 'horizontal') {
					dom.gv_gallery.css({
						width: gv.outerWidth(dom.gv_panelWrap),
						height: gv.outerHeight(dom.gv_panelWrap) + this.opts.frame_gap + Math.max(gv.outerHeight(dom.gv_filmstripWrap),gv.outerHeight(dom.gv_navWrap))
					});
				} else {
					dom.gv_gallery.css({
						width: gv.outerWidth(dom.gv_panelWrap) + this.opts.frame_gap + Math.max(gv.outerWidth(dom.gv_filmstripWrap),gv.outerWidth(dom.gv_navWrap)),
						height: gv.outerHeight(dom.gv_panelWrap)
					});	
				}
			} else {
				dom.gv_gallery.css({
					width: gv.outerWidth(dom.gv_panelWrap),
					height: gv.outerHeight(dom.gv_panelWrap)
				});	
			}
			
			dom.gv_galleryWrap.css({
					width: gv.outerWidth(dom.gv_gallery),
					height: gv.outerHeight(dom.gv_gallery),
					padding: this.opts.frame_gap
			});
		},
		
		setPositions: function() {
			var self = this,
				dom = this.dom,
				navVert = 0, fsVert = 0,
				navHorz = 0, fsHorz = 0,
				vert, horz;
			
			// determine vertical or horizontal offset
			// if negative, apply to filmstrip, otherwise apply to navbar
			if(this.filmstripOrientation === 'horizontal') {
				vert = Math.round((gv.outerHeight(dom.gv_filmstripWrap) - gv.outerHeight(dom.gv_navWrap)) / 2);
				if(vert < 0) { fsVert = -1 * vert; }
				else { navVert = vert; }
			} else {
				horz = Math.round((gv.outerWidth(dom.gv_filmstripWrap) - gv.outerWidth(dom.gv_navWrap)) / 2);
				if(horz < 0) { fsHorz = -1 * horz; }
				else { navHorz = horz; }
			}
			
			// for horizontal filmstrips w/o navigation, center the filmstrip under the panel
			if(!this.opts.show_filmstrip_nav && this.filmstripOrientation === 'horizontal') {
				fsHorz = Math.floor((gv.outerWidth(dom.gv_panelWrap) - gv.outerWidth(dom.gv_filmstripWrap)) / 2);
			}
			
			dom.gv_panelNavNext.css({ top: (gv.outerHeight(dom.gv_panel) - gv.outerHeight(dom.gv_panelNavNext)) / 2, right: 10 });
			dom.gv_panelNavPrev.css({ top: (gv.outerHeight(dom.gv_panel) - gv.outerHeight(dom.gv_panelNavPrev)) / 2, left: 10 });
			
			// pin elements to gallery corners according to filmstrip position
			switch(this.opts.filmstrip_position) {
				case 'top':
					dom.gv_navWrap.css({ top: navVert, right: navHorz });
					dom.gv_panelWrap.css({ bottom: 0, left: 0 });
					dom.gv_filmstripWrap.css({ top: fsVert, left: fsHorz });
					break;
				
				case 'right':
					dom.gv_navWrap.css({ bottom: navVert, right: navHorz });
					dom.gv_panelWrap.css({ top: 0, left: 0 });
					dom.gv_filmstripWrap.css({ top: fsVert, right: fsHorz });
					break;
				
				case 'left':
					dom.gv_navWrap.css({ bottom: navVert, left: navHorz });
					dom.gv_panelWrap.css({ top: 0, right: 0 });
					dom.gv_filmstripWrap.css({ top: fsVert, left: fsHorz });
					break;
				
				default:
					dom.gv_navWrap.css({ bottom: navVert, right: navHorz });
					dom.gv_panelWrap.css({ top: 0, left: 0 });
					dom.gv_filmstripWrap.css({ bottom: fsVert, left: fsHorz });
					break;
			}
			
			if(this.opts.overlay_position === 'top') {
				dom.gv_overlay.css({ top: 0, left: -99999 });
				dom.gv_showOverlay.css({ top: 0, left: 0 });
			} else {
				dom.gv_overlay.css({ bottom: 0, left: -99999 });
				dom.gv_showOverlay.css({ bottom: 0, left: 0 });
			}
			
			if(!this.opts.show_filmstrip_nav) {
				dom.gv_navWrap.remove();	
			}
		},
		
		buildFilmstrip: function() {
			var self = this,
				dom = this.dom,
				framesLength = this.gvImages.length * ((this.filmstripOrientation === 'horizontal' ? this.opts.frame_width : this.opts.frame_height) + this.opts.frame_gap);
			
			dom.gv_frame.append(dom.gv_thumbnail);
			if(this.opts.show_captions) { 
				dom.gv_frame.append(dom.gv_caption);
			}
			dom.gv_thumbnail.css('opacity',this.opts.frame_opacity);
			
			dom.gv_thumbnail.bind({
				mouseover: function() {
					if(!$(this).hasClass('current')) {
						$(this).stop().animate({opacity:1},250);
					}
				},
				mouseout: function() {
					if(!$(this).hasClass('current')) {
						$(this).stop().animate({opacity:self.opts.frame_opacity},250);
					}
				}
			});
			
			// Drop a clone of the frame element into the filmstrip for each source image
			$.each(this.gvImages,function(i,img) {
				dom.gv_frame.clone(true).prependTo(dom.gv_filmstrip);
			});
			
			dom.gv_filmstrip.css({
				width: gv.outerWidth(dom.gv_frame),
				height: gv.outerHeight(dom.gv_frame)
			});
			
			// If we are scrolling the filmstrip, and we can't show all frames at once,
			// make two additional copies of each frame
			if(this.filmstripOrientation === 'horizontal') {
				if(this.opts.filmstrip_style === 'scroll' && framesLength > gv.innerWidth(dom.gv_filmstripWrap)) {
					dom.gv_filmstrip.find('.gv_frame').clone(true).appendTo(dom.gv_filmstrip).clone(true).appendTo(dom.gv_filmstrip);
					dom.gv_filmstrip.css('width',framesLength * 3);
					this.scrolling = true;
				} else {
					dom.gv_filmstrip.css('width',framesLength);
				}
			} else {
				if(this.opts.filmstrip_style === 'scroll' && framesLength > gv.innerHeight(dom.gv_filmstripWrap)) {
					dom.gv_filmstrip.find('.gv_frame').clone(true).appendTo(dom.gv_filmstrip).clone(true).appendTo(dom.gv_filmstrip);
					dom.gv_filmstrip.css('height',framesLength * 3);
					this.scrolling = true;
				} else {
					dom.gv_filmstrip.css('height',framesLength);
				}
			}
			
			dom.gv_frames = dom.gv_filmstrip.find('.gv_frame');
			$.each(dom.gv_frames,function(i,frame) {
				$(frame).data('frameIndex',i);						  
			});
			dom.gv_thumbnails = dom.gv_filmstrip.find('div.gv_thumbnail');
		},
		
		buildGallery: function() {
			var self = this,
				dom = this.dom;
			
			this.setDimensions();
			this.setPositions();
			
			if(this.opts.show_filmstrip) {
				this.buildFilmstrip();
			}
		},
		
		showInfoBar: function() {
			if(!this.opts.show_infobar) { return; }
			var self = this,
				dom = this.dom;
			
			dom.gv_infobar.stop().stopTime('hideInfoBar_' + self.id).html((this.iterator+1) + ' of ' + this.numImages).show().css('opacity',1);
			
			dom.gv_infobar.oneTime(2000 + this.opts.transition_speed,'hideInfoBar_' + self.id,function() {
					dom.gv_infobar.fadeOut(1000);
				});
		},
		
		initImages: function() {
			var self = this,
				dom = this.dom;
			
			$.each(this.gvImages,function(i,gvImage) {
				var img = $('<img/>');
				var image_ready_fn=function() {
					var _img = $(this);
					var
						index = _img.data('index'),
						width = this.width,
						height = this.height,
						parent = _img.parent(),
						parentType = parent.hasClass('gv_panel') ? 'panel' : 'frame'
					;

					// 2013-04-10 joel: slow loading, fix it with hints from caller
					if (parentType=='panel' && !width) {
					  width=gvImage.src.natwidth;
					  height=gvImage.src.natheight;
					}

					// 2013-04-09 joel: fix IE width/height =0
					if (!width) {
						var newimg=new Image();
						newimg.src=this.src;
						width=newimg.width;
						height=newimg.height;
					}

					var
						widthFactor = parent.width() / width,
						heightFactor = parent.height() / height,
						// widthFactor = gv.innerWidth(parent) / width,
						// heightFactor = gv.innerHeight(parent) / height,
						heightOffset = 0, widthOffset = 0;

					
					gvImage.scale[parentType] = ((self.opts[parentType+'_scale'] === 'fit') ? Math.min(widthFactor,heightFactor) : Math.max(widthFactor,heightFactor));
//					console.log('-- widthFactor:'+widthFactor+' width:'+width+' height:'+height+' scale:'+gvImage.scale[parentType]);
					
					widthOffset = Math.round((gv.innerWidth(parent) - (width * gvImage.scale[parentType])) / 2);
					heightOffset = Math.round((gv.innerHeight(parent) - (height * gvImage.scale[parentType])) / 2);	
					
					var tmp;
					_img.css({
						width: width * gvImage.scale[parentType],
						height: height * gvImage.scale[parentType],
						top: heightOffset,
						left: widthOffset
					});
//					console.log(tmp.width+'x'+tmp.height+' ('+tmp.left+','+tmp.top+') src:'+this.src);
					
					if(parentType === 'frame') {
						_img.fadeIn();
						parent.parent().removeClass('gv_frame-loading');
						parent.parent().find('.gv_caption').html(gvImage.attrs.title);
					} else if(index === self.opts.start_frame - 1) {
						parent.prependTo(dom.gv_panelWrap);
						parent.removeClass('gv_panel-loading');
						_img.fadeIn();
						self.showInfoBar();
					} else {
						parent.removeClass('gv_panel-loading');
						_img.show();
					}
				};

				img.hide().data('index',i);
				img.bind('load.galleryview',image_ready_fn);
				
				if(self.opts.show_panels) {
					var nimg=img.clone(true);
					nimg.data('tobesrc',gvImage.src.panel);
					nimg.appendTo(dom.gv_panels.eq(i));
					if (i<=1) nimg.attr('src',gvImage.src.panel); // joel: load first and second
				}
				
				if(self.opts.show_filmstrip) {
					img.clone(true).appendTo(dom.gv_thumbnails.eq(i)).attr('src',gvImage.src.frame);
					
					if(dom.gv_frames.length > dom.gv_panels.length) {
						img.clone(true).appendTo(dom.gv_thumbnails.eq(i+self.numImages)).attr('src',gvImage.src.frame);
						img.clone(true).appendTo(dom.gv_thumbnails.eq(i+self.numImages+self.numImages)).attr('src',gvImage.src.frame);
					}
				}
			});
		},

		// 2012-10-24  joel: preloading images
		preload:function(i) {
			var $img=this.dom.gv_panels.eq(i).find('img');
			if ($img.length && !$img.attr('src')) {
			  var src;
				$img.css('display','inline').attr('src',src=$img.data('tobesrc'));
//				console.log('preload '+i+' '+src);
			}
		},
		
		showNext: function() {
			this.navAction = 'next';
			this.showItem(this.frameIterator+1);
		},
		
		showPrev: function() {
			this.navAction = 'prev';
			this.showItem(this.frameIterator-1);
		},
		
		showItem: function(i) {
			if(isNaN(i)) { return; }
			if(!this.opts.show_filmstrip) { i = i % this.numImages; }
			
			var self = this,
				dom = this.dom,
				frame_i = i,
				newPanelStart,
				oldPanelEnd,
				oldIterator,
				panel,
				playing = false;
				
			// don't go out of bounds
			if(i >= this.numImages) {
				i = i % this.numImages;
			} else if(i < 0) {
				i = this.numImages - 1;
				if(dom.gv_frames != undefined) {
					frame_i = dom.gv_frames.length - 1;
				} else {
					frame_i = dom.gv_panels.length - 1;
				}
			}
			
			panel = dom.gv_panels.eq(i);
			self.preload(i);
			if (i>0) self.preload(i-1);
			self.preload(i+1);
			
			playing = this.playing;
			if(playing) {
				this.stopSlideshow();
			}
			this.unbindActions();
			dom.gv_gallery.oneTime(this.opts.transition_speed,'bindActions_' + self.id,function(){ if(playing) { self.startSlideshow(); } self.bindActions(); });
			
			switch(this.opts.panel_animation) {
				case 'crossfade':
					dom.gv_panels.eq(this.iterator).fadeOut(this.opts.transition_speed,function(){$(this).remove();});
					panel.hide().prependTo(dom.gv_panelWrap).fadeIn(this.opts.transition_speed);
					break;
				case 'fade':
					dom.gv_panels.eq(this.iterator).remove();
					panel.hide().prependTo(dom.gv_panelWrap).fadeIn(this.opts.transition_speed);
					break;
				case 'slide':
					// console.log(frame_i,i,this.iterator);
					if(this.navAction === 'next' || (this.navAction === 'frame' && frame_i > this.iterator)) {
						newPanelStart = gv.outerWidth(dom.gv_panel);
						oldPanelEnd = -1 * gv.outerWidth(dom.gv_panel);
					} else {
						newPanelStart = -1 * gv.outerWidth(dom.gv_panel);
						oldPanelEnd = gv.outerWidth(dom.gv_panel);
					}
					
					panel.css({ left:newPanelStart }).appendTo(dom.gv_panelWrap).animate(
						{ left:0 },
						{ duration: this.opts.transition_speed,easing: this.opts.easing }
					);
					
					dom.gv_panels.eq(this.iterator).animate(
						{ left: oldPanelEnd },
						{ duration: this.opts.transition_speed, easing: this.opts.easing, complete: function(){ $(this).remove(); } }
					);
					break;
				default:
					dom.gv_panels.eq(this.iterator).remove();
					panel.prependTo(dom.gv_panelWrap);
					break;
			}
			
			this.updateOverlay(i);
			
			this.iterator = i;
			this.updateFilmstrip(frame_i);
			this.showInfoBar();
			
			
		},
		
		updateOverlay: function(i) {
			var self = this,
				dom = this.dom;
			
			if(this.overlayVisible) {
				this.hideOverlay(function(){
					dom.gv_overlay.html('<h4>'+self.gvImages[i].attrs.title+'</h4><p>'+self.gvImages[i].attrs.description+'</p>');
					self.showOverlay();
				});
			} else {
				dom.gv_overlay.html('<h4>'+self.gvImages[i].attrs.title+'</h4><p>'+self.gvImages[i].attrs.description+'</p>');
				dom.gv_overlay.css(this.opts.overlay_position,-1 * dom.gv_overlay.outerHeight());
			}
			
		},
		
		hideOverlay: function(callback) {
			var self = this,
				dom = this.dom,
				endOverlay = {},
				endButton = {};
				
			callback = callback || function(){};
			
			endOverlay[this.opts.overlay_position] = -1 * dom.gv_overlay.outerHeight();
			endButton[this.opts.overlay_position] = 0;
			
			dom.gv_overlay.animate(endOverlay,{ 
				duration: self.opts.transition_speed / 2, 
				easing: 'swing', 
				complete: callback
			});
			dom.gv_showOverlay.animate(endButton,{
				duration: self.opts.transition_speed / 2,
				easing: 'swing'
			});
			
			this.overlayVisible = false;
		},
		
		showOverlay: function() {
			var self = this,
				dom = this.dom,
				startOverlay = {},
				endOverlay = {},
				endButton = {};
			
			startOverlay[this.opts.overlay_position] = -1 * dom.gv_overlay.outerHeight();
			startOverlay.left = 0;
			
			endOverlay[this.opts.overlay_position] = 0;
			
			endButton[this.opts.overlay_position] = dom.gv_overlay.outerHeight();
			
			dom.gv_overlay.css(startOverlay);
			dom.gv_overlay.animate(endOverlay,{ duration: self.opts.transition_speed / 2, easing: 'swing' });
			dom.gv_showOverlay.animate(endButton,{ duration: self.opts.transition_speed / 2, easing: 'swing' });
			
			this.overlayVisible = true;
		},
		
		updateFilmstrip: function(to) {
			if(!this.opts.show_filmstrip) { this.frameIterator = to; return; }
			var self = this,
				dom = this.dom,
				targetThumbs = dom.gv_thumbnails.eq(this.iterator),
				filmstripIterator,
				distance;
			
			if (targetThumbs.hasClass("current"))	{	 return;	}

			if(this.scrolling) {
				targetThumbs = targetThumbs.
								add(dom.gv_thumbnails.eq(this.iterator + this.numImages)).
								add(dom.gv_thumbnails.eq(this.iterator + (2 * this.numImages)));	
			}
		  
			dom.gv_thumbnails.removeClass('current').animate({ opacity: this.opts.frame_opacity });
			targetThumbs.stop().addClass('current').animate({ opacity: 1 },500);
			
			
			if(this.scrolling) {
				if(this.filmstripOrientation === 'horizontal') {
					distance = (gv.outerWidth(dom.gv_frame) + this.opts.frame_gap) * (this.frameIterator - to);
					
					if(distance > 0) {
						distance = '+=' + Math.abs(distance);
					} else {
						distance = '-=' + Math.abs(distance);
					}
					dom.gv_filmstrip.animate({
						left: distance
					},{
						duration: this.opts.transition_speed, 
						easing: this.opts.easing, 
						complete: function(){
							if(to < self.numImages) {
								dom.gv_filmstrip.css('left',gv.getInt(dom.gv_filmstrip.css('left'))-(self.numImages*(gv.outerWidth(dom.gv_frame)+self.opts.frame_gap)));	
							} else if(to >= (self.numImages * 2)) {
								dom.gv_filmstrip.css('left',gv.getInt(dom.gv_filmstrip.css('left'))+(self.numImages*(gv.outerWidth(dom.gv_frame)+self.opts.frame_gap)));	
							}
							self.frameIterator = (to % self.numImages) + self.numImages;
						}
					});
				} else {
					distance = (gv.outerHeight(dom.gv_frame) + this.opts.frame_gap) * (this.frameIterator - to);
					
					if(distance > 0) {
						distance = '+=' + Math.abs(distance);
					} else {
						distance = '-=' + Math.abs(distance);
					}
					dom.gv_filmstrip.animate({
						top: distance
					},{
						duration: this.opts.transition_speed, 
						easing: this.opts.easing, 
						complete: function(){
							// adjust filmstrip position to ensure that there is always at least one frame behind
							// and (2 * filmstripSize) ahead
							if(to === 0) {
								dom.gv_filmstrip.css('top',gv.getInt(dom.gv_filmstrip.css('top'))-(self.numImages*(gv.outerHeight(dom.gv_frame)+self.opts.frame_gap)));	
								self.frameIterator = self.numImages;
							} else if(to > ((self.numImages * 3) - (self.filmstripSize * 2))) {
								dom.gv_filmstrip.css('top',gv.getInt(dom.gv_filmstrip.css('top'))+(self.numImages*(gv.outerHeight(dom.gv_frame)+self.opts.frame_gap)));	
								self.frameIterator = to - self.numImages;
							} else {
								self.frameIterator = to;
							}
						}
					});
				}
				
			} else {
				this.frameIterator = to;
			}
		},
		
		startSlideshow: function() {
			var self = this,
				dom = this.dom;
			
			this.playing = true;
			dom.gv_galleryWrap.everyTime(this.opts.transition_interval,'slideshow_'+this.id,function(){ self.showNext(); });
		},
		
		stopSlideshow: function() {
			var self = this,
				dom = this.dom;
				
			this.playing = false;
			dom.gv_galleryWrap.stopTime('slideshow_'+this.id);
		},
		
		enablePanning: function() {
			var self = this,
				dom = this.dom;
				
			dom.gv_panel.css('cursor','url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur), n-resize');
			if(this.opts.pan_style === 'drag') {
				dom.gv_panelWrap.delegate('.gv_panel img','mousedown.galleryview',function(e) {
					self.isMouseDown = true;
					$(this).css('cursor','url(http://www.google.com/intl/en_ALL/mapfiles/closedhand.cur), n-resize');
				}).delegate('.gv_panel img','mouseup.galleryview',function(e) {
					self.isMouseDown = false;
					$(this).css('cursor','url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur), n-resize');
				}).delegate('.gv_panel img','mousemove.galleryview',function(e) {
					var distY, distX,
						image = $(this),
						new_top, new_left;

					if(self.isMouseDown) {
						distY = e.pageY - self.mouse.y;
						distX = e.pageX - self.mouse.x;
						new_top = gv.getInt(image.css('top')) + distY;
						new_left = gv.getInt(image.css('left')) + distX;
							
						image.css('cursor','url(http://www.google.com/intl/en_ALL/mapfiles/closedhand.cur), n-resize');
						
						if(new_top > 0) new_top = 0;
						if(new_left > 0) new_left = 0;
						
						if(new_top < (-1 * (gv.outerHeight(image) - gv.innerHeight(dom.gv_panel)))) { new_top = -1 * (gv.outerHeight(image) - gv.innerHeight(dom.gv_panel)); }
						if(new_left < (-1 * (gv.outerWidth(image) - gv.innerWidth(dom.gv_panel)))) { new_left = -1 * (gv.outerWidth(image) - gv.innerWidth(dom.gv_panel)); }
						
						image.css('top',new_top);
						image.css('left',new_left);
					} else {
						image.css('cursor','url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur), n-resize');	
					}
				});
			} else {
				
			}
		},
		
		bindActions: function() {
			var self = this,
				dom = this.dom;
			
			dom.gv_showOverlay.bind('click.galleryview',function(){
				if(self.overlayVisible) {
					self.hideOverlay();
				} else {
					self.showOverlay();
				}
			});
			
			dom.gv_navWrap.delegate('div','click.galleryview',function(){
				var el = $(this);
				if(el.hasClass('gv_navNext')) {
					self.showNext();
				} else if(el.hasClass('gv_navPrev')) {
					self.showPrev();
				} else if(el.hasClass('gv_navPlay')) {
					self.startSlideshow();
					el.removeClass('gv_navPlay').addClass('gv_navPause');
				} else if(el.hasClass('gv_navPause')) {
					self.stopSlideshow();
					el.removeClass('gv_navPause').addClass('gv_navPlay');
				}
				return false;
			});
			
			dom.gv_panelNavNext.bind('click.galleryview',function(){ 
				self.showNext(); 
				return false;
			});
			dom.gv_panelNavPrev.bind('click.galleryview',function(){
				self.showPrev(); 
				return false;
			});
			
			dom.gv_filmstripWrap.delegate('.gv_frame','click.galleryview',function(){
				var el = $(this),
					i = el.data('frameIndex');
				
			  if ($(this).find("DIV.current").length>0)	{	return false; }

				this.navAction = 'frame';
				self.showItem(i);
				return false;
			});
			
			dom.gv_panelWrap.bind('mouseover.galleryview',function(){
				self.showPanelNav();
			}).bind('mouseout.galleryview',function(){
				self.hidePanelNav();
			});
		},
		
		unbindActions: function() {
			var self = this,
				dom = this.dom;
				
			dom.gv_showOverlay.unbind('click.galleryview');
			dom.gv_panelNavNext.unbind('click.galleryview');
			dom.gv_panelNavPrev.unbind('click.galleryview');
			dom.gv_navWrap.undelegate('div','click.galleryview');
			dom.gv_filmstripWrap.undelegate('.gv_frame','click.galleryview');
		},
		
		showPanelNav: function() {
			var self = this,
				dom = this.dom;
				
			dom.gv_panelNavNext.show();
			dom.gv_panelNavPrev.show();	
		},
		
		hidePanelNav: function() {
			var self = this,
				dom = this.dom;
				
			dom.gv_panelNavNext.hide();
			dom.gv_panelNavPrev.hide();	
		},
		
		init: function(options,el) {
			var self = this,
				dom = this.dom = {};
				
			this.opts = $.extend({},$.fn.galleryView.defaults,options);
			this.el = el;
			this.$el = $(el);
			this.id = el.id;
			this.iterator = this.frameIterator = this.opts.start_frame - 1;
			this.overlayVisible = false;
			this.playing = false;
			this.scrolling = false;
			this.isMouseDown = false;
			this.mouse = { x: 0, y: 0 };
			this.filmstripOrientation = (this.opts.filmstrip_position === 'top' || this.opts.filmstrip_position === 'bottom') ? 'horizontal' : 'vertical';
			
			$(document).bind('mousemove.galleryview',function(e) {
				self.mouse = {x: e.pageX, y: e.pageY};	   
			});
			
			// create all necessary DOM elements
			$.each(this.elems,function(i,elem) {
				var elem = elem.split('.');
				
				// if there is no tag name, assume <div>
				if(elem[0] === '') { elem[0] = 'div'; }
				
				// add jQuery element to dom object
				dom[elem[1]] = self.createElem({'class':elem[1]},elem[0]);
			});
			
			dom.gv_galleryWrap.delegate('img','mousedown.galleryview',function(e){ if(e.preventDefault) { e.preventDefault(); } });
			
			dom.gv_panel.addClass('gv_panel-loading');
			dom.gv_frame.addClass('gv_frame-loading');
			
			// nest DOM elements
			dom.gv_galleryWrap.hide().append(dom.gv_gallery);
			
			if(this.opts.show_panels) {
				dom.gv_gallery.append(
					dom.gv_panelWrap.append(
						dom.gv_panelNavNext,
						dom.gv_panelNavPrev,
						dom.gv_infobar
					)
				);
			}
			
			if(this.opts.show_filmstrip) {
				dom.gv_gallery.append(
					dom.gv_filmstripWrap.append(
						dom.gv_filmstrip
					)
				);
				
				if(this.opts.show_filmstrip_nav) {
					dom.gv_gallery.append(
						dom.gv_navWrap.append(
							dom.gv_navPrev,
							dom.gv_navPlay,
							dom.gv_navNext
						)
					);
				}
			}
			
			if(this.opts.show_overlays) {
				dom.gv_panelWrap.append(dom.gv_overlay,dom.gv_showOverlay);	
			}
			
			if(this.opts.show_captions) {
				dom.gv_frame.append(dom.gv_caption).appendTo(dom.gv_gallery);	
			}
			
			//swap out source element with gallery
			this.$el.replaceWith(dom.gv_galleryWrap);
			
			if(this.opts.pan_images) {
				this.enablePanning();
			}
			
			// convert source images into gvImage objects
			this.storeImages();
			
			// block out dimensions/positions of gallery elements
			this.buildGallery();
			
			// begin loading images into gallery
			this.initImages();
			
			// set up transitions, buttons
			this.bindActions();
			
			// remove temporary frame element
			dom.gv_frame.remove();
			
			// show gallery
			dom.gv_galleryWrap.show();
			
			this.updateOverlay(this.iterator);
			this.updateFilmstrip(this.frameIterator);
		}
		
	}; // END GalleryView
	
	/*
		MAIN PLUGIN CODE
	*/
	// 2012-01-09 joel : make it return the object
	$.fn.galleryView = function (options) {
	  var gallery;
		if (this.length) {
			this.each(function () {
				gallery = Object.create(GalleryView);
				gallery.init(options,this);
			});
			return gallery;
		}
	};
/*
	$.fn.galleryView = function (options) {
		if (this.length) {
			return this.each(function () {
				var gallery = Object.create(GalleryView);
				gallery.init(options,this);
			});
		}
	};
*/
	
	/*
		Default Options
			Object literal storing default plugin options
	*/
	$.fn.galleryView.defaults = {
	
		// General Options
		transition_speed: 1000, 		//INT - duration of panel/frame transition (in milliseconds)
		transition_interval: 4000, 		//INT - delay between panel/frame transitions (in milliseconds)
		easing: 'swing', 				//STRING - easing method to use for animations (jQuery provides 'swing' or 'linear', more available with jQuery UI or Easing plugin)
		
		// Panel Options
		show_panels: true, 				//BOOLEAN - flag to show or hide panel portion of gallery
		show_panel_nav: true, 			//BOOLEAN - flag to show or hide panel navigation buttons
		show_overlays: false, 			//BOOLEAN - flag to show or hide panel overlays
		panel_width: 700, 				//INT - width of gallery panel (in pixels)
		panel_height: 400, 				//INT - height of gallery panel (in pixels)
		panel_animation: 'fade', 		//STRING - animation method for panel transitions (crossfade,fade,slide,zoomOut,none)
		panel_scale: 'crop', 			//STRING - cropping option for panel images (crop = scale image and fit to aspect ratio determined by panel_width and panel_height, fit = scale image and preserve original aspect ratio)
		overlay_opacity: 0.8, 			//FLOAT - transparency for panel overlay (1.0 = opaque, 0.0 = transparent)
		overlay_position: 'bottom', 	//STRING - position of panel overlay (bottom, top)
		pan_images: false,				//BOOLEAN - flag to allow user to grab/drag oversized images within gallery
		pan_style: 'drag',				//STRING - panning method (drag = user clicks and drags image to pan, track = image automatically pans based on mouse position
		pan_smoothness: 15,				//INT - determines smoothness of tracking pan animation (higher number = smoother)
		
		// Filmstrip Options
		start_frame: 1, 				//INT - index of panel/frame to show first when gallery loads
		show_filmstrip: true, 			//BOOLEAN - flag to show or hide filmstrip portion of gallery
		show_filmstrip_nav: true, 		//BOOLEAN - flag indicating whether to display navigation buttons
		show_captions: false, 			//BOOLEAN - flag to show or hide frame captions	
		filmstrip_size: 3, 				//INT - number of frames to show in filmstrip-only gallery
		filmstrip_style: 'scroll', 		//STRING - type of filmstrip to use (scroll = display one line of frames, scroll filmstrip if necessary, show all = display multiple rows of frames if necessary)
		filmstrip_position: 'bottom', 	//STRING - position of filmstrip within gallery (bottom, top, left, right)
		frame_width: 70, 				//INT - width of filmstrip frames (in pixels)
		frame_height: 40, 				//INT - width of filmstrip frames (in pixels)
		frame_opacity: 0.4, 			//FLOAT - transparency of non-active frames (1.0 = opaque, 0.0 = transparent)
		frame_scale: 'crop', 			//STRING - cropping option for filmstrip images (same as above)
		frame_gap: 5, 					//INT - spacing between frames within filmstrip (in pixels)
		
		// Info Bar Options
		show_infobar: true,				//BOOLEAN - flag to show or hide infobar
		infobar_opacity: 1				//FLOAT - transparency for info bar
	};
})(jQuery);
