Ext.ns('Gestionar.gestdesagregctrlinversion');
Ext.QuickTips.init();

////var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;

Gestionar.gestdesagregctrlinversion.Vista = {
    init: function (idioma, modelo) {
        _this = this;
        scope = this;

        _this.cmEquipoEditable = new Array();
        _this.datIndEquipoEditable = new Array();

        _this.btnAyudaDesCtrlInversion = new Ext.Button({
            text: idioma.btnAyuda,
            tooltip: 'idioma.btnAyudatoll',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            id: 'idbtnAyudaDesCtrlInversion'
        });

        _this.btnDesagregacion = new Ext.Button({
            text: 'Desagregaci\xF3n',
            tooltip: 'Desagregar inversi\xF3n',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            disabled: true,
            id: 'idbtnDesagregacion'
        });

        _this.btnControl = new Ext.Button({
            text: 'Control',
            tooltip: 'Desagregar inversi\xF3n',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            disabled: true,
            id: 'idbtnControl'
        });

        _this.btnGuardarDesagInver = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar desagregaci\xF3n',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            id: 'idbtnGuardarDesagInver'
        });

        _this.btnGuardarDesagEquipo = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar desagregaci\xF3n',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            id: 'idbtnGuardarDesagEquipo'
        });

        _this.btnGuardarDesagMA = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar desagregaci\xF3n',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            id: 'idbtnGuardarDesagMA'
        });

        _this.btnGuardarCtrlInver = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar desagregaci\xF3n',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            id: 'idbtnGuardarCtrlInver'
        });

        _this.btnGuardarCtrlEquipos = new Ext.Button({
            text: 'Guardar',
            tooltip: 'Guardar control equipos automotores',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            id: 'idbtnGuardarCtrlEquipo'
        });

        _this.ChConsolidarDC = new Ext.form.Checkbox({
            id: 'idconsolidarVC',
            xtype: 'checkbox',
            disabled: true,
            boxLabel: 'General'/*,
             listeners: {
             check: function(ch, chequeado) {
             if (chequeado == true) {
             _this.btnAdicionarinversion.disable();
             _this.btnModificarinversion.disable();
             _this.btnEliminarinversion.disable();
             _this.cmp_CambioEstado.disable();
             } else {
             _this.btnAdicionarinversion.enable();
             _this.btnModificarinversion.enable();
             _this.btnEliminarinversion.enable();
             }
             _this.grid_gestionar_inversiones.getStore().reload({
             params: {
             start: 0,
             limit: 20,
             identidad: _this.identidadselected,
             idejercicio: _this.cmbEjercicio.getValue()
             }
             });
             }
             }*/

        });

        _this.ChVigenteDC = new Ext.form.Checkbox({
            id: 'idvigenteDC',
            xtype: 'checkbox',
            disabled: true,
            boxLabel: 'Vigentes',
            checked: true/*,
             listeners: {
             check: function(ch, chequeado) {
             _this.grid_gestionar_inversiones.getStore().reload({
             params: {
             start: 0,
             limit: 20,
             identidad: _this.identidadselected,
             idejercicio: _this.cmbEjercicio.getValue()
             }
             });
             }
             }*/

        });

        _this.btnMenuAprobacion_desagregacion = new Ext.Toolbar.MenuButton({
            text: 'Aprobaci\xF3n Desagregaci\xF3n', //idioma.btnAprobacioninversion,
            disabled: true,
            icon: perfil.dirImg + 'area.png',
            iconCls: 'btn',
            menu: {
                items: [{
                    text: 'Aprobar', //idioma.btnAprobarinversion,
                    iconCls: 'aprobar',
                    id: 'idaprobacionDesag'
                }, {
                    text: 'Desaprobar', //idioma.btnDesaprobarinversion,
                    icon: perfil.dirImg + 'desaprobar.png',
                    id: 'iddesaprobarDesag'
                }

                ]
            }
        });

        _this.btnMenuActivacion_desagregacion = new Ext.Toolbar.MenuButton({
            text: 'Activaci\xF3n Desagregaci\xF3n',
            disabled: true,
            icon: perfil.dirImg + 'area.png',
            iconCls: 'btn',
            menu: {
                items: [
                    {
                        id: 'idActInversionDesag',
                        text: 'Desactivar Desagregaci\xF3n', //idioma.btnActivarinversion,
                        tooltip: idioma.toolTipActivarInversion,
                        icon: perfil.dirImg + 'habilitar.png',
                        iconCls: 'btn',
                        disabled: true

                    }, {
                        id: 'btn_desag',
                        text: 'Desactivar Desagregaci\xF3n', //idioma.btnDesactivarinversion,
                        tooltip: idioma.toolTipDesactivarInversion,
                        iconCls: 'deshabilitar',
                        disabled: true
                    }
                ]
            }
        });

        _this.btnLimpiarDesag = new Ext.Button({
            text: 'Limpiar Desagregaci\xF3n',
            tooltip: 'Limpia la desagregaci\xF3n de la inversi\F3n.',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'limpiar',
            id: 'idbtlimpiarDesag',
            disabled: true
        });

        _this.btnLimpiarCtrl = new Ext.Button({
            text: 'Limpiar Control',
            tooltip: 'Limpia el control de la inversi\F3n.',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'limpiar',
            id: 'idbtlimpiarCtrl',
            disabled: true
        });

        _this.cmbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 90,
            id: 'idejercicio',
            store: modelo.stCbejercicio,
            displayField: 'ejercicio',
            valueField: 'idejercicio',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false
        });
        //----------------------Tree Panel Organismos----------------------------------------
        _this.treePanelinversion = new Ext.tree.TreePanel({
            title: idioma.tlOrganismos,
            border: true,
            region: 'west',
            split: true,
            width: 210,
            height: 300,
            collapsible: true,
            rootVisible: false,
            autoScroll: true,
            loader: modelo.loaderTreeinversiones,
            tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: idioma.tlExpandir,
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function () {
                    Gestionar.inversiones.Vista.treePanelinversion.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: idioma.tlColapsar,
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function () {
                    Gestionar.inversiones.Vista.treePanelinversion.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: idioma.tlRefrescar,
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function () {
                    Gestionar.inversiones.Vista.treePanelinversion.root.reload();
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 90,
                id: 'idfiltroent'
            }
            ],
            root: {
                text: 'Estructuras',
                expanded: true,
                id: '0'
            }
        });

        this.gridDataInver = new Utilidades.Cmp.GridInversiones({
            id: '1',
            region: 'center',
            paginado: true
        });


        _this.grid = new Utilidades.Cmp.controllerGridInversiones({
            idOrganismo: null,
            cmbEjercicio: _this.cmbEjercicio,
            vigente: null,
            general: null
        });
        _this.gridInversion = _this.grid.getGridInversiones();


        this.gridInverDesgInver = new Utilidades.Cmp.GridInversiones({
            id: 'Desag',
            region: 'north'
        });
        _this.gridInversionDesag = _this.gridInverDesgInver.gridDataGralInversion();

        this.gridplanAprDesagregacion = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '1',
            region: 'center',
            title: 'Plan aprobado',
            cm: _this.gridInverDesgInver.getCm(),
            jr: _this.gridInverDesgInver.getJr()
        });
        _this.gpPlanAprobado = _this.gridplanAprDesagregacion.gridDesagregacionInversion();

        this.gpDesgInverPrimer = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '2',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridDesagInversionPrimer = _this.gpDesgInverPrimer.gridDesagregacionInversion();

        this.gpDesgInverResto = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '3',
            region: 'center',
            title: 'Comprobaci\xF3n total',
            //paginado: false,
            cm: _this.gridInverDesgInver.getCm(),
            jr: _this.gridInverDesgInver.getJr()
        });
        _this.gridDesagInversionResto = _this.gpDesgInverResto.gridDesagregacionInversion();

        this.gpDesgInverSegundo = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '04',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridDesagInversionSegundo = this.gpDesgInverSegundo.gridDesagregacionInversion();

        this.gpDesgInverTercero = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '05',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridDesagInversionTercero = this.gpDesgInverTercero.gridDesagregacionInversion();

        this.gpDesgInverCuarto = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '06',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridDesagInversionCuarto = this.gpDesgInverCuarto.gridDesagregacionInversion();

        _this.tpDesgloseInversiones = new Ext.TabPanel({
            // activeTab: 0,
            id: 'idtpdesaginvers',
            region: 'south',
            height: 150,
            disabled: true,
            tbar: ['->', _this.btnGuardarDesagInver],
            items: [{
                title: 'I trimestre',
                id: 'idgriddesagPrimer',
                activeTab: 0,
                items: _this.gridDesagInversionPrimer,
                layout: 'fit'
            }, {
                title: 'II trimestre',
                id: 'idgriddesagSegundo',
                activeTab: 1,
                items: _this.gridDesagInversionSegundo,
                layout: 'fit'
            }, {
                title: 'III trimestre',
                id: 'idgriddesagTercero',
                activeTab: 2,
                items: _this.gridDesagInversionTercero,
                layout: 'fit'
            }, {
                title: 'IV trimestre',
                id: 'idgriddesagCuarto',
                activeTab: 3,
                items: _this.gridDesagInversionCuarto,
                layout: 'fit'
            }],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                },
                tabchange: function (p) {
                    p.doLayout();
                }
            }
        });

        _this.pInverDesag = new Ext.Panel({
            id: 'idPanelContendor',
            title: 'Datos de la inversi\xF3n',
            height: 500,
            region: 'north',
            border: false,
            frame: true,
            items: [_this.gridInversionDesag, _this.gpPlanAprobado, _this.tpDesgloseInversiones]
        });

        this.gridEquipoDesg = new Utilidades.Cmp.GridInversiones({
            id: 'Equipos',
            region: 'north'
        });
        _this.gridEquiposDesag = _this.gridEquipoDesg.gridDataGralInversion();

        this.gpPlanEquipoPrimer = new Utilidades.Cmp.GridPlanEquipos({
            id: 'Plan',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridPlanEquipoPrimer = _this.gpPlanEquipoPrimer.gridPlanEquipo();

        this.gpEquipoPrimer = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '01',
            region: 'center',
            paginado: false
        });
        _this.gpEquipoDesglosePrimer = _this.gpEquipoPrimer.gridDesgloseEquipo();

        this.gpDesgEquipoSegundo = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '02',
            region: 'center'
        });
        _this.gpEquipoDesgloseSegundo = this.gpDesgEquipoSegundo.gridDesgloseEquipo();

        this.gpDesgEquipoTercero = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '03',
            region: 'center'
        });
        _this.gpEquipoDesgloseTercero = this.gpDesgEquipoTercero.gridDesgloseEquipo();

        this.gpDesgEquipoCuarto = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '04',
            region: 'center'
        });
        _this.gpEquipoDesgloseCuarto = this.gpDesgEquipoCuarto.gridDesgloseEquipo();

        _this.tpDesgloseEquipos = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpdesagequipos',
            region: 'south',
            height: 150,
            disabled: true,
            tbar: ['->', _this.btnGuardarDesagEquipo],
            items: [{
                title: 'I trimestre',
                id: 'idgriddesagEquipoPrimer',
                activeTab: 0,
                items: _this.gpEquipoDesglosePrimer,
                layout: 'fit'
            }, {
                title: 'II trimestre',
                id: 'idgriddesagEquipoSegundo',
                activeTab: 1,
                items: _this.gpEquipoDesgloseSegundo,
                layout: 'fit'
            }, {
                title: 'III trimestre',
                id: 'idgriddesagEquipoTercero',
                activeTab: 2,
                items: _this.gpEquipoDesgloseTercero,
                layout: 'fit'
            }, {
                title: 'IV trimestre',
                id: 'idgriddesagEquipoCuarto',
                activeTab: 3,
                items: _this.gpEquipoDesgloseCuarto,
                layout: 'fit'
            }]
        });

        this.gpComprobacionEquipo = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '1',
            region: 'center',
            title: 'Comprobaci\xF3n total'
        });
        _this.gpComprobEquipo = _this.gpComprobacionEquipo.gridDesgloseEquipo();

        _this.pEquipoDesag = new Ext.Panel({
            id: 'idpEquipoDesag',
            title: 'Datos de la inversi\xF3n',
            height: 600,
            region: 'north',
            border: false,
            frame: true,
            items: [_this.gridEquiposDesag, _this.gridPlanEquipoPrimer, _this.tpDesgloseEquipos]
        });

        this.gridMADesg = new Utilidades.Cmp.GridInversiones({
            id: 'MA',
            region: 'north'
        });
        _this.gridMADesag = _this.gridMADesg.gridDataGralInversion();

        this.gpPlanMA = new Utilidades.Cmp.GridMedioAmbiente({
            id: 'planaprobado',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridPlanMA = _this.gpPlanMA.gridMedioAmbiente();


        this.gpMAPrimer = new Utilidades.Cmp.GridMedioAmbiente({
            id: 'primertrimestre',
            region: 'center',
            paginado: false
        });
        _this.gpMADesglosePrimer = this.gpMAPrimer.gridMedioAmbiente();

        this.gpMASegundo = new Utilidades.Cmp.GridMedioAmbiente({
            id: 'segundotrimestre',
            region: 'center',
            paginado: false
        });
        _this.gpMADesgloseSegundo = this.gpMASegundo.gridMedioAmbiente();

        this.gpMATercero = new Utilidades.Cmp.GridMedioAmbiente({
            id: 'tercerotrimestre',
            region: 'center'
        });
        _this.gpMADesgloseTercero = this.gpMATercero.gridMedioAmbiente();

        this.gpMACuarto = new Utilidades.Cmp.GridMedioAmbiente({
            id: 'cuartotrimestre',
            region: 'center'
        });
        _this.gpMADesgloseCuarto = this.gpMACuarto.gridMedioAmbiente();

        _this.tpDesgloseMA = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpdesagmedioambiente',
            region: 'south',
            height: 150,
            tbar: ['->', _this.btnGuardarDesagMA],
            items: [{
                title: 'I trimestre',
                id: 'idgriddesagMAPrimer',
                activeTab: 0,
                items: _this.gpMADesglosePrimer,
                layout: 'fit'
            }, {
                title: 'II trimestre',
                id: 'idgriddesagMASegundo',
                activeTab: 1,
                items: _this.gpMADesgloseSegundo,
                layout: 'fit'
            }, {
                title: 'III trimestre',
                id: 'idgriddesagMATercero',
                activeTab: 2,
                items: _this.gpMADesgloseTercero,
                layout: 'fit'
            }, {
                title: 'IV trimestre',
                id: 'idgriddesagMACuarto',
                activeTab: 3,
                items: _this.gpMADesgloseCuarto,
                layout: 'fit'
            }]
        });

        _this.pMADesag = new Ext.Panel({
            id: 'idPanelContendorMA',
            title: 'Datos de la inversi\xF3n',
            height: 500,
            region: 'north',
            border: false,
            frame: true,
            items: [_this.gridMADesag, _this.gridPlanMA, _this.tpDesgloseMA]
        });

        this.gpComprobanteMA = new Utilidades.Cmp.GridMedioAmbiente({
            id: 'planaprobado',
            region: 'center',
            paginado: false,
            title: 'Comprobaci\xF3n total'
        });
        _this.gpComprobMA = _this.gpComprobanteMA.gridMedioAmbiente();

