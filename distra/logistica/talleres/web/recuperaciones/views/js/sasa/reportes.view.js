Ext.ns('Ext.erp');
Ext.erp.reporte = Ext.extend(LOG.util.UITemplate, {
    name:'Reporte',
    sql:'',
    columns:[],
    filters:[],
    autoLoad:true,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/sasa';
        config.urlBusquedaGridPrincipal = 'executeQuery';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.reporte.superclass.constructor.call(this, config);

    },
    render: function(config) {
        var _this = this;
        _this.getPanelBusqueda().setColumns(2);
        Ext.each(this.filters,function(filter,index){
            _this.addFilterComponent(filter);
        });
        var vista = Ext.erp.reporte.superclass.render.call(this);
        this.getStorePrincipal().on({
            'beforeload':function(st,opts){
                st.initBaseParams.data = Ext.encode(this.getPanelBusqueda().getForm().getValues());
            }
        });
        return vista;

    },
    initDefaultColumns: function() {
        var _this = this;
        Ext.each(_this.columns,function(column,index){
            _this.addGridColumn(column);
        });

    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            disabled: true,
            scope : this,
            handler: this.onReport,
            controlFn: function(btn,caller){
                _this.getStorePrincipal().fireEvent = _this.getStorePrincipal().fireEvent.createSequence(function(e){
                    if(e == 'load'){
                        btn.setDisabled(_this.getStorePrincipal().getCount() == 0);
                    }
                });
            }

        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudareclamaciones'
        }));

    },
    onReport:function(){
        var _this = this.scope;
        new Log.util.Report({
            reportes:[{
                name: _this.name,
                description:_this.name,
                params:_this.getBusquedaAvanzada().getForm().getValues(),
                urlReport:'/distra/logistica/taller/recuperaciones/sasa/' + _this.name
            }]
        }).view();
    }
});

