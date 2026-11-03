/**
 * Created by jandy on 7/2/15.
 */

Ext.ns('Std.Base.Utiles');
ocultar = function () {
    var capa=document.getElementById("message");
    capa.style.display="none";
}
Std.Base.Utiles.mostrarMensajeFlotante = function(){
    var msgCt;
    function createBox(t, s, tipo){
        return ['<div class="example-info">',
            '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
            '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc-mesgg"><h3>', t, '</h3>', s, '</div></div></div>',
            '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
            '</div>'].join('');
    }
    function otroBox(t, s, tipo){
        if(tipo === 0){
            return ['<div class="ui-growl ui-widget" id="message" ><div style="" class="ui-growl-item-containererror ui-widget-header ui-corner-all" id="gritter-item-1">',
                '<div class="growl-cross" style="display: block; cursor: pointer;" onclick="ocultar()" ></div><div class="ui-gritter-item"><img class="ui-growl-image" src="/prospectiva/comun/recursos/images/msgFlotante/error.png">',
                '<div class="ui-growl-message"><span class="ui-growl-title">',t,s,'</span><p></p></div><div style="clear:both"></div></div></div></div>'].join('');
        }else if(tipo === 1){
            return ['<div class="ui-growl ui-widget" id="message" ><div style="" class="ui-growl-item-containerok ui-widget-header ui-corner-all" id="gritter-item-1">',
                '<div class="growl-cross" style="display: block; cursor: pointer;" onclick="ocultar()" ></div><div class="ui-gritter-item"><img class="ui-growl-image" src="/prospectiva/comun/recursos/images/msgFlotante/ok.png">',
                '<div class="ui-growl-message"><span class="ui-growl-title">',t,s,'</span><p></p></div><div style="clear:both"></div></div></div></div>'].join('');
        }else if(tipo === 2){
            return ['<div class="ui-growl ui-widget" id="message" ><div style="" class="ui-growl-item-containerinfo ui-widget-header ui-corner-all" id="gritter-item-1">',
                '<div class="growl-cross" style="display: block; cursor: pointer;" onclick="ocultar()" ></div><div class="ui-gritter-item"><img class="ui-growl-image" src="/prospectiva/comun/recursos/images/msgFlotante/growlInfo.png.jsf.png">',
                '<div class="ui-growl-message"><span class="ui-growl-title">',t,s,'</span><p></p></div><div style="clear:both"></div></div></div></div>'].join('');
        }else if(tipo === 3){
            return ['<div class="ui-growl ui-widget" id="message" ><div style="" class="ui-growl-item-containerwarning ui-widget-header ui-corner-all" id="gritter-item-1">',
                '<div class="growl-cross" style="display: block; cursor: pointer;" onclick="ocultar()" ></div><div class="ui-gritter-item"><img class="ui-growl-image" src="/prospectiva/comun/recursos/images/msgFlotante/warning-icon.png">',
                '<div class="ui-growl-message"><span class="ui-growl-title">',t,s,'</span><p></p></div><div style="clear:both"></div></div></div></div>'].join('');
        }
    }
    return {
        msg : function(title, format, tipo, time_pause){
            var time = (time_pause) ? time_pause : 4;
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
                Ext.DomHelper.applyStyles('msg-div',{
                    'z-index':30000
                });
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var tipo =  Array.prototype.slice.call(arguments, 2);
                tipo = tipo[0];
            var m = Ext.DomHelper.append(msgCt, {html:otroBox(title, s, tipo)}, true);
            m.slideIn('t').pause(time).ghost("t", {remove:true});
        },

        init : function(){
            var t = Ext.get('exttheme');
            if(!t){ // run locally?
                return;
            }
            var theme = Cookies.get('exttheme') || 'aero';
            if(theme){
                t.dom.value = theme;
                Ext.getBody().addClass('x-'+theme);
            }
            t.on('change', function(){
                Cookies.set('exttheme', t.getValue());
                setTimeout(function(){alert(1);
                    window.location.reload();
                }, 250);
            });

            var lb = Ext.get('lib-bar');
            if(lb){
                lb.show();
            }
        }
    };
}();
Ext.onReady(Std.Base.Utiles.mostrarMensajeFlotante.init, Std.Base.Utiles.mostrarMensajeFlotante);