/*
 * Gestionar riesgo.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestionarriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Riesgo.Gestionarriesgo');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Riesgo.Gestionarriesgo.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Descripci&oacute;n:' +
                '</b> {descripcion}</p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                'Sistema:</b> {sistema}</p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                'Parte del sistema:</b> {partesistema}</p><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                'Grado de peligrosidad: </b>{gradopeligrosidad}</p>'
            )
        });

        //Expander para recursos
        this.expanderRecursos = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRiesgo',
            iconCls: 'ayuda',
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            //disabled: true,
            id: 'btnAdicionarRiesgo',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            hidden: true,
            disabled: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificarRiesgo',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificar,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminarRiesgo',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            hidden: true
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar evaluación de riesgos',
            iconCls: 'exportar',
            //hidden: true
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            inicial: perfil.idestructuracomun,
            excluirConceptos:  [7, 9],
            split: true,
            region: 'center'
        });

        this.smselect = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            this.smselect, this.expander,{
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'estructura',
                sortable : false
            },
            {
                header: 'Denominaci&oacute;n',
                width: 120,
                dataIndex: 'denomriesgo',
                sortable : false
            },
            {
                header: 'Fecha detecci&oacute;n',
                width: 100,
                sortable : false,
                dataIndex: 'fdeteccion'
            },
            {
                header: 'Frecuencia',
                width: 100,
                sortable : false,
                dataIndex: 'frecuencia'
            },
            {
                header: 'Probabilidad',
                width: 100,
                sortable : false,
                dataIndex: 'probabilidad'
            },
            {
                header: 'Nivel de riesgo',
                width: 100,
                sortable : false,
                dataIndex: 'nivelriesgo'
            },
            {
                header: 'Magnitud del riesgo',
                width: 100,
                sortable: false,
                dataIndex: 'magnitud'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stRiesgos,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de riesgos.
        this.gpRiesgo = new Ext.grid.GridPanel({
            title: 'Listado de riesgos',
            region: 'center',
            height: 400,
            split: true,
            sm: this.smselect,
            plugins: this.expander,
            border: false,
            tbar: ['Buscar riesgo: ', this.sfBuscar],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stRiesgos,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Riesgos" : "Riesgo"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stRiesgos,
                displayInfo: true
            })
        });

        //Botón para adicionar medida.
        this.btnAdicionarMed = new Ext.Button({
            disabled: true,
            id: 'btnAdicionarMed',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarMed,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Boton para modificar medida.
        this.btnModificarMed = new Ext.Button({
            id: 'btnModificarMed',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarMed,
            iconCls: 'modificar',
            //hidden: true
        });

        //Botón para eliminar medida.
        this.btnEliminarMed = new Ext.Button({
            id: 'btnEliminarMed',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarMed,
            iconCls: 'eliminar',
            //hidden: true
        });

        this.columnasgpmedida = new Ext.grid.ColumnModel([
            {
                header: 'Medida',
                width: 350,
                dataIndex: 'medida',
                sortable : false
            },
            {
                header: 'Responsable',
                width: 170,
                sortable : false,
                dataIndex: 'responsable'
            },
            {
                header: 'Fecha de cumplimiento',
                width: 125,
                sortable : false,
                dataIndex: 'fcumplimiento'
            }
        ]);

        //Listado de medidas.
        this.gpMedidas = new Ext.grid.GridPanel({
            id: 'gpMedidas',
            tbar: [this.btnAdicionarMed, this.btnModificarMed, this.btnEliminarMed],
            title: 'Listado de medidas',
            region: 'center',
            border: false,
            //plugins: this.expander,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stMedidas,
            autoScroll: true,
            cm: this.columnasgpmedida,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stMedidas,
                displayInfo: true
            })
        });

        // Componentes para adicionar y modificar riesgos

        this.cbNomRiesgo = new Ext.form.ComboBox({
            store: modelo.stNomRiesgo,
            fieldLabel: 'Denominaci&oacute;n del riesgo',
            anchor: '99%',
            height: 100,
            id: 'cbNomRiesgo',
            hiddenName:'idnriesgo',
            displayField: 'denominacion',
            valueField: 'idnriesgo',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            anchor: '99%',
            height: 90,
            hiddenname: 'descripcion',
            maxLength: 500,
            allowBlank:	true
        });

        var fecha = new Date();
        this.dfFechaDeteccion = new Ext.form.DateField({
            fieldLabel: 'Fecha detecci&oacute;n',
            value: fecha.format('d/m/Y'),
            name: 'fechadeteccion',
            allowBlank: false,
            hiddenname:'fechadeteccion',
            anchor:'98%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900'
        });

        this.cbFrecuencia = new Ext.form.ComboBox({
            store: modelo.stFrecuencia,
            fieldLabel: 'Frecuencia',
            anchor: '99%',
            height: 100,
            id: 'cbFrecuencia',
            hiddenName:'idfrecuencia',
            displayField: 'denominacion',
            valueField: 'idfrecuencia',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbProbabilidad = new Ext.form.ComboBox({
            store: modelo.stProbabilidad,
            fieldLabel: 'Probabilidad',
            anchor: '98%',
            height: 100,
            id: 'cbProbabilidad',
            hiddenName:'idprobabilidad',
            displayField: 'denominacion',
            valueField: 'idprobabilidad',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbNivelRiesgo = new Ext.form.ComboBox({
            store: modelo.stNivelRiesgo,
            fieldLabel: 'Nivel',
            anchor: '99%',
            height: 100,
            id: 'cbNivelRiesgo',
            hiddenName:'idnivelriesgo',
            displayField: 'denominacion',
            valueField: 'idnivelriesgo',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbSistema = new Ext.form.ComboBox({
            store: modelo.stSistema,
            fieldLabel: 'Sistema',
            anchor: '98%',
            height: 100,
            hiddenName: 'idsistema',
            displayField: 'denominacion',
            valueField: 'idsistema',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbParteSistema = new Ext.form.ComboBox({
            store: modelo.stParteSistema,
            fieldLabel: 'Parte del sistema',
            anchor: '98%',
            height: 100,
            hiddenName: 'idpartesistema',
            displayField: 'denominacion',
            valueField: 'idpartesistema',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });


        // Componentes para adicionar y modificar medidas

        this.taMedida = new Ext.form.TextArea({
            fieldLabel: 'Medida',
            name: 'medida',
            anchor: '99%',
            height: 100,
            hiddenname: 'medida',
            maxLength: 500,
            allowBlank:	false
        });

        this.tfResponsable = new Ext.form.TextField({
            id: 'tfResponsable',
            fieldLabel: 'Responsable',
            allowBlank : false,
            maxLength: 255,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '99%',
            name : 'responsable'
        });

        var fecha = new Date();
        this.dfFechaCumplimiento = new Ext.form.DateField({
            fieldLabel: 'Fecha de cumplimiento',
            value: fecha.format('d/m/Y'),
            name: 'fechacumplimiento',
            allowBlank: true,
            hiddenname:'fechacumplimiento',
            anchor:'99%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900'
        });

        // Componentes para adicionar y modificar recursos

        this.cbNomRecurso = new Ext.form.ComboBox({
            store: modelo.stNomRecurso,
            fieldLabel: 'Denominaci&oacute;n del recurso',
            anchor: '99%',
            height: 100,
            id: 'cbNomRecurso',
            hiddenName:'idrecurso',
            displayField: 'denominacion',
            valueField: 'idrecurso',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.taDescripcionRec = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcionrec',
            anchor: '99%',
            height: 100,
            hiddenname: 'descripcionrec',
            maxLength: 500,
            allowBlank:	true
        });

        var fecha = new Date();
        this.dfFInicioRec = new Ext.form.DateField({
            id: 'dfFInicioRec',
            fieldLabel: 'Fecha inicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'98%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            maxText : idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : idioma.lbFechaMinima,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange'
        });

        this.dfFFinRec = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'99%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : idioma.lbFechaMinima,
            invalidText: idioma.invalidTextFecha,
            startDateField: 'dfFInicioRec',
            vtype:'daterange'
        });

        //------------------------------------------------------------------------------------------------------------------------------

        //Formulario de gestion de las medidas.
        this.formularioGestionMed = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.taMedida]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tfResponsable]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.dfFechaCumplimiento]
                    }]
            }]
        });

        this.btnCancelarMed = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarMed = new Ext.Button({
            //nextTab: 'cbNomRiesgo',
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicarMed = new Ext.Button({
            id: 'btnAplicarMed',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

         //Ventana de gestion de las medidas.
        this.ventanaGestionMed = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 300,
            items: [this.formularioGestionMed],
            buttons: [
                this.btnCancelarMed,
                this.btnAplicarMed,
                this.btnAceptarMed
            ],
            listeners: {
                'beforeshow': function()
                {
                    //self.taMedida.focus(true, 500);
                }
            }
        });

        //Formulario de gestion de riesgos.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.cbNomRiesgo]
                    }, {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.taDescripcion]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFechaDeteccion]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbFrecuencia]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbProbabilidad]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.cbNivelRiesgo]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.cbSistema]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.cbParteSistema]
                    }
                ]
            }]
        });

        this.btnCancelar = new Ext.Button({
            //nextTab: 'cbNomRiesgo',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'cbNomRiesgo',
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 395,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        //Botón para adicionar recurso.
        this.btnAdicionarRec = new Ext.Button({
            disabled: true,
            id: 'btnAdicionarRec',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarRec,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Boton para modificar recurso.
        this.btnModificarRec = new Ext.Button({
            id: 'btnModificarRec',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarRec,
            iconCls: 'modificar',
            //hidden: true
        });

        //Botón para eliminar recurso.
        this.btnEliminarRec = new Ext.Button({
            id: 'btnEliminarRec',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarRec,
            iconCls: 'eliminar',
            //hidden: true
        });

        this.columnasgprecurso = new Ext.grid.ColumnModel([
            this.expanderRecursos,
            {
                header: 'Recurso',
                width: 200,
                dataIndex: 'recurso',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width: 150,
                sortable : false,
                dataIndex: 'fdesde'
            },
            {
                header: 'Fecha fin',
                width: 150,
                sortable : false,
                dataIndex: 'fhasta'
            }
        ]);

        //Listado de recursos.
        this.gpRecursos = new Ext.grid.GridPanel({
            id: 'gpRecursos',
            tbar: [this.btnAdicionarRec, this.btnModificarRec, this.btnEliminarRec],
            title: 'Listado de recursos',
            region: 'center',
            border: false,
            plugins: this.expanderRecursos,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stRecursos,
            autoScroll: true,
            cm: this.columnasgprecurso,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stRecursos,
                displayInfo: true
            })
        });

        //Formulario de gestion de los recursos.
        this.formularioGestionRec = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.cbNomRecurso]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.taDescripcionRec]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFInicioRec]
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFFinRec]
                    }]
            }]
        });

        this.btnCancelarRec = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarRec = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicarRec = new Ext.Button({
            id: 'btnAplicarRec',
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

         //Ventana de gestion de los recursos.
        this.ventanaGestionRec = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 300,
            items: [this.formularioGestionRec],
            buttons: [
                this.btnCancelarRec,
                this.btnAplicarRec,
                this.btnAceptarRec
            ],
            listeners: {
                'beforeshow': function()
                {
                    //self.cbNomRecurso.focus(true, 500);
                }
            }
        });
/*----------------------------------------------------------------------------------------------------------------------
        Componente: Gestión de eventos del riesgo
----------------------------------------------------------------------------------------------------------------------*/
        this.btnAddEvento = new Ext.Button({
            disabled: true,
            id: 'btnAddEvento',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarEvento,
            iconCls: 'adicionar',
            //hidden: true
        });

        this.btnModEvento = new Ext.Button({
            id: 'btnModEvento',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarEvento,
            iconCls: 'modificar',
            //hidden: true
        });

        this.btnDelEvento = new Ext.Button({
            id: 'btnDelEvento',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarEvento,
            iconCls: 'eliminar',
            //hidden: true
        });

        this.expanderEventos = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        this.gpEventos = new Ext.grid.GridPanel({
            id: 'gpEventos',
            tbar: [this.btnAddEvento, this.btnModEvento, this.btnDelEvento],
            title: 'Listado de eventos',
            region: 'center',
            border: false,
            plugins: this.expanderEventos,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stEventos,
            autoScroll: true,
            columns: [
                {header: "Evento", width: 300, dataIndex: 'evento'},
                {header: "Fecha de registro", width: 150, dataIndex: 'fregistro'},
                {header: "Observaciones", width: 300, dataIndex: 'observaciones'},
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stEventos,
                displayInfo: true
            })
        });

        this.cbEvento = new Ext.form.ComboBox({
            store: modelo.stNomEventos,
            fieldLabel: 'Denominaci&oacute;n del evento',
            anchor: '99%',
            height: 100,
            hiddenName: 'idevento',
            displayField: 'denominacion',
            valueField: 'idevento',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        var fecha = new Date();
        this.dfFRegistroEvento = new Ext.form.DateField({
            fieldLabel: 'Fecha de registro',
            name: 'fregistro',
            hiddenname: 'fregistro',
            anchor: '99%',
            format: 'd/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            maxText: idioma.lbFechaMaxima,
            minValue: '01/01/1900',
            minText: idioma.lbFechaMinima,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange'
        });

        this.taObservacionesEvento = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observaciones',
            anchor: '99%',
            height: 100,
            hiddenname: 'observaciones',
            maxLength: 500,
            allowBlank: true
        });

        this.formularioGestionEvento= new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbEvento]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.dfFRegistroEvento]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taObservacionesEvento]
                    }]
            }]
        });

        this.btnCancelarEvento = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarEvento = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicarEvento = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        //Ventana de gestion de los eventos.
        this.ventanaGestionEvento = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 300,
            height: 300,
            items: [this.formularioGestionEvento],
            buttons: [
                this.btnCancelarEvento,
                this.btnAplicarEvento,
                this.btnAceptarEvento
            ]
        });
