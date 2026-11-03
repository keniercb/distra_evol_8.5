/**
 * @name componentes.CmpEstructuraConcepto - Componente para la configuración de las estructuras por conceptos.
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Orestes Rodríguez Lorenzo
 *         Yaricel Guerra Velázquez
 * @version 1.0
 */
Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.EstructuraConcepto = Ext.extend(Ext.Panel,{
    id: 'pEstructConcepto',
    title: 'Estructuras por conceptos',
    tabTip: 'Configurar estructuras por conceptos y funcionalidades',
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        //Boton para mostrar la ayuda del sistema.
        this.btnAyudaEstCncpt = new Ext.Button({
            id: 'btnAyudaEstCncpt',
            iconCls: 'ayuda',
            text: this.idioma.btnAyudaEstCncpt_text,
            tooltip: this.idioma.btnAyudaEstCncpt_tooltip
        });
        //Boton para limpiar la asociacion de la estructura al concepto.
        this.btnLimpiarEst = new Ext.Button({
            id: 'btnLimpiarEst',
            iconCls: 'limpiar',
            text: this.idioma.btnLimpiarEst_text,
            tooltip: this.idioma.btnLimpiarEst_tooltip,
            listeners: {
                click: function() {
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/estructuraconcepto/modConfEstructConcepto',
                        params: {
                            idestructconcepto: self.gpEstructConcepto.getSelectionModel().getSelected().data.idestructconcepto,
                            idestructura: null
                        },
                        success: function(r) {
                            var responseData = Ext.decode(r.responseText);
                            self.stCfgEstructConcepto.reload();
                        }
                    });
                }
            }
        });
        //Combobox de las estructuras
        var cbTreeEstrcut = new Ext.components.TreeComboBox({
            anchor: '98%',
            allowBlank: true,
            emptyText: this.idioma.cbTreeEstrcut_emptyText,
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/pvd/maestro/configuraciones/index.php/estructuraconcepto/obtenerEstructura',
                    preloadChildren: false
                }),
                border: false,
                autoScroll: true,
                root: new Ext.tree.AsyncTreeNode({
                    id: '-1',
                    text: 'Arbol'
                }),
                listeners: {
                    click: function(node, e) {
                        Ext.Ajax.request({
							url: '/pvd/maestro/configuraciones/index.php/estructuraconcepto/modConfEstructConcepto',
							params: {
								idestructconcepto: self.gpEstructConcepto.getSelectionModel().getSelected().data.idestructconcepto,
								idestructura: node.id
								},
							success: function(r) {
								var responseData = Ext.decode(r.responseText);
								self.stCfgEstructConcepto.reload();
							}
                        });
                    }
				}
			}
        });
        this.stCfgEstructConcepto = new Ext.data.GroupingStore({
            url: '/pvd/maestro/configuraciones/index.php/estructuraconcepto/obtenerCfgEstructConcepto',
            reader: new Ext.data.JsonReader({
                root: "", id: ""
            }, [
                {name: 'idestructconcepto'},
                {name: 'denominacion'},
                {name: 'idestructura'},
                {name: 'estructura'},
                {name: 'agrupador'}
            ]),
            sortInfo   : {
                field: 'agrupador',
                direction: "DESC"
            },
            groupField : 'agrupador'
        });
        this.stCfgEstructConcepto.load();
        this.smEstructConcepto = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        //Grid editable para el listado de conceptos.
        this.gpEstructConcepto = new Ext.grid.EditorGridPanel({
            store: this.stCfgEstructConcepto,
            tbar: [this.btnLimpiarEst, '->', this.btnAyudaEstCncpt],
            border: false,
            autoScroll: true,
            sm: this.smEstructConcepto,
            region: 'center',
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group}'
            }),
            columns: [
                {dataIndex: 'agrupador', hidden: true},
                {header: 'Concepto y/o funcionalidad', width:300, dataIndex: 'denominacion'},
                {header: 'Ubicaci&oacute;n', width:300, dataIndex: 'estructura', editor: cbTreeEstrcut}
            ]
        });
        this.items = [this.gpEstructConcepto];
        Pvd.Maestro.Configuraciones.EstructuraConcepto.superclass.initComponent.call(this);
    }
});