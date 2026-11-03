Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('configfirmadigital', function cargarInterfaz(perfil, etiquetas) {
    var _this = this;
    var view_port = new Ext.Viewport({
        layout: 'fit',
        items:[new Ext.FormPanel({
            labelAlign: 'right',
            frame:true,
            title:'Editar fichero de configuracion',
            bodyStyle:'padding:5px 5px 0',
            height: '100%',
            items: [this.configArea = new Ext.form.TextArea({
                xtype:'textarea',
                height: '100%',
                hideLabel:true,
                anchor:'98%'
            })],
            buttons: [{
                text: 'Guardar',
                iconCls:'icondistra-guardar',
                handler:function(){
                    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Guardando configuracion..."});
                    myMask.show();
                    Ext.Ajax.request({
                        url:'/configuracion/firmadigital/index.php/configfirmadigital/saveFileConfiguracion',
                        method:'POST',
                        params:{
                            code: _this.configArea.getValue()
                        },
                        success:function(response, opts) {
                            var obj = Ext.decode(response.responseText);
                            myMask.hide();
                            mostrarMensaje(1,'La configuracion se guardo satisfactoriamente.');
                        },
                        failure: function(response, opts) {
                        }
                    });
                }
            }]
        })]
    });
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});
    myMask.show();
    Ext.Ajax.request({
        url:'/configuracion/firmadigital/index.php/configfirmadigital/getFileConfiguracion',
        success:function(response, opts) {
            var obj = Ext.decode(response.responseText);
            _this.configArea.setValue(obj.code);
          //  this.configArea.setValue(obj.code);
            mostrarMensaje(1,'Se ha cargado la configuracion satisfactoriamente.');
            console.log(obj);
            myMask.hide();

         /*
            var win = new Ext.util.FirmaView({

               -:[{
                   "name" : "Prueba.pdf",
                   "relativePath" : '/configuracion/firmadigital/Prueba.pdf',
                   "path" : 'C:/wamp/www/distra/path/web/configuracion/firmadigital/Prueba.pdf'
                },  {
                    "name" : "Prueba2.pdf",
                    "relativePath" : '/configuracion/firmadigital/Prueba2.pdf',
                    "path" : 'C:/wamp/www/distra/path/web/configuracion/firmadigital/Prueba2.pdf'
                }],
                onFirmaDigital:function(r){
                   console.log(r.caseId);
                    var docWin = new Ext.util.DocumentosView({
                        params: {
                            caseId : r.caseId
                        }
                    });
                    docWin.show();
                }
            });
            win.show();
          */

        },

        failure: function(response, opts) {
            mostrarMensaje(3,'Error al cargar la configuracion.');
        }
    });
});