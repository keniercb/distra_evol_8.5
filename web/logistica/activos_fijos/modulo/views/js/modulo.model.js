Ext.ns('LOG.aft.modulo');

LOG.aft.modulo.Model = Ext.extend(LOG.util.Model, {

    constructor: function(config) {
        this.listaGeneral = new LOG.util.List();
        LOG.aft.modulo.Model.superclass.constructor.call(this, config);
    },

    inicializarListas: function() {
        this.listaGeneral.add(new LOG.util.List());
    },

    bindFormMedio: function (basicForm, pos) {
        var _scope = this;
        basicForm.getForm().items.each(function (field) {

            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }

                field.fireEvent = field.fireEvent.createSequence(function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        var auxObj = {};
                        var existe = _scope.existe(field.getName(), pos);
                        auxObj[field.getName()] = field.getValue();
                        _scope.listaGeneral.getItem(pos).setItem(auxObj, existe);
                        if (basicForm.getForm().isValid()) {
                            //   _scope.habilitarBotones();
                        } else {
                            // _scope.habilitarBotones(true);
                        }
                    }
                });
            }
        });
    },

    existe: function (name, pos) {
        var result = -1;
        this.listaGeneral.getItem(pos).each(function (it, pos) {
            if (it.name == name) {
                result = pos;
            }
        });
        return result;
    },

    obtenerLista: function(pos) {
        return this.listaGeneral.getItem(pos);
    }


});