Ext.ns('Costo.Procesos.Asociacion.Cuenta');
Costo.Procesos.Asociacion.Cuenta.View={
    init : function(perfil,etiquetas,model){

        this.btnAdicionar = new Ext.Button({
            id : 'btnAdicionar',
            icon : perfil.dirImg + 'adicionar.png',
            iconCls : 'btn',
            tooltip : etiquetas.textToolTipAdicionar,
            text :etiquetas.lbBtnAdicionar
        });
        this.btnModificar = new Ext.Button({
            disabled : true,
			hidden: true,
            id : 'btnModificar',
            icon : perfil.dirImg + 'modificar.png',
            iconCls : 'btn',
            tooltip : etiquetas.textToolTipModificar,
            text :etiquetas.lbBtnModificar
        });
        this.btnEliminar = new Ext.Button({
            disabled : true,
            id : 'btnEliminar',
            icon : perfil.dirImg + 'eliminar.png',
            iconCls : 'btn',
            tooltip : etiquetas.textToolTipEliminar,
            text :etiquetas.lbBtnEliminar
        });
        this.btnAbrir = new Ext.Button({
            id : 'btnAbrir',
              iconCls: 'vistareporte',
            tooltip : etiquetas.textToolTipAbrir,
            text : etiquetas.lbBtnAbrir
        });
        this.btnEjecutar = new Ext.Button({
            disabled : true,
            id : 'btnEjecutar',
              iconCls: 'confirmar',
            tooltip : etiquetas.textToolTipEjecutarPrincipal,
            text : etiquetas.lbBtnEjecutarMain
        });
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
              iconCls: 'buscar',
            tooltip: etiquetas.textToolTipBuscar,
            text: etiquetas.lbBtnBuscar
        });
        // ***************Grid Principal**********************************
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect : true
        });

        this.grid = new Ext.grid.GridPanel({
            store: model.storeAjustes,
            sm : this.sm,
            frame : true,
            loadMask:true,
            autoExpandColumn: 'descripcion',
            columns: [{
                id : 'numero',
                width: 100,
                sortable : true,
                header : etiquetas.lbCodigo,
                dataIndex : 'numero'
            },{
                id : 'descripcion',
                width: 100,
                sortable : true,
                header : etiquetas.lbDescripcion,
                dataIndex : 'descripcion'
            },{
                id : 'estado',
                width: 300,
                sortable : true,
                header : etiquetas.lbEstado,
                dataIndex : 'estado',
                renderer:this.Estado
            },{
                id : 'numcomprobante',
                width: 300,
                sortable : true,
                header : etiquetas.lbNumComprobante,
                dataIndex : 'numerocomprobante'
            }],
            bbar : new Ext.Cont.PagingToolbar({
                pageSize : 20,
                displayInfo : true,
                displayMsg : etiquetas.displayMsg,
                emptyMsg : etiquetas.emptyMsg,
                tabIndex : 314,
                store : model.storeAjustes
            })
        });

        //****Panel Superior: Asociacion******
        this.panel = new Ext.Panel({
            region:'center',
            title : etiquetas.lbTitPanelPrincipal,
            height:100,
            layout:'fit',
            items : [{
                layout:'fit',
                region:'center',
                margins: '3 3 3 3',
                items:this.grid
            }],
            tbar : [this.btnAdicionar,this.btnModificar,this.btnEliminar,this.btnEjecutar,this.btnBuscar]
        });

        new Ext.Viewport({
            layout : 'border',
            items : [this.panel]
        });

    },
    SearchField : Ext.extend(Ext.form.TwinTriggerField, {
        validationEvent:false,
        validateOnBlur:false,
        selectOnFocus : true,
        id : 'myedit',
        trigger1Class:'x-form-clear-trigger',
        trigger2Class:'x-form-search-trigger',
        hideTrigger1:true
    })
    ,
    Estado: function(value,metaData){
        metaData.attr = value ?  'style="color:#0a0"' : 'style="color:#f00"' ;
        return value ? etiquetas.lbEjecutada : etiquetas.lbNoEjecutada;
    },
    CrearWindw:function (perfil,model,tipo){
        var scope = perfil;

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            icon : perfil.dirImg + 'cancelar.png',
            iconCls : 'btn',
            tooltip : etiquetas.textToolTipCancelar,
            text :etiquetas.lbBtnCancelar
        });
        this.btnEjecutar = new Ext.Button({
            id:'btnEjecutar',
            icon : perfil.dirImg + 'confirmar.png',
            iconCls : 'btn',
            tooltip : etiquetas.textToolTipEjecutar,
            text : etiquetas.lbBtnEjecutar
        });
        this.btnAplicar = new Ext.Button({
            id:'btnAplicar',
              iconCls: 'aplicar',
            tooltip : etiquetas.textToolTipEjecutarAplicar,
            text :etiquetas.lbBtnAplicar
        });
        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
              iconCls: 'aceptar',
            tooltip : etiquetas.textToolTipEjecutarAceptar,
            text :etiquetas.lbBtnAceptar
        });

        this.tfNumero = new Ext.form.TextField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbCodigo + etiquetas.lbMarcaCampoObligatorio,
            allowBlank: false,
            anchor: '100%',
            enableKeyEvents:true
        });

        this.txaDescripcion = new Ext.form.TextArea({
            name : 'descripcion',
            anchor : '100%',
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  () . , ' " -])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  () . , ' " -])+$/,
            maxLength : 255,
            maxLengthText: etiquetas.maxLengthText,
            fieldLabel : etiquetas.lbDescripcion + etiquetas.lbMarcaCampoObligatorio,
            enableKeyEvents:true,
            allowBlank: false
        });

        this.cbCentroCosto = new Ext.form.ComboBox({
            fieldLabel : etiquetas.lbCentroCosto + etiquetas.lbMarcaCampoObligatorio,
            anchor : '100%',
            emptyText : etiquetas.emptyText,
            triggerAction : 'all',
            mode: 'local',
            blankText : etiquetas.blankText,
            enableKeyEvents:true,
            allowBlank : false,
            forceSelection:true,
            typeAhead: true,
            selectedClass:'',
            editable: false,
            store : new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
            }),
            onSelect:Ext.emptyFn,
            lazyRender : true,
            tpl: '<div id = \"centros\" style = \"height:240px; !important;\"></div>'
        });
