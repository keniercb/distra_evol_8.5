/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.Banco.WindowCierreNomina
 * @extends Ext.Window
 */
Ext.namespace('Ext.Cont.Banco.WindowCierreNomina');
Ext.Cont.Banco.WindowCierreNomina = Ext.extend(Ext.Window, {
//    Properties and Variables
    constrain: true,
    //Functions
    constructor: function(params) {

//        params.btnaccept = new Ext.Button({
//            id: 'btnaccept' + params.id,
//            text: params.idioma.textbtnAceptar,
//            iconCls: 'aceptar',
//            tooltip: params.idioma.tooltipbtnAceptar,
//            disabled: true
//        });
//
//        params.btnaplicar = new Ext.Button({
//            id: 'btnaplicar' + params.id,
//            text: params.idioma.textbtnAplicar,
//            iconCls: 'aplicar',
//            tooltip: params.idioma.tooltipbtnAplicar,
//            disabled: true
//        });
//
//        params.btncancelar = new Ext.Button({
//            id: 'btncancelar' + params.id,
//            text: params.idioma.textbtnCancelar,
//            iconCls: 'cancelar',
//            tooltip: params.idioma.tooltipbtnCancelar
//        });

        params.stfechacierre = new Ext.data.Store({
            url: 'cargarfechacierrenomina',
            id: 'stfechacierre',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idfechacierrenomina'
            }, [
                {
                    name: 'idfechacierrenomina'
                },
                {
                    name: 'fechacierre'
                }, 
                {
                    name: 'importe'
                },
                {
                    name: 'cargado'
                }
            ]),
            baseParams: {
                idmoneda: params.idmoneda,
                accion: params.accion
            }
        });
        
        params.smfechacierre = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        
        params.gpfechacierre = new Ext.grid.GridPanel({
        frame: false,
        border: false,
        //loadMask: true,
        store: params.stfechacierre,
        region: 'center',
        sm: params.smfechacierre,
        id: 'gpfechacierre',
        stripeRows: true,
        columns: [
            {
                header: 'Fecha cierre',
                width: 100,
                sortable: true,
                dataIndex: 'fechacierre'
            },
            {
                header: 'Importe',
                sortable: true,
                width: 150,
                align: 'right',
                dataIndex: 'importe',
                renderer: formatoMonedaABS
            },
            {
                header: 'Cargado',
                width: 110,
                sortable: false,
                align: 'center',
                dataIndex: 'cargado'
            }
        ]
    });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'window' + params.id,
            border: false,
            closeAction: 'close',
            layout: 'fit',
            modal: true,
            resizable: false,
            height: 150,
            width: 390,
            keys: {
            },
            items: [
                {
                    layout: 'border',
                    items: [params.gpfechacierre]
                }
            ]
        });
        
        //Agregando eventos
        this.addEvents('loadend', 'valselected');

        Ext.Cont.Banco.WindowCierreNomina.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        this.stfechacierre.load({
            scope: this,
            callback: function(record, options, success) {
                //this.show();
            }
        });
    },
    inicializarEventos: function(perfil, idioma) {
        this.stfechacierre.on({
            scope: this,
            load: function(store, records, options) {
                var eventReturn = this.fireEvent('loadend', records, this);
                if(eventReturn) {
                    this.show();
                }
            }
        });
        
        this.on({
            scope: this,
            show: function() {
                this.focus();
            }
        });
        
        this.gpfechacierre.on({
            scope: this,
            rowdblclick: function(grid, rowIndex, eventobj) {
                var rowselected = this.smfechacierre.getSelected();
                
                if(this.fireEvent('valselected', rowselected.data)) {
                    this.close();
                }
            }
        });
    }
});