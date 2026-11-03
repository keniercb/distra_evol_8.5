/***
 *@PACKAGE : Validaciones (validadores.js)
 ***/
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.VTypes
 *@Tipo: Objeto
 *@Description: Permite el registro de funciones de validacion.
 */
Ext.ns('PVD.VTypes');
PVD.VTypes = {
    registrar: function(name, config) {
        if (name) {
            if (config && (config.regExp || config.fnValidar) && config.mensaje) {
                var vtype = {};
                vtype[name] = function(val, field) {
                    if (config.regExp instanceof RegExp) {
                        if (config.regExp.test(val) && val.match(config.regExp)) {
                            return true;
                        } else
                            return false;
                    } else if (config.fnValidar) {
                        return config.fnValidar(val, field);
                    }
                    if (field.maxLength) {
                        if (val.length > field.maxLength) {
                            Ext.VTypes[name + 'Text'] = (config.maxMensaje) ? config.maxMensaje : 'La cantidad de caracteres debe ser inferior a ' + field.maxLength;
                        }
                    }
                    if (field.minLength) {
                        if (val.length > field.minLength) {
                            Ext.VTypes[name + 'Text'] = (config.minMensaje) ? config.maxMensaje : 'La cantidad de caracteres debe ser superior a ' + field.minLength;
                        }
                    }
                }
                vtype[name + 'Text'] = config.mensaje;
                if (config.mask && config.mask instanceof RegExp)
                    vtype[name + 'Mask'] = config.mask;
                Ext.apply(Ext.form.VTypes, vtype);
            }
        }
    },
    setMensaje: function(name, mensaje) {
        Ext.form.VTypes[name + "Text"] = mensaje;
    }
};
PVD.VTypes.registrar('vtdescripcion', {
    regExp: /^[^\\""”“<>]*$/,
    mensaje: 'Solo admite caracteres alfanuméricos excepto ( \\"<> )'
});
PVD.VTypes.registrar('vtallcharacter', {
    regExp: /^[^\\""”“<>]*$/,
    mensaje: 'Solo admite caracteres alfanuméricos excepto ( \\"<> )'
});
//---------------------------------------------------\\

Ext.apply(Ext.form.VTypes, {
    daterange: function(val, field) {
        if (val) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                if (start.getValue()) {
                    var dateIni = field.parseDate(start.getValue());
                    field.setMinValue(dateIni);
                }
                this.dateRangeMax = date;
                start.validate();
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                if (end.getValue()) {
                    var dateFin = field.parseDate(end.getValue());
                    field.setMaxValue(dateFin);
                }
                this.dateRangeMin = date;
                end.validate();
            }
            return true;
        }
    }
});
/***
 *@PACKAGE : GRUPOS DE TABULACION (GruposTabulacion.js)
 ***/
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.grid.contextMenu
 *@Tipo: Objeto
 *@Description: Para el trabajo con los menu contextuales de los grid.
 **/
Ext.ns('Ext.grid.contextMenu');
Ext.grid.contextMenu.menuList = {};
Ext.grid.contextMenu.addMenuItems = function(idGrid, button) {
    if (!Ext.grid.contextMenu.menuList[idGrid])
        Ext.grid.contextMenu.menuList[idGrid] = {};
    if (button instanceof Ext.Button) {
        if (!Ext.grid.contextMenu.menuList[idGrid][button.id]) {
            Ext.grid.contextMenu.menuList[idGrid][button.id] = button;
        }
    }
};
Ext.grid.contextMenu.hasMenu = function(idGrid) {
    return (Ext.grid.contextMenu.menuList[idGrid]) ? true : false;
};
Ext.grid.contextMenu.deleteMenu = function(idGrid) {
    if (Ext.grid.contextMenu.hasMenu(idGrid)) {
        Ext.grid.contextMenu.menuList[idGrid] = null;
    }
};
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.HotKeys
 *@Tipo: Array
 *@Description: Almacena los metodos abreviados del teclado por componente.
 **/
Ext.ns('PVD.HotKeys');
PVD.HotKeys.Elementos = {};
PVD.HotKeys.Controller = {
    hotKeyActive: [],
    statusStack: [],
    currentStatus: 0,
    //Funcionalidades para el trabajo con los KeyMaps
    existeKeyMap: function(index) {
        return (PVD.HotKeys.Elementos[index] && PVD.HotKeys.Elementos[index] instanceof Ext.KeyMap) ? true : false;
    },
    addHotKeyControlFromConf: function(index, config, event) {
        if (this.existeKeyMap(index)) {
            PVD.HotKeys.Elementos[index].addBinding(config);
        } else {
            PVD.HotKeys.Elementos[index] = new Ext.KeyMap(index, config, event);
        }
        this.disableHotKeyControl(index, true);
    },
    enableHotKeyControl: function(index, save) {
        if (save)
            this.saveStatus(false);
        if (PVD.HotKeys.Elementos[index] && PVD.HotKeys.Elementos[index] instanceof Ext.KeyMap)
            PVD.HotKeys.Elementos[index].enable();
        if (save)
            this.saveStatus(true);
    },
    enableOnlyThis: function(index) {
        this.saveStatus(false);
        for (var campo in PVD.HotKeys.Elementos) {
            this.disableHotKeyControl(campo, false);
        }
        this.enableHotKeyControl(index);
        this.saveStatus(true);
    },
    enableOnlyThose: function(arrIndex) {
        this.saveStatus(false);
        for (var campo in PVD.HotKeys.Elementos) {
            this.disableHotKeyControl(campo, false);
        }
        for (var i = 0; i < arrIndex.length; i++) {
            this.enableHotKeyControl(arrIndex[i]);
        }
        this.saveStatus(true);
    },
    disableHotKeyControl: function(index, save) {
        if (save)
            this.saveStatus(false);
        if (PVD.HotKeys.Elementos[index] && PVD.HotKeys.Elementos[index] instanceof Ext.KeyMap) {
            PVD.HotKeys.Elementos[index].disable();
        }
        if (save)
            this.saveStatus(true);
    },
    disableAll: function() {
        this.saveStatus(false);
        for (var campo in PVD.HotKeys.Elementos) {
            this.disableHotKeyControl(campo, false);
        }
        this.saveStatus(true);
    },
    getHotKeyControlActivo: function() {
        return this.hotKeyActive;
    },
    findHotKeyControl: function(identificador) {

    },
    rollBackStatus: function() {
        this.currentStatus--;
        this.statusStack[this.currentStatus].activo = false;
        this.hotKeyActive = this.statusStack[this.currentStatus].elementos;
        this.enableOnlyThose(this.hotKeyActive);
    },
    sincronizarActivos: function() {
        this.hotKeyActive = [];
        for (var campo in PVD.HotKeys.Elementos) {
            if (PVD.HotKeys.Elementos[campo] && PVD.HotKeys.Elementos[campo] instanceof Ext.KeyMap && PVD.HotKeys.Elementos[campo].isEnabled()) {
                this.hotKeyActive.push(campo);
            }
        }
    },
    saveStatus: function(activar) {
        this.sincronizarActivos();
        this.statusStack.push({
            activo: (activar ? true : false),
            elementos: this.hotKeyActive
        });
        if (activar) {
            this.statusStack[this.currentStatus].activo = false;
            this.currentStatus = this.statusStack.length - 1;
        }
    }
//Funcionalidades para el trabajo con las configuraciones previas de los KeyMaps

};
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.TabController
 *@Tipo: Objeto
 *@Description: Objeto usado para la asignacion de indices de tabulacion .
 */
Ext.ns('PVD.TabController');
PVD.TabController = {
    tabIndexActual: 0,
    current: function() {
        return this.tabIndexActual;
    },
    next: function() {
        this.tabIndexActual++;
        return this.tabIndexActual;
    },
    tabOrden: function(componentes) {
        if (componentes && componentes.length > 0) {
            for (var i = 0; i < componentes.length; i++) {
                if (componentes[i] instanceof Object) {
                    var cmp = Ext.getCmp(componentes[i].id);
                    if (cmp) {
                        if (!cmp.tabIndex || componentes[i].force || componentes[i].index) {
                            if (componentes[i].index) {
                                cmp.tabIndex = componentes[i].index;
                            } else {
                                cmp.tabIndex = this.next();
                            }
                            cmp.initComponent();
                        }
                    }
                } else {
                    var cmp = Ext.getCmp(componentes[i]);
                    if (cmp) {
                        if (!cmp.tabIndex) {
                            cmp.tabIndex = this.next();
                            cmp.initComponent();
                        }
                    }
                }
            }
        }
    },
    increment: function(val) {
        this.tabIndexActual += val;
    },
    setValue: function(val) {
        this.tabIndexActual = val;
    },
    reset: function() {
        this.tabIndexActual = 0;
    }
};
Ext.ns('PVD.Key');
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.Key.Controller
 *@Tipo: Variables
 *@Description: Variables para el manejo de la opresion de teclas.
 */
PVD.Key.ShiftPress = false;
PVD.Key.TabPress = false;
PVD.Key.Process = false;
PVD.Key.Other = 0;
PVD.Key.ShiftTabPress = false;
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.Key.Controller
 *@Tipo: Objeto
 *@Description: Objeto encargado de redefinir el evento de opresion de las teclas usadas para la tabulacion.
 */
PVD.Key.Controller = {
    activo: false,
    keyDown: function(evt) {
        if (PVD.Key.Controller.activo) {
            if (evt.keyCode == 16) {
                PVD.Key.TabPress = false;
                PVD.Key.Process = false;
                PVD.Key.ShiftPress = true;
            } else if (evt.keyCode == 9 && !PVD.Key.Other) {
                PVD.Key.Controller.stopEvent(evt); //pendiente
                PVD.Key.TabPress = true;
                PVD.Key.Process = true;
                if (PVD.Key.ShiftPress) {
                    PVD.Key.ShiftTabPress = true;
                }
            } else if (evt.keyCode != 9 && evt.keyCode != 16) {
                PVD.Key.Other++;
                PVD.Key.Process = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            } else {
                PVD.Key.Process = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }
        }
    },
    keyPress: function(evt) {
        if (PVD.Key.Controller.activo) {
            if (PVD.Key.TabPress) {
                PVD.Key.Controller.stopEvent(evt);
            }
        }
    },
    keyUp: function(evt) {
        if (PVD.Key.Controller.activo) {
            if (evt.keyCode == 16) {
                if (PVD.Key.ShiftTabPress) {
                    PVD.Key.Controller.stopEvent(evt);
                }
                PVD.Key.ShiftPress = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }
            PVD.Key.Controller.keyHandler(evt);
            if (evt.keyCode == 9 || evt.keyCode == 16) {
                PVD.Key.Controller.stopEvent(evt);
                PVD.Key.TabPress = false;
                PVD.Key.ShiftTabPress = false;
            } else {
                PVD.Key.Other--;
                PVD.Key.ShiftPress = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }
        }
    },
    activate: function() {
        PVD.Key.Controller.activo = true;
        document.onkeydown = PVD.Key.Controller.keyDown;
        document.onkeypress = PVD.Key.Controller.keyPress;
        document.onkeyup = PVD.Key.Controller.keyUp;
    },
    deactivate: function() {
        PVD.Key.Controller.activo = false;
    },
    stopEvent: function(evt) {
        if (document.all) {
            window.event.cancelBubble = true;
        } else {
            evt.stopPropagation();
        }
    },
    keyHandler: function(event) {
        if (PVD.Key.TabPress || PVD.Key.ShiftTabPress) {
            PVD.Key.Controller.stopEvent(event);
            PVD.Key.Process = false;
            if (PVD.Key.ShiftTabPress && !PVD.Key.Process) {
                return PVD.TabGroup.shiftTabPress(event);
            } else {
                return PVD.TabGroup.tabPress(event);
            }
        }
        return true;
    }
}