Ext.erp.citaspospuesta = Ext.extend(Ext.erp.reporte, {
    name:'CitasModelo',
    sql:'v_citaspospuesta',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.estadocompraporordentrabajo = Ext.extend(Ext.erp.reporte, {
    name:'EstadoCompraPorOrdenTrabajoListado',
    sql:'v_estadocompraporordentrabajo',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.estadosordentrabajoelvehiculo = Ext.extend(Ext.erp.reporte, {
    name:'EstadosOrdenTrabajoElVehiculoListado',
    sql:'v_estadosordentrabajoelvehiculo',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.operariocontiemporealnormadotrabajado = Ext.extend(Ext.erp.reporte, {
    name:'OperarioConTiempoRealNormadoTrabajadoListado',
    sql:'v_operariocontiemporealnormadotrabajado',
    columns:[{
        header: "Nombre",
        dataIndex: 'nombre',
        sortable:true,
        width: 50
    },{
        header: "Apellidos",
        dataIndex: 'apellidos',
        width: 100,
        sortable:true
    },{
        header: "Tiempo real",
        dataIndex: 'tiemporeal',
        width: 150,
        sortable:true
    },{
        header: "Tiemponromado",
        dataIndex: 'tiemponormado',
        width: 150,
        sortable:true
    }]
});
Ext.erp.operariotiempotrabajadoporordentrabajo = Ext.extend(Ext.erp.reporte, {
    name:'OperarioTiempoTrabajadoPorOrdenTrabajoListado',
    sql:'v_operariotiempotrabajadoporordentrabajo',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Operario",
        dataIndex: 'nombre',
        sortable:true,
        width: 50
    },{
        header: "Tiempo trabajado",
        dataIndex: 'tiempotrabajado',
        width: 150,
        sortable:true
    }]
});
Ext.erp.ordenestrabajoconceptoreclamaciones = Ext.extend(Ext.erp.reporte, {
    name:'OrdenesTrabajoConceptoReclamacioneListado',
    sql:'v_ordenestrabajoconceptoreclamaciones',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.ordenestrabajoconceptoreclamacionporoperarios = Ext.extend(Ext.erp.reporte, {
    name:'OrdenesTrabajoConceptoReclamacionPorOperariosListado',
    sql:'v_ordenestrabajoconceptoreclamacionporoperarios',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Operario",
        dataIndex: 'nombre',
        sortable:true,
        width: 50
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.ordenestrabajoparalizadaconsolicitudescompradevehiculoporproveedor = Ext.extend(Ext.erp.reporte, {
    name:'OrdenesTrabajoParalizadaConSolicitudesCompraDeVehiculoListado',
    sql:'v_ordenestrabajoparalizadaconsolicitudescompradevehiculoporproveedor',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Proveedor",
        dataIndex: 'proveedors',
        sortable:true,
        width: 50
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.ordenestrabajopospuestacliente = Ext.extend(Ext.erp.reporte, {
    name:'OrdenesTrabajoPospuestaCliente',
    sql:'v_ordenestrabajopospuestacliente',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Cliente",
        dataIndex: 'cliente',
        sortable:true,
        width: 50
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.ordenestrabajoreservapiezas = Ext.extend(Ext.erp.reporte, {
    name:'OrdenesTrabajoReservaPiezasListado',
    sql:'v_ordenestrabajoreservapiezas',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.piezasconsumidasporserviciosyactividad = Ext.extend(Ext.erp.reporte, {
    name:'PiezasConsumidasPorServiciosyActividadListado',
    sql:'v_piezasconsumidasporserviciosyactividad',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.piezasreservadasordenestrabajo = Ext.extend(Ext.erp.reporte, {
    name:'PiezasReservadasOrdenesTrabajoListado',
    sql:'v_piezasreservadasordenestrabajo',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.recursosconsumidosordentrabajo = Ext.extend(Ext.erp.reporte, {
    name:'RecursosConsumidosOrdenTrabajoListado',
    sql:'v_recursosconsumidosordentrabajo',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.recursosplanificadoconsumidoordentrabajo = Ext.extend(Ext.erp.reporte, {
    name:'RecursosPlanificadoConsumidoOrdenTrabajoListado',
    sql:'v_recursosplanificadoconsumidoordentrabajo',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.tiempotranscurridosolicitudpiezayllegadataller = Ext.extend(Ext.erp.reporte, {
    name:'TiempoTranscurridoSolicitudPiezayLLegadaTallerListado',
    sql:'v_tiempotranscurridosolicitudpiezayllegadataller',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.tiempovehiculoenestadoparalizacion = Ext.extend(Ext.erp.reporte, {
    name:'TiempoVehiculoEnEstadoParalizacionListado',
    sql:'v_tiempovehiculoenestadoparalizacion',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.trazabilidadordentrabajoparalizadayordenpedidoproveedores = Ext.extend(Ext.erp.reporte, {
    name:'TrazabilidadOrdenTrabajoParalizadayOrdenPedidoListado',
    sql:'v_trazabilidadordentrabajoparalizadayordenpedidoproveedores',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.vehiculos = Ext.extend(Ext.erp.reporte, {
    name:'VehiculosListado',
    sql:'v_vehiculos',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.vehiculosdefectacioncancelado = Ext.extend(Ext.erp.reporte, {
    name:'VehiculosDefectacionCanceladoListado',
    sql:'v_vehiculosdefectacioncancelado',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.vehiculosdefectacionpospuesta = Ext.extend(Ext.erp.reporte, {
    name:'VehiculosDefectacionPospuestaListado',
    sql:'v_vehiculosdefectacionpospuesta',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});

Ext.erp.vehiculosenparalizacion = Ext.extend(Ext.erp.reporte, {
    name:'VehiculosEnParalizacionListado',
    sql:'v_vehiculosenparalizacion',
    filters:[{
        fieldLabel:'Estado',
        xtype:'combologistica',
        autoLoad:true,
        url:'/logistica/activo_fijos/nomencladores/index.php/nomencladores/cargarnomenclador',
        name:'idestadotecnico',
        hiddenName:'idestadotecnico',
        displayField:'denominacion',
        valueField:'idestadotecnico',
        baseParams:{
            idnom:'idestadotecnico',
            modelo:'NomEstadoTecnico'
        }
    },{
        fieldLabel:'Marca',
        xtype:'combologistica',
        autoLoad:true,
        url:'/logistica/util/nomencladores/index.php/nomencladores/cargarnomenclador',
        name:'idmarca',
        hiddenName:'idmarca',
        displayField:'denominacion',
        valueField:'idmarca',
        baseParams:{
            idnom:'idmarca',
            modelo:'NomMarca'
        }
    },{
        fieldLabel:'Modelo',
        xtype:'combologistica',
        autoLoad:true,
        url:'/logistica/util/nomencladores/index.php/nomencladores/cargarnomenclador',
        name:'idmodelo',
        hiddenName:'idmodelo',
        displayField:'denominacion',
        valueField:'idmodelo',
        baseParams:{
            idnom:'idmodelo',
            modelo:'NomModelo'
        }
    },{
        fieldLabel:'Cliente',
        xtype:'combologistica',
        autoLoad:true,
        url:'/logistica/util/plugins/index.php/sistemaexternos/clientesyproveedores',
        name:'idcliente',
        hiddenName:'idcliente',
        displayField:'denominacion',
        valueField:'idcliente',
    }],
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.vehiculosentradaplanificada = Ext.extend(Ext.erp.reporte, {
    name:'VehiculosEntradaPlanificadaListado',
    sql:'v_vehiculosentradaplanificada',
    filters:[{
        fieldLabel:'Desde',
        name:'desde',
        id:'desde',
        vtype:'daterange',
        endDate:'hasta'
    },{
        fieldLabel:'Hasta',
        name:'hasta',
        id:'hasta',
        vtype:'daterange',
        startDate:'desde'
    }],
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});
Ext.erp.ventaspiezasporservicios = Ext.extend(Ext.erp.reporte, {
    name:'VentasPiezasPorServiciosListado',
    sql:'v_ventaspiezasporservicios',
    columns:[{
        header: "Número ref.",
        dataIndex: 'numeroref',
        sortable:true,
        width: 50
    },{
        header: "Número doc.",
        dataIndex: 'nrodoc',
        width: 100,
        sortable:true
    },{
        header: "Fecha de creacion",
        dataIndex: 'fechacreacion',
        width: 150,
        sortable:true
    },{
        header: "Estado",
        dataIndex: 'estado',
        width: 150,
        sortable:true
    },{
        header: "Productos",
        dataIndex: 'productos',
        width: 150,
        sortable:true
    },{
        header: "Creado por",
        dataIndex: 'creadopor',
        width: 150,
        sortable:true
    },{
        header: "Aprobado por",
        dataIndex: 'aprobadopor',
        width: 150,
        sortable:true
    }]
});