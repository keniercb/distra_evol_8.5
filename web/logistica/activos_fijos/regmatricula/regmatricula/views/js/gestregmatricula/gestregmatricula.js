Ext.ns('Ext.LOG');

Ext.LOG.gestregmatricula2 = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        this.autoLoad = true;
        this.dirController = '/logistica/activos_fijos/regmatricula/regmatricula/index.php/gestregmatricula';
        this.busquedaBasica = false;
        this.urlBusquedaGridPrincipal = 'cargarGridCentral';
        Ext.LOG.gestregmatricula.superclass.constructor.call(this, config);
        this.plugins = new Array();
    },
    initDefaultColumns: function () {
        var _this = this;
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '</br><b>',
                _this.etiquetas.lbDatosmedio,
                ':</b></br></br>', '</b>{datosgenerales}', '</br></br>'
            )
        });
        this.addGridColumn({
            header: _this.idioma.lbCmCodigo,
            dataIndex: 'codigo',
            width: 90,
            autoExpand: true,
            default: true,
            renderer: _this.activarColores,
        });
        this.addGridColumn({
            header: _this.idioma.lbCmDenominacion,
            dataIndex: 'denominacion',
            agrupador: true,
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCmMarca,
            width: 90,
            dataIndex: 'marca',
            tooltip: _this.idioma.lbTtRecurso,
            default: true,
            renderer: _this.activarColores,
        });
        this.addGridColumn({
            header: _this.idioma.lbCmModelo,
            width: 90,
            dataIndex: 'modelo',
            tooltip: _this.idioma.lbTtRecurso,
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmMatricula,
            width: 100,
            dataIndex: 'nromatricula',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmCombustible,
            width: 90,
            dataIndex: 'combustible',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmAnnoFab,
            width: 135,
            dataIndex: 'annofabricacion',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmNacionalidad,
            width: 90,
            dataIndex: 'nacionalidad',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmColorPrim,
            width: 100,
            dataIndex: 'colorptim',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmColorSec,
            width: 100,
            dataIndex: 'colorsec',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmNroMotor1,
            width: 90,
            dataIndex: 'nromotor1',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmNroMotor2,
            width: 90,
            dataIndex: 'nromotor2',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmNoSerie,
            width: 90,
            dataIndex: 'nroserie',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            header: _this.idioma.lbCmEstado,
            width: 125,
            dataIndex: 'denomestado',
            default: true,
            renderer: _this.activarColores
        });
        this.addGridColumn({
            dataIndex: 'idestatustecnico',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'registro',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtipotramite',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'numerolaser1',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'numerolaser2',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tonelage',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'foliocirculacion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idcolorchapa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idtipochapa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idsector',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomtipotramite',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomcolorchapa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomtipochapa',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomsector',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpersona',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denompersona',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomestructuraop',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomestructura',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idmoneda',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idprod',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'datosgenerales',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idinspectormatricula',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'nombreinspector',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'moneda',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'poseedorlegal',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'direccion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'provincia',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'municipio',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'regestructura',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'acreditador',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'funcionario',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denomtipotramite',
            default: true
        });
        this.addGridColumn({
            hidden: (!Ext.aft.winAddMedio.winAddActiva) ? _this.expander : true,
            default: true
        });
        _this.plugins = _this.expander
    }
});


