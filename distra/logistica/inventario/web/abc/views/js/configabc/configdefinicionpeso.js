/**
 Uso:Componente para la configuracion de los pesos por Clasificacion ABC y por Criterios de valoracion.

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

Ext.log.abc.config.DefinicionPeso = Ext.extend(Ext.Panel, {
    id: 'DefinicionPeso-2',
    title: 'Definir pesos',
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

        this.limpiarFormulario = function(){
            self.cbClasificacionABC.setValue('');
            self.cbCriteriosValoracion.setValue('');
            self.nfPeso.setValue('');
            self.cbClasificacionABC.focus();
        }

        this.btnAdicionarDefinicionPeso = new Ext.Button({
            id: 'btnAdicionarDefinicionPeso',
            iconCls: 'adicionar',
            text: this.idioma.lbAdicionar,
            tooltip: this.idioma.lbDescripcionAdicionar,
            handler: function () {
                seleccion = null;
                modo = 'ADD';
                self.winDefinicionPeso.setTitle(self.idioma.lbAdicionarPeso);
                self.winDefinicionPeso.show();
                self.limpiarFormulario();
                self.btnAplicarDefinicionPeso.show();
            }

        });

        this.btnModificarDefinicionPeso = new Ext.Button({
            id: 'btnModificarDefinicionPeso',
            iconCls: 'modificar',
            disabled: true,
            text: this.idioma.lbModificar,
            tooltip: this.idioma.lbDescripcionModificar,
            handler: function () {
                modo = 'MOD';
                self.winDefinicionPeso.setTitle(self.idioma.lbModificarPeso);
                self.winDefinicionPeso.show();
                self.limpiarFormulario();
                self.cbClasificacionABC.setValue(seleccion.data.idclasificacionabc);
                self.cbCriteriosValoracion.setValue(seleccion.data.idcriteriovaloracion);
                self.nfPeso.setValue(seleccion.data.peso);
                self.btnAplicarDefinicionPeso.hide();

            }.createDelegate(this)

        });

        this.btnEliminarDefinicionPeso = new Ext.Button({
            id: 'btnEliminarDefinicionPeso',
            iconCls: 'eliminar',
            disabled: true,
            text: this.idioma.lbEliminar,
            tooltip: this.idioma.lbDescripcionEliminar,
            handler: function () {
                mostrarMensaje(2, this.idioma.lbEliminarDefinicionPeso, function (btn) {
                    if (btn == "ok") {
                        if(seleccion != null) {
                            Ext.Ajax.request({
                                url: 'eliminarConfiguracion',
                                method: 'POST',
                                params: {tipo: 2, id: seleccion.data.iddefinicionpeso},
                                callback: function (options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    if (responseData.codigo == 1) {
                                        //Mostrando el mensaje de que se ha eliminado el concepto.
                                        mostrarMensaje(1, self.idioma.lbMsgCorrectoEliminadoDefinicionPeso);
                                        //Recargando el grid de concepto.
                                        self.stDefinicionPeso.removeAll();
                                        self.stDefinicionPeso.load();

                                    } else {
                                        mostrarMensaje(3, responseData.mensaje);
                                    }
                                }
                            });
                        }else{
                            mostrarMensaje(3, self.idioma.lbdebeseleccionar);

                        }
                    }
                });
            }.createDelegate(this)

        });

        this.stClasificacionABC = new Ext.data.Store({
            url: 'obtenerClasificacionABC',
            reader: new Ext.data.JsonReader(
                {
                    autoLoad: true,
                    root: "datos",
                    id: "idclasificacionabc"
                },
                    [
                    {name: 'idclasificacionabc'},
                        {name: 'denominacion'}

                    ])
        });

        this.cbClasificacionABC = new Ext.form.ComboBox({
            id: 'cbClasificacionABC',
            fieldLabel: this.idioma.lbClasificacionABC,
            valueField: 'idclasificacionabc',
            displayField: 'denominacion',
            hiddenName: 'idclasificacionabc',
            allowBlank: false,
            mode: 'local',
            anchor: '100%',
            store: this.stClasificacionABC,
            emptyText: 'Seleccione...',
            blankText: this.idioma.lbestecampoobligatorio,
            readOnly: true,
            triggerAction: 'all'
        });

        this.stCriteriosValoracion = new Ext.data.Store({
            url: 'obtenerCriteriosValoracion',
            reader: new Ext.data.JsonReader(
                {
                    autoLoad: true,
                    root: "datos",
                    id: "idcriteriovaloracion"
                },
                [
                    {name: 'idcriteriovaloracion'},
                    {name: 'denominacion'}
                ])
        });

        this.cbCriteriosValoracion = new Ext.form.ComboBox({
            id: 'cbCriteriosValoracion',
            fieldLabel: this.idioma.lbCriteriosValoracion,
            valueField: 'idcriteriovaloracion',
            displayField: 'denominacion',
            hiddenName: 'idcriteriovaloracion',
            allowBlank: false,
            mode: 'local',
            anchor: '100%',
            store: this.stCriteriosValoracion,
            emptyText: 'Seleccione...',
            blankText: this.idioma.lbestecampoobligatorio,
            readOnly: true,
            triggerAction: 'all'
        });

        this.nfPeso = new Ext.form.NumberField({
            id: 'nfPeso',
            fieldLabel: this.idioma.lbPeso,
            allowBlank: false,
            anchor: '100%',
            allowDecimals: true,
            decimalPrecision: 4,
            allowNegative: false,
            maxValue: 1,
            minValue: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });


        this.fpDefinicionPeso = new Ext.form.FormPanel({
            id: 'fpDefinicionPeso',
            labelAlign: 'top',
            frame: true,
            width: 250,
            autoHeight: true,
            items: [this.cbClasificacionABC, this.cbCriteriosValoracion, this.nfPeso]
        });


        this.btnCancelarDefinicionPeso = new Ext.Button({
            id: 'btnCancelarDefinicionPeso',
            iconCls: 'cancelar',
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbDescripcionCancelar,
            prevTab: 'nfPeso',
            nextTab: 'btnAplicarDefinicionPeso',
            handler: function () {
                self.winDefinicionPeso.hide();
            }
        });

        this.btnAplicarDefinicionPeso = new Ext.Button({
            id: 'btnAplicarDefinicionPeso',
            iconCls: 'aplicar',
            text: this.idioma.lbAplicar,
            tooltip: this.idioma.lbDescripcionAplicar,
            prevTab: 'btnCancelarDefinicionPeso',
            nextTab: 'btnAceptarDefinicionPeso',
            handler: function () {
                aplicar = 1;
                self.addmodPeso();
            }
        });

        this.btnAceptarDefinicionPeso = new Ext.Button({
            id: 'btnAceptarDefinicionPeso',
            iconCls: 'aceptar',
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbDescripcionAceptar,
            prevTab: 'btnAplicarDefinicionPeso',
            nextTab: 'cbClasificacionABC',
            handler: function () {
                aplicar = 2;
                self.addmodPeso();
            }
        });

        this.winDefinicionPeso = new Ext.Window({
            title: this.idioma.lbAdicionarPeso,
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.fpDefinicionPeso],
            buttons: [this.btnCancelarDefinicionPeso, this.btnAplicarDefinicionPeso, this.btnAceptarDefinicionPeso],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarDefinicionPeso.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarDefinicionPeso.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarDefinicionPeso.handler();
                    }
                }
            ]
        });


        this.cmDefinicionPeso = new Ext.grid.ColumnModel([
            {
                header: "iddefinicionpeso",
                dataIndex: 'iddefinicionpeso',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "idclasificacionabc",
                dataIndex: 'idclasificacionabc',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "idcriteriovaloracion",
                dataIndex: 'idcriteriovaloracion',
                hidden: true,
                hideable: false,
                width: 50
            }, {
                header: "Clasificaci&oacute;n ABC",
                dataIndex: 'clasificacionabc',
                width: 120
            }, {
                header: "Criterio valoraci&oacute;n",
                dataIndex: 'criteriovaloracion',
                width: 150,
                hidden: true,
                hideable: false,
            }, {
                header: "Peso",
                dataIndex: 'peso',
                width: 100
            }
        ]);

        this.stDefinicionPeso = new Ext.data.GroupingStore({
            url: '/logistica/inventario/abc/index.php/configabc/obtenerDefinicionPeso',
            groupField:'criteriovaloracion',
            sortInfo:{field: 'clasificacionabc', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "iddefinicionpeso"},
                [
                    {name: 'iddefinicionpeso'},
                    {name: 'idclasificacionabc'},
                    {name: 'idcriteriovaloracion'},
                    {name: 'clasificacionabc'},
                    {name: 'criteriovaloracion'},
                    {name: 'peso'}
                ])
        });

        this.smDefinicionPeso  = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.smDefinicionPeso.on('rowselect', function (sm, index, store) {
            self.btnModificarDefinicionPeso.enable();
            self.btnEliminarDefinicionPeso.enable();
            seleccion = self.stDefinicionPeso.getAt(index);
        });

        this.smDefinicionPeso.on('rowdeselect', function (sm, index, store) {
            self.btnModificarDefinicionPeso.disable();
            self.btnEliminarDefinicionPeso.disable();
            seleccion = null;
        });

        this.gpDefinicionPeso = new Ext.grid.GridPanel({
            layout: 'fit',
            store: this.stDefinicionPeso,
            autoScroll: true,
            stripeRows: true,
            cm: this.cmDefinicionPeso,
            sm: this.smDefinicionPeso,
            width: 350,
            height: 250,
            border: false,
            forceFit: true,
            view: new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{text}'
            }),
            hideBorders: true,
            loadMask: {msg: 'Cargando...'}
        });

        this.addmodPeso = function(){
            if(self.fpDefinicionPeso.getForm().isValid()) {
                var datos = {iddefinicionpeso: -1, idclasificacionabc:'', idcriteriovaloracion: '', peso: ''};
                if(modo == 'ADD'){
                    datos.idclasificacionabc = self.cbClasificacionABC.getValue();
                    datos.idcriteriovaloracion = self.cbCriteriosValoracion.getValue();
                    datos.peso = self.nfPeso.getValue();
                }else{
                    datos.idclasificacionabc = self.cbClasificacionABC.getValue();
                    datos.idcriteriovaloracion = self.cbCriteriosValoracion.getValue();
                    datos.peso = self.nfPeso.getValue();
                    datos.iddefinicionpeso = seleccion.data.iddefinicionpeso;
                }
                self.fpDefinicionPeso.getForm().submit({
                    url: 'salvarConfiguracion',
                    waitMsg: self.idioma.lbMsgSalvandoRelacionador,
                    method: 'POST',
                    params: {
                        tipo: 2,
                        datos: Ext.encode(datos)
                    },
                    success: function (form, action) {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, 'Los datos han sido salvados satisfactoriamente.');
                        if(aplicar != 1){
                            self.winDefinicionPeso.hide();
                            seleccion = null;
                        }else{
                            self.limpiarFormulario();
                            aplicar = 1;
                        }
                        self.stDefinicionPeso.removeAll();
                        self.stDefinicionPeso.load();
                    },

                    failure: function (form, action) {
                        Ext.getBody().unmask();
                        var respuesta = Ext.decode(action.response.responseText);
                        if(respuesta.codigo == 2){
                            mostrarMensaje(3, self.idioma.lbexiste);
                        }else{
                            mostrarMensaje(3, respuesta.mensaje);
                        }
                    }
                });
            }
        }


        this.stDefinicionPeso.load();
        this.stClasificacionABC.load();
        this.stCriteriosValoracion.load();

        this.tbar = [this.btnAdicionarDefinicionPeso, this.btnModificarDefinicionPeso, this.btnEliminarDefinicionPeso];

        this.items = [this.gpDefinicionPeso];
        Ext.log.abc.config.DefinicionPeso.superclass.initComponent.call(this);
    }
});
