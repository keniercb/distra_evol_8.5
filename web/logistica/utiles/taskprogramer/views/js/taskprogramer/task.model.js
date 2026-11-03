Ext.ns('LOG.lb.task');
LOG.lb.task.Model = Ext.extend(LOG.util.Model, {
    constructor: function (config) {
        config.urlAccionGuardar = 'adicionarTask';
        config.urlAccionEliminar = 'eliminarTask';
        config.urlController = '/logistica/utiles/taskprogramer/index.php/task/';
        if (!config.fields) {
            config.fields = [];
        }
        this.idioma = config.idioma;
        //campos que se mandan por parametros para el adicionar
        config.fields.push({
            name: 'idnomtarea',
            primary: true
        });
        config.fields.push({
            name: 'denominacion'
        });
        config.fields.push({
            name: 'clase'
        });

        LOG.lb.task.Model.superclass.constructor.call(this, config);
    },
    setDefaulParamasValues: function () {
        var _this = this;
        if (!this.basicForm) {
            return;
        }
        this.basicForm.items.each(function (field) {
            _this[field.getName()] = field.getValue();
        });
    }

});


