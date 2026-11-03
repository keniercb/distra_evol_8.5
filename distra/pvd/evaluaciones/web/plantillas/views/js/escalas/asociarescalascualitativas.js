/**
 * Interfaz para asociar las escalas cualitativas*
 *
 * @author Ing. Javier Rodríguez López*
 * @package PVD *
 * @subpackage Evaluaciones *
 */

Ext.ns("Ext.PVD.Evaluaciones.Plantilla");
Ext.PVD.Evaluaciones.Plantilla.AsociarEscalaCualitativa = Ext.extend(Ext.FormPanel, {
    labelAlign: 'left',
    frame: true,
    title: 'Escalas cualitativas',
//prueba
    initComponent: function () {
        var self = this;
        var rowIndexSelection = null;
        var btnAsociar = new Ext.Button({
            disabled: true,
            id: 'btnAsociar' + self.id,
            style: 'margin-left:18px;margin-top:110px',
            tooltip: this.labels.lbTTipBtnAsociarEscalaCualit,
            iconCls: 'siguiente',
            handler: function () {
                asociarValorCualitativo();
            }
        });

        var btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEliminar' + self.id,
            style: 'margin-left:18px;margin-top:90px',
            tooltip: this.labels.lbTTipBtnEliminarEscalaCualit,
            iconCls: 'anterior',
            handler: function () {
                elimAsocValorCualitativo();
            }
        });

        var btnSubirfila = new Ext.Button({
            iconCls: 'arriba',
            disabled: true,
            tooltip: labels.ttpBtnSubirfila,
            handler: function () {
                moverFilaArriba();
            }
        });

        var btnBajarfila = new Ext.Button({
            iconCls: 'abajo',
            disabled: true,
            tooltip: labels.ttpBtnBajarFila,
            handler: function () {
                moverFilaAbajo();
            }
        });

        var btnGuardarOrden = new Ext.Button({
            iconCls: 'guardar',
            disabled: true,
            tooltip: 'Guardar orden de los valores cualitativos (<b>Alt+G</b>)',//labels.ttpBtnGuardarOrden,
            handler: function () {
                guardarOrden();
            }
        });

        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<p><b>&nbsp;Descripci&oacute;n:</b> {descripcion}</p>')
        });

        var expanderValoresAsociados = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<p><b>&nbsp;Descripci&oacute;n:</b> {descripcion}</p>')
        });

        var smValoresCualitativos = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, row, rec) {
                    btnAsociar.enable();
                    btnEliminar.disable();
                }
            }
        });
        this.btnBuscar = new Ext.Button({
            id: 'btn_Buscar' + this.id,
            text: 'Buscar',
            tooltip:'Buscar tipo escala cualitativa',
            iconCls: 'buscar',
            handler: function() {
                this.stValoresCualitativos.load({
                    params: {
                        filtro: self.tfDenominacion.getValue(),
                        idescala: self.idescala,
                        limit: 20,
                        start: 0
                    }
                });
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            tooltip: 'Limpiar',
            iconCls: 'limpiar',
            handler: function() {
                self.tfDenominacion.reset();
                self.stValoresCualitativos.load({
                    params: {
                        idescala: self.idescala,
                        limit: 20,
                        start: 0
                    }
                });
            }
        });

        this.tfDenominacion = new Ext.form.TextField({
            anchor: '95%',
            fieldLabel:'Deominación',
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
            emptyText: 'Criterio...',
            listeners: {
                specialkey: function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        if (!Ext.isEmpty(this.getValue())) {
                            self.btnBuscar.handler();
                        }
                    }
                }
            }
        });



        this.stValoresCualitativos = new Ext.data.Store({
            url: 'valorescualitativosnoselec',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idvalorescualitativos"
            }, [
                {
                    name: 'idvalorescualitativos'
                },
                {
                    name: 'denom'
                },
                {
                    name: 'descripcion'
                }
            ]),
            listeners: {
                load: function (store, records, options) {
                    if (smValoresCualitativos.hasSelection()) {
                        btnAsociar.enable();
                    } else {
                        btnAsociar.disable();
                    }
                }
            }
        });

        this.gpValoresCualitativos = new Ext.grid.GridPanel({
            title: this.labels.titleListValCualit,
            ddGroup: 'gpValoresAsociadosDDGroup',
            enableDragDrop: true,
            columns: [expander,
                {                    id: 'expandir',
                    header: this.labels.lbDenominacion,
                    sortable: true,
                    width: 75,
                    dataIndex: 'denom'
                }
            ],
            frame: true,
            stripeRows: true,
            store: self.stValoresCualitativos,
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: labels.cargando
            },
            minSize: 75,
            plugins: expander,
            region: 'center',
            padding: '5 0 5 5',
            margins: '5 0 5 5',
            width: '100%',
            height: 850,
            sm: smValoresCualitativos,
            tbar: [self.tfDenominacion,self.btnBuscar,self.btnLimpiar]
           /* bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: self.stValoresCualitativos,
                displayInfo: false
            })*/
        });

        this.stValoresAsociados = new Ext.data.Store({
            url: 'escalasvaloresporidescala',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [
                {
                    name: 'idescalavalorescualitativos'
                },
                {
                    name: 'idvalorescualitativos'
                },
                {
                    name: 'denom'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'peso'
                },
                {name: 'color'}
            ]),
            listeners: {
                load: function (store, records, options) {
                    if (smValoresAsociados.hasSelection()) {
                        btnEliminar.enable();
                    } else {
                        btnEliminar.disable();
                    }
                }
            }
        });

        var smValoresAsociados = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, rowIndex, rec) {
                    rowIndexSelection = rowIndex;
                    btnAsociar.disable();
                    btnEliminar.enable();
                    btnSubirfila.enable();
                    btnBajarfila.enable();
                    if (rowIndex == 0)
                        btnSubirfila.disable();
                    if (rowIndex + 1 == self.stValoresAsociados.getCount())
                        btnBajarfila.disable();
                }
            }
        });

        function coloresValoresAsociados(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('color') != null && val != null) {
                return '<span style="color:' + record.get('color') + ';">' + val + '</span>';
            }
            return val;
        }

        var fb = new Ext.ux.ColorField({});

        fb.on('change', function (e, n, o) {
            var rec = self.stValoresAsociados.getAt(rowIndexSelection);
            rec.set('color', n);
            btnGuardarOrden.enable();
        })

        this.gpValoresAsociados = new Ext.grid.EditorGridPanel({
            title: this.labels.titleListValCualitSel,
            ddGroup: 'gpValoresCualitativosDDGroup',
            enableDragDrop: true,
            clicksToEdit: 1,
            tbar: ['->', btnSubirfila, btnBajarfila, btnGuardarOrden, ' '],
            columns: [expanderValoresAsociados, {
                id: 'expandir',
                header: this.labels.lbDenominacion,
                sortable: true,
                width: 75,
                dataIndex: 'denom',
                menuDisabled: true,
                renderer: coloresValoresAsociados
            }, {
                header: this.labels.lbPeso,
                width: 40,
                dataIndex: 'peso',
                menuDisabled: true
            }, {
                header: this.labels.lbColor,
                width: 40,
                menuDisabled: true,
                dataIndex: 'color',
                editor: fb,
                renderer: function (val) {
                    return '<div style="height:15px;width:35px;background-color:' + val + ';"></div>';
                }
            }],
            frame: true,
            stripeRows: true,
            store: self.stValoresAsociados,
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: labels.cargando
            },
            plugins: expanderValoresAsociados,
            minSize: 75,
            region: 'center',
            padding: '5 0 5 5',
            margins: '5 0 5 5',
            width: '100%',
            height: 850,
            sm: smValoresAsociados
        });


        this.items = [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .41,
                        layout: 'form',
                        items: [this.gpValoresCualitativos]
                    },
                    {
                        columnWidth: .10,
                        layout: 'form',
                        items: [btnAsociar, btnEliminar],
                        anchor: '100%'
                    },
                    {
                        columnWidth: .49,
                        layout: 'form',
                        padding: '5 5 5 5',
                        items: [this.gpValoresAsociados]
                    }
                ]
            }
        ];

        Ext.PVD.Evaluaciones.Plantilla.AsociarEscalaCualitativa.superclass.initComponent.call(this);
        this.gpValoresCualitativos.on('render', function () {
            var firstGridDropTargetEl = self.gpValoresCualitativos.getView().el.dom.childNodes[0].childNodes[1];
            var firstGridDropTarget = new Ext.dd.DropTarget(firstGridDropTargetEl, {
                ddGroup: 'gpValoresCualitativosDDGroup',
                copy: true,
                notifyDrop: function (ddSource, e, data) {
                    var record = ddSource.dragData.selections[0];
                    self.gpValoresCualitativos.getStore().add(record);
                    self.gpValoresCualitativos.getStore().sort('denom', 'ASC');
                    ddSource.grid.store.remove(record);
                    elimAsocValorCualitativo(record.data.idescalavalorescualitativos);
                }
            });
        });

        this.gpValoresAsociados.on('render', function () {
            var secondGridDropTargetEl = self.gpValoresAsociados.getView().el.dom.childNodes[0].childNodes[1];
            var destGridDropTarget = new Ext.dd.DropTarget(secondGridDropTargetEl, {
                ddGroup: 'gpValoresAsociadosDDGroup',
                copy: false,
                notifyDrop: function (ddSource, e, data) {
                    var record = ddSource.dragData.selections[0];
                    var foundItem = self.gpValoresAsociados.getStore().find('denom', record.data.denom);
                    if (foundItem == -1) {
                        self.gpValoresAsociados.getStore().add(record);
                        self.gpValoresAsociados.getStore().sort('denom', 'ASC');
                        ddSource.grid.store.remove(record);
                        asociarValorCualitativo(record.data.idvalorescualitativos);
                    } else {
                        mostrarMensaje(3, 'Ya existe el valor con esa denominacion.');
                    }
                }
            });
        });

        function asociarValorCualitativo(idvalorescualitativos) {
            PVD.mostrarMascara('mskasociarvalor', labels.lbMsgWait, labels.lbMaskAsociandoValores);
            Ext.Ajax.request({
                url: 'asociarValorCualitativo',
                method: 'POST',
                params: {
                    idvalorescualitativos: (idvalorescualitativos == null) ? self.gpValoresCualitativos.getSelectionModel().getSelected().get('idvalorescualitativos') : idvalorescualitativos,
                    idescala: self.idescala
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('mskasociarvalor');
                    self.loadStores(self.idescala);
                }
            });
        }

        function elimAsocValorCualitativo(idescalavalorescualitativos) {
            PVD.mostrarMascara('mskeliminarvalor', labels.lbMsgWait, labels.lbMaskEliminandoValores);
            Ext.Ajax.request({
                url: 'elimAsocValorCualitativo',
                method: 'POST',
                params: {
                    idescalavalorescualitativos: (idescalavalorescualitativos == null) ? self.gpValoresAsociados.getSelectionModel().getSelected().get('idescalavalorescualitativos') : idescalavalorescualitativos
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('mskeliminarvalor');
                    self.loadStores(self.idescala);
                }
            });
        }

        function moverFilaArriba() {
            var recordSeleccionado = smValoresAsociados.getSelected();
            var recordAnterior = self.stValoresAsociados.getAt(rowIndexSelection - 1);
            var recordAux = recordSeleccionado;
            self.stValoresAsociados.remove(recordSeleccionado);
            self.stValoresAsociados.insert(rowIndexSelection - 1, recordAux);
            recordSeleccionado.set('peso', rowIndexSelection);
            recordAnterior.set('peso', rowIndexSelection + 1);
            smValoresAsociados.selectPrevious();
            if (btnGuardarOrden.disabled) {
                btnGuardarOrden.enable();
            }
        }

        function moverFilaAbajo() {
            var recordSeleccionado = smValoresAsociados.getSelected();
            var ordenSelec = recordSeleccionado.get('peso');
            var recordSiguiente = self.stValoresAsociados.getAt(rowIndexSelection + 1);
            var recordAux = recordSeleccionado;
            self.stValoresAsociados.remove(recordSeleccionado);
            self.stValoresAsociados.insert(rowIndexSelection + 1, recordAux);
            recordSeleccionado.set('peso', recordSiguiente.get('peso'));
            recordSiguiente.set('peso', ordenSelec);
            smValoresAsociados.selectNext();
            if (btnGuardarOrden.disabled) {
                btnGuardarOrden.enable();
            }
        }

        function guardarOrden() {
            PVD.mostrarMascara('msksavingorden', labels.lbMsgWait, labels.lbMsgSaveOrden);
            var arrRecord = new Array();
            var arrayM = self.stValoresAsociados.getModifiedRecords();
            for (var i = 0; i < arrayM.length; i++) {
                var aux = {}
                aux.idescalavalorescualitativos = arrayM[i].get('idescalavalorescualitativos');
                aux.orden = arrayM[i].get('peso');
                aux.color = arrayM[i].get('color');
                arrRecord[i] = aux;
            }
            Ext.Ajax.request({
                url: 'actualizarordenvalorescualitativos',
                method: 'POST',
                params: {
                    arrayVal: Ext.encode(arrRecord)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    btnGuardarOrden.disable();
                    mostrarMensaje(1, 'EL valor cualitativo ha sido guardado satisfactoriamente');
                    PVD.ocultarMascara('msksavingorden');
                }
            });
        }
    },
    loadStores: function (idescala) {
        this.idescala = idescala;
        this.stValoresCualitativos.load({
            params: {
                limit: 20,
                start: 0,
                idescala: idescala
            }
        });
        this.stValoresAsociados.load({
            params: {
                idescala: idescala
            }
        });
    }
})
;
