Utilidades.Cmp.Cmpgenerardependencias = function (opcionesConfig) {

    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.idtarea = 0;
    this.arrayEjecutadosAdicionados = [];
    this.arrayEjecutadosEliminados = [];
    this.permitirActualizarValorreal = false;
    this.idtareaseleccionada;

    this.crearWinGenerarDependencia = function (idproyecto, objestructura) {

        this.btnGuardar = new Ext.Button({
            handler: function () {
                _this.guardarDatos();
            },
            text: 'Guardar',
            //disabled: true,
            iconCls: 'guardar',
            tooltip: 'Guardar ejecución'
        });

        this.stCmbClave = new Ext.data.Store({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerTareasDadoProyecto',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                    st.baseParams.idtarea = _this.idtareaseleccionada;
                }
            },
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idelemento',
                root: "campos"
            }, [{
                name: 'idelemento'
            }, {
                name: 'clave'
            }, {
                name: 'checked'
            }])
        });
        //combo categoria del proyecto
        this.cmbClave = new Ext.ux.form.LovCombo({
            //emptyText: 'Seleccione',
            store: _this.stCmbClave,
            hiddenName: 'idelemento',
            valueField: 'clave',
            displayField: 'clave',
            typeAhead: true,
            editable: true,
            triggerAction: 'all',
            disabled: false,
            loadingText: 'Cargando datos',
            mode: 'remote',
            width: '100',
            listeners: {
                expand: function (combo) {
                    _this.stCmbClave.reload();
                },
                select: function (combo, record, index) {
                }/*,
                 beforeselect: function(combo, record, index) {
                 this.valueField = 'clave';
                 },
                 blur: function() {
                 return false;
                 this.valueField = 'idelemento';
                 this.isValid();
                 if (this.getRawValue() != '') {
                 this.clearInvalid();
                 }
                 }*/
            }
        });

        this.reader = new Ext.data.JsonReader({
            id: 'idrelacion',
            root: 'campos',
            totalProperty: 'total'
        }, [
            {
                name: 'idelemento'
            }, {
                name: 'clave'
            }, {
                name: 'denominacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'dependencias'
            }
        ]);

        this.stTGGenerarDependencia = new Ext.data.Store({
            autoLoad: true,
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerTareasDadoProyecto',
            reader: _this.reader,
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idproyecto = idproyecto;
                    st.baseParams.start = (_this.start == null) ? 0 : _this.start;
                },
                load: function (store, record, options) {
                }
            }
        });
        this.smTGGenerarDependencia = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    _this.idtareaseleccionada = record.data.idelemento;
                },
                rowdeselect: function (sm, indiceFila, record) {
                }
            }
        });
        this.pagGenerarDependencia = new Ext.PagingToolbar({
            pageSize: 15,
            width: 810,
            store: _this.stTGGenerarDependencia,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.start = evento.start;
                }
            }
        });
        this.TGGenerarDependencia = new Ext.grid.EditorGridPanel({
            store: _this.stTGGenerarDependencia,
            region: 'south',
            stripeRows: true,
            autoExpandColumn: 'tareasgen',
            border: false,
            height: 300,
            clicksToEdit: 1,
            sm: _this.smTGGenerarDependencia,
            margins: '3 3 3 3',
            loadMask: {
                msg: 'Cargando ejecución...'
            },
            listeners: {
                'beforeedit': function (e) {
                },
                'beforerender': function (e) {
                }
            },
            columns: [_this.smTGGenerarDependencia,
                {
                    header: "Identificador",
                    sortable: true,
                    dataIndex: 'clave',
                    tooltip: 'Identificador'
                }, {
                    header: "Denominación",
                    sortable: true,
                    id: "tareasgen",
                    dataIndex: 'denominacion',
                    tooltip: 'Denominación'/*,
                     renderer: MostrarImagenTipoElemento*/
                }, {
                    header: "Precedencia",
                    width: 150,
                    dataIndex: 'dependencias',
                    sortable: true,
                    //align: 'left',
                    editor: _this.cmbClave,
                    renderer: MostrarDependencias
                }
            ],
            //tbar: [_this.btnAdicionar, '-', _this.btnGuardar, '-', _this.btnEliminar],
            bbar: _this.pagGenerarDependencia
        });

        this.WinGenerarDependencia = new Ext.Window({
            title: 'Generar Precedencia',
            layout: 'fit',
            constrain: true,
            //tbar: [],
            closable: true,
            graggable: false,
            modal: true,
            width: 850,
            height: 550,
            //usarKeymap: true,
            //botonesKeymap: [_this.btnAyuda],
            buttons: [_this.btnGuardar],
            items: _this.TGGenerarDependencia,
            listeners: {
                close: function () {
                }
            }
        });
        _this.WinGenerarDependencia.doLayout();
        _this.WinGenerarDependencia.show();
    };

    function MostrarImagenTipoElemento(valor, m, p) {
        return '<span class="icondistra-tarea sipac-azul">' + ' ' + valor + '</span>';
    }

    function MostrarDependencias(valor, m, p) {
        if (valor != 0)
            return valor;
        else
            return '-';
    }

    function formatDate(value) {
        if (Ext.isDate(value)) {
            return value.format('d/m/Y');
        } else {
            return value;
        }
    }

    this.addFilaEjecutar = function () {
        _this.btnGuardar.enable();
        var arrayrecords = _this.smTareas.getSelections();
        var date = new Date();
        var record = new Ext.data.Record({
            idtarea: arrayrecords[0].data.idelemento,
            fecha: date.format('d/m/Y'),
            cantidad: 0
        });
        _this.stTGEjecucion.add(record);
        _this.arrayEjecutadosAdicionados.push({
            idtarea: arrayrecords[0].data.idelemento,
            fecha: date.format('d/m/Y'),
            cantidad: 0
        });
    };
    this.removeFilaEjecutar = function () {
        _this.btnGuardar.enable();
        var arrayrecords = _this.smTGEjecucion.getSelections();
        for (var i = 0; i < arrayrecords.length; i++) {
            var record = arrayrecords[i];
            _this.arrayEjecutadosEliminados.push({
                idtarea: record.data.idtarea,
                fecha: Ext.isDate(record.data.fecha) ? record.data.fecha.format('d/m/Y') : record.data.fecha,
                cantidad: record.data.cantidad
            });
            _this.stTGEjecucion.remove(record);
        }
    };
    this.getArrayListadoEjecutados = function () {
        var array_ejecutados = [];
        for (var i = 0; i < _this.stTGEjecucion.getCount(); i++) {
            array_ejecutados.push({
                idtarea: _this.stTGEjecucion.getAt(i).data.idtarea,
                fecha: _this.stTGEjecucion.getAt(i).data.fecha,
                cantidad: _this.stTGEjecucion.getAt(i).data.cantidad
            });
        }
        return array_ejecutados;
    };
    this.getArrayListadoEjecutadosModificados = function () {
        var records = _this.stTGGenerarDependencia.getModifiedRecords();
        if (records.length != 0) {
            //console.log(records);
            /*for (var i = 0; i < records.length; i++) {
             var eliminado = false;
             for (var j = 0; j < _this.arrayEjecutadosEliminados.length; j++) {
             if (records[i].data.idtarea == _this.arrayEjecutadosEliminados[j].idtarea &&
             (Ext.isDate(records[i].data.fecha) ? records[i].data.fecha.format('d/m/Y') : records[i].data.fecha) == _this.arrayEjecutadosEliminados[j].fecha)
             eliminado = true;
             break;
             }
             if (!eliminado) {
             _this.arrayEjecutadosAdicionados.push({
             idtarea: records[i].data.idtarea,
             fecha: Ext.isDate(records[i].data.fecha) ? records[i].data.fecha.format('d/m/Y') : records[i].data.fecha,
             cantidad: records[i].data.cantidad
             });
             }
             }
             //console.log(_this.arrayEjecutadosAdicionados);
             return _this.arrayEjecutadosAdicionados;*/
        } else {
            var mensaje = 'No se han realizado cambios en el grid.';
            mostrarMensaje(1, mensaje);
        }
    };
    this.guardarDatos = function () {
        //_this.BarraProgreso.show();
        _this.arrayEjecutadosAdicionados = _this.getArrayListadoEjecutadosModificados();

        /*Ext.Ajax.request({
         url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/guardarEjecutados',
         params: {
         arrayEjecutadosAdicionados: Ext.encode(_this.arrayEjecutadosAdicionados),
         arrayEjecutadosEliminados: Ext.encode(_this.arrayEjecutadosEliminados)
         },
         callback: function(options, success, response) {
         _this.BarraProgreso.hide();
         responseData = Ext.decode(response.responseText);
         if (responseData.mensaje == 1) {
         _this.permitirActualizarValorreal = true;
         var mensajeconfirmacion = 'El(Los) valor(es) ha(n) sido guardado(s) satisfactoriamente.';
         mostrarMensaje(1, mensajeconfirmacion);
         _this.stTGEjecucion.removeAll();
         _this.stTGEjecucion.reload({
         params: {
         idtarea: _this.idtarea
         }
         });
         } else {
         var mensajeconfirmacion = 'El(Los) valor(es) no se ha(n) podido guardar.';
         mostrarMensaje(1, mensajeconfirmacion);
         }
         _this.arrayEjecutadosAdicionados = [];
         _this.arrayEjecutadosEliminados = [];
         }
         });*/
    };

    this.actualizarValorReal = function () {
        var valor_real = 0;
        for (var i = 0; i < _this.stTGEjecucion.getCount(); i++) {
            valor_real = parseFloat(_this.stTGEjecucion.getAt(i).data.cantidad) + parseFloat(valor_real);
        }
        var arrayrecords = _this.smTareas.getSelections();
        var record = arrayrecords[0];
        record.set("valorreal", valor_real);
        record.commit();

        var costo_real = record.data.valorreal * record.data.costo;
        record.set("costoreal", valor_real);
        record.commit();

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/eliminarEjecutados',
            params: {
                idtarea: record.data.idelemento,
                valorreal: valor_real
            },
            callback: function (options, success, response) {
                //_this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    _this.permitirActualizarValorreal = false;
                } else {
                }
            }
        });

    };

};