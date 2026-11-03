Ext.define('GestionContrato.view.AreasPermitidas',{
    extend: 'Ext.panel.Panel',
    // layout: 'hbox',
    // layout: {type: 'hbox', align: 'stretch'},
    layout: 'fit',
    height: 300,
    initComponent: function(){
        var me=this;

        me.etiquetas = LangMgr.getLang(me);
        me.items=[
            {
                xtype: 'panel',
                // layout: 'hbox',
                layout: {type: 'hbox', align: 'stretch'},
                items: [
                    Ext.create('Ext.tree.Panel', {
                        frame: false,
                        margin: false,
                        border: false,
                        split: true,
                        title: me.etiquetas.lbAreas,
                        itemId: 'treeareas',
                        flex: 1,
                        // minWidth: 200,
                        // maxWidth: 300,
                        cls: 'crm-icon-tree',
                        name: 'areatree',
                        autoScroll: true,
                        rootVisible:false,
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            mode: 'MULTI',
                            listeners: {
                                select: function(sm, record, index){
                                    if(record) {
                                        // console.log('record:', record)
                                        // console.log('.hasChildNodes():', record.hasChildNodes())
                                        if (record.hasChildNodes()) {
                                            record.eachChild(function (x) {
                                                sm.select(x, true);
                                            });
                                        }
                                    }
                                }
                            }
                        }),
                        store: Ext.create('Ext.data.TreeStore', {
                            proxy: {
                                type: 'ajax',
                                url: UtilsFn.buildUrl({action: 'getTodasAreas'}, ModuleMgr.get('GestionContrato')),
                                reader: {
                                    root: 'children',
                                    type: 'json',
                                    totalProperty: 'total',
                                    successProperty: 'success'
                                },
                            },
                            root: {
                                text: 'bAsE',
                                id: 0,
                                expanded: true
                            }
                        })
                    }),
                    {
                        xtype: 'panel',
                        bodyStyle: 'background:#DFE9F6;',
                        itemId: 'panelbotones',
                        layout: {
                            type: 'vbox',
                            align: 'stretch',
                            pack: 'center'
                        },
                        defaults: {
                            xtype: 'button',
                            margin: '1 2',
                            ui: 'default-toolbar-small',
                        },
                        items: [
                            {
                                iconCls: 'icondistra-siguiente icon-medium',
                                tooltip: me.etiquetas.qtipAdicionarAreas,
                                handler: function () {
                                    var storeareas = me.down('#gridareasimplicadas').getStore(),
                                        existe = [];
                                    me.down('#treeareas').getSelectionModel().getSelection().forEach(function (x) {
                                        console.log('seleccionado:', x)
                                        if (storeareas.findExact('idarea', x.get('id')) == -1) {
                                            var temp=x.getPath('text', '/-:-/').replace('/-:-/bAsE/-:-/', ''),
                                                aux=temp.split('/-:-/'),
                                                last=aux.pop();
                                            // console.log('temp:',temp)
                                            // console.log('aux:',aux)
                                            // console.log('last:',last)
                                            // console.log('result:',aux.join('/')+'/<b>'+last+'</b>')
                                            storeareas.add({
                                                'denominacion': x.get('text'),
                                                'idarea': x.get('id'),
                                                // 'ruta': x.getPath('text').replace('/bAsE/', '').replace(x.get('text'), '<b>'+x.get('text')+'</b>'),
                                                'ruta': aux.join('/')+'/<b>'+last+'</b>',
                                            });
                                        } else {
                                            existe.push(x.get('text'));
                                        }
                                    });
                                    if (existe.length > 0)
                                        mostrarMensaje(8, 'No se han adicionado las siguientes áreas: <br>-' + existe.join('<br>-') + '.');
                                }
                            },
                            {
                                iconCls: 'icondistra-anterior icon-medium',
                                tooltip: me.etiquetas.qtipQuitarAreas,
                                handler: function () {
                                    me.down('#gridareasimplicadas').getStore().remove(
                                        me.down('#gridareasimplicadas').getSelectionModel().getSelection())
                                }
                            },
                            {
                                iconCls: 'icondistra-desplazardobleizq icon-medium',
                                tooltip: me.etiquetas.qtipQuitarTodasAreas,
                                handler: function () {
                                    me.down('#gridareasimplicadas').getStore().removeAll();
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'grid',
                        title: me.etiquetas.lbAreasSeleccionadas,
                        flex:1,
                        itemId: 'gridareasimplicadas',
                        columns: [
                            // {text: 'Denominación', dataIndex: 'nombrearea', flex: 1},
                            {text: 'Denominación', dataIndex: 'ruta', flex: 1, renderer: function(value, meta){
                                if(value)
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }},
                        ],
                        store: Ext.create('Ext.data.Store', {
                            fields: ['idareapermitida', 'idarea', 'nombrearea', 'ruta'],
                            proxy: {
                                type: 'ajax',
                                url: UtilsFn.buildUrl({action: 'getAreasImplicadas'}, ModuleMgr.get('GestionContrato')),
                                reader: {
                                    root: 'data',
                                    type: 'json',
                                    totalProperty: 'total',
                                    successProperty: 'success'
                                },
                            },
                        })
                    }
                ]
            }
        ];

        me.callParent();
    }
})