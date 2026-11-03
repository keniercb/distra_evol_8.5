Ext.ns('LOG.util');
/**
 *
 * @returns {LOG.util.WindowManager.Anonym$21}
 */
Ext.Ajax.timeout = 10000000;
Ext.MessageBox.OK = {
    iconCls: 'aceptar',
    ok: true
};

LOG.util.WindowManager = function () {
    var listaWin = new LOG.util.List();
    return {
        add: function (win) {
            var existe = false;
            listaWin.each(function (it) {
                if (it.getId() == win.getId()) {
                    existe = true;
                }
            });
            if (!existe) {
                listaWin.add(win);
                this.activate();
            }
        },
        remove: function () {
            listaWin.delete(listaWin.count() - 1);
            this.activate();
        },
        activate: function () {
            if (this.getActive() != false) {
                if (typeof this.getActive().getFocusElement == 'function') {
                    this.getActive().getFocusElement().focus(false, 200);
                    return;
                }
                this.getActive().focus();
            }
        },
        getActive: function () {
            return listaWin.getItem(listaWin.count() - 1);
        },
        removeWin: function (win) {
            var existe;
            listaWin.each(function (it, pos) {
                if (it.getId() == win.getId()) {
                    existe = pos;
                }
            });
            if (existe != -1) {
                listaWin.delete(existe);
            }
        }
    };
};
/**
 *
 * @type type
 */
LOG.util.TabController = {
    tabIndex: 0,
    push: function (cmp) {
        cmp.tabIndex = this.next();
        if (this.current() == 1) {
            cmp.render = cmp.render.createSequence(function () {
                cmp.focus();
            });
        }
    },
    next: function () {
        this.tabIndex++;
        return this.tabIndex;
    },
    current: function () {
        return this.tabIndex;
    }
};
/**
 * Clase que implementa un iterardor para la lista de elementos
 */
LOG.util.Iterator = Ext.extend(Ext.util.Observable, {
    /**
     * Variable que referencia lista
     */
    list: null,
    /**
     * Posicion actual del iterador
     */
    currentPos: 0,
    /**
     * Constructor del iterador
     * @param {type} pLista
     */
    constructor: function (pLista) {
        this.list = pLista;
        this.currentPos = 0;
    },
    /**
     * Devuelve si la posicion atual de la lista tiene un elemento siguiente
     * @returns {Boolean}
     */
    hasNext: function () {
        return this.currentPos < this.list.count();
    },
    /**
     * Devuelve el elemento actual de la lista y coloca el iterador en la proxima posicion
     * @returns {Anonym$0@pro;list@call;getItem}
     */
    next: function () {
        var tempPos = this.currentPos++;
        return this.list.getItem(tempPos);
    },
    /**
     * Devuleve la posicion actual en la que se encuentra el apuntador de arreglo
     * @type @exp;Ext@call;extend
     */
    getCurrentPosition: function () {
        return this.currentPos;
    }
});
/**
 *
 */
LOG.util.TabIterator = Ext.extend(Ext.util.Observable, {
    /**
     * Variable que referencia lista
     */
    list: null,
    /**
     * Posicion actual del iterador
     */
    currentPos: 0,
    /**
     * Constructor del iterador
     * @param {type} pLista
     */
    constructor: function () {
        this.list = new LOG.util.List();
        this.currentPos = 0;
    },
    /**
     * Devuelve si la posicion atual de la lista tiene un elemento siguiente
     * @returns {Boolean}
     */
    add: function (f) {
        this.list.add(f);
    },
    /**
     * Devuelve el elemento actual de la lista y coloca el iterador en la proxima posicion
     * @returns {Anonym$0@pro;list@call;getItem}
     */
    next: function () {
        this.currentPos++;
        while (this.list.isValid(this.currentPos)) {
            if (!this.list.getItem(this.currentPos).disabled && this.list.getItem(this.currentPos).isVisible()) {
                break;
            }
            this.currentPos++;
        }
        if (!this.list.isValid(this.currentPos)) {
            this.currentPos = 0;
            while (this.list.isValid(this.currentPos)) {
                if (!this.list.getItem(this.currentPos).disabled && this.list.getItem(this.currentPos).isVisible()) {
                    break;
                }
                this.currentPos++;
            }
        }
        if (this.list.getItem(this.currentPos)) {
            this.list.getItem(this.currentPos).focus(false, 100);
        }
    },
    /**
     * Devuelve el elemento actual de la lista y coloca el iterador en la proxima posicion
     * @returns {Anonym$0@pro;list@call;getItem}
     */
    previous: function () {
        this.currentPos--;
        while (this.list.isValid(this.currentPos)) {
            if (!this.list.getItem(this.currentPos).disabled && this.list.getItem(this.currentPos).isVisible()) {
                break;
            }
            this.currentPos--;
        }
        if (!this.list.isValid(this.currentPos)) {
            this.currentPos = this.list.count() - 1;
            while (this.list.isValid(this.currentPos)) {
                if (!this.list.getItem(this.currentPos).disabled && this.list.getItem(this.currentPos).isVisible()) {
                    break;
                }
                this.currentPos--;
            }
        }
        if (this.list.getItem(this.currentPos)) {
            this.list.getItem(this.currentPos).focus(false, 100);
        }
    },
    /**
     *
     * @returns {undefined}
     */
    order: function () {
        this.list.orderBy('tabIndex');
    },
    focus: function (f) {
        var pos = 0;
        while (this.list.getItem(pos).id != f.id) {
            pos++;
        }
        if (this.list.isValid(this.currentPos)) {
            this.currentPos = pos;
        } else {
            this.currentPos = 0;
        }
    },
    check: function (cmp) {
        return (!cmp.disabled && cmp.isVisible());
    }
});
/**
 * Clase que simula el comportamiento de una lista para el manejo de elementos de la IU.
 */
LOG.util.List = Ext.extend(Ext.util.Observable, {
    /**
     * Arreglo que contiene la informacion almacenada en la lista
     */
    arrayData: null,
    /**
     * Constructor de la clase
     * @param {Array} array [Opcional]
     */
    constructor: function (array) {
        this.arrayData = array || new Array();
    },
    /**
     * Funcion para adicionar un nuevo elemento a la lista
     * @param {Object} item
     */
    add: function (item) {
        this.arrayData.push(item);
    },
    /**
     * Funcion para eliminar un elemnto de la lista pasandole la posicion
     * @param {type} pos
     */
    delete: function (pos) {
        if (this.isValid(pos)) {
            if (this.count() == 1) {
                this.deleteAll();
                return true;
            }
            for (var i = pos; i < this.count() - 1; i++) {
                this.arrayData[i] = this.getItem(i + 1);
            }
            this.arrayData.length -= 1;
            return true;
        }
        return false;
    },
    /**
     * Funcion para eliminar un objeto
     * @returns {undefined}
     */
    deleteElement: function (o) {
        var pos = this.idexOf(o);
        if (pos != -1) {
            return this.delete(pos);
        }
        return false;
    },
    /**
     * Elimina todos los elementos de la lista.
     * @returns {undefined}
     */
    deleteAll: function () {
        this.arrayData = new Array();
    },
    /**
     * Devuelve el elemento continido en una posicion pasada por parametro
     * @param {Integer|Boolean} pos
     */
    getItem: function (pos) {
        if (this.isValid(pos)) {
            return this.arrayData[pos];
        }
        return false;
    },
    /**
     *
     * @param {Object} item
     * @param {Integer} pos
     * @returns {Boolean|Array}
     */
    setItem: function (item, pos) {
        if (this.isValid(pos)) {
            this.arrayData[pos] = item;
        } else {
            this.add(item);
        }
    },
    /**
     * Inserta un elemento en la posicion especificada
     * @param {Object} item
     * @param {Integer} pos
     * @returns {Boolean}
     */
    insert: function (item, pos) {
        if (this.isValid(pos)) {
            for (var i = this.count(); i > pos; i--) {
                this.arrayData[i] = this.getItem(i - 1);
            }
            this.arrayData[i] = item;
            return true;
        }
        return false;
    },
    /**
     * Devuelve si una posicion es validad para la lista
     * @param {type} pos
     * @returns {Boolean}
     */
    isValid: function (pos) {
        return pos >= 0 && pos < this.count();
    },
    /**
     * Devuelve la longitud de la lista
     * @returns {Integer}
     */
    count: function () {
        return this.arrayData.length;
    },
    /**
     * Devuelve un iterador para recorrer la lista con mayor comodidad
     * @returns {LOG.util.Iterator}
     */
    getIterator: function () {
        return new LOG.util.Iterator(this);
    },
    /**
     * Funcion para iterar sobre todos los elementos contenidos en la lista, ejecutando
     * la funcion _fn para cada elemento
     * la funcion fn es llamada con cada elemento pasado por parametro
     * @param {function} _fn
     * @param {object} scope
     */
    each: function (_fn, scope) {
        var it = this.getIterator();
        var count = 0;
        if (typeof _fn == 'function') {
            while (it.hasNext()) {
                _fn.createDelegate(scope || this, [it.next(), count++]).call();
            }
        }
    },
    /**
     * Devuelve si un objeto esta contenido en una lista
     * @param {type} o
     * @returns {numeric}
     */
    idexOf: function (o) {
        /*var it = this.getIterator();
         while (it.hasNext()) {
         if (LOG.util.Criteria(it.next(), o))
         return it.getCurrentPosition() - 1;
         }
         return -1;*/
    },
    /***
     * Devulve la lista como un arreglo
     * @returns {Array}
     */
    getArray: function () {
        return this.arrayData;
    },
    /**
     * Devuelve un objeto de la lista dado una propiedad.
     * @param {String} field
     * @param {type} value
     * @returns {Object}
     */
    getBy: function (field, value) {
        var _returnVal = null;
        this.each(function (i) {
            if (i[field] == value) {
                _returnVal = i;
            }
        });
        return _returnVal;
    },
    getPosByField: function (field, value, check) {
        var pos = 0, result = -1;
        this.each(function (i) {
            if (!check || i[check] != undefined) {
                if (i[field] == value) {
                    result = pos;
                }
                pos++;
            }
        });
        return result;
    },
    orderBy: function (field) {
        var min = -1;
        for (var i = 0; i < this.count() - 1; i++) {
            min = i;
            for (var j = i + 1; j < this.count(); j++) {
                if (this.getItem(j)[field] < this.getItem(min)[field]) {
                    min = j;
                }
            }
            var temp = this.getItem(min);
            this.replace(this.getItem(i), min);
            this.replace(temp, i);
        }
    },
    replace: function (item, pos) {
        if (this.isValid(pos)) {
            this.arrayData[pos] = item;
            return true;
        }
        return false;
    }
});