//----------------------------------------------------------------------------------------------------------------------
        this.btnAddPeligro = new Ext.Button({
             disabled: true,
             id: 'btnAddPeligro',
             text: idioma.BtnAdicionar,
             tooltip: idioma.lbBtnAdicionarPeligro,
             iconCls: 'adicionar',
             //hidden: true
         });

         this.btnModPeligro = new Ext.Button({
             id: 'btnModPeligro',
             text: idioma.BtnModificar,
             disabled: true,
             tooltip: idioma.lbBtnModificarPeligro,
             iconCls: 'modificar',
             //hidden: true
         });

         this.btnDelPeligro = new Ext.Button({
             id: 'btnDelPeligro',
             text: idioma.BtnEliminar,
             disabled: true,
             tooltip: idioma.lbBtnEliminarPeligro,
             iconCls: 'eliminar',
             //hidden: true
         });

         this.expanderPeligros = new Ext.grid.RowExpander({
             tpl: new Ext.Template(
                 '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
             )
         });

         this.gpPeligros = new Ext.grid.GridPanel({
             id: 'gpPeligros',
             tbar: [this.btnAddPeligro, this.btnModPeligro, this.btnDelPeligro],
             title: 'Listado de peligros',
             region: 'center',
             border: false,
             plugins: this.expanderPeligros,
             height: 300,
             loadMask: {msg: 'Cargando...'},
             store: modelo.stPeligros,
             autoScroll: true,
             columns: [
                 {header: "Peligro", width: 300, dataIndex: 'peligro'},
                 {header: "Fecha de registro", width: 150, dataIndex: 'fregistro', align: 'center'},
                 {header: "Observaciones", width: 300, dataIndex: 'observaciones'},
             ],
             bbar: new Ext.PagingToolbar({
                 pageSize: 15,
                 store: modelo.stPeligros,
                 displayInfo: true
             })
         });

         this.cbPeligro = new Ext.form.ComboBox({
             store: modelo.stNomPeligros,
             fieldLabel: 'Denominaci&oacute;n de la peligro',
             anchor: '99%',
             height: 100,
             hiddenName: 'idpeligro',
             displayField: 'denominacion',
             valueField: 'idpeligro',
             typeAhead: true,
             allowBlank: false,
             mode: 'local',
             triggerAction: 'all',
             selectOnFocus: true,
             readOnly: true,
             tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
         });

         var fecha = new Date();
         this.dfFRegistroPeligro = new Ext.form.DateField({
             fieldLabel: 'Fecha de registro',
             name: 'fregistro',
             hiddenname: 'fregistro',
             anchor: '98%',
             format: 'd/m/Y',
             value: fecha.format('d/m/Y'),
             editable: false,
             readOnly: true,
             maxValue: '31/12/2100',
             maxText: idioma.lbFechaMaxima,
             minValue: '01/01/1900',
             minText: idioma.lbFechaMinima,
             invalidText: idioma.invalidTextFecha,
             vtype: 'daterange'
         });

        this.taObservacionesPeligro = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observaciones',
            anchor: '99%',
            height: 100,
            hiddenname: 'observaciones',
            maxLength: 500,
            allowBlank: true
        });

         this.formularioGestionPeligro = new Ext.FormPanel({
             labelAlign: 'top',
             frame: true,
             bodyStyle: 'padding:5px 5px 0',
             items: [{
                 layout: 'column',
                 items: [
                     {
                         columnWidth: 1.0,
                         layout: 'form',
                         items: [this.cbPeligro]
                     }, {
                         columnWidth: 1.0,
                         layout: 'form',
                         items: [this.dfFRegistroPeligro]
                     }, {
                         columnWidth: 1.0,
                         layout: 'form',
                         items: [this.taObservacionesPeligro]
                     }]
             }]
         });

         this.btnCancelarPeligro = new Ext.Button({
             iconCls: 'cancelar',
             tooltip: idioma.textToolTipCancelar,
             text: idioma.lbtnCancelar
         });

         this.btnAceptarPeligro = new Ext.Button({
             iconCls: 'aceptar',
             tooltip: idioma.textToolTipAceptar,
             text: idioma.lbtnAceptar
         });

         this.btnAplicarPeligro = new Ext.Button({
             iconCls: 'aplicar',
             tooltip: idioma.textToolTipAplicar,
             text: idioma.lbtnAplicar
         });

        //Ventana de gestion de los peligros.
        this.ventanaGestionPeligro = new Ext.Window({
             modal: true,
             closeAction: 'hide',
             constrain: true,
             resizable: false,
             layout: 'fit',
             width: 300,
             height: 300,
             items: [this.formularioGestionPeligro],
             buttons: [
                 this.btnCancelarPeligro,
                 this.btnAplicarPeligro,
                 this.btnAceptarPeligro
             ]});
