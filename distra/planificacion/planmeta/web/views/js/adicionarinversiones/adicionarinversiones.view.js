
Ext.ns('Gestionar.adicionarinversiones');
//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;

Gestionar.adicionarinversiones.View = Ext.extend(Ext.Window, {
    constructor: function(argument) {
        Ext.applyIf(this, argument);
        idioma = argument.idioma;
        Gestionar.adicionarinversiones.View.superclass.constructor.call(this);

        var modelo = Gestionar.adicionarinversiones.Modelo;
        modelo.init();

        this.init(idioma, modelo);

        Gestionar.adicionarinversiones.Controller.init(idioma, this, modelo);

        return this;
    },
    init: function(idioma, modelo) {
        _this.tfdenominacion = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfdenominacion',
            width: 160,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: idioma.tlAlfanume,
            align: 'right',
            allowBlank: false,
            //anchor: '100%',
            //fieldLabel: idioma.tlDenom
            fieldLabel: 'prueba'
        });

        _this.CmbFormaDePropiedad = new Ext.form.ComboBox({
            id: 'idCmbFormaDePropiedad',
            width: 160,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlFormProp
        });

        _this.CmbObjetivo = new Ext.form.ComboBox({
            id: 'idCmbObjetivo',
            width: 160,
            align: 'right',
            mode: 'local',
            store: modelo.stObjetivo,
            valueField: 'idobjetivo',
            displayField: 'denominacion',
            allowBlank: false,
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlObjet
        });

        _this.cmbClasificacion = new Ext.form.ComboBox({
            id: 'idcmbClasificacion',
            width: 160,
            align: 'right',
            valueField: 'idtipoinversion',
            displayField: 'denominacion',
            store: modelo.stClasificacion,
            allowBlank: false,
            mode: 'local',
            typeAhead: true,
            selectOnFocus: false,
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlClasif
        });

        _this.tfProvincia = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfProvincia',
            width: 160,
            align: 'right',
            allowBlank: false,
            editable: false,
            readOnly: true,
            fieldLabel: idioma.tlProv
        });

        _this.CmbEfectoEnComercio = new Ext.form.ComboBox({
            id: 'idCmbEfectoEnComercio',
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stEfecto,
            valueField: 'idefectocomercial',
            displayField: 'denominacion',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlComercioext
        });

        _this.CmbTipoInversion = new Ext.form.ComboBox({
            id: 'idCmbTipoInversion',
            width: 160,
            align: 'right',
            allowBlank: false,
            store: modelo.stTipoInversion,
            valueField: 'idtipoinversionprograma',
            displayField: 'denominacion',
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlTipInvProg
        });

        _this.tfFechaInicio = new Ext.form.DateField({
            id: 'idFechaInicio',
            width: 160,
            align: 'right',
            allowBlank: false,
            readOnly: true,
            endDateField: 'idFechaFin',
            fieldLabel: idioma.tlFechaIn

        });

        _this.ChkFastTrack = new Ext.form.Checkbox({
            id: 'idFasttrack',
            width: 160,
            align: 'right',
            allowBlank: false,
            fieldLabel: idioma.tlFasttrack,
            disabled: true
        });

        _this.CmbCaracteristica = new Ext.form.ComboBox({
            id: 'idCmbCaracteristica',
            width: 160,
            align: 'right',
            allowBlank: true,
            store: modelo.stCaracteristica,
            valueField: 'idcaracteristica',
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlCaract
        });

        _this.tfFechaFin = new Ext.form.DateField({
            id: 'idFechaFin',
            width: 160,
            align: 'right',
            allowBlank: false,
            readOnly: true,
            fieldLabel: idioma.tlFechaFi

        });

        _this.fmAdicionarInversion = new Ext.form.FormPanel({
            width: 800,
            height: 160,
            region: 'north',
            frame: true,
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.tfdenominacion, _this.CmbFormaDePropiedad, _this.CmbObjetivo]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.cmbClasificacion, _this.tfProvincia, _this.CmbEfectoEnComercio]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbTipoInversion, _this.tfFechaInicio, _this.ChkFastTrack]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbCaracteristica, _this.tfFechaFin]
                        }
                    ]
                }
            ]
        });

        _this.sm_presupuesto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.btnAdicionarPresupuesto = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarPresupuesto',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: idioma.btnAdd,
            text: idioma.btnAdd
        });

        _this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEliminar',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: idioma.btnEliminar,
            text: idioma.btnEliminar
        });

        _this.grid_Presupuesto = new Ext.grid.EditorGridPanel({
            title: 'Presupuesto de anteproyecto',
            frame: true,
            height: 150,
            width: 800,
            region: 'center',
            sm: _this.sm_presupuesto,
            store: modelo.stPresupuesto,
            tbar: [_this.btnAdicionarPresupuesto, _this.btnEliminar],
            columns: [{
                    header: idioma.tlValor,
                    dataIndex: 'valor',
                    width: 200,
                    id: 'grid_Presupuesto',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: idioma.tlmoneda,
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]
        });

        _this.sm_financiamiento = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.btnAdicionarFinan = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarFinan',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: idioma.btnAdd,
            text: idioma.btnAdd
        });

        _this.btnEliminarFinan = new Ext.Button({
            disabled: true,
            id: 'btnEliminarFinan',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: idioma.btnEliminar,
            text: idioma.btnEliminar
        });

        _this.grid_Financiamiento = new Ext.grid.EditorGridPanel({
            title: 'Financiamiento',
            frame: true,
            sm: _this.sm_financiamiento,
            height: 150,
            width: 800,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            region: 'south',
            //autoExpandColumn: 'idtipo',
            store: modelo.store_Financiamiento,
            tbar: [_this.btnAdicionarFinan, _this.btnEliminarFinan],
            columns: [{
                    header: idioma.tlTipFinanc,
                    dataIndex: 'tipo',
                    id: 'idtipo',
                    width: 300,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idtipofinanciamiento',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idtipofinanciamiento',
                        displayField: 'denominaciontipo',
                        //renderer: crearToolTip,
                        store: modelo.stTipoFinan
                    })
                }, {
                    header: "Financista",
                    tooltip: 'Financista',
                    dataIndex: 'financi',
                    width: 300,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idfinancista',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idfinancista',
                        displayField: 'denominaciontipo',
                        //renderer: crearToolTip,
                        store: modelo.stFinancista
                    })
                }, {
                    header: idioma.tlValor,
                    dataIndex: 'valor',
                    width: 200,
                    id: 'grid_Presupuesto',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                }, {
                    header: idioma.tlmoneda,
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        store: modelo.stMonedas
                    })
                }]
        });

        _this.pPrincipal = new Ext.Panel({
            height: 600,
            layout: 'border',
            items: [_this.fmAdicionarInversion, _this.grid_Presupuesto, _this.grid_Financiamiento]
        });


        _this.win_add_inversiones = {
            title: idioma.tlAddInv,
            width: 800,
            height: 550,
            layout: 'fit',
            closeAction: 'hide',
            resizable: false,
            modal: true,
            items: _this.pPrincipal,
            buttons: [_this.btnCancelarAddinversion = new Ext.Button({
                    id: 'btnCancelarAddinversion',
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: idioma.toolTipCancelar,
                    text: idioma.btnCancelar

                }), _this.btnAplicarAddinversion = new Ext.Button({
                    id: 'btnAplicarAddinversion',
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    tooltip: idioma.btnTooAplicar,
                    text: idioma.btnAplicar,
                    disable: false
                }), _this.btnAceptarAddinversion = new Ext.Button({
                    id: 'btnAceptarAddinversion',
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    tooltip: idioma.toolTipAceptar,
                    text: idioma.btnAceptar,
                    disable: false
                })]

        };

        Ext.apply(this, Ext.apply(this.initialConfig, _this.win_add_inversiones));
        Gestionar.adicionarinversiones.View.superclass.initComponent.apply(this, arguments);

    }
});