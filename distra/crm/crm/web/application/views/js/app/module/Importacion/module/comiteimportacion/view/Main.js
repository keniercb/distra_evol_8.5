Ext.define('ComiteImportacion.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.co_comitemainimportacion',
    closable: true,
    border: false,
    layout: 'border',
    frame: false,
    module: 'Comite',

    requires: [
        'ComiteImportacion.view.MainGrid',
        'ComiteImportacion.view.RolOpinionWindow',
        'ComiteImportacion.view.OpinionsWindow',
        'ComiteImportacion.view.DetailsWindow',
        'ComiteImportacion.view.WinDetallesOferta',
        'ComiteImportacion.view.SolicitudGrid',
        'ComiteImportacion.view.DemandaGrid',
        'OfertaNegocioImportacion.view.WinDetallesOferta',
        'SolicitudNegocioImportacion.view.WinDetallesSolicitud',
        'GestionContratoImportacion.view.DetailsWindow',
        'Demanda.view.WinDetallesDemanda'
    ],
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {

        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        console.log('---------------Comiteimportacion')

        this.createToolBar();

        this.items = {
            region: 'center',
            xtype: 'tabpanel',
            border: false,
            frame: false,
            activeTab: 0
        };
    },
    createToolBar: function () {
        this.combo = this.createComboComite();

        this.btnDetails = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'details',
            selector: 'btnDetails',
            disabled: true,
            text: this.etiquetas.lbDetails,
            tooltip: this.etiquetas.qtipDetails
        });

        this.btnOpinion = Ext.create('Ext.Button', {
            iconCls: 'informe',
            action: 'opinions',
            selector: 'btnOpinion',
            disabled: true,
            text: this.etiquetas.lbOpinions,
            tooltip: this.etiquetas.qtipOpinions
        });

        this.btnChangeState = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            selector: 'btnOpinion',
            disabled: true,
            text: this.etiquetas.lbChangeState,
            tooltip: this.etiquetas.lbChangeState,
            menu: new Ext.menu.Menu()
        });

        this.btnGenerarActa = Ext.create('Ext.Button', {
            iconCls: 'imprimir',
            action: 'generaracta',
            selector: 'btnGenerarActa',
            disabled: true,
            text: this.etiquetas.lbGenerarActa,
            tooltip: this.etiquetas.qtipGenerarActa,
            
        });

//         this.btnHistorial = Ext.create('Ext.Button', {
//             iconCls: 'historial',
//             action: 'historial',
//             selector: 'btnHistorial',
//             disabled: false,
//             text: this.etiquetas.lbHistorial,
//             tooltip: this.etiquetas.qtipHistorial,
            
//         });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            refhelp: 'dat_contrato',
            tooltip: this.etiquetas.qtipHelp
        });

        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                this.combo,
                this.btnDetails,
                this.btnOpinion,
                '-',
                this.btnChangeState,
//                 this.btnHistorial,
                '->',
                this.btnHelp
            ]
        });
    },

    createComboComite: function () {
        var me = this,
            data = [
                {id: 'contract', text: me.etiquetas.lbComiteContratacion},
                {id: 'money', text: me.etiquetas.lbComiteFinanciero}
            ],
            store = Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarComites'}, ModuleMgr.get('Comite')),
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        root: 'data',
                        totalProperty: 'cant',
                        successProperty: 'success'
                    }
                },
                autoDestroy: true,
                fields: [{name: 'idcomitegeneral'}, {name: 'nombre'}, 'pordefecto', 'idprocesos'],
                // data: data
            })

        var combo= Ext.create('Ext.form.field.ComboBox', {
            itemId:'comboprocesos',
            displayField: 'nombre',
            valueField: 'idcomitegeneral',
            editable: false,
            width: 200,
            store: store,
            // value: 'contract',
            queryMode: 'local',
            typeAhead: true,
            allowBlank: false
        });
        Ext.MessageBox.show({
            msg: 'Cargando comites',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        store.load({
            callback: function(records, operation, success){
                // console.log('records:', records)
                // Ext.MessageBox.hide();
                if(success){
                    records.forEach(function(x){
                        if(x.get('pordefecto')=='1'){
                            setTimeout(function() {
                                combo.select(x);
                            }, 500)
                        }
                    })
                }
            }
        });
        return combo;

    },

    createComboComite2: function () {
        var me = this,
            data = [
                {id: 'contract', text: me.etiquetas.lbComiteContratacion},
                {id: 'money', text: me.etiquetas.lbComiteFinanciero}
            ],
            store = Ext.create('Ext.data.Store', {
                autoDestroy: true,
                fields: [{name: 'id'}, {name: 'text'}],
                data: data
            });

        return Ext.create('Ext.form.field.ComboBox', {
            displayField: 'text',
            valueField: 'id',
            editable: false,
            width: 200,
            store: store,
            value: 'contract',
            queryMode: 'local',
            typeAhead: true
        });

    }
});