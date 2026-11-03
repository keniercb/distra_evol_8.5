Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.TreeGridRegistroNO = Ext.extend(Ext.ux.maximgb.GridPanel, {
    /*
     * arreglo de registros que no se quieran mostrar
     */
    idsRegNumNoMostrar: new Array(),
    /*
     * arreglo de registros que se quieran mostrar
     */
    idsRegNumMostrar: new Object(),
    /*
     * variable para incluir o no el paginado, por defecto incluye paginado
     * */
    paginado: 1,
    stripeRows: true,
    //autoExpandColumn: '_id',
    master_column_id: '_id',
    autoScroll: true,
    expand: true,
    loadMask: true,
    autoLoadStoreP: true,
    notab: '',
    showBtnbusqAvanzada: false,
    hideCombofiltroArea: false,
    root_title: 'Medios',
    viewConfig: {enableRowBody: true},
    constructor: function (config) {
        var _this = this;
        if (config.scope) {
            this.ventana = config.scope;
        }
        if (config.root_title && config.root_title != null) {
            _this.root_title = config.root_title;
        }
        this.verplugins = false;
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.TreeGridRegistroNO.superclass.constructor.apply(this, arguments);
    },
    initComponent: function (config) {
        var _this = this;
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.TreeGridRegistroNO.renderer = true;

        this.plugins = new Array();
        /*if(Ext.aft.plugins.Contenedores){
         _this.attatchPlugin(Ext.aft.plugins.Contenedores.ElementosGridContenedoresPlugin);
         }
         if(Ext.aft.plugins.Transportacion){
         _this.attatchPlugin(Ext.aft.plugins.Transportacion.ElementosGridTransportacionPlugin);
         }*/

        for (var i = 0; i < arrElementosGridPlugin.length; i++) {
            this.attatchPlugin(arrElementosGridPlugin[i]);
        }
        // Creando el reader del store
        this.readerstore = [
            {
                name: '_id'
            },
            {
                name: '_parent'
            },
            {
                name: '_is_leaf'
            },
            {
                name: '_expand'
            },
            {
                name: 'icon'
            },
            {
                name: 'idregnumerico'
            },
            {
                name: 'idtabla'
            },
            {
                name: 'arridtablas'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'denominacionpm'
            },
            {
                name: 'codigo'
            },
            {
                name: 'nroinventario'
            },
            {
                name: 'nroserie'
            },
            {
                name: 'idubicacion'
            },
            {
                name: 'descripcionnacionalidad'
            },
            {
                name: 'valorcontable'
            },
            {
                name: 'valorcontablealternativo'
            },
            {
                name: 'valoradquisicion'
            },
            {
                name: 'valoradquisicionalternativo'
            },
            {
                name: 'porcientorecuperacion'
            },
            {
                name: 'tasafiscal'
            },
            {
                name: 'vidautil'
            },
            {
                name: 'depreciacionacumulada'
            },
            {
                name: 'depreciacionacumuladaalternativo'
            },
            {
                name: 'fechaadq'
            },
            {
                name: 'fechaexpini'
            },
            {
                name: 'fechaexpfin'
            },
            {
                name: 'denomestadotecnico'
            },
            {
                name: 'idpadremodulo'
            },
            {
                name: 'idarbolmodulo'
            },
            {
                name: 'ordenizqmodulo'
            },
            {
                name: 'ordendermodulo'
            },
            {
                name: 'descripcionmarcamodelo'
            },
            {
                name: 'marcamodelo'
            },
            {
                name: 'idindicador'
            },
            {
                name: 'esmodulo'
            },
            {
                name: 'atribDinamicos'
            },
            {
                name: 'idnaturaleza'
            },
            {
                name: 'naturaleza'
            },
            {
                name: 'descripciongrupo'
            },
            {
                name: 'denominacionplantilla'
            },
            {
                name: 'color'
            },
            {
                name: 'imagenesRegistro'
            },
            {
                name: 'imagenesIndicador'
            },
            {
                name: 'annofabricacion'
            },
            {
                name: 'idestatustecnico'
            },
            {
                name: 'responsable'
            },
            {
                name: 'idresponsable'
            },
            {
                name: 'idpersona'
            },
            {
                name: 'denomactividad'
            },
            {
                name: 'idactividad'
            },
            {
                name: 'idcolorprim'
            },
            {
                name: 'idcolorsec'
            },
            {
                name: 'idcategoria'
            },
            {
                name: 'categoria'
            },
            {
                name: 'cantidadrecursoconsumido'
            },
            {
                name: 'recursoconsumidomax'
            },
            {
                name: 'recursoconsumido'
            },
            {
                name: 'fechainicialgarantia'
            },
            {
                name: 'colorprim'
            },
            {
                name: 'colorsec'
            }
            ,
            {
                name: 'fechafingarantia'
            },
            {
                name: 'identificador'
            },
            {
                name: 'tipoidentificador'
            },
            {
                name: 'valoridentificador'
            },
            {
                name: 'denidentificador'
            },
            {
                name: 'idarearesp'
            },
            {
                name: 'idcentrocosto'
            }

            /*
             {
             name: 'garantia'
             }*/
        ];
        // Creando las columnas del columnmodel
        this.columnmodel = [
            {
                header: _this.idioma.lbCmbPlantilla,
                width: 100,
                sortable: true,
                id: 'iddenominacionplantilla',
                dataIndex: 'denominacionplantilla',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                id: '_id',
                header: _this.idioma.lbCMDenominacion,
                width: 160,
                sortable:true,
                dataIndex: 'denominacion',
                renderer: function (val, fn, record) {
                    var _this = this;
                    var images = '';
                    if (record.get('_is_leaf')) {
                        images = '<img src="../../views/images/no-modulo.png">';
                    } else {
                        images = '<img src="../../views/images/modulo.png">';
                    }
                    if (record.data.color == 2 && val != null) {
                        return '<span style="color:#38910b;">' + images + val + '</span>';
                    } else if (val != null) {
                        return images + val;
                    }
                }
            },
            {
                header: _this.idioma.lbCmbMarcaModelo,
                width: 100,
                sortable: true,
                dataIndex: 'marcamodelo',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: "Identificador",
                width: 100,
                sortable: false,
                dataIndex: 'valoridentificador',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + '<p><b>' + record.data.denidentificador + ": </b>" +value + '</span>';
                    } else if (value != null) {
                        return '<p><b>' + record.data.denidentificador + ": </b>" + value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMNaturaleza,
                width: 100,
                sortable: true,
                dataIndex: 'naturaleza',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCmTipo,
                width: 50,
                dataIndex: 'esmodulo',
                sortable: true,
                align: 'center',
                renderer: function (val, meta, record) {
                    if (record.data.color == 2 && val != null) {
                        if (val == 1) {
                            return '<span style="color:#38910b;">' + "A" + '</span>';
                        } else if (val == 2) {
                            return '<span style="color:#38910b;">' + "M" + '</span>';
                        }
                    } else {
                        if (val == 1) {
                            return "A";
                        } else if (val == 2) {
                            return "M";
                        }
                    }
                }
            },
            {
                header: _this.idioma.lbCMNroInventario,
                width: 100,
                id: 'idclminventario',
                sortable: true,
                dataIndex: 'nroinventario',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMNroSeir,
                width: 160,
                sortable: true,
                dataIndex: 'nroserie',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCodigo,
                width: 100,
                sortable: true,
                dataIndex: 'codigo',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMGrupo,
                width: 100,
                dataIndex: 'descripciongrupo',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMFechaAdquisicion,
                width: 107,
                dataIndex: 'fechaadq',
                sortable: true,
                id: 'idCOLfechaadq',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMNacionalidad,
                width: 100,
                dataIndex: 'descripcionnacionalidad',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: (alternativa) ? _this.idioma.lbCMValorContable + ' ' + nommonedacontable : _this.idioma.lbCMValorContable,
                width: 115,
                dataIndex: 'valorcontable',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (parseFloat(value) == parseFloat(record.data.valoradquisicion))
                        value = parseFloat(record.data.valoradquisicion - record.data.depreciacionacumulada).toFixed(6);
                    else
                        value = parseFloat(record.data.valorcontable - record.data.depreciacionacumulada).toFixed(6);
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMValorContable + ' ' + nommonedaalternativa,
                width: 115,
                hidden: (alternativa) ? false : true,
                dataIndex: 'valorcontablealternativo',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (parseFloat(value) == parseFloat(record.data.valoradquisicionalternativo))
                        value = parseFloat(record.data.valoradquisicionalternativo - record.data.depreciacionacumuladaalternativo).toFixed(6);
                    else
                        value = parseFloat(record.data.valorcontablealternativo - record.data.depreciacionacumuladaalternativo).toFixed(6);
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: (alternativa) ? 'Valor adquisicion' + ' ' + nommonedacontable : 'Valor adquisicion',
                width: 115,
                dataIndex: 'valorcontable',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (parseFloat(value) == parseFloat(record.data.valoradquisicion))
                        value = parseFloat(record.data.valoradquisicion).toFixed(6);
                    else
                        value = parseFloat(record.data.valorcontable).toFixed(6);
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: 'Valor adquisicion' + ' ' + nommonedaalternativa,
                width: 115,
                hidden: (alternativa) ? false : true,
                dataIndex: 'valorcontablealternativo',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (parseFloat(value) == parseFloat(record.data.valoradquisicionalternativo))
                        value = parseFloat(record.data.valoradquisicionalternativo).toFixed(6);
                    else
                        value = parseFloat(record.data.valorcontablealternativo).toFixed(6);
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMEstado,
                width: 100,
                sortable: true,
                dataIndex: 'denomestadotecnico',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMRecursoConsumidoMax,
                width: 150,
                dataIndex: 'recursoconsumidomax',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMRecursoConsumidos,
                width: 150,
                dataIndex: 'recursoconsumido',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMCantidadRecursoConsumidos,
                width: 150,
                dataIndex: 'cantidadrecursoconsumido',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMFechaInicialGarantia,
                width: 150,
                sortable: true,
                dataIndex: 'fechainicialgarantia',
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMFechaFinGarantia,
                width: 150,
                dataIndex: 'fechafingarantia',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbActividad,
                width: 130,
                dataIndex: 'denomactividad',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMColorP,
                width: 100,
                dataIndex: 'colorprim',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: _this.idioma.lbCMColorS,
                width: 100,
                dataIndex: 'colorsec',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.color == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            },
            {
                header: 'Año de fabricaci&oacute;n',
                width: 120,
                dataIndex: 'annofabricacion',
                sortable: true,
                renderer: function (value, metaData, record) {
                    if (record.data.annofabricacion == 2 && value != null) {
                        return '<span style="color:#38910b;">' + value + '</span>';
                    } else if (value != null) {
                        return value;
                    }
                }
            }/*,
			{
				header: 'Área de responsabilidad',
                width: 120,
                dataIndex: 'denomarearesp',
                sortable: false
			},
			{
				header: 'Centro de costo',
                width: 120,
                dataIndex: 'denomcentrocosto',
                sortable: false
			}*/
        ];

        Ext.each(this.plugins, function (plugin) {
            plugin.init(_this);
        });

        _this.textfieldDenominacion = new Ext.form.TextField({
            autoCreate: true,
            maxLengthText: "El tama\xf1o m\xe1ximo requerido es 255 caracteres.",
            maxLength: 255,
            width: 100,
            listeners: {
                'valid': function (field) {
                    if (field.getValue().charAt(0) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                }
                            }

                        }
                    }
                }
            }
        });
        _this.textfieldNoinventario = new Ext.form.TextField({
            autoCreate: true,
            width: 100,
            maxLength: 30,
            minLength: 1,
            /* regex: /^([1-9]?[aA-zZ]?)+[\-_\.]?([1-9]?[aA-zZ]?)+$/,
             regexp: /^([1-9]?[aA-zZ]?)+[\-_\.]?([1-9]?[aA-zZ]?)+$/*/
        });
        _this.stEstatus = new Ext.data.Store({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/getEstatusTecnico',
            autoLoad: true,
            baseParams: {
                estado: 1
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'datos'
            }, [
                {
                    name: 'denominacion'
                },
                {
                    name: 'idestatustecnico'
                }
            ])
        });
        _this.combEstadotecnico = new Ext.form.ComboBox({
            hiddenName: 'denominacion',
            valueField: 'idestatustecnico',
            disabled: false,
            displayField: 'denominacion',
            store: _this.stEstatus,
            mode: 'remote',
            width: 150,
            autoCreate: true,
            triggerAction: 'all',
            resizable: true,
            editable: true,
            forceSelection: true,
            minChars: 0,
            emptyText: _this.idioma.lbCbVacio
        });
        _this.comboDeposito = new Ext.LOG.RegNumOperativo.ComboDepositos({
            allowBlank: true,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            hidden: _this.hideCombofiltroArea,
            resizable: true,
            idioma: _this.idioma,
            anchor: '95%',
            emptyText: _this.idioma.lbCbVacio
        });

        _this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            hidden: false,
            tooltip: _this.idioma.lbTtBtnBuscar,
            text: _this.idioma.lbBtnBuscar,
            handler: function () {
                _this.store.load({
                    params: {
                        anode: null,
                        _id: null,
                        denominacion: _this.textfieldDenominacion.getValue(),
                        nroinventario: _this.textfieldNoinventario.getValue(),
                        idestatustecnico: _this.combEstadotecnico.getValue(),
                        idarearesp: _this.comboDeposito.getValue()
                    },
                    callback: function (r) {
                        if (r.length < 1) {
                            mostrarMensaje(1, _this.idioma.MsgNoExistenDatos);
                        }
                    }
                });
            }
        });
        _this.btnBuscaravanzada = new Ext.Button({
            iconCls: 'buscaravanzada',
            hidden: _this.showBtnbusqAvanzada,
            tooltip: _this.idioma.lbTtBuscAvanzBtn,
            text: _this.idioma.lbBuscAvanzBtn,
            handler: function () {
                _this.onBuscAvanzada();
            }
        });
        _this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            hidden: false,
            text: _this.idioma.btnLimpiar,
            tooltip: _this.idioma.lbTtBtnLimpiarBusqueda,
            handler: function () {
                _this.textfieldDenominacion.reset();
                _this.textfieldNoinventario.reset();
                _this.combEstadotecnico.reset();
                _this.comboDeposito.reset();
                _this.getSelectionModel().clearSelections();
                _this.gridFilter.clearFilters();
                _this.store.baseParams = {};
                _this.store.load();
            }
        });

        /*_this.btnConfiguracion = new Ext.Button({
         tooltip: _this.idioma.btnTtConfiguracion,
         iconCls: 'configuracion',
         menu: [{
         text: _this.idioma.btnMostrarPlugins,
         checked: _this.verplugins,
         checkHandler: function(checked) {
         _this.modificarVisibilidadColumnasPlugins(checked.checked);
         }
         }
         ]
         });*/

        _this.btnConfiguracion = new AFT.util.ViewConfigCache.btnGuardarConfiguracionInterfaz({
            guardar: function () {
                var vista = "registroNumOperativo";

                this.guardarConfiguracion(vista, _this)
            },
            resetear: function () {
                var vista = "registroNumOperativo";

                this.reestablecerValoresPredeterminados(vista);
                _this.cambiarVista(1, null);
            }
        });

        var exp = false;
        _this.btnExpand = new Ext.Button({
            text: _this.idioma.btnExpandir,
            tooltip: _this.idioma.btnTtExpCont,
            iconCls: 'expandir',
            listeners: {
                'render': function () {
                    if (_this.parent.panel_resumen) {
                        _this.parent.panel_resumen.fireEvent = _this.parent.panel_resumen.fireEvent.createSequence(function (e) {
                            if (e == 'beforecollapse') {
                                _this.btnExpand.setText(_this.idioma.btnExpandir);
                                exp = false;
                            } else if (e == 'beforeexpand') {
                                _this.btnExpand.setText(_this.idioma.btnContraer);
                                exp = true;
                            }
                        });
                    } else {
                        _this.parent.panel_resumenMod.fireEvent = _this.parent.panel_resumenMod.fireEvent.createSequence(function (e) {
                            if (e == 'beforecollapse') {
                                _this.btnExpand.setText(_this.idioma.btnExpandir);
                                exp = false;
                            } else if (e == 'beforeexpand') {
                                _this.btnExpand.setText(_this.idioma.btnContraer);
                                exp = true;
                            }
                        });
                    }
                }
            },
            handler: function () {
                if (exp) {
                    if (_this.parent.panel_resumen) {
                        _this.parent.panel_resumen.collapse();
                    } else {
                        _this.parent.panel_resumenMod.collapse();
                    }

                } else {
                    if (_this.parent.panel_resumen) {
                        _this.parent.panel_resumen.expand();
                    } else {
                        _this.parent.panel_resumenMod.expand();
                    }

                }
            }

        });

        if (!_this.sm) {
            _this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: false,
                listeners: {
                    'rowselect': function (SelectionModel, rowIndex, record) {
                        Ext.Ajax.abort();
                        if (_this.fnHabilitarBotones) {
                            _this.fnHabilitarBotones();
                        }
                    },
                    'rowdeselect': function (SelectionModel, rowIndex, record) {
                        if (_this.fnDesabilitarBotones) {
                            _this.fnDesabilitarBotones();
                        }
                    }
                }
            });
        }
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '</b> {atribDinamicos}</p>'
            )
        });
        var vista = "registroNumOperativo";
        Ext.Ajax.timeout=600000;

        this.store = new Ext.ux.maximgb.AdjacencyListStore({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/' + _this.url,
            autoLoad: _this.autoLoadStoreP,
            remoteSort:true,
            listeners: {
                'beforeload': function (st) {
                    if(st.sortInfo){
                        st.baseParams.sort = st.sortInfo.field;
                        st.baseParams.dir = st.sortInfo.direction;
                    }
                    if (_this.idarea) {
                        if (!st.baseParams.idarearesp) {
                            st.baseParams.idarearesp = _this.idarea;
                        }
                    } else if (!st.baseParams.idarearesp) {
                        st.baseParams.idarearesp = (_this.comboDeposito.getValue()) ? _this.comboDeposito.getValue() : null;
                    }
                    st.baseParams.paginado = _this.paginado;

                    if (_this.idsRegNumNoMostrar.length != 0) {
                        st.baseParams.idsRegNumNoMostrar = Ext.encode(_this.idsRegNumNoMostrar);
                    }
                    if (_this.idsRegNumMostrar) {
                        if (_this.idsRegNumMostrar.idregnumerico) {
                            st.baseParams.idsRegNumMostrarRO = Ext.encode(_this.idsRegNumMostrar);
                        }
                    }
                    st.baseParams.plantilla = (_this.plantilla)?2:1;
                    if (_this.modificar && _this.idsRegNumMostrar.idregnumerico) {
                        st.baseParams._id = _this.idsRegNumMostrar.idregnumerico;
                    } else {
                        st.baseParams._id = null;
                    }
                },
                'load': function (st, rd) {
                    if (_this.fnDesabilitarBotones) {
                        _this.fnDesabilitarBotones();
                    }
                    if (_this.expandAllNode) {
                        st.expandAll();
                    }
                    if (_this.fnBeforeLoad) {
                        _this.fnBeforeLoad();
                    }
                    if (_this.textfieldDenominacion.getValue())
                        st.baseParams.denominacion = _this.textfieldDenominacion.getValue();
                    if (_this.textfieldNoinventario.getValue())
                        st.baseParams.nroinventario = _this.textfieldNoinventario.getValue();
                    if (_this.combEstadotecnico.getValue())
                        st.baseParams.idestatustecnico = _this.combEstadotecnico.getValue();
                    if (_this.comboDeposito.getValue())
                        st.baseParams.idarearesp = _this.comboDeposito.getValue();

                },
                'beforeexpandnode': function (st, record) {
                    st.baseParams._id = record.data.idregnumerico;
                    st.baseParams.idarearesp = (_this.comboDeposito.getValue()) ? _this.comboDeposito.getValue() : null;
                }

            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: '_id',
                successProperty: 'success'
            }, _this.readerstore)
        });
        if (_this.paginado == 1) {
            this.bbar = new Ext.PagingToolbar({
                store: _this.store,
                displayInfo: true,
                displayMsg: _this.idioma.lbDisplayMsg,
                emptyMsg: _this.idioma.lbEmptyMsg,
                pageSize: 30,
                filter: ''
//                doLoad: function(start) {
//                    this.store.active_node = null;
//
//                    this.store.fireEvent('activenodechange', null, this.store.active_node, null);
//                    var o = {}/*, pn = this.getParams()*/;
//                    o['start'] = start;
//                    o['limit'] = this.pageSize;
//                    var newP = {
//                        idarearesp: (_this.comboDeposito.getValue()) ? _this.comboDeposito.getValue() : null,
//                        _id: '',
//                        anode: ''
//                    }
//                    Ext.apply(o, newP);
//                    if (this.fireEvent('beforechange', this, o) !== false) {
//                        this.store.load({
//                            params: o
//                        });
//                    }
//                }
            });
        }

        this.columnmodel.push(this.expander);
        var cm = new Ext.grid.ColumnModel(this.columnmodel);
        // Cargando la configuracion de la interfaz
        var vista = "registroNumOperativo";
        this.cm = AFT.util.ViewConfigCache.cargarConfiguracionInterfaz(vista, cm);

        this.gridFilter = new Ext.ux.grid.GridFilters({
            local: false,
            encode: true,
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'denominacionplantilla'
                }, {
                    type: 'combo',
                    dataIndex: 'naturaleza',
                    url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
                    valueField: 'idnaturaleza',
                    displayField: 'denominacion',
                    dataIndex: 'naturaleza'
                }, {
                    type: 'string',
                    dataIndex: 'marcamodelo'
                }, {
                    type: 'boolean',
                    dataIndex: 'esmodulo'
                }, {
                    type: 'string',
                    dataIndex: 'nroinventario'
                }, {
                    type: 'string',
                    dataIndex: 'nroserie'
                }, {
                    type: 'string',
                    dataIndex: 'codigo'
                }, {
                    type: 'string',
                    dataIndex: 'descripcionnacionalidad'
                }, {
                    type: 'string',
                    dataIndex: 'descripciongrupo'
                }, {
                    type: 'date',
                    dataIndex: 'fechaadq'
                }, {
                    type: 'numeric',
                    dataIndex: 'valorcontable'
                }, {
                    type: 'numeric',
                    dataIndex: 'valorcontablealternativo'
                }, {
                    type: 'string',
                    dataIndex: 'denomestadotecnico'
                }, {
                    type: 'numeric',
                    dataIndex: 'recursoconsumidomax'

                }, {
                    type: 'numeric',
                    dataIndex: 'recursoconsumido'

                }, {
                    type: 'numeric',
                    dataIndex: 'cantidadrecursoconsumido'

                }, {
                    type: 'date',
                    dateFormat: 'd/m/Y',
                    dataIndex: 'fechainicialgarantia'
                }, {
                    type: 'date',
                    dateFormat: 'd/m/Y',
                    dataIndex: 'fechafingarantia'
                }, {
                    type: 'string',
                    dateFormat: 'd/m/Y',
                    dataIndex: 'denomactividad'
                }, {
                    type: 'string',
                    dataIndex: 'colorprim'
                }, {
                    type: 'string',
                    dataIndex: 'colorsec'
                }, {
                    type: 'numeric',
                    dataIndex: 'annofabricacion'
                }/*, 
				// me quede por aqui
				{
                    type: 'combo',
                    dataIndex: 'naturaleza',
                    url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
                    valueField: 'idnaturaleza',
                    displayField: 'denominacion',
                    dataIndex: 'naturaleza'
                },
				{
                    type: 'combo',
                    dataIndex: 'naturaleza',
                    url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
                    valueField: 'idnaturaleza',
                    displayField: 'denominacion',
                    dataIndex: 'naturaleza'
                }*/

            ]
        });
        // this.plugins = this.expander;
        this.plugins = [this.gridFilter, this.expander];

        if (!this.tbarConfig) {
            this.tbar = [_this.idioma.lbDenominacion + ': ', _this.textfieldDenominacion, ' ', {
                xtype: 'tbtext',
                id: 'idlabelNoInvent' + _this.notab,
                text: _this.idioma.lbNoinventario + ':'
            },
                _this.textfieldNoinventario, ' ', {
                    xtype: 'tbtext',
                    id: 'idlabelestadoTec' + _this.notab,
                    text: _this.idioma.lbEstadotecnico + ':'
                }, _this.combEstadotecnico/*, ' ', {xtype: 'tbtext', id: 'idlabelArearesp' + _this.notab, hidden: _this.hideCombofiltroArea, text: _this.idioma.lbarea + ':'}, _this.comboDeposito*/, ' ', _this.btnBuscar, _this.btnBuscaravanzada, _this.btnLimpiar/*, '->', _this.btnConfiguracion, _this.btnExpand*/];
        } else {
            this.tbar = this.tbarConfig;
        }

        Ext.LOG.RegNumOperativo.TreeGridRegistroNO.superclass.initComponent.call(this);

        this.on({
            'dragdrop': function (cmp, node, dd, event) {

            },
            'nodedragover': function (dragOverEvent) {
            },
            'nodedrop': function (dropEvent) {
            },
            'startdrag': function (TreePanel, TreeNode, event) {
            }
        });
        _this.tempHotKeysDocument = [];

        _this.keymap = new Ext.KeyMap(document, [
            {
                key: 66,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!Ext.WindowMgr.getActive() || Ext.WindowMgr.getActive() == _this.parent) {
                        _this.btnBuscar.handler();
                    }
                    if (_this.plantilla) {
                        _this.btnBuscar.handler();
                    }
                }
            },
            {
                key: 76,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!Ext.WindowMgr.getActive() || Ext.WindowMgr.getActive() == _this.parent)
                        _this.btnLimpiar.handler();
                    if (_this.plantilla)
                        _this.btnLimpiar.handler();

                }
            }

        ]);
        _this.keymap.stopEvent = true;
        _this.keymap.enable();


        //_this.modificarVisibilidadColumnasPlugins(false);
    },
    onBuscAvanzada: function () {
        var _this = this;
        if (!_this.ventanaAdicionarRegistro || !_this.ventanaAdicionarRegistro.isVisible()) {
            _this.ventanaBusqAvanzada = new Ext.LOG.RegNumOperativo.VentataAdicionarRegistro({
                title: _this.idioma.lbBuscAvanzBtn,
                idioma: _this.idioma,
                closeAction: 'close',
                treegridPrincipal: _this,
                acciones_reportes: _this.acciones_reportes,
                recordTree: null,
                plantilla: false,
                modificar: false,
                //idarea: (_this.idarea) ? _this.idarea : Ext.getCmp('itemxRNO').getValue(),
                busqAvanzada: true
            });

        }
        _this.ventanaBusqAvanzada.show();
    },
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    },
    modificarVisibilidadColumnasPlugins: function (chequeado) {
        var _this = this;
        _this.verplugins = chequeado;

        for (var i = 0; i < arrCampos.length; i++) {
            var plug = arrCampos[i];
            var columnas_plug = {};
            columnas_plug.campos = {};
            plug.init(columnas_plug);

            var campos = columnas_plug.campos;
            for (var colum_plug in campos) {
                var pos = _this.getColumnModel().findColumnIndex(campos[colum_plug].dataIndex);

                if (pos > 0) {
                    _this.getColumnModel().setHidden(pos, !chequeado);
                }
            }
        }
    }
});
Ext.LOG.RegNumOperativo.ComboDepositos = Ext.extend(LOG.util.ComboBox, {
    constructor: function (config) {
        Ext.apply(this, config);
        var _this = this;
        _this.url = '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas';
        _this.valueField = 'iddeposito';
        _this.displayField = 'deposito';
        _this.allowBlank = false;

        Ext.LOG.RegNumOperativo.ComboDepositos.superclass.constructor.call(this, config);
    }
});

