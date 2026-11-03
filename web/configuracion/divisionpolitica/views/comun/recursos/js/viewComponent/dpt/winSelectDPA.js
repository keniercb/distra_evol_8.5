Ext.ns('Ext.secodena.comun.tree');
Ext.secodena.stPaises;
Ext.secodena.cbPaises;
Ext.secodena.tfFilter;
Ext.secodena.treeFilter;
Ext.secodena.comun.tree.TreeDPA = Ext.extend(Ext.tree.TreePanel,{
    initComponent: function() {
        this.nodo = (this.nodo && this.nodo.getName()) ? this.nodo : null;
        var rootTitle = (this.rootNodo && this.rootNodo.text) ? this.rootNodo.text : false;
        var rootId = (this.rootNodo && this.rootNodo.id) ? this.rootNodo.id : false;
        var idCmp = this.id;
        var rnRootDPA = new Ext.tree.AsyncTreeNode({
            text: (rootTitle) ? rootTitle : Ext.idioma.dpt.lbRootTitle, //perfil.etiquetas.lbRootArbolDispEspec,
            draggable:false,
            id:(rootId)? rootId:'rootNodoDpa'+idCmp
        });
        var objPais = new Pais();
        Ext.secodena.stPaises = new Ext.data.Store({
            url: "/configuracion/divisionpolitica/index.php/gestpais/getnompaises",
            id:'stPaises'+idCmp,
            reader:new Ext.data.JsonReader({
                root:'root',
                id:'rdPaises'+idCmp,
                totalProperty:'cantidad_filas'
            },objPais.getRecord()),
            listeners:{
                beforeload:function(){
                    Secodena.mostrarMascara('dpt02','',Ext.idioma.dpt.msgLoad);
                },
                load:function(){
                    Secodena.ocultarMascara('dpt02');
                    if(this.nodo)
                        Ext.secodena.cbPaises.setValue(this.nodo.get('idpais'));
                }.createDelegate(this)
            }
        });
        Ext.secodena.cbPaises = new Ext.form.ComboBox({
            fieldLabel: Ext.idioma.dpt.lbPaises,
            emptyText:Ext.idioma.dpt.msgEmptyCombo,
            store:Ext.secodena.stPaises,
            id:"cbPaises"+idCmp,
            editable :true,
            triggerAction:'all',
            forceSelection:true,
            displayField:'denominacion',
            valueField:'idpais',
            hiddenName:'idpais',
            mode: 'local',
            width:'250',
            listeners:{
                select:function(cb,rec,ind){
                    objPais.set(rec);
                    if(!this.nodo)
                        this.nodo = new DPA();
                    this.nodo.set('Pais',objPais);
                    this.root.setText(objPais.get('denominacion'));
                    this.root.reload();
                }.createDelegate(this)
            }
        });
        var _this = this;
        Ext.secodena.tfFilter = new Ext.form.TextField({
            width: 200,
            emptyText:Ext.idioma.dpt.msgEmptyCombo,
            listeners:{
                render: function(f){
                    f.el.on('keydown', _this.filterTree, f, {buffer: 350});
                }/*,

                keypress: function(tf,evt){
                    this.filterTree(Ext.secodena.tfFilter.getValue());
                }.createDelegate(this)*/
            }
        });
        Ext.secodena.treeFilter = new Ext.tree.TreeFilter(_this, {
            clearBlank: true,
            autoClear: true
        });
        this.root = rnRootDPA;
        this.autoScroll = true;
        this.autoShow = true;
        if(!this.sinTitulo)
            this.title = Ext.idioma.dpt.lbPanelTitulo;
        this.region = (this.region) ? this.region : "center";
        this.rootVisible = (this.rootVisible) ? true :false;
        if(this.selPais){
            this.tbar = [{
                text:Ext.idioma.dpt.lbPaises+':'
                },Ext.secodena.cbPaises];
        }
        if(this.filter){
            this.tbar = [{
                text:Ext.idioma.dpt.lbPaises+':'
                },Ext.secodena.tfFilter];
        }
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: '/configuracion/divisionpolitica/index.php/gestdpa/gettreedpa',
            listeners:{
                beforeload:function(th,node){
                    th.baseParams.tiporaiz = this.tiporaiz;
                    if(this.nodo && this.nodo.get('idpais')){
                        th.baseParams.idpais = this.nodo.get('idpais');
                    }else if(node.attributes.idpais){
                        th.baseParams.idpais = node.attributes.idpais;
                    }
                }.createDelegate(this)
            }
        });
        this.on('click',function(n,evt){
            if(n!= this.root){
                if(n.attributes.iddpt){
                   this.createObjectDpa(true,n);
                }else{
                    this.createObjectPais(true,n);
                }
                this.seleccionarElemento();
            }
        });
        Ext.secodena.comun.tree.TreeDPA.superclass.initComponent.call(this);
	this.on('render',function(){
            //if(!this.selPais){
                this.root.expand();
            //}
        })
    },
    filterTree:function(tf){
        Ext.secodena.treeFilter.filter(Ext.secodena.tfFilter.getValue());
    },
    seleccionarElemento:function(){
        if(this.nodo.isValid()){
            this.fireEvent('dameseleccion',this,this.nodo);
            return true;
        }else{
            return false;
        }
    },
    createObjectDpa:function(isNode,nodo){
        this.nodo = (this.nodo && this.nodo.getName() == 'DPA')? this.nodo : new DPA();
        if(isNode){
            this.nodo.set({
                iddpt 		: nodo.id,
                denominacion    : nodo.text,
                idnivelestr	: nodo.attributes.idnivelestr,
                nivelestr	: nodo.attributes.nivelestr,
                rutaDenom	: nodo.attributes.rutaDenom,
                ruta		: nodo.attributes.ruta
            });
        }else if(nodo instanceof Object && nodo.getName() == 'DPA'){
            this.nodo.set(nodo.get());
        }
    },
    createObjectPais:function(isNode,nodo){
        this.nodo = (this.nodo && this.nodo.getName() == 'Pais')? this.nodo : new Pais();
        if(isNode){
            this.nodo.set({
                idpais 		: nodo.attributes.idpais,
                denominacion    : nodo.text,
                codigo          : nodo.attributes.codigo,
                alias           : nodo.attributes.alias
            });
        }else if(nodo instanceof Object && nodo.getName() == 'Pais'){
            this.nodo.set(nodo.get());
        }
    },
    loadData:function(){
        if(this.nodo && this.nodo.get('ruta')){
            this.expandPath(this.nodo.ruta);
        }else{
        //this.root.expand();
        }
    },
    load:function(){
        var id = this.id;
        Ext.secodena.stPaises.load();
        if(this.nodo && this.nodo.isValid()){
            Ext.secodena.cbPaises.setValue(this.nodo.get('idpais'));
        //this.loadData();
        }
    }
});
Ext.reg('configsecodena-nomencladores-panelselectdpa', Ext.secodena.comun.tree.TreeDPA);

