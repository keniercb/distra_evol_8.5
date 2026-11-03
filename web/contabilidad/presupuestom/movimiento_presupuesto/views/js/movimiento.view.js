Ext.namespace('Movimiento');
Ext.QuickTips.init();

Ext.Msg.wait('Cargando... porfavor espere!');
Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Movimiento.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
        Ext.Msg.hide();
    }
});


Movimiento.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        var scope = this;
        this.model = Movimiento.Store.Model;
        this.model.init();
        this.tipo_operacion = new Ext.data.SimpleStore({
            fields: ['operacion'],
            data:[['Desagrego el Presupuesto para los mandos por salario'],['Desagrego el Presupuesto para los mandos para otros gastos'],['Desagrego el Presupuesto para los mandos por gastos capital']]
        });
        this.rowactionMod = new Ext.grid.RowActions({
            id: 'idRowactionn',
            actions: [
                {
                    id: 'modificar',
                    //tooltip: scope.etiquetas.lbToolDel,
                    iconCls: 'modificar',
                    tooltip: 'Modificar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });
        this.rowactionDel = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 100,
            //header: "",
            actions: [
                {
                    id: 'eliminar',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'Eliminar',
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                    //hideIndex: 'showCmp',
                    //textIndex: 'um'
                },
            ]
        });

        this.rowEditor = new Ext.Cont.RowEditor({
            cancelText: 'Cancelar',
            saveText: 'Aceptar',
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            //saveTooltip: this.idioma.lbToolRowEditorAceptar,
            //cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });
        this.smoperacion = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.smoperacion.row
        //****--------- Botones-----------***********
        this.btnAdicionar= new Ext.Button({
            text: 'Adicionar',
            disabled: false,
            iconCls: 'adicionar'
        });
        this.btnConfirmar= new Ext.Button({
            text: 'Confirmar',
            disabled: false,
            iconCls: 'confirmar'
        });
        this.btnPostear= new Ext.Button({
            text: 'Postear',
            disabled: false,
            iconCls: 'postear'
        });
        this.btnVistaRep= new Ext.Button({
            text: 'Vista reporte',
            disabled: false,
            iconCls: 'reporte'
        });
        this.btnAyuda = new Ext.Button({
            text: 'ayuda',
            disabled: false,
            id: 'btnHelpRegCmp',
            iconCls: 'ayuda'
        });
        //****--------- Botones-----------***********
        //****--------- Grid-----------***********
        this.pagingBar = new Ext.PagingToolbar({
            pageSize: 30,
            displayInfo: true,
            clearFilter: true,
            store: this.model.store_desagregacion,
            toggleHandler: function(btn, pressed){
                var as = this.GridPrincipal.getView();
                as.showPreview = pressed;
                as.refresh();
            }
        });
        this.cbOperacion = new Ext.form.ComboBox({
            id:'cbOperacion',
            header: "Operacion",
            width:250,
            dataIndex: 'operacion',
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                mode: 'local',
                fieldLabel: 'operacion',
                align: 'right',
                valueField: 'operacion',
                displayField: 'operacion',
                store: scope.tipo_operacion,
                triggerAction: 'all',
                lazyRender: true,
                allowBlank: false,
            })
        })
        this.tfUM=new Ext.form.TextField({
            header: "UM",
            id:'um',
            dataIndex: 'unidadm',
            editor:new Ext.form.TextField({
                allowBlank: false,
                disabled: false,
                store: this.model.store_desagregacion
            })});

        this.cm = new Ext.grid.ColumnModel([scope.cbOperacion
            ,scope.tfUM,{
                header: "Grupo",
                id:'grupo',
                dataIndex: 'grupo',
                align: 'right',
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    mode:'local',
                    fieldLabel: 'Grupo',
                    align: 'right',
                    valueField: 'grupo',
                    displayField: 'grupo',
                    store:this.model.store_desagregacion,
                    triggerAction: 'all',
                    lazyRender:true,
                    allowBlank: false,
                })
            },{
                header: "Especialidad",
                dataIndex: 'especialidad',
                id:'especialidad',
                align: 'right',
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    mode:'local',
                    fieldLabel: 'Especialidad',
                    align: 'right',
                    valueField: 'especialidad',
                    displayField: 'especialidad',
                    store:this.model.store_desagregacion,
                    triggerAction: 'all',
                    lazyRender:true,
                    allowBlank: false,
                    allowBlank: false,
                })
            },
            {
                header: "Partida",
                dataIndex: 'partida',
                id:'partida',
                align: 'right',
                editor: new Ext.form.ComboBox({
                    typeAhead: true,
                    mode:'local',
                    fieldLabel: 'Partida',
                    align: 'right',
                    valueField: 'partida',
                    displayField: 'partida',
                    store:this.model.store_desagregacion,
                    triggerAction: 'all',
                    lazyRender:true,
                    allowBlank: false,
                })
            },{
                header: "Importe",
                dataIndex: 'importe',
                id:'importe',
                align: 'right',
                renderer: 'usMoney',
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 9999999999999,
                    allowBlank: false,

                })
            },scope.rowactionMod,scope.rowactionDel
        ]);

        this.GridPrincipal=new Ext.grid.EditorGridPanel({
            bbar: this.pagingBar,
            clicksToEdit: 2,
            id: 'button-grid',
            region: 'center',
            cm: scope.cm,
            layout:'fit',
            sm: this.smoperacion,
            store: this.model.store_desagregacion,
            plugins:[scope.rowEditor,scope.rowactionMod, scope.rowactionDel],
            /* handler: function () {
                 this.rowEditor.stopEditing();
                 this.rowEditor.startEditing(0, 0);
                             },*/
            viewConfig: {
                forceFit: true
            },
            tbar: [this.btnAdicionar,'','','',this.btnConfirmar,'','','',this.btnPostear,'','','',this.btnVistaRep,
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                'Fecha contable:','','','','','','','','','','','','','','','','','','','','','',
                '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',this.btnAyuda],
            frame: true
        });
        //****--------- Grid-----------***********

        //****--------- Paneles-----------***********

        this.panelPrincipal= new Ext.Panel({
            layout: 'border',
            title: 'Movimiento de presupuesto',
            region: 'center',
            layout:'fit',
            items:[this.GridPrincipal]
        });
        //****--------- Paneles-----------***********
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            items: [this.panelPrincipal]
        });
        var controller = Movimiento.Presupuesto.Controller;
        controller.init(params.idioma, this, this.model);




        Movimiento.Viewport.superclass.constructor.call(this, params);

    }


});
