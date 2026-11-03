/***
 *@PACKAGE : GRUPOS DE TABULACION (GruposTabulacion.js)
 ***/
/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: PVD.HotKeys
 *@Tipo: Array
 *@Description: Almacena los metodos abreviados del teclado por componente.
 **/
Ext.ns('PVD.HotKeys');
PVD.HotKeys.Elementos = {};
PVD.HotKeys.Controller = {
    hotKeyActive:[],
    statusStack :[],
    currentStatus:0,
    //Funcionalidades para el trabajo con los KeyMaps
    existeKeyMap:function(index){
        return (PVD.HotKeys.Elementos[index] && PVD.HotKeys.Elementos[index] instanceof Ext.KeyMap) ? true : false;
    },
    addHotKeyControlFromConf:function(index,config,event){
        if(this.existeKeyMap(index)){
            PVD.HotKeys.Elementos[index].addBinding(config);
        }else{
            PVD.HotKeys.Elementos[index] = new Ext.KeyMap(index, config,event);
        }
        this.disableHotKeyControl(index,true);
    },
    enableHotKeyControl:function(index,save){
        if(save)
            this.saveStatus(false);
        if(PVD.HotKeys.Elementos[index] && PVD.HotKeys.Elementos[index] instanceof Ext.KeyMap)
            PVD.HotKeys.Elementos[index].enable();
        if(save)
            this.saveStatus(true);
    },
    enableOnlyThis:function(index){
        this.saveStatus(false);
        for(var campo in PVD.HotKeys.Elementos){
            this.disableHotKeyControl(campo,false);
        }
        this.enableHotKeyControl(index);
        this.saveStatus(true);
    },
    enableOnlyThose:function(arrIndex){
        this.saveStatus(false);
        for(var campo in PVD.HotKeys.Elementos){
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
        if(PVD.HotKeys.Elementos[index] && PVD.HotKeys.Elementos[index] instanceof Ext.KeyMap){
            PVD.HotKeys.Elementos[index].disable();
        }
        if(save)
            this.saveStatus(true);
    },
    disableAll:function(){
        this.saveStatus(false);
        for(var campo in PVD.HotKeys.Elementos){
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
        for(var campo in PVD.HotKeys.Elementos){
            if(PVD.HotKeys.Elementos[campo] && PVD.HotKeys.Elementos[campo] instanceof Ext.KeyMap && PVD.HotKeys.Elementos[campo].isEnabled()){
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
 *@Name: PVD.TabController
 *@Tipo: Objeto
 *@Description: Objeto usado para la asignacion de indices de tabulacion .
 */
Ext.ns('PVD.TabController');
PVD.TabController = {
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
    activo : false,
    keyDown:function(evt){
        if(PVD.Key.Controller.activo){
            if(evt.keyCode == 16){
                PVD.Key.TabPress = false;
                PVD.Key.Process = false;
                PVD.Key.ShiftPress = true;
            }else if(evt.keyCode == 9 && !PVD.Key.Other){
                PVD.Key.Controller.stopEvent(evt);//pendiente
                PVD.Key.TabPress = true;
                PVD.Key.Process = true;
                if(PVD.Key.ShiftPress){
                    PVD.Key.ShiftTabPress = true;
                }
            } else if (evt.keyCode != 9 && evt.keyCode != 16){
                PVD.Key.Other++;
                PVD.Key.Process = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }else{
                PVD.Key.Process = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }
        }
    },
    keyPress:function(evt){
        if(PVD.Key.Controller.activo){
            if(PVD.Key.TabPress){
                PVD.Key.Controller.stopEvent(evt);
            }
        }
    },
    keyUp:function(evt){
        if(PVD.Key.Controller.activo){
            if(evt.keyCode == 16){
                if(PVD.Key.ShiftTabPress){
                    PVD.Key.Controller.stopEvent(evt);
                }
                PVD.Key.ShiftPress = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }
            PVD.Key.Controller.keyHandler(evt);
            if(evt.keyCode == 9 || evt.keyCode == 16){
                PVD.Key.Controller.stopEvent(evt);
                PVD.Key.TabPress = false;
                PVD.Key.ShiftTabPress = false;
            }else{
                PVD.Key.Other--;
                PVD.Key.ShiftPress = false;
                PVD.Key.ShiftTabPress = false;
                PVD.Key.TabPress = false;
            }
        }
    },
    activate:function(){
        PVD.Key.Controller.activo = true;
        document.onkeydown = PVD.Key.Controller.keyDown;
        document.onkeypress = PVD.Key.Controller.keyPress;
        document.onkeyup = PVD.Key.Controller.keyUp;
    },
    deactivate:function(){
        PVD.Key.Controller.activo = false;
    },
    stopEvent:function(evt){
        if( document.all ){
            window.event.cancelBubble = true;
        }else{
            evt.stopPropagation();
        }
    },
    keyHandler:function(event) {
        if(PVD.Key.TabPress || PVD.Key.ShiftTabPress){
            PVD.Key.Controller.stopEvent(event);
            PVD.Key.Process = false;
            if(PVD.Key.ShiftTabPress && !PVD.Key.Process){
                return PVD.TabGroup.shiftTabPress(event);
            }else{
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
    listTabGroup    :{},
    pressed         :false,
    currentTabGroup :false,
    createTabGroup:function(tabContainer){
        var idTabGroup = tabContainer.id;
        tabContainer.on('render',function(){
            PVD.TabGroup.setPropertiesElements(idTabGroup);
        });
        if(idTabGroup){
            if(!this.listTabGroup[idTabGroup]){
                //PVD.TabGroup.setPropertiesContainer(tabContainer);
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
            PVD.Key.Controller.activate();
        }else{
            this.currentTabGroup = false;
            PVD.Key.Controller.deactivate();
        }
    },
    setCurrentTabGroupById:function(idTabGroup){
        if(idTabGroup){
            if(this.listTabGroup[idTabGroup]){
                PVD.Key.Controller.activate();
                this.currentTabGroup = idTabGroup;
            }else{
                this.currentTabGroup = false;
                PVD.Key.Controller.deactivate();
            }
        }else{
            this.currentTabGroup = false;
            PVD.Key.Controller.deactivate();
        }
    },
    setTabGroup:function(tabContainer,elementos){
        var idTabGroup = tabContainer.id;
        if(this.createTabGroup(tabContainer)){
            PVD.Key.Controller.activate();
            if(elementos.length > 0){
                for(var i = 0 ; i < elementos.length ; i ++){
                    if(elementos[i] instanceof Ext.Component){
                        if(!this.existeElemento(idTabGroup, elementos[i].id)){
                            this.listTabGroup[idTabGroup].elementos.push(elementos[i].id);
                            var tabIndex = PVD.TabController.next();
                            PVD.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
                        }
                    }else if(elementos[i].id){
                        if(!this.existeElemento(idTabGroup, elementos[i].id)){
                            var tabIndex = PVD.TabController.next();
                            PVD.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
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
                    var position = PVD.TabGroup.existeElemento(idTabGroup, el.id);
                    PVD.TabGroup.setTabPosition(idTabGroup, position);
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
                                var tabIndex = PVD.TabController.next();
                                PVD.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
                            }
                        }else if(elementos[i].id){
                            if(!this.existeElemento(idTabGroup, elementos[i].id)){
                                var tabIndex = PVD.TabController.next();
                                PVD.TabGroup.setTabIndexEl(idTabGroup,elementos[i], tabIndex);
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
                        var tabIndex = PVD.TabController.next();
                        PVD.TabGroup.setTabIndexEl(idTabGroup,elementos, tabIndex);
                    }
                }else if(elementos.id){
                    if(!this.existeElemento(idTabGroup, elementos.id)){
                        var tabIndex = PVD.TabController.next();
                        PVD.TabGroup.setTabIndexEl(idTabGroup,elementos, tabIndex);
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
            PVD.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('show',function(){
            PVD.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('afterlayout',function(){
            PVD.TabGroup.setCurrentTabGroup(tabContainer);
        });
        tabContainer.on('beforedestroy',function(){
            if(this.getCurrentTabGroup() == tabContainer.id)
                PVD.TabGroup.setCurrentTabGroup(false);
        });
        tabContainer.on('deactivate',function(){
            if(this.getCurrentTabGroup() == tabContainer.id)
                PVD.TabGroup.setCurrentTabGroup(false);
        });
        tabContainer.on('destroy',function(){
            if(this.getCurrentTabGroup() == tabContainer.id)
                PVD.TabGroup.setCurrentTabGroup(false);
        });
    },
    setPropertiesElements:function(idTabGroup){
        var tabGroup = PVD.TabGroup.getTabGroupById(idTabGroup);
        if(tabGroup && PVD.TabGroup.hasElementos(tabGroup)){
            for(var i = 0 ; i < tabGroup.elementos.length ; i++ ){
                var el = tabGroup.elementos[i];
                var cmp = document.getElementById(el);
                if(cmp){
                    var position = PVD.TabGroup.existeElemento(idTabGroup, el);
                    cmp.onclick = function(){
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
PVD.KeyMap = function(options){
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
        PVD.HotKeys.Elementos = new Ext.KeyMap(element, eventKeys);
    }
};

Ext.ns('PVD.IncluirJS');

PVD.IncluirJS = function (file_path){
 /*var j = document.createElement("script");
 j.type = "text/javascript";
 j.src = file_path;
 document.body.appendChild(j);
 */
 var j = document.createElement("script");
	j.setAttribute("type", "text/javascript");
	j.setAttribute("src", file_path);//console.info(document.getElementsByTagName("head")[0]);
	document.getElementsByTagName("head")[0].appendChild(j);
}

Ext.ns('PVD.IncluirJSUnaVez');

PVD.IncluirJSUnaVez = function (file_path){
	var regex = /^p/;
	var res = regex.test(file_path);
	if(res){
		file_path = '/'+file_path;
	}   
	 var sc = document.getElementsByTagName("script");
	 for (var x in sc){
		if (sc[x].src != null && sc[x].src.indexOf(file_path) != -1){
			return;
		}    
	 }
 PVD.IncluirJS(file_path);
}

Ext.reg('twntrigger', Ext.form.TwinTriggerField);
//-------------------------------------------\\
