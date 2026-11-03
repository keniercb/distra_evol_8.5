var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('centrodebalance', cargarInterfaz);
/*Botones*/
var btnAyuda, btnAprob, btnDes, btnAyudaDemanda, btnAyudaCobertura, hoja, tpaginadoDemanda;
/*Variables relacionadas con la vista Demanda*/
var stCmbModelo, CmbModelos, stgpDemanda, cmDemanda, smgpDemanda, gpDemanda, smtpDemanda, tpDemanda, stCmbCentroBalance;
/*Variables relacionadas con la vista CTE y otros ajustes*/
var stCobertura, cmCobertura, smgpCobertura, tpaginadoCobertura, gpCobertura, urlListarInd, CmbCentroBalance, entidadsel = null;
/*Otras variables*/
var rect, soyCB, soyDem, idmodelo, identidadsel, identidadselected, objci, Rector, CB, Od, identL;
var idajustedem, campobd, valorbd, codigoind, denomind, nropiezaind, necind, precio, idindicador, identidadmodelo, idejercicio;
var editadas = [], fila, columna, fallo = false, comport = 0;
var pAux1, pAux2, tbarBotones, tbpCentroBalance, PanelCemtroBalance, vpCentroBalance, comportamiento, rector, cb, od, treeLoader, treeclick, CbEnableDisable;
var field = 'denominacion', direction = 'ASC';
var cmbComportamiento, strComportamiento;
var cliccomport, demandante, balance, orgrector, orgdemtree, selectentidad, contol, comportamientoentidad, consolidado;
var apTodos, importeTotal, puroOD, puroCB, Ajustar, btnAjustar;
var apTodos, importeTotal, puroOD, puroCB, btnAprobTodos, btnDesTodos, btnAprob, btnDes, btnGuardar, btnExportar, teclascalientes;
var importes = [];
var gestionSegunEstEjercicioBM = true;
var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'balancematerial'
});
var cbaccionesDWH = Cmpcomplementario.cbacciones;
//ESTA LISTO PARA LOS COMPORTAMIENTOS OD Y CB FALTA REVISAR PARA EL COMPORTAMIENTO RECTOR
function cargarInterfaz() {
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Qq',
            alt: true,
            fn: function () {
                if (!btnAprob.hidden) {
                    if (!btnAprob.disabled)
                        AprobarDesaprobarDemanda(1);
                }
            }
        }, {
            key: 'Ww',
            alt: true,
            fn: function () {
                if (!btnDes.hidden) {
                    if (!btnDes.disabled)
                        AprobarDesaprobarDemanda(0);
                }
            }
        }, {
            key: 'Qq',
            ctrl: true,
            alt: true,
            fn: function () {
                if (!btnAprobTodos.hidden) {
                    if (!btnAprobTodos.disabled)
                        apTodos = 1;
                    AprobarDesaprobarDemanda(1);
                }
            }
        }, {
            key: 'Ww',
            ctrl: true,
            alt: true,
            fn: function () {
                if (!btnDesTodos.hidden) {
                    if (!btnDesTodos.disabled)
                        apTodos = 1;
                    AprobarDesaprobarDemanda(0);
                }
            }
        }, {
            key: 'Gg',
            alt: true,
            fn: function () {
                if (!btnGuardar.hidden) {
                    if (!btnGuardar.disabled)
                        ActualizarCampos();
                }
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function () {
                if (!btnLimpiarfil.hidden) {
                    if (!btnLimpiarfil.disabled)
                        limpiarfiltrosCB();
                }
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function () {
//                if (!btnAyudaDemanda.hidden) {
//                    mostrarAyuda('Balance Material');
//
//                }
            }
        }
    ]);

    map.enable();

    teclascalientes = new Ext.KeyMap(Ext.getBody(), [
        {
            key: 'Ee',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnExportar').disabled) {
                    Ext.getCmp('btnExportar').handler.call(this);
                }
            }
        }, {
            key: 'Jj',
            alt: true,
            scope: this,
            stopEvent: true,
            fn: function (_this) {
                if (!Ext.getCmp('btnAjustar').disabled) {
                    Ext.getCmp('btnAjustar').handler.call(this);
                }
            }
        }

    ]);

    teclascalientes.enable();

    // Máscara para visualizar indistintamente
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando
    });

    mymask.show();

    var strComportamiento = [
        [1, perfil.etiquetas.lbCentroBalance], [2, perfil.etiquetas.lbOrganoDemandante]
    ];

    //----------------Combo de cargar el protocolo
    cmbComportamiento = new Ext.form.ComboBox({
        id: 'cmbComportamiento',
        store: strComportamiento,
        fieldLabel: perfil.etiquetas.lbComportamiento,
        height: 40,
        width: 150,
        displayField: 'comportamiento',
        hiddenName: 'idcomportamiento',
        valueField: 'idcomportamiento',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        loadingText: perfil.etiquetas.lbEspere,
        emptyText: perfil.etiquetas.lbSeleccione,
        disabled: false,
        listeners: {
            select: function (combo, record, index) {

                if (cmbComportamiento.getValue() == 2) {
                    btnAjustar.enable();
                } else {
                    if (Ext.getCmp('chkajustecb') == 1) {
                        btnAjustar.enable();
                    } else {
                        btnAjustar.disable();
                    }

                }
                if (cmbComportamiento.getValue() == 1) {
                    CmbCentroBalance.enable();
                }

                if (objci.acciones.rector)
                    Ext.getCmp('btnAjustar').disable();


                //-------COMPORTAMIENTO CENTRO DE BALANCE--------
                if (combo.getValue() == 1) {
                    tpDemanda.show();
                    DesabilitarTodo();
                    cb = 1;
                    od = null;
                    CmbModelos.clearValue();
                    if (!objci.acciones.rector)
                        CmbCentroBalance.setValue(stCmbCentroBalance.data.items[0].id);
                    if (CmbCentroBalance.getValue() != null && !objci.acciones.rector) {
                        gpDemanda.getStore().removeAll();
                        stCmbModelo.removeAll();
                        tpDemanda.expand(true);
                        Ext.getCmp('chkajustecb').enable();
                        comport = 1;
                        soyCB = true;
                        orgdemtree = 0;
                        tpDemanda.enable();
                        identi = CmbCentroBalance.getValue();
                        treeLoader.baseParams.identidad = identi;
                        treeLoader.baseParams.idmode = idmodelo;
                        treeLoader.baseParams.rector = rect;
                        treeLoader.baseParams.cb = soyCB;
                        treeLoader.baseParams.ordem = orgdemtree;
                        treeLoader.load(tpDemanda.getRootNode());
                        pAux1.setTitle('Demanda  (Centro de balance)');
                        pAux2.layout.setActiveItem('tpDemanda');
                        comportamiento = '(Centro de balance)';
                    }

                    if (objci.acciones.rector) {
                        pAux2.layout.setActiveItem('tpDemanda');
                        CmbCentroBalance.enable();
                        CmbCentroBalance.clearValue();
                        gpDemanda.getStore().removeAll();
                        stCmbModelo.removeAll();
                        comport = 1;
                        soyCB = true;
                        orgdemtree = 0;
                        pAux1.setTitle('Demanda  (Centro de balance)');
                        comportamiento = '(Centro de balance)';
                        btnAprobTodos.show();
                        btnDesTodos.show();
                        btnAprob.show();
                        btnDes.show();
                        btnAprobTodos.enable();
                        btnDesTodos.enable();
                        selectentidad = false;
                        cbEjercicio.disable();
                    }
                    //        

                    //-------COMPORTAMIENTO Órgano Demandante--------
                } else if (combo.getValue() == 2) {
                    CmbCentroBalance.disable();
                    cb = null;
                    od = 1;
                    CmbModelos.clearValue();
                    stCmbModelo.removeAll();
                    pAux2.layout.setActiveItem('tpEstructuraCB');
                    btnAprobTodos.enable();
                    btnDesTodos.enable();
                    btnGuardar.enable();
                    comport = 0;
                    Ext.getCmp('chkajustecb').disable();
                    Ext.getCmp('chkajustecb').setValue(false);
                    tpDemanda.collapse(true);
                    pAux1.setTitle('Demanda  (Órgano demandante)');
                    comportamiento = '(Órgano demandante)';
                    if (idmodelo && CmbCentroBalance.getValue() != null) {
                        gpDemanda.getStore().removeAll();
                        tpDemanda.enable();
                        soyCB = false;
                        orgdemtree = 1;
                        identi = CmbCentroBalance.getValue();
                        cb = null;
                        od = 1;
                        cliccomport = 0;
                        identidadselected = objci.identidad;
                    }

                    if (objci.acciones.rector) {
                        CmbCentroBalance.disable();
                        CmbCentroBalance.clearValue();
                        btnAprobTodos.hide();
                        btnDesTodos.hide();
                        btnAprob.hide();
                        btnDes.hide();
                        btnAprobTodos.disable();
                        btnDesTodos.disable();
                    }

                    editarcolumnas(1);
                    mostrarocultarcolumnas(1);
                }

                cbEjercicio.disable();
            }
        }

    });
    //-----------------------FIN DEL COMBO COMPORTAMIENTO--------------------------

    mymask.show();
    Ext.Ajax.request({
        url: 'centrodebalance',
        url: 'cargaInicial',
        callback: function (options, success, response) {
            objci = Ext.decode(response.responseText);

            if (!objci.codMsg) {
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
                    consolidado = 0;
                    for (i in acciones_reportes) {
                        objci.acciones[acciones_reportes[i].abreviatura] = true;
                    }
                    mymask.hide();
                    if (objci.acciones.rector)//organo rector
                    {
                        DesabilitarTodo();
                        rect = objci.acciones.rector;
                        rector = 1;
                        pAux1.setTitle('Demanda  (Rector)');
                        comportamiento = '(Rector)';
                        r = objci.identidad;
                        tpDemanda.collapse(true);
                        stCmbCentroBalance.reload({
                            params: {
                                ident: objci.identidad,
                                rect: rector,
                                soyCB: cb,
                                soyDem: od,
                                Rector: rector,
                                Od: od,
                                Cb: cb,
                                identL: objci.identidad
                            }
                        });
                        btnGuardar.hide();
                        tpDemanda.hide();
                        CmbModelos.enable();
                        CmbModelos.disable();
                        CmbCbEnableDisable = 2;
                        editarcolumnas(0);
                        pAux2.layout.setActiveItem('tpEstructuraCB');
                        cmbComportamiento.setValue(strComportamiento[1][0]);
                        btnAprobTodos.hide();
                        btnDesTodos.hide();
                        btnAprob.hide();
                        btnDes.hide();
                    } else
                        CmbCentroBalance.disable();
                    if (objci.entidadCB && !objci.acciones.rector && !objci.entidadOD) {
                        puroOD = null;
                        puroCB = 1;
                        soyCB = objci.entidadCB;
                        cb = 1;
                        orgdemtree = 1;
                        DesabilitarTodo();
                        pAux1.setTitle('Demanda  (Centro de balance)');
                        comportamiento = '(Centro de balance)';
                        stCmbCentroBalance.reload({
                            params: {
                                ident: objci.identidad,
                                rect: rector,
                                soyCB: cb,
                                soyDem: od,
                                Rector: rector,
                                Od: od,
                                Cb: cb,
                                identL: objci.identidad
                            }

                        });
                        CmbCbEnableDisable = 1;
                        editarcolumnas(0);
                        cmbComportamiento.setValue(strComportamiento[1][0]);
                    }
                    if (!objci.acciones.rector && !objci.entidadCB) {
                        soyDem = true;
                        puroOD = 1;
                        puroCB = null;
                        DesabilitarTodo();
                        od = 1;
                        pAux1.setTitle('Demanda  (Órgano demandante)');
                        comportamiento = '(Órgano demandante)';
                        Ext.getCmp('chkajustecb').disable();
                        stCmbCentroBalance.reload({
                            params: {
                                ident: objci.identidad,
                                rect: rector,
                                soyCB: soyCB,
                                soyDem: od,
                                Rector: rector,
                                Od: od,
                                Cb: cb,
                                identL: objci.identidad
                            }

                        });
                        mostrarocultarcolumnas(1);
                        cmbComportamiento.setValue(strComportamiento[1][0]);
                        CmbCbEnableDisable = 1;
                    }

                    if (objci.entidadCB && !objci.acciones.rector && objci.entidadOD) {
                        tpDemanda.hide();
                        demandante = 1;
                        balance = 1;
                        orgrector = null;
                        pAux1.setTitle('Demanda  (Órgano demandante)');
                        comportamiento = '(Órgano demandante)';
                        //-----------------Comportamiento de Centro de Balance-----------------------------------
                        soyCB = objci.entidadCB;
                        cb = 1;
                        orgdemtree = 1;
                        tpDemanda.collapse(true);
                        DesabilitarTodo();
                        editarcolumnas(0)

                        mostrarocultarcolumnas(1);
                        //-----------------Fin del comportamiento de Centro de Blance----------------------------

                        //----------------Comportamiento de Organo Demandante------------------------------------
                        soyDem = true;
                        od = 1;
                        //-----------------Fin del comportamiento de Organo DEmandante---------------------------

                        stCmbCentroBalance.reload({
                            params: {
                                ident: objci.identidad,
                                rect: rector,
                                soyCB: cb,
                                soyDem: od,
                                Rector: rector,
                                Od: od,
                                Cb: cb,
                                identL: objci.identidad
                            }

                        });
                        CmbCbEnableDisable = 1;
                        cmbComportamiento.setValue(strComportamiento[1][0]);
                    }

                });
            }
        }

    });

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAy',
        //icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbBtnAyuda + '(<b>Alt+H</b>)'/*,
         text: perfil.etiquetas.lbBtnAyuda,*/
    });

    btnAprob = new Ext.Button({
        disabled: true,
        id: 'btnAprob',
        tabIndex: 4,
        tooltip: perfil.etiquetas.lbBtnAprobar,
        // icon: perfil.dirImg + 'aprobar.png',
        iconCls: 'aprobar',
        // text: perfil.etiquetas.lbBtnAprobar1,
        handler: function () {

            AprobarDesaprobarDemanda(1);
        }
    });

    btnDes = new Ext.Button({
        disabled: true,
        id: 'btnDes',
        // icon: perfil.dirImg + 'desaprobar.png',
        tooltip: perfil.etiquetas.lbBtnDesaprobar,
        iconCls: 'desaprobar',
        //text: perfil.etiquetas.lbBtnDesaprobar1,
        handler: function () {

            AprobarDesaprobarDemanda(0);
        }
    });

    btnAprobTodos = new Ext.Button({
        disabled: false,
        id: 'btnAprobTodos',
        tabIndex: 4,
        tooltip: perfil.etiquetas.lbBtnAprobarTodos,
        //icon: perfil.dirImg + 'aprobar.png',
        iconCls: 'aprobar',
        //text: perfil.etiquetas.lbBtnAprobarTodos1,
        handler: function () {
            apTodos = 1;
            AprobarDesaprobarDemanda(1);
        }
    });

    btnDesTodos = new Ext.Button({
        disabled: false,
        id: 'btnDesTodos',
        // icon: perfil.dirImg + 'desaprobar.png',
        tooltip: perfil.etiquetas.lbBtnDesaprobarTodos,
        iconCls: 'desaprobar',
        //text: perfil.etiquetas.lbBtnDesaprobarTodos1,
        handler: function () {
            apTodos = 1;
            AprobarDesaprobarDemanda(0);
        }
    });

    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        //icon: perfil.dirImg + 'guardar.png',
        tooltip: perfil.etiquetas.lbBtnGuardar + '(<b>Alt+G</b>)',
        iconCls: 'guardar',
        //text: perfil.etiquetas.lbBtnGuardar,
        handler: function () {
            ActualizarCampos();
        }
    });

    btnLimpiarfil = new Ext.Button({
        id: 'btnLimpiarfil',
        // icon: perfil.dirImg + 'limpiar.png',
        tooltip: perfil.etiquetas.lbTtLimpiarFiltro + '(<b>ALT+L</b>)',
        iconCls: 'limpiar',
        // text: perfil.etiquetas.lbBtnLimpiar,
        handler: function () {
            limpiarfiltrosCB();
        }
    });

    btnAjustar = new Ext.Toolbar.Button({
        id: 'btnAjustar',
        //icon: perfil.dirImg + 'balance.png',
        iconCls: 'ajustar',
        tooltip: perfil.etiquetas.lbTtAjustar + '(<b>Alt+J</b>)',
        //text: "Ajustar",
        disabled: true,
        handler: function () {
            confAjuste();
        }
    });

    btnActualizarCalculo = new Ext.Toolbar.Button({
        // text: 'Actualizar cálculo',
        // icon: perfil.dirImg + 'actualizar.png',
        iconCls: 'actualizar',
        tooltip: perfil.etiquetas.lbTtActualizarCalculo,
        id: 'btnActualizarCalculo',
        disabled: true,
        handler: function () {
            mostrarMensaje(2, perfil.etiquetas.msgConfirmarActualizarCalculos, actualizarDemandaHijos);
        }
    });

    btnExportar = new Ext.Button({
        id: 'btnExportar',
        // icon: perfil.dirImg + 'exportar.png',
        tooltip: perfil.etiquetas.lbBtnExportar + '(<b>Alt+E</b>)',
        iconCls: 'exportar',
        // text: perfil.etiquetas.lbBtnExportar,
        disabled: true,
        handler: function () {
            nomplan = CmbModelos.getRawValue();
            filtros = filtrosindicadores.getFilterData();
            var win = window.open('exportar?filtros=' + Ext.encode(filtros) + '& idmodel=' + CmbModelos.getValue() +
                '& OD=' + od + '& CB=' + cb + '& ident= ' + identidadselected + '& ajusteCB=' + contol + '& todosCB=' + cb +
                '& rector=' + rector + '& identiLG=' + objci.identidad +
                '& plan= ' + nomplan + '& identiCB=' + CmbCentroBalance.getValue() + '& idejercicio=' + cbEjercicio.getValue());
        }
    });

    btnAyudaDemanda = new Ext.Button({
        disabled: false,
        id: 'btnAyuBalanceMaterial',
        // icon: perfil.dirImg + 'ayuda.png',
        tooltip: perfil.etiquetas.lbTtMostrarAyuda + '(<b>Alt+H</b>)',
        iconCls: 'ayuda'
        //text: perfil.etiquetas.lbBtnAyuda,

    });

    stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                //aki no hace falta el validar para el estado Elaboracion ya que se garantiza en Configurar ejercicios
                //que el ejercicio actual solo es de tipo estado Elaboracion
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                gestionarPermiso();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
            name: 'idejercicio'
        }, {
            name: 'ejercicio'
        }, {
            name: 'estado'
        }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbEspere,
        width: 80,
        listeners: {
            select: function (cb, rec, index) {
                mymask.show();
                gestionarPermiso();
                stCmbModelo.reload();

                if (rec.data.uridatosnomenclador != 'elaboracion') {
                    deshabilitarSegunEstadoDelEjercicio(false);
                } else {
                    deshabilitarSegunEstadoDelEjercicio(true);
                }
            }
        }
    });

    //boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: entidadsel,
        componente: 'BM'
    });

    btnGraficoPlanif = btnGraficas.botonMenuGrafica();
    //CAMPO PARA MOSTRAR EL IMPORTE TOTAL DE LOS INDICADORES EN UNA PAGINA
    importeTotal = new Ext.form.TextField({
        xtype: 'numberfield',
        //xtype:'textfield',
        id: 'importeTotal',
        width: 90,
        align: 'right',
        disabled: false,
        maskRe: /^([.,]+ ?[.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000'
    });
    stCbImportesBalance = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporteTotal],
            [2, perfil.etiquetas.lbImporteMN],
            [3, perfil.etiquetas.lbImporteMLC],
            [4, perfil.etiquetas.lbImporteFlete],
            [5, perfil.etiquetas.lbImporteContingencia],
            [6, perfil.etiquetas.lbImporteNecesidad],
            [7, perfil.etiquetas.lbImporteAjustado]

        ]
    });
    cbImportesBalance = new Ext.form.ComboBox({
        value: 1,
        id: 'cbImportesBalance',
        store: stCbImportesBalance,
        displayField: 'denominacion',
        typeAhead: true,
        listWidth: 100,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 80,
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            select: function (cb, record, index) {

                importeTotal.setValue(importes[record.data.idimporte]);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    //FIN DEL CAMPO IMPORTE

    tpaginadoDemanda = new Ext.form.NumberField({
        xtype: 'numberfield',
        id: 'tpaginadoDemanda',
        anchor: '95%',
        width: 30,
        value: 0,
        minValue: 0,
        maxValue: 20,
        maxText: perfil.etiquetas.lbTextPaginado,
        minText: perfil.etiquetas.lbTextPaginado,
        enableKeyEvents: true
    });
    // Store del combo de Centros de balance

    stCmbCentroBalance = new Ext.data.Store({
        url: 'ListarComboCentroBalance',
        //autoLoad:true,
        reader: new Ext.data.JsonReader({
                id: 'identidad',
                root: 'data'
            },
            [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }])
    });
    // -------------Fin del Store del combo de Centros de Balance

    //Combo para los Centros de Balance yanet

    CmbCentroBalance = new Ext.form.ComboBox({
        tabIndex: 10,
        allowBlank: false,
        emptyText: perfil.etiquetas.lbSeleccione,
        width: 150,
        listWidth: 250,
        label: perfil.etiquetas.lbCentroBalance + ":",
        store: stCmbCentroBalance,
        valueField: 'identidad',
        displayField: 'denominacion',
        id: 'tbcmbcentrobalance',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        disabled: true,
        forceSelection: true,
        typeAhead: true,
        selectOnFocus: false,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function () {
                if (objci.acciones.rector) {
                    Ext.getCmp('chkajustecb').enable();
                    if (Ext.getCmp('chkajustecb').getValue() == true) {
                        stCmbModelo.reload();
                    }
                }
                if (cb == 1)
                    Ext.getCmp('cmbComportamiento').enable();
                soyCB = false
                tpDemanda.show();
                tpDemanda.enable();
                tpDemanda.expand(true);
                identi = CmbCentroBalance.getValue();
                treeLoader.baseParams.identidad = identi;
                treeLoader.baseParams.idmode = idmodelo;
                treeLoader.baseParams.rector = rect;
                treeLoader.baseParams.cb = soyCB;
                treeLoader.load(tpDemanda.getRootNode());
                pAux2.layout.setActiveItem('tpDemanda');

                if (rector == 1 && tpDemanda.getSelectionModel().getSelectedNode() != null && (tpDemanda.getSelectionModel().id != 0)) {
                    gpDemanda.getStore().removeAll();
                    cb = null;
                    od = null;
                    gpDemanda.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            idmodel: idmodelo,
                            ident: identidadselected,
                            identiCB: CmbCentroBalance.getValue(),
                            identiLG: objci.identidad,
                            rector: rector
                        }
                    });
                }
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 22) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoExistenIndicadoresCB);
                }
            }

        }
    });
    //--------Fin del combo-----------

    stCmbModelo = new Ext.data.Store({
        url: 'listarComboModelos',
        listeners: {
            beforeload: function (st, opt) {
                if (stCmbModelo.getCount() == 0) {
                    btnAjustar.disable();
                }
                Ext.Ajax.timeout = 6400000;
                if (Ext.getCmp('chkajustecb').getValue() == false) {
                    st.baseParams.identidad = identidadselected;
                    st.baseParams.idcb = CmbCentroBalance.getValue();
                    st.baseParams.idejercicio = cbEjercicio.getValue();
                } else {
                    st.baseParams.identidad = CmbCentroBalance.getValue();
                    st.baseParams.idejercicio = cbEjercicio.getValue();
                    if (objci.acciones.rector) {
                        st.baseParams.idcb = CmbCentroBalance.getValue();
                    }
                }

                st.baseParams.esrector = objci.acciones.rector;
                st.baseParams.cb = (cb == true) ? 1 : 0;
                st.baseParams.check = (Ext.getCmp('chkajustecb').getValue() == true) ? 1 : 0;
            },
            load: function () {

                if (stCmbModelo.getCount() == 0) {
                    CmbModelos.clearValue();
                    stgpDemanda.removeAll();
                    if (selectentidad) {
                        mostrarMensaje(1, perfil.etiquetas.msgIndicadoresEnCero);
                    }
                }
            }
        },
        reader: new Ext.data.JsonReader({
                id: 'idmodelo',
                root: 'data'
            },
            [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }])
    });
    //Combo de Planes
    CmbModelos = new Ext.form.ComboBox({
        tabIndex: 10,
        allowBlank: false,
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbEspere,
        width: 150,
        listWidth: 250,
        store: stCmbModelo,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        id: 'tbcmbmodelo',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        selectOnFocus: false,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function () {

                if (demandante == 1 && balance == 1) {
                    cmbComportamiento.enable();
                }
                if (cmbComportamiento.getValue() == 2) {
                    btnAjustar.enable();
                }
                if (Ext.getCmp('chkajustecb') == 0) {
                    btnAjustar.disable();
                } else {
                    if (Ext.getCmp('chkajustecb') == 1) {
                        btnAjustar.enable();
                    }
                }

                idmodelo = CmbModelos.getValue();
                if (objci.acciones.rector)
                    btnAjustar.disable();
                if (rector == 1) {

                    gpDemanda.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            idmodel: idmodelo,
                            ident: identidadselected,
                            identiCB: CmbCentroBalance.getValue(),
                            identiLG: objci.identidad,
                            CB: cb,
                            OD: od,
                            todosCB: cliccomport,
                            rector: rector
                        }
                    });
                }

                if (CmbCentroBalance.getValue() != null && cb == 1 && Ext.getCmp('chkajustecb').getValue() == false) {
                    Ext.getCmp('cmbComportamiento').enable();
                }
                if (cmbComportamiento.getValue() == 2) {
                    mostrarocultarcolumnas(1);
                    btnAprobTodos.enable();
                    btnDesTodos.enable();
                    btnGuardar.enable();
                } else if (cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true) {
                    mostrarocultarcolumnas(0);
                }
                if ((tpDemanda.getSelectionModel().id != 0) && rector != 1) {
                    if (Ext.getCmp('cmbComportamiento').getValue() == 1) {
                        orgdemtree = 0;
                        tpDemanda.enable();
                    } else {
                        orgdemtree = 1;
                    }
                    identi = CmbCentroBalance.getValue();
                    if (tpDemanda.getSelectionModel().getSelectedNode() == null && cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == false) {
                        treeLoader.baseParams.identidad = identi;
                        treeLoader.baseParams.idmode = idmodelo;
                        treeLoader.baseParams.rector = rect;
                        treeLoader.baseParams.cb = soyCB;
                        treeLoader.baseParams.ordem = orgdemtree;
                        treeLoader.load(tpDemanda.getRootNode());
                    }
                    if (cmbComportamiento.getValue() == 2 || Ext.getCmp('chkajustecb').getValue() == true) {
                        editarcolumnas(1);
                    } else {
                        editarcolumnas(0);
                    }
                    gpDemanda.getStore().removeAll();
                    //                AKI SE LLAMA EL GRID CON LOS DATOS APRA REALIZAR EL BALANCE

                    if (Ext.getCmp('cmbComportamiento').getValue() == 1 && rector != 1) {

                        if (tpDemanda.getSelectionModel().id != 0 && Ext.getCmp('chkajustecb').getValue() == false) {
                            cb = 1;
                            od = null;
                            cliccomport = 1;
                            gpDemanda.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: 20,
                                    idmodel: idmodelo,
                                    ident: identidadselected,
                                    identiCB: CmbCentroBalance.getValue(),
                                    identiLG: objci.identidad,
                                    CB: cb,
                                    OD: od,
                                    todosCB: cliccomport,
                                    rector: rector
                                }
                            });
                        } else if (Ext.getCmp('chkajustecb').getValue() == false)
                            Ext.MessageBox.show({
                                title: perfil.etiquetas.lbInformacion,
                                buttons: Ext.MessageBox.OK,
                                msg: perfil.etiquetas.lbTtDebeSeleccionarOD,
                                icon: Ext.MessageBox.INFO
                            });
                        if (Ext.getCmp('chkajustecb').getValue() == true) {
                            cb = 1;
                            od = null;
                            cliccomport = 1;
                            gpDemanda.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: 20,
                                    idmodel: idmodelo,
                                    ident: CmbCentroBalance.getValue(),
                                    identiCB: CmbCentroBalance.getValue(),
                                    identiLG: objci.identidad,
                                    CB: cb,
                                    OD: od,
                                    todosCB: cliccomport,
                                    rector: rector
                                }
                            });
                        }
                    } else if (Ext.getCmp('cmbComportamiento').getValue() == 2 && rector != 1) {
                        cb = null;
                        od = 1;
                        cliccomport = 0;
                        gpDemanda.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20,
                                idmodel: idmodelo,
                                ident: identidadselected,
                                identiCB: CmbCentroBalance.getValue(),
                                identiLG: objci.identidad,
                                CB: cb,
                                OD: od,
                                todosCB: cliccomport,
                                rector: rector
                            }
                        });
                    }

                    //------------------------------Termina el ELSE-----------------------------------
                }

                if (rector == 1 && CmbCentroBalance.getValue() && tpDemanda.getSelectionModel().getSelectedNode() == null && (tpDemanda.getSelectionModel().id != 0)) {
                    gpDemanda.getStore().removeAll();
                    cb = null;
                    od = null;
                    gpDemanda.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            idmodel: idmodelo,
                            ident: identidadselected,
                            identiCB: CmbCentroBalance.getValue(),
                            identiLG: objci.identidad,
                            rector: rector
                        }
                    });
                }
                pAux1.setTitle('Demanda ' + comportamiento);
                btnExportar.enable();
            }
        }
    });
    //------------------STORE DEL GRID DEMANDA--------------------------------------------
    stgpDemanda = new Ext.data.Store({
        url: 'listarIndicadoresEntidad',
        listeners: {
            beforeload: function (st, opt) {

                importeTotal.setValue(null);
                if (Ext.getCmp('cmbComportamiento').getValue() == 1) {
                    od = null;
                    cb = 1;
                    cliccomport = 0;
                } else {
                    if (Ext.getCmp('cmbComportamiento').getValue() == 2) {
                        cb = null;
                        od = 1;
                        cliccomport = 0
                    }
                }
                if (Ext.getCmp('chkajustecb').getValue() == true) {
                    contol = true;
                    stgpDemanda.baseParams.ident = CmbCentroBalance.getValue();
                } else {
                    contol = false;
                    stgpDemanda.baseParams.ident = identidadselected;
                }
                stgpDemanda.baseParams.idmodel = idmodelo;
                stgpDemanda.baseParams.identiLG = objci.identidad;
                stgpDemanda.baseParams.identiCB = CmbCentroBalance.getValue();
                stgpDemanda.baseParams.OD = od;
                stgpDemanda.baseParams.rector = rector;
                stgpDemanda.baseParams.CB = cb;
                stgpDemanda.baseParams.todosCB = cb;
                stgpDemanda.baseParams.ajusteCB = contol;
                stgpDemanda.baseParams.consolidado = consolidado;
                stgpDemanda.baseParams.hoja = hoja;
                stgpDemanda.baseParams.idejercicio = cbEjercicio.getValue();
                stgpDemanda.baseParams.start = 0;
                stgpDemanda.baseParams.limit = 20;
                stgpDemanda.baseParams.glob = Ext.getCmp('chkglobalCB').getValue();
                filtrosbalance();
                btnAprob.disable();
                btnDes.disable();
            },
            load: function (st, record, ob) {
                if (cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true && stgpDemanda.getCount() > 0) {
                    btnAjustar.enable();
                }
                if ((cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true)) {
                    btnAprob.show();
                    btnDes.show();
                    btnDesTodos.show();
                    btnAprobTodos.show();
                } else {
                    btnAprob.hide();
                    btnDes.hide();
                    btnDesTodos.hide();
                    btnAprobTodos.hide();
                }
                siexistecolumFiltrada();
                calcularLosImportes(st);
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idindicador',
            root: 'data',
            totalProperty: 'total',
            importetotal: 'importetotal'
        }, [
            {
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'naturaleza'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'necesidad'
            }, {
                name: 'coberturaparcialestimada'
            }, {
                name: 'coberturatotalestimada'
            }, {
                name: 'idajusteexistencia'
            }, {
                name: 'idajusteexistenciaod'
            }, {
                name: 'idajusteexistenciacb'
            }, {
                name: 'reservaministerial'
            }, {
                name: 'cantidadeconomia'
            }, {
                name: 'demanda'
            }, {
                name: 'precio'
            }, {
                name: 'idodcte'
            }, {
                name: 'importe'
            }, {
                name: 'importemlc'
            }, {
                name: 'flete'
            }, {
                name: 'contingencia'
            }, {
                name: 'importefila'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'fechaajustedemanda'
            }, {
                name: 'identidadmodelo'
            }, {}, {
                name: 'idmodelo'
            }, {
                name: 'idejercicio'
            }, {
                name: 'idaprobacionpla'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'denominacioncb'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'aprobacion'
            }, {
                name: 'identidad'
            }, {
                name: 'viaadquisicion'
            }, {
                name: 'organosatisface'
            }
        ])
    });
    //------------------FIN DEL STORE DEL GRID DEMANDA------------------------------------

    //-----------------COLUNMODEL DEL RID DEMANDA----------------------------------------
    cmDemanda = new Ext.grid.ColumnModel([
        {
            dataIndex: 'codigo',
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            sortable: true,
            width: 90,
            renderer: crearToolTip
        },
        {
            dataIndex: 'numeropieza',
            // header: perfil.etiquetas.lbnropieza,
            header: perfil.etiquetas.lbNroPieza,
            tooltip: perfil.etiquetas.lbTtNroPieza,
            sortable: true,
            width: 90,
            align: 'left',
            renderer: crearToolTip
        },
        {
            dataIndex: 'denominacion',
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            sortable: true,
            width: 10,
            id: 'expand',
            renderer: crearToolTip
        },
        {
            dataIndex: 'naturaleza',
            header: perfil.etiquetas.lbNaturaleza,
            tooltip: perfil.etiquetas.lbNaturaleza,
            sortable: true,
            width: 100,
            align: 'left',
            renderer: crearToolTip
        },
        {
            dataIndex: 'denominacioncb',
            tooltip: perfil.etiquetas.lbCentroBalance,
            header: perfil.etiquetas.lbCentroBalance,
            sortable: true,
            width: 150,
            align: 'left',
            renderer: crearToolTip
        },
        {
            dataIndex: 'unidadmedida',
            tooltip: perfil.etiquetas.lbumedida,
            header: perfil.etiquetas.lbHeaderUMedida,
            sortable: true,
            width: 60,
            align: 'center',
            renderer: crearToolTip
        },
        {
            dataIndex: 'necesidad',
            tooltip: perfil.etiquetas.lbNecesidad,
            header: perfil.etiquetas.lbNecesidad,
            sortable: true,
            width: 80,
            align: 'right',
            renderer: crearToolTip
        },
        {
            dataIndex: 'coberturaparcialestimada',
            header: perfil.etiquetas.lbCTE,
            tooltip: perfil.etiquetas.lbTtCTE,
            sortable: true,
            width: 60,
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'coberturatotalestimada',
            header: perfil.etiquetas.lbTotal,
            tooltip: perfil.etiquetas.lbCTEdeCalculoCobertura,
            sortable: true,
            width: 60,
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'reservaministerial',
            header: perfil.etiquetas.lbRM,
            tooltip: perfil.etiquetas.lbTtRM,
            sortable: true,
            width: 40,
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'cantidadeconomia',
            header: perfil.etiquetas.lbEconomia,
            tooltip: perfil.etiquetas.lbTtREconomia,
            sortable: true,
            width: 80,
            align: 'right',
            renderer: crearToolTip,
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                minValue: 0.000000000000
            })
        },
        {
            dataIndex: 'demanda',
            tooltip: perfil.etiquetas.lbDemanda,
            header: perfil.etiquetas.lbDemanda,
            sortable: true,
            width: 80,
            renderer: crearToolTip,
            align: 'right'
        },
        {
            dataIndex: 'precio',
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            sortable: true,
            renderer: crearToolTip,
            width: 80,
            align: 'right'
        },
        {
            dataIndex: 'importe',
            tooltip: perfil.etiquetas.lbImporte,
            header: perfil.etiquetas.lbImporte,
            sortable: true,
            width: 80,
            renderer: crearToolTip,
            align: 'right'
        },
        {
            dataIndex: 'importemlc',
            tooltip: perfil.etiquetas.lbImporteMLC,
            header: perfil.etiquetas.lbImporteMLC,
            sortable: true,
            renderer: crearToolTip,
            width: 80,
            align: 'right'
        },
        {
            dataIndex: 'flete',
            tooltip: perfil.etiquetas.lbImporteFlete,
            header: perfil.etiquetas.lbImporteFlete,
            sortable: true,
            renderer: crearToolTip,
            width: 90,
            align: 'right'
        },
        {
            dataIndex: 'contingencia',
            tooltip: perfil.etiquetas.lbImporteContingencia,
            header: perfil.etiquetas.lbImporteCont,
            sortable: true,
            renderer: crearToolTip,
            width: 110,
            align: 'right'
        },
        {
            dataIndex: 'importefila',
            tooltip: perfil.etiquetas.lbImporteFila,
            header: perfil.etiquetas.lbImporteFila,
            sortable: true,
            renderer: crearToolTip,
            width: 80,
            align: 'right'
        },
        {
            dataIndex: 'viaadquisicion',
            tooltip: perfil.etiquetas.lbViaAdq,
            header: perfil.etiquetas.lbViaAdq,
            sortable: true,
            renderer: crearToolTip,
            width: 110,
            align: 'left'
        },
        {
            dataIndex: 'organosatisface',
            tooltip: perfil.etiquetas.lbOrgSat,
            header: perfil.etiquetas.lbOrgSat,
            sortable: true,
            renderer: crearToolTip,
            width: 120,
            align: 'left'
        },
        {
            tooltip: perfil.etiquetas.lbTAprobado,
            dataIndex: 'idaprobacion',
            header: perfil.etiquetas.lbTAprobado,
            sortable: true,
            width: 60,
            align: 'center',
            renderer: ColumnaAprobacionBalance
        }
    ]);
    //-----------------FIN DEL COLUNMODEL DEL GRID DEMANDA--------------------------------

    //-----------------FILTROS DEL GRID DEMANDA-------------------------------------------
    filtrosindicadores = new Ext.grid.GridFilters({
        filters: [{
            type: 'string_adaptado',
            dataIndex: 'codigo',
            xtype: 'numberfield',
            idTextField: 'filtrocodigo',
            anchor: '95%',
            fieldLabel: '',
            disabled: false,
            maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
            maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
        },
            {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'listado',
                dataIndex: 'denominacioncb',
                idcombo: 'filtrocb',
                urlcb: 'listarCentroBalance',
                idstore: 'idstcentrobalancenorma',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                tpl: '<tpl for="."><div ext:qtip="{centrobalance}" class="x-combo-list-item">{centrobalance}</div></tpl>'
            },
            {
                type: 'listado',
                dataIndex: 'unidadmedida',
                idcombo: 'filtroum',
                urlcb: 'cargarunidadmedida',
                idstore: 'idtodasunidadesmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'abreviaturaunidadmedida',
                tpl: '<tpl for="."><div ext:qtip="{abreviaturaunidadmedida}" class="x-combo-list-item">{abreviaturaunidadmedida}</div></tpl>'
            },
            {
                type: 'listado',
                dataIndex: 'naturaleza',
                idcombo: 'filtroNaturaleza',
                urlcb: 'listarNaturaleza',
                idstore: 'stcbFiltroNaturaleza',
                valueFieldcb: 'naturaleza',
                displayFieldcb: 'denominacion',
                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
            },
            {
                type: 'numeric',
                dataIndex: 'economia'
            },
            {
                type: 'numeric',
                dataIndex: 'necesidad'
            },
            {
                type: 'numeric',
                dataIndex: 'demanda'
            },
            {
                type: 'numeric',
                dataIndex: 'precio'
            },
            {
                type: 'numeric',
                dataIndex: 'importe'
            },
            {
                type: 'numeric',
                dataIndex: 'importemlc'
            },
            {
                type: 'numeric',
                dataIndex: 'flete'
            },
            {
                type: 'numeric',
                dataIndex: 'contingencia'
            },
            {
                type: 'numeric',
                dataIndex: 'importefila'
            },
            {
                type: 'numeric',
                dataIndex: 'coberturaparcialestimada'
            },
            {
                type: 'numeric',
                dataIndex: 'coberturatotalestimada'
            },
            {
                type: 'numeric',
                dataIndex: 'rm'
            },
            {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: ['SI', 'NO']
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'viaadquisicion',
                idcombo: 'idviaadquisicionc',
                urlcb: 'cargarviaadquision',
                mode: 'remote',
                idstore: 'idstvia',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                autoload: false
            }, {
                type: 'string',
                dataIndex: 'organosatisface'
            }
        ]
    });
    //-----------------FIN DEL LOS FILTROS DEL GRID DEMANDA-------------------------------

    //-----------------SELECTION MODEL DEL GRID DEMANDA------------------------------------

    smgpDemanda = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, row, record) {
                abiilitarDesabilitarAprbDesap(sm, row, record);
            },
            rowdeselect: function (s, n, r) {
            }
        }
    });
    //-----------------FIN DEL SELECTIONMODEL DEL GRID DEMANDA-----------------------------

    //----------------GRID PANEL DEMANDA--------------------------------------------------
    gpDemanda = new Ext.grid.EditorGridPanel({
        store: stgpDemanda,
        height: 400,
        autoExpandColumn: 'expand',
        id: 'gpDemanda',
        cm: cmDemanda,
        autoExpandMin: 200,
        autoScroll: true,
        plugins: filtrosindicadores,
        sm: smgpDemanda,
        listeners: {
            validateedit: function (sm) {
                idajuste = sm.record.data.idajustedemanda;
                campo = sm.field;
                valor = sm.value;
                codigo = sm.record.data.codigo;
                denom = sm.record.data.denominacion;
                organo = sm.record.data.organosatisface;
                nropieza = sm.record.data.numeropieza;
                nec = sm.record.data.necesidad;
                pre = sm.record.data.precio;
                idind = sm.record.data.idindicador;
                identmod = sm.record.data.identidadmodelo;
                idejer = sm.record.data.idejercicio;
                idmodeloselect = CmbModelos.getValue();
                identidaddatosnomenclador = sm.record.data.identdatosnomenclador;
                ValidarOperacion(campo, valor, sm);
            },
            sortchange: function (gp, inf, e) {
                field = inf.field;
                direction = inf.direction;
                stgpDemanda.reload();
            },
            beforeedit: function (e) {
                fila = e.row;
                columna = e.column;
                if ((e.record.get('idaprobacion') > 1 && cmbComportamiento.getValue() == 2) || objci.acciones.rector) {
                    e.cancel = true;
                } else if ((e.record.get('idaprobacion') > 2 && cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true) || objci.acciones.rector) {
                    e.cancel = true;
                }
                if (e.field == 'coberturatotalestimada')
                    e.cancel = true;

                if (!gestionSegunEstEjercicioBM) {
                    e.cancel = true;
                } else {
                    e.cancel = false;
                }
            }
        },
        loadMask: {
            store: stgpDemanda
        },
        tbar: ['-', {
            xtype: 'checkbox',
            boxLabel: 'Global',
            id: 'chkglobalCB',
            listeners: {
                check: function (ck, t) {
                    stgpDemanda.reload();
                }
            }
        }, '-',
            {
                xtype: 'checkbox',
                disabled: true,
                boxLabel: 'Balancear',
                id: 'chkajustecb',
                listeners: {
                    check: function (ck, t) {
                        btnAprobTodos.hide();
                        btnDesTodos.hide();
                        btnAprob.hide();
                        btnDes.hide();

                        /* if(t){
                         btnAjustar.hide();
                         } else {
                         btnAjustar.show();
                         }*/

                        if (Ext.getCmp('chkajustecb') == 0) {
                            btnAjustar.disable();
                        }
                        if (cmbComportamiento.getValue() == 1) {
                            btnAjustar.enable();
                            if (objci.acciones.rector)
                                Ext.getCmp('btnAjustar').disable();
                        }
                        Ext.getCmp('tbcmbmodelo').enable();
                        if (CmbCentroBalance.getValue() && t == true) {
                            Ext.getCmp('cmbComportamiento').disable();
                            CmbModelos.clearValue();
                            stCmbModelo.removeAll();
                            stCmbModelo.reload();
                            tpDemanda.hide();
                            tpDemanda.collapse(true);
                            tpDemanda.disable();
                            pAux2.hide();
                            pAux2.collapse(true);
                            gpDemanda.getStore().removeAll();
                            cb = 1;
                            od = null;
                            editarcolumnas(1)
                            mostrarocultarcolumnas(0);
                            gpDemanda.getColumnModel().setHidden(6, false)
                            gpDemanda.getColumnModel().setHidden(7, false)
                            btnAprobTodos.enable();
                            btnDesTodos.enable();
                            btnGuardar.enable();
                        } else {
                            Ext.getCmp('cmbComportamiento').enable();
                            CmbModelos.enable();
                            CmbModelos.clearValue();
                            stCmbModelo.removeAll();
                            btnAjustar.disable();
                            pAux2.show();
                            pAux2.expand(true);
                            tpDemanda.show();
                            tpDemanda.enable();
                            tpDemanda.expand(true);
                            if (t == true) {
                                Ext.MessageBox.show({
                                    title: perfil.etiquetas.lbInformacion,
                                    buttons: Ext.MessageBox.OK,
                                    msg: perfil.etiquetas.msgDebeSeleccionarCB,
                                    icon: Ext.MessageBox.INFO
                                });
                            } else if (treeclick == 1) {
                                cb = null;
                                od = 1;
                                if (Ext.getCmp('cmbComportamiento').getValue() == 1) {
                                    cliccomport = 1;
                                } else {
                                    cliccomport = 0;
                                }
                                gpDemanda.getStore().removeAll();
                                if (identidadselected != CmbCentroBalance.getValue() && soyCB == true) {
                                    editarcolumnas(0)
                                }
                                if (Ext.getCmp('cmbComportamiento').getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == false) {
                                    editarcolumnas(0)
                                }
                            }
                            mostrarocultarcolumnas(1);
                            DesabilitarTodo();
                        }
                    }
                }
            }, '-', btnAprobTodos, '-', btnDesTodos, '-', btnAprob, '-', btnDes, '-', btnGuardar, '-', btnExportar, '-', cbaccionesDWH, '-', btnAjustar],
        bbar: new Ext.PagingToolbar({
            id: 'paginado1',
            pageSize: 20,
            store: stgpDemanda,
            displayInfo: true,
            items: ['-', btnLimpiarfil, '-', cbImportesBalance,
                '-', importeTotal/*, '-', btnAjustar*/]
        })

    });

    //------------------------FIN DEL GRID DEMANDA-----------------------------------------------
    //hacer focus en boton ayuda para que funcionen las teclas caliente desde 
    //la primera vez que cargue la interfaz
    gpDemanda.on('beforeshow', function () {

        Ext.getCmp('btnAyu').focus(true, 500);

    });

    treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'listarArbolEntidades',
        listeners: {
            load: function (options, node, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 21) {
                    mostrarMensaje(3, perfil.etiquetas.msgIndicadores);
                } else if (responseData.codMsg == 26) {
                    mostrarMensaje(3, perfil.etiquetas.msgOrganosdemandantes);
                } else
                    node.expand(true);
            },
            beforeload: function (tree, node, res) {
                tree.baseParams.valor = Ext.getCmp('idfiltroentidad').getValue();
            }

        }
    });

    tpDemanda = new Ext.tree.TreePanel({
        width: 190,
        height: 190,
        collapsible: false,
        collapsed: false,
        id: 'tpDemanda',
        useArrows: true,
        autoScroll: true,
        animate: true,
        disabled: true,
        loader: treeLoader,
        containerScroll: true,
        listeners: {
            click: function (n) {
                if (n.id != 0) {
                    treeclick = 1;
                    tpDemanda.getSelectionModel().select(n);
                    identidadselected = n.id;
                    entidadsel = n;
                    btnGraficas.actualizarParametros(n, 'BM');
                    denomentidadselected = n.text;
                    idmodelo = CmbModelos.getValue();
                    if (!objci.acciones.rector) {
                        btnAprobTodos.disable();
                        btnDesTodos.disable();
                        btnAprob.disable();
                        btnDes.disable();
                    }

                    stCmbModelo.reload();
                    CmbModelos.enable();
                    cbEjercicio.enable();
                    if (cmbComportamiento.getValue() == 2 || Ext.getCmp('chkajustecb').getValue() == true) {
                        editarcolumnas(1);
                    } else {
                        editarcolumnas(0);
                    }
                    gpDemanda.getStore().removeAll();
                    if (Ext.getCmp('cmbComportamiento').getValue() == 1 || rector == 1) {
                        cb = 1;
                        od = null;
                        cliccomport = 1;
                    } else if (Ext.getCmp('cmbComportamiento').getValue() == 2) {
                        cb = null;
                        od = 1;
                        cliccomport = 0;
                        gpDemanda.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20,
                                idmodel: idmodelo,
                                ident: identidadselected,
                                identiCB: CmbCentroBalance.getValue(),
                                identiLG: objci.identidad,
                                CB: cb,
                                OD: od,
                                todosCB: cliccomport,
                                rector: rector
                            }
                        });
                    }
                } else {
                    if (rector == 1) {
                        stCmbModelo.reload();
                        gpDemanda.getStore().removeAll();
                        cb = null;
                        od = null;
                        identidadselected = null;
                        entidadsel = null;
                        gpDemanda.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20,
                                idmodel: idmodelo,
                                ident: identidadselected,
                                identiCB: CmbCentroBalance.getValue(),
                                identiLG: objci.identidad,
                                rector: rector
                            }
                        });
                    } else {
                        if (smgpDemanda.getSelected())
                            abiilitarDesabilitarAprbDesap(smgpDemanda, smgpDemanda.selectRow(index), smgpDemanda.getSelected());
                    }
                }
                selectentidad = true;
            }
        },
        tbar: [{
            iconCls: 'icon-expand-all',
            tooltip: perfil.etiquetas.lbTtExpandirEntidades,
            icon: perfil.dirImg + 'expand-all.gif',
            handler: function () {
                tpDemanda.root.expand(true);
            }
        }, {
            iconCls: 'icon-collapse-all',
            tooltip: perfil.etiquetas.lbTtColapsarEntidades,
            icon: perfil.dirImg + 'collapse-all.gif',
            handler: function () {
                tpDemanda.root.collapse(true);
            }
        }, {
            iconCls: 'icon-collapse-all',
            tooltip: perfil.etiquetas.lbTtRefrescarEntidades,
            icon: perfil.dirImg + 'table_refresh.png',
            handler: function () {
                actualizararbolCB(tpDemanda);
            }
        }, '-', {
            xtype: 'textfield',
            emptyText: perfil.etiquetas.lbTtFiltrarEntidad,
            width: 110,
            id: 'idfiltroentidad',
            listeners: {
                specialkey: function (t, e) {
                    if (e.getKey() == '13') {
                        actualizararbolCB(tpDemanda);
                    }
                }
            }
        }],
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.lbEntidades,
            tipo: 0,
            id: '0'
        })
    });

    loadertpEstructuraCB = new Ext.tree.TreeLoader({
        dataUrl: 'ListarEntidades',
        listeners: {
            beforeload: function (tl, n) {
                this.baseParams = {
                    idEstructuraPadre: n.attributes.idEstructuraPadre,
                    valor: Ext.getCmp('idfiltroent').getValue()
                };
            }
        }
    });

    tpEstructuraCB = new Ext.tree.TreePanel({
        autoScroll: true,
        id: 'tpEstructuraCB',
        width: 190,
        height: 190,
        border: false,
        tbar: [{
            iconCls: 'icon-expand-all',
            tooltip: perfil.etiquetas.lbTtExpandirEntidades,
            icon: perfil.dirImg + 'expand-all.gif',
            handler: function () {
                tpEstructuraCB.root.expand(true);
            }
        }, {
            iconCls: 'icon-collapse-all',
            tooltip: perfil.etiquetas.lbTtColapsarEntidades,
            icon: perfil.dirImg + 'collapse-all.gif',
            handler: function () {
                tpEstructuraCB.root.collapse(true);
            }
        }, {
            iconCls: 'icon-collapse-all',
            tooltip: perfil.etiquetas.lbTtRefrescarEntidades,
            icon: perfil.dirImg + 'table_refresh.png',
            handler: function () {
                actualizararbolCB(tpEstructuraCB);
            }
        }, '-', {
            xtype: 'textfield',
            emptyText: perfil.etiquetas.lbTtFiltrarEntidad,
            width: 110,
            id: 'idfiltroent',
            listeners: {
                specialkey: function (t, e) {
                    if (e.getKey() == '13') {
                        actualizararbolCB(tpEstructuraCB);
                    }
                }
            }
        }],
        contextMenu: new Ext.menu.Menu({
            id: 'menu',
            items: [{
                id: 'btnconsolidar',
                icon: perfil.dirImg + 'ver.png',
                iconCls: 'btn',
                disabled: false,
                text: perfil.etiquetas.lbVerConsolidado,
                handler: function () {
                    gpDemanda.getStore().removeAll();
                    consolidado = 1;
                    gpDemanda.getStore().reload();
                }
            }, {
                id: 'btnverbalance',
                icon: perfil.dirImg + 'ver.png',
                iconCls: 'btn',
                disabled: false,
                text: perfil.etiquetas.lbVerBalance,
                handler: function () {
                    gpDemanda.getStore().removeAll();
                    consolidado = 0;
                    gpDemanda.getStore().reload();
                }
            }
            ]
        }),
        listeners: {
            contextmenu: function (node, e) {
                node.select();
                identidadselected = node.id;
                entidadsel = node;
                btnGraficas.actualizarParametros(node, 'BM');
                idEstructuraPadre = node.attributes.idEstructuraPadre;
                entidades_productoras = node.attributes.entidades_productoras;
                is_leaf = node.leaf;
                if (!is_leaf) {
                    var c = node.getOwnerTree().contextMenu;
                    c.contextNode = node;
                    c.showAt(e.getXY());
                }
            },
            click: function (n, e) {
                if (n.id != 0) {
                    btnGraficoPlanif.enable();
                } else {
                    btnGraficoPlanif.disable();
                }

                if (n.attributes.id != '900000235') {
                    cbEjercicio.enable();
                    gpDemanda.getStore().removeAll();
                    if (n.leaf) {
                        hoja = true;
                    } else {
                        hoja = false;
                    }
                    consolidado = 0;
                    if (objci.acciones.rector)
                        Ext.getCmp('btnAjustar').disable();
                    identidadselected = n.id;
                    entidadsel = n;
                    btnGraficas.actualizarParametros(n, 'BM');
                    denomentidadselected = n.text;
                    CmbModelos.enable();

                    if (Ext.getCmp('cmbComportamiento').getValue() == 2) {
                        cb = null;
                        od = 1;
                    } else {
                        cb = 1;
                        od = null;
                    }

                    CmbModelos.clearValue();
                    stCmbModelo.reload();
                    if (CmbModelos.getValue()) {
                        cliccomport = 0;
                        gpDemanda.getStore().reload({
                            params: {
                                start: 0,
                                limit: 20,
                                idmodel: idmodelo,
                                ident: identidadselected,
                                identiCB: CmbCentroBalance.getValue(),
                                identiLG: objci.identidad,
                                CB: cb,
                                OD: od,
                                todosCB: cliccomport,
                                rector: rector
                            }
                        });
                    }
                    selectentidad = true;
                } else {
                    cbEjercicio.disable();
                    stgpDemanda.removeAll();
                    CmbModelos.disable();
                    CmbModelos.clearValue();
                    cmbComportamiento.disable();
                }
            }
        },
        loader: loadertpEstructuraCB,
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.lbEconomia,
            tipo: 0,
            expanded: true,
            id: '0'
        })
    });

    /*tpEstructuraCB = new Ext.estructura.panel.PanelEstructura(
     {
     cargos: false,
     menu: false,
     width: 600
     });

     tpEstructuraCB.btnBuscar.setText("");
     tpEstructuraCB.btnLimpiar.setText("");
     tpEstructuraCB = tpEstructuraCB.items.items[0];
     tpEstructuraCB.getRootNode().expand();
     tpEstructuraCB.region = 'west';
     tpEstructuraCB.addListener('click', function(n) {

     if (n.text != "Estructuras") {

     if (n.id != 0) {
     btnGraficoPlanif.enable();
     } else {
     btnGraficoPlanif.disable();
     }

     if (n.attributes.id != '900000235') {
     cbEjercicio.enable();
     gpDemanda.getStore().removeAll();
     if (n.leaf) {
     hoja = true;
     } else {
     hoja = false;
     }
     consolidado = 0;
     if (objci.acciones.rector)
     Ext.getCmp('btnAjustar').disable();
     identidadselected = n.id;
     entidadsel = n;
     btnGraficas.actualizarParametros(n, 'BM');
     denomentidadselected = n.text;
     CmbModelos.enable();

     if (Ext.getCmp('cmbComportamiento').getValue() == 2) {
     cb = null;
     od = 1;
     } else {
     cb = 1;
     od = null;
     }

     CmbModelos.clearValue();
     stCmbModelo.reload();
     if (CmbModelos.getValue()) {
     cliccomport = 0;
     gpDemanda.getStore().reload({
     params: {
     start: 0,
     limit: 20,
     idmodel: idmodelo,
     ident: identidadselected,
     identiCB: CmbCentroBalance.getValue(),
     identiLG: objci.identidad,
     CB: cb,
     OD: od,
     todosCB: cliccomport,
     rector: rector
     }
     });
     }
     selectentidad = true;
     } else {
     cbEjercicio.disable();
     stgpDemanda.removeAll();
     CmbModelos.disable();
     CmbModelos.clearValue();
     cmbComportamiento.disable();
     }
     }else{

     }
     });*/

    tbarBotones = [
        {
            xtype: 'tbtext',
            text: perfil.etiquetas.lbPlanes + ":"
        },
        CmbModelos, '-',
        {
            xtype: 'tbtext',
            text: perfil.etiquetas.lbComportamiento + ":"
        }, cmbComportamiento, '-', {
            xtype: 'tbtext',
            id: 'idcentro',
            text: perfil.etiquetas.lbCentrosBalance + ":"
        },
        CmbCentroBalance
        , '-', {xtype: 'tbtext', text: 'Ejercicio:'}, cbEjercicio, '-', btnGraficoPlanif, '-',
        '->', btnAyudaDemanda];

    pAux1 = new Ext.Panel({
        title: perfil.etiquetas.lbDemanda,
        id: 'pAux1',
        region: 'center',
        layout: 'fit',
        width: 100,
        frame: true,
        items: [gpDemanda],
        tbar: tbarBotones
    });

    pAux2 = new Ext.Panel({
        title: perfil.etiquetas.lbEntidades,
        id: 'pAux2',
        region: 'west',
        layout: 'card',
        width: 200,
        height: 200,
        activeItem: 0,
        items: [tpEstructuraCB, tpDemanda]
    });

    PanelCemtroBalance = new Ext.Panel({
        layout: 'border',
        margins: '0 0 5 5',
        cmargins: '0 5 5 5',
        width: 800,
        height: 600,
        items: [pAux2, pAux1]
    })


    vpCentroBalance = new Ext.Viewport({
        layout: 'fit',
        id: 'vpCentrobalance',
        items: [PanelCemtroBalance],
        listeners: {
            'afterlayout': function () {
                Ext.getCmp('btnAyuBalanceMaterial').focus();
            }

        }
    });

    //    Estos son los botones del menu derecho
    //    que solo se activaran cuando se trate de una entidad
    //    donde las entidades padres planifiquen
    Ext.getCmp('btnconsolidar').hide();
    Ext.getCmp('btnverbalance').hide();
}// fin de cargar interfaz

