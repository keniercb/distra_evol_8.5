Ext.ns('Ext.erp');

Ext.erp.panelAtributos = Ext.extend(Ext.Panel, {
    constructor: function(config) {

        Ext.apply(this, config);
        var _this = this;
        this.border = false;
        this.layout = 'border';

        _this.selectionMp = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

      
        _this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaAgrupaciones',
            iconCls: 'ayuda',
            tooltip: _this.idioma.lbTtAyuda,
            text: _this.idioma.lbBtnAyuda,
            /*handler: function() {
                alert('Falta hacer la ayuda (analista)');
                if (!Ext.Msg.isVisible()) {
                    var referencia = 'Logistica/Gestion de transporte/Configuracion/Nomencladores din?micos';
                    help.show(_this.idioma.btnAyuDin, referencia);
                }
            }*/
        });
        

        _this.tbar = [ '->', _this.btnAyuda];

        _this.columnasp = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'N.\xb0',
                width: 35
            }), {
                header: _this.idioma.lbDenominacion,
                width: 120,
                id: 'denominacion',
                dataIndex: 'denominacion'
            }, {
                header: _this.idioma.lbTipoDato,
                width: 120,
                dataIndex: 'NomTipoDatodenominacion'
            }, {
                header: _this.idioma.lbLongitud,
                width: 100,
                dataIndex: 'longitud'
            }, {
                header: _this.idioma.lbCMValoresNulos,
                width: 100,
                dataIndex: 'permitenulo',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'inactivo';
                    } else {
                        metaData.css = 'activo';
                    }
                }
            }, {
                header: _this.idioma.lbNivelNomenclador,
                width: 100,
                dataIndex: 'nivelnomenclador',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }
        ]);

        this.fields = [
            {
                name: 'denominacion'
            },
            {
                name: 'NomTipoDatodenominacion'
            },
            {
                name: 'longitud'
            },
            {
                name: 'permitenulo'
            },
            {
                name: 'nivelnomenclador'
            },
            {
                name: 'NomExpresionRegulardenominacion'
            },
            {
                name: 'idatributo'
            },
            {
                name: 'idagrupacion'
            },
            {
                name: 'idexpresionregular'
            },
            {
                name: 'decimal'
            },
            {
                name: 'precision'
            },
            {
                name: 'idtipodato'
            },
            {
                name: 'idtablanomdinamico'
            },
            {
                name: 'limiteinferior'
            },
            {
                name: 'limitesuperior'
            }
        ];

        this.storePM = new Ext.data.Store({
            url: 'cargarAtributos',
            autoLoad: false,
            sortInfo: {
                field: 'idatributo',
                direction: 'DESC'
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, _this.fields)

        });

        _this.paginToolbarMP = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.storePM,
            displayInfo: true
        });

        _this.grid = new Ext.grid.GridPanel({
            border: false,
            bodyBorder: false,
            autoExpandColumn: 'denominacion',
            cm: _this.columnasp,
            store: _this.storePM,
            bbar: _this.paginToolbarMP,
            region: 'center',
            //sm: _this.selectionMp,
            loadMask: true,
            disableSelection: true
        });
        _this.items = [_this.grid];
        Ext.erp.panelAtributos.superclass.constructor.apply(this, arguments);
    },
    eliminarAtributo: function(option) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbConfirmDelAtrib, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                var arrayidatrib = Array();
                if (option != 'tree') {
                    var arrayatributos = _this.grid.getSelectionModel().getSelections();
                    for (var i = 0; i < arrayatributos.length; i++) {
                        arrayidatrib.push(arrayatributos[i].data.idatributo)
                    }
                } else {
                    arrayidatrib.push(_this.panelTree.getNodoSeleccionado().attributes.idatributo);
                }
                //Ext.getBody().mask(_this.idioma.lbWaitnMsgeliminar);
                var LoadMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.lbWaitnMsgeliminar});
                LoadMask.show();
                if (arrayidatrib) {
                    Ext.Ajax.request({
                        url: 'eliminarAtributo',
                        method: 'POST',
                        params: {
                            arrayAtrib: Ext.encode(arrayidatrib)
                        },
                        callback: function(options, success, response) {
                            response = Ext.util.JSON.decode(response.responseText);
                            //Ext.getBody().unmask();
                            LoadMask.hide();
                            if (response.Msg == 3)
                                mostrarMensaje(1, _this.idioma.lbEliminarError);
                            if (response.Msg == 2)
                                mostrarMensaje(1, _this.idioma.lbEliminarDenomAtributoErrorEnUsoInd+response.denominaciones);
                            else {
                                mostrarMensaje(1, _this.idioma.lbEliminarOk);
                                _this.grid.getStore().load();
                                if (option == 'tree') {
                                    var nodopadre = _this.panelTree.getNodoSeleccionado().parentNode;
                                    nodopadre.getLoader().load(nodopadre, function() {
                                        nodopadre.expand();
                                    });
                                }
                            }
                        }
                    });
                } else {
                    mostrarMensaje(1, _this.idioma.lbSeleccionarDel);
                }
            }
        }
    },
    winGestAtributo: function(opcion) {
        var _this = this;
        _this.wingestAtrib = new Ext.erp.wingestAtributo({
            idioma: _this.idioma,
            GridPanel: _this.grid,
            closeAction: 'close',
            title:(opcion == 'adic')?'Adicionar atributo din\xe1mico':'Modificar atributo din\xe1mico',
            panelTree: _this.panelTree,
            opcion:opcion,
            panelPadre: _this
        });
        
        _this.wingestAtrib.show();
    },
    winmodAtributo: function(option) {
        var _this = this;
        var valor = null;
        if (option == 'tree') {
            valor = _this.panelTree.getNodoSeleccionado().attributes.denominacion;
        } else {
            valor = _this.grid.getSelectionModel().getSelected().get('denominacion');
        }
        _this.ventanaMod = new Ext.erp.wingestDenomGener({
            idioma: _this.idioma,
            title: _this.idioma.lbTitVentanaModificar,
            valueText: valor,
            closeAction: 'close',
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: _this.idioma.lbBtnCancelar,
                    tooltip: _this.idioma.lbTtCancelar,
                    handler: function() {
                        _this.ventanaMod.close();
                    }
                },
                {
                    iconCls: 'aceptar',
                    text: _this.idioma.lbBtnAceptar,
                    tooltip: _this.idioma.lbTtAceptar,
                    handler: function() {
                        _this.modificarDenom(option);
                    }
                }
            ]
        });
        _this.ventanaMod.show();
    },
    modificarDenom: function(option) {
        var _this = this;
        var idatributo = null;
        if (option = 'tree') {
            idatributo = _this.panelTree.getNodoSeleccionado().attributes.idatributo;
        } else {
            idatributo = _this.grid.getSelectionModel().getSelected().get('idatributo');
        }
        if (_this.ventanaMod.form.getForm().isValid()) {
            _this.ventanaMod.form.getForm().submit({
                url: 'adicionarAtributo',
                params: {
                    idatributo: idatributo
                },
                success: function(form, action) {
                    _this.ventanaMod.close();
                    var resp = Ext.decode(action.response.responseText);
                    mostrarMensaje(1, _this.idioma.lbModDenomAtributoOk);
                    _this.grid.getStore().reload();
                    if (option == 'tree') {
                        _this.panelTree.getLoader().load(_this.panelTree.getRootNode(), function() {
                            _this.panelTree.getRootNode().expand();
                        });
                    }
                },
                failure: function(form, action) {
                    _this.ventanaMod.close();
                    var resp = Ext.decode(action.response.responseText);
                    if (resp.codigoMsg == 2) {
                        mostrarMensaje(1, _this.idioma.lbModDenomAtributoErrorEnUso);
                    } else {
                        mostrarMensaje(1, _this.idioma.lbModDenomAtributoError);
                    }
                }
            });
        } else {
            mostrarMensaje(3, _this.idioma.lbCamposIncorrectos);
        }
    },
    trimvalores: function(cadena) {
        var valor1 = cadena.replace(/^\s+/g, '');
        var valor2 = valor1.replace(/\s/g, '');
        var result = valor2.replace(" ", "");
        return result.toLowerCase();
    },
    habilitarBotones: function() {
        var _this = this;
        _this.btnModificarAtri.enable();
        _this.btnEliminarAtri.enable();
    },
    desabilitarBotones: function() {
        var _this = this;
        _this.btnModificarAtri.disable();
        _this.btnEliminarAtri.disable();
    }
});