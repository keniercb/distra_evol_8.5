Ext.ns('Ext.Zeolides.Nomtipodia');
Ext.Zeolides.Nomtipodia.Vista = {

    init: function (idioma, modelo) {
        this.fecha = new Date();

        //selectionmodel del grid principal
        this.smgridTipodia = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.expander = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p><b>&nbsp;&nbsp;Descripci&oacute;n:</b>&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        function boolean(val, metaData, record, rowIndex, colIndex, store){
            if(val == 1)
                return '<center><img src="/pvd/regimentrabajo/views/images/tick.png" /></center>';
            else
                return '<center><img src="/pvd/regimentrabajo/views/images/restringir.png" /></center>';
        }

        function color(val, metaData, record, rowIndex, colIndex, store){
            return '<span style="-moz-border-radius: 100px; -webkit-border-radius: 100px; border-radius: 100px; cursor: pointer; float: left; width: 20px; height: 20px; background:'+val+'; color:'+val+'"></span>';
        }

        //grid principal de la ventana
        this.gridTipodia = new Ext.grid.GridPanel({
            title:idioma.gpTitle,
            id:'gridTipodia',
            store: modelo.storeTipodia,
            columns: [
                this.expander,
                new Ext.grid.RowNumberer(),
                { header: "idtipodedia", hidden:true,width: 150, menuDisabled:true, dataIndex: 'idtipodedia'},
                { header: "Denominaci&oacute;n", width: 200, menuDisabled:true, dataIndex: 'denominacion'},
                { header: "Fecha inicio", sortable:false, width: 150, menuDisabled:true, dataIndex: 'fdesde'},
                { header: "Fecha fin", sortable:false, width: 150, menuDisabled:true, dataIndex: 'fhasta'},
                { header: "Trabajo", sortable:false, width: 100,renderer:boolean, menuDisabled:true, dataIndex: 'trabajo'},
                { header: "Color", sortable:false, width: 40, menuDisabled:true, dataIndex: 'color',renderer:color},
            ],
            height: 300,
            width: 500,
            plugins: this.expander,
            loadMask:{msg :idioma.MsgCargandoGrid},
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: modelo.storeTipodia,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar"
            }),
            sm: this.smgridTipodia
        });

        this.btnAyuda = new Ext.Button({
            id:'btnAyudaNomTipoDia',
            text: idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:idioma.lbBtnAyuda
        });

        //Boton adicionar
        this.btnAdicionar = new Ext.Button({
            id:'btnAdicionar',
            iconCls:'adicionar',
            prevTab:'btnEliminar',
            nextTab: 'btnModificar',
            text:idioma.btnAdicionar,
            tooltip:idioma.ttbtnAdicionar,
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

        //ventana para ADD y MOD

        this.denominacion = new Ext.form.TextField({
            id: 'denominacion',
            fieldLabel: idioma.lbDenominacion,
            name: 'denominacion',
            hiddenname:'denominacion',
            minLength: 3,
            maxLength: 100,
            enableKeyEvents:true,
            maxLengthText:idioma.MaxLengthText,
            prevTab: 'btnAceptar',
            nextTab: 'fechainicio',
            regex:/^(\S+[a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9]*)+\S$/,
            regexText:idioma.regexText,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            anchor:'98%',
            allowBlank:false,
            blankText:idioma.lbCampoVacio
        });


        this.fechainicio = new Ext.form.DateField({
            id: 'fechainicio',
            hiddenname:'fdesde',
            fieldLabel: idioma.lbFechaInicio,
            name: 'fdesde',
            anchor:'97%',
            prevTab: 'tfdenom',
            nextTab: 'fechafin',
            enableKeyEvents:true,
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
            anchor:'100%',
            format:'d/m/Y',
            editable:true,
            readOnly : false,
            enableKeyEvents:true,
            prevTab: 'fechainicio',
            nextTab: 'descripcion',
            editable:true,
            minText:idioma.minDateText,
            invalidText: idioma.invalidTextFecha,
            anchor:'98%',
            vtype:'daterange',
            startDateField: 'fechainicio'
        });

        this.trabajo = new Ext.form.Checkbox({
            name : 'trabajo',
            id : 'trabajo',
            anchor:'100%',
            boxLabel  : 'Trabajo',
            hideLabel:true,
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
            anchor:'98%',
            allowBlank: false
        });

        //Formulario de la ventana ADD MOD
        this.formularioADDMOD = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            width : '100%',
            autoHeight:true,
            autoShow:true,
            items:[
                {
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        //anchor:'50%',
                        items: [this.denominacion,this.fechainicio]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.color,this.fechafin]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.trabajo]
                    }]
                },this.descripcion]
        });

        this.btnCancelar = new Ext.Button({
            id:'btnCancelar',
            iconCls:'cancelar',
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
            nextTab: 'btnAceptar',
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
            width : 450,
            height :318,
            constrain: true,
            closable:true,
            resizable:false,
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
            tbar:[this.btnAdicionar,this.btnModificar,this.btnEliminar,'-','->',this.btnAyuda],
            region:'center',
            items:[this.gridTipodia]
        });
		
        //Vista general
        var vp = new Ext.Viewport({
            layout: 'border',
            items: [this.pGeneral]
        });

    }

};

//Inicializando la vista.
function Cargar () {
    //Escogiendo la configuraci?n del idioma seg?n la versi?n del MT.
    var idioma = Ext.Zeolides.Nomtipodia.Idioma;
    //Inicializando el modelo
    var modelo = Ext.Zeolides.Nomtipodia.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Ext.Zeolides.Nomtipodia.Vista;
    vista.init(idioma, modelo);
    //Inicializar controlador.
    var controller = Ext.Zeolides.Nomtipodia.Controlador;
    controller.init(idioma, vista, modelo);


};

Cargar();




//
