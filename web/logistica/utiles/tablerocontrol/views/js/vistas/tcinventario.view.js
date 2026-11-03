Ext.ns('Ext.erp.Sources');
Ext.ns('Ext.erp.tcinventario');
Ext.erp.tcinventario.rm = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var date = new Date();
        var _this = this;
        this.anno = new LOG.util.YearField({
            fieldLabel: 'Año',
            emptyText: 'Año',
            name: 'anno',
            totalYears: 5,
            maxValue: date.getFullYear(),
            minValue: date.getFullYear() - 5,
            listeners: {
                'select': function (cmb) {
                    if(!!_this.periodo.getValue() && !!_this.depositos.getValue()){
                        Ext.erp.Sourcesinventario = [{
                        name: 'Indicadores-Inventario',
                        sql: "select * from mod_loginventario.f_rotacion("+cmb.getValue()+","+_this.depositos.getValue()+","+_this.periodo.getValue()+",null,null,"+idmoneda+")"
                        }];
                        if(_this.DashboardPanel){
                            _this.DashboardPanel.removeAll();
                        }
                      
                        _this.initDashboard();
                    }
                   
                }
            }
        });
        this.periodo = new LOG.util.ComboBox({
            fieldLabel: 'Periodo',
            valueField: 'idperiodo',
            displayField: 'perido',
            emptyText: 'Perido',
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idperiodo', 'perido'],
                data: [
                    [1, 'Mensual'],
                    [2, 'Trimestral'],
                    [3, 'Semestral']
                ]
            }),
            listeners: {
                'select': function (cmb) {
                     if(!!_this.anno.getValue() && !!_this.depositos.getValue()){
                        Ext.erp.Sourcesinventario = [{
                        name: 'Indicadores-Inventario',
                        sql: "select * from mod_loginventario.f_rotacion("+_this.anno.getValue()+","+_this.depositos.getValue()+","+cmb.getValue()+",null,null," + idmoneda + ")"
                        }]; 
                        if(_this.DashboardPanel){
                            _this.DashboardPanel.removeAll();
                        }
                      
                        _this.initDashboard();
                    }
                }
            }
        });
        this.depositos = new LOG.util.ComboBox({
            width: 250, 
            url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos?idtipo=' + -1, 
            valueField: 'iddeposito',
            emptyText: 'Estructura',
            displayField: 'deposito',
            listeners: {
                'select': function (cmb) {
                    if(!!_this.anno.getValue() && !!_this.periodo.getValue()){
                        Ext.erp.Sourcesinventario = [{
                        name: 'Indicadores-Inventario',
                        sql: "select * from mod_loginventario.f_rotacion("+_this.anno.getValue()+","+cmb.getValue()+","+_this.periodo.getValue()+",null,null," + idmoneda + ")"
                        }]; 
                        if(_this.DashboardPanel){
                            _this.DashboardPanel.removeAll();
                        }
                      
                        _this.initDashboard();
                    }
                }
            }
        });
        this.tbar= ['->',this.anno,this.periodo,this.depositos];
        Ext.erp.tcinventario.rm.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcinventario.rm.superclass.initComponent.call(this);
        
    },
    initDashboard: function(){
        this.DashboardPanel.addChart({
            title: 'Rotacion del inventario',
            allowTypes: ['line', 'column', 'spline', 'area'],
            chartType: 'line'
        }, Ext.erp.Sourcesinventario[0],{
            x: {
                label: 'Intervalo de tiempo',
                source: 'intervalo',
                notSort: true
            },
            y: {
                label: 'Valor indicador',
                source: 'indicadores'
            }
        },[{
            name: 'Indicador unidades fisicas',
            source: 'indicador'
        }, {
            name: 'Indicador unidades monetarias',
            source: 'indicadorimporte'
        }]/*,[{
            name: 'Intervalo de tiempo',
            source: 'intervalo'
        }]*/);
    
       /*this.DashboardPanel.addChart({
            title: 'Valor economico del inventario',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'column'
        }, Ext.erp.Sourcesinventario[0],{
            x: {
                label: 'Intervalo de tiempo',
                source: 'intervalo',
                notSort: true
            },
            y: {
                label: 'Costo economico',
                source: 'costoeconomico'
            }
        },[{
            name: 'Costo economico',
            source: 'costoeconomico'
        }],[{
            name: 'Intervalo de tiempo',
            source: 'intervalo'
        }]);
       this.DashboardPanel.addChart({
            title: 'Duracion de los inventarios',
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'column'
        }, Ext.erp.Sourcesinventario[0],{
            x: {
                label: 'Intervalo de tiempo',
                source: 'intervalo',
                notSort: true
            },
            y: {
                label: 'Duracion de inventario',
                source: 'coberturainventario'
            }
        },[{
            name: 'Duracion de inventario',
            source: 'coberturainventario'
        }],[{
            name: 'Intervalo de tiempo',
            source: 'intervalo'
        }]);*/
        
    }
       
    
});

