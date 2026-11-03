Ext.ns("Ext.components.Evaluaciones");

Ext.components.Evaluaciones.RecManyValues = Ext.data.Record.create([
    {name: 'idnivel'},
    {name: 'denominacion'},
    {name: 'tiemporeclamacion'},
    {name: 'tiemporespuesta'}
]);

Ext.components.Evaluaciones.WinListPlanillasActivas = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    plain: true,
    closeAction: 'close',
    title: 'Seleccione las planillas evaluativas',
    resizable: false,
    height: 380,
    width: '90%',
    initComponent: function () {
        var self = this;

        var cmpListPlanEval = new Ext.components.Evaluaciones.CmpListPlanillasActivas({
            labels: self.labels,
            title: self.labels.titleListPlanilla,
            region: 'center',
            width: '50%',
            margins: '5 0 5 5',
            singleSelect: true
        });

        this.stModelos = new Ext.data.Store({
            url: 'getModelosMatematicos',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idmodelo'
            }, [
                {name: 'idmodelo'},
                {name: 'denom'},
                {name: 'descripcion'}
            ])
        });

        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<div style ="word-wrap:break-word;margin:5px;"><p><b>Descripci&oacute;n</b>:&nbsp;{descripcion}</p></div>')
        });

        this.gpModelos = new Ext.grid.GridPanel({
            title: labels.lbgpModelos,
            region: 'east',
            margins: '5 5 5 5',
            store: this.stModelos,
            plugins: expander,
            loadMask: {msg: self.labels.lbGridLoadMask},
            width: '49%',
            columns: [expander,
                {id: 'denominacion', header: labels.cMDenomModelo, width: 200, sortable: true, dataIndex: 'denom'}
            ],
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function (sm, rowIndex, record) {
                        if (cmpListPlanEval.getSelectionModel().hasSelection()) {
                            btnAceptar.enable();
                        }
                    },
                    rowdeselect: function (sm, rowIndex, record) {
                        btnAceptar.disable();
                    }
                }
            })
        });

        cmpListPlanEval.chSelModel.on('rowselect', function (sm, index, rec) {
            if (self.gpModelos.getSelectionModel().hasSelection()) {
                btnAceptar.enable();
            }
            self.stModelos.load({params: {idplanilla: rec.data.idplanilla}});
        })
        cmpListPlanEval.chSelModel.on('rowdeselect', function (sm, index, rec) {
            btnAceptar.disable();
            self.stModelos.removeAll();
        })
        cmpListPlanEval.store.on('beforeload', function () {
            btnAceptar.disable();
            self.stModelos.removeAll();
        })

        var btnAceptar = new Ext.Button({
            id: 'btnAceptar' + self.id,
            iconCls: 'aceptar',
            disabled: true,
            text: self.labels.lbtnAceptarDP,
            tooltip: self.labels.lbToolTipAceptar,
            nextTab: 'tfDenomPlanilla' + cmpListPlanEval.id,
            prevTab: 'btnCancelar' + self.id,
            handler: seleccionarPlanillas
        });

        var btnCancelar = new Ext.Button({
            id: 'btnCancelar' + self.id,
            iconCls: 'cancelar',
            text: self.labels.lbtnCancelarDP,
            tooltip: self.labels.lbToolTipCancelar,
            nexTab: 'btnAceptar' + self.id,
            prevTab: 'btnLimpiar' + cmpListPlanEval.id,
            handler: function () {
                self.close();
            }
        });
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelar.handler();
                }
            }
        ];
        this.items = [cmpListPlanEval, this.gpModelos];
        this.buttons = [btnCancelar, btnAceptar];

        function seleccionarPlanillas() {
            self.fireEvent('dataSelected', cmpListPlanEval.getSelectionModel().getSelected().get('idplanilla'), self.gpModelos.getSelectionModel().getSelected().get('idmodelo'));
            self.hide();
        }

        Ext.components.Evaluaciones.WinListPlanillasActivas.superclass.initComponent.call(this);
    }
});