//tab del desglose (inversion, equipo y MA)
        _this.tpDesglose = new Ext.TabPanel({
            layaut: 'border',
            activeTab: 0,
            id: 'tpdesagma',
            items: [{
                title: 'Inversi\xF3n',
                id: 'idgridInverdesag',
                activeTab: 0,
                layout: 'border',
                items: [_this.pInverDesag, _this.gridDesagInversionResto]
            }, {
                title: 'Equipos automotores',
                id: 'idequiposautomotores',
                activeTab: 1,
                layout: 'border',
                items: [_this.pEquipoDesag, _this.gpComprobEquipo]
            }/*, {
             title: 'Medio ambiente',
             id: 'idtabmedioambiente',
             activeTab: 2,
             layout: 'border',
             items: [_this.pMADesag, _this.gpComprobMA]
             }*/]
        });

        _this.wDesagregacion = new Ext.Window({
            id: 'idwDesagregacion',
            title: 'Desagregaci\xF3n del plan',
            layout: 'fit',
            closeAction: 'hide',
            resizable: true,
            modal: true,
            maximized: true,
            items: [_this.tpDesglose],
            buttons: [{
                id: 'btnCerrarDesagregacion',
                icon: perfil.dirImg + 'cerrar.png',
                iconCls: 'btn',
                tooltip: 'Cerrar ventana',
                text: 'Cerrar'
            }]
        });

        this.gridInverCtrlInver = new Utilidades.Cmp.GridInversiones({
            id: 'ctrl',
            region: 'north'
        });
        _this.gridInversionCtrl = _this.gridInverCtrlInver.gridDataGralInversion();

        this.gridplanAprCtrl = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '4',
            region: 'center',
            title: 'Plan aprobado',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gpPlanAprobadoInverCtrl = _this.gridplanAprCtrl.gridDesagregacionInversion();

        this.gpCtrlInverPrimer = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '5',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlPlanDesagregado = _this.gpCtrlInverPrimer.gridDesagregacionInversion();

        this.gpCtrlRealEjecutado = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '6',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlRealEjecutado = _this.gpCtrlRealEjecutado.gridDesagregacionInversion();

        this.gpCtrlDesagregadoPrimerSemestre = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '7',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlDesagPrimerSemestre = _this.gpCtrlDesagregadoPrimerSemestre.gridDesagregacionInversion();

        this.gpCtrlEstimadoEjecucionPrimerSemestre = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '8',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlEstEjecPrimerSemestre = _this.gpCtrlEstimadoEjecucionPrimerSemestre.gridDesagregacionInversion();

        this.gpCtrlEstimadoEjecucionCierreAno = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '9',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlEstEjecCierreAno = _this.gpCtrlEstimadoEjecucionCierreAno.gridDesagregacionInversion();

        _this.tpCtrlInverPrimerTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinversprimer',
