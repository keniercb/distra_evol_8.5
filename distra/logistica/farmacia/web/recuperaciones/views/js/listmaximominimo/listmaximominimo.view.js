Ext.ns('LOG.farm.listmaximominimo');

LOG.farm.listmaximominimo.view = Ext.extend(LOG.util.UITemplate, {
    constructor:function(config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listmaximominimo';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listmaximominimo.Idioma);
        LOG.farm.listmaximominimo.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns:function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'arearesp',
            header: _this.idioma.cgDeposito,
            width: 130,
            agrupador: true
        });
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
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgExistencia,
            width: 150,
            dataIndex: 'existencia',
            default: true,
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgMaximo,
            width: 150,
            dataIndex: 'maximo',
            default: true,
            renderer(v, _mD, _r){
                return Math.trunc(v)
            }
        }, '0,000'));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgMinimo,
            width: 150,
            dataIndex: 'minimo',
            default: true,
            renderer(v, _mD, _r){
                return Math.trunc(v)
            }
        }, '0,000.00'));




    },
    render:function(config){
        var vista = LOG.farm.listmaximominimo.view.superclass.render.call(this);
        var _this = this;
        //Vencido menor a la fecha actual
        //Posible vencimiento mayor a los 30 dias de la fecha actual
        //Proximo a vencer mayor a los proxioms 90 dias de la fecha actual

        this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e === 'beforeload') {
            }
            if (e === 'load') {
                (_this.storePrincipal.getCount() == 0 )?_this.btnImprimir.disable():_this.btnImprimir.enable()
            }
        });

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
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistmaximominimo'}));

    },
    getReporte:function() {

        let report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: {
                        idestructura: idestructura
                    },
                    dirReport: '/distra/logistica/farmacia/recuperaciones/ModeloMaximoMinimo',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});