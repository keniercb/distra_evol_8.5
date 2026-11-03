

function mascaraExportar(concepto,msjespere,win){
    var div1 = document.createElement("div");
    div1.setAttribute("id","loading-mask");
    div1.setAttribute("style"," background-color; blue;  position:absolute;left:45%; top:40%;padding:2px; z-index:20001; color:#444;font:bold 13px Helvetica, Arial, sans-serif; height:auto;   "); 
    div1.innerHTML = ' <img src="http://'+document.location.host+'/portal/views/images/portal/cargando.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>'+concepto+'<br /><span id="loading-msg" style = "font-size: 10px; font-weight: normal;">'+msjespere+'</span>';
    win.document.getElementsByTagName("body")[0].appendChild(div1);
}