/***
 *@PACKAGE : GRUPOS DE TABULACION (GruposTabulacion.js)
 ***/
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Secodena.HotKeys
 *@Tipo: Array
 *@Description: Almacena los metodos abreviados del teclado por componente.
 **/
Ext.ns('Secodena.HotKeys');
Secodena.HotKeys.Elementos = {};
Secodena.HotKeys.Controller = {
    hotKeyActive:[],
    statusStack :[],
    currentStatus:0,
    //Funcionalidades para el trabajo con los KeyMaps
    existeKeyMap:function(index){
        return (Secodena.HotKeys.Elementos[index] && Secodena.HotKeys.Elementos[index] instanceof Ext.KeyMap) ? true : false;
    },
    addHotKeyControlFromConf:function(index,config,event){
        if(this.existeKeyMap(index)){
            Secodena.HotKeys.Elementos[index].addBinding(config);
        }else{
            Secodena.HotKeys.Elementos[index] = new Ext.KeyMap(index, config,event);
        }
        this.disableHotKeyControl(index,true);
    },
    enableHotKeyControl:function(index,save){
        if(save)
            this.saveStatus(false);
        if(Secodena.HotKeys.Elementos[index] && Secodena.HotKeys.Elementos[index] instanceof Ext.KeyMap)
            Secodena.HotKeys.Elementos[index].enable();
        if(save)
            this.saveStatus(true);
    },
    enableOnlyThis:function(index){
        this.saveStatus(false);
        for(var campo in Secodena.HotKeys.Elementos){
            this.disableHotKeyControl(campo,false);
        }
        this.enableHotKeyControl(index);
        this.saveStatus(true);
    },
    enableOnlyThose:function(arrIndex){
        this.saveStatus(false);
        for(var campo in Secodena.HotKeys.Elementos){
            this.disableHotKeyControl(campo,false);
        }
        for(var i = 0 ; i < arrIndex.length ; i ++){
            this.enableHotKeyControl(arrIndex[i]);
        }
        this.saveStatus(true);
    },
    disableHotKeyControl:function(index,save){
        if(save)
            this.saveStatus(false);
        if(Secodena.HotKeys.Elementos[index] && Secodena.HotKeys.Elementos[index] instanceof Ext.KeyMap){
            Secodena.HotKeys.Elementos[index].disable();
        }
        if(save)
            this.saveStatus(true);
    },
    disableAll:function(){
        this.saveStatus(false);
        for(var campo in Secodena.HotKeys.Elementos){
            this.disableHotKeyControl(campo, false);
        }
        this.saveStatus(true);
    },
    getHotKeyControlActivo:function(){
        return this.hotKeyActive;
    },
    findHotKeyControl:function(identificador){

    },
    rollBackStatus:function(){
        this.currentStatus --;
        this.statusStack[this.currentStatus].activo = false;
        this.hotKeyActive = this.statusStack[this.currentStatus].elementos;
        this.enableOnlyThose(this.hotKeyActive);
    },
    sincronizarActivos:function(){
        this.hotKeyActive = [];
        for(var campo in Secodena.HotKeys.Elementos){
            if(Secodena.HotKeys.Elementos[campo] && Secodena.HotKeys.Elementos[campo] instanceof Ext.KeyMap && Secodena.HotKeys.Elementos[campo].isEnabled()){
                this.hotKeyActive.push(campo);
            }
        }
    },
    saveStatus:function(activar){
        this.sincronizarActivos();
        this.statusStack.push({activo:(activar ? true : false),elementos:this.hotKeyActive});
        if(activar){
            this.statusStack[this.currentStatus].activo = false;
            this.currentStatus = this.statusStack.length - 1;
        }
    }
    //Funcionalidades para el trabajo con las configuraciones previas de los KeyMaps

};

/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Secodena.TabController
 *@Tipo: Objeto
 *@Description: Objeto usado para la asignacion de indices de tabulacion .
 */
