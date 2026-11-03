Ext.define('Packed.controller.Packs', {
    extend: 'Ext.app.Controller',
    require: [        
    ],
    stores: [
       
    ],
    model: [
       
    ],
    views: [],
    refs: [{
        ref: 'principal',
        selector: 'principal'
    }, {
        ref: 'newPack',
        selector: 'newPack'
    }, {
        ref: 'autentication',
        selector: 'autentication'
    }, {
        ref: 'newRepo',
        selector: 'newRepo'
    }],

    init: function () {
        var _this = this;
        nodeSelected = '';
        nodeClick = '';

        _this.control({
            'principal': {
                render: _this.onRenderPrincipal
            },
            'principal button[action=createPack]': {
                click: _this.onClickNewPack
            },
            'principal button[action=deletePack]': {
                click: _this.onClickDeletePack
            },
            'principal grid[name=gridPacked]': {
                itemclick: _this.onItemClickGridPacked,
                render: _this.renderGridPacked
            },
            'principal button[action=filtrarGridPack]': {
                click: _this.filtrarGridPack
            },
            'principal button[action=limpiarFiltroGridPack]': {
                click: _this.limpiarFiltroGridPack
            },
            'principal button[action=publicarPack]': {
                click: _this.onClickpublicarPack
            },
            'principal button[action=configurarGestor]': {
                click: _this.onClickConfigurar
            },
            'principal textfield[name=searchFieldPack]': {
                change: _this.hablitarBotones
            },
            'newRepo button[action=comprobarUrl]': {
                click: _this.onClickComprobar
            },
            'newPack textfield[name=dirurl]': {
                dirtychange: _this.checkValueComprobar
            },
            'newPack textfield[name=filtroTree]': {
                change: _this.filtrarTree
            },
            'newPack button[action=closeWin]': {
                click: _this.closeWin
            },
            'newPack button[action=submitFormCreatePack]': {
                click: _this.submitFormCreatePack
            },
            'newPack button[action=addRepositorio]': {
                click: _this.addRepositorio
            },
            'newPack': {
                render: _this.onRenderAddPack,
                beforeclose: _this.onBeforecloseAddPack
            },
            'newPack treepanel[name=treeSvn]': {
                beforeitemexpand: _this.onExpandTreeSvn,                
                itemclick: _this.onItemclickTree,
                itemdblclick: _this.onItemdblclickTree,
                load: _this.onLoadTree

            },
            'newPack button[action=filtrarTree]': {
                click: _this.filtrarTree
            },
            'newPack button[action=limpiarFiltroTree]': {
                click: _this.limpiarFiltroTree
            },
            'newPack button[action=modRepositorio]': {
                click: _this.modRepositorio
            },
            'newPack button[action=elimRepositorio]': {
                click: _this.elimRepositorio
            },
            'newPack grid[name=gridDependencias]': {
                itemdblclick: _this.onItemdblclickGridDepend
            },
            'newPack button[name=validate]': {
                enable: _this.validationForm,
                disable: _this.validationForm
            },
            'autentication': {
                render: _this.onRenderAutentic,
                close: _this.onCloseAutentic
            },
            'autentication button[action=closeWin]': {
                click: _this.closeWin
            },
            'autentication button[action=submitFormAutentic]': {
                click: _this.submitFormAutentic
            },
            'newRepo': {
                render: _this.onRenderNewRepo,
                close: _this.onCloseAutentic,
                hide: _this.onCloseAutentic
            },
            'newRepo button[action=closeWin]': {
                click: _this.closeWin
            }
        });
        
    },

    onRenderPrincipal: function (win) {

        this.keyMap = Ext.widget('keymapController');
        this.keyMap.pressAltN(this);
        myScope = this;
        this.keyMap.pressAltB(this, win);
        this.keyMap.pressAltL(this, win);

        myMask = new Ext.LoadMask(Ext.getBody(), {msg: Zeolides.etiquetas.msgLoandingMask});

    },

    onRenderAddPack: function (win) {

        var detailPanel = Ext.get('panelDetalles');

        win.treeRepo.getStore().load();
        this.keyMap.pressAltI(this);
        this.keyMap.pressAltM(this);
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressCtrlAltP(this, win);       
        this.keyMap.pressAltL(this, win);

        win.gridDependencias.getStore().on('load', function (a, b) {
            if (b.length != 0) {
                Ext.getCmp('panel2TabDepen').setDisabled(false);
                Ext.getCmp('tabCreatePack').setActiveTab(1);
            }else{
                Ext.getCmp('panel2TabDepen').setDisabled(true);
                Ext.getCmp('tabCreatePack').setActiveTab(0);
            }
        });

        Ext.getCmp('btnAceptarPack').setDisabled(true);
        Ext.getCmp('btnAplicarPack').setDisabled(true);
    },

    onRenderNewRepo: function (win) {
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressCtrlAltP(this, win);
        Ext.getCmp('dirurlRepo').focus(false, 200);

        if(typeof(this.keyMap.delRepo) != "undefined"){

            this.keyMap.delRepo.setDisabled(true);
            this.keyMap.modRepo.setDisabled(true);
        }

    },

    onRenderAutentic: function (win) {
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressAltX(this, win);
        Ext.getCmp('user').focus(false, 200);
        this.keyMap.delRepo.setDisabled(true);
        this.keyMap.modRepo.setDisabled(true);

    },

    onCloseAutentic: function(){
        if(typeof(this.keyMap.delRepo) != "undefined"){
            this.keyMap.delRepo.setDisabled(false);
            this.keyMap.modRepo.setDisabled(false);
        }
        this.keyMap.newRepo.setDisabled(false);

    },

    onBeforecloseAddPack: function () {        

    },

    onClickNewPack: function () {

        var win = Ext.getCmp('winAddPack');

        if (typeof(win) != "undefined") {
            if (!win.isVisible()) {
                win.show();
            }
        } else {
            Ext.widget('newPack');
        }
        Ext.getCmp('btnElimPack').setDisabled(true);
        this.keyMap.publicpack.setDisabled(true);

    },
    onClickpublicarPack:function(){
        var _this = this;
        var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
        if(arraryRecord.length == 1){
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titlePublicar, Zeolides.etiquetas.msgPublicar1, this.publicarPack, this);
        }
        else{
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titlePublicar, Zeolides.etiquetas.msgPublicar2, this.publicarPack, this);
        }

        _this.keyMap.newPack.setDisabled(true);
        _this.keyMap.delpack.setDisabled(true);

    },
    publicarPack :function(btn){
        var _this = this;
        if (btn == "YES") {
            var arrayDatos = [];
            var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
            Ext.each(arraryRecord, function(record, index){
                if(!record.raw.visible){arrayDatos.push(record.raw.id);}
            });

            myMask.show();
            Ext.Ajax.request({
                url: 'releasePackages',
                params: {
                    arrayDatos: Ext.encode(arrayDatos)
                },
                success: function (response) {

                    var text = Ext.decode(response.responseText);
                    myMask.hide();
                    if (text.success) {
                        Ext.getCmp('gridPacked').getStore().load();
                        mostrarMensaje(7, text.message);
                        Ext.getCmp('btnPublicar').setDisabled(true); //gridPacked
                        Ext.getCmp('btnElimPack').setDisabled(true);
                        var style = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>";
                        var tpl = new Ext.Template(style);
                        var detailPanel = Ext.getCmp('panelDetalles');
                        detailPanel.collapse(true);
                        tpl.overwrite(detailPanel.body);

                        _this.keyMap.newPack.setDisabled(false);
                        _this.keyMap.delpack.setDisabled(false);

                    } else {
                        myMask.hide();
                        mostrarMensaje(6, text.message);
                    }

                }

            });
        }
        else{
            _this.keyMap.newPack.setDisabled(false);
            _this.keyMap.delpack.setDisabled(false);
        }
    },

    onClickConfigurar:function(){
        Ext.Ajax.request({
            url: 'configurarGestor',
            success: function (response) {
                var text = Ext.decode(response.responseText);
                if (text.success) {
                    mostrarMensaje(7, text.message);
                } else {
                    mostrarMensaje(6, text.message);
                }

            }
        });
    },

    onClickDeletePack: function () {
        var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
        if(arraryRecord.length == 1){
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimpack, Zeolides.etiquetas.msgElimpack1, this.deletePack, this);
        }
        else{
            Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimpack, Zeolides.etiquetas.msgElimpack2, this.deletePack, this);
        }

        this.keyMap.newPack.setDisabled(true);
        this.keyMap.publicpack.setDisabled(true);
    },

    deletePack: function (btn) {
        var _this = this;
        if(btn == "YES"){
            var arrayDatos = [];
            var arraryRecord = Ext.getCmp('gridPacked').getSelectionModel().getSelection();
            Ext.each(arraryRecord, function(record, index){
                if(!record.raw.visible){arrayDatos.push(record.raw.id);}
            });

            myMask.show();
            Ext.Ajax.request({
                url: 'deletePackageRepository',
                params: {
                    arrayDatos: Ext.encode(arrayDatos)
                },
                success: function (response) {
                    Ext.getCmp('btnElimPack').setDisabled(true); //gridPacked
                    Ext.getCmp('btnPublicar').setDisabled(true);
                    var text = Ext.decode(response.responseText);
                    
                    myMask.hide();
                    if (text.success) {
                        Ext.getCmp('gridPacked').getStore().load();
                       
                        mostrarMensaje(7,text.message);

                        var style = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>";
                        var tpl = new Ext.Template(style);
                        var detailPanel = Ext.getCmp('panelDetalles');
                        detailPanel.collapse(true);
                        tpl.overwrite(detailPanel.body);

                        _this.keyMap.newPack.setDisabled(false);
                        _this.keyMap.publicpack.setDisabled(false);

                    } else {
                        myMask.hide();
                        mostrarMensaje(6, text.message);
                    }

                }
            });
        }else{
            this.keyMap.newPack.setDisabled(false);
            this.keyMap.publicpack.setDisabled(false);
        }

    },

    onClickComprobar: function (a) {

        var urlAjax = 'pushRepositories';
        var lastUrl = '';
        var win = Ext.getCmp('winAddRepo');

        if (win.title.indexOf('Modificar') != -1) {
            urlAjax = 'modifyRepository';
            lastUrl = nodeClick.raw.url
        }
        var url = Ext.getCmp('dirurlRepo').getValue();
        var mymask = new Ext.LoadMask(Ext.getBody(), {msg:Zeolides.etiquetas.msgLoandingMask});
        mymask.show();
        Ext.Ajax.request({
            url: urlAjax,
            timeout: 180000,
            params: {
                newUrl: url,
                oldUrl: lastUrl
            },
            success: function (response) {
                mymask.hide();
                var text = Ext.decode(response.responseText);

                if (text.success) {

                    //reload tree
                    var store = Ext.getCmp('treeSvn').store;
                    store.setProxy({
                        type: 'ajax',
                        url: 'getRepositories'
                    });
                    store.load();

                    if (a.getId() != 'aplicarRepo') {
                        win.close();
                    } else {
                        win.show();
                        Ext.getCmp('dirurlRepo').reset();
                    }
                    mostrarMensaje(7, text.mensaje);

                } else {
                    //error
                    mymask.hide();
                    Ext.getCmp('dirurlRepo').reset() && win.show();
                    mostrarMensaje(6, text.mensaje);
                }

            }
        });

    },
    checkValueComprobar: function (field, dirty) {

        var active = (field.getValue() !== ' ' && field.getValue() !== '') ? false : true;
        Ext.getCmp('comp').setDisabled(active);

    },
    closeWin: function (button) {
        if( button.up('window').id == 'winAddPack' && !Ext.getCmp('btnPublicar').isDisabled()){
            Ext.getCmp('btnElimPack').setDisabled(false);
        }
        else if(button.up('window').id == 'winAutentication'){
            this.keyMap.newRepo.setDisabled(false);
        }

        if(button.up('window').id == 'winAddPack'){
            this.keyMap.publicpack.setDisabled(false);
        }
           button.up('window').close();

    },
    submitFormCreatePack: function (button) {
        var _this = this;

        var fraseEncript = this.encryptRSA(Ext.getCmp('frase').getValue());
        var fraseClear = Ext.getCmp('frase').getValue();

        var btn = Ext.getCmp('btnValidate');
        var form = btn.up('form').getForm();       
        if (form.isValid()) {
            var objValues = form.getValues();           

            form.submit({
                url: 'involvePackage',
                timeout : 60000,
                params: {
                    idpadre: nodeClick.parentNode.raw.id,
                    url: nodeClick.parentNode.raw.url,
                    nameTags: nodeClick.raw.text
                },
                waitTitle: Zeolides.etiquetas.msgLoandingMask,
                waitMsg: Zeolides.etiquetas.msgWait,

                success: function (form, action) {
                    
                    var msg = action.result.message;
                        Ext.getCmp('gridPacked').getStore().load();

                        mostrarMensaje(7, msg);
                        form.reset();
                        Ext.getCmp('nameprod').setDisabled(true);
                        Ext.getCmp('descrip').setDisabled(true);
                        Ext.getCmp('autor').setDisabled(true);
                        Ext.getCmp('p12').setDisabled(true);
                        Ext.getCmp('tipoV').setDisabled(true);
                        Ext.getCmp('frase').setDisabled(true);

                        var nodo = Ext.getCmp('treeSvn').store.getNodeById(nodeClick.internalId);
                    
                        nodo.remove();

                    if (button.getId() == 'btnAceptarPack') {
                        _this.keyMap.publicpack.setDisabled(false);
                        button.up('window').close();
                    }

                },
                failure: function (form, action) {
                    var msg = action.result.message;
                    Ext.getCmp('frase').setValue(fraseClear);                
                    mostrarMensaje(6, msg);

                }
            });

        }

    },
    onExpandTreeSvn: function (node, b, c) {

        if (!node.isRoot()) {

            nodeSelected = node;
            this.setProxyTreePanelSvn(node.raw.url, node.raw.id);

        }

    },

    setProxyTreePanelSvn: function (url, id, user, pass) {

        var mUser = (typeof(user) != "undefined") ? user : '';
        var mPass = (typeof(pass) != "undefined") ? user : '';

        Ext.getCmp('treeSvn').store.setProxy({
            type: 'ajax',
            url: 'getTagsRepositories',
            extraParams: {
                url: url,
                idpadre: id,
                user: mUser,
                password: mPass
            }
        });
    },

    submitFormAutentic: function (a, b, c) {

        var user = Ext.getCmp('user').getValue();
        var pass = Ext.getCmp('pass').getValue();        
        var url = Ext.getCmp('winAutentication').nodeRecord.raw.url;
        var idpadre = Ext.getCmp('winAutentication').nodeRecord.raw.id;

        myMask.show();
        Ext.Ajax.request({
            url: 'authenticateCorrect',
            params: {
                url: url,
                user: user,                
                password: pass,
                idpadre: idpadre
            },
            success: function (response) {
                var text = Ext.decode(response.responseText);

                if (text.success) {

                    var nodo = Ext.getCmp('treeSvn').store.getNodeById(Ext.getCmp('winAutentication').nodeRecord.internalId);
                    nodo.set('iconCls', 'icon2-abajo');
                    nodo.set('leaf', false);

                    nodo.expand();
                    myMask.hide();
                    Ext.getCmp('winAutentication').close();

                } else {
                    myMask.hide();
                    mostrarMensaje(6, text.message);
                }

            }
        });

    },

    onItemclickTree: function (view, record, item) {

        if (!record.isRoot()) {
            nodeClick = record;
            if (record.raw.idtags == 'tags') {

                Ext.getCmp('formPack').setDisabled(false);

                Ext.getCmp('gridDependencias').getStore().load({
                    params: {
                        idpadre: record.parentNode.raw.id,
                        url: record.parentNode.raw.url,
                        nameTags: record.raw.text

                    }
                });

                Ext.getCmp('btnModRepo').setDisabled(true);
                Ext.getCmp('btnElimRepo').setDisabled(true);


            } else {
                Ext.getCmp('btnModRepo').setDisabled(false);
                Ext.getCmp('btnElimRepo').setDisabled(false);

                Ext.getCmp('btnAceptarPack').setDisabled(true);
                Ext.getCmp('btnAplicarPack').setDisabled(true);
                Ext.getCmp('formPack').getForm().reset();
                Ext.getCmp('gridDependencias').getStore().removeAll();

                Ext.getCmp('tabCreatePack').setActiveTab(0);
                Ext.getCmp('panel2TabDepen').setDisabled(true);
                this.setDisabledFormAddPack();


                this.keyMap.pressDelRepo(this);
            }
        } else {
            Ext.getCmp('btnModRepo').setDisabled(true);
            Ext.getCmp('btnElimRepo').setDisabled(true);
        }

    },

    onItemdblclickTree: function (view, record, item) {
        if (!record.isRoot()) {
            if (!record.raw.authenticate && record.raw.idtags != 'tags') {
                this.keyMap.newRepo.setDisabled(true);
                Ext.widget('autentication', {nodeRecord: record});


            }
        }
    },

    onLoadTree: function(store, record, success){

        if(typeof(record.getChildAt(0)) == "undefined" && !record.isRoot()){

            mostrarMensaje(7, Zeolides.etiquetas.textEmptyData);
        }

    },
    encryptRSA: function (text) {
        var key = RSA.getPublicKey(document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    },

    addRepositorio: function (a) {
        var _a = (typeof(a) != "undefined") ? a : true;
        var winRepo = Ext.getCmp('winAddRepo');

        if (typeof(winRepo) != "undefined") {
            if (!winRepo.isVisible()) {
                Ext.getCmp('dirurlRepo').removeListener('change');
                Ext.getCmp('cancelarRepo').nextTab = 'aplicarRepo';
                Ext.getCmp('aceptarRepo').prevTab = 'aplicarRepo';
                winRepo.show();
            }
        } else {
            if (_a) {
                var n = Ext.widget('newRepo');
                Ext.getCmp('cancelarRepo').nextTab = 'aplicarRepo';
                Ext.getCmp('aceptarRepo').prevTab = 'aplicarRepo';
                Ext.getCmp('dirurlRepo').removeListener('change');
                n.show()
            } else {
                var newWin = Ext.widget('newRepo');
                Ext.getCmp('aceptarRepo').prevTab = 'cancelarRepo';
                Ext.getCmp('cancelarRepo').nextTab = 'aceptarRepo';
                newWin.setTitle(Zeolides.etiquetas.titleWinModifRepo);
                Ext.getCmp('dirurlRepo').setValue(nodeClick.raw.url);
                Ext.getCmp('aceptarRepo').setDisabled(true);
                var first = false, original = '';
                Ext.getCmp('dirurlRepo').addListener('change', function(t, nv, ov){
                    if(!first){
                        original = ov;
                        if(original != nv && t.isValid())
                            Ext.getCmp('aceptarRepo').setDisabled(false);
                        else
                            Ext.getCmp('aceptarRepo').setDisabled(true);
                        first = true;
                    }else{
                        if(original == nv)
                            Ext.getCmp('aceptarRepo').setDisabled(true);
                        else {
                            if(t.isValid())
                                Ext.getCmp('aceptarRepo').setDisabled(false);
                        }
                    }
                });
                Ext.getCmp('aplicarRepo').destroy();
                Ext.getCmp('cancelarRepo').nexTab = 'aceptarRepo';
                Ext.getCmp('aceptarRepo').prevTab = 'cancelarRepo';
                Ext.getCmp('aceptarRepo').setDisabled(true);
                Ext.getCmp('aceptarRepo').formBind = false;
                newWin.show();
            }

        }

    },

    modRepositorio: function () {
        this.addRepositorio(false);
    },

    elimRepositorio: function () {
        this.keyMap.newRepo.setDisabled(true);
        this.keyMap.modRepo.setDisabled(true);
        Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimRepositorio,  Zeolides.etiquetas.msgElimRepositorio, this.ajaxElimRepositorio, this);

    },

    ajaxElimRepositorio: function (btn) {
        var _this = this;
        if(btn == "YES"){
            Ext.Ajax.request({
                url: 'deleteRepository',
                params: {
                    url: nodeClick.raw.url

                },
                success: function (response) {
                    var text = Ext.decode(response.responseText);
                    if (text.success) {
                        var store = Ext.getCmp('treeSvn').store;                      
                        var store = Ext.getCmp('treeSvn').store;
                        store.setProxy({
                            type: 'ajax',
                            url: 'getRepositories'
                        });
                        store.load();
                        mostrarMensaje(7, text.mensaje)
                    } else {
                        mostrarMensaje(6, text.mensaje)
                    }
                    Ext.getCmp('treeSvn').getSelectionModel().select(Ext.getCmp('treeSvn').getRootNode());
                    Ext.getCmp('btnModRepo').setDisabled(true);
                    Ext.getCmp('btnElimRepo').setDisabled(true);
                    _this.keyMap.newRepo.setDisabled(false);
                    _this.keyMap.modRepo.setDisabled(false);
                  
                }
            });
        }
        else if(btn == 'NO'){
            this.keyMap.newRepo.setDisabled(false);
            this.keyMap.modRepo.setDisabled(false);
        }
    },

    onItemdblclickGridDepend:function(view, record){
        nodeClickDepend =  record.raw;
        Msg.util.MostrarMsg(4, Zeolides.etiquetas.textInformacion,  Zeolides.etiquetas.textMsgAddDependen, this.addDependenciaRepo, this);
    },

    addDependenciaRepo: function(btn){
        if(btn == "YES"){
            this.addRepositorio();
            Ext.getCmp('dirurlRepo').setValue(nodeClickDepend.url);
        }

    },

    renderGridPacked: function(grid,eOpts){

        this.keyMap.pressDelPack(this);
        this.keyMap.pressAltP(this);

    },

    onItemClickGridPacked: function (view, record, c, d, e) {

        itemClickGridPacked = record;
        if(!record.raw.visible){
            Ext.getCmp('btnPublicar').setDisabled(false);

            Ext.getCmp('btnElimPack').setDisabled(false);
        }else{
            Ext.getCmp('btnElimPack').setDisabled(true);
            Ext.getCmp('btnPublicar').setDisabled(true);
        }

        var cadena = '';

        var nombre = record.raw.nameProduct;
        var name = record.raw.name;
        var verssion = record.raw.version;
        var descrip = record.raw.description;
        var dependencia = record.raw.require;
        var autor = record.raw.autor;
        var logo = record.raw.logo;

        var type = record.raw.typeVersion;
        var versio_suxf = verssion.substring(1) + '-' + type;

        if (dependencia != null) {
            for (var key in dependencia) {

                var keysplit = dependencia[key].substring(2);
                var pcero = (dependencia[key].charAt(1) == '7') ? '-alfa' : (dependencia[key].charAt(1) == '8') ? '-beta' : '-rc';

                cadena += '<li style="list-style: none;">' + key+ '=' +keysplit + pcero + '</li>';
            }
        }

        var style = '<style>' +
            'p#logo { text-align: center; padding : 10 0 0 0px; }' +
            '.acercade{    font-size: 1.1em;} ' +
            '.txtprincipal{' +
            ' text-align: center;' +
            'font: bold 2.3em "Droid Sans",arial,sans-serif;' +
            'color: rgb(0, 155, 194);' +
            'text-shadow: 1px 1px 2px rgba(185, 185, 185, 0.84);' +
            '' +

            '}' +

            '</style>' +
            '<section id="infoApp">' +
            '<div style="border-bottom: solid 1px #eeeeee; box-shadow: 1px 1px 4px rgba(198, 198, 198, 0.44); text-align: center; padding-bottom: 10px; padding-top: 10px ">' +
            '<tpl if="this.logoContain(logo) == false">' +
            ' <img style="width: 50%;" src=' + logo + '>' +
            '</tpl>' +
            '</p>' +
            '<h1 style="font-size:  1.4em;" class="txtPrincipal">' + nombre + ' </h1>' +//---------------Nombre-------------------
            '<h5 style="font-size:  1.2em;color: rgb(0, 155, 194);" class=""> '+Zeolides.etiquetas.tplVersion + versio_suxf+ ' </h5>' +//------------Versión-----------------
            '</div>' +
            '<div class = "acercade" style="margin-bottom:20px;height:100%;overflow:auto; padding: 10px 5px 5px 5px;text-align: center; background-color: rgba(240, 240, 240, 0.18)">' +//-------------Container----------------
            '<h5>'+Zeolides.etiquetas.tplDescrip+'</h5>' +//------------------Desarrollado------------ -----
            '<label >' + descrip + '</label>' +//------------------Desarrollado------------ -----
            '<h5>'+Zeolides.etiquetas.tplDesarroll+'</h5>' +//------------------Desarrollado------------ -----
            '<label >' + autor + '</label>' +//------------------Desarrollado------------ -----
            '<h5 style="margin-top:10px">'+Zeolides.etiquetas.tplDependen+'</h5>' +//------------------Dependencias------------
            '<ul>' + cadena +
            '</ul>' +//-----------------------------------End Dependencias -----------
            '</br>' +
            '</div>' +//------------------------------------End Container-----------
            '<footer style=" bottom:0; position:absolute;width: 100%; height:15;text-align: center;background-color:rgb(0, 155, 194);color: white ">' +//------------------------------------Footer-----------
            '<h5>2011-2015 © Copyright XETID </h5>' +//------------------------------------Footer-----------
            '</footer>' +//------------------------------------End Footer-----------
            '</section>';

        var tpl = new Ext.Template(style);
        var detailPanel = Ext.getCmp('panelDetalles');
        detailPanel.expand(true);
        tpl.overwrite(detailPanel.body, e);

    },

    setDisabledFormAddPack: function () {
        Ext.getCmp('nameprod').setDisabled(true);
        Ext.getCmp('descrip').setDisabled(true);
        Ext.getCmp('autor').setDisabled(true);
        Ext.getCmp('p12').setDisabled(true);     
        Ext.getCmp('tipoV').setDisabled(true);
        Ext.getCmp('frase').setDisabled(true);
    },

    hablitarBotones: function(){
        if(Ext.getCmp('searchFieldPack').getValue() != ''){
            Ext.getCmp('clearFiltroGridPack').enable();
            Ext.getCmp('textfieldBuscarTree').enable();
        }
        else{
            Ext.getCmp('clearFiltroGridPack').disable();
            Ext.getCmp('textfieldBuscarTree').disable();
        }
    },

    filtrarGridPack: function (textfield, value) {

        var store = Ext.getCmp('gridPacked').getStore();
        var filtro = Ext.getCmp('searchFieldPack').getValue();
        store.load({params: {
            filtro: filtro
        }});
        Ext.getCmp('clearFiltroGridPack').setDisabled(false);


    },

    limpiarFiltroGridPack: function () {
        Ext.getCmp('searchFieldPack').reset();
        Ext.getCmp('gridPacked').getStore().load();
        Ext.getCmp('clearFiltroGridPack').setDisabled(true);
    },

    filtrarTree: function(textfield, value){
        var tree = Ext.getCmp('treeSvn');
        tree.filterBy(value, "text");
        if(value != ''){
            Ext.getCmp('btnLimpiarTree').enable();
        }
        else{
            Ext.getCmp('btnLimpiarTree').disable();
        }
    },

    limpiarFiltroTree: function () {
        Ext.getCmp('filtroTree').setValue('');
        var tree = Ext.getCmp('treeSvn');
        tree.clearFilter();
    },

    resetProxyTree: function(){
        var store = Ext.getCmp('treeSvn').store;
                        store.setProxy({
                        type: 'ajax',
                        url: 'getRepositories'
                        });
        store.load();
    },

    validationForm : function(a){
      Ext.getCmp('btnAplicarPack').setDisabled(a.disabled);
      Ext.getCmp('btnAceptarPack').setDisabled(a.disabled);
    }


});
