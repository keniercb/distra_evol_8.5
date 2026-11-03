/*
 * Gestionar plantillas.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Documentos
 * @uses Pvd.Documentos.Plantillas
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Documentos.Plantillas');

Pvd.Documentos.Plantillas.Vista = {
	init: function (idioma, modelo) {
        var self = this;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id:'btnAyuda',
            text: 'Ayuda',
            iconCls:'ayuda',
            disabled: false,
            tooltip: idioma.ttlbBtnAyu
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: idioma.lbBtninsertar,
            tooltip: idioma.ttBtnAdicionar,
            iconCls: 'adicionar',
            hidden: true
        });

        //Botón para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: idioma.lbBtnmodificar,
            disabled: true,
            tooltip: idioma.ttBtnModificar,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.lbBuscar,
            tooltip: idioma.ttlbBtnBuscar,
            iconCls: 'buscar'
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.lbBtnLimpiartext,
            tooltip: idioma.ttBtnLimpiar,
            iconCls: 'limpiar'
        });

        //Botón para diseñar.
        this.btnDisennar = new Ext.Button({
            id: 'btnDisenar',
            disabled: true,
            text: idioma.lbBtndisennar,
            tooltip: idioma.ttBtnDisennar,
            iconCls:'editar',
            hidden: true
        });

        //Boton para replicar la estructura
        this.btnReplicar = new Ext.Button({
            id: 'btnReplicar',
            disabled: true,
            text: idioma.lbbtnReplicar,
            tooltip: idioma.ttbtnReplicar,
            iconCls:'asociacionmasiva',
            hidden: false
        });

        //Botón para ver.
        this.btnVer = new Ext.Button({
            id: 'btnVer',
            text: idioma.lbBtnVer,
            disabled: true,
            tooltip: idioma.ttBtnVer,
            iconCls: 'ver',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            disabled: true,
            text: idioma.lbBtnEliminar,
            tooltip: idioma.ttBtnEliminar,
            iconCls: 'eliminar',
            hidden: true
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id:'tfbuscar',
            allowBlank : true,
            minLength: 3,
            enableKeyEvents: true,
            emptyText: 'Criterio a buscar...',
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width:140,
            name : 'tfbuscador'
        });

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}<br><b>Tipo de plantilla:</b>' +
                ' {tipos}<br><b>Configuración:</b> {configuraciones}</p>'
            )
        });
		
		function mostrarTooltip(val, metaData, record, rowIndex, colIndex, store) {
			metaData.attr = 'ext:qtip="Doble click para diseñar plantilla"';
            return val;            
        }

        this.smPlant = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        //Listado de plantillas.
        this.gpPlantillas = new Ext.grid.GridPanel({
            title: idioma.lbListado,
            store: modelo.stPlantillas,
            loadMask:{msg: 'Cargando...'},
            plugins:this.expander,
            sm: this.smPlant,
            columns: [this.expander,
                {
                    header: idioma.lbDenominacion,
                    width:400,
                    dataIndex: 'denominacion',
					renderer: mostrarTooltip
                },
                {
                    header: idioma.lbFechaInicio,
                    width:200,
                    dataIndex: 'fdesde',
					renderer: mostrarTooltip
                },
                {
                    header: idioma.lbLabelFFin,
                    width:200,
                    dataIndex: 'fhasta',
					renderer: mostrarTooltip
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPlantillas,
                displayInfo: true
            })
        });


        //Fechas para el buscar

        this.dfFIniciob = new Ext.form.DateField({
            id: 'dfFIniciob',
            fieldLabel: idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            width:160,
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.dfFFinb = new Ext.form.DateField({
            id: 'dfFFin',
            name: 'fhasta',
            hiddenname:'fhasta',
            width:160,
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFIniciob',
            vtype:'daterange'
        });

        //Panel con barra de herramientas y listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: false,
            items: [this.gpPlantillas],
            tbar: [
                '-','',
                idioma.lbDenominacion+':',
                this.tfbuscar,
                '','-',
                idioma.lbFechaInicio+':',
                this.dfFIniciob,
                '','-',
                idioma.lbLabelFFin+':',
                this.dfFFinb, '','-',
                this.btnBuscar,
                this.btnLimpiar,'','-'
            ]
        });

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'north',
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar, '-',
                this.btnDisennar,
                this.btnVer,'-',
                this.btnReplicar,
                '->', '','-',
                this.btnAyuda]
        });

        /*
       * Configuración para la asignación
       * Estructura: [ABC, 'D', 'E']
       *   ABC: (Número de 3 dígitos) Identificador de la funcionalidad. Donde A es el identificador del módulo
       *        y BC (2 dígitos) es el identificador de la funcionalidad.
       *        Los valores para A son los siguientes:
       *           1: Persona
       *           2: Fuerza de trabajo
       *           3: Selección de personal
       *           4: Asistencia
       *           5: Evaluación del desempeño
       *           6: Retribución salarial
       *           7: Competencias laborales
       *           8: Capacitación y desarrollo
       *           9: Seguridad y salud en el trabajo
       *           0: Otros
       *   D: Denominación del módulo.
       *   E: Denominación de la funcionalidad.
       * */
        var datConfigAsig = [
            [101, 'Persona', 'Ficha de la persona'],
            [201, 'Fuerza de trabajo', 'Ficha de la persona'],
            [202, 'Fuerza de trabajo', 'Contratos'],
            [203, 'Fuerza de trabajo', 'Suplementos']
        ];

        modelo.stConfAsignacion.loadData(datConfigAsig);
        this.smConfAsig = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpConfigAsignacion = new Ext.grid.GridPanel({
            store: modelo.stConfAsignacion,
            title: 'Listado de tipos de plantilla por módulo',
            height: 145,
            loadMask:{msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group}'
            }),
            sm: this.smConfAsig,
            columns: [this.smConfAsig,
                {
                    hidden: true,
                    width:200,
                    dataIndex: 'id'
                },{
                    header: 'Dominio',
                    width:300,
                    dataIndex: 'dominio',
                    hidden: true
                },
                {
                    header: 'Funcionalidad',
                    width:300,
                    dataIndex: 'funcionalidad'
                }
            ]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id:'tfdenominacion',
            fieldLabel: idioma.lbDenominacion,
            allowBlank : false,
            //minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });

        var fecha = new Date();
        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio',
            fieldLabel: idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            value: fecha.format('d/m/Y'),
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFinb',
            fieldLabel: idioma.lbLabelFFin,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicio',
            vtype:'daterange'
        });

        // Area de texto Descripción de la Facultad de decisión
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: idioma.lbDescripcion,
            name: 'descripcion',
            id:	'tadescripcion',
            anchor:	'99%',
            height: 90,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: idioma.lbRegexTextDescripcion,
            allowBlank:	true
        });

        this.smConfiguraciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        //Listado de ...
        this.gpConfiguraciones = new Ext.grid.GridPanel({
            title:'Listado de configuraciones',
            id: 'gpConfiguraciones',
            store: modelo.stConfiguraciones,
            height: 175,
            frame: true,
            loadMask:{msg: 'Cargando...'},
            sm: this.smConfiguraciones,
            columns: [this.smConfiguraciones,
                {
                    header: 'Identificador',
                    width:200,
                    dataIndex: 'idconfiguracion'
                },
                {
                    header: idioma.lbDenoV,
                    width:370,
                    dataIndex: 'denominacion'
                }
            ]
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            id: 'formulariogestion',
            title: 'Datos b&aacute;sicos',
            labelAlign: 'top',
            frame:true,
            height: 340,
            bodyStyle:'padding:0px 0px 0px 5px',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFFin]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tadescripcion]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.gpConfigAsignacion]
                    }]
            }]
        });

        this.tbaddAccion = new Ext.TabPanel({
            id: 'tbaddAccion',
            region: 'center',
            margins: '0 0 0 0',
            height: '100%',
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.formularioGestion, this.gpConfiguraciones],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenominacion',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.BtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenominacion',
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.BtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicar';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenominacion';
                }
            }
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.BtnAplicar
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            id: 'ventanaGestion',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: idioma.lbAddplantilla,
            width: 500,
            height: 475,
            items: [this.tbaddAccion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });


        //Ventana para diseñar plantilla.
        this.ventanaDisennar = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: 'Diseñar plantilla',
            width: 900,
            height: 500
        });

        this.tlEst = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            preloadChildren: false
        });

        this.tpEstruct = new Ext.tree.TreePanel({
            split: false,
            autoScroll: true,
            region: 'south',
            height: 350,
            border: false,
            layout: 'fit',
            loader: self.tlEst,
            rootVisible: true,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Estructura organizacional',
                id: 0
            })
        });

        this.btnCancelarRep = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.BtnCancelar,
            handler: function () {
                self.ventanaReplicar.hide();
            }.createDelegate(this)
        });

        this.btnAceptarRep = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.BtnAceptar
        });

        //Ventana de gestion.
        this.ventanaReplicar = new Ext.Window({
            modal: true,
            title: 'Replicar plantilla',
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            width: 450,
            height: 400,
            items: [this.tpEstruct],
            buttons: [
                this.btnCancelarRep,
                this.btnAceptarRep
            ],
            keys: [{
                key: 'x',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarRep.disabled) {
                        self.btnCancelarRep.handler();
                    }
                }
            },
            {
                key: 13,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAceptarRep.disabled) {
                        self.btnAceptarRep.handler();
                    }
                }
            }]
        });


        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [this.panel2, this.panel]
        });
	}
};

UCID.portal.cargarEtiquetas('plantillasdoc', function(perfil, idioma){
	idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Pvd.Documentos.Plantillas.Modelo;
    modelo.init();
    var vista = Pvd.Documentos.Plantillas.Vista;
    vista.init(idioma, modelo);
    UCID.portal.cargarAcciones(window.frameElement.id);
    Pvd.Documentos.Plantillas.Controlador.init(idioma, vista, modelo);
});
