/**
 * @class recetas.model
 * (Descripcion de la clase, objetivo)
 * 
 * @package Inventario
 * @subpackage Alimento
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('LOG.inv.receta'); 
 
LOG.inv.receta.Model = Ext.extend(LOG.util.Model, {
    /**
     * @param {object} config
     */
    constructor: function(config) {
        config.urlAccionGuardar = 'adicionarDocumento';
        config.urlAccionEliminar = 'eliminarReceta';
        this.urlAccionEliminarProducto = 'eliminarProductosReceta';
        this.gridModificado = false;
        this.recetaRealizada = false;
        this.urlAccionUsarEntidad = 'habilitarEntidad';
        this.urlAccionDuplicar = 'copiarDocumento';
        
        config.fields = [ 
            { 
                name: 'idreceta',
                primary: true
            },
            { name: 'denominacion' },
            { name: 'cantracion' },
            { name: 'idunidadmedida' },
            { name: 'proteinas' },
            { name: 'calorias' },
            { name: 'fechainicio' },
            { name: 'fechafin' },
            { name: 'observacion' }
        ]; 
        LOG.inv.receta.Model.superclass.constructor.call(this, config); 
    },
    /**
     * @param {object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     */
    eliminarProductoReceta:function(parametros, _fn, _fnFail) {
        var _this = this;

        mostrarMensaje(2, this.idioma.msgDeleteProdObjeto, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgElimObjeto, this.idioma.msgEspere || '...');
                var objSubmit = {
                    idproductos: Ext.encode(parametros),
                    idreceta: _this.getSelectedId()
                };

                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarProducto,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, this.idioma.msgObjetoEliminadoProd);
                            _this.st.reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        } else {
                            if (typeof _fnFail == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    /**
     * @param {object} parametros
     * @param {function} _fn
     */
    usarEntidad: function(parametro, _fn){
        var _this = this;

        mostrarMensaje(2, (parametro==2)? this.idioma.msgConfirmarUsar : this.idioma.msgConfirmarNoUsar, function(btn) {;
            if (btn == 'ok') {
                Ext.MessageBox.wait((parametro==2)? this.idioma.msgHabilObjeto: this.idioma.msgDesHabilObjeto, this.idioma.msgEspere || '...');
                var objSubmit = {
                    estado: parametro,
                    idreceta: _this.getSelectedId()
                };//_this.getSelectedId()};
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionUsarEntidad,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            mostrarMensaje(1, (parametro==2)? this.idioma.msgObjetoHabilitado:this.idioma.msgObjetoDesHabilitado);
                            _this.st.reload();
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }/*else if(resp.codMsg != 4){
                             mostrarMensaje(3,this.idioma.msgObjetoUso);
                        }*/
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    /**
     * @param {object} parametros
     * @param {function} _fn
     * @param {function} _fnFail
     */
    duplicar: function(parametros, _fn, _fnFail) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgDuplicarDocumento, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgDuplicandoObjeto, _this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};

                objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionDuplicar,
                    method: 'POST',
                    params: objSubmit,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, _this.idioma.msgDuplicarAnulado);
                                _this.st.reload();
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        } else {
                            if (typeof _fnFail == 'function') {
                                _fnFail.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        });
    },
    isValid: function(){
            return (LOG.inv.receta.Model.superclass.isValid.call(this) || this.gridModificado || this.recetaRealizada);
    }
});




