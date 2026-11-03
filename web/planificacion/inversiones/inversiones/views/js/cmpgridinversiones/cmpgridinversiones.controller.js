Utilidades.Cmp.controllerGridInversiones =  function(opciones){
    var _this = this;
    this.cmbEjercicio = opciones.cmbEjercicio;
    this.idOrganismo = opciones.idOrganismo;
    this.vigente = opciones.vigente;
    this.general = opciones.general;

    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });

    this.modeloGridInversiones = new Utilidades.Cmp.modeloGridInversiones({
        cmbEjercicio: opciones.cmbEjercicio,
        idOrganismo: opciones.idOrganismo,
        vigente: opciones.vigente,
        general:opciones.general,
        offset :0,
    });
    this.modeloGridInversiones.init();

    this.vistaGridInversiones = new Utilidades.Cmp.vistaGridInversiones({
        modelo: this.modeloGridInversiones,
        idOrganismo: this.idOrganismo,
        comboEjercicio: this.comboEjercicio,
        offset :0,
    });
    this.vistaGridInversiones.init();


    this.init = function () {

    }

    this.getGridInversiones = function () {
       return _this.vistaGridInversiones.grid_gestionar_inversiones;
    }


    this.actParamsStore = function (obj) {

        _this.modeloGridInversiones.store_gestionar_inversiones.baseParams.identidad = obj.idOrganismo;
        _this.modeloGridInversiones.store_gestionar_inversiones.baseParams.idejercicio = obj.cmbEjercicio.getValue();
        _this.modeloGridInversiones.store_gestionar_inversiones.baseParams.ejercicio = obj.cmbEjercicio.getRawValue();
        _this.modeloGridInversiones.store_gestionar_inversiones.baseParams.check = obj.general;
        _this.modeloGridInversiones.store_gestionar_inversiones.baseParams.vigente = obj.vigente;

    }




}