Ext.erp.tcinventario.ve = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        var date = new Date();
        var _this = this;
        this.anno = new LOG.util.YearField({
            fieldLabel: 'Año',
            emptyText: 'Año',
            name: 'anno',
            totalYears: 5,
            maxValue: date.getFullYear(),
            minValue: date.getFullYear() - 5,
            listeners: {
                'select': function (cmb) {
                    if (!!_this.periodo.getValue() && !!_this.depositos.getValue()) {
                        Ext.erp.Sourcesinventario = [{
                            name: 'Indicadores-Inventario',
                            sql: "select * from mod_loginventario.f_rotacion(" + cmb.getValue() + "," + _this.depositos.getValue() + "," + _this.periodo.getValue() + ",null,null," + idmoneda + ")"
                        }];
                        if (_this.DashboardPanel) {
                            _this.DashboardPanel.removeAll();
                        }

                        _this.initDashboard();
                    }

                }
            }
        });
        this.periodo = new LOG.util.ComboBox({
            fieldLabel: 'Periodo',
            valueField: 'idperiodo',
            displayField: 'perido',
            emptyText: 'Perido',
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idperiodo', 'perido'],
                data: [
                    [1, 'Mensual'],
                    [2, 'Trimestral'],
                    [3, 'Semestral']
                ]
            }),
            listeners: {
                'select': function (cmb) {
                    if (!!_this.anno.getValue() && !!_this.depositos.getValue()) {
                        Ext.erp.Sourcesinventario = [{
                            name: 'Indicadores-Inventario',
                            sql: "select * from mod_loginventario.f_rotacion(" + _this.anno.getValue() + "," + _this.depositos.getValue() + "," + cmb.getValue() + ",null,null," + idmoneda + ")"
                        }];
                        if (_this.DashboardPanel) {
                            _this.DashboardPanel.removeAll();
                        }

                        _this.initDashboard();
                    }
                }
            }
        });
        this.depositos = new LOG.util.ComboBox({
            width: 250,
            url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos?idtipo=' + -1,
            valueField: 'iddeposito',
            emptyText: 'Estructura',
            displayField: 'deposito',
            listeners: {
                'select': function (cmb) {
                    if (!!_this.anno.getValue() && !!_this.periodo.getValue()) {
                        Ext.erp.Sourcesinventario = [{
                            name: 'Indicadores-Inventario',
                            sql: "select * from mod_loginventario.f_rotacion(" + _this.anno.getValue() + "," + cmb.getValue() + "," + _this.periodo.getValue() + ",null,null," + idmoneda + ")"
                        }];
                        if (_this.DashboardPanel) {
                            _this.DashboardPanel.removeAll();
                        }

                        _this.initDashboard();
                    }
                }
            }
        });
        this.tbar = ['->', this.anno, this.periodo, this.depositos];
        Ext.erp.tcinventario.ve.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcinventario.ve.superclass.initComponent.call(this);

    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
         title: 'Valor economico del inventario',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'column'
         }, Ext.erp.Sourcesinventario[0],{
         x: {
         label: 'Intervalo de tiempo',
         source: 'intervalo',
         notSort: true
         },
         y: {
         label: 'Costo economico',
         source: 'costoeconomico'
         }
         },[{
         name: 'Costo economico',
         source: 'costoeconomico'
         }],[{
         name: 'Intervalo de tiempo',
         source: 'intervalo'
         }]);

    }


});