LOG.util.tabcontroller = new LOG.util.TabIterator();
/*LOG.util.map = new Ext.KeyMap(document, [
    {
        key: "\t",
        ctrl: false,
        shift: true,
        fn: function () {
            LOG.util.tabcontroller.next()
        }
    }, {
        key: "\t",
        ctrl: false,
        shift: false,
        fn: function () {
            LOG.util.tabcontroller.previous();
        }
    }
]);*/
/**
 *
 * @type Ext
 */
LOG.util.Window = Ext.extend(Ext.Window, {
    /**
     * Lista de los botones de la ventana
     */
    listaBotones: undefined,
    autoValidate: false,
    /**
     * Funcion que se ejecuta en la accion del boton
     */
    aceptarFn: function () {

    },
    cancelarFn: function () {

    },
    /**
     * Variable que especifica si se usa el boton aplicar
     */
    usarAplicar: true,
    /**
     *
     */
    usarAceptar: true,
    /**
     *
     */
    cerrarAceptar: true,
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        Ext.apply(this, config);
        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAplicar({
            hidden: !this.usarAplicar,
            handler: this.onAplicarHandler,
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAceptar({
            hidden: !this.usarAceptar,
            handler: this.onAceptarHandler,
            scope: this
        })));
        LOG.util.Window.superclass.constructor.call(this, config);
    },
    /**
     *
     * @returns {undefined}
     */
    initComponent: function () {
        var _this = this;
        var config = {
            layout: 'border',
            modal: true,
            constrain: true,
            closeAction: 'close',
            buttons: this.buttons || this.listaBotones.getArray()
        };
        Ext.each(config.buttons, function (btn) {
            btn.ventana = _this;
        });
        this.on({
            'render': {
                fn: this.onRenderHandler.createDelegate(this),
                scope: this
            },
            'beforeclose': {
                fn: this.onCloseHandler.createDelegate(this),
                scope: this
            },
            'show': {
                fn: this.onShowHandler.createDelegate(this),
                scope: this
            }
        });
        this.panel = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            items: this.items
        });
        this.items = [this.panel];
        Ext.apply(this, config);
        LOG.util.Window.superclass.initComponent.call(this, arguments);
    },
    /**
     *
     * @returns {undefined}
     */
    onRenderHandler: function () {
        var _this = this;
        this.panel.on({
            'render': function () {
                _this.listaBotones.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this);
                }, _this);
            }
        });
    },
    /**
     *
     * @param {type} usarAplicar
     * @returns {undefined}
     */
    setUsarAplicar: function (usarAplicar) {
        this.usarAplicar = usarAplicar;
    },
    /**
     *
     * @returns {undefined}
     */
    onAplicarHandler: function () {
        if (typeof this.scope.aceptarFn == 'function') {
            this.scope.aceptarFn.createDelegate(this.scope, [true]).call();
        }
    },
    /**
     *
     * @returns {undefined}
     */
    onAceptarHandler: function () {
        var cerrar = true;
        if (typeof this.scope.aceptarFn == 'function') {
            cerrar = this.scope.aceptarFn.createDelegate(this.scope, [false]).call();
        }
        if (cerrar || this.scope.cerrarAceptar) {
            this.scope.close();
        }
    },
    /**
     *
     * @returns {undefined}
     */
    onCancelarHandler: function () {
        var cerrar = true;
        if (typeof this.scope.cancelarFn == 'function') {
            cerrar = this.scope.cancelarFn.createDelegate(this.scope, [false]).call();
        }
        if (cerrar || this.scope.cerrarAceptar) {
            this.scope.close();
        }
        //this.scope.close();
    },
    /**
     *
     * @param {type} p
     * @returns {Boolean}
     */
    onCloseHandler: function (p) {
        if (typeof this.closeFn == 'function') {
            this.closeFn.createDelegate(this).call();
        }
        LOG.util.WindowMgr.remove();
        p.hide();
        return false;
    },
    /**
     *
     * @returns {undefined}
     */
    onShowHandler: function () {
        if (typeof this.onShowFn == 'function') {
            this.onShowFn.createDelegate(this).call();
        }
        LOG.util.WindowMgr.add(this);
    },
    /**
     *
     * @param {type} pos
     * @returns {Anonym$17@pro;listaBotones@call;getItem}
     */
    getButton: function (pos) {
        return this.listaBotones.getItem(pos);
    }
});
/**
 * Panel generico al que se le puede hacer un focus
 * @type @exp;Ext@call;extend
 */
LOG.util.Panel = Ext.extend(Ext.Panel, {
    border: false,
    doFocus: true,
    constructor: function (config) {
        LOG.util.Panel.superclass.constructor.call(this, config);
    },
    onRender: function () {
        LOG.util.Panel.superclass.onRender.apply(this, arguments);
        if (this.doFocus) {
            this.focusEl = this.el.createChild({
                tag: 'a', href: '#', cls: 'x-dlg-focus',
                tabIndex: '-1', html: '&#160;'
            });
            this.focusEl.swallowEvent('click', true);
            this.getEl().on({
                click: this.focus,
                scope: this
            });
        }
    },
    focus: function (c, delay) {
        if (delay) {
            this.focusTask = new Ext.util.DelayedTask(this.focus, this, [c, false]);
            this.focusTask.delay(Ext.isNumber(delay) ? delay : 10);
            return this;
        }
        if (this.doFocus && this.focusEl) {
            if (!c || (!(c.browserEvent.target instanceof HTMLInputElement)
                && !(c.browserEvent.target instanceof HTMLTextAreaElement))) {
                this.focusEl.focus();
            }
        }
    }
});
/**
 *
 * @type @exp;Ext@call;extend
 */
LOG.util.Viewport = Ext.extend(Ext.Viewport, {});
/**
 * Clase que gestiona un formulario que se muestra en columnas y que se le annaden
 * componenentes en tiempo de codigo si necesidad de incluirlos como objetos del
 * mismo
 * @type @exp;Ext@call;extend
 */
LOG.util.ColumnForm = Ext.extend(Ext.Panel, {
    /**
     * Lista que contiene los componentes que se muestran en cada columna y que se
     * annaden de forma dinamica
     */
    listaCmpColumnas: undefined,
    /*
     * Cantidad de columnas del panel 2 por defecto
     */
    columnas: 2,
    /**
     * Posicion en que se encuentra la columna actual en que se adicionara el
     * componente
     */
    columnaActual: 1,
    /**
     *
     */
    tabIndex: 1,
    hasComponent: false,
    /**
     * Constructor de la clase
     * @param {Object} config
     * @returns {void}
     */
    constructor: function (config) {
        config.layout = 'column';
        LOG.util.UIManager.apply(this, config);
        this.listaCmpColumnas = new LOG.util.List();
        for (var i = 0; i < this.columnas; i++) {
            this.listaCmpColumnas.add(LOG.util.UIManager.initPanel({
                layout: 'form',
                labelAlign: 'top',
                html: '',
                defaults: {
                    anchor: config.defaultsAnchor || '98%'
                },
                columnWidth: (100 / this.columnas) / 100,
            }));
        }
        LOG.util.ColumnForm.superclass.constructor.call(this, config);
    },
    /**
     *
     * @returns {void}
     */
    initComponent: function () {
        LOG.util.UIManager.apply(this, {
            layout: 'column',
            border: false,
        });
        LOG.util.ColumnForm.superclass.initComponent.call(this);
        this.init();
    },
    /**
     * Funcion que adiciona un nuevo form component al formulario en la columna
     * correspondiente
     * @param {Component} cmp Componente que se adiciona al formulario
     * @returns {void}
     */
    addComponent: function (cmp) {
        this.hasComponent = true;
        this.listaCmpColumnas.getItem(this.columnaActual - 1).add(cmp);
        if (this.columnaActual == this.columnas) {
            this.columnaActual = 1;
        }
        else {
            this.columnaActual++;
        }
    },
    /**
     *
     * @returns {undefined}
     */
    init: function () {
        this.add(this.listaCmpColumnas.getArray());
        this.doLayout();
    },
    /**
     *
     * @param {type} index
     * @returns {Anonym$11@pro;listaCmpColumnas@call;getItem}
     */
    getColumn: function (index) {
        return this.listaCmpColumnas.getItem(index);
    },
    hasComponents: function () {
        return this.hasComponent;
    }
});
/**
 * Panel del busqueda avanzanda que se annade a las IU
 * @type @exp;Ext@call;extend
 */
