/*
 * Movimiento de personas.
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Fuerzatrabajo
 * @uses Pvd.Fuerzatrabajo.Movimientoslaborales
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Fuerzatrabajo.Movimientoslaborales');

Pvd.Fuerzatrabajo.Movimientoslaborales.Controlador = {
    init: function (idioma, vista, modelo) {
        let ids = [];
        let buscar = true;
        let acmn = 1;
        let traslado = false;
        seleccioneCompletamiento();
        modelo.stTipoContrato.load();
        modelo.stProcedenciaSocial.load();
        modelo.stModalidadEmpleo.load();
        Ext.getCmp('datosprincipales').on('click', function () {
            modelo.stAprobado.load();
            modelo.stElaborado.load();
        });

        vista.btnCancelarF.on('click', function () {
            vista.wdFirmas.hide();
        });

        let tiponodoestructura, reload, reloadH, altashow, bajashow, movshow, sit = 0;
        let accion, entidad, ueb = '';
        let arrayidestr = [];
        let idnode = -1;
        let node, personaselect, identidad, idarea, idespcargo;
        var objseleccionadas = new Array();

        vista.tpEstructura.tree.getTopToolbar().add(vista.btnSyncCargos);
        vista.tpEstructura.tree.getTopToolbar().add(' ');
        vista.tpEstructura.tree.getTopToolbar().add(vista.busquedaDisponibilidad);

        vista.gpPersonas.on('rowdblclick', function () {
            mostrarFichaPersona(personaselect.idpersona);
        });

        vista.pPersonasHistorico.gpPersonasHistorico.on('rowdblclick', function () {
            let idpf = vista.pPersonasHistorico.gpPersonasHistorico.getSelectionModel().getSelected().data.idpersona;
            mostrarFichaPersona(idpf);
        });

        vista.pProblemasDetectados.gpProblemas.on('rowdblclick', function () {
            let idpf = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data.idpersona;
            mostrarFichaPersona(idpf);
        });

        /*----------  Trabajo con el árbol de estructuras  ----------*/
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            //cargandoCompletamiento();
            //getCompletamiento((node.attributes.idconcepto) ? node.attributes.idconcepto : node.attributes.idtipo, node.attributes.id);
            vista.tpEstructura.tree.getSelectionModel().select(node);
            vista.sfBuscar.enable();
            let idc = node.attributes.idconcepto;
            let idt = node.attributes.idtipo;
            if ((idc == 3 || idc == 1 || idc == 4) || (idt == 3 || idt == 1 || idt == 4)) {
                tiponodoestructura = 1;
            }
            Ext.getCmp('altasbajas').enable();
            Ext.getCmp('idbtnanexo3').enable();
            Ext.getCmp('idbtnanexo1').enable();
            Ext.getCmp('idbtnModelo520501').enable();
            Ext.getCmp('idbtnModelo520106').enable();
            Ext.getCmp('idbtnModelo520205').enable();
            Ext.getCmp('datosprincipales').enable();
            vista.btnDocumentos.enable();
            idnode = node.id;
            modelo.stPersonas.baseParams.idcargo = '';
            modelo.stPersonas.baseParams.arrayEst = null;
            modelo.stPersonas.baseParams.alta = null;
            modelo.stPersonas.baseParams = {idestructura: node.attributes.id};
            if (tiponodoestructura == 1) {
                modelo.stPersonas.baseParams.idconcepto = 3;
            } else {
                modelo.stPersonas.baseParams.idconcepto = null;
            }
            //modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            buscar = false;
        });

        vista.tpEstructura.tree.on('click', function (n) {
            Ext.getCmp('idbtnbtnReporteMovimientonomina').disable();
            if (vista.gpPersonas.store.id !== 'stpers1') {
                vista.gpPersonas.store.removeAll();
                vista.gpPersonas.reconfigure(modelo.stPersonas, vista.columnasgp);
                vista.gpPersonas.doLayout();
            }
            cargandoCompletamiento();
            getCompletamiento((n.attributes.idconcepto) ? n.attributes.idconcepto : n.attributes.idtipo, n.attributes.id);
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
            Ext.getCmp('btnListadoFunciones').disable();
            vista.btnBaja.disable();
            vista.btnMovimiento.disable();
            vista.btnVer.disable();
            vista.btnBuscarPorCriterios.hide();
            vista.sfBuscar.show();
            vista.lbBuscarPers.show();
            vista.sfBuscar.enable();
            accion = '';
            node = n;
            if (n.attributes.idconcepto == 7) {
                vista.pPersonasHistorico.btnExportarHist.disable();
                vista.btnExportarFT.disable();
                vista.btnSyncCargos.disable();
                Ext.getCmp('altasbajas').disable();
                Ext.getCmp('idbtnanexo3').disable();
                Ext.getCmp('idbtnanexo1').disable();
                Ext.getCmp('idbtnModelo520501').disable();
                Ext.getCmp('idbtnModelo520106').disable();
                Ext.getCmp('idbtnModelo520205').disable();
                Ext.getCmp('datosprincipales').disable();
                vista.btnAlta.enable();
                tiponodoestructura = 0;
                modelo.stPersonas.baseParams.idestructura = '';
                modelo.stPersonas.baseParams.arrayEst = null;
                modelo.stPersonas.baseParams.alta = null;
                modelo.stPersonas.baseParams = {idcargo: n.attributes.id};
                vista.pPersonasHistorico.stPersonasHistorico.baseParams.idestructura = '';
                vista.pPersonasHistorico.stPersonasHistorico.baseParams = {idcargo: node.attributes.id};
            } else {
                vista.pPersonasHistorico.btnExportarHist.enable();
                vista.btnExportarFT.enable();
                let idc = n.attributes.idconcepto;
                let idt = n.attributes.idtipo;
                if ((idc == 3 || idc == 1 || idc == 4) || (idt == 3 || idt == 1 || idt == 4)) {
                    tiponodoestructura = 1;
                } else {
                    tiponodoestructura = 0;
                    vista.btnAlta.disable();
                }
                vista.btnSyncCargos.enable();
                Ext.getCmp('altasbajas').enable();
                Ext.getCmp('idbtnanexo3').enable();
                Ext.getCmp('idbtnanexo1').enable();
                Ext.getCmp('idbtnModelo520501').enable();
                Ext.getCmp('idbtnModelo520106').enable();
                Ext.getCmp('idbtnModelo520205').enable();
                Ext.getCmp('datosprincipales').enable();
                vista.btnDocumentos.enable();
                idnode = n.id;
                modelo.stPersonas.baseParams.idcargo = '';
                modelo.stPersonas.baseParams.arrayEst = null;
                modelo.stPersonas.baseParams.alta = null;
                modelo.stPersonas.baseParams = {idestructura: n.attributes.id};
                vista.pPersonasHistorico.stPersonasHistorico.baseParams.idcargo = '';
                vista.pPersonasHistorico.stPersonasHistorico.baseParams = {idestructura: node.attributes.id};
            }
            if (vista.tabPanel.getActiveTab().id == 'actual') {
                modelo.stPersonas.removeAll();
                if (tiponodoestructura == 1) {
                    modelo.stPersonas.baseParams.idconcepto = 3;
                } else {
                    modelo.stPersonas.baseParams.idconcepto = null;
                }
                if (reload == 1) {
                    modelo.stPersonas.load({
                        params: {
                            start: 0,
                            limit: modelo.stPersonas.lastOptions.params.limit,
                            query: vista.sfBuscar.getValue()
                        }
                    });
                } else {
                    modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
                }
                buscar = false;
            } else if (vista.tabPanel.getActiveTab().id == 'historico') {
                vista.pPersonasHistorico.stPersonasHistorico.removeAll();
                if (tiponodoestructura == 1) {
                    vista.pPersonasHistorico.stPersonasHistorico.baseParams.idconcepto = 3;
                } else {
                    vista.pPersonasHistorico.stPersonasHistorico.baseParams.idconcepto = null;
                }
                if (reloadH == 1) {
                    vista.pPersonasHistorico.stPersonasHistorico.load({
                        params: {
                            query: vista.pPersonasHistorico.sfBuscarHistorico.getValue(),
                            desde: vista.pPersonasHistorico.dfFInicioBuscar.getRawValue(),
                            hasta: vista.pPersonasHistorico.dfFFinBuscar.getRawValue(),
                            estado: vista.pPersonasHistorico.cbEstado.getValue(),
                            motivo: vista.pPersonasHistorico.tcbMotivo.getValue(),
                            start: 0,
                            limit: vista.pPersonasHistorico.stPersonasHistorico.lastOptions.params.limit
                        }
                    });
                } else {
                    vista.pPersonasHistorico.stPersonasHistorico.load(
                            {
                                params: {
                                    query: vista.pPersonasHistorico.sfBuscarHistorico.getValue(),
                                    desde: vista.pPersonasHistorico.dfFInicioBuscar.getRawValue(),
                                    hasta: vista.pPersonasHistorico.dfFFinBuscar.getRawValue(),
                                    estado: vista.pPersonasHistorico.cbEstado.getValue(),
                                    motivo: vista.pPersonasHistorico.tcbMotivo.getValue(),
                                    start: 0,
                                    limit: 15
                                }
                            });
                }
            }
            vista.tabPanel.enable();
        });
        let forzar = 0;
        let altamod, numidmod, nombremod, papelmod, sapelmod;
        vista.btnAlta.on('click', function () {
            if (vista.gpPersonas.store.id !== 'stpers1') {
                vista.gpPersonas.store.removeAll();
                vista.gpPersonas.reconfigure(modelo.stPersonas, vista.columnasgp);
            }
            vista.pPersonas.doLayout();
            idarea = node.parentNode.id;
            //Buscar entidad
            Ext.getBody().mask('Por favor espere. Cargando datos...');
            Ext.Ajax.request({
                url: 'getEntidadByCargo',
                params: {idcargo: node.id},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    if (responseData.length > 0) {
                        entidad = responseData[0];
                        vista.tfEntidad.setValue(entidad.denominacion);
                        identidad = responseData[0].idestructura;
                        Ext.Ajax.request({
                            url: 'dameConfiguracionEstructura',
                            params: {identidad: identidad},
                            success: function (r) {
                                let responseData = Ext.decode(r.responseText);
                                ueb = null;
                                if (responseData.length > 0 && tiponodoestructura == 0) {
                                    let nodeact = node;
                                    let posible_ueb;
                                    while (nodeact.isRoot !== true && (nodeact.attributes._parent !== nodeact.id || nodeact.attributes.idpadre !== nodeact.id)) {
                                        if (nodeact.attributes.idconcepto == 5 || nodeact.attributes.idtipo == 5) {
                                            posible_ueb = nodeact;
                                            for (i = 0; i < responseData.length; i++) {
                                                if (responseData[i].idestructura == posible_ueb.id) {
                                                    ueb = posible_ueb.id;
                                                    break;
                                                }
                                            }
                                        }
                                        nodeact = nodeact.parentNode;
                                    }
                                }
                                if (parseInt(node.attributes.cantidad) <= parseInt(node.attributes.cantidad_real)) {
                                    let temporal = vista.tpEstructura.dameSeleccion().attributes.temporal;
                                    if (temporal != 1) {
                                        mostrarMensaje(2, idioma.msgNoCapacidad, function (btnPress) {
                                            if (btnPress == 'ok') {
                                                vista.fpAlta.getForm().reset();
                                                vista.tafunciones.setValue();
                                                forzar = 1;
                                                accion = 'add';
                                                let winBuscarPersona = new Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona({
                                                    title: 'Buscar persona',
                                                    constrain: true,
                                                    modal: true,
                                                    closeAction: 'close',
                                                    idioma: idioma,
                                                    modelo: modelo
                                                });
                                                winBuscarPersona.show();
                                                winBuscarPersona.on('critbusqaceptado', function (numid, nombre, papel, sapel, tipoFiltro) {
                                                    vista.btnBuscarPorCriterios.show();
                                                    vista.sfBuscar.hide();
                                                    vista.lbBuscarPers.hide();
                                                    vista.fpAlta.getForm().reset();
                                                    vista.tafunciones.setValue();
                                                    modelo.stPersonas.baseParams.idestructura = '';
                                                    modelo.stPersonas.baseParams.idcargo = node.id;
                                                    modelo.stPersonas.baseParams.arrayEst = Ext.encode(arrayidestr);
                                                    modelo.stPersonas.baseParams.alta = tipoFiltro;
                                                    modelo.stPersonas.removeAll();
                                                    modelo.stPersonas.load({
                                                        params: {
                                                            start: 0,
                                                            limit: 15,
                                                            numid: numid,
                                                            nombre: nombre,
                                                            papel: papel,
                                                            sapel: sapel
                                                        }
                                                    });
                                                    buscar = true;
                                                    vista.btnAlta.disable();
                                                    forzar = 1;
                                                    accion = 'add';
                                                    altamod = tipoFiltro;
                                                    numidmod = numid;
                                                    nombremod = nombre;
                                                    papelmod = papel;
                                                    sapelmod = sapel;
                                                });

                                                winBuscarPersona.on('critbusreserva', function () {
                                                    let colums = new Ext.grid.ColumnModel([
                                                        {header: 'No. registro', width: 30, dataIndex: 'idpersona', hidden: 'true'},
                                                        {header: 'No. de identidad', width: 30, dataIndex: 'numid', align: 'center'},
                                                        {header: 'Nombres y Apellidos', width: 150, dataIndex: 'nombreyapellidos'},
                                                        {header: 'Clasificación', width: 30, dataIndex: 'clasificacion', align: 'center'},
                                                        {header: 'Preparación', width: 28, dataIndex: 'preparacion', align: 'center'},
                                                        {header: 'Fecha inicio', width: 20, dataIndex: 'fdesde', align: 'center'},
                                                        {header: 'Fecha fin', width: 20, dataIndex: 'fhasta', align: 'center'},
                                                        {width: 10, hidden: true, dataIndex: 'entidad_area', renderer: mostrarAreaRe}
                                                    ]);

                                                    let storegp = new Ext.data.GroupingStore({
                                                        url: '/pvd/movimientoslaborales/index.php/reserva/getReserva',
                                                        reader: new Ext.data.JsonReader(
                                                                {root: "datos", totalProperty: "cantidad"},
                                                                [
                                                                    {name: 'idreserva'},
                                                                    {name: 'idpersona'},
                                                                    {name: 'numid'},
                                                                    {name: 'nombreyapellidos'},
                                                                    {name: 'clasificacion'},
                                                                    {name: 'preparacion'},
                                                                    {name: 'cargo'},
                                                                    {name: 'idcargo'},
                                                                    {name: 'area'},
                                                                    {name: 'idarea'},
                                                                    {name: 'identidad'},
                                                                    {name: 'entidad_area'},
                                                                    {name: 'fdesde'},
                                                                    {name: 'fhasta'},
                                                                    {name: 'idprocedenciasocial'},
                                                                    {name: 'procedencia'}
                                                                ]
                                                                ),
                                                        sortInfo: {
                                                            field: 'entidad_area',
                                                            direction: "DESC"
                                                        },
                                                        groupField: 'entidad_area',
                                                        listeners: {
                                                            load: function (st, data) {
                                                                if (data.length == 0) {
                                                                    mostrarMensaje(1, "No existen datos que se correspondan con el(los) criterio(s) de búsqueda especificado(s).");
                                                                }
                                                            }
                                                        }
                                                    });
                                                    vista.gpPersonas.reconfigure(storegp, colums);
                                                    vista.gpPersonas.doLayout();
                                                    storegp.idestructura = entidad;
                                                    storegp.baseParams.idcargo = vista.tpEstructura.dameSeleccion().attributes.id;
                                                    storegp.load({params: {start: 0, limit: 15}});
                                                });
                                            } else {
                                                forzar = 0;
                                            }
                                        });
                                    } else {
                                        mostrarMensaje(2, idioma.msgNoAlta);
                                    }
                                } else {
                                    forzar = 0;
                                    accion = 'add';
                                    let winBuscarPersona = new Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona({
                                        title: 'Buscar persona',
                                        constrain: true,
                                        modal: true,
                                        closeAction: 'close',
                                        idioma: idioma,
                                        modelo: modelo
                                    });
                                    winBuscarPersona.show();

                                    winBuscarPersona.on('critbusqaceptado', function (numid, nombre, papel, sapel, tipoFiltro) {
                                        vista.btnBuscarPorCriterios.show();
                                        vista.sfBuscar.hide();
                                        vista.lbBuscarPers.hide();
                                        vista.fpAlta.getForm().reset();
                                        vista.tafunciones.setValue();
                                        modelo.stPersonas.baseParams.idestructura = '';
                                        modelo.stPersonas.baseParams.idcargo = (tiponodoestructura == 0) ? node.id : null;
                                        modelo.stPersonas.baseParams.arrayEst = Ext.encode(arrayidestr);
                                        modelo.stPersonas.baseParams.alta = tipoFiltro;
                                        modelo.stPersonas.removeAll();
                                        modelo.stPersonas.load({
                                            params: {start: 0, limit: 15, numid: numid, nombre: nombre, papel: papel, sapel: sapel}
                                        });
                                        buscar = true;
                                        vista.btnAlta.disable();
                                        forzar = 0;
                                        accion = 'add';
                                        altamod = tipoFiltro;
                                        numidmod = numid;
                                        nombremod = nombre;
                                        papelmod = papel;
                                        sapelmod = sapel;
                                    });
                                    winBuscarPersona.on('critbusreserva', function () {
                                        let colums = new Ext.grid.ColumnModel([
                                            {header: 'No. registro', width: 30, dataIndex: 'idpersona', hidden: 'true'},
                                            {header: 'No. de identidad', width: 30, dataIndex: 'numid', align: 'center'},
                                            {header: 'Nombres y Apellidos', width: 150, dataIndex: 'nombreyapellidos'},
                                            {header: 'Clasificación', width: 30, dataIndex: 'clasificacion', align: 'center'},
                                            {header: 'Preparación', width: 28, dataIndex: 'preparacion', align: 'center'},
                                            {header: 'Fecha inicio', width: 20, dataIndex: 'fdesde', align: 'center'},
                                            {header: 'Fecha fin', width: 20, dataIndex: 'fhasta', align: 'center'},
                                            {width: 10, hidden: true, dataIndex: 'entidad_area', renderer: mostrarAreaRe}
                                        ]);
                                        let storegp = new Ext.data.GroupingStore({
                                            url: '/pvd/movimientoslaborales/index.php/reserva/getReserva',
                                            reader: new Ext.data.JsonReader(
                                                    {root: "datos", totalProperty: "cantidad"},
                                                    [
                                                        {name: 'idreserva'},
                                                        {name: 'idpersona'},
                                                        {name: 'numid'},
                                                        {name: 'nombreyapellidos'},
                                                        {name: 'clasificacion'},
                                                        {name: 'preparacion'},
                                                        {name: 'cargo'},
                                                        {name: 'idcargo'},
                                                        {name: 'area'},
                                                        {name: 'idarea'},
                                                        {name: 'identidad'},
                                                        {name: 'entidad_area'},
                                                        {name: 'fdesde'},
                                                        {name: 'fhasta'},
                                                        {name: 'idprocedenciasocial'}
                                                    ]
                                                    ),
                                            sortInfo: {
                                                field: 'entidad_area',
                                                direction: "DESC"
                                            },
                                            groupField: 'entidad_area',
                                            listeners: {
                                                load: function (st, data) {
                                                    if (data.length == 0) {
                                                        mostrarMensaje(1, "No existen datos que se correspondan con el(los) criterio(s) de búsqueda especificado(s).");
                                                    }
                                                }
                                            }
                                        });
                                        vista.gpPersonas.reconfigure(storegp, colums);
                                        vista.gpPersonas.doLayout();

                                        storegp.idestructura = entidad;
                                        storegp.baseParams.idcargo = vista.tpEstructura.dameSeleccion().attributes.id;
                                        storegp.load({
                                            params: {start: 0, limit: 15}
                                        });
                                    });
                                }
                            }
                        });
                    } else {
                        mostrarMensaje(6, 'No se puede continuar debido a que no fue encontrada la entidad.');
                    }
                }
            });

            vista.fpAlta.doLayout();
        });

        vista.btnBuscarPorCriterios.on('click', function () {
            let winBuscarPersona = new Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona({
                accion: 'MOD',
                altamod: altamod,
                numidmod: numidmod,
                nombremod: nombremod,
                papelmod: papelmod,
                sapelmod: sapelmod,
                title: 'Buscar persona',
                constrain: true,
                modal: true,
                closeAction: 'close',
                idioma: idioma,
                modelo: modelo
            });
            winBuscarPersona.show();

            winBuscarPersona.on('critbusqaceptado', function (numid, nombre, papel, sapel, tipoFiltro) {
                vista.btnBuscarPorCriterios.show();
                vista.sfBuscar.hide();
                vista.lbBuscarPers.hide();
                vista.fpAlta.getForm().reset();
                vista.tafunciones.setValue();
                modelo.stPersonas.baseParams.idestructura = '';
                if (forzar == 1) {
                    modelo.stPersonas.baseParams.idcargo = node.id;
                } else {
                    modelo.stPersonas.baseParams.idcargo = (tiponodoestructura == 0) ? node.id : null;
                }
                modelo.stPersonas.baseParams.arrayEst = Ext.encode(arrayidestr);
                modelo.stPersonas.baseParams.alta = tipoFiltro;
                modelo.stPersonas.removeAll();
                modelo.stPersonas.load({
                    params: {
                        start: 0,
                        limit: 15,
                        numid: numid,
                        nombre: nombre,
                        papel: papel,
                        sapel: sapel
                    }
                });
                buscar = true;
                vista.btnAlta.disable();
                accion = 'add';
                altamod = tipoFiltro;
                numidmod = numid;
                nombremod = nombre;
                papelmod = papel;
                sapelmod = sapel;
            });
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            modelo.stTipoContrato.load({
                callback: function () {
                    if (accion == 'add') {
                        let temporal = vista.tpEstructura.dameSeleccion().attributes.temporal;
                        if (temporal == 1) {
                            filtrarContratosDeterminados();
                        }
                    }
                }
            });
            modelo.stPrograma.load();
            modelo.stProgramaM.load();
            personaselect = vista.gpPersonas.getSelectionModel().getSelected().data;
            objseleccionadas = vista.gpPersonas.getSelectionModel().getSelections();
            if (accion == 'add') {
                if (personaselect.idcargo) {
                    //comprobar si ocupa cargo de cuadro
                    Ext.Ajax.request({
                        url: 'esCuadro',
                        params: {
                            idcargop: personaselect.idcargo,
                            idcargo: node.id
                        },
                        callback: function () {
                        },
                        success: function (r) {
                            let responseData = Ext.decode(r.responseText);
                            if (responseData == 1) {
                                mostrarMensaje(6, 'La persona seleccionada no puede ser pluriempleada porque ocupa un cargo de cuadro.');
                            } else if (responseData == 2) {
                                mostrarMensaje(6, 'La persona seleccionada no puede ser pluriempleada en un cargo de cuadro.');
                            } else {
                                mostrarMensaje(2, idioma.msgPoseeCargo + personaselect.cargo + ' en el &aacute;rea ' + personaselect.area + ' de la entidad ' +
                                        personaselect.entidad + '. ¿Desea' + ' continuar?', function (btnPress) {
                                            if (btnPress == 'ok') {
                                                vista.winAlta.show();
                                                if (tiponodoestructura == 1) {
                                                    Ext.getCmp('tf').setVisible(false);
                                                    Ext.getCmp('tch').setVisible(false);
                                                    Ext.getCmp('tfarea').setVisible(false);
                                                    vista.winAlta.setHeight(295);
                                                } else {
                                                    Ext.getCmp('tfarea').setVisible(true);
                                                    Ext.getCmp('tf').setVisible(true);
                                                    Ext.getCmp('tch').setVisible(true);
                                                    modelo.stCargosEsp.load({params: {idcargo: node.id}});
                                                    vista.tfArea.setValue(node.parentNode.attributes.denominacion);
                                                    vista.tfCargo.setValue(node.attributes.denominacion);
                                                    vista.winAlta.setHeight(395);
                                                }
                                                vista.chbPrincipal.setValue(false);
                                                Ext.getCmp('tc').setVisible(false);
                                                vista.tfEntidad.setValue(entidad.denominacion);
                                                vista.tcbSituacion.setValue('');
                                                vista.tcbSituacion.setRawValue('');
                                                vista.cbProcedenciaSocial.setValue(personaselect.idprocedenciasocial);
                                                vista.cbProcedenciaSocial.setRawValue(personaselect.procedencia);
                                                vista.fpAlta.getForm().clearInvalid();
                                                vista.btnAlta.disable();
                                                vista.fpAlta.doLayout();
                                            }
                                        });
                            }
                        }
                    });
                } else {
                    vista.winAlta.show();
                    if (tiponodoestructura == 1) {
                        Ext.getCmp('tf').setVisible(false);
                        Ext.getCmp('tch').setVisible(false);
                        Ext.getCmp('tfarea').setVisible(false);
                        vista.winAlta.setHeight(295);
                    } else {
                        Ext.getCmp('tfarea').setVisible(true);
                        Ext.getCmp('tf').setVisible(true);
                        Ext.getCmp('tch').setVisible(true);
                        modelo.stCargosEsp.load({params: {idcargo: node.id}});
                        vista.tfCargo.setValue(node.attributes.denominacion);
                        vista.btnAlta.disable();
                        vista.fpAlta.doLayout();
                        vista.tfArea.setValue(node.parentNode.attributes.denominacion);
                        vista.winAlta.setHeight(395);
                    }
                    vista.chbPrincipal.setValue(true);
                    Ext.getCmp('tc').setVisible(false);
                    vista.tfEntidad.setValue(entidad.denominacion);
                    vista.tcbSituacion.setValue('');
                    vista.tcbSituacion.setRawValue('');
                    vista.cbProcedenciaSocial.setValue('');
                    vista.cbProcedenciaSocial.setRawValue('');
                    vista.fpAlta.getForm().clearInvalid();
                }
            } else {
                let select = vista.gpPersonas.getSelectionModel().getSelections();

                if (select.length == 1) {
                    vista.btnVer.enable();
                    if (select[0].data.estado == 0) {
                        vista.btnModificar.enable();
                        Ext.getCmp('btnListadoFunciones').enable();
                    } else {
                        vista.btnModificar.disable();
                        Ext.getCmp('btnListadoFunciones').disable();
                    }
                    vista.btnMovimiento.enable();
                    if (personaselect.determinado == 1) {
                        vista.btnCambiarContrato.enable();
                    } else {
                        vista.btnCambiarContrato.disable();
                    }
                    vista.btnBaja.enable();
                    Ext.getCmp('idTrasladoEnviar').enable();
                } else {
                    vista.btnVer.disable();
                    vista.btnModificar.disable();
                    Ext.getCmp('btnListadoFunciones').disable();
                    vista.btnMovimiento.disable();
                    vista.btnCambiarContrato.disable();
                    vista.btnBaja.disable();
                    Ext.getCmp('idTrasladoEnviar').disable();
                }
                vista.btnEliminar.enable();
                Ext.getCmp('idbtnbtnReporteMovimientonomina').enable();
            }
            vista.winAlta.doLayout();
        });

        vista.fpAlta.on('clientvalidation', function (f, v) {
            if (v == true) {
                vista.btnAceptar.enable();
            } else {
                vista.btnAceptar.disable();
            }
        });

        vista.gpPersonas.getSelectionModel().on('rowdeselect', function () {
            let select = vista.gpPersonas.getSelectionModel().getSelections();
            if (select.length == 0) {
                personaselect = null;
                objseleccionadas.length = 0;
                vista.btnVer.disable();
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
                Ext.getCmp('btnListadoFunciones').disable();
                vista.btnMovimiento.disable();
                vista.btnBaja.disable();
                Ext.getCmp('idbtnbtnReporteMovimientonomina').disable();
                Ext.getCmp('idTrasladoEnviar').disable();
            } else if (select.length == 1) {
                vista.btnVer.enable();
                vista.btnModificar.enable();
                Ext.getCmp('btnListadoFunciones').enable();
                vista.btnMovimiento.enable();
                vista.btnBaja.enable();
                Ext.getCmp('idTrasladoEnviar').enable();
                Ext.getCmp('idbtnbtnReporteMovimientonomina').enable();
            } else if (select.length > 1) {
                Ext.getCmp('idbtnbtnReporteMovimientonomina').enable();
            }
        });


        modelo.stPersonas.on('load', function (st, data) {
            if (data.length == 0) {
                if (vista.sfBuscar.getValue() == '' && buscar == false) {
                    mostrarMensaje(1, "No existen datos que mostrar.");
                } else {
                    mostrarMensaje(1, "No existen datos que se correspondan con el criterio de búsqueda especificado.");
                }
            }
            reload = 1;
            personaselect = null;
            objseleccionadas = new Array();
            vista.btnVer.disable();
            vista.btnEliminar.disable();
            vista.btnModificar.disable();
            Ext.getCmp('btnListadoFunciones').disable();
            vista.btnCambiarContrato.disable();
            vista.btnMovimiento.disable();
            vista.btnBaja.disable();
            let idc = node.attributes.idconcepto;
            let idt = node.attributes.idtipo;
            if ((idc == 7 || idt == 7) && !vista.btnBuscarPorCriterios.isVisible()) {
                vista.btnAlta.enable();
            } else {
                vista.btnAlta.disable();
            }
        });

        vista.btnCancelar.on('click', function () {
            if (node.attributes.idtipo == 7) {
                modelo.stPersonas.baseParams = {idcargo: node.id};
                modelo.stPersonas.baseParams.idestructura = '';
            } else {
                modelo.stPersonas.baseParams = {idestructura: node.id};
                modelo.stPersonas.baseParams.idcargo = '';
            }
            if (tiponodoestructura == 1) {
                modelo.stPersonas.baseParams.idconcepto = 3;
            } else {
                modelo.stPersonas.baseParams.idconcepto = null;
            }
            modelo.stPersonas.baseParams.arrayEst = null;
            modelo.stPersonas.baseParams.alta = null;
            modelo.stPersonas.removeAll();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
            vista.winAlta.hide();
            vista.btnBuscarPorCriterios.hide();
            vista.sfBuscar.show();
            vista.lbBuscarPers.show();
            buscar = false;
            accion = '';
        });

        vista.btnSyncCargos.on('click', function () {
            actualizarCompletamiento();
        });

        vista.btnCancelarBaja.on('click', function () {
            vista.gpPersonas.getSelectionModel().clearSelections();
            vista.winDarBaja.hide();
        });

        vista.btnCancelarMovimiento.on('click', function () {
            vista.gpPersonas.getSelectionModel().clearSelections();
            vista.winMovimiento.hide();
        });

        vista.btnBaja.on('click', function () {
            vista.winDarBaja.show();
            vista.tcbMotivoBaja.setRawValue('');
            vista.dfHasta.reset();
            let vfdesdeac = personaselect.fdesde;
            let arrfdesdeac = vfdesdeac.split('/');
            let fliminicialac = (arrfdesdeac[0] * 1 + 1) + '/' + arrfdesdeac[1] + '/' + arrfdesdeac[2];
            vista.dfHasta.setMinValue(fliminicialac);
            vista.fpDarBaja.getForm().clearInvalid();
        });

        vista.pProblemasDetectados.btnBajaPD.on('click', function () {
            vista.winDarBaja.show();
            vista.tcbMotivoBaja.setRawValue('');
            vista.dfHasta.reset();
            let vfdesdepr = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data.fdesde;
            let arrfdesdepr = vfdesdepr.split('/');
            let fliminicialpr = (arrfdesdepr[0] * 1 + 1) + '/' + arrfdesdepr[1] + '/' + arrfdesdepr[2];
            vista.dfHasta.setMinValue(fliminicialpr);
            vista.fpDarBaja.getForm().clearInvalid();
        });

        vista.btnMovimiento.on('click', function () {
            accion = 'movimiento';
            cargarDatosSitLabMov(personaselect.idsituacionlaboralp);
        });

        vista.pProblemasDetectados.btnMovimientoPD.on('click', function () {
            let problema = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data;
            cargarDatosSitLabMov(problema.idsituacionlaboralp);
        });



        Ext.getCmp('contrato').on('click', function () {
            let tcont = modelo.stTipoContrato.getById(personaselect.idtipocontrato);
            if (personaselect.idtipocontrato && tcont.data.idplantilla) {
                let winc1 = new PVD.Plantilla.Contenedor({
                    idplantilla: tcont.data.idplantilla,
                    idIframe: Ext.id(),
                    idpersona: personaselect.idpersona,
                    title: 'Contrato de trabajo',
                    margenes: '8, 8, 8, 8'
                });
                winc1.show();
                winc1.maximize();
            } else {
                mostrarMensaje(1, idioma.msgNoPlantilla);
            }
        });

        Ext.getCmp('contratoDoc').on('click', function () {
            let tcont = modelo.stTipoContrato.getById(personaselect.idtipocontrato);
            if (personaselect.idtipocontrato && tcont.data.idplantilla) {
                window.open(document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarDocContrato?idpersona=' + personaselect.idpersona + '&idplantilla=' + tcont.data.idplantilla);
            } else {
                mostrarMensaje(1, idioma.msgNoPlantilla);
            }
        });

        Ext.getCmp('suplementos').on('click', function () {
            modelo.stSuplementos.load({params: {start: 0, limit: 15}});
            vista.winSuple.show();
        });


        Ext.getCmp('idformulario').on('afterrender', function (form) {
            var btnAceptar = Ext.getCmp('btnAceptar'); // Reemplaza 'btnAceptar' con el ID real del botón de Aceptar
            // Verifica si todos los campos tienen valor
            form.getForm().on('update', function () {
                // Verifica si todos los campos del formulario están llenos
                if (form.getForm().isValid()) {
                    btnAceptar.enable(); // Habilita el botón de "Aceptar" si el formulario es válido
                } else {
                    btnAceptar.disable(); // Deshabilita el botón de "Aceptar" si el formulario no es válido
                }
            });
        });

        vista.gpSuplementos.getSelectionModel().on('rowselect', function () {
            vista.btnAceptarS.enable();
        });

        vista.btnAceptarS.setHandler(function () {
            let id = vista.gpSuplementos.getSelectionModel().getSelected().data.idplantilla;
            if (personaselect.idtipocontrato && id) {
                let wins = new PVD.Plantilla.Contenedor({
                    idplantilla: id,
                    idpersona: personaselect.idpersona,
                    title: 'Suplemento',
                    margenes: '8, 8, 8, 8'
                });
                wins.show();
                wins.maximize();
            } else {
                mostrarMensaje(1, idioma.msgNoPlantilla);
            }
            vista.winSuple.hide();
        });

        vista.btnAceptarBaja.on('click', function () {
            efectuarBaja();
        });

        vista.btnAceptarMovimiento.on('click', function () {
            realizarMovimiento();
        });

        vista.btnEliminar.on('click', function () {
            ids.length = 0;
            let s = vista.gpPersonas.getSelectionModel().getSelections();
            for (let i = 0; i < s.length; i++) {
                ids.push(s[i].data.idsituacionlaboralp);
            }
            eliminar(1);
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            accionModificar();
        });



        vista.btnCambiarContrato.on('click', function () {
            vista.winCC.show();
            vista.btnAceptarCC.disable();
            vista.dfFDesdeCC.reset();
            vista.dfFHastaCC.setValue();
            vista.fpActContrato.getForm().clearInvalid();
            if (personaselect.idtipocontrato) {
                vista.cbTipoContratoCC.setValue(personaselect.idtipocontrato);
                vista.cbTipoContratoCC.setRawValue(vista.cbTipoContratoCC.store.getById(personaselect.idtipocontrato).data.denominacion);
                if (modelo.stTipoContrato.getById(personaselect.idtipocontrato).data.determinado == 1) {
                    vista.dfFHastaCC.allowBlank = false;
                    vista.dfFHastaCC.enable();
                } else {
                    vista.dfFHastaCC.allowBlank = true;
                    vista.dfFHastaCC.reset();
                    vista.dfFHastaCC.disable();
                }
            } else {
                vista.cbTipoContratoCC.reset();
            }
            vista.tcbSituacionCC.setValue(personaselect.idsituacion);
            vista.tcbSituacionCC.setRawValue(personaselect.situacion);
            vista.fpActContrato.getForm().clearInvalid();
        });

        vista.btnCancelarCC.on('click', function () {
            vista.winCC.hide();
        });

        vista.btnAceptarCC.on('click', function () {
            cambiarContrato();
        });

        modelo.stCargosEsp.on('load', function (st) {
            if (st.getCount() > 0) {
                vista.cbCargosEsp.enable();
                if (accion == 'mod' && idespcargo) {
                    vista.cbCargosEsp.setValue(idespcargo);
                    vista.cbCargosEsp.setRawValue(vista.cbCargosEsp.store.getById(idespcargo).data.denominacion);
                }
            } else {
                vista.cbCargosEsp.reset();
                vista.cbCargosEsp.disable();
                mostrarMensaje(1, 'No existen especializaciones para este cargo.');
            }
        });

        modelo.stCargosEspMov.on('load', function (st) {
            if (st.getCount() > 0) {
                vista.cbCargosEspMov.enable();
            } else {
                vista.cbCargosEspMov.reset();
                vista.cbCargosEspMov.disable();
                mostrarMensaje(1, 'No existen especializaciones para este cargo.');
            }
        });

        modelo.tlcargos.on('beforeload', function (tl) {
            if (tl.isLoading()) {
                return false;
            } else if (movshow == 1) {
                let idest;
                if ((vista.tabPanel.getActiveTab().id == 'problemasdetectados')) {
                    idest = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data.identidad;
                } else {
                    idest = personaselect.identidad;
                }
                tl.baseParams.idestructura = idest;
            } else {
                tl.baseParams.idestructura = perfil.idestructuracomun;
            }
        });

        modelo.tlSituacion.on('beforeload', function (tl) {
            sit = 1;
            if (tl.isLoading()) {
                return false;
            } else if (accion == 'add') {
                if (tiponodoestructura == 1) {
                    tl.baseParams.cargoasociado = 0;
                } else {
                    tl.baseParams.cargoasociado = 1;
                }
            } else {
                tl.baseParams.cargoasociado = 1;
            }
        });

        vista.btnActualizarMN.on('click', function () {
            Ext.Ajax.request({
                url: 'actualizarMovimientosNomina',
                params: {idestructura: node.id},
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    if (responseData) {
                        mostrarMensaje(1, 'La actualización fue realizada satisfactoriamente.');
                    } else {
                        mostrarMensaje(6, 'No se pudo realizar la actualización.');
                    }
                }
            });
        });

        vista.btnAceptar.on('click', function () {
            guardarDatos();
        });

        vista.winAlta.on('show', function () {
            altashow = 1;
            modelo.stPrograma.load();
            if (accion == 'add') {
                vista.winAlta.setTitle(idioma.msgdarAlta);
            } else {
                vista.winAlta.setTitle(idioma.msgModifdatos);
            }
            if (sit == 1) {
                vista.tcbSituacion.tree.getRootNode().reload();
            }
            vista.cbTipoContrato.focus(true, 500);
        });

        vista.winAlta.on('hide', function () {
            if (accion == 'add') {
                vista.btnAlta.enable();
            }
            altashow = 0;
            vista.btnAlta.focus();
        });

        vista.winDarBaja.on('show', function () {
            bajashow = 1;
        });

        vista.winDarBaja.on('hide', function () {
            bajashow = 0;
        });

        vista.winMovimiento.on('show', function () {
            modelo.stProgramaM.load();
            movshow = 1;
        });

        vista.winMovimiento.on('hide', function () {
            movshow = 0;
        });

        vista.tcbCargos.tree.on('click', function (n) {
            Ext.Ajax.request({
                url: 'dameConfiguracionEstructura',
                params: {identidad: identidad},
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    ueb = null;
                    if (responseData.length > 0) {
                        let nodeact = n;
                        let posible_ueb;
                        while (nodeact.isRoot !== true && (nodeact.attributes._parent !== nodeact.id || nodeact.attributes.idpadre !== nodeact.id)) {
                            if (nodeact.attributes.idconcepto == 5 || nodeact.attributes.idtipo == 5) {
                                posible_ueb = nodeact;
                                for (let i = 0; i < responseData.length; i++) {
                                    if (responseData[i].idestructura == posible_ueb.id) {
                                        ueb = posible_ueb.id;
                                        break;
                                    }
                                }
                            }
                            nodeact = nodeact.parentNode;
                        }
                    }
                }
            });

            if (n.attributes.idconcepto !== '7') {
                mostrarMensaje(6, idioma.msgSelectCargo);
                vista.tcbCargos.setRawValue('');
            } else {
                modelo.stCargosEspMov.load({params: {idcargo: n.id}});
                if (parseInt(n.attributes.cantidad) <= parseInt(n.attributes.cantidad_real)) {
                    vista.tcbCargos.setRawValue(n.attributes.denominacion);
                    mostrarMensaje(2, idioma.msgNoCapacidad, function (btnPress) {
                        if (btnPress == 'ok') {
                            idarea = n.parentNode.id;
                            if (modelo.stTipoContrato.getById(vista.cbTipoContratoM.getValue()).data.determinado == 0) {
                                vista.cbTipoContratoM.reset();
                            }
                            filtrarContratosDeterminados();
                        } else {
                            vista.tcbCargos.setRawValue('');
                        }
                    });
                } else {
                    idarea = n.parentNode.id;
                    vista.tcbCargos.setRawValue(n.attributes.denominacion);
                }
            }
        });

        vista.tcbCargosMod.tree.on('click', function (n) {
            if (n.attributes.idconcepto !== '7') {
                mostrarMensaje(6, 'Debe seleccionar un cargo.');
                vista.tcbCargosMod.setRawValue('');
            } else {
                if (parseInt(n.attributes.cantidad) <= parseInt(n.attributes.cantidad_real)) {
                    mostrarMensaje(2, idioma.msgNoCapacidad, function (btnPress) {
                        if (btnPress == 'ok') {
                            if (modelo.stTipoContrato.getById(vista.cbTipoContrato.getValue()).data.determinado == 0) {
                                vista.cbTipoContrato.reset();
                            }
                            filtrarContratosDeterminados();
                            idarea = n.parentNode.id;
                            //Buscar entidad
                            Ext.getBody().mask('Por favor espere. Cargando datos...');
                            Ext.Ajax.request({
                                url: 'getEntidadByCargo',
                                params: {idcargo: n.id},
                                callback: function () {
                                    Ext.getBody().unmask();
                                },
                                success: function (r) {
                                    let responseData = Ext.decode(r.responseText);
                                    if (responseData.length > 0) {
                                        entidad = responseData[0];
                                        identidad = responseData[0].idestructura;
                                        vista.tfEntidad.setValue(entidad.denominacion);
                                        Ext.Ajax.request({
                                            url: 'dameConfiguracionEstructura',
                                            params: {identidad: identidad},
                                            success: function (r) {
                                                let responseData = Ext.decode(r.responseText);
                                                ueb = null;
                                                if (responseData.length > 0) {
                                                    let nodeact = n;
                                                    let posible_ueb;
                                                    while (nodeact.isRoot !== true && (nodeact.attributes._parent !== nodeact.id || nodeact.attributes.idpadre !== nodeact.id)) {
                                                        if (nodeact.attributes.idconcepto == 5 || nodeact.attributes.idtipo == 5) {
                                                            posible_ueb = nodeact;
                                                            for (i = 0; i < responseData.length; i++) {
                                                                if (responseData[i].idestructura == posible_ueb.id) {
                                                                    ueb = posible_ueb.id;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        nodeact = nodeact.parentNode;
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        mostrarMensaje(6, 'No se puede continuar debido a que no fue encontrada la entidad.');
                                    }
                                }
                            });
                            vista.tcbCargosMod.setRawValue(n.attributes.denominacion);
                            vista.tfArea.setValue(n.parentNode.attributes.denominacion);
                        } else {
                            vista.tcbCargosMod.setRawValue('');
                        }
                    });
                } else {
                    //Buscar entidad
                    Ext.getBody().mask('Por favor espere. Cargando datos...');
                    Ext.Ajax.request({
                        url: 'getEntidadByCargo',
                        params: {idcargo: n.id},
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            let responseData = Ext.decode(r.responseText);
                            if (responseData.length > 0) {
                                entidad = responseData[0];
                                identidad = responseData[0].idestructura;
                                vista.tfEntidad.setValue(entidad.denominacion);
                                Ext.Ajax.request({
                                    url: 'dameConfiguracionEstructura',
                                    params: {identidad: identidad},
                                    callback: function () {
                                    },
                                    success: function (r) {
                                        let responseData = Ext.decode(r.responseText);
                                        ueb = null;
                                        if (responseData.length > 0) {
                                            let nodeact = n;
                                            let posible_ueb;
                                            while (nodeact.isRoot !== true && (nodeact.attributes._parent !== nodeact.id || nodeact.attributes.idpadre !== nodeact.id)) {
                                                if (nodeact.attributes.idconcepto == 5 || nodeact.attributes.idtipo == 5) {
                                                    posible_ueb = nodeact;
                                                    for (i = 0; i < responseData.length; i++) {
                                                        if (responseData[i].idestructura == posible_ueb.id) {
                                                            ueb = posible_ueb.id;
                                                            break;
                                                        }
                                                    }
                                                }
                                                nodeact = nodeact.parentNode;
                                            }
                                        }
                                    }
                                });
                            } else {
                                mostrarMensaje(6, 'No se puede continuar debido a que no fue encontrada la entidad.');
                            }
                        }
                    });
                    vista.tcbCargosMod.setRawValue(n.attributes.denominacion);
                    vista.tfArea.setValue(n.parentNode.attributes.denominacion);
                    idarea = n.parentNode.id;
                }
            }
        });

        vista.cbTipoContrato.on('select', function (n) {
            if (n.store.getById(n.value).data.determinado == 1) {
                vista.dfFHasta.allowBlank = false;
                vista.dfFHasta.enable();
            } else {
                vista.dfFHasta.allowBlank = true;
                vista.dfFHasta.reset();
                vista.dfFHasta.disable();
            }
        });

        vista.cbTipoContratoM.on('select', function (n) {
            if (n.store.getById(n.value).data.determinado == 1) {
                vista.dfFHastaM.allowBlank = false;
                vista.dfFHastaM.enable();
            } else {
                vista.dfFHastaM.allowBlank = true;
                vista.dfFHastaM.reset();
                vista.dfFHastaM.disable();
            }
        });

        vista.cbTipoContratoCC.on('select', function (n) {
            if (n.store.getById(n.value).data.determinado == 1) {
                vista.dfFHastaCC.allowBlank = false;
                vista.dfFHastaCC.enable();
            } else {
                vista.dfFHastaCC.allowBlank = true;
                vista.dfFHastaCC.reset();
                vista.dfFHastaCC.disable();
            }
            vista.btnAceptarCC.enable();
        });

        Ext.getCmp('east-panel').on('collapse', function () {
            vista.tabPanel.doLayout();
        });

        Ext.getCmp('east-panel').on('expand', function () {
            vista.tabPanel.doLayout();
        });

        vista.tabPanel.on('tabchange', function () {
            if (node) {
                if (Ext.getCmp('east-panel').disabled) {
                    Ext.getCmp('east-panel').enable();
                    Ext.getCmp('east-panel').expand();
                }
                let idc = node.attributes.idconcepto;
                let idt = node.attributes.idtipo;
                if ((idc == 3 || idc == 1 || idc == 4) || (idt == 3 || idt == 1 || idt == 4)) {
                    tiponodoestructura = 1;
                } else {
                    tiponodoestructura = 0;
                }
                if (vista.tabPanel.getActiveTab().id == 'actual') {
                    modelo.stPersonas.removeAll();
                    if ((idc == 7 || idt == 7)) {
                        vista.btnAlta.enable();
                        modelo.stPersonas.baseParams.idestructura = '';
                        modelo.stPersonas.baseParams = {idcargo: node.attributes.id};
                    } else {
                        modelo.stPersonas.baseParams.idcargo = '';
                        modelo.stPersonas.baseParams.arrayEst = null;
                        modelo.stPersonas.baseParams.alta = null;
                        modelo.stPersonas.baseParams = {idestructura: node.attributes.id};
                        if (tiponodoestructura == 1) {
                            modelo.stPersonas.baseParams.idconcepto = 3;
                        } else {
                            vista.btnAlta.disable();
                            modelo.stPersonas.baseParams.idconcepto = null;
                        }
                    }
                    if (reload == 1) {
                        modelo.stPersonas.load({
                            params: {
                                start: 0,
                                limit: modelo.stPersonas.lastOptions.params.limit,
                                query: vista.sfBuscar.getValue()
                            }
                        });
                    } else {
                        modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
                    }
                    buscar = false;
                } else if (vista.tabPanel.getActiveTab().id == 'historico') {
                    vista.pPersonasHistorico.idnode = idnode;
                    if ((idc == 7 || idt == 7)) {
                        vista.pPersonasHistorico.btnExportarHist.disable();
                        vista.pPersonasHistorico.stPersonasHistorico.baseParams.idestructura = '';
                        vista.pPersonasHistorico.stPersonasHistorico.baseParams.idconcepto = null;
                        vista.pPersonasHistorico.stPersonasHistorico.baseParams = {idcargo: node.attributes.id};
                    } else {
                        vista.pPersonasHistorico.btnExportarHist.enable();
                        vista.pPersonasHistorico.stPersonasHistorico.baseParams.idcargo = '';
                        vista.pPersonasHistorico.stPersonasHistorico.baseParams = {idestructura: node.attributes.id};
                        if (tiponodoestructura == 1) {
                            vista.pPersonasHistorico.stPersonasHistorico.baseParams.idconcepto = 3;
                        } else {
                            vista.pPersonasHistorico.stPersonasHistorico.baseParams.idconcepto = null;
                        }
                    }
                    vista.pPersonasHistorico.stPersonasHistorico.removeAll();
                    if (reloadH == 1) {
                        vista.pPersonasHistorico.stPersonasHistorico.load({
                            params: {
                                query: vista.pPersonasHistorico.sfBuscarHistorico.getValue(),
                                desde: vista.pPersonasHistorico.dfFInicioBuscar.getRawValue(),
                                hasta: vista.pPersonasHistorico.dfFFinBuscar.getRawValue(),
                                estado: vista.pPersonasHistorico.cbEstado.getValue(),
                                motivo: vista.pPersonasHistorico.tcbMotivo.getValue(),
                                start: 0,
                                limit: vista.pPersonasHistorico.stPersonasHistorico.lastOptions.params.limit
                            }
                        });
                    } else {
                        vista.pPersonasHistorico.stPersonasHistorico.load({
                            params: {
                                query: vista.pPersonasHistorico.sfBuscarHistorico.getValue(),
                                desde: vista.pPersonasHistorico.dfFInicioBuscar.getRawValue(),
                                hasta: vista.pPersonasHistorico.dfFFinBuscar.getRawValue(),
                                estado: vista.pPersonasHistorico.cbEstado.getValue(),
                                motivo: vista.pPersonasHistorico.tcbMotivo.getValue(),
                                start: 0,
                                limit: 15
                            }
                        });
                    }
                } else if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                    vista.pProblemasDetectados.stProblemas.removeAll();
                    vista.pProblemasDetectados.stProblemas.load();
                    Ext.getCmp('east-panel').disable();
                    Ext.getCmp('east-panel').collapse();
                }
            }
        });

        vista.tpEstructura.tree.loader.on('load', function () {
            if (node) {
                let nodeS = 0;
                if (vista.tpEstructura.tree.getNodeById(node.id)) {
                    nodeS = vista.tpEstructura.tree.getNodeById(node.id);
                }
                if (nodeS !== 0) {
                    nodeS.select();
                    node = nodeS;
                }
            }
        });

        modelo.stTipoContrato.on('load', function () {
            if ((forzar == 1 || tiponodoestructura == 1) && accion == 'add') {
                filtrarContratosDeterminados();
            }
        });

        vista.pPersonasHistorico.stPersonasHistorico.on('load', function () {
            reloadH = 1;
            vista.pPersonasHistorico.btnBuscarHist.enable();
        });

        vista.pProblemasDetectados.on('modsituacion', function (personselect) {
            accion = 'mod';
            personaselect = personselect;
            objseleccionadas[0] = personselect;
            accionModificar(2);
        });

        vista.pProblemasDetectados.on('elimsituacion', function (idselect) {
            ids.length = 0;
            ids = idselect;
            eliminar(2);
        });

        function mostrarAreaRe(val) {
            if (val) {
                return val;
            } else {
                return '<b>' + 'NO ASIGNADO A CARGO' + '</b>';
            }
        }

        Ext.getCmp('altasbajas').setHandler(function () {
            this.chbAltas = new Ext.form.Checkbox({
                fieldLabel: 'Altas',
                checked: true,
                hidden: false,
                name: 'altas',
                anchor: '98%'
            });

            this.chbBajas = new Ext.form.Checkbox({
                fieldLabel: 'Bajas',
                hidden: false,
                checked: true,
                name: 'bajas',
                anchor: '98%'
            });

            this.dfFInicio = new Ext.form.DateField({
                id: 'dfFInicio',
                fieldLabel: idioma.lbDesde,
                name: 'fdesde',
                hiddenname: 'fdesde',
                allowBlank: true,
                anchor: '98%',
                format: 'd/m/Y',
                editable: false,
                readOnly: true,
                maxValue: '31/12/2100',
                minValue: '01/01/1900',
                vtype: 'daterange'
            });

            this.dfFFin = new Ext.form.DateField({
                id: 'dfFFin',
                fieldLabel: idioma.lbHasta,
                name: 'fhasta',
                hiddenname: 'fhasta',
                anchor: '98%',
                format: 'd/m/Y',
                editable: false,
                readOnly: true,
                maxValue: '31/12/2100',
                minValue: '01/01/1900',
                startDateField: 'dfFInicio',
                vtype: 'daterange'
            });

            //Formulario de gestion.
            this.formRepAltasBajas = new Ext.FormPanel({
                labelAlign: 'top',
                region: 'center',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [{
                        layout: 'column',
                        items: [
                            {
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [this.dfFInicio]
                            }, {
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [this.dfFFin]
                            }, {
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [this.chbAltas]
                            }, {
                                columnWidth: 0.5,
                                layout: 'form',
                                items: [this.chbBajas]
                            }]
                    }]
            });
            let self = this;
            this.btnCancelarRab = new Ext.Button({
                iconCls: 'cancelar',
                text: idioma.textbtnCancelar,
                tooltip: idioma.textToolTipCancelar,
                handler: function () {
                    self.windRAB.close()
                }
            });

            this.btnAceptarRab = new Ext.Button({
                iconCls: 'aceptar',
                text: idioma.btnAceptar,
                tooltip: idioma.textToolTipAceptar,
                handler: function () {
                    let fdesde = self.dfFInicio.getRawValue();
                    let fhasta = self.dfFFin.getRawValue();
                    let altaobaja = null;
                    if (self.chbAltas.checked == true && self.chbBajas.checked == false) {
                        altaobaja = 1;
                    }
                    if (self.chbAltas.checked == false && self.chbBajas.checked == true) {
                        altaobaja = 2;
                    }
                    if (self.chbAltas.checked == true && self.chbBajas.checked == true) {
                        altaobaja = 3;
                    }
                    generarReporteAltasBajas(fdesde, fhasta, altaobaja);
                    self.windRAB.close()
                }
            });

            //Ventana de gestion.
            this.windRAB = new Ext.Window({
                modal: true,
                title: 'Generar registro de altas y bajas',
                closeAction: 'hide',
                constrain: true,
                resizable: false,
                layout: 'fit',
                width: 280,
                height: 178,
                items: [this.formRepAltasBajas],
                buttons: [
                    this.btnCancelarRab,
                    this.btnAceptarRab
                ]
            });
            this.windRAB.show();
        });

        function generarReporteAltasBajas(fdesde, fhasta, altaobaja) {
            let node = vista.tpEstructura.tree.getSelectionModel().getSelectedNode();
            let idestructura = node.id;
            let idconcepto = (node.attributes.idtipo) ? node.attributes.idtipo : node.attributes.idconcepto;

            let params = Ext.urlEncode({
                tiporeporte: 1,
                idestructura: idestructura,
                idconcepto: idconcepto,
                fdesde: fdesde,
                fhasta: fhasta,
                altaobaja: altaobaja
            });
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Registro de altas y bajas',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                                '/pvd/movimientoslaborales/index.php/movimientopersona/generarPdfReportes?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de altas y bajas.');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }

        function cargarDatosSitLabMov(idsituacionlaboralp) {
            modelo.stTipoContrato.load();
            Ext.getBody().mask('Cargando datos...');
            Ext.Ajax.request({
                url: 'getDatosSituacionLaboral',
                params: {idsituacionlaboralp: idsituacionlaboralp},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    vista.winMovimiento.show();
                    vista.tcbCargos.setRawValue('');
                    vista.tcbCargos.tree.getLoader().load(vista.tcbCargos.tree.getRootNode());
                    vista.dfFDesdeM.reset();
                    let vfdesde = responseData.fdesde;
                    let arrfdesde = vfdesde.split('/');
                    let fliminicial = (arrfdesde[0] * 1 + 1) + '/' + arrfdesde[1] + '/' + arrfdesde[2];
                    vista.dfFDesdeM.setMinValue(fliminicial);
                    vista.dfFHastaM.setValue();
                    vista.tfNoAltaM.setValue();
                    vista.tcbMotivoMovimiento.setValue();
                    vista.cbProgramaM.setValue();
                    vista.cbModalidadEmpleoM.setValue();
                    vista.tafuncionesM.setValue();
                    vista.fpMovimiento.getForm().clearInvalid();
                    if (responseData.idtipocontrato) {
                        vista.cbTipoContratoM.setValue(responseData.idtipocontrato);
                        vista.cbTipoContratoM.setRawValue(vista.cbTipoContratoM.store.getById(responseData.idtipocontrato).data.denominacion);
                        if (modelo.stTipoContrato.getById(responseData.idtipocontrato).data.determinado == 1) {
                            vista.dfFHastaM.allowBlank = false;
                            vista.dfFHastaM.enable();
                            vista.dfFHastaM.setValue(responseData.fhasta);
                        } else {
                            vista.dfFHastaM.allowBlank = true;
                            vista.dfFHastaM.reset();
                            vista.dfFHastaM.disable();
                        }
                    } else {
                        vista.cbTipoContratoM.reset();
                    }
                    vista.tcbSituacionM.setValue(responseData.idsituacion);
                    vista.tcbSituacionM.setRawValue(responseData.situacion);
                    vista.fpMovimiento.getForm().clearInvalid();
                }
            });
        }

        function realizarMovimiento() {
            if (vista.fpMovimiento.getForm().isValid()) {
                Ext.getBody().mask(idioma.msgSaveData);
                let idsitlab;
                if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                    idsitlab = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data.idsituacionlaboralp;
                } else {
                    idsitlab = (traslado) ? vista.gpConfirmarTrasladoUEB.getSelectionModel().getSelected().data.idsituacionlaboral : personaselect.idsituacionlaboralp;
                }
                acmn = 3;
                Ext.Ajax.request({
                    url: 'realizarMovimiento',
                    params: {
                        idsituacionlaboralp: idsitlab,
                        idmotivomovimiento: vista.tcbMotivoMovimiento.getValue(),
                        idcargo: vista.tcbCargos.getValue(),
                        idarea: idarea,
                        ueb: ueb,
                        idtipocontrato: vista.cbTipoContratoM.getValue(),
                        idsituacion: vista.tcbSituacionM.getValue(),
                        fdesde: vista.dfFDesdeM.getRawValue(),
                        fhasta: vista.dfFHastaM.getRawValue(),
                        noalta: vista.tfNoAltaM.getValue(),
                        idespcargo: vista.cbCargosEspMov.getValue(),
                        idprograma: vista.cbProgramaM.getValue(),
                        idmodalidadempleo: vista.cbModalidadEmpleoM.getValue(),
                        funciones: vista.tafuncionesM.getValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        let responseData = Ext.decode(r.responseText);
                        if (responseData == false)
                            mostrarMensaje(6, idioma.lbSaveFail);
                        else if (responseData == -1) {
                            mostrarMensaje(6, 'El movimiento no puede realizarse porque la persona tiene algún medio asignado.');
                        } else {
                            mostrarMensaje(2, idioma.lbMsgSaveExito + ' Desea generar el movimiento de n&oacute;mina.', function (btnPresionado) {
                                if (btnPresionado == 'ok') {
                                    personaselect = responseData;
                                    objseleccionadas = new Array();
                                    objseleccionadas.push({data: responseData});
                                    Ext.getCmp('idbtnbtnReporteMovimientonomina').fireEvent('click');
                                }
                            });
                        }
                        vista.winMovimiento.hide();
                        if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                            vista.pProblemasDetectados.stProblemas.reload();
                        } else {
                            modelo.stPersonas.reload();
                            vista.gpPersonas.getSelectionModel().clearSelections();
                        }

                        if (node.attributes.idconcepto == 7) {
                            let parentNode = node.parentNode;
                            vista.tpEstructura.tree.getLoader().load(parentNode);
                            parentNode.expand(false, true);
                        } else {
                            vista.tpEstructura.tree.getLoader().load(node);
                            node.expand(false, true);
                        }
                    }
                });
            }
        }

        function cambiarContrato() {
            if (vista.fpActContrato.getForm().isValid()) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: 'realizarMovimiento',
                    params: {
                        idsituacionlaboralp: personaselect.idsituacionlaboralp,
                        idmotivomovimiento: null,
                        idcargo: personaselect.idcargo,
                        idarea: personaselect.idarea,
                        ueb: personaselect.idueb,
                        idtipocontrato: vista.cbTipoContratoCC.getValue(),
                        idsituacion: vista.tcbSituacionCC.getValue(),
                        fdesde: vista.dfFDesdeCC.getRawValue(),
                        fhasta: vista.dfFHastaCC.getRawValue(),
                        noalta: personaselect.noalta,
                        idespcargo: personaselect.idespcargo,
                        idprograma: personaselect.idprogramalaboral
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        let responseData = Ext.decode(r.responseText);
                        if (responseData == false)
                            mostrarMensaje(6, idioma.lbSaveFail);

                        vista.winCC.hide();
                        modelo.stPersonas.reload();
                        vista.gpPersonas.getSelectionModel().clearSelections();
                        if (node.attributes.idconcepto == 7) {
                            let parentNode = node.parentNode;
                            vista.tpEstructura.tree.getLoader().load(parentNode);
                            parentNode.expand(false, true);
                        } else {
                            vista.tpEstructura.tree.getLoader().load(node);
                            node.expand(false, true);
                        }
                    }
                });
            }
        }

        function efectuarBaja() {
            if (vista.fpDarBaja.getForm().isValid()) {
                Ext.getBody().mask(idioma.msgSaveData);
                let idsitlab;
                if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                    idsitlab = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data.idsituacionlaboralp;
                } else {
                    idsitlab = personaselect.idsituacionlaboralp;
                }
                acmn = 2;
                Ext.Ajax.request({
                    url: 'darBaja',
                    params: {
                        idsituacionlaboralp: idsitlab,
                        idmotivobaja: vista.tcbMotivoBaja.getValue(),
                        fecha: vista.dfHasta.getRawValue()
                    },
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        let responseData = Ext.decode(r.responseText);
                        if (responseData == false)
                            mostrarMensaje(6, idioma.lbDeleteFail);
                        else if (responseData == -1) {
                            mostrarMensaje(6, 'La persona seleccionada no fue dada de baja porque tiene algún medio asignado.');
                        } else {
                            mostrarMensaje(2, 'La persona fue dada de baja satisfactoriamente. ¿Desea generar el' +
                                    ' movimiento de n&oacute;mina?', function (btnPresionado) {
                                        if (btnPresionado == 'ok') {
                                            personaselect = responseData;
                                            objseleccionadas = new Array();
                                            objseleccionadas.push({data: responseData});
                                            Ext.getCmp('idbtnbtnReporteMovimientonomina').fireEvent('click');
                                        }
                                    });
                        }
                        vista.winDarBaja.hide();
                        if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                            vista.pProblemasDetectados.stProblemas.reload();
                        } else {
                            modelo.stPersonas.reload();
                            vista.gpPersonas.getSelectionModel().clearSelections();
                        }

                        if (node.attributes.idconcepto == 7) {
                            let parentNode = node.parentNode;
                            vista.tpEstructura.tree.getLoader().load(parentNode);
                            parentNode.expand(false, true);
                        } else {
                            vista.tpEstructura.tree.getLoader().load(node);
                            node.expand(false, true);
                        }
                        getCompletamiento((node.attributes.idconcepto) ? node.attributes.idconcepto : node.attributes.idtipo, node.attributes.id);
                    }
                });
            }
        }

        function guardarDatos() {
            if (vista.fpAlta.getForm().isValid()) {
                if (personaselect != null) {
                    let idcargo = null;
                    let cargo = null;
                    if (accion == 'add' && tiponodoestructura == 0) {
                        idcargo = node.id;
                        cargo = node.attributes.denominacion;
                    } else if (accion == 'mod') {
                        idcargo = vista.tcbCargosMod.getValue();
                        cargo = vista.tcbCargosMod.getRawValue();
                    }
                    Ext.getBody().mask(idioma.msgSaveData);
                    acmn = 1;
                    Ext.Ajax.request({
                        url: (accion == 'add' ? 'darAlta' : 'setAlta'),
                        params: {
                            idsituacionlaboralp: accion == 'add' ? -1 : personaselect.idsituacionlaboralp,
                            idtipocontrato: vista.cbTipoContrato.getValue(),
                            idprocedenciasocial: vista.cbProcedenciaSocial.getValue(),
                            idsituacion: vista.tcbSituacion.getValue(),
                            fdesde: vista.dfFDesde.getRawValue(),
                            fhasta: vista.dfFHasta.getRawValue(),
                            noalta: vista.tfNoAlta.getValue(),
                            principal: (vista.chbPrincipal.checked == true) ? 1 : 0,
                            idcargo: idcargo,
                            cargo: cargo,
                            idarea: (vista.tfArea.getValue()) ? idarea : null,
                            ueb: ueb,
                            identidad: identidad,
                            idpersona: personaselect.idpersona,
                            idcandidato: personaselect.idcandidato,
                            idespcargo: vista.cbCargosEsp.getValue(),
                            idprograma: vista.cbPrograma.getValue(),
                            idmodalidadempleo: vista.cbModalidadEmpleo.getValue(),
                            funciones: vista.tafunciones.getValue()

                        },
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            let responseData = Ext.decode(r.responseText);
                            if (responseData.error == -4)
                                mostrarMensaje(6, idioma.lbMsgRepSitEnt + responseData.cargo + ' del &aacute;rea ' + responseData.area + '.');
                            else if (responseData.error == -2)
                                mostrarMensaje(6, idioma.lbMsgRepPrincEnt + 'Cargo: ' + responseData.cargo + ' &aacute;rea: ' + responseData.area);
                            else if (responseData.error == -3)
                                mostrarMensaje(6, idioma.lbMsgRepCargoEnt + 'Cargo: ' + responseData.cargo + ' &aacute;rea: ' + responseData.area);
                            else if (responseData == false)
                                mostrarMensaje(6, idioma.lbSaveFail);
                            else {
                                vista.winAlta.hide();
                                vista.fpAlta.getForm().reset();
                                vista.tafunciones.setValue();
                                let parentNode = node.parentNode;
                                vista.tpEstructura.tree.getLoader().load(parentNode);
                                parentNode.expand(false, true);
                                if (accion == 'add') {
                                    modelo.stPersonas.baseParams.idestructura = null;
                                    modelo.stPersonas.baseParams.idcargo = node.id;
                                    modelo.stPersonas.baseParams.idconcepto = null;

                                    modelo.stPersonas.baseParams.arrayEst = null;
                                    modelo.stPersonas.baseParams.alta = null;
                                    modelo.stPersonas.removeAll();
                                    vista.btnBuscarPorCriterios.hide();
                                    vista.sfBuscar.show();
                                    vista.lbBuscarPers.show();
                                } else {
                                    if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                                        vista.pProblemasDetectados.stProblemas.reload();
                                    } else {
                                        vista.gpPersonas.getSelectionModel().clearSelections();
                                    }
                                }
                                if (reload == 1) {
                                    modelo.stPersonas.load({
                                        params: {
                                            start: 0,
                                            limit: modelo.stPersonas.lastOptions.params.limit,
                                            query: vista.sfBuscar.getValue()
                                        },
                                        callback: function () {
                                            if (accion == 'add') {
                                                mostrarMensaje(2, idioma.lbMsgSaveExito + ' Desea generar el movimiento de n&oacute;mina.', function (btnPresionado) {
                                                    if (btnPresionado == 'ok') {
                                                        let objsl = modelo.stPersonas.getById(parseInt(responseData.idsituacionlaboralp));
                                                        let objrec = [];
                                                        objrec.push(objsl);
                                                        vista.smselect.selectRecords(objrec);
                                                        Ext.getCmp('idbtnbtnReporteMovimientonomina').fireEvent('click');
                                                    }
                                                });
                                            }
                                            accion = '';
                                        }
                                    });
                                } else {
                                    modelo.stPersonas.load({
                                        params: {
                                            start: 0,
                                            limit: 15,
                                            query: vista.sfBuscar.getValue()
                                        },
                                        callback: function () {
                                            if (accion == 'add') {
                                                mostrarMensaje(2, idioma.lbMsgSaveExito + ' Desea generar el movimiento de n&oacute;mina.', function (btnPresionado) {
                                                    if (btnPresionado == 'ok') {
                                                        let objsl = modelo.stPersonas.getById(parseInt(responseData.idsituacionlaboralp));
                                                        let objrec = [];
                                                        objrec.push(objsl);
                                                        Ext.getCmp('idbtnbtnReporteMovimientonomina').fireEvent('click');
                                                    }
                                                });
                                            }
                                            accion = '';
                                        }
                                    });
                                }
                                buscar = false;
                            }
                        }
                    });
                } else {
                    mostrarMensaje(6, idioma.lbNoSelectPersona);
                }
            }
        }

        function eliminar(pest) {
            let mensaje = '';
            if (ids.length == 1) {
                mensaje = idioma.msgConfirmDeleteSin;
            } else {
                mensaje = idioma.msgConfirmDeletePlu;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.msgDeleting);
                    Ext.Ajax.request({
                        url: 'deletePersonaSitLab',
                        params: {arrayidsituacionlaboralp: Ext.encode(ids)},
                        callback: function () {
                        },
                        success: function (r) {
                            let responseData = Ext.decode(r.responseText);
                            Ext.getBody().unmask();
                            if (responseData == false) {
                                if (ids.length == 1) {
                                    mostrarMensaje(6, idioma.lbDeleteFailSin);
                                } else {
                                    mostrarMensaje(6, idioma.lbDeleteFailPlu);
                                }
                            } else {
                                if (ids.length == 1) {
                                    mostrarMensaje(1, idioma.lbMsgDeExitoSin);
                                } else {
                                    mostrarMensaje(1, idioma.lbMsgDeExitoPlu);
                                }
                            }
                            if (pest == 1) {
                                let parentNode = node.parentNode;
                                vista.tpEstructura.tree.getLoader().load(parentNode);
                                parentNode.expand(false, true);
                                vista.tpEstructura.tree.getSelectionModel().select(node);
                                modelo.stPersonas.reload();
                                if (node.attributes.idtipo == 7) {
                                    let parentNode = node.parentNode;
                                    vista.tpEstructura.tree.getLoader().load(parentNode);
                                    parentNode.expand(false, true);
                                }
                            } else {
                                vista.pProblemasDetectados.stProblemas.reload();
                            }
                        }
                    });
                }
            });
        }

        function actualizarCompletamiento() {
            Ext.getBody().mask(idioma.msgUpdatingPlantilla);
            Ext.Ajax.request({
                url: 'updateCompletamientoCargo',
                timeout: 1800000,
                params: {node: idnode},
                callback: function () {
                },
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    Ext.getBody().unmask();
                    if (responseData == true)
                        mostrarMensaje(1, idioma.msgUpdateSucces);
                    if (node) {
                        let parentNode = node.parentNode;
                        vista.tpEstructura.tree.getLoader().load(parentNode);
                        parentNode.expand(false, true);
                        vista.tpEstructura.tree.getSelectionModel().select(node);
                    } else {
                        let r = vista.tpEstructura.tree.getRootNode();
                        vista.tpEstructura.tree.getLoader().load(r);
                    }
                }
            });
        }

        function cargandoCompletamiento() {
            let datPers = {
                plantilla: 'Cargando...',
                indeterminados: 'Cargando...',
                determinados: 'Cargando...',
                total: 'Cargando...',
                porciento: 'Cargando...'
            };
            vista.plantillaCompletamiento.overwrite(vista.pCompletamiento.body, datPers);
        }
        function seleccioneCompletamiento() {
            let datPers = {
                plantilla: 'Seleccione...',
                indeterminados: 'Seleccione...',
                determinados: 'Seleccione...',
                total: 'Seleccione...',
                porciento: 'Seleccione...'
            };
            vista.plantillaCompletamiento.overwrite(vista.pCompletamiento.body, datPers);
        }

        function getCompletamiento(idconcepto, idnodo) {
            Ext.Ajax.request({
                url: 'getCompletamiento',
                timeout: 3600000,
                params: {idestructura: idnodo, concepto: idconcepto},
                callback: function () {
                },
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    let datPers = {
                        plantilla: responseData[0],
                        indeterminados: responseData[1],
                        determinados: responseData[2],
                        total: responseData[3],
                        porciento: responseData[4] + ' %'
                    };
                    vista.plantillaCompletamiento.overwrite(vista.pCompletamiento.body, datPers);
                }
            });
        }

        function mostrarFichaPersona(idpersona) {
            Ext.Ajax.request({
                url: 'getContenidoPlantillaFicha',
                timeout: 3600000,
                params: {idpersona: idpersona},
                callback: function () {
                },
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    if (responseData) {
                        let winficha = new PVD.Plantilla.Contenedor({
                            idplantilla: responseData,
                            idpersona: personaselect.idpersona,
                            idIframe: Ext.id(),
                            title: 'Ficha del trabajador',
                            margenes: '8, 8, 8, 8'
                        });
                        winficha.show();
                    } else {
                        mostrarMensaje(1, 'No se ha configurado plantilla para la ficha de la persona.');
                    }
                }
            });
        }

        function accionModificar() {
            Ext.getBody().mask('Cargando datos...');
            Ext.Ajax.request({
                url: 'getDatosSituacionLaboral',
                params: {idsituacionlaboralp: personaselect.idsituacionlaboralp},
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    let responseData = Ext.decode(r.responseText);
                    vista.winAlta.show();
                    idespcargo = responseData.idespcargo;
                    idarea = responseData.idarea;
                    identidad = responseData.identidad;
                    ueb = responseData.ueb;
                    Ext.getCmp('tf').setVisible(false);
                    Ext.getCmp('tfarea').setVisible(true);
                    let ch = (responseData.principal == 1);
                    vista.chbPrincipal.setValue(ch);
                    vista.dfFDesde.setValue(responseData.fdesde);
                    vista.dfFHasta.setValue(responseData.fhasta);
                    vista.tfNoAlta.setValue(responseData.noalta);
                    vista.cbPrograma.setRawValue(responseData.denominacion);
                    vista.cbPrograma.setValue(responseData.idprogramalaboral);
                    vista.tafunciones.setValue(responseData.funciones);

                    if (modelo.stTipoContrato.getById(responseData.idtipocontrato).data.determinado == 1) {
                        if (responseData.cantidad == responseData.cantidadreal || responseData.temporal == 1) {
                            if (modelo.stTipoContrato.getById(responseData.idtipocontrato).data.determinado == 0) {
                                vista.cbTipoContrato.reset();
                            }
                            filtrarContratosDeterminados();
                        }
                    }
                    if (responseData.idtipocontrato) {
                        vista.cbTipoContrato.setValue(responseData.idtipocontrato);
                        vista.cbTipoContrato.setRawValue(responseData.tipocontrato);
                        if (modelo.stTipoContrato.getById(responseData.idtipocontrato).data.determinado == 1) {
                            vista.dfFHasta.allowBlank = false;
                            vista.dfFHasta.enable();
                        } else {
                            vista.dfFHasta.allowBlank = true;
                            vista.dfFHasta.disable();
                        }
                    } else {
                        vista.cbTipoContrato.reset();
                    }
                    if (responseData.idprocedenciasocial) {
                        vista.cbProcedenciaSocial.setValue(responseData.idprocedenciasocial);
                        vista.cbProcedenciaSocial.setRawValue(responseData.procedencia);
                    } else {
                        vista.cbProcedenciaSocial.reset();
                    }
                    if (responseData.idmodalidadempleo) {
                        vista.cbModalidadEmpleo.setValue(responseData.idmodalidadempleo);
                        vista.cbModalidadEmpleo.setRawValue(responseData.modalidadempleo);
                    } else {
                        vista.cbModalidadEmpleo.reset();
                    }
                    vista.tcbSituacion.setValue(responseData.idsituacion);
                    vista.tcbSituacion.setRawValue(responseData.situacion);
                    if (personaselect.cargo) {
                        vista.tcbCargosMod.setValue(responseData.idcargo);
                        vista.tcbCargosMod.setRawValue(responseData.cargo);
                    } else {
                        vista.tcbCargosMod.reset();
                    }
                    vista.tcbCargosMod.tree.getLoader().load(vista.tcbCargosMod.tree.getRootNode());
                    vista.tfEntidad.setValue(responseData.entidad);
                    vista.tfArea.setValue(responseData.area);
                    if (responseData.idcargo) {
                        Ext.getCmp('tfarea').setVisible(true);
                        Ext.getCmp('tc').setVisible(true);
                        Ext.getCmp('tch').setVisible(true);
                        modelo.stCargosEsp.load({params: {idcargo: responseData.idcargo}});
                        vista.winAlta.setHeight(395);
                    } else {
                        Ext.getCmp('tfarea').setVisible(false);
                        Ext.getCmp('tc').setVisible(false);
                        Ext.getCmp('tch').setVisible(false);
                        vista.winAlta.setHeight(295);
                    }
                    vista.fpAlta.getForm().clearInvalid();
                    vista.fpAlta.doLayout();
                }
            });
        }

        function filtrarContratosDeterminados() {
            modelo.stTipoContrato.each(function (rec) {
                if (rec.data.determinado == 0) {
                    modelo.stTipoContrato.remove(rec);
                }
            });
        }

        //Manipulador de HotKeys
        let teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
                key: 'imhxelbg',
                alt: true,
                stopEvent: true,
                handler: function (k) {
                    switch (k) {
                        case 77:
                        { //m para modificar
                            if (vista.tabPanel.getActiveTab().id == 'actual' && !vista.btnModificar.disabled) {
                                accion = 'mod';
                                accionModificar();
                            }
                            break;
                        }
                        case 72:
                        { //h para ayuda
                            let title = idioma.titleAyuda;
                            let referencia = '';
                            help.show(title, referencia);
                            break;
                        }
                        case 88:
                        { //x para cancelar
                            if (!vista.btnCancelar.disabled && altashow == 1) {
                                if (node.attributes.idtipo == 7) {
                                    modelo.stPersonas.baseParams = {idcargo: node.id};
                                    modelo.stPersonas.baseParams.idestructura = '';
                                } else {
                                    modelo.stPersonas.baseParams = {idestructura: node.id};
                                    modelo.stPersonas.baseParams.idcargo = '';
                                }
                                if (tiponodoestructura == 1) {
                                    modelo.stPersonas.baseParams.idconcepto = 3;
                                } else {
                                    modelo.stPersonas.baseParams.idconcepto = null;
                                }
                                modelo.stPersonas.baseParams.arrayEst = null;
                                modelo.stPersonas.baseParams.alta = null;
                                modelo.stPersonas.removeAll();
                                modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
                                buscar = false;
                                vista.winAlta.hide();
                                vista.btnBuscarPorCriterios.hide();
                                vista.sfBuscar.show();
                                vista.lbBuscarPers.show();
                                accion = '';
                            } else if (!vista.btnCancelarMovimiento.disabled && movshow == 1) {
                                vista.gpPersonas.getSelectionModel().clearSelections();
                                vista.winMovimiento.hide();
                            } else if (!vista.btnCancelarBaja.disabled && bajashow == 1) {
                                vista.gpPersonas.getSelectionModel().clearSelections();
                                vista.winDarBaja.hide();
                            }
                            break;
                        }
                        case 69:
                        { //e para exportar
                            if (!vista.btnVer.disabled) {
                                let tcont = modelo.stTipoContrato.getById(personaselect.idtipocontrato);
                                if (personaselect.idtipocontrato && tcont.data.idplantilla) {
                                    let winc = new PVD.Plantilla.Contenedor({
                                        idplantilla: tcont.data.idplantilla,
                                        idpersona: personaselect.idpersona,
                                        title: 'Contrato de trabajo',
                                        margenes: '8, 8, 8, 8'
                                    });
                                    winc.show();
                                    winc.maximize();
                                } else {
                                    mostrarMensaje(1, idioma.msgNoPlantilla);
                                }
                            }
                            break;
                        }
                        case 76:
                        { //l para limpiar
                            if (vista.tabPanel.getActiveTab().id == 'actual' && vista.sfBuscar.getValue() !== '') {
                                vista.sfBuscar.onTrigger1Click();
                            }
                            break;
                        }
                        case 66:
                        { //b para buscar
                            if (vista.tabPanel.getActiveTab().id == 'actual' && vista.sfBuscar.getValue() !== '') {
                                vista.sfBuscar.onTrigger2Click();
                            }
                            break;
                        }
                        case 71:
                        { //g para guardar
                            if (vista.btnAceptar.isVisible() && altashow == 1) {
                                guardarDatos();
                            }
                            break;
                        }
                    }
                }
            }, {
                key: 46, //del para eliminar
                fn: function () {
                    if (!vista.btnEliminar.disabled && vista.tabPanel.getActiveTab().id == 'actual') {
                        ids.length = 0;
                        let s = vista.gpPersonas.getSelectionModel().getSelections();
                        for (i = 0; i < s.length; i++) {
                            ids.push(s[i].data.idsituacionlaboralp);
                        }
                        eliminar(1);
                    }
                }
            }, {
                key: 13, //enter para aceptar
                fn: function () {
                    if (vista.btnAceptarMovimiento.isVisible() && movshow == 1) {
                        realizarMovimiento();
                    } else if (vista.btnAceptarBaja.isVisible() && bajashow == 1) {
                        efectuarBaja();
                    }
                }
            }, {
                key: 'z',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (vista.tabPanel.getActiveTab().id == 'problemasdetectados') {
                        vista.pProblemasDetectados.btnActualizar.handler();
                    } else if (!vista.btnSyncCargos.disabled) {
                        actualizarCompletamiento();
                    }
                }
            }, {
                key: 'b',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!vista.btnBaja.disabled) {
                        vista.winDarBaja.show();
                        vista.tcbMotivoBaja.setRawValue('');
                        vista.dfHasta.reset();
                        vista.fpDarBaja.getForm().clearInvalid();
                    }
                }
            }, {
                key: 'w',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!vista.btnMovimiento.disabled && vista.tabPanel.getActiveTab().id == 'acual') {
                        cargarDatosSitLabMov(personaselect.idsituacionlaboralp);
                    } else if (!vista.pProblemasDetectados.btnMovimientoPD.disabled) {
                        let problema = vista.pProblemasDetectados.gpProblemas.getSelectionModel().getSelected().data;
                        cargarDatosSitLabMov(problema.idsituacionlaboralp);
                    }
                }
            }, {
                key: 'q',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!vista.btnAlta.disabled) {
                        if (vista.gpPersonas.store.id !== 'stpers1') {
                            vista.gpPersonas.store.removeAll();
                            vista.gpPersonas.reconfigure(modelo.stPersonas, vista.columnasgp);
                        }
                        vista.pPersonas.doLayout();
                        idarea = node.parentNode.id;
                        //Buscar entidad
                        Ext.getBody().mask('Por favor espere. Cargando datos...');
                        Ext.Ajax.request({
                            url: 'getEntidadByCargo',
                            params: {idcargo: node.id},
                            callback: function () {
                                Ext.getBody().unmask();
                            },
                            success: function (r) {
                                let responseData = Ext.decode(r.responseText);
                                if (responseData.length > 0) {
                                    entidad = responseData[0];
                                    vista.tfEntidad.setValue(entidad.denominacion);
                                    identidad = responseData[0].idestructura;
                                    Ext.Ajax.request({
                                        url: 'dameConfiguracionEstructura',
                                        params: {identidad: identidad},
                                        success: function (r) {
                                            let responseData = Ext.decode(r.responseText);
                                            ueb = null;
                                            if (responseData.length > 0 && tiponodoestructura == 0) {
                                                let nodeact = node;
                                                let posible_ueb;
                                                while (nodeact.isRoot !== true && (nodeact.attributes._parent !== nodeact.id || nodeact.attributes.idpadre !== nodeact.id)) {
                                                    if (nodeact.attributes.idconcepto == 5 || nodeact.attributes.idtipo == 5) {
                                                        posible_ueb = nodeact;
                                                        for (i = 0; i < responseData.length; i++) {
                                                            if (responseData[i].idestructura == posible_ueb.id) {
                                                                ueb = posible_ueb.id;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    nodeact = nodeact.parentNode;
                                                }
                                            }
                                            if (parseInt(node.attributes.cantidad) <= parseInt(node.attributes.cantidad_real)) {
                                                let temporal = vista.tpEstructura.dameSeleccion().attributes.temporal;
                                                if (temporal == 0) {
                                                    mostrarMensaje(2, idioma.msgNoCapacidad, function (btnPress) {
                                                        if (btnPress == 'ok') {
                                                            vista.fpAlta.getForm().reset();
                                                            vista.tafunciones.setValue();
                                                            forzar = 1;
                                                            accion = 'add';
                                                            let winBuscarPersona = new Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona({
                                                                title: 'Buscar persona',
                                                                constrain: true,
                                                                modal: true,
                                                                closeAction: 'close',
                                                                idioma: idioma,
                                                                modelo: modelo
                                                            });
                                                            winBuscarPersona.show();
                                                            winBuscarPersona.on('critbusqaceptado', function (numid, nombre, papel, sapel, tipoFiltro) {
                                                                vista.btnBuscarPorCriterios.show();
                                                                vista.sfBuscar.hide();
                                                                vista.lbBuscarPers.hide();
                                                                vista.fpAlta.getForm().reset();
                                                                vista.tafunciones.setValue();
                                                                modelo.stPersonas.baseParams.idestructura = '';
                                                                modelo.stPersonas.baseParams.idcargo = node.id;
                                                                modelo.stPersonas.baseParams.arrayEst = Ext.encode(arrayidestr);
                                                                modelo.stPersonas.baseParams.alta = tipoFiltro;
                                                                modelo.stPersonas.removeAll();
                                                                modelo.stPersonas.load({
                                                                    params: {
                                                                        start: 0,
                                                                        limit: 15,
                                                                        numid: numid,
                                                                        nombre: nombre,
                                                                        papel: papel,
                                                                        sapel: sapel
                                                                    }
                                                                });
                                                                buscar = true;
                                                                vista.btnAlta.disable();
                                                                forzar = 1;
                                                                accion = 'add';
                                                                altamod = tipoFiltro;
                                                                numidmod = numid;
                                                                nombremod = nombre;
                                                                papelmod = papel;
                                                                sapelmod = sapel;
                                                            });
                                                            winBuscarPersona.on('critbusreserva', function () {
                                                                let colums = new Ext.grid.ColumnModel([
                                                                    {header: 'No. registro', width: 30, dataIndex: 'idpersona', hidden: 'true'},
                                                                    {header: 'No. de identidad', width: 30, dataIndex: 'numid', align: 'center'},
                                                                    {header: 'Nombres y Apellidos', width: 150, dataIndex: 'nombreyapellidos'},
                                                                    {header: 'Clasificación', width: 30, dataIndex: 'clasificacion', align: 'center'},
                                                                    {header: 'Preparación', width: 28, dataIndex: 'preparacion', align: 'center'},
                                                                    {header: 'Fecha inicio', width: 20, dataIndex: 'fdesde', align: 'center'},
                                                                    {header: 'Fecha fin', width: 20, dataIndex: 'fhasta', align: 'center'},
                                                                    {width: 10, hidden: true, dataIndex: 'entidad_area', renderer: mostrarAreaRe}
                                                                ]);
                                                                let storegp = new Ext.data.GroupingStore({
                                                                    url: '/pvd/movimientoslaborales/index.php/reserva/getReserva',
                                                                    reader: new Ext.data.JsonReader(
                                                                            {root: "datos", totalProperty: "cantidad"},
                                                                            [
                                                                                {name: 'idreserva'},
                                                                                {name: 'idpersona'},
                                                                                {name: 'numid'},
                                                                                {name: 'nombreyapellidos'},
                                                                                {name: 'clasificacion'},
                                                                                {name: 'preparacion'},
                                                                                {name: 'cargo'},
                                                                                {name: 'idcargo'},
                                                                                {name: 'area'},
                                                                                {name: 'idarea'},
                                                                                {name: 'identidad'},
                                                                                {name: 'entidad_area'},
                                                                                {name: 'fdesde'},
                                                                                {name: 'fhasta'},
                                                                                {name: 'idprocedenciasocial'},
                                                                                {name: 'procedencia'}
                                                                            ]
                                                                            ),
                                                                    sortInfo: {
                                                                        field: 'entidad_area',
                                                                        direction: "DESC"
                                                                    },
                                                                    groupField: 'entidad_area',
                                                                    listeners: {
                                                                        load: function (st, data) {
                                                                            if (data.length == 0) {
                                                                                mostrarMensaje(1, "No existen datos que se correspondan con el(los) criterio(s) de búsqueda especificado(s).");
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                                vista.gpPersonas.reconfigure(storegp, colums);
                                                                vista.gpPersonas.doLayout();
                                                                storegp.idestructura = entidad;
                                                                storegp.baseParams.idcargo = vista.tpEstructura.dameSeleccion().attributes.id;
                                                                storegp.load({params: {start: 0, limit: 15}});
                                                            });
                                                        } else {
                                                            forzar = 0;
                                                        }
                                                    });
                                                } else {
                                                    mostrarMensaje(2, idioma.msgNoAlta);
                                                }
                                            } else {
                                                forzar = 0;
                                                accion = 'add';
                                                let winBuscarPersona = new Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona({
                                                    title: 'Buscar persona',
                                                    constrain: true,
                                                    modal: true,
                                                    closeAction: 'close',
                                                    idioma: idioma,
                                                    modelo: modelo
                                                });
                                                winBuscarPersona.show();
                                                winBuscarPersona.on('critbusqaceptado', function (numid, nombre, papel, sapel, tipoFiltro) {
                                                    vista.btnBuscarPorCriterios.show();
                                                    vista.sfBuscar.hide();
                                                    vista.lbBuscarPers.hide();
                                                    vista.fpAlta.getForm().reset();
                                                    vista.tafunciones.setValue();
                                                    modelo.stPersonas.baseParams.idestructura = '';
                                                    modelo.stPersonas.baseParams.idcargo = (tiponodoestructura == 0) ? node.id : null;
                                                    modelo.stPersonas.baseParams.arrayEst = Ext.encode(arrayidestr);
                                                    modelo.stPersonas.baseParams.alta = tipoFiltro;
                                                    modelo.stPersonas.removeAll();
                                                    modelo.stPersonas.load({
                                                        params: {
                                                            start: 0,
                                                            limit: 15,
                                                            numid: numid,
                                                            nombre: nombre,
                                                            papel: papel,
                                                            sapel: sapel
                                                        }
                                                    });
                                                    buscar = true;
                                                    vista.btnAlta.disable();
                                                    forzar = 0;
                                                    accion = 'add';
                                                    altamod = tipoFiltro;
                                                    numidmod = numid;
                                                    nombremod = nombre;
                                                    papelmod = papel;
                                                    sapelmod = sapel;
                                                });
                                                winBuscarPersona.on('critbusreserva', function () {
                                                    let colums = new Ext.grid.ColumnModel([
                                                        {header: 'No. registro', width: 30, dataIndex: 'idpersona', hidden: 'true'},
                                                        {header: 'No. de identidad', width: 30, dataIndex: 'numid', align: 'center'},
                                                        {header: 'Nombres y Apellidos', width: 150, dataIndex: 'nombreyapellidos'},
                                                        {header: 'Clasificación', width: 30, dataIndex: 'clasificacion', align: 'center'},
                                                        {header: 'Preparación', width: 28, dataIndex: 'preparacion', align: 'center'},
                                                        {header: 'Fecha inicio', width: 20, dataIndex: 'fdesde', align: 'center'},
                                                        {header: 'Fecha fin', width: 20, dataIndex: 'fhasta', align: 'center'},
                                                        {hidden: true, dataIndex: 'entidad_area', renderer: mostrarAreaRe}
                                                    ]);
                                                    let storegp = new Ext.data.GroupingStore({
                                                        url: '/pvd/movimientoslaborales/index.php/reserva/getReserva',
                                                        reader: new Ext.data.JsonReader(
                                                                {root: "datos", totalProperty: "cantidad"},
                                                                [
                                                                    {name: 'idreserva'},
                                                                    {name: 'idpersona'},
                                                                    {name: 'numid'},
                                                                    {name: 'nombreyapellidos'},
                                                                    {name: 'clasificacion'},
                                                                    {name: 'preparacion'},
                                                                    {name: 'cargo'},
                                                                    {name: 'idcargo'},
                                                                    {name: 'area'},
                                                                    {name: 'idarea'},
                                                                    {name: 'identidad'},
                                                                    {name: 'entidad_area'},
                                                                    {name: 'fdesde'},
                                                                    {name: 'fhasta'},
                                                                    {name: 'idprocedenciasocial'}
                                                                ]
                                                                ),
                                                        sortInfo: {
                                                            field: 'entidad_area',
                                                            direction: "DESC"
                                                        },
                                                        groupField: 'entidad_area',
                                                        listeners: {
                                                            load: function (st, data) {
                                                                if (data.length == 0) {
                                                                    mostrarMensaje(1, "No existen datos que se correspondan con el(los) criterio(s) de búsqueda especificado(s).");
                                                                }
                                                            }
                                                        }
                                                    });
                                                    vista.gpPersonas.reconfigure(storegp, colums);
                                                    vista.gpPersonas.doLayout();
                                                    storegp.idestructura = entidad;
                                                    storegp.baseParams.idcargo = vista.tpEstructura.dameSeleccion().attributes.id;
                                                    storegp.load({
                                                        params: {start: 0, limit: 15}
                                                    });
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    mostrarMensaje(6, 'No se puede continuar debido a que no fue encontrada la entidad.');
                                }
                            }
                        });
                        vista.fpAlta.doLayout();
                    }
                }
            }
        ]);
        Ext.getCmp('btnListadoReqCargos').on('click', function () {
            let idIframe = Ext.id();
            new Ext.Window({
                title: 'Listado de personas que no cumplen requisitos del cargo',
                width: 800,
                height: 500,
                id: 'winnonivel',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarListadoNivelCargo?idestructura=' + node.id
                    }
                }
            }).show();
            Ext.getCmp('winnonivel').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });

        Ext.getCmp('btnListadoCuadros').on('click', function () {
            let idIframe = Ext.id();
            new Ext.Window({
                title: 'Listado de Cuadros',
                width: 800,
                height: 500,
                id: 'winnonivel',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarListadoCuadros?idestructura=' + node.id
                    }
                }
            }).show();
            Ext.getCmp('winnonivel').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });

        Ext.getCmp('btnPlazasaprobadasyCubiertas').on('click', function () {
            let idIframe = Ext.id();
            let maskId = 'mask_' + Ext.id(); // ID único para la máscara
    
            new Ext.Window({
                title: 'Reporte de Cantidad de Plazas Aprobadas y Cubiertas',
                width: 800,
                height: 500,
               // id: 'winnonivel',
                id: 'winnonivel_' + Ext.id(), // ID único para la ventana
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarReporteEstructuraComposicion?idestructura=' + node.id
                    }
                },
                listeners: {
                    beforeclose: function() {
                    // Ocultar máscara si se cierra la ventana
                    try { PVD.ocultarMascara(maskId); } catch(e) {}
                    }
                }
            }).show();
            /*Ext.getCmp('winnonivel').maximize();
            PVD.mostrarMascara(maskId, 'Por favor espere...', 'Generando reporte de plazas aprobadas y cubiertas');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara(maskId);
            }*/

        Ext.getCmp('winnonivel_' + Ext.id()).maximize(); // Esto tiene error, mejor:
            
            // Mejor obtener la ventana recién creada
            let win = Ext.getCmp('winnonivel_' + Ext.id());
            if (win) win.maximize();
            
            PVD.mostrarMascara(maskId, 'Por favor espere...', 'Generando reporte de plazas aprobadas y cubiertas');
            
            let timeoutId = setTimeout(function() {
                try {
                    PVD.ocultarMascara(maskId);
                    Ext.Msg.alert('Aviso', 'El reporte está tardando más de lo esperado.');
                } catch(e) {}
            }, 45000);
            
            document.getElementById(idIframe).onload = function () {
                clearTimeout(timeoutId);
                try { PVD.ocultarMascara(maskId); } catch(e) {}
            };
            document.getElementById(idIframe).onerror = function () {
                    clearTimeout(timeoutId);
                    try { PVD.ocultarMascara(maskId); } catch(e) {}
                    Ext.Msg.alert('Error', 'No se pudo cargar el reporte.');
                };
        });

        Ext.getCmp('btnListadoFunciones').on('click', function () {
            let idIframe = Ext.id();
            new Ext.Window({
                title: 'Funciones específicas',
                width: 800,
                height: 500,
                id: 'winfunciones',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/generarReporteFuncionesespecificas?idsituacionlaboralp=' + personaselect.idsituacionlaboralp
                    }
                }
            }).show();
            Ext.getCmp('winfunciones').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });

        Ext.getCmp('idbtnbtnReporteMovimientonomina').on('click', function () {
            var datosper = new Array();
            acmn = 1;
            Ext.each(objseleccionadas, function (rec) {
                if (rec.data.faltaentidad !== rec.data.fdesde) {
                    acmn = 3;
                }
                datosper.push({
                    idpersona: rec.data.idpersona,
                    idestructura: rec.data.identidad,
                    idsl: rec.data.idsituacionlaboralp,
                    idcargo: rec.data.idcargo,
                    accion: acmn
                });
            });
            var params = Ext.urlEncode({
                datos: Ext.encode(datosper)
            });
            let idIframe = Ext.id();
            new Ext.Window({
                title: 'Movimiento de nómina',
                width: 800,
                height: 500,
                id: 'winmovimientonomina',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/exportarMovimientonomina?' + params
                    }
                }
            }).show();
            Ext.getCmp('winmovimientonomina').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte de movimiento de nómina');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
                acmn = 1;
            }
        });

        Ext.getCmp('idbtnanexo3').on('click', function () {
            let idIframe = Ext.id();
            new Ext.Window({
                title: 'Control de trabajadores con m&aacute;s de un contrato',
                width: 800,
                height: 500,
                id: 'winanexo3',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host + '/pvd/movimientoslaborales/index.php/movimientopersona/exportarAnexo3?idestructura=' + idnode
                    }
                }
            }).show();
            Ext.getCmp('winanexo3').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte de Control de trabajadores con m&aacute;s de un contrato');
            document.getElementById(idIframe).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        });

        Ext.getCmp('btnImportarExistencia').on('click', function (n) {
            importar();
        });

        function importar() {
            if (!winImp) {
                var fpbuscar = new Ext.FormPanel({
                    labelAlign: 'top',
                    frame: true,
                    fileUpload: true,
                    bodyStyle: 'padding:5px 5px 0',
                    items: new Ext.form.FileUploadField({
                        fieldLabel: 'Archivo (.json)',
                        name: 'fileUpload',
                        id: 'fileUpload',
                        allowBlank: false,
                        anchor: '100%'
                    })
                });

                var winImp = new Ext.Window({
                    modal: false,
                    closeAction: 'hide',
                    layout: 'fit',
                    title: 'Importar existencia',
                    width: 400,
                    height: 150,
                    items: fpbuscar,
                    buttons: [{
                            tooltip: 'Cerrar ventana sin guardar los datos',
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            handler: function () {
                                winImp.close();
                            }
                        }, {
                            tooltip: 'Guardar datos y cerrar ventana',
                            iconCls: 'aceptar',
                            text: 'Aceptar',
                            handler: function () {
                                importarExistencia(fpbuscar, winImp);
                            }
                        }
                    ]
                });
            }
            fpbuscar.getForm().reset();
            winImp.show();
        }

        function importarExistencia(fpbuscar, winImp) {
            if (Ext.getCmp('fileUpload').getValue() != '') {
                Ext.getBody().mask('Importando datos...');
            }

            fpbuscar.getForm().submit({
                url: 'importarExistenciaFT',
                timeout: 3600000,
                params: {
                    idestructura: node.id
                },
                success: function () {
                    Ext.getBody().unmask();
                    mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente.');
                    modelo.stPersonas.reload();
                    winImp.close();
                },
                failure: function (form, action) {
                    Ext.getBody().unmask();
                    mostrarMensaje(6, action.result.mensaje);
                    winImp.close();
                }
            });
        }

        Ext.getCmp('idTrasladoEnviar').on('click', function () {
            modelo.stConfigUEB.load();
            vista.winEnvioTraslado.show();
        });

        vista.btnCancelarEnvioTraslado.on('click', function () {
            vista.gpEnvioTrasladoUEB.getSelectionModel().clearSelections();
            vista.winEnvioTraslado.hide();
        });

        vista.gpEnvioTrasladoUEB.getSelectionModel().on('rowselect', function () {
            vista.btnAceptarEnvioTraslado.enable();
        });

        vista.gpEnvioTrasladoUEB.getSelectionModel().on('rowdeselect', function () {
            vista.btnAceptarEnvioTraslado.disable();
        });

        vista.btnAceptarEnvioTraslado.on('click', function () {
            Ext.getBody().mask('Por favor espere. Guardando datos...');
            Ext.Ajax.request({
                url: 'guardarTrasladoEnvio',
                params: {
                    idpersona: vista.gpPersonas.getSelectionModel().getSelected().data.idpersona,
                    idsituacionlaboral: vista.gpPersonas.getSelectionModel().getSelected().data.idsituacionlaboralp,
                    idueb: vista.gpEnvioTrasladoUEB.getSelectionModel().getSelected().data.idestructura
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    let respuestaGuardarTraslado = Ext.decode(r.responseText);
                    if (respuestaGuardarTraslado) {
                        mostrarMensaje(1, 'Los datos del traslado se han guardado satisfactoriamente.');
                        vista.winEnvioTraslado.hide();
                    } else {
                        mostrarMensaje(6, 'Ocurrio un error mientras se guardaban los datos del traslado.');
                    }
                    vista.gpEnvioTrasladoUEB.getSelectionModel().clearSelections();
                }
            });
        });

        Ext.getCmp('idConfirmarTraslado').on('click', function () {
            modelo.stConfirmarTraslados.load();
            vista.winConfirmarTraslado.show();
            vista.gpConfirmarTrasladoUEB.getSelectionModel().clearSelections();
        });

        vista.btnCancelarConfirmarTraslado.on('click', function () {
            vista.gpConfirmarTrasladoUEB.getSelectionModel().clearSelections();
            vista.winConfirmarTraslado.hide();
        });

        vista.gpConfirmarTrasladoUEB.getSelectionModel().on('rowselect', function () {
            vista.btnConfirmarTraslado.enable();
        });

        vista.gpConfirmarTrasladoUEB.getSelectionModel().on('rowdeselect', function () {
            vista.btnConfirmarTraslado.disable();
        });

        vista.btnConfirmarTraslado.on('click', function () {
            traslado = true;
            personaselect = {identidad: vista.gpConfirmarTrasladoUEB.getSelectionModel().getSelected().data.idueb};
            cargarDatosSitLabMov(vista.gpConfirmarTrasladoUEB.getSelectionModel().getSelected().data.idsituacionlaboral);
            vista.winConfirmarTraslado.hide();
        });

        vista.winMovimiento.on('hide', function () {
            if (traslado) {
                traslado = false;
                vista.gpConfirmarTrasladoUEB.getSelectionModel().clearSelections();
            }
        });
    }
};