Ext.ns('PlanifMaterial.CtrlAprob')
PlanifMaterial.CtrlAprob.crudControlAprobaciones = function (opciones) {
    var _this = this;
    var smGpDocumento = opciones.sm;
    _this.myMask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });

    _this.myMaskGuardar = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Por favor espere: Guardando documento de aprobación'
    });
    this.CrearVentanaCrudDefinirContingencia=function(idejercicio){
        _this.btnAceptar = new Ext.Button({
            text: 'Aceptar',
            //  icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            id: 'btnAceptarCtrlDiv',

            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                Guardar();
            }
        });



        _this.btnCancelar = new Ext.Button({
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: ' btnCancelarCtrlDiv',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                 _this.ventanadefinircontingencia.destroy();


            }
        });
        _this.cmdefinircontingencia = new Ext.grid.ColumnModel([{
            header: 'Vía de Adquisición',
            id: 'denominacion',
            dataIndex: 'denominacion',
            sortable: true,
            align: 'left',
            width: 250
        }, {
            header: 'Importe (%)',
            width: 180,
            align: 'left',
            dataIndex: 'porciento',
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: true,
                maxValue:99
            })
        }
        ]);

        _this.stdefinircontingencia =new Ext.data.Store({
           autoLoad:true,
            url: 'cargarviayplanparacontingencia',
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [{
                name: 'denominacion'
            }, {
                name: 'porciento'
            },{
                name: 'idmodelo'
            },{
                name: 'idviaadquisicion'
            }]),
            listeners: {  beforeload: function () {

                _this.stdefinircontingencia.baseParams.idejercicio = idejercicio;
            }
            }
        });





        _this.gpdefinircontingencia = new Ext.grid.EditorGridPanel({
            frame: true,
            id: 'gpdefinircontingencia',
            autoExpandColumn: 'denominacion',
           // plugins: _this.filtrosGpCodigosCtrlDiv,
            store: _this.stdefinircontingencia,
           // clicksToEdit: 2,
            width: 450,
            height: 200,
            margins: '2 2 2 -4',
           // sm: smGpCodigosCtrlDiv,
            listeners: {
                rowcontextmenu: function (g, r, e) {

                },
                afteredit: function (sm) {
                    if(sm.value>0)
                    _this.btnAceptar.enable();
                    else
                    _this.btnAceptar.disable();
                }
            },
            cm: _this.cmdefinircontingencia/*,
            tbar: [_this.btnEliminar, '-', '->', '-', _this.btnLimpiar],
            loadMask: {
                msg: 'Por favor espere...'
            },
            listeners: {
                rowcontextmenu: function (g, r, e) {

                },
                afteredit: function (sm) {

                }
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'paginadoCD',
                store: _this.stdefinircontingencia,
                paramNames: {start: "start", limit: "limit", iddocumentoaprobacion: "iddocumentoaprobacion"},
                listeners: {
                    beforechange: function (pag, params) {
                        params.iddocumentoaprobacion = _this.stGpCodigosCtrlDiv.data.items[0].json.iddocumentoaprobacion;

                    }
                },
                displayInfo: true,
                items: ['-', {xtype: 'tbtext', text: 'Importe Total:'}, {
                    id: "tfImporteTotal",
                    name: 'importetotal',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 90,
                    anchor: '95%'
                }, '-']

            })*/
        });



        function Guardar(){
            var a=_this.stdefinircontingencia.data.items;
            var arreglo=[];

          for(var i=0;i<a.length;i++){
          arreglo[i]=a[i].data;
           }


            Ext.Ajax.request({
                url: 'guardarviayplanparacontingencia',
                params: {
                    data: Ext.encode(arreglo),
                    idejercicio:idejercicio
              },
                callback: function (options, success, response) {
                   var responseData = Ext.decode(response.responseText);
                   mostrarMensaje(1, 'La contingencia ha sido adicionada satisfactoriamente.');
                    _this.ventanadefinircontingencia.destroy();

                  /*  _this.myMaskGuardar.hide();
                    if (responseData == 1) {
                        if (accion == 'Duplicar') {
                            mostrarAccion = 'duplicado';
                        }
                        mostrarMensaje(1, "El documento de aprobación ha sido " + mostrarAccion + " satisfactoriamente.", function () {
                            if (keymap != undefined)
                                keymap.enable();
                            _this.ventanaCrud.destroy();
                        });

                    }
                    store.reload({
                        params: {
                            identidad: idEntidadSeleccionada,
                            start: 0,
                            limit: 20,
                            idejercicio: idejercicio
                        }
                    });*/
                }
            });


        }












        _this.Formdefinircontingencia = new Ext.FormPanel({
            region: 'center',
            labelAlign: 'top',
            width: 500,
            height: 300,
            frame: true,
            items: [_this.gpdefinircontingencia]
        });
      _this.ventanadefinircontingencia = new Ext.Window({
            title: 'Adicionar contingencia',
            id: 'ventanaAddAutomatico',
            layout: 'fit',
            constrain: true,width:510,
            frame: true,
            modal: true,
           items: [_this.gpdefinircontingencia],
            buttons: [_this.btnCancelar, _this.btnAceptar]
        });
        _this.ventanadefinircontingencia.show()
    }
    this.CrearVentanaCrudControlAprobaciones = function (accion, idEntidadSeleccionada, store, iddocumentoaprobacion, esmanual, idaprobacion, idejercicio, denomejercicio, keymap) {
        _this.arrayindicadores = [];
        _this.arrayguardar = [];
        _this.arraymostrar = [];
        _this.cont = 0;
        _this.urlCargarDocManual = '';
        _this.iddocumento = '';
        _this.habilitarBtnGuardar = false;

        if (esmanual == 1 || esmanual == 0) {
            _this.urlCargarDocManual = 'VerDocumentoManual';
        } else
            _this.urlCargarDocManual = ''

        if (accion != "Duplicar") {
            _this.habilitarBtnGuardar = true;
        }

        _this.btnEliminar = new Ext.Button({
            // text: 'Eliminar',
            tooltip: 'Eliminar código <b>(DEL)</b>',
            id: 'btEliminar',
            disabled: true,
            iconCls: 'eliminar',
            // icon: perfil.dirImg + 'eliminar.png',
            handler: function () {

                var mensaje = '¿Está seguro que quiere eliminar el indicador seleccionado?';

                if(smGpCodigosCtrlDiv.getSelections().length > 1){
                    mensaje = '¿Está seguro que quiere eliminar los indicadores seleccionados?';
                }
                mostrarMensaje(2, mensaje, function (btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Eliminar();
                    }
                });
            }

        });
        _this.btnLimpiar = new Ext.Button({
            //text: 'Limpiar',
            tooltip: 'Limpiar <b> (Alt+L) </b>',
            id: 'btnLimpiar',
            iconCls: 'limpiar',
            //icon: perfil.dirImg + 'limpiar.png',
            handler: function () {
                _this.filtrosGpCodigosCtrlDiv.clearFilters();
            }
        });
        _this.btnAceptar = new Ext.Button({
            text: 'Aceptar',
            //  icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: false,
            id: 'btnAceptarCtrlDiv',

            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
            }
        });
        _this.btnGuardar = new Ext.Button({
            text: 'Aceptar',
            tooltip: 'Cerrar ventana y guardar los datos',
            disabled: true,
            id: 'btnGuardarCtrlDiv',
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'guardar',
            handler: function () {
                _this.myMaskGuardar.show();
                for (var i = 0; i < _this.arraymostrar.length; i++) {
                    _this.arrayguardar[i].importe = _this.arraymostrar[i].data.importe;
                }
                Guardar(_this.arrayguardar, store, idEntidadSeleccionada, idejercicio,0);
            }
        });

        _this.btnAplicar = new Ext.Button({
            text: 'Aplicar',
            //  icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aplicar',
            hidden:true,
            disabled: true,
            id: 'btnAplicarCtrlDiv',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.myMaskGuardar.show();
                for (var i = 0; i < _this.arraymostrar.length; i++) {
                    _this.arrayguardar[i].importe = _this.arraymostrar[i].data.importe;
                }
                Guardar(_this.arrayguardar, store, idEntidadSeleccionada, idejercicio,1);
            }
        });

        _this.btnCancelar = new Ext.Button({
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: ' btnCancelarCtrlDiv',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                if (keymap != undefined)
                    keymap.enable();
                _this.ventanaCrud.destroy();


            }
        });

        _this.stGpCodigosCtrlDiv = new Ext.data.Store({
            url: _this.urlCargarDocManual,
            reader: new Ext.data.JsonReader(
                {
                    root: "data",
                    totalProperty: "total",
                    id:'idcontroldivisa'
                },
                [{name: 'idcontroldivisa'}, {name: 'via'}, {name: 'organo'}, {name: 'idorganosatisface'}, {name: 'destino'}, {name: 'codigo'}, {name: 'denominacion'}, {name: 'cantidad'}, {name: 'importe'}, {name: 'identificador'}, {name: 'idvia'}, {name: 'identidadmodelo'}]
            ),
            listeners: {
                load: function (store, record, options) {

                    if (_this.stGpCodigosCtrlDiv.getCount() == 0) {
                        if (_this.filtrosGpCodigosCtrlDiv.getFiltrosActivos() == undefined || _this.filtrosGpCodigosCtrlDiv.getFiltrosActivos().length == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }

                    if ((accion == "ModificarDocumento" || accion == "Duplicar")) {
                        var TopicRecord = Ext.data.Record.create([
                            {name: 'idcontroldivisa'},
                            {name: 'via'},
                            {name: 'destino'},
                            {name: 'codigo'},
                            {name: 'denominacion'},
                            {name: 'importe'},
                            {name: 'identificador'}
                        ]);

                            for (var i = 0; i < _this.stGpCodigosCtrlDiv.getCount(); i++) {
                                var dato = {};

                                dato = {
                                    idcontroldivisa: _this.stGpCodigosCtrlDiv.getAt(i).data.idcontroldivisa,
                                    idvia: _this.stGpCodigosCtrlDiv.getAt(i).data.idvia,
                                    idconceptoplan: _this.stGpCodigosCtrlDiv.getAt(i).data.identidadmodelo,
                                    importe: _this.stGpCodigosCtrlDiv.getAt(i).data.importe,
                                    identificador: i
                                };

                                var newRecord = new TopicRecord({
                                    idcontroldivisa: _this.stGpCodigosCtrlDiv.getAt(i).data.idcontroldivisa,
                                    via: _this.stGpCodigosCtrlDiv.getAt(i).data.via,
                                    destino: _this.stGpCodigosCtrlDiv.getAt(i).data.destino,
                                    codigo: _this.stGpCodigosCtrlDiv.getAt(i).data.codigo,
                                    denominacion: _this.stGpCodigosCtrlDiv.getAt(i).data.denominacion,
                                    importe: _this.stGpCodigosCtrlDiv.getAt(i).data.importe,
                                    identificador: i,
                                    operacionesnc: _this.stGpCodigosCtrlDiv.getAt(i).data.operacionesnc
                                });
                                _this.arraymostrar.push(newRecord);
                                _this.arrayguardar.push(dato);
                            }
                            _this.stGpCodigosCtrlDiv.removeAll();
                            _this.stGpCodigosCtrlDiv.add(_this.arraymostrar);
                    }
                    if (accion == "Duplicar") {
                        Ext.getCmp('btnGuardarCtrlDiv').disable();
                    }

                    if (accion == "VerDocumento") {
                        if (store.reader.jsonData.total == 0) {
                            mostrarMensaje(1, 'No se pudo abrir el documento.', function () {
                                if (keymap != undefined)
                                    keymap.enable();
                                _this.ventanaCrud.destroy();
                            });
                        }
                        else {
                            _this.myMask.hide();

                            Ext.getCmp('labelTipoAprob').setText('Tipo de Aprobación: ' + record[0].json.tipoaprobacion);
                            Ext.getCmp('labelUsuario').setText('Usuario: ' + record[0].json.usuario);
                            Ext.getCmp('labelEntidad').setText('Entidad: ' + record[0].json.entidad);
                            Ext.getCmp('labelOrigen').setText('Origen: ' + record[0].json.origen);
                            Ext.getCmp('labelEstado').setText('Estado: ' + record[0].json.estado);
                            Ext.getCmp('labelFecha').setText('Fecha: ' + record[0].json.fecha);
                            Ext.getCmp('labelNoAprob').setText('Aprobación No: ' + record[0].json.numeroaprobacion);
                            Ext.getCmp('tfImporteTotal').setValue(record[0].json.importetotal);
                            smGpCodigosCtrlDiv.selectFirstRow();
                        }
                        _this.myMask.hide();
                    }


                }
            }
        });

        smGpCodigosCtrlDiv = new Ext.grid.RowSelectionModel({
            listeners: {
                rowselect: function (_this, row_index, record) {
                    if (smGpCodigosCtrlDiv.getSelections().length != 0) {
                        Ext.getCmp('btEliminar').enable();
                    }

                    if (esmanual == 0 && accion != 'ModificarDocumento') {
                        if (smGpCodigosCtrlDiv.getSelections().length != 0) {

                            ListarIndicadoresPlanif(0);
                        }}
                        else {
                                if (smGpCodigosCtrlDiv.getSelections().length != 0) {
                                    ListarIndicadoresPlanif(1);
                                }
                        }
                }
            }
        });
        _this.cmGpCodigosCtrlDiv = new Ext.grid.ColumnModel([{
            header: 'Vía',
            id: 'columnvia',
            dataIndex: 'via',
            sortable: true,
            align: 'right',
            width: 250
        },  {
            header: 'Operaciones no Comerciales',
            sortable: true,
            dataIndex: 'destino',
            width: 200,
            renderer: renderaprobacion,
            align: 'right'
        }, {
            id: 'codigo',
            header: 'Código',
            width: 85,
            sortable: true,
            dataIndex: 'codigo',
            align: 'right'
        }, {
            header: 'Denominación',
            width: 100,
            sortable: true,
            dataIndex: 'denominacion',
            id: 'denominacion',
            align: 'right'
        }, {
            header: 'Cantidad',
            width: 100,
            sortable: true,
            dataIndex: 'cantidad',
            align: 'right'
        },{
            header: 'Importe',
            width: 80,
            align: 'right',
            dataIndex: 'importe',
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }/*, {
            header: 'Credito',
            width: 80,
            align: 'right',
            dataIndex: 'importe',
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }*/
        ]);

        _this.filtrosGpCodigosCtrlDiv = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'via'
                }, {
                    type: 'string',
                    dataIndex: 'destino'
                }, {
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                },
                {
                    type: 'numeric',
                    dataIndex: 'importe',
                    xtype: 'numberfield',
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }]
        });

        _this.gpCodigosCtrlDiv = new Ext.grid.EditorGridPanel({
            frame: true,
            id: 'gpCodigosCtrlDiv',
            autoExpandColumn: 'denominacion',
            plugins: _this.filtrosGpCodigosCtrlDiv,
            store: _this.stGpCodigosCtrlDiv,
            clicksToEdit: 2,
            width: 750,
            height: 205,
            margins: '2 2 2 -4',
            sm: smGpCodigosCtrlDiv,
            cm: _this.cmGpCodigosCtrlDiv,
            tbar: [_this.btnEliminar, '-', '->', '-', _this.btnLimpiar],
            loadMask: {
                store: _this.stGpCodigosCtrlDiv
                //msg: 'Por favor espere...'
            },
            listeners: {
                rowcontextmenu: function (g, r, e) {

                },
                afteredit: function (sm) {

                }
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'paginadoCD',
                store: _this.stGpCodigosCtrlDiv,
                paramNames: {start: "start", limit: "limit", iddocumentoaprobacion: "iddocumentoaprobacion"},
                listeners: {
                    beforechange: function (pag, params) {
                        //if(_this.stGpCodigosCtrlDiv.data.items[0].json != undefined)
                       // params.iddocumentoaprobacion = _this.stGpCodigosCtrlDiv.data.items[0].json.iddocumentoaprobacion;
                    }
                },
                displayInfo: true,
                items: ['-', {xtype: 'tbtext', text: 'Importe Total:'}, {
                    id: "tfImporteTotal",
                    name: 'importetotal',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 90,
                    anchor: '95%'
                }, '-']

            })
        });

        _this.fsGpCodigosCtrlDiv = new Ext.form.FieldSet({
            region: 'center',
            title: 'Códigos de Control de Divisa',
            height: 250,
            layout: 'fit',
            items: [_this.gpCodigosCtrlDiv]
        });

        _this.stGpIndicadoresPlanif = new Ext.data.Store({
            url: 'listarIndRelacion',
            reader: new Ext.data.JsonReader(
                {
                    root: "datos",
                    id: "codigoplanif",
                    totalProperty: "cantidad"
                },
                [{name: 'codigoplanif'}, {name: 'numeropieza'}, {name: 'denominacion'}, {name: 'naturaleza'}, {name: 'idumedida'}, {name: 'cantidad'}, {name: 'importe'},{name: 'precio'}]
            ),
            listeners: {
                beforeload: function (st,opt) {
                    _this.panelInferior.expand(true);
                    _this.stGpIndicadoresPlanif.baseParams.identidad = idEntidadSeleccionada,
                        _this.stGpIndicadoresPlanif.baseParams.idvia = smGpCodigosCtrlDiv.getSelected().data.idvia,
                        _this.stGpIndicadoresPlanif.baseParams.idconceptoplan = smGpCodigosCtrlDiv.getSelected().data.identidadmodelo,
                        _this.stGpIndicadoresPlanif.baseParams.idcontroldivisa = smGpCodigosCtrlDiv.getSelected().data.idcontroldivisa,
                        _this.stGpIndicadoresPlanif.baseParams.organo = smGpCodigosCtrlDiv.getSelected().data.idorganosatisface,
                        _this.stGpIndicadoresPlanif.baseParams.idejercicio = idejercicio;
                        if(_this.stGpCodigosCtrlDiv.data.items[0].json != undefined)
                            _this.stGpIndicadoresPlanif.baseParams.iddocumento = _this.stGpCodigosCtrlDiv.data.items[0].json.iddocumentoaprobacion;
                    if(!opt.start)
                        st.baseParams.start = 0;
                    if(!opt.limit)
                        st.baseParams.limit = 0;
                },
                load: function () {

                }
            }
        });
        _this.smGpIndicadoresPlanif = new Ext.grid.RowSelectionModel({
            listeners: {
                rowselect: function (_this, row_index, record) {
                }
            }
        });
        _this.cmGpIndicadoresPlanif = new Ext.grid.ColumnModel([{
            id: 'codigoplanif',
            header: 'Codigo',
            dataIndex: 'codigoplanif',
            sortable: true,
            width: 100
        }, {
            header: 'No pieza',
            sortable: true,
            dataIndex: 'numeropieza',
            width: 130
        }, {
            header: 'Denominacion',
            width: 100,
            sortable: true,
            dataIndex: 'denominacion',
            id: 'denominacion'
        }, {
            header: 'Naturaleza',
            width: 100,
            sortable: true,
            dataIndex: 'naturaleza'
        }, {
            header: 'UM',
            width: 100,
            sortable: true,
            dataIndex: 'idumedida'
        }, {
            header: 'Cantidad',
            width: 100,
            align: 'right',
            dataIndex: 'cantidad',
            sortable: true
        },{
            header: 'Precio',
            width: 100,
            sortable: true,
            hidden:true,
            dataIndex: 'precio',
            align: 'right'
        } , {
            header: 'Importe',
            width: 100,
            align: 'right',
            dataIndex: 'importe',
            sortable: true,
            editor: new Ext.form.NumberField({
                allowNegative: true
            })
        }
        ]);
        _this.gpIndicadoresPlanif = new Ext.grid.EditorGridPanel({
            frame: true,
            id: 'gpIndicadoresPlanif',
            autoExpandColumn: 'denominacion',
            store: _this.stGpIndicadoresPlanif,
            clicksToEdit: 2,
            width: 750,
            height: 250,
            margins: '2 2 2 -4',
            sm: _this.smGpIndicadoresPlanif,
            cm: _this.cmGpIndicadoresPlanif,
            loadMask: {
                msg: 'Cargando...'
            },
            listeners: {
                rowcontextmenu: function (g, r, e) {

                },
                afteredit: function (sm) {

                }
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: _this.stGpIndicadoresPlanif,
                displayInfo: true
            })
        });

        _this.fsGpIndicadoresPlanif = new Ext.form.FieldSet({
            title: 'Indicadores de la Planificación',
            height: 250,
            width: 920,
            layout: 'fit',
            region:'center',
            items: [_this.gpIndicadoresPlanif]
        });

        // ******* Formulario para Mostrar Datos contenido en en la interfaz de adicionar Manualmente y Ver Documento *********

        _this.formularioMostrarDatos = new Ext.FormPanel({
            labelAlign: 'top',
            //region: 'north',
            frame: true,
            width: 930,
            height: 100,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.3,
                    layout: 'form',
                    text: 'Tipo de Aprobación:', tabIndex: 1, id: "labelTipoAprob", xtype: 'label', anchor: '100%'
                },
                    {
                        columnWidth: 0.3,
                        layout: 'form',
                        text: 'Aprobación No: ', tabIndex: 4, xtype: 'label', id: "labelNoAprob", anchor: '100%'
                    },
                    {
                        columnWidth: 0.3,
                        layout: 'form',
                        text: 'Estado:', tabIndex: 7, id: "labelEstado", xtype: 'label', anchor: '100%'
                    }

                ]
            }
                , {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.3,
                            layout: 'form',
                            text: 'Fecha:', tabIndex: 2, id: "labelFecha", xtype: 'label', anchor: '100%'
                        },
                        {
                            columnWidth: 0.3,
                            layout: 'form',
                            text: 'Usuario:', tabIndex: 5, xtype: 'label', id: "labelUsuario", anchor: '100%'
                        },
                        {
                            columnWidth: 0.3,
                            layout: 'form',
                            text: 'Entidad:', tabIndex: 3, id: "labelEntidad", xtype: 'label', anchor: '100%'
                        }
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.3,
                            layout: 'form',
                            text: 'Origen:', tabIndex: 6, xtype: 'label', id: "labelOrigen", anchor: '100%'
                        },
                    ]
                }
            ]
        });

        _this.fsMostrarDatos = new Ext.form.FieldSet({
            region: 'north',
            title: 'Datos generarales del documento',
            height: 100,
            layout: 'fit',
            items: [_this.formularioMostrarDatos]
        });

        //*********** Formulario contenido en la interfaz de adicionar Manualmente ********

        _this.stCbIndicadoresCtrlDiv = new Ext.data.Store({
            url: 'listarIndicadoresControlDivisa',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idcontroldivisa'
            }, [{
                name: 'idcontroldivisa'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'estado'
            }]),
            listeners: {
                beforeload: function () {
                    _this.stCbIndicadoresCtrlDiv.baseParams.start = 0;
                    _this.stCbIndicadoresCtrlDiv.baseParams.limit = 20;
                    _this.stCbIndicadoresCtrlDiv.baseParams.idejercicio = idejercicio;
                    _this.stCbIndicadoresCtrlDiv.baseParams.combo = true;
                },
                load: function () {
                }
            }
        });
        _this.cbIndicadoresCtrlDiv = new Ext.form.ComboBox({
            fieldLabel: 'Indicadores de control de divisa',
            id:'cbIndicadoresCtrlDiv',
            store: _this.stCbIndicadoresCtrlDiv,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            hiddenName: 'idcontroldivisa',
            valueField: 'idcontroldivisa',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            width: 250,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                  //  _this.stCbNaturaleza.reload();
                }
            }
        });
        _this.stCbConceptoPlan = new Ext.data.Store({
            url: 'listarDestinoControlDivisa',
            listeners: {
                beforeload: function () {
                    _this.stCbConceptoPlan.baseParams.idejercicio=idejercicio
                    _this.stCbConceptoPlan.baseParams.identidad = idEntidadSeleccionada
                },
                load: function () {
                }
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'identidadmodelo'
            }, [{
                name: 'denominacion'
            }, {
                name: 'identidadmodelo'
            }])
        });
        _this.cbConceptoPlan =  new Ext.ux.form.LovCombo({
          //  xtype: 'combo',editable: true,
            fieldLabel: 'Concepto del plan',
            store: _this.stCbConceptoPlan,
            displayField: 'denominacion',
           typeAhead: true,
            mode: 'local',
          //  forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            hiddenName: 'identidadmodelo',
            valueField: 'identidadmodelo',
            width: 263,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                      if(cb.getValue()!=""){
        var nuevo= cb.getValue()+','+record.data['identidadmodelo'];
                    }else{
var nuevo=record.data['identidadmodelo'];}
                    Ext.Ajax.request({

                        url: 'actualizarplanes',
                        params: {
                            idejercicio:idejercicio,
                            identidad : idEntidadSeleccionada,
                            via:_this.cbVia.getValue(),
                            plan: Ext.encode(nuevo)
                        },
                        callback: function(options, success, response) {
                            Ext.getBody().unmask();
                            response = Ext.decode(response.responseText);
                            _this.arrayindicadores=  response['indicador'];

                            var naturaleza=response['naturaleza'];
                            var plan=response['plan'];
                            var controldivisa=response['controldivisa'];
                            _this.stCbNaturaleza.removeAll()
                            if(naturaleza!=null){
                                _this.stCbNaturaleza.removeAll()
                                for(var a=0;a<naturaleza.length;a++

                                ){
                                    var record = new Ext.data.Record({
                                        denominacion: naturaleza[a]['naturaleza'],
                                        idnaturaleza: naturaleza[a]['idnaturaleza']
                                    });
                                    _this.stCbNaturaleza.add(record);

                                }}



                            _this.stCbIndicadoresCtrlDiv.removeAll()
                            if(controldivisa!=null){
                                _this.stCbIndicadoresCtrlDiv.removeAll()
                                for(var a=0;a<controldivisa.length;a++

                                ){
                                    var record = new Ext.data.Record({
                                        denominacion: controldivisa[a]['controldivisa'],
                                        idcontroldivisa: controldivisa[a]['idcontroldivisa'],
                                        codigo: controldivisa[a]['codigo']
                                    });
                                    _this.stCbIndicadoresCtrlDiv.add(record);

                                }}
                        }
                    });
                }
            }
        });



        _this.stCbNaturaleza = new Ext.data.Store({
            url: 'listarNaturalezadelosplanes',
            listeners: {
                beforeload: function () {
                    _this.stCbNaturaleza.baseParams.idcontroldedivisa = _this.cbIndicadoresCtrlDiv.getValue();
                },
                load: function () {
                }
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idnaturaleza'
            }, [{
                name: 'denominacion'
            }, {
                name: 'idnaturaleza'
            }])
        });





        _this.cbNaturaleza = new Ext.ux.form.LovCombo({
            fieldLabel: 'Naturaleza del plan',
            store: _this.stCbNaturaleza,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            //forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            hiddenName: 'idnaturaleza',
            valueField: 'idnaturaleza',
            width: 263,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {


                    if(cb.getValue()!=""){
                        var nuevo= cb.getValue()+','+record.data['idnaturaleza'];
                    }else{
                        var nuevo=record.data['idnaturaleza'];}
                    Ext.Ajax.request({
                        url: 'actualizarplanes',
                        params: {
                            idejercicio:idejercicio,
                            identidad : idEntidadSeleccionada,
                            via:_this.cbVia.getValue(),
                            naturaleza: Ext.encode(nuevo),
                            plan:_this.cbConceptoPlan.getValue()
                        },
                        callback: function(options, success, response) {
                            Ext.getBody().unmask();

                            response = Ext.decode(response.responseText);
                            _this.arrayindicadores=  response['indicador'];

                            var naturaleza=response['naturaleza'];
                            var plan=response['plan'];
                            var controldivisa=response['controldivisa'];
/*
                            if(naturaleza!=null){
                                _this.stCbNaturaleza.removeAll()
                                for(var a=0;a<naturaleza.length;a++

                                ){
                                    var record = new Ext.data.Record({
                                        denominacion: naturaleza[a]['naturaleza'],
                                        idnaturaleza: naturaleza[a]['idnaturaleza']
                                    });
                                    _this.stCbNaturaleza.add(record);

                                }}
*/


                            _this.stCbIndicadoresCtrlDiv.removeAll()
                            if(controldivisa!=null){
                                _this.stCbIndicadoresCtrlDiv.removeAll()
                                for(var a=0;a<controldivisa.length;a++

                                ){
                                    var record = new Ext.data.Record({
                                        denominacion: controldivisa[a]['controldivisa'],
                                        idcontroldivisa: controldivisa[a]['idcontroldivisa'],
                                        codigo: controldivisa[a]['codigo']
                                    });
                                    _this.stCbIndicadoresCtrlDiv.add(record);

                                }}
                        }
                    });





                }
            }
        });






        _this.stCbVia = new Ext.data.Store({
            url: 'cargarviaadquisicion',
            listeners: {
                beforeload: function () {

                  //  _this.stCbVia.add({"idviaadquisicion":"-15","denominacion":"Hola","descripcion":null,"color":null});
                },
                load: function () {
                 /*   var record = new Ext.data.Record({
                      denominacion: 'Operaciones no comerciales',
                        idviaadquisicion: '-15'
                    });
                    _this.stCbVia.add(record);*/





                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idviaadquisicion'
            }, [{
                name: 'denominacion'
            }, {
                name: 'idviaadquisicion'
            }])
        });
        _this.cbVia = new Ext.form.ComboBox({
            fieldLabel: 'Vía de adquisición',id:'cbvia',
            store: _this.stCbVia,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            hiddenName: 'idviaadquisicion',
            valueField: 'idviaadquisicion',
            width: 200,tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
if(record.data['idviaadquisicion']==-15){
   _this.cbConceptoPlan.disable();

}else{_this.cbConceptoPlan.enable();}
/*

                    Ext.Ajax.request({
                        url: 'actualizarplanes',
                          params: {
                            idejercicio:idejercicio,
                            identidad : idEntidadSeleccionada,
                            via: record.data['idviaadquisicion'],
                            },
                        callback: function(options, success, response) {
                            Ext.getBody().unmask();
                            response = Ext.decode(response.responseText);
                        _this.arrayindicadores=  response['indicador'];
                           var naturaleza=response['naturaleza'];
                            var plan=response['plan'];
                            var controldivisa=response['controldivisa'];
                            _this.stCbNaturaleza.removeAll()
                            if(naturaleza!=null){
                            _this.stCbNaturaleza.removeAll()
                            for(var a=0;a<naturaleza.length;a++

                            ){
                               var record = new Ext.data.Record({
                                   denominacion: naturaleza[a]['naturaleza'],
                                   idnaturaleza: naturaleza[a]['idnaturaleza']
                               });
                              _this.stCbNaturaleza.add(record);

                            }}

                            _this.stCbConceptoPlan.removeAll();
                            if(plan!=null){
                                _this.stCbConceptoPlan.removeAll()
                                for(var a=0;a<plan.length;a++

                                ){
                                    var record = new Ext.data.Record({
                                        denominacion: plan[a]['plan'],
                                        identidadmodelo: plan[a]['idplan']
                                    });
                                    _this.stCbConceptoPlan.add(record);

                                }}
                            _this.stCbIndicadoresCtrlDiv.removeAll()
                            if(controldivisa!=null){
                                _this.stCbIndicadoresCtrlDiv.removeAll()
                                for(var a=0;a<controldivisa.length;a++

                                ){
                                    var record = new Ext.data.Record({
                                        denominacion: controldivisa[a]['controldivisa'],
                                        idcontroldivisa: controldivisa[a]['idcontroldivisa'],
                                        codigo: controldivisa[a]['codigo']
                                    });
                                    _this.stCbIndicadoresCtrlDiv.add(record);

                                }}
                        }
                    });*/
                  }
            }
        });

        _this.tfImporte = new Ext.form.NumberField({
            fieldLabel: 'Importe',
            id: 'tfImporte',
            value: 0,
            maxLength: 19,
            maskRe: /^[0-9.]$/,
            maskReText: 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).',
            width: 60
        });
        _this.opnc = new Ext.form.Checkbox({
            id: 'opnc',
            width: 80,
            align: 'center',
           // allowBlank: false,
            fieldLabel: 'Operaciones no Comerciales',
          //  disabled: true
        });


        _this.btncalcularimporte = new Ext.Button({
            //  icon: perfil.dirImg + 'guardar.png',
            iconCls: 'calcular',
            disabled: true,
            id: 'btnAceptarFormIndicadoresConceptos',
            // text: 'Guardar',
            tooltip: 'Calcular importe ',
            handler: function () {

            }
        });


        _this.btnAceptarFormIndicadoresConceptos = new Ext.Button({
            //  icon: perfil.dirImg + 'guardar.png',
            iconCls: 'guardar',
            disabled: true,
            id: 'btnAceptarFormIndicadoresConceptos',
            // text: 'Guardar',
            tooltip: 'Guardar datos del documento ',
            handler: function () {
                if (_this.FormIndicadoresConceptos.getForm().isValid()) {
                    AdicionarFilas();
                    _this.FormIndicadoresConceptos.getForm().reset();
                    Ext.getCmp('btnLimpiar').enable();
                    if (_this.habilitarBtnGuardar) {
                        Ext.getCmp('btnGuardarCtrlDiv').enable();
                    }
                    _this.btnGuardar.enable();
                    _this.btnAplicar.enable();
                }
            }
        });
        _this.FormIndicadoresConceptos = new Ext.FormPanel({
            labelAlign: 'top',
            width: 940,
           // height: 50,
            frame: true,
            items:[{ layout: 'column',
                items: [
                    {
                    columnWidth: 0.28,
                    layout: 'form',
                    items: [_this.cbVia]
                    },
                    {
                     columnWidth: 0.28,
                    layout: 'form',
                    items: [_this.cbIndicadoresCtrlDiv]
                    },
                    {
                        columnWidth: 0.13,
                        layout: 'form',
                        bodyStyle:'paddingLeft:40px',
                        items: [_this.tfImporte]
                    },
                    {
                        columnWidth: 0.20,
                        layout: 'form',
                        align: 'center',
                        items: [ _this.opnc]

                    },
                    {
                        columnWidth: 0.10,
                        layout: 'form',
                        bodyStyle: 'padding: 20px 0px 0px',
                        items: [_this.btnAceptarFormIndicadoresConceptos]
                    }

                ]}]



            /*[{
                layout: 'column',
                items: [ {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.cbVia]
                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [_this.cbConceptoPlan]
                },{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: [ _this.cbNaturaleza]
                },]
            },
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.cbIndicadoresCtrlDiv]
                        }
                        , {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.tfImporte]
                        },{
                            columnWidth: 0.15,
                            layout: 'form',
                          bodyStyle: 'padding: 20px 0px 0px',
                            items: [_this.btncalcularimporte]
                        },
                        {
                            columnWidth: 0.17,
                            layout: 'form',
                           bodyStyle: 'padding: 20px 0px 0px',
                            items: [_this.btnAceptarFormIndicadoresConceptos]
                        }
                    ]
                }]*/, listeners: {
                clientvalidation: function (fm, valid) {
                    if (Ext.getCmp('cbIndicadoresCtrlDiv').getValue()&& Ext.getCmp('cbvia').getValue()&& Ext.getCmp('cbTipoAprobacion').getValue()) {
                        _this.btnAceptarFormIndicadoresConceptos.enable();

                       // Ext.getCmp('btnGuardarCtrlDiv').enable();
                    } else {
                        _this.btnAceptarFormIndicadoresConceptos.disable();
                    }
                   /* if(Ext.getCmp('cbIndicadoresCtrlDiv').getValue()){
                        _this.stCbNaturaleza.reload();
                    }*/
/*
                    if (Ext.getCmp('od3').getValue()) {
                        valorodactual = 1;
                    } else {
                        valorodactual = 2;
                    }

                    if (Ext.getCmp('oe3').getValue()) {
                        valoroeactual = 1;
                    } else {
                        valoroeactual = 2;
                    }

                    if (Ext.getCmp('idchecrectorm').getValue()) {
                        valorrectoractual = 1;
                    } else {
                        valorrectoractual = 2;
                    }

                    if (fm.getForm().isValid() && (valorcb != valorcbactual || valorod != valorodactual || valoroe != valoroeactual
                        || valorrector != valorrectoractual)) {
                        Ext.getCmp('btnAceptarModCom').enable();
                    } else {
                        Ext.getCmp('btnAceptarModCom').disable();
                    }*/
                }
            }
        });
        _this.fsDatosDocManual = new Ext.form.FieldSet({
            region: 'center',
            title: 'Otros datos',
            width: 940,
            height: 50,
            layout: 'fit',
            items: [_this.FormIndicadoresConceptos]
        });
        //***** Formulario Para datos generales *********      

        _this.stCbTipoAprobacion = new Ext.data.Store({
            url: 'listarTipoAprobacion',
            listeners: {
                beforeload: function () {
                    _this.stCbTipoAprobacion.baseParams.accion = accion;
                    _this.stCbTipoAprobacion.baseParams.identidad = idEntidadSeleccionada;
                    _this.stCbTipoAprobacion.baseParams.idejercicio = idejercicio;
                },
                load: function (st) {
                    if(st.getCount()==0){
                        _this.ventanaCrud.destroy();
                        mostrarMensaje(1,'Ya existen documentos para cada tipo de aprobaci&oacute;n.');
                    }
                    if (_this.stCbTipoAprobacion.getCount() == 0) {
                        if (accion == "Duplicar" || accion == "Manual") {
                            if (keymap != undefined)
                                keymap.enable();
                          //  _this.ventanaCrud.destroy();
                            _this.myMask.hide();
                         //   mostrarMensaje(1, "Ya se han generado documentos con cada tipo de aprobación.", function () {

                          //  });
                        }
                    } else {
                        _this.myMask.hide();
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'iddatosnomenclador'
            }, [{
                name: 'denominacion'
            }, {
                name: 'iddatosnomenclador'
            }])
        });
        _this.cbTipoAprobacion = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de aprobación',id:'cbTipoAprobacion',
            store: _this.stCbTipoAprobacion,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            hiddenName: 'iddatosnomenclador',
            valueField: 'iddatosnomenclador',
            width: 355,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
                    if (accion == "Duplicar") {
                        Ext.getCmp('btnGuardarCtrlDiv').enable();
                        _this.habilitarBtnGuardar = true;

                    }
                    _this.stCbOperacion.reload();
                }
            }
        });
        _this.stCbOperacion = new Ext.data.Store({
            url: 'listarOperaciones',autoLoad:false,
            listeners: {
                beforeload: function (st) {
                   st.baseParams.aprobacion = _this.cbTipoAprobacion.getValue();
                    st.baseParams.idejercicio = idejercicio
                    st.baseParams.identidad = idEntidadSeleccionada
                },
                load: function () {
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'iddatosnomenclador'
            }, [{
                name: 'denominacion'
            }, {
                name: 'iddatosnomenclador'
            }])
        });
        _this.cbOperacion = new Ext.form.ComboBox({
            fieldLabel: 'Operación',
            id:'cbOperacion',
            store: _this.stCbOperacion,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            hiddenName: 'iddatosnomenclador',
            valueField: 'iddatosnomenclador',
            width: 355,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {

                }
            }
        });
        _this.FormDatosGenerales = new Ext.FormPanel({
            labelAlign: 'top',
            width: 940,
            height: 140,
            frame: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [_this.cbTipoAprobacion]
                }/*, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.cbOperacion]
                }*/]
            }]
        });
        _this.fsDatosGenerales = new Ext.form.FieldSet({
            region: 'north',
            title: 'Datos generales del documento',
            width: 940,
            height: 100,
            layout: 'fit',
            items: [_this.FormDatosGenerales]
        });
        //***** Formulario Para Adicionar automatico *********  

        _this.stCbTipoAprobacionFormAutom = new Ext.data.Store({
            url: 'listarTipoAprobacion',
            listeners: {

                beforeload: function (st) {

                   st.baseParams.accion = accion;
                   st.baseParams.identidad = idEntidadSeleccionada;
                    st.baseParams.idejercicio = idejercicio;
                },
                load: function (st) {
                   // _this.cbTipoAprobacionFormAutom.setValue(419);
                 //   _this.cbTipoAprobacionFormAutom.disable();
                    if(st.getCount()==0){
                        _this.ventanaAddAutomatico.destroy();
                        mostrarMensaje(1,'Ya existen documentos para cada tipo de aprobaci&oacute;n.');
                    }
                    _this.myMask.hide();
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'iddatosnomenclador'
            }, [{
                name: 'denominacion'
            }, {
                name: 'iddatosnomenclador'
            }])
        });
        _this.cbTipoAprobacionFormAutom = new Ext.form.ComboBox({
            xtype: 'combo',
            fieldLabel: 'Tipo de aprobación',id:'cbTipoAprobacionautom',
            store: _this.stCbTipoAprobacionFormAutom,
            displayField: 'denominacion',
            mode: 'local',
            readOnly: true,
            allowBlank: false,
            //hiddenName: 'iddatosnomenclador',
            valueField: 'iddatosnomenclador',
            width: 150,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {
;                    _this.stCbOperacionFormAutom.load({params:{
                        aprobacion: record.data.iddatosnomenclador, idejercicio : idejercicio,identidad : idEntidadSeleccionada
                    }});

                }
            }
        });
        _this.stCbOperacionFormAutom = new Ext.data.Store({
            url: 'listarOperaciones',
            //autoLoad:false,
            listeners: {
                beforeload: function (st) {

                },
                load: function () {
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'iddatosnomenclador'
            }, [{
                name: 'denominacion'
            }, {
                name: 'iddatosnomenclador'
            }])
        });
        _this.cbOperacionFormAutom = new Ext.form.ComboBox({
            fieldLabel: 'Operación',
            store: _this.stCbOperacionFormAutom,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            allowBlank: false,
            hiddenName: 'iddatosnomenclador',
            valueField: 'iddatosnomenclador',
            width: 150,
            emptyText: 'Seleccione...',
            listeners: {
                select: function (cb, record, index) {

                }
            }
        });
        _this.btnAceptarFormAddAutomat = new Ext.Button({
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: false,
            id: 'btnAceptarFormAddAutomat',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {

                if (_this.FormAddautomatico.getForm().isValid()) {
                    if (keymap != undefined)
                        keymap.enable();
                    _this.ventanaAddAutomatico.destroy();
                    _this.myMask.show();
                    Ext.Ajax.request({
                        url: 'AdicionarDocumentoAutomatico',
                        params: {
                            idtipoaprobacion: _this.cbTipoAprobacionFormAutom.getValue(),
                            nombreaprobacion: _this.cbTipoAprobacionFormAutom.getRawValue(),
                            identidad: idEntidadSeleccionada,
                            idoperacion: _this.cbOperacionFormAutom.getValue(),
                            origen: 0,
                            idejercicio: idejercicio,
                            denomejercicio: denomejercicio
                        },
                        callback: function (options, success, response) {
                            _this.myMask.hide();
                            var responseData = Ext.decode(response.responseText);
                            if (responseData == 1) {
                                mostrarMensaje(1, "El documento de aprobación automática ha sido adicionado satisfactoriamente");
                            }
                            else {
                                mostrarMensaje(1, "No se puede crear la aprobación, la entidad seleccionada no presenta indicadores planificados o asociados.");
                            }

                        }
                    });
                }
            }
        });
        _this.btnCancelarFormAddAutomat = new Ext.Button({
            // icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: ' btnCancelarFormAddAutomat',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                if (keymap != undefined)
                    keymap.enable();
                _this.ventanaAddAutomatico.destroy();
            }
        });
        _this.FormAddautomatico = new Ext.FormPanel({
            region: 'center',
            labelAlign: 'top',
            width: 140,
            height: 70,
            frame: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [_this.cbTipoAprobacionFormAutom]
                }/*, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [_this.cbOperacionFormAutom]
                }*/]
            }]
        });
        _this.ventanaAddAutomatico = new Ext.Window({
            title: 'Adicionar documento automático',
            id: 'ventanaAddAutomatico',
            layout: 'fit',
            constrain: true,
            frame: true,
            modal: true,
            items: [_this.FormAddautomatico],
            buttons: [_this.btnCancelarFormAddAutomat, _this.btnAceptarFormAddAutomat]
        });
        _this.panelContenedorDelForm = new Ext.Panel({
            id: 'panelContenedorDelForm',
            region: 'north',
            split: true,
            width: 930,
            height: 200,
            layout: 'border',
            items: [_this.fsMostrarDatos, _this.fsDatosGenerales, _this.fsDatosDocManual]
        });
        _this.panelCentral = new Ext.Panel({
            id: 'panelCenter',
            region: 'center',
            split: true,
            width: 950,
            height: 360,
            layout: 'border',
            items: [_this.panelContenedorDelForm, _this.fsGpCodigosCtrlDiv]
        });
        _this.panelInferior = new Ext.Panel({
            id: 'panelInferior',
            region: 'south',
            split: true,
            collapsible: true,
            collapsed: true,
            height: 200,
            width:950,
            layout: 'border',
            items: [_this.fsGpIndicadoresPlanif]
        });
        _this.panelContenedor = new Ext.Panel({
            id: 'panelContenedor',
            split: true,
            width: 950,
            height: 590,
            layout: 'border',
            items: [_this.panelCentral, _this.panelInferior]
        });
        _this.ventanaCrud = new Ext.Window({
            title: 'Documento de Aprobación',
            id: 'ventanaCodigosCtrlDiv',
            layout: 'fit',
            width: 950,
            constrain: true,
            height: 590,
            frame: true,
            modal: true,
            autoValidate: false,
            items: [_this.panelContenedor],
            buttons: [_this.btnCancelar,  _this.btnAplicar, _this.btnGuardar]
        });

        if (accion == "Automatico") {
            _this.myMask.show();
            _this.stCbTipoAprobacionFormAutom.reload();
        //    _this.stCbOperacionFormAutom.reload();
            _this.ventanaAddAutomatico.show();

        } else{
            _this.cmGpCodigosCtrlDiv.setHidden(4, true);
        if (accion == "VerDocumento") {

            VerDocumento(iddocumentoaprobacion);
            _this.fsDatosGenerales.hide();
            _this.fsDatosDocManual.hide();
            _this.btnEliminar.hide();
            _this.btnGuardar.hide();
            _this.btnCancelar.setText("Cerrar");
            _this.panelContenedorDelForm.setSize(950, 100);
            _this.cmGpCodigosCtrlDiv.setEditable(5, false);
            if (esmanual == 1) {
                _this.cmGpCodigosCtrlDiv.setHidden(4, true);
                _this.cmGpIndicadoresPlanif.setHidden(6, false);
                _this.cmGpIndicadoresPlanif.setEditable(7, false);
               // _this.panelInferior.hide();
              //  _this.ventanaCrud.setSize(950, 430);
                _this.panelContenedor.setSize(950, 790);
            } else {
                _this.panelContenedor.setSize(950, 790);
            }
            _this.ventanaCrud.show();

        } else if (accion == "ModificarDocumento") {

            _this.stCbTipoAprobacion.reload();
         //   _this.stCbOperacion.reload();
           VerDocumento(iddocumentoaprobacion);
           Modificar(iddocumentoaprobacion, idaprobacion);
            _this.stCbIndicadoresCtrlDiv.reload();
            _this.stCbConceptoPlan.reload();
            _this.stCbVia.reload({
                params: {
                    start: 0,
                    limit: 20
                }
            });
            _this.btnLimpiar.hide();
            _this.fsMostrarDatos.hide();
            _this.panelInferior.hide();
           _this.cmGpCodigosCtrlDiv.setHidden(4, true);
         //   _this.cmGpCodigosCtrlDiv.setHidden(1, true);
            if(smGpDocumento.getSelected().data.idaprobacion!=4)
            {
               _this.cbTipoAprobacion.enable();
            } else {
                _this.cbTipoAprobacion.disable();
            }

            _this.ventanaCrud.setSize(950, 545);
            _this.ventanaCrud.setTitle('Modificar documento de aprobación');
            _this.ventanaCrud.show();

        } else if (accion == "Duplicar") {
           // _this.stCbOperacion.reload();
            _this.stCbTipoAprobacion.reload();
            VerDocumento(iddocumentoaprobacion);
            Modificar(iddocumentoaprobacion, idaprobacion);
            _this.stCbIndicadoresCtrlDiv.reload();
            _this.stCbConceptoPlan.reload();
            _this.stCbVia.reload({
                params: {
                    start: 0,
                    limit: 20
                }
            });
            _this.btnLimpiar.hide();
            _this.fsMostrarDatos.hide();
            _this.panelInferior.hide();
            _this.cmGpCodigosCtrlDiv.setColumnWidth(0, 132);
            if (esmanual == 1) {
                _this.cmGpCodigosCtrlDiv.setHidden(4, true);
            }
            _this.ventanaCrud.setSize(950, 545);
            _this.ventanaCrud.setTitle('Duplicar documento de aprobación');
            _this.ventanaCrud.show();
        }
        else if (accion == "Actualizar") {
            mostrarMensaje(2, '¿Está seguro que quiere actualizar el documento de aprobación seleccionado?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    _this.myMask.show();
                    Actualizar(iddocumentoaprobacion, idaprobacion, idEntidadSeleccionada, store);
                }
            });

        }
        else {
            _this.myMask.show();
            _this.stCbIndicadoresCtrlDiv.reload();
            _this.stCbConceptoPlan.reload();
            _this.stCbVia.reload({
                params: {
                    start: 0,
                    limit: 20
                }
            });
           // _this.stCbOperacion.reload();
            _this.stCbTipoAprobacion.reload();
            _this.btnLimpiar.hide();
            _this.fsMostrarDatos.hide();
            _this.btnAplicar.show();
            _this.panelInferior.hide();
            _this.cmGpCodigosCtrlDiv.setHidden(4, true);
            _this.cmGpCodigosCtrlDiv.setColumnWidth(0, 132);
            _this.ventanaCrud.setSize(950, 545);
            _this.ventanaCrud.setTitle('Adicionar documento manual');
            _this.ventanaCrud.show();
            } }

        function AdicionarFilas() {

            var codigo;
            var denominacionCP = _this.cbConceptoPlan.getRawValue();
            var idcontroldivisa;
            var denominacionCD;
            var iddatosnomenclador = _this.cbConceptoPlan.getValue();
            var idviaadquisicion = _this.cbVia.getValue();
            var via = _this.cbVia.getRawValue();

            var importe = _this.tfImporte.getValue();
            for (var i = 0; i < _this.stCbIndicadoresCtrlDiv.getCount(); i++) {
                if (_this.cbIndicadoresCtrlDiv.getValue() == _this.stCbIndicadoresCtrlDiv.getAt(i).data.idcontroldivisa) {
                    idcontroldivisa = _this.stCbIndicadoresCtrlDiv.getAt(i).data.idcontroldivisa
                    codigo = _this.stCbIndicadoresCtrlDiv.getAt(i).data.codigo;
                    denominacionCD = _this.stCbIndicadoresCtrlDiv.getAt(i).data.denominacion;
                }
            }

            var TopicRecord = Ext.data.Record.create([
                {name: 'idcontroldivisa'},
                {name: 'via'},
                {name: 'destino'},
                {name: 'codigo'},
                {name: 'denominacion'},
                {name: 'importe'},
                {name: 'identificador'}
            ]);
            var dato = {};
            dato = {
                idcontroldivisa: idcontroldivisa,
                idvia: _this.cbVia.getValue(),
                idconceptoplan: _this.cbConceptoPlan.getValue(),
                importe: importe,  operacionesnc:_this.opnc.getValue(),
                identificador: _this.cont
            };
            var newRecord = new TopicRecord({
                idcontroldivisa: idcontroldivisa,
                via: via,
                destino: denominacionCP,
                codigo: codigo,
                denominacion: denominacionCD,
                importe: importe,
                identificador: _this.cont++,
          operacionesnc:_this.opnc.getValue()
            });

            //_this.cont++;
            _this.arraymostrar.push(newRecord);
            _this.arrayguardar.push(dato);
            _this.stGpCodigosCtrlDiv.add(newRecord);
        }

        function Guardar(arrayrecords, store, idEntidadSeleccionada, idejercicio,apl) {

            var urlGuardarDocManual = '';
            var mostrarAccion = 'adicionado';
            var idtipoaprobacion;
            var nombreaprobacion;
            var idoperacion;
            var origen = 0;

            if (_this.FormDatosGenerales.getForm().isValid()) {
                idtipoaprobacion = _this.cbTipoAprobacion.getValue();
                nombreaprobacion = _this.cbTipoAprobacion.getRawValue();
                idoperacion = _this.cbOperacion.getValue();

                if (accion == "ModificarDocumento") {
                    origen = 1;
                    urlGuardarDocManual = 'ModificarDocumento'
                    mostrarAccion = 'modificado';
                } else {
                    origen = 1;
                    urlGuardarDocManual = 'AdicionarDocumentoManual';
                }

                Ext.Ajax.request({
                    url: urlGuardarDocManual,
                    params: {
                        arraydatosdoc: Ext.encode(arrayrecords),
                        arrayindicadores: Ext.encode(_this.arrayindicadores),
                        identidad: idEntidadSeleccionada,
                        idtipoaprobacion: idtipoaprobacion,
                        nombreaprobacion: nombreaprobacion,
                        idoperacion: idoperacion,
                        origen: origen,
                        iddocumento: _this.iddocumento,
                        accion: accion,
                        idejercicio: idejercicio,
                        denomejercicio: denomejercicio
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        _this.myMaskGuardar.hide();
                        if (responseData == 1) {
                            if (accion == 'Duplicar') {
                                mostrarAccion = 'duplicado';
                            }
                            mostrarMensaje(1, "El documento de aprobación manual ha sido " + mostrarAccion + " satisfactoriamente.");
                            if (keymap != undefined)
                                keymap.enable();
                            if(apl == 0){
                                _this.ventanaCrud.destroy();
                            }
                            else{
                                _this.FormIndicadoresConceptos.getForm().reset();
                                _this.stGpCodigosCtrlDiv.removeAll();
                                _this.stCbTipoAprobacion.reload();
                                _this.cbTipoAprobacion.clearValue();
                                _this.arrayindicadores = [];
                                _this.arrayguardar = [];
                                _this.arraymostrar = [];
                                _this.cont = 0;
                                _this.btnGuardar.disable();
                                _this.btnAplicar.disable();
                            }

                        }
                        store.reload({
                            params: {
                                identidad: idEntidadSeleccionada,
                                start: 0,
                                limit: 20,
                                idejercicio: idejercicio
                            }
                        });
                    }
                });
            }
        }

        function Modificar(iddocumento, aprobado) {
          //  _this.myMask.show();
            var documento;

            if (accion == "Duplicar") {
                _this.urlCargarDocManual = 'VerDocumentoManual';
            } else if (aprobado != 1 && esmanual == 1) {
                _this.urlCargarDocManual = 'DuplicarDocumento';

            } else {
                _this.urlCargarDocManual = 'VerDocumentoManual';
            }

            Ext.Ajax.request({
                url: _this.urlCargarDocManual,
                params: {
                    start: 0,
                    limit: 20,
                    iddocumentoaprobacion: iddocumento,
                    esmanual: esmanual,
                    idejercicio: idejercicio
                },
                callback: function (options, success, response) {

                    var responseData = Ext.decode(response.responseText);

                    if (aprobado != 1 && accion != "Duplicar" && esmanual == 1) {
                        documento = responseData.iddocumento;
                    } else {
                        documento = iddocumento;
                    }
                    _this.iddocumento = documento;
                    if (responseData) {
                        _this.btnGuardar.enable();
                        _this.btnAplicar.enable();
                        _this.cbTipoAprobacion.setValue(responseData.data[0].idtipoaprobacion);
                        _this.cbTipoAprobacion.setRawValue(responseData.data[0].tipoaprobacion);

                        _this.cbOperacion.setValue(responseData.data[0].idoperacion);
                        _this.cbOperacion.setRawValue(responseData.data[0].operacion);
                        Ext.getCmp('tfImporteTotal').setValue(responseData.data[0].importetotal);
                        _this.stGpCodigosCtrlDiv.reload({
                            params: {
                                start: 0,
                                limit: 20,
                                iddocumentoaprobacion: _this.iddocumento,
                                esmanual: esmanual
                            }
                        });
                    } else {
                        mostrarMensaje(1, "El documento ya no está disponible", function () {
                            if (keymap != undefined)
                                keymap.enable();
                            _this.ventanaCrud.destroy();
                        });
                    }
                    _this.myMask.hide();
                }
            });
        }

        function Eliminar() {
            if (_this.arrayguardar.length == 1) {
                _this.stGpCodigosCtrlDiv.removeAll();
                Ext.getCmp('btnGuardarCtrlDiv').disable();
                Ext.getCmp('btEliminar').disable();
                Ext.getCmp('btnLimpiar').disable();
                _this.arrayguardar = [];
                _this.arraymostrar = [];
            } else {


                var mensaje = "El indicador ha sido eliminado satisfactoriamente";
                if(smGpCodigosCtrlDiv.getSelections().length > 1){
                    mensaje = "Los indicadores han sido eliminados satisfactoriamente";
                }
                arraydatos = smGpCodigosCtrlDiv.getSelections();
                arrayeliminar = [];

                for (var i = 0; i < _this.arrayguardar.length; i++) {
                    for (var j = 0; j < arraydatos.length; j++){
                        if (arraydatos[j].data.identificador == _this.arrayguardar[i].identificador) {
                            _this.stGpCodigosCtrlDiv.remove(arraydatos[j]);
                            arrayeliminar.push(i);
                        }
                    }

                }


                for (var i = 0; i < arrayeliminar.length; i++){
                    _this.arrayguardar.splice(arrayeliminar[i],1);
                    _this.arraymostrar.splice(arrayeliminar[i],1);
                }



                mostrarMensaje(1, mensaje, function () {
                    _this.btnEliminar.disable();
                   /* _this.stGpCodigosCtrlDiv.removeAll();
                    for (var i = 0; i < arraydatos.length; i++) {
                        _this.stGpCodigosCtrlDiv.add(arraymostrar[i]);
                    }*/

                });
            }
        }

        function VerDocumento(iddocumento) {
            _this.myMask.show();
            _this.stGpCodigosCtrlDiv.reload({
                params: {
                    start: 0,
                    limit: 20,
                    iddocumentoaprobacion: iddocumento,
                    esmanual: esmanual,
                    idejercicio: idejercicio
                }
            });
        }

        function ListarIndicadoresPlanif(man) {
            _this.panelInferior.expand(true);
            Ext.Ajax.timeout = 60000;
            _this.stGpIndicadoresPlanif.reload({params:{manual:man}});
        }
        function renderaprobacion(value) {
           // if (value == 4)
            if(_this.opnc.getValue())
                return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';
            else {
               // return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
               // return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
            }
          //  return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
        }

        function Actualizar(iddocumento, aprobacion, identidad, store) {

            Ext.Ajax.request({
                url: 'ActualizarDocumento',
                params: {
                    iddocumento: iddocumento,
                    idaprobacion: aprobacion,
                    identidad: identidad
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    _this.myMask.hide();
                    if (responseData == 1) {
                        mostrarMensaje(1, "El documento de aprobación ha sido actualizado satisfactoriamente.", function () {
                            if (aprobacion != 1) {
                                store.reload();
                            }
                        });
                    }
                    else {
                        mostrarMensaje(3, "El documento de aprobación no se pudo actualizar.", function () {
                        });
                    }

                }
            });
        }


    }
}


