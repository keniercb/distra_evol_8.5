Ext.QuickTips.init();
var perfil = eval(uneval(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('calendario', cargarInterfaz);
//prueba
function cargarInterfaz() {
    var _this = this;
    this.objCmpCalendario = new Utilidades.Cmp.Cmpcalendario({
        noUsarModificar: false,
        noUsarEliminar: false,
        noUsarActivar: false,
        noUsarDesactivar: false,
        noUsarCerrarWinP: true,
        noUsarSeleccionarWinP: true,
        maxWinPrincipal: true,
        noUsarCbAprob: false,
        noUsarGestObser: false,
        noMostrarColumObser: false,
        noUsarMenuGrid: false,
        idcomponente: 'produccion',
        urlCargarElementosCal: '/planificacion/producciones/index.php/calendario/cargarElementosCal',
        urlCargarCalendariosIniciales: '/planificacion/producciones/index.php/calendario/cargarCalendariosIniciales',
        noUsarPanelOpcionesDeBusqueda: true,
        noUsarTPCalendario: true,
        noUsarAdicionar: true,
        noUsarReporte: true,
        noUsarConfigFirma: true,
        noUsarGuardarCal: true,
        noUsarAyuda: true,
        habilitarEdicion: false,
        collapsedDPPCalendario: false

    });
    this.pCalendario = _this.objCmpCalendario.obtenerPCalendario();
    this.pCalendario.disable();
    this.dppCalendario = _this.objCmpCalendario.obtenerDPPCalendario();
    this.datePicker = _this.dppCalendario.getComponent(0);
    this.vistaCalendario = _this.objCmpCalendario.obtenerVistaCalendario();
    this.btnActualizar = _this.objCmpCalendario.obtenerBtnActualizar();
    this.idestructura = '';
    this.trEntidades = new Ext.estructura.panel.PanelEstructura(
        {
            cargos: false,
            menu: false
        });
    _this.trEntidades.btnBuscar.setText("");
    _this.trEntidades.btnLimpiar.setText("");
    _this.trEntidades = _this.trEntidades.items.items[0];
    _this.trEntidades.getRootNode().expand();
    _this.trEntidades.region = 'west';
    _this.trEntidades.width = 170;
    _this.trEntidades.split = false;
    _this.trEntidades.getRootNode().attributes.text = perfil.etiquetas.lbOrganismos;
    _this.trEntidades.getRootNode().text = perfil.etiquetas.lbEntidades;
    _this.trEntidades.autoScroll = true;
    _this.trEntidades.addListener('click', function (n) {
        var nodoEst = n;
        _this.idestructura = nodoEst.id;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        var eventStore = _this.vistaCalendario.eventStore;
        _this.reloadEventStore(eventStore, _this.idestructura);

    });

    _this.dppCalendario.insert(2, _this.trEntidades);
    _this.btnActualizar.setHandler(function () {
        _this.reloadEventStore(_this.vistaCalendario.eventStore, _this.idestructura)
    });

    _this.datePicker.on('select', function (dp, rf) {
        var eventStore = _this.vistaCalendario.eventStore;
        if (_this.idestructura != '' && _this.idestructura != 'Estructuras') {
            eventStore.baseParams.idestructura = _this.idestructura;
            _this.vistaCalendario.setStartDate(rf);
            _this.pCalendario.enable();
        } else {
            _this.pCalendario.disable();
            eventStore.baseParams.idestructura = '';
            eventStore.loadData({"data": [], "total": 0});
        }
    });
    _this.objCmpCalendario.CargarCmpCalendario(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null);

    this.reloadEventStore = function (eventStore, idestructura) {
        if (idestructura != '' && idestructura != 'Estructuras') {
            eventStore.baseParams.idestructura = idestructura;
            eventStore.reload({
                params: {
                    idestructura: idestructura,
                    start: eventStore.baseParams.start,
                    end: eventStore.baseParams.end,
                }
            });
            _this.pCalendario.enable();
        } else {
            _this.pCalendario.disable();
            eventStore.baseParams.idestructura = '';
            eventStore.loadData({"data": [], "total": 0});
        }


    }
}