LOG.util.PanelBusqueda = Ext.extend(LOG.util.Panel, {
    /**
     *
     */
    listaBotones: undefined,
    /**
     *
     */
    pContainer: undefined,
    keyContainer: undefined,
    /**
     *
     */
    grid: undefined,
    /**
     *
     */
    loaded: false,
    /**
     *
     */
    store: undefined,
    /*
     * Cantidad de columnas del panel
     */
    columnas: 2,
    /**
     * Formulario de busqueda
     */
    panelBusqueda: undefined,
    /**
     *
     */
    formularioBusqueda: undefined,
    /**
     * Variable para administrar si el panel tiene componentes par no renderizar
     * innecesariamente
     */
    hasComponent: false,
    /**
     *
     * @type type
     */
    parametros: undefined,
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        Ext.apply(this, config);
        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: this.onOcultarHandler,
            scope: this,
            tooltip: LOG.util.Idioma.ttBtnOcultar,
        }, true)));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            handler: this.onLimpiarHandler,
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            handler: this.onBuscarHandler,
            scope: this
        })));
        this.botonFiltar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAvanzada({
            text: LOG.util.Idioma.lbBtnBuscarAvz,
            tooltip: LOG.util.Idioma.lbBtnBuscarAvz + ' de ' + this.concepto,
            handler: this.onAvanzadaHandler,
            scope: this
        }));
        this.initFomulario();
        this.model = new LOG.util.ModelBusquedaAvanzada({});
        this.model.addActionButton(this.listaBotones.getItem(2));
        this.parametros = {};
        LOG.util.PanelBusqueda.superclass.constructor.call(this, config);
    },
    /**
     *
     * @returns {undefined}
     */
    initFomulario: function () {
        this.panelBusqueda = LOG.util.UIManager.initColumnForm({
            columnas: this.columnas
        });
        this.formularioBusqueda = LOG.util.UIManager.initForm({
            items: [this.panelBusqueda],
            mapCmp: this
        });
    },
    /**
     *
     * @returns {undefined}
     */
    _initComponent: function () {
        var _this = this;
        Ext.apply(this, {
            region: 'east',
            width: this.width || '30%',
            //            iconCls: 'buscaravanzada',
            frame: true,
            hideCollapseTool: true,
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            autoScroll: true,
            animCollapse: false,
            animate: true,
            collapsed: true,
            title: LOG.util.Idioma.lbBtnBuscarAvz,
            items: [this.formularioBusqueda],
            buttons: this.listaBotones.getArray()
        });
        this.on({
            'render': function () {
                this.listaBotones.each(function (b) {
                    LOG.util.UIManager.applyKey(b, this);
                    _this.formularioBusqueda.tabIterator.add(b);
                }, this);
            },
            'collapse': function () {
                if (_this.botonFiltar) {
                    _this.botonFiltar.setVisible(true);
                }
                this.hide();
                this.pContainer.doLayout();
                if (this.keyContainer) {
                    this.keyContainer.focusEl.focus();
                }
            },
            'beforeexpand': function () {
                this.show();
                this.pContainer.doLayout();
            }
        }, this);
        LOG.util.PanelBusqueda.superclass.initComponent.call(this, arguments);
    },
    /**
     * Inicializa un nuevo panel de busqueda avanzada
     * @returns {void}
     */
    init: function () {
        this._initComponent();
        this.store = this.grid.getStore();
        this.concepto = this.grid.concepto ? ' ' + this.grid.concepto : '';
        this.listaBotones.getItem(2).setTooltip(LOG.util.Idioma.lbBtnBuscar + this.concepto);
        if (this.pContainer) {
            this.grid.onRender = this.grid.onRender.createSequence(this.onRenderHandler, this);
            this.pContainer.add(this);
            this.panelBusqueda.init();
            this.pContainer.doLayout();
        }
    },
    /**
     * Accion que se ejecuta al dar click en el boton de ocultar
     * @returns {void}
     */
    onOcultarHandler: function () {
        var _this = this.scope || this;
        _this.collapse(true);
    },
    /**
     * Accion que se ejecuta al dar click en el boton de limpiar
     * @returns {void}
     */
    onLimpiarHandler: function () {
        var _this = this.scope || this;
        _this.store.filtrado = false;
        var p = _this.store.baseParams;
        _this.store.baseParams = _this.store.initBaseParams;
        var params = {
            criterio: p.criterio
        };
        _this.store.limitParams.start = 0;
        _this.store.limitParams.limit = _this.grid.getBottomToolbar() ? _this.grid.getBottomToolbar().pageSize : 30;
        Ext.apply(params, _this.store.limitParams);
        _this.getForm().reset();
        _this.model.reset();
        _this.store.reload({
            params: params
        });
        var _focus = false;
        var field = null;
        _this.formularioBusqueda.getForm().items.each(function (f) {
            if (!f.disabled && _focus == false) {
                _focus = true;
                field = f;
            }
        });
        if (field != null) {
            field.focus(true, 300);
        }
    },
    /**
     * Accion que se ejecuta al dar click en el boton de buscar
     * @returns {void}
     */
    onBuscarHandler: function () {
        var _this = this.scope || this;
        var uiParams = _this.getForm().getFieldValues(true);
        uiParams.filtrado = 1;
        LOG.util.UIManager.apply(_this.store.baseParams, uiParams);
        if (_this.parametros) {
            LOG.util.UIManager.apply(uiParams, _this.parametros);
        }
        _this.store.limitParams.start = 0;
        _this.store.limitParams.limit = _this.grid.getBottomToolbar() ? _this.grid.getBottomToolbar().pageSize : 30;
        Ext.apply(uiParams, _this.store.limitParams);
        _this.store.filtrado = true;
        _this.store.load({
            params: uiParams
        });
    },
    /**
     * Accion que ese ejecuta al dar click en el boton de busqueda avanzada
     * @returns {void}
     */
    onAvanzadaHandler: function () {
        var _this = this.scope || this;
        if (typeof _this.cargarDatos == 'function') {
            _this.cargarDatos.createDelegate(_this, [_this.contexto]).call();
        }
        _this.expand(true);
        var _focus = false;
        var field = null;
        _this.formularioBusqueda.getForm().items.each(function (f) {
            if (!f.disabled && _focus == false) {
                _focus = true;
                field = f;
            }
        });
        if (field != null) {
            field.focus(true, 300);
        }
        _this.botonFiltar.setVisible(false);
    },
    /**
     * Accion que se ejecuta en cuando se renderiza el componente
     * @returns {void}
     */
    onRenderHandler: function () {
        if (this.hasComponent == true) {
            var tBar = this.grid.getTopToolbar();
            tBar.add('->');
            tBar.add(this.botonFiltar);
            LOG.util.UIManager.applyKey(this.botonFiltar, this.keyContainer || this.pContainer);
            tBar.setVisible(true);
            this.model.bindForm(this.formularioBusqueda);
        }
    },
    /**
     * Devuelve el componente basicForm de la busqueda
     * @returns {Anonym$8@pro;formularioBusqueda@call;getForm}
     */
    getForm: function () {
        return this.formularioBusqueda.getForm();
    },
    /**
     * Adicinar un componente a la ventana
     * @param {Component} c
     * @returns {void}
     */
    addSearchComponent: function (c) {
        this.panelBusqueda.addComponent(c);
        this.hasComponent = true;
    },
    /**
     * Devuelve si el formulario es valido
     * @returns {Boolean}
     */
    isValid: function () {
        var values = this.getForm().getValues();
        for (var v in values) {
            if (!Ext.isEmpty(v)) {
                return true;
            }
        }
        return false;
    },
    /**
     * Intercepta el evento load del store y muestra el mensaje si esta vacio
     * @param {type} e
     * @param {type} args
     * @returns {Boolean}
     */
    fireStoreEvent: function (e, args) {
        if (e == 'load') {
            if (this.store.getCount() == 0) {
                mostrarMensaje(1, LOG.util.Idioma.msgNoResultados);
                return false;
            }
        }
        return true;
    },
    /***
     *
     * @param {type} container
     * @returns {undefined}
     */
    setContainer: function (container) {
        this.pContainer = container;
    },
    setKeyContainer: function (container) {
        this.keyContainer = container;
    },
    /**
     *
     * @param {type} grid
     * @returns {undefined}
     */
    setGrid: function (grid) {
        this.grid = grid;
    },
    /**
     *
     * @param {type} cols
     * @returns {undefined}
     */
    setColumns: function (cols) {
        this.columnas = cols;
        this.initFomulario();
    }
});
/**
 *
 * @type @exp;Ext@call;extend
 */
LOG.util.GridFilter = Ext.extend(Ext.util.Observable, {
    searchTipText: LOG.util.Idioma.ttCriterioBuscar,
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    constructor: function (config) {
        Ext.apply(this, config);
        LOG.util.GridFilter.superclass.constructor.call(this, config);
        this.initSearchComponents();
        this.init();
    },
    /**
     *
     * @returns {undefined}
     */
    init: function (grid) {
        this.grid = this.grid || grid;
        if (this.grid) {
            var concept = this.grid.concepto || '';
            this.btnFiltar.setTooltip(LOG.util.Idioma.lbBtnBuscar + ' ' + (this.concepto || concept));
            if (this.grid.getStore)
                this.store = this.grid.getStore();
            this.grid.onRender = this.grid.onRender.createSequence(this.onRender, this);
            this.store.fireEvent = this.store.fireEvent.createInterceptor(this.fireStoreEvent, this);
        }
    },
    initSearchComponents: function () {
        this.tfBusqueda = new Ext.form.TextField({
            width: 200,
            maxLength: 50,
            enableKeyEvents: true,
            emptyText: (this.searchTipText) ? this.searchTipText : LOG.util.Idioma.lbCriterioBuscar
        });
        var concept = /*this.grid.concepto ||*/ '';
        this.btnFiltar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            tooltip: LOG.util.Idioma.lbBtnBuscar + ' ' + (this.concepto || concept),
            handler: this.onTriggerSearch,
            scope: this,
            //            disabled : true
        }));
        this.btnLimpiar = LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            handler: this.onTriggerClear,
            scope: this,
            //            disabled : true
        }));
    },
    /**
     *
     * @returns {undefined}
     */
    onRender: function () {
        LOG.util.UIManager.applyKey(this.btnLimpiar, this.grid);
        LOG.util.UIManager.applyKey(this.btnFiltar, this.grid);
        LOG.util.disableDEL = false;
        this.tfBusqueda.on('render', function () {
            this.tfBusqueda.el.dom.qtip = this.searchTipText;
            this.grid.keyMap = new Ext.KeyMap(this.tfBusqueda.el, [{
                key: Ext.EventObject.ENTER
                , scope: this
                , fn: this.onTriggerSearch
            }, {
                key: Ext.EventObject.ESC
                , scope: this
                , fn: this.onTriggerClear
            }, {
                key: 'L',
                alt: true,
                shift: false,
                scope: this,
                control: false,
                fn: this.onTriggerClear
            }, {
                key: 'B',
                alt: true,
                shift: false,
                scope: this,
                control: false,
                fn: this.onTriggerSearch
            }]);
            this.grid.keyMap.stopEvent = true;
        }, this, { single: true });

        this.tfBusqueda.on('focus', function () {
            LOG.util.disableDEL = true;
        });

        this.tfBusqueda.on('blur', function () {
            LOG.util.disableDEL = false;
        });
        var _this = this;
        /*this.tfBusqueda.on('keyup', function(e){
         _this.btnLimpiar.setDisabled(!e.isDirty());
         _this.btnFiltar.setDisabled(!e.isDirty());
         });*/
        var tBar = this.grid.getTopToolbar();
        tBar.add('-', this.tfBusqueda, '-', this.btnFiltar, '-', this.btnLimpiar);
        tBar.setVisible(true);
    },
    /**
     * Intercepta el evento load del store y muestra el mensaje si esta vacio
     * @param {type} e
     * @param {type} args
     * @returns {Boolean}
     */
    fireStoreEvent: function (e, args) {
        //        if (e == 'load') {
        //            if (this.store.getCount() == 0) {
        //                mostrarMensaje(1, LOG.util.Idioma.msgNoMostrarResultados);
        //            }
        //        }
        return true;
    },
    /**
     * Accion que se dispara cuando se ejecuta el boton limpiar
     * @returns {undefined}
     */
    onTriggerClear: function () {
        var _this = this.scope || this;
        _this.tfBusqueda.setValue(null);
        _this.tfBusqueda.blur();
        if (_this.grid.filters) {
            _this.grid.filters.clearFilters();
        }
        if (_this.btnLimpiar.disabled || _this.store.filtrado == false) {
            return;
        }
        //        _this.btnLimpiar.disable();
        //        _this.btnFiltar.disable();
        var params = {};
        Ext.apply(params, _this.store.limitParams);
        params.criterio = null;
        params.filtrado = null;
        params.start = 0;
        _this.store.filtrado = false;
        _this.store.reload({
            params: params
        });
        _this.tfBusqueda.focus(true, 100);
    },
    /**
     * Accion que se ejecuta en la accion buscar o la tecla caliente del componente
     * @returns {undefined}
     */
    onTriggerSearch: function () {
        var _this = this.scope || this;
        if (_this.btnFiltar.disabled) {
            return;
        }
        if (Ext.isEmpty(_this.tfBusqueda.getValue())) {
            if (_this.store.filtrado == true) {
                _this.onTriggerClear();
            }
            return;
        }
        if (_this.tfBusqueda.isValid()) {
            var params = {};
            _this.store.limitParams.limit = _this.grid.getBottomToolbar() ? _this.grid.getBottomToolbar().pageSize : 30;
            Ext.apply(params, _this.store.limitParams);
            _this.store.filtrado = true;
            _this.store.baseParams.criterio = _this.tfBusqueda.getValue();
            _this.store.baseParams.filtrado = 1;
            params.start = 0;
            _this.store.reload({
                params: params
            });
        }
        _this.tfBusqueda.focus(false, 100);
    }
});
/**
 *
 * @type @exp;Ext@call;extend
 */