//--------------------Funciones
function AprobarDesaprobarDemanda(valor) {
    arrInd = [];

    smgpDemanda.each(function (r) {
        obj = {
            idindicador: r.id,
            idajusteexsitencia: r.data.idajusteexistencia,
            idajusteexistenciaod: r.data.idajusteexistenciaod,
            idajusteexistenciacb: r.data.idajusteexistenciacb,
            identidadmodelo: r.data.identidadmodelo,
            idcentrobalance: r.data.idcentrobalance,
            identidad: r.data.identidad
        };
        arrInd.push(obj);
    })

    if (cmbComportamiento.getValue() == 2) {
        var Odemandante = 1;
        var Cbalance = null;
    } else {
        Odemandante = null;
        Cbalance = 1;
    }
    if (valor == 1) {
        var accion = 'Aprobados';
        if (cmbComportamiento.getValue() == 2 && !objci.acciones.rector) {
            val = 2;
        } else if (cmbComportamiento.getValue() == 1 && !objci.acciones.rector) {
            val = 3;
        } else if (rector == 1) {
            val = 4;
        }
    } else if (valor == 0) {
        accion = 'Desaprobados';
        if (cmbComportamiento.getValue() == 2 && !objci.acciones.rector) {
            val = 1;
        } else if (cmbComportamiento.getValue() == 1 && !objci.acciones.rector) {
            val = 1;
        } else if (rector == 1) {
            val = 1;
        }
    }
    var sepuede = 1;
    if (smgpDemanda.getCount() > 1) {
        for (var i = 0; i < smgpDemanda.getCount(); i++) {
            if (valor == 1 && cmbComportamiento.getValue() == 2 && !objci.acciones.rector) {
                if (smgpDemanda.getSelections()[i].data.idaprobacion >= 2) {
                    sepuede = 0;
                }
            } else if (valor == 1 && cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb') == true && !objci.acciones.rector) {
                if (smgpDemanda.getSelections()[i].data.idaprobacion >= 3) {
                    sepuede = 0;
                }
            } else if (valor == 1 && rector == 1) {
                if (smgpDemanda.getSelections()[i].data.idaprobacion >= 4) {
                    sepuede = 0;
                }
            }
            if (valor == 0 && cmbComportamiento.getValue() == 2 && !objci.acciones.rector) {
                if (smgpDemanda.getSelections()[i].data.idaprobacion <= 1) {
                    sepuede = 0;
                }
            } else if (valor == 0 && cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb') == true && !objci.acciones.rector) {
                if (smgpDemanda.getSelections()[i].data.idaprobacion <= 2) {
                    sepuede = 0;
                }

            } else if (valor == 0 && rector == 1) {
                if (smgpDemanda.getSelections()[i].data.idaprobacion <= 3) {
                    sepuede = 0;
                }
            }
        }
    }
    if (sepuede == 1) {
        Ext.Ajax.request({
            url: 'AprobarDesaprobarDemandaPorIndicador',
            params: {
                ind: Ext.encode(arrInd),
                rector: rector,
                cb: Cbalance,
                od: Odemandante,
                idmodel: idmodelo,
                identidadsel: identidadselected,
                ajustar: (Ext.getCmp('chkajustecb').getValue() == true) ? true : false,
                identiLG: objci.identidad,
                idaprobacion: val,
                idcmbCB: CmbCentroBalance.getValue(),
                todos: apTodos,
                aprobado: valor
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 24) {
                    mostrarMensaje(1, perfil.etiquetas.msgDemandaAproCorrecto);
                }
                if (responseData.codMsg == 25) {
                    mostrarMensaje(1, perfil.etiquetas.msgDemandaDesCorrecto);
                }
                apTodos = 0;
            }
        });
        gpDemanda.getStore().reload();
        smgpDemanda.clearSelections();
    } else {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbInformacion,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgSeleccionadosEstan + accion + '.',
            icon: Ext.MessageBox.INFO
        });
    }
}