Ext.ns('Ext.secodena.comun.window');
Ext.secodena.comun.window.winSelectDPA = Ext.extend(Ext.Window,{
    layout:'border',
    initComponent: function() {
        this.id = (this.id) ? this.id  : 'winSelectDPA';
        var idCmp = this.id;
        this.isLoad = false;
        this.nodo = (this.nodo && this.nodo.getName()) ? this.nodo : null;
        var btnAcpDPASel = new Ext.Button({
            disabled:false,
            id:'btnAcpDPASel'+idCmp,
            iconCls:'aceptar',
            text:Ext.idioma.dpt.lbAceptar,
            tooltip: Ext.idioma.dpt.ttipAceptar,
            handler:function(){
                this.aceptarSeleccion(true);
            }.createDelegate(this)
        });
        var btnCancDPASel = new Ext.Button({
            disabled:false,
            id:'btnCancDPASel'+idCmp,
            iconCls:'cancelar',
            text:Ext.idioma.dpt.lbCancelar,
            tooltip: Ext.idioma.dpt.ttipCancelar,
            handler:function(){
                this.destroy();
            }.createDelegate(this)
        });
        var objComuna = new NomComuna();
        this.stComunas = new Ext.data.Store({
            url:"/configuracion/divisionpolitica/index.php/nomconfigsecodena/getcomunas",
            id:'stComunas'+idCmp,
            reader:new Ext.data.JsonReader({
                root:'root',
                id:'rdComunas'+idCmp,
                totalProperty:'cantidad_filas'
            },objComuna.getRecord()),
            listeners:{
                beforeload:function(st){
                    Secodena.mostrarMascara('dpt01', '', Ext.idioma.dpt.msgLoad);
                    if(this.nodo && this.nodo.get('iddpt')){
                        st.baseParams.iddpt = this.nodo.get('iddpt');
                    }
                }.createDelegate(this),
                load:function(st){
                    Secodena.ocultarMascara('dpt01');
                    cbComuna.enable();
                    if(this.nodo){
                        cbComuna.setValue(this.nodo.get('idcomuna'));
                    }
                }.createDelegate(this) 
            }
        });
        var that = this;
        var cbComuna = new Ext.form.ComboBox({
            fieldLabel      : Ext.idioma.dpt.lbComuna,
            emptyText       :Ext.idioma.dpt.lbEmptyCombo,
            store           :that.stComunas,
            tabIndex        :Secodena.TabController.next(),
            id              :"cbComuna"+idCmp,
            extendField     :'descripcion',
            enableQtip      :true,
            triggerAction   :'all',
            editable        :true,
            displayField    :'denominacion',
            valueField      :'idcomuna',
            disabled        :true,
            mode            :'local',
            anchor          :'100%',
            listeners       :{
                select:function(cb,rec,ind){
                    this.nodo.set('NomComuna',rec);
                }.createDelegate(this),
                blur:function(cb){
                    if(cb.getValue() == '')
                        this.nodo.set('NomComuna',null);
                }.createDelegate(this)
            }
        });
        var tfDireccionDPA = new Ext.form.TextArea({
            id:'tfDireccionDPA'+idCmp,
            anchor:"100%",
            height:60,
            fieldLabel:Ext.idioma.dpt.lbDireccion,
            name:'direccion',
            value:(this.nodo) ? this.nodo.get('direccion') : '',
            listeners:{
                change:function(tf,newt,oldt){
                    this.nodo.set('direccion',newt);
                }.createDelegate(this)
            }
        });
		
        var fpDatosDireccion = new Ext.form.FormPanel({
            layout: 'form',
            labelAlign:'top',
            frame:true,
            height:155,
            bodyBorder:false,
            border:false,
            autoScroll:false,
            autoShow:true,
            hideBorders:true,
            region:'south',
            items:[
            cbComuna,
            tfDireccionDPA]
        });
        var nodoSel = this.nodo;
        var tipoRaiz= this.tiporaiz;
        var selPais = this.selPais;
        var filter  = this.filter;
        var titleNode = this.rootNodo.text;
        var idNode = this.rootNodo.id;
        var sinTitulo = this.sinTitulo;
        var tpDpaSeleccion = new Ext.secodena.comun.tree.TreeDPA({
            id:'tpTreeDPA'+idCmp,
            tiporaiz:tipoRaiz,
            selPais :selPais,
            filter  :filter,
            sinTitulo : sinTitulo,
            rootNodo: {
                id:idNode,
                text:titleNode
            },
            nodo:nodoSel
        });
        tpDpaSeleccion.on('dameseleccion',function(obj,data){
            if(data && data.getName()){
                this.nodo = data;
                if(this.locate){
                    cbComuna.clearValue();
                    cbComuna.disable();
                    if(data.getName() == 'Pais'){
                        this.stComunas.removeAll();
                    }else{
                        this.stComunas.load();
                    }
                }
            }
        }.createDelegate(this));
        this.modal	= true;
        this.layout='border';
        this.id=(this.id) ? this.id : 'wnSeleccionaDPA'+idCmp;
        this.closeAction='destroy';
        this.title = (this.title) ? this.title : Ext.idioma.dpt.lbWinTitulo;
        this.resizable=false;
        this.width=(this.width) ? this.width : 410;
        this.height=(this.height) ? this.height : 500;
        this.buttons=[btnCancDPASel,btnAcpDPASel];
        if(this.locate){
            this.items = [tpDpaSeleccion,fpDatosDireccion];
        }else{
            this.items = [tpDpaSeleccion];
        }
        Ext.secodena.comun.window.winSelectDPA.superclass.initComponent.call(this);
        this.addEvents({
            'dameseleccion':true
        });
        this.on('show',function(){
            if(!this.isLoad){
                this.load();
            }
        });
    },
    aceptarSeleccion:function(btn){
        if(this.nodo){
            this.fireEvent('dameseleccion',this,this.nodo,btn);
        }else{
            return false;
        }
    },
    load:function(){
        this.items.items[0].load();
        if(this.nodo && this.nodo.isValid()){
            if(this.nodo.getName() == 'DPA')
                this.stComunas.load();
        }else
            this.items.items[0].load();
    },
    getSeleccion:function(){
        return this.nodo;
    }
});
Ext.reg('configsecodena-nomencladores-winselectdpa', Ext.secodena.comun.window.winSelectDPA);