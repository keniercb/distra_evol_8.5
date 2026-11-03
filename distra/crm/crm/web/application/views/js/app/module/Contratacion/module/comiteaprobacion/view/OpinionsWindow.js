Ext.define('Comite.view.OpinionsWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.opinionswindow',
    width: 900,
    height: 550,
    layout: 'border',
    constrain: true,
    closeAction: 'destroy',
    modal: true,
    initComponent: function () {
        var me = this;
        this.getLang();

        this.bodyStyle = 'background:#DFE9F6; padding:5px';

        this.toolhelp = {
            type: 'help',
            action: 'help',
            tooltip: this.etiquetas.qtipHelp || 'Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>',
            refhelp: this.refhelp,
            keyMap: {
                key: Ext.EventObject.F1,
                ctrl: true,
                event: 'click'
            }
        };

        this.tools = [this.toolhelp];

        this.stRol = Ext.create('Comite.store.Opinions');

        this.cmRol = [
            {
                text: 'Roles',
                sortable: false,
                dataIndex: 'abreviaturarol',
                flex: 1
            }
        ];

        this.btnImprimir=Ext.create('Ext.button.Button',{
            text:this.etiquetas.lbImprimir,
            tooltip: this.etiquetas.lbImprimir,
            iconCls: 'imprimir',
            action:'imprimirOpinion',
            handler:function(){
                // var proceso='contrato';
                // if(me.params['proceso'])proceso=me.params['proceso'];
                // console.log('con:', me.params['id'], 'proceso:', proceso)
                // var config = {
                //     nombrereporte: 'crmDictamenesCartaVertical',
                //     params:[
                //         {name: 'idcontrato', value: me.params['id'], datatype: 'int'},
                //         {name: 'proceso', value: proceso, datatype: 'string'},
                //     ]
                // };
                // Ext.create('Ext.ux.Report', config).show();
                console.log('id:', me.params['id'], 'proceso:', (me.params['proceso']?me.params['proceso']:'contrato'))
                var config = {
                    typeRequest: 'auto',
                    typeFormat: 'PDF',
                    content: 'application/pdf',
                    paginated: false,
                    isAttachment: false,
                    // reports: [{
                        name: 'crmDictamenesCartaVertical',
                        description: 'Contrato',
                        isList: true,
                        params: {
                            idcontrato : me.params['id'],
                            proceso: me.params['proceso']?me.params['proceso']:'contrato'
                        },
                        dirReport: '/reports/crm/crmDictamenesCartaVertical',
                        // dirReport: '/reports/crm/ReporteSinEjecutar',
                        // dirReport: '/reports/crm/crmActaAceptacion',
                        // dirReport: '/distra/crm/oferta_de_negocio/crmOfertaComercial',
                        uiSearch: {}
                    // }]
                };
                Ext.create('Ext.ux.JasperReport', config);
            }
        });

        this.gpRol = Ext.create('Ext.grid.Panel', {
            title: 'Roles',
            hideHeaders: true,
            region: 'west',
            flex: 0.35,
            margin: '5 5 5 0',
            columns: this.cmRol,
            store: this.stRol,
            autoScroll: true,
            viewConfig: {
                stripeRows: true
            },
            dockedItems:[{
                dock:'top',
                xtype:'toolbar',
                items:[this.btnImprimir]
            }],
            plugins: [
                {
                    ptype: 'rowexpander',
                    rowBodyTpl: new Ext.XTemplate(
                        '<p style="margin: 0px 5px;"><b>Nombre : </b>{nombrepersona}</p>',
                        '<p style="margin: 0px 5px;"><b>Cargo : </b>{cargopersona}</p>')
                }
            ]
        });

        this.editor = Ext.create('Comite.view.TinyEditor', {
            readOnly: true,
            border: false,
            region: 'center'
        });

        this.fileupload = new Ext.create('Ext.form.field.File', {
            fieldLabel: this.etiquetas.lbContratoAdjunto,
            columnWidth: 1,
            name: 'file',
            labelWidth:50,
            buttonText: '',
            buttonConfig: {
                iconCls: 'icondistra-subirfichero icon-fileupload',
                hidden:true
            }
        });

        this.btnShowFile = new Ext.create('Ext.Button', {
            tooltip: me.etiquetas.lbVerDocumento,
            iconCls: 'icondistra-descargar icon-medium',
            action: 'showfile',
            disabled:true,
            margin: '0 0 0 2',
            style: {
                borderWidth: '1px !important;'
            }
        });

        this.state = Ext.create('Ext.form.Label', {
            text: this.etiquetas.lbEstado + ' : '
        });

        this.infoForm = Ext.create('Ext.form.Panel', {
            height: 50,
            region: 'north',
            margin: '5 0 0 0',
            border: false,
            bodyStyle: 'background:#DFE9F6;'
        });

        this.template = new Ext.XTemplate(
            '<p style="margin:5px;"><b>Nombre : </b>{nombre}</p>',
            '<p style="margin:5px;"><b>Estado : </b><span class="icondistra-{icono}"></span>{estado}<span style = "float: right"><b>Fecha :</b>{fecha}</span></p>');

        this.items = [this.gpRol, {
            flex: 0.65,
            region: 'center',
            xtype: 'form',
            layout: 'border',
            border: false,
            frame: false,
            bodyStyle: 'background:#DFE9F6;',
            items: [this.infoForm, this.editor, {
                region:'south',
                layout:'column',
                border:false,
                bodyStyle: 'background:#DFE9F6;',
                height:30,
                items:[this.fileupload,this.btnShowFile]
            }]
        }];

        this.btnClose = Ext.create('Ext.Button', {
            iconCls: 'cerrar',
            action: 'close',
            text: me.etiquetas.lbTabClose,
            tooltip: me.etiquetas.qtipClose,
            handler: function () {
                me.close();
            }
        });

        this.buttons = [this.btnClose];

        me.callParent();
    }
});