//---------------------------------------------
        this.btnAddConsecuencia = new Ext.Button({
            disabled: true,
            id: 'btnAddConsecuencia',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarConsecuencia,
            iconCls: 'adicionar',
            //hidden: true
        });

        this.btnModConsecuencia = new Ext.Button({
            id: 'btnModConsecuencia',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarConsecuencia,
            iconCls: 'modificar',
            //hidden: true
        });

        this.btnDelConsecuencia = new Ext.Button({
            id: 'btnDelConsecuencia',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarConsecuencia,
            iconCls: 'eliminar',
            //hidden: true
        });

        this.expanderConsecuencias = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        function mostrarPrincipal(val) {
            if (val == 1) {
                return '<span style="color: #33aa33;">' + '&#10004;' + '</span>';
            } else {
                return '<span style="color: #aa0710;">' + '&#08416;' + '</span>';
            }
        }

        this.gpConsecuencias = new Ext.grid.GridPanel({
            id: 'gpConsecuencias',
            tbar: [this.btnAddConsecuencia, this.btnModConsecuencia, this.btnDelConsecuencia],
            title: 'Listado de consecuencias',
            region: 'center',
            border: false,
            plugins: this.expanderConsecuencias,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stConsecuencias,
            autoScroll: true,
            columns: [
                {header: "Consecuencia", width: 300, dataIndex: 'consecuencia'},
                {header: "Fecha de registro", width: 150, dataIndex: 'fregistro', align: 'center'},
                {header: "Observaciones", width: 300, dataIndex: 'observaciones'},
                {header: "Principal", width: 300, dataIndex: 'principal', renderer: mostrarPrincipal},
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stConsecuencias,
                displayInfo: true
            })
        });

        this.cbConsecuencia = new Ext.form.ComboBox({
            store: modelo.stNomConsecuencias,
            fieldLabel: 'Denominaci&oacute;n de la consecuencia',
            anchor: '99%',
            height: 100,
            hiddenName: 'idconsecuencia',
            displayField: 'denominacion',
            valueField: 'idconsecuencia',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        var fecha = new Date();
        this.dfFRegistroConsecuencia = new Ext.form.DateField({
            fieldLabel: 'Fecha de registro',
            name: 'fregistro',
            hiddenname: 'fregistro',
            anchor: '98%',
            format: 'd/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly: true,
            maxValue: '31/12/2100',
            maxText: idioma.lbFechaMaxima,
            minValue: '01/01/1900',
            minText: idioma.lbFechaMinima,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange'
        });

        this.chbPrincipal = new Ext.form.Checkbox({
            id: 'chbPrincipal',
            boxLabel: 'Principal',
            labelSeparator: '',
            name: 'principal',
            anchor: '98%'
        });

        this.taObservacionesCons = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observaciones',
            anchor: '99%',
            height: 100,
            hiddenname: 'observaciones',
            maxLength: 500,
            allowBlank: true
        });

        this.formularioGestionConsecuencia = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbConsecuencia]
                    }, {
                        columnWidth: 0.75,
                        layout: 'form',
                        items: [this.dfFRegistroConsecuencia]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [this.chbPrincipal]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.taObservacionesCons]
                    }]
            }]
        });

        this.btnCancelarConsecuencia = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarConsecuencia = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicarConsecuencia = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        //Ventana de gestion de los consecuencias.
        this.ventanaGestionConsecuencia = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 300,
            height: 300,
            items: [this.formularioGestionConsecuencia],
            buttons: [
                this.btnCancelarConsecuencia,
                this.btnAplicarConsecuencia,
                this.btnAceptarConsecuencia
            ]
        });

        this.tabPanel = new Ext.TabPanel({
            region: 'south',
            disabled: true,
            margins: '0 0 0 0',
            //height: '100%',
            height: 280,
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpMedidas, this.gpRecursos, this.gpEventos, this.gpConsecuencias, this.gpPeligros],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });
        
        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [
                {region: 'west',
                    xtype: 'panel',
                    id: 'east-panel',
                    autoHeight: false,
                    split: true,
                    width: '30%',
                    border: false,
                    collapsible: true,
                    title: 'Estructura organizativa',
                    layout: 'fit',
                    items: [this.tpEstructura]
                },
                {region: 'center',
                    xtype: 'panel',
                    id: 'center-panel',
                    autoHeight: false,
                    split: true,
                    width: '70%',
                    border: false,
                    layout: 'border',
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnExportar, '->', this.btnAyuda],
                    items: [this.gpRiesgo, this.tabPanel]
                }
            ]
        });

    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarriesgo', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Riesgo.Gestionarriesgo.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Riesgo.Gestionarriesgo.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Riesgo.Gestionarriesgo.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});