//            height: 150,
            items: [{
                title: 'Plan desagregado I trimestre',
                id: 'idgridplandesagregado',
                activeTab: 0,
                items: _this.gridCtrlPlanDesagregado,
                layout: 'fit'
            }, {
                title: 'Real ejecutado I trimestre',
                id: 'idgridplanrealejecutado',
                activeTab: 1,
                items: _this.gridCtrlRealEjecutado,
                layout: 'fit'
            }, {
                title: 'Plan desagregado I + II Trimestre (Plan I semestre)',
                id: 'idgridplansemestredesagregado',
                activeTab: 2,
                items: _this.gridCtrlDesagPrimerSemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n I semestre',
                id: 'idgridestimadoejecprimersemestre',
                activeTab: 3,
                items: _this.gridCtrlEstEjecPrimerSemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejeccierreanoprimer',
                activeTab: 4,
                items: _this.gridCtrlEstEjecCierreAno,
                layout: 'fit'
            }]
        });

        this.gpCtrlInverPrimerSemestre = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '10',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlPlanDesagPrimerSemestre = _this.gpCtrlInverPrimerSemestre.gridDesagregacionInversion();

        this.gpCtrlInverejecutadoAbril = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '11',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlInverEjecutadoAbril = _this.gpCtrlInverejecutadoAbril.gridDesagregacionInversion();

        this.gpCtrlEjecMayJun = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '12',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlInverEjecEjecMayJun = _this.gpCtrlEjecMayJun.gridDesagregacionInversion();

        this.gpCtrlEjecPrimerSemestre = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '13',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlInverPrimSemestre = _this.gpCtrlEjecPrimerSemestre.gridDesagregacionInversion();

        this.gpCtrlEjecCierreAno = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '14',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlInverCierreAno = _this.gpCtrlEjecCierreAno.gridDesagregacionInversion();

        _this.tpCtrlInverSegundoTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinvers',
