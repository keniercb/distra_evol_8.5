Ext.ns('LOG.lb.plugin');
LOG.lb.plugin.Extensionesbase = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.dirController = '/logistica/utiles/plugin/index.php/extensionesbase';
        this.urlBusquedaGridPrincipal = 'cargarDatos';
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'ventana';
        this.panelBotonesVisible = false;
        this.tipo = 'default';
        this.name = 'default';
        this.lbTree = '';
        this.campoDescripcion = 'default';
        this.idGridPrincipal = 'default'
        this.isInit = false;
        this.allowBlank = true;
        LOG.util.UIManager.apply(LOG.lb.extensionesbase.Idioma, LOG.util.Idioma);
        LOG.util.UIManager.apply(config.idioma, LOG.lb.extensionesbase.Idioma);
        LOG.lb.plugin.Extensionesbase.superclass.constructor.call(this, config);
        
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultButtons: function() {
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.lbDenominacion,
            width: 120,
            dataIndex: 'denominacion',
            name: 'denominacion',
            default: true,
            autoExpand: true
                
        });
    },
    render: function() {
        var vista = LOG.lb.plugin.Extensionesbase.superclass.render.call(this);
        var _this = this;
        LOG.util.UIManager.apply(this.getStorePrincipal().baseParams, {
            tipo: this.tipo
        });
        this.getStorePrincipal().load();
        this.getSmPrincipal().fireEvent = this.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e == 'rowselect') {
                _this.getVistaPrincipal().listaBotones.getItem(2).enable();
            }
            if (e == 'rowdeselect') {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        });
        return vista;
    },
    getViewPanel: function() {
        var _this = this;
        var colformn = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.triggerFieldExtensiones = new Ext.form.TriggerField({
            fieldLabel: (this.lbTree!= '')?this.lbTree: this.idioma.lbNombre,
            name: _this.name,
            triggerAction: 'all',
            editable: false,
            allowBlank: _this.allowBlank,
            emptyText: 'Seleccione...'
        });
        colformn.addComponent(this.triggerFieldExtensiones);
        this.triggerFieldExtensiones.onTriggerClick = function() {
            _this.onSelectionBtnClick();
        };
        return colformn;
    },
    onSelectionBtnClick: function() {
        var _this = this;
        if (!_this.isInit) {
            _this.init();
            _this.getVistaPrincipal().aceptarFn = function() {
                _this.triggerFieldExtensiones.setRawValue(_this.getGridPrincipal().getSelectionModel().getSelected().get(_this.campoDescripcion));
                _this.triggerFieldExtensiones.fireEvent('change');

                if (typeof _this.fn == 'function') {
                    _this.fn.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelected().id]).call();
                }
            };
            _this.isInit = true;
            _this.vista = _this.view();
        } else {
            _this.vista.show();
        }
    },
    getVentana: function(){
         var _this = this;
        
            _this.init();
             _this.getVistaPrincipal().aceptarFn = function() {
             if (typeof _this.fn == 'function') {
                    _this.fn.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections()]).call();
            }
              };
            _this.view();
       
    }
});