LOG.util.ComboBox = Ext.extend(Ext.form.ComboBox, {
    /**
     * Store que cargara los datos que se mostraran en el combo
     * @type Ext.data.Store
     */
    store: undefined,
    /**
     * URL  de la cual se van a llenar los datos del combo
     */
    url: undefined,
    /**
     *
     */
    typeAhead: true,
    emptyText: 'Seleccione',
    /**
     *
     */
    tabular: true,
    /**
     *
     */
    forceSelection: false,
    /**
     *
     */
    triggerAction: 'all',
    /**
     *
     */
    mode: 'local',
    /**
     *
     *
     */
    autoLoad: true,
    /**
     *
     */
    autoSelect: false,
    /**
     * 
     */
    baseParams: {},
    /**
     * Constructor de la lase
     * @param {Object} config
     * @returns {void}
     */
    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        if (config.pageSize > 0) {
            this.minListWidth = 400;
        }
        LOG.util.ComboBox.superclass.constructor.call(this, config);
        this.addEvents({
            'valuechange': true
        });
    },
    setValue: Ext.form.ComboBox.prototype.setValue.createInterceptor(function (value) {
        if (this.isXType('combo', false))
            this.fireEvent('valuechange', value);
    }),
    /**
     *
     * @returns {void}
     */
    initComponent: function () {
        this.store = this.initStore();
        if (!this.tpl) {
            var desc = this.descField || this.displayField;
            this.tpl = '<tpl for="."><div ext:qtip="{' + desc + '}" class="x-combo-list-item">{' + this.displayField + '}</div></tpl>';
        }
        LOG.util.ComboBox.superclass.initComponent.call(this, arguments);
        var cb = this;
        /*if (cb.autoSelect) {
            cb.store.on({
                'load': function (st) {
                    if (st.getCount() > 0) {
                        cb.setValue(st.getAt(0).id);
                        cb.fireEvent('change', cb, st.getAt(0).id);
//                        cb.originalValue = st.getAt(0).id;
                    }
                }
            });
        }*/
        if (cb.pageSize) {
            cb.on('expand', function (cmb) {
                cmb.pageTb.cbPageSize.on('select', function (cmb, rd) {
                    cb.focus();
                    cb.fireEvent('expand', cb);
                });
            });
        }

    },
    /**
     * Inicializa el store del combo
     * @returns {Ext.data.Store}
     */
    initStore: function () {
        var storeFields = [
            { name: this.valueField },
            { name: this.displayField },
        ];
        if (typeof this.otherFields != 'undefined') {
            storeFields = storeFields.concat(this.otherFields);
        }

        return this.store || new Ext.data.Store({
            url: this.url,
            autoLoad: this.autoLoad,
            baseParams: this.baseParams,
            reader: new Ext.data.JsonReader({
                root: 'datos',
            }, storeFields)
        });
    },
    getStore: function () {
        return this.store;
    },
	getRecordSelected : function (){
		var value = this.getValue();
		return this.store.getById(value);
	}
});
/**
 *
 * @param {type} param1
 * @param {type} param2
 */
Ext.ComponentMgr.registerType('combologistica', LOG.util.ComboBox);
/**
 *
 * @type @exp;Ext@call;extend
 */
LOG.util.TreeCombo = Ext.extend(LOG.util.ComboBox, {
    autoLoad: false,
    selectOnlyLeaf: false,
    node: null,
    displayedText: '',
    constructor: function (config) {
        config.valueField = 'tag';
        config.displayField = 'html';
        config.lazyRender = false;
        config.autoCreate = true;
        config.mode = 'local';
        config.readOnly = false;
        config.triggerAction = 'all';
        config.editable = false;
        config.onSelect = Ext.emptyFn;
        LOG.util.TreeCombo.superclass.constructor.call(this, config);
        this.idSeleccionado = null;
        this.idtpl = this.getId() + '-div';
        this.tpl = '<tpl for="."><div id= ' + this.idtpl + ' ext:qtip="{' + this.displayField + '}" class="x-combo-list-item">{' + this.displayField + '}</div></tpl>';
        this.createTree();
        var _this = this;
        this.on({
            'blur': function () {
                if (_this.displayedText.length != 0) {
                    _this.setRawValue(_this.displayedText);
                }
            }
        })
    },
    initStore: function () {
        var store = new Ext.data.Store({
            reader: new Ext.data.ArrayReader({
                fields: ['tag', 'html']
            })
        });
        store.loadData([
            ['div', '']
        ]);
        return store;
    },
    createTree: function () {
        var _cb = this;
        this.rootNode = new Ext.tree.AsyncTreeNode({
            id: this.idNode || '0',
            text: this.textRootNode || 'Elementos',
            expanded: true,
            animate: false,
            draggable: false,
            iconCls: 'historial'
        });

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: this.url,
        });

        this.setBaseNode({ _node: _cb.node }, _cb._fn);

        this.tpDatos = new Ext.tree.TreePanel({
            useArrows: true,
            urlController: null,
            autoScroll: true,
            border: false,
            bodyBorder: false,
            region: 'center',
            height: 200,
            loader: this.loader,
            root: this.rootNode,
            listeners: {
                'click': function (nodo, e) {
                    if (nodo.id != 0) {
                        if (_cb.selectOnlyLeaf) {
                            if (nodo.leaf) {
                                _cb.selectNode(nodo);
                            } else {
                                nodo.expand();
                            }
                        } else {
                            _cb.selectNode(nodo);
                        }
                    }
                }
            },
            //            bbar: new Ext.Toolbar({
            //                layout: 'fit',
            //                items: [LOG.util.Prototipos.inputTexto({width: '100%'})]
            //            })
        });
        var _this = this;
        this.on({
            'expand': {
                fn: function (converted) {
                    _this.tpDatos.render(this.getId() + '-div');
                },
                single: true
            },
            'blur': function () {
                _this.collapse();
            }
        });
    },
    /**
     *
     * @returns {undefined} idSeleccionado
     */
    getValue: function () {
        return this.idSeleccionado;
    },
    selectNode: function (nodo) {
        this.node = nodo;
        var _this = this;
        nodo.select();
        _this.idSeleccionado = nodo.id;
        _this.fireEvent('select');
        if (typeof _this.selectFn == 'function') {
            _this.selectFn.createDelegate(_this, [nodo]).call();
        }
        _this.setValue(nodo.text);
        _this.setRawValue(nodo.text);
        _this.collapse();
        _this.blur();
    },
    /**
     * Aplica los parametros y recarga el treecombo.
     * @param {Object} params
     * @param {Function} _fn [Opcional]
     * @returns {undefined}
     */
    setBaseNode: function (params, _fn) {
        Ext.apply(this.loader.baseParams, params);
        if (this.autoLoad) {
            this.loader.load(this.rootNode, function (r) {
                if (typeof _fn == 'function') {
                    _fn.createDelegate(this, [r]).call();
                }
            });
        }
        this.autoLoad = true;
    },
    getNodeText: function () {
        return this.node.text;
    },
    /**
     * Restaura los valores por defecto.
     * @returns {undefined}
     */
    resetNode: function () {
        this.selectNode(this.tpDatos.getRootNode());
        this.idSeleccionado = null;
        this.node.text = null;
    },
    blur: function () {
        this.fireEvent('blur');
    },
    setRawValue: function (value) {
        LOG.util.TreeCombo.superclass.setRawValue.call(this, value);
        this.displayedText = value;
    }
});
Ext.ComponentMgr.registerType('treecombologistica', LOG.util.TreeCombo);
/**
 * Clase para el facil manejo de las IU, contiene metodos para crea los componentes
 * mas usados en las vistas
 */