function dosdecimales(val) {
    return parseFloat(val).toFixed(3);
}

function seisdecimales(val) {
    return parseFloat(val).toFixed(6);
}

ActualizarCampos = function () {
    var editadas = stgpDemanda.getModifiedRecords();
    var arreglo = [];

    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();
        if (record.data['coberturaparcialestimada'] >= 0) {
            rec['idajusteexistencia'] = record.data['idajusteexistencia'];
            rec['coberturaparcialestimada'] = record.data['coberturaparcialestimada'];
            rec['idajusteexistenciaod'] = record.data['idajusteexistenciaod'];
            rec['idajusteexistenciacb'] = record.data['idajusteexistenciacb'];
            rec['identidadmodelo'] = record.data['identidadmodelo'];
            rec['idindicador'] = record.data['idindicador'];
            rec['idmodelo'] = record.data['idmodelo'];
            rec['identidad'] = record.data['identidad'];
            rec['idodcte'] = record.data['idodcte'];
            rec['necesidad'] = record.data['necesidad'];
            arreglo.push(rec);
        }
    }
    editado = true;
    if (od == 1 && !cb)
        identidad = identidadselected;
    else
        identidad = objci.identidad;

    Ext.Ajax.request({
        url: 'ActualizarCampos',
        timeout: 3200000, //1 hora
        params: {
            identiLG: identidad,
            idmodelo: CmbModelos.getValue(),
            array: Ext.encode(arreglo),
            od: od,
            cb: cb,
            idejercicio: cbEjercicio.getValue()

        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            r = smgpDemanda.getSelected();
            if (responseData.codMsg == 21) {
                mostrarMensaje(1, perfil.etiquetas.msgCorrecto);
            } else if (responseData.codMsg == 23) {
                mostrarMensaje(1, perfil.etiquetas.msgDemandaIncorrecta);
                smgpDemanda.cancel = true;
            } else if (responseData.codMsg == 28) {
                mostrarMensaje(3, perfil.etiquetas.msgCoberturaIncorrecta);
            } else if (responseData.codMsg == 29) {
                mostrarMensaje(1, perfil.etiquetas.msgEconomiaIncorrecta);
            } else if (responseData.codMsg == 30) {
                mostrarMensaje(3, perfil.etiquetas.msgReservaIncorrecta);
            } else if (responseData.codMsg == 31) {
                mostrarMensaje(3, perfil.etiquetas.msgAnanegIncorrecta);
            } else if (responseData.codMsg == 32) {
                mostrarMensaje(3, perfil.etiquetas.msgAnaposIncorrecta);
            } else if (responseData.codMsg == 34) {
                mostrarMensaje(3, perfil.etiquetas.msgNecesidadNula);
            }
            gpDemanda.getStore().reload();
            smgpDemanda.clearSelections();
        }
    });
}

