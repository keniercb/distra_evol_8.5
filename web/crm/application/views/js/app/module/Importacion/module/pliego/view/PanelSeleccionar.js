Ext.define('Pliego.view.PanelSeleccionar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panelseleccionar',
    itemId: 'panelseleccionar',
    autoScroll: true,
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    initComponent: function () {
        var me=this;
        me.etiquetas=LangMgr.getLang(me);
        function mostrarTooltip (value, meta) {
            if (value) meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        Ext.define('CampoPorciento',{
            extend: 'Ext.form.field.Number',
            alias: 'widget.porcientofield',
            labelAlign: 'top',
            allowDecimals: false,
            allowExponential: false,
            minValue: 0,
            maxValue: 100,
            allowBlank: false,
            labelWidth: 40,
            margin: '0 5 5 5',
            step: 10,
            listeners: {
                change: function(){
                    me.calcularTotal
                }
            },
            initComponent: function(){
                var self=this;
                // self.width=self.labelWidth+60;
                self.width=100;
                self.callParent();
            }
        });
        me.tbar=[
            {
                xtype: 'form',
                bodyStyle: 'background:#DFE9F6;padding:5px;',
                itemId: 'importanciaform',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Relevancia',
                        itemId: 'importancias',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'porcientofield',
                                fieldLabel: 'Mejores precios',
                                itemId: 'cantmejoresprecios',
                                name: 'cantmejoresprecios',
                                // labelWidth: 30,
                                value: 0,
                                readOnly: me.tipo == 'ver'
                            },
                            {
                                xtype: 'porcientofield',
                                fieldLabel: 'Completamiento',
                                itemId: 'cantcompletamiento',
                                name: 'cantcompletamiento',
                                // labelWidth: 30,
                                value: 0,
                                readOnly: me.tipo == 'ver'
                            },
                            {
                                xtype: 'porcientofield',
                                fieldLabel: 'Origen',
                                itemId: 'puertoorigen_peso',
                                name: 'puertoorigen_peso',
                                labelWidth: 50,
                                value: 0,
                                readOnly: me.tipo == 'ver'
                            },
                            {
                                xtype: 'porcientofield',
                                fieldLabel: 'Incoterms',
                                itemId: 'incoterms_peso',
                                name: 'incoterms_peso',
                                // labelWidth: 60,
                                value: 0,
                                readOnly: me.tipo == 'ver'
                            },
                            {
                                xtype: 'porcientofield',
                                tooltip: 'Tiempo de entrega',
                                itemId: 'tiempoentrega_peso',
                                name: 'tiempoentrega_peso',
                                fieldLabel: 'Tiempo entrega',
                                // labelWidth: 30,
                                value: 0,
                                readOnly: me.tipo == 'ver'
                            },
                            {
                                xtype: 'porcientofield',
                                tooltip: 'Paquete',
                                itemId: 'paquete_peso',
                                name: 'paquete_peso',
                                fieldLabel: 'Paquete',
                                // labelWidth: 30,
                                value: 0,
                                readOnly: me.tipo == 'ver'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'vbox',
                items:[
                    {
                        xtype: 'label',
                        itemId: 'porcientototal',
                        width: 40,
                        margin: '8 5 5 8',
                        text: '0%',
                        style:{
                            color: 'red',
                        }
                    },
                    {
                        xtype: 'button',
                        text: 'Calcular',
                        tooltip: 'Clacular la relevancia de las ofertas',
                        itemId: 'analizarimportancia',
                        iconCls: 'buscaryremplazar',
                        action: 'analizarimportancia',
                        disabled: true,
                        margin: '0 5 0 5',
                        hidden: me.tipo=='ver'
                    }
                ]
            },
            '->',
            {
                xtype: 'fieldset',
                title: 'Leyenda',
                itemId: 'leyenda',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults:{
                    margin: '10 0'
                },
                margin: '0 10 0 0',
                items: [
                    {
                        xtype: 'button',
                        readOnly: true,
                        style: {
                            background: '#5e8b64',
                        },
                        tooltip: "Color cuando el valor del campo representa mas del 75% del total de productos solicitados",
                        fieldStyle: 'background-color:#5e8b64;background-image:none',
                        width: 20
                        //; data-qtip="Color cuando el valor del campo representa mas del 75% del total de productos"
                    },
                    {
                        xtype: 'button',
                        readOnly: true,
                        style: {
                            background: '#8b743a', //8b8021
                        },
                        tooltip: "Color cuando el valor del campo se encuentra entre el 75% y el 25% del total de productos solicitados",
                        fieldStyle: 'background-color:#8b633a;background-image:none',
                        width: 20,
                        //data-qtip="Color cuando el valor del campo se encuentra entre el 25% y el 75% del total de productos"
                    },
                    {
                        xtype: 'button',
                        readOnly: true,
                        style: {
                            background: '#9b636c',
                        },
                        tooltip: "Color cuando el valor del campo representa menos del 25% del total de productos solicitados",
                        // fieldStyle: 'background-color:#9b565f;background-image:none',
                        width: 20
                        //; data-qtip="Color cuando el valor del campo representa menos del 25% del total de productos"
                    },
                ]
            }

        ];
        me.bbar=[
            '->',
            {
                text: 'Realizar selecci&oacute;n',
                tooltip: 'Realizar selecci&oacute;n de las ofertas para el pliego',
                itemId: 'realizarseleccion',
                iconCls: 'aprobar',
                action: 'realizarseleccion',
                disabled: true,
                hidden: me.tipo=='ver'
            }
        ];
        function getColor(valor){
            // console.log('valor', valor)
            if(valor>75){
                return '#5e8b64';
            }else if(valor<=75 && valor>25){
                return '#8b743a';
            }else{
                return '#9b636c';
            }
        }
        me.items=[
            {
                xtype: 'grid',
                itemId: 'gridseleccionarofertas',
                title: me.tipo=='ver'?'Ofertas para el pliego':'Seleccionar ofertas para el pliego',
                anchor: '100%',
                flex: 2,
                selType: 'checkboxmodel',
                columns:[
                    {text: 'N&uacute;mero', dataIndex: 'numerooferta', flex:0.1, minWidth: 80, renderer: mostrarTooltip},
                    {text: 'Oferta', dataIndex: 'oferta', flex:1, renderer: mostrarTooltip},
                    {text: 'Proveedor', dataIndex: 'proveedor', flex:1, renderer: mostrarTooltip},
                    {text: 'Mejores precios', tooltip: 'Mejores precios', dataIndex: 'cantmejoresprecios', flex: 0.2, minWidth:80, align: 'center',
                    renderer: function(value, meta, record){
                        // opacity: 0.80;
                        meta.tdAttr=
                            'style="background-color:'+getColor(record.get('%MPxtotal'))+';  font-weight: bold; color:white"; ' +
                            'data-qtip="'+record.get('%MPxtotal')+'%'+
                            (record.get('cantmejoresprecios_puntos')?
                                '<hr/>Pts: '+record.get('cantmejoresprecios_puntos')+
                                '<br>Importancia: '+me.down('#cantmejoresprecios').getValue()+'%':'')+'"';
                        return value;
                    }},
                    {text: 'Completitud', tooltip: 'Completitud', dataIndex: 'cantcompletamiento', flex: 0.2, minWidth:80, align: 'center',
                        renderer: function(value, meta, record){
                            // console.log('meta', meta)
                            meta.tdAttr=
                                'style="background-color:'+getColor(record.get('porcientocompletamiento'))+';  font-weight: bold; color:white"; ' +
                                'data-qtip="'+record.get('porcientocompletamiento')+'%'+
                                (record.get('cantcompletamiento_puntos')?
                                    '<hr/>Pts: '+record.get('cantcompletamiento_puntos')+
                                    '<br>Importancia: '+me.down('#cantcompletamiento').getValue()+'%':'')+'"';
                            return value;
                        }},
                    {text: 'Origen', tooltip: 'Origen', dataIndex: 'puertoorigen', flex: 0.2, minWidth:80, renderer: function(value, meta, record){
                            meta.tdAttr=
                                'data-qtip="'+value+
                                (record.get('puertoorigen_peso_puntos')?
                                    '<hr/>Peso: '+record.get('puertoorigen_peso')+
                                    '<br>Pts: '+record.get('puertoorigen_peso_puntos')+
                                    '<br>Importancia: '+me.down('#puertoorigen_peso').getValue()+'%':'')+'"';
                            return value;
                        }},
                    {text: 'Incoterm', tooltip: 'Incoterm', dataIndex: 'incoterms', flex: 0.2, minWidth:80, renderer: function(value, meta, record){
                            meta.tdAttr=
                                'data-qtip="'+value+
                                (record.get('incoterms_peso_puntos')?
                                    '<hr/>Peso: '+record.get('incoterms_peso')+
                                    '<br>Pts: '+record.get('incoterms_peso_puntos')+
                                    '<br>Importancia: '+me.down('#incoterms_peso').getValue()+'%':'')+'"';
                            return value;
                        }},
                    {text: 'Tiempo de entrega', tooltip: 'Tiempo de entrega', dataIndex: 'tiempoentrega', flex: 0.2, minWidth:80, renderer: function(value, meta, record){
                            meta.tdAttr=
                                'data-qtip="'+value+
                                (record.get('tiempoentrega_peso_puntos')?
                                    '<hr/>Peso: '+record.get('tiempoentrega_peso')+
                                    '<br>Pts: '+record.get('tiempoentrega_peso_puntos')+
                                    '<br>Importancia: '+me.down('#tiempoentrega_peso').getValue()+'%':'')+'"';
                            return value;
                        }},
                    {text: 'Paquete', tooltip: 'Paquete', dataIndex: 'importetotal', flex: 0.2, minWidth:80, align: 'right', renderer: function(value, meta, record){
                            meta.tdAttr=
                                'data-qtip="'+Ext.util.Format.number(parseFloat(value), '0.000,00/i')+
                                (record.get('tiempoentrega_peso_puntos')?
                                    '<hr/>Pts: '+record.get('importetotal_puntos')+
                                    '<br>Importancia: '+me.down('#paquete_peso').getValue()+'%':'')+'"';
                            return Ext.util.Format.number(parseFloat(value), '0.000,00/i');;
                        }},
                    {text: 'Ptos', tooltip: 'Puntos por cada indicador', dataIndex: 'puntos', width: 50, align: 'center'},
                    {text: 'Valor', tooltip: 'Puntos obtenido de acuerdo a la relevancia otorgada a cada indicador', dataIndex: 'importancia', width: 60, align: 'center'}
                ],
                store: Ext.create('Ext.data.Store',{
                    fields: [
                        'idoferta', 'oferta', 'numerooferta', 'proveedor',
                        'cantmejoresprecios', 'cantcompletamiento',
                        '%MPxtotal', 'porcientocompletamiento',
                        'incoterms','puertoorigen', 'puertodestino', 'tiempoentrega',
                        'incoterms_peso', 'puertoorigen_peso',
                        'puertodestino_peso', 'tiempoentrega_peso',
                        'paquete', 'paquete_peso', 'importetotal',
                        'puntos', 'importancia', 'totalofertado', 'totalsolicitado'],
                    data: []
                })
            },
            // {
            //     xtype: 'panel',
            //     itemId: 'paneldatosseleccion',
            //     title: 'Datos selección',
            //     flex: 2
            // }
        ];


        me.callParent();
    }
});