LOG.util.UIManager = {
    /**
     * Crea un grid editable
     * @param {type} cm
     * @param {type} store
     * @param {type} sm
     * @returns {Ext.grid.EditorGridPanel}
     */
    initEditableGridPanel: function (cm, store, sm, cfg) {
        cfg = cfg || {};
        cfg.roweditor = typeof cfg.roweditor !== 'undefined' ? cfg.roweditor : true;
        var grid = new Ext.grid.EditorGridPanel(this.configureGrid(cm, store, sm, cfg, this.countColunmEditable(cm)));
        LOG.util.UIManager.configGridSearch(grid);
        return grid;
    },
    /**
     * Metodo para configurar un grid
     * @param {type} cm
     * @param {type} store
     * @param {type} sm
     * @returns {LOG.util.UIManager.configureGrid.Anonym$0}
     */
    configureGrid: function (cm, store, sm, cfg, cantcmedit) {
        var plugins = [], cfg = cfg || {};
        if (cfg && cfg._plugins) {
            plugins = cfg._plugins;
        }
        if (cfg.expanded) {
            cfg.autoExpandColumn = 'idExpandGrid';
        }
        //        if (cantcmedit && cfg.roweditor == true) {
        //            plugins.push(new Ext.ux.grid.RowEditor({
        //            }));
        //        }

        if (cfg.nobbar == false) {
            cfg.bbar = new Ext.PagingToolbar({
                pageSize: 30,
                store: store,
                displayInfo: true
            });
        }
        return Ext.apply({
            region: 'center',
            //border: true,
            plugins: plugins,
            loadMask: {
                store: store
            },
            stripeRows: true,
            store: store,
            sm: sm,
            cm: cm,
            tbar: this.initToolbar({})
        }, cfg || {});
    },
    /**
     * Crea un gridpanel
     * @param {type} cm
     * @param {type} store
     * @param {type} sm
     * @returns {Ext.grid.GridPanel}
     */
    initGrid: function (cm, store, sm, cfg) {
        var grid = new Ext.grid.GridPanel(this.configureGrid(cm, store, sm, cfg));
        grid.getTopToolbar().setPanel(grid);
        grid.getTopToolbar().init();
        LOG.util.UIManager.configGridSearch(grid);
        return grid;
    },
    /**
     * Inicializa un viewport
     * @param {type} items
     * @returns {undefined}
     */
    initViewport: function (items) {
        return new LOG.util.Viewport({
            layout: 'border',
            items: items
        });
    },
    /**
     * Crea un nuevo panel al que se le puede realizar el foco para las teclas
     * calientes
     * @param {type} config
     * @returns {Ext.Panel}
     */
    initFocusPanel: function (config) {
        return new LOG.util.Panel(config);
    },
    /**
     * Crea un nuevo panel
     * @param {type} config
     * @returns {Ext.Panel}
     */
    initPanel: function (config) {
        config.border = config.border || false;
        return new Ext.Panel(config);
    },
    /**
     *
     * @param {type} config
     * {
     *    pContainer: panel,
     *    grid : grid,
     *    columnas : 3
     * }
     * @returns {LOG.util.PanelBusqueda}
     */
    initPanelBusqueda: function (config) {
        config.border = true;
        return new LOG.util.PanelBusqueda(config);
    },
    /**
     * Crea un formulario
     * @param {type} config
     * @returns {Ext.form.FormPanel}
     */
    initForm: function (config) {
        return new Ext.form.FormPanel(config);
    },
    /**
     * Inicializa un formulario en forma de columnas
     * @param {Object} config Configuracion del formulario
     * @returns {LOG.util.ColumnForm}
     */
    initColumnForm: function (config) {
        return new LOG.util.ColumnForm(config);
    },
    /**
     * Shortcut a Ext.apply
     * @param {type} o
     * @param {type} cfg
     * @returns {Object}
     */
    apply: function (o, cfg) {
        o = o || {};
        Ext.apply(o, cfg || {});
        return o;
    },
    /**
     * Funcion para reconfigurar el handler de un boton y que no se ejecute si este
     * esta inactivo o invisible
     * @param {type} button
     * @returns {Ext.Button}
     */
    reconfigureButton: function (button) {
        if (button != undefined && button.handler && !button.isRenconfigured) {
            button.isRenconfigured = true;
            button.fn = button.handler;
            button.handler = function (b) {
                if (b.isVisible() && !b.disabled && !Ext.MessageBox.isVisible() && !LOG.util.disableDEL) {
                    b.fn.createDelegate(b).call();
                }
            };
        }
        return button;
    },
    reconfigureButtons: function (btns) {
        var _this = this;
        Ext.each(btns, function (b) {
            _this.reconfigureButton(b);
        });
    },
    /**
     * Funcion para aplicar la tecla caliente a un boton en su contenedor
     * @param {type} button
     * @param {type} keyContainer
     * @returns {undefined}
     */
    applyKey: function (button, keyContainer) {
        if (button && button.key && keyContainer && button.handler && !button.setKey) {
            if (!keyContainer.keyMap) {
                keyContainer.getKeyMap();
            }
            button.key.stopEvent = true;
            button.key.scope = button;
            button.key.fn = function (b, e) {
                e.stopPropagation();
                e.preventDefault();
                this.handler.call(this.scope || this, button);
            };
            if (!button.underline && button.getText()) {
                var newText = this.ireplaceStyle(button.getText(), button.key.key, 'span', 'text-decoration: underline;');
                button.setText(newText);
                button.underline = true;
            }
            if (!button.toolKey && button.tooltip) {
                var keyTip = '', countKey = 0;
                if (button.key.ctrl) {
                    keyTip += 'Ctrl';
                    countKey++;
                }
                if (button.key.alt) {
                    keyTip += countKey == 0 ? 'Alt' : '+Alt';
                    countKey++;
                }
                if (button.key.shift) {
                    keyTip += countKey == 0 ? 'Shift' : '+Shift';
                    countKey++;
                }
                if (button.key.key) {
                    var key = button.key.key;
                    if (key == Ext.EventObject.DELETE) {
                        key = 'DEL';
                    }
                    if (key == 13) {
                        key = 'Enter';
                    }
                    keyTip += (countKey == 0 ? key : '+' + key);
                    countKey++;
                }
                if (button.setTooltip) {
                    button.setTooltip(button.tooltip + ' <b>(' + keyTip + ')</b>');
                }
            }
            button.setKey = true;
            keyContainer.keyMap.addBinding(button.key);
        }
    },
    /**
     * Funcion para reemplazar una parte del texto de una cadena por un tag html
     * @param {type} cadena
     * @param {type} remp
     * @param {type} tag
     * @param {type} sty
     * @returns {String}
     */
    ireplaceStyle: function (cadena, remp, tag, sty) {
        if (!cadena || !cadena.toLowerCase) {
            cadena = '';
        }
        if (typeof (remp) != 'string')
            return cadena;
        if (!sty)
            sty = '';
        var valueLower = cadena.toLowerCase();
        var valueSearchLower = remp.toLowerCase();
        var indexOf = valueLower.indexOf(valueSearchLower);
        if (indexOf >= 0) {
            var substr = cadena.substr(indexOf, valueSearchLower.length);
            return cadena.replace(substr, '<' + tag + ' style="' + sty + '">' + substr + '</' + tag + '>');
        }
        return cadena;
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.Button}
     */
    createBtn: function (config) {
        config.tabular = true;
        return this.reconfigureButton(new Ext.Button(config));
    },
    /***/
    createMenuItem: function (config) {
        config.tabular = true;
        return this.reconfigureButton(new Ext.menu.Item(config));
    },
    /**
     * Inicializa una ventana con los botones predefinidos
     * @param {type} config
     * @returns {Ext.Window}
     */
    initWindow: function (config) {
        return new LOG.util.Window(config);
    },
    /***
     * Devuelve un selection Model para un gridPanle
     * @param {type} mode (1 - Sigle select) (2 - Multiselect sin checkbox) (3 - Multiselect con checkbox)
     * @returns {Ext.grid.RowSelectionModel}
     */
    initSelectionModel: function (mode, singleSelect) {
        if (mode == 3) {
            return new Ext.grid.CheckboxSelectionModel({
                singleSelect: singleSelect || false/*,
                 moveEditorOnEnter : false*/
            });
        }
        return new Ext.grid.RowSelectionModel({
            singleSelect: mode == 2 ? false : true/*,
             moveEditorOnEnter : false*/
        });
    },
    /**
     * Annade la vista de busqueda basica a un gridpanel
     * @param {type} grid
     * @returns {undefined}
     */
    initFilterGrid: function (grid, txtCriterio, concepto) {
        return new LOG.util.GridFilter({
            grid: grid,
            searchTipText: txtCriterio || LOG.util.Idioma.lbCriterioBuscar,
            concepto: concepto
        });
    },
    /**
     *
     * @param {Object} config
     * @param {Ext.Panel} panel
     * @returns {LOG.util.Toolbar}
     */
    initToolbar: function (config) {
        return new LOG.util.Toolbar(config);
    },
    /**
     *
     * @param {type} cols
     * @returns {LOG.util.UIManager.proccessColumns.Anonym$13}
     */
    proccessColumns: function (cols, sm) {
        var columns = [new Ext.grid.RowNumberer({
            width: 30,
            header: 'N.\xb0'
        })];
        if (null != sm) {
            columns[columns.length] = sm;
        }
        var fields = [], groupField = false, expanded = false, lock = false, filters = [];
        cols.each(function (col) {
            if (col.header != undefined) {
                LOG.util.UIManager.apply(col, {
                    hideable: ((col.default == true) ? false : true)
                });
                if (col.autoExpand && !expanded) {
                    expanded = true;
                    col.id = 'idExpandGrid'
                }
                columns[columns.length] = col;
                if (col.agrupador && !groupField) {
                    groupField = col.dataIndex;
                }
                if (col.locked) {
                    lock = true;
                    columns[0].locked = true;
                }

                if (col.filter) {
                    filters.push(col.filter);
                }

                if (col.isFiltroBusqueda && !col.renderer) {
                    col.renderer = function (value, metadata, rec, index, colIndex, store) {
                        return LOG.util.UIManager.ireplaceStyle(value, store.baseParams.criterio, 'span', 'background-color: yellow')
                    }
                }
            }

            fields[fields.length] = {
                name: col.dataIndex,
                type: col.type || 'string'
            };
        }, this);
        return {
            columns: columns,
            fields: fields,
            groupField: groupField,
            expanded: expanded,
            bloquear: lock,
            filtros: filters
        };
    },
    /***
     *
     * @param {type} grid
     * @param {type} list
     * @returns {undefined}
     */
    initGridContexMenu: function (grid, listaMenu) {
        if (listaMenu.count()) {
            grid.on({
                'rowcontextmenu': function (grid, index, event) {
                    event.stopEvent();
                    var record = grid.getStore().getAt(index);
                    grid.getSelectionModel().selectRecords([record]);
                    if (undefined == grid.contextMenu) {
                        grid.contextMenu = new Ext.menu.Menu({
                            items: listaMenu.getArray()
                        });
                    }
                    grid.contextMenu.showAt(event.xy);
                }
            });
        }
    },
    /**
     *
     * @param {type} grid
     * @returns {undefined}
     */
    configGridSearch: function (grid) {
        grid.getStore().filtrado = false;
        grid.getStore().initBaseParams = {};
        grid.getStore().limitParams = {};
        grid.getStore().fireEvent = grid.getStore().fireEvent.createSequence(function (e, store, options) {
            switch (e) {
                case 'load':
                    if (grid.isVisible()) {
                        if (grid.getStore().getTotalCount() == 0 && grid.showMsgCargar !== false) {
                            grid.getSelectionModel().clearSelections();
                            if (grid.getStore().filtrado) {
                                mostrarMensaje(1, LOG.util.Idioma.msgNoResultados);
                            }
                            /*else {
                             mostrarMensaje(1, LOG.util.Idioma.msgNoMostrarResultados);
                             }*/
                        }
                    }
                    break;
                case 'beforeload':
                    store.limitParams.start = (typeof options.params !== 'undefined' ? options.params.start : 0);
                    store.limitParams.limit = (typeof options.params !== 'undefined' ? options.params.limit : 0);
                    if (!store.filtrado) {
                        store.baseParams = {};
                    }
                    Ext.apply(store.baseParams, store.initBaseParams);
                    break;
            }
        });

        //        grid.getStore().on({
        //            'load': function() {
        //                if (grid.getStore().getTotalCount() == 0 && grid.showMsgCargar !== false) {
        //                    grid.getSelectionModel().clearSelections();
        //                    if (grid.getStore().filtrado) {
        //                        mostrarMensaje(1, LOG.util.Idioma.msgNoResultados);
        //                    } else {
        //                        mostrarMensaje(1, LOG.util.Idioma.msgNoMostrarResultados);
        //                    }
        //                }
        //            },
        //            'beforeload': function(store, options) {
        //                grid.getStore().limitParams.start = options.params.start;
        //                grid.getStore().limitParams.limit = options.params.limit;
        //                if (!grid.getStore().filtrado) {
        //                    grid.getStore().baseParams = {};
        //                    Ext.apply(grid.getStore().baseParams, grid.getStore().initBaseParams);
        //                }
        //            }
        //        });
    },
    /**
     *
     */
    initTreePanelContextMenu: function (tree, listaMenu) {
        if (listaMenu.count()) {
            tree.on({
                'contextmenu': function (node, event) {
                    node.select();
                    if (undefined == tree.contextMenu) {
                        tree.contextMenu = new Ext.menu.Menu({
                            items: listaMenu.getArray()
                        });
                    }
                    tree.contextMenu.showAt(event.xy);
                }
            });
        }
    },
    /**
     *
     */
    decodeAjaxResponse: function (resp) {
        return resp.responseText ? Ext.decode(resp.responseText) : {};
    },
    /**
     *
     * @param {type} colun
     * @returns {Boolean}
     */
    countColunmEditable: function (colun) {
        var cont = 0;

        for (var i = 0, len = colun.getColumnCount(); i < len; i++) {
            var c = colun.getColumnAt(i);

            if (c && c.id != 'checker') {
                var ed = c.getEditor();

                if (ed) {
                    cont++;
                }
            }
        }

        return (cont > 3) ? true : false;
    },
    /**
     *
     */
    isRecordValue: function (rec, field, value) {
        var recValue = rec.json[field] || null;
        return value == recValue;
    },
    /**
     *
     * @param {type} from
     * @param {type} to
     * @returns {undefined}
     */
    copyTo: function (from, to) {
        for (var prop in from) {
            if (typeof prop == 'Object' || typeof prop == 'Array') {
                this.copy(to[prop], from[prop]);
            } else {
                to[prop] = from[prop];
            }
        }
    },
    /**
     *
     * @param {Object} objeto
     * @param {String} sourceFn
     * @param {function} newFn
     * @param {String} idControl
     * @returns {undefined}
     * EJ this.aaa = function () { 
     *     console.debug('In aaaaa');     
     * };
     * console.debug(this);
     * LOG.util.UIManager.encadenaFn(this, 'aaa', function(){
     *     console.debug('In bbbb'); 
     * });
     * this.aaa();
     */
    encadenaFn: function (objeto, sourceFn, newFn, idControl) {
        if (objeto) {
            /*if (idControl) {
             if (objeto[idControl] == true) {
             return;
             }
             objeto[idControl] = true;
             }*/
            if (typeof objeto[sourceFn] != 'function') {
                objeto[sourceFn] = function () {
                };
            }
            objeto[sourceFn] = objeto[sourceFn].createSequence(newFn);
        }
    },
    /**
     *
     * @param {type} imagen
     * @param {type} dirImg
     * @returns {String}
     */
    getIcon: function (imagen, dirImg) {
        dirImg = dirImg || '/lib/ExtJS/temas/' + temaMT + '/images/iconos/';
        return dirImg + imagen + '.png';
    },
    /**
     *
     * @param {type} string
     * @returns {String}
     * @param {type} string
     * @returns {String}
     */
    currencyFormat: function (string) {
        var datos = string.toString().split('.');
        var entero = datos[0];
        var decimales = datos[1] || '1';
        if (decimales.length == 1) {
            decimales += '0';
        }
        var result = '';
        while (entero.length > 3) {
            result = entero.substring(entero.length - 3, entero.length) + result;
            result = ',' + result;
            entero = entero.substr(0, entero.length - 3);
        }
        return entero + '' + result + '.' + decimales;
    },
    /**
     *
     */
    hideMessageBox: function () {
        Ext.MessageBox.hide();
    },
    /**
     *
     * @param c
     * @returns {*}
     */
    isTabulable: function (c) {
        return c.isXType('button')
            || c.isXType('textfied')
            || c.isXType('numberfield')
            || c.isXType('combo')
            || c.isXType('datefield')
            || c.isXType('editor')
            || c.isXType('menu')
            || c.isXType('checkbox')
            || c.isXType('radio')
            || c.isXType('trigger')
            ;
    }
};