Ext.ns('Secodena.TabController');
Secodena.TabController = {
    tabIndexActual : 0,
    current:function(){
        return this.tabIndexActual;
    },
    next:function(){
        this.tabIndexActual++;
        return this.tabIndexActual;
    },
    tabOrden:function(componentes){
        if(componentes && componentes.length > 0){
            for(var i = 0 ; i < componentes.length ; i ++){
                if(componentes[i] instanceof Object){
                    var cmp = Ext.getCmp(componentes[i].id);
                    if(cmp){
                        if(!cmp.tabIndex || componentes[i].force || componentes[i].index){
                            if(componentes[i].index){
                                cmp.tabIndex = componentes[i].index;
                            }else{
                                cmp.tabIndex = this.next();
                            }
                            cmp.initComponent();
                        }
                    }
                }else{
                    var cmp = Ext.getCmp(componentes[i]);
                    if(cmp){
                        if(!cmp.tabIndex){
                            cmp.tabIndex = this.next();
                            cmp.initComponent();
                        }
                    }
                }
            }
        }
    },
    increment:function(val){
        this.tabIndexActual += val;
    },
    setValue:function(val){
        this.tabIndexActual = val;
    },
    reset:function(){
        this.tabIndexActual = 0;
    }
};

Ext.ns('Secodena.Key');
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Secodena.Key.Controller
 *@Tipo: Variables
 *@Description: Variables para el manejo de la opresion de teclas.
 */
Secodena.Key.ShiftPress = false;
Secodena.Key.TabPress = false;
Secodena.Key.Process = false;
Secodena.Key.Other = 0;
Secodena.Key.ShiftTabPress = false;
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Secodena.Key.Controller
 *@Tipo: Objeto
 *@Description: Objeto encargado de redefinir el evento de opresion de las teclas usadas para la tabulacion.
 */
Secodena.Key.Controller = {
    activo : false,
    keyDown:function(evt){
        if(Secodena.Key.Controller.activo){
            if(evt.keyCode == 16){
                Secodena.Key.TabPress = false;
                Secodena.Key.Process = false;
                Secodena.Key.ShiftPress = true;
            }else if(evt.keyCode == 9 && !Secodena.Key.Other){
                Secodena.Key.Controller.stopEvent(evt);//pendiente
                Secodena.Key.TabPress = true;
                Secodena.Key.Process = true;
                if(Secodena.Key.ShiftPress){
                    Secodena.Key.ShiftTabPress = true;
                }
            } else if (evt.keyCode != 9 && evt.keyCode != 16){
                Secodena.Key.Other++;
                Secodena.Key.Process = false;
                Secodena.Key.ShiftTabPress = false;
                Secodena.Key.TabPress = false;
            }else{
                Secodena.Key.Process = false;
                Secodena.Key.ShiftTabPress = false;
                Secodena.Key.TabPress = false;
            }
        }
    },
    keyPress:function(evt){
        if(Secodena.Key.Controller.activo){
            if(Secodena.Key.TabPress){
                Secodena.Key.Controller.stopEvent(evt);
            }
        }
    },
    keyUp:function(evt){
        if(Secodena.Key.Controller.activo){
            if(evt.keyCode == 16){
                if(Secodena.Key.ShiftTabPress){
                    Secodena.Key.Controller.stopEvent(evt);
                }
                Secodena.Key.ShiftPress = false;
                Secodena.Key.ShiftTabPress = false;
                Secodena.Key.TabPress = false;
            }
            Secodena.Key.Controller.keyHandler(evt);
            if(evt.keyCode == 9 || evt.keyCode == 16){
                Secodena.Key.Controller.stopEvent(evt);
                Secodena.Key.TabPress = false;
                Secodena.Key.ShiftTabPress = false;
            }else{
                Secodena.Key.Other--;
                Secodena.Key.ShiftPress = false;
                Secodena.Key.ShiftTabPress = false;
                Secodena.Key.TabPress = false;
            }
        }
    },
    activate:function(){
        Secodena.Key.Controller.activo = true;
        document.onkeydown = Secodena.Key.Controller.keyDown;
        document.onkeypress = Secodena.Key.Controller.keyPress;
        document.onkeyup = Secodena.Key.Controller.keyUp;
    },
    deactivate:function(){
        Secodena.Key.Controller.activo = false;
    },
    stopEvent:function(evt){
        if( document.all ){
            window.event.cancelBubble = true;
        }else{
            evt.stopPropagation();
        }
    },
    keyHandler:function(event) {
        if(Secodena.Key.TabPress || Secodena.Key.ShiftTabPress){
            Secodena.Key.Controller.stopEvent(event);
            Secodena.Key.Process = false;
            if(Secodena.Key.ShiftTabPress && !Secodena.Key.Process){
                return Secodena.TabGroup.shiftTabPress(event);
            }else{
                return Secodena.TabGroup.tabPress(event);
            }
        }
        return true;
    }
}

