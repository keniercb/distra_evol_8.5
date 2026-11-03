/**
 * Created by lilianne on 26/01/15.
 */

Ext.define('Conf.view.gestsist.panelMenuIzquierdo', {
    extend: "Ext.panel.Panel",
    alias: 'widget.panelMenuIzquierdo',

    initComponent: function () {
        this.border = false;
        this.id = 'mIzquierdo';
        this.name = 'mIzquierdo';
        var adicionarCategoria = Ext.create('Ext.menu.Item', {
            id: 'addCategoria',
            text: perfil.etiquetas.adicionarCateg,//'Adicionar categoria',
            tooltip: perfil.etiquetas.adicionarCategoria,//'Adicionar categoria (Alt+I+C)',
            iconCls: 'adicionar',
            action:  'insertarCategoria'
        });
        var adicionarSubsistema = Ext.create('Ext.menu.Item', {
            id: 'addSubsistema',
            text: perfil.etiquetas.adicionarSub,//'Adicionar subsistema',
            tooltip: perfil.etiquetas.adicionarSubsistema,//'Adicionar subsistema (Alt+I+S)',
            iconCls: 'adicionar',
            action:  'insertarSubsistema'
        });
        var adicionarFuncionalidad = Ext.create('Ext.menu.Item', {
            id: 'addFuncionalidad',
            text: perfil.etiquetas.adicionarFunc,//'Adicionar funcionalidad',
            tooltip: perfil.etiquetas.adicionarFuncionalidad,//'Adicionar funcionalidad (Alt+I+F)',
            iconCls: 'adicionar',
            action:  'insertarFuncionalidad'
        });
        var adicionarRecurso = Ext.create('Ext.menu.Item', {
            id: 'addRecurso',
            text: perfil.etiquetas.adicionarRec,//'Adicionar recurso',
            tooltip: perfil.etiquetas.adicionarRecurso,//'Adicionar recurso(Alt+I+R)',
            iconCls: 'adicionar',
            action:  'insertarRecurso'
        });
        this.tbar = [
            {
                disabled: true,
                id: 'btnAdicionar',
                tooltip: perfil.etiquetas.adicionarMenuIz,//'Adicionar',
                nextTab: 'btnEliminar',
                prevTab: 'btnLimpiarTreeDerecho',
                iconCls: 'adicionar',
                menu: [adicionarCategoria,adicionarSubsistema,adicionarFuncionalidad,adicionarRecurso]
            },
            {
                disabled: true,
                id: 'btnEliminar',
                tooltip: perfil.etiquetas.eliminarMenuIz,//'Eliminar',
                nextTab: 'btnExportar',
                prevTab: 'btnAdicionar',
                iconCls: 'eliminar',
                action: 'eliminarcomponente'
            },
            {
                disabled: true,
                id: 'btnExportar',
                tooltip: perfil.etiquetas.exportarSubsistema,//'Exportar el subsistema seleccionado',
                nextTab: 'btnImportar',
                prevTab: 'btnEliminar',
                iconCls: 'exportar',
                action: 'exportarsubsistema'
            },
            {
                disabled: true,
                id: 'btnImportar',
                tooltip: perfil.etiquetas.importarSubsistema,//'Importar al sistema seleccionado',
                nextTab: 'cajaTextoDerechaArbol',
                prevTab: 'btnExportar',
                iconCls: 'importar',
                action: 'importarsubsistema'
            }

        ];
        this.bbar = [
            { xtype: 'textfield',
                name: 'cajaTextoDerechaArbol',
                id: 'cajaTextoDerechaArbol',
              //  fieldLabel: perfil.etiquetas.buscar,
                emptyText : 'Buscar',//perfil.etiquetas.buscar,//'Buscar',
                maskRe: /^[áéíóúÁÉÍÓÚ/a-zA-Z0-9\_\s\-]*$/,
               // labelAlign : 'left',
              //  labelWidth: 43,
               // labelPad: 5,
              //  labelSeparator : ':',
                nextTab: 'btnLimpiarTreeDerecho',
                prevTab: 'btnImportar',
                action: 'buscarTreeCaja',
                enableKeyEvents: true,
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
                tooltip: perfil.etiquetas.buscarMenuIz, //'Buscar (Alt+B)',
                name: 'btnBuscarTreeDerecho',
                id: 'btnBuscarTreeDerecho',
                nextTab: 'btnLimpiarTreeDerecho',
                prevTab: 'cajaTextoDerechaArbol',
                action: 'buscarTree',
                hidden: true,
            },
            {
                iconCls: 'limpiar',
                disabled:true,
                tooltip: perfil.etiquetas.limpiarMenuIz,//'Limpiar',
                name: 'btnLimpiarTreeDerecho',
                id: 'btnLimpiarTreeDerecho',
                nextTab: 'btnGuardar',
                prevTab: 'cajaTextoDerechaArbol',
                action: 'limpiarFiltroTree'
            }
        ];

        this.callParent(arguments);
    }
});