//        this.sfBuscarCentro = new this.SearchField();
//        this.toolbarCentro = new Ext.Toolbar({
//            id: 'tbCO',
//            items: [this.sfBuscarCentro]
//        })
        this.smCentros = new Ext.grid.RowSelectionModel({
            singleSelect : true
        });
        this.gridCentros = new Ext.grid.GridPanel({
            store: model.storeCentros,
            sm : this.smCentros,
            loadMask:true,
            frame : true,
            stripeRows  : true,
            autoExpandColumn: 'descripcion',
            columns: [{
                id : 'idcentrogrupo',
                hidden: true,
                sortable : true,
                header : etiquetas.headerId,
                dataIndex : 'idcentrogrupo'
            },{
                id : 'concat',
                sortable : true,
                width: 150,
                header : etiquetas.lbCodigo,
                dataIndex : 'concat'
            },{
                id : 'descripcion',
                sortable : true,
                header : etiquetas.lbDescripcion,
                dataIndex : 'descripcion'
            }],
           // tbar : [this.toolbarCentro],
            bbar : new Ext.Cont.PagingToolbar({
                pageSize : 20,
                displayInfo : true,
                displayMsg : etiquetas.displayMsg,
                emptyMsg : etiquetas.emptyMsg,
                tabIndex : 314,
                store : model.storeCentros
            })
        });
        this.idCentroNivel = new Ext.form.Hidden();

        this.cbCPproceso = new Ext.form.ComboBox({
            disabled : true,
            fieldLabel :etiquetas.lbTitcbCuentaProceso + etiquetas.lbMarcaCampoObligatorio,
            anchor : '100%',
            emptyText : etiquetas.emptyText,
            triggerAction : 'all',
            mode: 'local',
            readOnly : true,
            blankText : etiquetas.blankText ,
            enableKeyEvents:true,
            allowBlank : false,
            forceSelection:true,
            typeAhead: true,
            selectedClass:'',
            editable: false,
            store : new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
            }),
            onSelect:Ext.emptyFn,
            lazyRender : true,
            tpl: '<div id = \"cuentasproceso" style = \"height:150px; !important;\"></div>'
        });