function ColumnaAprobacionBalance(val, m) {
    if (val < 2) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo';
        //return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbRector + '"';
        m.css = 'icondistra-true verde';
        //return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
    } else if (val == 3) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        return '<span><img src=' + perfil.dirImg + 'yes.png' + '>';
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true azul';
        //return '<span><img src=' + perfil.dirImg + 'yes(azul).png' + '>';
    }
}

function configurarColoresCeldas() {
    for (var i = 0; i < gpDemanda.getStore().getCount(); i++) {
        if (gpDemanda.getStore().getAt(i).get('idaprobacionpla') > 2) {
            Ext.get(gpDemanda.getView().getRow(i)).removeClass('fila-aprobada2');
            Ext.get(gpDemanda.getView().getRow(i)).removeClass('fila-aprobada3');
            if (gpDemanda.getStore().getAt(i).get('idaprobacionpla') == 3)
                Ext.get(gpDemanda.getView().getRow(i)).addClass('fila-aprobada3');
            if (gpDemanda.getStore().getAt(i).get('idaprobacionpla') == 4)
                Ext.get(gpDemanda.getView().getRow(i)).addClass('fila-aprobada2');
        }
    }
}

function upColorCellCB() {
    for (var i = 0; i < stgpDemanda.getCount(); i++) {
        for (var j = 0; j < 12; j++) {
            if (stgpDemanda.getAt(i).data.idaprobaciondemanda == 3) {
                Ext.get(gpDemanda.getView().getCell(i, j)).applyStyles('background-color:#ffcc99');
            }
            if (stgpDemanda.getAt(i).data.idaprobaciondemanda == 4) {
                Ext.get(gpDemanda.getView().getCell(i, j)).applyStyles('background-color:#ccffcc');
            }
        }
    }
}