Ext.components.Evaluaciones.WinDefProcesoEvaluativo = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    resizable: false,
    height: 490,
    width: 540,
    initComponent: function () {
        var self = this;
        var flagCbPeriodoLoaded = false;
        var flagCbTipoProcesoLoaded = false;

        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            id: 'aceptPE',
            text: self.labels.lbtnAceptarDP,
            tooltip: self.labels.lbToolTipAceptar,
            handler: function () {
                enviarDatos('acep');
            },
            nextTab: 'denomi' + self.id,
            prevTab: 'aplicPE'
        });

        this.btnAplicar = new Ext.Button({
            hidden: (self.iddefprocesoevaluativo ? true : false),
            iconCls: 'aplicar',
            id: 'aplicPE',
            text: self.labels.lbtnAplicarDP,
            tooltip: self.labels.lbToolTipAplicar,
            handler: function () {
                enviarDatos('apli');
            }
        });

        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            id: 'cancelPE',
            text: self.labels.lbtnCancelarDP,
            tooltip: self.labels.lbToolTipCancelar,
            handler: function () {
                self.close();
            }
        });

        var tfDenominacion = new Ext.form.TextField({
            fieldLabel: self.labels.lbDenominacion,
            id: 'denomi' + self.id,
            anchor: '100%',
            allowBlank: false,
            maxLength: 255,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            prevTab: 'aceptPE'
        });

        this.trigger = new Ext.form.TriggerField({
            allowBlank: false,
            emptyText: self.labels.lbEmptyTextSeleccione,
            fieldLabel: self.labels.flEscalaDesarrollo,
            readOnly: true,
            anchor: '100%',
            triggerClass: 'x-form-search-trigger',
        });
        this.trigger.onTriggerClick = buscarEscala;
        this.hfIdEscala = new Ext.form.Hidden();
        var taDescripcion = new Ext.form.TextArea({
            height: 75,
            anchor: '100%',
            fieldLabel: self.labels.lbDescripcion
        });
        var dfFechaInicioDP = new Ext.form.DateField({
            fieldLabel: self.labels.lbFechaInicio,
            value: fecha.format('d/m/Y'),
            format: 'd/m/Y',
            width: 176,
            readOnly: true,
            vtype: 'daterange',
            allowBlank: false
        });
        var stPeriodo = new Ext.data.Store({
            url: 'cargarcomboperiodo',
            reader: new Ext.data.JsonReader({
                id: 'idperiodoevaluativo',
                root: 'datos'
            }, [
                {name: 'idperiodoevaluativo'},
                {name: 'periodo'},
                {name: 'medidatiempo'}
            ])
        });
        var cbPeriodo = new Ext.form.ComboBox({
            name: 'cbPeriodo',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idperiodoevaluativo',
            hiddenName: 'idperiodoevaluativo',
            forceSelection: true,
            anchor: '100%',
            displayField: 'periodo',
            store: stPeriodo,
            mode: 'local',
            allowBlank: false,
            fieldLabel: self.labels.lbPeriodo
        });
        var stTipoProceso = new Ext.data.Store({
            url: 'cargarcombotipoproceso',
            reader: new Ext.data.JsonReader({
                id: 'idtipoprocesoevaluativo',
                root: 'datos'
            }, [
                {name: 'idtipoprocesoevaluativo'},
                {name: 'denom'}
            ])
        });
        var cbTipoProceso = new Ext.form.ComboBox({
            name: 'cbTipoProceso',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idtipoprocesoevaluativo',
            hiddenName: 'idtipoprocesoevaluativo',
            forceSelection: true,
            anchor: '100%',
            displayField: 'denom',
            store: stTipoProceso,
            mode: 'local',
            allowBlank: false,
            blankText: self.labels.lbCampoVacio,
            fieldLabel: self.labels.lbTipoProceso
        });

        var chbPuedeReclamar = new Ext.form.Checkbox({
            boxLabel: self.labels.lbPuedeReclamar,
            name: 'chbPuedeReclamar',
            inputValue: 'true'
        });

        var chbOpinionEvaluado = new Ext.form.Checkbox({
            boxLabel: 'Opini&oacute;n evaluado',//self.labels.lbOpinionEvaluado,
            name: 'chbOpinionEvaluado',
            inputValue: 'true'
        });

        this.rbEvaluador = new Ext.form.Radio({
            fieldLabel: '',
            boxLabel: 'Evaluador',
            name: 'opinion',
            labelSeparator: '',
            inputValue: '0',
            checked: true
        });
        this.rbEvaluado = new Ext.form.Radio({
            fieldLabel: '',
            boxLabel: 'Evaluado',
            name: 'opinion',
            labelSeparator: '',
            inputValue: '1'
        });

        chbOpinionEvaluado.on('check', function (chk, checked) {
            if (checked == false) {
                if (chbPuedeReclamar.getValue()) {
                    chbPuedeReclamar.setValue(false);
                    self.setWidth(365);
                }
                //self.fsPersonaOpinion.setVisible(false);
                self.setHeight(490);
            }
            else{
                //self.fsPersonaOpinion.setVisible(true);
                //self.fsPersonaOpinion.setWidth(300);
                self.setHeight(560);
            }
            self.center();
            self.doLayout();
        }, this);

        chbPuedeReclamar.on('check', function (chk, checked) {
            if (checked) {
                self.gpNiveles.setVisible(true);
                self.gpNiveles.setWidth(430);
                chbOpinionEvaluado.setValue(true);
                //self.fsPersonaOpinion.setWidth(340);
                self.setWidth(850);
            }
            else {
                self.gpNiveles.setVisible(false);
                self.setWidth(365);
                /*if(chbOpinionEvaluado.getValue()){
                    self.fsPersonaOpinion.setWidth(300);
                }*/
            }
            self.center();
            self.doLayout();
        }, this);

        this.btnAdicionar = new Ext.Button({
            text: 'Adicionar',
            tooltip: 'Adicionar nivel de reclamaci&oacute;n <b>(Alt+I)</b>',
            id: 'btnAdicionar' + self.id,
            iconCls: 'adicionar',
            handler: function () {
                var r = new Ext.components.Evaluaciones.RecManyValues({
                    denominacion: '',
                    tiemporeclamacion: '',
                    tiemporespuesta: '',
                    nivel: self.gpNiveles.getStore().getCount() + 1
                });
                self.gpNiveles.stopEditing();
                self.gpNiveles.getStore().add(r);
                self.gpNiveles.startEditing(0, 0);
            }
        });
        var arrEliminar = new Array();
        this.btnEliminar = new Ext.Button({
            text: 'Eliminar',
            tooltip: 'Eliminar nivel de reclamaci&oacute;n <b>(DEL)</b>',
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var st = self.gpNiveles.getStore();
                arrEliminar.push(st.getAt(self.gpNiveles.getSelectionModel().getSelectedCell()[0]).data.idnivelreclamacion);
                var inicio = self.gpNiveles.getSelectionModel().getSelectedCell()[0];
                st.remove(st.getAt(self.gpNiveles.getSelectionModel().getSelectedCell()[0]));
                var longitud = st.getRange().length;
                for (var i = inicio; i <= longitud - 1; i++) {
                    var nivel = st.getAt(i).data.nivel;
                    st.getAt(i).set('nivel', nivel - 1);
                }
            },
            id: 'btnEliminarValor' + self.id,
        });
        var btnSubirfila = new Ext.Button({
            iconCls: 'arriba',
            disabled: true,
            tooltip: 'Subir fila',
            handler: moverFilaArriba
        });
        var btnBajarfila = new Ext.Button({
            iconCls: 'abajo',
            disabled: true,
            tooltip: 'Bajar fila',
            handler: moverFilaAbajo
        });
        this.stValores = new Ext.data.Store({
            url: 'getNiveles',
            id: 'stValores' + self.id,
            reader: new Ext.data.JsonReader({
                    root: 'data',
                },
                [
                    {name: 'idnivelreclamacion'},
                    {name: 'nivel'},
                    {name: 'denominacion'},
                    {name: 'tiemporeclamacion'},
                    {name: 'iddefprocesoevaluativo'},
                    {name: 'tiemporespuesta'}
                ]
            )
        });
        this.gpNiveles = new Ext.grid.EditorGridPanel({
            title: 'Niveles de reclamación',
            hidden: true,
            region: 'east',
            loadMask: true,
            margins: '5 5 5 0',
            width: '55%',
            tbar: [self.btnAdicionar, self.btnEliminar, '->', btnSubirfila, btnBajarfila],
            store: this.stValores,
            columns: [new Ext.grid.RowNumberer(),
                {id: 'vm', header: 'Denominaci&oacute;n', tooltip: 'Denominaci&oacute;n del nivel', dataIndex: 'denominacion', editor: new Ext.form.TextField({allowBlank: false})},
                {header: 'Reclamaci&oacute;n', width: 95, tooltip: 'Tiempo de reclamaci&oacute;n en d&iacute;as', dataIndex: 'tiemporeclamacion', editor: new Ext.form.NumberField({allowBlank: false}), renderer: this.modDias},
                {header: 'Respuesta', width: 95, tooltip: 'Tiempo de respuesta en d&iacute;as', dataIndex: 'tiemporespuesta', editor: new Ext.form.NumberField({allowBlank: false}), renderer: this.modDias},
            ],
            sm: new Ext.grid.CellSelectionModel({
                listeners: {
                    cellselect: function (sm, rowIndex, colIndex) {
                        Ext.getCmp('btnEliminarValor' + self.id).enable();
                        self.btnAdicionar.focus();
                        btnSubirfila.enable();
                        btnBajarfila.enable();

                        if (rowIndex == 0) {
                            btnSubirfila.disable();
                        }
                        if (rowIndex == self.stValores.getCount() - 1) {
                            btnBajarfila.disable();
                        }
                    },
                    selectionchange: function (sm, obj) {
                        obj ? self.btnEliminar.enable() : self.btnEliminar.disable();
                    }
                }
            }),
            stripeRows: true,
            autoExpandColumn: 'vm',
            clicksToEdit: 1,
            keys: [
                {
                    key: 'i',
                    alt: true,
                    fn: function () {
                        self.btnAdicionar.handler();
                    }
                },
                {
                    key: 46,
                    fn: function () {
                        if (!self.btnEliminar.disabled) {
                            self.btnEliminar.handler();
                        }
                    }
                }
            ]
        });
        this.gpNiveles.on('show', function () {
            Ext.getCmp('btnEliminarValor' + self.id).disable();
            self.btnAdicionar.focus();
            if (self.iddefprocesoevaluativo) {
                self.gpNiveles.getStore().load({
                        params: {
                            iddefprocesoevaluativo: self.iddefprocesoevaluativo,
                            start: 0,
                            limit: 15
                        }
                    }
                )
            }
            ;
        }, this);

       /* this.fsPersonaOpinion = new Ext.form.FieldSet({
            title:'Qui&eacute;n introduce la opini&oacute;n',
            hidden:true,
            xtype:'fieldset',
            autoHeight: true,
            layout: 'form',
            items:[{
                layout: 'column',
                items: [
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.rbEvaluador]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.rbEvaluado]
                    }
                ]
            }]

        });*/

        this.formDefProcEval = new Ext.FormPanel({
            margins: '5 5 5 5',
            labelAlign: 'top',
            width: 360,
            frame: true,
            region: 'center',
            bodyStyle: 'padding:5px 5px 0',
            border: false,
            items: [tfDenominacion, {
                layout: 'column',
                items: [
                    {
                        columnWidth: .58,
                        layout: 'form',
                        items: [dfFechaInicioDP]
                    },
                    {
                        columnWidth: .42,
                        layout: 'form',
                        items: [cbPeriodo]
                    }
                ]
            }, cbTipoProceso, this.trigger, taDescripcion,
                {
                    title: 'Opciones',
                    xtype: 'fieldset',
                    autoHeight: true,
                    layout: 'form',
                    items: [
                        {
                            xtype: 'checkboxgroup',
                            labelseparator: '',
                            columns: 2,
                            hideLabel: true,
                            items: [chbOpinionEvaluado, chbPuedeReclamar]
                        }//,this.fsPersonaOpinion
                    ]
                }]
        });
        this.items = [self.formDefProcEval, self.gpNiveles];
        this.buttons = [btnCancelar, self.btnAplicar, btnAceptar];
        this.on('show', function (cmp) {
            stPeriodo.load();
            stTipoProceso.load();
            tfDenominacion.focus(false, 300);
        });
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptar.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                fn: function () {
                    self.btnAplicar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelar.handler();
                }
            }
        ];

        function buscarEscala() {
            var winEscala = new Ext.components.Evaluaciones.WinEscala({
                title: self.labels.titleListEscala,
                parent: self,
                labels: self.labels
            });
            winEscala.show();
        }

        function moverFilaArriba() {
            var st = self.gpNiveles.getStore();
            var posicionSeleccionada = self.gpNiveles.getSelectionModel().getSelectedCell()[0];
            var recordSeleccionado = st.getAt(posicionSeleccionada);
            var recordAnterior = st.getAt(posicionSeleccionada - 1);
            var recordAux = recordSeleccionado;
            self.gpNiveles.getStore().remove(recordSeleccionado);
            self.gpNiveles.getStore().insert(posicionSeleccionada, recordAux);
            self.stValores.remove(recordSeleccionado);
            self.stValores.insert(posicionSeleccionada - 1, recordAux);
            recordSeleccionado.set('nivel', posicionSeleccionada);
            recordAnterior.set('nivel', posicionSeleccionada + 1);
            btnSubirfila.disable();
            btnBajarfila.disable();

        }

        function moverFilaAbajo() {
            var st = self.gpNiveles.getStore();
            var posicionSeleccionada = self.gpNiveles.getSelectionModel().getSelectedCell()[0];
            var recordSeleccionado = st.getAt(posicionSeleccionada);
            var ordenSelec = recordSeleccionado.get('nivel');
            var recordSiguiente = self.gpNiveles.getStore().getAt(posicionSeleccionada + 1);
            var recordAux = recordSeleccionado;
            self.gpNiveles.getStore().remove(recordSeleccionado);
            self.gpNiveles.getStore().insert(posicionSeleccionada + 1, recordAux);
            recordSeleccionado.set('nivel', recordSiguiente.get('nivel'));
            recordSiguiente.set('nivel', ordenSelec);
            btnSubirfila.disable();
            btnBajarfila.disable();
        }

        function enviarDatos(accion) {
            var arrRecord = new Array();
            var arrayM = self.stValores.getModifiedRecords();
            for (var i = 0; i < arrayM.length; i++) {
                var aux = {}
                aux.denominacion = arrayM[i].get('denominacion');
                aux.tiemporespuesta = arrayM[i].get('tiemporespuesta');
                aux.tiemporeclamacion = arrayM[i].get('tiemporeclamacion');
                aux.nivel = arrayM[i].get('nivel');
                aux.idnivelreclamacion = arrayM[i].get('idnivelreclamacion');
                arrRecord[i] = aux;
            }
            if (self.formDefProcEval.getForm().isValid()) {
                PVD.mostrarMascara('mskSaveData' + self.id, 'Por favor espere..', 'Guardando datos del proceso evaluativo');
                Ext.Ajax.request({
                    url: self.iddefprocesoevaluativo ? 'modificardefinirproceso' : 'adicionardefinirproceso',
                    method: 'POST',
                    params: {
                        arrNiveles: Ext.encode(arrRecord),
                        arrEliminar: Ext.encode(arrEliminar),
                        iddefprocesoevaluativo: self.iddefprocesoevaluativo,
                        denom: tfDenominacion.getValue(),
                        descripcion: taDescripcion.getValue(),
                        fechacomienzo: dfFechaInicioDP.getRawValue(),
                        idperiodoevaluativo: cbPeriodo.getValue(),
                        idtipoprocesoevaluativo: cbTipoProceso.getValue(),
                        puedereclamar: chbPuedeReclamar.getValue() == true ? 1 : 0,
                        opinionevaluado: chbOpinionEvaluado.getValue() == true ? 1 : 0,
                        //opinante: self.rbEvaluador.getValue() == true ? 0 : 1,
                        idescala: self.hfIdEscala.getValue()
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mskSaveData' + self.id);
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 3) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }
                        else {
                            mostrarMensaje(1, 'El proceso evaluativo ha sido adicionado satisfactoriamente.', function (btn) {
                                if (accion == 'acep') {
                                    self.hide();
                                } else {
                                    self.formDefProcEval.getForm().reset();
                                }
                                self.fireEvent('dataSaved');
                            });
                        }
                    }
                });
            }
        }

        function __construct() {
            //Caso que sea modificar proceso evaluativo
            if (self.iddefprocesoevaluativo) {
                PVD.mostrarMascara('mskLoadData' + self.id, self.labels.lbPleaseWait, 'Cargando datos del proceso evaluativo');
                tfDenominacion.setValue(self.denom);
                taDescripcion.setValue(self.descripcion);
                dfFechaInicioDP.setValue(self.fechacomienzo);

                stPeriodo.on('load', function (store, records, options) {
                    cbPeriodo.setValue(self.idperiodoevaluativo);
                    flagCbPeriodoLoaded = true;
                    self.fireEvent('dataLoaded');
                });
                stTipoProceso.on('load', function (store, records, options) {
                    cbTipoProceso.setValue(self.idtipoprocesoevaluativo);
                    flagCbTipoProcesoLoaded = true;
                    self.fireEvent('dataLoaded');
                });
                chbPuedeReclamar.setValue(self.puedereclamar);
                chbOpinionEvaluado.setValue(self.opinionevaluado);

                self.on('dataLoaded', function () {
                    if (flagCbPeriodoLoaded && flagCbTipoProcesoLoaded) {
                        PVD.ocultarMascara('mskLoadData' + self.id);
                    }
                });
            }
        }

        self.on('show', function (cmp) {
            __construct();
        });
        Ext.components.Evaluaciones.WinDefProcesoEvaluativo.superclass.initComponent.call(this);
    },
    modDias: function (val) {
        if (val != '') {
            if (val == 1)
                return val + " d&iacute;a";
            else
                return val + " d&iacute;as";
        }

        return "";
    }
});

