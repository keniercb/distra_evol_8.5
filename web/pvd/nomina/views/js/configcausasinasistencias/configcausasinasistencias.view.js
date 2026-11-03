Ext.ns('Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias');

Ext.QuickTips.init();

//Vista del componente Configurar causas de inasitencias
Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias.Vista = {
    /**
     * Inicializar la vista.
     *
     */
    init: function (perfil, idioma, modelo) {
        var self = this;
        //BOTTOMS ****************************************************************************
        //Botones de Add, Mod, Elim, campos
        this.btnAdicionarCampo = new Ext.Button({
            id: 'btnAdicionarCampo',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar campo',
            iconCls: 'adicionar'
        });

        this.btnModificarCampo = new Ext.Button({
            id: 'btnModificarCampo',
            text: "<u>M</u>odificar",
            tooltip: 'Modificar campo',
            iconCls: 'modificar',
            disabled: true
        });

        this.btnEliminarCampo = new Ext.Button({
            id: 'btnEliminarCampo',
            text: 'Eliminar',
            tooltip: 'Eliminar campo',
            iconCls: 'eliminar',
            disabled: true
        });

        //Botones de la ventana de adicionar y modificar los campos.
        this.btnCancelarCampo = new Ext.Button({
            id: 'idbtnCancelarCampo',
            iconCls: 'cancelar',
            text: idioma.btnCancelar,
            tooltip: idioma.textToolTipCancelarAdd
        });

        this.btnAplicarCampo = new Ext.Button({
            id: 'idbtnAplicarCampo',
            iconCls: 'aplicar',
            text: idioma.btnAplicar,
            tooltip: idioma.textToolTipAplicarAdd,
            disabled: true
        });

        this.btnAceptarCampo = new Ext.Button({
            id: 'idbtnAceptarCampo',
            iconCls: 'aceptar',
            text: idioma.btnAceptar,
            tooltip: idioma.textToolTipAceptarAdd,
            disabled: true
        });

        //SELECTIONS MODELS ******************************************************************
        this.smConfigCampos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.smReportes = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.smCausasAusencias = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.smIndicadoresEvaluaciones = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        this.smIndicadoresTalleres = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        //GRIDs ****************************************************************************
        //Grid panel principal de los campos***********************
        this.gpConfigCamposReportes = new Ext.grid.GridPanel({
            id: 'idgpConfigCamposReportes',
            title: 'Listado de campos de reportes',
            region: 'center',
            columns: [this.smConfigCampos,
                {
                    header: 'idvariablesconfreportescertificaciones',
                    hidden: true,
                    dataIndex: 'idvariablesconfreportescertificaciones'
                },
                {
                    header: 'Campos n&oacute;mina',
                    width: 300,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'vartiporeportecertif'
                },
                {
                    header: 'Campos correspondientes',
                    width: 300,
                    sortable: true,
                    align: 'center',
                    dataIndex: 'campo',
                    renderer: denominacionCampos
                },
                {
                    header: 'Horas/d&iacute;as/Mes Inicial',
                    width: 200,
                    sortable: true,
                    dataIndex: 'denomhorasdias',
                    renderer: denominacionHorasDias
                },
                //   {header: 'Tipo de Reporte  ', width: 200, hidden: true, hideable: true, sortable: true, dataIndex: 'tiporeporte'},
                {
                    header: 'Tipo de Reporte  ',
                    width: 200,
                    hidden: true,
                    hideable: true,
                    sortable: true,
                    dataIndex: 'nombretiporeporte'
                },{
                    header: 'tiporeporte',
                    hidden: true,
                    hideable: true,
                    sortable: true,
                    dataIndex: 'tiporeporte'
                },
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            store: modelo.storeConfigCausasInasistencias,
            sm: this.smConfigCampos,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeConfigCausasInasistencias,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        //Grid panel reportes
        this.gpReportes = new Ext.grid.GridPanel({
            id: 'idgpReportes',
            title: 'Listado de campos de reportes de ausencias',
            layout: 'fit',
            region: 'center',
            stripeRows: true,
            columns: [this.smReportes,
                {
                    header: 'idconfreportescertificaciones',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'idconfreportescertificaciones'
                },
                {
                    header: 'idvariablesconfreportescertificaciones',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'idvariablesconfreportescertificaciones'
                },
                {
                    header: 'Tipo de Reporte  ',
                    width: 200,
                    hidden: true,
                    hideable: true,
                    sortable: true,
                    dataIndex: 'tiporeporte'
                },
                {header: 'Denominaci&oacute;n', width: 200, dataIndex: 'variabletiporeporte'}
            ],
            autoScroll: true,
            store: modelo.storeReportes,
            sm: this.smReportes,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeReportes,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        //Grid panel reportes ausencias de asistencia
        this.cbHorasDias = new Ext.form.ComboBox({
            id: 'cbHorasDias',
            //fieldLabel: 'Resultado o destajo',
            tabIndex: 4,
            valueField: 'horasdias',
            displayField: 'denomhorasdias',
            hiddenName: 'horasdias',
            allowBlank: false, mode: 'local',
            store: modelo.storeHorasDias,
            emptyText: 'Seleccione...',
            readOnly: true,
            triggerAction: 'all',
            anchor: '99%',
            width: 500
        });

        this.gpCausasAsistencia = new Ext.grid.EditorGridPanel({
            id: 'idgpCausasAsistencia',
            title: 'Listado de causas de ausencias',
            layout: 'fit',
            region: 'center',
            stripeRows: true,
            columns: [this.smCausasAusencias,
                {header: 'idcausaausencia', hidden: true, hideable: true, dataIndex: 'idcausaausencia'},
                {header: 'Denominaci&oacute;n causa', width: 480, sortable: true, dataIndex: 'denominacion'}
            ],
            autoScroll: true,
            store: modelo.storeCausasAusencias,
            sm: this.smCausasAusencias,
            loadMask: {msg: 'Cargando...'},
            clicksToEdit: 1,
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeCausasAusencias,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            }),
            tbar: [this.cbHorasDias]
        });

        function denominacionPlantilla(val) {
            var arrPlantilla = val.split("-");
            val = arrPlantilla[1];
            return val;
        };

        function denominacionCampos(val) {
            var arrPlantilla = val.split("-!-");
            if (arrPlantilla.length > 1)
                val = arrPlantilla[0] + " <b>(" + arrPlantilla[1] + ")</b>";
            else
                val = val;
            return val;
        };

        function denominacionHorasDias(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('horasdias') == 1) {
                return 'Horas';
            }else if (record.get('horasdias') == 2) {
                return 'D&iacute;as';
            }else if (record.get('horasdias') == 3) {
                return 'Mes Inicial';
            }else if (!record.get('horasdias')) {
                if (record.get('tiporeporte') == 4){
                    return 'Horas';
                }
            }
        }//deresultados

        //Grid panel principal de las evaluaciones*************************
        this.gpIndicadoresEvaluaciones = new Ext.grid.GridPanel({
            id: 'idgpIndicadoresEvaluaciones',
            title: 'Listado de indicadores',
            layout: 'fit',
            region: 'center',
            stripeRows: true,
            columns: [this.smIndicadoresEvaluaciones,
                {header: 'idindicador', hidden: true, hideable: true, sortable: true, dataIndex: 'idindicador'},
                {header: 'idplanilla', hidden: true, hideable: true, sortable: true, dataIndex: 'idplanilla'},
                {
                    header: 'Plantilla',
                    width: 200,
                    hidden: true,
                    hideable: true,
                    sortable: true,
                    dataIndex: 'nombreplantilla',
                    renderer: denominacionPlantilla
                },
                {header: 'Denominaci&oacute;n indicador', width: 480, sortable: true, dataIndex: 'indicador'},
                {header: 'Denominaci&oacute;n padre', width: 480, sortable: true, dataIndex: 'denompadre'}
            ],
            autoScroll: true,
            store: modelo.storeIndicadoresEvaluaciones,
            sm: this.smIndicadoresEvaluaciones,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            loadMask: {msg: 'Cargando...'},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeIndicadoresEvaluaciones,
                displayInfo: true,
                displayMsg: 'Mostrando  {0} - {1} de {2}',
                emptyMsg: "0 Resultado a mostrar"
            })
        });

        //***********************************Grid de Talleres ******************************************
        this.gpIndicadoresTalleres = new Ext.grid.GridPanel({
            id: 'gpIndicadoresTalleres',
            title: 'Listado de indicadores de Talleres',
            layout: 'fit',
            region: 'center',
            stripeRows: true,
            columns: [this.smIndicadoresTalleres,
                {header: 'Denominaci&oacute;n indicador', width: 480, sortable: true, dataIndex: 'denominacion'}
            ],
            autoScroll: true,
            store: modelo.storeIndicadoresTalleres,
            sm: this.smIndicadoresTalleres,
            loadMask: {msg: 'Cargando...'}
        });
        //********************************************************************************************

        //PANELS****************************************************************************
        //Panel del grid de Reportes de Ausencias
        this.panelReportes = new Ext.Panel({
            region: 'west',
            width: '50%',
            //height: '100%',
            split: true,
            layout: 'border',
            items: [this.gpReportes]
        });

        //Panel del grid de Causas de Asistencias
        //Tab panel
        this.tpReportesCertificaciones = new Ext.TabPanel({
            id:'idtpReportesCertificaciones',
            width: 450,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            border: false,
            hideBorders: true,
            frame: true,
            items: [
                {
                    id: 'tabAsistencia',
                    title: 'Asistencia',
                    layout: 'border',
                    region: 'center',
                    items: [this.gpCausasAsistencia]
                },
                {
                    id: 'tabEvaluacion',
                    title: 'Evaluaci&oacute;n',
                    layout: 'border',
                    region: 'center',
                    items: [this.gpIndicadoresEvaluaciones]
                },
                {
                    id: 'tabTalleres',
                    title: 'Talleres',
                    layout: 'border',
                    region: 'center',
                    items: [this.gpIndicadoresTalleres]
                }
            ],
            listeners: {
                tabchange: function () {
                    //this.smCausasAusencias.clearSelections();
                    //this.smIndicadoresEvaluaciones.clearSelections();
                }
            }
        });

        //Panel del grid de Causas Inasistencias
        this.panelConfigCausasInasistencias = new Ext.Panel({
            region: 'center',
            height: '100%',
            width: '100%',
            split: true,
            layout: 'fit',
            items: [this.gpConfigCamposReportes],
            tbar: [this.btnAdicionarCampo, this.btnModificarCampo, this.btnEliminarCampo]
        });

        //WINDOWS **************************************************************************
        //Ventana de adicionar y modificar las campos.
        this.winCausasInasistencias = new Ext.Window({
            id: 'winCausasInasistencias',
            height: 450,
            width: '80%',
            closeAction: 'hide',
            constrain: true,
            closable: true,
            resizable: false,
            layout: 'border',
            items: [this.panelReportes, this.tpReportesCertificaciones],
            buttons: [this.btnCancelarCampo, this.btnAplicarCampo, this.btnAceptarCampo]
        });

        //Ventana Principal
        this.winPrincipal = new Ext.Window({
            modal: true,
            height: 350,
            width: 300,
            closable: false,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.panelConfigCausasInasistencias]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configcausasinasistencias', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias.Controlador.init(idioma, vista, modelo);
});