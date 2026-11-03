Ext.define("Msg.util",{
    statics:{
        MostrarMsg : function(code,title,text,fn,scope){
            /*Ext.Msg.INFO // 1
             Ext.Msg.WARNING		//2
             Ext.Msg.ERROR  //3
             Ext.Msg.QUESTION  //4*/
            if(fn == null){var func = function(){msg.close()};}
            else{func = fn;}
            var  band = 0;
            var btn_cancelar = {
                type:'button',
                text:'Cancelar',
                iconCls: 'cancelar',
                handler: function(){
                    Ext.bind(func,scope)('NO');
                    acept.destroy();
                    cancel.destroy();
                    msg.close()

                },
                scope: this
            };
            /* var cut = new Ext.KeyMap(Ext.getBody(), {
             key:Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
             fn: function(){
             Ext.bind(func,scope)();
             msg.close();

             },
             scope: this
             });*/

            var btn_aceptar = {
                type:'button',
                text:'Aceptar',
                iconCls: 'aceptar',

                handler:function(){
                    Ext.bind(func,scope)('YES');
                    acept.destroy();
                    cancel.destroy();
                    msg.close();

                } ,

                scope: this
            };
            if(code == 1){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.INFO;
            }
            if(code == 2){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.WARNING;
            }
            if(code == 3){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.ERROR;
            }
            if(code == 4){
                var	option = [btn_cancelar,btn_aceptar];
                var icon = Ext.Msg.QUESTION;
            }



            var msg = new Ext.window.MessageBox({
                buttons: option


            }).show({
                    title: title,
                    msg: text,
                    scope : scope,
                    icon: icon
                });
            var acept = new Ext.util.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
                fn: function(){
                    Ext.bind(func,scope)();
                    msg.close();
                    acept.destroy();
                    cancel.destroy();
                },
                scope:this

            });
            var cancel = new Ext.util.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
                fn: function(){

                    msg.close();
                    acept.destroy();
                    cancel.destroy();
                },
                scope:this

            });

        },
        createBox: function (code,t, s){
            var resp = '';
            if(code == 3){resp ='<div class="msg"><div id="imgError"></div><h3>' + t + '</h3><p>' + s + '</p></div>';}
            if(code == 1){resp ='<div class="msg"><div id="imgOk"></div><h3>' + t + '</h3><p>' + s + '</p></div>';}

            return resp
        },
        msg : function(code,title, format){
            var msgCt ;
            if(!msgCt){
                if(code == 1) msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
                if(code == 3) msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-error'}, true);

                var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 2));
                var m = Ext.DomHelper.append(msgCt, this.createBox(code,title, s), true);
                m.hide();
                m.slideIn('t').ghost("t", { delay: 3000, remove: true});
            }

        }
    }

});