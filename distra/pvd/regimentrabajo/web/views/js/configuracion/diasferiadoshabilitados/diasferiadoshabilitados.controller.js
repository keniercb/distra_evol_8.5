Ext.ns('Pvd.ControlAsistencia.DiasFeriadosHabilitados');
//Controlador de la vista del componente
Pvd.ControlAsistencia.DiasFeriadosHabilitados.Controlador = {
   
    init: function(idioma, vista, modelo) {
        var scope=this;
        this.recordsLoaded = new Array();
        var fecha = new Date();
        this.annoactual = fecha.getFullYear();
        this.idgrupodescanso = 0;
        this.idspersona = new Array();

        modelo.storeGruposRegimen.load({params:{limit:25,start:0},callback:function(recs,opt,sucs){}});


        vista.smgridGruposRegimen.on('selectionchange',function(th){
            Ext.each(th.getSelections(), function (recs) {
                scope.idspersona.push(recs.data.idpersona);
            });
            if(th.getSelections().length == 1){
                vista.listado.enable();
                vista.listadodiashabiles.enable();
                scope.idgrupodescanso = vista.smgridGruposRegimen.getSelected().id;
                modelo.fuenteDatosListado.load({params:{idgrupodescanso: vista.smgridGruposRegimen.getSelected().id},callback:function(recs,opt,sucs){
                    scope.recordsLoaded = recs;
                }});
                modelo.storeDiasFeriados.load({params : {idspersona: Ext.encode(scope.idspersona),idgrupodescanso: vista.smgridGruposRegimen.getSelected().id,anno:scope.annoactual}}
                );
            }
            if(th.getSelections().length == 0 || th.getSelections().length > 1){
                vista.listado.disable();
                vista.listadodiashabiles.disable();
                modelo.fuenteDatosListado.removeAll();
                modelo.storeDiasFeriados.removeAll();
            }
        });

        vista.smpersona.on('selectionchange',function(th){
            var idspersona = new Array();
            Ext.each(th.getSelections(), function (recs) {
                idspersona.push(recs.data.idpersona);
            });
            if(th.getSelections().length > 0){
                modelo.storeDiasFeriados.load({params : {idspersona: Ext.encode(idspersona),idgrupodescanso: scope.idgrupodescanso,anno:scope.annoactual}}
                );
            }else{
                modelo.storeDiasFeriados.load({params : {idspersona: Ext.encode(scope.idspersona),idgrupodescanso: scope.idgrupodescanso,anno:scope.annoactual}}
                );
                vista.smdiasferiados.clearSelections();
            }
        });

        vista.smdiasferiados.on('selectionchange',function(th){
            var diaHabilitado = false;
            var diaDeshabilitado = false;
            if(th.getSelections().length == 0 && (vista.gridGruposRegimen.getSelectionModel().getSelections().length == 0
                || vista.listado.getSelectionModel().getSelections().length == 0)){
                vista.btnHabilitar.disable();
                vista.btnDesabilitar.disable();
            }
            else{
                Ext.each(th.getSelections(), function (recs) {
                    if(recs.data.iddiaferiadohabilitado == 0){
                        diaDeshabilitado = true;
                    }else{
                        diaHabilitado = true;
                    }
                });
                if(diaDeshabilitado == true && diaHabilitado == true){
                    vista.btnHabilitar.disable();
                    vista.btnDesabilitar.disable();
                }else if(diaHabilitado == true ){
                    vista.btnDesabilitar.enable();
                    vista.btnHabilitar.disable();
                }else {
                    if (th.getSelections().length != 0 && (vista.listado.getSelectionModel().getSelections().length != 0 || vista.gridGruposRegimen.getSelectionModel().getSelections().length != 0)) {
                        vista.btnHabilitar.enable();
                        vista.btnDesabilitar.disable();
                    }
                }
            }
        });

        vista.listadodiashabiles.getSelectionModel().on('rowdeselect', function () {
            if(vista.listadodiashabiles.getSelectionModel().getSelections().length == 0){
                vista.btnHabilitar.disable();
                vista.btnDesabilitar.disable();
            }
        }, this);

        vista.btnDesabilitar.on('click',function(){
            delDiasFeriados();
        }, this);

        function delDiasFeriados() {
            var idspersona = new Array();
            var iddiaferiadohabilitado = new Array();
            var idsgrupodescanso = new Array();
            var arreglo = new Array();
            var fechas = new Array();
            var tipo = 1;

            Ext.each(vista.gridGruposRegimen.getSelectionModel().getSelections(), function (recs) {
                idsgrupodescanso.push(recs.data.idgrupodescanso);
            });

            Ext.each(vista.listado.getSelectionModel().getSelections(), function (recs) {
                idspersona.push(recs.data.idpersona);
            });
            Ext.each(vista.listadodiashabiles.getSelectionModel().getSelections(), function (recs) {
                iddiaferiadohabilitado.push(recs.data.iddiaferiadohabilitado);
                fechas.push(recs.data.fecha);
            });

            if(idspersona.length>0){
                arreglo.push(idspersona);
                tipo = 1;
            }else{
                arreglo.push(idsgrupodescanso);
                tipo = 2;
            }

            PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
            Ext.Ajax.request({
                url: 'delDiasFeriadosHabiles',
                method: 'POST',
                params: {
                    datos: Ext.encode(arreglo),
                    iddiaferiadohabilitado: Ext.encode(iddiaferiadohabilitado),
                    fechas: Ext.encode(fechas),
                    tipo: tipo,
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('mascaraEnviarDatos');
                    var responseData = Ext.decode(response.responseText);
                    if(responseData.cod == 1) {
                        mostrarMensaje(1, idioma.msgDESHok);
                    }
                    modelo.storeDiasFeriados.load(
                        {
                            params : {idspersona: Ext.encode(idspersona),idgrupodescanso: scope.idgrupodescanso,anno:scope.annoactual}}
                    );
                }
            });
        }
        vista.btnHabilitar.on('click',function(){
            habilitarDiasFeriados();
        }, this);

        function habilitarDiasFeriados() {
            var idsgrupodescanso = new Array();
            var idspersona = new Array();
            var arreglo = new Array();
            var fechashoras = new Array();
            var tipo = 1;
            var bandera = false;

            Ext.each(vista.gridGruposRegimen.getSelectionModel().getSelections(), function (recs) {
                idsgrupodescanso.push(recs.data.idgrupodescanso);
            });

            Ext.each(vista.listado.getSelectionModel().getSelections(), function (recs) {
                idspersona.push(recs.data.idpersona);
            });
            Ext.each(vista.listadodiashabiles.getSelectionModel().getSelections(), function (recs) {
                fechashoras.push({
                    fecha:recs.data.fecha,
                    horas:recs.data.horas
                });
            });
            if(idspersona.length>0){
                arreglo.push(idspersona);
                tipo = 1;
            }else{
                arreglo.push(idsgrupodescanso);
                tipo = 2;
            }

            for(var i = 0; i < fechashoras.length; i++){
                if(fechashoras[i].horas == ''){
                    bandera = true;
                    break;
                }
            }

            //if(bandera == false){
                PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                Ext.Ajax.request({
                    url: 'guardarDiasFeriadosHabiles',
                    timeout:99999999999,
                    method: 'POST',
                    params: {
                        datos: Ext.encode(arreglo),
                        fechashoras: Ext.encode(fechashoras),
                        tipo: tipo,
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mascaraEnviarDatos');
                        var responseData = Ext.decode(response.responseText);
                        if(responseData.cod == 1) {
                            mostrarMensaje(1, idioma.msgHABok);
                        }
                        modelo.storeDiasFeriados.load(
                            {
                                params : {idspersona: Ext.encode(idspersona),idgrupodescanso: scope.idgrupodescanso,anno:scope.annoactual}}
                        );
                    }
                });
           /* }else{
                mostrarMensaje(1, idioma.msgerrorHoras);
            }*/
        }

        vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
            modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
        });

        vista.btnBuscar.on('click', function(){
            buscarpersona();
        }, this);

        buscarpersona = function() {
            var tVal = vista.tfbuscar.getRawValue().toLowerCase();
            var cant = modelo.fuenteDatosListado.getCount();
            var listpersonas = modelo.fuenteDatosListado.getRange(0,cant);
            var cont = 0;
            var conicidencias = new Array();
            if(tVal != ' '){
                Ext.each(listpersonas, function(rec){
                    var tStr =  rec.data.nombreapellidos.toString().toLowerCase();
                    if(tStr.indexOf(tVal)!=-1){
                        conicidencias.push(new modelo.recQrElement({
                            idpersona: rec.data.idpersona,
                            nombreapellidos: rec.data.nombreapellidos,
                            denomcargo: rec.data.denomcargo,
                            entidad: rec.data.entidad,
                            area: rec.data.area,
                        }));
                    }
                });
                modelo.fuenteDatosListado.removeAll();
                vista.listado.getStore().add(conicidencias);

                if(conicidencias.length == 0){
                    mostrarMensaje(1, idioma.MsgNoResultMostrar);
                }
            }

        }

        vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
            modelo.fuenteDatosListado.removeAll();
            modelo.fuenteDatosListado.load({params:{idgrupodescanso: scope.idgrupodescanso},callback:function(recs,opt,sucs){
            }});
        });

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'bl',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 66:{ //b para buscar
                        buscarpersona();
                       break;
                    }
                    case 76:{ //l para limpiar
                        vista.tfbuscar.reset();
                        modelo.fuenteDatosListado.removeAll();
                        modelo.fuenteDatosListado.load({params:{idgrupodescanso: scope.idgrupodescanso},callback:function(recs,opt,sucs){
                        }});
                        break;
                    }
                }
            }
        },{
            key: 13,//Enter para buscar
            fn: function(){
                    buscarpersona();
                 }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'h',
            fn: function(){
                if(!vista.btnHabilitar.disabled){
                    habilitarDiasFeriados();
                }
            }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'd',
            fn: function(){
                if(!vista.btnDesabilitar.disabled){
                    delDiasFeriados();
                }
            }
        }]);



    }
}