//        this.sfBuscarCuentasProceso = new this.SearchField();
//        this.toolbarCuentasProceso = new Ext.Toolbar({
//            id: 'tbCO',
//            items: [this.sfBuscarCuentasProceso]
//        })
        this.smCuentasProceso = new Ext.grid.RowSelectionModel({
            singleSelect : true
        });
        this.gridCuentasProceso = new Ext.grid.GridPanel({
            store: model.storeCuentasProceso,
            sm : this.smCuentasProceso,
            //loadMask:true,
            frame : true,
            stripeRows  : true,
            autoExpandColumn: 'descripcion',
            columns: [{
                id : 'idcuenta',
                hidden: true,
                sortable : true,
                header : etiquetas.headerId,
                dataIndex : 'idcuenta'
            },{
                id : 'concat',
                sortable : true,
                width: 150,
                header : etiquetas.lbCodigo,
                dataIndex : 'concat'
            },{
                id : 'descripcion',
                sortable : true,
                header : etiquetas.lbDescripcion,
                dataIndex : 'descripcion'
            }],
           // tbar : [this.toolbarCuentasProceso],
            bbar : new Ext.Cont.PagingToolbar({
                pageSize : 20,
                displayInfo : true,
                displayMsg : etiquetas.displayMsg,
                emptyMsg : etiquetas.emptyMsg,
                tabIndex : 314,
                store : model.storeCuentasProceso
            })
        });

        this.idCuenta = new Ext.form.Hidden();

        this.cbCPterminada = new Ext.form.ComboBox({
            disabled : true,
            fieldLabel :etiquetas.lbTitcbCuentaTerminada + etiquetas.lbMarcaCampoObligatorio,
            anchor : '100%',
            emptyText : etiquetas.emptyText,
            triggerAction : 'all',
            mode: 'local',
            readOnly : true,
            blankText : etiquetas.blankText ,
            enableKeyEvents:true,
            allowBlank : false,
            forceSelection:true,
            typeAhead: true,
            selectedClass:'',
            editable: false,
            store : new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
            }),
            onSelect:Ext.emptyFn,
            lazyRender : true,
            tpl: '<div id = \"cuentasterminada" style = \"height:150px; !important;\"></div>'
        });
//        this.sfBuscarCuentasTerminada = new this.SearchField();
//        this.toolbarCuentasTerminada = new Ext.Toolbar({
//            id: 'tbCO',
//            items: [this.sfBuscarCuentasTerminada]
//        })
        this.smCuentasTerminada = new Ext.grid.RowSelectionModel({
            singleSelect : true
        });
        this.gridCuentasTerminada = new Ext.grid.GridPanel({
            store: model.storeCuentasTerminada,
            sm : this.smCuentasTerminada,
            //loadMask:true,
            frame : true,
            stripeRows  : true,
            autoExpandColumn: 'descripcion',
            columns: [{
                id : 'idcuenta',
                hidden: true,
                sortable : true,
                header : etiquetas.headerId,
                dataIndex : 'idcuenta'
            },{
                id : 'concat',
                sortable : true,
                width: 150,
                header : etiquetas.lbCodigo,
                dataIndex : 'concat'
            },{
                id : 'descripcion',
                sortable : true,
                header : etiquetas.lbDescripcion,
                dataIndex : 'descripcion'
            }],
           // tbar : [this.toolbarCuentasTerminada],
            bbar : new Ext.Cont.PagingToolbar({
                pageSize : 20,
                displayInfo : true,
                displayMsg : etiquetas.displayMsg,
                emptyMsg : etiquetas.emptyMsg,
                tabIndex : 314,
                store : model.storeCuentasTerminada
            })
        });

        this.idCuentaterminada = new Ext.form.Hidden();

        this.cbCPvendida = new Ext.form.ComboBox({
            disabled : true,
            fieldLabel :etiquetas.lbTitcbCuentaVendida,
            anchor : '100%',
            emptyText : etiquetas.emptyText,
            triggerAction : 'all',
            mode: 'local',
            readOnly : true,
            blankText : etiquetas.blankText ,
            enableKeyEvents:true,
            allowBlank : false,
            forceSelection:true,
            typeAhead: true,
            selectedClass:'',
            editable: false,
            store : new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
            }),
            onSelect:Ext.emptyFn,
            lazyRender : true,
            tpl: '<div id = \"cuentavendida" style = \"height:150px; !important;\"></div>'
        });
