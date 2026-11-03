Ext.ns('LOG.lb.plugin');

LOG.lb.plugin.ComboEjercicios = function() {
    function initComboEjercicio(v, scope) {
        var dirUrl = '/logistica/inventario/recuperaciones/index.php/resumenporperiodo/';
        scope.comboEjercicio = new LOG.util.ComboBox({width: 250, url: dirUrl + 'cargarEjercicios', valueField: 'idejercicio', displayField: 'nombre'});

        scope.comboEjercicio.getStore().on({
            'load': function(st, rd) {
                var datos = rd[0].data;
                scope.comboEjercicio.setValue(datos.idejercicio);
            }           
        });

        scope.comboEjercicio.fireEvent = scope.comboEjercicio.fireEvent.createSequence(function(e, args) {
            if ('valuechange' == e) {
                if (String(v.idEjercicio) !== String(args)) {
                    v.getStorePrincipal().baseParams.idestructura = args;
                    v.getStorePrincipal().reload({
                        params: {
                            idestructura: args
                        }
                    });
                    v.idEjercicio = args;
                    var datos = scope.comboEjercicio.getStore().data.items;
                    Ext.each(datos, function(rec, index) {

                        if (rec.data.idejercicio == v.idEjercicio) {
                            v.nomEjerc = rec.json.nombre;
                        }
                    });

                }
            }
        });
    }
    return {
        init: function(v) {
            v.autoLoad = false;
            v.getPanelSuperior().onRender = v.getPanelSuperior().onRender.createSequence(function() {
                initComboEjercicio(v, this);
                v.getPanelSuperior().add({
                    border: false,
                    tbar: ['-', '->', Log.inv.resumenporperiodo.Idioma.lbEjercicio, '', this.comboEjercicio]
                });
                v.getPanelSuperior().doLayout();
            });
        }
    };
};
