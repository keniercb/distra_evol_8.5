Ext.ns('LOG.fact');

LOG.fact.vAnularNrosControl = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        //Ext.apply(this, config);
        var self = this;
        this.width = 600;
        this.height = 190;
        this.frame = true;
        this.modal = true;
        this.resizable= false;
        this.idioma = config.idioma;
        this.title = this.idioma.lbAnularNoControl;
        this.docFactura = config.docFactura;
        this.vp = config.vp;
        this.constrain = true;

        this.tfNumeros = new Ext.form.TextField({
            allowBlank: false,
            fieldLabel: self.idioma.lbTfNumeros,
            regex:/^(\d{2}-\d{8})((\:|,)(\d{2}-\d{8}))*$/ ,
            anchor: '100%',
			maskRe :/[0-9]|,|\:|-/ ,
            regexText: self.idioma.lbReFormatoIncorrecto
        });

        this.lbAnularNoControl = new Ext.form.Label({
            html: self.idioma.lbLbAnularNoControl,
            region: 'south'
        });

        this.pnCAnularNoControl = new LOG.util.UIManager.initForm({
            layout: 'form',
            autoHeight:true,
            labelAlign: 'top',
            items:[self.tfNumeros]
        });

        this.pnAnularNoControl = new LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'form',
            border: true,
            items:[new Ext.form.FieldSet({
                //title: 'Datos del documento:',
                frame :true,
                style: '-moz-border-radius:5px',
                anchor: '100%',
                autoHeight: true,
                layout: 'form',
                items: [this.pnCAnularNoControl]
            })]
        });

        this.deleteNumbers = function(numbers,imprimir) {
            var params = (imprimir)?{numbers:numbers,imprimir:true}:{numbers:numbers};
            var mascaraAnulando = new Ext.LoadMask(Ext.getBody(), {
                msg: self.idioma.maskAnulandoNumeros
            });
            mascaraAnulando.show();
            Ext.Ajax.request({
                url: self.controller + 'deleteNumbers',
                params: params,
                success: function(response) {
                    mascaraAnulando.hide();
                    var data = Ext.decode(response.responseText);
                    if (data['success'] === true) {
                        var message = self.idioma.lbNumerosAnuladosOk;
                        if (data['count'] == 1)
                            message = self.idioma.lbNumeroAnuladoOk;
                        mostrarMensaje(1, message);
                        self.tfNumeros.reset();
                        self.tfNumeros.focus();
                        if(data['idfacturas']){
                            self.vp.ventanaNumerosControl(data['idfacturas']);
                        }else{
                            self.docFactura.reload();
                        }
                    }
                }
            });
        };
        this.verifyNumbers = function(numbers, system) {
			var _this = this;
            var mascaraVerificando = new Ext.LoadMask(Ext.getBody(), {
                msg: self.idioma.maskVerificandoNumeros
            });
            mascaraVerificando.show();
            Ext.Ajax.request({
                url: 'verifyNumbers',
                params: {
                    system: system,
                    numbers: numbers
                },
                callback: function(options, success, response) {
                    mascaraVerificando.hide();
                    var data = Ext.decode(response.responseText);
                    var items = Array();
                    var texto = null;
                    if(data.respuesta.nrosconcomprob.nros && data.respuesta.nrosconcomprob.nros.length > 0){
                        texto = {
                            textlbl: self.idioma.lbUsadoNoControlInfo+'</br><b>'+data.respuesta.nrosconcomprob.nros.join(" , ")+'</b>'
                        };
                        items.push(self.createPanelNumeros('/lib/UCID/images/warning-icon.png', texto));
                    }else if (data.respuesta.nrosconcomprob && data.respuesta.nrosconcomprob.length > 0) {
                        texto = {
                            textlbl: self.idioma.lbUsadoNoControlInfo + '</br><b>' + data.respuesta.nrosconcomprob.join(" , ") + '</b>'
                        };
                        items.push(self.createPanelNumeros('/lib/UCID/images/warning-icon.png', texto));
                    }
                    if(data.respuesta.nroscasigsincomp.nros && data.respuesta.nroscasigsincomp.nros.length > 0){
                        if(data.respuesta.nroscasigsincomp.nros.length == 1){
                            texto = {
                                textlbl: _this.idioma.lbUsadoNoControlutilizado+'</br>'+_this.idioma.lbUsadoNoControlutilizado2+'</br><b>'+data.respuesta.nroscasigsincomp.nros.join(" , ")+'</b>'
                            };
                        }else{
                            texto = {
                                textlbl: _this.idioma.lbUsadoNoControlutilizados+'</br>'+_this.idioma.lbUsadoNoControlutilizados2+'</br><b>'+data.respuesta.nroscasigsincomp.nros.join(" , ")+'</b>'
                            };
                        }
                        items.push(self.createPanelNumeros('/lib/UCID/images/ok.png', texto));

                    }
                    if(items.length > 0){
                        var win = new Ext.Window({
                            modal: true,
                            closeAction: 'close',
                            layout: 'fit',
                            listeners: {
                                'close': function () {

                                }
                            },
                            title: _this.idioma.textAreaNrosControl,
                            width: 550,
                            autoHeight:true,
                            items: items,
                            buttons: [
                                LOG.util.Prototipos.botonCancelar({
                                    handler: function(){
                                        win.close();
                                        _this.vp.getGridPrincipal().getStore().reload();
                                    }
                                }),
                                LOG.util.Prototipos.botonAceptar({
                                    handler: function(){

                                        var idfacturas = new Array();
                                        for (var i = 0; i < data.respuesta.nroscasigsincomp.datos.length; i++)
                                        {
                                            idfacturas.push({
                                                idfactura: data.respuesta.nroscasigsincomp.datos[i].m2__idfactura,
                                                nrocontrol: data.respuesta.nroscasigsincomp.nros[i]
                                            });
                                        }
                                        _this.vp.modelo.imprimirModelo(_this.vp.btnImprimirModelo,idfacturas);
                                        win.close();
                                    }
                                })
                            ]
                        });
                        win.show();
                        win.doLayout();
                    }
                    else{
						mostrarMensaje(1, self.idioma.lbNumerosAnuladosOk);
					}
				}
            });
        };
        this.bodyStyle = 'padding:10px 10px 10px 10px';

        this.items = [{
            frame:true,
            layout:'border',
            region:'center',
            items:[self.pnAnularNoControl, self.lbAnularNoControl]
        }];
        LOG.fact.vAnularNrosControl.superclass.constructor.apply(this, config);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
//            text: this.idioma.lbBtnCerrar
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            hidden: true
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function() {
                var valid = self.pnCAnularNoControl.getForm().isValid();
                if (valid) {
                    self.verifyNumbers(self.tfNumeros.getValue());
                    self.close();
                } else {
                    var message = self.idioma.lbMsgCamposVacios;
                    mostrarMensaje(1, message); //mensaje error
                }
            }
        });
    },
    createPanelNumeros: function(icon, datos){
        var _this = this;
        var labelNros = new Ext.form.Label({html:'<table style=font-size:11 ><tr style=""><td width = "60" > <img src='+icon+' height="42" width="42"> </td><td><div id="idnroscontrolencomprob">'+datos.textlbl+'</div></td></tr></table>'});
        var panelNros = LOG.util.UIManager.initPanel({
            layout: 'form',
            frame:true,
            autoHeight:true,
            layout: 'fit',
            labelAlign: 'top',
            items: [ new Ext.form.FieldSet({
                frame :true,
                style: '-moz-border-radius:5px',
                anchor: '100%',
                autoHeight: true,
                layout: 'form',
                items: [labelNros]
            })
            ]
        });
        return panelNros;
    }
});