/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.TabGroup
 *@Tipo: Objeto
 *@Description: Objeto encargado de crear gupos de tabulacion dentro de la intefaz.
 */
Ext.ns('PVD.TabGroup');
PVD.TabGroup = {
    listTabGroup: {},
    pressed: false,
    currentTabGroup: false,
    createTabGroup: function(tabContainer) {
        var idTabGroup = tabContainer.id;
        tabContainer.on('render', function() {
            PVD.TabGroup.setPropertiesElements(idTabGroup);
        });
        if (idTabGroup) {
            if (!this.listTabGroup[idTabGroup]) {
//PVD.TabGroup.setPropertiesContainer(tabContainer);
                this.listTabGroup[idTabGroup] = {
                    currentTab: 0,
                    elementos: []
                };
            }
            this.currentTabGroup = idTabGroup;
            return true;
        }
        return false;
    },
    getCurrentTabGroup: function() {
        return (this.currentTabGroup) ? this.listTabGroup[this.currentTabGroup] : false;
    },
    getCurrentTabGroupIndex: function() {
        return this.currentTabGroup;
    },
    hasElementos: function(tabGroup) {
        return (tabGroup && tabGroup.elementos.length > 0) ? true : false;
    },
    setCurrentTabGroup: function(tabContainer) {
        if (tabContainer) {
            this.createTabGroup(tabContainer);
            PVD.Key.Controller.activate();
        } else {
            this.currentTabGroup = false;
            PVD.Key.Controller.deactivate();
        }
    },
    setCurrentTabGroupById: function(idTabGroup) {
        if (idTabGroup) {
            if (this.listTabGroup[idTabGroup]) {
                PVD.Key.Controller.activate();
                this.currentTabGroup = idTabGroup;
            } else {
                this.currentTabGroup = false;
                PVD.Key.Controller.deactivate();
            }
        } else {
            this.currentTabGroup = false;
            PVD.Key.Controller.deactivate();
        }
    },
    setTabGroup: function(tabContainer, elementos) {
        var idTabGroup = tabContainer.id;
        if (this.createTabGroup(tabContainer)) {
            PVD.Key.Controller.activate();
            if (elementos.length > 0) {
                for (var i = 0; i < elementos.length; i++) {
                    if (elementos[i] instanceof Ext.Component) {
                        if (!this.existeElemento(idTabGroup, elementos[i].id)) {
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                            var tabIndex = PVD.TabController.next();
                            PVD.TabGroup.setTabIndexEl(idTabGroup, elementos[i], tabIndex);
                        }
                    } else if (elementos[i].id) {
                        if (!this.existeElemento(idTabGroup, elementos[i].id)) {
                            var tabIndex = PVD.TabController.next();
                            PVD.TabGroup.setTabIndexEl(idTabGroup, elementos[i], tabIndex);
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                        }
                    } else {
                        if (!this.existeElemento(idTabGroup, elementos[i])) {
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i]);
                        }
                    }
                }
            }
        }
    },
    setTabIndexEl: function(idTabGroup, el, tabInd) {
        if (el instanceof Ext.Component) {
            el.on('render', function(cmp) {
                document.getElementById(cmp.id).tabIndex = tabInd;
                document.getElementById(cmp.id).onclick = function() {
                    var position = PVD.TabGroup.existeElemento(idTabGroup, el.id);
                    PVD.TabGroup.setTabPosition(idTabGroup, position);
                }
            });
        } else if (el.id) {
            el.tabIndex = tabInd;
        }
    },
    getTabGroup: function(tabContainer) {
        return (tabContainer.id) ? this.listTabGroup[tabContainer.id] : false;
    },
    getTabGroupById: function(idTabGroup) {
        return (idTabGroup && this.listTabGroup[idTabGroup]) ? this.listTabGroup[idTabGroup] : false;
    },
    addElement: function(tabContainer, elementos) {
        var idTabGroup = tabContainer.id;
        if (this.createTabGroup(tabContainer) && elementos) {
            if (elementos instanceof Array) {
                if (elementos.length > 0) {
                    for (var i = 0; i < elementos.length; i++) {
                        if (elementos[i] instanceof Ext.Component) {
                            if (!this.existeElemento(idTabGroup, elementos[i].id)) {
                                this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                                var tabIndex = PVD.TabController.next();
                                PVD.TabGroup.setTabIndexEl(idTabGroup, elementos[i], tabIndex);
                            }
                        } else if (elementos[i].id) {
                            if (!this.existeElemento(idTabGroup, elementos[i].id)) {
                                var tabIndex = PVD.TabController.next();
                                PVD.TabGroup.setTabIndexEl(idTabGroup, elementos[i], tabIndex);
                                this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                            }
                        } else {
                            if (!this.existeElemento(idTabGroup, elementos[i])) {
                                this.listTabGroup[idTabGroup].elementos.push(elementos[i]);
                            }
                        }
                    }
                }
            } else {
                if (elementos instanceof Ext.Component) {
                    if (!this.existeElemento(idTabGroup, elementos.id)) {
                        this.listTabGroup[idTabGroup].elementos.push(elementos.id);
                        var tabIndex = PVD.TabController.next();
                        PVD.TabGroup.setTabIndexEl(idTabGroup, elementos, tabIndex);
                    }
                } else if (elementos.id) {
                    if (!this.existeElemento(idTabGroup, elementos.id)) {
                        var tabIndex = PVD.TabController.next();
                        PVD.TabGroup.setTabIndexEl(idTabGroup, elementos, tabIndex);
                        this.listTabGroup[idTabGroup].elementos.push(elementos.id);
                    }
                } else {
                    if (!this.existeElemento(idTabGroup, elementos)) {
                        this.listTabGroup[idTabGroup].elementos.push(elementos);
                    }
                }
            }
            return true;
        }
        return false;
    },
    existeElemento: function(idTabGroup, element) {
        if (this.listTabGroup[idTabGroup]) {
            if (this.listTabGroup[idTabGroup].elementos.length > 0) {
                for (var i = 0; i < this.listTabGroup[idTabGroup].elementos.length; i++) {
                    if (this.listTabGroup[idTabGroup].elementos[i] == element)
                        return i;
                }
                return false;
            } else {
                return false;
            }
        }
        return false;
    },
    resetTabGroup: function(tabContainer) {
        var idTabGroup = tabContainer;
        if (tabContainer.id)
            idTabGroup = tabContainer.id;
        if (this.createTabGroup(tabContainer)) {
            this.listTabGroup[idTabGroup].currentTab = 0;
        }
    },
    setTabPosition: function(idTabGroup, position) {
        if (!this.pressed)
            this.listTabGroup[idTabGroup].currentTab = position;
    },
    incrementTabIndex: function() {
        if (this.getCurrentTabGroup()) {
            if (this.getCurrentTabGroup().elementos.length > 0) {
                this.listTabGroup[this.currentTabGroup].currentTab++;
                if (this.getCurrentTabGroup().elementos.length == this.getCurrentTabGroup().currentTab)
                    this.listTabGroup[this.currentTabGroup].currentTab = 0;
            }
            return true;
        } else
            return false;
    },
    decrementTabIndex: function() {
        if (this.getCurrentTabGroup()) {
            if (this.getCurrentTabGroup().elementos.length > 0) {
                this.listTabGroup[this.currentTabGroup].currentTab--;
                if (this.getCurrentTabGroup().currentTab == -1)
                    this.getCurrentTabGroup().currentTab = this.getCurrentTabGroup().elementos.length - 1;
            }
            return true;
        } else
            return false;
    },
    tabPress: function(evt) {
        this.pressed = true;
        if (this.getCurrentTabGroup() && this.tabIsEnabled(this.currentTabGroup)) {
            var tabGroup = this.getCurrentTabGroup();
            this.incrementTabIndex();
            if (Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]) && !Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).disabled) {
                Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).focus();
            } else {
                this.incrementTabIndex();
                this.tabPress(evt);
            }
            this.pressed = false;
            return true;
        }
        this.pressed = false;
        return false;
    },
    shiftTabPress: function(evt) {
        this.pressed = true;
        if (this.getCurrentTabGroup() && this.tabIsEnabled(this.currentTabGroup)) {
            var tabGroup = this.getCurrentTabGroup();
            this.decrementTabIndex();
            if (Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]) && !Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).disabled) {
                Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).focus();
            } else {
                this.decrementTabIndex();
                this.shiftTabPress(evt);
            }
            this.pressed = false;
            return true;
        }
        this.pressed = false;
        return false;
    },
    tabIsEnabled: function(idTabGroup) {
        if (this.listTabGroup[idTabGroup] && this.listTabGroup[idTabGroup].elementos.length > 0) {
            for (var i = 0; i < this.listTabGroup[idTabGroup].elementos.length; i++) {
                var tabGroup = this.listTabGroup[idTabGroup];
                if (Ext.getCmp(tabGroup.elementos[i]) && !Ext.getCmp(tabGroup.elementos[i]).disabled && !Ext.getCmp(tabGroup.elementos[i]).hidden) {
                    return true;
                }
            }
            return false;
        }
        return false;
    },
    stop: function(ascii, evt) {
        evt.stopEvent();
    },
    setPropertiesContainer: function(tabContainer) {
        tabContainer.on('activate', function() {
            PVD.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('show', function() {
            PVD.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('afterlayout', function() {
            PVD.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('beforedestroy', function() {
            if (this.getCurrentTabGroup() == tabContainer.id)
                PVD.TabGroup.setCurrentTabGroup(false);
        });
        tabContainer.on('deactivate', function() {
            if (this.getCurrentTabGroup() == tabContainer.id)
                PVD.TabGroup.setCurrentTabGroup(false);
        });
        tabContainer.on('destroy', function() {
            if (this.getCurrentTabGroup() == tabContainer.id)
                PVD.TabGroup.setCurrentTabGroup(false);
        });
    },
    setPropertiesElements: function(idTabGroup) {
        var tabGroup = PVD.TabGroup.getTabGroupById(idTabGroup);
        if (tabGroup && PVD.TabGroup.hasElementos(tabGroup)) {
            for (var i = 0; i < tabGroup.elementos.length; i++) {
                var el = tabGroup.elementos[i];
                var cmp = document.getElementById(el);
                if (cmp) {
                    var position = PVD.TabGroup.existeElemento(idTabGroup, el);
                    cmp.onclick = function() {
                        PVD.TabGroup.setTabPosition(idTabGroup, position);
                    }
                }
            }
        }
    }
};
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.KeyMap
 *@Tipo: Funcion
 *@Description: Permite el manejo de las teclas calientes.
 */
Ext.ns('PVD.KeyMap');
PVD.KeyMap = function(options) {
    var eventKeys = [];
    if (options && options.config > 0 && options['config'].length > 0) {
        for (var i = 0; i < options['config'].length; i++) {
            var opt = options.config[i];
            if (Ext.getCmp(opt.btn) && (Ext.getCmp(opt.btn).isXtype('button') || Ext.getCmp(opt.btn).isXtype('tbbutton'))) {
                var fn = Ext.getCmp(opt.btn).handler;
                var alt = (opt.alt) ? true : false;
                var shift = (opt.shift) ? true : false;
                var ctrl = (opt.ctrl) ? true : false;
                var key = opt.key;
                eventKeys.push({
                    ctrl: ctrl,
                    shift: shift,
                    alt: alt,
                    key: key,
                    fn: fn
                });
            }
        }
        var element = options.el ? options.el : document;
        PVD.HotKeys.Elementos = new Ext.KeyMap(element, eventKeys);
    }
};
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: UCID.activeFocus
 *@Tipo: Objecto
 *@Description: Para el manejo de los focos de los componentes.
 */
Ext.ns('UCID.activeFocus');
UCID.activeFocus = {
    stackFocus: [],
    active: false,
    focusTop: function() {
        if (this.top()) {
            var element = this.pop();
            if (document.getElementById(element)) {
                if (document.getElementById(element).focus())
                    return true;
            } else {
                this.focusTop();
            }
        }
        return false;
    },
    top: function() {
        if (this.stackFocus.length > 0)
            return this.stackFocus[this.stackFocus.length - 1];
        return null;
    },
    pop: function() {
        if (this.stackFocus.length > 0) {
            return this.stackFocus.pop();
        }
        return null;
    },
    push: function(element) {
        this.stackFocus.push(element);
    },
    init: function() {
        this.start();
    },
    isActive: function() {
        return this.active;
    },
    stop: function() {
        this.active = false;
    },
    restart: function() {
        this.active = true;
    },
    start: function() {
        this.active = true;
        this.stackFocus = [];
    }
}

/***
 *@PACKAGE : Redefinicion de clase y extensiones (extensiones.js)
 ***/
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.data.Store (override)
 *@Tipo: Clase
 *@Description: Controlar las cargas vacias de los stores.
 */
Ext.override(Ext.data.Store, {
    firstLoad: true,
    initParams: null,
    createInit: true,
    lockParams: this.lockParams ? this.lockParams : [],
    load: Ext.data.Store.prototype.load.createInterceptor(function() {
        this.on('load', function(recArr, op) {
            this.unEscapeText(recArr);
        })
        if (this.createInit) {
            this.lockParams.push('start', 'limit');
            if (this.autoFilter) {
                this.on('beforeload', function() {
                    this.isSearchByFilter();
                });
                this.on('load', function(recs, opt) {
                    if (this.firstLoad) {
                        this.initParams = {};
                        for (var p in this.baseParams) {
                            this.initParams[p] = eval('this.baseParams[p]');
                        }
                    }
                    this.firstLoad = false;
                    this.showEmptyMessage(recs);
                });
            }
            this.createInit = false;
        }
    }),
    paramsIsLock: function(param) {
        for (var i = 0; i < this.lockParams.length; i++) {
            if (this.lockParams[i] == param)
                return true;
        }
        return false;
    },
    resetLoad: function() {
        this.baseParams = this.initParams;
        this.load();
    },
    isSearchByFilter: function() {
        this.filtering = false;
        if (this.autoFilter) {
            if (this.initParams) {
                for (var a in this.baseParams) {
                    if (!this.paramsIsLock(a)) {
                        if (this.baseParams[a] && (!this.initParams[a] && this.baseParams[a]) || this.initParams[a] != this.baseParams[a]) {
                            this.filtering = true;
                        }
                    }
                }
                for (var b in this.initParams) {
                    if (!this.paramsIsLock(b)) {
                        if (this.initParams[b] && (!this.baseParams[b] && this.initParams[b]) || this.initParams[b] != this.baseParams[b]) {
                            this.filtering = true;
                        }
                    }
                }
            } else if (!this.initParams && this.baseParams) {
                for (var c in this.baseParams) {
                    if (!this.paramsIsLock(c) && !Ext.isEmpty(this.baseParams[c])) {
                        this.filtering = true;
                    }
                }
            }
        }
    },
    showEmptyMessage: function(recs) {
        if (recs.data.items.length == 0 && this.autoFilter) {
//var mensaje = 'No existen datos que mostrar.';
            if (this.filtering) {
                var mensaje = 'No existen datos que se correspondan con los criterios de búsqueda especificados.';
                //}
                Ext.Msg.alert('Informaci&oacute;n', mensaje, function() {
                    if (Ext.getCmp(this.autoFilter))
                        Ext.getCmp(this.autoFilter).focus(200);
                    this.fireEvent('nodata', this, mensaje);
                }.createDelegate(this));
            }
        }
        this.filtering = false;
    },
    unEscapeText: function(recs) {
        if (recs && recs.length > 0) {
            for (var i = 0; i < recs.length; i++) {
                if (recs[i] && recs[i].data) {
                    for (var el in recs[i].data) {
                        var escapeText = escapeHTML(recs[i].data[el]);
                        recs[i].set(el, escapeText);
                    }
                }
            }
        }
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.data.Store (override)
 *@Tipo: Clase
 *@Description: Controlar las cargas vacias de los stores.
 */
Ext.override(Ext.grid.RowSelectionModel, {
    deselectRow: Ext.grid.RowSelectionModel.prototype.deselectRow.createInterceptor(function(index, preventViewNotify) {
        var r = this.grid.store.getAt(index);
        if (this.fireEvent('beforerowdeselect', this, index, preventViewNotify, r) == false || r.data.locked) {
            return false;
        }
    })
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.data.Store (override)
 *@Tipo: Clase
 *@Description: Controlar las cargas vacias de los stores.
 */
Ext.override(Ext.form.HtmlEditor, {
    first: true,
    initComponent: Ext.Component.prototype.initComponent.createInterceptor(function() {
        this.initReading();
    }),
    initReading: function() {
        this.setReadOnly(this.readOnly);
    },
    setReadOnly: function(readOnly) {
        this.readOnly = readOnly;
        if (this.first) {
            if (readOnly) {
                this.on('beforepush', function(tf, html) {
                    if (this.first) {
                        this.originalValue = html;
                    }
                    this.first = false;
                });
                this.on('beforesync', function(tf, html) {
                    if (this.readOnly) {
                        this.getEditorBody().innerHTML = this.originalValue;
                        this.el.dom.value = this.originalValue;
                        return false;
                    }

                });
            }
        }
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.Component (override)
 *@Tipo: Clase
 *@Description: Controlar las teclas calientes -Depende del js GruposTabulacion-.
 */
Ext.override(Ext.Component, {

    initComponent: Ext.Component.prototype.initComponent.createInterceptor(function() {
        this.on('render', function() {
            this.addOnTabKeyMap();
            this.setKeyMapController();
        });

        var idComponent = this.id;

        if (this.id && this.id instanceof String)
            idComponent = this.id.split('&');
        if (this.uriAccion) {
            if (UCID.acciones[this.uriAccion][idComponent[0]])
                this.hidden = false;
            else
                this.hidden = true;
        }
    }),
    addOnTabKeyMap: function() {
        if (this.nextTab || this.prevTab) {
            if (this.oldKmap) {
                this.oldKmap.disable();
            }
            var hotKeyConfig = [];
            var that = this;
            if (this.prevTab) {
                hotKeyConfig.push({
                    key: 9, //SHIFT + TAB
                    shift: true,
                    fn: function(e) {
                        that.focusElement(that.prevTab);
                    }
                });
            }
            if (this.nextTab) {
                hotKeyConfig.push({
                    key: 9, // TAB
                    shift: false,
                    fn: function() {
                        that.focusElement(that.nextTab);
                    }
                });
            }
            var kmTab = new Ext.KeyMap(this.id, hotKeyConfig);
            kmTab.stopEvent = true;
            this.oldKmap = kmTab;
        }
    },
    focusElement: function(idElement) {
        if (Ext.getCmp(idElement)/* && Ext.getCmp(idElement).isVisible()*/) {
            Ext.getCmp(idElement).focus(200);
        }
    },
    setTabEl: function(elem) {
        Ext.Tabulador.currentTab = elem.id;
    },
    setPreviousElement: function(elem) {
        this.prevTab = elem;
        this.addOnTabKeyMap();
    },
    setNextElement: function(elem) {
        this.nextTab = elem;
        this.addOnTabKeyMap();
    },
    setKeyMapController: function() {
        if (this.keyMapControl && (PVD && PVD.HotKeys))
            PVD.HotKeys.Controller.addHotKeyControlFromConf(this.id, this.keyMapControl, 'keypress');
    },
    changeKeyMap: function(idKeyMap) {
        if (PVD && PVD.HotKeys)
            PVD.HotKeys.Controller.enableOnlyThis(idKeyMap);
    },
    rollBackKeyMap: function() {
        if (PVD && PVD.HotKeys)
            PVD.HotKeys.Controller.rollBackStatus();
    },
    getCurrentKeyMapStatus: function() {
        return (PVD && PVD.HotKeys) ? PVD.HotKeys.Controller.getHotKeyControlActivo() : [];
    },
    activateKeyMapFromArray: function(arrIndex) {
        if (PVD && PVD.HotKeys)
            PVD.HotKeys.Controller.enableOnlyThose(arrIndex);
    },
    habilitarKeyMap: function() {
        if (PVD && PVD.HotKeys)
            PVD.HotKeys.Controller.enableOnlyThis(this.id);
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.Window (override)
 *@Tipo: Clase
 *@Description: Controlar que el evento escape en una ventana no cancele las peticiones.
 */
Ext.override(Ext.Window, {
    tabGroupBefore: false,
    initComponent: Ext.Window.prototype.initComponent.createInterceptor(function() {
        this.on('render', this.addOnEscKeyMap);
        this.on('destroy', this.activarFoco);
    }),
    activarFoco: function() {
        if (UCID.activeFocus.isActive()) {
            UCID.activeFocus.focusTop();
        }
    },
    closeWindow: function() {
        if (this.closeAction == 'hide') {
            this.hide();
        } else {
            this.close();
        }
    },
    addOnEscKeyMap: function() {
        if (this.closeOnEsc) {
            var that = this;
            var hotKeyConfig = {
                key: Ext.EventObject.ESC,
                fn: that.closeWindow,
                shift: false
            };
            var kmEsc = new Ext.KeyMap(that.getEl().id, hotKeyConfig);
            kmEsc.stopEvent = true;
        }
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.grid.GridPanel (Override)
 *@Tipo: Clase
 *@Description: Permite el trabajo con los contextmenu del grid.
 **/
Ext.override(Ext.grid.GridPanel, {
    initComponent: Ext.grid.GridPanel.prototype.initComponent.createInterceptor(function() {
        if (this.gridMenu) {
            this.on('rowcontextmenu', this.renderContextMenu);
        }
    }),
    hasMenu: function() {
        return this.gridMenu;
    },
    setPlugins: function(arrPlg) {
        if (arrPlg) {
            this.plugins = arrPlg;
        }
    },
    cancelPlugins: function() {
        if (this.plugins) {
            if (Ext.isArray(this.plugins)) {

                for (var i = 0, len = this.plugins.length; i < len; i++) {
                    if (this.plugins[i].cancel && this.plugins[i].cancel instanceof Function)
                        this.plugins[i].cancel();
                }
            } else {

                if (this.plugins.cancel && this.plugins.cancel instanceof Function)
                    this.plugins.cancel();
            }
        }
        this.plugins = null;
    },
    initPlugins: function() {
        var self = this;
        if (this.plugins) {
            if (Ext.isArray(this.plugins)) {
                for (var i = 0, len = this.plugins.length; i < len; i++) {
                    this.plugins[i] = this.plugins[i].init(self);
                }
            } else {
                this.plugins = this.plugins.init(self);
            }
        }
    },
    renderContextMenu: function(gd, row, evt) {
        if (this.gridMenu) {
            var selM = this.getSelectionModel();
            if (selM) {
                var keepExisting = (selM.singleSelect) ? false : true;
                selM.selectRow(row, keepExisting);
            }
            var items = [];
            if (Ext.grid.contextMenu.menuList[gd.id]) {
                if (Ext.getCmp('contextMenu' + gd.id)) {
                    Ext.getCmp('contextMenu' + gd.id).destroy();
                }
                for (var id in Ext.grid.contextMenu.menuList[gd.id]) {
                    var button = Ext.grid.contextMenu.menuList[gd.id][id];
                    var btnC = Ext.getCmp(button.id);
                    if (btnC && btnC instanceof Ext.Button) {
                        if (btnC.isXType('splitbutton') && !btnC.disabled && !btnC.hidden) {
                            var spItem = {
                                text: btnC.text,
                                icon: btnC.icon,
                                id: 'gm' + btnC.id,
                                iconCls: 'blist',
                                hidden: btnC.hidden,
                                disabled: btnC.disabled,
                                handler: (btnC.handler) ? btnC.handler : function() {
                                },
                                menu: btnC.menu
                            };
                            items.push(spItem);
                        } else if (btnC.isXType('tbsplit') && !btnC.disabled && !btnC.hidden) {
                            var sptbItem = {
                                text: btnC.text,
                                icon: btnC.icon,
                                iconCls: 'blist',
                                hidden: btnC.hidden,
                                id: 'gm' + btnC.id,
                                disabled: btnC.disabled,
                                handler: (btnC.handler) ? btnC.handler : function() {
                                },
                                menu: btnC.menu
                            };
                            items.push(sptbItem);
                        } else if (btnC.isXType('tbbutton') && !btnC.disabled && !btnC.hidden) {
                            var tbItem = {
                                text: btnC.text,
                                icon: btnC.icon,
                                hidden: btnC.hidden,
                                id: 'gm' + btnC.id,
                                disabled: btnC.disabled,
                                handler: btnC.handler
                            };
                            items.push(tbItem);
                        } else if (btnC.isXType('button') && !btnC.disabled && !btnC.hidden) {
                            var btnItem = {
                                text: btnC.text,
                                icon: btnC.icon,
                                hidden: btnC.hidden,
                                id: 'gm' + btnC.id,
                                disabled: btnC.disabled,
                                handler: btnC.handler
                            };
                            items.push(btnItem);
                        }
                    }
                }
            }
            var miMenu = new Ext.menu.Menu({
                id: 'contextMenu' + gd.id,
                items: items
            });
            evt.stopEvent();
            miMenu.showAt(evt.getXY());
        }

    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.ButtonSecure (extend)
 *@Tipo: Clase
 *@Description: Controlar las acciones.
 **/
Ext.ns('UCID.security');
Ext.ns('UCID.acciones');
UCID.acciones = {};
UCID.security = {
    idFunc: null,
    events: {},
    setFuncionalityId: function(idFun) {
        this.idFunc = idFun;
    },
    checkElement: function(el) {
        var list = this.getAccesList();
        if (list) {
            for (var i in list) {
                if (list[i] && this.compareElements(i, el)) {
                    return true;
                }
            }
        }
        return false;
    },
    getAccesList: function() {
        if (UCID.acciones[UCID.security.getFunctionalityId()]) {
            return UCID.acciones[UCID.security.getFunctionalityId()];
        }
        return {};
    },
    compareElements: function(el_1, el_2) {
        if (el_1 && el_2) {
            var el_2Tmp = el_2.toString().split('&');
            if (el_2Tmp && el_2Tmp instanceof Array && el_2Tmp[1]) {
                if (el_2Tmp == el_1) {
                    return true;
                }
            } else {
                if (el_1 == el_2) {
                    return true;
                }
            }
        }
        return false;
    },
    getFunctionalityId: function() {
        return this.idFunc;
    },
    loadAccessList: function(idFunc, fn) {
        if (idFunc) {
            Ext.Ajax.request({
                url: 'cargaracciones',
                method: 'POST',
                params: {
                    idfuncionalidad: UCID.security.getFunctionalityId()
                },
                callback: function(options, success, response) {
                    var idFuncionality = UCID.security.getFunctionalityId();
                    if (success) {
                        UCID.acciones[idFuncionality] = {};
                        var acciones_reportes = Ext.decode(response.responseText);
                        var codMsg = acciones_reportes.codMsg;
                        if (!codMsg) {
                            for (var i in acciones_reportes) {
                                if (i != 'remove') {
                                    UCID.acciones[idFuncionality][acciones_reportes[i].abreviatura] = true;
                                }
                            }
                            UCID.security.fireEvent('load');
                            if (fn)
                                fn();
                        }
                    }
                }
            });
        } else {
            if (fn)
                fn();
            return;
        }
    },
    on: function(evt, fn) {
        if (!this.events[evt]) {
            this.events[evt] = [];
        }
        if (fn instanceof Function)
            this.events[evt].push(fn);
    },
    fireEvent: function(evtName, obj) {
        if (this.events[evtName]) {
            for (var i = 0; i < this.events[evtName].length; i++) {
                if (this.events[evtName][i] instanceof Function) {
                    var id = this.idFunc;
                    var list = this.getAccesList();
                    this.events[evtName][i](id, list, obj);
                }
            }
        } else {
            this.events[evtName] = [];
        }
    }
}
Ext.ButtonSecure = Ext.extend(Ext.Button, {
    locked: true,
    initComponent: function() {
        var _this = this;
        if (this.checkSecurity()) {
            this.hidden = this.hidden ? true : false;
            this.locked = false;
        } else {
            this.hidden = true;
            this.locked = false;
        }
        UCID.security.on('load', function() {
            _this.checkSecurity();
        });
        Ext.ButtonSecure.superclass.initComponent.call(this);
    },
    setVisible: function(val) {
        if (this.locked)
            return;
        Ext.ButtonSecure.superclass.setVisible(val);
    },
    checkSecurity: function() {
        if (UCID.security.checkElement(this.id))
            return true;
        return false;
    },
    checkSecurityAfter: function() {
        if (this.checkSecurity()) {
            this.locked = false;
            if (!this.hidden)
                this.setVisible(true);
        } else {
            this.locked = true;
            this.setVisible(false);
        }
    }
});
Ext.reg('button-secure', Ext.ButtonSecure);
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.Button (Override)
 *@Tipo: Clase
 *@Description: Permite adicionar las teclas calientes al boton.
 **/
Ext.override(Ext.Button, {
    initComponent: Ext.Button.prototype.initComponent.createInterceptor(function() {
        if (this.hotKey && this.hotKey.config) {
            var _this = this;
            this.hotKey.config.fn = function() {
                if (_this.isVisible() && !_this.isDisable()) {
                    _this.handler();
                }
            };
            this.on('render', this.addHotKeyConf);
        }
        if (this.gridMenu) {
            this.on('render', function() {
                this.addMenuGrid(this.gridMenu);
            });
        }
        this.on('focus', this.saveFocus);
    }),
    saveFocus: function() {
        if (UCID.activeFocus.isActive()) {
            UCID.activeFocus.push(this.id);
        }
    },
    isDisable: function() {
        return this.disabled;
    },
    addMenuGrid: function(idGrid) {
        Ext.grid.contextMenu.addMenuItems(idGrid, this);
    },
    addHotKeyConf: function() {
        if (PVD && PVD.HotKeys && PVD.HotKeys.Controller) {
            if (this.hotKey.idGrupo)
                PVD.HotKeys.Controller.addHotKeyControlFromConf(this.hotKey.idGrupo, this.hotKey.config, 'keypress');
            else
                var a = new Ext.KeyNav(document, this.hotKey.config, 'keypress');
        }
    },
    setToolTip: function(tooltip) {
        var _this = this;
        Ext.QuickTips.unregister(_this.getEl());
        Ext.QuickTips.register(Ext.apply({
            target: _this.id
        }, tooltip));
    }
});

/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Author: Ing. Javier Rodriguez Lopez
 *@Name: Ext.PagingToolbar (Override)
 *@Tipo: Clase
 *@Description: Muestra un combo para seleccionar la cantidad de elementos a visualizar por pagina. Mensajes de los paginadores.
 **/
Ext.override(Ext.PagingToolbar, {
    initComponent: Ext.PagingToolbar.prototype.initComponent.createInterceptor(function() {
        var self = this;
        this.displayMsg = this.special ? this.displayMsg : 'Mostrando de {0} - {1} de {2}';
        this.emptyMsg = this.special ? this.emptyMsg : "No hay resultados para mostrar.";
        var flag = true;
        this.arrSize = [[5], [10], [15], [20], [30], [50], [100], [1000]];
        Ext.each(this.arrSize, function(size) {
            if (size == self.pageSize) {
                flag = false;
            }
        });
        if (flag) {
            this.arrSize.push([self.pageSize]);
        }
        this.stPageSize = new Ext.data.SimpleStore({
            fields: ['size'],
            data: this.arrSize,
            sortInfo: {field: "size", direction: "ASC"}
        });
        this.cbPageSize = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="Mostrar <b>{size}</b> filas por p&aacute;gina." class="x-combo-list-item">{size}</div></tpl>',
            width: 50,
            listWidth: 50,
            store: this.stPageSize,
            displayField: 'size',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            listeners: {
                select: function(cb, rc, index) {
                    self.setPageSize(rc.get('size'));
                }
            }
        });
        this.items = ['-', this.cbPageSize];
        //Establesco el valor por defecto definido por el usuario
        this.cbPageSize.setValue(self.pageSize);
    }),
    setPageSize: function(value) {
        this.pageSize = value;
        this.doLoad(0);
    }
});

/**
 *@Author: Ing. Javier Rodriguez Lopez
 *@Name: Ext.Notification
 *@Tipo: Funcion
 *@Description: Mustra un mensaje de notificacion
 **/
Ext.Notification = function() {
    // private
    var msgCt;

    // private
    var createBox = function(t, m, i) {
        /**
         * los valores de icon son:
         * info, question,warning y error
         * */
        var icon = 'icon-info'
        if(i == 'info'){
            icon = 'icon-info.gif';
        }
        else
        if(i == 'question')
        {
            icon = 'icon-question.gif';
        }
        else
        if(i == 'warning')
        {
            icon = 'icon-warning.gif';
        }
        else
        if(i == 'error')
        {
            icon = 'icon-error.gif';
        }
        return ['<div class="msg">',
            '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
            '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3 style="background-image:url(../../../../../lib/ExtJS/temas/default/images/window/'+icon+')!important;background-repeat:no-repeat;padding-left:40px;height:32;">', t, '</h3>', m, '</div></div></div>',
            '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
            '</div>'].join('');
    };

    return {
        //Muestra mensaje de notificacion
        show: function(options) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
                msgCt.setStyle({
                    position: 'absolute',
                    width: '250px',
                    "z-index": 200000
                });
            }
            msgCt.alignTo(document, 't-t');
            var d = Ext.DomHelper.append(msgCt, {html: createBox(options.title, options.msg, options.icon)}, true);
            d.slideIn('t').pause(options.time ? options.time : 1).ghost("t", {remove: true});
        }
    };
}();

Ext.ns('Ext.Utiles');
Ext.Utiles.dateTo12H = function(valor) {
    var date12H = '';
    if (valor) {
        var date_t = valor.split(' ');
        date12H = date_t[0];
        date12H = (date_t[1]) ? date12H + ' ' + Ext.Utiles.timeTo12H(date_t[1]) : date12H;
    }
    return date12H;
}
Ext.Utiles.timeTo12H = function(valor) {
    var time12H = '';
    if (valor && valor.toString() != '') {
        var mer = (valor.toLowerCase().replace("pm", '') != valor.toLowerCase()) ? 'PM' : 'AM';
        var time_t = valor.split(' ');
        var time = time_t[0].split(':');
        var hour = parseInt(time[0]) % 12;
        hour = (hour) ? hour : '12';
        var min = (time[1]) ? parseInt(time[1]) % 60 : '00';
        min = (min.toString().length > 1) ? min.toString() : '0' + min.toString();
        if (valor.toLowerCase().replace("am", '') == valor.toLowerCase() && valor.toLowerCase().replace("pm", '') == valor.toLowerCase()) {
            mer = (parseInt(time[0]) % 24 > 12) ? 'PM' : 'AM';
            time12H = hour + ':' + min + ' ' + mer;
        } else {
            time12H = hour + ':' + min + ' ' + mer;
        }
    }
    return time12H;
}
Ext.Utiles.getTotalDays = function(moth, year) {
    return new Date(year || new Date().getFullYear(), moth, 0).getDate();
}


/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.form.TimeField (Override)
 *@Tipo: Clase
 *@Description:
 **/
Ext.override(Ext.form.TimeField, {
    initComponent: Ext.form.TimeField.prototype.initComponent.createInterceptor(function() {
        if (this.isXType('timefield', false)) {
            if (this.dateField && Ext.getCmp(this.dateField)) {
                Ext.getCmp(this.dateField).on('change', function(df, nt, ot) {
                    if (this.dateField)
                        this.validate();
                });
            }
            this.listWidth = this.listWidth ? this.listWidth : 80;
            this.maxHeight = this.maxHeight ? this.maxHeight : 250;
            this.invalidText = "Formato: h:mm AM|PM.";
            this.format = this.format ? this.format : 'g:i A';
            if (this.format == 'g:i A' && this.value) {
                this.notmyself = true;
                this.addEvents({
                    'changevalue': true
                })
                this.value = Ext.Utiles.timeTo12H(this.value);
                this.on('changevalue', function(tf, value) {
                    var newVal = Ext.Utiles.timeTo12H(value);
                    this.notmyself = false;
                    this.setValue(newVal);
                    this.notmyself = true;
                })
            }
            this.isCreate = false;
            this.isListShow = false;
            if (this.hideTrigger && !this.readOnly) {
                this.lazyInit = false;
                this.on('focus', function() {
                    if (this.hideTrigger && !this.readOnly) {
                        this.showList();
                        this.isCreate = true;
                    }
                })
                this.on('blur', function() {
                    if (this.hideTrigger && !this.readOnly) {
                        this.collapse();
                    }
                })
            }
            if (this.hideTrigger && this.readOnly) {
                this.on('expand', function() {
                    if (this.hideTrigger && this.readOnly)
                        this.collapse();
                })
            }
            this.on('collapse', function() {
                this.isShowList = false;
            })
        }
        if (this.dateField) {
// this.minText = (this.minText) ? this.minText : "La hora tiene que ser mayor o igual a {0}";
//this.maxText = (this.maxText) ? this.maxText : "La hora tiene que ser menor o igual a {0}";
            this.minText = this.minText ? this.minText : "La hora tiene que ser posterior o igual a {0}";
            this.maxText = this.maxText ? this.maxText : "La hora tiene que ser anterior o igual a {0}";
        }
    }),
    createClickEvent: function() {
        if (!this.isCreate) {
            var el = Ext.get(this.id);
            el.on('click', function() {
                this.showList();
            }.createDelegate(this))
        }
    },
    showList: function() {
        if (!this.isShowList) {
            this.expand();
            this.restrictHeight();
        }
        this.isShowList = true;
    },
    hideList: function() {
        this.collapse();
        this.isShowList = false;
    },
    setValue: Ext.form.TimeField.prototype.setValue.createInterceptor(function(value) {
        if (this.format == 'g:i A' && value && this.notmyself) {
            this.fireEvent('changevalue', this, value);
            return;
        }
    }),
    setMinValue: function(value) {
        this.minValue = (typeof value == "date" ? value.format(this.format) : value);
    },
    setMaxValue: function(value) {
        this.maxValue = (typeof value == "date" ? value.format(this.format) : value);
    },
    validar: function(date) {
        if (this.dateField) {
            if (Ext.getCmp(this.dateField) && Ext.getCmp(this.dateField).getValue()) {
                var valDate = date instanceof Date ? date : Date.parseDate(date, Ext.getCmp(this.dateField).format + ' ' + this.format);
                if (this.minValue) {
                    var minVal = Date.parseDate(this.minValue, Ext.getCmp(this.dateField).format + ' ' + this.format);
                    if (minVal > valDate)
                        return false;
                }
                if (this.maxValue) {
                    var maxVal = Date.parseDate(this.maxValue, Ext.getCmp(this.dateField).format + ' ' + this.format);
                    if (maxVal < valDate)
                        return false;
                }

            }
        }
        return true;
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.form.DateField (Override)
 *@Tipo: Clase
 *@Description:
 **/
Ext.override(Ext.form.DateField, {
    initComponent: Ext.form.DateField.prototype.initComponent.createInterceptor(function() {
        this.invalidText = "Formato: dd/mm/aaaa.";
        this.format = this.format ? this.format : 'd/m/Y';
        this.minText = (this.minText) ? this.minText : "La fecha de fin tiene que ser posterior o igual a la fecha inicio.";
        this.maxText = this.maxText ? this.maxText : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.";
        this.on('blur', function() {
            if (!this.isValid() && this.isToolItem) {
                this.setValue('');
            }
        });
        this.on('clearvalue', function(df) {
            if (this.startDateField) {
                var start1 = Ext.getCmp(this.startDateField);
                if (start1) {
                    start1.dateRangeMax = false;
                    start1.setMaxValue(null);
                    start1.validate();
                }
            } else if (this.endDateField) {
                var end1 = Ext.getCmp(this.endDateField);
                if (end1) {
                    end1.dateRangeMin = false;
                    end1.setMinValue(null);
                    end1.validate();
                }
            }
        });
        this.on('change', function(df) {
            if (this.startDateField) {
                var start1 = Ext.getCmp(this.startDateField);
                if (start1) {
                    var date = this.parseDate(start1.getValue());
                    if (!date) {
                        return;
                    }
                    this.dateRangeMin = date;
                    this.setMinValue(date);
                    this.validate();
                }
            } else if (this.endDateField) {
                var end1 = Ext.getCmp(this.endDateField);
                if (end1) {
                    var dateF = this.parseDate(end1.getValue());
                    if (!dateF) {
                        return;
                    }
                    this.dateRangeMax = dateF;
                    this.setMaxValue(dateF);
                    this.validate();
                }
            }
        });
        this.on('focus', function(df) {
            if (this.startDateField) {
                var start1 = Ext.getCmp(this.startDateField);
                var date = this.parseDate(start1.getValue());
                if (!date) {
                    return;
                }
                this.dateRangeMin = date;
                this.setMinValue(date);
                this.validate();
            } else if (this.endDateField) {
                var end1 = Ext.getCmp(this.endDateField);
                var dateF = this.parseDate(end1.getValue());
                if (!dateF) {
                    return;
                }
                this.dateRangeMax = dateF;
                this.setMaxValue(dateF);
                this.validate();
            }
        });
    }),
    setValue: Ext.form.TimeField.prototype.setValue.createInterceptor(function(value) {
        if (Ext.isEmpty(value) || value == '') {
            this.fireEvent('clearvalue', this, value);
        } else {
            this.fireEvent('setvalue', this, this.getValue(), value);
        }
    })
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.form.Field (Override)
 *@Tipo: Clase
 *@Description: Bloquear la tecla delete para que borre dento del textfield y no ejecute otro evento.
 **/
Ext.override(Ext.form.Field, {
    initComponent: Ext.form.Field.prototype.initComponent.createInterceptor(function() {
        if (Ext.isEmpty(this.value)) {
            delete this.value;
        }
        this.blankText = 'Este campo es obligatorio.';
        if (this.vtype && (this.vtype == 'vtallcharacter' || this.vtype == 'vtdescripcion')) {
            this.on('blur', function(ta, nv, ov) {
                if (this.vtype && (this.vtype == 'vtallcharacter' || this.vtype == 'vtdescripcion')) {
                    var newText = this.getValue();
                    if (newText && newText != '') {
                        newText = newText.replace('\\', '/');
                        newText = newText.replace('“', "'");
                        newText = newText.replace('”', "'");
                        newText = newText.replace('"', "'");
                        newText = newText.replace('"', "'");
                        newText = newText.replace('<', '-');
                        newText = newText.replace('>', '-');
                        this.setValue(newText);
                    }
                }
            }.createDelegate(this));
            this.maskRe = /^[^\\"<>]*$/;
        }
        if (this.dinamicFieldLabel) {
            this.fieldLabel = '<div id="label' + this.id + '">' + this.dinamicFieldLabel + ':</div>';
            this.labelSeparator = '';
        }
        if (!(this instanceof Ext.form.Checkbox) && !(this instanceof Ext.form.CheckboxGroup)) {
            this.on('render', this.notExecuteDel);
            this.on('focus', this.activarKeyMap);
            this.on('blur', this.desActivarKeyMap);
            this.activeKeyMap = [];
        }
        if (this.maxLength) {
            var addText = (this instanceof Ext.form.NumberField) ? 'd&iacute;gitos' : 'caracteres';
            this.maxLengthText = 'El tamaño máximo requerido es ' + this.maxLength + ' ' + addText + '.';
        }
        this.on('focus', this.saveFocus);
    }),
    setLabel: function(label) {
        var el = this.el.dom.parentNode.parentNode;
        if (el.children[0].tagName.toLowerCase() === 'label') {
            el.children[0].innerHTML = label;
        } else if (el.parentNode.children[0].tagName.toLowerCase() === 'label') {
            el.parentNode.children[0].innerHTML = label;
        }
    },
    setFieldLabel: function(label) {
        if (this.dinamicFieldLabel)
            Ext.DomHelper.overwrite('label' + this.id, label + ':');
    },
    saveFocus: function() {
        if (UCID.activeFocus.isActive()) {
            UCID.activeFocus.push(this.id);
        }
    },
    setValue: Ext.form.Field.prototype.setValue.createInterceptor(function(val) {
        if (Ext.isEmpty(val)) {
            var oldValue = this.getValue();
            this.fireEvent('novalue', this, oldValue);
            return;
        }
    }),
    activarKeyMap: function() {
        if (PVD && PVD.HotKeys && PVD.HotKeys.Controller) {
            this.activeKeyMap = PVD.HotKeys.Controller.getHotKeyControlActivo();
            PVD.HotKeys.Controller.enableHotKeyControl(this.id, false);
        }
    },
    desActivarKeyMap: function() {
        if (PVD && PVD.HotKeys && PVD.HotKeys.Controller) {
            PVD.HotKeys.Controller.enableOnlyThose(this.activeKeyMap);
        }
        if (Ext.isEmpty(this.getValue())) {
            this.fireEvent('empty', this);
        }
    },
    activarOldKeyMap: function() {
        if (PVD && PVD.HotKeys && PVD.HotKeys.Controller) {
            PVD.HotKeys.Controller.enableOnlyThose(this.activeKeyMap);
        }
    },
    notExecuteDel: function() {
        if (PVD && PVD.HotKeys && PVD.HotKeys.Controller) {
            var that = this;
            /* PVD.HotKeys.Controller.addHotKeyControlFromConf(this.id, {
             key: Ext.EventObject.DELETE, //DELETE
             fn:function(){
             that.activarOldKeyMap();
             },
             stopEvent:true
             },'keyup');*/
            PVD.HotKeys.Controller.addHotKeyControlFromConf(this.id, {
                key: Ext.EventObject.DELETE, //DELETE
                fn: function() {
                    if (PVD && PVD.HotKeys && PVD.HotKeys.Controller)
                        PVD.HotKeys.Controller.disableAll();
                },
                stopEvent: true
            }, 'keydown');
        }
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.form.Field (Override)
 *@Tipo: Clase
 *@Description: Bloquear la tecla delete para que borre dento del textfield y no ejecute otro evento.
 **/
Ext.override(Ext.form.TextArea, {
    initComponent: Ext.form.TextArea.prototype.initComponent.createInterceptor(function() {
        this.maskRe = /^[^\\"<>]*$/;
        this.vtype = 'vtdescripcion';
    })
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.form.ComboBox (Override)
 *@Tipo: Clase
 *@Description: Mostrar tooltip en los combobox.
 **/
Ext.ns('Webmatters.form');
/*!
 * @constructor
 * @param {Object} config A config object
 */
Webmatters.form.BannedComboItems = function(config)
{
    Ext.apply(this, config);
    Webmatters.form.BannedComboItems.superclass.constructor.apply(this, arguments);
};
Ext.extend(Webmatters.form.BannedComboItems, Ext.util.Observable, {
    /**
     * @cfg {String} booleanField The name of the boolean field (in the record) which says
     * if it can be selected or no. If the record has this field true, the item will be
     * unselectable. Defaults to <tt>banned</tt>.
     */
    booleanField: 'banned',
    /**
     * @cfg {String} reasonField The name of the string field (in the record) which
     * contains the message to display while the mouse is on a disabled record.
     * Defaults to <tt>reasonField</tt>.
     */
    reasonField: 'banReason',
    /**
     * Plugin init.
     * @private
     */
    init: function(combo)
    {
        combo.on('beforeselect', this.beforeSelection, this);
    },
    /**
     * Returns false (stopping the selection) if the record is disabled.
     *
     * @param {Ext.form.ComboBox} combo
     * @param {Ext.data.Record} record
     * @param {Number} index
     * @return {Boolean}
     */
    beforeSelection: function(combo, record, index)
    {
        return record.get(this.booleanField) !== true;
    }
});
Ext.override(Ext.form.ComboBox, {
    initComponent: Ext.form.ComboBox.prototype.initComponent.createInterceptor(function() {
        this.blankText = 'Este campo es obligatorio.'
        if (this.disableBanned)
        {
            this.banned = new Webmatters.form.BannedComboItems({
                booleanField: 'disabledField',
                reasonField: 'disabledMsg'
            });
            this.banned.init(this);
        }
        if (this.store && !this.tpl) {
            this.on('blur', function(cb, nVal, oVal) {
                if (this.store instanceof Ext.data.Store) {
                    if (Ext.isEmpty(this.getValue())) {
                        this.clearValue();
                    }
                }
            })
        }
        var _this = this;
        if (!(this instanceof Ext.form.TimeField) && (this.isXType('combo', false))) {
            this.addEvents({
                'valuechange': true
            });
            if (this.enableQtip) {
                this.on('select', this.changeQtipByRecord);
                this.on('valuechange', function(val) {
                    this.changeQtip(val);
                });
                this.on('valid', function(cb) {
                    this.changeQtip(cb.getValue());
                });
                var className = this.disableBanned ? 'x-combo-list-item x-combo-list-item-banned-{' + this.banned.booleanField + '}' : 'x-combo-list-item';
                if ((this.extendField || this.disableBanned) && !this.tpl) {
                    var ext = this.extendField;
                    var reason = (this.banned) ? this.banned.reasonField : false;
                    var bannedField = (this.banned) ? this.banned.booleanField : false;
                    if (this.store) {
                        if (this.store instanceof Ext.data.Store) {
                            this.store.on('load', function(st, recs, opt) {
                                if (recs.length > 0) {
                                    for (var i = 0; i < recs.length; i++) {
                                        var valor = null;
                                        if (reason && bannedField) {
                                            if (recs[i].get(bannedField)) {
                                                valor = (!Ext.isEmpty(recs[i].get(reason))) ? recs[i].get(reason) : "Elemento deshabilitado";
                                            }
                                        }
                                        if (!Ext.isEmpty(valor) && (!_this.hideTrigger && !_this.readOnly))
                                            recs[i].set(ext, _this.unescapeExtendField(valor));
                                        var value = recs[i].get(ext);
                                        if (value && value != 'null') {
                                            var pto = '';
                                            if (value[value.length - 1] != '.') {
                                                pto = '.';
                                            }
                                            recs[i].set(ext, _this.unescapeExtendField(value) + pto);
                                        } else {
                                            recs[i].set(ext, '');
                                        }
                                    }
                                }
                            });
                        } else if (this.store instanceof Array) {
                            if (this.store.length > 0) {
                                for (var i = 0; i < recs.length; i++) {
                                    var valor = (this.store[i][3]) ? this.store[i][3] : false;
                                    if (valor)
                                        this.store[i][2] = this.store[i][3];
                                    var value = (this.store[i][2]) ? this.store[i][2] : false;
                                    if (value && value != 'null') {
                                        var pto = '';
                                        if (value[value.length - 1] != '.') {
                                            pto = '.';
                                        }
                                        this.store[i][2] = value + pto;
                                    } else {
                                        this.store[i][2] = "";
                                    }
                                }
                            }
                        }
                    }
                    this.tpl = '<tpl for="."><div ext:qtip="<div style=word-wrap:break-word;><b>{' + this.displayField + '}</b><br>{' + this.extendField + '}</div>" class="' + className + '">{' + this.displayField + '}</div></tpl>';
                } else {
                    if (!this.tpl) {
                        if (this.disabledBanned) {
                            this.tpl = '<tpl for="."><div ext:qtip="<div style=word-wrap:break-word;><b>{' + this.displayField + '}</b><br>{' + this.banned.reasonField + '}</div>" class="' + className + '">{' + this.displayField + '}</div></tpl>';
                        } else {
                            this.tpl = '<tpl for="."><div ext:qtip="<div style=word-wrap:break-word;>{' + this.displayField + '}</div>" class="' + className + '">{' + this.displayField + '}</div></tpl>';
                        }
                    }

                }
            }
            if (this.details) {
                this.tpl = '<tpl for="."><div></div></tpl>';
                this.listWidth = 0;
                this.hideTrigger = true;
                this.editable = false;
                this.readOnly = true;
                this.typeAhead = false;
            }
            this.on('blur', function(cb) {
                if (!cb.getRawValue() || cb.getRawValue() == '') {
                    this.clearValue();
                    if (Ext.getCmp('qtip' + this.id))
                        Ext.getCmp('qtip' + this.id).destroy();
                }
            });
            this.on('invalid', function(cb) {
                this.clearValue();
            });
        }
    }),
    unescapeExtendField: function(val) {
        return Ext.util.Format.stripTags(val);
    },
    setValue: Ext.form.ComboBox.prototype.setValue.createInterceptor(function(value) {
        if (this.details)
            return;
        if (this.isXType('combo', false))
            this.fireEvent('valuechange', value);
    }),
    expand: Ext.form.ComboBox.prototype.expand.createInterceptor(function() {
        if (this.details)
            return;
    }),
    changeQtipByRecord: function(cb, rec, ind) {
        this.changeQtip(rec.data[this.valueField]);
    },
    changeQtip: function(valor) {
        var that = this;
        var desc = '';
        var title = '';
        if (valor && valor != '') {
            if (this.store) {
                if (this.store instanceof Ext.data.Store) {
                    var pos = this.store.find(this.valueField, valor, 0, true, true);
                    pos = (pos < 0) ? this.store.find(this.displayField, valor, 0, true, true) : pos;
                    if (pos >= 0) {
                        desc = (this.extendField) ? this.store.getAt(pos).data[this.extendField] : '';
                        desc = (desc) ? desc : '';
                        title = this.store.getAt(pos).data[this.displayField];
                    }
                } else if (this.store instanceof Array) {
                    if (this.store.length > 0) {
                        for (var i = 0; i < this.store.length; i++) {
                            var value = (this.store[i][0]) ? this.store[i][0] : false;
                            if (value && value == valor) {
                                desc = (this.extendField && this.store[i][2]) ? this.store[i][2] : '';
                                title = (this.store[i][1]) ? this.store[i][1] : '';
                            }
                        }
                    }
                }
            }
        }
        if (this.enableQtip) {
            if (Ext.getCmp('qtip' + this.id)) {
                Ext.getCmp('qtip' + this.id).destroy();
            }
            var html = (this.extendField) ? '<div style=word-wrap:break-word;><b>' + title + '</b>' : '<div style=word-wrap:break-word;><b>' + title + '</b></div>';
            html = (this.extendField && desc != '') ? html + '<br>' + desc : html;
            html = html + '</div>';
            var width = 350;
            if (title.length > 0 || desc.length > 0) {
                if (!desc || title.length > desc.length) {
                    width = (Math.ceil(title.length * 12) > 350) ? 350 : Math.ceil(title.length * 12);
                } else if (desc && title.length < desc.length) {
                    width = (Math.ceil(desc.length * 12) > 350) ? 350 : Math.ceil(desc.length * 12);
                }
            }

            if (this.getValue() != '') {
                new Ext.ToolTip({
                    target: that.id,
                    id: 'qtip' + that.id,
                    maxWidth: 350,
                    width: width,
                    header: false,
                    autoHeight: true,
                    html: html,
                    draggable: false,
                    autoHide: true
                });
            }
        }
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.toolbar
 *@Tipo: Clase
 *@Description:
 */
Ext.ns('Ext.ToolBar');
Ext.ToolBar.searchToolBar = Ext.extend(Ext.Panel, {
    initComponent: function() {
        var el = [];
        this.columnas = 0;
        this.filas = 1;
        this.botones = (this.botones) ? this.botones : [];
        var that = this;
        if (!this.items || this.items.length == 0) {
            if (this.btns) {
                var idCmp = this.id;
                var idBuscar = (that.btns.search.id) ? that.btns.search.id : 'btnBuscarInfoBFilt' + idCmp;
                this.realButtons = [];
                if (this.btns.search) {
                    var btnBuscar = new Ext.Button({
                        id: idBuscar,
                        icon: perfil.dirImg + 'buscar.png',
                        iconCls: 'btn',
                        hotKey: {
                            idGrupo: (that.btns.hotKeyGrupo) ? that.btns.hotKeyGrupo : document,
                            config: {
                                alt: true,
                                key: 98, //ALT+B
                                stopEvent: true
                            }
                        },
                        tooltip: that.btns.search.tooltip ? that.btns.search.tooltip : "Buscar seg&uacute;n criterios <b>(Alt+B)</b>",
                        text: '<u>B</u>uscar',
                        handler: function() {
                            that.btns.search.fn(true);
                        }
                    });
                    this.realButtons.push(btnBuscar);
                }
                if (this.btns.clear) {
                    var previous = (this.btns.clear.prev) ? this.btns.clear.prev : false;
                    var btnClear = new Ext.Button({
                        id: (that.btns.clear.id) ? that.btns.clear.id : 'btnClearInfoFilt' + idCmp,
                        tooltip: "Limpiar criterios de b&uacute;squeda <b>(Alt+L)</b>",
                        icon: perfil.dirImg + 'limpiar.png',
                        text: that.btns.clear.text ? that.btns.clear.text : '',
                        iconCls: 'btn',
                        hotKey: {
                            idGrupo: (that.btns.hotKeyGrupo) ? that.btns.hotKeyGrupo : document,
                            config: {
                                alt: true,
                                key: 108, //ALT+L
                                stopEvent: true
                            }
                        },
                        nextTab: (that.btns.clear.next) ? that.btns.clear.next : false,
                        prevTab: (this.btns.search) ? this.realButtons[0].id : previous,
                        handler: function() {
                            that.limpiarFiltro();
                            that.btns.clear.fn();
                        }
                    });
                    if (this.btns.clear.text) {
                        btnClear = new Ext.Button({
                            id: (that.btns.clear.id) ? that.btns.clear.id : 'btnClearInfoFilt' + idCmp,
                            tooltip: "Limpiar criterios de b&uacute;squeda <b>(Alt+L)</b>",
                            icon: perfil.dirImg + 'limpiar.png',
                            iconCls: 'btn',
                            hotKey: {
                                idGrupo: (that.btns.hotKeyGrupo) ? that.btns.hotKeyGrupo : document,
                                config: {
                                    alt: true,
                                    key: 108, //ALT+L
                                    stopEvent: true
                                }
                            },
                            text: "<u>L</u>impiar",
                            nextTab: (that.btns.clear.next) ? that.btns.clear.next : false,
                            prevTab: (this.btns.search) ? this.realButtons[0].id : previous,
                            handler: function() {
                                that.limpiarFiltro();
                                that.btns.clear.fn();
                            }
                        });
                    }
                    this.realButtons.push(btnClear);
                }
                for (var i = 0; i < this.botones.length; i++) {
                    this.realButtons.push(this.botones[i]);
                }
                this.botones = this.realButtons;
            }
            var cantBtn = (this.botones && this.botones.length > 0) ? this.botones.length : 0;
            this.colBtn = (cantBtn > 3) ? 3 : cantBtn;
            this.filBtn = (cantBtn) ? Math.ceil(cantBtn / 3) : 0;
            var colRest = 8 - this.colBtn;
            this.hiddens = [];
            this.elementosT = [];
            for (var i = 0; i < this.elementos.length; i++) {
                if (this.elementos[i].xtype == 'hidden' || this.elementos[i].hidden) {
                    this.hiddens.push(this.elementos[i]);
                } else {
                    this.elementosT.push(this.elementos[i]);
                    if (this.elementos[i]) {
                        if (this.elementos[i] instanceof Ext.Component) {
                            this.elementos[i].on('specialkey', function(t, e) {
                                if (e.keyCode == 13) {
                                    if (that.btns && that.btns.search && that.btns.search.fn) {
                                        that.btns.search.fn();
                                    } else if (that.botones && that.botones.length > 0) {
                                        if (that.botones[0].handler)
                                            that.botones[0].handler();
                                        else if (that.botones[0].fn)
                                            that.botones[0].fn();
                                    }
                                }
                            });
                        } else if (this.elementos[i].xtype) {
                            if (!this.elementos[i].listeners) {
                                this.elementos[i].listeners = {};
                            }
                            this.elementos[i].listeners.specialkey = function(t, e) {
                                if (e.keyCode == 13) {
                                    if (that.btns && that.btns.search && that.btns.search.fn) {
                                        that.btns.search.fn();
                                    } else if (that.botones && that.botones.length > 0) {
                                        if (that.botones[0].handler)
                                            that.botones[0].handler();
                                        else if (that.botones[0].fn)
                                            that.botones[0].fn();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.elementos = this.elementosT;
            var cantEl = (this.elementos && this.elementos.length > 0) ? this.elementos.length : 0;
            this.colEl = ((colRest - cantEl == 0)) ? colRest : cantEl;
            this.filEl = (cantEl) ? Math.ceil(cantEl / colRest) : 0;
            this.columnas = this.colBtn + this.colEl;
            this.filas = (this.filBtn > this.filEl) ? this.filBtn : this.filEl;
            var arrItems = [];
            if (cantEl > 0) {
                for (var i = 0; i < this.colEl; i++) {
                    arrItems[i] = {
                        columnWidth: this.elementos[i].colWidth,
                        layout: 'form',
                        items: this.pushItems(i, this.colEl)
                    };
                }
            }
            if (cantBtn > 0) {
                for (var i = 0; i < this.colBtn; i++) {
                    arrItems[i + this.colEl] = {
                        columnWidth: '30px',
                        layout: 'form',
                        bodyStyle: 'padding:18px 0 0 0;',
                        items: this.pushButtons(i, this.colBtn)
                    };
                }
            }
            if (this.hiddens.length > 0) {
                for (var i = 0; i < this.hiddens.length; i++) {
                    arrItems.push(this.hiddens[i]);
                }
            }
            this.items = this.setTabOrden(arrItems);
            //this.items      = arrItems;
        } else {
            var arrItems = this.items;
            this.items = this.setTabOrden(arrItems);
        }
        this.layout = 'column';
        this.frame = true;
        this.defaults = {
            layout: 'form',
            border: false,
            labelAlign: 'top',
            buttonAlign: 'right'
        };
        this.height = 65 * this.filas,
                this.cls = 'x-toolbar',
                this.bodyBorder = false;
        this.border = false;
        this.autoScroll = true;
        this.autoShow = true;
        this.hideBorders = true;
        this.region = (this.region) ? this.region : 'north';
        Ext.ToolBar.searchToolBar.superclass.initComponent.call(this);
    },
    limpiarFiltro: function() {
        for (var i = 0; i < this.elementos.length; i++) {
            var cmp = Ext.getCmp(this.elementos[i].id);
            if (cmp) {
                if (cmp instanceof Ext.form.Field) {
                    cmp.setValue('');
                } else if (cmp instanceof Ext.form.ComboBox) {
                    cmp.clearValue();
                }
            }
        }
        for (var i = 0; i < this.hiddens.length; i++) {
            var cmp = Ext.getCmp(this.hiddens[i].id);
            if (cmp) {
                cmp.setValue('');
            }
        }
    },
    pushItems: function(index, cant) {
        var elements = [];
        for (var i = index; i < this.elementos.length; i += cant) {
            elements.push(this.elementos[i]);
        }
        return elements;
    },
    pushButtons: function(index, cant) {
        var btns = [];
        for (var i = index; i < this.botones.length; i += cant) {
            btns.push(this.botones[i]);
        }
        return btns;
    },
    setTabOrden: function(arrItems) {
        for (var i = 0; i < this.filas; i++) {
            for (var j = 0; j < this.columnas; j++) {
                if (arrItems[j].items[i]) {
                    arrItems[j].items[i].tabIndex = PVD.TabController.next();
                }
            }
        }
        return arrItems;
    }
});
Ext.grid.MarkRowExpander = function(config) {
    Ext.apply(this, config);
    this.addEvents({
        beforeexpand: true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });
    Ext.grid.MarkRowExpander.superclass.constructor.call(this);
    if (this.tpl) {
        if (typeof this.tpl == 'string') {
            this.tpl = new Ext.Template(this.tpl);
        }
        this.tpl.compile();
    }

    this.state = {};
    this.bodyContent = {};
};
Ext.extend(Ext.grid.MarkRowExpander, Ext.util.Observable, {
    header: "",
    width: 20,
    sortable: false,
    fixed: true,
    menuDisabled: true,
    dataIndex: '',
    id: 'expander',
    lazyRender: true,
    enableCaching: false,
    getRowClass: function(record, rowIndex, p, ds) {
        p.cols = p.cols - 1;
        var content = this.bodyContent[record.id];
        if (!content && !this.lazyRender) {
            content = this.getBodyContent(record, rowIndex);
        }
        if (content) {
            p.body = content;
        }
        var result = '';
        var style = p.tstyle.split(';');
        style.pop();
        for (var i = 0; i < style.length; i++) {
            if (style[i].indexOf('color') == 0) {
                style.splice(i, 1);
            }
        }
        if (this.inactiveField) {
            if (record.data[this.inactiveField]) {
                style.push('color:red;');
                result = ' element-delete';
            }
        }
        style.push('');
        p.tstyle = style.join(';');
        return this.state[record.id] ? 'x-grid3-row-expanded' + result : 'x-grid3-row-collapsed' + result;
    },
    init: function(grid) {
        this.grid = grid;
        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);
        view.enableRowBody = true;
        grid.on('render', function() {
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    getBodyContent: function(record, index) {
        if (!this.enableCaching) {
            return this.tpl.apply(record.data);
        }
        var content = this.bodyContent[record.id];
        if (!content) {
            content = this.tpl.apply(record.data);
            this.bodyContent[record.id] = content;
        }
        return content;
    },
    onMouseDown: function(e, t) {
        if (t.className == 'x-grid3-row-expander') {
            e.stopEvent();
            var row = e.getTarget('.x-grid3-row');
            this.toggleRow(row);
        }
    },
    renderer: function(v, p, record) {
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>';
    },
    beforeExpand: function(record, body, rowIndex) {
        if (this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false) {
            if (this.tpl && this.lazyRender) {
                body.innerHTML = this.getBodyContent(record, rowIndex);
            }
            return true;
        } else {
            return false;
        }
    },
    toggleRow: function(row) {
        if (typeof row == 'number') {
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },
    expandRow: function(row) {
        if (typeof row == 'number') {
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if (this.beforeExpand(record, body, row.rowIndex)) {
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
    },
    collapseRow: function(row) {
        if (typeof row == 'number') {
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if (this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false) {
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex);
        }
    }
});
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.PVD.comun.window.winLoad
 *@Tipo: Clase
 *@Description: Ventana encargada de enmascarar las peticiones al servidor en la vista con el objetivo de evitar acciones invalidas por parte del usuario.
 */
Ext.ns('Ext.PVD.comun.window');
Ext.PVD.comun.window.winLoad = Ext.extend(Ext.Window, {
    layout: 'border',
    currentTab: false,
    initComponent: function() {
        this.title = (this.title) ? this.title : 'Cargando datos...';
        this.layout = 'fit';
        this.width = (this.width) ? this.width : 300;
        this.height = 50;
        this.closable = false;
        this.resizable = false;
        this.modal = true;
        var mensaje = (this.mensaje) ? this.mensaje : false;
        this.items = [new Ext.ProgressBar({
                text: (mensaje) ? mensaje : "Cargando datos...",
                cls: 'custom'
            })];
        this.closeAction = (this.closeAction) ? this.closeAction : 'hide';
        Ext.PVD.comun.window.winLoad.superclass.initComponent.call(this);
    },
    showMask: function() {
        var titulo = this.items.items[0].text;
        this.items.items[0].wait({
            interval: 200,
            increment: 15,
            fn: function() {
            }
        });
        this.items.items[0].text = titulo;
        this.show();
        this.currentTab = PVD.TabGroup.getCurrentTabGroup();
    },
    hideMask: function() {
        if (this.closeAction == 'destroy')
            this.destroy();
        else
            this.hide();
        PVD.TabGroup.setCurrentTabGroupById(this.currentTab)
    },
    mostrar: function(titulo) {
        this.setTitle(titulo);
        this.items.items[0].wait({
            interval: 200,
            increment: 15,
            fn: function() {
            }
        });
        this.items.items[0].text = titulo;
        this.show();
        this.currentTab = PVD.TabGroup.getCurrentTabGroup();
    },
    ocultar: function(el) {
        this.hide(el);
        PVD.TabGroup.setCurrentTabGroupById(this.currentTab)
    },
    setMensaje: function(newT) {
        this.items.items[0].setText(newT);
    }
});
Ext.reg('comun-winload', Ext.PVD.comun.window.winLoad);
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.HelpButton
 *@Tipo: Clase
 *@Description: Boton ayuda.
 */
Ext.ns('Ext.HelpButton');
Ext.HelpButton = Ext.extend(Ext.Button, {
    initComponent: function() {
        this.help = (this.help) ? this.help : {
            title: 'Ayuda',
            referencia: ''
        };
        this.handler = this.showHelpWindow;
        Ext.HelpButton.superclass.initComponent.call(this);
    },
    showHelpWindow: function() {
        if (help) {
            if (!this.help && !(this.help instanceof Object)) {
                this.help = (this.help) ? this.help : {
                    title: 'Ayuda',
                    referencia: ''
                };
            }
            var title = this.help.title ? this.help.title : 'Ayuda';
            var ref = this.help.referencia ? this.help.referencia : '';
            help.show(title, ref);
        }
    }
});
Ext.reg('help-button', Ext.HelpButton);
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.mostrarMascara
 *@Tipo: Funcion
 *@Description: Muestra la mascara.
 */
Ext.ns('PVD');
PVD.TaskRunner = new Ext.util.TaskRunner();
PVD.TimerCount = {};
PVD.maskControl = {};
PVD.mostrarMascara = function(idMask, title, mensaje, fn) {
    if (Ext.getCmp(idMask)) {
        Ext.getCmp(idMask).hideMask();
    }
    var width = (title.length < 49) ? 300 : title.length * 6;
    var widthM = (!mensaje || mensaje == '' || mensaje.length < 49) ? 300 : mensaje.length * 6 + 12;
    var mask = new Ext.PVD.comun.window.winLoad({
        id: idMask,
        title: "Por favor espere...", //title,
        mensaje: mensaje,
        width: (width > widthM) ? width : widthM,
        closeAction: 'destroy',
        count: 0,
        listeners: {
            show: function(win) {
                PVD.maskControl[idMask] = mask;
                PVD.TimerCount[idMask] = 1;
            },
            destroy: function() {
                if (fn && !this.forced) {
                    fn();
                }
                delete PVD.maskControl[idMask];
                delete PVD.TimerCount[idMask];
            }
        }
    });
    mask.showMask();
    return mask;
}
PVD.taskMaskControl = {
    id: 'taskMaskControl',
    run: function() {
        for (var a in PVD.TimerCount) {
            if (PVD.TimerCount[a])
                PVD.TimerCount[a]++;
            if (PVD.TimerCount[a] == 60) {
                if (PVD.maskControl[a] && PVD.maskControl[a] instanceof Ext.PVD.comun.window.winLoad) {
                    PVD.maskControl[a].forced = true;
                    PVD.maskControl[a].destroy();
                }
                delete PVD.maskControl[a];
                delete PVD.TimerCount[a];
            }
        }
    },
    interval: 2000 //1 second
}
PVD.TaskRunner.start(PVD.taskMaskControl);
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.ocultarMascara
 *@Tipo: Funcion
 *@Description: Oculta la mascara.
 */
PVD.ocultarMascara = function(idMask) {
    var mask = Ext.getCmp(idMask);
    if (mask && mask.isXType('comun-winload'))
        mask.hideMask();
}
//-----------------------------------------------------------------\\
Ext.ns('UCID.acciones');
UCID.acciones = {};
UCID.portal.cargarAccionesPermitidas = function(uri, fn) {
    Ext.Ajax.request({
        url: 'cargarAccionesXUri',
        method: 'POST',
        params: {
            uri: uri
        },
        callback: function(options, success, response) {
            if (success) {
                UCID.acciones[uri] = {};
                var acciones_reportes = Ext.decode(response.responseText);
                var codMsg = acciones_reportes.codMsg;
                if (!codMsg) {
                    for (var i in acciones_reportes) {
                        if (i != 'remove') {
                            UCID.acciones[uri][acciones_reportes[i].abreviatura] = true;
                        }
                    }
                    if (fn)
                        fn();
                }
            }
        }
    });
}


//Funciones para controlar las tabulaciones
Ext.ns('UCID.TabControl')
UCID.TabControl = {
    tabOrderList: {
    }
}
