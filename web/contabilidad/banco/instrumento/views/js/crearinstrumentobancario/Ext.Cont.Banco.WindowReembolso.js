/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.Banco.WindowReembolso
 * @extends Ext.Window
 */
Ext.namespace('Ext.Cont.Banco.WindowReembolso');
Ext.Cont.Banco.WindowReembolso = Ext.extend(Ext.Window, {
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

        params.streembolso = new Ext.data.GroupingStore({
            url: 'buscardatosreembolso',
            id: 'streembolso',
            sortInfo: {
                field: 'importemo',
                direction: 'ASC'
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'iddocumento'
            }, [
                {
                    name: 'iddocumento'
                },
                {
                    name: 'importemb'
                }, 
                {
                    name: 'importemo'
                },
                {
                    name: 'idcuenta'
                },
                {
                    name: 'cuenta'
                },
                {
                    name: 'reembolsocoment',
                    mapping: 'comentario'
                },
                {
                    name: 'numerodocumento'
                },
                {
                    name: 'idfondo',
                    mapping: 'idcajafondo'
                },
                {
                    name: 'denomfondo',
                    mapping: 'denominacion'
                },
                {
                    name: 'idmovimientocaja',
                    mapping: 'idmovimiento'
                },
                {
                    name: 'reembolsado'
                }
            ]),
            groupField: 'idfondo',
            baseParams: {
                idmoneda: params.idmoneda,
                fechaFin: params.fechaFin,
                idmovimientoscaja: params.idmovimientoscaja,
                signo: params.signo
            }
        });
        
        params.smreembolso = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        var header1 = (params.signo == 19) ? 'Solicitud de reembolso' : 'Extracci&oacute;n de fectivo';
        
        params.gpreembolso = new Ext.grid.GridPanel({
        frame: false,
        border: false,
        //loadMask: true,
        store: params.streembolso,
        region: 'center',
        sm: params.smreembolso,
        id: 'gpreembolso',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        columns: [
            {
                id: 'expandir',
                header: header1,
                width: 100,
                sortable: true,
                dataIndex: 'reembolsocoment'
            },
            {
                header: 'Cuenta',
                hidden: true,
                hideable: false,
                width: 150,
                sortable: true,
                dataIndex: 'cuenta'
            },
            {
                header: 'Importe',
                sortable: true,
                width: 40,
                align: 'right',
                dataIndex: 'importemo'
            },
            {
                header: '',
                hidden: true,
                hideable: false,
                width: 100,
                dataIndex: 'idfondo'
            },
            {
                header: 'Estado',
                width: 40,
                sortable: false,
                align: 'center',
                dataIndex: 'reembolsado'
            }
        ],
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{[values.rs[0].data.denomfondo]}',
            forceFit: true
        })
    });

        Ext.apply(this, params);
        Ext.apply(this, {
            id: 'window' + params.id,
            border: false,
            closeAction: 'close',
            layout: 'fit',
            modal: true,
            resizable: false,
            height: 350,
            width: 500,
            keys: {
            },
            items: [
                {
                    layout: 'border',
                    items: [params.gpreembolso]
                }
            ]
        });
        
        //Agregando eventos
        this.addEvents('loadend', 'valselected');

        Ext.Cont.Banco.WindowReembolso.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        this.streembolso.load({
            scope: this,
            callback: function(record, options, success) {
                //this.show();
            }
        });
    },
    inicializarEventos: function(perfil, idioma) {
        this.streembolso.on({
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
        
        this.gpreembolso.on({
            scope: this,
            rowdblclick: function(grid, rowIndex, eventobj) {
                var rowselected = this.smreembolso.getSelected();
                
                if(this.fireEvent('valselected', rowselected.data)) {
                    this.close();
                }
            }
        });
    }
});