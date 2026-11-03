Ext.ns('Ext.LOG.moduloMedio');
Ext.QuickTips.init();

/*perfil = window.parent.parent.parent.UCID.portal.perfil;
 function cargarInterfaz(perfil, idioma) {
 var Viewport = new Ext.LOG.moduloMedio.ventana({
 idioma: idioma
 });
 }*/
function cargarInterfaz() {
    Ext.onReady(function() {
        /* Ext.each(acciones_reportes, function(dat) {
         if (dat.abreviatura == 'AFT') {
         
         }
         });*/
        new Ext.LOG.moduloMedio.ventana({
            idioma: Ext.LOG.gestModulo.Idioma,
            acciones_reportes: acciones_reportes
        });
    });
}
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    cargarInterfaz();
});

Ext.LOG.moduloMedio.ventana = Ext.extend(Ext.Viewport, {
    tipo_area_seleccionada: 'entidad',
    constructor: function(config) {

        Ext.apply(this, config);
        this.listaAcciones = new LOG.util.List(config.acciones_reportes);
        this.listaBtn = new LOG.util.List();
        Ext.LOG.moduloMedio.ventana.superclass.constructor.call(this, config);
        var _this = this;
        Ext.LOG.moduloMedio.ventana.denominacionentidad = null;
        Ext.LOG.moduloMedio.ventana.idespecialidad = null;
        Ext.LOG.moduloMedio.ventana.identidad = null;


        _this.keyMap = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: Ext.EventObject.DELETE, // or
                ctrl: false,
                shift: false,
                alt: false,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnEliminar.disabled)
                            _this.onEliminarMedios();
                }
            },
            {
                key: "iI", // or
                ctrl: false,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnAdicionar.disabled) {
                            _this.onAdicionarMedios();
                        }

                }
            },
            {
                key: "mM", // or
                ctrl: true,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnOrganigrama.disabled) {
                            _this.onOrganigramaMedios();
                        }

                }
            },
            {
                key: "gG", // or
                ctrl: true,
                shift: false,
                alt: true,
                fn: function() {
                    if (!_this.keyMap.stopEvent)
                        if (!_this.btnGestnomenclatura.disabled) {
                            _this.onGestionNomenclaturaMedios();
                        }

                }
            }
        ]);
    },
    initComponent: function() {
        var _this = this;

        config = {
            layout: 'border'
        };

        _this.btnAdicionar = new LOG.util.Prototipos.botonAdicionar({
            text: "Ad<u>i</u>cionar",
            disabled: true,
            hidden: (!_this.grantedAction('btnEliminarMedios') && !_this.grantedAction('CT')),
            controlFn: function(b, _caller) {
                if (_this.grantedAction('btnAdicionarMedios')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            },
            tooltip: _this.idioma.TooltbtnAdicionar,
            handler: function() {
                _this.onAdicionarMedios();
                //_this.onAdicionarMedios('add');
            }
        });
        _this.getComboDepositos();

        _this.btnCompletarMedios = new LOG.util.Prototipos.botonAdicionar({
            hidden: true,
            disabled: true,
            text: _this.idioma.btnCompletarMedios,
            tooltip: _this.idioma.TooltbtnCompletarMedios,
            handler: function() {
                //_this.onAdicionarMedios();
                _this.onAdicionarMedios('add');
            }
        });

        _this.btnEliminar = new LOG.util.Prototipos.botonEliminar({
            disabled: true,
            text: _this.idioma.btnEliminar,
            hidden: (!_this.grantedAction('btnEliminarMedios') && !_this.grantedAction('CT')),
            tooltip: _this.idioma.TooltbtnEliminar,
            handler: function() {
                _this.onEliminarMedios();
            }
        });

        _this.btnOrganigrama = LOG.util.UIManager.createBtn({
            iconCls: 'estructura',
            disabled: true,
            text: _this.idioma.btnOrganigrama,
            hidden: (!_this.grantedAction('btnOrganigrama') && !_this.grantedAction('CT')),
            tooltip: _this.idioma.btnTOrganigrama,
            handler: function() {
                _this.onOrganigramaMedios();
            }
        });

        _this.btnImprimir = LOG.util.UIManager.createBtn({
            iconCls: 'crearreporte',
            disabled: true,
            text: _this.idioma.btnImprimir,
            hidden: !_this.grantedAction('btnImprimir131'),
            tooltip: _this.idioma.btnTImprimir,
            handler: function () {
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: {idregnumerico:_this.smtreegrid.getSelected().data.idregnumerico},
                            dirReport: '/distra/logistica/activofijo/modulo/ReporteSRM131',// + dirRep,
                            detailFirma: {}
                        }
                    ]
                }).view();
            }
        });

        /* _this.btnGestnomenclatura = LOG.util.UIManager.createBtn({
         id: 'btnGestnomenclatura',
         iconCls: 'comprobante',
         disabled: true,
         hidden: !_this.grantedAction('btnAgrupaciones'),
         text: _this.idioma.btnGestNomenclatura,
         tooltip: _this.idioma.btnTGestNomenclatura,
         handler: function() {
         _this.onGestionNomenclaturaMedios();
         }
         });*/

        _this.btnConformarexpediente = LOG.util.UIManager.createBtn({
            iconCls: 'comprobante',
            disabled: false,
            text: _this.idioma.btnConformarexpediente,
            tooltip: _this.idioma.btnTConformarexpediente,
            hidden: !_this.grantedAction('btnConformarexpediente'),
            handler: function() {
                _this.keyMap.stopEvent = true;
                var treegrid = _this.getTreegrid().getSelectionModel().getSelected();
                Ext.Ajax.request({
                    url: 'getContorValorInmueble',
                    method: 'POST',
                    params: {
                        ordendermodulo: treegrid.data.ordendermodulo,
                        ordenizqmodulo: treegrid.data.ordenizqmodulo,
                        idarea: _this.comboDeposito.getValue()

                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.datos[0].valorcontable) {
                            var winExpediente = new Ext.LOG.moduloMedio.confExpediente({
                                idioma: _this.idioma,
                                //title: _this.idioma.lbTitleDocExpInmueble,
                                dataregnumerico: _this.getTreegrid().getSelectionModel().getSelected(),
                                identidad: Ext.LOG.moduloMedio.ventana.identidad,
                                valorcontable: rd.datos[0].valorcontable,
                                tree: _this.getTreegrid(),
                                idarea: _this.idPadreNodoSeleccionado,
                                scope: _this
                            });
                            /*winExpediente.init();*/
                            winExpediente.show();
                            winExpediente.maximize();
                        }
                    }
                });
            }
        });

        _this.btnAyuda = new LOG.util.Prototipos.botonAyuda({
            id: 'idmoduloaft'});

        this.smtreegrid = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                'rowselect': function(SelectionModel, rowIndex, record) {

                    _this.habilitarBotones();
                },
                'rowdeselect': function(SelectionModel, rowIndex, record) {
                    _this.desabilitarBotones();

                },
                'selectionchange': function(sm) {
                    var selection = sm.getSelections();
                    _this.btnCompletarMedios.setDisabled((selection.length == 1) ? false : true);

                }
            }
        });

        this.pnlAuxiliar = new LOG.util.UIManager.initPanel({
            region: 'east',
            layout: 'fit',
            width: 400,
            collapsed: true,
            animCollapse: true,
            collapseMode: 'mini',
            split: true,
            collapsible: true
        });
        //Ext.Ajax.timeout = 60000;
        this.treegrid = new Ext.LOG.moduloMedio.CmpTreeGrid({
            id: 'idtreegrid',
            idioma: _this.idioma,
            region: 'center',
            url: 'getModulos',
            sm: this.smtreegrid,
            idarea: _this.idNodoSeleccionado, //_this.comboDeposito.getValue(),
            scope: _this
        });

        // This will make sure we only drop to the view container
        this.treegrid.on('render', function() {
            var dragzone = this.treegrid.getView().el.dom.childNodes[0].childNodes[1];
            this.firstGridDropTarget = new Ext.dd.DropTarget(dragzone, {
                ddGroup: 'firstGridDDGroup',
                copy: false,
                notifyDrop: function(ddSodurce, e, data) {
                    Ext.getBody().mask('Procesando', 'x-mask-loading');
                    var origenes = this.treegrid.getSelectionModel().getSelections();
                    var t = Ext.lib.Event.getTarget(e);
                    var rindex = this.treegrid.getView().findRowIndex(t);
                    if (rindex !== false) {
                        var id_destino = this.treegrid.getStore().getAt(rindex).get('idregnumerico');
                    } else {
                        var id_destino = null;
                    }
                    var ids_origen = new Array();
                    var ids_origenes_padres = new Array();
                    var i = 0;
                    while (i < origenes.length) {
                        if (origenes[i].data.idregnumerico != id_destino) {

                            ids_origen[i] = origenes[i].data.idregnumerico;
                            ids_origenes_padres[i] = origenes[i].data.idpadremodulo;

                        }
                        i += 1;
                    }

                    if (ids_origen.length > 0) {
                        Ext.Ajax.request({
                            url: 'crearModuloDrgDrop',
                            method: 'POST',
                            params: {
                                ids_origen: Ext.encode(ids_origen),
                                ids_origenes_padres: Ext.encode(ids_origenes_padres),
                                id_destino: id_destino
                            },
                            callback: function(options, success, response) {
                                Ext.getBody().unmask();
                                if (success) {
                                    mostrarMensaje(1, 'El modulo ha sido modificado satisfactoriamente.');
                                    _this.treegrid.getStore().baseParams = {};
                                    _this.treegrid.getStore().load({
                                        params: {
                                            anode: null,
                                            _id: null,
                                            idarea: _this.comboDeposito.getValue(),
                                            start: 0,
                                            limit: 20
                                        }
                                    });
                                } else {
                                    mostrarMensaje(3, 'El modulo no se ha podido modificar.');
                                }
                            }
                        });
                    } else {
                        Ext.getBody().unmask();
                    }
                    return (true);
                }.createDelegate(this)
            });
        }, this);

        this.listaBtn.add(_this.btnAdicionar);
        this.listaBtn.add(_this.btnCompletarMedios);
        this.listaBtn.add(_this.btnEliminar);
        this.listaBtn.add(_this.btnOrganigrama);
        this.listaBtn.add(_this.btnImprimir);
        this.listaBtn.add('->');
        this.listaBtn.add(_this.btnAyuda);
        //_this.btnAdicionar, _this.btnCompletarMedios, _this.btnEliminar, _this.btnOrganigrama, '->', _this.btnAyuda
        this.panelX = new Ext.Panel({
            border: false,
            bodyBorder: false,
            region: 'north',
            tbar: [this.listaBtn.getArray()],
            bbar: ['->', {xtype: 'label', text: _this.idioma.lbareaResponsabilidad + ':'}, '', _this.comboDeposito]
        })

        Ext.apply(config, {
            items: [this.panelX, _this.pnlAuxiliar, new Ext.Panel({
                    border: false,
                    bodyBorder: false,
                    layout: 'border',
                    region: 'center',
                    autoScroll: true,
                    items: [_this.treegrid]
                })
            ]
        });
        Ext.apply(this, config);
        Ext.LOG.moduloMedio.ventana.superclass.initComponent.call(this);
    },
    getComboDepositos: function() {
        if (this.comboDeposito == undefined) {
            var _this = this;
            this.stDepositos = new Ext.data.SimpleStore({
                fields: ['id', 'descripcion'],
                data: [],
                autoLoad: false
            });

            this.comboDeposito = new LOG.util.ComboBox({//Ext.form.ComboBox
                width: 400,
                disabled: true,
                //id: 'itemx',
                mode: 'local',
                forceSelection: false,
                allowBlank: false,
                emptyText: '',
                displayField: 'descripcion',
                valueField: 'id',
                hiddenName: 'id',
                readOnly: true,
                store: this.stDepositos,
                editable: false,
                listeners: {
                    'render': function(p) {

                        var theTip = null;

                        p.getEl().on('mouseover', function() {
                            theTip = new Ext.Tip({
                                margin: '0 0 0 200',
                                shadow: false
                            });
                            var pos = _this.comboDeposito.getPosition();
                            var x = pos[0];
                            var y = pos[1] + 20;
                            var text = (_this.identidad == _this.comboDeposito.getValue()) ? _this.idioma.lbEntidad : _this.idioma.lbCbDeposito;
                            theTip.html = '<b>' + text + ':</b>' + ' ' + _this.comboDeposito.getRawValue();
                            theTip.showAt([x, y]);
                        });

                        p.getEl().on('mouseleave', function() {
                            if (theTip)
                                theTip.hide();
                        });
                    },
                    'focus': function(combo) {
                        if (_this.arbolEstructura) {
                            _this.pnlAuxiliar.expand();
                        }
                        //_this.getWinAreasResponsabilidad();
                    }
                }
            });
            //Al crearse la primera vez se tienes que poner el nombre de la entidad
            this.cargarEntidadComboArea();
        }
        return this.comboDeposito;
    },
    cargarEntidadComboArea: function() {
        var _this = this;

        Ext.Ajax.request({
            url: 'getentidad',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                // _this.identidad = rd.identidad;
                // _this.entidad = rd.entidad;

                Ext.LOG.moduloMedio.ventana.denominacionentidad = rd.entidad;
                Ext.LOG.moduloMedio.ventana.identidad = rd.identidad;
                _this.idNodoSeleccionado = rd.identidad;
                _this.denomNodoSeleccionado = rd.entidad;

                _this.idPadreNodoSeleccionado = rd.identidad;
                _this.denomPadreNodoSeleccionado = rd.entidad;
                // _this.comboDeposito.setValue(_this.idNodoSeleccionado);
                _this.comboDeposito.setRawValue(_this.denomNodoSeleccionado);
                _this.comboDeposito.enable();
                _this.treegrid.getStore().load({
                    params: {
                        idarea: _this.idNodoSeleccionado,
                        start: 0,
                        limit: 20
                    }
                });
                _this.crearArbolEstructura();
            }
        });
    },
    onAdicionarMedios: function(accion) {
        var _this = this;
        if (!_this.ventanaAdicionarElemento || !_this.ventanaAdicionarElemento.isVisible()) {

            _this.winAddModulo = new Ext.LOG.moduloMedio.winAddModulo({
                title: _this.idioma.lbTitleWInAdicionarModulo,
                idioma: _this.idioma,
                id: 'ventAdd',
                mostrarEspecialidad: (accion == 'add') ? false : true,
                idarea: _this.comboDeposito.getValue(),
                self: _this
            });
            _this.winAddModulo.fireEvent = _this.winAddModulo.fireEvent.createSequence(function(e) {
                if (e == 'show')
                {
                    _this.changeEvent(true);
                }
                if (e == 'hide') {
                    _this.changeEvent(false);
                }
            });

            _this.winAddModulo.show();
            /*_this.ventanaAdicionarElemento = new Ext.LOG.moduloMedio.VentataAdicionarModulo({
             title: _this.idioma.lbTitleWInAdicionarModulo,
             idioma: _this.idioma,
             id: 'ventAdd',
             closeAction: 'hide',
             mostrarEspecialidad: (accion == 'add') ? false : true,
             idarea: _this.comboDeposito.getValue(),
             self: _this
             });
             _this.ventanaAdicionarElemento.show();*/
        }

    },
    onEliminarMedios: function() {
        var _this = this;
        _this.changeEvent(true);
        mostrarMensaje(2, _this.idioma.lbMsgEliminar2, elimina);
        function elimina(btnPresionado) {
            _this.changeEvent(false);
            if (btnPresionado == 'ok') {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: _this.idioma.labEliminando});
                var datosModulos = new Array();
                var modulosseleccionados = _this.getTreegrid().getSelectionModel().getSelections();
                //var modulos = new Array();
                for (var i = 0; i < modulosseleccionados.length; i++) {
                    datosModulos[i] = {
                        idregnumerico: modulosseleccionados[i].data.idregnumerico,
                        ordenizq: modulosseleccionados[i].data.ordenizqmodulo,
                        ordender: modulosseleccionados[i].data.ordendermodulo,
                        esmodulo: modulosseleccionados[i].data.esmodulo,
                        idarbol: modulosseleccionados[i].data.idarbol
                    }
                }
                myMask.show();
                Ext.Ajax.request({
                    url: 'eliminarModulo',
                    method: 'POST',
                    params: {
                        datosModulos: Ext.encode(datosModulos)
                    },
                    callback: function(options, success, response) {
                        response = Ext.util.JSON.decode(response.responseText);
                        myMask.hide();
                        if (response.Msg == 3)
                            mostrarMensaje(response.Msg, _this.idioma.MsgEliminarModuloError);
                        else
                            mostrarMensaje(1, _this.idioma.MsgEliminarModuloOK);

                        _this.getTreegrid().getSelectionModel().clearSelections();
                        _this.getTreegrid().getStore().baseParams = {};
                        _this.treegrid.getStore().load({
                            params: {
                                idarea: _this.comboDeposito.getValue(),
                                start: Ext.LOG.moduloMedio.start,
                                limit: Ext.LOG.moduloMedio.limit
                            }
                        });
                    }
                });
            }
        }
    },
    onOrganigramaMedios: function() {
        var _this = this;

        var record = this.treegrid.getSelectionModel().getSelected();
        var modulo = record.data;

        Ext.Ajax.request({
            url: 'getArrayIdsImagenesIndicador',
            method: 'POST',
            params: {
                idindicador: modulo.idindicador
            },
            callback: function(options, success, response) {

                var response = Ext.util.JSON.decode(response.responseText);
                var text = modulo.denominacion;

                /*  if (modulo.descripcionmarcamodelo != null) {
                 text += ' ' + modulo.descripcionmarcamodelo;
                 }
                 text += '</br>';
                 if (modulo.nroinventario != null) {
                 text += '</br>N.\xb0 inventario: ' + modulo.nroinventario;
                 }
                 if (modulo.nroserie != null) {
                 text += '</br>N.\xb0 nroserie: ' + modulo.nroserie;
                 }
                 var moduloRaiz = {
                 idregnumerico: modulo.idregnumerico,
                 text: text,
                 esmodulo: modulo.esmodulo,
                 ordenizq: modulo.ordenderm,
                 ordender: modulo.ordenderm,
                 idpadre: modulo.idpadrem,
                 imagenes: response.imagenes
                 };
                 var organigrama = new Ext.LOG.Organigrama({
                 moduloRaiz: moduloRaiz,
                 idarea: _this.comboDeposito.getValue(),
                 etiq: _this.idioma
                 });
                 
                 var ventanaVistaOrganigrama = new Ext.Window({
                 title: 'Organigrama',
                 resizable: false,
                 modal: true,
                 buttons: [{
                 iconCls: 'cancelar',
                 text: 'Cerrar',
                 tooltip: 'Cerrar ventana',
                 handler: function() {
                 ventanaVistaOrganigrama.close();
                 }
                 }],
                 listeners: {
                 'close': function() {
                 _this.treegrid.getSelectionModel().clearSelections();// = {};
                 _this.treegrid.getStore().baseParams = {};
                 _this.treegrid.getStore().load({
                 params: {
                 idarea: _this.comboDeposito.getValue()
                 }
                 });
                 }
                 },
                 items: [organigrama]
                 });
                 
                 ventanaVistaOrganigrama.show();
                 ventanaVistaOrganigrama.maximize();*/
                this.winViewOrganigrama = new Ext.LOG.moduloMedio.winViewOrganigrama({
                    title: 'Organigrama',
                    idioma: _this.idioma,
                    response: response,
                    text: text,
                    modulo: modulo,
                    treegrid: _this.treegrid,
                    comboDeposito: _this.comboDeposito
                });
                this.winViewOrganigrama.fireEvent = this.winViewOrganigrama.fireEvent.createSequence(function(e) {
                    if (e == 'show')
                    {
                        _this.changeEvent(true);
                    }
                    if (e == 'hide')
                    {
                        _this.changeEvent(false);
                    }
                });
                this.winViewOrganigrama.show();
                this.winViewOrganigrama.maximize();
            }
        });

    },
    onGestionNomenclaturaMedios: function(accion) {
        var _this = this;

        this.ventana = new Ext.LOG.moduloMedio.panelNomenMod({
            idioma: _this.idioma,
            formaVisualizacion: 'ventana',
            title: _this.idioma.lbTitleWInGestionarNomModulo,
            idarea: _this.comboDeposito.getValue(),
            width: 950,
            height: 400,
            accion: 'gestagrupacion',
            ventana: true,
            scope: _this
                    //this.baseParams.accion = 'gestagrupacion';
        });
        this.ventana.init();
        _this.ventana.getVistaPrincipal().fireEvent = _this.ventana.getVistaPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'show') {
                _this.changeEvent(true);
                _this.ventana.keyMap.stopEvent = true;
            }
            if (e == 'hide') {
                _this.changeEvent(false);
                _this.ventana.keyMap.stopEvent = false;
            }
        });
        _this.vistaProductos = this.ventana.view();

        _this.vistaProductos.show();
        this.ventana.getStorePrincipal().initBaseParams.idarea = _this.comboDeposito.getValue();
        this.ventana.getStorePrincipal().initBaseParams.interfazNrodinventario = 1;
        this.ventana.getStorePrincipal().initBaseParams.accion = 'gestagrupacion';
        this.ventana.smGridPrincipal.on({
            'rowselect': function(sm, row, record) {
                (record.data.estado == "1") ? _this.ventana.Activar.disable() : _this.ventana.Activar.enable();
                var aux = false;
                for (var i = 0; i < sm.selections.items.length; i++) {
                    if (sm.selections.items[i].data.estado == 0) {
                        aux = true;
                        break;
                    }
                }
                if (aux) {
                    _this.ventana.Eliminar.disable();
                }

                if (sm.selections.items.length == 0) {
                    _this.ventana.Modificar.disable();
                    _this.ventana.Eliminar.disable();
                }
                else if (sm.selections.items.length == 1) {
                    _this.ventana.Modificar.enable();
                    _this.ventana.Eliminar.enable();

                } else {
                    _this.ventana.Eliminar.enable();
                    _this.ventana.Modificar.disable();
                }
                if (sm.selections.items.length > 0) {
                    _this.vistaProductos.listaBotones.getItem(2).enable();
                    _this.vistaProductos.listaBotones.getItem(1).enable();
                } else {
                    _this.vistaProductos.listaBotones.getItem(2).disable();
                    _this.vistaProductos.listaBotones.getItem(1).disable();
                }
            },
            'rowdeselect': function(sm, row, record) {

                if (sm.selections.items.length == 0) {
                    _this.ventana.Modificar.disable();
                    _this.ventana.Eliminar.disable();
                }
                else if (sm.selections.items.length == 1) {
                    _this.ventana.Modificar.enable();
                    _this.ventana.Eliminar.enable();
                    _this.ventana.Activar.disable()
                } else {
                    _this.ventana.Eliminar.enable();
                    _this.ventana.Modificar.disable();
                }
                var aux = false;
                for (var i = 0; i < sm.selections.items.length; i++) {
                    if (sm.selections.items[i].data.estado == 0) {
                        aux = true;
                        break;
                    }
                }
                if (aux) {
                    _this.ventana.Eliminar.disable();
                }

                if (sm.selections.items.length > 0) {
                    _this.vistaProductos.listaBotones.getItem(2).enable();
                    _this.vistaProductos.listaBotones.getItem(1).enable();
                } else {
                    _this.vistaProductos.listaBotones.getItem(2).disable();
                    _this.vistaProductos.listaBotones.getItem(1).disable();
                }
                _this.ventana.Activar.disable();

            }
        });
        this.ventana.getStorePrincipal().on('load', function(store, records, options) {

            if (records.length > 0) {
                //_this.Grid.getSelectionModel().selectFirstRow();
            } else {
                _this.ventana.Activar.disable();
                _this.ventana.Modificar.disable();
                _this.ventana.Eliminar.disable();
                _this.vistaProductos.listaBotones.getItem(2).disable();
            }
        });
        _this.vistaProductos.listaBotones.getItem(1).setVisible(false);
        LOG.util.UIManager.apply(_this.vistaProductos.listaBotones.getItem(0), {
            handler: function() {
                this.destroy();
                _this.keyMap.stopEvent = true;
            }
        });

    },
    getTreegrid: function() {
        return this.treegrid;
    },
    onAyudaMedios: function() {
        var title = 'Ayuda de Modulo de los medios';
        var referencia = 'Logística/Gestión del transporte/Modulo de los medios';
        help.show(title, referencia);
    },
    habilitarBotones: function() {
        if (this.getTreegrid().getSelectionModel().hasSelection()) {
            this.btnEliminar.enable();
            var seleccionados = this.getTreegrid().getSelectionModel().getSelections();
            if (seleccionados.length > 1) {
                this.btnImprimir.disable();
                this.btnAdicionar.disable();
                this.btnOrganigrama.disable();
            } else {
                this.btnImprimir.enable();
                if (this.tipo_area_seleccionada != 'entidad') {
                    this.btnOrganigrama.enable();
                } else {
                    this.btnOrganigrama.disable();
                }
            }
        }

    },
    desabilitarBotones: function() {
        this.btnOrganigrama.enable();
        this.btnEliminar.disable();
        this.btnImprimir.disable();
        var seleccionados = this.getTreegrid().getSelectionModel().getSelections();
        if (seleccionados.length == 1) {
            this.btnAdicionar.enable();
            this.btnImprimir.enable();
            this.btnOrganigrama.enable();
        } else {
            this.btnOrganigrama.disable();
        }
    },
    crearArbolEstructura: function(config) {
        var _this = this;
        var config = {
            doAction: function(nodo) {
                //  Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
                function funcion() {

                    _this.idNodoSeleccionado = nodo.attributes.id;
                    _this.denomNodoSeleccionado = nodo.attributes.text;
                    _this.caminoNodoSeleccionado = nodo.attributes.caminoDenominacion;

                    _this.comboDeposito.setValue(_this.idNodoSeleccionado);
                    _this.comboDeposito.setRawValue(_this.caminoNodoSeleccionado);
                    var nodoPadre = _this.arbolEstructura.dameNodoEntidadPertenece(nodo.attributes.id);

                    _this.idPadreNodoSeleccionado = nodoPadre.attributes.id;
                    _this.denomPadreNodoSeleccionado = nodoPadre.attributes.text;

                    _this.treegrid.getStore().load({
                        params: {
                            idarea: _this.idNodoSeleccionado,
                            start: 0,
                            limit: 20
                        },
                        callback: function() {
                            _this.habilitarBotones();
                            //Ext.getBody().unmask();
                        }
                    });

                }

                if (nodo.getDepth() == 0) {
                    //  Es padre
                    _this.tipo_area_seleccionada = 'entidad';
                    _this.btnAdicionar.disable();
                    // _this.btnGestnomenclatura.disable();
                } else if (nodo.attributes.interna) {
                    //  Es un área responzabilidad
                    _this.tipo_area_seleccionada = 'arearesp';
                    _this.btnAdicionar.enable();
                    // _this.btnGestnomenclatura.enable();
                } else {
                    _this.tipo_area_seleccionada = 'otra';
                    _this.btnAdicionar.enable();
                    // _this.btnGestnomenclatura.enable();
                }
                funcion();
            }
        };

        _this.arbolEstructura = new Log.AF.Utiles.ArbolAreaResp({
            bodyStyle: 'background: white',
            entidad: _this.denomPadreNodoSeleccionado,
            identidad: _this.idPadreNodoSeleccionado,
            region: 'center',
            border: false,
            bodyBorder: false,
            urlParams: 'cargarcomboarea',
            check: {
                conCheck: -1,
                chequeados: new Array()
            }
        });

        _this.arbolEstructura.initEventos(config);
        _this.arbolEstructura.asignarNodoPadre(_this.denomPadreNodoSeleccionado, _this.idPadreNodoSeleccionado);

//        var busqueda = _this.winAvanzada.getForm();
//        busqueda.region = 'south';
//        busqueda.height = 220;

//        var btnBuscar = {
//            text: 'Buscar',
//            tooltip: 'Muestra los resultados de la b&uacute;squeda',
//            iconCls: 'buscar',
//            handler: function () {
//                _this.stDocumento.baseParams.idusuario = _this.winAvanzada.comboAutor.getValue();
//                _this.stDocumento.baseParams.nrodoc = (_this.winAvanzada.NroDoc.getValue() != '') ? _this.winAvanzada.NroDoc.getValue() : null;
//                _this.stDocumento.baseParams.idoperacion = _this.winAvanzada.comboOperaciones.getValue();
//                _this.stDocumento.baseParams.idestado = _this.winAvanzada.cmbBuscarEstado.getValue();
//                _this.stDocumento.baseParams.iddoc = _this.winAvanzada.comboTipoDoc.getValue();
//                _this.stDocumento.baseParams.desde = _this.winAvanzada.FechaDesde.getRawValue();
//                _this.stDocumento.baseParams.hasta = _this.winAvanzada.FechaHasta.getRawValue();
//                _this.stDocumento.load({
//                    params: {
//                        start: 0,
//                        limit: _this.getGridDocumento().getBottomToolbar().cbPageSize.getValue()
//                    }
//                });
//                _this.stDocumento.baseParams = {};
//            }
//        };

        _this.pnlAuxiliar.add({
            xtype: 'panel',
            layout: 'border',
            frame: true,
            items: [_this.arbolEstructura/*, busqueda*/],
//            buttons: [{
//                text: 'Ocultar',
//                tooltip: 'Ocultar panel de la b&uacute;squeda',
//                iconCls: 'cerrar',
//                handler: function () {
//
//                    _this.pnlAuxiliar.collapse();
//                }
//            }, {
//                text: 'Limpiar',
//                tooltip: 'Limpiar los campos y reiniciar la b&uacute;squeda',
//                iconCls: 'limpiar',
//                handler: function () {
//
//                    busqueda.getForm().reset();
//                    _this.stDocumento.baseParams = {};
//                    _this.stDocumento.load({
//                        params: {
//                            start: 0,
//                            limit: _this.getGridDocumento().getBottomToolbar().cbPageSize.getValue()
//                        }
//                    });
//                }
//            }, btnBuscar]
        });

        // _this.winAvanzada.btnBuscar = btnBuscar;

    },
    grantedAction: function(idAccion) {
        var existe = false;
        this.listaAcciones.each(function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    changeEvent: function(value)
    {
        this.keyMap.stopEvent = value;
    }

});