/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Secodena.TabGroup
 *@Tipo: Objeto
 *@Description: Objeto encargado de crear gupos de tabulacion dentro de la intefaz.
 */
Ext.ns('Secodena.TabGroup');
Secodena.TabGroup = {
    listTabGroup    :{},
    pressed         :false,
    currentTabGroup :false,
    createTabGroup:function(tabContainer){
        var idTabGroup = tabContainer.id;
        tabContainer.on('render',function(){
            Secodena.TabGroup.setPropertiesElements(idTabGroup);
        });
        if(idTabGroup){
            if(!this.listTabGroup[idTabGroup]){
                //Secodena.TabGroup.setPropertiesContainer(tabContainer);
                this.listTabGroup[idTabGroup] = {
                    currentTab:0,
                    elementos:[]
                };
            }
            this.currentTabGroup = idTabGroup;
            return true;
        }
        return false;
    },
    getCurrentTabGroup:function(){
        return (this.currentTabGroup) ? this.listTabGroup[this.currentTabGroup] : false;
    },
    getCurrentTabGroupIndex:function(){
        return this.currentTabGroup;
    },
    hasElementos:function(tabGroup){
        return (tabGroup && tabGroup.elementos.length > 0) ? true : false;
    },
    setCurrentTabGroup:function(tabContainer){
        if(tabContainer){
            this.createTabGroup(tabContainer);
            Secodena.Key.Controller.activate();
        }else{
            this.currentTabGroup = false;
            Secodena.Key.Controller.deactivate();
        }
    },
    setCurrentTabGroupById:function(idTabGroup){
        if(idTabGroup){
            if(this.listTabGroup[idTabGroup]){
                Secodena.Key.Controller.activate();
                this.currentTabGroup = idTabGroup;
            }else{
                this.currentTabGroup = false;
                Secodena.Key.Controller.deactivate();
            }
        }else{
            this.currentTabGroup = false;
            Secodena.Key.Controller.deactivate();
        }
    },
    setTabGroup:function(tabContainer,elementos){
        var idTabGroup = tabContainer.id;
        if(this.createTabGroup(tabContainer)){
            Secodena.Key.Controller.activate();
            if(elementos.length > 0){
                for(var i = 0 ; i < elementos.length ; i ++){
                    if(elementos[i] instanceof Ext.Component){
                        if(!this.existeElemento(idTabGroup, elementos[i].id)){
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                            var tabIndex = Secodena.TabController.next();
                            Secodena.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
                        }
                    }else if(elementos[i].id){
                        if(!this.existeElemento(idTabGroup, elementos[i].id)){
                            var tabIndex = Secodena.TabController.next();
                            Secodena.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                        }
                    }else{
                        if(!this.existeElemento(idTabGroup, elementos[i])){
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i]);
                        }
                    }
                }
            }
        }
    },
    setTabIndexEl:function(idTabGroup,el,tabInd){
        if(el instanceof Ext.Component){
            el.on('render',function(cmp){
                document.getElementById(cmp.id).tabIndex = tabInd;
                document.getElementById(cmp.id).onclick = function(){
                    var position = Secodena.TabGroup.existeElemento(idTabGroup, el.id);
                    Secodena.TabGroup.setTabPosition(idTabGroup, position);
                }
            });

        }else if(el.id){
            el.tabIndex = tabInd;
        }
    },
    getTabGroup:function(tabContainer){
        return (tabContainer.id) ? this.listTabGroup[tabContainer.id] : false;
    },
    getTabGroupById:function(idTabGroup){
        return (idTabGroup && this.listTabGroup[idTabGroup]) ? this.listTabGroup[idTabGroup] : false;
    },
    addElement:function(tabContainer,elementos){
        var idTabGroup = tabContainer.id;
        if(this.createTabGroup(tabContainer) && elementos){
            if(elementos instanceof Array){
                if(elementos.length > 0){
                    for(var i = 0 ; i < elementos.length ; i ++){
                        if(elementos[i] instanceof Ext.Component){
                            if(!this.existeElemento(idTabGroup, elementos[i].id)){
                                this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                                var tabIndex = Secodena.TabController.next();
                                Secodena.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
                            }
                        }else if(elementos[i].id){
                            if(!this.existeElemento(idTabGroup, elementos[i].id)){
                                var tabIndex = Secodena.TabController.next();
                                Secodena.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
                                this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                            }
                        }else{
                            if(!this.existeElemento(idTabGroup, elementos[i])){
                                this.listTabGroup[idTabGroup].elementos.push(elementos[i]);
                            }
                        }
                    }
                }
            }else{
                if(elementos instanceof Ext.Component){
                    if(!this.existeElemento(idTabGroup, elementos.id)){
                        this.listTabGroup[idTabGroup].elementos.push(elementos.id);
                        var tabIndex = Secodena.TabController.next();
                        Secodena.TabGroup.setTabIndexEl(idTabGroup,elementos, tabIndex);
                    }
                }else if(elementos.id){
                    if(!this.existeElemento(idTabGroup, elementos.id)){
                        var tabIndex = Secodena.TabController.next();
                        Secodena.TabGroup.setTabIndexEl(idTabGroup,elementos, tabIndex);
                        this.listTabGroup[idTabGroup].elementos.push(elementos.id);
                    }
                }else{
                    if(!this.existeElemento(idTabGroup, elementos)){
                        this.listTabGroup[idTabGroup].elementos.push(elementos);
                    }
                }
            }
            return true;
        }
        return false;
    },
    existeElemento:function(idTabGroup,element){
        if(this.listTabGroup[idTabGroup]){
            if(this.listTabGroup[idTabGroup].elementos.length > 0){
                for(var i = 0 ; i < this.listTabGroup[idTabGroup].elementos.length ; i ++){
                    if(this.listTabGroup[idTabGroup].elementos[i] == element)
                        return i;
                }
                return false;
            }else{
                return false;
            }
        }
        return false;
    },
    resetTabGroup:function(tabContainer){
        var idTabGroup = tabContainer;
        if(tabContainer.id)
            idTabGroup = tabContainer.id;
        if(this.createTabGroup(tabContainer)){
            this.listTabGroup[idTabGroup].currentTab = 0;
        }
    },
    setTabPosition:function(idTabGroup,position){
        if(!this.pressed)
            this.listTabGroup[idTabGroup].currentTab = position;
    },
    incrementTabIndex:function(){
        if(this.getCurrentTabGroup()){
            if(this.getCurrentTabGroup().elementos.length > 0){
                this.listTabGroup[this.currentTabGroup].currentTab++;
                if(this.getCurrentTabGroup().elementos.length == this.getCurrentTabGroup().currentTab)
                    this.listTabGroup[this.currentTabGroup].currentTab = 0;
            }
            return true;
        }else
            return false;
    },
    decrementTabIndex:function(){
        if(this.getCurrentTabGroup()){
            if(this.getCurrentTabGroup().elementos.length > 0){
                this.listTabGroup[this.currentTabGroup].currentTab--;
                if(this.getCurrentTabGroup().currentTab == -1)
                    this.getCurrentTabGroup().currentTab = this.getCurrentTabGroup().elementos.length-1;
            }
            return true;
        }else
            return false;
    },
    tabPress:function(evt){
        this.pressed = true;
        if(this.getCurrentTabGroup() && this.tabIsEnabled(this.currentTabGroup)){
            var tabGroup = this.getCurrentTabGroup();
            this.incrementTabIndex();
            if(Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]) && !Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).disabled){
                Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).focus();
            }else{
                this.incrementTabIndex();
                this.tabPress(evt);
            }
            this.pressed = false;
            return true;
        }
        this.pressed = false;
        return false;
    },
    shiftTabPress:function(evt){
        this.pressed = true;
        if(this.getCurrentTabGroup() && this.tabIsEnabled(this.currentTabGroup)){
            var tabGroup = this.getCurrentTabGroup();
            this.decrementTabIndex();
            if(Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]) && !Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).disabled){
                Ext.getCmp(tabGroup.elementos[tabGroup.currentTab]).focus();
            }else{
                this.decrementTabIndex();
                this.shiftTabPress(evt);
            }
            this.pressed = false;
            return true;
        }
        this.pressed = false;
        return false;
    },
    tabIsEnabled:function(idTabGroup){
        if(this.listTabGroup[idTabGroup] && this.listTabGroup[idTabGroup].elementos.length > 0){
            for(var i = 0 ; i < this.listTabGroup[idTabGroup].elementos.length ; i ++){
                var tabGroup    = this.listTabGroup[idTabGroup];
                if(Ext.getCmp(tabGroup.elementos[i]) && !Ext.getCmp(tabGroup.elementos[i]).disabled && !Ext.getCmp(tabGroup.elementos[i]).hidden){
                    return true;
                }
            }
            return false;
        }
        return false;
    },
    stop:function(ascii,evt){
        evt.stopEvent();
    },
    setPropertiesContainer:function(tabContainer){
        tabContainer.on('activate',function(){
            Secodena.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('show',function(){
            Secodena.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('afterlayout',function(){
            Secodena.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('beforedestroy',function(){
            if(this.getCurrentTabGroup() == tabContainer.id)
                Secodena.TabGroup.setCurrentTabGroup(false);
        });
        tabContainer.on('deactivate',function(){
            if(this.getCurrentTabGroup() == tabContainer.id)
                Secodena.TabGroup.setCurrentTabGroup(false);
        });
        tabContainer.on('destroy',function(){
            if(this.getCurrentTabGroup() == tabContainer.id)
                Secodena.TabGroup.setCurrentTabGroup(false);
        });
    },
    setPropertiesElements:function(idTabGroup){
        var tabGroup = Secodena.TabGroup.getTabGroupById(idTabGroup);
        if(tabGroup && Secodena.TabGroup.hasElementos(tabGroup)){
            for(var i = 0 ; i < tabGroup.elementos.length ; i++ ){
                var el = tabGroup.elementos[i];
                var cmp = document.getElementById(el);
                if(cmp){
                    var position = Secodena.TabGroup.existeElemento(idTabGroup, el);
                    cmp.onclick = function(){
                        Secodena.TabGroup.setTabPosition(idTabGroup, position);
                    }
                }
            }
        }
    }
};


/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Secodena.KeyMap
 *@Tipo: Funcion
 *@Description: Permite el manejo de las teclas calientes.
 */
Ext.ns('Secodena.KeyMap');
Secodena.KeyMap = function(options){
    var eventKeys = [];
    if(options && options.config > 0 && options['config'].length > 0){
        for(var i = 0 ; i < options['config'].length ; i ++){
            var opt = options.config[i];
            if(Ext.getCmp(opt.btn) && ( Ext.getCmp(opt.btn).isXtype('button') || Ext.getCmp(opt.btn).isXtype('tbbutton') )){
                var fn      = Ext.getCmp(opt.btn).handler;
                var alt     = (opt.alt) ? true : false;
                var shift   = (opt.alt) ? true : false;
                var ctrl    = (opt.alt) ? true : false;
                var key     = opt.key;
                eventKeys.push({
                    ctrl    : ctrl,
                    shift   : shift,
                    alt     : alt,
                    key     : key,
                    fn      : fn
                });
            }
        }
        var element     = options.el ? options.el : document;
        Secodena.HotKeys.Elementos = new Ext.KeyMap(element, eventKeys);
    }
};
//-------------------------------------------\\