//        this.sfBuscarCuentasVendida = new this.SearchField();
//        this.toolbarCuentasVendida = new Ext.Toolbar({
//            id: 'tbCO',
//            items: [this.sfBuscarCuentasVendida]
//        })
        this.smCuentasVendida = new Ext.grid.RowSelectionModel({
            singleSelect : true
        });
        this.gridCuentasVendida = new Ext.grid.GridPanel({
            store: model.storeCuentasVendida,
            sm : this.smCuentasVendida,
            // loadMask:true,
            frame : true,
            stripeRows  : true,
            autoExpandColumn: 'descripcion',
            columns: [{
                id : 'idcuenta',
                hidden: true,
                sortable : true,
                header : etiquetas.headerId,
                dataIndex : 'idcuenta'
            },{
                id : 'concat',
                sortable : true,
                width: 150,
                header : etiquetas.lbCodigo,
                dataIndex : 'concat'
            },{
                id : 'descripcion',
                sortable : true,
                header : etiquetas.lbDescripcion,
                dataIndex : 'descripcion'
            }],
           // tbar : [this.toolbarCuentasVendida],
            bbar : new Ext.Cont.PagingToolbar({
                pageSize : 20,
                displayInfo : true,
                displayMsg : etiquetas.displayMsg,
                emptyMsg : etiquetas.emptyMsg,
                tabIndex : 314,
                store : model.storeCuentasVendida
            })
        });
        this.idCuentavendida = new Ext.form.Hidden();

        this.tfImporteProceso = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbImporte,
            id:'idImporteProceso',
            allowBlank: false,
			//readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });

        this.tfEquivalenteProceso = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbTitcbProcesoEquivalente,
            id:'idEquivalenteProceso',
            allowBlank: false,
			//readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });

        this.tfDiferenciaProceso = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbDiferencia,
            id:'idDiferenciaProceso',
            allowBlank: false,
			readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });

        this.tfImporteTerminada = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbImporte,
            id:'idImporteTerminada',
            allowBlank: false,
			//readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });

        this.tfEquivalenteTerminada = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbTitcbTerminadaExistente,
            id:'idEquivalenteTerminada',
            allowBlank: false,
			//readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });
        this.tfDiferenciaTerminada = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbDiferencia,
            id:'idDiferenciaTerminada',
            allowBlank: false,
			readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });
        this.tfImporteVendida = new Ext.form.NumberField({
            maskRe: /^\d*$/,
            regex: /^\d*$/,
            maxLength: 8,
            maxLengthText: etiquetas.maxLengthTextNumero,
            name: 'numero',
            fieldLabel: etiquetas.lbImporte,
            id:'idImporteVendida',
            allowBlank: false,
			//readOnly : true,
            anchor: '100%',
            enableKeyEvents:true
        });
        this.panelGestionar = new Ext.form.FormPanel({
            layout : 'form',
            labelAlign : 'top',
            frame : true,
            autoHeight:true,
            items :[{
                layout : 'form',
                items :[this.tfNumero,this.txaDescripcion,this.cbCentroCosto]
            },{
                xtype:'tabpanel',
                plain:true,
                activeTab: 0,
                height:300,
                defaults:{
                    bodyStyle:'padding:10px'
                },
                items:[{
                    title:etiquetas.lbTitcbTabProceso,
                    layout:'form',
                    defaults: {
                        width: 230
                    },
                    items: [
                    this.cbCPproceso,this.tfImporteProceso,this.tfEquivalenteProceso, this.tfDiferenciaProceso
                    ]
                    },{
                    title:etiquetas.lbTitcbTabTerminada,
                    layout:'form',
                    defaults: {
                        width: 230
                    },
                    items: [
                    this.cbCPterminada,this.tfImporteTerminada,this.tfEquivalenteTerminada, this.tfDiferenciaTerminada
                    ]
                },{
                    title:etiquetas.lbTitcbTabVendida,
                    disabled: true,
                    layout:'form',
                    width: 230,
                    items: [
                    this.cbCPvendida,this.tfImporteVendida
                    ]
                }]
            },this.idCentroNivel,this.idCuenta,this.idCuentaterminada,this.idCuentavendida
            ]
        }
        );

        this.winGestionar= new Ext.Window({
            title:(tipo==1)?etiquetas.lbTitVentanaAdicionar:etiquetas.lbTitVentanaModificar,
            modal: true,
            resizable:false,
            layout:'fit',
            autoHeight:true,
            constrain: true,
            defaultButton: 0,
            width    : '40%',
            closeAction:'close',
            items :[this.panelGestionar],
            buttons : (tipo==1)?[this.btnCancelar,this.btnEjecutar,this.btnAplicar,this.btnAceptar]:[this.btnCancelar,this.btnAceptar]
        });

    } ,
     createWindowsSearch: function(model) {
        this.btnCancelarSearch = new Ext.Button({
            id: 'btnCancelarSearch',
              iconCls: 'cancelar',
            //tooltip : etiquetas.tooltipBtnCancelar,
            text: etiquetas.lbBtnCancelar
        });
        this.btnAceptarSearch = new Ext.Button({
            id: 'btnAceptarSearch',
            disabled: true,
              iconCls: 'aceptar',
            //tooltip : etiquetas.tooltipBtnAceptar,
            text: etiquetas.lbBtnAceptar
        });

	   this.cbEstado= new Ext.form.ComboBox({
            store:model.stEstados,
            valueField : 'idestado',
            displayField : 'descripcion',
            fieldLabel :etiquetas.lbEstado,
            anchor : '100%',
            emptyText : etiquetas.emptyText,
            triggerAction : 'all',
            mode: 'local',
            id : 'idcbEstado',
            name : 'estado',
            readOnly : true,
	    editable:false,
            enableKeyEvents:true
        });

        this.tfCodigo = new Ext.form.TextField({
            id: 'tfCodigo',
            maskRe: /^([0-9])*$/,
            regex: /^([0-9])*$/,
            maxLength: 100,
            name: 'codigo',
            fieldLabel: etiquetas.lbCodigo,
            anchor: '100%',
            enableKeyEvents: true
        });

        this.tfNombre = new Ext.form.TextField({
            id: 'tfNombre',
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  () . , ' " -])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  () . , ' " -])+$/,//^([a-zA-Z Ã¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘]+?[a-zA-Z]*)+$/,
            maxLength: 100,
            name: 'descripcion',
            fieldLabel: etiquetas.lbDescripcion,
            anchor: '100%',
            enableKeyEvents: true
        });

        this.panelSearch = new Ext.form.FormPanel({
            id: 'panelSearch',
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            height: 150,
            width: 300,
            bodyStyle: 'background-color:#fff;',
            items: [this.tfCodigo, this.cbEstado, this.tfNombre]
        });

        this.ventanaSearch = new Ext.Window({
            title: etiquetas.titleWindowsBuscar,
            id: 'ventanaSearch',
            modal: true,
            resizable: false,
            constrain: true,
            defaultButton: 0,
            layout: 'fit',
            closeAction: 'close',
            items: [this.panelSearch],
            buttons: [this.btnCancelarSearch, this.btnAceptarSearch]
        });
    }
};
//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil
perfil.etiquetas = Object();
var etiquetas = Object();

	Ext.Ajax.request({
        method : "POST",
        url : "cargaretiquetas",
        callback : function(options, success, response)
        {
            etiquetas = Ext.decode(response.responseText);
			//Inicializar el modelo
			var model = Costo.Procesos.Asociacion.Cuenta.Model;
			model.init();

			//Inicializar la vista.
			var view = Costo.Procesos.Asociacion.Cuenta.View;
			view.init(perfil, etiquetas, model);

			//Inicializar controlador.
			var controller = Costo.Procesos.Asociacion.Cuenta.Controller;
			controller.init(perfil,etiquetas, view, model);
		}
	});