//            height: 150,
            items: [{
                title: 'Plan desagregado I + II trimestre (Plan I semestre)',
                id: 'idgridplandesagregadoprimersemestre',
                activeTab: 0,
                items: _this.gridCtrlPlanDesagPrimerSemestre,
                layout: 'fit'
            }, {
                title: 'Real ejecutado hasta abril',
                id: 'idgridplanrealejecutadoinv',
                activeTab: 1,
                items: _this.gridCtrlInverEjecutadoAbril,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n mayo y junio',
                id: 'idgridestimadoejecucionmayjun',
                activeTab: 2,
                items: _this.gridCtrlInverEjecEjecMayJun,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n I semestre',
                id: 'idgridestimadoejecprimersemest',
                activeTab: 3,
                items: _this.gridCtrlInverPrimSemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejeccierreano',
                activeTab: 4,
                items: _this.gridCtrlInverCierreAno,
                layout: 'fit'
            }]
        });

        this.gpCtrlPlanPrimerSemestre = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '15',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlPlanPrimerSemest = _this.gpCtrlPlanPrimerSemestre.gridDesagregacionInversion();

        this.gpCtrlRealEjecutadoPrimerSemestre = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '16',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlRealEjecutadoPrimerSemestre = _this.gpCtrlRealEjecutadoPrimerSemestre.gridDesagregacionInversion();

        this.gpCtrlEjecutadoCierreAno = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '17',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlEjecutadoCierreAno = _this.gpCtrlEjecutadoCierreAno.gridDesagregacionInversion();

        _this.tpCtrlInverTerceroTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinverstercertrimestre',
