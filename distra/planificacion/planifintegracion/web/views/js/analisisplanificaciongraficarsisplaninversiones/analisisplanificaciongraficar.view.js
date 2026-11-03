/*analisisinversiones.view.js
 * Vista para analisis
 * @author: Yanila Morfa
 * @package: Plataforma Integral de Planificacion
 * @subpackage:
 * @copyright: 
 * @version: 1.0-0
 */
Utilidades.Cmp.CmpGrafica = function (opciones) {

    var _this = this;
    this.identidad = opciones.nodeEntidad;
    this.arbolEntidad = opciones.arbolEntidad;
    this.componente = opciones.componente;
    this.cantelementosporpagina = 2;
    this.start = 0;
    this.total = 0;
    this.pagina = 1;
    this.objci = {};
    this.rectora = 0;
    this.objci.acciones = [];
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            _this.objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        if (_this.objci.acciones.rector == true) {
            _this.rectora = 1;
        } else {
            _this.rectora = 0;
        }
    });
    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        monitorResize: true,
        isValidParent: function (c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        onLayout: function (ct, target) {
            var rs = ct.items.items, len = rs.length, r, i;
            if (!this.innerCt) {
                target.addClass('ux-row-layout-ct');
                this.innerCt = target.createChild({cls: 'x-row-inner'});
            }
            this.renderAll(ct, this.innerCt);
            var size = target.getViewSize();
            if (size.width < 1 && size.height < 1) {
                return;
            }
            var h = size.height - target.getPadding('tb'),
                    ph = h;
            this.innerCt.setSize({height: h});
            for (i = 0; i < len; i++) {
                r = rs[i];
                if (!r.rowHeight) {
                    ph -= (r.getSize().height + r.getEl().getMargins('tb'));
                }
            }
            ph = ph < 0 ? 0 : ph;
            for (i = 0; i < len; i++) {
                r = rs[i];
                if (r.rowHeight) {
                    r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
                }
            }
        }
    });
    Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
    Ext.QuickTips.init();
    /****combo ejercicio***************/
    this.stCbejercicio = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarEjercicios',
        autoLoad: true,
        listeners: {
            load: function (t, n, e) {
                _this.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                _this.start = 0;
                _this.pagina = 1;
                _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
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
                name: 'idestado'
            }])
    });
    this.cmbEjercicio = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        width: 70,
        store: _this.stCbejercicio,
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
        allowBlank: false,
        listeners: {
            select: function (cb, rec, index) {
                _this.start = 0;
                _this.pagina = 1;
                _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
            }
        }
    });

    this.chkGlobal = new Ext.form.Checkbox({
        id: 'idchkGlobal',
        align: 'right',
        boxLabel: 'Global',
        listeners: {
            check: function (ck, t) {
                _this.start = 0;
                _this.pagina = 1;
                _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
            }
        }
    });
    /****************paginado graficas********************/
    this.paginado = new Ext.form.Label({
        xtype: "label",
        text: ''
    });
    this.btnultimapagina = new Ext.Button({
        id: 'btnultimapagina',
        iconCls: 'ultimapagina',
        disabled: true,
        hidden: true,
        tooltip: 'Última página',
        handler: function () {
            var base = (_this.total / _this.cantelementosporpagina).toFixedDown(0);
            var mod = _this.total % _this.cantelementosporpagina;
            _this.pagina = base + (mod > 0 ? 1 : 0);
            _this.start = (_this.pagina - 1) * _this.cantelementosporpagina;
            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
        }
    });
    this.btnprimerapagina = new Ext.Button({
        id: 'btnprimerapagina',
        iconCls: 'primerapagina',
        disabled: true,
        hidden: true,
        tooltip: 'Primera página',
        handler: function () {
            _this.start = 0;
            _this.pagina = 1;
            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
        }
    });
    this.btnsiguiente = new Ext.Button({
        id: 'btnsiguiente',
        iconCls: 'siguiente',
        disabled: true,
        hidden: true,
        tooltip: 'Siguiente',
        handler: function () {
            _this.pagina = _this.pagina + 1;
            _this.start = (_this.pagina - 1) * _this.cantelementosporpagina;
            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
        }
    });
    this.btnanterior = new Ext.Button({
        id: 'btnanterior',
        iconCls: 'anterior',
        disabled: true,
        hidden: true,
        tooltip: 'Anterior',
        handler: function () {
            _this.pagina = _this.pagina - 1;
            _this.start = (_this.pagina - 1) * _this.cantelementosporpagina;
            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
        }
    });
    this.stOrden = [
        [1, 'DESC'],
        [2, 'ASC']];
    this.cmbOrden = new Ext.form.ComboBox({
        id: 'cmbOrden',
        store: _this.stOrden,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        editable: false,
        width: 60,
        value: 1,
        listeners: {
            select: function (combo, record, index) {
                _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
            }
        }
    });
    this.panelPag = new Ext.Panel({
        title: 'Paginado',
        border: true,
        layout: 'fit',
        height: 53,
        region: 'south',
        bbar: [_this.btnprimerapagina, '-', _this.btnanterior, '-', _this.btnsiguiente, '-', _this.btnultimapagina, '-', 'Orden', _this.cmbOrden, '->', _this.paginado]
    });
    /****************filtros graficas********************/
    //Combo de planes
    this.stCmbPlanes = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarPlanes',
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function () {
                _this.CmbPlanes.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idmodelo',
            root: 'data'
        },
                [{
                        name: 'idmodelo'
                    }, {
                        name: 'denominacion'
                    }])
    });
    this.CmbPlanes = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        hideLabel: true,
        store: _this.stCmbPlanes,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        id: 'CmbPlanes',
        listeners: {
            select: function (combo, record, index) {
                _this.start = 0;
                _this.pagina = 1;
            }
        }
    });
    //Combo de CB
    this.stCB = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarCB',
        reader: new Ext.data.JsonReader({
            id: 'identidad',
            root: 'data'
        },
                [{
                        name: 'denominacion'
                    }, {
                        name: 'identidad'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function (r, e, u) {
                _this.cbCB.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        }
    });
    this.cbCB = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false,
        hideLabel: true,
        store: _this.stCB,
        valueField: 'identidad',
        displayField: 'denominacion',
        id: 'cbCB',
        listeners: {
            select: function (combo, record, index) {
                _this.start = 0;
                _this.pagina = 1;
            }
        }
    });
    //Combo VA
    this.stVia = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarVias',
        reader: new Ext.data.JsonReader({
            id: 'idviaadquisicion',
            root: 'data'
        },
                [{
                        name: 'denominacion'
                    }, {
                        name: 'idviaadquisicion'
                    }, {
                        name: 'uriviaadquisicion'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function (r, e, u) {
                _this.cbVia.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        }
    });
    this.cbVia = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false,
        hideLabel: true,
        store: _this.stVia,
        valueField: 'idviaadquisicion',
        displayField: 'denominacion',
        id: 'cbVia',
        listeners: {
            select: function (combo, record, index) {
                _this.start = 0;
                _this.pagina = 1;
            }
        }

    });
    //Combo OS
    this.stOS = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarOrganos',
        reader: new Ext.data.JsonReader({
            id: 'idorganosatisface',
            root: 'data'
        },
                [{
                        name: 'denominacion'
                    }, {
                        name: 'idorganosatisface'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function (r, e, u) {
                _this.cbOS.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        }
    });
    this.cbOS = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false,
        hideLabel: true,
        store: _this.stOS,
        valueField: 'idorganosatisface',
        displayField: 'denominacion',
        id: 'cbOS',
        listeners: {
            select: function (combo, record, index) {
                _this.start = 0;
                _this.pagina = 1;
            }
        }
    });
    //Combo UM
    this.stUM = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarUM',
        reader: new Ext.data.JsonReader({
            id: 'idunidadmedida',
            root: 'data'
        },
                [{
                        name: 'denominacionunidadmedida'
                    }, {
                        name: 'idunidadmedida'
                    }, {
                        name: 'abreviaturaunidadmedida'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function (r, e, u) {
                _this.cbUM.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        }
    });
    this.cbUM = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false,
        hideLabel: true,
        store: _this.stUM,
        valueField: 'idunidadmedida',
        displayField: 'denominacionunidadmedida',
        id: 'cbUM',
        listeners: {
            select: function (combo, record, index) {
                _this.start = 0;
                _this.pagina = 1;
            }
        }
    });
    //Combo de especialidades
    this.stEsp = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarEspecialidades',
        reader: new Ext.data.JsonReader({
            id: 'id',
            root: 'data'
        },
                [{
                        name: 'denominacion'
                    }, {
                        name: 'id'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function (r, e, u) {
                _this.cbEsp.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        }
    });
    this.cbEsp = new Ext.ux.form.LovCombo({
        tabIndex: 10,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        anchor: '95%',
        mode: 'local',
        editable: true,
        disabled: true,
        triggerAction: 'all',
        typeAhead: true,
        selectOnFocus: false,
        hideLabel: true,
        store: _this.stEsp,
        valueField: 'id',
        displayField: 'denominacion',
        id: 'cbEsp',
        listeners: {
            select: function (combo, record, index) {
                _this.start = 0;
                _this.pagina = 1;
            }
        }
    });
    this.btnlimpiarFilt = new Ext.Button({
        id: 'btnlimpiarFilt',
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtros',
        handler: function () {
            _this.cbEsp.clearValue();
            _this.CmbPlanes.clearValue();
            _this.cbCB.clearValue();
            _this.cbVia.clearValue();
            _this.cbOS.clearValue();
            _this.cbUM.clearValue();
            _this.start = 0;
            _this.pagina = 1;
            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
        }
    });
    this.panelFilt = new Ext.Panel({
        border: true,
        title: 'Filtros',
        layout: 'column',
        region: 'center',
        items: [
            {
                columnWidth: .50,
                border: false,
                bodyStyle: 'paddingTop: 10px; paddingLeft: 10px;',
                layout: 'form',
                items: [{xtype: 'label', text: 'Plan: '}, {
                        bodyStyle: 'paddingTop: 3px;',
                        border: false
                    }, _this.CmbPlanes,
                    {bodyStyle: 'paddingTop: 10px;', border: false}, {
                        xtype: 'label',
                        text: 'Vía de adquisición: '
                    }, {bodyStyle: 'paddingTop: 3px;', border: false}, _this.cbVia,
                    {bodyStyle: 'paddingTop: 3px;', border: false}, {
                        xtype: 'label',
                        text: 'Unidad de medida: '
                    }, {bodyStyle: 'paddingTop: 3px;', border: false}, _this.cbUM]
            },
            {
                columnWidth: .50,
                border: false,
                bodyStyle: 'paddingTop: 10px;',
                layout: 'form',
                items: [{xtype: 'label', text: 'Centro de balance: '}, {
                        bodyStyle: 'paddingTop: 3px;',
                        border: false
                    }, _this.cbCB,
                    {bodyStyle: 'paddingTop: 10px;', border: false}, {
                        xtype: 'label',
                        text: 'Órgano que satisface: '
                    }, {bodyStyle: 'paddingTop: 3px;', border: false}, _this.cbOS,
                    {bodyStyle: 'paddingTop: 3px;', border: false}, {
                        xtype: 'label',
                        text: 'Especialidad: '
                    }, {bodyStyle: 'paddingTop: 3px;', border: false}, _this.cbEsp]
            }
        ]
    });
    this.btnAceptar = new Ext.Button({
        iconCls: 'aceptar ',
        text: 'Aceptar ',
        id: 'btacepact',
        tooltip: 'Aplicar filtros y cerrar ventana',
        handler: function () {
            _this.start = 0;
            _this.pagina = 1;
            _this.winFiltrosPag.hide();
            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
        }
    });
    this.btnCancelar = new Ext.Button({
        iconCls: 'cancelar',
        text: 'Cancelar',
        id: 'btcancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function () {
            _this.winFiltrosPag.hide();
        }
    });
    this.winFiltrosPag = new Ext.Window({
        id: 'winFiltrosPag',
        title: 'Gestionar filtros',
        constrain: true,
        width: 500,
        height: 360,
        resizable: false,
        layout: 'border',
        modal: true,
        closeAction: 'hide',
        tbar: [_this.btnlimpiarFilt],
        items: [_this.panelPag, _this.panelFilt],
        buttons: [_this.btnCancelar, _this.btnAceptar]
    });


    this.btfiltro = new Ext.Button({
        id: 'btfiltro',
        disabled: true,
        iconCls: 'filtrar',
        tooltip: 'Filtros',
        handler: function () {
            _this.cargarFiltros();
            _this.winFiltrosPag.show();
            _this.stCmbPlanes.reload({
                params: {
                    identidad: _this.identidad.id

                }
            });
            _this.stEsp.reload();
        }
    });
    /*******Paneles de las graficas NA*****************/
    //Paneles de las graficas Act-NA
    this.actnivact_p1 = new Ext.Panel({
        id: 'actnivact_p1',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        height: '80%',
        html: '<div id="idactnivact_p1" margin: 0 auto"></div>'
    });
    //Paneles de las graficas NA
    this.nivact_p1 = new Ext.Panel({
        id: 'nivact_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idnivact_p1" margin: 0 auto"></div>'
    });
    this.nivact_p2 = new Ext.Panel({
        id: 'nivact_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idnivact_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas resumen NA
    this.actnivactr_p1 = new Ext.Panel({
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        html: '<div id="idactnivactr_p1" margin: 0 auto"></div>'
    });
    this.panelContenedorArribaactnivactr = new Ext.Panel({
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        region: 'north',
        items: [_this.actnivactr_p1]
    });
    this.nivactr_p1 = new Ext.Panel({
        layout: 'fit',
        width: '50%',
        region: 'center',
        bodyBorder: false,
        html: '<div id="idnivactr_p1" margin: 0 auto"></div>'
    });
    this.nivactr_p2 = new Ext.Panel({
        layout: 'fit',
        width: '50%',
        region: 'east',
        bodyBorder: false,
        html: '<div id="idnivactr_p2" margin: 0 auto"></div>'
    });
    this.panelContenedorCentroactnivactr = new Ext.Panel({
        layout: 'border',
        region: 'center',
        bodyBorder: false,
        width: '100%',
        items: [_this.nivactr_p1, _this.nivactr_p2]
    });
    this.panelGeneralactnivactr = new Ext.Panel({
        id: 'panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
                rowHeight: .50,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.panelContenedorArribaactnivactr]
            }, {
                rowHeight: .50,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.panelContenedorCentroactnivactr]
            }]
    });
    /*******Paneles de las graficas Cálculo*****************/
    //Paneles de la grafica Calculo - Relacion ingresos-gastos-utilidades
    this.calculo_p1 = new Ext.Panel({
        id: 'calculo_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idcalculo_p1" margin: 0 auto"></div>'
    });
    this.calculo_p4 = new Ext.Panel({
        id: 'calculo_p4',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idcalculo_p4" margin: 0 auto"></div>'
    });
    //Paneles de la grafica Calculo - Carga capacidada
    this.calculo_p2 = new Ext.Panel({
        id: 'calculo_p2',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idcalculo_p2" margin: 0 auto"></div>'
    });
    //Paneles de la grafica Calculo - Planes por entidad
    this.calculo_p3 = new Ext.Panel({
        id: 'calculo_p3',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idcalculo_p3" margin: 0 auto"></div>'
    });
    /*******Paneles de las graficas Plan*****************/
    //Paneles de las graficas Plan - Normalizados y directos
    this.plannordir_p1 = new Ext.Panel({
        id: 'plannordir_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idplannordir_p1" margin: 0 auto"></div>'
    });
    this.plannordir_p2 = new Ext.Panel({
        id: 'plannordir_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idplannordir_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas Plan - Balance financiero
    this.planbf_p1 = new Ext.Panel({
        id: 'planbf_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idplanbf_p1" margin: 0 auto"></div>'
    });
    this.planbf_p2 = new Ext.Panel({
        id: 'planbf_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idplanbf_p2" margin: 0 auto"></div>'
    });
    //Panel de las graficas Plan - Mas demandados
    this.planmd_p1 = new Ext.Panel({
        id: 'planmd_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idplanmd_p1" margin: 0 auto"></div>'
    });
    //Panel de las graficas Plan - Mas valiosos
    this.planmv_p1 = new Ext.Panel({
        id: 'planmv_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idplanmv_p1" margin: 0 auto"></div>'
    });
    //Panel de las graficas resumen por CB
    this.planCB_p1 = new Ext.Panel({
        id: 'planCB_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idplanCB_p1" margin: 0 auto"></div>'
    });
    //Panel de las graficas resumen por Entidad
    this.planEntidad_p1 = new Ext.Panel({
        id: 'planEntidad_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idplanEntidad_p1" margin: 0 auto"></div>'
    });
    //Paneles de las graficas resumen Plan
    this.plannordirRes_p0 = new Ext.Panel({
        id: 'plannordirRes_p0',
        width: '50%',
        layout: 'fit',
        region: 'east',
        bodyBorder: false,
        html: '<div id="idplannordirRes_p0" margin: 0 auto"></div>'
    });
    this.plannordirRes_p1 = new Ext.Panel({
        id: 'plannordirRes_p1',
        width: '50%',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        html: '<div id="idplannordirRes_p1" margin: 0 auto"></div>'
    });
    this.panelC = new Ext.Panel({
        id: 'panelC',
        layout: 'border',
        region: 'center',
        items: [_this.plannordirRes_p0, _this.plannordirRes_p1],
        bodyBorder: false
    });
    this.plannordirRes_p2 = new Ext.Panel({
        id: 'plannordirRes_p2',
        layout: 'fit',
        region: 'south',
        bodyBorder: false,
        html: '<div id="idplannordirRes_p2" margin: 0 auto"></div>'
    });
    this.panelGeneralPlanResumen = new Ext.Panel({
        id: 'panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
                rowHeight: .50,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.panelC]
            }, {
                rowHeight: .50,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.plannordirRes_p2]
            }]
    });
    //Combo para los CB de la grafica plan-entidad
    this.cblabel = new Ext.form.Label({
        xtype: "label",
        text: ''
    });
    this.stCmbCentroBalance = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarArbolEntidadesCB',
        listeners: {
            beforeload: function (st, opt) {
                _this.mymask.show();
            },
            load: function (t, n, e) {
                _this.mymask.hide();
                if (t.data.length == 0) {
                    mostrarMensaje(1, 'No existen centros de balance en el dominio de la entidad logueada');
                } else {
                    _this.CmbCentroBalance.setValue(t.data.items[0].id);
                    _this.panelPag.enable();
                    _this.CmbCentroBalance.show();
                    _this.start = 0;
                    _this.pagina = 1;
                    _this.fnPlanEntidad(t.data.items[0].id);
                }
            }
        },
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
    this.CmbCentroBalance = new Ext.form.ComboBox({
        tabIndex: 10,
        allowBlank: false,
        width: 150,
        listWidth: 250,
        label: 'Centros de balance:',
        store: _this.stCmbCentroBalance,
        valueField: 'identidad',
        displayField: 'denominacion',
        id: 'tbcmbcentrobalance',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        hidden: true,
        forceSelection: true,
        typeAhead: true,
        selectOnFocus: false,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function () {
                _this.start = 0;
                _this.pagina = 1;
                _this.fnPlanEntidad(_this.CmbCentroBalance.getValue());
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 22) {
                    mostrarMensaje(1, 'No existen centros de balance en el dominio de la entidad logueada');
                }

            }

        }
    });
    /*******Paneles de las graficas BM*****************/
    //Paneles de las graficas BM - CTE-necesidad
    this.BMCTEnec_p1 = new Ext.Panel({
        id: 'BMCTEnec_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idBMCTEnec_p1" margin: 0 auto"></div>'
    });
    this.BMCTEnec_p2 = new Ext.Panel({
        id: 'BMCTEnec_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idBMCTEnec_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas BM - CPE-demanda
    this.BMCPEdem_p1 = new Ext.Panel({
        id: 'BMCPEdem_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idBMCPEdem_p1" margin: 0 auto"></div>'
    });
    this.BMCPEdem_p2 = new Ext.Panel({
        id: 'BMCPEdem_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idBMCPEdem_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas resumen BM
    this.BMCTEnecr_p1 = new Ext.Panel({
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        region: 'center',
        html: '<div id="idBMCTEnecr_p1" margin: 0 auto"></div>'
    });
    this.BMCTEnecr_p2 = new Ext.Panel({
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        region: 'east',
        html: '<div id="idBMCTEnecr_p2" margin: 0 auto"></div>'
    });
    this.panelContenedorArribaactnivactBMr = new Ext.Panel({
        layout: 'border',
        width: '100%',
        bodyBorder: false,
        region: 'north',
        items: [_this.BMCTEnecr_p1, _this.BMCTEnecr_p2]
    });
    this.BMCPEdemr_p1 = new Ext.Panel({
        layout: 'fit',
        width: '50%',
        region: 'center',
        bodyBorder: false,
        html: '<div id="idBMCPEdemr_p1" margin: 0 auto"></div>'
    });
    this.BMCPEdemr_p2 = new Ext.Panel({
        layout: 'fit',
        width: '50%',
        region: 'east',
        bodyBorder: false,
        html: '<div id="idBMCPEdemr_p2" margin: 0 auto"></div>'
    });
    this.panelContenedorCentroactnivactBMr = new Ext.Panel({
        layout: 'border',
        region: 'center',
        bodyBorder: false,
        width: '100%',
        items: [_this.BMCPEdemr_p1, _this.BMCPEdemr_p2]
    });
    this.panelGeneralactnivactBMr = new Ext.Panel({
        id: 'panelGeneral',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
                rowHeight: .50,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.panelContenedorArribaactnivactBMr]
            }, {
                rowHeight: .50,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.panelContenedorCentroactnivactBMr]
            }]
    });
    /*******Paneles de las graficas CE - Plan*****************/
    //Paneles de las graficas CE - Plan - Global por entidad
    this.CEPGlobalEntidad_p1 = new Ext.Panel({
        id: 'CEPGlobalEntidad_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCEPGlobalEntidad_p1" margin: 0 auto"></div>'
    });
    this.CEPGlobalEntidad_p2 = new Ext.Panel({
        id: 'CEPGlobalEntidad_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idCEPGlobalEntidad_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - Plan - Global por entidad IG
    this.CEPGlobalEntidadIG_p1 = new Ext.Panel({
        id: 'CEPGlobalEntidadIG_p1',
        layout: 'fit',
        region: 'north',
        bodyBorder: false,
        html: '<div id="idCEPGlobalEntidadIG_p1" margin: 0 auto"></div>'
    });
    this.CEPGlobalEntidadIG_p2 = new Ext.Panel({
        id: 'CEPGlobalEntidadIG_p2',
        layout: 'fit',
        bodyBorder: false,
        region: 'center',
        html: '<div id="idCEPGlobalEntidadIG_p2" margin: 0 auto"></div>'
    });
    this.panelCEPGlobalEntidadIG = new Ext.Panel({
        layout: 'ux.row',
        height: '100%',
        width: '70%',
        region: 'east',
        items: [{
                rowHeight: .50,
                width: '100%',
                border: true,
                layout: 'fit',
                items: [_this.CEPGlobalEntidadIG_p1]
            }, {
                rowHeight: .50,
                width: '100%',
                border: true,
                layout: 'fit',
                items: [_this.CEPGlobalEntidadIG_p2]
            }]
    });
    //Paneles de las graficas CE - Plan - Trimestre
    this.CEPTrimestre_p1 = new Ext.Panel({
        id: 'CEPTrimestre_p1',
        layout: 'fit',
        region: 'west',
        height: '80%',
        width: '50%',
        bodyBorder: false,
        html: '<div id="idCEPTrimestre_p1" margin: 0 auto"></div>'
    });
    this.CEPTrimestre_p2 = new Ext.Panel({
        id: 'CEPTrimestre_p2',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        region: 'center',
        html: '<div id="idCEPTrimestre_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - Plan - Mes
    this.CEPMesI_p1 = new Ext.Panel({
        id: 'CEPMesI_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCEPMesI_p1" margin: 0 auto"></div>'
    });
    this.CEPMesG_p1 = new Ext.Panel({
        id: 'CEPMesG_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCEPMesG_p1" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - Plan - mas valiosos
    this.CEPIV_p1 = new Ext.Panel({
        id: 'CEPIV_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCEPIV_p1" margin: 0 auto"></div>'
    });
    this.CEPIV_p2 = new Ext.Panel({
        id: 'CEPIV_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idCEPIV_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - Plan - mas valiosos fuera de plan
    this.CEPIVFP_p1 = new Ext.Panel({
        id: 'CEPIVFP_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCEPIVFP_p1" margin: 0 auto"></div>'
    });
    this.CEPIVFP_p2 = new Ext.Panel({
        id: 'CEPIVFP_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idCEPIVFP_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - Plan - mas ejecutados
    this.CEPIME_p1 = new Ext.Panel({
        id: 'CEPIME_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCEPIME_p1" margin: 0 auto"></div>'
    });
    this.CEPIME_p2 = new Ext.Panel({
        id: 'CEPIME_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idCEPIME_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - Plan - menos ejecutados
    this.CEPIMeE_p1 = new Ext.Panel({
        id: 'CEPIMeE_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCEPIMeE_p1" margin: 0 auto"></div>'
    });
    this.CEPIMeE_p2 = new Ext.Panel({
        id: 'CEPIMeE_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idCEPIMeE_p2" margin: 0 auto"></div>'
    });
    //Panel de las graficas CE - Plan - VA
    this.CEPVA_p1 = new Ext.Panel({
        id: 'CEPVA_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCEPVA_p1" margin: 0 auto"></div>'
    });
    /*******Paneles de las graficas CE - NA*****************/
    //Paneles de las graficas CE - NA - global * entidad
    this.CENAEE_p1 = new Ext.Panel({
        id: 'CENAEE_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCENAEE_p1" margin: 0 auto"></div>'
    });
    this.CENAEETRi_p2 = new Ext.Panel({
        id: 'CENAEETRi_p2',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCENAEETRi_p2" margin: 0 auto"></div>'
    });
    //Panel de las graficas CE - NA - mes
    this.CENAEEMesG_p1 = new Ext.Panel({
        id: 'CENAEEMesG_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCENAEEMesG_p1" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - NA - mas valiosas
    this.CENAEEMV_p1 = new Ext.Panel({
        id: 'CENAEEMV_p1',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idCENAEEMV_p1" margin: 0 auto"></div>'
    });
    this.CENAEEMV_p2 = new Ext.Panel({
        id: 'CENAEEMV_p2',
        layout: 'fit',
        width: '50%',
        bodyBorder: false,
        height: '80%',
        region: 'center',
        html: '<div id="idCENAEEMV_p2" margin: 0 auto"></div>'
    });
    //Paneles de las graficas CE - NA - mas ejecutados
    this.CENAEEME_p1 = new Ext.Panel({
        id: 'CENAEEME_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCENAEEME_p1" margin: 0 auto"></div>'
    });
    //Panel de las graficas CE - NA - total * entidad
    this.CENATotal_p1 = new Ext.Panel({
        id: 'CENATotal_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCENATotal_p1" margin: 0 auto"></div>'
    });
    //Panel de las graficas Ejecucion de la demanda - Total por CB selecionado
    this.CENATotal_d1 = new Ext.Panel({
        id: 'CENATotal_d1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idCENATotal_d1" margin: 0 auto"></div>'
    });
    //Paneles de las graficas Linea de tiempo
    this.LTN = new Ext.Panel({
        id: 'LTN',
        layout: 'fit',
        region: 'west',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idLTN" margin: 0 auto"></div>'
    });
    this.LTI = new Ext.Panel({
        id: 'LTI',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idLTI" margin: 0 auto"></div>'
    });
    //Paneles de las graficas Histograma
    this.HISTOGRAMA = new Ext.Panel({
        id: 'HISTOGRAMA',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idHISTOGRAMA" margin: 0 auto"></div>'
    });
    //Combo para los tipo de frecuencia de la grafica Histograma
    this.labelTipoFrecuencia = new Ext.form.Label({
        xtype: "label",
        text: ''
    });
    this.stCmbTipoFrecuencia = [
        [0, 'Frecuencia absoluta'], [1, 'Frecuencia relativa'], [2, 'Frecuencia acumulada'], [3, 'Frecuencia relativa acumulada']
    ];
    this.CmbTipoFrecuencia = new Ext.form.ComboBox({
        id: 'CmbTipoFrecuencia',
        store: _this.stCmbTipoFrecuencia,
        typeAhead: true,
        triggerAction: 'all',
        forceSelection: true,
        allowBlank: false,
        editable: false,
        width: 180,
        value: 0,
        listeners: {
            select: function (combo, record, index) {
                _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
            }
        }
    });

//Componente con todas las graficas por tabs
    this.tabsanalisisplanificacion = new Ext.TabPanel({
        activeTab: 0,
        enableTabScroll: true,
        tbar: ['Ejercicio: ', _this.cmbEjercicio, '-', _this.btfiltro, '-', _this.chkGlobal, _this.cblabel, _this.CmbCentroBalance, _this.labelTipoFrecuencia, _this.CmbTipoFrecuencia],
        id: 'tabsanalisisplanificacion',
        region: 'center',
        listeners: {
            beforedestroy: function (tp) {
                _this.winFiltrosPag.destroy();
            }
        }
    });
    if (_this.componente == 'NA' || _this.componente == 'analisis') {
        //tabs de NA
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Actividades-Niveles de actividad',
                    id: 'actnivact',
                    activeTab: 0,
                    layout: 'fit',
                    html: "<div id = 'actnivact_contenedor' ></div>",
                    items: [_this.actnivact_p1],
                    listeners: {
                        activate: function (p) {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Niveles de actividad',
                    id: 'nivact',
                    activeTab: 1,
                    layout: 'border',
                    html: "<div id = 'nivact_contenedor' ></div>",
                    items: [_this.nivact_p1, _this.nivact_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Resumen de gr\xE1ficas NA',
                    id: 'RNA',
                    activeTab: 23,
                    layout: 'fit',
                    html: "<div id = 'RNA_contenedor' ></div>",
                    items: [_this.panelGeneralactnivactr],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                });
    }
    if (_this.componente == 'Calculo' || _this.componente == 'analisis') {
        //tabs de Calculo
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Cálculo-Relación ingresos-gastos',
                    id: 'calculoing',
                    activeTab: 30,
                    layout: 'fit',
                    html: "<div id = 'calculoing_contenedor' ></div>",
                    items: [_this.calculo_p1],
                    listeners: {
                        activate: function (p) {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                }, {
            title: 'Cálculo-Encadenamiento',
            id: 'calculoencadenamiento',
            activeTab: 32,
            layout: 'fit',
            html: "<div id = 'calculoencadenamiento_contenedor' ></div>",
            items: [_this.calculo_p4],
            listeners: {
                activate: function (p) {
                    _this.btfiltro.disable();
                    _this.start = 0;
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                }
            }
        }, {
            title: 'Cálculo de carga-capacidad',
            id: 'cargacapacidad',
            activeTab: 27,
            layout: 'fit',
            html: "<div id = 'calculoing_contenedor' ></div>",
            items: [_this.calculo_p2],
            listeners: {
                activate: function () {
                    _this.btfiltro.disable();
                    _this.start = 0;
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                }
            }
        }, {
            title: 'Cálculo-Planes por entidad',
            id: 'calculoplan',
            activeTab: 31,
            layout: 'fit',
            html: "<div id = 'calculoplan_contenedor' ></div>",
            items: [_this.calculo_p3],
            listeners: {
                activate: function (p) {
                    _this.btfiltro.disable();
                    _this.start = 0;
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                }
            }
        });
    }

    if (_this.componente == 'Plan' || _this.componente == 'analisis') {
        //tabs de Plan
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Plan-Normados y directos',
                    id: 'plannordir',
                    activeTab: 2,
                    layout: 'border',
                    html: "<div id = 'plannordir_contenedor' ></div>",
                    items: [_this.plannordir_p1, _this.plannordir_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Plan-Ingresos-gastos',
                    id: 'planbf',
                    activeTab: 3,
                    layout: 'border',
                    html: "<div id = 'planbf_contenedor' ></div>",
                    items: [_this.planbf_p1, _this.planbf_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Plan-Indicador-vía',
                    id: 'planmd',
                    activeTab: 4,
                    layout: 'fit',
                    html: "<div id = 'planmd_contenedor' ></div>",
                    items: [_this.planmd_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Plan-Indicador-importe',
                    id: 'planmv',
                    activeTab: 5,
                    layout: 'fit',
                    html: "<div id = 'planmv_contenedor' ></div>",
                    items: [_this.planmv_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Plan-Resumen por CB',
                    id: 'planCB',
                    activeTab: 26,
                    layout: 'fit',
                    html: "<div id = 'planCB_contenedor' ></div>",
                    items: [_this.planCB_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                });
    }

    if (_this.componente == 'analisis') {
        //tabs de Plan
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Plan-Resumen por entidad',
                    id: 'planEntidad',
                    activeTab: 28,
                    layout: 'fit',
                    html: "<div id = 'planEntidad_contenedor' ></div>",
                    items: [_this.planEntidad_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                });
    }

    if (_this.componente == 'Plan' || _this.componente == 'analisis') {
        //tabs de Plan
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Resumen de gr\xE1ficas Plan',
                    id: 'RNP',
                    activeTab: 25,
                    layout: 'fit',
                    html: "<div id = 'RNP_contenedor' ></div>",
                    items: [_this.panelGeneralPlanResumen],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                });
    }

    if (_this.componente == 'BM' || _this.componente == 'analisis') {
        //tabs de BM
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'BM-Relación CTE-necesidad',
                    id: 'BMCTEnec',
                    activeTab: 6,
                    layout: 'border',
                    html: "<div id = 'BMCTEnec_contenedor' ></div>",
                    items: [_this.BMCTEnec_p1, _this.BMCTEnec_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'BM-Relación CPE-demanda',
                    id: 'BMCPEdem',
                    activeTab: 7,
                    layout: 'border',
                    html: "<div id = 'BMCPEdem_contenedor' ></div>",
                    items: [_this.BMCPEdem_p1, _this.BMCPEdem_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'Resumen de gr\xE1ficas BM',
                    id: 'RBM',
                    activeTab: 24,
                    layout: 'fit',
                    html: "<div id = 'RBM_contenedor' ></div>",
                    items: [_this.panelGeneralactnivactBMr],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                });
    }

    if (_this.componente == 'CEP' || _this.componente == 'analisis') {
        //tabs de CE-Plan
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'CE-Plan-Global por entidad',
                    id: 'CEPGlobalEntidad',
                    activeTab: 8,
                    layout: 'border',
                    html: "<div id = 'CEPGlobalEntidad_contenedor' ></div>",
                    items: [_this.CEPGlobalEntidad_p1, _this.CEPGlobalEntidad_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Global por entidad (Ingresos/Gastos)',
                    id: 'CEPGlobalEntidadIG',
                    activeTab: 9,
                    layout: 'fit',
                    html: "<div id = 'CEPGlobalEntidadIG_contenedor' ></div>",
                    items: [_this.panelCEPGlobalEntidadIG],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Trimestre',
                    id: 'CEPTrimestre',
                    activeTab: 10,
                    layout: 'border',
                    html: "<div id = 'CEPTrimestre_contenedor' ></div>",
                    items: [_this.CEPTrimestre_p1, _this.CEPTrimestre_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Mes-ingresos',
                    id: 'CEPMesI',
                    activeTab: 11,
                    layout: 'fit',
                    html: "<div id = 'CEPMesI_contenedor' ></div>",
                    items: [_this.CEPMesI_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Mes-gastos',
                    id: 'CEPMesG',
                    activeTab: 12,
                    layout: 'fit',
                    html: "<div id = 'CEPMesG_contenedor' ></div>",
                    items: [_this.CEPMesG_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Indicadores valiosos',
                    id: 'CEPIV',
                    activeTab: 13,
                    layout: 'border',
                    html: "<div id = 'CEPIV_contenedor' ></div>",
                    items: [_this.CEPIV_p1, _this.CEPIV_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Indicadores valiosos fuera de plan',
                    id: 'CEPIVFP',
                    activeTab: 14,
                    layout: 'border',
                    html: "<div id = 'CEPIVFP_contenedor' ></div>",
                    items: [_this.CEPIVFP_p1, _this.CEPIVFP_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-Indicadores m\xE1s ejecutados',
                    id: 'CEPIME',
                    activeTab: 15,
                    layout: 'border',
                    html: "<div id = 'CEPIME_contenedor' ></div>",
                    items: [_this.CEPIME_p1, _this.CEPIME_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-Plan-VA',
                    id: 'CEPVA',
                    activeTab: 17,
                    layout: 'fit',
                    html: "<div id = 'CEPVA_contenedor' ></div>",
                    items: [_this.CEPVA_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                });
    }

    if (_this.componente == 'CENA' || _this.componente == 'analisis') {
        //tabs de CE-NA
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'CE-NA-Ejecución por entidad',
                    id: 'CENAEE',
                    activeTab: 18,
                    layout: 'border',
                    html: "<div id = 'CENAEE_contenedor' ></div>",
                    items: [_this.CENAEE_p1, _this.CENAEETRi_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-NA-Mes',
                    id: 'CENAEEMesG',
                    activeTab: 19,
                    layout: 'fit',
                    html: "<div id = 'CENAEEMesG_contenedor' ></div>",
                    items: [_this.CENAEEMesG_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-NA-Indicadores valiosos',
                    id: 'CENAEEMV',
                    activeTab: 20,
                    layout: 'border',
                    html: "<div id = 'CENAEEMV_contenedor' ></div>",
                    items: [_this.CENAEEMV_p1, _this.CENAEEMV_p2],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-NA-Indicadores ejecutados',
                    id: 'CENAEEME',
                    activeTab: 21,
                    layout: 'fit',
                    html: "<div id = 'CENAEEME_contenedor' ></div>",
                    items: [_this.CENAEEME_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                },
                {
                    title: 'CE-NA-Total',
                    id: 'CENATotal',
                    activeTab: 22,
                    layout: 'fit',
                    html: "<div id = 'CENATotal_contenedor' ></div>",
                    items: [_this.CENATotal_p1],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                }
        );
    }


    if (_this.componente == 'analisis') {
//tabs de linea de tiempo LT
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Línea de tiempo',
                    id: 'LT',
                    activeTab: 16,
                    layout: 'border',
                    html: "<div id = 'LT_contenedor' ></div>",
                    items: [_this.LTN, _this.LTI],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                }

        );
    }

    if (_this.componente == 'analisis') {
//tabs de HISTOGRAMA
        _this.tabsanalisisplanificacion.add(
                {
                    title: 'Histograma',
                    id: 'Histogramap',
                    activeTab: 29,
                    layout: 'fit',
                    html: "<div id = 'HISTOGRAMA_contenedor' ></div>",
                    items: [_this.HISTOGRAMA],
                    listeners: {
                        activate: function () {
                            _this.btfiltro.disable();
                            _this.start = 0;
                            _this.pagina = 1;
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                }

        );
    }



    this.panelGraficas = function () {
        return this.tabsanalisisplanificacion;
    };
    this.actualizarParametros = function (nodeEntidad, componente, start, pagina) {
        this.identidad = nodeEntidad;
        this.componente = componente;
        this.start = start;
        this.pagina = pagina;
    };
    this.limpiarGraficas = function (accion) {
        this.tabsanalisisplanificacion.setVisible(accion);
    };
    this.fnPintar = function (nodeEntidad) {
        var tab = _this.tabsanalisisplanificacion.getActiveTab();
        if (tab != null) {
            switch (tab.activeTab) {
                case 0:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.fnActNivAct(nodeEntidad);
                    break;
                case 1:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnNivAct(nodeEntidad);
                    break;
                case 2:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnPlanNorDir(nodeEntidad);
                    break;
                case 3:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnPlanBF(nodeEntidad);
                    break;
                case 4:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnPlanMD(nodeEntidad);
                    break;
                case 5:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnPlanMV(nodeEntidad);
                    break;
                case 6:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnBMCTENec(nodeEntidad);
                    break;
                case 7:
                    this.habPag(1);
                    this.fnBMCPEDem(nodeEntidad);
                    break;
                case 8:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnCEPGlobalEntidad(nodeEntidad);
                    break;
                case 9:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnCEPGlobalEntidadIG(nodeEntidad);
                    break;
                case 10:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnTrimestre(nodeEntidad);
                    break;
                case 11:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnMesI(nodeEntidad);
                    break;
                case 12:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnMesG(nodeEntidad);
                    break;
                case 13:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnIndMasVal(nodeEntidad);
                    break;
                case 14:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnIndMasValFP(nodeEntidad);
                    break;
                case 15:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnIndMasEjec(nodeEntidad);
                    break;
                case 17:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnIndVA(nodeEntidad);
                    break;
                case 18:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnCENAGE(nodeEntidad);
                    break;
                case 19:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnNAMesG(nodeEntidad);
                    break;
                case 20:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnNAIndMasVal(nodeEntidad);
                    break;
                case 21:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnActMasEjec(nodeEntidad);
                    break;
                case 22:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnActTotal(nodeEntidad);
                    break;
                case 23:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnActNivActResumen(nodeEntidad);
                    break;
                case 24:
                    this.habPag(0);
                    this.limpiarPaginado();
                    this.fnBMResumen(nodeEntidad);
                    break;
                case 25:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnPlanResumen(nodeEntidad);
                    break;
                case 26:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnPlanCB(nodeEntidad);
                    break;
                case 27:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnCalcularCargaCapacidad(nodeEntidad);
                    break;
                case 16:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnLineaDeTiempo(nodeEntidad);
                    break;
                case 29:
                    this.habPag(0);
                    this.activarFiltros(tab.activeTab);
                    this.limpiarPaginado();
                    this.fnHistograma(nodeEntidad);
                    _this.labelTipoFrecuencia.setText("Tipo de frecuencia: ");
                    _this.CmbTipoFrecuencia.show();
                    break;
                case 30:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnCalculoRIngreso(nodeEntidad);
                    break;
                case 31:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnCalculoPlanEntidad(nodeEntidad);
                    break;
                case 32:
                    this.habPag(1);
                    this.activarFiltros(tab.activeTab);
                    this.fnCalculoEncadenamiento(nodeEntidad);
                    break;
                case 28:
                    this.activarFiltros(tab.activeTab);
                    _this.arbolEntidad.disable();
                    _this.arbolEntidad.collapse();
                    _this.panelPag.enable();
                    _this.CmbCentroBalance.show();
                    _this.cblabel.setText('Centros de balance');
                    _this.chkGlobal.hide();
                    if (_this.start == 0 && (_this.CmbCentroBalance.getValue() == null || _this.CmbCentroBalance.getValue() == '')) {
                        _this.stCmbCentroBalance.reload({
                            params: {
                                rector: _this.rectora
                            }
                        });
                    } else {
                        _this.fnPlanEntidad(_this.CmbCentroBalance.getValue());
                    }
                    break;
            }
        }
    };
    this.fnActNivAct = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarActNivelesActividad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarActNivelesActividad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idactnivact_p1').highcharts(
                            {
                                chart: {
                                    height: _this.actnivact_p1.getInnerHeight(),
                                    type: 'column',
                                    zoomType: 'xy'
                                }, subtitle: {
                                    text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                                },
                                title: {
                                    text: 'Actividades m\xE1s valiosas'
                                }, plotOptions: {
                                    series: {
                                        dataLabels: {
                                            enabled: true
                                        },
                                        shadow: true
                                    },
                                    column: {
                                        pointPadding: 0.2
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: 'Importe'
                                    }
                                },
                                xAxis: {
                                    categories: resp.categorias
                                },
                                credits: {
                                    enabled: false
                                },
                                series: resp.data
                            }
                    );
                }
            });
        }

    };
    this.fnNivAct = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarNivelesActividad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
            {
                _this.fncontrolarPaginado();
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarNivelesActividad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idnivact_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.nivact_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n de niveles de actividad m\xE1s valiosos'
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                    $('#idnivact_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.nivact_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n de niveles de actividad m\xE1s valiosos'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }

    };
    this.fnActNivActResumen = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarActNivelesActividad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: 1,
                    start: 0,
                    limit: 5,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idactnivactr_p1').highcharts({
                        chart: {
                            height: _this.actnivactr_p1.getInnerHeight(),
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Actividades m\xE1s valiosas'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }
            });
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarNivelesActividad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: 1,
                    start: 0,
                    limit: 5,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idnivactr_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.nivactr_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n de niveles de actividad m\xE1s valiosos'
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                    $('#idnivactr_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.nivactr_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n de niveles de actividad m\xE1s valiosos'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }

    };
    this.fnPlanNorDir = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanNormalizadosDirectos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idplannordir_p1').highcharts({
                        chart: {
                            height: _this.plannordir_p1.getInnerHeight(),
                            type: 'column'
                        },
                        title: {
                            text: 'Relaci\xF3n de criterios normados y directos (Ingresos)'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b>Importe: {point.y}</b>'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }}, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        xAxis: {
                            categories: ['Bases para el plan', 'Directo al plan']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.pastel
                            }]
                    });
                    $('#idplannordir_p2').highcharts({
                        chart: {
                            height: _this.plannordir_p2.getInnerHeight(),
                            type: 'column'
                        },
                        title: {
                            text: 'Relaci\xF3n de criterios normados y directos (Gastos)'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b>Importe: {point.y}</b>'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }}, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        xAxis: {
                            categories: ['Bases para el plan', 'Directo al plan']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.pastelG
                            }]
                    });
                }
            });
        }
    };
    this.fnPlanBF = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanBalanceFinanciero',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idplanbf_p1').highcharts({
                        chart: {
                            height: _this.planbf_p1.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<b>Importe: {point.y}</b> '
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Resumen de gastos'
                        },
                        xAxis: {
                            categories: ['Importe', 'Ajuste', 'Contingencias', 'Flete', 'Total']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.barra
                            }]
                    });
                    $('#idplanbf_p2').highcharts({
                        chart: {
                            height: _this.planbf_p2.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b> Importe: {point.y}</b> '
                        },
                        legend: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos-utilidades'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: ['Ingresos', 'Gastos', 'Utilidades']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.utilidades
                            }]
                    });
                }
            });
        }
    };
    this.fnPlanMD = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanMasdemandados',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
            {
                _this.fncontrolarPaginado();
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanMasdemandados',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idplanmd_p1').highcharts({
                        chart: {
                            height: _this.planmd_p1.getInnerHeight(),
                            type: 'column'
                        },
                        title: {
                            text: 'Indicadores por vía de adquisición (Gastos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        xAxis: {
                            categories: ['SI', 'OACE', 'Importación']
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        credits: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        series: resp
                    });
                }
            });
        }
    };
    this.fnPlanMV = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanMasvaliosos',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
            {
                _this.fncontrolarPaginado();
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanMasvaliosos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idplanmv_p1').highcharts({
                        chart: {
                            height: _this.planmv_p1.getInnerHeight(),
                            type: 'column'
                        },
                        title: {
                            text: 'Más importe (Gastos)'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        xAxis: {
                            categories: ['Importe', 'Ajuste', 'Contingencia', 'Flete', 'Total por indicador']
                        },
                        credits: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        series: resp
                    });
                }
            });
        }
    };
    this.fnPlanCB = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanResumenCB',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanResumenCB',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idplanCB_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.planCB_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos por centro de balance'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }
            });
        }

    };
    this.fnCalcularCargaCapacidad = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {

            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/calcularCargaCapacidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    entidad: nodeEntidad.text,
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#calculo_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.calculo_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n carga-capacidad por Entidad'
                        },
                        yAxis: {
                            title: {
                                text: 'Horas'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }
            });
        }

    };
    this.fnPlanEntidad = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanResumenEntidad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanResumenEntidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idplanEntidad_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.planEntidad_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos por entidad'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }
            });
        }

    };
    this.fnBMCTENec = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarBMCTENecesidad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
            {
                _this.fncontrolarPaginado();
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarBMCTENecesidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idBMCTEnec_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.BMCTEnec_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relación CTE - necesidad por cantidad (Gastos)',
                            x: -20
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            },
                            plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                        },
                        series: resp.data
                    });
                    $('#idBMCTEnec_p2').highcharts({
                        chart: {
                            height: _this.BMCTEnec_p2.getInnerHeight(),
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        title: {
                            text: 'Relación CTE - necesidad  por importe (Gastos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }
    };
    this.fnBMCPEDem = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarBMCPEDemanda',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
            {
                _this.fncontrolarPaginado();
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarBMCPEDemanda',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idBMCPEdem_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.BMCPEdem_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        title: {
                            text: 'Relación CPE - demanda  por cantidad (Gastos)',
                            x: -20
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            },
                            plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                        },
                        series: resp.data
                    });
                    $('#idBMCPEdem_p2').highcharts({
                        chart: {
                            height: _this.BMCPEdem_p2.getInnerHeight(),
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        title: {
                            text: 'Relación CPE - demanda  por importe (Gastos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }
    };
    this.fnBMResumen = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarBMCTENecesidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: 1,
                    start: 0,
                    limit: 5,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idBMCTEnecr_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.BMCTEnecr_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relación CTE - necesidad  por cantidad (Gastos)',
                            x: -20
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            },
                            plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                        },
                        series: resp.data
                    });
                    $('#idBMCTEnecr_p2').highcharts({
                        chart: {
                            height: _this.BMCTEnecr_p2.getInnerHeight(),
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        title: {
                            text: 'Relación CTE - necesidad por importe (Gastos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarBMCPEDemanda',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: 1,
                    start: 0,
                    limit: 5,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idBMCPEdemr_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.BMCPEdemr_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        title: {
                            text: 'Relación CPE - demanda  por cantidad (Gastos)',
                            x: -20
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            },
                            plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                        },
                        series: resp.data
                    });
                    $('#idBMCPEdemr_p2').highcharts({
                        chart: {
                            height: _this.BMCPEdemr_p2.getInnerHeight(),
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        title: {
                            text: 'Relación CPE - demanda por importe (Gastos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }
    };
    this.fnCEPGlobalEntidad = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanglobalentidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idCEPGlobalEntidad_p1').highcharts({
                        chart: {
                            height: _this.CEPGlobalEntidad_p1.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b> Importe: {point.y}</b> '
                        },
                        legend: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Presupuesto  de la ejecuci\xF3n global por entidad (Gastos)'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.data
                            }]
                    });
                    $('#idCEPGlobalEntidad_p2').highcharts({
                        chart: {
                            height: _this.CEPGlobalEntidad_p2.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b> Importe: {point.y}</b> '
                        },
                        legend: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Ejecuci\xF3n global por entidad (Ingresos/Gastos)'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.dataV
                            }]
                    });
                }
            });
        }
    };
    this.fnCEPGlobalEntidadIG = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanglobalentidadplan',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanglobalentidadplan',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCEPGlobalEntidadIG_p1').highcharts({
                        chart: {
                            height: _this.CEPGlobalEntidadIG_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Ejecuci\xF3n global por entidad para planes de ingreso'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                    $('#idCEPGlobalEntidadIG_p2').highcharts({
                        chart: {
                            height: _this.CEPGlobalEntidadIG_p2.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Ejecuci\xF3n global por entidad para planes de gasto'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.dataV
                    });
                }
            });
        }
    };
    this.fnTrimestre = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlantrimestre',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idCEPTrimestre_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.CEPTrimestre_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Evoluci\xF3n de la ejecuci\xF3n por trimestre (Ingresos)'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                    $('#idCEPTrimestre_p2').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.CEPTrimestre_p2.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Evoluci\xF3n de la ejecuci\xF3n por trimestre (Gastos)'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.dataV
                    });
                }
            });
        }
    };
    this.fnMesI = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmes',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    uri: 1,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idCEPMesI_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.CEPMesI_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Evoluci\xF3n de la ejecuci\xF3n por mes (Ingresos)'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                }
            });
        }
    };
    this.fnMesG = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmes',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    uri: 0,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idCEPMesG_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.CEPMesG_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Evoluci\xF3n de la ejecuci\xF3n por mes (Gastos)'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                }
            });
        }
    };
    this.fnIndMasVal = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmasValiosos',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmasValiosos',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCEPIV_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CEPIV_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ejecuci\xF3n de los indicadores m\xE1s valiosos (Ingresos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                    $('#idCEPIV_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CEPIV_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ejecuci\xF3n de los indicadores m\xE1s valiosos (Gastos)'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }

    };
    this.fnIndMasValFP = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmasValiososFueraPlan',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmasValiososFueraPlan',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCEPIVFP_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CEPIVFP_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Indicadores m\xE1s valiosos fuera del plan (Ingresos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                    $('#idCEPIVFP_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CEPIVFP_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Indicadores m\xE1s valiosos fuera del plan (Gastos)'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }

    };
    this.fnIndMasEjec = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmasymenosejecutados',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanmasymenosejecutados',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCEPIME_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CEPIME_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Indicadores m\xE1s ejecutados (Ingresos)'
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                    $('#idCEPIME_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CEPIME_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Indicadores m\xE1s ejecutados (Gastos)'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }

    };
    this.fnIndVA = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanejecutadosVA',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idCB: _this.cbCB.getCheckedValue(),
                        idVA: _this.cbVia.getCheckedValue(),
                        idOS: _this.cbOS.getCheckedValue(),
                        idUM: _this.cbUM.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCEPlanejecutadosVA',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCEPVA_p1').highcharts({
                        chart: {
                            height: _this.CEPVA_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Ejecuci\xF3n por v\xEDas de adquisici\xF3n (Gastos)'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                }
            });
        }
    };
    this.fnCENAGE = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAglobalEntidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idCENAEE_p1').highcharts({
                        chart: {
                            height: _this.CENAEE_p1.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b> Importe: {point.y}</b> '
                        },
                        legend: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }},
                        title: {
                            text: 'Ejecuci\xF3n global por entidad'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.data
                            }]
                    });
                    $('#idCENAEETRi_p2').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.CENAEETRi_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ejecuci\xF3n global por entidad por trimestre'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasT
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataT
                    });
                }
            });
        }

    };
    this.fnNAMesG = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCENAMes',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    uri: 0,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idCENAEEMesG_p1').highcharts({
                        chart: {
                            type: 'spline',
                            height: _this.CENAEEMesG_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Evoluci\xF3n de la ejecuci\xF3n por mes'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                }
            });
        }
    };
    this.fnNAIndMasVal = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAMasValiosas',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAMasValiosas',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCENAEEMV_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CENAEEMV_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ejecuci\xF3n de las actividades m\xE1s valiosas'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                    $('#idCENAEEMV_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CENAEEMV_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Actividades  m\xE1s valiosas fuera del plan'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categoriasV
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.dataV
                    });
                }
            });
        }

    };
    this.fnActMasEjec = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAMasEjecutadas',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAMasEjecutadas',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCENAEEME_p1').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.CENAEEME_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Actividades m\xE1s ejecutadas'
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }
            });
        }

    };
    this.fnActTotal = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAtotalEntidad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response)
                    {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planifintegracion/index.php/analisisplanificacionsisplaninversiones/graficarCENAtotalEntidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: _this.cmbOrden.getValue(),
                    start: _this.start,
                    limit: _this.cantelementosporpagina,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idEsp: _this.cbEsp.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idCENATotal_p1').highcharts({
                        chart: {
                            height: _this.CENATotal_p1.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Ejecuci\xF3n total de la entidad'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: 'Cantidad'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        credits: {
                            enabled: false
                        }
                        ,
                        legend: {
                            enabled: true
                        },
                        series: resp.data
                    });
                }
            });
        }
    };
    this.fnPlanResumen = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanBalanceFinanciero',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idplannordirRes_p0').highcharts({
                        chart: {
                            height: _this.plannordirRes_p0.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<b>Importe: {point.y}</b> '
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Resumen de gastos'
                        },
                        xAxis: {
                            categories: ['Importe', 'Ajuste', 'Contingencias', 'Flete', 'Total']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.barra
                            }]
                    });
                    $('#idplannordirRes_p1').highcharts({
                        chart: {
                            height: _this.plannordirRes_p1.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b> Importe: {point.y}</b> '
                        },
                        legend: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos-utilidades'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: ['Ingresos', 'Gastos', 'Utilidades']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.utilidades
                            }]
                    });
                }
            });
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarPlanResumenCB',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    contar: false,
                    orden: 1,
                    start: 0,
                    limit: 5,
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idplannordirRes_p2').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.plannordirRes_p2.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos por centro de balance'
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }
                        },
                        xAxis: {
                            categories: resp.categorias
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }
            });
        }
    };
    this.fnPlanDemanda = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/controlejecuciondemanda/graficaEjecucionglobalxentidadxVA',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idplannordirRes_p1').highcharts({
                        chart: {
                            height: _this.plannordirRes_p1.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<b>Importe: {point.y}</b> '
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Resumen de gastos'
                        },
                        xAxis: {
                            categories: ['Importe', 'Ajuste', 'Contingencias', 'Flete', 'Total']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.barra
                            }]
                    });
                    $('#idplannordirRes_p2').highcharts({
                        chart: {
                            height: _this.plannordirRes_p2.getInnerHeight(),
                            type: 'column'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            pointFormat: '<b> Importe: {point.y}</b> '
                        },
                        legend: {
                            enabled: false
                        }, plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos-utilidades'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: ['Ingresos', 'Gastos', 'Utilidades']
                        },
                        credits: {
                            enabled: false
                        }, series: [{
                                colorByPoint: true,
                                data: resp.utilidades
                            }]
                    });
                }
            });
        }
    };
    this.fnLineaDeTiempo = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarLineaTiempo',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    idPlan: _this.CmbPlanes.getCheckedValue(),
                    global: _this.chkGlobal.getValue(),
                    idCB: _this.cbCB.getCheckedValue(),
                    idVA: _this.cbVia.getCheckedValue(),
                    idOS: _this.cbOS.getCheckedValue(),
                    idUM: _this.cbUM.getCheckedValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();


                    $('#idLTN').highcharts({
                        chart: {
                            type: 'spline',
                            step: 'left',
                            height: _this.LTN.getInnerHeight(),
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'Línea de tiempo: ' + resp.titulo
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        yAxis: {
                            title: {
                                text: resp.valor
                            }
                        },
                        xAxis: {
                            type: 'datetime',
                            labels: {
                                align: 'left'
                            }
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size: 11px;color:#666">{point.x:%B %e, %Y}</span><br>',
                            pointFormat: '<b>' + resp.denominacion + ': </b> {point.name}<br><b>' + resp.valor + ': </b>{point.y}'
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                                dashStyle: 'dash',
                                colorByPoint: true,
                                name: resp.concepto,
                                data: resp.data
                            }]
                    });


                }});
        }
    };
    this.fnHistograma = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarHistograma',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue(),
                    tipo: _this.CmbTipoFrecuencia.getValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.btfiltro.enable();
                    _this.mymask.hide();
                    $('#idHISTOGRAMA').highcharts({
                        chart: {
                            type: 'column',
                            height: _this.HISTOGRAMA.getInnerHeight()
                        },
                        title: {
                            text: 'Histograma: ' + resp.titulo
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            gridLineWidth: 1
                        },
                        yAxis: [{
                                title: {
                                    text: 'Contador de frecuencia' + resp.tipo
                                }
                            }, {
                                opposite: true,
                                title: {
                                    text: resp.valor
                                }
                            }],
                        series: [{
                                name: 'Frecuencia' + resp.tipo,
                                type: 'column',
                                data: resp.data,
                                pointPadding: 0,
                                groupPadding: 0,
                                pointPlacement: 'between',
                                tooltip: {
                                    headerFormat: '<span style="font-size: 11px;color:#666"></span>',
                                    pointFormat: '<b>Intervalo: </b> {point.x}-{point.finintervalo}<br><b>Frecuencia' + resp.tipo + ': </b>{point.y}'
                                }
                            }, {
                                name: resp.valor,
                                type: 'scatter',
                                data: resp.dataV,
                                tooltip: {
                                    headerFormat: '<span style="font-size: 11px;color:#666"></span>',
                                    pointFormat: '<b>' + resp.denominacion + ': </b> {point.name}<br><b>' + resp.valor + ': </b>{point.x}'
                                },
                                yAxis: 1,
                                colorByPoint: true,
                                marker: {
                                    radius: 5
                                }
                            }]
                    });
                }});
        }
    };
    this.fnCalculoRIngreso = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCalculoRIngreso',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idcalculo_p1').highcharts({
                        chart: {
                            height: _this.calculo_p1.getInnerHeight(),
                            type: 'column'
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br>Importe: ' + this.y;
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Relaci\xF3n ingresos-gastos'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }});
        }
    };

    this.fnCalculoEncadenamiento = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCalculoEncadenamiento',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idcalculo_p4').highcharts({
                        chart: {
                            height: _this.calculo_p4.getInnerHeight(),
                            type: 'column'
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br>Importe: ' + this.y;
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Encadenamiento'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }});
        }
    };

    this.fnCalculoPlanEntidad = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/planmeta/index.php/analisisplanificacion/graficarCalculoPlanesPorEntidad',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    global: _this.chkGlobal.getValue()
                },
                callback: function (options, success, response)
                {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idcalculo_p3').highcharts({
                        chart: {
                            height: _this.calculo_p3.getInnerHeight(),
                            type: 'column'
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br>Importe: ' + this.y;
                            }
                        },
                        legend: {
                            enabled: true
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Importe'
                            }},
                        title: {
                            text: 'Planes por entidad'
                        },
                        subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        xAxis: {
                            categories: resp.categorias
                        },
                        credits: {
                            enabled: false
                        },
                        series: resp.data
                    });
                }});
        }
    };
    this.fncontrolarPaginado = function () {

        if (_this.total > 0) {
            _this.btfiltro.enable();
            _this.panelPag.enable();
            var base = (_this.total / _this.cantelementosporpagina).toFixedDown(0);
            var mod = _this.total % _this.cantelementosporpagina;
            _this.btnanterior.show();
            _this.btnprimerapagina.show();
            if (_this.start > 0) {
                _this.btnanterior.enable();
                _this.btnprimerapagina.enable();
            } else {
                _this.btnanterior.disable();
                _this.btnprimerapagina.disable();
            }

            _this.btnsiguiente.show();
            _this.btnultimapagina.show();
            if (_this.pagina != base + (mod > 0 ? 1 : 0)) {
                _this.btnsiguiente.enable();
                _this.btnultimapagina.enable();
            } else {
                _this.btnsiguiente.disable();
                _this.btnultimapagina.disable();
            }
            if (_this.pagina == base + (mod > 0 ? 1 : 0))
                _this.paginado.setText('Mostrando de ' + (_this.start + 1) + ' - ' + (_this.total) + ' de ' + _this.total);
            else
                _this.paginado.setText('Mostrando de ' + (_this.start + 1) + ' - ' + (_this.start + _this.cantelementosporpagina) + ' de ' + _this.total);
        } else {
            _this.panelPag.disable();
            this.paginado.setText('No existen datos a mostrar');
        }
    };
    this.limpiarPaginado = function () {
        _this.btnanterior.disable();
        _this.btnprimerapagina.disable();
        _this.btnsiguiente.disable();
        _this.btnultimapagina.disable();
        this.paginado.setText('');
    };
    this.habPag = function (v) {
        if (v == 1)
            _this.panelPag.enable();
        else
            _this.panelPag.disable();
        if (_this.componente == 'analisis') {
            _this.arbolEntidad.expand();
            _this.arbolEntidad.enable();
        }
        _this.cblabel.setText(' ');
        _this.CmbCentroBalance.hide();
        _this.labelTipoFrecuencia.setText(' ');
        _this.CmbTipoFrecuencia.hide();
        _this.chkGlobal.show();
    };
    this.activarFiltros = function (tab) {
        if (tab == 0 || tab == 1 || tab == 23 || tab == 18 || tab == 19 || tab == 20 || tab == 21 || tab == 22) {
            _this.cbEsp.enable();
            _this.CmbPlanes.enable();
            _this.cbCB.disable();
            _this.cbVia.disable();
            _this.cbOS.disable();
            _this.cbUM.disable();
        } else {
            if (tab == 33) {
            _this.cbEsp.disable();
                _this.CmbPlanes.disable();
                _this.cbCB.disable();
                _this.cbVia.disable();
                _this.cbOS.disable();
                _this.cbUM.disable();
            } else {
                _this.cbEsp.disable();
            _this.CmbPlanes.enable();
            _this.cbCB.enable();
            _this.cbVia.enable();
            _this.cbOS.enable();
            _this.cbUM.enable();
            }
        }
    };
    this.cargarFiltros = function () {
        if (_this.stCmbPlanes.data.length == 0) {
            _this.stCmbPlanes.reload({
                params: {
                    identidad: _this.identidad.id

                }
            });
        }
        if (_this.stCB.data.length == 0) {
            _this.stCB.reload({
                params: {
                    rector: _this.rectora

                }
            });
        }

        if (_this.stVia.data.length == 0)
            _this.stVia.reload();
        if (_this.stOS.data.length == 0)
            _this.stOS.reload();
        if (_this.stUM.data.length == 0)
            _this.stUM.reload();
        if (_this.stEsp.data.length == 0)
            _this.stEsp.reload();
    };
    Number.prototype.toFixedDown = function (digits) {
        var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
                m = this.toString().match(re);
        return m ? parseFloat(m[1]) : this.valueOf();
    };
};
