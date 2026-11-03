/**
 Uso:Componente para la configuracion de los periodos para la clasificacion ABC y su análisis.

 * ---------------------------------------------

 * 25 de Marzo 2020 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc.config');
Ext.QuickTips.init();

Ext.log.abc.config.PeriodosClasificacionABC = Ext.extend(Ext.Panel, {
    id: 'PeriodosClasificacionABC-3',
    title: 'Per&iacute;odos clasificaci&oacute;n ABC',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'fit'),
    frame: false,
    border: false,
    perfil: this.perfil,
    idioma: this.idioma,
    closable: true,
    initComponent: function () {
        var self = this;
        var seleccion = null;
        var aplicar = 1;
        var modo = 'ADD';

        this.limpiarFormulario = function () {
            self.dfFechainicio.setValue(new Date().format('d/m/Y'));
            self.dfFechafin.setValue('');
            self.dfFechainicio.focus();
            self.chbAnalizar.setValue(false);
            self.smchbNaturalezas.clearSelections();
            self.smchbDepositos.clearSelections();
        }

        this.btnAdicionarPeriodos = new Ext.Button({
            id: 'btnAdicionarPeriodos',
            iconCls: 'adicionar',
            text: this.idioma.lbAdicionar,
            tooltip: this.idioma.lbDescripcionAdicionarPeriodos,
            handler: function () {
                seleccion = null;
                modo = 'ADD';
                self.winPeriodos.setTitle(self.idioma.lbAdicionarPeriodos);
                self.winPeriodos.show();
                self.btnAplicarPeriodos.show();
            }

        });

        this.btnModificarPeriodos = new Ext.Button({
            id: 'btnModificarPeriodos',
            iconCls: 'modificar',
            disabled: true,
            text: this.idioma.lbModificar,
            tooltip: this.idioma.lbDescripcionModificarPeriodos,
            handler: function () {
                modo = 'MOD';
                seleccion = self.smPeriodos.getSelected();
                self.winPeriodos.setTitle(self.idioma.lbModificarPeriodos);
                self.winPeriodos.show();
                self.dfFechainicio.setValue(seleccion.data.fechainicio);
                self.dfFechafin.setValue(seleccion.data.fechafin);
                var analizar = false;
                if(seleccion.data.analizar == 1){
                    analizar = true;
                }
                self.chbAnalizar.setValue(analizar);
                var arrNat = Ext.decode(seleccion.data.naturalezas);
                var arrIndices = new Array();
                for(var i = 0; i < arrNat.length; i++) {
                    arrIndices.push(self.stNaturalezas.getById(arrNat[i]));
                }
                self.smchbNaturalezas.selectRecords(arrIndices, true);

                var arrDep = Ext.decode(seleccion.data.depositos);
                var arrIndicesD = new Array();
                if (arrDep != null) {
                    for (var i = 0; i < arrDep.length; i++) {
                        arrIndicesD.push(self.stDepositos.getById(arrDep[i]));
                    }
                    self.smchbDepositos.selectRecords(arrIndicesD, true);
                }

                self.btnAplicarPeriodos.hide();
            }

        });

        this.btnEliminarPeriodos = new Ext.Button({
            id: 'btnEliminarPeriodos',
            iconCls: 'eliminar',
            disabled: true,
            text: this.idioma.lbEliminar,
            tooltip: this.idioma.lbDescripcionEliminarPeriodos,
            handler: function () {
                mostrarMensaje(2, self.idioma.lbEliminarPeriodos, function (btn) {
                    if (btn == "ok") {
                        if (seleccion != null) {
                            Ext.Ajax.request({
                                url: 'eliminarConfiguracion',
                                method: 'POST',
                                params: {tipo: 3, id: seleccion.data.idconfperiodosclasificacionabc},
                                callback: function (options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    if (responseData.codigo == 1) {
                                        mostrarMensaje(1, self.idioma.lbMsgCorrectoEliminadoPeriodos);
                                        self.stPeriodos.removeAll();
                                        self.stPeriodos.load();

                                    } else {
                                        mostrarMensaje(3, responseData.mensaje);
                                    }
                                }
                            });
                        } else {
                            mostrarMensaje(3, self.idioma.lbdebeseleccionarperiodos);

                        }
                    }
                });
            }

        });

        this.dfFechainicio = new Ext.form.DateField({
            id: 'dffechainicio'+self.id,
            fieldLabel: self.idioma.lbFechainicio,
            name: 'fechainicio',
            allowBlank: false,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            value: new Date().format('d/m/Y'),
            blankText: this.idioma.lbestecampoobligatorio,
            invalidText: this.idioma.lbestecampoobligatorio,
            anchor: '98%'
        });

        this.dfFechafin = new Ext.form.DateField({
            id: 'dffechafin'+self.id,
            fieldLabel: self.idioma.lbFechafin,
            name: 'fechafin',
            allowBlank: false,
            format: 'd/m/Y',
            editable: true,
            readOnly: false,
            blankText: self.idioma.lbestecampoobligatorio,
            invalidText: self.idioma.lbestecampoobligatorio,
            anchor: '98%'
        });

        this.chbAnalizar = new Ext.form.Checkbox({
            id: 'chbAnalizar'+self.id,
            boxLabel: self.idioma.lbAnalizar,
            hideLabel: true,
            bottonAlign: 'center',
            name: 'analizar', anchor: '98%',
            prevTab: 'dffechafin', nextTab: 'dffechainicio'

        });

        this.smchbNaturalezas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
        });

        this.stNaturalezas = new Ext.data.Store({
            url: 'obtenerNaturalezas',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idnaturaleza"},
                [
                    {name: 'idnaturaleza'},
                    {name: 'denominacion'}
                ])
        });

        this.stNaturalezas.load();

        this.gpNaturalezas = new Ext.grid.GridPanel({
            id: 'gpNaturalezas'+self.id,
            layout: 'fit',
            height: 300,
            anchor: '98%',
            title: self.idioma.lbNaturalezas,
            region: 'center',
            columns: [self.smchbNaturalezas, {
                header: 'idnaturaleza',
                hidden: true,
                hideable: false,
                dataIndex: 'idnaturaleza'
            }, {header: 'Naturaleza', width: 150, sortable: true, dataIndex: 'denominacion'}
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            hideBorders: false,
            viewConfig: {forceFit: true},
            store: self.stNaturalezas,
            sm: self.smchbNaturalezas,
            loadMask: {msg: self.idioma.lbCargando}
        });


        this.smchbDepositos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.stDepositos = new Ext.data.GroupingStore({
            url: 'cargardepositos',
            groupField:'ueb',
            sortInfo:{field: 'ueb', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddeposito"},
                [
                    {name: 'iddeposito'},
                    {name: 'deposito'},
                    {name: 'idueb'},
                    {name: 'ueb'}
                ])
        });

        this.stDepositos.load();

        this.tfBuscarDepositos = new Ext.form.TextField({
            maxLength: 255,
            minLength: 2
        });

        this.btnBuscarDeposito = new Ext.Button({
            id: 'btnBuscarDeposito',
            iconCls: 'buscar',
            handler: function () {
                if(this.tfBuscarDepositos.isValid()){
                    if(this.tfBuscarDepositos.getValue() == ''){
                        this.stDepositos.clearFilter();
                    }else{
                        this.stDepositos.filter('deposito', this.tfBuscarDepositos.getValue());
                    }

                }
            }.createDelegate(this)

        });

        this.btnLimpiarDeposito = new Ext.Button({
            id: 'btnLimpiarDeposito',
            iconCls: 'limpiar',
            handler: function () {
                this.stDepositos.clearFilter();
            }.createDelegate(this)

        });

        this.gpDepositos = new Ext.grid.GridPanel({
            id: 'gpDepositos'+self.id,
            layout: 'fit',
            height: 300,
            anchor: '98%',
            title: self.idioma.lbDepositos,
            region: 'center',
            columns: [self.smchbDepositos, {
                header: 'iddeposito',
                hidden: true,
                hideable: false,
                dataIndex: 'iddeposito'
            }
            , {header: 'Dep&oacute;sito', width: 150, sortable: true, dataIndex: 'deposito'}
            , {header: 'UEB', width: 150, sortable: true, dataIndex: 'ueb',hidden: true, hideable: false}
            , {header: 'idueb', width: 50, sortable: true, dataIndex: 'idueb',hidden: true, hideable: false}
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            hideBorders: false,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{text}'
            }),
            store: this.stDepositos,
            sm: self.smchbDepositos,
            loadMask: {msg: self.idioma.lbCargando},
            tbar: [this.tfBuscarDepositos, '', this.btnBuscarDeposito, this.btnLimpiarDeposito]
        });


        this.fpPeriodos = new Ext.form.FormPanel({
            id: 'fpPeriodos',
            labelAlign: 'top',
            frame: true,
            width: 800,
            autoHeight: true,
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .3, layout: 'form', items: [this.dfFechainicio]},
                    {columnWidth: .3, layout: 'form', items: [this.dfFechafin]},
                    {columnWidth: .4, layout: 'form', items: [{
                            xtype: 'fieldset',
                            title: '',
                            height: 45,
                            anchor: '98%',
                            region: 'center',
                            items: [this.chbAnalizar]
                        }]},
                ]
            },{
                layout: 'column',
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.gpNaturalezas]},
                    {columnWidth: .5, layout: 'form', items: [this.gpDepositos]},
                ]
            }]
        });


        this.btnCancelarPeriodos = new Ext.Button({
            id: 'btnCancelarPeriodos',
            iconCls: 'cancelar',
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbDescripcionCancelar,
            prevTab: 'nfPeso',
            nextTab: 'btnAplicarPeriodos',
            handler: function () {
                self.winPeriodos.hide();
            }
        });

        this.btnAplicarPeriodos = new Ext.Button({
            id: 'btnAplicarPeriodos',
            iconCls: 'aplicar',
            text: this.idioma.lbAplicar,
            tooltip: this.idioma.lbDescripcionAplicar,
            prevTab: 'btnCancelarPeriodos',
            nextTab: 'btnAceptarPeriodos',
            handler: function () {
                aplicar = 1;
                self.addmodPeriodo();
            }
        });

        this.btnAceptarPeriodos = new Ext.Button({
            id: 'btnAceptarPeriodos',
            iconCls: 'aceptar',
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbDescripcionAceptar,
            prevTab: 'btnAplicarPeriodos',
            nextTab: 'cbClasificacionABC',
            handler: function () {
                aplicar = 2;
                self.addmodPeriodo();
            }
        });

        this.winPeriodos = new Ext.Window({
            title: this.idioma.lbAdicionarPeriodos,
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: true,
            layout: 'fit',
            items: [this.fpPeriodos],
            buttons: [this.btnCancelarPeriodos, this.btnAplicarPeriodos, this.btnAceptarPeriodos],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarPeriodos.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarPeriodos.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarPeriodos.handler();
                    }
                }
            ],
            listeners: {
                show: function () {
                    self.limpiarFormulario();
                    self.gpNaturalezas.doLayout();
                    self.gpDepositos.doLayout();
                    if(seleccion != null) {
                        var arrNat = Ext.decode(seleccion.data.naturalezas);
                        var arrIndices = new Array();
                        if (arrNat != null) {
                            for (var i = 0; i < arrNat.length; i++) {
                                arrIndices.push(self.stNaturalezas.getById(arrNat[i]));
                            }
                            this.smchbNaturalezas.selectRecords(arrIndices, true);
                        }

                        var arrDep = Ext.decode(seleccion.data.depositos);
                        var arrIndicesD = new Array();
                        if (arrDep != null) {
                            for (var i = 0; i < arrDep.length; i++) {
                                arrIndicesD.push(self.stDepositos.getById(arrDep[i]));
                            }
                            this.smchbDepositos.selectRecords(arrIndicesD, true);
                        }

                    }
                }.createDelegate(this)
            }
        });


        this.cmPeriodos = new Ext.grid.ColumnModel([
            {
                header: "idconfperiodosclasificacionabc",
                dataIndex: 'idconfperiodosclasificacionabc',
                hidden: true,
                hideable: false,
                width: 50
            },{
                header: "naturalezas",
                dataIndex: 'naturalezas',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "Fecha inicio",
                dataIndex: 'fechainicio',
                width: 100
            }, {
                header: "Fecha fin",
                dataIndex: 'fechafin',
                width: 100
            }, {
                header: "Analizar",
                dataIndex: 'analizar',
                width: 50,
                renderer:  function(val){
                    if(val == 1){
                        return 'Si';
                    }else {
                        return 'No';
                    }
                }
            }, {
                header: "Naturalezas",
                dataIndex: 'denominacionnaturalezas',
                width: 400
            }, {
                header: "Depositos",
                dataIndex: 'depositos',
                width: 400,
                hidden: true,
                hideable: false
            }
        ]);

        this.stPeriodos = new Ext.data.Store({
            url: '/logistica/inventario/abc/index.php/configabc/obtenerPeriodosClasificacionABC',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idconfperiodosclasificacionabc"},
                [
                    {name: 'idconfperiodosclasificacionabc'},
                    {name: 'naturalezas'},
                    {name: 'fechainicio'},
                    {name: 'fechafin'},
                    {name: 'analizar'},
                    {name: 'denominacionnaturalezas'},
                    {name: 'depositos'}
                ])
        });

        this.smPeriodos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.smPeriodos.on('rowselect', function (sm, index, store) {
            self.btnModificarPeriodos.enable();
            self.btnEliminarPeriodos.enable();
            seleccion = self.stPeriodos.getAt(index);
        });

        this.smPeriodos.on('rowdeselect', function (sm, index, store) {
            self.btnModificarPeriodos.disable();
            self.btnEliminarPeriodos.disable();
            seleccion = null;
        });

        this.gpPeriodos = new Ext.grid.GridPanel({
            layout: 'fit',
            store: this.stPeriodos,
            autoScroll: true,
            autoFit: true,
            stripeRows: true,
            cm: this.cmPeriodos,
            sm: this.smPeriodos,
            width: 350,
            height: 250,
            border: false,
            forceFit: true,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'}
        });

        this.addmodPeriodo = function () {
            if (self.fpPeriodos.getForm().isValid()) {
                var datos = {idconfperiodosclasificacionabc: -1, fechainicio: '', fechafin: '', analizar: 0, naturalezas: []};
                var arrNatMod = self.smchbNaturalezas.getSelections();
                if(arrNatMod.length <= 0){
                    mostrarMensaje(3,'Debe seleccionar al menos una naturaleza.');
                    return;
                }
                var arrNaturalezas = new Array();
                for(var i = 0; i < arrNatMod.length; i++){
                    arrNaturalezas.push(arrNatMod[i].data.idnaturaleza);
                }

                var arrDep = self.smchbDepositos.getSelections();
                if(arrDep.length <= 0){
                    mostrarMensaje(3,'Debe seleccionar al menos un dep&oacute;sito.');
                    return;
                }
                var arrDepositos = new Array();
                var arrUebs = new Array();
                for(var i = 0; i < arrDep.length; i++){
                    arrDepositos.push(arrDep[i].data.iddeposito);
                    arrUebs.push(arrDep[i].data.idueb);
                }

                if (modo == 'ADD') {
                    datos.fechainicio = self.dfFechainicio.getValue().format('Y-m-d');
                    datos.fechafin = self.dfFechafin.getValue().format('Y-m-d');
                    datos.analizar = self.chbAnalizar.getValue();

                } else {
                    datos.fechainicio = self.dfFechainicio.getValue().format('Y-m-d');
                    datos.fechafin = self.dfFechafin.getValue().format('Y-m-d');
                    datos.idconfperiodosclasificacionabc = seleccion.data.idconfperiodosclasificacionabc;
                    datos.analizar = self.chbAnalizar.getValue();
                }
                datos.naturalezas = arrNaturalezas;
                datos.depositos = '';
                datos.uebs = '';
                if(arrDepositos.length > 0){
                    datos.depositos = arrDepositos;
                    datos.uebs = arrUebs;
                }
                self.fpPeriodos.getForm().submit({
                    url: 'salvarConfiguracion',
                    waitMsg: self.idioma.lbMsgSalvandoRelacionador,
                    method: 'POST',
                    params: {
                        tipo: 3,
                        datos: Ext.encode(datos)
                    },
                    success: function (form, action) {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, 'Los datos han sido salvados satisfactoriamente.');
                        if (aplicar != 1) {
                            self.winPeriodos.hide();
                            seleccion = null;
                        } else {
                            self.limpiarFormulario();
                            aplicar = 1;
                        }
                        self.stPeriodos.removeAll();
                        self.stPeriodos.load();
                    },

                    failure: function (form, action) {
                        Ext.getBody().unmask();
                        var respuesta = Ext.decode(action.response.responseText);
                        if (respuesta.codigo == 2) {
                            mostrarMensaje(3, self.idioma.lbexiste);
                        } else {
                            mostrarMensaje(3, respuesta.mensaje);
                        }
                    }
                });
            }
        }


        this.stPeriodos.load();

        this.tbar = [this.btnAdicionarPeriodos, this.btnModificarPeriodos, this.btnEliminarPeriodos];

        this.items = [this.gpPeriodos];
        Ext.log.abc.config.PeriodosClasificacionABC.superclass.initComponent.call(this);
        self.winPeriodos.show();
        self.winPeriodos.hide();
    }
});