Ext.LOG.moduloMedio.winViewOrganigrama = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        this.resizable = true;
        this.usarAplicar = false;
        this.usarAceptar = false;
        this.modal = true;
        this.idioma = config.idioma;
        Ext.LOG.moduloMedio.winViewOrganigrama.superclass.constructor.call(this, config);
        this.panelDatos(this.modulo);
    },
    initComponent: function(config) {
        var _this = this;
        Ext.LOG.moduloMedio.winViewOrganigrama.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function() {
                this.close();
                this.treegrid.getSelectionModel().clearSelections();
                this.treegrid.getStore().baseParams = {};
                this.treegrid.getStore().load({
                    params: {
                        idarea: this.comboDeposito.getValue()
                    }
                });
            }
        });
    },
    panelDatos: function(modulo) {


        if (modulo.descripcionmarcamodelo != null) {
            this.text += ' ' + modulo.descripcionmarcamodelo;
        }
        this.text += '</br>';
        if (modulo.nroinventario != null) {
            this.text += '</br>N.\xb0 inventario: ' + modulo.nroinventario;
        }
        if (modulo.nroserie != null) {
            this.text += '</br>N.\xb0 serie: ' + modulo.nroserie;
        }
        var moduloRaiz = {
            idregnumerico: modulo.idregnumerico,
            text: this.text,
            esmodulo: modulo.esmodulo,
            ordenizq: modulo.ordenderm,
            ordender: modulo.ordenderm,
            idpadre: modulo.idpadrem,
            imagenes: this.response.imagenes
        };

        var organigrama = new Ext.LOG.Organigrama({
            moduloRaiz: moduloRaiz,
            idarea: this.comboDeposito.getValue(),
            etiq: this.idioma
        });
        this.add(organigrama);
    }
});

