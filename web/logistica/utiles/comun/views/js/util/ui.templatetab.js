Ext.ns('LOG.util');
/**
 * Plantilla para la cracion de IU de gestion de logistica
 * Contiene un panel con los botones, un grid general y panel con busqueda
 * avanzada
 * @type @exp;Ext@call;extend
 */
LOG.util.UITabTemplate = Ext.extend(Ext.TabPanel, {
    /**
     *
     * @type Lista que cotiene las tablas
     */
    listaPlantillas: undefined,
    formaVisualizacion: 'default',
    usarAplicar: false,
    /**
     * Lista de los botones principales de la IU
     */
    listaBotones: undefined,
    /**
     *
     * @returns {undefined}
     */
    constructor: function(config) {
        this.listaPlantillas = new LOG.util.List();
        this.listaBotones = new LOG.util.List();
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        LOG.util.UIManager.apply(config, {
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            forceLayout: true
        });
        LOG.util.UIManager.apply(this, config);
        LOG.util.UITabTemplate.superclass.constructor.call(this, config);
        // config.usarAplicar = false;
        var _this = this;
        this.on({
            'tabchange': function() {
                _this.getSelectedTabIndex();
                if(typeof _this.getActiveTemplate().enableHotKeys == 'function' && _this.getActiveTemplate().panelGrid){
                    _this.getActiveTemplate().enableHotKeys(_this.getActiveTemplate().panelGrid);
                }
            }
        });
    },
    /**
     *
     * @param {type} tab
     * @returns {undefined}
     */
    addTabToTemplete: function(tab) {
        this.listaPlantillas.add(tab);
    },
    /**
     *
     * @returns {undefined}
     */
    init: function() {
        this.listaPlantillas.each(function(t) {
            if (typeof t.init === 'function')
                t.init();
        });
        this.panelBotones = LOG.util.UIManager.initFocusPanel({
            region: 'north',
            border: true,
            tbar: new LOG.util.Toolbar({
            })
        });
    },
    /**
     *
     * @returns {LOG.util.Window}
     */
    view: function(config) {
        var _this = this;
        this.listaPlantillas.each(function(t) {
            var _p = t.view();
            _p.setTitle(t.title);
            _p.idComponent = t.idComponent;
            _this.add(_p);
            _p.doLayout();
        });
        _this.doLayout();
        config = config || {};
        

         //Panel de botones principales
        if (this.listaBotones.count()) {

            this.panelBotones.getTopToolbar().add(this.listaBotones.getArray());
            config.items = [this, this.panelBotones];
        } else {
            this.panelBotones.getTopToolbar().setVisible(false);
            config.items = [this];
        }



        switch (this.formaVisualizacion) {
            case 'viewport':
                {
                    return LOG.util.UIManager.initViewport([this, this.panelBotones]);

                    break;
                }
            case 'panel':
                {
                    return this;
                    break;
                }
            default:
                {
                    return LOG.util.UIManager.initWindow(config);
                    break;
                }
        }

        /*return this.formaVisualizacion == 'default' ?
         LOG.util.UIManager.initWindow(config) :
         this;*/
    },
    
    /**
     *
     * @returns {Number|Array.getSelectedTabIndex.pos}
     */
    getSelectedTabIndex: function() {
        var pos = -1;
        var _this = this;
        this.listaPlantillas.each(function(t, index) {
            if (t.idComponent == _this.getActiveTab().idComponent) {
                pos = index;
            }
        });
        return pos;
    },
    getActiveTemplate: function() {
        return this.listaPlantillas.getItem(this.getSelectedTabIndex());
    },
    getTemplateByIndex: function(pos) {
        return this.listaPlantillas.getItem(pos);
    },
    getListTemplate: function() {
        return this.listaPlantillas;
    },
    addToolbarButton: function(b) {
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(b));
    }
    
});