LOG.util.LovCombo = Ext.extend(Ext.form.LovCombo, {
    /**
     * Store que cargara los datos que se mostraran en el combo
     * @type Ext.data.Store
     */
    store: undefined,
    /**
     * URL  de la cual se van a llenar los datos del combo
     */
    /**
     *
     */
    tabular: true,
    /**
     *
     */
    width: 350,
    /**
     *
     */
    url: undefined,
    /**
     *
     */
    typeAhead: true,
    /**
     *
     */
    forceSelection: true,
    /**
     *
     */
    triggerAction: 'all',
    /**
     *
     */
    mode: 'local',
    /**
     *
     *
     */
    autoLoad: true,
    /**
     */
    hideOnSelect: false,
    /**
     *
     * @returns {void}
     */
    initComponent: function () {
        this.store = this.initStore();
        LOG.util.LovCombo.superclass.initComponent.call(this, arguments);
    },
    /**
     * Inicializa el store del combo
     * @returns {Ext.data.Store}
     */
    initStore: function () {
        return this.store || new Ext.data.Store({
            url: this.url,
            autoLoad: this.autoLoad,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: this.valueField,
            }, [
                { name: this.valueField },
                { name: this.displayField },
            ])
        });
    },
    beforeBlur: Ext.emptyFn
});

LOG.util.LovComboNomenclador = Ext.extend(LOG.util.LovCombo, {
    controller: '',
    modelo: '',
    idnom: '',
    name: '',
    bussines: '',
    campoValor: 'denominacion',
    autoLoad: true,
    entidad: true,
    initStore: function () {
        var _this = this;
        Ext.apply(this, {
            displayField: _this.campoValor,
            valueField: _this.idnom,
            hiddenName: _this.idnom,
            /*typeAhead: true,
             mode: 'local',
             triggerAction: 'all',
             editable: true*/
        });
        return new Ext.data.Store({
            url: _this.controller + (_this.entidad == true ? ' ' : 'cargarnomenclador'),
            autoLoad: _this.autoLoad || true,
            baseParams: {
                modelo: _this.modelo,
                idnom: _this.idnom,
                bussines: _this.bussines
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            },
                [
                    { name: _this.idnom },
                    { name: _this.campoValor }
                ])
        });
    }
});