Ext.components.Evaluaciones.WinAsociarPlanilla = Ext.extend(Ext.Window, {
    layout: 'fit',
    modal: true,
    plain: true,
    closeAction: 'hide',
    resizable: false,
    height: 375,
    width: 650,
    initComponent: function () {
        var self = this;

        var btnAdicionar = new Ext.Button({
            id: 'btnAdicionar' + self.id,
            iconCls: 'adicionar',
            text: self.labels.lbBtnAdicionar,
            tooltip: self.labels.lbToolTipAdicionarPE,
            handler: fnAdicionarPlanillas
        });

        var btnEliminar = new Ext.Button({
            id: 'btnEliminar' + self.id,
            disabled: true, iconCls: 'btn',
            iconCls: 'eliminar',
            text: self.labels.lbBtnEliminar,
            tooltip: self.labels.lbToolTipEliminarPE,
            handler: eliminarPlanilla
        });

        var mskAsocPlan = new Ext.LoadMask(Ext.getBody(), {msg: self.labels.lbMskAsocPlanillas});

        var stPlanillas = new Ext.data.Store({
            url: 'getplanillasasociadas',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idprocesoplanilla'
            }, [
                {name: 'idprocesoplanilla'},
                {name: 'iddefprocesoevaluativo'},
                {name: 'idplanilla'},
                {name: 'planilla'},
                {name: 'idmodelo'},
                {name: 'denommodelo'}
            ]),
            listeners: {
                load: function (st, records, options) {
                    btnAdicionar.focus();
                }
            }
        });

        var kmPlanillasE = [
            {
                key: 'i', alt: true,
                fn: function () {
                    btnAdicionar.handler();
                }
            },
            {
                key: 46,
                fn: function () {
                    if (!btnEliminar.disabled) {
                        btnEliminar.handler();
                    }
                }
            }
        ];

        this.gpPlanillas = new Ext.grid.GridPanel({
            tbar: [btnAdicionar, btnEliminar],
            margins: '5 5 5 5',
            region: 'center',
            store: stPlanillas,
            keys: kmPlanillasE,
            loadMask: {msg: self.labels.lbGridLoadMask},
            columns: [
                {
                    id: 'denominacion',
                    header: "Denominaci&oacute;n de la planilla",
                    width: 200,
                    sortable: true,
                    dataIndex: 'planilla'
                },
                {
                    header: "Denominaci&oacute;n del modelo",
                    width: 200,
                    sortable: true,
                    dataIndex: 'denommodelo'
                }
            ],
            autoExpandColumn: 'denominacion',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function (sm, rowIndex, record) {
                        btnEliminar.enable();
                    },
                    rowdeselect: function (sm, rowIndex, record) {
                        btnEliminar.disable();
                    }
                }
            })
        });

        function showTick(valor) {
            if (valor == 0) {
                return '';
            }
            else {
                return '<center><div class="tick">&nbsp;</div></center>';
            }
        }

        this.items = [self.gpPlanillas];

        this.on('show', function (cmp) {
            stPlanillas.load({params: {iddefprocesoevaluativo: self.iddefprocesoevaluativo}});
        });

        function fnAdicionarPlanillas() {
            var winListPLanilas = new Ext.components.Evaluaciones.WinListPlanillasActivas({
                labels: self.labels
            });
            winListPLanilas.show();

            winListPLanilas.on('close', function (cmp) {
                btnAdicionar.focus();
            });

            winListPLanilas.on('dataSelected', function (idPlanillas, idModelo) {
                mskAsocPlan.show();
                Ext.Ajax.request({
                    url: 'asociarplanillas',
                    method: 'POST',
                    params: {
                        iddefprocesoevaluativo: self.iddefprocesoevaluativo,
                        idPlanilla: idPlanillas,
                        idModelo: idModelo
                    },
                    callback: function (options, success, response) {
                        mskAsocPlan.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.codResult == 1) {
                            if (responseData.accion == 'ADD') {
                                mostrarMensaje(1, 'La planilla ha sido adicionada satisfactoriamente', function (btn) {
                                    stPlanillas.reload({params: {iddefprocesoevaluativo: self.iddefprocesoevaluativo}});
                                });
                            } else {
                                mostrarMensaje(1, 'La planilla ha sido modificada satisfactoriamente', function (btn) {
                                    stPlanillas.reload({params: {iddefprocesoevaluativo: self.iddefprocesoevaluativo}});
                                });
                            }
                        } else if (responseData.codResult == 0) {
                            mostrarMensaje(3, 'La planilla que desea adicionar ya existe.');
                        }
                        else if (responseData.codResult == 3) {
                            if (responseData.accion == 'ADD') {
                                mostrarMensaje(3, 'La planilla no ha sido adicionada');
                            } else {
                                mostrarMensaje(3, 'La planilla no ha sido modificada');
                            }
                        }
                    }
                });
            });
        }

        function eliminarPlanilla() {
            var selectedRecord = self.gpPlanillas.getSelectionModel().getSelected();
            if (self.gpPlanillas.getSelectionModel().hasSelection()) {
                mostrarMensaje(2, self.labels.lbMsgConfirmElimPlanilla, function (btn) {
                    if (btn == "ok") {
                        var mskElimPlanilla = new Ext.LoadMask(Ext.getBody(), {msg: self.labels.lbMskElimPlanilla});
                        mskElimPlanilla.show();
                        Ext.Ajax.request({
                            url: 'eliminarPlanillaAsociada',
                            method: 'POST',
                            params: {
                                idprocesoplanilla: self.gpPlanillas.getSelectionModel().getSelected().get('idprocesoplanilla'),
                                iddefprocesoevaluativo: selectedRecord.get('iddefprocesoevaluativo'),
                                idplanilla: selectedRecord.get('idplanilla')
                            },
                            callback: function (options, success, response) {
                                mskElimPlanilla.hide();
                                var responseData = Ext.decode(response.responseText);
                                if (responseData.success) {
                                    Ext.MessageBox.show({
                                        title: self.labels.lbInfo, msg: 'La planilla ha sido eliminada satisfactoriamente',
                                        buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.INFO,
                                        fn: function () {
                                            btnEliminar.disable();
                                            stPlanillas.reload({params: {iddefprocesoevaluativo: self.iddefprocesoevaluativo}});
                                        }
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: self.labels.lbInfo, msg: 'La planilla seleccionada no se puede eliminar debido a que est&aacute; en uso',
                                        buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.INFO,
                                        fn: function () {
                                            btnAdicionar.focus();
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }

        Ext.components.Evaluaciones.WinAsociarPlanilla.superclass.initComponent.call(this);
    }
});

Ext.components.Evaluaciones.WinNotificacion = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    plain: true,
    resizable: false,
    height: 375,
    width: 560,
    initComponent: function () {
        var self = this;
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            id: 'aceptPE',
            text: self.labels.lbtnAceptarDP,
            tooltip: self.labels.lbToolTipAceptar,
            handler: function () {
                enviarDatos()
            }
        });

        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            id: 'cancelPE',
            text: self.labels.lbtnCancelarDP,
            tooltip: self.labels.lbToolTipCancelar,
            handler: function () {
                self.close();

            }
        });

        this.asunto = new Ext.form.TextField({
            fieldLabel: self.labels.lbAsunto,
            name: 'asunto',
            anchor: '99%',
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
           // regex: /^ ([a-z0-9A-ZáéíóúñüÑ\d\s]  + ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)  +$/,
            regexText: self.labels.msgErrorTextField,
            allowBlank: false,
            maxLength: 255
        });

        this.remitente = new Ext.form.TextField({
            fieldLabel: self.labels.lbRemitente,
            name: 'remitente',
            anchor: '99%',
            allowBlank: false,
            maxLength: 255,
            vtype: 'email',
            vtypeText: self.labels.lbMskCorreoInvalido
        });

        this.contrasenna = new Ext.form.TextField({
            fieldLabel: self.labels.lbContrasenna,
            name: 'contrasenna',
            inputType: 'password',
            anchor: '99%',
            regexText: self.labels.msgErrorTextField,
            allowBlank: false,
            maxLength: 255,
        });

        this.mensaje = new Ext.form.HtmlEditor({
            fieldLabel: self.labels.lbMensaje,
            xtype: 'htmleditor',
            id: 'mensajehtmleditor',
            height: 150,
            anchor: '99%',
            allowBlank: false,
        });

        this.idprocesonotif = new Ext.form.TextField({
            name: 'idprocesonotif',
            hidden: true,
            hideLabel: true
        });

        this.formDefProcEval = new Ext.FormPanel({
            margins: '5 5 5 5',
            labelAlign: 'top',
            width: '54%',
            frame: true,
            region: 'center',
            bodyStyle: 'padding:5px 5px 0',
            border: false,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.remitente]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.contrasenna]
                        }
                    ]
                },
                this.asunto,
                this.mensaje ,
                this.idprocesonotif
            ]
        });

        this.items = [self.formDefProcEval];
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelar.handler();
                }
            }
        ];
        this.buttons = [btnCancelar, btnAceptar];
        this.on('close', function (cmp) {
            self.formDefProcEval.getForm().reset();
            Ext.getCmp('adicionarDP').focus();
        });

        function enviarDatos() {
            if (self.formDefProcEval.getForm().isValid()) {
                PVD.mostrarMascara('mskSaveData' + self.id, 'Por favor espere..', 'Guardando datos del proceso evaluativo');
                Ext.Ajax.request({
                    url: 'adicionarNotificacion',
                    method: 'POST',
                    params: {
                        iddefprocesoevaluativo: self.idevaldefprosesoevaluativo,
                        asunto: self.asunto.getValue(),
                        mensaje: self.mensaje.getValue(),
                        idprocesonotif: self.idprocesonotif.getValue(),
                        usuario: self.remitente.getValue(),
                        pass: self.contrasenna.getValue()
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mskSaveData' + self.id);
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.exito == 1) {
                            if (responseData.modificar == 0) {
                                mostrarMensaje(1, 'La notificaci&oacute;n ha sido adicionada satisfactoriamente.');
                            }
                            else {
                                mostrarMensaje(1, 'La notificaci&oacute;n ha sido modificada satisfactoriamente.');
                            }
                            self.close();
                        }
                        else {
                            mostrarMensaje(1, 'La notificaci&oacute;n no se ha podido adicionar.');
                            self.close();
                        }
                        Ext.getCmp('idDP').getStore().reload();
                    }
                });
            }
        }

        Ext.components.Evaluaciones.WinNotificacion.superclass.initComponent.call(this);
    }
});

