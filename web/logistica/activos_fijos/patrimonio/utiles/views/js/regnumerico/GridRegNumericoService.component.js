/**
 * Created with JetBrains PhpStorm.
 * User: adrian
 * Date: 4/03/15
 * Time: 13:59
 * To change this template use File | Settings | File Templates.
 */

Ext.ns('Ext.LOG.GridRegNumericoService');
Ext.LOG.GridRegNumericoService = Ext.extend(Ext.grid.GridPanel, {
    constructor: function (config) {
        Ext.apply(this, config);
        var _this = this;       
        this.region = 'center';
        this.border = false;
        _this.etiquetas = _this.configuracion.etiquetas;
        Ext.LOG.GridRegNumericoService.buscar = false;

        Ext.getBody().mask('Cargando...', 'x-mask-loading');

        this.tfDescripcionADD = new Ext.form.TextField({
            maxLength: '255',
            enableKeyEvents: true,
            valido: true,
            regexText: _this.etiquetas.lbValorIncorrecto,
            regex: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9/,()\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'valid': function (field) {
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
                }
            }
        });

        this.tfCodigoADD = new Ext.form.TextField({
            maxLength: '19',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true
        });

        this.btnBuscarADD = new Ext.Button({
            iconCls: 'buscar',
            id:'buscarADD',
            text: _this.etiquetas.lbBtnbuscar,
            tooltip: _this.etiquetas.lbTtBtnbuscarS,
            handler: function () {
                _this.getBuscarMedios();
            }
        });

        this.btnLimpiarADD = new Ext.Button({
            iconCls: 'limpiar',
            id:'limpiarADD',
            text: _this.etiquetas.lbBtnLimpiar,
            tooltip: _this.etiquetas.lbTtBtnLimpiarMedios,
            handler: function () {
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                _this.tfCodigoADD.reset();
                _this.tfDescripcionADD.reset();
                _this.store.load();
            }
        });

        this.btnBusqavanzADD = new Ext.Button({
            id:'buttonADD',
            iconCls: 'buscaravanzada',
            text: _this.etiquetas.lbBtnbuscarAvanz,
            tooltip: _this.etiquetas.btnBuscarAvanzadaDD,
            handler: function () {
                _this.winBusqAvanzadaADD = new Ext.LOG.winRegNumericoService.BusquedaAvanzada({
                    title:  _this.etiquetas.lbBtnbuscarAvanz,
                    store: _this.store,
                    idioma: _this.etiquetas
                });

                var validador = new FormValidator({
                    buttons: [_this.winBusqAvanzadaADD.btnAceptarWinBusAvan],
                    buttonsRegister:[_this.winBusqAvanzadaADD.btnCancelarWinBusAvan],
                    fields:[_this.winBusqAvanzadaADD.tfDescripcionWinBusqAvanz,
                        _this.winBusqAvanzadaADD.tfCodigoWinBusqAvanz,
                        _this.winBusqAvanzadaADD.comboModelo,
                        _this.winBusqAvanzadaADD.comboMarca,
                        _this.winBusqAvanzadaADD.comboColorPrim,
                        _this.winBusqAvanzadaADD.comboColorSeg,

                    ],
                    keyMapContainer:_this.winBusqAvanzadaADD
                });
                _this.winBusqAvanzadaADD.show();

            }
        });

        this.tbar = [_this.etiquetas.lbCmCodigo +': ',_this.tfCodigoADD,'&nbsp;&nbsp; ',_this.etiquetas.lbCmDenominacion +': ',
            _this.tfDescripcionADD,'&nbsp;&nbsp;'/*,_this.etiquetas.lbCmMatricula +': ',_this.tfMatriculaADD,'&nbsp;&nbsp;'*/, _this.btnBuscarADD, _this.btnBusqavanzADD, _this.btnLimpiarADD];

        this.fields = [
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
                name: 'nacionalidad'
            },
            {
                name: 'colorptim'
            },
            {
                name: 'colorsec'
            },
            {
                name: 'valoradquisicion'
            },
            {
                name: 'valorcontable'
            },
            {
                name: 'fechaadq'
            },
            {
                name: 'annofabricacion'
            },
            {
                name: 'garantia'
            },
            {
                name: 'denomactividad'
            },
            {
                name: 'responsable'
            },
            {
                name: 'denomestatustecnico'
            },
            {
                name: 'idactividad'
            },
            {
                name: 'idestatustecnico'
            },
            {
                name: 'idcategoria'
            },
            {
                name: 'idresponsable'
            },
            {
                name: 'idpersona'
            },
            {
                name: 'idregnumerico'
            },
            {
                name: 'idprod'
            },
            {
                name: 'idproducto'
            },
            {
                name: 'ficav'
            },
            {
                name: 'lot'
            },
            {
                name: 'indiceconsumo'
            },
            {
                name: 'indicativo'
            },
            {
                name: 'nromotor1'
            },
            {
                name: 'nromotor2'
            },
            {
                name: 'nromatricula'
            },
            {
                name: 'combustible'
            },
            {
                name: 'nroserie'
            },
            {
                name: 'nrocirculacion'
            },
            {
                name: 'expedicioncirculacion'
            }
        ];

        this.store = new Ext.data.GroupingStore({
            url: _this.url,
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos', id: 'nroserie'
            }, _this.fields),
            listeners: {
                'beforeload': function (st) {
                    st.baseParams.arrRNnomostrar = Ext.encode(_this.configuracion.arrRNnomostrar);
                    st.baseParams.idestructura = _this.configuracion.idestructura;
                    st.baseParams.enviadorepararaction = _this.configuracion.enviadorepararaction;
                    //st.baseParams.idindicador = _this.configuracion.idindicador;
                },
                'load': function (st, rd, op) {  
                    if (st.data.items.length == 0 && !Ext.LOG.GridRegNumericoService.buscar) {
                        mostrarMensaje(1, _this.etiquetas.MsgNoExistenDatosGrid);
                    } else if (st.data.items.length == 0 && Ext.LOG.GridRegNumericoService.buscar) {
                        mostrarMensaje(1, _this.etiquetas.MsgNoExistenDatosBuscar);
                    }
                    Ext.getBody().unmask();
                    Ext.LOG.GridRegNumericoService.buscar = false;
                }
            }
        });

        this.colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({
            header: 'N\xBA.',
            width: 30
        }), _this.sm,
            {
                header: _this.etiquetas.lbCmCodigo,
                id: 'codigo',
                dataIndex: 'codigo',
                width: 90
            }, {
                header: _this.etiquetas.lbCmDenominacion,
                id: 'denominacion',
                dataIndex: 'denominacion',
                width: 90
            }, {
                header: _this.etiquetas.lbCmMarca,
                id: 'marca',
                dataIndex: 'marca',
                width: 90
            }, {
                header: _this.etiquetas.lbCmModelo,
                id: 'modelo',
                dataIndex: 'modelo',
                width: 90
            }, {
                header: "Nro.Serie",
                id: 'nroserie',
                dataIndex: 'nroserie',
                width: 90
            },  {
                header: _this.etiquetas.lbCmNacionalidad,
                id: 'nacionalidad',
                dataIndex: 'nacionalidad',
                width: 90
            }, {
                header: _this.etiquetas.lbCmColorPrim,
                id: 'colorptim',
                dataIndex: 'colorptim',
                width: 100
            }, {
                header: _this.etiquetas.lbCmColorSec,
                id: 'colorsec',
                dataIndex: 'colorsec',
                width: 100
            }, {
                header: _this.etiquetas.lbCmValorAdquisicion,
                dataIndex: 'valoradquisicion',
                id: 'valoradquisicion',
                width: 90
            }, {
                header: _this.etiquetas.lbCmValorContable,
                dataIndex: 'valorcontable',
                id: 'valorcontable',
                width: 90
            }, {
                header: _this.etiquetas.lbCmFechaAdq,
                dataIndex: 'fechaadq',
                id: 'fechaadq',
                width: 90
            }, {
                header: _this.etiquetas.lbCmAnnoFabri,
                dataIndex: 'annofabricacion',
                id: 'annofabricacion',
                width: 90
            }, {
                header: _this.etiquetas.lbCmGarantia,
                dataIndex: 'garantia',
                id: 'garantia',
                width: 60,
                renderer: _this.activarCategoria
            }, {
                header: _this.etiquetas.lbCmActividad,
                dataIndex: 'denomactividad',
                id: 'denomactividad',
                width: 90
            }, {
                header: _this.etiquetas.lbCmResponsable,
                dataIndex: 'responsable',
                id: 'denompersona',
                width: 90
            }, {
                header: _this.etiquetas.lbCmEstatus,
                dataIndex: 'denomestatustecnico',
                id: 'denomestatustecnico',
                width: 90
            }
        ]);
      //  this.plugins = _this.expander;
        this.bbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.store,
            displayInfo: true
        });

        this.autoExpandColumn = 'denominacion';

        Ext.LOG.GridRegNumericoService.superclass.constructor.apply(this, arguments);
    },
    getBuscarMedios: function () {

        var _this = this;
        if (_this.tfCodigoADD.isDirty() || _this.tfDescripcionADD.isDirty() /*|| _this.tfMatriculaADD.isDirty()*/) {
            if (_this.tfCodigoADD.isValid() && _this.tfDescripcionADD.valido /*&& _this.tfMatriculaADD.valido*/) {
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                Ext.LOG.GridRegNumericoService.buscar = true;
                _this.store.load({
                    params: {
                        codigo: _this.tfCodigoADD.getValue(),
                        descripcion: _this.tfDescripcionADD.getValue()
                        //matricula: _this.tfMatriculaADD.getValue()

                    }
                });
            } else {
                mostrarMensaje(1, _this.etiquetas.MsgInscripcionCamposError);
            }
        }

    },

    activarCategoria:function(val, metaData, record, rowIndex, colIndex, store){
        var _this = this;
        val = (!val || val == null || val == '') ? '' : val;

        if (record.data.garantia == 1) {
            return '<span style="color:black;">' + "Si" + '</span>';
        } else {
            return '<span style="color:black;">' + "No" + '</span>';
        }
    }
});
