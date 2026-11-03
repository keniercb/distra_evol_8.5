/**
 * @class Ext.ux.toggleslide.Slider
 * @extends Object
 * Componente que renderiza un campo de tipo slider de dos estados.
 * @constructor
 * Crea un nuevo Objeto.
 * @param {Object} config Opciones de configuracion
 * @category Componente
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @version 1.0
 */

Ext.define('Ext.ux.toggleslide.ToggleSlide', {
    extend: 'Ext.Component',
    alias: 'widget.toggleslide',

    requires: ['Ext.ux.toggleslide.Thumb', 'Ext.fx.Anim'],

    /**
     * @cfg {Number} Especifica la duración de la animación de la transición (por defecto
     *      120)
     */
    duration: 120,

    /**
     * @cfg {String} onText El texto a mostrar cuando se encuentra en la posición de 'ON'(por defecto 'ON')
     */
    onText: 'ON',

    /**
     * @cfg {String} offText El texto a mostrar cuando se encuentra en la posición de 'OFF'(por defecto 'OFF')
     */
    offText: 'OFF',

    /**
     * @cfg {Boolean} resizeHandle Si se debe mostrar o no el slider para en cambio de estado con D&D
     *      resized to cover the on or off side (defaults to true)
     */
    resizeHandle: true,

    /**
     * @cfg {Boolean} resizeContainer Specifies whether the contain element
     *      should be resized (defaults to true)
     */
    resizeContainer: true,

    /**
     * @cfg {String} onLabelCls La clase CSS para la etiqueta o label 'on' (por defecto
     *      'x-toggle-slide-label-on')
     */
    onLabelCls: 'x-toggle-slide-label-on',

    /**
     * @cfg {String} ofLabelCls La clase CSS para la etiqueta o label 'off' (por defecto
     *      'x-toggle-slide-label-off')
     */
    offLabelCls: 'x-toggle-slide-label-off',

    /**
     * @cfg {String} handleCls La clase CSS para el manejador de drag and drop (por defecto
     *      'x-toggle-slide-handle')
     */
    handleCls: 'x-toggle-slide-thumb',

    disabledCls: 'x-toggle-slide-disabled',

    /**
     * @cfg {Boolean} state El estado inicial del compoenente (por defecto 'false')
     */
    state: false,

    /**
     * @cfg {Boolean} booleanMode Determina cuando el valor interno del compoenente es un booleano .
     *      Si booleanMode es false el valor del cpt sera representado como el texto de el label 'on'
     *      o 'off' dependiendo el estado donde se encuentre. Ademas el valor devuelto en los eventos
     *      lanzados tambien estara determinado por el valor de este atributo (por defecto true)
     */
    booleanMode: true,

    // private
    dragging: false,
    diff: 0,
    diff2: 0,
    diff3: 0,
    frame: false,

    renderTpl: ['<div class="holder">',
        '<label class="{onLabelCls}">',
        '<span>{onText}</span>',
        '</label>',
        '<label class="{offLabelCls}">',
        '<span>{offText}</span>',
        '</label>',
        '</div>'],

    autoEl: {
        tag: 'div',
        cls: 'x-toggle-slide-container'
    },


    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.addEvents(
            /**
             * @event beforechange Se dispara antes de que se cambie el estado.
             * @param {Ext.form.Checkbox} this el propio componente
             * @param {Boolean|String} state El proximo estado del cmp (puede ser un strin o un boolean dependiendo
             * del valor que tenga booleanMode)
             */
            'beforechange',

            /**
             * @event change Se dispara cuando cambia el estado.
             * @param {Ext.form.Checkbox} el propio componente
             * @param {Boolean|String} state El valor del nuevo estado (puede ser un strin o un boolean dependiendo
             * del valor que tenga booleanMode)
             */
            'change');
    },


    beforeRender: function () {
        var me = this;

        me.callParent();

        Ext.applyIf(me.renderData, {
            offLabelCls: me.offLabelCls,
            offText: me.offText,
            onLabelCls: me.onLabelCls,
            onText: me.onText,
            handleCls: me.handleCls
        });


    },

    /**
     * Renderiza el componente
     *
     * @param {Object} ct El contenedor para rendizar en el.
     * @param {Object} position La pocisión dentro del contenedor.
     * @private
     */
    onRender: function () {
        var me = this;

        if (!me.resizeContainer)
            me.diff = 0;

        if (!me.resizeHandle) {
            me.diff2 = 3;
            me.diff3 = 5;
        }

        me.callParent(arguments);

        if (me.cls) {
            me.el.addCls(me.cls);
        }

        me.thumb = new Ext.ux.toggleslide.Thumb({
            ownerCt: me,
            slider: me,
            disabled: !!me.disabled
        });

        var holder = me.el.first();

        me.onLabel = holder.first();
        me.onSpan = me.onLabel.first();

        me.offLabel = me.onLabel.next();
        me.offSpan = me.offLabel.first();

        if (me.rendered) {
            me.thumb.render();
        }
        me.handle = me.thumb.el;

        if (me.resizeHandle)
            me.thumb.bringToFront();
        else
            me.thumb.sendToBack();

        me.resize();
        me.disableTextSelection();

        if (!me.disabled) {
            me.registerToggleListeners();
        }
        else {
            Ext.ux.toggleslide.ToggleSlide.superclass.disable.call(me);
        }
    },

    /**
     * Redimenciona el compoenen de acuerdo a la configuracion.
     *
     * @private
     */
    resize: function () {
        var me = this,
            container = me.el,
            offlabel = me.offLabel,
            onlabel = me.onLabel,
            handle = me.handle;

        if (me.resizeHandle) {
            var min = (onlabel.getWidth() < offlabel.getWidth()) ? onlabel.getWidth() : offlabel.getWidth();
            handle.setWidth(min);
        }

        if (me.resizeContainer) {
            var max = (onlabel.getWidth() > offlabel.getWidth()) ? onlabel.getWidth() : offlabel.getWidth();
            var expandPx = Math.ceil(container.getHeight() / 3);
            container.setWidth(max + handle.getWidth() + expandPx);
        }

        var b = handle.getWidth() / 2;
        onlabel.setWidth(container.getWidth() - b + me.diff2);
        offlabel.setWidth(container.getWidth() - b + me.diff2);
        var rightside = me.rightside = container.getWidth() - handle.getWidth() - me.diff;

        if (me.state) {
            handle.setLeft(rightside);
        }
        else {
            handle.setLeft(0);
        }
        me.onDrag();
    },

    /**
     * Desabilita el texto de seleccion.
     *
     * @private
     */
    disableTextSelection: function () {
        var els = [this.el,
            this.onLabel,
            this.offLabel,
            this.handle];

        Ext.each(els, function (el) {
            el.on('mousedown', function (evt) {
                evt.preventDefault();
                return false;
            });

            if (Ext.isIE) {
                el.on('startselect', function (evt) {
                    evt.stopEvent();
                    return false;
                });
            }
        });
    },

    /**
     * Define la animacion para mover el componente de un estado a otro.
     *
     * @private
     */
    moveHandle: function (on, callback) {
        var me = this,
            runner = new Ext.util.TaskRunner(),
            to = on ? me.rightside : 0;

        Ext.create('Ext.fx.Anim', {
            target: me.handle,
            dynamic: true,
            easing: 'easeOut',
            duration: me.duration,
            to: {
                left: to
            },
            listeners: {
                beforeanimate: {
                    fn: function (ani) {
                        me.task = runner.newTask({
                            run: function () {
                                me.onDrag();
                            },
                            interval: 10
                        });
                        me.task.start();
                    },
                    scope: this
                },
                afteranimate: {
                    fn: function (ani) {
                        me.onDrag();
                        me.task.destroy();
                    },
                    scope: this
                }
            },
            callback: callback
        });
    },

    /**
     * Asocia el manejador del DD al elemtno contenedor.
     *
     * @private
     */
    onDragStart: function (e) {
        var me = this;

        me.dragging = true;

        me.dd.constrainTo(me.el, {
            right: me.diff
        });
    },

    /**
     * Determina si el manjador o slider de DD ha sido soltado a mas de la mitas del camino
     * hacia el otro estado. Cambia el estado si se cumple esto o lo regresa a la posicion
     * original si no.
     *
     * @private
     */
    onDragEnd: function (e) {
        var me = this,
            hc = (me.handle.getLeft(true) + me.handle.getRight(true)) / 2,
            cc = (me.el.getLeft(true) + me.el.getRight(true)) / 2,
            next = hc > cc;

        (me.state != next) ? me.toggle() : me.moveHandle(next);
        me.dragging = false;
    },

    /**
     * Ajusta el label y lo posiciona.
     *
     * @private
     */
    onDrag: function (e) {
        var me = this,
            p = me.handle.getLeft(true) - me.rightside;

        p = (me.handle.getLeft(true) == me.rightside) ? 0 : p - me.diff3;

        me.onLabel.setStyle({
            marginLeft: p + 'px'
        });
    },

    /**
     * Si no se esta arrastrando cambia estado.
     *
     * @private
     */
    onMouseUp: function () {
        if (!this.dragging) {
            this.toggle();
        }
    },

    /**
     * Transicion al siguiente estado.
     */
    toggle: function () {
        var me = this,
            next = !this.state;

        if (!me.booleanMode) {
            next = me.state ? me.onText : me.offText;
        }

        if (me.fireEvent('beforechange', me, next) !== false) {
            me.state = !me.state;

            me.moveHandle(me.state, Ext.bind(me.fireEvent, me, ['change', me, me.getValue()]));
        }
        else {
            me.moveHandle(me.state);
        }
    },

    /**
     * Si actualmente esta desabilitado, habilita el cmp y dispara el evento 'enable'
     *
     * @return {Ext.Component} this
     */
    enable: function () {
        if (this.disabled) {
            Ext.ux.toggleslide.ToggleSlide.superclass.enable.call(this);
            this.registerToggleListeners();
            //this.thumb.enable();
        }
        return this;
    },

    /**
     * Si actualmente esta habilitado, deabilita el cmp y dispara el evento 'disable'
     * event.
     *
     * @return {Ext.Component} this
     */
    disable: function () {
        if (!this.disabled) {
            Ext.ux.toggleslide.ToggleSlide.superclass.disable.call(this);
            this.unregisterToggleListeners();
            //this.thumb.disable();
        }
        return this;
    },

    /**
     * Registra un listener para el mouseup y crea una instancia de DD para el slider
     *
     * @private
     */
    registerToggleListeners: function () {
        var me = this;

        me.dd = new Ext.dd.DD(me.handle);
        me.dd.startDrag = Ext.bind(me.onDragStart, me);
        me.dd.onDrag = Ext.bind(me.onDrag, me);
        me.dd.endDrag = Ext.bind(me.onDragEnd, me);

        me.el.on('mouseup', me.onMouseUp, me);
    },

    /**
     * Destruye el listener para el mouseup
     *
     * @private
     */
    unregisterToggleListeners: function () {
        Ext.destroy(this.dd);
        this.el.un('mouseup', this.onMouseUp, this);
    },

    /**
     * Retorna el valor interno actual o el texto dependiendo de la configuracion del atrubuto booleanMode
     */
    getValue: function () {
        var me = this;
        return me.booleanMode ? me.state : (me.state ? me.onText : me.offText);
    }
});
