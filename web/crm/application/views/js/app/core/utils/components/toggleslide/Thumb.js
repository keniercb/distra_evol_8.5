/**
 * @class Ext.ux.toggleslide.Slider
 * @extends Object
 * Componente que renderiza el slider o el resizeHandler para cambiar de estado mediante Drag and Drop
 * @constructor
 * Crea un nuevo Objeto.
 * @param {Object} config Opciones de configuracion
 * @category Componente
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @version 1.0
 */

Ext.define('Ext.ux.toggleslide.Thumb', {

    /**
     * @private
     * @property {Number} topZIndex
     * El numero usado internamente para establecer el slider por encima de todos los elementos del DOM
     */
    topZIndex: 10000,

    /**
     * @cfg {Ext.slider.MultiSlider} slider (required)
     * The Slider to render to.
     */

    /**
     * Crea un nuevo slider.
     * @param {Object} [config] Config object.
     */
    constructor: function(config) {
        var me = this;

        Ext.apply(me, config || {}, {
            cls: Ext.baseCSSPrefix + 'toggle-slide-thumb',

            constrain: false
        });
        me.callParent([config]);
    },

    /**
     * Renderiza el slider
     */
    render: function() {
        var me = this;
        
        me.el = me.slider.el.insertFirst(me.getElConfig());
        me.onRender();
    },
    
    onRender: function() {
        if (this.disabled) {
            this.disable();
        }
        //this.initEvents();
    },

    getElConfig: function() {
        var me = this,
            slider = me.slider,
            style = {};

        style['left'] = 0;
        return {
            style: style,
            id  : this.id,
            cls : this.cls
        };
    },

    /**
     * @private
     * trae el slider al frente en el dom
     */
    bringToFront: function() {
        this.el.setStyle('zIndex', this.topZIndex);
    },

    /**
     * @private
     * Envia el slider atras en el dom
     */
    sendToBack: function() {
        this.el.setStyle('zIndex', '');
        
        this.el.setStyle({
            visibility: 'hidden'
        });
        
    },
    
    disable: function() {

    }
});
