/**
 Uso:Componente para recalcular el presupuesto.

 * ---------------------------------------------

 * 01 de Marzo 2021 |   ABC
 *

 * @extends Ext.Window
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc');
Ext.QuickTips.init();

Ext.log.abc.RecalcularPresupuesto = Ext.extend(Ext.Window, {
    id: 'RecalcularPresupuesto-1',
    title: 'Recalcular presupuesto',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    modal: true,
    height: 500,
    width: 900,
    closable: true,
    idconf: this.idconf,
    presupuesto: this.presupuesto,
    initComponent: function () {
        var self = this;

        this.smNat = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stNat = new Ext.data.Store({
            url: 'obtenerNaturalezasReparametrizar',
            sortInfo:{field: 'naturaleza', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idnaturaleza"},
                [
                    {name: 'idnaturaleza'},
                    {name: 'naturaleza'},
                    {name: 'presupuestoplan'},
                    {name: 'presupuesto'}
                ])
        });

        this.gpNat = new Ext.grid.EditorGridPanel({
            id: 'gpNat',
            layout: 'fit',
            height: 500,
            split:true,
            width: 500,
            region: 'center',
            columns: [{
                header: 'idnaturaleza',
                hidden: true,
                hideable: false,
                dataIndex: 'idnaturaleza'
            }, {header: 'Naturaleza', width: 250, sortable: true, dataIndex: 'naturaleza'}
             , {header: 'Presupuesto planificado', width: 100, sortable: true, dataIndex: 'presupuestoplan', align: 'center'}
             , {header: 'Presupuesto real', width: 100, sortable: true, dataIndex: 'presupuesto', align:'center',
                    editor: new Ext.form.NumberField({
                        allowBlank: true,
                        anchor: '100%',
                        allowDecimals: true,
                        decimalPrecision: 2,
                        decimalSeparator: ',',
                        emptyText: 'Presupuesto...',
                        allowNegative: false,
                        maxValue: 1000000000,
                        minValue: 0
                    })}
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            hideBorders: false,
            viewConfig: {forceFit: true},
            store: this.stNat,
            sm: self.smNat,
            loadMask: {msg: 'Cargando...'}
        });
        this.rbTodos = new Ext.form.Radio({
            id: 'rbTodos',
            boxLabel: 'Recalcular para todos (Garantiza variedad)',
            checked: true,
            inputValue: 1,
            listeners: {
                check: function (comp, checked) {
                    self.rbPriorizados.suspendEvents();
                    self.rbPriorizados.setValue(false);
                    self.rbPriorizados.resumeEvents();
                }
            }
        });

        this.rbPriorizados = new Ext.form.Radio({
            id: 'rbPriorizados',
            boxLabel: 'Recalcular para los m&aacute;s vendidos (Garantiza calidad)',
            checked: false,
            inputValue: 2,
            listeners: {
                check: function (comp, checked) {
                    self.rbTodos.suspendEvents();
                    self.rbTodos.setValue(false);
                    self.rbTodos.resumeEvents();
                }
            }
        });

        this.items = [this.gpNat,
            new Ext.FormPanel({
                region: 'north',
                height: 50,
                frame: true,
                items: [new Ext.form.RadioGroup({
                    columns: 2,
                    inputType: 'radio',
                    value: 1,
                    items: [this.rbTodos, this.rbPriorizados]
                })]

            })
            ];

        this.btnCancelarRecPres = new Ext.Button({
            id: 'btnCancelarRecPres',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cierra la ventana.',
            handler: function () {
                self.close();
            }
        });

        this.btnAceptarRecPres = new Ext.Button({
            id: 'btnAceptarRecPres',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            handler: function () {
                var pre = 0;
                var recalculo = 1;
                if(self.rbPriorizados.getValue()){
                    recalculo = 2;
                }else if(self.rbTodos.getValue()){
                    recalculo = 1;
                }

                var arrMod = self.stNat.getModifiedRecords();
                if (arrMod.length > 0) {
                    var arr = new Array();
                    for (var i = 0; i < arrMod.length; i++) {
                        arr.push(arrMod[i].data);
                        pre += arrMod[i].data.presupuesto;
                    }
                    if(pre <= self.presupuesto) {
                        var mascara = new Ext.LoadMask(Ext.getBody(), {
                            msg: 'Recalculando presupuesto. Por favor espere...'
                        });
                        //mascara.show();
                        Ext.Ajax.request({
                            url: 'recalcularPresupuesto',
                            method: 'POST',
                            timeout: 300000,
                            params: {
                                idconf: self.idconf,
                                presupuestos: Ext.encode(arr),
                                recalculo: recalculo
                            },
                            callback: function (options, success, response) {
                                mascara.hide();
                                var obj = Ext.decode(response.responseText);

                                if (obj.codigo == 1) {
                                    mostrarMensaje(1, 'El presupuesto ha sido recalculado satisfactoriamente.');
                                    self.fireEvent('recalcular', obj);
                                    self.close();
                                } else {
                                    mostrarMensaje(3, obj.mensaje);
                                }
                            }.createDelegate(this)
                        });
                    }else{
                        mostrarMensaje(3, 'El desglose de presupuesto debe ser menor o igual al presupuesto planificado.');
                    }
                }else{
                    mostrarMensaje(3, 'Debe introducir al menos un presupuesto.');
                }
            }
        });

        this.buttons = [this.btnCancelarRecPres, this.btnAceptarRecPres];

        Ext.log.abc.RecalcularPresupuesto.superclass.initComponent.call(this);
        this.stNat.load({params:{
                idconf: self.idconf
        }});
    }
});
