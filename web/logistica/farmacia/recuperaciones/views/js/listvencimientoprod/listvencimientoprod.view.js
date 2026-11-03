Ext.ns('LOG.farm.listvencimientoprod');

LOG.farm.listvencimientoprod.view = Ext.extend(LOG.util.UITemplate, {
    constructor:function(config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listvencimientoprod';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listvencimientoprod.Idioma);
        LOG.farm.listvencimientoprod.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns:function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'naturaleza',
            header:'Naturaleza',
            width: 130,
            agrupador: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 150,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 300,
            dataIndex: 'denominacion',
            default: true,
            autoExpand:true
        });
        this.addGridColumn({
            header: _this.idioma.cgUEmb,
            width: 150,
            dataIndex: 'uemb',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgExistencia,
            width: 150,
            dataIndex: 'existencia',
            default: true,
            renderer(v, _mD, _r){
                return v && Number(v)
            }
        }, '0,000.00'));
        this.addGridColumn({
            header: _this.idioma.cgLote,
            width: 150,
            dataIndex: 'lote',
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgCantidad,
            width: 150,
            dataIndex: 'cantidad',
            default: true,
            renderer(v, _mD, _r){
                return v && Number(v);
            }
        }, '0,000.00'));
        this.addGridColumn({
            header: _this.idioma.cgFechaVen,
            width: 150,
            dataIndex: 'fechavencimiento',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgEstadoVen,
            width: 150,
            dataIndex: 'estado',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDeposito,
            width: 150,
            dataIndex: 'deposito',
            default: true
        });
    },
    render:function(config){
        let vista = LOG.farm.listvencimientoprod.view.superclass.render.call(this);
        let _this = this;
        this.gridFilter.tfBusqueda.addClass('form-control');
        //Vencido menor a la fecha actual
        //Posible vencimiento mayor a los 30 dias de la fecha actual
        //Proximo a vencer mayor a los proxioms 90 dias de la fecha actual
        let des = fechasub.split("/");
        let fecha = new Date(des[2], des[1]-1, des[0]),
         fecha2 = fecha.setDate(fecha.getDate() + 30),
         fecha3 = fecha.setDate(fecha.getDate() + 60);
        this.cmbEstado = new LOG.util.ComboBox({
            name: 'idestadoven',
            valueField: 'idestadoven',
            displayField: 'denominacion',
            cls:'form-control',
            emptyText: _this.idioma.cgEstadoVen,
            allowBlank: true,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idestadoven', 'denominacion'],
                data: [
                    [1, _this.idioma.stCoNormal],
                    [2, _this.idioma.stCoProxVen],
                    [3, _this.idioma.stCoPosVen],
                    [4, _this.idioma.stCoVen]
                ]
            }),
            listeners: {
                select: function(cmb, rd) {

                }
            }
        });

        this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e === 'beforeload') {
                this.baseParams.fechasub =new Date(des[2], des[1]-1, des[0]).format('d-m-Y');
                this.baseParams.fechaposiven = new Date(fecha2).format('d-m-Y');
                this.baseParams.fechaproxven = new Date(fecha3).format('d-m-Y');
                this.baseParams.idestadoven = _this.cmbEstado.getValue() || false;

            }
            if (e === 'load') {
                (_this.storePrincipal.getCount() == 0 )?_this.btnImprimir.disable():_this.btnImprimir.enable()
            }
        });

        this.gridFilter.btnLimpiar.handler = function() {
            let scope = _this.gridFilter;
            if (scope.btnLimpiar.disabled) {
                return;
            }
            scope.tfBusqueda.setValue('');
            _this.cmbEstado.reset();
            scope.store.initBaseParams.idestadoven = false;
            scope.tfBusqueda.blur();
            let params = {idestadoven:false, criterio:'', filtrado:false};
            
            scope.store.reload({
                params: Object.assign({}, params, scope.store.limitParams)
            });
        };
        this.gridFilter.btnFiltar.handler = function() {
            let scope = _this.gridFilter;
            if (scope.btnFiltar.disabled) {
                return;
            }

                if (_this.cmbEstado.isValid() && scope.tfBusqueda.isValid()) {
                    let params = {};
                    scope.store.initBaseParams.filtrado = true;                    
                    scope.store.initBaseParams.idestadoven = _this.cmbEstado.getValue()||-1;
                    scope.store.initBaseParams.criterio = scope.tfBusqueda.getValue()||'';
                    scope.store.load({
                        params: Object.assign({}, params, scope.store.initBaseParams, scope.store.limitParams)
                    });
                }


        };
        this.getGridPrincipal().getTopToolbar().insert(2,  this.cmbEstado);

        this.getStorePrincipal().load();

        return vista;
    },
    initDefaultButtons:function(){
        var _this = this;
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            disabled:true,
            handler: function () {
                _this.getReporte();
            }

        });
        this.addToolbarButton(_this.btnImprimir);

        this.listaBotones.add('->');
        this.listaBotones.add('-');
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistvencimientoprod'}));

    },
    getReporte:function() {

        let des = fechasub.split("/");
        let fecha = new Date(des[2], des[1]-1, des[0]),
            fecha2 = fecha.setDate(fecha.getDate() + 30),
            fecha3 = fecha.setDate(fecha.getDate() + 60),
            _this=this,
            params = {
                idestructura: idestructura,
                fechasub: new Date(des[2], des[1]-1, des[0]).format('d-m-Y'),
                fechaposiven :new Date(fecha2).format('d-m-Y'),
                fechaproxven : new Date(fecha3).format('d-m-Y'),
                criterio : _this.gridFilter.tfBusqueda.getValue()

            };
        if(_this.cmbEstado.getValue())
        {
            params["idestadoven"+_this.cmbEstado.getValue()] = 1;
        }
        let report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: params,
                    dirReport: '/distra/logistica/farmacia/recuperaciones/VencimientoProducto',
                    detailFirma: {}
                }
            ]
        }).view();
    }
});