function modificarEstado(val) {
    if (val == null)
        return 0;
    return val;
}

function modificarEstado1(val) {
    if (val == null)
        return 0;
    return val;
}

function abiilitarDesabilitarAprbDesap(sm, row, record) {
    if (sm.getCount() == 1) {
        if ((record.data.idaprobacion >= 2 && record.data.idaprobacion < 3) && cmbComportamiento.getValue() == 2) {
            btnAprob.disable();
            btnDes.enable();
        } else if ((record.data.idaprobacion < 2) && cmbComportamiento.getValue() == 2) {
            btnAprob.enable();
            btnDes.disable();
        }
        if ((cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true) && (record.data.idaprobacion > 2 && record.data.idaprobacion < 4)) {
            btnAprob.disable();
            btnDes.enable();
        } else if ((cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true) && (record.data.idaprobacion < 3)) {
            btnAprob.enable();
            btnDes.disable();
        }
        if (rector == 1 && record.data.idaprobacion == 4) {
            btnAprob.disable();
            btnDes.enable();
        } else if (rector == 1 && record.data.idaprobacion < 4) {
            btnAprob.enable();
            btnDes.disable();
        }
    } else {
        btnAprob.enable();
        btnDes.enable();
    }
}

function DesabilitarTodo() {
    btnDes.disable();
    btnAprob.disable();
    btnDesTodos.disable();
    btnAprobTodos.disable();
    btnGuardar.disable();
}

