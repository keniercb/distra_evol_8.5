Ext.ns("Ext.components.CmpReccomplejas");
Ext.components.CmpReccomplejas.WinSalvarBusqueda = Ext.extend(Ext.Window, {
    layout: 'fit',
    modal: true,
    plain: true,
    closeAction: 'hide',
    height: 280,
    width: 550,
    initComponent: function() {
        var self = this;
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
			text: self.idioma.lbBtnAceptar,
			tooltip: self.idioma.ttpBtnAceptar,
			handler: guardarBusqueda,
			id: 'btnAceptar' + self.id,
			nextTab: 'tfDenominacion' + self.id,
			prevTab: 'btnCancelar' + self.id
		});
        var btnCancelar = new Ext.Button({ iconCls: 'cancelar', text: self.idioma.lbBtnCancelar, tooltip: self.idioma.ttpBtnCancelar, handler: function() {
                self.hide();
            }, id: 'btnCancelar' + self.id});

        function __construct() {
            if (self.idbusqueda != 0) {
                tfDenominacion.setValue(self.denominacion);
                tfCodigo.setValue(self.codigo);
                taDescripcion.setValue(self.descripcion);
            }
        }

        var tfDenominacion = new Ext.form.TextField({
            id: 'tfDenominacion' + self.id,
            fieldLabel: self.idioma.lbDenominacion,
            regexText: self.idioma.msgAlfaNumericCharacter,
            anchor: '98%',
            allowBlank: false,
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            maskRe: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            prevTab: 'btnAceptar' + self.id
        });

        var tfCodigo = new Ext.form.TextField({
            fieldLabel: self.idioma.lbCodigo,
            anchor: '95%',
            hidden: self.noUsarGestAvisos,
            allowBlank: self.noUsarGestAvisos,
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúñüÑ]+ ?[a-zA-Z0-9áéíóúñüÑ]*)+$/,
            maskRe: /^([a-zA-Z0-9áéíóúñüÑ]+ ?[a-zA-Z0-9áéíóúñüÑ]*)+$/
        });

        var taDescripcion = new Ext.form.TextArea({
            fieldLabel: self.idioma.lbDescripcion,
            height: 120,
            anchor: '98%'
        });

        if (self.noUsarGestAvisos) {
            self.formGuardarBusqueda = new Ext.FormPanel({
                labelAlign: 'top',
                region: 'center',
                bodyStyle: 'padding:5px 5px 0',
                frame: true,
                border: false,
                items: [tfDenominacion, taDescripcion]
            });
        } else {
            self.formGuardarBusqueda = new Ext.FormPanel({
                labelAlign: 'top',
                region: 'center',
                bodyStyle: 'padding:5px 5px 0',
                frame: true,
                border: false,
                items: [{
                        layout: 'column',
                        items: [{
                                columnWidth: .7,
                                layout: 'form',
                                items: [tfDenominacion]
                            }, {
                                columnWidth: .3,
                                layout: 'form',
                                items: [tfCodigo]
                            }]
                    }, taDescripcion]
            });
        }


        function guardarBusqueda() {
            if (self.idbusqueda == 0) {
                adicionarBusqueda();
            } else {
                modificarBusqueda();
            }
        }

        function adicionarBusqueda() {
            if (self.formGuardarBusqueda.getForm().isValid()) {
                PVD.mostrarMascara('idmskaddbusqueda', self.idioma.lbporfavorespere, self.idioma.lbSaveBusqueda);
                Ext.Ajax.request({
                    url: '/reccomplejas/index.php/reccomplejas/adicionarBusqueda',
                    method: 'POST',
                    params: {
                        idbusqueda: self.idbusqueda,
                        idconfiguracion: self.idconfiguracion,
                        denominacion: tfDenominacion.getValue(),
                        codigo: tfCodigo.getValue(),
                        descripcion: taDescripcion.getValue(),
                        campos: Ext.encode(self.campos),
                        condiciones: Ext.encode(self.condiciones),
                        operacion: Ext.encode(self.operacion),
                        orderby: Ext.encode(self.orderby)
                    },
                    callback: function(options, success, response) {
                        PVD.ocultarMascara('idmskaddbusqueda');
                        var datos = Ext.util.JSON.decode(response.responseText);
                        if(datos.codMsg==1){
                            mostrarMensaje(1,'La b&uacute;squeda ha sido adicionada satisfactoriamente.');
                            self.close();

                        }else{
                            mostrarMensaje(3,'Error al guardar la configuración de la busqueda.');
                            self.close();
                        }
                    }
                });
            }
			else{
				tfDenominacion.focus(false, 300);
			}
        }

        function modificarBusqueda() {
            if (self.formGuardarBusqueda.getForm().isValid()) {
                PVD.mostrarMascara('idmskmodbusqueda', self.idioma.lbporfavorespere, self.idioma.lbSaveBusqueda);
                Ext.Ajax.request({
                    url: '/reccomplejas/index.php/reccomplejas/modificarBusqueda',
                    method: 'POST',
                    params: {
                        idbusqueda: self.idbusqueda,
                        idaviso: self.hasOwnProperty('idaviso') ? self.idaviso : '',
                        contenidoAviso: self.hasOwnProperty('idaviso') ? Ext.encode(self.contenidoAviso) : '',
                        denominacion: tfDenominacion.getValue(),
                        codigo: tfCodigo.getValue(),
                        descripcion: taDescripcion.getValue(),
                        noUsarGestAvisos: self.noUsarGestAvisos
                    },
                    callback: function(options, success, response) {
                        var datos = Ext.util.JSON.decode(response.responseText);
                        self.close();
                        PVD.ocultarMascara('idmskmodbusqueda');
                    }
                });
            }
			else{
				tfDenominacion.focus(false, 300);
			}
        }

        self.on('show', function(component) {
            tfDenominacion.focus(false, 300);
        });
		var map = new Ext.KeyMap(Ext.getDoc(), [
				{
						key:Ext.EventObject.ENTER,
						fn:function(){
							btnAceptar.handler();
						}
					},{
						key:'x',
						alt:true,
						fn:function(){
							btnCancelar.handler();
						}
					}
			]);
        this.items = [self.formGuardarBusqueda];
        this.buttons = [btnCancelar, btnAceptar];
        __construct();
        Ext.components.CmpReccomplejas.WinSalvarBusqueda.superclass.initComponent.call(this);
    }

});
Ext.reg('CmpReccomplejas_WinSalvarBusqueda', Ext.components.CmpReccomplejas.WinSalvarBusqueda);
