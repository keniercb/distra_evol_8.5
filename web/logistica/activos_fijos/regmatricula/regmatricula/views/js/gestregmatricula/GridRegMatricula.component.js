/**
 * Created with JetBrains PhpStorm.
 * User: adrian
 * Date: 4/03/15
 * Time: 13:59
 * To change this template use File | Settings | File Templates.
 */

Ext.ns('Ext.aft');
Ext.aft.gridCentralRegMatricula = Ext.extend(Ext.grid.GridPanel, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;

        _this.etiquetas = _this.configuracion.idioma;
        this.region = 'center';
        this.border = false;
        Ext.aft.gridCentralRegMatricula.buscar = false;
        // this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        Ext.getBody().mask('Cargando...', 'x-mask-loading');

        this.tfDescripcion = new Ext.form.TextField({
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            enableKeyEvents: true,
            valido: true,
            regexText: _this.etiquetas.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'valid': function(field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                }, 'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscar.handler();
                    }
                }
            }
        });

        this.tfCodigo = new Ext.form.TextField({
            maxLength: '19',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 19.',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscar.handler();
                    }
                }
            }
        });


        this.tfMatricula = new Ext.form.TextField({
            maxLength: '255',
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 255.',
            enableKeyEvents: true,
            valido: true,
            regexText: _this.etiquetas.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'valid': function(field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ' || field.getValue().charAt(field.getValue().length - 1) == ' ') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.valido = false;
                        field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.etiquetas.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                },
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.btnBuscar.handler();
                    }
                }
            }
        });

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: _this.etiquetas.btnBuscar,
            tooltip: _this.etiquetas.btnTtBuscar,
            handler: function() {
                _this.getBuscarMedios();
            }
        });

        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: _this.etiquetas.btnLimpiar,
            tooltip: _this.etiquetas.btnTtLimpiar,
            handler: function() {
                //_this.btnBuscar = false;
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                _this.tfCodigo.reset();
                _this.tfDescripcion.reset();
                _this.tfMatricula.reset();
                _this.store.load();
            }
        });

        this.btnBusqavanz = new Ext.Button({
            xtype: 'button',
           // icon: perfil.dirImg + 'buscaravanzada.png',
            iconCls: 'buscaravanzada',
            text: _this.etiquetas.btnBuscarAvanzado,
            tooltip: _this.etiquetas.btnBuscarAvanzada,
            handler: function() {
                _this.winBusqAvanzada = new Ext.LOG.winBusqAvanzada.Medios({
                    title: (Ext.getCmp('vehiculo').disabled) ? _this.etiquetas.textBusqAvanVehiculo : _this.etiquetas.textBusqAvanVehiculoOper,
                    configuracion: _this.configuracion,
                    registrar: false
                });

                /* var validador = new FormValidator({
                 buttons: [_this.winBusqAvanzada.btnAceptarWinBusAvan],
                 buttonsRegister: [_this.winBusqAvanzada.btnCancelarWinBusAvan],
                 fields: [_this.winBusqAvanzada.tfDescripcionWinBusqAvanz,
                 _this.winBusqAvanzada.tfMatriculaWinBusqAvanz,
                 _this.winBusqAvanzada.tfCodigoWinBusqAvanz,
                 _this.winBusqAvanzada.comboModelo,_this.winBusqAvanzada.comboInspector,
                 _this.winBusqAvanzada.comboMarca, _this.winBusqAvanzada.tfNroChasis,
                 _this.winBusqAvanzada.comboCombustible, _this.winBusqAvanzada.tfNroMotor1,
                 _this.winBusqAvanzada.comboColorPrim, _this.winBusqAvanzada.tfNroMotor2,
                 _this.winBusqAvanzada.comboColorSeg, _this.winBusqAvanzada.comboTipoTramite,
                 _this.winBusqAvanzada.comboColorChapa, _this.winBusqAvanzada.comboSector,
                 _this.winBusqAvanzada.comboTipoChapa, _this.winBusqAvanzada.comboEstatusTecnico,
                 _this.winBusqAvanzada.textfieldFolio, _this.winBusqAvanzada.textfieldTonelaje,
                 _this.winBusqAvanzada.textfieldlaser2, _this.winBusqAvanzada.textfieldlaser1
                 ],
                 keyMapContainer: _this.winModificarMedio
                 });*/
                _this.winBusqAvanzada.show();

            }
        });
        if (_this.configuracion.stopGrid) {
            Ext.getBody().unmask();
            _this.btnBusqavanz.disable();
            _this.btnLimpiar.disable();
            _this.btnBuscar.disable();

        }

        if (_this.activartbar) {
            this.tbar = [
                new Ext.Toolbar.TextItem(_this.etiquetas.lbCmCodigo + ':'), _this.tfCodigo, '',
                new Ext.Toolbar.TextItem(_this.etiquetas.lbCmDenominacion + ':'), _this.tfDescripcion, '',
                new Ext.Toolbar.TextItem(_this.etiquetas.lbCmMatricula + ':'), _this.tfMatricula, '',
                _this.btnBuscar, _this.btnBusqavanz, _this.btnLimpiar];
        }
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '</br><b>',
                    _this.etiquetas.lbDatosmedio,
                    ':</b></br></br>', '</b>{datosgenerales}', '</br></br>'
                    )
        });

        this.fields = [
            {
                name: 'nro'
            },
            {
                name: 'codigo'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'marca'
            },
            {
                name: 'modelo'
            },
            {
                name: 'nromatricula'
            },
            {
                name: 'combustible'
            },
            {
                name: 'annofabricacion'
            },
            {
                name: 'nacionalidad'
            },
            {
                name: 'colorptim'
            },
            {
                name: 'colorsec'
            },
            {
                name: 'nromotor1'
            },
            {
                name: 'nromotor2'
            },
            {
                name: 'nroserie'
            },
            {
                name: 'denomestado'
            },
            {
                name: 'idestatustecnico'
            },
            {
                name: 'idregnumerico'
            },
            {
                name: 'registro'
            },
            {
                name: 'idtipotramite'
            },
            {
                name: 'numerolaser1'
            },
            {
                name: 'numerolaser2'
            },
            {
                name: 'tonelage'
            },
            {
                name: 'foliocirculacion'
            },
            {
                name: 'idcolorchapa'
            },
            {
                name: 'idtipochapa'
            },
            {
                name: 'idsector'
            },
            {
                name: 'denomtipotramite'
            },
            {
                name: 'denomcolorchapa'
            },
            {
                name: 'denomtipochapa'
            },
            {
                name: 'denomsector'
            },
            {
                name: 'idpersona'
            },
            {
                name: 'denompersona'
            },
            {
                name: 'denomestructuraop'
            },
            {
                name: 'denomestructura'
            },
            {
                name: 'idmoneda'
            },
            {
                name: 'idprod'
            },
            {
                name: 'idproducto'
            },
            {
                name: 'datosgenerales'
            },
            {
                name: 'idinspectormatricula'
            },
            {
                name: 'nombreinspector'
            },
            {
                name: 'moneda'
            },
            {
                name: 'poseedorlegal'
            },
            {
                name: 'direccion'
            },
            {
                name: 'provincia'
            },
            {
                name: 'municipio'
            },
            {
                name: 'regestructura'
            }, {
                name: 'acreditador'
            }, {
                name: 'funcionario'
            }, {
                name: 'jefe'
            }
        ];


        this.store = new Ext.data.GroupingStore({
            url: _this.url,
            autoLoad: (_this.autoload) ? true : false,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, _this.fields),
            groupField: 'codigo',
            sortInfo: {
                field: 'codigo',
                direction: "ASC"
            },
            listeners: {
                'beforeload': function(st) {
                    for (var i in config.paramStore) {
                        st.baseParams[i] = config.paramStore[i];
                    }
                    st.baseParams.idarea = Ext.getCmp('itemx').getValue();
                    if (Ext.getCmp('vehiculo').disabled) {
                        st.baseParams.permisoacciones = 0;
                    } else {
                        st.baseParams.permisoacciones = 1;
                    }


                    if (_this.cargarcentral) {
                        st.baseParams.cargarcentral = "true";
                    } else {
                        st.baseParams.cargarcentral = "false";
                    }


                },
                'load': function(st, rd, op) {
                    if (Ext.getCmp('vehiculo').disabled) {
                        st.baseParams.permisoacciones = 0;
                    } else {
                        st.baseParams.permisoacciones = 1;
                    }
                    Ext.getCmp('btnImprimirM').disable();
                    if (st.data.items.length == 0 && !Ext.aft.gridCentralRegMatricula.buscar) {
                        mostrarMensaje(1, _this.etiquetas.MsgNoExistenDatosGrid);
                    } else if (st.data.items.length == 0 && Ext.aft.gridCentralRegMatricula.buscar) {
                        mostrarMensaje(1, _this.etiquetas.MsgNoExistenDatosBuscar);
                    }
                    _this.getActivarBotones();

                    Ext.getBody().unmask();
                    Ext.aft.gridCentralRegMatricula.buscar = false;
                }
            }
        });
        // this.autoExpandColumn = 'denominacion';
        this.colModel = new Ext.grid.ColumnModel([
            {
                header: 'Nro.',
                id: 'nro',
                dataIndex: 'nro',
                width: 30,
                renderer: _this.activarColores
            }, _this.sm,
            {
                header: _this.etiquetas.lbCmCodigo,
                id: 'codigo',
                dataIndex: 'codigo',
                width: 90,
                renderer: _this.activarColores
            }, {
                header: _this.etiquetas.lbCmDenominacion,
                id: 'denominacion',
                dataIndex: 'denominacion',
                renderer: _this.activarColores,
                width: 150
            }, {
                header: _this.etiquetas.lbCmMarca,
                id: 'marca',
                dataIndex: 'marca',
                renderer: _this.activarColores,
                width: 90
            }, {
                header: _this.etiquetas.lbCmModelo,
                id: 'modelo',
                renderer: _this.activarColores,
                dataIndex: 'modelo',
                width: 90
            }, {
                header: _this.etiquetas.lbCmMatricula,
                dataIndex: 'nromatricula',
                id: 'nromatricula',
                renderer: _this.activarColores,
                width: 100
            }, {
                header: _this.etiquetas.lbCmCombustible,
                id: 'combustible',
                dataIndex: 'combustible',
                renderer: _this.activarColores,
                width: 90
            }, {
                header: _this.etiquetas.lbCmAnnoFab,
                id: 'annofabricacion',
                dataIndex: 'annofabricacion',
                renderer: _this.activarColores,
                width: 135
            }, {
                header: _this.etiquetas.lbCmNacionalidad,
                id: 'nacionalidad',
                dataIndex: 'nacionalidad',
                renderer: _this.activarColores,
                width: 90
            }, {
                header: _this.etiquetas.lbCmColorPrim,
                id: 'colorptim',
                dataIndex: 'colorptim',
                renderer: _this.activarColores,
                width: 100
            }, {
                header: _this.etiquetas.lbCmColorSec,
                id: 'colorsec',
                dataIndex: 'colorsec',
                renderer: _this.activarColores,
                width: 100
            }, {
                header: _this.etiquetas.lbCmNroMotor1,
                id: 'nromotor1',
                dataIndex: 'nromotor1',
                renderer: _this.activarColores,
                width: 90
            }, {
                header: _this.etiquetas.lbCmNroMotor2,
                id: 'nromotor2',
                dataIndex: 'nromotor2',
                renderer: _this.activarColores,
                width: 90
            }, {
                header: _this.etiquetas.lbCmNoSerie,
                dataIndex: 'nroserie',
                id: 'nroserie',
                renderer: _this.activarColores,
                width: 90
            }, {
                header: _this.etiquetas.lbCmEstado,
                dataIndex: 'denomestado',
                id: 'denomestado',
                renderer: _this.activarColores,
                width: 125
            }, (!Ext.aft.winAddMedio.winAddActiva) ? _this.expander : {hidden: true}
        ]);
        this.plugins = _this.expander;
        this.view = new Ext.grid.GroupingView({
            forceFit: false,
            groupTextTpl: '{marca} Marca-Modelo: {[values.rs[0].data.marca]}-{[values.rs[0].data.modelo]}'
        });

        this.bbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.store,
            displayInfo: true
        });

        // this.clicksToEdit = 1;

        Ext.aft.gridCentralRegMatricula.superclass.constructor.apply(this, arguments);
    },
    getActivarBotones: function() {
        //this.sm
        var _this = this;

        if (_this.configuracion.sm.selections.items.length == 0) {
            _this.configuracion.btnEliminar.disable();
            _this.configuracion.btnModificar.disable();
            _this.configuracion.btnRegistrar.disable();
        }

    },
    activarColores: function(val, metaData, record, rowIndex, colIndex, store) {

        var _this = this;
        val = (!val || val == null || val == '') ? '' : val;

        if (record.data.registro == 1) {
            return '<span style="color:green;">' + val + '</span>';
        } else {
            return '<span style="color:black;">' + val + '</span>';
        }
    },
    getBuscarMedios: function() {

        var _this = this;
        if (_this.tfCodigo.isDirty() || _this.tfDescripcion.isDirty() || _this.tfMatricula.isDirty()) {
            if (_this.tfCodigo.isValid() && _this.tfDescripcion.valido && _this.tfMatricula.valido) {
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                Ext.aft.gridCentralRegMatricula.buscar = true;
                _this.store.load({
                    params: {
                        codigo: _this.tfCodigo.getValue(),
                        descripcion: _this.tfDescripcion.getValue(),
                        matricula: _this.tfMatricula.getValue()

                    }
                });
            } else {
                mostrarMensaje(1, _this.etiquetas.MsgInscripcionCamposError);
            }
        }

    }
});
