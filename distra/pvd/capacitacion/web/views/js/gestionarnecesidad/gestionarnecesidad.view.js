/*
 * Gestionar necesidad.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionarnecesidad
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Capacitacion.Gestionarnecesidad');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.Capacitacion.Gestionarnecesidad.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {
        var self = this;
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            iconCls: 'ayuda',
            tooltip: idioma.textToolTipAyuda,
            text: idioma.BtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            disabled: true,
            id: 'btnAdicionar',
            text: idioma.BtnAdicionar,
            tooltip: idioma.lbBtnAdicionarNDC,
            iconCls: 'adicionar',
            hidden: true
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            disabled: true,
            tooltip: idioma.lbBtnModificarNDC,
            iconCls: 'modificar',
            hidden: true
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            disabled: true,
            tooltip: idioma.lbBtnEliminarNDC,
            iconCls: 'eliminar',
            hidden: true
        });

        //Botón para ver competencias del cargo.
        this.btnVer = new Ext.Button({
            id: 'btnVer',
            text: 'Ver',
            tooltip: 'Ver competencias del cargo <b>(Alt+D)</b>',
            iconCls: 'ver',
            disabled: true
        });

        //Botón mostrar una gráfica resumen.
        this.btnGrafica = new Ext.Button({
            id: 'btnGrafica',
            text: 'G<u>r</u>aficar',
            tooltip: 'Graficar resumen de las necesidades (<b>Alt+R</b>)',
            iconCls: 'graficar',
            hidden: true
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            id: 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar',
            hidden: true,
            iconCls: 'documentos',
            menu: {items: [
                {text: 'Reporte individual de necesidades', iconCls: 'informe', disabled: true, id: 'idrepind', handler: onItemClick},
                {text: 'Reporte colectivo de necesidades', iconCls: 'informe', disabled: false, id: 'idrepcol', handler: onItemClick}
            ]}
        });

        this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
            border: false,
            width: '20%',
            inicial: perfil.idestructuracomun,
            split: true,
            region: 'center'
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

        this.sfBuscar = new Ext.app.SearchField({
            store: modelo.stPersonas,
            pageSize: 15,
            disabled: true,
            toolTipTrigger1: idioma.lbBtnLimpiar,
            toolTipTrigger2: idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.chbMostrarTodas = new Ext.form.Checkbox({
            id: 'chbMostrarTodas',
            boxLabel: 'Mostrar todas las personas',
            hidden: false,
            labelSeparator : '',
            name: 'mostrar',
            anchor: '98%'
        });

        //Listado de personas.
        this.gpPersonas = new Ext.grid.GridPanel({
            title: 'Listado de personas',
            region: 'north',
            height: 350,
            border: false,
            tbar: ['Buscar persona: ', this.sfBuscar,/* '  ', this.chbMostrarTodas,*/ '->', this.btnExportar, this.btnGrafica, this.btnAyuda],
            loadMask: {msg: 'Cargando...'},
            store: modelo.stPersonas,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            autoScroll: true,
            cm: this.columnasgp,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stPersonas,
                displayInfo: true
            })
        });

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        this.columnasgpnec = new Ext.grid.ColumnModel([
            this.expander,
            {
                header: 'Necesidad de capacitaci&oacute;n',
                width: 250,
                dataIndex: 'necesidad',
                sortable : false
            },
            {
                header: 'Fecha de registro',
                width: 100,
                sortable : false,
                dataIndex: 'fregistro'
            },
            {
                header: 'Propuesta de modo de formaci&oacute;n',
                width: 250,
                sortable : false,
                dataIndex: 'modoformacion'
            }
        ]);

        //Listado de necesidades.
        this.gpNecesidades = new Ext.grid.GridPanel({
            id: 'gpNecesidades',
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnVer],
            title: 'Listado de necesidades de capacitaci&oacute;n',
            region: 'center',
            border: false,
            plugins: this.expander,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stNecesidades,
            autoScroll: true,
            cm: this.columnasgpnec,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stNecesidades,
                displayInfo: true
            })
        });

        this.expanderhist = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });
        this.columnasgpnechist = new Ext.grid.ColumnModel([
            this.expanderhist,
            {
                header: 'Necesidad de capacitaci&oacute;n',
                width: 250,
                dataIndex: 'necesidad',
                sortable : false
            },
            {
                header: 'Modo de formaci&oacute;n',
                width: 250,
                sortable : false,
                dataIndex: 'modoformacion'
            },
            {
                header: 'Desde',
                width: 100,
                sortable : false,
                dataIndex: 'fregistro'
            },
            {
                header: 'Hasta',
                width: 100,
                sortable : false,
                dataIndex: 'fhasta'
            }
        ]);

        //Listado de necesidades histórico.
        this.gpNecesidadesHist = new Ext.grid.GridPanel({
            id: 'gpNecesidadesHist',
            title: 'Hist&oacute;rico',
            region: 'center',
            border: false,
            plugins: this.expanderhist,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stNecesidadesHist,
            autoScroll: true,
            cm: this.columnasgpnechist,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stNecesidadesHist,
                displayInfo: true
            })
        });

        // Componentes para adicionar y modificar necesidades de capacitación

        this.cbTipoNec = new Ext.form.ComboBox({
            store: modelo.stTipoNec,
            fieldLabel: 'Necesidad de capacitaci&oacute;n',
            anchor: '99%',
            height: 100,
            id: 'cbTipoNec',
            hiddenName:'idnecesidad',
            displayField: 'necesidad',
            valueField: 'idnecesidad',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{necesidad}</b></br>{descripcion}" class="x-combo-list-item">{necesidad}</div></tpl>'
        });

        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            anchor: '99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        var fecha = new Date();
        this.dfFecha = new Ext.form.DateField({
            fieldLabel: 'Fecha',
            value: fecha.format('d/m/Y'),
            name: 'fecha',
            allowBlank: false,
            hiddenname:'fecha',
            anchor:'99%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.cbModoFormacion = new Ext.form.ComboBox({
            store: modelo.stModoFormacion,
            fieldLabel: 'Propuesta de modo de formaci&oacute;n',
            anchor: '99%',
            height: 100,
            id: 'cbModoFormacion',
            hiddenName:'idmodoformacion',
            displayField: 'modoformacion',
            valueField: 'idmodoformacion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{modoformacion}</b></br>{descripcion}" class="x-combo-list-item">{modoformacion}</div></tpl>'
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbTipoNec]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.taDescripcion]
                    },{
                        columnWidth:0.4,
                        layout: 'form',
                        items: [this.dfFecha]
                    },{
                        columnWidth:0.6,
                        layout: 'form',
                        items: [this.cbModoFormacion]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            //nextTab: 'cbTipoNec',
            iconCls: 'cancelar',
            tooltip: idioma.textToolTipCancelar,
            text: idioma.lbtnCancelar
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'cbTipoNec',
            iconCls: 'aceptar',
            tooltip: idioma.textToolTipAceptar,
            text: idioma.lbtnAceptar
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicariam',
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
                    self.cbTipoNec.focus(true, 500);
                }
            }
        });

        this.tabPanel = new Ext.TabPanel({
            region: 'center',
            disabled: true,
            margins: '0 0 0 0',
            split: true,
            height: 350,
            border: true,
            defaults:{autoScroll:true},
            activeTab: 0,
            items: [this.gpNecesidades, this.gpNecesidadesHist],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

        this.resultado = new Ext.form.Label({
            text: 'No hay resultados que mostrar',
            style: "font-family:arial,serif; font-size:12px; text-align:center; color:#15428B;"
        });

        function comp(val, metaData, record) {
            metaData.attr = 'ext:qtip="El trabajador no posee esta competencia."';
            if(val != null && record.data.idoneo == 2) {
                return '<span style="color:#d11608;"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

        this.columnasgpcom = new Ext.grid.ColumnModel([
            this.expander,
            {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion', sortable : false, renderer: comp},
            {header: 'Nivel requerido', width: 120, sortable : false, dataIndex: 'nivelrequerido', renderer: comp},
            {header: 'Nivel certificado', width: 120, sortable : false, dataIndex: 'nivelcertificado', renderer: comp}
        ]);

        //Listado de competencias.
        this.gpCompetencias = new Ext.grid.GridPanel({
            region: 'south',
            border: false,
            height: 400,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCompetencias,
            autoScroll: true,
            cm: this.columnasgpcom,
            bbar: [this.resultado]
        });

        this.winComp = new Ext.Window({
            title: 'Listado de competencias del cargo',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 650,
            height: 400,
            items: [this.gpCompetencias]
        });

        //Vista general
        new Ext.Viewport({
            layout: 'border',
            items: [
                {
                    region: 'west',
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
                },
                {
                    region: 'center',
                    xtype: 'panel',
                    id: 'center-panel',
                    autoHeight: false,
                    split: true,
                    width: '75%',
                    border: false,
                    layout: 'border',
                    items: [this.gpPersonas, this.tabPanel]
                }
            ]
        });


        function onItemClick(items) {
            var params, idpersona, idestructura, titulo;
            if (items.id == 'idrepind') {
                titulo = 'Reporte individual de necesidades de capacitación';
                idpersona = self.gpPersonas.getSelectionModel().getSelected().data.idpersona;
                params = Ext.urlEncode({
                    idpersona: idpersona,
                    tiporeporte: 1
                });
            } else {
                titulo = 'Reporte colectivo de necesidades de capacitación';
                idestructura = self.tpEstructura.tree.getSelectionModel().getSelectedNode().id;
                params = Ext.urlEncode({
                    idestructura: idestructura,
                    tiporeporte: 2
                });
            }

            var idIframe = Ext.id();
            new Ext.Window({
                title: titulo,
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                listeners: {
                    'beforeshow': function()
                    {
                        if (items.id == 'idrepcol') {
                            self.tabPanel.enable();
                        }
                    },
                    'hide': function()
                    {
                        if (items.id == 'idrepcol') {
                            self.tabPanel.disable();
                        } else {
                            self.tabPanel.enable();
                        }
                    }
                },
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/capacitacion/index.php/gestionarnecesidad/generarPdfReportes?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();

            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            };
        }
    }
}
;

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarnecesidad', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.Capacitacion.Gestionarnecesidad.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.Capacitacion.Gestionarnecesidad.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.Capacitacion.Gestionarnecesidad.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
});