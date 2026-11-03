Ext.define('Proformas.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pro_main',
    closable: true,
    border: false,
    layout: 'border',
    module: 'Proformas',
    requires: [
        'Proformas.view.ClausulasGrid',
        'Proformas.view.TinyHtmlEditor',
        'Proformas.view.TinyMceEditor'
    ],
    initComponent: function () {
        this.createBody();
        this.callParent();
    },
    createBody: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.title = me.etiquetas.titleProformas;

        this.west = new Ext.create('Proformas.view.WesternTree', {
            title: me.etiquetas.titleTiposContratos,
            action: 'getTiposContratos',
            module: 'Proformas'

        });

        this.btnPrint = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnPrevView || 'Imprimir',
            tooltip: this.etiquetas.qtipPrevView.get(),
            iconCls: 'vistaprevia',
            action: 'print',
            disabled: true,
            hidden: true,
            keyMap: {
                key: 'p',
                alt: true,
                event: 'click'
            }
        });

        this.btnDuplicar = Ext.create('Ext.Button', {
            text: this.etiquetas.lbDuplicar,
            tooltip: this.etiquetas.qtipDuplicar,
            iconCls: 'duplicar',
            action: 'clone',
            disabled: true,
            hidden: true,
            keyMap: {
                key: 'd',
                ctrl:true,
                alt: true,
                event: 'click'
            }
        });

        this.btnHeredar = Ext.create('Ext.Button', {
            text: this.etiquetas.lbHeredar,
            tooltip: this.etiquetas.qtipHeredar,
            selector: 'heredarproforma',
            iconCls: 'heredar',
            action: 'heredar',
            disabled: true,
            // hidden: true,
            keyMap: {
                key: 'h',
                ctrl:true,
                alt: true,
                event: 'click'
            }
        });

        this.btnExport = Ext.create('Ext.Button', {
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'vistaprevia',
            action: 'export',
            disabled: true,
            // hidden: true,
            keyMap: {
                key: 'i',
                alt: true,
                event: 'click'
            }
        });
        this.centergrid = Ext.create('BaseModule.view.CenterGrid', {
            title: 'Generados por sistema',
            modelName: 'DatProforma',
            gen: 'f',
            concept: me.etiquetas.textDatProforma,
            border: false,
            region: 'center',
            module: this.module,
            newactions: [this.btnDuplicar,this.btnPrint, this.btnHeredar, this.btnExport],
            flex: 1
        });

        this.documentospanel=Ext.create('Ext.grid.Panel',{
            title: 'Documentos plantillas',
            itemId: 'griddocumentos',
            disabled:true,
            store: Ext.create('Ext.data.Store',{
                fields: ['idnodo', 'nombre', 'url'],
                // autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'cargarDocumentos'}, ModuleMgr.get('Proformas')),
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        root: 'data',
                        totalProperty: 'cant',
                        successProperty: 'success'
                    },
                    success: function(){
                        alert('Funciona')
                    },
                    failure: function(){
                        alert('Que pasa')
                    }
                },
                // data:[
                //     {'idnodo': '1', 'nombre': 'Documento 1', 'url': 'ruta/archivo'}
                // ]
            }),
            columns:[
                {text: 'Documentos', xtype: 'templatecolumn', flex:1,
                    tpl:
                    '<button ' +
                    // 'style="background: #e9f3ed url(../../../../../../../images/request_theoffice_theword_2473.png) no-repeat left center;"' +
                    // 'class="icondistra-clausulacrm" ' +  //icondistra-clausulacrm filadocumento
                    'style="width:26px; height:32px; ' +
                    'margin: -6 2 -6 2; padding: 0 8 8 8; border: 0; ' +
                    'background:url(/crm/application/views/images/request_theoffice_theword_2473.png) no-repeat left center;' +
                    'background-size: 26px 24px; opacity: 0.8;"></button> {nombre}  '
                },
                {
                    xtype:'actioncolumn',
                    width:25,
                    items: [{
                        iconCls: 'icondistra-descargar',
                        tooltip: 'Descargar documento',
                        handler: function(grid, rowIndex, colIndex) {
                            var record = grid.getStore().getAt(rowIndex);
                            window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+record.get('idnodo'));
                        }
                    }
                    // ,{
                    //     iconCls: 'icondistra-eliminar',
                    //     tooltip: 'Eliminar documento',
                    //     handler: function(grid, rowIndex, colIndex) {
                    //         var rec = grid.getStore().getAt(rowIndex);
                    //         grid.getStore().remove(rec);
                    //         // alert("Terminate " + rec.get('firstname'));
                    //     }
                    // }
                    ]
                }
            ],
            tbar:[
                {
                    text: 'Adicionar',
                    tooltip: 'Adicionar documento',
                    iconCls: 'adicionar',
                    action: 'adicionardocumento',
                    selector: 'adicionardocumento',
                },
                {
                    text: 'Eliminar',
                    tooltip: 'Eliminar documento',
                    iconCls: 'eliminar',
                    itemId: 'eliminardocumentos',
                    action: 'eliminardocumentos',
                    selector: 'eliminardocumentos',
                    disabled: true
                }
            ]
        });

        this.mainTab=Ext.create('Ext.tab.Panel',{
            region: 'center',
            border:false,
            items:[
                this.centergrid,
                this.documentospanel
            ]
        })

        
        this.items = [this.west, this.mainTab];
    }
});