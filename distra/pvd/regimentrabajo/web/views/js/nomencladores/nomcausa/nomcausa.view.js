Ext.ns('Ext.Zeolides.NomCausa');
Ext.Zeolides.NomCausa.Vista = {

    init: function (idioma, modelo) {
        this.fecha = new Date();

        //selectionmodel del grid principal
        this.smgridCausaasistencia = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.expander = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p><b>&nbsp;&nbsp;Descripci&oacute;n:</b>&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        function color(val, metaData, record, rowIndex, colIndex, store){
            return '<span style="-moz-border-radius: 100px; -webkit-border-radius: 100px; border-radius: 100px; cursor: pointer; float: left; width: 20px; height: 20px; background:'+val+'; color:'+val+'"></span>';
        }

        function boolean(val, metaData, record, rowIndex, colIndex, store){
            if(val == 1)
                return '<center><img src="/pvd/regimentrabajo/views/images/tick.png" /></center>';
            else if(val == 0)
                return '<center><img src="/pvd/regimentrabajo/views/images/restringir.png" /></center>';
            else
                return '';
        }

        this.gridCausaasistencia = new Ext.tree.ColumnTree({
                height: 300,
                width: 500,
                rootVisible:true,
                autoScroll:true,
                title:idioma.gpTitle,
                el: "tree",
                columns:[
                    { header: "Denominaci&oacute;n", width: 400, dataIndex: 'denominacion'},
                    { header: "Abreviatura", width: 100, dataIndex: 'abreviatura'},
                    { header: "Fecha inicio", width: 80,  dataIndex: 'fdesde'},
                    { header: "Fecha fin",  width: 80, dataIndex: 'fhasta'},
                    { header: "Cantidad incidencias",  width: 115, dataIndex: 'cantincidencias'},
                    { header: "Modifica Entrada/Salida",  width: 130, renderer:boolean, dataIndex: 'tieneentradasalida'},
                    { header: "Modifica per&iacute;odo", width: 110, renderer:boolean, dataIndex: 'tieneperiodo'},
                    { header: "Descuenta 1 hora",  width: 110, renderer:boolean, dataIndex: 'descuenta'},
                    { header: "Afecta salario",  width: 110, renderer:boolean, dataIndex: 'afectasalario'},
                    { header: "Modifica usuario",  width: 110, renderer:boolean, dataIndex: 'modifica'},
                    { header: "Color",  width: 40,  dataIndex: 'color',renderer:color}
                ],

                loader: new Ext.tree.TreeLoader({
                    dataUrl:'/pvd/regimentrabajo/index.php/nomcausa/getcausas',
                        uiProviders:{
                        'col': Ext.tree.ColumnNodeUI
                    },
                    baseParams:{
                        criterio:-1
                    }
                }),

                root: new Ext.tree.AsyncTreeNode({
                    id:'raiz',
                    text:'Causas',
                    expanded: true
                })
            });




        this.btnAyuda = new Ext.Button({
            id:'btnAyudaNomCausa',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        function ItemClick(){

        }

       this.mainMenu = new Ext.menu.Menu({
           id: 'AddElementos',
           items: [
               {
                   text:idioma.txtCausas,
                   id:'addcausa',
                   tooltip:idioma.ttbtnAdicionar,
                   checkHandler:function(){

                   }
               },
               {
                   text:idioma.agrupador,
                   tooltip:idioma.ttbtnAdicionarA,
                   id:'addagrupador',
               }
           ]
       });

        //Boton adicionar
        this.btnAdicionar = new Ext.Button({
            id:'btnAdicionar',
            iconCls:'adicionar',
            prevTab:'btnEliminar',
            nextTab: 'btnModificar',
            text:idioma.btnAdicionar,
            disabled:true,
            menu:this.mainMenu

        });

        //boton modificar
        this.btnModificar = new Ext.Button({
            id:'btnModificar',
            iconCls:'modificar',
            prevTab:'btnAdicionar',
            nextTab: 'btnEliminar',
            text:idioma.btnModificar,
            tooltip:idioma.ttbtnModificar,
            disabled:true
        });

        //Boton Eliminar
        this.btnEliminar = new Ext.Button({
            id:'btnCancelarA',
            iconCls:'eliminar',
            prevTab:'btnModificar',
            nextTab: 'btnAdicionar',
            text:idioma.btnEliminar,
            tooltip:idioma.ttbtnEliminar,
            disabled:true
        });

        //Boton Configurar causa
        this.btnConfcausa = new Ext.Button({
            id:'btnConfcausa',
            iconCls:'configuracion',
            prevTab:'btnEliminar',
            nextTab: 'btnAdicionar',
            text:idioma.btnConfcausa,
            tooltip:idioma.lbBtnConfCausa
        });

        this.btnExpandAll = new Ext.Button({
            tooltip: 'Expandir <b>(Alt+Abajo)</b>',
            iconCls: 'expandir',
            listeners: {
                keypress: function (tf, e) {
                    console.info(e.getKey());

                }
            }
        });

        this.btnCollapseAll  = new Ext.Button({
            tooltip: 'Contraer <b>(Alt+Arriba)</b>',
            iconCls: 'contraer'
        });

        this.btnGuardar = new Ext.Button({
            id:'btnGuardar',
            iconCls:'guardar',
            prevTab:'btnEliminar',
            nextTab: 'btnAdicionar',
            text:idioma.btnGuardar,
            tooltip:idioma.lbBtnGuardarCausa,
            disabled:true
        });

        this.btnCerrarconfcausa = new Ext.Button({
            id:'btnCerrarconfcausa',
            iconCls:'cerrar',
            tooltip:idioma.lbBtnCerrar,
            text:'Cerrar'
        });

        this.gridconfreporteausencia = new Ext.grid.GridPanel({
            title:idioma.gpTitlelistnomina,
            id:'gridconfreporteausencia',
            region:'center',
            store: modelo.stcamporeporteausencia,
            viewConfig:{
                forceFit:true
            },
            columns: [
                new Ext.grid.RowNumberer(),
                { header: "idvariablesconfreportescertificaciones", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idvariablesconfreportescertificaciones'},
                { header: "Denominaci&oacute;n", width: 310, menuDisabled:true, dataIndex: 'denominacionvariable'},
            ],
            height: 300,
            width : '50%',
            loadMask:{msg :idioma.MsgCargandoGrid}
        });


        this.smcausaausencia = new Ext.grid.CheckboxSelectionModel({
            singleSelect:false,
            listeners: {

            }
        });

        this.gridConfcausaausencia = new Ext.grid.GridPanel({
            title:idioma.gpTitlelistasistencia,
            id:'gridConfcausaausencia',
            region:'east',
            store: modelo.stCausaasistencia,
            viewConfig:{
                forceFit:true
            },
            columns: [
                this.smcausaausencia,
                { header: "idcausa", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idcausa'},
                { header: "Denominaci&oacute;n", width: 310, menuDisabled:true, dataIndex: 'denominacion'},
            ],
            height: 300,
            width : '50%',
            loadMask:{msg :idioma.MsgCargandoGrid},
            sm: this.smcausaausencia
        });



        this.pConfcausa = new Ext.Panel({
            width : '100%',
            layout:'border',
            tbar:[this.btnGuardar],
            region:'center',
            items:[this.gridconfreporteausencia, this.gridConfcausaausencia]
        });

        this.ventanaConfcausa = new Ext.Window({
            title:idioma.gpTitleWinConfCausa,
            layout:'fit',
            width : 700,
            height : 450,
            closable:true,
            resizable: false,
            closeAction: 'hide',
            items:[this.pConfcausa],
            modal: true,
            buttons: [this.btnCerrarconfcausa]

        });

        //ventana para ADD y MOD

        this.denominacion = new Ext.form.TextField({
            id: 'denominacion',
            fieldLabel: idioma.lbDenominacion,
            name: 'denominacion',
            hiddenname:'denominacion',
            minLength: 3,
            enableKeyEvents:true,
            maxLength: 100,
            maxLengthText:idioma.MaxLengthText,
            prevTab: 'btnAceptar',
            nextTab: 'abreviatura',
            regexText:idioma.regexTextdenom,
            anchor:'97%',
            allowBlank:false,
            blankText:idioma.lbCampoVacio
        });

        var _self = this;
        this.tcbCausas = new Ext.components.TreeComboBox({
            anchor: '98%',
            editable: true,
            enableKeyEvents: true,
            fieldLabel: 'Categoría',
            treeConfig: {
                rootVisible: false,
                loader: modelo.TreePanelLoader,
                border: false,
                autoScroll: true
            },
            listeners: {
                keypress: function (tf, e) {
                    if (e.getKey() == 8 || e.getKey() == 46) {
                        _self.tcbCausas.valueNotFoundText = '';
                        _self.tcbCausas.setValue(null);
                        if (_self.tcbCausas.isExpanded())
                            _self.tcbCausas.collapse();

                    }

                }
            }
        })


        this.abreviatura = new Ext.form.TextField({
            id: 'abreviatura',
            fieldLabel: idioma.abreviatura,
            name: 'abreviatura',
            hiddenname:'abreviatura',
            maxLength: 10,
            maxLengthText:idioma.MaxLengthTextAbrev,
            prevTab: 'denominacion',
            enableKeyEvents:true,
            nextTab: 'fechainicio',
            regex:/^(\S+[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9\/]*)?\S+$/,
            regexText:idioma.regexTextabrev,
            anchor:'98%',
            allowBlank:false,
            blankText:idioma.lbCampoVacio
        });


        this.fechainicio = new Ext.form.DateField({
            id: 'fechainicio',
            hiddenname:'fdesde',
            enableKeyEvents:true,
            fieldLabel: idioma.lbFechaInicio,
            name: 'fdesde',
            anchor:'97%',
            prevTab: 'tfdenom',
            nextTab: 'fechafin',
            value:this.fecha.format('d/m/Y'),
            format:'d/m/Y',
            editable:true,
            maxText:idioma.maxDateText,
            allowBlank:false,
            blankText:idioma.lbCampoVacio,
            invalidText: idioma.invalidTextFecha,
            vtype:'daterange',
            endDateField: 'fechafin'
        });

        this.fechafin = new Ext.form.DateField({
            id: 'fechafin',
            fieldLabel: idioma.lbFechaFin,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'98%',
            format:'d/m/Y',
            editable:true,
            enableKeyEvents:true,
            readOnly : false,
            prevTab: 'fechainicio',
            nextTab: 'cantincidencias',
            minText:idioma.minDateText,
            invalidText: idioma.invalidTextFecha,
            vtype:'daterange',
            startDateField: 'fechainicio'
        });

        this.descripcion = new Ext.form.TextArea({
            fieldLabel: idioma.lbDescripcion,
            name: 		'descripcion',
            id:			'descripcion',
            anchor:		'99%',
            height:75,
            hiddenname: 'descripcion',
            enableKeyEvents:true,
            prevTab: 'fechafin',
            nextTab: 'btnAsociar',
            maxLength: 255,
            maxLengthText:idioma.maxLengthTextArea,
            regex:/^(\S)+([ ]?(\S))*$/,
            regexText: idioma.lbRegexTextdescripcion,
            allowBlank:	true,
            blankText:	idioma.lbCampoVacio
        });

        this.color =new Ext.form.ColorField({
            fieldLabel: idioma.lbColor,
            id: 'color',
            width: 175,
            anchor:'97%',
            allowBlank: false
        });

        this.tieneentradasalida = new Ext.form.Checkbox({
            name : 'tieneentradasalida',
            id : 'tieneentradasalida',
            anchor:'100%',
            boxLabel  : idioma.tieneentradasalida,
            hideLabel:true
        });

        this.tieneperiodo = new Ext.form.Checkbox({
            name : 'tieneperiodo',
            id : 'tieneperiodo',
            anchor:'100%',
            boxLabel  : idioma.tieneperiodo,
            hideLabel:true
        });

        this.descuenta = new Ext.form.Checkbox({
            name : 'descuenta',
            id : 'descuenta',
            anchor:'100%',
            boxLabel  : 'Descuenta 1 hora',
            hideLabel:true
        });

        this.afectasalario = new Ext.form.Checkbox({
            name: 'afectasalario',
            id: 'afectasalario',
            anchor: '100%',
            boxLabel: idioma.lbDescuentaNomina,
            hideLabel: true
        });

        this.modifica = new Ext.form.Checkbox({
            name: 'modificau',
            id: 'modificau',
            anchor: '100%',
            boxLabel: 'Modifica usuario',
            hideLabel: true
        });

        this.cantincidencias = new Ext.form.TextField({
            id: 'cantincidencias',
            fieldLabel: 'Cantidad de incidencias en un período',
            name: 'cantincidencias',
            hiddenname:'cantincidencias',
            enableKeyEvents:true,
            maxLength: 2,
            maxLengthText:idioma.MaxLengthTextcantincidencias,
            prevTab: 'fechafin',
            nextTab: 'tieneentradasalida',
            regexText:idioma.regexTextdenom,
            maskRe : /^([0-9]+ ?[0-9]*)+$/,
            anchor:'97%',
            allowBlank:true
        });

       this.store = new Ext.data.SimpleStore({
            fields: ['idtipo','denom'],
            data : [[1,'Agrupador'],[2,'Causa']]
        });
        this.CbTipo = new Ext.form.ComboBox({
            id:'cbTipo',
            fieldLabel:idioma.cbTipo,
            store: this.store,
            displayField:'denom',
            valueField:'idtipo',
            mode: 'local',
            anchor:'97%',
            triggerAction: 'all',
            emptyText:idioma.TxtSeleccione
        });


        //Formulario de la ventana ADD MOD
        this.formularioADDMOD = new Ext.FormPanel({
            labelAlign: 'left',
            frame:true,
            width : '100%',
            autoHeight:true,
            autoShow:true,
            items:[
                {
                    layout:'column',
                    items:[
                        {
                        columnWidth:.5,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.denominacion]
                    },
                        {
                        columnWidth:.5,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.tcbCausas]
                    }]
                },
                {
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.color,this.fechainicio, this.cantincidencias]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.abreviatura,this.fechafin]
                    }]
                },{
                    layout:'column',
                    items:[{
                        columnWidth:.35,
                        layout: 'form',
                        labelAlign: 'left',
                        items: [this.tieneentradasalida]
                    },{
                        columnWidth:.35,
                        layout: 'form',
                        labelAlign: 'left',
                        items: [this.tieneperiodo]
                    },{
                        columnWidth:.30,
                        layout: 'form',
                        labelAlign: 'left',
                        items: [this.descuenta]
                    },{
                        columnWidth:.35,
                        layout: 'form',
                        labelAlign: 'left',
                        items: [this.afectasalario]
                    },{
                        columnWidth:.35,
                        layout: 'form',
                        labelAlign: 'left',
                        items: [this.modifica]
                    }]
                },{
                    layout:'column',
                    items:[{
                        columnWidth:1,
                        layout: 'form',
                        labelAlign:'top',
                        items: [this.descripcion]
                    }]
                }

                ]
        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
            //icon:perfil.dirImg+'cancelar.png',
            tooltip:idioma.lbBtnCanc,
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:idioma.lbtnCancelar
        });

        this.btnAplicar = new Ext.Button({
            id:'btnAplicar',
            iconCls:'aplicar',
            hidden: true,
            prevTab: 'btnCancelar',
            nextTab: 'btn Aceptar',
            text:idioma.lbtnAplicar,
            tooltip:idioma.lbBtnAplic
        });

        this.btnAceptar = new Ext.Button({
            id:'btnAceptar',
            iconCls:'aceptar',
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:idioma.lbtnAceptar,
            tooltip:idioma.lbBtnAcep
        });

        this.ventanaADDMOD = new Ext.Window({
            title:'Provisional',
            layout:'fit',
            width : 770,
            height : 430,
            closable:true,
            resizable:true,
            closeAction: 'hide',
            items:[this.formularioADDMOD],
            modal: true,
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar]
        });

        //ventana para ADD y MOD


        //Panel general contiene el grid
        this.pGeneral = new Ext.Panel({
            width : '100%',
            bodyBorder : true,
            border : true,
            layout:'fit',
            tbar:[this.btnAdicionar,this.btnModificar,this.btnEliminar,'-',this.btnExpandAll, this.btnCollapseAll,'-',/*,this.btnConfcausa,*/ '->',this.btnAyuda],
            region:'center',
            items:[this.gridCausaasistencia]
        });
		
        //Vista general
        var vp = new Ext.Viewport({
            layout: 'border',
            items: [this.pGeneral]
        });
        this.gridCausaasistencia.render();
    }

};


//Inicializando la vista.
UCID.portal.cargarEtiquetas('nomcausa', function(perfil, idioma){

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Ext.Zeolides.NomCausa.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Ext.Zeolides.NomCausa.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Ext.Zeolides.NomCausa.Controlador.init(idioma, vista, modelo);

});


//
