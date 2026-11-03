/*
 * Gestionar procesos de idoneidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Idoneidad
 * @uses Pvd.Idoneidad.Procesoidoneidad
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Idoneidad.Procesoidoneidad');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Idoneidad.Procesoidoneidad.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaPI',
            iconCls: 'ayuda',
            tooltip: 'Mostrar ayuda',
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            disabled: true,
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionar,
            iconCls: 'adicionar',
            //hidden: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificar,
            iconCls: 'modificar',
            //hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminar,
            iconCls: 'eliminar',
            //hidden: true
        });

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stProcesos,
            pageSize: 15,
            //disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            {
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'estructura',
                sortable : false
            },{
                header: 'Denominaci&oacute;n',
                width: 250,
                dataIndex: 'denominacion',
                sortable : false
            },
            {
                header: 'Fecha inicio',
                width: 100,
                sortable : false,
                dataIndex: 'fdesde'
            },
            {
                header: 'Fecha fin',
                width: 100,
                sortable : false,
                dataIndex: 'fhasta'
            },
            {
                header: 'Comisi&oacute;n',
                width: 200,
                sortable : false,
                dataIndex: 'comision'
            }
        ]);

        //Listado de procesos.
        this.gpProcesos = new Ext.grid.GridPanel({
            region: 'center',
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Procesos" : "Proceso"]})'
            }),
            height: 400,
            plugins: this.expanderAcc,
            border: false,
            tbar: ['Buscar proceso: ', this.sfBuscar
            ],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stProcesos,
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stProcesos,
                displayInfo: true
            })
        });

        this.columnasgp = new Ext.grid.ColumnModel([
            {
                header: '',
                width: 100,
                hidden: true,
                dataIndex: 'entidad_area',
                sortable : false
            },
            {
                header: 'No. de identidad',
                width: 150,
                dataIndex: 'numid',
                sortable : false
            },
            {
                header: 'Apellidos y nombres',
                width: 350,
                sortable : false,
                dataIndex: 'nombreyapellidos'
            },
            {
                header: 'Cargo',
                width: 300,
                sortable : false,
                dataIndex: 'cargo'
            }
        ]);

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            cargos: false,
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank : false,
            minLength: 3,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial (espacio).',
            anchor:	'99%',
            name : 'denominacion'
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicioo',
            fieldLabel: 'Fecha inicio',
            allowBlank : false,
            name: 'fdesde',
            hiddenname:'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.dfFFin = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            allowBlank: true,
            readOnly: true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicioo',
            vtype:'daterange'
        });

        this.cbComisiones = new Ext.form.ComboBox({
            store: modelo.stComisiones,
            fieldLabel: 'Comisi&oacute;n',
            anchor: '99%',
            height: 100,
            hiddenName:'idcomision',
            displayField: 'denominacion',
            valueField: 'idcomision',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.cbComisiones]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFFin]
                    }]
            }]
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptar
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.btnAplicar,
            tooltip: idioma.textToolTipAplicar
        });

        this.btnCancelar= new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.textbtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            handler: function() {
                self.winAdd.hide();
            }
        });

        this.winAdd = new Ext.Window({
            title: 'Adicionar proceso',
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            width: 400,
            height: 250,
            layout: 'fit',
            modal: true,
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            items: [this.formularioGestion],
            keys: [
                {
                    key: 'x',
                    alt: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnCancelar.disabled) {
                            self.btnCancelar.handler();
                        }

                    }
                }
            ]
        });

        this.pMiembros = new Pvd.Idoneidad.Procesoidoneidad.PanelMiembros({idioma:idioma});

        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [
                {region: 'west',
                    xtype: 'panel',
                    id: 'east-panel',
                    autoHeight: false,
                    split: true,
                    width: '25%',
                    border: false,
                    collapsible: true,
                    title: 'Estructura organizativa',
                    layout: 'fit',
                    items: [this.tpEstructura]
                },{region: 'center',
                    xtype: 'panel',
                    title: 'Listado de procesos de idoneidad',
                    autoHeight: false,
                    width: '75%',
                    tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda],
                    border: false,
                    layout: 'border',
                    items: [this.gpProcesos, this.pMiembros]
                }
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('procesoidoneidad', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Idoneidad.Procesoidoneidad.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Idoneidad.Procesoidoneidad.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Idoneidad.Procesoidoneidad.Controlador.init(idioma, vista, modelo);
});