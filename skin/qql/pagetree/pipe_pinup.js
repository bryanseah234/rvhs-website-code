$(function(){
  $(document).on('click','.iveo_pipe_pagetree_pinup .ct-box',function(ev){
    if (ive_settings && ive_settings.edit_mode && ive_settings.edit_mode!='none') return;
    var href=$(this).attr('data-href');
    if (!href) return;
    var target=$(this).attr('data-target');
    if (target) window.open(href,target);
    else document.location=href;
  });
  // 2015-09-01 : needs this, else ios safari :hover wont work 
  $(document).on('touchstart touchend','.iveo_pipe_pagetree_pinup',function(ev){ });
});
