var cont =0;
var msg;
notificacion = function (message) {
    var runner = new Ext.util.TaskRunner();
    var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
    msg = Ext.DomHelper.append(msgCt, '<div class="msg"><h3>' + 'Usted tiene' + ' ' +cont + ' notificacion(es) nueva(s)'+'</h3></div>', true);
    msg.on('click',function(eve,ert,opt){
    msg.ghost("b", {/*duration: 4,*/ remove: true});
    })
    popup(msg);
   var task = {
    run: function(){
         refrescarNotificaciones(msg,msgCt); 
    },
    interval: 1000 //1 second
    }
    runner.start(task);
      
  
 } 
	

refrescarNotificaciones = function(objeto,msgCt)
{
  Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/nuevaNotificacion',
                params: {
                    notificaciones: cont
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    
                    if(responseData.tienenuevas){
                      cont= responseData.cantnotificaciones; 
                      popupOut(objeto);
                      var nuevo = Ext.DomHelper.append(msgCt, '<div class="msg"><h3>' + 'Usted tiene' + ' ' +cont + ' notificacion(es) nueva(s)'+'</h3></div>', true);
                      nuevo.on('click',function(eve,ert,opt){
                        nuevo.ghost("b", {/*duration: 4,*/ remove: true});
                        })
                      popup(nuevo);  
                      msg = nuevo;
                    }
                     
                    //else
                    //refrescarNotificaciones(msg,msgCt); 
                }
            });  
    
}

initStyles = function () {
var styleLeaf = document.createElement('style');
styleLeaf.innerHTML = "" +
".msg .x-box-mc {font-size:14px;} " +
'div#imgOk{background: url("/lib/UCID/images/ok.png") no-repeat left; width: 50px; height: 50px; float: left; margin: -25px 0px 0px -25px;}' +
"#msg-div {position:absolute;left:1%;top:90%;width:280px;z-index:20000;} " +
"#msg-div .msg {border-radius: 8px;-moz-border-radius: 8px;background: #F6F6F6;border: 2px solid #3764A0;margin-top: 0px;padding: 10px 15px;color: #04408c;box-shadow: 2px 2px 15px #3764A0;} " +
"#msg-div .msg h3 {margin: 0 0 8px;font-weight: bold;font-size: 12px;} " +
"#msg-div .msg p {margin: 0;} ";
document.body.appendChild(styleLeaf);
}();
popup = function (msg) {
    msg.slideIn('b');//.pause(1).ghost("b", {/*duration: 4, remove: true*/});
}; 	

popupOut = function (msg) {
msg.ghost("b", {/*duration: 4,*/ remove: true});//.pause(1).ghost("b", {/*duration: 4, remove: true*/});
}; 

notificacion();