Ext.erp.tcinventario.dur = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        var date = new Date();
        var _this = this;
        this.anno = new LOG.util.YearField({
            fieldLabel: 'Año',
            emptyText: 'Año',
            name: 'anno',
            totalYears: 5,
            maxValue: date.getFullYear(),
            minValue: date.getFullYear() - 5,
            listeners: {
                'select': function (cmb) {
                    if (!!_this.periodo.getValue() && !!_this.depositos.getValue()) {
                        Ext.erp.Sourcesinventario = [{
                            name: 'Indicadores-Inventario',
                            sql: "select * from mod_loginventario.f_rotacion(" + cmb.getValue() + "," + _this.depositos.getValue() + "," + _this.periodo.getValue() + ",null,null," + idmoneda + ")"
                        }];
                        if (_this.DashboardPanel) {
                            _this.DashboardPanel.removeAll();
                        }

                        _this.initDashboard();
                    }

                }
            }
        });
        this.periodo = new LOG.util.ComboBox({
            fieldLabel: 'Periodo',
            valueField: 'idperiodo',
            displayField: 'perido',
            emptyText: 'Perido',
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idperiodo', 'perido'],
                data: [
                    [1, 'Mensual'],
                    [2, 'Trimestral'],
                    [3, 'Semestral']
                ]
            }),
            listeners: {
                'select': function (cmb) {
                    if (!!_this.anno.getValue() && !!_this.depositos.getValue()) {
                        Ext.erp.Sourcesinventario = [{
                            name: 'Indicadores-Inventario',
                            sql: "select * from mod_loginventario.f_rotacion(" + _this.anno.getValue() + "," + _this.depositos.getValue() + "," + cmb.getValue() + ",null,null," + idmoneda + ")"
                        }];
                        if (_this.DashboardPanel) {
                            _this.DashboardPanel.removeAll();
                        }

                        _this.initDashboard();
                    }
                }
            }
        });
        this.depositos = new LOG.util.ComboBox({
            width: 250,
            url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos?idtipo=' + -1,
            valueField: 'iddeposito',
            emptyText: 'Estructura',
            displayField: 'deposito',
            listeners: {
                'select': function (cmb) {
                    if (!!_this.anno.getValue() && !!_this.periodo.getValue()) {
                        Ext.erp.Sourcesinventario = [{
                            name: 'Indicadores-Inventario',
                            sql: "select * from mod_loginventario.f_rotacion(" + _this.anno.getValue() + "," + cmb.getValue() + "," + _this.periodo.getValue() + ",null,null," + idmoneda + ")"
                        }];
                        if (_this.DashboardPanel) {
                            _this.DashboardPanel.removeAll();
                        }

                        _this.initDashboard();
                    }
                }
            }
        });
        this.tbar = ['->', this.anno, this.periodo, this.depositos];
        Ext.erp.tcinventario.dur.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcinventario.dur.superclass.initComponent.call(this);

    },
    initDashboard: function () {

         this.DashboardPanel.addChart({
         title: 'Duracion de los inventarios',
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'column'
         }, Ext.erp.Sourcesinventario[0],{
         x: {
         label: 'Intervalo de tiempo',
         source: 'intervalo',
         notSort: true
         },
         y: {
         label: 'Duracion de inventario',
         source: 'coberturainventario'
         }
         },[{
         name: 'Duracion de inventario',
         source: 'coberturainventario'
         }],[{
         name: 'Intervalo de tiempo',
         source: 'intervalo'
         }]);

    }


});

Ext.erp.tcinventario.ilv = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.erp.tcinventario.ilv.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcinventario.ilv.superclass.initComponent.call(this);
        this.initDashboard();
    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
            title: 'Lotes Vencidos',
            allowTypes: ['line', 'column', 'spline'],
            chartType: 'spline'
        }, {
            name: 'Lotes Vencidos',
            sql: "select ni.denominacion,(select count(dl.idproducto) from mod_logistica.dat_lote dl where dl.idproducto = dprod.idproducto and dl.fechavencimiento > now()) as cantlotesvencidos," +
            "(select count(dl.idproducto) from mod_logistica.dat_lote dl where dl.idproducto = dprod.idproducto and dl.fechavencimiento > (dl.fechavencimiento - 15)) as cantlotesproxvencer " +
            "from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento " +
            "inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador " +
            "group by ni.denominacion,dprod.idproducto"
        } , {
            x: {
                label: 'Indicador',
                source: 'denominacion'
            },
            y: {
                label: 'Valor',
                source: 'valor'
            }
        }, [{
            name: 'Lotes Vencidos',
            source: 'cantlotesvencidos'
        }, {
            name: 'Lotes por vencer',
            source: 'cantlotesproxvencer'
        }]);
    }
});