LOG.util.YearField = Ext.extend(Ext.form.ComboBox, {
    /**
     * @cfg {String} minValue
     * The error text to display when the time is after maxValue (defaults to
     * 'The time in this field must be equal to or before {0}').
     */

    minValue: undefined,
    /**
     * @cfg {String} maxValue
     * The error text to display when the time is after maxValue (defaults to
     * 'The time in this field must be equal to or before {0}').
     */

    maxValue: undefined,
    /**
     * @cfg {String} increment
     * The error text to display when the time is after maxValue (defaults to
     * 'The time in this field must be equal to or before {0}').
     */
    tabular: true,
    /**
     *
     */
    increment: 1,
    /**
     * @cfg {String} maxText
     * The error text to display when the time is after maxValue (defaults to
     * 'The time in this field must be equal to or before {0}').
     */

    minText: "The time in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * The error text to display when the time is after maxValue (defaults to
     * 'The time in this field must be equal to or before {0}').
     */
    maxText: "The time in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * The error text to display when the time in the field is invalid (defaults to
     * '{value} is not a valid year').
     */
    invalidText: "{0} Is not a valid year",
    //
    typeAhead: true,
    /**
     *
     */
    forceSelection: true,
    /**
     *
     */
    triggerAction: 'all',
    /**
     *
     */
    mode: 'local',
    /**
     *
     *
     */
    autoLoad: true,
    //private
    initDate: '1/1/1959',
    //private
    totalYears: 20,
    // private
    initComponent: function () {
        if (Ext.isDefined(this.minValue)) {
            this.setMinValue(this.minValue, true);
        }
        if (Ext.isDefined(this.maxValue)) {
            this.setMaxValue(this.maxValue, true);
        }
        if (!this.store) {
            this.generateStore(true);
        }
        LOG.util.YearField.superclass.initComponent.call(this);
    },
    generateStore: function (initial) {
        var min = this.minValue || new Date(this.initDate).getFullYear(),
            max = this.maxValue || new Date(this.initDate).getFullYear() + this.totalYears,
            times = [];

        while (min <= max) {
            times.push(min);
            min = min + this.increment;
        }
        this.bindStore(times, initial);
    },
    /**
     * Replaces any existing {@link #minValue} with the new time and refreshes the store.
     * @param {Date/String} value The minimum time that can be selected
     */
    setMinValue: function (value, /* private */initial) {
        //this.setLimit(value, true, initial);
        this.minValue = value;
        return this;
    },
    /**
     * Replaces any existing {@link #maxValue} with the new time and refreshes the store.
     * @param {Date/String} value The maximum time that can be selected
     */
    setMaxValue: function (value, /* private */initial) {
        //this.setLimit(value, false, initial);
        this.maxValue = value;
        return this;
    }, // inherited docs
    getValue: function () {
        return LOG.util.YearField.superclass.getValue.call(this) || '';
        //return this.formatDate(this.parseDate(v)) || '';
    },
    // inherited docs
    setValue: function (value) {
        return LOG.util.YearField.superclass.setValue.call(this, value);
    },
    validateValue: function (value) {
        if (this.allowBlank == false && !value) {
            this.markInvalid(this.blankText);
            return false;
        }
        if (value) {
            var error = this.getErrors(value)[0];
            if (error == undefined) {
                error = Date.parse(value, 'Y');
                if (!error) {
                    this.markInvalid();
                }
                return error;
            } else {
                this.markInvalid(error);
                return false;
            }
        }
        return true;
    }

});
Ext.reg('yearfield', LOG.util.YearField);

/**
 * Toolbar para los  los grid que se peude adicionar vacio y no se muestra
 * @type @exp;Ext@call;extend
 */
LOG.util.Toolbar = Ext.extend(Ext.Toolbar, {
    init: function () {
        this.panel.onRender = this.panel.onRender.createSequence(this.onRenderHandler, this);
    },
    onRenderHandler: function () {
        if (this.items.length == 0) {
            this.setVisible(false);
        }

    },
    setPanel: function (p) {
        this.panel = p;
    }
});
/**
 * Clase que brinda prototipos predefinidos para las IU
 * @type type
 */
