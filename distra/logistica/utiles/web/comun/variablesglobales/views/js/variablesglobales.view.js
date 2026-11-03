Ext.ns('LOG.lb.variablesglobales');
LOG.lb.variablesglobales.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.idioma = LOG.util.UIManager.apply(LOG.lb.variablesglobales.Idioma, LOG.util.Idioma);
        this.busquedaBasica = false;
        this.dirController = '/logistica/utiles/comun/variablesglobales/index.php/Variablesglobales'
        this.busquedaAvanzada = false;
        this.idGridPrincipal = 'id';
        this.modoSeleccion = 2;
        this.urlBusquedaGridPrincipal = 'cargarVariables';
        /*this.modelo = new LOG.fact.magentoadmin.Model({
            idioma: config.idioma
        });*/
        LOG.lb.variablesglobales.View.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id'
        });
        this.addGridColumn({
            header: LOG.lb.variablesglobales.Idioma.lbNombre,
            width: 205,
            dataIndex: 'nombre'
        });

        this.addGridColumn({
            header: LOG.lb.variablesglobales.Idioma.lbValor,
            width: 205,
            dataIndex: 'valor'
        });

        this.addGridColumn({
            header: LOG.lb.variablesglobales.Idioma.lbAmbito,
            width: 85,
            dataIndex: 'ambito',
            renderer : function(r,v){
                var ambit = 'UI/LN';
                if (r == 1) ambit = 'UI';
                if (r == 2) ambit = 'LN';
                return ambit;
            }
        });

        this.addGridColumn({
            header: LOG.lb.variablesglobales.Idioma.lbActivo,
            width: 150,
            dataIndex: 'activo',
            renderer: function (value, metadata, record) {
                if (value == 0)
                    metadata.css = 'icondistra-false rojo';
                else
                    metadata.css = 'icondistra-true verde';
            }
        });
    },
    mostrarVentanaEditar: function(modificar){
        var _this = this;
        var pForm = LOG.util.UIManager.initColumnForm({columnas : 2});
        var row = _this.getSmPrincipal().getSelected();
        pForm.addComponent( LOG.util.Prototipos.inputTexto({
            fieldLabel: LOG.lb.variablesglobales.Idioma.lbNombre,
            name : 'nombre',
            allowBlank: false,
            anchor: '98%',
            value: modificar ? row.data.nombre : null
        }));
        pForm.addComponent( LOG.util.Prototipos.inputTexto({
            fieldLabel: LOG.lb.variablesglobales.Idioma.lbValor,
            name : 'valor',
            allowBlank: false,
            anchor: '98%',
            value: modificar ? row.data.valor : null
        }));
        if(modificar){
            var row = _this.getSmPrincipal().getSelected();
            pForm.addComponent(LOG.util.Prototipos.inputTexto({
                fieldLabel: LOG.lb.variablesglobales.Idioma.lbValor,
                name : 'id',
                allowBlank: false,
                anchor: '98%',
                hidden: true,
                value: row.id
            }));
        }

        var fpConfiguracion = LOG.util.UIManager.initForm({
            region: 'center',
            style: '-moz-border-radius:20px',
            bodyStyle: 'padding:10px 10px 0',
            layout: 'form',
            frame: true,
            items: [pForm]
        });
        var url = (modificar) ? '/modificarVariable' : '/salvarVariable';
        var winConfig = LOG.util.UIManager.initWindow({
            layout : 'border',
            height : 150,
            width : 450,
            resizable: false,
            title : LOG.lb.variablesglobales.Idioma.lbTitle,
            items : [fpConfiguracion],
            buttons : [LOG.util.Prototipos.botonGuardar({
                text: LOG.util.Idioma.lbBtnGuardar,
                tooltip: LOG.util.Idioma.lbTtBtnGuardar,
                disabled: false,
                handler: function () {
                    Ext.getBody().mask(_this.idioma.msgEspere);
                    
                    fpConfiguracion.getForm().submit({
                        url: _this.dirController + url,
                        method: 'POST',
                        success: function () {
                            Ext.getBody().unmask();
                            _this.storePrincipal.reload();
                            mostrarMensaje(1, _this.idioma.lbMsgSalvarOk);
                            winConfig.close();
                        },
                        failure: function () {
                            Ext.getBody().unmask();
                        }
                    });
                }
            })]
        });
        winConfig.show();
    },
    initDefaultButtons: function () {
        //Botones principales
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: LOG.lb.variablesglobales.Idioma.lbAdd,
            tooltip: LOG.lb.variablesglobales.Idioma.lbTTAdd,
            iconCls : 'adicionar',
            handler: function () {
                _this.mostrarVentanaEditar(false);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            text: 'Modificar',
            tooltip: 'Modificar variables',
            iconCls : 'modificar',
            handler: function () {
                _this.mostrarVentanaEditar(true);
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RModificar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: LOG.lb.variablesglobales.Idioma.lbDel,
            tooltip: LOG.lb.variablesglobales.Idioma.lbTTDel,
            iconCls : 'eliminar',
            handler: function () {
                Ext.getBody().mask(_this.idioma.msgEspere);


                var selectedRow = _this.getSmPrincipal().getSelected();
                if(selectedRow){
                    mostrarMensaje(2, "Está seguro que desea eliminar la variable global seleccionada?", function(btn){
                        if(btn == 'ok'){
                            Ext.Ajax.request({
                                url: _this.dirController + '/eliminarVariable',
                                method: 'POST',
                                params: {
                                    id: selectedRow.data.id
                                },
                                callback: function (o, s, r) {
                                    Ext.getBody().unmask();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if (resp.success) {
                                        mostrarMensaje(1, 'Eliminado satisfactoriamente.');
                                    } else {
                                        mostrarMensaje(3, 'Ha ocurrido un error al eliminar.');
                                    }
                                    _this.storePrincipal.reload();
                                }
                            });
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));
    }
});
