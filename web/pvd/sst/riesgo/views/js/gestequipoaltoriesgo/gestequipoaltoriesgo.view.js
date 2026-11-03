/*
  * Gestionar equipos de alto riesgo.
 *
 * @author Ing. Yaricel Guerra Velazquez
 * @package Pvd.Riesgo
 * @uses Pvd.Riesgo.Gestequipoaltoriesgo
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Riesgo.Gestequipoaltoriesgo');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Riesgo.Gestequipoaltoriesgo.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Presi&oacute;n de cálculo:</b> {presioncalculo}</p><b>Presi&oacute;n autorizada:</b>' +
                ' {presionautorizada}</p><b>Capacidad de cálculo:</b> {capacidadcalculo}</p><b>Capacidad' +
                ' autorizada:</b>{capacidadautorizada}</p><b>Ubicaci&oacute;n:</b> {ubicacion}</p><br>'
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
            id: 'btnAdicionarEquipo',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            hidden: true,
            disabled: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificarEquipo',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificar,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminarEquipo',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            hidden: true
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            cargos: false,
            width: '20%',
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
        });

        this.smselect = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            this.expander,{
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'estructura',
                sortable : false
            },
            {
                header: 'Denominaci&oacute;n',
                width: 120,
                dataIndex: 'denominacion',
                sortable : false
            },
            {
                header: 'Clasificaci&oacute;n',
                width: 120,
                dataIndex: 'clasifequipo',
                sortable: false
            },
            {
                header: 'No. inventario',
                width: 80,
                sortable : false,
                dataIndex: 'inventario'
            },
            {
                header: 'Modelo',
                width: 80,
                sortable : false,
                dataIndex: 'modelo'
            },
            {
                header: 'País',
                width: 100,
                sortable: false,
                dataIndex: 'pais'
            },
            {
                header: 'Año',
                width: 50,
                sortable: false,
                dataIndex: 'annofabricacion'
            },
            {
                header: 'No. serie',
                width: 80,
                sortable: false,
                dataIndex: 'serie'
            }
        ]);

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stEquipoRiesgos,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        //Listado de riesgos.
        this.gpEquipoRiesgos = new Ext.grid.GridPanel({
            title: 'Listado de equipos de alto riesgo',
            region: 'center',
            height: 550,
            split: true,
            sm: this.smselect,
            plugins: this.expander,
            border: false,
            tbar: ['Buscar equipo: ', this.sfBuscar],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stEquipoRiesgos,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Equipos" : "Equipo"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stEquipoRiesgos,
                displayInfo: true
            })
        });
        
        //Botón para adicionar medida.
        this.btnAdicionarInsp = new Ext.Button({
            disabled: true,
            id: 'btnAdicionarInsp',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbbtnAdicionarInsp,
            iconCls: 'adicionar',
            hidden: true
        });

        //Boton para modificar medida.
        this.btnModificarInsp = new Ext.Button({
            id: 'btnModificarInsp',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbbtnModificarInsp,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar medida.
        this.btnEliminarInsp = new Ext.Button({
            id: 'btnEliminarInsp',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbbtnEliminarInsp,
            iconCls: 'eliminar',
            hidden: true
        });

        function mostrarFila(val, metaData, record) {
            if (val == null) {
                return '';
            } else {
                if (record.get('cantd') < 0 && record.get('finspeccion') == null) {
                    metaData.attr = 'ext:qtip="La inspección se encuentra atrasada."';
                    return '<span style="color:#ff0b3a;"><b>' + val + '</b></span>';
                } else {
                    return val;
                }
            }
        }

        this.columnasinsp = new Ext.grid.ColumnModel([
            {
                header: 'Tipo de inspección',
                width: 350,
                hidden: true,
                dataIndex: 'tipoinspeccion',
                sortable : false
            },
            {
                header: 'Fecha planificada',
                width: 170,
                sortable : false,
                dataIndex: 'fplan',
                renderer: mostrarFila
            },
            {
                header: 'Fecha de inspección',
                width: 125,
                sortable : false,
                dataIndex: 'finspeccion',
                renderer: mostrarFila
            },
            {
                header: 'Resultado',
                width: 125,
                sortable: false,
                dataIndex: 'resultadoinspeccion',
                renderer: mostrarFila
            }
        ]);
        
        //Listado de inspecciones.
        this.gpInspecciones = new Ext.grid.GridPanel({
            id: 'gpInspecciones',
            tbar: [this.btnAdicionarInsp, this.btnModificarInsp, this.btnEliminarInsp],
            title: 'Inspección técnica',
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Inspecciones" : "Inspección"]})'
            }),
            region: 'center',
            border: false,
            //plugins: this.expander,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stInspecciones,
            autoScroll: true,
            cm: this.columnasinsp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stInspecciones,
                displayInfo: true
            })
        });

        // Componentes para adicionar y modificar riesgos

        this.tfDenominacionEq = new Ext.form.TextField({
            fieldLabel: 'Denominación',
            allowBlank: false,
            maxLength: 255,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '99%',
            name: 'denominacion'
        });

        this.cbClasifequipo = new Ext.form.ComboBox({
            store: modelo.stClasifEquipo,
            fieldLabel: 'Clasificaci&oacute;n del equipo',
            anchor: '99%',
            height: 100,
            id: 'cbClasifequipo',
            hiddenName:'idclasifequipo',
            displayField: 'denominacion',
            valueField: 'idclasifequipo',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            readOnly: false,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.tfNoInventario = new Ext.form.TextField({
            fieldLabel: 'No. de inventario',
            allowBlank: false,
            maxLength: 255,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '99%',
            name: 'inventario'
        });

        this.tfModelo = new Ext.form.TextField({
            fieldLabel: 'Modelo',
            allowBlank: true,
            maxLength: 255,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '99%',
            name: 'modelo'
        });
        
       this.taUbicacion = new Ext.form.TextArea({
            fieldLabel: 'Ubicaci&oacute;n',
            name: 'ubicacion',
            anchor: '99%',
            height: 68,
            hiddenname: 'ubicacion',
            maxLength: 500,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        this.cbPais = new Ext.form.ComboBox({
            store: modelo.stPais,
            fieldLabel: 'País',
            anchor: '98%',
            height: 100,
            hiddenName: 'idpais',
            displayField: 'nombrepais',
            valueField: 'idpais',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{nombrepais}</b></br>{descripcion}" class="x-combo-list-item">{nombrepais}</div></tpl>'
        });

        this.nfAnno = new Ext.form.NumberField({
            fieldLabel: 'Año',
            anchor: '98%',
            allowBlank: true,
            tabIndex: 2,
            name: 'anno',
            maxLength: 100
        });

        this.tfSerie = new Ext.form.TextField({
            fieldLabel: 'Serie',
            allowBlank: true,
            maxLength: 255,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            anchor: '98%',
            name: 'serie'
        });

        this.fsDatosfab = new Ext.form.FieldSet({
            title: 'Datos de fabricación',
            name: 'datosfab',
            checkboxToggle: false,
            collapsed: false,
            layout: 'column',
            autoHeight: true,
            width: '93%',
            items: [
                {
                    columnWidth: .40,
                    layout: 'form',
                    items: this.cbPais
                },
                {
                    columnWidth: .30,
                    layout: 'form',
                    items: [this.nfAnno]
                },
                {
                    columnWidth: .30,
                    layout: 'form',
                    items: [this.tfSerie]
                }
            ]
        });

        this.nfPresioncalculo= new Ext.form.NumberField({
            fieldLabel: 'De cálculo',
            anchor: '98%',
            allowBlank: true,
            tabIndex: 2,
            name: 'presioncalculo',
            maxLength: 100
        });

        this.nfPresionautorizada = new Ext.form.NumberField({
            fieldLabel: 'Autorizada',
            anchor: '98%',
            allowBlank: true,
            tabIndex: 2,
            name: 'presionautorizada',
            maxLength: 100
        });

        this.fsPresiontrab = new Ext.form.FieldSet({
            title: 'Presi&oacute;n de trabajo',
            name: 'prestrab',
            checkboxToggle: false,
            collapsed: false,
            layout: 'column',
            autoHeight: true,
            width: '93%',
            items: [
                {
                    columnWidth: .50,
                    layout: 'form',
                    items: this.nfPresioncalculo
                },
                {
                    columnWidth: .50,
                    layout: 'form',
                    items: [this.nfPresionautorizada]
                }
            ]
        });

        this.nfCapcalculo = new Ext.form.NumberField({
            fieldLabel: 'De cálculo',
            anchor: '98%',
            allowBlank: true,
            tabIndex: 2,
            name: 'capacidadcalculo',
            maxLength: 100
        });

        this.nfCapautorizada = new Ext.form.NumberField({
            fieldLabel: 'Autorizada',
            anchor: '98%',
            allowBlank: true,
            tabIndex: 2,
            name: 'capacidadautorizada',
            maxLength: 100
        });

        this.fsCapacidadtrab = new Ext.form.FieldSet({
            title: 'Capacidad de carga',
            name: 'prestrab',
            checkboxToggle: false,
            collapsed: false,
            layout: 'column',
            autoHeight: true,
            width: '93%',
            items: [
                {
                    columnWidth: .50,
                    layout: 'form',
                    items: this.nfCapcalculo
                },
                {
                    columnWidth: .50,
                    layout: 'form',
                    items: [this.nfCapautorizada]
                }
            ]
        });

        //Formulario de gestion de equipos.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [this.tfDenominacionEq]
                    }, {
                        columnWidth:0.25,
                        layout: 'form',
                        items: [this.cbClasifequipo]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [this.tfNoInventario]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [this.tfModelo]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.fsDatosfab]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.fsPresiontrab]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.fsCapacidadtrab]
                    }, {
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.taUbicacion]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            //nextTab: 'cbClasifequipo',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'cbClasifequipo',
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
            width: 800,
            height: 310,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfDenominacionEq.focus(true, 500);
                }
            }
        });
        
        //Botón para adicionar observacion.
        this.btnAdicionarObs = new Ext.Button({
            disabled: true,
            id: 'btnAdicionarObs',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbbtnAdicionarObs,
            iconCls: 'adicionar',
            hidden: true
        });

        //Boton para modificar observacion.
        this.btnModificarObs = new Ext.Button({
            id: 'btnModificarObs',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbbtnModificarObs,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar observacion.
        this.btnEliminarObs = new Ext.Button({
            id: 'btnEliminarObs',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbbtnEliminarObs,
            iconCls: 'eliminar',
            hidden: true
        });
        
        this.columnasgpobs = new Ext.grid.ColumnModel([
            {
                header: 'Observación',
                width: 300,
                dataIndex: 'observacion',
                sortable : false
            },
            {
                header: 'Fecha registro',
                width: 100,
                sortable : false,
                dataIndex: 'fregistro'
            }
        ]);
        
        //Listado de observaciones.
        this.gpObservaciones = new Ext.grid.GridPanel({
            id: 'gpObservaciones',
            tbar: [this.btnAdicionarObs, this.btnModificarObs, this.btnEliminarObs],
            title: 'Observaciones',
            region: 'center',
            border: false,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stObservaciones,
            autoScroll: true,
            cm: this.columnasgpobs,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stObservaciones,
                displayInfo: true
            })
        });

        
        this.tabPanel = new Ext.TabPanel({
            region: 'south',
            disabled: true,
            margins: '0 0 0 0',
            height: '100%',
            //height: 300,
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpInspecciones, this.gpObservaciones],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        this.cbTipoInspeccion = new Ext.form.ComboBox({
            store: modelo.stTipoInspeccion,
            fieldLabel: 'Tipo de inspección',
            anchor: '99%',
            height: 100,
            hiddenName: 'idtipoinspeccion',
            displayField: 'denominacion',
            valueField: 'idtipoinspeccion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        this.cbResultInspeccion = new Ext.form.ComboBox({
            store: modelo.stResultadoInspeccion,
            fieldLabel: 'Resultado de inspección',
            anchor: '99%',
            height: 100,
            hiddenName: 'idresultadoinspeccion',
            displayField: 'denominacion',
            valueField: 'idresultadoinspeccion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: false,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        var fecha = new Date();
        this.dfFechaPlanificada = new Ext.form.DateField({
            id: 'dfFechaPlanificada',
            hiddenname: 'fplan',
            fieldLabel: 'Fecha planificada',
            name: 'fplan',
            value: fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            readOnly: false,
            allowBlank: false,
            vtype: 'daterange',
        });

        this.dfFechaInspeccion = new Ext.form.DateField({
            id: 'dfFechaInspeccion',
            fieldLabel: 'Fecha de inspección',
            name: 'finspeccion',
            hiddenname: 'finspeccion',
            anchor: '98%',
            format: 'd/m/Y',
            readOnly: false,
            maxValue: fecha.format('d/m/Y'),
            vtype: 'daterange',
        });

        this.formularioGestionInsp = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbTipoInspeccion]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.dfFechaPlanificada]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.dfFechaInspeccion]
                    }, {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbResultInspeccion]
                    }]
            }]
        });

        this.btnCancelarInsp = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarInsp = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicarInsp = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        //Ventana de gestion.
        this.ventanaGestionInsp = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 300,
            height: 220,
            items: [this.formularioGestionInsp],
            buttons: [
                this.btnCancelarInsp,
                this.btnAplicarInsp,
                this.btnAceptarInsp
            ]
        });

        this.taObs = new Ext.form.TextArea({
            fieldLabel: 'Observaci&oacute;n',
            name: 'observacion',
            anchor: '100%',
            height: 100,
            hiddenname: 'observacion',
            allowBlank: true
        });

        this.formularioGestionObs = new Ext.form.FormPanel({
            frame: true,
            bodyStyle: 'padding: 3px 3px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [this.taObs]
        });

        this.btnCancelarObs = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptarObs = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicarObs = new Ext.Button({
            iconCls: 'aplicar',
            tooltip: idioma.textToolTipAplicar,
            text: idioma.lbtnAplicar
        });

        this.ventanaGestionObs = new Ext.Window({
            layout: 'fit',
            constrain: true,
            title: 'Adicionar observaci&oacute;n',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 350,
            height: 210,
            maximizable: false,
            items: [this.formularioGestionObs],
            buttons: [this.btnCancelarObs, this.btnAplicarObs, this.btnAceptarObs],
            keys: [{
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarObs.disabled) {
                        self.btnCancelarObs.handler();
                    }
                }
            }, {
                key: 13,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAceptarObs.disabled) {
                        self.btnAceptarObs.handler();
                    }
                }
            }, {
                key: 'p',
                ctrl: true,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnAplicarObs.disabled) {
                        self.btnAplicarObs.handler();
                    }
                }
            }]
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
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda],
                    items: [this.gpEquipoRiesgos, this.tabPanel]
                }
            ]
        });

    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestequipoaltoriesgo', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Riesgo.Gestequipoaltoriesgo.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Riesgo.Gestequipoaltoriesgo.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Riesgo.Gestequipoaltoriesgo.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});