function ValidarOperacion(campo, valor, sm) {
    if ((campo == 'coberturaparcialestimada' && (valor > parseFloat(sm.record.data.necesidad))) ||
        (campo == 'coberturaparcialestimada' && (valor > parseFloat(sm.record.data.coberturatotalestimada))) ||
        (campo == 'reservaministerial' && (valor > parseFloat(sm.record.data.necesidad))) ||
        (campo == 'cantidadeconomia' && (valor > parseFloat(sm.record.data.necesidad)))) {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbInformacion,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgEconomiaIncorrecta,
            icon: Ext.MessageBox.INFO
        });
        sm.cancel = true;
    }
}

function ImporteTotal(valor) {
    if (valor) {
        importeTotal.setValue(valor);
    }
}

function limpiarfiltrosCB() {
    if (gpDemanda.getStore().getCount() >= 0) {
        filtrosindicadores.clearFilters();
    } else {
        Ext.MessageBox.show({
            title: perfil.etiquetas.lbInformacion,
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgNoExistenElementos,
            icon: Ext.MessageBox.INFO
        });
    }
}

function editarcolumnas(val) {
    if (val == 1) {
        gpDemanda.getColumnModel().setEditable(4, true);
        gpDemanda.getColumnModel().setEditable(5, true);
        gpDemanda.getColumnModel().setEditable(6, true);
        gpDemanda.getColumnModel().setEditable(7, true);
        gpDemanda.getColumnModel().setEditable(8, true);
    } else {
        gpDemanda.getColumnModel().setEditable(4, false);
        gpDemanda.getColumnModel().setEditable(5, false);
        gpDemanda.getColumnModel().setEditable(6, false);
        gpDemanda.getColumnModel().setEditable(7, false);
        gpDemanda.getColumnModel().setEditable(8, false);
    }
}