LOG.util.Prototipos = {
    /**
     * Crea un prototipo de boton de adicionar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAdicionar: function (config, menu) {
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'I'
            },
            iconCls: config.iconCls || 'adicionar',
            text: config.text || LOG.util.Idioma.lbBtnAdicionar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnAdicionar
        });
        return menu == true ? LOG.util.UIManager.createMenuItem(config) : LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton eliminar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonEliminar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                key: Ext.EventObject.DELETE,
                shift: true,
                alt: false,
                ctrl: false,
            },
            iconCls: 'eliminar',
            text: config.text || LOG.util.Idioma.lbBtnEliminar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnEliminar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton firmar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonFirmar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                key: Ext.EventObject.F,
                shift: true,
                alt: false,
                ctrl: false,
            },
            iconCls: 'icondistra-firmaautorizada',
            text: config.text || LOG.util.Idioma.lbBtnFirmar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnFirmar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.Button|String|LOG.util.UIManager.reconfigureButton.button}
     */
    botonAbrir: function (config) {
        config = config || {};
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'A'
            },
            iconCls: config.iconCls || 'abrir',
            text: config.text || LOG.util.Idioma.lbBtnAbrir
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton ver detalles
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonVer: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'D'
            },
            iconCls: config.iconCls || 'ver',
            text: config.text || LOG.util.Idioma.lbBtnVer
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton aceptar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAceptar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                key: 13
            },
            iconCls: 'aceptar',
            text: config.text || LOG.util.Idioma.lbBtnAceptar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnAceptar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton buscar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonBuscar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                key: 'B',
                alt: true,
                ctrl: false,
                shift: false,
            },
            iconCls: 'buscar',
            text: config.text || LOG.util.Idioma.lbBtnBuscar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnBuscar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo para el boton de busqueda avanzada
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAvanzada: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                key: 'V',
                alt: true,
                ctrl: false,
                shift: false,
            },
            iconCls: 'buscaravanzada',
            text: config.text || LOG.util.Idioma.lbBtnBuscarAvz,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnBuscarAvz
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton  cancelar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonCancelar: function (config, cerrar) {
        LOG.util.UIManager.apply(config, {
            key: config.key || {
                key: 'X',
                ctrl: cerrar || false,
                alt: true
            },
            iconCls: (cerrar) ? 'cerrar' : 'cancelar',
            text: config.text || (cerrar) ? LOG.util.Idioma.lbBtnCerrar : LOG.util.Idioma.lbBtnCancelar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnCancelar,
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton aplicar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAplicar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                key: 'P',
                alt: true,
                ctrl: true,
                shift: false,
            },
            iconCls: 'aplicar',
            text: config.text || LOG.util.Idioma.lbBtnAplicar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnAplicar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton anular estado
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAnularEstado: function (config) {
        LOG.util.UIManager.apply(config, {
            iconCls: 'cancelarestado',
            text: config.text || LOG.util.Idioma.lbBtnAnular
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.Button|String|LOG.util.UIManager.reconfigureButton.button|nodd.attributes.idconcepto|nodd.attributes.idconceptos}
     */
    botonGuardar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                /*alt: true,
                ctrl: false,
                shift: false,
                key: 'G'*/
                key: 13
            },
            iconCls: 'guardar',
            text: config.text || LOG.util.Idioma.lbBtnGuardar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     *
     */
    botonContabilizar: function (config) {
        LOG.util.UIManager.apply(config, {
            iconCls: 'contabilidad',
            text: config.text || LOG.util.Idioma.lbBtnContabilizar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton imprimir
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonImprimir: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'P'
            },
            iconCls: config.iconCls || 'imprimir',
            text: config.text || LOG.util.Idioma.lbBtnImprimir,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnImprimir
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton ayuda
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAyuda: function (config) {
        LOG.util.UIManager.apply(config, {
            /* key: {
             alt: true,
             key: 'h'
             },*/
            iconCls: 'ayuda',
            text: config.text || LOG.util.Idioma.lbBtnAyuda,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnAyuda,
            /* handler: function() {
             if (help != undefined && help != null) {
             help.show(config.title, config.referencia);
             }
             }*/
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton confirmar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonConfirmar: function (config) {
        LOG.util.UIManager.apply(config, {
            //            key: {
            //                alt: true,
            //                key: 'u'
            //            },
            iconCls: 'confirmar',
            text: config.text || LOG.util.Idioma.lbBtnConfirmar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton confirmar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonNuevo: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'N'
            },
            iconCls: config.iconCls || 'nuevo',
            text: config.text || LOG.util.Idioma.lbBtnNuevo
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.Button|String|LOG.util.UIManager.reconfigureButton.button}
     */
    botonGeneral: function (config) {
        LOG.util.UIManager.apply(config, {
            iconCls: config.iconCls || 'nuevo',
            text: config.text || LOG.util.Idioma.lbBtnNuevo
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton aprobar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonAprobar: function (config, menu) {
        LOG.util.UIManager.apply(config, {
            //            key: {
            //                alt: true,
            //                key: 'u'
            //            },
            iconCls: 'aprobar',
            text: config.text || LOG.util.Idioma.lbBtnAprobar
        });
        return menu == true ? LOG.util.UIManager.createMenuItem(config) : LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton dupluicar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonDuplicar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                ctrl: true,
                alt: true,
                shift: false,
                key: 'D'
            },
            iconCls: 'duplicar',
            text: config.text || LOG.util.Idioma.lbBtnDuplicar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton limpiar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonLimpiar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'L'
            },
            iconCls: 'limpiar',
            text: config.text || LOG.util.Idioma.lbBtnLimpiar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnLimpiar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Crea un prototipo de boton limpiar
     * @param {type} config
     * @returns {Ext.Button}
     */
    botonBarCode: function (config) {
        LOG.util.UIManager.apply(config, {
            //            key: {
            //                alt: true,
            //                key: 'l'
            //            },
            iconCls: 'barcode-reader',
            text: config.text || 'Barcode',
            tooltip: config.tooltip || 'Barcode reader'
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.Button|LOG.util.UIManager.reconfigureButton.button|type}
     */
    botonModificar: function (config) {
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'M'
            },
            iconCls: 'modificar',
            text: config.text || LOG.util.Idioma.lbBtnModificar,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnModificar
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.Button|String|LOG.util.UIManager.reconfigureButton.button}
     */
    botonExportar: function (config) {
        config = config || {};
        LOG.util.UIManager.apply(config, {
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'E'
            },
            iconCls: 'exportar',
            text: config.text || LOG.util.Idioma.lbBtnExcel,
            tooltip: config.tooltip || LOG.util.Idioma.ttBtnExcel,
            handler: function () {
                var _this = this;
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                Ext.Ajax.request({
                    url: _this.url,
                    method: 'POST',
                    params: _this.objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(resp.dirFichero, 'ventana', wCfg);
                    }.createDelegate(_this)
                });
            }
        });
        return LOG.util.UIManager.createBtn(config);
    },
    /**
     * Campo de entrada de precio
     * @param {type} config
     * @returns {Ext.form.NumberField}
     */
    inputDecimal: function (config) {
        config = config || {};
        LOG.util.UIManager.apply(config, {
            allowDecimals: true,
            tabular: true,
            decimalPrecision: config.decimalPrecision || 6,
            maxLength: config.maxLength || 17,
            allowNegative: false,
            selectOnFocus: true,
            // emptyText: '0.0',
            regex: config.regex || LOG.util.Regex.precio,
            regexText: config.regexText || LOG.util.Idioma.ttregexTextprecio
            , nanText: config.nanText || LOG.util.Idioma.ttnanTextDecimal,
            anchor: config.anchor || '98%'
        });
        return new Ext.form.NumberField(config);
    },
    /**
     * Campo de entrada para los valores enteros
     * @param {type} config
     * @returns {Ext.form.NumberField}
     */
    inputEntero: function (config) {
        config = config || {};
        LOG.util.UIManager.apply(config, {
            allowDecimals: false,
            tabular: true,
            allowNegative: false,
            selectOnFocus: true,
            // emptyText: config.empty ? '0' : '',
            maxLength: config.maxLength || 10,
            nanText: LOG.util.Idioma.ttnanTextEntero,
            anchor: config.anchor || '98%'
        });
        return new Ext.form.NumberField(config);
    },
    /**
     *
     * @param {type} config
     * @returns {Ext.form.TextField}
     */
    inputTexto: function (config) {
        config = config || {};
        LOG.util.UIManager.apply(config, {
            anchor: config.anchor || '98%',
            tabular: true,
            maxLength: config.maxLength || 255
        });

        return new Ext.form.TextField(config);
    },
    createColumn: function (config, format) {
        config.renderFn = config.renderer || function (v) {
            return v;
        };
        config.renderer = function (v, m, r) {
            var value = config.renderFn.createDelegate(config, [v, m, r]).call();
            value = Ext.util.Format.number(value, format);
            var length = value.length - 1;
            var flag = false;
            var pos = value.indexOf('.');
            while (value[length] == '0' && length > (pos + 3)) {
                length--;
                flag = true;
            }
            if (flag) {
                var inc = value[length] == '0' ? 0 : 1;
                return value.substring(0, length + inc);
            }
            return value;
        };
        return config;
    },
    columnaCantidad: function (config) {
        return this.createColumn(config, '0,000.000000');
    },
    columnaPrecio: function (config) {
        return this.createColumn(config, '0,000.000000');
    },
    columnaImporte: function (config) {
        return this.createColumn(config, '0,000.00');
    },
    columnaCantidadEntera: function (config) {
        return this.createColumn(config, '0,000');
    }

};
/**
 * Clase que brinda prototipos para las expresiones regulares que mas se emplean
 * @type type
 */

LOG.util.Regex = {
    porciento: /^([0-9-_/]+ ?[0-9-_/]*)+$/,
    codigo: /^([0-9-_/.]+ ?[0-9-_/.]*)+$/,
    general: /^([\W]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+[\W]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]*[\W]*)+$/,
    cadena: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)([-_/.\s]?[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9])*$/,
    email: /^(\w+@[a-zA-Z_]+\.[a-zA-Z]{2,6})/,
    matricula: /^([A-Z]{1}[0-9-_/]{6})$/,
    matriculaAll: /^([A-Z]{1}[0-9-_/]{5,6})|([A-Z]{3}[0-9-_/]{3})$/,
    digito: /^\d*$/,
    carnet: /^(([0-9]{6})|([0-9]{11})|([0-9]{5}))$/,
    carnetypasaporte: /^(([0-9]{6})|([0-9]{11})|([0-9]{5})|([a-zA-Z0-9]{7,10}))$/,
    alfanumerico: /^[\w\s\-\/ñÑ/áéíóú]+$/,
    nombre: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+)([-\s]?[a-zA-ZÁÉÍÓÚáéíóúñüÑ])*$/,
    precio: /^[\d]{1,10}(\.[\d]{1,6}){0,1}$/,
    importe: /^[\d]{1,10}(\.[\d]{1,2}){0,1}$/,
    correo: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(( [a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
};

LOG.util.Subsistemas = {
    inventario: 10,
    facturacion: 13,
    activosfijos: 11,
    distribucion: 107,
    talleres: 113

};
/**
 *
 * @type type
 */
LOG.util.DataTypes = {
    TYPE_INT: 1,
    TYPE_FLOAT: 2,
    TYPE_BOOLEAN: 3,
    TYPE_STRING: 4,
    TYPE_DATE: 5,
    TYPE_ID: 6,
    defaultValue: function (type) {
        switch (type) {
            case this.TYPE_INT:
                return 0;
            case this.TYPE_FLOAT:
                return 0.0;
            case this.TYPE_BOOLEAN:
                return true;
            case this.TYPE_STRING:
                return '';
            default:
                return null;
        }
    }
};

LOG.util.isVariableGlobalActiva = function (nombre) {
    if (window[nombre]) {
        return true;
    } else {
        return false;
    }
};

LOG.util.WindowMgr = LOG.util.WindowManager();
Ext.Msg.postCloseFn = function () {
    LOG.util.WindowMgr.activate();
};

LOG.util.SelectorTF = Ext.extend(Ext.form.ComboBox, {
    url: '',
    controller: '',
    columns: [],
    title: 'Datos',
    width: 90,
    valueField: undefined,
    displayField: undefined,
    data: {},
    constructor: function (config) {
        var _this = this;
        this.editable = false;
        this._ventanaDatos = new LOG.util.UITemplate({
            modoSeleccion: 1,
            dirController: config.controller,
            formaVisualizacion: 'ventana',
            busquedaBasica: true,
            autoShow: false,
            panelBotonesVisible: false,
            urlBusquedaGridPrincipal: config.url,
            viewConfig: {
                buttons: [
                    LOG.util.Prototipos.botonAceptar({
                       disabled:true,
                        handler: function () {
                            var record = _this._ventanaDatos.getSmPrincipal().getSelected();
                            var _oldValue = _this.getValue();
                            var _newValue = record.data[_this.valueField];
                            if (_oldValue != _newValue) {
                                _this.setValue(record.data[_this.valueField]);
                                _this.setRawValue(record.data[_this.displayField]);
                                _this.data = record.data;
                                _this.fireEvent('select',_this,record,{});
                                _this.fireEvent('change', _this, _newValue, _oldValue);
                                _this.fireEvent('valuechange', _newValue);
                            }
                            _this.winData.close();
                        }
                    })
                ],
                title: config.title
            }
        });
        this._ventanaDatos.addGridColumn({
            dataIndex: config.valueField
        });
        Ext.each(config.columns, function (col) {
            _this._ventanaDatos.addGridColumn({
                header: col.header,
                dataIndex: col.dataIndex,
                width: col.width,
                autoExpand: col.autoExpand
            })
        });
        this._ventanaDatos.init();
        this.winData = this._ventanaDatos.view({
            width: 650,
            height: 420,
            resizable: false,
        });
        this.store = new Ext.data.SimpleStore({});
        this.store.on({
            beforeload: function () {
                return false;
            }
        });
        LOG.util.SelectorTF.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        var _this = this;
        LOG.util.SelectorTF.superclass.initComponent.call(this);
        this._ventanaDatos.getGridPrincipal().on({
            'rowdblclick': function (gp, rindex) {
                var record = _this._ventanaDatos.getStorePrincipal().getAt(rindex);
                var _oldValue = _this.getValue();
                var _newValue = record.data[_this.valueField];
                if(_this._ventanaDatos.getGridPrincipal().getSelectionModel().getSelected().data.cuadrediario == 1){
                    return ;
                }
                if (_oldValue != _newValue) {
                    _this.setValue(record.data[_this.valueField]);
                    _this.setRawValue(record.data[_this.displayField]);
                    _this.data = record.data;
                    _this.fireEvent('select',_this,record,{});
                    _this.fireEvent('change', _this, _newValue, _oldValue);
                    _this.fireEvent('valuechange', _newValue);
                }
                _this.winData.close();
            },'click': function (gp, rindex) {
                        if (_this._ventanaDatos.getGridPrincipal().getSelectionModel().getSelected().data.cuadrediario == 1) {
                       _this._ventanaDatos.viewConfig.buttons[0].disable();
                         } else {
                            _this._ventanaDatos.viewConfig.buttons[0].enable();
                   }
                     }
        });
        this.on({
            'focus': function () {
                _this.onFocus.createDelegate(_this, []).call();
            }
        })
    },
    onFocus: function () {
        this.winData.show();
    }
});
Ext.ComponentMgr.registerType('selectortf', LOG.util.SelectorTF);

LOG.util.ComprobarCond = Ext.extend(Ext.util.Observable, {
    OR: '||',
    AND: '&&',
    seCumplenLasCond: false,
    constructor: function (ident = 'identificador') {
        this.ident = ident;
        this[ident] = {};
    },
    isValid: function () {
        return this.seCumplenLasCond;
    },
    add: function (grupo, operador = '&&', funcion) {
        if (grupo) {
            this.addCondGroup(grupo, operador, funcion);
        } else {
            this.addCondGroup('default', operador, funcion);
        }
        return this;
    },
    addCondGroup: function (grupo, operador, funcion) {
        if (Array.isArray(this[this.ident][grupo])) {
            if (operador === this.OR) {
                this[this.ident][grupo].unshift({
                    operador: operador,
                    func: funcion,
                });
            } else if (operador === this.AND) {
                this[this.ident][grupo].push({
                    operador: operador,
                    func: funcion,
                });
            }
        } else {
            this[this.ident][grupo] = [{
                operador: operador,
                func: funcion,
            }];
        }
    },
    comprobarCond: function (datoAdicional, operadorEntreGrupos = '&&') {
        var result = false;
        for (var clave in this[this.ident]){
            if (operadorEntreGrupos === this.OR) {
                if (this.compFunc(this[this.ident][clave], datoAdicional)) {
                    result = true;
                    break;
                } else {
                    result = false;
                }
            } else if (operadorEntreGrupos === this.AND) {
                if (!this.compFunc(this[this.ident][clave], datoAdicional)) {
                    result = false;
                    break;
                } else {
                    result = true;
                }
            }
        }
        this.seCumplenLasCond = result;
        return result;
    },
    compFunc: function (grupo, datoAdicional) {
        var result = false;
        for (var i = 0; i < grupo.length; i++) {
            if (grupo[i].operador === this.OR) {
                if (grupo[i].func(datoAdicional)) {
                    result = true;
                    break;
                } else {
                    result = false;
                }
            } else if (grupo[i].operador === this.AND) {
                if (!grupo[i].func(datoAdicional)) {
                    result = false;
                    break;
                } else {
                    result = true;
                }
            }
        }
        return result;
    }
});