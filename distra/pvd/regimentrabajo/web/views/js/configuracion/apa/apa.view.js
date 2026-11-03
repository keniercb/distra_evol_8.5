Ext.ns('Pvd.ControlAsistencia.Apa');

Pvd.ControlAsistencia.Apa.Vista = {

    init: function (idioma, modelo) {


        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            tooltip: idioma.lbBtnAdicionarR,
            text: idioma.BtnAdicionar,
            iconCls: 'adicionar',
            //icon: perfil.dirImg + 'adicionar.png'
        });
        this.btnAdicionarP = new Ext.Button({
            id: 'btnAdicionarP',
            tooltip: idioma.lbBtnAdicionar,
            text: idioma.BtnAdicionar,
            iconCls: 'adicionar',
            //icon: perfil.dirImg + 'adicionar.png'
        });
        this.search = new Ext.app.SearchField({
            id: 'search',
            store: modelo.stTregimen,
            emptyText: 'Criterio a buscar...'
        });

        this.searchP = new Ext.app.SearchField({
            id: 'searchP',
            store: modelo.stListadoGrupoDescanso,
            emptyText: 'Criterio a buscar...'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            //icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            tooltip: idioma.lbBtnEliminarR
        });
        this.btnEliminarP = new Ext.Button({
            id: 'btnEliminarP',
            text: idioma.BtnEliminar,
            // icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            disabled: true,
            tooltip: idioma.lbBtnEliminar
        });

        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            // icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            tooltip: idioma.lbBtnModificarR
        });
        this.btnModificarP = new Ext.Button({
            id: 'btnModificarP',
            text: idioma.BtnModificar,
            // icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            disabled: true,
            tooltip: idioma.lbBtnModificar,
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            tooltip: idioma.lbBtnExportar,
            text: idioma.BtnExportar,
            iconCls: 'exportar',
            //icon: perfil.dirImg + 'exportar.png'
        });
        this.btnExportarP = new Ext.Button({
            id: 'btnExportarP',
            tooltip: idioma.lbBtnExportar,
            text: idioma.BtnExportar,
            iconCls: 'exportar',
            //icon: perfil.dirImg + 'exportar.png'
        });

        this.btnAyuda = new Ext.Button({
            tooltip: idioma.lbBtnAyuda,
            text: idioma.BtnAyuda,
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });

        this.btnCancelar = new Ext.Button({
            id: 'idcancelar',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });


        this.btnCancelarGD = new Ext.Button({
            id: 'idcancelarGD',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptarGD = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicarGD = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        this.btnArriba = new Ext.Button({
            id: 'btnArriba',
            tooltip: idioma.ttArriba,
            text: idioma.BtnArriba,
            iconCls: 'arriba',
            //icon: perfil.dirImg + 'adicionar.png'
        });
        this.btnAbajo = new Ext.Button({
            id: 'btnAbajo',
            tooltip: idioma.ttAbajo,
            text: idioma.BtnAbajo,
            iconCls: 'abajo',
            //icon: perfil.dirImg + 'adicionar.png'
        });

        this.combo = new Ext.form.ComboBox({
            store: modelo.stTregimen,
            fieldLabel: idioma.lbColRegimen,
            displayField: 'denominacion',
            blankText: idioma.lbCampoVacio,
            allowBlank: false,
            typeAhead: true,
            mode: 'local',
            anchor: '98%',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            valueField: 'idregimentrabajo',
            name: 'idregimentrabajo',
            hiddenname: 'idregimentrabajo'

        });


        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripcion:</b> {descripcion}</p>'
            )
        });

        this.expanderP = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripcion:</b> {descripcion}</p>'
            )
        });

        this.btnVisualizar = new Ext.Button({
            text: idioma.lbVisualizar,
            tooltip: idioma.ttVisualizar,
            // icon: perfil.dirImg + 'ver.png',
            iconCls: 'ver',
            handler: function () {
                // selwinVisualizar.show();
                // scope.storeEntrenamientos.load();
            },
            disabled: true
        });

        this.smListadoRegimen = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (rowindex, record) {
                    this.btnVisualizar.enable();
                }.createDelegate(this)
            }

        });

        this.cmlistadoregimentrabajo = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            this.expander,
            {header: 'Denominación', width: 235, sortable: true, dataIndex: 'denominacion'},
            {header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
            {header: 'Fecha fin', width: 100, dataIndex: 'fhasta'}
            , this.smListadoRegimen
        ]);


        this.gplistadoreporte = new Ext.grid.GridPanel({
            id: 'listadoPersonasRT',
            //autoHeight : true,
            height: 200,
            cm: this.cmlistadoregimentrabajo,
            // title: idioma.lbListadoReporte,
            plugins: [this.expander],
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, /*this.btnExportar,*/'', '-', this.search, '->', this.btnVisualizar],
            stripeRows: true,
            //margins:'2 2 2 -4',
            autoScroll: true,
            border: true,
            store: modelo.stTregimen,
            sm: this.smListadoRegimen,
            split: true,
            collapsible: true,
            collapsed: false,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stTregimen,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbemptyMsg
            })
        });


        this.smListadoGrupoDescanso = new Ext.grid.CheckboxSelectionModel();

        this.cmlistadoGrupoDescanso = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            this.expanderP,
            {header: 'Denominación', width: 230, sortable: true, dataIndex: 'denominacion'},
            {header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
            {header: 'Fecha fin', width: 100, dataIndex: 'fhasta'},
            {header: 'Orden', hidden: true, sortable: true, dataIndex: 'orden'},
            this.smListadoGrupoDescanso
        ]);

        this.gpListadoGrupoDescanso = new Ext.grid.GridPanel({
            id: 'listadoPersonasGD',
            height: 200,
            //autoHeight : true,
            title: idioma.lbListadoIndicadores,
            cm: this.cmlistadoGrupoDescanso,
            tbar: [this.searchP],
            stripeRows: true,
            plugins: [this.expanderP],
            //margins:'2 2 2 -4',
            autoScroll: true,
            border: true,
            store: modelo.stListadoGrupoDescanso,
            sm: this.smListadoGrupoDescanso,
            loadMask: idioma.lbGridLoadMaskgrupos,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stListadoGrupoDescanso,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbemptyMsg
            })

        });

        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfDenominacion',
            fieldLabel: idioma.lbColDenominacion,
            allowBlank: false,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^\S+([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9 ]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9 ]*)+\S$/,
            regexText: idioma.lbRegexText,
            blankText: idioma.lbCampoVacio,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: '98%',
            listeners: {
                change: function (tf, n, o) {
                    cambio = 1;
                }
            },
            name: 'denominacion',
            hiddenname: 'denominacion',
        });

        this.tfHorastrabajo = new Ext.form.TextField({
            id: 'tfHorastrabajo',
            fieldLabel: idioma.lbColHoras,
            allowBlank: false,
            blankText: idioma.lbCampoVacio,
            enableKeyEvents: true,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maxLength: 2,
            maxLengthText: idioma.lbRegexText,
            width: '98%',
            listeners: {
                change: function (tf, n, o) {
                    cambio = 1;
                }
            },
            name: 'horastrabajo',
            hiddenname: 'horastrabajo',
        });


        var fecha = new Date();

        this.dfIregimen = new Ext.form.DateField({
            id: 'dfFInicio',
            fieldLabel: idioma.lbColDesde,
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            endDateField: 'dfFFin',
            listeners: {
                change: function (tf, n, o) {
                    cambio = 1;
                }
            }
        });

        this.dfFregimen = new Ext.form.DateField({
            id: 'dfFFin',
            fieldLabel: idioma.lbColHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            startDateField: 'dfFInicio',
            listeners: {
                change: function (tf, n, o) {
                    cambio = 1;
                }
            }
        });


        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: idioma.lbColDescripcion,
            name: 'descripcion',
            id: 'tadescripcion',
            anchor: '98%',
            height: 50,
            hiddenname: 'descripcion',
            maxLength: 255,
            //regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9 .,;:()_]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9 .,;:()_]*)+$/,
            //lbRegexText: idioma.lbRegexTextdesc,
            allowBlank: true
        });


        this.tfdenominacionGD = new Ext.form.TextField({
            id: 'tfdenominacionGD',
            fieldLabel: idioma.lbColDenominacion,
            allowBlank: false,
            blankText: idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 3,
            maxLength: 100,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s\/\_\-]+ ?[a-zA-ZáéíóúñüÑ\d\s\/\_\-]*)+$/,
            //regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9]*)+$/,
            regexText: idioma.lbRegexText,
            width: '98%',
            listeners: {
                change: function (tf, n, o) {
                    cambio = 1;
                }
            },
            name: 'denominacion',
            hiddenname: 'denominacion'
        });

        this.dfIregimenGD = new Ext.form.DateField({
            id: 'dfIregimenGD',
            fieldLabel: idioma.lbColDesde,
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            endDateField: 'dfFregimenGD',
            //listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        this.dfFregimenGD = new Ext.form.DateField({
            id: 'dfFregimenGD',
            fieldLabel: idioma.lbColHasta,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            startDateField: 'dfIregimenGD',
            // listeners:{change: function(tf, n,o){cambio = 1;}}
        });


        this.taDescripcionGD = new Ext.form.TextArea({
            fieldLabel: idioma.lbColDescripcion,
            name: 'descripcion',
            id: 'taDescripcionGD',
            anchor: '98%',
            height: 50,
            hiddenname: 'descripcion',
            maxLength: 255,
            //regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9 .,;:()_]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9 .,;:()_]*)+$/,
            //lbRegexText: idioma.lbRegexTextdesc,
            allowBlank: true
        });


        this.pgrupoPersona = new Ext.Panel({
            title: idioma.lbListadoReporte,
            id: 'pgrupoPersona',
            //autoHeigth: true,
            width: '50%',
            layout: 'fit',
            region: 'west',
            collapsible: true,
            split: true,
            //margins: '2 2 2 -4',
            items: [this.gplistadoreporte],
        });

        /*** Filtros del Reporte ***/
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });

        this.tcbEstructura = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            emptyText: 'Seleccione...',
            id: 'tcbEstructura',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 200,
            listeners: {
                'change': function (tf, n, o) {
                    /*this.btnBuscar.enable();
                    this.btnLimpiar.enable();*/
                }
            }
        });

        this.dfIReporte = new Ext.form.DateField({
            id: 'dfIReporte',
            fieldLabel: idioma.lbColDesde,
            name: 'dfIReporte',
            hiddenname: 'dfIReporte',
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            endDateField: 'dfFReporte',
            listeners: {
                'change': function (tf, n, o) {
                    /* this.btnBuscar.enable();
                     this.btnLimpiar.enable();*/
                }
            }
        });

        this.dfFReporte = new Ext.form.DateField({
            id: 'dfFReporte',
            fieldLabel: idioma.lbColHasta,
            name: 'dfFReporte',
            hiddenname: 'dfFReporte',
            anchor: '97%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            startDateField: 'dfIReporte',
            listeners: {
                /*'change': function (tf, n, o) {
                   this.btnBuscar.enable();
                   this.btnLimpiar.enable();
                }*/
            }
        });

        this.btnBuscar = new Ext.Button({
            id: 'idbtnBuscar',
            iconCls: 'buscar',
            text: idioma.lbbtnBuscar,
            tooltip: idioma.lbtnBuscar
        });

        this.btnLimpiar = new Ext.Button({
            id: 'idbtnLimpiar',
            iconCls: 'limpiar',
            text: idioma.lbbtnLimpiar,
            tooltip: idioma.lbtnLimpiar
        });

        this.btnExportarReporte = new Ext.Button({
            id: 'idbtnExportarReporte',
            iconCls: 'exportar',
            text: idioma.lbtnExportar,
            tooltip: idioma.lbbtnExportar
        });

        this.smgpReporte = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (rowindex, record) {
                    // this.btnVisualizar.enable();
                }.createDelegate(this)
            }

        });

        this.cmgpReporte = new Ext.grid.ColumnModel({});

      /*  this.pgtoobal = new Ext.PagingToolbar({
            pageSize: 15,
            store: modelo.stgpReporte,
            displayInfo: true,
            displayMsg: 'Resultados {0} - {1} de {2}',
            emptyMsg: idioma.lbemptyMsg
        });*/


        this.gpReporte = new Ext.grid.GridPanel({
            id: 'gpReporte',
            height: 200,
            cm: this.cmgpReporte,
            tbar: ['Estructura:', this.tcbEstructura, 'Fecha inicio:', this.dfIReporte, 'Fecha fin:', this.dfFReporte, this.btnBuscar, this.btnLimpiar, this.btnExportarReporte],
            autoScroll: true,
            loadMask: true,
            border: true,
            store: modelo.stgpReporte,
            sm: this.smgpReporte,
            split: true,
            //bbar: this.pgtoobal

        });

        this.plistadoPersona = new Ext.Panel({
            id: 'plistadoPersona',
            layout: 'fit',
            region: 'center',
            split: true,
            items: [this.gpReporte],
        });

        this.expanderPI = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripcion:</b> {descripcion}</p>'
            )
        });
        this.smstIndicadores = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

        this.cmstIndicadores = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            this.expanderP,
            {header: 'Denominación', width: 230, sortable: true, dataIndex: 'denominacion'},
            {header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
            {header: 'Fecha fin', width: 100, dataIndex: 'fhasta'},
            this.smListadoGrupoDescanso
        ]);
        this.gpIndicadores = new Ext.grid.GridPanel({
            id: 'gpIndicadores',
            height: 250,
            //autoHeight : true,
            title: idioma.lbListadoIndicadores,
            cm: this.cmstIndicadores,
            tbar: [this.btnAdicionarP, this.btnEliminarP, '->', this.btnArriba, this.btnAbajo],
            stripeRows: true,
            plugins: [this.expanderPI],
            //margins:'2 2 2 -4',
            autoScroll: true,
            border: true,
            store: modelo.stIndicadores,
            sm: this.smstIndicadores,
            loadMask: idioma.lbGridLoadMaskgrupos,
            // bbar: new Ext.PagingToolbar({
            //     pageSize: 15,
            //     store: modelo.stIndicadores,
            //     displayInfo: true,
            //     displayMsg: 'Resultados {0} - {1} de {2}',
            //     emptyMsg: idioma.lbemptyMsg
            // })

        });

        this.expanderPGI = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripcion:</b> {descripcion}</p>'
            )
        });
        this.smstGestIndicadores = new Ext.grid.CheckboxSelectionModel();

        this.cmstGestIndicadores = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            this.expanderP,
            {header: 'idindicador', hidden: true, width: 100, dataIndex: 'idindicador'},
            {header: 'Denominación', width: 230, sortable: true, dataIndex: 'denominacion'},
            {header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
            {
                header: 'F&oacute;rmula', width: 100, dataIndex: 'formula', renderer: function (val, metaData, record) {
                    var val1 = parseInt(val);
                    if (val1 === 1)
                        return "Si";
                    else if (val1 === 0)
                        return "No";

                }.createDelegate()
            },
            this.smListadoGrupoDescanso
        ]);

        this.gpGestIndicadores = new Ext.grid.GridPanel({
            id: 'gpGestIndicadores',
            height: 250,
            //autoHeight : true,
            title: idioma.lbListadoIndicadores,
            cm: this.cmstGestIndicadores,
            stripeRows: true,
            plugins: [this.expanderPGI],
            //margins:'2 2 2 -4',
            autoScroll: true,
            border: true,
            store: modelo.stGestIndicadores,
            sm: this.smstGestIndicadores,
            loadMask: idioma.lbGridLoadMaskgrupos,
            // bbar: new Ext.PagingToolbar({
            //     pageSize: 20,
            //     store: modelo.stGestIndicadores,
            //     displayInfo: true,
            //     displayMsg: 'Resultados {0} - {1} de {2}',
            //     emptyMsg: idioma.lbemptyMsg
            // })
        });

        this.fadicionarRT = new Ext.form.FormPanel({
            frame: true,
            //bodyStyle: 'padding: 7px 7px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.tfdenominacion]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfIregimen]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFregimen]
                        }, {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.taDescripcion]
                        }, {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.gpIndicadores]
                        }
                    ]
                }
            ]
        });

        /* this.taFormula = new Ext.form.TextField({
             id:'taFormula',
             fieldLabel:idioma.lbFormula,
             name: 'formula',
             allowBlank: true,
             //hiddenname:'descripcion',
             anchor: '99%',
             readOnly: true
         });*/

        this.winAdicionarRT = new Ext.Window({
            width: 500,
            height: 600,
            layout: 'fit',
            autoHeight: true,
            closable: true,
            constrain: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.fadicionarRT],
            modal: true,
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar]
        });


        this.expanderReportesVisualizar = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripcion:</b> {descripcion}</p>'
            )
        });
        this.smstIndicadoresReportesVisualizar = new Ext.grid.CheckboxSelectionModel({singleSelect: true});

        this.cmstReportesVisualizar = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            /*  {header:'Indicadores', width: 230,	sortable: true,	dataIndex: 'denominacion'},
            {header: 'UM', width: 100, dataIndex: 'unidadmedida'},
              {header: 'Valor', width: 100, dataIndex: 'idexpresionmatematica'}*/
        ]);

        this.gpReportesVisualizar = new Ext.grid.GridPanel({
            id: 'gpReportesVisualizar',
            height: 250,
            //autoHeight : true,
            title: idioma.lbListadoIndicadores,
            cm: this.cmstReportesVisualizar,
            stripeRows: true,
            plugins: [this.expanderReportesVisualizar],
            //margins:'2 2 2 -4',
            autoScroll: true,
            border: true,
            store: modelo.stIndicadoresReportesVisualizar,
            sm: this.smstIndicadoresReportesVisualizar,
            loadMask: idioma.lbGridLoadMaskgrupos,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stIndicadoresReportesVisualizar,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbemptyMsg
            })

        });

        this.btnCancelarV = new Ext.Button({
            id: 'idcancelarV',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.winVisualizar = new Ext.Window({
            width: 500,
            height: 600,
            layout: 'fit',
            autoHeight: true,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.gpReportesVisualizar],
            modal: true,
            buttons: [this.btnCancelarV]
        });


        this.fadicionarGD = new Ext.form.FormPanel({
            frame: true,
            //bodyStyle: 'padding: 7px 7px 0',
            border: false,
            layout: 'fit',
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [this.gpGestIndicadores]
        });

        this.winAdicionarGD = new Ext.Window({
            width: 550,
            height: 750,
            layout: 'fit',
            autoHeight: true,
            constrain: true,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.fadicionarGD],
            modal: true,
            buttons: [this.btnCancelarGD, this.btnAplicarGD, this.btnAceptarGD]
        });

        this.pGeneral = new Ext.Panel({
            id: 'pGeneral',
            width: '100%',
            layout: 'border',
            tbar: ['->', this.btnAyuda],
            items: [this.pgrupoPersona, this.plistadoPersona]
        });


        new Ext.Viewport({
            layout: 'fit',
            items: this.pGeneral

        });
    }

};
//Inicializando la vista.
UCID.portal.cargarEtiquetas('apa', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.Apa.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.Apa.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.Apa.Controlador.init(idioma, vista, modelo);
});