function filtrosbalance() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadores.getFiltrosActivos() == undefined || filtrosindicadores.getFiltrosActivos().length == 0) {
        pAux1.setTitle('Demandas ' + comportamiento);
    } else {
        for (i = 0; i < filtrosindicadores.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "codigo") {//
                aux = 'código';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "numeropieza") {//
                aux = 'no pieza';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = 'denominación';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "naturaleza") {
                aux = 'naturaleza';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denominacioncb") {
                aux = 'centro de balance';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "unidadmedida") {
                aux = 'unidad de medida';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "necesidad") {
                aux = 'necesidad';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "coberturaparcialestimada") {
                aux = 'CTE';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "demanda") {
                aux = 'demanda';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = 'precio';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = 'importe';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = 'aprobado';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "organosatisface") {//
                aux = 'organosatisface';
            }
            if (i == filtrosindicadores.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        pAux1.setTitle('Demanda ' + comportamiento + 'filtrados por  : ' + filtrado_por);
        filtrado_por = "";
    }
}

function mostrarocultarcolumnas(val) {
    if (val == 1) {
        gpDemanda.getColumnModel().setHidden(3, true)
        gpDemanda.getColumnModel().setHidden(9, true)
        gpDemanda.getColumnModel().setHidden(10, true)

    } else {
        gpDemanda.getColumnModel().setHidden(3, true)
        gpDemanda.getColumnModel().setHidden(9, true)
        gpDemanda.getColumnModel().setHidden(10, true)
    }
}

