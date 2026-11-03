Ext.ns('Pvd.ControlAsistencia.PromedioTrabajadores');
//Vista del componente.
Pvd.ControlAsistencia.PromedioTrabajadores.Vista = {

    init: function (idioma, modelo) {

        var fech = document.getElementById('fecha').getAttributeNode('value').value;
        var fechfinmes = document.getElementById('fecha').getAttributeNode('value').value;
        this.fecha = new Date(fech.split('/')[2], fech.split('/')[1] - 1, fech.split('/')[0])
        var scope = this;
        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando datos..."});
        this.idestructura = perfil.idestructuracomun;
        this.denomestructura = '';

        var f = this.fecha.format('d/m/Y');
        var explodeDate = f.split('/');
        this.fech = '01/' + explodeDate[1] + '/' + explodeDate[2];

        function diasEnUnMes(mes, año) {
            return new Date(año, mes, 0).getDate();
        }

        this.fechfinmes = diasEnUnMes(explodeDate[1], explodeDate[2]) + '/' + explodeDate[1] + '/' + explodeDate[2];

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            width: 100,
            allowBlank: true,
            value: this.fech,
            invalidText: idioma.invalidTextFecha,
            maxValue: this.fecha.format('d/m/Y'),
            allowBlank: false,
            blankText: idioma.lbCampoVacio,
            vtype: 'daterange',
            endDateField: 'hasta'
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            width: 100,
            allowBlank: true,
            invalidText: idioma.invalidTextFecha,
            value: this.fechfinmes,
            //maxValue: this.fechfinmes,
            allowBlank: false,
            blankText: idioma.lbCampoVacio,
            vtype: 'daterange',
            startDateField: 'desde'
        });

        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscarEst,
            iconCls: 'buscar'
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaPartFecha',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        //panel de estructura
        this.EstructuraTree = new Ext.estructura.panel.PanelEstructura({
            id: 'EstructuraTree',
            region: 'center',
            split: true,
            margins: '0 0 0 0',
            border: false,
            inicial: perfil.idestructuracomun,
        });

        scope.EstructuraTree.on('dameseleccion', function (obj, data) {
            if (data == false)
                this.idestructura = scope.EstructuraTree.inicial;
            else {
                this.idestructura = data.id;
                this.denomestructura = data.attributes.denominacion;
            }
        }, this);

        this.btnConfiguracion = new Ext.Button({
            id: 'btnConfiguracion',
            text: 'Configuración',
            iconCls: 'configuracion',
            disabled: false,
            tooltip: 'Configurar el reporte'
        });

        this.smgridConceptos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.listadoConceptos = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeConceptos,
            border: false,
            sm: this.smgridConceptos,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridConceptos,
                {
                    header: 'idconcepto',
                    width: 100,
                    dataIndex: 'idconcepto',
                    hidden: true
                }, {
                    header: 'Conceptos',
                    width: 250,
                    dataIndex: 'concepto'
                }
            ]
        });

        this.pConceptos = new Ext.Panel({
            id: 'pConceptos',
            width: '50%',
            layout: 'fit',
            region: 'west',
            collapsible: true,
            split: true,
            items: [this.listadoConceptos],
        });

        this.smgridCausas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.listadoCausas = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeCausas,
            border: false,
            region: 'center',
            sm: this.smgridCausas,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridCausas,
                {
                    header: 'idcausa',
                    width: 100,
                    dataIndex: 'idcausa',
                    hidden: true
                }, {
                    header: 'Causas',
                    width: 300,
                    dataIndex: 'denominacion'
                }, {
                    header: 'idconcepto',
                    width: 100,
                    dataIndex: 'idconcepto',
                    hidden: true
                }, {
                    header: 'check',
                    width: 100,
                    dataIndex: 'check',
                    hidden: true
                }
            ]
        });

        this.pCausas = new Ext.Panel({
            id: 'pCausas',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items: [this.listadoCausas],
        });

        this.smgridConcept = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {}
        });

        this.listadoConcept = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeConcept,
            border: false,
            region: 'east',
            layout: 'fit',
            sm: this.smgridConcept,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridConcept,
                {
                    header: 'idconcepto',
                    width: 100,
                    dataIndex: 'idconcepto',
                    hidden: true
                }, {
                    header: 'Concepto',
                    width: 150,
                    dataIndex: 'denominacion'
                }, {
                    header: 'check',
                    width: 100,
                    dataIndex: 'check',
                    hidden: true
                }
            ]
        });

        this.plistadoConcept = new Ext.Panel({
            id: 'plistadoConcept',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items: [this.listadoConcept],
        });

        this.smgridTipocontrato = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        this.listadoTipocontrato = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeTipocontrato,
            border: false,
            region: 'west',
            layout: 'fit',
            sm: this.smgridTipocontrato,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridTipocontrato,
                {
                    header: 'idtipocontrato',
                    width: 100,
                    dataIndex: 'idtipocontrato',
                    hidden: true
                }, {
                    header: 'Tipo de contrato',
                    width: 200,
                    dataIndex: 'denominacion'
                }, {
                    header: 'check',
                    width: 100,
                    dataIndex: 'check',
                    hidden: true
                }
            ]
        });

        this.plistadoTipocontrato = new Ext.Panel({
            id: 'plistadoTipocontrato',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items: [this.listadoTipocontrato],
        });

        this.smgridSituacion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        this.listadoSituacion = new Ext.grid.GridPanel({
            height: 170,
            store: modelo.storeSituacion,
            border: false,
            region: 'center',
            layout: 'fit',
            sm: this.smgridSituacion,
            loadMask: {msg: 'Cargando...'},
            columns: [this.smgridSituacion,
                {
                    header: 'idsituacion',
                    width: 100,
                    dataIndex: 'idsituacion',
                    hidden: true
                }, {
                    header: 'Situación Laboral',
                    width: 200,
                    dataIndex: 'denominacion'
                }, {
                    header: 'idtipocontrato',
                    width: 100,
                    dataIndex: 'idtipocontrato',
                    hidden: true
                }, {
                    header: 'check',
                    width: 100,
                    dataIndex: 'check',
                    hidden: true
                }
            ]
        });

        this.plistadoSituacion = new Ext.Panel({
            id: 'plistadoSituacion',
            layout: 'fit',
            region: 'center',
            collapsible: true,
            split: true,
            items: [this.listadoSituacion],
        });

        this.ptipocontratoSituacion = new Ext.Panel({
            id: 'ptipocontratoSituacion',
            layout: 'border',
            region: 'center',
            items: [{
                region: 'west',
                width: '30%',
                margins: '0 0 0 0',
                split: true,
                border: false,
                layout: 'border',
                items: this.plistadoConcept
            }, {
                region: 'center',
                width: '35%',
                margins: '0 0 0 0',
                split: true,
                border: false,
                layout: 'border',
                items: this.plistadoTipocontrato
            }, {
                region: 'east',
                width: '35%',
                margins: '0 0 0 0',
                split: true,
                border: false,
                layout: 'border',
                items: this.plistadoSituacion
            }
            ]
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            //disabled: true,
            iconCls: 'aceptar'
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl + Alt + P</b>)',
            //disabled: true,
            iconCls: 'aplicar'
        });

        this.btnCancelar = new Ext.Button({
            id: 'idbtnCancelar',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)'
        });

        this.tabs = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            border: false,
            defaults: {
                xtype: 'panel',
                layout: 'border'
            },
            items: [
                {
                    title: 'Causas',
                    id: 'tipocontrato',
                    items: [this.pCausas]
                },
                {
                    title: 'Tipo de contrato/Situación',
                    id: 'tipocontratoSituacion',
                    items: [this.ptipocontratoSituacion]
                }
            ]
        });

        this.winConfiguracion = new Ext.Window({
            title: 'Configuración',
            modal: true,
            height: 500,
            width: 650,
            closable: false,
            constrain: true,
            autoValidate: false,
            resizable: true,
            layout: 'border',
            items: [/*this.pCausas,*/this.tabs],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar]
        });

        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Reporte promedio de trabajadores <span style="color:#d1200a;">' + '(*.pdf)',
                        iconCls: 'informe',
                        icon: '',
                        id: 'exportarpdf',
                        handler: onItemClick
                    },
                    {
                        text: 'Reporte promedio de trabajadores <span style="color:#2b9c26;">' + '(*.xls)',
                        iconCls: 'informe',
                        icon: '',
                        id: 'exportarexcel',
                        handler: onItemClick
                    }
                ]
            }
        });

        function onItemClick(items) {
            if (items.id == 'exportarpdf') {
                var params = Ext.urlEncode({
                    idestructura: scope.idestructura,
                    fdesde: scope.desde.getRawValue(),
                    fhasta: scope.hasta.getRawValue()
                });
                var idIframe = Ext.id();
                new Ext.Window({
                    title: 'Promedio de trabajadores',
                    width: 800,
                    height: 500,
                    id: 'winregistro',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrainHeader: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                                '/pvd/regimentrabajo/index.php/promediotrabajadores/exportarPdf?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winregistro').maximize();
                PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
                document.getElementById(idIframe).onload = function () {
                    PVD.ocultarMascara('rep01');
                }
            } else if (items.id == 'exportarexcel') {
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Generando reporte'
                });
                var params = Ext.urlEncode({});
                winload.showMask();
                var iframe = document.createElement("iframe");
                iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/promediotrabajadores/exportarExcel?' + params;
                iframe.style.display = 'none';
                iframe.onload = function () {
                    winload.hideMask();
                }
                document.body.appendChild(iframe);
            }
        }

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.Listado = new Ext.grid.GridPanel({
            id: 'listado',
            store: modelo.store,
            region: 'center',
            autoScroll: true,
            split: true,
            sm: this.sm,
            stripeRows: true,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'Concepto/Días', width: 300, dataIndex: 'concepto'}
            ],
            tbar: ['Fecha inicio:', this.desde, '-', 'Fecha fin:', this.hasta, '-', this.btnBuscar, '-', this.btnConfiguracion, '-', this.btnExportar, '-', '->', this.btnAyuda],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.store,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: idioma.lbMsgemptyMsg
            })
        });

        this.plantillapromedio = new Ext.XTemplate(
            '<table style="border-collapse: collapse; background-color: #dfe8f6;">',
            '<tr>',
            '<td width="10px" />',
            '<td colspan=2><div class="text"><b>Promedio de trabajadores: </b> </div></td>',
            '<td colspan=2 align="right"><div class="text"><b> {promediotrabajadores} </b></div></td>',
            '<td width="10px" />',
            '</tr>',
            '</table>',
            '<br/>'
        );

        this.pPromediotrabajadores = new Ext.Panel({
            title: '',
            layout: 'fit',
            region: 'south',
            height: 60,
            frame: true,
            items: [this.plantillapromedio]
        });

        this.plistado = new Ext.Panel({
            id: 'listadovp',
            items: [this.Listado],
            region: 'center',
            layout: 'fit'
        });

        this.vp = new Ext.Viewport({
            layout: 'border',
            items: [
                {
                    region: 'west',
                    xtype: 'panel',
                    id: 'east-panel',
                    autoHeight: false,
                    width: '25%',
                    border: false,
                    split: true,
                    collapsible: true,
                    title: 'Estructura',
                    layout: 'border',
                    items: [this.EstructuraTree, this.pPromediotrabajadores]
                }, this.plistado]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('promediotrabajadores', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.PromedioTrabajadores.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.PromedioTrabajadores.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.PromedioTrabajadores.Controlador.init(idioma, vista, modelo);

    UCID.portal.cargarAcciones(window.frameElement.id);

});