/**
 * Created by yoendy on 12/11/15.
 */
Ext.ns('LOG.movimiento.aft');
LOG.movimiento.aft.winImportar = Ext.extend(LOG.util.Window, {
    width: 250,
    height: 70,
    layout: 'fit',
    usarAplicar: false,
    constructor: function (config) {

        LOG.movimiento.aft.winImportar.superclass.constructor.call(this, config);
    }
});

LOG.movimiento.aft.winSeleccionarRegistros = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;

        this.formaVisualizacion = 'ventana';
        this.autoShow = true;
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.autoSelect = false;
        this.idioma = config.idioma;
        this.dirController = '/logistica/activos_fijos/movimiento/index.php/movimiento';
        this.urlBusquedaGridPrincipal = 'cargadisponibles';
        this.idGridPrincipal = 'idregnumerico';
        this.idestructuraop = config.idarearesp;
        this.iddocumento = config.iddocumento;
        this.idoperacion = config.idoperacion;
        this.filterParams = config.filterParams;
        this.gridARecargar = config.grid;
        this.interfazABloquear = config.interfaz;
        this.masivo = config.masivo;

        LOG.movimiento.aft.winSeleccionarRegistros.superclass.constructor.call(this, config);
        // Esto coje el 70% de alto y ancho de la resolucion de la pantalla del usuario
        this.getVistaPrincipal().setSize(screen.width * 0.7, screen.height * 0.7);        
        this.getVistaPrincipal().aceptarFn = this.aceptarFn.bind(this);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: 'C&oacute;digo',
            width: 100,
            dataIndex: 'codigo',
            default: true,
            filter:{
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            header: 'C&oacute;digo de proveedor',
            width: 100,
            dataIndex: 'numeropieza',
            default: true,
            filter:{
                type: 'string',
                dataIndex: 'numeropieza'
            }
        });
        this.addGridColumn({
            header: 'Denominaci&oacute;n',
            width: 210,
            dataIndex: 'denominacion',
            default: true,
            filter:{
                type: 'string',
                dataIndex: 'denominacion'
            }            
        });
        this.addGridColumn({
            header: 'Naturaleza',
            width: 100,
            dataIndex: 'naturaleza',
            default: true,
            filter: {
                type: 'combo',
                dataIndex: 'naturaleza',
                valueField: 'idnaturaleza',
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/getNaturaleza',
                displayField: 'denominacion'
            }
        });
        this.addGridColumn({
            header: 'Nro inventario',
            width: 100,
            dataIndex: 'nroinventario',
            default: true,
            filter:{
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: 'Valor contable CUP',
            width: 100,
            dataIndex: 'valorcontable',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'valorcontable'
            }
        });
        this.addGridColumn({
            header: 'Valor contable CUC',
            width: 100,
            dataIndex: 'valorcontablealternativo',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'valorcontablealternativo'
            }
        });
        this.addGridColumn({
            header: 'Depreciaci&oacute;n CUP',
            width: 100,
            dataIndex: 'depreciacionacumulada',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacionacumulada'
            }
        });
        this.addGridColumn({
            header: 'Depreciaci&oacute;n CUC',
            width: 100,
            dataIndex: 'depreciacionacumuladaalternativo',
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacionacumuladaalternativo'
            }
        });
        this.addGridColumn({
            header: 'Responsable',
            width: 100,
            dataIndex: 'responsable',
            default: true,
            filter: {
                /*type: 'string',
                dataIndex: 'responsable'*/
                
                type: 'combo',
                dataIndex: 'responsable',
                valueField: 'idresponsable',
                displayField: 'responsable',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getResponsables'
                
            }
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        if (_this.masivo) {
            let objParams = {
                addAll: 1,
                iddocumento: _this.iddocumento,
                idoperacion: _this.idoperacion,
                idestructuraop: _this.idestructuraop,
                AFT: true
            };

            Object.assign(objParams, _this.filterParams);

            this.addToolbarButton('->');
            this.addToolbarButton(LOG.util.UIManager.createBtn({
                text: 'Adicionar todos',
                tooltip: '',
                iconCls: 'adicionar',
                handler: function() {
                    var elem = _this.getVistaPrincipal().getEl();
                    var loadMask = new Ext.LoadMask(elem, {msg: 'Adicionando datos...'}, {msgCls: 'mask-css'});
                    loadMask.show();

                    Ext.Ajax.request({
                        url: '/logistica/activos_fijos/movimiento/index.php/movimiento/addRegistrosMovimientos',
                        method: 'POST',
                        params: objParams,
                        callback: function(options, success, response) {
                            loadMask.hide();
                            var rd = Ext.decode(response.responseText);
                            _this.getStorePrincipal().load();
                            _this.gridARecargar.getStore().load();
                            _this.getVistaPrincipal().close()
                        }
                    });
                },
                controlFn: function(b, cl){

                }
            }));
        }
    },
    render: function() {

        var _this = this;
        var vista = LOG.aft.documento.regNumAReparar.superclass.render.call(this);

        _this.getStorePrincipal().on({
            'beforeload': function(st) {
                
                st.initBaseParams.AFT = true;
                st.initBaseParams.idestructuraop = _this.idestructuraop;
                Object.assign(st.initBaseParams, _this.filterParams);
            },
            'load': function(st, r, o) {                
                st.initBaseParams.AFT = true;
                st.initBaseParams.idestructuraop = _this.idestructuraop;
                Object.assign(st.initBaseParams, _this.filterParams);
            }
        });
        _this.getStorePrincipal().load();
        return vista;
    },
    aceptarFn: function(aplicar){        
        
        var _this = this;
        
        var rows = this.smGridPrincipal.getSelections();
        var idregistros = new Array();
        rows.forEach(function(obj){
            idregistros.push(obj.id);
        });
        
        if(idregistros.length > 0){
            var elem = (aplicar) ? _this.getVistaPrincipal().getEl() : _this.interfazABloquear.getEl();
            var loadMask = new Ext.LoadMask(elem, {msg: 'Adicionando datos...'}, {msgCls: 'mask-css'});
            loadMask.show();
        
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/addRegistrosMovimientos',
                method: 'POST',
                params:{
                    idregistros: Ext.encode(idregistros),
                    iddocumento: _this.iddocumento,
                    idoperacion: _this.idoperacion
                },
                callback: function(options, success, response) {
                    loadMask.hide();
                    var rd = Ext.decode(response.responseText);                    
                    _this.getStorePrincipal().load();                
                    _this.gridARecargar.getStore().load();
                    
                }
            });
        }
    }
});