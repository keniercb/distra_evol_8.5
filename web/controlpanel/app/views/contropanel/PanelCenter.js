/**
 * Created by adrian on 3/11/14.
 */
Ext.Loader.setConfig({enabled: true});
Ext.define("Controlpanel.views.PanelCenter", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelCenter",
    //title: 'Navigation',
    region: 'center',
    layout: 'fit',
    width: 880,
    margins: '5 0 0 0',
    //collapsible: true,
    //collapseMode: 'mini',
    split: true,

    initComponent: function () {
        this.storeEstado = Ext.create('Controlpanel.store.estado');
        this.storeGridPacks = Ext.create('Controlpanel.store.paquetes');

        this.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                text: Zeolides.etiquetas.labelInstalar,
                iconCls: 'incluir',
                tooltip : Zeolides.etiquetas.toolTipInstalar,
                name: 'instalar',
                id: 'instalar',
                disabled:true,
                action: 'instalar'

            },{
                text: Zeolides.etiquetas.labelDesintalar,
                iconCls: 'deshacer',
                tooltip : Zeolides.etiquetas.toolTipDesintalar,
                name: 'desintalar',
                id: 'desintalar',
                disabled:true,
                action: 'desintalar'

            },{
                text: Zeolides.etiquetas.labelActualizar,
                iconCls: 'actualizar',
                tooltip : Zeolides.etiquetas.toolTipActualizar,
                name: 'actualizar',
                id: 'actualizar',
                disabled:true,
                action: 'actualizar'

            },{
                text: Zeolides.etiquetas.labelReinstalar,
                iconCls: 'reevaluacion',
                tooltip : Zeolides.etiquetas.toolTipReinstalar,
                name: 'reinstalar',
                id: 'reinstalar',
                disabled:true,
                action: 'reinstalar'

            },{
                text: Zeolides.etiquetas.labelRevertir,
                iconCls: 'recuperaciones',
                tooltip : Zeolides.etiquetas.toolTipRevertir,
                name: 'revertir',
                id: 'revertir',
                disabled:true,
                action: 'revertir'

            }]
        }],

        this.items = [
            Ext.create('Ext.grid.Panel', {
                anchor: '100%',
                //height: 430,
                name: 'gridPacked',
                id: 'gridPacked',
                frame: true,
                //multiSelect : true,
                store: this.storeGridPacks,
                //iconCls: 'icon-user',
                viewConfig: {
                    loadingText: Zeolides.etiquetas.textCargando
                },
                columns: [{
                    header: Zeolides.etiquetas.headerNamePack,
                    width: 150,
                    sortable: true,
                    dataIndex: 'NAME',
                    filterable: true

                },{
                    text: Zeolides.etiquetas.headerEstado,
                    width: 150,
                    sortable: true,
                    dataIndex: 'ESTADO'

                }, {
                    text: Zeolides.etiquetas.headerVersionInstall,
                    width: 150,
                    sortable: true,
                    dataIndex: 'VERSIONINSTALADA',
                    renderer: function(value, metaData, record){
                        if(value != '-'){
                            var type = (value.charAt(0) == '7') ? '-alfa' : (value.charAt(0) == '8') ? '-beta' : '-rc';
                            return value.substring(1) + type;
                        }else{
                            return value;
                        }
                    }

                },{
                    text: Zeolides.etiquetas.headerVersionPack,
                    width: 150,
                    sortable: true,
                    dataIndex: 'VERSION',
                    renderer: function(value, metaData, record){
                        var type = (value.charAt(0) == '7') ? '-alfa' : (value.charAt(0) == '8') ? '-beta' : '-rc';
                        return value.substring(1)  + type;
                    }
                },{
                    text: Zeolides.etiquetas.headerDescripPack,
                    //width: 200,
                    sortable: true,
                    dataIndex: 'DESCRIPCION',
                    flex:1

                }], dockedItems: [{
                    xtype: 'toolbar',
                    items: [Zeolides.etiquetas.namePack, {
                        xtype: 'textfield',
                        name: 'searchFieldPack',
                        id: 'searchFieldPack',
                        emptyText : Zeolides.etiquetas.emptyTextSearch,
                        hideLabel: true,
                        enableKeyEvents: true,
                        regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\/\s\-]*))$/,
                        regexText: "Solo admite caracteres alfanuméricos y los caracteres especiales (/-_).",

                        listeners: {
                            keydown: function (textField,eventObject){

                                var ok = textField.getValue().length < 30;
                                var key = eventObject.getKey();

                                if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            },
                            keyup: function (textField,eventObject){

                                var key = eventObject.getKey();
                                if(key == 86 && eventObject.ctrlKey){
                                    if(textField.getValue().length > 30){
                                        var string = textField.getValue();
                                        var nuevovalor = string.slice(0,30);
                                        textField.setValue(nuevovalor);
                                    }
                                }
                            }
                        }
                        //width: 200

                    },Zeolides.etiquetas.labelEstado, {
                        xtype: 'combobox',
                        name: 'estado',
                        id: 'estado',
                        emptyText: Zeolides.etiquetas.emptyTextTipoV,
                        //anchor: '100%',
                        displayField: 'name',
                        store: this.storeEstado,
                        queryMode: 'local',
                        typeAhead: true,
                        blankText: Zeolides.etiquetas.blankText,
                        editable : false

                    },{
                        text: '<u>B</u>uscar',
                        iconCls: 'buscar',
                        tooltip : 'Buscar paquete <b>(Alt+B)</b>',
                        name: 'filtrarGridPack',
                        id: 'filtrarGridPack',
                        action: 'filtrarGridPack',
                        disabled:true

                    }, {

                        text: '<u>L</u>impiar',
                        id: 'clearFiltroGridPack',
                        disabled:true,
                        iconCls: "limpiar",
                        scope: this,
                        tooltip : 'Limpiar filtro <b>(Alt+L)</b>',
                        action: 'limpiarFiltroGridPack'

                    }]
                }],
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: this.storeGridPacks,
                    displayInfo: true,
                    emptyMsg: Zeolides.etiquetas.emptyMsgToolbar,
                    displayMsg: Zeolides.etiquetas.displayMsgToolbar,
                    beforePageText: Zeolides.etiquetas.beforePageTextToolbar,
                    afterPageText: Zeolides.etiquetas.afterPageTextToolbar,
                    firstText: Zeolides.etiquetas.firstTextToolbar,
                    prevText:  Zeolides.etiquetas.prevTextToolbar,
                    nextText: Zeolides.etiquetas.nextTextToolbar,
                    lastText: Zeolides.etiquetas.lastTextToolbar,
                    refreshText: Zeolides.etiquetas.refreshTextToolbar

                })
            })
        ];
        // this.storeGrid = Ext.create('Packed.store.packs');
        this.callParent(arguments);
    }
});
