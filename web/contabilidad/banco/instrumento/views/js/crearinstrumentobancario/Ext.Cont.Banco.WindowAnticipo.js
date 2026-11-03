/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Cont.Banco.WindowAnticipo
 * @extends Ext.Window
 */
Ext.namespace('Ext.Cont.Banco.WindowAnticipo');
Ext.Cont.Banco.WindowAnticipo = Ext.extend(Ext.Window, {
    //Componente para cargar los cobro o pagos anticipados
    //Si la operación que se va a realizar es de entrada entonces es un reintegro de pago anticipado, por tanto
    //se deben cargar los pagos anticipados pendientes
    //Si la operación que se va a realizar es de salida entonces es una devoluciónde cobro anticipado, por tanto
    //se deben cargar los cobros anticipados

//    Properties and Variables
    constrain: true,
    //Functions
    constructor: function(params) {

        params.stanticipo = new Ext.data.Store({
            url: 'buscaranticipos',
            id: 'stanticipo',
            /*sortInfo: {
                field: 'importemo',
                direction: 'ASC'
            },*/
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idanticipo'
            }, [
                {
                    name: 'iddocumento'
                },
                {
                    name: 'idtipodocumento'
                }, 
                {
                    name: 'numerodocumento'
                },
                {
                    name: 'fechacreacion'
                },
                {
                    name: 'idperiodo'
                },
                {
                    name: 'idestadodoccomunfinanzas'
                },
                {
                    name: 'idsubsistema'
                },
                {
                    name: 'idmoneda'
                },
                {
                    name: 'idtasa'
                },
                {
                    name: 'idcliente'
                },
                {
                    name: 'idcuenta'
                },{
                    name: 'importemo'
                },{
                    name: 'importemb'
                },{
                    name: 'liquidadomo'
                },{
                    name: 'liquidadomb'
                },{
                    name: 'pendientemo'
                },{
                    name: 'idanticipo'
                },{
                    name: 'identidad'
                },{
                    name: 'tipo'
                },{
                    name: 'idcuentabancaria'
                },{
                    name: 'activo'
                },{
                    name: 'nombrecuenta'
                },{
                    name: 'tipodocumento'
                }, {
                    name: 'cargado'
                }
            ]),
            baseParams: {
                idmoneda: params.idmoneda,
                fechaFin: params.fechaFin,
                cliente: params.idcliente,
                tipo: (params.tipooperacion == 1) ? 2 : 1,
                iddocumento: params.iddocumento,
                arridsanticiposMod: Ext.encode(params.arridsanticiposMod)
            }
        });
        
        params.smanticipo = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        
        params.gpanticipo = new Ext.grid.GridPanel({
        frame: false,
        border: false,
        //loadMask: true,
        store: params.stanticipo,
        region: 'center',
        sm: params.smanticipo,
        id: 'gpanticipo',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        columns: [
            {
                id: 'fecha',
                header: 'Fecha',
                width: 90,
                sortable: true,
                align: 'center',
                dataIndex: 'fechacreacion'
            },{
                header: 'Documento',
                width: 150,
                sortable: true,
                dataIndex: 'tipodocumento'
            },
            {
                id: 'expandir',
                header: 'Cuenta',
                width: 150,
                sortable: true,
                dataIndex: 'nombrecuenta'
            },
            {
                header: 'Importe',
                sortable: true,
                width: 120,
                align: 'right',
                dataIndex: 'importemo'
            },
            {
                header: 'Importe pendiente',
                sortable: true,
                width: 120,
                align: 'right',
                dataIndex: 'pendientemo'
            },
            {
                header: 'Estado',
                width: 100,
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
            height: 350,
            width: 900,
            keys: {
            },
            items: [
                {
                    layout: 'border',
                    items: [params.gpanticipo]
                }
            ]
        });
        
        //Agregando eventos
        this.addEvents('loadend', 'valselected');

        Ext.Cont.Banco.WindowAnticipo.superclass.constructor.call(this);

        this.inicializarEventos(params.perfil, params.idioma);

        this.stanticipo.load({
            scope: this,
            callback: function(record, options, success) {
                //this.show();
            }
        });
    },
    inicializarEventos: function(perfil, idioma) {
        this.stanticipo.on({
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
        
        this.gpanticipo.on({
            scope: this,
            rowdblclick: function(grid, rowIndex, eventobj) {
                var rowselected = this.smanticipo.getSelected();
                
                if(this.fireEvent('valselected', rowselected.data)) {
                    this.close();
                }
            }
        });
    }
});