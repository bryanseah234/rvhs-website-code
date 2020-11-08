function changeaction(val) {
  var frm = document.getElementById('asknlearnlms') || null;
  if(frm){  frm.action = val; }
}

function login_box(){
var login_box=document.getElementById('login_box');
if(login_box.style.display=="none"){
login_box.style.display="block";
}
else{
login_box.style.display="none";
}
}
