Ext.ns('LOG.lb.taskprogramer');
/**
 * Componente para la gestión de tareas programadas.
 */
LOG.lb.taskprogramer.Model = Ext.extend(LOG.util.Model, {
    /**
     * @type string
     */
    urlAccionActivar: 'activarTarea',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarTarea';
        config.urlAccionEliminar = 'eliminarTarea';
        config.fields = [
            {
                name: 'idtarea',
                primary: true
            },
            {name: 'code'},
            {name: 'denominacion'},
            {name: 'descripcion'},
            {name: 'json'},
            {name: 'dow'},
            {name: 'horas'},
            {name: 'min'},
        ];
        LOG.lb.taskprogramer.Model.superclass.constructor.call(this, config);
    },
    /**
     * 
     * @param {Boolean} activar
     * @param {function} _fn
     * @returns {undefined}
     */
    activar: function(activar, _fn) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, (activar ? this.idioma.msgActivarTarea : this.idioma.msgDesactivarTarea), function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait((activar ? this.idioma.msgActivandoTarea : this.idioma.msgDesactivandoTarea), this.idioma.msgEspere || '...');
                var objSubmit = {id: Ext.encode(_this.getSelectedId()), activar: activar || null};
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionActivar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            mostrarMensaje(1, (activar ? this.idioma.msgTareaActivada : this.idioma.msgTareaDesactivada));
                            if (this.st) {
                                this.st.reload({
//                                        params : {
//                                            start : 0
//                                        }
                                });
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    }
});