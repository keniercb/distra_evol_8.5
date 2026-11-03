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
    this.mihtml = '';
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
    if (opciones.hasOwnProperty('arbolEntidad')) {
        _this.arbolEntidad.addListener('click', function (n) {
            var nodoEst = n;
            var idestructura = nodoEst.id;
            if (idestructura != '' && idestructura != 'Estructuras' && idestructura != null) {
                _this.tabsanalisisplanificacion.enable();
            } else _this.tabsanalisisplanificacion.disable();

        });
    }

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
        id: 'idchkGlobalG',
        align: 'right',
        boxLabel: 'Global',
        hidden: true,
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
        autoLoad: true,
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
    //Combo codigo ind
    this.stCodInd = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/analisisplanificacion/listarCodigoInd',
        reader: new Ext.data.JsonReader({
                id: 'idindicador',
                root: 'data'
            },
            [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }]),
        listeners: {
            beforeload: function (st, opt) {
                Ext.Ajax.timeout = 6400000;
            },
            load: function (r, e, u) {
                _this.cbCodInd.enable();
                if (_this.componente == 'analisis') {
                    var t = _this.tabsanalisisplanificacion.getActiveTab();
                    _this.activarFiltros(t.activeTab);
                }
            }
        }
    });
    this.cbCodInd = new Ext.ux.form.LovCombo({
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
        store: _this.stCodInd,
        valueField: 'idindicador',
        displayField: 'codigo',
        id: 'cbCodInd',
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
            _this.cbCodInd.clearValue();
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
                    }, {bodyStyle: 'paddingTop: 3px;', border: false}, _this.cbUM,
                    {bodyStyle: 'paddingTop: 3px;', border: false}, {
                        xtype: 'label',
                        text: 'Código del indicador: '
                    }, {bodyStyle: 'paddingTop: 3px;', border: false}, _this.cbCodInd]
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
        height: 390,
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
    //******************Panel de las gráficas de Analisis de producciones por etapas*******************

    this.produccionesEtapas_p1 = new Ext.Panel({
        id: 'produccionesEtapas_p1',
        layout: 'fit',
        width: '100%',
        bodyBorder: false,
        height: '80%',
        html: '<div id="idproduccionesEtapas_p1" margin: 0 auto"></div>'
    });

    /****
     * ocupacion de campo x cultivo
     */

    this.stVariableAnalisis = new Ext.data.Store({
        url: '/planificacion/producciones/index.php/gestcartatecnologica/cargarVariables',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
            name: 'idvariable'
        }, {
            name: 'denominacionvariable'
        }]),
        listeners: {
            load: function (t) {
                if (_this.cbvariableAnalisis) {
                    if (_this.cbvariableAnalisis.getValue() == null || _this.cbvariableAnalisis.getValue() == "") {
                        _this.cbvariableAnalisis.setValue(t.reader.jsonData.data[0].idvariable);
                        if (_this.componente == 'Produccion') {
                            _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                        }
                    }
                }
            }
        }
    });
    this.labelVariableControl = new Ext.form.Label({
        xtype: "label",
        text: ''
    });

    this.cbvariableAnalisis = new Ext.form.ComboBox({
        id: 'cbvariableAnalisis',
        store: this.stVariableAnalisis,
        valueField: 'idvariable',
        hiddenName: 'idvariable',
        displayField: 'denominacionvariable',
        mode: 'local',
        allowBlank: true,
        // value:
        hidden: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        emptyText: 'Variable de control',
        loadingText: 'Cargando...',
        width: 180,
        fieldLabel: 'Variable de control',
        listeners: {
            select: function (cb, rec, index) {
                _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
            }
        }
    });

    this.ocupacionCampoxCultivo_p1 = new Ext.Panel({
        id: 'ocupacionCampoxCultivo_p1',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="idocupacionCampoxCultivo_p1" margin: 0 auto"></div>'
    });

    //Panel para tabla de Diagrama  de recursos
    this.pDiagramaRec = new Ext.Panel({
        id: 'pDiagramaRec',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="pDiagramaRec_p1" margin: 0 auto"></div>'
    });

    //Panel diagrama de cosecha
    this.pDiagramaCosecha = new Ext.Panel({
        id: 'pDiagramaCosecha',
        layout: 'fit',
        bodyBorder: false,
        height: '80%',
        width: '50%',
        html: '<div id="pDiagramaCosecha" margin: 0 auto"></div>'
    });

    /*******Paneles de las graficas Producciones*****************/

    this.prod_p5 = new Ext.Panel({
        id: 'prod_p5',
        layout: 'fit',
        region: 'center',
        bodyBorder: false,
        height: '80%',
        width: '100%',
        html: '<div id="idprod_p5" margin: 0 auto"></div>'
    });
    /*******Fin de paneles de las graficas Producciones*****************/

    var etiquetaCbVariableControl = '<div id="idvarcontrol" style="display:none; margin: 0px 3px;">Variable de control: </div>';
    var etiquetaCbEjecicio = '<div style="margin: 0px 3px;"> Ejercicio: </div>';

    //Componente con todas las graficas por tabs
    this.tabsanalisisplanificacion = new Ext.TabPanel({
        activeTab: 0,
        enableTabScroll: true,
        tbar: ['Ejercicio: ', _this.cmbEjercicio, '-', _this.btfiltro, '-', _this.chkGlobal, _this.labelVariableControl, _this.cbvariableAnalisis],
        id: 'tabsanalisisplanificacion',
        region: 'center',
        disabled: (opciones.hasOwnProperty('disabledTabAnalisis')) ? opciones.disabledTabAnalisis : true,
        listeners: {
            beforedestroy: function (tp) {
                _this.winFiltrosPag.destroy();
            }
        }
    });
    if (_this.componente == 'NA' || _this.componente == 'analisis' || _this.componente == 'Analisis-Produccion') {
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

    if (_this.componente == 'Plan' || _this.componente == 'analisis' || _this.componente == 'Analisis-Produccion') {
        //tabs de Plan
        _this.tabsanalisisplanificacion.add({
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
    if (_this.componente == 'Produccion' || _this.componente == 'Analisis-Produccion') {
        _this.tabsanalisisplanificacion.add({
            title: 'Producciones por etapas',
            id: 'produccionesEtapas',
            activeTab: 27,
            layout: 'fit',
            html: "<div id = 'produccionesEtapas_contenedor' ></div>",
            items: [_this.produccionesEtapas_p1],
            listeners: {
                activate: function (p) {
                    _this.btfiltro.disable();
                    _this.start = 0;
                    _this.chkGlobal.hide();
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                },
                deactivate: function () {
                    _this.chkGlobal.show();
                }
            }
        }, {
            title: 'Ocupación del campo por cultivo',
            id: 'ocupacionCampoxCultivo',
            activeTab: 28,
            layout: 'fit',
            html: "<div id = 'ocupacionCampoxCultivo_contenedor' ></div>",
            items: [_this.ocupacionCampoxCultivo_p1],
            listeners: {
                activate: function () {
                    _this.btfiltro.disable();
                    _this.chkGlobal.hide();
                    //_this.mostrarOcultarDiv('idvarcontrol', 'block');
                    _this.labelVariableControl.setText('Variable de control: ');
                    _this.cbvariableAnalisis.show();
                    _this.start = 0;
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                },
                deactivate: function () {
                    _this.chkGlobal.show();
                    //_this.mostrarOcultarDiv('idvarcontrol', 'none');
                    _this.labelVariableControl.setText('');
                    _this.cbvariableAnalisis.hide();
                }
            }
        }, {
            title: 'Diagrama de recursos',
            id: 'pqpDiagramaRec',
            activeTab: 29,
            layout: 'fit',
            html: "<div id = 'idpDiagramaRec_p1' ></div>",
            items: [_this.pDiagramaRec],
            listeners: {
                activate: function () {
                    _this.btfiltro.disable();
                    _this.start = 0;
                    _this.chkGlobal.hide();
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                },
                deactivate: function () {
                    _this.chkGlobal.show();
                }
            }
        }, {
            title: 'Diagrama de cosecha',
            id: 'tabDiagramaCosecha',
            activeTab: 30,
            layout: 'fit',
            html: "<div id = 'pDiagramaCosecha_contenedor' ></div>",
            items: [_this.pDiagramaCosecha],
            listeners: {
                activate: function () {
                    _this.btfiltro.disable();
                    _this.start = 0;
                    _this.chkGlobal.hide();
                    _this.pagina = 1;
                    _this.fnPintar(_this.identidad, _this.cmbEjercicio.getValue());
                },
                deactivate: function () {
                    _this.chkGlobal.show();
                }
            }
        });
    }

    this.panelGraficas = function () {
        return _this.tabsanalisisplanificacion;
    };
    this.actualizarParametros = function (nodeEntidad, componente, start, pagina) {
        _this.identidad = nodeEntidad;
        _this.componente = componente;
        _this.start = start;
        _this.pagina = pagina;
    };
    this.limpiarGraficas = function (accion) {
        _this.tabsanalisisplanificacion.setVisible(accion);
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
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.fnNivAct(nodeEntidad);
                    break;
                case 2:
                    _this.habPag(0);
                    _this.activarFiltros(tab.activeTab);
                    _this.limpiarPaginado();
                    _this.fnPlanNorDir(nodeEntidad);
                    break;
                case 3:
                    _this.habPag(0);
                    _this.activarFiltros(tab.activeTab);
                    _this.limpiarPaginado();
                    _this.fnPlanBF(nodeEntidad);
                    break;
                case 5:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.fnPlanMV(nodeEntidad);
                    break;
                case 23:
                    _this.habPag(0);
                    _this.activarFiltros(tab.activeTab);
                    _this.limpiarPaginado();
                    _this.fnActNivActResumen(nodeEntidad);
                    break;
                case 26:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.fnPlanCB(nodeEntidad);
                    break;
                case 27:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.graficarPorEtapasMeses(nodeEntidad, 1);
                    break;
                case 28:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.graficarOcupacionDelCampoXCultivo(nodeEntidad);
                    break;
                case 29:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.graficarPorEtapasMeses(nodeEntidad, 2);
                    break;
                case 30:
                    _this.habPag(1);
                    _this.activarFiltros(tab.activeTab);
                    _this.graficarPorEtapasMeses(nodeEntidad, 3);
                    break;
            }
        }
    };
    this.fnActNivAct = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            if (_this.start == 0) {
                Ext.Ajax.request({
                    url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarActNivelesActividad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response) {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else
                _this.fncontrolarPaginado();
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarActNivelesActividad',
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
                callback: function (options, success, response) {
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
                    url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarNivelesActividad',
                    method: 'POST',
                    params: {
                        identidad: nodeEntidad.id,
                        idejercicio: _this.cmbEjercicio.getValue(),
                        global: _this.chkGlobal.getValue(),
                        contar: true,
                        idPlan: _this.CmbPlanes.getCheckedValue(),
                        idEsp: _this.cbEsp.getCheckedValue()
                    },
                    callback: function (options, success, response) {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else {
                _this.fncontrolarPaginado();
            }
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarNivelesActividad',
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
                callback: function (options, success, response) {
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
                url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarActNivelesActividad',
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
                callback: function (options, success, response) {
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
                url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarNivelesActividad',
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
                callback: function (options, success, response) {
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
                    idUM: _this.cbUM.getCheckedValue(),
                    codigoInd: _this.cbCodInd.getCheckedValue()
                },
                callback: function (options, success, response) {
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
                            }
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
                            }
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
                    idUM: _this.cbUM.getCheckedValue(),
                    codigoInd: _this.cbCodInd.getCheckedValue()
                },
                callback: function (options, success, response) {
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
                            }
                        },
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
                            }
                        },
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
                        idUM: _this.cbUM.getCheckedValue(),
                        codigoInd: _this.cbCodInd.getCheckedValue()
                    },
                    callback: function (options, success, response) {
                        resp = Ext.decode(response.responseText);
                        _this.total = resp;
                        _this.fncontrolarPaginado();
                    }
                });
            } else {
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
                    idUM: _this.cbUM.getCheckedValue(),
                    codigoInd: _this.cbCodInd.getCheckedValue()
                },
                callback: function (options, success, response) {
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
                            }
                        },
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
                        idUM: _this.cbUM.getCheckedValue(),
                        codigoInd: _this.cbCodInd.getCheckedValue()
                    },
                    callback: function (options, success, response) {
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
                    idUM: _this.cbUM.getCheckedValue(),
                    codigoInd: _this.cbCodInd.getCheckedValue()
                },
                callback: function (options, success, response) {
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
    this.fnProdCapOcup = function (nodeEntidad) {
        if (nodeEntidad != null && _this.cmbEjercicio.getValue() != '') {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarOcupacionCapacidadPorVariable',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    idvariable: _this.CmbVariableCont.getValue(),
                    global: _this.chkGlobal.getValue()//,
                    //fechaini: _this.fini.getValue().format('d/m/Y'),
                    //fechafinh: 3
                    //fechaini: _this.fini.getValue()/*.format('d/m/Y')*/,
                    //fechafin: _this.ffin.getValue()/*.format('d/m/Y')*/
                },
                callback: function (options, success, response) {
                    resp = Ext.decode(response.responseText);
                    _this.mymask.hide();
                    $('#idprod_p1').highcharts({
                        chart: {
                            type: 'pie',
                            height: _this.prod_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ocupación de la capacidad por variable'
                        }, tooltip: {
                            pointFormat: '<b>Ocupación</b>: {point.y}<br><b>Porciento ocupado</b>:{point.percentage:.1f}%'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Brands',
                            colorByPoint: true,
                            data: resp.data
                        }]
                    });
                    $('#idprod_p2').highcharts({
                        chart: {
                            type: 'pie',
                            height: _this.prod_p1.getInnerHeight(),
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ocupación de la capacidad por variable'
                        }, tooltip: {
                            pointFormat: '<b>Ocupación</b>: {point.y}<br><b>Porciento ocupado</b>:{point.percentage:.1f}%'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Brands',
                            colorByPoint: true,
                            data: resp.data
                        }]
                    });
                }
            });
        }

    };
    this.graficarProducciónMensualPorProducto = function (nodeEntidad) {
        Ext.Ajax.request({
            url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarProduccionMensualPorProducto',
            method: 'POST',
            params: {
                identidad: nodeEntidad.id,
                idejercicio: _this.cmbEjercicio.getValue()
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                $('#prod_p5').highcharts({
                    chart: {
                        type: 'column',
                        height: _this.prod_p5.getInnerHeight(),
                        zoomType: 'xy'
                    }, subtitle: {
                        text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                    },
                    title: {
                        text: 'Producción mensual'
                    }, tooltip: {
                        // pointFormat: '{series.name}: <b></n>Ocupación: {point.y}</n>Porciento: {point.percentage:.1f}%</b>'
                        formatter: function () {
                            return '<b>  Producción en ' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>'
                        }
                        // pointFormat: '<b>Producción</b>: {point.y}</n>{point.percentage:.1f}%'
                    },
                    xAxis: {
                        categories: respuesta.categorias,
                        crosshair: true
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'Producción (en unidades)'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: respuesta.data
                });
            }
        });
    };

    this.graficarPorEtapasMeses = function (nodeEntidad, tipo) {
        this.url = '';
        if (tipo == 1) {
            _this.url = '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/listarEtapasProducciones';
        } else if (tipo == 2 || tipo == 3) {
            _this.url = '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/listarMeses';
        }
        if (nodeEntidad != null && nodeEntidad.id != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: _this.url,
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    denomejercicio: _this.cmbEjercicio.getRawValue()
                },
                callback: function (options, success, response) {
                    if (_this.chkGlobal.show()) {
                        _this.chkGlobal.hide();
                    }
                    responseData = Ext.decode(response.responseText);
                    _this.configurarGrid(nodeEntidad, _this.cmbEjercicio.getValue(), _this.cmbEjercicio.getRawValue()
                        , responseData.data, tipo);
                    _this.mymask.hide();
                }
            });
        }
    };

    this.graficarOcupacionDelCampoXCultivo = function (nodeEntidad) {
        if (nodeEntidad != null && nodeEntidad.id != null) {
            _this.mymask.show();
            Ext.Ajax.request({
                url: '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarOcupacionCampoXCultivo',
                method: 'POST',
                params: {
                    identidad: nodeEntidad.id,
                    idejercicio: _this.cmbEjercicio.getValue(),
                    idvariable: _this.cbvariableAnalisis.getValue(),
                    idejercicioRaw: parseInt(_this.cmbEjercicio.getRawValue())
                },
                callback: function (options, success, response) {
                    if (_this.chkGlobal.show()) {
                        _this.chkGlobal.hide();
                    }
                    _this.respuesta = Ext.decode(response.responseText);
                    _this.objectSeries = [];

                    /*if (_this.respuesta.hasOwnProperty('codMsgN') && _this.respuesta.codMsgN == '2') {
                        mostrarMensaje(1, 'Debe seleccionar una variable de control.');
                    }*/
                    var cant = _this.respuesta.data.length;
                    for (var i = 0; i < cant; i++) {
                        _this.objectSeries.push({
                            type: _this.respuesta.data[i].type,
                            name: _this.respuesta.data[i].name,
                            data: _this.respuesta.data[i].data
                        })
                    }

                    _this.objectSeries.push({
                        type: 'spline',
                        name: 'Capacidad productiva',
                        data: _this.respuesta.capacidad,
                        marker: {
                            lineWidth: 2,
                            lineColor: '#CCC',
                            fillColor: 'white'
                        }
                    });
                    $('#ocupacionCampoxCultivo_p1').highcharts({
                        chart: {
                            height: _this.ocupacionCampoxCultivo_p1.getInnerHeight(),
                            type: 'column',
                            zoomType: 'xy'
                        }, subtitle: {
                            text: '<b>Entidad: ' + nodeEntidad.text + '</b>'
                        },
                        title: {
                            text: 'Ocupación del campo por cultivo'
                        },
                        xAxis: {
                            categories: _this.respuesta.meses
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: _this.respuesta.variable
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'gray'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{point.x}</b><br/>',
                            //pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                            pointFormat: '{series.name}: {point.y}'
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                    color: 'white'
                                }
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        series: _this.objectSeries
                    });
                    _this.mymask.hide();
                }
            });
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
    };
    this.activarFiltros = function (tab) {
        if (tab == 0 || tab == 1 || tab == 23 || tab == 18 || tab == 19 || tab == 20 || tab == 21 || tab == 22) {
            _this.cbEsp.enable();
            _this.CmbPlanes.enable();
            _this.cbCB.disable();
            _this.cbVia.disable();
            _this.cbOS.disable();
            _this.cbUM.disable();
            _this.cbCodInd.disable();
        } else {
            if (tab == 33 || tab == 40) {
                _this.cbEsp.disable();
                _this.CmbPlanes.disable();
                _this.cbCB.disable();
                _this.cbVia.disable();
                _this.cbOS.disable();
                _this.cbUM.disable();
                _this.cbCodInd.disable();
            } else {
                _this.cbEsp.disable();
                _this.CmbPlanes.enable();
                _this.cbCB.enable();
                _this.cbVia.enable();
                _this.cbOS.enable();
                _this.cbUM.enable();
                _this.cbCodInd.enable();
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
        if (_this.stCodInd.data.length == 0)
            _this.stCodInd.reload();
    };
    Number.prototype.toFixedDown = function (digits) {
        var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
            m = this.toString().match(re);
        return m ? parseFloat(m[1]) : this.valueOf();
    };

    //EditorGrid dinámico por etapas
    this.crearGrid = function (stProd, cmProd, tipo) {
        return new Ext.grid.GridPanel({
            store: stProd,
            id: 'gpProd' + tipo,
            region: 'center',
            cm: cmProd,
            frame: true,
            autoExpandColumn: 'expandir',
            loadMask: {
                msg: 'Cargando ...'
            },
            listeners: {
                click: function (n) {


                }
            }
        });
    };


    this.configurarGrid = function (nodeEntidad, ejercicio, denomejercicio, columnas, tipo) {
        //Configurando el GridEditor
        this.readerDina = [];
        this.cmdina = [];
        this.uri = '';
        if (tipo == 1) {
            this.uri = '';
            _this.uri = '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/graficarProduccionPorEtapas';

            this.readerDina.push({
                name: 'idaplicacioncartatec'
            });
            this.readerDina.push({
                name: 'denominacion'
            });
            _this.cmdina.push({
                header: 'Producciones',
                tooltip: 'Producciones',
                dataIndex: 'denominacion',
                id: 'expandir',
                renderer: function (value, m) {
                    m.attr = 'ext:qtip="' + value + '"';
                    return value;
                }
            });
            if (Array.isArray(columnas)) {
                var cant = columnas.length
                for (var i = 0; i < cant; i++) {
                    _this.readerDina.push({
                        name: columnas[i].iddatosnomenclador
                    });
                    _this.cmdina.push({
                        header: columnas[i].denominacion + ' (Inicio - Fin)',
                        tooltip: columnas[i].denominacion,
                        dataIndex: columnas[i].iddatosnomenclador,
                        width: 150,
                        align: 'center',
                        renderer: function (value, m) {
                            if (value != null) {
                                //Se divide las 2 fechas
                                var temp = value.split('_');
                                // Se elimina el caracter "\"
                                var date = temp[0].replace("\\", "") + ' - ' + temp[1].replace("\\", "");
                                m.attr = 'ext:qtip="' + date + '"';
                                return date;
                            } else {
                                m.attr = 'ext:qtip="-"';
                                return '-';
                            }
                        }


                    });

                }
            }

            this.jrStProd = new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'jrStProd' + tipo,
                fields: _this.readerDina
            });
            this.stProd = new Ext.data.Store({
                url: _this.uri,
                id: 'stProd' + tipo,
                baseParams: {
                    identidad: nodeEntidad.id,
                    idejercicio: ejercicio,
                    denomejercicio: denomejercicio
                },
                reader: _this.jrStProd,
                listeners: {
                    load: function (store, record, options) {

                        if (store.getCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        }
                    }
                }

            });

            this.cmProd = new Ext.grid.ColumnModel(_this.cmdina);
            _this.stProd.reload();

            _this.produccionesEtapas_p1.add(_this.crearGrid(this.stProd, _this.cmProd, tipo));
            _this.produccionesEtapas_p1.doLayout();

        } else if (tipo == 2 || tipo == 3) {
            _this.uri = '/planificacion/producciones/index.php/analisisplanificacionsisplanproducciones/listarRecursosProduccionesPorMes';
            _this.readerDina.push({
                name: 'codigo'
            });
            _this.readerDina.push({
                name: 'denominacion'
            });
            this.readerDina.push({
                name: 'idumedida'
            });
            _this.cmdina.push({
                header: 'Código',
                tooltip: 'Código',
                dataIndex: 'codigo',
                renderer: function (value, m) {
                    m.attr = 'ext:qtip="' + value + '"';
                    return value;
                }
            });
            if (tipo == 2) {
                _this.cmdina.push({
                    header: 'Recursos',
                    tooltip: 'Recursos',
                    dataIndex: 'denominacion',
                    id: 'expandir',
                    width: 100,
                    renderer: function (value, m) {
                        m.attr = 'ext:qtip="' + value + '"';
                        return value;
                    }
                });
            }
            if (tipo == 3) {
                _this.cmdina.push({
                    header: 'Producción',
                    tooltip: 'Producción',
                    dataIndex: 'denominacion',
                    id: 'expandir',
                    width: 100,
                    renderer: function (value, m) {
                        m.attr = 'ext:qtip="' + value + '"';
                        return value;
                    }
                });
            }
            _this.cmdina.push({
                header: 'UM',
                tooltip: 'Unidad de medida',
                dataIndex: 'idumedida',
                renderer: renderUM
            });

            for (var i = 0; i < columnas.length; i++) {
                _this.cmdina.push({
                    header: columnas[i].denominacion,
                    tooltip: columnas[i].denominacion,
                    dataIndex: 'col_' + columnas[i].iddatosnomenclador,
                    align: 'right',
                    renderer: function (v, m) {
                        m.attr = 'ext:qtip="' + v + '"';
                        return v;
                    }
                });
                _this.readerDina.push({
                    name: 'col_' + columnas[i].iddatosnomenclador
                })
            }


            this.jrStProd = new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'jrStProd' + tipo,
                fields: _this.readerDina
            });
            this.stProd = new Ext.data.Store({
                url: _this.uri,
                id: 'stProd' + tipo,
                baseParams: {
                    identidad: nodeEntidad.id,
                    idejercicio: ejercicio,
                    denomejercicio: denomejercicio,
                    tipo: tipo
                },
                reader: _this.jrStProd,
                listeners: {
                    beforeload: function (st) {

                    },
                    load: function (store, record, options) {

                        if (store.getCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        }
                    }
                }

            });
            this.cmProd = new Ext.grid.ColumnModel(_this.cmdina);
            _this.stProd.reload();
            if (Ext.getCmp('gpProd' + tipo)) {
                _this.pDiagramaRec.remove(Ext.getCmp('gpProd' + tipo));

            }
            if (tipo == 2) {
                _this.pDiagramaRec.add(_this.crearGrid(_this.stProd, _this.cmProd, tipo));
                _this.pDiagramaRec.doLayout();
            }
            if (tipo == 3) {
                _this.pDiagramaCosecha.add(_this.crearGrid(_this.stProd, _this.cmProd, tipo));
                _this.pDiagramaCosecha.doLayout();
            }
        }


    };

    function renderUM(value, m) {
        var cant = _this.stUM.data.items.length;
        for (var i = 0; i < cant; i++) {
            if (_this.stUM.data.items[i].data.hasOwnProperty('idunidadmedida') && _this.stUM.data.items[i].data.idunidadmedida == value) {
                m.attr = 'ext:qtip="' + _this.stUM.data.items[i].data.denominacionunidadmedida + '"';
                return _this.stUM.data.items[i].data.denominacionunidadmedida;
            } else if (_this.stUM.data.items[i].data.hasOwnProperty('idumedida') && _this.stUM.data.items[i].data.idumedida == value) {
                m.attr = 'ext:qtip="' + _this.stUM.data.items[i].data.denominacion + '"';
                return _this.stUM.data.items[i].data.denominacion;
            }
        }
        m.attr = 'ext:qtip=""';
        return '';
    }

    this.mostrarOcultarDiv = function (id, display) {
        if (document.getElementById) {
            var el = document.getElementById(id);
            el.style.display = display;
        }
    }

};