function actualizararbolCB(arbol, valor) {
    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
                params: {
                    valor: valor
                }
            });
        }
    } else
        arbol.root.reload({
            params: {
                valor: valor
            }
        });
}
//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyudaBalanceMaterial;
//    var referencia = 'balance2 ';
//    help.show(title, referencia);
//}

confAjuste = function () {
    mostrarMensaje(2, perfil.etiquetas.msgConfirmarAjuste, Ajuste);
    function eliminarCalculos(btnPresionado) {
        if (btnPresionado == 'ok') {
            operacion = 'eliminar';
            generarCalculos();
        }
    }
}

function Ajuste(btnPresionado) {
    if (btnPresionado == 'ok') {
        if (cmbComportamiento.getValue() == 2 || (cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true)) {
            Planificacion.mostrarMascara('mask_up_planes', perfil.etiquetas.lbEspere, 'Ajustando indicador(es)');
            Ext.Ajax.request({
                url: 'ajustarPlanesOrdenPrioridad',
                params: {
                    identidad: cmbComportamiento.getValue() == 2 ? identidadselected : CmbCentroBalance.getValue(),
                    comportamiento: cmbComportamiento.getValue() == 2 ? 0 : 1,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function (options, success, response) {
                    Planificacion.ocultarMascara('mask_up_planes');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 21) {
                        mostrarMensaje(1, perfil.etiquetas.msgAjusteRealizado);
                        gpDemanda.getStore().reload();
                    }
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(3, responseData.mensaje);
                    }
                }

            });
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgErrorAjustarSoloCuandoOD, function () {
                gpDemanda.getStore().reload();
                return;
            });
        }
    }
}

function actualizarDemandaHijos(btnPresionado) {
    if (btnPresionado == 'ok') {
        if (cmbComportamiento.getValue() == 2 || (cmbComportamiento.getValue() == 1 && Ext.getCmp('chkajustecb').getValue() == true)) {
            Planificacion.mostrarMascara('mask_up_cálculos', perfil.etiquetas.lbEspere, 'Actualizando los cálculos');
            Ext.Ajax.request({
                url: 'actualizarCalculosDemandaHijos',
                params: {
                    identidad: cmbComportamiento.getValue() == 2 ? identidadselected : CmbCentroBalance.getValue(),
                    comportamiento: cmbComportamiento.getValue() == 2 ? 0 : 1,
                    idmodelo: idmodelo
                },
                callback: function (options, success, response) {
                    Planificacion.ocultarMascara('mask_up_cálculos');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 21) {
                        mostrarMensaje(1, perfil.etiquetas.msgCalculosActualizados, function () {
                            gpDemanda.getStore().reload();
                            return;
                        });
                    }
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(3, responseData.mensaje);
                    }
                }
            });
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgErrorActualizarSoloCuandoOD, function () {
                gpDemanda.getStore().reload();
                return;
            });
        }
    }
}

function setLosImportes() {
    importes = [];
    importes.push('0.000'); //indice 0
    importes.push('0.000'); //indice 1 TOTAL
    importes.push('0.000'); //indice 2 MN
    importes.push('0.000'); //indice 3 MLC
    importes.push('0.000'); //indice 4 IFlete
    importes.push('0.000'); //indice 5 IContingencia
    importes.push('0.000'); //indice 6 Inecesidad
    importes.push('0.000'); //indice 7 Iajustado
}

function calcularLosImportes(st) {
    setLosImportes();
    if (st.getCount() > 0) {
        importes[1] = st.reader.jsonData.importetotal;
        importes[2] = st.reader.jsonData.importemn;
        importes[3] = st.reader.jsonData.importemlc;
        importes[4] = st.reader.jsonData.importeflete;
        importes[5] = st.reader.jsonData.importecontingencia;
        importes[6] = st.reader.jsonData.importenecesidad;
        importes[7] = st.reader.jsonData.importeajustado;
        importeTotal.setValue(importes[cbImportesBalance.getValue()]);
    } else {
        importeTotal.setValue(importes[0]);
    }
}

function gestionarPermiso() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue()
        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            mymask.hide();
            if (responseData.data.length == 0) {
                btnGuardar.hide();
            } else {
                if (responseData.data[0].guardar != '1') {
                    btnGuardar.hide();
                } else {
                    if (!objci.acciones.rector)
                        btnGuardar.show();
                }
            }
            btnGuardar.show();
        }
    });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function siexistecolumFiltrada() {
    if (filtrosindicadores.getFiltrosActivos().length > 0 && stgpDemanda.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgNoExistenDatosParaBusqueda);
}

function deshabilitarSegunEstadoDelEjercicio(accion) {
    if (accion) {
        btnDes.enable();
        btnAprob.enable();
        btnDesTodos.enable();
        btnAprobTodos.enable();
        btnGuardar.enable();
        btnAjustar.enable();
        gestionSegunEstEjercicioBM = true;
    } else {
        btnDes.disable();
        btnAprob.disable();
        btnDesTodos.disable();
        btnAprobTodos.disable();
        btnGuardar.disable();
        btnAjustar.disable();
        gestionSegunEstEjercicioBM = false;
    }
}
