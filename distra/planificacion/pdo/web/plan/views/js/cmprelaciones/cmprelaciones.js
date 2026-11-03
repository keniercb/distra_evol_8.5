Utilidades.Cmp.Cmprelaciones = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.estamodificandoelemento = 0;
    this.tipoelemento = null;
    this.tipoelementorelacionar = null;
    this.permiso = null;
    this.idelemento = null;
    this.arrayelementosrelacionados = [];
    this.arrayelementosrelacionadosinicial = [];
    this.arrayelementosrelacionadosinicialTibNo = [];
    this.arrayidrelaciones = [];
    this.arrayidrelacion = [];
    this.arrayrelacionesseleccionadas = [];
    this.DestruirComExtContenedor = null;
    this.PostAccionesFalloCritico = null;
    this.modificarRelaciones = false;
    this.arrayTempRelaciones = [];
    this.arrayIniRelaciones = [];
    var contador = 1;
    this.opcionTributar = null;
    this.tipoelementorelacionarinicial = null;

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    Ext.override(Ext.grid.EditorGridPanel, {
        onDestroy: function () {
            var cols = this.getColumnModel().config;
            for (var i = 0, len = cols.length; i < len; i++) {
                var c = cols[i];
                if (c.editor) {
                    c.editor.destroy();
                }
            }
            Ext.grid.EditorGridPanel.superclass.onDestroy.call(this);
        }
    });

    this.CrearCmpRelaciones = function (estamodificandoelemento, tipoelemento, idelemento, permiso,
                                        PostAccionesFalloCritico, DestruirComExtContenedor, comboDisabled) {
        _this.estamodificandoelemento = estamodificandoelemento;
        _this.tipoelemento = tipoelemento;
        _this.permiso = permiso;
        _this.idelemento = idelemento;
        _this.DestruirComExtContenedor = DestruirComExtContenedor;
        _this.PostAccionesFalloCritico = PostAccionesFalloCritico;

        if (_this.TGRelaciones) {
            _this.TGRelaciones.destroy();
        }
        this.btnRelacionar = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.CargarElementosARelacionar(idelemento);
            },
            iconCls: 'gestionarrelaciones',
            tooltip: 'Relacionar elementos',
            key: {
                ctrl: true,
                key: 'R'
            },
            scope: this

        });
        this.btnEliminarRelaciones = new Ext.Button({
            id: 'idbtnEliminarRelaciones',
            nextTab: 'btnCancelarCrudObj',
            prevTab: 'cbrelacionadocon',
            disabled: true,
            handler: function () {
                _this.EliminarRelaciones(PostAccionesFalloCritico, DestruirComExtContenedor);
            },
            iconCls: 'eliminar',
            tooltip: 'Eliminar relaci&oacute;n',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        //store del combo de relaciones
        this.stcbrelacionadocon = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmprelaciones/cargarcbrelacionadocon',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tipoelemento = tipoelemento;
                }
            },
            reader: new Ext.data.JsonReader(
                {
                    id: 'idtipoelemento',
                    root: "datos"
                },
                [{
                    name: 'idtipoelemento'
                }, {
                    name: 'denominacion'
                }])
        });

        //combo donde muestro los elementos con los que se puede relacionar
        this.cbrelacionadocon = new Ext.form.ComboBox({
            store: _this.stcbrelacionadocon,
            name: 'cbrelacionadocon',
            id: 'cbrelacionadocon',
            valueField: 'idtipoelemento',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            nextTab: 'idbtnEliminarRelaciones',
            prevTab: '',
            loadingText: 'Cargando',
            emptyText: 'Seleccione',
            selectOnFocus: true,
            width: 200,
            disabled: (comboDisabled == undefined) ? false : comboDisabled,
            listeners: {
                expand: function (combo) {
                    _this.stcbrelacionadocon.reload({});
                },
                select: function (combo, record, index) {
                    _this.tipoelementorelacionar = combo.getValue();
                    _this.CargarElementosARelacionar(idelemento);
                    combo.clearValue();
                }
            }
        });

        //Store del grid de relaciones
        this.reader = new Ext.data.JsonReader(
            {
                id: 'idrelacion',
                root: 'campos',
                totalProperty: 'total'
            }, [{
                name: 'idrelacion'
            }, {
                name: 'idplan'
            }, {
                name: 'idarc'
            }, {
                name: 'idobjetivo'
            }, {
                name: 'idfip'
            }, {
                name: 'iddesviacion'
            }, {
                name: 'idactividad'
            }, {
                name: 'denominacion'
            }, {
                name: 'idtarea'
            }, {
                name: 'idhito'
            }, {
                name: 'idproyecto'
            }, {
                name: 'autorelemento'
            }, {
                name: 'idautorelemento'
            }, {
                name: 'autorrelacion'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'superior'
            }, {
                name: 'eliminar'
            }, {
                name: 'depende'
            }, {
                name: 'origen'
            }, {
                name: 'porcientoinicio'
            }
            ]);

        this.stTGRelaciones = new Ext.data.Store({
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tipoelemento = tipoelemento;
                    st.baseParams.idelemento = idelemento;
                    if (_this.estamodificandoelemento == 1) {
                        st.baseParams.start = 0;
                        if (_this.stTGRelaciones.getCount() > 0) {
                            st.baseParams.start = (_this.stTGRelaciones.getCount() - 1);
                        }
                    }

                    if (_this.stTGRelaciones.getCount() > 0) {
                        if (Ext.getCmp('btnaceptaRM') != undefined)
                            Ext.getCmp('btnaceptaRM').enable();
                    } else {
                        if (Ext.getCmp('btnaceptaRM') != undefined)
                            Ext.getCmp('btnaceptaRM').disable();
                    }
                },
                load: function (store, record, options) {
                    if (contador == 1) {
                        _this.arrayIniRelaciones = _this.ObtenerIDElementosRelacionados();
                        contador++;
                    } else {
                        _this.arrayTempRelaciones = _this.ObtenerIDElementosRelacionados();
                        _this.modificarRelaciones = !_this.compararArray(_this.arrayIniRelaciones, _this.arrayTempRelaciones);
                    }
                }
            },
            url: '/planificacion/pdo/plan/index.php/cmprelaciones/cargargridrelaciones',
            reader: _this.reader
        });
        // modo de seleccion del  grid donde cargo las relaciones del elemento
        this.smTGRelaciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                        Ext.get(_this.TGRelaciones.getView().getRow(_this.prevrow)).removeClass('superior2');
                        Ext.get(_this.TGRelaciones.getView().getRow(_this.prevrow)).addClass('superior');
                    }
                    if (record.data.superior == 1) {
                        Ext.get(_this.TGRelaciones.getView().getRow(indiceFila)).removeClass('superior');
                        Ext.get(_this.TGRelaciones.getView().getRow(indiceFila)).addClass('superior2');
                        _this.prevrow = indiceFila;
                    } else
                        _this.prevrow = -1;
                    _this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, indiceFila, record) {

                    if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                        Ext.get(_this.TGRelaciones.getView().getRow(_this.prevrow)).removeClass('superior2');
                        Ext.get(_this.TGRelaciones.getView().getRow(_this.prevrow)).addClass('superior');
                    }
                    if (record.data.superior == 1) {
                        Ext.get(_this.TGRelaciones.getView().getRow(indiceFila)).removeClass('superior');
                        Ext.get(_this.TGRelaciones.getView().getRow(indiceFila)).addClass('superior2');
                        _this.prevrow = indiceFila;
                    } else
                        _this.prevrow = -1;
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });
        //barra de paginado del grid donde se cargan las relaciones
        this.pgrelaciones = new Ext.PagingToolbar({
            pageSize: 15,
            store: _this.stTGRelaciones,
            displayInfo: true
        });

        //grid donde muestro las relaciones
        this.TGRelaciones = new Ext.grid.EditorGridPanel({
            store: _this.stTGRelaciones,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            border: false,
            height: 100,
            sm: _this.smTGRelaciones,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando relaciones...'
            },
            listeners: {
                'beforeedit': function (e) {
                    if (e.record.data.origen != 7) {
                        e.cancel = true;
                    }
                },
                'beforerender': function (e) {
                    _this.arrayTempRelaciones = [];
                    _this.arrayIniRelaciones = [];
                    contador = 1;
                    _this.modificarRelaciones = false;
                }
            },
            columns: [_this.smTGRelaciones,
                {
                    header: "Denominaci&oacute;n del elemento",
                    id: 'expandir',
                    dataIndex: 'denominacion',
                    sortable: true,
                    renderer: MostrarImagenTipoElementoDenominacion
                }, {
                    header: "Autor del elemento",
                    dataIndex: 'autorelemento',
                    width: 110,
                    sortable: true,
                    renderer: MostrarImagenTipoElementoAutor
                }, {
                    header: "Autor de la relaci&oacute;n",
                    dataIndex: 'autorrelacion',
                    width: 110,
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }, {
                    header: "Depende",
                    dataIndex: 'depende',
                    width: 70,
                    sortable: true,
                    renderer: MostrarImagenT
                }, {
                    header: "Tipo de dependencia",
                    dataIndex: 'origen',
                    width: 110,
                    sortable: true,
                    renderer: MostrarTipoDependencia
                }, {
                    header: "% de Inicio",
                    dataIndex: 'porcientoinicio',
                    width: 90,
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        maxValue: 100,
                        maxText: 'Solo admite n&uacute;meros menor que 100 ',
                        minValue: 0,
                        minText: 'Solo admite n&uacute;meros mayor que 0 '
                    })
                }
            ],
            //bbar: _this.pgrelaciones,
            tbar: ['Relacionado con:', _this.cbrelacionadocon, /*, _this.btnRelacionar, */' ', _this.btnEliminarRelaciones]
        });
        _this.TGRelaciones.getView().getRowClass = function (ri, n) {
            if (ri.data.superior == 1)
                return "superior";
            else
                return "";
        };

        this.pRelaciones = new Ext.Panel({
            height: 100,
            border: false,
            title: 'Relaciones',
            id: 'idRelaciones',
            layout: 'fit',
            items: [_this.TGRelaciones],
            usarKeymap: true,
            botonesKeymap: [_this.btnRelacionar, ' ', _this.btnEliminarRelaciones],
            bbar: [
                '-', 'Leyenda: ',
                {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-folder sipac-azul"></span></center>'
                }, 'Plan', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-gestionardocumentosporsubsistema sipac-azul"></span></center>'
                }, 'ARC', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-archivo sipac-azul"></span></center>'
                }, 'Objetivo', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-unidadmedida sipac-azul"></span></center>'
                }, 'Criterio', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-actividades sipac-azul"></span></center>'
                }, 'Actividad', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-ficha sipac-azul"></span></center>'
                }, 'FIP', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-conflicto sipac-azul"></span></center>'
                }, 'Desviación', ' ', '-'
            ]
        });
        // se agrega el listenrs de esta manera para que el codigo de la tecla caliente no sobreescriba el listeners
        _this.pRelaciones.addListener('activate', function (gp) {
            if (_this.estamodificandoelemento == 1) {
                _this.stTGRelaciones.reload({});
            }
        });
        if (tipoelemento == 5) {
            //_this.pRelaciones.getComponent('fip').hide();
        }
        if (tipoelemento == 5) {
        } else if (_this.pRelaciones.getBottomToolbar()[28] != undefined) {
            _this.pRelaciones.getBottomToolbar()[28].hidden = false;
        }
        return _this.pRelaciones;
    };

    this.CrearCmpRelacionesMultiples = function (tipoelemento, arrayidelementos,
                                                 PostAccionesFalloCritico, DestruirComExtContenedor) {
        _this.tipoelemento = tipoelemento;
        _this.arrayidelementos = arrayidelementos;
        _this.permiso = 1;
        _this.DestruirComExtContenedor = DestruirComExtContenedor;
        _this.PostAccionesFalloCritico = PostAccionesFalloCritico;

        if (_this.WinRelacionesMultiples) {
            _this.WinRelacionesMultiples.destroy();
        }
        this.btnRelacionar = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.CargarElementosARelacionar(idelemento = null);
            },
            iconCls: 'gestionarrelaciones',
            tooltip: 'Relacionar elementos',
            key: {
                ctrl: true,
                key: 'R'
            },
            scope: this
        });
        this.btnEliminarRelaciones = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.EliminarRelaciones(PostAccionesFalloCritico, DestruirComExtContenedor);
            },
            iconCls: 'eliminar',
            tooltip: 'Eliminar relaci&oacute;n',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        //store del combo de relaciones
        this.stcbrelacionadocon = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmprelaciones/cargarcbrelacionadocon',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tipoelemento = tipoelemento;
                }
            },
            reader: new Ext.data.JsonReader(
                {
                    id: 'idtipoelemento',
                    root: "datos"
                }, [{
                    name: 'idtipoelemento'
                }, {
                    name: 'denominacion'
                }])
        });
        //combo donde muestro los elementos con los que se puede relacionar
        this.cbrelacionadocon = new Ext.form.ComboBox({
            store: _this.stcbrelacionadocon,
            valueField: 'idtipoelemento',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            loadingText: 'Cargando...',
            selectOnFocus: true,
            width: 200,
            listeners: {
                expand: function (combo) {
                    _this.stcbrelacionadocon.reload({});
                },
                select: function (combo, record, index) {
                    _this.tipoelementorelacionar = combo.getValue();
                    _this.CargarElementosARelacionar(idelemento = null);
                }
            }
        });

        //Store del grid de relaciones
        this.reader = new Ext.data.JsonReader(
            {
                id: 'idrelacion',
                root: 'campos',
                totalProperty: 'total'
            }, [{
                name: 'idrelacion'
            }, {
                name: 'idplan'
            }, {
                name: 'idarc'
            }, {
                name: 'idobjetivo'
            }, {
                name: 'idfip'
            }, {
                name: 'iddesviacion'
            }, {
                name: 'denominacion'
            }, {
                name: 'autorelemento'
            }, {
                name: 'idautorelemento'
            }, {
                name: 'autorrelacion'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'eliminar'
            }]);
        this.stTGRelaciones = new Ext.data.Store({
            reader: _this.reader
        });

        // modo de seleccion del  grid donde cargo las relaciones del elemento
        this.smTGRelaciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });
        //grid donde muestro las relaciones
        this.TGRelaciones = new Ext.grid.GridPanel({
            store: _this.stTGRelaciones,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            sm: _this.smTGRelaciones,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando relaciones'
            },
            columns: [_this.smTGRelaciones,
                {
                    header: "Denominaci&oacute;n del elemento",
                    id: 'expandir',
                    dataIndex: 'denominacion',
                    sortable: true,
                    renderer: MostrarImagenTipoElementoDenominacion
                }, {
                    header: "Autor del elemento",
                    dataIndex: 'autorelemento',
                    width: 110,
                    sortable: true,
                    renderer: MostrarImagenTipoElementoAutor
                }, {
                    header: "Autor de la relaci&oacute;n",
                    dataIndex: 'autorrelacion',
                    width: 110,
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }],
            tbar: ['Relacionado con:', _this.cbrelacionadocon, /*' ', _this.btnRelacionar, */' ', _this.btnEliminarRelaciones]
        });

        this.WinRelacionesMultiples = new Ext.Window({
            title: 'Relaciones',
            closeAction: 'destroy',
            modal: true,
            constrain: true,
            resizable: true,
            height: 450,
            width: 680,
            layout: 'fit',
            listeners: {
                destroy: function (w) {
                    _this.stTGRelaciones.removeAll();
                }
            },
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    _this.AdicionarRelacionesMultiples();
                },
                scope: this
            }],
            items: [_this.TGRelaciones],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos.',
                    handler: function () {
                        //fsera
                        _this.stTGRelaciones.removeAll();
                        _this.WinRelacionesMultiples.destroy();
                    }
                }, {
                    iconCls: 'aceptar ',
                    id: 'btnaceptaRM',
                    disabled: true,
                    tooltip: 'Guardar datos y cerrar ventana.',
                    text: 'Aceptar',
                    handler: function () {
                        _this.AdicionarRelacionesMultiples();
                    }
                }
            ],
            bbar: [
                '-', 'Leyenda: ',
                {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-folder sipac-azul"></span></center>'
                }, 'Plan', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-gestionardocumentosporsubsistema sipac-azul"></span></center>'
                }, 'ARC', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-archivo sipac-azul"></span></center>'
                }, 'Objetivo', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-unidadmedida sipac-azul"></span></center>'
                }, 'Criterio', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-actividades sipac-azul"></span></center>'
                }, 'Actividad', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-ficha sipac-azul"></span></center>'
                }, 'FIP', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-conflicto sipac-azul"></span></center>'
                }, 'Desviación', ' ', '-'
            ]
        });
        return _this.WinRelacionesMultiples;
    };

    this.CrearCmpRelacionesIniciales = function (tipoelemento, PostAccionesSeleccionarInicial, collapsed) {
        _this.estamodificandoelementoinicial = 0;
        _this.tipoelemento = tipoelemento;
        _this.permisoinicial = 1;
        _this.idelementoinicial = null;
        _this.PostAccionesSeleccionarInicial = PostAccionesSeleccionarInicial;

        this.btnRelacionarIniciales = new Ext.Button({
            id: 'btnRelacionarIniciales',
            disabled: true,
            handler: function () {
                _this.opcionTributar = 1;
                _this.CargarElementosARelacionarIniciales();
            },
            iconCls: 'gestionarrelaciones',
            tooltip: 'Relacionar elementos',
            key: {
                ctrl: true,
                key: 'R'
            },
            scope: this
        });

        this.btnEliminarRelacionesIniciales = new Ext.Button({
            id: 'btnEliminarRelacionesIniciales',
            disabled: true,
            handler: function () {
                _this.opcionTributar = 1;
                _this.EliminarRelacionesIniciales();
            },
            iconCls: 'eliminar',
            tooltip: 'Eliminar relaci&oacute;n',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });


        //store del combo de relaciones **iniciales**
        this.stcbrelacionadoconinicial = new Ext.data.Store({
            id: 'stcbrelacionadoconinicial',
            url: '/planificacion/pdo/plan/index.php/cmprelaciones/cargarcbrelacionadocon',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tipoelemento = tipoelemento;
                    //st.baseParams.relacionesiniciales = 1;
                    st.baseParams.tributar = 1;
                }
            },
            reader: new Ext.data.JsonReader(
                {
                    id: 'idtipoelemento',
                    root: "datos"
                }, [{
                    name: 'idtipoelemento'
                }, {
                    name: 'denominacion'
                }])
        });

        //combo donde muestro los elementos con los que se puede relacionar inicialmente
        this.cbrelacionadoconinicial = new Ext.form.ComboBox({
            id: 'cbrelacionadoconinicial',
            store: _this.stcbrelacionadoconinicial,
            valueField: 'idtipoelemento',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            emptyText: 'Seleccione',
            loadingText: 'Cargando',
            selectOnFocus: true,
            width: 200,
            listeners: {
                expand: function (combo) {
                    _this.stcbrelacionadoconinicial.reload({});
                },
                select: function (combo, record, index) {
                    _this.tipoelementorelacionarinicial = combo.getValue();
                    _this.btnRelacionarIniciales.enable();
                }
            }
        });


        //Store del grid de relaciones
        this.readerinicial = new Ext.data.JsonReader(
            {
                id: 'idrelacion',
                root: 'campos',
                totalProperty: 'total'
            }, [{
                name: 'idrelacion'
            }, {
                name: 'idplan'
            }, {
                name: 'idarc'
            }, {
                name: 'idobjetivo'
            }, {
                name: 'idfip'
            }, {
                name: 'iddesviacion'
            }, {
                name: 'denominacion'
            }, {
                name: 'autorelemento'
            }, {
                name: 'idautorelemento'
            }, {
                name: 'autorrelacion'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'eliminar'
            }]);

        this.stTGRelacionesInicial = new Ext.data.Store({
            reader: _this.readerinicial,
            listeners: {
                load: function (st) {
                }
            }
        });

        // modo de seleccion del  grid donde cargo las relaciones del elemento
        this.smTGRelacionesInicial = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientasIniciales();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientasIniciales();
                }
            }
        });

        //grid donde muestro las relaciones
        this.TGRelacionesInicial = new Ext.grid.GridPanel({
            //title: 'Elementos a tributar',
            id: 'TGRelacionesInicial',
            store: _this.stTGRelacionesInicial,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            border: false,
            sm: _this.smTGRelacionesInicial,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando relaciones...'
            },
            columns: [_this.smTGRelacionesInicial,
                {
                    header: "Denominaci&oacute;n del elemento",
                    id: 'expandir',
                    dataIndex: 'denominacion',
                    sortable: true,
                    renderer: MostrarImagenTipoElementoDenominacion
                }, {
                    header: "Autor del elemento",
                    dataIndex: 'autorelemento',
                    width: 110,
                    sortable: true,
                    renderer: MostrarImagenTipoElementoAutor
                }, {
                    header: "Autor de la relaci&oacute;n",
                    dataIndex: 'autorrelacion',
                    width: 110,
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }
            ],
            tbar: ['Relacionado con:', _this.cbrelacionadoconinicial, ' ', _this.btnRelacionarIniciales, ' ',
                _this.btnEliminarRelacionesIniciales]
        });


        //---------Elementos no tributados------------------------------
        this.btnRelacionarInicialesNoTrib = new Ext.Button({
            id: 'btnRelacionarInicialesNoTrib',
            disabled: true,
            handler: function () {
                _this.opcionTributar = 2;
                _this.CargarElementosARelacionarIniciales();
            },
            iconCls: 'gestionarrelaciones',
            tooltip: 'Relacionar elementos',
            key: {
                ctrl: true,
                key: 'R'
            },
            scope: this
        });

        this.btnEliminarRelacionesInicialesNoTrib = new Ext.Button({
            id: 'btnEliminarRelacionesInicialesNoTrib',
            disabled: true,
            handler: function () {
                _this.opcionTributar = 2;
                _this.EliminarRelacionesIniciales();
            },
            iconCls: 'eliminar',
            tooltip: 'Eliminar relaci&oacute;n',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });

        this.stcbrelacionadoconinicialNoTrib = new Ext.data.Store({
            id: 'stcbrelacionadoconinicialNoTrib',
            url: '/planificacion/pdo/plan/index.php/cmprelaciones/cargarcbrelacionadocon',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.tipoelemento = tipoelemento;
                    //st.baseParams.relacionesiniciales = 1;
                    st.baseParams.tributar = 1;
                }
            },
            reader: new Ext.data.JsonReader(
                {
                    id: 'idtipoelemento',
                    root: "datos"
                }, [{
                    name: 'idtipoelemento'
                }, {
                    name: 'denominacion'
                }])
        });

        this.cbrelacionadoconinicialNoTrib = new Ext.form.ComboBox({
            id: 'cbrelacionadoconinicialNoTrib',
            store: _this.stcbrelacionadoconinicialNoTrib,
            valueField: 'idtipoelemento',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            emptyText: 'Seleccione',
            loadingText: 'Cargando',
            selectOnFocus: true,
            width: 200,
            listeners: {
                expand: function (combo) {
                    _this.stcbrelacionadoconinicialNoTrib.reload({});
                },
                select: function (combo, record, index) {
                    _this.tipoelementorelacionarinicial = combo.getValue();
                    _this.btnRelacionarInicialesNoTrib.enable();
                }
            }
        });

        this.readerinicialNoTrib = new Ext.data.JsonReader(
            {
                id: 'idrelacionNoTrib',
                root: 'campos',
                totalProperty: 'total'
            }, [{
                name: 'idrelacion'
            }, {
                name: 'idplan'
            }, {
                name: 'idarc'
            }, {
                name: 'idobjetivo'
            }, {
                name: 'idfip'
            }, {
                name: 'iddesviacion'
            }, {
                name: 'denominacion'
            }, {
                name: 'autorelemento'
            }, {
                name: 'idautorelemento'
            }, {
                name: 'autorrelacion'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'eliminar'
            }]);

        this.stTGRelacionesInicialNoTrib = new Ext.data.Store({
            reader: _this.readerinicialNoTrib,
            listeners: {
                load: function (st) {
                }
            }
        });

        this.smTGRelacionesInicialNoTrib = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientasIniciales();
                },
                rowdeselect: function (sm, indiceFila, record) {
                    _this.ActualizarEstadoBarraHerramientasIniciales();
                }
            }
        });

        this.TGRelacionesInicialNoTrib = new Ext.grid.GridPanel({
            //title: 'Elementos no tributados',
            id: 'TGRelacionesInicialNoTrib',
            store: _this.stTGRelacionesInicialNoTrib,
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            border: false,
            sm: _this.smTGRelacionesInicialNoTrib,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando relaciones...'
            },
            columns: [_this.smTGRelacionesInicialNoTrib,
                {
                    header: "Denominaci&oacute;n del elemento",
                    id: 'expandir',
                    dataIndex: 'denominacion',
                    sortable: true,
                    renderer: MostrarImagenTipoElementoDenominacion
                }, {
                    header: "Autor del elemento",
                    dataIndex: 'autorelemento',
                    width: 110,
                    sortable: true,
                    renderer: MostrarImagenTipoElementoAutor
                }, {
                    header: "Autor de la relaci&oacute;n",
                    dataIndex: 'autorrelacion',
                    width: 110,
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }
            ],
            tbar: ['Relacionado con:', _this.cbrelacionadoconinicialNoTrib, ' ', _this.btnRelacionarInicialesNoTrib, ' ',
                _this.btnEliminarRelacionesInicialesNoTrib]
        });

        _this.tpElemTributarNoTributar = new Ext.TabPanel({
            height: 200,
            activeTab: 0,
            frame: true,
            items: [{
                id: 'tabTrib',
                title: 'Elementos a tributar',
                layout: 'fit',
                items: [_this.TGRelacionesInicial],
                listeners: {
                    activate: function () {
                        _this.opcionTributar = 1;
                    }
                }
            }, {
                id: 'tabNoTrib',
                title: 'Elementos no tributados',
                layout: 'fit',
                items: [_this.TGRelacionesInicialNoTrib],
                listeners: {
                    activate: function () {
                        _this.opcionTributar = 2;
                    }
                }
            }],
            listeners: {
                tabchange: function (tabpanel, tabseleccionado) {
                    _this.opcionTributar = (tabseleccionado.id == 'tabNoTrib') ? 2 : 1;
                },
                beforetabchange: function (tab, newtab, currentTab) {
                }
            }
        });
        //
        this.pRelacionesIniciales = new Ext.Panel({
            //title: 'Elementos a tributar',
            region: 'north',
            layout: 'fit',
            collapsible: true,
            border: false,
            collapsed: collapsed,
            header: true,
            height: 200,
            items: _this.tpElemTributarNoTributar,
            usarKeymap: true,
            botonesKeymap: [_this.btnRelacionarIniciales, _this.btnEliminarRelacionesIniciales],
            bbar: [
                '-', 'Leyenda: ',
                {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-folder sipac-azul"></span></center>'
                }, 'Plan', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-gestionardocumentosporsubsistema sipac-azul"></span></center>'
                }, 'ARC', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-archivo sipac-azul"></span></center>'
                }, 'Objetivo', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-unidadmedida sipac-azul"></span></center>'
                }, 'Criterio', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-actividades sipac-azul"></span></center>'
                }, 'Actividad', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-ficha sipac-azul"></span></center>'
                }, 'FIP', ' ', {
                    xtype: 'tbtext',
                    text: '<center><span class="icondistra-conflicto sipac-azul"></span></center>'
                }, 'Desviación', ' ', '-'
            ]
        });
        if (_this.pRelacionesIniciales.getBottomToolbar()[28] != undefined) {
            _this.pRelacionesIniciales.getBottomToolbar()[28].hidden = false;
        }
        return _this.pRelacionesIniciales;
    };
    this.getPRelacionesIniciales = function () {
        return _this.pRelacionesIniciales;
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayrelacionesseleccionadas = [];
        _this.arrayidrelaciones = [];
        _this.arrayidrelacion = [];
        _this.btnEliminarRelaciones.disable();
        if (_this.smTGRelaciones.hasSelection()) {
            var arrayrecords = _this.smTGRelaciones.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                var puedeeliminar = 1;
                for (var i = 0; i < arrayrecords.length; i++) {
                    if (arrayrecords[i].data.eliminar == 0 ||
                        (arrayrecords[i].data.tipoelemento == 8 || arrayrecords[i].data.tipoelemento == 9
                            || arrayrecords[i].data.tipoelemento == 80 || arrayrecords[i].data.tipoelemento == 90)) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidrelaciones[i] = arrayrecords[i].data.idelemento;
                    var relacion = {};
                    relacion = {
                        idplan: arrayrecords[i].data.idplan,
                        idarc: arrayrecords[i].data.idarc,
                        idobjetivo: arrayrecords[i].data.idobjetivo,
                        idactividad: arrayrecords[i].data.idactividad,
                        idfip: arrayrecords[i].data.idfip,
                        iddesviacion: arrayrecords[i].data.iddesviacion,
                        idtarea: arrayrecords[i].data.idtarea,
                        idhito: arrayrecords[i].data.idhito,
                        idproyecto: arrayrecords[i].data.idproyecto,
                        idrelacion: arrayrecords[i].data.idrelacion,
                        tipoelemento: arrayrecords[i].data.tipoelemento,
                        porcientoinicio: arrayrecords[i].data.porcientoinicio
                    };
                    _this.arrayrelacionesseleccionadas.push(relacion);
                    _this.arrayidrelacion[i] = arrayrecords[i].data.idrelacion;
                }
                if (puedeeliminar == 1 && _this.permiso == 1) {
                    _this.btnEliminarRelaciones.enable();
                }
            }
        }
        if (_this.stTGRelaciones.getCount() > 0) {
            if (Ext.getCmp('btnaceptaRM') != undefined)
                Ext.getCmp('btnaceptaRM').enable();
        } else {
            if (Ext.getCmp('btnaceptaRM') != undefined)
                Ext.getCmp('btnaceptaRM').disable();
        }
    };

    this.ActualizarEstadoBarraHerramientasIniciales = function () {
        _this.arrayrelacionesseleccionadasiniciales = [];
        _this.arrayidrelacionesiniciales = [];
        _this.arrayidrelacioninicial = [];
        _this.btnEliminarRelacionesIniciales.disable();
        _this.btnEliminarRelacionesInicialesNoTrib.disable();

        //console.log(_this.opcionTributar);

        var sm = (_this.opcionTributar == 1) ? _this.smTGRelacionesInicial.hasSelection() : _this.smTGRelacionesInicialNoTrib.hasSelection();

        if (sm) {
            var arrayrecords = (_this.opcionTributar == 1) ? _this.smTGRelacionesInicial.getSelections() : _this.smTGRelacionesInicialNoTrib.getSelections();
            var totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                var puedeeliminar = 1;
                for (var i = 0; i < arrayrecords.length; i++) {
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                    _this.arrayidrelacionesiniciales[i] = arrayrecords[i].data.idelemento;
                    var relacion = {};
                    relacion = {
                        idplan: arrayrecords[i].data.idplan,
                        idarc: arrayrecords[i].data.idarc,
                        idobjetivo: arrayrecords[i].data.idobjetivo,
                        idactividad: arrayrecords[i].data.idactividad,
                        idtarea: arrayrecords[i].data.idtarea,
                        idhito: arrayrecords[i].data.idhito,
                        idproyecto: arrayrecords[i].data.idproyecto,
                        iddesviacion: arrayrecords[i].data.iddesviacion,
                        idrelacion: arrayrecords[i].data.idrelacion,
                        tipoelemento: arrayrecords[i].data.tipoelemento
                    };
                    _this.arrayrelacionesseleccionadasiniciales.push(relacion);
                    _this.arrayidrelacioninicial[i] = arrayrecords[i].data.idrelacion;
                }
                if (puedeeliminar == 1) {
                    (_this.opcionTributar == 1) ? _this.btnEliminarRelacionesIniciales.enable() : _this.btnEliminarRelacionesInicialesNoTrib.enable();
                }
            }
        }
    };

    this.compararArray = function (arrayIni, arrayTemp) {
        var contador = 0;
        var parada = 0;
        if (arrayIni.length == arrayTemp.length) {
            for (var i = 0; i < arrayIni.length; i++) {
                for (var j = 0; j < arrayTemp.length; j++) {
                    if (arrayIni[i] == arrayTemp[j]) {
                        contador++;
                        break;
                    } else
                        parada++;
                }
                if (parada == arrayTemp.length) {
                    return false;
                    break;
                } else
                    parada = 0;
            }
            if (contador == arrayIni.length)
                return true;
        } else
            return false;
    };

    this.CargarElementosARelacionar = function (idelemento, plantilla, idEstructura) {
        if (_this.objelemento) {
            _this.objelemento.destroy();
        }
        switch (_this.tipoelementorelacionar) {
            case 0:
                objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarAddObj: true,
                        noUsarAddAct: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: false,
                        noUsarMenuGrid: true,
                        noUsarAyuda: true,
                        titleWinPrincipal: 'Registro de planes',
                        noUsarPaginado: true
                    });
                objCmpPlan.CargarCmpPlan(idelemento = null, tipoelemento = null,
                    parentelemento = 'hijo', _this.PostAccionesRelacionar, _this.PostCancelar);
                break;
            case 1:
                objCmpObjetivo = new Utilidades.Cmp.Cmpgestionarobjetivos(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: false,
                        noUsarMenuGrid: true,
                        nombrePanel: 'Registro de objetivos',
                        noUsarAyuda: true,
                        closableWinPrincipal: true,
                        titleWinPrincipal: 'Registro de objetivos',
                        noUsarPaginado: true,
                        pRelacionesIniciales: false
                    });
                objCmpObjetivo.CargarCmpObjetivos(idelemento = null, tipoelemento = null, parentelemento = 'hijo', _this.PostAccionesRelacionar, arrayidobjetivosReorganizar = []);
                break;
            case 2:
                objCmpFip = new Utilidades.Cmp.Cmpgestionarfip(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: false,
                        noUsarMenuGrid: true,
                        noUsarAyuda: true,
                        titleWinPrincipal: 'Registro de FIPs',
                        closableWinPrincipal: true,
                        noUsarPaginado: true,
                        reordenarHijos: false
                    });
                objCmpFip.CargarCmpFip(idelemento = null, tipoelemento = null, parentelemento = 'hijo', _this.PostAccionesRelacionar, []);
                break;
            case 6:
                objCmpDesviacion = new Utilidades.Cmp.Cmpgestionardesviaciones(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarAdicionar: false,
                        noUsarLimpiar: false,
                        noUsarPublicacion: true,
                        noUsarCerrarWinP: true,
                        noUsarPaginado: false,
                        singlemodoSeleccionGridDesviaciones: false,
                        idcmp: 'local',
                        noUsarMenuGrid: false,
                        cargarDatos: true,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarAyuda: true,
                        titleWinPrincipal: 'Registro de desviaciones',
                        closableWinPrincipal: true,
                        noUsarPaginado: true
                    });
                objCmpDesviacion.CargarCmpDesviaciones(idelemento, _this.PostAccionesRelacionar);
                break;
            case 7:
                if (_this.tipoelemento == 3) {
                    var arreglo = [];
                    objcmpact = new Utilidades.Cmp.Cmpgestionaractividades(
                        {
                            noUsarModificar: true,
                            noUsarEliminar: true,
                            noUsarActivar: true,
                            noUsarDesactivar: true,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            maxWinPrincipal: false,
                            noUsarCbAprob: true,
                            noUsarGestObser: true,
                            noMostrarColumObser: true,
                            dependenciaTotal: true,
                            idelementoDependencia: idelemento,
                            singlemodoSeleccionGridActividades: false,
                            noUsarMenuGrid: true,
                            nombrePanel: 'Registro de actividades',
                            noUsarAyuda: true,
                            noUsarPaginado: true

                        });
                    objcmpact.CargarCmpActividades(idelemento, 3, parentelemento = 'padre', function (aux, win) {

                        if (_this.estamodificandoelemento == 0) {
                            _this.PostAccionesRelacionar(aux, win);
                        } else {
                            _this.stTGRelaciones.removeAll();
                            _this.stTGRelaciones.reload();
                        }
                    }, arreglo);
                }
                if (_this.tipoelemento == 10) {//Dependencias total (Tareas)

                    var arreglo = [];
                    objtarea = new Utilidades.Cmp.Cmpgestionarplantilla(
                        {
                            noUsarAdicionar: false,
                            noUsarModificar: false,
                            noUsarEliminar: false,
                            maxWinPrincipal: false,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            noUsarGestObser: false,
                            noMostrarColumObser: false,
                            nombrePanel: 'Registro de tareas',
                            dependenciaTotal: true,
                            idelementoDependencia: idelemento,
                            noAutoload: false,
                            desasociarVisible: true
                        });

                    objtarea.CargarCmpPlantilla(
                        idelemento, 10, plantilla, _this.estamodificandoelemento,
                        parentelemento = 'padre', function(aux, win) {
                            if (_this.estamodificandoelemento == 0) {
                                _this.PostAccionesRelacionar(aux, win);
                            } else {
                                _this.stTGRelaciones.removeAll();
                                _this.stTGRelaciones.reload();
                            }
                        }, arreglo, idEstructura);

                    //objtarea.aplicarFiltro(4053);
                }
                break;
            case 8:
                if (_this.tipoelemento == 3) {
                    var arreglo = [];
                    objcmpact = new Utilidades.Cmp.Cmpgestionaractividades(
                        {
                            noUsarModificar: true,
                            noUsarEliminar: true,
                            noUsarActivar: true,
                            noUsarDesactivar: true,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            maxWinPrincipal: false,
                            noUsarCbAprob: true,
                            noUsarGestObser: true,
                            noMostrarColumObser: true,
                            dependenciaPorcentual: true,
                            idelementoDependencia: idelemento,
                            singlemodoSeleccionGridActividades: false,
                            noUsarMenuGrid: true,
                            nombrePanel: 'Registro de actividades',
                            noUsarAyuda: true,
                            noUsarPaginado: true
                        });
                    objcmpact.CargarCmpActividades(idelemento, 3, parentelemento = 'padre', function (aux, win) {
                        if (_this.estamodificandoelemento == 0) {
                            _this.PostAccionesRelacionar(aux, win);
                        } else {
                            _this.stTGRelaciones.removeAll();
                            _this.stTGRelaciones.reload();
                        }
                    }, arreglo);
                }
                if (_this.tipoelemento == 10) {//Dependencias % (Tareas)
                    var arreglo = [];
                    objtarea = new Utilidades.Cmp.Cmpgestionarplantilla(
                        {
                            noUsarAdicionar: false,
                            noUsarModificar: false,
                            noUsarEliminar: false,
                            maxWinPrincipal: false,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            noUsarGestObser: false,
                            noMostrarColumObser: false,
                            nombrePanel: 'Registro de tareas',
                            dependenciaPorcentual: true,
                            idelementoDependencia: idelemento,
                            noAutoload: false
                        });
                    objtarea.CargarCmpPlantilla(
                        idelemento, 10, plantilla, _this.estamodificandoelemento,
                        parentelemento = 'padre', function(aux, win) {
                            if (_this.estamodificandoelemento == 0) {
                                _this.PostAccionesRelacionar(aux, win);
                            } else {
                                _this.stTGRelaciones.removeAll();
                                _this.stTGRelaciones.reload();
                            }
                        }, arreglo, idEstructura);
                }
                break;
            case 9:
                if (_this.tipoelemento == 3) {
                    var arreglo = [];
                    objcmpact = new Utilidades.Cmp.Cmpgestionaractividades(
                        {
                            noUsarModificar: true,
                            noUsarEliminar: true,
                            noUsarActivar: true,
                            noUsarDesactivar: true,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            maxWinPrincipal: false,
                            noUsarCbAprob: true,
                            noUsarGestObser: true,
                            noMostrarColumObser: true,
                            dependenciaPuertaAbierta: true,
                            idelementoDependencia: idelemento,
                            //arraysubactividades:arreglo,
                            singlemodoSeleccionGridActividades: false,
                            noUsarMenuGrid: true,
                            nombrePanel: 'Registro de actividades',
                            noUsarAyuda: true,
                            noUsarPaginado: true
                        });
                    objcmpact.CargarCmpActividades(idelemento, 3, parentelemento = 'padre', function (aux, win) {
                        if (_this.estamodificandoelemento == 0) {
                            _this.PostAccionesRelacionar(aux, win);
                        } else {
                            _this.stTGRelaciones.removeAll();
                            _this.stTGRelaciones.reload();
                        }
                    }, arreglo);
                }
                if (_this.tipoelemento == 10) {//Dependencias puerta abierta (Tareas)
                    var arreglo = [];
                    objtarea = new Utilidades.Cmp.Cmpgestionarplantilla(
                        {
                            noUsarAdicionar: false,
                            noUsarModificar: false,
                            noUsarEliminar: false,
                            maxWinPrincipal: false,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            noUsarGestObser: false,
                            noMostrarColumObser: false,
                            nombrePanel: 'Registro de tareas',
                            dependenciaPuertaAbierta: true,
                            idelementoDependencia: idelemento,
                            noAutoload: false
                        });
                    objtarea.CargarCmpPlantilla(
                        idelemento, 10, plantilla, _this.estamodificandoelemento,
                        parentelemento = 'padre', function(aux, win) {
                            if (_this.estamodificandoelemento == 0) {
                                _this.PostAccionesRelacionar(aux, win);
                            } else {
                                _this.stTGRelaciones.removeAll();
                                _this.stTGRelaciones.reload();
                            }
                        }, arreglo, idEstructura);
                }
                break;
            case 50:
                if (_this.WinRelacionesTernarias)
                    _this.WinRelacionesTernarias.destroy();
                objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarAddObj: true,
                        noUsarAddAct: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: true,
                        noUsarSeleccionarWinP: true,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: true,
                        noUsarMenuGrid: true,
                        noUsarCbPaginado: true,
                        noUsarAyuda: true,
                        noUsarPaginado: true
                    });
                _this.pPlanes = objCmpPlan.CargarCmpPlanRelacionesTernarias(
                    idelemento = null, tipoelemento = null, parentelemento = 'hijo');

                objCmpArc = new Utilidades.Cmp.Cmpgestionararc(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarTributar: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: true,
                        noUsarSeleccionarWinP: true,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        activas: 1,
                        noUsarMenuGrid: false,
                        noUsarMenuGrid: false,
                        noUsarAyuda: true,
                        noUsarVer: false,
                        noUsarPaginado: true

                    });
                _this.pARC = objCmpArc.CargarCmpArcRelacionesTernarias(idelemento, tipoelemento, parentelemento);

                this.btnSeleccionar = new Ext.Button({
                    handler: function () {
                        _this.CrearRelacionesTernarias(objCmpPlan, objCmpArc);
                    },
                    disabled: true,
                    text: 'Seleccionar',
                    iconCls: 'seleccion ',
                    cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                    tooltip: 'Relacionar elemento(s) seleccionado(s)'
                });

                var elemento = (_this.tipoelemento == 3) ? 'Actividad(es)' : (_this.tipoelemento == 1) ? 'Objetivo(s)' : 'Plan(es)';

                this.WinRelacionesTernarias = new Ext.Window({
                    layout: 'fit',
                    title: 'Relacionar elemento(s)',
                    closable: true,
                    graggable: true,
                    constrain: true,
                    maximized: true,
                    modal: true,
                    items: [
                        {
                            layout: 'column',
                            frame: true,
                            items: [
                                {
                                    columnWidth: 0.5,
                                    items: _this.pPlanes
                                }, {
                                    columnWidth: 0.5,
                                    items: _this.pARC
                                }
                            ]
                        }
                    ],
                    keys: [{
                        key: Ext.EventObject.ENTER,
                        fn: function () {
                            _this.CrearRelacionesTernarias(objCmpPlan, objCmpArc);
                        },
                        scope: this
                    }],
                    buttons: [
                        {
                            text: 'Cerrar',
                            tooltip: 'Cerrar ventana',
                            iconCls: 'cerrar',
                            handler: function () {
                                _this.WinRelacionesTernarias.destroy();
                            }
                        },
                        _this.btnSeleccionar
                    ],
                    listeners: {
                        beforedestroy: function (w) {
                            _this.cbrelacionadocon.clearValue();
                            _this.btnRelacionar.disable();
                        },
                        beforeshow: function (w) {
                            _this.pPlanes.setHeight(w.el.dom.offsetHeight - 70);
                            _this.pARC.setHeight(w.el.dom.offsetHeight - 70);
                            _this.pPlanes.doLayout();
                            _this.pARC.doLayout();
                        }
                    }
                });
                var planes = _this.pPlanes.findById('TGCmpPlan').getSelectionModel();
                var arc = _this.pARC.findById('TGCmpArc').getSelectionModel();
                planes.on('selectionchange', function () {
                    if (planes.hasSelection() && arc.hasSelection())
                        _this.btnSeleccionar.enable();
                    else
                        _this.btnSeleccionar.disable();
                });
                arc.on('selectionchange', function () {
                    if (planes.hasSelection() && arc.hasSelection())
                        _this.btnSeleccionar.enable();
                    else
                        _this.btnSeleccionar.disable();
                });
                _this.WinRelacionesTernarias.show();
                break;
            case 11://Proyecto
                var arreglo = [];
                objproyecto = new Utilidades.Cmp.Cmpgestionarplantilla(
                    {
                        noUsarAdicionar: false,
                        noUsarModificar: false,
                        noUsarEliminar: false,
                        maxWinPrincipal: false,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        noUsarGestObser: false,
                        noMostrarColumObser: false,
                        nombrePanel: 'Registro de proyectos',
                        dependenciaPuertaAbierta: true,
                        idelementoDependencia: idelemento,
                        singleSeleccion: true,
                        noAutoload: false
                    });
                objproyecto.CargarCmpPlantilla(idelemento, 8, plantilla, _this.estamodificandoelemento,
                    parentelemento = 'padre', function(aux, win) {
                        if (_this.estamodificandoelemento == 0) {
                            _this.PostAccionesRelacionar(aux, win);
                        } else {
                            _this.stTGRelaciones.removeAll();
                            _this.stTGRelaciones.reload();
                        }
                    }, arreglo);
                break;
            case 12://Hito
                var arreglo = [];
                objhito = new Utilidades.Cmp.Cmpgestionarplantilla(
                    {
                        noUsarAdicionar: false,
                        noUsarModificar: false,
                        noUsarEliminar: false,
                        maxWinPrincipal: false,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        noUsarGestObser: false,
                        noMostrarColumObser: false,
                        nombrePanel: 'Registro de hitos',
                        dependenciaPuertaAbierta: true,
                        singleSeleccion: true,
                        idelementoDependencia: idelemento,
                        noAutoload: false
                    });
                objhito.CargarCmpPlantilla(idelemento, 9, plantilla, _this.estamodificandoelemento,
                    parentelemento = 'padre', function(aux, win) {
                        if (_this.estamodificandoelemento == 0) {
                            _this.PostAccionesRelacionar(aux, win);
                        } else {
                            _this.stTGRelaciones.removeAll();
                            _this.stTGRelaciones.reload();
                        }
                    }, arreglo);
                break;
        }
    };

    //sera

    this.CargarElementosARelacionarIniciales = function () {
        if (_this.objelemento) {
            _this.objelemento.destroy();
        }

        switch (_this.tipoelementorelacionarinicial) {
            case 0:
                objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarAddObj: true,
                        noUsarAddAct: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: false,
                        noUsarMenuGrid: true,
                        titleWinPrincipal: 'Registro de planes',
                        noUsarPaginado: true,
                    });
                //this.tmp = _this.PostAccionesRelacionarInicial(null,null);

                objCmpPlan.CargarCmpPlan(idelemento = null, tipoelemento = null, parentelemento = 'hijo', _this.PostAccionesRelacionarInicial, _this.PostCancelar);
                break;

            case 1:
                objCmpObjetivo = new Utilidades.Cmp.Cmpgestionarobjetivos(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: false,
                        noUsarMenuGrid: true,
                        closableWinPrincipal: true,
                        titleWinPrincipal: 'Registro de objetivos',
                        noUsarPaginado: true,
                        pRelacionesIniciales: false
                    });
                objCmpObjetivo.CargarCmpObjetivos(idelemento = null, tipoelemento = null, parentelemento = 'hijo', _this.PostAccionesRelacionarInicial);
                break;

            case 2:
                objCmpFip = new Utilidades.Cmp.Cmpgestionarfip(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: false,
                        noUsarMenuGrid: false,
                        titleWinPrincipal: 'Registro de FIPs',
                        closableWinPrincipal: true,
                        noUsarPaginado: true,
                        reordenarHijos: false
                    });
                objCmpFip.CargarCmpFip(idelemento = null, tipoelemento = null, parentelemento = 'hijo', _this.PostAccionesRelacionarInicial, []);
                break;

            case 6:
                objCmpDesviacion = new Utilidades.Cmp.Cmpgestionardesviaciones(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarAdicionar: false,
                        noUsarLimpiar: false,
                        noUsarAyuda: false,
                        noUsarPublicacion: true,
                        noUsarCerrarWinP: true,
                        noUsarPaginado: false,
                        singlemodoSeleccionGridDesviaciones: false,
                        idcmp: 'local',
                        noUsarMenuGrid: false,
                        cargarDatos: true,
                        noUsarSeleccionarWinP: false,
                        maxWinPrincipal: false,
                        titleWinPrincipal: 'Registro de desviaciones',
                        closableWinPrincipal: true,
                        noUsarPaginado: true,
                    });
                objCmpDesviacion.CargarCmpDesviaciones(idelemento, _this.PostAccionesRelacionarInicial);
                break;

            case 50:
                if (_this.WinRelacionesTernarias)
                    _this.WinRelacionesTernarias.destroy();
                objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
                    {
                        noUsarModificar: false,
                        noUsarEliminar: true,
                        noUsarAddObj: true,
                        noUsarAddAct: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: true,
                        noUsarSeleccionarWinP: true,
                        maxWinPrincipal: false,
                        noUsarCbAprob: false,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        singlemodoSeleccionGridPlanes: true,
                        noUsarMenuGrid: true,
                        noUsarAyuda: true,
                        titleWinPrincipal: 'Registro de planes',
                        noUsarPaginado: true
                    });
                _this.pPlanes = objCmpPlan.CargarCmpPlanRelacionesTernarias(idelemento = null, tipoelemento = null, parentelemento = 'hijo');

                objCmpArc = new Utilidades.Cmp.Cmpgestionararc(
                    {
                        noUsarModificar: true,
                        noUsarEliminar: true,
                        noUsarTributar: true,
                        noUsarActivar: true,
                        noUsarDesactivar: true,
                        noUsarCerrarWinP: true,
                        noUsarSeleccionarWinP: true,
                        maxWinPrincipal: false,
                        noUsarCbAprob: true,
                        noUsarGestObser: true,
                        noMostrarColumObser: true,
                        activas: 1,
                        noUsarMenuGrid: false,
                        noUsarAyuda: true,
                        noUsarVer: false,
                        noUsarPaginado: true
                    });
                _this.pARC = objCmpArc.CargarCmpArcRelacionesTernarias(idelemento, tipoelemento, parentelemento);

                this.btnSeleccionar = new Ext.Button({
                    handler: function () {
                        _this.CrearRelacionesTernariasIniciales(objCmpPlan, objCmpArc);
                    },
                    disabled: true,
                    text: 'Seleccionar',
                    cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                    iconCls: 'seleccion',
                    tooltip: 'Relacionar elemento(s) seleccionado(s)'
                });

                _this.WinRelacionesTernarias = new Ext.Window({
                    //layout: 'border',
                    closable: true,
                    graggable: true,
                    constrain: true,
                    modal: true,
                    //width: 1000,
                    //height: 510,
                    //items: [_this.pPlanes, _this.pARC],
                    maximized: true,
                    items: [
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: 0.5,
                                    items: [_this.pPlanes]
                                }, {
                                    columnWidth: 0.5,
                                    items: [_this.pARC]
                                }
                            ]
                        }
                    ],
                    keys: [{
                        key: Ext.EventObject.ENTER,
                        fn: function () {
                            _this.CrearRelacionesTernariasIniciales(objCmpPlan, objCmpArc);
                        },
                        scope: this
                    }],
                    buttons: [
                        {
                            text: 'Cerrar',
                            tooltip: 'Cerrar ventana',
                            iconCls: 'cerrar',
                            handler: function () {
                                _this.WinRelacionesTernarias.destroy();
                            }
                        },
                        _this.btnSeleccionar
                    ],
                    listeners: {
                        beforedestroy: function () {
                            _this.cbrelacionadoconinicial.clearValue();
                            _this.btnRelacionarIniciales.disable();
                        },
                        beforeshow: function (w) {
                            _this.pPlanes.setHeight(w.el.dom.offsetHeight - 70);
                            _this.pARC.setHeight(w.el.dom.offsetHeight - 70);
                            _this.pPlanes.doLayout();
                            _this.pARC.doLayout();
                        }
                    }
                });
                var planes = _this.pPlanes.findById('TGCmpPlan').getSelectionModel();
                var arc = _this.pARC.findById('TGCmpArc').getSelectionModel();
                planes.on('selectionchange', function () {
                    if (planes.hasSelection() && arc.hasSelection())
                        _this.btnSeleccionar.enable();
                    else
                        _this.btnSeleccionar.disable();
                });
                arc.on('selectionchange', function () {
                    if (planes.hasSelection() && arc.hasSelection())
                        _this.btnSeleccionar.enable();
                    else
                        _this.btnSeleccionar.disable();
                });
                _this.WinRelacionesTernarias.show();
                break;
        }
    };

    this.PostAccionesRelacionar = function (arrayelementosrelacionados, win) {


        var msg = 'La relación ha sido adicionada satisfactoriamente.';
        _this.BarraProgreso.show('Relacionando elementos');
        if (_this.estamodificandoelemento == 1) {
            _this.arrayelementosrelacionados = [];
        }
        var elemento = {};
        var relacionesexistentes = _this.stTGRelaciones.getRange();
        var relacionagregada = 0;

        for (var i = 0; i < arrayelementosrelacionados.length; i++) {
            existerelacion = 0;
            idrelacion = arrayelementosrelacionados[i].idelemento;
            if (_this.estamodificandoelemento == 1) {
                idrelacion = _this.idelemento + arrayelementosrelacionados[i].idelemento;
            }
            if (relacionesexistentes.length > 0) {
                for (var j = 0; j < relacionesexistentes.length; j++) {
                    if (idrelacion == relacionesexistentes[j].data.idrelacion) {
                        existerelacion = 1;
                    }
                }
            }
            if (existerelacion == 0) {
                relacionagregada = 1;
                idplan = null;
                idarc = null;
                idobjetivo = null;
                idfip = null;
                iddesviacion = null;
                idactividad = null;
                origen = null;

                idproyecto = null;
                idhito = null;
                idtarea = null;
                switch (_this.tipoelementorelacionar) {
                    case 0://-plan
                        idplan = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 1://-objetivo
                        idobjetivo = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 2://-FIP
                        idfip = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 6://-Desviación
                        iddesviacion = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 7://-Dependencia total
                        origen = 6;
                        idactividad = arrayelementosrelacionados[i].idelemento;
                        if (arrayelementosrelacionados[i].plantilla == '1') {
                            arrayelementosrelacionados[i].tipoelemento = arrayelementosrelacionados[i].tipoelemento + 0;
                        }
                        break;
                    case 8://-Dependencia porcentual
                        origen = 7;
                        idactividad = arrayelementosrelacionados[i].idelemento;
                        if (arrayelementosrelacionados[i].plantilla == '1') {
                            arrayelementosrelacionados[i].tipoelemento = arrayelementosrelacionados[i].tipoelemento + 0;
                        }
                        break;
                    case 9://-Dependencia puerta abierta
                        origen = 8;
                        idactividad = arrayelementosrelacionados[i].idelemento;
                        if (arrayelementosrelacionados[i].plantilla == '1') {
                            arrayelementosrelacionados[i].tipoelemento = arrayelementosrelacionados[i].tipoelemento + 0;
                        }
                        break;
                    case 10://-tarea
                        idtarea = arrayelementosrelacionados[i].idelemento;
                        if (arrayelementosrelacionados[i].plantilla == '1') {
                            arrayelementosrelacionados[i].tipoelemento = arrayelementosrelacionados[i].tipoelemento + 0;
                        }
                        break;

                    case 11://-proyecto
                        idproyecto = arrayelementosrelacionados[i].idelemento;
                        if (arrayelementosrelacionados[i].plantilla == '1') {
                            arrayelementosrelacionados[i].tipoelemento = arrayelementosrelacionados[i].tipoelemento + 0;
                        }
                        break;
                    case 12://-hito
                        idhito = arrayelementosrelacionados[i].idelemento;
                        if (arrayelementosrelacionados[i].plantilla == '1') {
                            arrayelementosrelacionados[i].tipoelemento = arrayelementosrelacionados[i].tipoelemento + 0;
                        }
                        break;
                }

                elemento = {
                    idrelacion: idrelacion,
                    idplan: idplan,
                    idobjetivo: idobjetivo,
                    idfip: idfip,
                    idarc: idarc,
                    origen: origen,
                    iddesviacion: iddesviacion,
                    idactividad: idactividad,
                    idtarea: idtarea,
                    idproyecto: idproyecto,
                    idhito: idhito,
                    tipoelemento: arrayelementosrelacionados[i].tipoelemento,
                    denominacion: arrayelementosrelacionados[i].denominacion + '*' + arrayelementosrelacionados[i].tipoelemento,
                    autorelemento: arrayelementosrelacionados[i].autorelemento,
                    porcientoinicio: arrayelementosrelacionados[i].porcientoinicio,
                    idautorelemento: (arrayelementosrelacionados[i].idautor != null) ? arrayelementosrelacionados[i].idautor : arrayelementosrelacionados[i].idautorelemento,
                    autorrelacion: window.perfil.usuario,
                    eliminar: 1
                };
                _this.arrayelementosrelacionados.push(elemento);
            }
        }
        if (relacionagregada == 1) {
            if (_this.estamodificandoelemento == 0) {
                _this.stTGRelaciones.removeAll();
                if (_this.tipoelementorelacionar == 50) {
                    _this.CargarRelacionesClientesTernarias();
                } else {
                    _this.CargarRelacionesCliente();
                }
                win.hide();
                if (arrayelementosrelacionados.length > 1) {
                    msg = 'Las relaciones han sido adicionadas satisfactoriamente.';
                }
                mostrarMensaje(1, msg);
                _this.cbrelacionadocon.clearValue();
            } else {
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmprelaciones/adicionarelacionessuperiores',
                    params: {
                        arrayelementosrelacionados: Ext.encode(_this.arrayelementosrelacionados),
                        idelemento: _this.idelemento,
                        tipoelemento: _this.tipoelemento
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (_this.arrayelementosrelacionados.length == 1) {
                            msj = 'El elemento al cual usted quiere tributar ya no se encuentra en los registros.';
                        } else {
                            msj = 'Los elementos a los cuales usted quiere tributar ya no se encuentran en los registros.';
                        }
                        msj = 'El o los elementos al cual usted quiere tributar ya no se encuentra(n) en los registros.';
                        icono = 3;
                        if (responseData.mensaje == 1) {
                            if (_this.arrayelementosrelacionados.length == 1) {
                                msj = 'La relación ha sido adicionada satisfactoriamente.';
                            } else {
                                msj = 'Las relaciones han sido adicionadas satisfactoriamente.';
                            }
                            icono = 1;
                            _this.cbrelacionadocon.reset();
                        }
                        if (responseData.mensaje == 2) {
                            msj = 'Algunas relaciones se crearon satisfactoriamente y otras no debido a que ya exist&iacute;an.';
                            icono = 1;
                            _this.cbrelacionadocon.reset();
                        }
                        if (responseData.mensaje == 3) {
                            if (_this.arrayelementosrelacionados.length > 1) {
                                msj = 'Ya existen estas relaciones. Por favor rectifique.';
                            } else {
                                msj = 'Ya existe esta relación. Por favor rectifique.';
                            }

                            icono = 3;
                        }
                        if (responseData.mensaje == 0) {
                            msj = 'El elemento sobre el cual usted esta trabajando ya no existe en los registros.';
                            icono = 3;
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, msj);
                            if (responseData.mensaje != 4 && responseData.mensaje != 0) {
                                win.hide();
                                _this.stTGRelaciones.removeAll();
                                _this.stTGRelaciones.reload({});
                            }
                            if (responseData.mensaje == 0) {
                                win.hide();
                                _this.DestruirComExtContenedor();
                                _this.PostAccionesFalloCritico(2, 'adicionarrelacion');
                            }
                            _this.cbrelacionadocon.clearValue();
                        } else {
                            mostrarMensaje(icono, msj, function () {
                                if (responseData.mensaje != 4 && responseData.mensaje != 0) {
                                    win.hide();
                                    _this.stTGRelaciones.removeAll();
                                    _this.stTGRelaciones.reload({});
                                }
                                if (responseData.mensaje == 0) {
                                    win.hide();
                                    _this.DestruirComExtContenedor();
                                    _this.PostAccionesFalloCritico(2, 'adicionarrelacion');
                                }
                                _this.cbrelacionadocon.clearValue();
                            });
                        }
                    }
                });
            }
        }
        if (relacionagregada == 0) {
            _this.BarraProgreso.hide();
            win.hide();
        }
        _this.ActualizarEstadoBarraHerramientas();
    };

    this.EliminarRelaciones = function (PostAccionesFalloCritico, DestruirComExtContenedor) {
        if (_this.arrayrelacionesseleccionadas.length > 1) {
            msg = '¿Est&aacute; seguro que quiere eliminar las relaciones seleccionadas?';
            msgmask = 'Eliminando relaciones';
            var msje = 'Las relaciones han sido eliminadas satisfactoriamente.';
        } else {
            msg = '¿Est&aacute; seguro que quiere eliminar la relación seleccionada?';
            msgmask = 'Eliminando relación';
            msje = 'La relación ha sido eliminada satisfactoriamente.';
        }
        mostrarMensaje(2, msg, elimina);

        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(msgmask);
                if (_this.estamodificandoelemento == 0) {
                    var index;
                    for (var i = 0; i < _this.arrayidrelacion.length; i++) {
                        for (var j = 0; j < _this.arrayelementosrelacionados.length; j++) {
                            if (_this.arrayidrelacion[i] == _this.arrayelementosrelacionados[j].idrelacion) {
                                index = j;
                                _this.arrayelementosrelacionados.splice(index, 1);
                            }
                        }
                    }
                    _this.stTGRelaciones.removeAll();
                    _this.CargarRelacionesCliente();
                    _this.BarraProgreso.hide();
                    mostrarMensaje(1, msje);
                    _this.ActualizarEstadoBarraHerramientas();
                } else {
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmprelaciones/eliminarrelacionesuperiores',
                        params: {
                            arrayrelacionesseleccionadas: Ext.encode(_this.arrayrelacionesseleccionadas),
                            idelemento: _this.idelemento,
                            tipoelemento: _this.tipoelemento
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            msj = 'La relaci&oacute;n que usted quiere eliminar ya no se encuentra en los registros.';
                            icono = 3;
                            if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                                if (_this.arrayrelacionesseleccionadas.length > 1)
                                    msj = 'Las relaciones han sido eliminadas satisfactoriamente.';
                                else
                                    msj = 'La relación ha sido eliminada satisfactoriamente.';
                                icono = 1;
                            }
                            if (responseData.mensaje == 0) {
                                msj = 'El ARC sobre el cual usted esta trabajando ya no existe en los registros. No se pueden efectuar operaciones sobre dicha ARC.';
                                icono = 3;
                            }
                            if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                                mostrarMensaje(1, msj);
                                if (responseData.mensaje != 0) {
                                    _this.stTGRelaciones.removeAll();
                                    _this.stTGRelaciones.reload({});
                                    _this.ActualizarEstadoBarraHerramientas();
                                } else {
                                    DestruirComExtContenedor();
                                    PostAccionesFalloCritico(2, 'eliminarrelacion');
                                }
                            } else {
                                mostrarMensaje(icono, msj, function () {
                                    if (responseData.mensaje != 0) {
                                        _this.stTGRelaciones.removeAll();
                                        _this.stTGRelaciones.reload({});
                                        _this.ActualizarEstadoBarraHerramientas();
                                    } else {
                                        DestruirComExtContenedor();
                                        PostAccionesFalloCritico(2, 'eliminarrelacion');
                                    }
                                });
                            }
                        }
                    });
                }
            } else {
                if (_this.smTGRelaciones.hasSelection()) {
                    _this.smTGRelaciones.clearSelections();
                    _this.TGRelaciones.getView().refresh(true);
                }
            }
        }
    };

    this.EliminarRelacionesIniciales = function () {
        var msg = '¿Está seguro que quiere eliminar la relación seleccionada?';
        var msgmak = 'Eliminando relación';
        var msgfin = 'La relación ha sido eliminada satisfactoriamente.';

        if (_this.arrayidrelacioninicial.length > 1) {
            msg = '¿Está seguro que quiere eliminar las relaciones seleccionadas?';
            msgmak = 'Eliminando relaciones';
            msgfin = 'Las relaciones han sido eliminadas satisfactoriamente.';
        }
        mostrarMensaje(2, msg, elimina);

        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                _this.BarraProgreso.show(msgmak);
                var array = [];
                array = (_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial.length : _this.arrayelementosrelacionadosinicialTibNo.length;
                var index;
                for (var i = 0; i < _this.arrayidrelacioninicial.length; i++) {
                    for (var j = 0; j < ((_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial.length : _this.arrayelementosrelacionadosinicialTibNo.length); j++) {
                        if (_this.arrayidrelacioninicial[i] == ((_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial[j].idrelacion : _this.arrayelementosrelacionadosinicialTibNo[j].idrelacion)) {

                            index = j;
                            (_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial.splice(index, 1) : _this.arrayelementosrelacionadosinicialTibNo.splice(index, 1);
                            //_this.arrayelementosrelacionadosinicial.splice(index, 1);
                        }
                    }
                }
                (_this.opcionTributar == 1) ? _this.stTGRelacionesInicial.removeAll() : _this.stTGRelacionesInicialNoTrib.removeAll();
                _this.CargarRelacionesClienteIniciales();
                _this.BarraProgreso.hide();
                mostrarMensaje(1, msgfin);
                _this.ActualizarEstadoBarraHerramientasIniciales();
                _this.PostAccionesSeleccionarInicial();
            }
        }
    };

    this.PostCancelar = function (clearRelaciones) {
        if (_this.cbrelacionadocon)
            _this.cbrelacionadocon.clearValue();
        if (clearRelaciones)
            _this.stTGRelaciones.removeAll();
    };

    this.PostAccionesRelacionarInicial = function (arrayelementosrelacionados, win) {
        _this.BarraProgreso.show('Seleccionando elementos');
        var elemento = {};
        var msg = 'La relación  ha sido adicionada satisfactoriamente.';
        var relacionesexistentes = (_this.opcionTributar == 1) ? _this.stTGRelacionesInicial.getRange() : _this.stTGRelacionesInicialNoTrib.getRange();
        var relacionagregada = 0;
        for (var i = 0; i < arrayelementosrelacionados.length; i++) {
            existerelacion = 0;
            idrelacion = arrayelementosrelacionados[i].idelemento;
            if (relacionesexistentes.length > 0) {
                for (var j = 0; j < relacionesexistentes.length; j++) {
                    if (idrelacion == relacionesexistentes[j].data.idrelacion) {
                        existerelacion = 1;
                    }
                }
            }
            if (existerelacion == 0) {
                relacionagregada = 1;
                idplan = null;
                idarc = null;
                idobjetivo = null;
                idfip = null;
                iddesviacion = null;
                switch (_this.tipoelementorelacionarinicial) {
                    case 0:
                        idplan = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 1:
                        idobjetivo = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 2:
                        idfip = arrayelementosrelacionados[i].idelemento;
                        break;
                    case 6:
                        iddesviacion = arrayelementosrelacionados[i].idelemento;
                        break;
                }
                elemento = {
                    idrelacion: idrelacion,
                    idplan: idplan,
                    idobjetivo: idobjetivo,
                    idfip: idfip,
                    idarc: idarc,
                    iddesviacion: iddesviacion,
                    tipoelemento: arrayelementosrelacionados[i].tipoelemento,
                    denominacion: arrayelementosrelacionados[i].denominacion + '*' + arrayelementosrelacionados[i].tipoelemento,
                    autorelemento: arrayelementosrelacionados[i].autorelemento,
                    idautorelemento: arrayelementosrelacionados[i].idautor,
                    autorrelacion: window.perfil.usuario,
                    eliminar: 1
                };
                (_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial.push(elemento) : _this.arrayelementosrelacionadosinicialTibNo.push(elemento);
            }
        }
        if (relacionagregada == 1) {
            (_this.opcionTributar == 1) ? _this.stTGRelacionesInicial.removeAll() : _this.stTGRelacionesInicialNoTrib.removeAll();
            if (_this.tipoelementorelacionarinicial == 50) {
                _this.CargarRelacionesClientesTernarias();
            } else {
                _this.CargarRelacionesClienteIniciales();
            }
            win.hide();
            if (arrayelementosrelacionados.length > 1) {
                msg = 'Las relaciones han sido adicionadas satisfactoriamente.'
            }
            mostrarMensaje(1, msg);
            _this.PostAccionesSeleccionarInicial();
        }
        if (relacionagregada == 0) {
            _this.BarraProgreso.hide();
            win.hide();
        }
        if (_this.cbrelacionadocon)
            _this.cbrelacionadocon.clearValue();
    };

    this.CargarRelacionesCliente = function () {
        var arraydatos = [];
        arraydatos['total'] = _this.arrayelementosrelacionados.length;
        arraydatos['campos'] = _this.arrayelementosrelacionados;
        _this.stTGRelaciones.loadData(arraydatos);
        _this.BarraProgreso.hide();
    };

    this.CargarRelacionesClienteIniciales = function () {
        var arraydatos = [];
        arraydatos['total'] = (_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial.length : _this.arrayelementosrelacionadosinicialTibNo.length;
        arraydatos['campos'] = (_this.opcionTributar == 1) ? _this.arrayelementosrelacionadosinicial : _this.arrayelementosrelacionadosinicialTibNo;
        (_this.opcionTributar == 1) ? _this.stTGRelacionesInicial.loadData(arraydatos) : _this.stTGRelacionesInicialNoTrib.loadData(arraydatos);
        _this.BarraProgreso.hide();
    };

    this.ObtenerElementosRelacionados = function () {
        var arrayelementosrelacionados = [];
        var elementosrelacionados = _this.stTGRelaciones.getRange();
        if (elementosrelacionados.length > 0) {
            for (var i = 0; i < elementosrelacionados.length; i++) {
                var elementorelacionado = {};
                elementorelacionado = {
                    idplan: elementosrelacionados[i].data.idplan,
                    idarc: elementosrelacionados[i].data.idarc,
                    idobjetivo: elementosrelacionados[i].data.idobjetivo,
                    idfip: elementosrelacionados[i].data.idfip,
                    iddesviacion: elementosrelacionados[i].data.iddesviacion,
                    idactividad: elementosrelacionados[i].data.idactividad,
                    tipoelemento: elementosrelacionados[i].data.tipoelemento,
                    origen: elementosrelacionados[i].data.origen,
                    idautorelemento: elementosrelacionados[i].data.idautor,
                    porcientoinicio: elementosrelacionados[i].data.porcientoinicio
                };
                arrayelementosrelacionados.push(elementorelacionado);
            }
        }
        return arrayelementosrelacionados;
    };

    this.ObtenerIDElementosRelacionados = function () {
        var arrayelementosrelacionados = [];
        var elementosrelacionados = _this.stTGRelaciones.getRange();
        if (elementosrelacionados.length > 0) {
            for (var i = 0; i < elementosrelacionados.length; i++) {
                arrayelementosrelacionados.push(elementosrelacionados[i].data.idrelacion);
            }
        }
        return arrayelementosrelacionados;
    };

    this.obtenerOpcionTributar = function () {
        return _this.opcionTributar;
    };

    this.ObtenerElementosRelacionadosIniciales = function () {
        var arrayelementosrelacionados = [];
        var elementosrelacionados = [];

        var store = (_this.opcionTributar == 1) ? _this.stTGRelacionesInicial : _this.stTGRelacionesInicialNoTrib;

        if (store)
            elementosrelacionados = store.getRange();
        if (elementosrelacionados.length > 0) {
            for (var i = 0; i < elementosrelacionados.length; i++) {
                var elementorelacionado = {};
                elementorelacionado = {
                    idplan: elementosrelacionados[i].data.idplan,
                    idarc: elementosrelacionados[i].data.idarc,
                    idobjetivo: elementosrelacionados[i].data.idobjetivo,
                    idfip: elementosrelacionados[i].data.idfip,
                    iddesviacion: elementosrelacionados[i].data.iddesviacion,
                    tipoelemento: elementosrelacionados[i].data.tipoelemento,
                    idautorelemento: elementosrelacionados[i].data.idautor
                };
                arrayelementosrelacionados.push(elementorelacionado);
            }
        }
        return arrayelementosrelacionados;
    };

    this.ReiniciarArrayElementosRelacionados = function () {
        _this.arrayelementosrelacionados = [];
    };

    this.CrearRelacionesTernarias = function (objCmpPlan, objCmpArc) {

        _this.ReiniciarArrayElementosRelacionados();
        _this.BarraProgreso.show('Relacionando elementos');
        var elemento = {};
        var relacionesexistentes = _this.stTGRelaciones.getRange();
        var relacionagregada = 0;
        var arrayelementoseleccionados = [];
        var arrayarcseleccionadas = [];
        var arrayplaneseleciconados = objCmpPlan.arrayplanesseleccionados;
        var arrayarcseleccionadas = objCmpArc.arrayarcseleccionadas;
        var totalplaneseleciocnados = arrayplaneseleciconados.length;
        var totalarcseleccionadas = arrayarcseleccionadas.length;
        if (totalplaneseleciocnados > 0 && totalarcseleccionadas > 0) {
            for (var i = 0; i < totalplaneseleciocnados; i++) {
                for (var j = 0; j < totalarcseleccionadas; j++) {
                    existerelacion = 0;
                    idrelacion = arrayplaneseleciconados[i].idelemento + arrayarcseleccionadas[j].idelemento;
                    if (_this.estamodificandoelemento == 1) {
                        idrelacion = _this.idelemento + arrayplaneseleciconados[i].idelemento + arrayarcseleccionadas[j].idelemento;
                    }
                    if (relacionesexistentes.length > 0) {
                        for (var k = 0; k < relacionesexistentes.length; k++) {
                            if (idrelacion == relacionesexistentes[k].data.idrelacion) {
                                existerelacion = 1;
                            }
                        }
                    }
                    if (existerelacion == 0) {
                        relacionagregada = 1;
                        idplan = arrayplaneseleciconados[i].idelemento;
                        idarc = arrayarcseleccionadas[j].idelemento;
                        idobjetivo = null;
                        idfip = null;
                        elemento = {
                            idrelacion: idrelacion,
                            idplan: idplan,
                            idobjetivo: idobjetivo,
                            idfip: idfip,
                            idarc: idarc,
                            tipoelemento: 50,
                            denominacion: arrayplaneseleciconados[i].denominacion + '*' + '50' + '*' + arrayarcseleccionadas[j].denominacion,
                            autorelemento: arrayplaneseleciconados[i].autorelemento + '*' + '50' + '*' + arrayarcseleccionadas[j].autorelemento,
                            autorrelacion: window.perfil.usuario,
                            eliminar: 1
                        };
                        _this.arrayelementosrelacionados.push(elemento);
                    }
                }
            }
            if (relacionagregada == 1) {
                if (_this.estamodificandoelemento == 0) {
                    _this.stTGRelaciones.removeAll();
                    _this.CargarRelacionesCliente();
                    _this.WinRelacionesTernarias.destroy();
                    mostrarMensaje(1, 'La relación ha sido adicionada satisfactoriamente.');
                    _this.cbrelacionadocon.reset();
                } else {
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmprelaciones/adicionarelacionessuperiores',
                        params: {
                            arrayelementosrelacionados: Ext.encode(_this.arrayelementosrelacionados),
                            idelemento: _this.idelemento,
                            tipoelemento: _this.tipoelemento
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);

                            if (_this.arrayelementosrelacionados.length == 1) {
                                msj = 'El elemento al cual usted quiere tributar ya no se encuentra en los registros.';
                            } else {
                                msj = 'Los elementos a los cuales usted quiere tributar ya no se encuentran en los registros.';
                            }
                            icono = 3;
                            if (responseData.mensaje == 1) {
                                msj = 'La relación ha sido adicionada satisfactoriamente.';
                                icono = 1;
                                _this.ReiniciarArrayElementosRelacionados();
                                _this.cbrelacionadocon.reset();
                            }
                            if (responseData.mensaje == 2) {
                                msj = 'La relación ha sido adicionada satisfactoriamente.';
                                icono = 1;
                                _this.ReiniciarArrayElementosRelacionados();
                                _this.cbrelacionadocon.reset();
                            }
                            if (responseData.mensaje == 3) {
                                if (_this.arrayelementosrelacionados.length == 1) {
                                    msj = 'Ya existe esta relación. Por favor rectifique.';
                                } else {
                                    msj = 'Ya existen estas relaciones. Por favor rectifique.';
                                }
                                icono = 3;
                            }
                            if (responseData.mensaje == 0) {
                                msj = 'El elemento sobre el cual usted esta trabajando ya no existe en los registros.';
                                icono = 3;
                                _this.cbrelacionadocon.reset();
                            }
                            if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                                mostrarMensaje(1, msj);
                                if (responseData.mensaje != 4 && responseData.mensaje != 0) {
                                    _this.WinRelacionesTernarias.destroy();
                                    _this.stTGRelaciones.removeAll();
                                    _this.stTGRelaciones.reload({});
                                    _this.cbrelacionadocon.reset();
                                }
                                if (responseData.mensaje == 0) {
                                    _this.WinRelacionesTernarias.destroy();
                                    _this.DestruirComExtContenedor();
                                    _this.PostAccionesFalloCritico(2, 'adicionarrelacion');
                                }
                            } else {
                                mostrarMensaje(icono, msj, function () {
                                    if (responseData.mensaje != 4 && responseData.mensaje != 0) {
                                        _this.WinRelacionesTernarias.destroy();
                                        _this.stTGRelaciones.removeAll();
                                        _this.stTGRelaciones.reload({});
                                        _this.cbrelacionadocon.reset();
                                    }
                                    if (responseData.mensaje == 0) {
                                        _this.WinRelacionesTernarias.destroy();
                                        _this.DestruirComExtContenedor();
                                        _this.PostAccionesFalloCritico(2, 'adicionarrelacion');
                                    }
                                });
                            }
                        }
                    });
                }
            }
            if (relacionagregada == 0) {
                _this.BarraProgreso.hide();
                _this.WinRelacionesTernarias.destroy();
            }
            _this.ActualizarEstadoBarraHerramientas();
        } else {
            mostrarMensaje(1, 'Para poder relacionar debe al menos seleccionar un plan y una ARC.');
        }
    };

    this.CrearRelacionesTernariasIniciales = function (objCmpPlan, objCmpArc) {
        _this.BarraProgreso.show('Seleccionando elementos');
        var elemento = {};
        var relacionesexistentes = _this.stTGRelacionesInicial.getRange();
        var relacionagregada = 0;
        var arrayelementoseleccionados = [];
        var arrayplaneseleciconados = objCmpPlan.arrayplanesseleccionados;
        var arrayarcseleccionadas = objCmpArc.arrayarcseleccionadas;
        var totalplaneseleciocnados = arrayplaneseleciconados.length;
        var totalarcseleccionadas = arrayarcseleccionadas.length;
        if (totalplaneseleciocnados > 0 && totalarcseleccionadas > 0) {
            for (var i = 0; i < totalplaneseleciocnados; i++) {
                for (var j = 0; j < totalarcseleccionadas; j++) {
                    existerelacion = 0;
                    idrelacion = arrayplaneseleciconados[i].idelemento + arrayarcseleccionadas[j].idelemento;
                    if (relacionesexistentes.length > 0) {
                        for (var k = 0; k < relacionesexistentes.length; k++) {
                            if (idrelacion == relacionesexistentes[k].data.idrelacion) {
                                existerelacion = 1;
                            }
                        }
                    }
                    if (existerelacion == 0) {
                        relacionagregada = 1;
                        idplan = arrayplaneseleciconados[i].idelemento;
                        idarc = arrayarcseleccionadas[j].idelemento;
                        idobjetivo = null;
                        idfip = null;
                        elemento = {
                            idrelacion: idrelacion,
                            idplan: idplan,
                            idobjetivo: idobjetivo,
                            idfip: idfip,
                            idarc: idarc,
                            tipoelemento: 50,
                            denominacion: arrayplaneseleciconados[i].denominacion + '*' + '50' + '*' + arrayarcseleccionadas[j].denominacion,
                            autorelemento: arrayplaneseleciconados[i].autorelemento + '*' + '50' + '*' + arrayarcseleccionadas[j].autorelemento,
                            autorrelacion: window.perfil.usuario,
                            eliminar: 1
                        };
                        _this.arrayelementosrelacionadosinicial.push(elemento);
                    }
                }
            }
            if (relacionagregada == 1) {
                _this.stTGRelacionesInicial.removeAll();
                _this.CargarRelacionesClienteIniciales();
                _this.WinRelacionesTernarias.destroy();
                mostrarMensaje(1, 'La relación ha sido adicionada satisfactoriamente.');
                _this.PostAccionesSeleccionarInicial();
            }
            if (relacionagregada == 0) {
                _this.BarraProgreso.hide();
                _this.WinRelacionesTernarias.destroy();
            }
        } else {
            mostrarMensaje(1, 'Para poder relacionar debe al menos seleccionar un plan y una ARC.');
        }
    };

    this.AdicionarRelacionesMultiples = function () {
        var procede = 1;
        var msg = 'La relación ha sido adicionada satisfactoriamente.';
        var arrayrelaciones = _this.ObtenerElementosRelacionados();
        var totalrelaciones = arrayrelaciones.length;
        if (totalrelaciones < 1) {
            procede = 0;
        }
        if (procede == 1) {
            _this.BarraProgreso.show('Relacionando elementos');
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmprelaciones/adicionarrelacionesmultiples',
                params: {
                    tipoelemento: _this.tipoelemento,
                    arrayidelementoshijos: Ext.encode(_this.arrayidelementos),
                    arrayelementosrelacionados: Ext.encode(arrayrelaciones)
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        if (totalrelaciones.length > 1)
                            msg = 'Las relaciones han sido adicionadas satisfactoriamente.';
                        mostrarMensaje(1, msg);
                        _this.DestruirComExtContenedor();
                        _this.PostAccionesFalloCritico();
                    }
                    if (responseData.mensaje == 0) {
                        mostrarMensaje(1, 'Los elementos que usted quiere que tributen a otro(s) ya no se encuentran en los registros.', function () {
                            _this.DestruirComExtContenedor();
                            _this.PostAccionesFalloCritico();
                        });
                    }
                    if (responseData.mensaje == 2) {
                        mostrarMensaje(1, 'Algunas relaciones se crearon satisfactoriamente y otras no debido a que ya exist&iacute;an.');
                        _this.DestruirComExtContenedor();
                        _this.PostAccionesFalloCritico();
                    }
                    if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'Las relaciones no se crearon debido a que ya exist&iacute;an.');
                        _this.DestruirComExtContenedor();
                        _this.PostAccionesFalloCritico();
                    }


                }
            });
        } else {
            mostrarMensaje(1, 'Para poder relacionar debe existir al menos una relaci&oacute;n.');
        }
    };

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElementoDenominacion(valor) {
        if (valor) {
            var cadena = valor.split("*");
            switch (cadena[1]) {
                case '0':
                    return '<span class="icondistra-folder sipac-azul">' + ' ' + cadena[0] + '</span>';
                    break;
                case '3':
                    return '<span class="icondistra-actividades sipac-azul">' + ' ' + cadena[0] + '</span>';
                    break;
                case '5':
                    return '<span class="icondistra-gestionardocumentosporsubsistema sipac-azul">' + ' ' + cadena[0] + '</span>';
                    break;
                case '50':
                    return '<span class="icondistra-folder sipac-azul">' + ' ' + cadena[0] + '<br>|---&#32;</span><span class="icondistra-gestionardocumentosporsubsistema sipac-azul">' + ' ' + cadena[2] + '</span>';
                    break;
                case '1':
                    return '<span class="icondistra-archivo sipac-azul">' + ' ' + cadena[0] + '</span>';
                    break;
                case '2':
                    return '<span class="icondistra-ficha sipac-azul">' + ' ' + cadena[0] + '</span>';
                    break;
                case '6':
                    return '<span class="icondistra-conflicto sipac-azul">' + ' ' + cadena[0] + '</span>';
                    break;
            }
        }
    }

    function MostrarImagenTipoElementoAutor(valor) {
        if (valor) {
            var cadena = valor.split("*");
            switch (cadena[1]) {
                case '50':
                    return '<span>' + ' ' + cadena[0] + '<br><br>' + ' ' + cadena[2] + '</span>';
                    break;
                default:
                    return '<span>' + ' ' + cadena[0] + '<span>';
            }
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return ' <center><span class="icondistra-validaryaceptar sipac-verde"></center></span>';
        }
    }

    function MostrarTipoDependencia(val, some, record) {
        if (val == 6) {
            return 'Total';
        }
        if (val == 7) {
            return 'Porcentual';
        }
        if (val == 8) {
            return 'Puerta abierta';
        }
    }

    this.ResetearRelaciones = function () {
        _this.arrayelementosrelacionados = [];
        _this.arrayelementosrelacionadosinicial = [];
        _this.arrayelementosrelacionadosinicialTibNo = [];
        _this.stTGRelaciones.removeAll();
    }

};
