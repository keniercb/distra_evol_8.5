/**
 * Created by lily on 3/02/15.
 */
//Ext.Loader.setConfig({
//    enabled: true
//});
//Ext.Loader.setPath('Ext.ux', '../ux');

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
    //'Ext.ux.CheckColumn'
]);


Ext.define('Conf.view.gestsist.gridEditorActions', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridEditorActions',

    initComponent: function () {
        //this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        //    clicksToMoveEditor: 1,
        //    autoCancel: false
        //});
        this.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });
        this.id = 'gridAcciones';
        this.region = 'center';
        this.frame = true;
        this.border = false;
        this.store = Ext.create('Conf.store.StoreGridEditor');
        this.plugins = [this.cellEditing];
        this.columns = [{
            hidden: true,
            header: 'idfuncionalidad',
            dataIndex: 'idfuncionalidad',
            flex: 1
        },
        {
            hidden: true,
            header: 'idaccion',
            dataIndex: 'idaccion',
            flex: 1
        },
        {
            xtype: 'checkcolumn',
            header: '',
            dataIndex: 'checked',
            width: 35,
            editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            }
        },
        {
            header: perfil.etiquetas.fieldLabelDenominacion,//'Denominación',
            dataIndex: 'denominacion',
            width: 160,
            editor: {
                allowBlank: false,
                blankText: 'Este campo es obligatorio.',
                regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]*))$/,
                regexText: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."
            }
        }, {
            header: perfil.etiquetas.fieldLabelDescripcion,//'Descripción',
            dataIndex: 'descripcion',
            flex: 1,
            editor: {
                allowBlank: true,
                maxLength: 250,
                maxLengthText: perfil.etiquetas.textMaximoCaracteres
            }
        }];
        this.tbar = [{
            xtype: 'textfield',
            name: 'cajaTextoGrid',
            id: 'cajaTextoGrid',
            emptyText : perfil.etiquetas.buscaremtytext,//'Buscar',
            nextTab: 'btnBuscarGrid',
            prevTab: 'deleteAccion',
            action: 'buscarCajaGrid',
            enableKeyEvents: true,
            maskRe: /^[áéíóúÁÉÍÓÚ/a-zA-Z0-9\_\s\-]*$/,
            /*maxLength:60,
            maxLengthText: perfil.etiquetas.textMaximoCaracteres,*/
            listeners: {
                keydown: function (textField,eventObject){
                    var ok = textField.getValue().length < 60;
                    var key = eventObject.getKey();

                    if(key == 46 ){
                        if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                            textField.enableKeyEvents = true;
                            return
                        }
                        else{
                            Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                            textField.enableKeyEvents = true;
                            return;
                        }
                    }
                    if(key == 68 && eventObject.shiftKey){
                        //console.log('entro aqui');
                        if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                            textField.enableKeyEvents = true;
                            return
                        }
                        else{
                            Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                            textField.enableKeyEvents = true;
                            return;
                        }
                    }
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
                        if(textField.getValue().length > 60){
                            var string = textField.getValue();
                            var nuevovalor = string.slice(0,60);
                            textField.setValue(nuevovalor);
                        }
                    }
                }

            }
        },
            {
                iconCls: 'buscar',
                disabled:true,
                text: perfil.etiquetas.buscarbuton,
                tooltip: perfil.etiquetas.buscarGrid,//'Buscar',
                name: 'btnBuscarGrid',
                id: 'btnBuscarGrid',
                nextTab: 'btnLimpiarGrid',
                prevTab: 'cajaTextoGrid',
                action: 'buscarGrid'
                //hidden: true
            },
            {
                iconCls: 'limpiar',
                disabled:true,
                text: perfil.etiquetas.limpiar,
                tooltip: perfil.etiquetas.limpiarGrid,//'Limpiar',
                name: 'btnLimpiarGrid',
                id: 'btnLimpiarGrid',
                nextTab: 'addAccion',
                prevTab: 'btnBuscarGrid',
                action: 'limpiarGrid'
        }];
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Mostrando de {0} - {1} de {2}',
            emptyMsg: '0 Resultado a mostrar',
            beforePageText: 'Página',
            afterPageText: 'de {0}',
            firstText: 'Primera Página',
            prevText: 'Página anterior',
            nextText: 'Página siguiente',
            lastText: 'Última Página',
            refreshText: 'Actualizar'

        });

        //this.bbar.items.items[10].config = { nextTab: 'addAccion'};
        //console.log(this.bbar.items);

        this.callParent(arguments);
    }
});