//            height: 150,
            items: [{
                title: 'Plan desagregado I + II trimestre (Plan I semestre)',
                id: 'idgridplandesagregprimersemestre',
                activeTab: 0,
                items: _this.gridCtrlPlanPrimerSemest,
                layout: 'fit'
            }, {
                title: 'Real ejecutado hasta I semestre',
                id: 'idgridejecutadoprimersemestre',
                activeTab: 1,
                items: _this.gridCtrlRealEjecutadoPrimerSemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejecucioncierreano',
                activeTab: 2,
                items: _this.gridCtrlEjecutadoCierreAno,
                layout: 'fit'
            }]
        });

        this.gpCtrlRealCierreAno = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '18',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlRealCierreAno = _this.gpCtrlRealCierreAno.gridDesagregacionInversion();

        this.gpCtrlImpactoProximoPlan = new Utilidades.Cmp.GridDesagregacionInversion({
            id: '19',
            region: 'center',
            cm: _this.gridInverDesgInver.getCm()
        });
        _this.gridCtrlImpactoProximoPlan = _this.gpCtrlImpactoProximoPlan.gridDesagregacionInversion();

        _this.tpCtrlInverCuartoTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinverscuartotrimestre',
//            height: 150,
            items: [{
                title: 'Real cierre del a\xF1o',
                id: 'idgridrealcierreanno',
                activeTab: 0,
                items: _this.gridCtrlRealCierreAno,
                layout: 'fit'
            }, {
                title: 'Impacto en el pr\xf3ximo plan (No incluidos en el plan emitido)',
                id: 'idgridimpactoproximoplan',
                activeTab: 1,
                items: _this.gridCtrlImpactoProximoPlan,
                layout: 'fit'
            }]
        });

        _this.tpCtrlInversiones = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrl',
            region: 'south',
            disabled: true,
            height: 200,
            tbar: ['->', _this.btnGuardarCtrlInver],
            items: [{
                title: 'I trimestre',
                id: 'idgridctrlPrimer',
                activeTab: 0,
                items: _this.tpCtrlInverPrimerTrimestre,
                layout: 'fit'
            }, {
                title: 'II trimestre',
                id: 'idgridctrlSegundo',
                activeTab: 1,
                items: _this.tpCtrlInverSegundoTrimestre,
                layout: 'fit'
            }, {
                title: 'III trimestre',
                id: 'idgridctrlTercero',
                activeTab: 2,
                items: _this.tpCtrlInverTerceroTrimestre,
                layout: 'fit'
            }, {
                title: 'IV trimestre',
                id: 'idgridctrlCuarto',
                activeTab: 3,
                items: _this.tpCtrlInverCuartoTrimestre,
                layout: 'fit'
            }]
        });

        _this.pInverCtrl = new Ext.Panel({
            id: 'idPanelDesag',
            title: 'Datos de la inversi\xF3n',
            height: 500,
            layout: 'border',
            border: false,
            frame: true,
            items: [_this.gridInversionCtrl, _this.gpPlanAprobadoInverCtrl, _this.tpCtrlInversiones]
        });

        this.gridInverCtrlEquipo = new Utilidades.Cmp.GridInversiones({
            id: 'ctrlEquipos',
            region: 'north'
        });
        _this.gridInverCtrlEq = _this.gridInverCtrlEquipo.gridDataGralInversion();

        this.gpPlanEquipoCtrl = new Utilidades.Cmp.GridPlanEquipos({
            id: 'planEquipo',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gpPlanAprobadoEquipoCtrl = _this.gpPlanEquipoCtrl.gridPlanEquipo();

        this.gpCtrlEquipoplanDesagregadoPrimer = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '2',
            region: 'center',
            paginado: false
        });
        _this.gpEquipoctrlplandesagregadoprimer = this.gpCtrlEquipoplanDesagregadoPrimer.gridDesgloseEquipo();

        this.gpCtrlEquiporealejecPrimer = new Utilidades.Cmp.GridDesgloseEquipos({
            id: 'realItrimestre',
            region: 'center',
            paginado: false
        });
        _this.gpEquipoctrlrealEjecPrimer = this.gpCtrlEquiporealejecPrimer.gridDesgloseEquipo();

        this.gpCtrlEquipoDesagPrimerSegundo = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '4',
            region: 'center',
            paginado: false
        });
        _this.gpEquipoctrlDesagPrimerSeg = this.gpCtrlEquipoDesagPrimerSegundo.gridDesgloseEquipo();

        this.gpCtrlEquipoEstPrimerSemest = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '5',
            region: 'center',
            paginado: false
        });
        _this.gpEquipoctrlEstPrimerSem = this.gpCtrlEquipoEstPrimerSemest.gridDesgloseEquipo();

        this.gpCtrlEquipoEstCierreano = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '6',
            region: 'center',
            paginado: false
        });
        _this.gpEquipoctrlEstCierAno = this.gpCtrlEquipoEstCierreano.gridDesgloseEquipo();

        _this.tpCtrlEquipoPrimerTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpdctrlequipoprimertrimestre',
//            height: 150,
            items: [{
                title: 'Plan desagregado I trimestre',
                id: 'idgridplandesagregadoeq',
                activeTab: 0,
                items: _this.gpEquipoctrlplandesagregadoprimer,
                layout: 'fit'
            }, {
                title: 'Real ejecutado I trimestre',
                id: 'idgridplanrealejecutadoeqI',
                activeTab: 1,
                items: _this.gpEquipoctrlrealEjecPrimer,
                layout: 'fit'
            }, {
                title: 'Plan desagregado I + II Trimestre (Plan I semestre)',
                id: 'idgridplansemestredesagregadoeq',
                activeTab: 2,
                items: _this.gpEquipoctrlDesagPrimerSeg,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n I semestre',
                id: 'idgridestimadoejecprimersemestreeq',
                activeTab: 3,
                items: _this.gpEquipoctrlEstPrimerSem,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejeccierreanoeqI',
                activeTab: 4,
                items: _this.gpEquipoctrlEstCierAno,
                layout: 'fit'
            }]
        });

        this.gpCtrlEqSegundTrimestre = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '7',
            region: 'center',
            paginado: false
        });
        _this.gpEqSegTrimestre = this.gpCtrlEqSegundTrimestre.gridDesgloseEquipo();

        this.gpCtrlEqRealEjecAbril = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '8',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlInverEjecutadoAbrilEq = this.gpCtrlEqRealEjecAbril.gridDesgloseEquipo();

        this.gpCtrlEqRealEjecMyJun = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '9',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlInverEjecEjecMayJunEq = this.gpCtrlEqRealEjecMyJun.gridDesgloseEquipo();

        this.gpCtrlEstEjecIsemestre = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '10',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlEqPrimSemestre = this.gpCtrlEstEjecIsemestre.gridDesgloseEquipo();

        this.gpCtrlEqCierreAno = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '11',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlEqCierreAno = this.gpCtrlEqCierreAno.gridDesgloseEquipo();

        _this.tpCtrlEquipoSegundoTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlequipoII',
//            height: 150,
            items: [{
                title: 'Plan desagregado I + II trimestre (Plan I semestre)',
                id: 'idgridplandesagregadoprimertrimestreeq',
                activeTab: 0,
                items: _this.gpEqSegTrimestre,
                layout: 'fit'
            }, {
                title: 'Real ejecutado hasta abril',
                id: 'idgridplanrealejecutadoeq',
                activeTab: 1,
                items: _this.gridCtrlInverEjecutadoAbrilEq,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n mayo y junio',
                id: 'idgridestimadoejecucionmayjuneq',
                activeTab: 2,
                items: _this.gridCtrlInverEjecEjecMayJunEq,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n I semestre',
                id: 'idgridestimadoejecprimersemesteq',
                activeTab: 3,
                items: _this.gridCtrlEqPrimSemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejeccierreanoeqII',
                activeTab: 4,
                items: _this.gridCtrlEqCierreAno,
                layout: 'fit'
            }]
        });

        this.gpCtrlEqPrimerSemestre = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '12',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlPlanPrimerSemestEq = this.gpCtrlEqPrimerSemestre.gridDesgloseEquipo();

        this.gpCtrlEqRealEjecIsemestre = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '13',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlRealEjecIsemEq = this.gpCtrlEqRealEjecIsemestre.gridDesgloseEquipo();

        this.gpCtrlEqEstEjecCierreAno = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '14',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlEstEjecCierreAnoEq = this.gpCtrlEqEstEjecCierreAno.gridDesgloseEquipo();

        _this.tpCtrlEquipoTerceroTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinverstercertrimestreeqIII',
//            height: 150,
            items: [{
                title: 'Plan desagregado I + II trimestre (Plan I semestre)',
                id: 'idgridplandesagregprimersemestreeqIII',
                activeTab: 0,
                items: _this.gridCtrlPlanPrimerSemestEq,
                layout: 'fit'
            }, {
                title: 'Real ejecutado hasta I semestre',
                id: 'idgridejecutadoprimersemestreeq',
                activeTab: 1,
                items: _this.gridCtrlRealEjecIsemEq,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejecucioncierreanoeq',
                activeTab: 2,
                items: _this.gridCtrlEstEjecCierreAnoEq,
                layout: 'fit'
            }]
        });

        this.gpCtrlEqRealCierreAno = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '15',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlRealCierreAnoEq = this.gpCtrlEqRealCierreAno.gridDesgloseEquipo();

        this.gpCtrlEqImpactoProxAno = new Utilidades.Cmp.GridDesgloseEquipos({
            id: '16',
            region: 'center',
            paginado: false
        });
        _this.gridCtrlImpacProxAnoEq = this.gpCtrlEqImpactoProxAno.gridDesgloseEquipo();

        _this.tpCtrlEquipoCuartoTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinverscuartotrimestreeqIV',
//            height: 150,
            items: [{
                title: 'Real cierre del a\xF1o',
                id: 'idgridrealcierreannoeq',
                activeTab: 0,
                items: _this.gridCtrlRealCierreAnoEq,
                layout: 'fit'
            }, {
                title: 'Impacto en el pr\xf3ximo plan (No incluidos en el plan emitido)',
                id: 'idgridimpactoproximoplaneq',
                activeTab: 1,
                items: _this.gridCtrlImpacProxAnoEq,
                layout: 'fit'
            }]
        });

        _this.tpCtrlEquipos = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlequipos',
            region: 'south',
            disabled: true,
            height: 150,
            tbar: ['->', _this.btnGuardarCtrlEquipos],
            items: [{
                title: 'I trimestre',
                id: 'idgridctrlprimereqI',
                activeTab: 0,
                items: _this.tpCtrlEquipoPrimerTrimestre,
                layout: 'fit'
            }, {
                title: 'II trimestre',
                id: 'idgridctrlsegundoeq',
                activeTab: 1,
                items: _this.tpCtrlEquipoSegundoTrimestre,
                layout: 'fit'
            }, {
                title: 'III trimestre',
                id: 'idgridctrlterceroeqIII',
                activeTab: 2,
                items: _this.tpCtrlEquipoTerceroTrimestre,
                layout: 'fit'
            }, {
                title: 'IV trimestre',
                id: 'idgriddesagCuartoeq',
                activeTab: 3,
                items: _this.tpCtrlEquipoCuartoTrimestre,
                layout: 'fit'
            }]
        });

        _this.pEquipoCtrl = new Ext.Panel({
            id: 'idPanelCtrlEq',
            title: 'Datos de la inversi\xF3n',
            height: 500,
            layout: 'border',
            border: false,
            frame: true,
            items: [_this.gridInverCtrlEq, _this.gpPlanAprobadoEquipoCtrl, _this.tpCtrlEquipos]
        });

        this.gridDatInverCtrlMA = new Utilidades.Cmp.GridInversiones({
            id: 'DataMA',
            region: 'north'
        });
        _this.gridInverCtrlMA = _this.gridDatInverCtrlMA.gridDataGralInversion();

        this.gpPlanMACtrl = new Utilidades.Cmp.GridMedioAmbiente({
            id: '1',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridPlanMACtrl = _this.gpPlanMACtrl.gridMedioAmbiente();

        this.gpPlanMACtrlDesagItrimestre = new Utilidades.Cmp.GridMedioAmbiente({
            id: '2',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridMADesagItrimestre = _this.gpPlanMACtrlDesagItrimestre.gridMedioAmbiente();

        this.gpPlanMACtrlRealEjecItrimestre = new Utilidades.Cmp.GridMedioAmbiente({
            id: '3',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridMARealEjecItrimestre = _this.gpPlanMACtrlRealEjecItrimestre.gridMedioAmbiente();

        this.gpPlanMACtrlDesagIsemestre = new Utilidades.Cmp.GridMedioAmbiente({
            id: '4',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridMADesagIsemestre = _this.gpPlanMACtrlDesagIsemestre.gridMedioAmbiente();

        this.gpPlanMACtrlEstimadoEjecIsemestre = new Utilidades.Cmp.GridMedioAmbiente({
            id: '5',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridMAEstimEjecIsemestre = _this.gpPlanMACtrlEstimadoEjecIsemestre.gridMedioAmbiente();

        this.gpPlanMACtrlEstimadoEjecCierreAno = new Utilidades.Cmp.GridMedioAmbiente({
            id: '6',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridMAEstimEjecCierrAno = _this.gpPlanMACtrlEstimadoEjecCierreAno.gridMedioAmbiente();

        _this.tpCtrlMAPrimerTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpdctrlmaprimertrimestre',
//            height: 150,
            items: [{
                title: 'Plan desagregado I trimestre',
                id: 'idgridplandesagregadoma',
                activeTab: 0,
                items: _this.gridMADesagItrimestre,
                layout: 'fit'
            }, {
                title: 'Real ejecutado I trimestre',
                id: 'idgridplanrealejecutadoma',
                activeTab: 1,
                items: _this.gridMARealEjecItrimestre,
                layout: 'fit'
            }, {
                title: 'Plan desagregado I + II Trimestre (Plan I semestre)',
                id: 'idgridplansemestredesagregadoma',
                activeTab: 2,
                items: _this.gridMADesagIsemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n I semestre',
                id: 'idgridestimadoejecprimersemestrema',
                activeTab: 3,
                items: _this.gridMAEstimEjecIsemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejeccierreanoeq',
                activeTab: 4,
                items: _this.gridMAEstimEjecCierrAno,
                layout: 'fit'
            }]
        });

        this.gpPlanDesagIsemestre = new Utilidades.Cmp.GridMedioAmbiente({
            id: '7',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridMAPlanISemestre = _this.gpPlanDesagIsemestre.gridMedioAmbiente();

        this.gpRealEjecAbrilMA = new Utilidades.Cmp.GridMedioAmbiente({
            id: '8',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridRealEjecAbril = _this.gpRealEjecAbrilMA.gridMedioAmbiente();

        this.gpEstimadoEjecMayJun = new Utilidades.Cmp.GridMedioAmbiente({
            id: '9',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridEstEjecMayJun = _this.gpEstimadoEjecMayJun.gridMedioAmbiente();

        this.gpEstimadoEjecIsemestre = new Utilidades.Cmp.GridMedioAmbiente({
            id: '10',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlMAPrimSemestre = _this.gpEstimadoEjecIsemestre.gridMedioAmbiente();

        this.gpEstimadoEjecCierreAno = new Utilidades.Cmp.GridMedioAmbiente({
            id: '11',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlMACierreAno = _this.gpEstimadoEjecCierreAno.gridMedioAmbiente();

        _this.tpCtrlMASegundoTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlequipo',
//            height: 150,
            items: [{
                title: 'Plan desagregado I + II trimestre (Plan I semestre)',
                id: 'idgridplandesagregadoprimertrimestrema',
                activeTab: 0,
                items: _this.gridMAPlanISemestre,
                layout: 'fit'
            }, {
                title: 'Real ejecutado hasta abril',
                id: 'idgridplanrealejecutadomasegtri',
                activeTab: 1,
                items: _this.gridRealEjecAbril,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n mayo y junio',
                id: 'idgridestimadoejecucionmayjunma',
                activeTab: 2,
                items: _this.gridEstEjecMayJun,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n I semestre',
                id: 'idgridestimadoejecprimersemestma',
                activeTab: 3,
                items: _this.gridCtrlMAPrimSemestre,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejeccierreanoma',
                activeTab: 4,
                items: _this.gridCtrlMACierreAno,
                layout: 'fit'
            }]
        });

        this.gpCtrlPlanIsemestrema = new Utilidades.Cmp.GridMedioAmbiente({
            id: '12',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlPlanPrimerSemestMA = _this.gpCtrlPlanIsemestrema.gridMedioAmbiente();

        this.gpCtrlMARealEjecIsem = new Utilidades.Cmp.GridMedioAmbiente({
            id: '13',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlRealEjecIsemMa = _this.gpCtrlMARealEjecIsem.gridMedioAmbiente();

        this.gpCtrlMAEstimadoEjecCierAno = new Utilidades.Cmp.GridMedioAmbiente({
            id: '14',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlEstEjecCierreAnoMA = _this.gpCtrlMAEstimadoEjecCierAno.gridMedioAmbiente();

        _this.tpCtrlMATerceroTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinverstercertrimestreeq',
//            height: 150,
            items: [{
                title: 'Plan desagregado I + II trimestre (Plan I semestre)',
                id: 'idgridplandesagregprimersemestreeq',
                activeTab: 0,
                items: _this.gridCtrlPlanPrimerSemestMA,
                layout: 'fit'
            }, {
                title: 'Real ejecutado hasta I semestre',
                id: 'idgridejecutadoprimersemestrema',
                activeTab: 1,
                items: _this.gridCtrlRealEjecIsemMa,
                layout: 'fit'
            }, {
                title: 'Estimado de ejecuci\xF3n cierre del a\xF1o',
                id: 'idgridestimadoejecucioncierreanoma',
                activeTab: 2,
                items: _this.gridCtrlEstEjecCierreAnoMA,
                layout: 'fit'
            }]
        });

        this.gpCtrlMARealCierAno = new Utilidades.Cmp.GridMedioAmbiente({
            id: '15',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlRealCierreAnoMA = _this.gpCtrlMARealCierAno.gridMedioAmbiente();

        this.gpCtrlMAImpactoProxAno = new Utilidades.Cmp.GridMedioAmbiente({
            id: '16',
            region: 'center',
            paginado: false,
            title: 'Plan aprobado'
        });
        _this.gridCtrlImpactoProxAnoMA = _this.gpCtrlMAImpactoProxAno.gridMedioAmbiente();

        _this.tpCtrlMACuartoTrimestre = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlinverscuartotrimestreeq',
//            height: 150,
            items: [{
                title: 'Real cierre del a\xF1o',
                id: 'idgridrealcierreannoma',
                activeTab: 0,
                items: _this.gridCtrlRealCierreAnoMA,
                layout: 'fit'
            }, {
                title: 'Impacto en el pr\xf3ximo plan (No incluidos en el plan emitido)',
                id: 'idgridimpactoproximoplanma',
                activeTab: 1,
                items: _this.gridCtrlImpactoProxAnoMA,
                layout: 'fit'
            }]
        });

        _this.tpCtrlMA = new Ext.TabPanel({
            activeTab: 0,
            id: 'idtpctrlma',
            region: 'south',
            height: 150,
//            tbar: ['->', _this.btnGuardarCtrlInver],
            items: [{
                title: 'I trimestre',
                id: 'idgridctrlprimereq',
                activeTab: 0,
                items: _this.tpCtrlMAPrimerTrimestre,
                layout: 'fit'
            }, {
                title: 'II trimestre',
                id: 'idgridctrlsegundoma',
                activeTab: 1,
                items: _this.tpCtrlMASegundoTrimestre,
                layout: 'fit'
            }, {
                title: 'III trimestre',
                id: 'idgridctrlterceroeq',
                activeTab: 2,
                items: _this.tpCtrlMATerceroTrimestre,
                layout: 'fit'
            }, {
                title: 'IV trimestre',
                id: 'idgriddesagCuartoma',
                activeTab: 3,
                items: _this.tpCtrlMACuartoTrimestre,
                layout: 'fit'
            }]
        });

        _this.pMACtrl = new Ext.Panel({
            id: 'idPanelCtrlMA',
            title: 'Datos de la inversi\xF3n',
            height: 500,
            border: false,
            frame: true,
            items: [_this.gridInverCtrlMA, _this.gridPlanMACtrl, _this.tpCtrlMA]
        });

//tab del desglose (inversion, equipo y MA)
        _this.tpControl = new Ext.TabPanel({
            layaut: 'border',
            activeTab: 0,
            id: 'tpdctrlinvers',
            items: [{
                title: 'Inversi\xF3n',
                id: 'idgridInverctrl',
                activeTab: 0,
                layout: 'fit',
                items: _this.pInverCtrl
            }, {
                title: 'Equipos automotores',
                id: 'idequiposautomotoresctrl',
                activeTab: 1,
                layout: 'fit',
                items: _this.pEquipoCtrl
            }/*, {
             title: 'Medio ambiente',
             id: 'idtabmedioambientectrl',
             activeTab: 2,
             layout: 'fit',
             items: _this.pMACtrl
             }*/]
        });

        _this.wControl = new Ext.Window({
            title: 'Control del plan',
            layout: 'fit',
            closeAction: 'hide',
            resizable: true,
            modal: true,
            maximized: true,
            items: [_this.tpControl],
            buttons: [{
                id: 'btnCerrarControl',
                icon: perfil.dirImg + 'cerrar.png',
                iconCls: 'btn',
                tooltip: 'Cerrar ventana',
                text: 'Cerrar'
            }]
        });

        _this.pGeneral = new Ext.Panel({
            scope: this,
            layout: 'border',
            border: false,
            anchor: '100%',
            tbar: [_this.btnDesagregacion, _this.btnControl, _this.btnMenuAprobacion_desagregacion, _this.btnMenuActivacion_desagregacion, _this.btnLimpiarDesag, _this.btnLimpiarCtrl,
                '', _this.ChConsolidarDC, '', _this.ChVigenteDC, '->', 'Ejercicio:', _this.cmbEjercicio, '->', _this.btnAyudaDesCtrlInversion],
            items: [_this.treePanelinversion, _this.gridInversion]
        });

        _this.view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.pGeneral]
        });
    }
};
