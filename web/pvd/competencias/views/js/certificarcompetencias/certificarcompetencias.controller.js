/*
 *Certificar competencias.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Competencia
 * @uses Pvd.Competencia.Certificarcompetencias
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Competencia.Certificarcompetencias');

/////////////////////////////////////Controlador de la Interfaz///////////////////////////////////////////////////////

//Controlador de la vista del componente
Pvd.Competencia.Certificarcompetencias.Controlador = {
    init: function (idioma, vista, modelo) {

        var accion, node, personaselect, compselect, ccsel, recordsLoaded, recordsLoadeda;
        var recQrElement = new Ext.data.Record.create(
            {name:'idpersonaevaluacion'}, {name:'proceso'}, {name:'denominacion'},
            {name:'fiperiodo'}, {name:'ffperiodo'}, {name:'valor'}
        );
        vista.tpEstructura.tree.root.on('expand', function (nodo) {
            node = nodo.childNodes[0];
            vista.tpEstructura.tree.getSelectionModel().select(node);
            modelo.stPersonas.baseParams.idcargo = null;
            modelo.stPersonas.baseParams = {idestructura: node.attributes.id};
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.tpEstructura.tree.on('click', function (n) {
            node = n;
            if (node.attributes.idconcepto == 7) {
                modelo.stPersonas.baseParams.idcargo = node.attributes.id;
                modelo.stPersonas.baseParams.idestructura =  null;
            } else {
                modelo.stPersonas.baseParams.idcargo = null;
                modelo.stPersonas.baseParams.idestructura =  node.attributes.id;
            }
            modelo.stPersonas.removeAll();
            modelo.stCompetencia.removeAll();
            modelo.stPersonas.load({params: {start: 0, limit: 15, query: vista.sfBuscar.getValue()}});
        });

        vista.gpPersonas.getSelectionModel().on('rowselect', function () {
            personaselect = vista.gpPersonas.getSelectionModel().getSelected().data;
            vista.gpComp.enable();
            modelo.stCompetencia.baseParams.idpersona = personaselect.idpersona;
            modelo.stCompetencia.baseParams.idcargo = personaselect.idcargo;
            modelo.stCompetencia.load();
        });

        vista.gpCompCargo.getSelectionModel().on('rowselect', function () {
            ccsel = vista.gpCompCargo.getSelectionModel().getSelected().data;
            modelo.stValores.baseParams.idescala = ccsel.idescala;
            modelo.stValores.load();
            if (ccsel.cargo == 1 || ccsel.idcompetenciapersona != null) {
                vista.btnEliminarComExtra.disable();
            } else {
                vista.btnEliminarComExtra.enable();
            }
        });

        vista.gpComp.getSelectionModel().on('rowselect', function () {
            compselect = vista.gpComp.getSelectionModel().getSelected().data;
            vista.btnEliminar.enable();
            if (compselect.certificacionactiva == 1) {
                vista.btnCertificar.disable();
            } else {
                vista.btnCertificar.enable();
            }
        });

        modelo.stCompetencia.on('beforeload', function () {
            vista.btnEliminar.disable();
            vista.btnCertificar.disable();
            modelo.stCompetencia.removeAll();
        });

        modelo.stCompetencia.on('load', function () {
            if (modelo.stCompetencia.getCount() > 0) {
                vista.btnModificar.enable();
            } else {
                vista.btnModificar.disable();
            }
        });

        modelo.stCompCargo.on('load', function () {
            vista.btnEliminarComExtra.disable();
            if (accion == 'add') {
                modelo.stCompetencia.each(function(rec){
                    var rcom = modelo.stCompCargo.getById(rec.data.idcompetencia);
                    if (rcom) {
                        modelo.stCompCargo.remove(rcom);
                    }
                });
            }
        });

        modelo.stCompNom.on('load', function () {
            modelo.stCompetencia.each(function(rec){
                var rcomn = modelo.stCompNom.getById(rec.data.idcompetencia);
                if (rcomn) {
                    modelo.stCompNom.remove(rcomn);
                }
            });
        });

        modelo.stPersonas.on('load', function () {
            vista.sfBuscar.enable();
            vista.gpComp.disable();
        });

        modelo.stEvaluaciones.on('load', function (st, data) {
            if (compselect.idcertificacion) {
                vista.dfDesdecert.setRawValue(compselect.fdesdec);
                vista.dHastacert.setRawValue(compselect.fhastac);
                var objrecvv = new Array();
                modelo.stEvaluaciones.each(function(rec){
                    if (rec.data.idpersonaevaluacion == compselect.idpersonaevaluacion) {
                        objrecvv.push(rec);
                    }
                });
                if (objrecvv.length > 0) {
                    vista.gpEvaluaciones.getSelectionModel().selectRecords(objrecvv);
                }
            } else {
                vista.dfDesdecert.reset();
                vista.dHastacert.reset();
            }
            recordsLoaded = data;
        });

        modelo.stAcciones.on('load', function (st, data) {
            if (compselect.idcertificacion) {
                var objrecaa = new Array();
                modelo.stAcciones.each(function(rec){
                    if (rec.data.idaccionparticipante == compselect.idaccionparticipante) {
                        objrecaa.push(rec);
                    }
                });
                if (objrecaa.length > 0) {
                    vista.gpAccion.getSelectionModel().selectRecords(objrecaa);
                }
            }
            recordsLoadeda = data;
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.btnAdicionarComExtra.enable();
            modelo.stCompCargo.baseParams.idcargo = personaselect.idcargo;
            modelo.stCompCargo.load();
            vista.windAddComp.setTitle('Adicionar competencias');
            vista.windAddComp.show();
        });

        vista.btnAdicionar.on('click', function () {
            accion = 'add';
            vista.btnAdicionarComExtra.enable();
            modelo.stCompCargo.baseParams.idcargo = personaselect.idcargo;
            modelo.stCompCargo.load();
            vista.windAddComp.setTitle('Adicionar competencias');
            vista.windAddComp.show();
        });

        vista.btnAdicionarComExtra.on('click', function () {
            modelo.stCompNom.load({params: {start: 0, limit: 15}});
            vista.windAddCompN.show();
        });

        vista.btnModificar.on('click', function () {
            accion = 'mod';
            vista.btnAdicionarComExtra.disable();
            modelo.stCompCargo.baseParams.idcargo = null;
            modelo.stCompCargo.baseParams.idpersona = personaselect.idpersona;
            modelo.stCompCargo.load();
            vista.windAddComp.setTitle('Modificar competencias');
            vista.windAddComp.show();
        });

        vista.btnEliminar.on('click', function () {
            eliminarCompetencia();
        });

        vista.btnEliminarComExtra.on('click', function () {
            eliminarCompetenciaGrid();
        });

        vista.btnCertificar.on('click', function () {
            modelo.stEvaluaciones.baseParams.idpersona = personaselect.idpersona;
            modelo.stEvaluaciones.load();
            modelo.stAcciones.baseParams.idpersona = personaselect.idpersona;
            modelo.stAcciones.load();
            vista.windCertificar.show();
            vista.dfDesdecert.setMinValue(compselect.fdesde);
        });

        vista.btnCancelarC.on('click', function () {
            vista.windAddComp.hide();
        });

        vista.btnCancelarCN.on('click', function () {
            vista.windAddCompN.hide();
        });

        vista.btnCancelarCert.on('click', function () {
            vista.windCertificar.hide();
        });

        vista.btnAceptarC.on('click', function () {
            guardarCompetencia();
        });

        vista.btnAceptarCN.on('click', function () {
            addCompNomen();
        });

        vista.btnAceptarCert.on('click', function () {
            certificarCompetencia();
        });

        vista.btnBuscar.on('click', function () {
            if (vista.tfbuscar.getValue() != '') {
                buscarPeriodo();
            }
        });

        vista.btnBuscara.on('click', function () {
            if (vista.tfbuscara.getValue() != '') {
                buscaraccion();
            }
        });

        vista.btnLimpiar.on('click', function () {
            if (vista.tfbuscar.getValue() != '') {
                vista.tfbuscar.reset();
                modelo.stEvaluaciones.removeAll();
                modelo.stEvaluaciones.add(recordsLoaded);
            }
        });

        vista.btnLimpiara.on('click', function () {
            if (vista.tfbuscara.getValue() != '') {
                vista.tfbuscara.reset();
                modelo.stAcciones.removeAll();
                modelo.stAcciones.add(recordsLoadeda);
            }
        });

        function certificarCompetencia()
        {
            var s = vista.gpEvaluaciones.getSelectionModel().getSelected();
            var acc = vista.gpAccion.getSelectionModel().getSelected();
            if (s || acc) {
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: 'addCertificacion',
                    params: {
                        idcertificacion: compselect.idcertificacion,
                        idpersonaevaluacion: (s)?s.data.idpersonaevaluacion:null,
                        idaccionparticipante: (acc)?acc.data.idaccionparticipante:null,
                        idcompetenciapersona: compselect.idcompetenciapersona,
                        fdesde: vista.dfDesdecert.getRawValue(),
                        fhasta: vista.dHastacert.getRawValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == true) {
                            mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                            vista.windCertificar.hide();
                            modelo.stCompetencia.removeAll();
                            modelo.stCompetencia.reload();
                        } else {
                            mostrarMensaje(6, 'Debe seleccionar al menos un periodo evaluativo.');
                        }
                    }
                });
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos un periodo evaluativo.');
            }
        }

        function guardarCompetencia()
        {
            var ids = new Array();
            var s = vista.gpCompCargo.getSelectionModel().getSelections();
            if (s.length > 0) {
                for(i = 0; i < s.length; i++) {
                    ids.push(s[i].data);
                }
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add')?'addCompetencias':'updateCompetencias',
                    params: {
                        idpersona: personaselect.idpersona,
                        competencias: Ext.encode(ids)
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == true) {
                            mostrarMensaje(1, 'Los datos fueron guardados satisfactoramente.');
                            vista.windAddComp.hide();
                            modelo.stCompetencia.removeAll();
                            modelo.stCompetencia.reload();
                            vista.gpCompCargo.getSelectionModel().clearSelections();
                        } else if(responseData ==2){
                            mostrarMensaje(6, 'Existen datos con valores vac&iacute;os');
                        } else {
                            mostrarMensaje(6, 'Ocurrió un error mientra se guardaban los datos.');
                        }
                    }
                });
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos una competencia.');
            }
        }

        function addCompNomen(){
            var noadd = 0;
            var s = vista.gpCompNom.getSelectionModel().getSelections();
            Ext.each(s, function (recs) {
                var existe = false;
                modelo.stCompCargo.each(function (obj) {
                    if (obj.data.idcompetencia == recs.data.idcompetencia) {
                        existe = true;
                    }
                }, this);
                if (existe == false) {
                    var rec = new Ext.data.Record({
                        id: recs.data.id,
                        idcompetencia: recs.data.idcompetencia,
                        competencia: recs.data.denominacion,
                        descripcion: recs.data.descripcion,
                        idescala: recs.data.idescala,
                        idcompetenciapersona: null,
                        idvalor: null,
                        valor: null,
                        fdesde: null,
                        fhasta: null,
                        cargo: 0
                    });
                    modelo.stCompCargo.add(rec);
                } else {
                    noadd = 1;
                }
            });
            if (noadd == 1) {
                var msg1 = (s.length == 1)?'El elemento que desea adicionar ya existe.':'Alguno(s) de los elementos que desea adicionar ya existe.';
                mostrarMensaje(1, msg1);
            }
            vista.windAddCompN.hide();
        }

        function eliminarCompetencia()
        {
            var ids = new Array();
            var s = vista.gpComp.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idcompetenciapersona);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la competencia seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las competencias seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/competencias/index.php/certificarcompetencias/deleteCompetencia',
                        params: {competencias: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La competenecia seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las competenecias seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La competencia ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las competencias han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.stCompetencia.removeAll();
                            modelo.stCompetencia.reload();
                        }
                    });
                }
            });
        }

        function eliminarCompetenciaGrid()
        {
            var s = vista.gpCompCargo.getSelectionModel().getSelections();
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la competencia seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las competencias seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    for(i = 0; i < s.length; i++) {
                        modelo.stCompCargo.remove(s[i]);
                    }
                    if (s.length == 1) {
                        mensaje = 'La competencia ha sido eliminada satisfactoriamente.';
                    } else {
                        mensaje = 'Las competencias han sido eliminadas satisfactoriamente.';
                    }
                    mostrarMensaje(1, mensaje);
                }
            });
        }

        function buscarPeriodo() {
            var tVal = vista.tfbuscar.getRawValue().toLowerCase();
            var cant = modelo.stEvaluaciones.getCount();
            var listper =modelo.stEvaluaciones.getRange(0,cant);
            var cont = 0;
            var conicidencias = new Array();
            if(tVal != ' '){
                Ext.each(listper, function(rec){
                    var tStr =  rec.data.denominacion.toString().toLowerCase();
                    if(tStr.indexOf(tVal)!=-1){
                        conicidencias.push(new recQrElement({
                            idpersonaevaluacion: rec.data.idpersonaevaluacion,
                            proceso: rec.data.proceso,
                            denominacion: rec.data.denominacion,
                            fiperiodo: rec.data.fiperiodo,
                            ffperiodo: rec.data.ffperiodo,
                            valor: rec.data.valor
                        }));
                    }
                });
                modelo.stEvaluaciones.removeAll();
                modelo.stEvaluaciones.add(conicidencias);
                if(conicidencias.length == 0){
                    mostrarMensaje(1, 'No existen resultados que coincidan con el criterio de búsqueda.');
                }
            }
        }

        function buscaraccion() {
            var tVal = vista.tfbuscara.getRawValue().toLowerCase();
            var cant = modelo.stAcciones.getCount();
            var lis = modelo.stAcciones.getRange(0,cant);
            var cont = 0;
            var conicidencias = new Array();
            if(tVal != ' '){
                Ext.each(lis, function(rec){
                    var tStr =  rec.data.denominacion.toString().toLowerCase();
                    if(tStr.indexOf(tVal)!=-1){
                        conicidencias.push(new recQrElement({
                            idpersonaevaluacion: rec.data.idaccionparticipante,
                            denominacion: rec.data.denominacion,
                            terminado: rec.data.terminado,
                            resultado: rec.data.resultado
                        }));
                    }
                });
                modelo.stAcciones.removeAll();
                modelo.stAcciones.add(conicidencias);
                if(conicidencias.length == 0){
                    mostrarMensaje(1, 'No existen resultados que coincidan con el criterio de búsqueda.');
                }
            }
        }

        //Manipulador de HotKeys
        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imlhbx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        if(vista.btnAdicionarComExtra.isVisible()){
                            modelo.stCompNom.load({params: {start: 0, limit: 15}});
                            vista.windAddCompN.show();
                        } else if(vista.btnAdicionar.isVisible()) {
                            accion = 'add';
                            vista.btnAdicionarComExtra.enable();
                            modelo.stCompCargo.baseParams.idcargo = personaselect.idcargo;
                            modelo.stCompCargo.load();
                            vista.windAddComp.setTitle('Adicionar competencias');
                            vista.windAddComp.show();
                        }
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            accion = 'mod';
                            vista.btnAdicionarComExtra.disable();
                            modelo.stCompCargo.baseParams.idcargo = null;
                            modelo.stCompCargo.baseParams.idpersona = personaselect.idpersona;
                            modelo.stCompCargo.load();
                            vista.windAddComp.setTitle('Modificar competencias');
                            vista.windAddComp.show();
                        }
                        break;
                    }
                    case 76:{ //l para limpiar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger1Click();
                        }
                        break;
                    }
                    case 66:{ //b para buscar
                        if (!vista.sfBuscar.getValue() != '') {
                            vista.sfBuscar.onTrigger2Click();
                        }
                        break;
                    }
                    case 88:
                    { //x para cancelar
                        if (vista.btnCancelarCN.isVisible()) {
                            vista.windAddCompN.hide();
                        } else if (vista.btnCancelarC.isVisible()) {
                            vista.windAddComp.hide();
                        } else if (vista.btnCancelarCert.isVisible()) {
                            vista.windCertificar.hide();
                        }
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    eliminarCompetencia();
                } else if(!vista.btnEliminarComExtra.disabled){
                    eliminarCompetenciaGrid();
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){
                if (vista.btnAceptarCN.isVisible()) {
                    addCompNomen();
                } else if(vista.btnAceptarC.isVisible()){
                    vista.btnAceptarC.focus();
                    guardarCompetencia();
                } else if (vista.btnAceptarCert.isVisible()) {
                    certificarCompetencia();
                }
            }
        }]);
    }
};