Ext.LOG.gestregmatricula = Ext.extend(Ext.Viewport, {
    layout: 'border',
    constructor: function (config) {
        var _this = this;
        Ext.LOG.gestregmatricula.vistaactiva = null;
        _this.idioma = config.idioma;
        _this.deposito = _this.getComboDepositos();
        if (!_this.stopGrid) {
            _this.getComboDepositos();
        }


        _this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionarMedios',
            iconCls: 'adicionar',
            disabled: true,
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.lbTtBtnAdicionar,
            handler: function () {

                _this.winAddMedio = new Ext.aft.winAddMedio({
                    title: _this.idioma.lbTitleAdicionarMedio,
                    configuracion: _this,
                    gridCEntral: _this.gridCEntral

                });
                _this.winAddMedio.show();
            }
        });

        _this.btnVista = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnVista,
            iconCls: 'ver',
            isContextual: true,
            id: 'vista',
            menu: [
                new Ext.menu.Item({
                    text: _this.idioma.btnVehiculo,
                    tooltip: _this.idioma.lbTtBtnVehiculo,
                    iconCls: 'crearreporte',
                    id: 'vehiculo',
                    handler: function () {
                        Ext.getBody().mask('Cargando...', 'x-mask-loading');

                        Ext.getCmp('vehiculooper').enable();
                        Ext.getCmp('vehiculo').disable();
                        Ext.LOG.gestregmatricula.vistaactiva = "VEHICULO";

                        _this.textVista.setText(_this.idioma.textVistasRegistro);
                        _this.gridCEntral.getStore().load({
                            params: {
                                permisoacciones: 0
                            }
                        })

                    }
                }),
                new Ext.menu.Item({
                    text: _this.idioma.btnVehiculoOperativo,
                    tooltip: _this.idioma.lbTtBtnVehiculoOperativo,
                    iconCls: 'crearreporte',
                    id: 'vehiculooper',
                    handler: function () {
                        Ext.getBody().mask('Cargando...', 'x-mask-loading');

                        Ext.getCmp('vehiculooper').disable();
                        Ext.getCmp('vehiculo').enable();
                        Ext.LOG.gestregmatricula.vistaactiva = "VEHICULOOPR";
                        _this.textVista.setText(_this.idioma.textVistasRegistroOper);

                        _this.gridCEntral.getStore().load({
                            params: {
                                permisoacciones: 1
                            }
                        })
                    }
                })
            ]
        });

        _this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            iconCls: 'modificar',
            disabled: true,
            text: _this.idioma.lbBtnModificar,
            tooltip: _this.idioma.lbTtBtnModificar,
            handler: function () {
                _this.winModificarMedio = new Ext.LOG.winRegistrar.Medios({
                    title: (Ext.getCmp('vehiculo').disabled) ? _this.idioma.textVistasModificarVehi : _this.idioma.textVistasModificarVehioper,
                    configuracion: _this,
                    gridCEntral: _this.gridCEntral,
                    registrar: false
                });

                /* var validador = new FormValidator({
                 buttons: [_this.winModificarMedio.btnAceptarWinReg],
                 buttonsRegister: [_this.winModificarMedio.btnCancelarWinReg],
                 fields: [_this.winModificarMedio.comboTipoTramite, _this.winModificarMedio.comboColorChapa,
                 _this.winModificarMedio.comboSector, _this.winModificarMedio.comboTipoChapa,
                 _this.winModificarMedio.textfieldlaser1, _this.winModificarMedio.textfieldlaser2,
                 _this.winModificarMedio.textfieldFolio, _this.winModificarMedio.textfieldTonelaje,
                 _this.winModificarMedio.textfieldDireccion, _this.winModificarMedio.cmpEditable,
                 _this.winModificarMedio.comboMoneda ],
                 keyMapContainer: _this.winModificarMedio
                 });*/
                _this.winModificarMedio.show();
            }
        });

        _this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            iconCls: 'eliminar',
            disabled: true,
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminar,
            handler: function () {
                _this.getEliminarMedio();
            }
        });


        _this.btnRegistrar = new Ext.Button({
            text: _this.idioma.lbBtnRegistrar,
            tooltip: (Ext.LOG.gestregmatricula.vistaactiva != "VEHICULOOPR") ? _this.idioma.lbTtBtnRegistrarOP : _this.idioma.lbTtBtnRegistrar,
            iconCls: 'crearreporte',
            id: 'registrar',
            disabled: true,
            handler: function () {
                _this.winRegistrarMedio = new Ext.LOG.winRegistrar.Medios({
                    title: (Ext.getCmp('vehiculo').disabled) ? _this.idioma.textVistasRegistro : _this.idioma.textVistasRegistroOper,
                    configuracion: _this,
                    gridCEntral: _this.gridCEntral,
                    registrar: true
                });
                /* var validador = new FormValidator({
                 buttons: [_this.winRegistrarMedio.btnAceptarWinReg],
                 buttonsRegister: [_this.winRegistrarMedio.btnCancelarWinReg],
                 fields: [_this.winRegistrarMedio.comboTipoTramite, _this.winRegistrarMedio.comboColorChapa,
                 _this.winRegistrarMedio.comboSector, _this.winRegistrarMedio.comboTipoChapa,
                 _this.winRegistrarMedio.textfieldlaser1, _this.winRegistrarMedio.textfieldlaser2,
                 _this.winRegistrarMedio.textfieldFolio, _this.winRegistrarMedio.textfieldTonelaje,
                 _this.winRegistrarMedio.textfieldDireccion, _this.winRegistrarMedio.cmpEditable,
                 _this.winRegistrarMedio.comboMoneda, _this.winRegistrarMedio.comboInspector
                 ],
                 keyMapContainer: _this.winModificarMedio
                 });*/
                _this.winRegistrarMedio.show();
            }
        });

        _this.btnImprimirM = new Ext.Button({
            id: 'btnImprimirM',
            iconCls: 'imprimir',
            disabled: true,
            text: _this.idioma.lbBtnImprimirM,
            tooltip: _this.idioma.lbTtBtnImprimirM,
            handler: function () {
                var winImprimir = new Ext.aft.gestregmatricula.VentanaReporte({
                    idioma: _this.idioma,
                    _parent: _this,
                    smGrid: _this.sm,
                    idestructura: _this.identidad,
                    entidad: Ext.aft.gestregmatricula.utf8_encode(_this.entidad)
                });

                winImprimir.show();
            }

        });

        _this.btnImprimir = new Ext.Button({
            id: 'btnImprimirL',
            iconCls: 'imprimir',
            text: _this.idioma.lbBtnImprimirL,
            tooltip: _this.idioma.lbTtBtnImprimirL,
            handler: function () {

                var report = new Distra.util.report.ReportView({
                    reportList: [
                        {
                            name: 'Vista principal',
                            params: {
                                iddeposito: _this.idarearesp,
                                idestructura: _this.identidad,
                                entidad: Ext.aft.gestregmatricula.utf8_encode(_this.entidad),
                                permisoacciones: (Ext.getCmp('vehiculo').disabled) ? 0 : 1,
                                arearesponsabilidad: Ext.aft.gestregmatricula.utf8_encode(Ext.getCmp('itemx').getRawValue())
                            },
                            dirReports: '/distra/logistica/activofijo/Registro_matricula/ReporteListadoMatricula'
                        }
                    ]
                });
                report.view();
            }
        });

        _this.btnMostrar = new Ext.Button({
            id: 'btnMostrar',
            iconCls: 'mostrar',
            disabled: true,
            text: _this.idioma.lbBtnMostrar,
            tooltip: _this.idioma.lbTtBtnMostrar,
            handler: function () {

                var record = _this.gridCEntral.getSelectionModel().getSelected();
                var titulo = record.data.denominacion;
                titulo += (record.get('marca') != null) ? (' ' + record.get('marca')) : '';
                titulo += (record.get('modelo') != null) ? (' - ' + record.get('modelo')) : '';

                var params = {
                    idactivofijo: record.get('idproducto'),
                    entidad: _this.comboDeposito.getRawValue()
                };

                var record = record.data;
                //record.nombrepais = record.siglasnacionalidad;

                var ventana = new Ext.LOG.winMostrar.vActivos({
                    etiquetas: _this.idioma,
                    title: titulo,
                    datos: record,
                    param: params
                });
                ventana.show();
            }
        });

        _this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            text: _this.idioma.lbBtnAyuda,
            tooltip: _this.idioma.ToolbtnAyuda,
            handler: function () {
                var title = 'Ayuda de Modulo de los medios';
                var referencia = '';
                help.show(title, referencia);
            }
        });

        _this.textVista = new Ext.form.Label({
            id: 'textVista',
            text: ""
        });

        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            checkOnly: false,
            listeners: {
                'rowselect': function (sm, rowIndex, r) {


                    if (sm.selections.items.length == 1) {
                        if (sm.selections.items[0].data.registro != 1) {
                            _this.btnRegistrar.enable();
                            _this.btnEliminar.enable();
                            _this.btnMostrar.enable();
                        } else {
                            _this.btnMostrar.enable();
                            _this.btnModificar.enable();
                            _this.btnRegistrar.disable();

                        }
                        _this.btnImprimirM.enable();
                    }
                    else {
                        _this.btnMostrar.disable();
                        _this.btnModificar.disable();
                        _this.btnRegistrar.disable();
                        for (var i = 0; i < sm.selections.items.length; i++) {

                            if (sm.selections.items[i].data.registro == 1) {
                                _this.btnEliminar.disable();
                                break;
                            } else {
                                _this.btnEliminar.enable();
                            }
                        }
                        _this.btnImprimirM.disable();
                    }

                },
                'rowdeselect': function (sm, rowIndex, r) {

                    if (sm.selections.items.length == 0) {
                        _this.btnImprimirM.disable();
                        _this.btnRegistrar.disable();
                        _this.btnEliminar.disable();
                        _this.btnModificar.disable();
                        _this.btnMostrar.disable();
                    }
                    else if (sm.selections.items.length == 1) {
                        _this.btnImprimirM.enable();
                        if (sm.selections.items[0].data.registro != 1) {
                            _this.btnRegistrar.enable();
                            _this.btnEliminar.enable();
                            _this.btnMostrar.enable();
                        } else {
                            _this.btnModificar.enable();
                            _this.btnRegistrar.disable();
                            _this.btnMostrar.enable();
                        }
                    }
                    else {
                        _this.btnImprimirM.disable();
                        _this.btnMostrar.disable();
                        _this.btnModificar.disable();
                        _this.btnRegistrar.disable();

                        for (var i = 0; i < sm.selections.items.length; i++) {
                            if (sm.selections.items[i].data.registro == 1) {
                                _this.btnEliminar.disable();
                                break
                            } else {
                                _this.btnEliminar.enable();
                            }
                        }
                    }
                }
            }

        });

        this.gridCEntral = new Ext.aft.gridCentralRegMatricula({
            configuracion: _this,
            url: (_this.stopGrid) ? "" : 'cargarGridCentral',
            activartbar: true,
            autoload: false,
            sm: _this.sm,
            cargarcentral: true

        });
        this.gridCEntral.getStore().fireEvent = this.gridCEntral.getStore().fireEvent.createSequence(function (e, cmp) {
            if ('load' == e) {
                if (_this.gridCEntral.getStore().getCount() == 0) {
                    _this.btnImprimir.disable();
                } else {
                    _this.btnImprimir.enable();
                }
            }
        });

        _this.panelnorth = new Ext.Panel({
            border: false,
            bodyBorder: false,
            region: 'north',
            tbar: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnRegistrar, _this.btnImprimirM, _this.btnImprimir, _this.btnMostrar, '->', _this.btnVista, _this.btnAyuda],
            bbar: [_this.textVista/*{html: '<p><div></div></p>',id: 'vistaaccion' },'<b>'+ " " +'</b>'*/, '->', (_this.stopGrid) ? " " : {
                xtype: 'label',
                text: _this.idioma.lbArearesponsabilidad + ':'
            }, '', (_this.stopGrid) ? " " : _this.comboDeposito]
        });

        _this.panelcenter = new Ext.Panel({
            border: false,
            bodyBorder: false,
            layout: 'border',
            region: 'center',
            autoScroll: true,
            items: [_this.gridCEntral]
        });
        _this.getaccion();
        _this.getActivarBotones();
        this.items = [_this.panelnorth, _this.panelcenter];

        document.onkeyup = function (e) {


            /*if (e.altKey && e.ctrlKey) {

             if (e.which == Ext.EventObject.R) {
             if (_this.btnRegistroNumerico) {
             if (!_this.btnRegistroNumerico.disabled) {
             _this.btnRegistroNumerico.handler();
             }
             }
             }else if (e.which == Ext.EventObject.M) {
             if (_this.btnDetalles && !_this.btnDetalles.disabled) {
             _this.btnDetalles.handler();
             }
             }
             }*/


            if (e.altKey) {
                if (!e.ctrlKey) {
                    if (e.which == Ext.EventObject.H) {
                        _this.btnAyuda.handler();

                    } else if (e.which == Ext.EventObject.B) {
                        if (!Ext.aft.winAddMedio.winAddActiva) {
                            if (_this.gridCEntral.btnBuscar) {
                                _this.gridCEntral.btnBuscar.handler();
                            }
                        } else {
                            if (Ext.getCmp('buscarADD')) {
                                Ext.getCmp('buscarADD').handler();
                            }
                        }

                    } else if (e.which == Ext.EventObject.L) {
                        if (!Ext.aft.winAddMedio.winAddActiva) {
                            if (_this.gridCEntral.btnLimpiar) {
                                _this.gridCEntral.btnLimpiar.handler();
                            }
                        } else {
                            if (Ext.getCmp('limpiarADD')) {
                                Ext.getCmp('limpiarADD').handler();
                            }
                        }

                    } else if (e.which == Ext.EventObject.I) {
                        if (_this.btnAdicionar) {
                            _this.btnAdicionar.handler();
                        }
                    } else if (e.which == Ext.EventObject.M) {
                        if (!_this.btnModificar.disabled) {
                            _this.btnModificar.handler();
                        }
                    }

                } else {
                    if (e.which == Ext.EventObject.B) {
                        if (!Ext.aft.winAddMedio.winAddActiva) {
                            if (_this.gridCEntral.btnBusquedaAvz) {
                                if (!_this.gridCEntral.btnBusqavanz.disabled) {
                                    _this.gridCEntral.btnBusqavanz.handler();
                                }
                            }
                            if (_this.gridCEntral.btnBusqavanz) {
                                if (!_this.gridCEntral.btnBusqavanz.disabled) {
                                    _this.gridCEntral.btnBusqavanz.handler();
                                }
                            }
                        } else {
                            if (Ext.getCmp('buttonADD')) {
                                Ext.getCmp('buttonADD').handler();
                            }

                        }

                    } else if (e.which == Ext.EventObject.R) {
                        if (_this.btnRegistrar) {
                            if (!_this.btnRegistrar.disabled) {
                                _this.btnRegistrar.handler();
                            }
                        }
                    } else if (e.which == Ext.EventObject.M) {
                        if (_this.btnMostrar) {
                            if (!_this.btnMostrar.disabled) {
                                _this.btnMostrar.handler();
                            }
                        }
                    }

                }
            }
            if (e.which == Ext.EventObject.DELETE) {
                if (!_this.btnEliminar.disabled) {
                    _this.btnEliminar.handler();
                }
            }
        };

        Ext.LOG.gestregmatricula.superclass.constructor.call(this, arguments);

    },
    getComboDepositos: function () {
        if (this.comboDeposito == undefined) {
            var _this = this;
            this.stDepositos = new Ext.data.SimpleStore({
                fields: ['id', 'descripcion'],
                data: [],
                autoLoad: false
            });

            this.comboDeposito = new Ext.form.ComboBox({
                width: 300,
                disabled: true,
                id: 'itemx',
                mode: 'local',
                allowBlank: false,
                emptyText: 'Seleccione...',
                displayField: 'descripcion',
                valueField: 'id',
                hiddenName: 'id',
                readOnly: true,
                store: this.stDepositos,
                editable: false,
                listeners: {
                    'render': function (p) {

                        var theTip = null;

                        p.getEl().on('mouseover', function () {
                            theTip = new Ext.Tip({
                                margin: '0 0 0 200',
                                shadow: false
                            });
                            var pos = _this.comboDeposito.getPosition();
                            var x = pos[0];
                            var y = pos[1] + 20;
                            var text = (_this.identidad == _this.comboDeposito.getValue()) ? _this.idioma.lbEntidad : ''/*_this.idioma.lbCbDeposito*/;
                            theTip.html = '<b>' + text + ':</b>' + ' ' + _this.comboDeposito.getRawValue();
                            theTip.showAt([x, y]);
                        });

                        p.getEl().on('mouseleave', function () {
                            if (theTip)
                                theTip.hide();
                        });
                    },
                    'focus': function (combo) {
                        //_this.mostrarWinSelectEntidad();
                        _this.getWinAreasResponsabilidad();

                    }
                }
            });
            //Al crearse la primera vez se tienes que poner el nombre de la entidad
            this.cargarEntidadComboArea();

        }

        return this.comboDeposito;
    },


    mostrarWinSelectEntidad: function () {
        var _this = this;
        if (!winSelecEntidad) {

            var arbolEntidades = new Ext.tree.TreePanel({
                change: false,
                hasChecked: true,
                autoScroll: true,
                region: 'center',
                split: true,
                margins: '2 2 2 0',
                width: 360,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: 'cargarcomboarea',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {};
                            if (anode.attributes.idestructuraop)
                                atreeloader.baseParams.idarea = anode.attributes.idestructuraop;
                        },
                        'load': function (atreeloader, anode) {

                            for (var i = 0; i < anode.childNodes.length; i++) {
                               // console.info(anode.childNodes[i]);return;
                                if (anode.childNodes[i].attributes.disabled) {
                                    anode.childNodes[i].disable();
                                }else{
                                    anode.childNodes[i].enable();
                                }
                            }
                           /* hijosNodo = anode.childNodes;
                            if (_this.authModoficar) {
                                if (hijosNodo.length) {
                                    for (i = 0; i < hijosNodo.length; i++) {
                                        nodoHijo = hijosNodo[i];
                                        if (nodoHijo.attributes.checked)
                                            adicionarEnDeschequeados(arrayTieneEstructura, nodoHijo.attributes.id);
                                    }
                                }
                                var id;
                                if (anode.attributes.tipo == 'externa')
                                    id = anode.attributes.id;
                                else
                                    id = anode.attributes.id;
                                var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                                if (esta1 != -1) {
                                    eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                                    if (_this.arbolEntidades.getChecked("id", anode).length == 0) {
                                        hijosNodo = anode.childNodes;
                                        for (i = 0; i < hijosNodo.length; i++) {
                                            if (!hijosNodo[i].isLeaf()) {
                                                if (hijosNodo[i].attributes.tipo == 'externa')
                                                    id = anode.attributes.id;
                                                else
                                                    id = anode.attributes.id;
                                                adicionarEnDeschequeados(arrayPadresEliminar, id);
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (hijosNodo.length) {
                                    var padreMarcado;
                                    for (i = 0; i < hijosNodo.length; i++) {
                                        nodoHijo = hijosNodo[i];
                                        if (!i) {
                                            padreMarcado = padreMarcadoPadre(nodoHijo);
                                        }
                                        if (estaEnDeschequeados(rootNodesRoles[idrol].arrayEntidades, nodoHijo.attributes.id) != -1 || padreMarcado == idrol)
                                            nodoHijo.getUI().toggleCheck(true);//nodoHijo.checked = null;
                                        else if (estructurasMarcadas[nodoHijo.attributes.id] !== idrol &&
                                            (estructurasMarcadas[nodoHijo.attributes.id] || (padreMarcado != idrol && padreMarcado != -1) )) {
                                            nodoHijo.getUI().toggleVisibleCheckbox(false);
                                        }
                                    }
                                }
                            }
                            if (_this.arbolEntidades.getChecked().length)
                                _this.arbolEntidades.hasChecked = true;*/
                        }
                    }
                }),
                root: new Ext.tree.AsyncTreeNode({
                    text: _this.comboDeposito.getRawValue(),
                    id: _this.comboDeposito.getValue()
                })
            });


            var winSelecEntidad = new Ext.Window({
                constrain: true,
                width: 400,
                layout: 'fit',
                modal: true,
                resizable: false,
                closeAction: 'hide',
                title: 'perfilPortal.etiquetas.updIn',
                height: 400,
                items: new Ext.FormPanel({
                    formId: 'FormIndex',
                    frame: false,
                    autoScroll: true,
                    bodyStyle: 'padding:5px 5px 0',
                    width: 360,
                    style: 'text-align:left',
                    height: 380,
                    items: [arbolEntidades]
                }),
                buttons: [
                    {
                        text: 'perfilPortal.etiquetas.lbBtnCancelar',
                        iconCls: 'cancelar',
                        tooltip: 'perfilPortal.etiquetas.lbBtnCancelarTip',
                        handler: function () {
                            // winSelecEntidad.hide();
                        }
                    },
                    {
                        text: 'perfilPortal.etiquetas.lbBtnAceptar',
                        iconCls: 'aceptar',
                        tooltip: 'perfilPortal.etiquetas.lbBtnAceptarTip',
                        disabled: true,
                        id: 'btnAceptarCambio',
                        handler: function () {
                            //entrarAlSistema();
                        }
                    }
                ],
                keys: [
                    {
                        key: 13,
                        alt: false,
                        ctrl: false,
                        shift: false,
                        handler: function (k, e) {
                            // entrarAlSistema();
                        }
                    },
                    {
                        key: 'x',
                        alt: true,
                        ctrl: false,
                        shift: false,
                        handler: function (k, e) {
                            // winSelecEntidad.hide();
                        }
                    }
                ]
            });
        }
        winSelecEntidad.show();
    },
    getWinAreasResponsabilidad: function () {
        var _this = this;

        Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
        if (!_this.cmpAreaRespWin) {

            _this.cmpAreaRespWin = new Log.AF.Utiles.WinContainer({
                modal: true,
                //url: 'cargarcomboarea',
                doAction: function (nodo) {
                    function funcion() {
                        _this.idarearesp = nodo.attributes.id;
                        _this.comboDeposito.setValue(nodo.attributes.id);
                        _this.comboDeposito.setRawValue(nodo.attributes.nombre);
                        _this.cmpAreaRespWin.hide();
                        _this.gridCEntral.getStore().baseParams = {};
                        if (!_this.stopGrid) {
                            _this.gridCEntral.getStore().load({
                                params: {
                                    anode: null,
                                    _id: null,
                                    idarea: _this.comboDeposito.getValue(),
                                    start: 0,
                                    limit: 20

                                    // Ext.LOG.moduloMedio.start
                                    //Ext.LOG.moduloMedio.limit
                                }
                            });
                        }

                    }

                    if (nodo.getDepth() == 0) {
                        //Es padre
                        // _this.tipo_area_seleccionada = 'entidad';
                        _this.btnAdicionar.enable();
                        funcion();
                    } else if (nodo.attributes.interna) {
                        //Es un area resp
                        _this.tipo_area_seleccionada = 'arearesp';
                        _this.btnAdicionar.enable();
                        // _this.btnGestnomenclatura.enable();
                        funcion();
                    } else {
                        _this.tipo_area_seleccionada = 'otra';
                        funcion();
                        //  mostrarMensaje(1, _this.idioma.lbNoEsAreaResp);
                    }
                },
                entidad: _this.comboDeposito.getRawValue(),
                identidad: _this.comboDeposito.getValue(),
                listeners: {
                    'beforeshow': function () {
                        Ext.getBody().unmask();
                    }
                }
            });
            // console.info(_this.cmpAreaRespWin);
            // console.info( Ext.getCmp('idAceptarWinResposabilidad'));
            //  Ext.getCmp('idAceptarWinResposabilidad').hidden = true;

        } else {
            _this.cmpAreaRespWin.show();
        }

    },
    cargarEntidadComboArea: function () {
        var _this = this;

        Ext.Ajax.request({
            url: 'getEntidad',
            method: 'POST',
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.identidad;
                _this.idarearesp = rd.identidad;
                _this.entidad = rd.entidad;

                _this.comboDeposito.setValue(rd.identidad);
                _this.comboDeposito.setRawValue(rd.entidad);
                _this.comboDeposito.enable();
                if (!_this.stopGrid) {
                    _this.gridCEntral.getStore().load({
                        params: {
                            idarea: _this.comboDeposito.getValue(),
                            start: 0,
                            limit: 20
                        }
                    });
                }


            }
        });
    },
    getaccion: function () {
        var _this = this;
        //se comprueba el permiso que tenga el usuario del  sistema, y valida los campos de la vista.

        for (var i = 0; i < acciones_reportes.length; i++) {

            if (acciones_reportes[i].abreviatura == "VEHICULO") {
                _this.textVista.setText(_this.idioma.textVistasRegistro);

                if (acciones_reportes.length == 2) {
                    Ext.getCmp('vehiculo').disable();
                    Ext.getCmp('vehiculooper').disable();
                    Ext.LOG.gestregmatricula.vistaactiva = "VEHICULO";
                } else if (acciones_reportes.length == 3) {
                    Ext.getCmp('vehiculo').disable();
                    Ext.getCmp('vehiculooper').enable();
                    Ext.LOG.gestregmatricula.vistaactiva = "VEHICULO";
                }


            } else if (acciones_reportes[i].abreviatura == "VEHICULOOPR") {
                _this.textVista.setText(_this.idioma.textVistasRegistroOper);

                if (acciones_reportes.length == 2) {
                    Ext.getCmp('vehiculooper').disable();
                    Ext.getCmp('vehiculo').disable();
                    Ext.LOG.gestregmatricula.vistaactiva = "VEHICULOOPR";
                } else if (acciones_reportes.length == 3) {
                    Ext.getCmp('vehiculooper').disable();
                    Ext.getCmp('vehiculo').enable();
                    Ext.LOG.gestregmatricula.vistaactiva = "VEHICULOOPR";
                }

            }

        }
        if (acciones_reportes.length == 1) {
            _this.btnAdicionar.disable();
            _this.btnVista.disable();
            _this.btnModificar.disable();
            _this.btnEliminar.disable();
            _this.btnRegistrar.disable();
            _this.btnImprimirM.disable();
            _this.btnImprimir.disable();
            _this.btnMostrar.disable();
            _this.btnAyuda.disable();
            _this.stopGrid = true;
            _this.vehiculo = " ";
            mostrarMensaje(1, _this.idioma.MsgPermisoDenegado);
            return;
        }

//        if (acciones_reportes.length == 2) {
//
//            if (acciones_reportes[1].abreviatura == "VEHICULO") {
//                _this.textVista.setText(_this.idioma.textVistasRegistro);
//                Ext.getCmp('vehiculo').disable();
//                Ext.getCmp('vehiculooper').disable();
//
//            } else {
//                _this.textVista.setText(_this.idioma.textVistasRegistroOper);
//                Ext.getCmp('vehiculooper').disable();
//                Ext.getCmp('vehiculo').disable();
//            }
//        }
//
//        else if (acciones_reportes.length == 3) {
//
//            if (Ext.getCmp('vehiculo').disabled) {
//                _this.textVista.setText(_this.idioma.textVistasRegistro);
//                Ext.getCmp('vehiculo').disable();
//            } else {
//                _this.textVista.setText(_this.idioma.textVistasRegistroOper);
//                Ext.getCmp('vehiculooper').disable();
//            }
//        }
//
//        else if (acciones_reportes.length == 1) {
//            _this.btnAdicionar.disable();
//            _this.btnVista.disable();
//            _this.btnModificar.disable();
//            _this.btnEliminar.disable();
//            _this.btnRegistrar.disable();
//            _this.btnImprimirM.disable();
//            _this.btnImprimir.disable();
//            _this.btnMostrar.disable();
//            _this.btnAyuda.disable();
//            _this.stopGrid = true;
//            _this.vehiculo = " ";
//            //mostrarMensaje(1, 'Debe configurar las acciones.');return;
//        }

    },
    getActivarBotones: function () {
        //this.sm
        var _this = this;
        if (acciones_reportes.length == 2 || acciones_reportes.length == 3) {
            _this.btnAdicionar.enable();
        }
        if (_this.sm.selections.items.length == 0) {
            _this.btnEliminar.disable();
            _this.btnModificar.disable();
            _this.btnRegistrar.disable();
        }

    },
    getEliminarMedio: function () {

        var _this = this;
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Eliminando medio(s) de transporte..."});
        mostrarMensaje(2, _this.idioma.lbMsgEliminar, elimina);
        function elimina(btnPresionado) {

            if (btnPresionado == 'ok') {
                // Ext.getBody().mask('Cargando...', 'x-mask-loading');
                myMask.show();
                var idregnum = Array();
                for (var i = 0; i < _this.sm.selections.items.length; i++) {
                    if (_this.sm.selections.items[i].data.registro == null) {
                        idregnum.push(_this.sm.selections.items[i].data.idregnumerico);
                    }
                }
                Ext.Ajax.request({
                    url: 'getEliminarMedioTrans',
                    method: 'POST',
                    params: {
                        idregnum: Ext.encode(idregnum),
                        //idestructura: Ext.getCmp('itemx').getValue(),
                    },
                    callback: function (options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        myMask.show();
                        if (rd.msg == 1) {
                            mostrarMensaje(1, _this.idioma.MsgEliminarMediosOK);
                            _this.gridCEntral.getStore().load();
                        }

                    }
                });
            }
        }

    }


});

