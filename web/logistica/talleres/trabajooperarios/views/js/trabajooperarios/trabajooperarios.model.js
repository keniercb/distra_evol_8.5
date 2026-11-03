Ext.ns('LOG.tall.trabajooperarios');
LOG.tall.trabajooperarios.VentanaAddBonificacionPenalizacionModel = Ext.extend(LOG.util.Model , {
    constructor: function (config) {
        config.urlController = '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/';
        config.urlAccionGuardar = 'addBonPen';
        // if (!config.fields) {
        //     config.fields = [];
        // }
        // config.fields.push({
        //     name: 'idservicio'
        // });
        // config.fields.push({
        //     name: 'idcliente'
        // });
        //
        // config.fields.push({
        //     name: 'posecionmedio'
        // });
        // config.fields.push({
        //     name: 'idordentrabajo'
        // });

        LOG.tall.trabajooperarios.VentanaAddBonificacionPenalizacionModel.superclass.constructor.call(this, config);
    }
});

LOG.tall.trabajooperarios.VentanaCancelBonificacionPenalizacionModel = Ext.extend(LOG.util.Model , {
    constructor: function (config) {
        config.urlController = '/logistica/talleres/trabajooperarios/index.php/trabajooperarios/';
        config.urlAccionGuardar = 'cancelarBonPen';
        // if (!config.fields) {
        //     config.fields = [];
        // }
        // config.fields.push({
        //     name: 'idservicio'
        // });
        // config.fields.push({
        //     name: 'idcliente'
        // });
        //
        // config.fields.push({
        //     name: 'posecionmedio'
        // });
        // config.fields.push({
        //     name: 'idordentrabajo'
        // });

        LOG.tall.trabajooperarios.VentanaCancelBonificacionPenalizacionModel.superclass.constructor.call(this, config);
    }
});