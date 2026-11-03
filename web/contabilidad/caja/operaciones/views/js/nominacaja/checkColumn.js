Ext.grid.CheckColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            //Si el periodo de pago esta en estado guardado
            if (this.scope.scope.panelPeriodo.smPeriodo.getSelected().data.idestado == 8) {
                record.set(this.dataIndex, !record.data[this.dataIndex]);
                this.scope.scope.btnGuardar.enable();
                this.scope.scope.panelPersonas.isSavePersona = false;

                // this.grid.store.commitChanges();
                record.commit();
                //var indexTrabajador = this.scope.scope.panelPersonas.stPersonas.find('idpersona', record.data.idpersona);
                // var indexTrabajador = this.scope.scope.panelPersonas.stPersonas.findBy(function (record_p) {
                //     if (record_p.data.idpersona == record.data.idpersona)
                //         return true;
                // });
                // var recordPersona = this.scope.scope.panelPersonas.stPersonas.getAt(indexTrabajador);
                var recordPersona = this.scope.scope.panelPersonas.smPersonas.getSelected();
                var pagosIndex = recordPersona.data.pagos.findIndex(obj => {
                    return obj.tipopago === record.data.tipopago
                });
                recordPersona.data.pagos[pagosIndex].cobro = record.data.cobro;
                //recordPersona.data.pagos[index] = record.data;
                //Actualizar el importe a actualizar
                if (record.data[this.dataIndex]) {
                    recordPersona.data.importeactualizar = parseFloat(recordPersona.data.importeactualizar) + parseFloat(record.data.monto);
                    record.data.cobro = true;
                } else {
                    recordPersona.data.importeactualizar = parseFloat(recordPersona.data.importeactualizar) - parseFloat(record.data.monto);
                    record.data.cobro = false;
                }
            } else {
                mostrarMensaje(1, 'El período de pago debe estar en estado guardado para poder realizar esta acción.')
            }
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};
