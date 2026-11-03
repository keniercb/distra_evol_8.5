Ext.define('Controlpanel.controller.Control', {
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
    },{
        ref: 'panelWest',
        selector: 'panelWest'
    },{
        ref: 'panelCenter',
        selector: 'panelCenter'
    },{
        ref: 'newRepo',
        selector: 'newRepo'
    },{
        ref: 'winaux',
        selector: 'winaux'
    }],

    init: function () {
        var _this = this;

        _this.control({
            'principal': {
                render: _this.onRenderPrincipal
            },
            'panelWest button[action=addrepo]': {
                click: _this.onClickNewRepo
            },
            'panelWest button[action=modrepo]': {
                click: _this.onClickModfRepo
            },
            'panelWest button[action=elimrepo]': {
                click: _this.onClickElimRepo
            },
            'panelWest button[action=limpiarFiltroTree]': {
                click: _this.limpiarFiltroTree
            },
            'panelWest treepanel[name=treePack]': {
               
                render: _this.onRenderTree,
                load: _this.onLoadTreeRepo,
                
                itemclick: _this.onItemclickTree,
                checkchange: _this.onCheckChangeTree              
            },
            'panelWest textfield[name=filtroTree]': {
                change: _this.filtrarTree
            },
            'newRepo': {
               
                render: _this.onRenderWinRepo
            },
            'newRepo button[action=closeWin]': {
                click: _this.closeWin
            },
            'newRepo button[action=aceptarRepo]': {
                click: _this.addRepo
            },
            'newRepo textfield[name=direccion]': {
                change: _this.changeAceptarRepo
            },
            'newRepo textfield[name=denominacion]': {
                change: _this.changeAceptarRepo
            },
            'newRepo button[action=aplicarRepo]': {
                click: _this.addRepo
            },
            'panelCenter grid[name=gridPacked]': {
                itemclick: _this.onItemClickGridPacks
            },

            'panelCenter textfield[name = searchFieldPack]': {
                keyup: _this.searchFieldPack
            },

            'panelCenter button[action=filtrarGridPack]': {
                click: _this.filtrarGridPacks
            },
            'panelCenter button[action=limpiarFiltroGridPack]': {
                click: _this.limpiarFiltroGridPacks
            },
            'panelCenter button[action=instalar]': {
                click: _this.installPack
            },
            'panelCenter button[action=desintalar]': {
                click: _this.desintalarPack
            },
            'panelCenter button[action=reinstalar]': {
                click: _this.reinstalarPack
            },
            'panelCenter button[action=actualizar]': {
                click: _this.actualizarPack
            },
            'panelCenter button[action=revertir]': {
                click: _this.revertirPack
            },
            'panelCenter combobox[name=estado]': {
                change: _this.changeCmbEstado
            },
            'winaux': {
                destroy: _this.beforeCloseWinAux,
                render: _this.onRenderWinAux
            },
            'winaux button[action=aceptarApp]': {
                click: _this.confirmCompile
            },
            'winaux button[action=unistallApp]': {
                click: _this.unistallSuccessFull
            },
            'winaux button[action=closeWin]': {
                click: _this.closeWin
            }

        });
    },

    encryptRSA: function (text) {
        var key = RSA.getPublicKey(document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    },

    onRenderPrincipal: function(){
        myScope = this;
        flagSchemas = null;
        myMask = new Ext.LoadMask(Ext.getBody(), {msg: Zeolides.etiquetas.msgLoandingMask});

        this.keyMap = Ext.widget('keymapController');
        this.keyMap.pressAltI(this);
        this.keyMap.pressAltM(this);
        this.keyMap.pressDelRepo(this);


        this.keyMap.pressAltB(this);
        this.keyMap.pressAltL(this);

        this.keyMap.pressCtrlShiftI(this);
        this.keyMap.pressCtrlShiftD(this);
        this.keyMap.pressCtrlAltZ(this);
        this.keyMap.pressAltShiftD(this);
        this.keyMap.pressAltShiftV(this);

        Ext.getCmp('treePack').getStore().load();

    },

    onClickNewRepo: function(){
        this.keyMap.CtrlAltI.setDisabled(true);
        this.keyMap.CtrlAltD.setDisabled(true);
        this.keyMap.CtrlAltZ.setDisabled(true);
        this.keyMap.AltShiftD.setDisabled(true);
        this.keyMap.AltShiftV.setDisabled(true);

        Ext.getCmp('modrepo').setDisabled(true);
        Ext.getCmp('elimrepo').setDisabled(true);
        var w = Ext.widget('newRepo', {formBind:true});
        Ext.getCmp('cancelarRepo').nextTab = 'aplicarRepo';
        Ext.getCmp('aceptarRepo').prevTab = 'aplicarRepo';
        w.show();
        Ext.getCmp('denominacion').focus(false, 200);
    },

    beforeCloseWinRepo: function(){

        Ext.getCmp('modrepo').setDisabled(true);
        Ext.getCmp('elimrepo').setDisabled(true);

    },

    beforeCloseWinAux: function(){
        this.keyMap.newRepo.setDisabled(false);
        this.keyMap.modRepo.setDisabled(false);
        this.keyMap.delRepo.setDisabled(false);
    },

    onRenderWinRepo: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        this.keyMap.pressCtrlAltP(this, win);
    },

    onClickModfRepo: function(){
        datosMod = [];
        var win = Ext.widget('newRepo', {formBind:false});
        var denm =  Ext.getCmp('denominacion');

        Ext.getCmp('cancelarRepo').nextTab = 'aceptarRepo';
        Ext.getCmp('aceptarRepo').prevTab = 'cancelarRepo';
        win.setTitle(Zeolides.etiquetas.titleWinModRepo);

        denm.setValue(itemTreeClick.text);
        denm.focus(false, 200);
        Ext.getCmp('url').setValue(itemTreeClick.DIR);
        Ext.getCmp('aplicarRepo').hide();

        win.show();

        var fields =  win.query('textfield');
        fields.forEach(function(data){
            datosMod.push(data.getValue());
        });

        Ext.getCmp('elimrepo').setDisabled(true);
        Ext.getCmp('addrepo').setDisabled(true);

        this.keyMap.CtrlAltI.setDisabled(true);
        this.keyMap.CtrlAltD.setDisabled(true);
        this.keyMap.CtrlAltZ.setDisabled(true);
        this.keyMap.AltShiftD.setDisabled(true);
        this.keyMap.AltShiftV.setDisabled(true);
    },

    onClickElimRepo: function(){
        this.keyMap.CtrlAltI.setDisabled(true);
        this.keyMap.CtrlAltD.setDisabled(true);
        this.keyMap.CtrlAltZ.setDisabled(true);
        this.keyMap.AltShiftD.setDisabled(true);
        this.keyMap.AltShiftV.setDisabled(true);

        Ext.getCmp('modrepo').setDisabled(true);
        Ext.getCmp('addrepo').setDisabled(true);
        Msg.util.MostrarMsg(4, Zeolides.etiquetas.titleElimRepo, Zeolides.etiquetas.msgElimRepo, this.deleteRepo, this);
        this.beforeCloseWinRepo();
    },


    deleteRepo: function(btn){
        var _this = this;
    if(btn == 'YES'){
       myMask.show();
        Ext.Ajax.request({
        url: 'eliminarRepositorio',
        params: {
            url: itemTreeClick.DIR,
            active: itemTreeClick.checked
        },
        success: function (response) {
            var text = Ext.decode(response.responseText);
                myMask.hide();
            if(text.succes){
                Ext.getCmp('addrepo').setDisabled(false);

                _this.keyMap.CtrlAltI.setDisabled(false);
                _this.keyMap.CtrlAltD.setDisabled(false);
                _this.keyMap.CtrlAltZ.setDisabled(false);
                _this.keyMap.AltShiftD.setDisabled(false);
                _this.keyMap.AltShiftV.setDisabled(false);
               
                mostrarMensaje(7, text.datos);
                Ext.getCmp('treePack').getStore().load();
            }else{
                mostrarMensaje(6,text.datos);
               
            }


        }
    });
    }
    else if(btn == 'NO'){
        Ext.getCmp('elimrepo').setDisabled(false);
        Ext.getCmp('modrepo').setDisabled(false);
        Ext.getCmp('addrepo').setDisabled(false);

        this.keyMap.CtrlAltI.setDisabled(false);
        this.keyMap.CtrlAltD.setDisabled(false);
        this.keyMap.CtrlAltZ.setDisabled(false);
        this.keyMap.AltShiftD.setDisabled(false);
        this.keyMap.AltShiftV.setDisabled(false);
    }
    },

    onItemclickTree: function(view, record){

        if (!record.isRoot()) {
            itemTreeClick = record.raw;
            this.keyMap.pressAltM(this);
            this.keyMap.pressDelRepo(this);
            Ext.getCmp('modrepo').setDisabled(false);
            Ext.getCmp('elimrepo').setDisabled(false);
        }else{
            Ext.getCmp('modrepo').setDisabled(true);
            Ext.getCmp('elimrepo').setDisabled(true);
        }

    },

    onCheckChangeTree: function(node,checked){

        var check = checked;
        var activos = new Array();
        var root = Ext.getCmp('treePack').getRootNode();
        root.eachChild(function(a){
            a.raw.active = a.data.checked;
            activos.push(a.raw);

        });
        var encoded = Ext.encode(activos);

        myMask.show();
        Ext.Ajax.request({
            url: 'activarRepo',
            params: {founded:encoded},

            success: function (response) {
                var store = Ext.getCmp('gridPacked').getStore();
                store.removeAll();
                store.load();

                var style = "<h3  style= 'padding: 10px 5px 5px 5px;'> No hay ningún elemento seleccionado ...</h3>";
                var tpl = new Ext.Template(style);
                var detailPanel = Ext.getCmp('panelDetalles');
                detailPanel.collapse(true);
                tpl.overwrite(detailPanel.body);
                myMask.hide();
                if(check){
                    mostrarMensaje(7, 'El repositorio ha sido activado satisfactoriamente.');
                }
                else{
                    mostrarMensaje(7, 'El repositorio ha sido desactivado </br> satisfactoriamente.');
                }


            }
        });

        this.allBtnsDisabled();

    },

    onLoadTreeRepo: function(){
        Ext.getCmp('modrepo').setDisabled(true);
        Ext.getCmp('elimrepo').setDisabled(true);

    },

    allBtnsDisabled: function(){
        Ext.getCmp('instalar').setDisabled(true);
        Ext.getCmp('desintalar').setDisabled(true);
        Ext.getCmp('actualizar').setDisabled(true);
        Ext.getCmp('reinstalar').setDisabled(true);
        Ext.getCmp('revertir').setDisabled(true);
    },

    closeWin: function(button){
        var x = button.up('window');
        button.up('window').close();
        if(x.id = 'winAddRepo'){
            this.keyMap.CtrlAltI.setDisabled(false);
            this.keyMap.CtrlAltD.setDisabled(false);
            this.keyMap.CtrlAltZ.setDisabled(false);
            this.keyMap.AltShiftD.setDisabled(false);
            this.keyMap.AltShiftV.setDisabled(false);
        }
    },

    addRepo: function(button){
        var _this = this;
        var win = button.up('window');
        var urlAjax = 'configurar';
        var oldDenominacion, oldDireccion, active;

        if (win.title.indexOf('Modificar') != -1) {
            urlAjax = 'ModifyRepositories';
            oldDenominacion = itemTreeClick.text;
            oldDireccion = itemTreeClick.DIR;
            active = itemTreeClick.checked;

        }
        var form = button.up('form').getForm();
      
        form.submit({
            url: urlAjax,
            params: {
                active: active,
                oldDenominacion: oldDenominacion,
                oldDireccion: oldDireccion
            },
            waitTitle: Zeolides.etiquetas.msgLoandingMask,
            waitMsg: Zeolides.etiquetas.msgWait,
            
            failure: function(form, action){

                if(action.result.succes){

                    if (button.getId() != 'aplicarRepo') {
                        Ext.getCmp('addrepo').setDisabled(false);

                        _this.keyMap.CtrlAltI.setDisabled(false);
                        _this.keyMap.CtrlAltD.setDisabled(false);
                        _this.keyMap.CtrlAltZ.setDisabled(false);
                        _this.keyMap.AltShiftD.setDisabled(false);
                        _this.keyMap.AltShiftV.setDisabled(false);

                        win.close();
                    } else {
                        win.show();
                        Ext.getCmp('denominacion').reset();
                        Ext.getCmp('url').reset();
                    }
                    mostrarMensaje(7, action.result.datos);                    
                    Ext.getCmp('treePack').getStore().load();
                }else{
                    mostrarMensaje(6, action.result.datos);                   
                    Ext.getCmp('treePack').getStore().load();
                }
            }
        });
       
    },

    changeAceptarRepo : function(){
        var compare = [];
        var result = [];
        var btn = Ext.getCmp('aceptarRepo');
        var fields =  Ext.getCmp('winAddRepo').query('textfield');
        var form = Ext.getCmp('winAddRepo').query('form')[0].getForm();

        fields.forEach(function(data,index, arr){
            compare.push(data.getValue());
        });
        result = Ext.Array.difference(datosMod, compare);
        if(result.length != 0){
            if(form.isValid()){
                btn.setDisabled(false);
            }
        }else{
            btn.setDisabled(true);
        }
    },

    filtrarTree: function(textfield, value){
        var tree = Ext.getCmp('treePack');
        if(Ext.getCmp('filtroTree').getValue()!='') {
            Ext.getCmp('btnLimpiarTree').enable();
        }
        else
        {
            Ext.getCmp('btnLimpiarTree').disable();
        }
        tree.filterBy(value, "text");

    },

    limpiarFiltroTree: function(){
        var tree = Ext.getCmp('treePack');
        Ext.getCmp('filtroTree').reset();
        Ext.getCmp('btnLimpiarTree').disable();
        tree.clearFilter();

    },

    onRenderTree: function(){
        this.keyMap.pressCtrlAltL(this);
    },

    onItemClickGridPacks: function(view, record, c, d, e){

     
        itemClickGridPacked = record;

        var cadena = '';

        var nombre = record.raw.NAMEPRODUCT;
        var name = record.raw.NAME;
        var verssion = record.raw.VERSION;
        var descrip = record.raw.DESCRIPCION;
        var dependencia = record.raw.DEPENDENCIAS;
        var autor = record.raw.AUTOR;
        var logo = record.raw.LOGO;
        var estado = record.raw.ESTADO;
        var isupdate = record.raw.ISUPDATE;

        var type = (verssion.charAt(0) == '7') ? '-alfa' : (verssion.charAt(0) == '8') ? '-beta' : '-rc';
        var versio_suxf = verssion.substring(1) + type;

        if(dependencia != null){
            for (var i in dependencia) {

                var keysplit = dependencia[i].substring(2);
                var pcero = (dependencia[i].charAt(1) == '7') ? '-alfa' : (dependencia[i].charAt(1) == '8') ? '-beta' : '-rc';

                cadena +='<li style="list-style: none;">'+ i + '=' +keysplit + pcero +'</li>';
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
            '<h5 style="font-size:  1.2em;color: rgb(0, 155, 194);" class=""> '+Zeolides.etiquetas.tplVersion + versio_suxf +' </h5>' +//------------Versión-----------------
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

        var btnInstal = Ext.getCmp('instalar');
        var btnDesintal = Ext.getCmp('desintalar');
        var btnActual = Ext.getCmp('actualizar');
        var btnReinstal = Ext.getCmp('reinstalar');
        var btnRevert = Ext.getCmp('revertir');

        switch (estado) {
            case 'Instalado':

                btnInstal.disable();
                btnDesintal.enable();
                btnReinstal.enable();
                btnActual.disable();
                if (isupdate) {
                    btnRevert.enable();
                } else {
                    btnRevert.disable();
                }


            break;
            case 'No instalado':
                btnDesintal.disable();
                btnInstal.enable();
                btnReinstal.disable();
                btnActual.disable();
                btnRevert.disable();
            break;

            case 'Desactualizado':
                btnActual.enable();
                btnDesintal.enable();
                btnInstal.disable();
                btnReinstal.enable();
                if (isupdate) {
                    btnRevert.enable();
                } else {
                    btnRevert.disable();
                }
            break;


        }
    },

    installPack: function(){

      myScope.allBtnsDisabled();

      var appname = itemClickGridPacked.raw.NAME;
      var appversion = itemClickGridPacked.raw.VERSION;
        myMask.show();
      Ext.Ajax.request({
           url: 'comprobarUtlizacion',
           method: 'POST',
           params: {
                metodo: 'instalar',
                nameapp: appname,
                appversion: appversion
            },
          callback: function(options, success, response) {
              responseData = Ext.decode(response.responseText);
              myMask.hide();
              var menssage = responseData.datos;
              var conexion = responseData.conexion;

              var instalar = responseData.instalar;
              var desinstalar = responseData.desinstalar;
              var actualizar = responseData.actualizar;
              var connection_date = (conexion) ?  responseData.connection_date : false;

              if (responseData.succes == true) {

                  myScope.cargarInterfaz(conexion, instalar, desinstalar, actualizar, 'install',connection_date);
              } else {
                  Msg.util.msg(2, Zeolides.etiquetas.textInformacion, menssage);
              }

          }
        });

    },

    desintalarPack: function(){

        myScope.allBtnsDisabled();

        var appname = itemClickGridPacked.raw.NAME;
        var appversion = itemClickGridPacked.raw.VERSIONINSTALADA;
        myMask.show();
        Ext.Ajax.request({
            url: 'comprobarUtlizacion',
            method: 'POST',
            params: {
                metodo: 'desintalar',
                nameapp: appname,
                appversion: appversion
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);

                var menssage = responseData.datos;
                var conexion = responseData.conexion;

                var instalar = responseData.instalar;
                var desinstalar = responseData.desinstalar;
                var actualizar = responseData.actualizar;
                var connection_date = (conexion) ?  true : false;

                myMask.hide();
                if (responseData.succes == true) {
                    myScope.cargarInterfaz(false, false, menssage, false, 'uninstall',connection_date);
                } else {
                    mostrarMensaje(6, menssage);
                }

            }
        });
    },

    reinstalarPack: function(){
        myScope.allBtnsDisabled();

        this.keyMap.newRepo.setDisabled(true);
        this.keyMap.modRepo.setDisabled(true);
        this.keyMap.delRepo.setDisabled(true);

        Msg.util.MostrarMsg(4, Zeolides.etiquetas.labelReinstalar,  Zeolides.etiquetas.msgReintall, this.ajaxReintallApp, this);
    },

    actualizarPack: function(){

        myScope.allBtnsDisabled();
        var appname    = itemClickGridPacked.raw.NAME;
        var appversion = itemClickGridPacked.raw.VERSION;
        myMask.show();
        Ext.Ajax.request({
            url: 'comprobarUtlizacion',
            method: 'POST',
            params: {
                metodo:     'actualizar',
                nameapp:    appname,
                appversion: appversion
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;
                var conexion = responseData.conexion;

                var instalar = responseData.instalar;
                var desinstalar = responseData.desinstalar;
                var actualizar = responseData.actualizar;
                var connection_date = (conexion) ?  responseData.connection_date : false;
                myMask.hide();
                if (responseData.succes == true) {
                    myScope.cargarInterfaz(conexion,instalar, desinstalar, actualizar,'update',connection_date);
                } else {
                    mostrarMensaje(6, menssage);
                }

            }
        });
    },

    revertirPack: function(){

        myScope.allBtnsDisabled();

        var appname    = itemClickGridPacked.raw.NAME;
        var appversion = itemClickGridPacked.raw.VERSION;
        myMask.show();
        Ext.Ajax.request({
            url: 'comprobarUtlizacion',
            method: 'POST',
            params: {
                metodo:     'revertir',
                nameapp:    appname,
                appversion: appversion
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                var menssage = responseData.datos;
                var conexion = responseData.conexion;

                var instalar = responseData.instalar;
                var desinstalar = responseData.desinstalar;
                var actualizar = responseData.actualizar;
                var connection_date = (conexion) ?  responseData.connection_date : false;
                myMask.hide();
                if (responseData.succes == true) {
                    myScope.cargarInterfaz(conexion, instalar,desinstalar,actualizar, 'revert',connection_date);
                } else {
                    mostrarMensaje(6, menssage);
                }

            }
        });
    },

    confirmReintalApp: function(btn){
        var compile = (btn == 'YES') ? true : false;
            var progessR = Ext.MessageBox.show({
                title: Zeolides.etiquetas.titleReintall,
                msg: Zeolides.etiquetas.msgReintallApp,
                progressText: Zeolides.etiquetas.msgReintallProgess,
                wait: true

            });

            var urlapp = itemClickGridPacked.raw.URI;
            var appname = itemClickGridPacked.raw.NAME;
            var depends = itemClickGridPacked.raw.DEPENDENCIAS;
            var vers = itemClickGridPacked.raw.VERSIONINSTALADA;
            var _this = this;
            Ext.Ajax.request({
                url: 'reInstalar',
                timeout: 90000,
                method: 'POST',
                params: {
                    direccion   : urlapp,
                    nameapp     : appname,
                    dependencias: depends,
                    version     : vers,
                    opcion      : compile
                },
                callback: function(options, success, response) {

                    responseData = Ext.decode(response.responseText);
                    var menssage = responseData.datos;

                    if (responseData.succes == true) {

                        progessR.hide();
                        Ext.getCmp('gridPacked').getStore().load();
                        myScope.allBtnsDisabled();
                        _this.keyMap.newRepo.setDisabled(false);
                        _this.keyMap.modRepo.setDisabled(false);
                        _this.keyMap.delRepo.setDisabled(false);

                        mostrarMensaje(7, menssage);
                       
                    }
                    else {
                        progessR.hide();
                        mostrarMensaje(6, menssage);
                        
                    }

                }
            });

    },

    ajaxReintallApp: function(btn){
        if(btn == 'YES'){
            Msg.util.MostrarMsg('4',Zeolides.etiquetas.titleConfirmCompile,  Zeolides.etiquetas.msgConfirmCompile, this.confirmReintalApp,this);
        }
        else if(btn == 'NO'){
            this.keyMap.newRepo.setDisabled(false);
            this.keyMap.modRepo.setDisabled(false);
            this.keyMap.delRepo.setDisabled(false);
            Ext.getCmp('gridPacked').getSelectionModel().deselect(Ext.getCmp('gridPacked').getSelectionModel().getLastSelected());
        }

    },

    changeCmbEstado: function(){
        Ext.getCmp('filtrarGridPack').setDisabled(false);
        Ext.getCmp('clearFiltroGridPack').setDisabled(false);
    },

    cargarInterfaz: function(check, install, uninstall, update, scope,connection_date){
        var desc    = itemClickGridPacked.raw.DESCRIPCION;
        var depend  = itemClickGridPacked.raw.DEPENDENCIAS;
        var name    = itemClickGridPacked.raw.NAME.split('-');
        var logo    = itemClickGridPacked.raw.LOGO;
        installScope = scope;
        installCheck = check;
        cnx = connection_date;

        globalUninstall = uninstall;

        var titleWindows, textLabel;

        this.keyMap.newRepo.setDisabled(true);
        this.keyMap.modRepo.setDisabled(true);
        this.keyMap.delRepo.setDisabled(true);

        switch (scope) {
            case 'install':   //install
                titleWindows = 'Instalar paquete';
                textLabel = '¿Desea instalar el paquete '+ name[0] + '?';

                break;
            case 'update':   //uninstall
                titleWindows = 'Actualizar paquete';
                textLabel = '¿Desea actualizar el paquete '+ name[0] + '?';
                break;
            case 'revert':   //uninstall
                titleWindows = 'Revertir actualizaci&oacute;n';
                textLabel = '¿Desea revertir la actualización del paquete '+ name[0] + '?';
                break;
            case 'uninstall':   //uninstall
                titleWindows = 'Desinstalar aplicaci&oacute;n';
                textLabel = '¿Desea desinstalar el paquete '+ name[0] + '?';
                break;

        }

        //winaux
        var win = Ext.widget('winaux',{check:check,logo:logo,install:install,uninstall:uninstall,update:update,desc:desc,textLabel:textLabel,connection_date:connection_date});
        win.setTitle(titleWindows);
        win.setWidth((check === false) ? 460 :600);
        win.setHeight((check === false) ? 300 : 400);
        Ext.getCmp('fieldsetCnx').setVisible(check);
        win.show();
        win.center();
    },

    confirmCompile: function(){
        Msg.util.MostrarMsg('4',Zeolides.etiquetas.titleConfirmCompile,  Zeolides.etiquetas.msgConfirmCompile, this.installSuccessFull,this);

    },

    installSuccessFull: function(btn){

        var compile = (btn == 'YES') ? true : false;
        switch (installScope) {

            case 'install':   //install

                var appname = itemClickGridPacked.raw.NAME;
                var appvers = itemClickGridPacked.raw.VERSION;
                var check   = installCheck;

                var form = Ext.getCmp('formInstall').getForm();

                    var fraseEncript = this.encryptRSA(Ext.getCmp('password').getValue());
                    var objValues = form.getValues();
                    var plaintPass = objValues.password;
                    Ext.getCmp('password').maxLength = 200;
                    objValues.password = fraseEncript;
                    form.setValues(objValues);

                    form.submit({
                        url: 'copiararchivo',
                        timeout: 90000,
                        params: {
                            name: appname,
                            version: appvers,
                            baseDatos: !check,
                            opcion: compile,
                            flagSchemas : flagSchemas
                        },
                        waitTitle: Zeolides.etiquetas.titleInstaller,
                        waitMsg: Zeolides.etiquetas.textMsgInstall,

                        
                        failure: function (form, action) {

                            flagSchemas = null;
                            if (action.result.succes == true) {
                                Ext.getCmp('winAux').destroy();
                                Ext.getCmp('instalar').disable();
                                Ext.getCmp('gridPacked').getStore().load();

                                mostrarMensaje(7, action.result.datos);
                                
                            } else {
                               if(action.result.cod == '42P06'){
                                   Ext.getCmp('password').maxLength = 30;
                                   Ext.getCmp('password').setValue(plaintPass);
                                   
                                   var msg = ', debido a que existen esquemas de este paquete en la base de datos. ¿ Desea eliminarlos? Perder&aacute; los datos correspondientes.';
                                   var error = action.result.datos.split(',');
                                   Msg.util.MostrarMsg('4','Error', error[0]+msg, myScope.problemsWidthSchemas, myScope);
                               }else{
                                   Ext.getCmp('password').maxLength = 30;
                                   Ext.getCmp('password').setValue(plaintPass);
                                   mostrarMensaje(6, action.result.datos);
                                   
                               }
                            }

                        }
                    });

            break;
            case 'update':   //uninstall

                var urlapp  = itemClickGridPacked.raw.URI;
                var appname = itemClickGridPacked.raw.NAME;
                var depends = itemClickGridPacked.raw.DEPENDENCIAS;
                var vers    = itemClickGridPacked.raw.VERSION ;
                var check   = installCheck;

                var form = Ext.getCmp('formInstall').getForm();
                form.submit({
                    url: 'actualizar',
                    timeout: 90000,
                    params: {
                        nameapp: appname,
                        dependencias: depends,
                        version: vers,
                        baseDatos: check,
                        opcion:compile
                    },
                    waitTitle: Zeolides.etiquetas.titleUpdateApp,
                    waitMsg: Zeolides.etiquetas.msgUpdateApp,
                   
                    failure: function(form, action){
                        Ext.getCmp('winAux').destroy();
                        Ext.getCmp('instalar').disable();


                        if (action.result.succes == true) {
                            Ext.getCmp('gridPacked').getStore().load();

                            mostrarMensaje(7, action.result.datos);                            
                        } else {
                            mostrarMensaje(6, action.result.datos);                         
                        }

                    }
                });

            break;
            case 'revert':
                var urlapp  = itemClickGridPacked.raw.URI;
                var appname = itemClickGridPacked.raw.NAME;
                var depends = itemClickGridPacked.raw.DEPENDENCIAS;
                var vers    = itemClickGridPacked.raw.VERSION;

                var form = Ext.getCmp('formInstall').getForm();
                form.submit({
                    url: 'revert',
                    timeout: 90000,
                    params: {
                        nameapp: appname,
                        dependencias: depends,
                        version: vers,
                        baseDatos: check,
                        opcion:compile
                    },
                    waitTitle: Zeolides.etiquetas.titleUpdateApp,
                    waitMsg: Zeolides.etiquetas.msgUpdateApp,
                   
                    failure: function(form, action){
                        Ext.getCmp('winAux').destroy();
                        Ext.getCmp('instalar').disable();

                        if (action.result.succes == true) {

                            Ext.getCmp('gridPacked').getStore().load();

                            mostrarMensaje(7, action.result.datos);
                            
                        } else {
                            mostrarMensaje(6, action.result.datos);
                           
                        }

                    }
                });

            break;  //
                myMask.show();
        }
    },

    unistallSuccessFull: function(){
        cnx ? Msg.util.MostrarMsg('4',Zeolides.etiquetas.titleDatosBD,  Zeolides.etiquetas.msgDatosBD, this.desintaltApp,this) : myScope.desintaltApp();

    },
    desintaltApp: function(btn){

        var clearDatos = (btn == 'YES') ? true: false;
       // case 'uninstall':
        var appname = itemClickGridPacked.raw.NAME;
        var appvers = itemClickGridPacked.raw.VERSION;
	myMask.show();
        Ext.Ajax.request({
            url: 'desinstalarapp',
            timeout: 90000,
            method: 'POST',
            params: {
                paquetes: Ext.encode(globalUninstall),
                deleteDatos:clearDatos
            },
            callback: function(options, success, response) {

                Ext.getCmp('winAux').destroy();
                Ext.getCmp('instalar').disable();

                responseData = Ext.decode(response.responseText);
		        myMask.hide();
                if (responseData.succes == true) {

                    mostrarMensaje(7, Zeolides.etiquetas.msgDesintalar);

                    myScope.allBtnsDisabled();

                    Ext.getCmp('gridPacked').getStore().load();

                }
                else {
                    mostrarMensaje(6, Zeolides.etiquetas.msgErrorDesintalar);

                }

            }
        });

    },

    onRenderWinAux: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        flagSchemas = null;
    },

    filtrarGridPacks: function(){
        myScope.allBtnsDisabled();
        var store = Ext.getCmp('gridPacked').getStore();
        var filtro = Ext.getCmp('searchFieldPack').getValue();
        var state = Ext.getCmp('estado').getValue();

        store.clearFilter();
        store.load({params: {
            founded: filtro,
            estado: state
        },callback: function(records, operation, success) {
			
        }});
        Ext.getCmp('clearFiltroGridPack').setDisabled(false);

    },

    limpiarFiltroGridPacks: function(){
        myScope.allBtnsDisabled();
        var store = Ext.getCmp('gridPacked').getStore();
        Ext.getCmp('searchFieldPack').reset();
        Ext.getCmp('estado').reset();
        store.clearFilter();
        store.load();
        Ext.getCmp('filtrarGridPack').disable();
        Ext.getCmp('clearFiltroGridPack').disable();

    },

    searchFieldPack: function(){
        if(Ext.getCmp('searchFieldPack').getValue()!="") {
            var re = /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\/\s\-]*))$/;

            if(re.test(Ext.getCmp('searchFieldPack').getValue())){
                Ext.getCmp('filtrarGridPack').enable();
                Ext.getCmp('clearFiltroGridPack').enable();
            }
            else{
                Ext.getCmp('filtrarGridPack').disable();
                Ext.getCmp('clearFiltroGridPack').disable();
            }

        }
        else
        {
            Ext.getCmp('filtrarGridPack').disable();
            Ext.getCmp('clearFiltroGridPack').disable();
        }
    },

    problemsWidthSchemas: function(btn){
        if(btn == 'YES'){
            flagSchemas = true;
        }else{
            flagSchemas = false;
            mostrarMensaje(7, 'Se instalar&aacute; el paquete sin correr script de base de datos.');
            Ext.getCmp('fieldsetCnx').hide();
            var win = Ext.getCmp('winAux');
            win.setWidth(460);
            win.setHeight(300);
        }

    }

});
