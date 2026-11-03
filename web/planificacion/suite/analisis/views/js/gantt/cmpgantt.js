Utilidades.Cmp.Cmpgantt = function () {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    this.BarraProgreso = new BarraEstado();
    this.cont = 0;
    this.idSistemaSeleccionado = "";
    this.params;
    this.subsistemaInicial;
    this.objCmpGanttTab_1;
    this.arrayIdSubsistemas = [];

    //***
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
            if (size.width < 1 && size.height < 1) { // display none?
                return;
            }
            var h = size.height - target.getPadding('tb'),
                ph = h;
            this.innerCt.setSize({height: h});
            // some rows can be percentages while others are fixed
            // so we need to make 2 passes
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
    //**

    //funcion donde se muestra la ventana principal
    this.Gantt = function () {
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.subsistemaInicial = responseData[0];
                _this.params = {
                    idPanelPincipal: _this.subsistemaInicial.id,
                    tipoPermDadoSubsistema: _this.subsistemaInicial.tipoPermDadoSubsistema,
                    titulo: _this.subsistemaInicial.titulo
                };
                _this.idSistemaSeleccionado = _this.subsistemaInicial.id;

                //objeto Crudganttproy inicializado
                _this.objCrudGantt = new Utilidades.Cmp.Crudganttact(
                    {
                        urlCargarActividades: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/actividadesparagantt',
                        urlEliminarActividad: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
                        urlActualizarPorciento: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/Actualizarporcientodecumplimiento',
                        urlModificarActividad: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/modificarFechaGantt',
                        urlCargarPlanes: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
                        usarDependencia: true,
                        usarCrudActividades: true,
                        subsistemaInicial: _this.subsistemaInicial.id
                    });

                _this.objCmpGanttTab_1 = new Ext.Panel({
                    id: _this.params.idPanelPincipal,
                    frame: true,
                    closable: false,
                    title: _this.params.titulo,
                    closeAction: 'destroy',
                    layout: 'ux.row',
                    items: [{
                        rowHeight: 1,
                        width: '100%',
                        border: false,
                        layout: 'fit',
                        items: [_this.objCrudGantt.pGantt]
                    }]
                });
                _this.crearInterfazGantt();
                _this.objCrudGantt.Gantt();
            }
        });
    };

    this.crearInterfazGantt = function () {

        this.tpSubsistemas = new Ext.tree.TreePanel({
            useArrows: true,
            collapsible: true,
            width: 250,
            region: 'west',
            frame: false,
            margins: '3 3 3 3',
            title: 'Subsistemas',
            autoScroll: true,
            loader: new Ext.tree.TreeLoader({
                singleClickExpand: true,
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/obtenerSistemas',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        _this.BarraProgreso.show('Cargando diagrama de gantt');
                    },
                    'load': function (atreeloader, anode) {
                        _this.tpSubsistemas.getRootNode().firstChild.select();
                        _this.nodoselect = _this.tpSubsistemas.getRootNode().firstChild;
                        _this.arrayIdSubsistemas[_this.cont++] = _this.nodoselect.id;
                        _this.idSistemaSeleccionado = _this.nodoselect.id;
                        _this.BarraProgreso.hide();
                    }
                }
            }),
            root: {
                id: 'up',
                text: 'Subsistemas',
                expanded: true,
                iconCls: 'up'
            },
            rootVisible: true,
            listeners: {
                click: function (nodo) {
                    if (nodo.id != 'up') {
                        _this.idSistemaSeleccionado = nodo.id;
                        _this.tituloSistema = nodo.attributes.titulo;
                        _this.denomSistema = nodo.attributes.text;
                        _this.params = {
                            idPanelPincipal: _this.idSistemaSeleccionado,
                            tipoPermDadoSubsistema: nodo.attributes.tipoPermDadoSubsistema,
                            titulo: nodo.attributes.titulo
                        };
                        if (!_this.isSubsistemaInstanciado(_this.idSistemaSeleccionado)) {
                            _this.instanciarGanttDadoSubsistema(_this.params);
                            _this.arrayIdSubsistemas[_this.cont++] = _this.idSistemaSeleccionado;
                        } else {
                            if (_this.tpGestionDeGantt.getItem(_this.idSistemaSeleccionado) == undefined) {
                                _this.instanciarGanttDadoSubsistema(_this.params);
                            } else {
                                if (_this.tpGestionDeGantt.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                                    _this.tpGestionDeGantt.setActiveTab(_this.tpGestionDeGantt.getItem(_this.idSistemaSeleccionado));
                                }
                            }
                        }
                    }
                }
            }
        });

        this.tpGestionDeGantt = new Ext.TabPanel({
            activeTab: 0,
            id: 'tpsistema',
            region: 'center',
            frame: true,
            anchor: '100%',
            items: [_this.objCmpGanttTab_1],
            listeners: {
                tabchange: function (tbPanel, tab) {
                    if (_this.tpGestionDeGantt.getActiveTab().getId() != _this.idSistemaSeleccionado) {
                        _this.tpSubsistemas.getNodeById(_this.tpGestionDeGantt.getActiveTab().getId()).select();
                        _this.idSistemaSeleccionado = _this.tpGestionDeGantt.getActiveTab().getId();
                    }
                }
            }
        });
        //ventana principal de la vista
        this.WinPrincipal = new Ext.Window({
            layout: 'border',
            closable: false,
            maximized: true,
            modal: true,
            width: 1000,
            height: 510,
            items: [_this.tpSubsistemas, _this.tpGestionDeGantt]
        });
        _this.WinPrincipal.show();
    };

    this.isSubsistemaInstanciado = function (idSubsistema) {
        var esInstanciado = false;
        for (var i = 0; i < _this.arrayIdSubsistemas.length; i++) {
            if (_this.arrayIdSubsistemas[i] == idSubsistema) {
                esInstanciado = true;
                break;
            }
        }
        return esInstanciado;
    };

    this.instanciarGanttDadoSubsistema = function (params) {

        /*if(params.idPanelPincipal == 1){
            //objeto Crudganttact inicializado
            _this.objCrudGantt = new Utilidades.Cmp.Crudganttact(
                {
                    urlCargarActividades: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/actividadesparagantt',
                    urlEliminarActividad: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
                    urlActualizarPorciento: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/Actualizarporcientodecumplimiento',
                    urlModificarActividad: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/modificarFechaGantt',
                    urlCargarPlanes: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
                    usarDependencia: true,
                    usarCrudActividades: true,
                    subsistemaInicial: _this.subsistemaInicial.id
                });
        } else if(params.idPanelPincipal ==2){

        }*/

        //objeto Crudganttproy inicializado
        this.objCrudGantt2 = new Utilidades.Cmp.Crudganttproy({
            urlCargarActividades: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/actividadesparagantt',
            //urlCargarActividades: '/planificacion/suite/analisis/index.php/cmpdiagramagantt/tareasgantt',
            urlEliminarActividad: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
            urlActualizarPorciento: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/Actualizarporcientodecumplimiento',
            urlModificarActividad: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/modificarFechaGantt',
            urlCargarPlanes: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
            usarDependencia: true,
            usarCrudActividades: true,
            subsistemaInicial: _this.subsistemaInicial.id
        });
        var objCmpGantt = new Ext.Panel({
            id: params.idPanelPincipal,
            frame: true,
            closable: true,
            title: params.titulo,
            closeAction: 'destroy',
            layout: 'ux.row',
            items: [{
                rowHeight: 1,
                width: '100%',
                border: false,
                layout: 'fit',
                items: [_this.objCrudGantt2.pGantt]
            }]
        });
        _this.tpGestionDeGantt.add(objCmpGantt);
        _this.tpGestionDeGantt.activate(objCmpGantt);
        _this.objCrudGantt2.pGanttA.doLayout();
        //objCmpGantt.doLayout();
        _this.objCrudGantt2.Gantt();
    };


};
