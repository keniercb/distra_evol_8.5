Utilidades.Cmp.modeloGridInversiones = function(opciones) {
    var _this = this;
    this.cmbEjercicio = opciones.cmbEjercicio;
    this.idOrganismo = opciones.idOrganismo;
    this.vigente = opciones.vigente;
    this.general = opciones.general;

    offset = opciones.offset;

    this.init = function() {
        _this.store_gestionar_inversiones = new Ext.data.Store({
            url: '/planificacion/inversiones/index.php/inversiones/cargarInversiones',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'idinversion'
            }, [{
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'clasificacion'
                }, {
                    name: 'tipoinv'
                }, {
                    name: 'caracteristicas'
                }, {
                    name: 'forma'
                }, {
                    name: 'provincia'
                }, {
                    name: 'idprovincia'
                }, {
                    name: 'fechainicio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'objetivo'
                }, {
                    name: 'efecto'
                }, {
                    name: 'idestadoaprobacion'
                }, {
                    name: 'fasttrack'
                }, {
                    name: 'idinversion'
                }, {
                    name: 'nomestado'
                }, {
                    name: 'nomestadoce'
                }, {
                    name: 'idcaracteristica'
                }, {
                    name: 'idestadoinversion'
                }, {
                    name: 'idtipoinversion'
                }, {
                    name: 'idestadoce'
                }, {
                    name: 'idefectocomercial'
                }, {
                    name: 'idformapropiedad'
                }, {
                    name: 'idtipoinversionprograma'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idobjetivo'
                }, {
                    name: 'idcumplimientoinversion'
                }, {
                    name: 'observaciones'
                }, {
                    name: 'analpostinversiones'
                }, {
                    name: 'iddatdesempenno'
                }, {
                    name: 'desempenno'
                }, {
                    name: 'idejercicio'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'estructura'
                }, {
                    name: 'idprograma'
                }, {
                    name: 'programa'
                }, {
                    name: 'cuadrada'
                }, {
                    name: 'idgrupoobra'
                }, {
                    name: 'grupoobra'
                }, {
                    name: 'estadoplan'
                }, {
                    name: 'idestadoplaninversion'
                }, {
                    name: 'sector'
                }, {
                    name: 'idsectorestrategico'
                }, {
                    name: 'preparacion'
                },{
                    name: 'idcontenido'
                },{
                    name: 'cartera'
                },{
                    name: 'factibilidad'
                },{
                    name: 'idmedioambiente'
                },{
                    name: 'medioambiente'
                },{
                    name: 'nompreparacion'
                },{
                    name: 'fechamax'
                },{
                    name: 'fechamin'
                },{
                    name: 'bloqueada'
                }])
            });


        if(_this.idOrganismo != null || _this.cmbEjercicio.getValue()!= null ||  _this.cmbEjercicio.getRawValue()!= null || _this.general != null || _this.vigente != null){
            //console.info('entra')
            _this.store_gestionar_inversiones.baseParams.identidad = _this.idOrganismo;
            _this.store_gestionar_inversiones.baseParams.idejercicio = _this.cmbEjercicio.getValue();
            _this.store_gestionar_inversiones.baseParams.ejercicio = _this.cmbEjercicio.getRawValue();
            _this.store_gestionar_inversiones.baseParams.check = _this.general;
            _this.store_gestionar_inversiones.baseParams.vigente = _this.vigente;
            //_this.store_gestionar_inversiones.baseParams.start = offset;
            _this.store_gestionar_inversiones.load({
                params: {
                    start: 0,
                    limit:20
                }
            });
        }



    };
};