Ext.components.Evaluaciones.WinEscala = Ext.extend(Ext.Window, {
    //layout: 'border',
    modal: true,
    resizable: false,
    height: 370,
    width: 450,
    initComponent: function () {
        var self = this;
        var btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            id: 'cancelPE' + self.id,
            text: self.labels.lbtnCancelarDP,
            tooltip: self.labels.lbToolTipCancelar,
            handler: function () {
                self.close();
                Ext.getCmp('aceptPE').focus();
            }
        });
        var btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            id: 'aceptPE' + self.id,
            disabled: true,
            text: self.labels.lbtnAceptarDP,
            tooltip: self.labels.lbToolTipAceptar,
            handler: function () {
                var record = gpEscala.getSelectionModel().getSelected();
                if (record != null) {
                    self.parent.trigger.setValue(record.get('denom'));
                    self.parent.hfIdEscala.setValue(record.get('idescala'));
                }
                self.close();
            },
        });
        //Store de escala
        var st_escala = new Ext.data.Store({
            url: '/pvd/evaluaciones/plantillas/index.php/modelos/cargarEscCualitativas',
            reader: new Ext.data.JsonReader({
                id: 'idescala',
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idescala'
                },
                {
                    name: 'denom'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'desde'
                },
                {
                    name: 'hasta'
                },
                {
                    name: 'tipoescala'
                }
            ])
        });
        //Expander del column
        var expanderescala = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Descripci&oacute;n:</b> </br> {descripcion}</p>')
        });
        //Componente buscar
        this.bucar = new Ext.app.SearchField({
            store: st_escala,
            id: 'tfBuscar' + self.id,
            emptyText: self.labels.lbBuscar,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
            regex: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            regexText: self.labels.msgErrorTextField,
        });
        //Paginado del grid
        var ptwescala = new Ext.PagingToolbar({
            pageSize: 15,
            store: st_escala,
            displayInfo: true,
        });
        //Grid panel de escala
        var gpEscala = new Ext.grid.GridPanel({
            id: 'gpescala' + self.id,
            border: true,
            region: 'center',
            height: 300,
            width: 435,
            margins: '5 5 5 5',
            cm: new Ext.grid.ColumnModel([expanderescala, {
                id: 'expandires',
                header: self.labels.lbDenominacionEscala,
                width: 80,
                sortable: true,
                dataIndex: 'denom'
            }, {
                header: "Idescala",
                hidden: true,
                dataIndex: 'idescala'
            }
            ]),
            stripeRows: true,
            split: true,
            autoScroll: true,
            store: st_escala,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    selectionchange: {
                        fn: function (sm) {
                            if (sm.hasSelection()) {
                                btnAceptar.enable();
                            }
                            else {
                                btnAceptar.disable();
                            }
                        }
                    }
                }
            }),
            loadMask: {
                msg: self.labels.lbGridLoadMask
            },
            autoExpandColumn: 'expandires',
            plugins: expanderescala,
            region: 'center',
            tbar: [self.labels.lbFindEscala, this.bucar],
            bbar: ptwescala
        });

        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelar.handler();
                }
            }
        ];
        this.items = [gpEscala];
        this.buttons = [btnCancelar, btnAceptar];
        this.on('show', function () {
            st_escala.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            btnAceptar.focus();
        }, this);
        Ext.components.Evaluaciones.WinEscala.superclass.initComponent.call(this);
    }
})
;
