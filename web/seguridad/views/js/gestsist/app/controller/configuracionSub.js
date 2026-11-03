/**
 * Created by lilianne on 23/01/15.
 */
Ext.define('Conf.controller.Gestsist', {
    id: 'gestsist_controller',
    extend: 'Ext.app.Controller',

    views: [
        'gestsist.Principal',
        'gestsist.treeDragDrop',
        'gestsist.panelMenuIzquierdo',
        'gestsist.contextMenu',
        'gestsist.panelDerecho',
        'gestsist.formularioPanel',
        'gestsist.gridEditorActions',
        'gestsist.panelGrid',
        'gestsist.VentanaAddAccion',
        'gestsist.arbolRefFunc',
        'gestsist.arbolRefSist',
        'gestsist.VentanaReferencia',
        'gestsist.VentanaImportarSistema'
    ],

    refs: [{
        ref: 'principal',
        selector: 'principal'
    }],

    init: function() {
        var _this = this;
        contextmenu = null;
        insertarSub = false;
        insertarFunc = false;
        insertarRec = false;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;
        recordNodoSelect = null;
        var ultimoRecord;
        estilo = null;

        this.control({

            'principal': {
                render: _this.onRenderPrincipal
            },

            'principal treepanel[name=treeDD]': {
                render: _this.onRender,
                beforeitemexpand :_this.onBeforeitemexpand,
                beforeload: _this.onBeforeload,
                load: _this.onLoad,
                itemclick: function(view, record, item){
                    Ext.getCmp('treeDD').getSelectionModel().select([record]);
                    function continuar() {
                        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
                        _this.onClick(view, record, item);

                    };
                    if(Ext.getCmp('btnGuardar').disabled==false) {
                        mostrarMensaje(2, perfil.etiquetas.datossinguardar,continuar);
                        //Msg.util.MostrarMsg(4,perfil.etiquetas.confirmacion,perfil.etiquetas.datossinguardar,continuar,this);
                    }
                    else
                    {
                        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
                        _this.onClick(view, record, item);
                    }

                },
                itemcontextmenu: _this.onItemcontextmenu,
                itemcollapse: _this.onItemcollapse
            },

            'panelMenuIzquierdo textfield[action=buscarTreeCaja]': {
                keyup: _this.filtrarTree
            },

            'panelMenuIzquierdo button[action=buscarTree]': {
                click: _this.filtrarTree
            },

            'panelMenuIzquierdo button[action=limpiarFiltroTree]': {
                click: _this.limpiarFiltroTree
            },

            'panelMenuIzquierdo menuitem[action=insertarSubsistema]': {
                click: _this.insertarSubsistema
            },

            'panelMenuIzquierdo menuitem[action=insertarFuncionalidad]': {
                click: _this.insertarFuncionalidad
            },

            'panelMenuIzquierdo menuitem[action=insertarRecurso]': {
                click: _this.insertarRecurso
            },

            'panelMenuIzquierdo button[action=importarsubsistema]': {
                click: _this.importarsubsistema
            },

            'panelMenuIzquierdo button[action=exportarsubsistema]': {
                click: _this.exportarsubsistema
            },

            'panelMenuIzquierdo button[action=eliminarcomponente]': {
                click: _this.eliminarcomponente
            },

            'contextMenu': {
                click: _this.onClickContextMenu
            },

            'panelDerecho': {
                render: _this.onRenderDerecho
            },

            'panelDerecho button[action=guardarcambios]': {
                click: _this.guardarcambios
            },

            'formularioPanel button[action=buscarReferencia]': {
                click: _this.buscarReferencia
            },


            'formularioPanel textfield[name=denominacion]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel textfield[name=abreviatura]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel combobox[name=icono]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel textfield[name= referencia]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel textarea[name=descripcion]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel checkbox[name=visibilidad]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel checkbox[name=externo]': {
                change: function(obj){
                    _this.habilitarGuardar(obj);
                    _this.resetearReferencia();
                }
            },

            'panelGrid button[action=insertarAccion]': {
                click: _this.insertarAccion
            },

            'panelGrid button[action=eliminarAccion]': {
                click: _this.eliminarAccion
            },

            'ventanaAddAccion': {
                render: _this.renderVentanaAddAccion
            },

            'ventanaAddAccion button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaAddAccion button[action=agregarAccion]': {
                click: _this.agregarAccion
            },

            'gridEditorActions': {
                selectionchange: _this.selectionchange,
                beforeedit: _this.beforeeditGrid,
                beforeselect: function(){
                    Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
                    Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
                },
                render: _this.renderGrid
            },

            'gridEditorActions textfield[action = buscarCajaGrid]': {
                keyup: _this.buscarCajaAcciones
            },

            'gridEditorActions button[action = buscarGrid]': {
                click: _this.buscarrAcciones
            },

            'gridEditorActions button[action = limpiarGrid]': {
                click: _this.limpiarCajaRecargargrid
            },

            'ventanaReferencia button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaReferencia button[action=closeWinRef]': {
                click: _this.closeWinRef
            },

            'ventanaReferencia': {
                render: _this.renderVentanaReferencia
            },

            'arbolRefFunc': {
                beforeload: _this.onBeforeloadArboRefFunc,
                itemclick: _this.onClickArboRefFunc
            },
            'arbolRefSist': {
                beforeload: _this.onBeforeloadArboRefSist,
                itemclick: _this.onClickArboRefSist
            },

            'ventanaImportarSistema button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaImportarSistema': {
                render: _this.renderVentanaImportarSistema
            },

            'ventanaImportarSistema button[action=importarSistema]': {
                click: _this.importarSistema
            }
        });
    },

    onRenderPrincipal: function () {
        this.keyMap = Ext.widget('keymapController');

    },

    onRender: function(arbolPanel){
        var _this = this;
        arbolPanel.getView().on('beforedrop', function(node,data, overModel,dropPosition, dropFunction, eOpts){   
            var indice = 0;
            var idsistemaDestino = 0;
            var idsitemaOrigen = 0;
            var indiceNodo = 0;
            var idsistema = null;
            var idfuncionalidad = null;
            _this.modIndex = function(idsistemaDestino,indice){         
                if (data.records[0].raw.type == 'funcionalidad') {
                    Ext.Ajax.request({
                        url: 'modificarRelacionFuncionalidadSitema',
                        method: 'POST',
                        params: {
                            idsistemaDestino: idsistemaDestino,
                            idfuncionalidad: data.records[0].raw.idfuncionalidad,
                            indice: indice
                        },

                        waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                        waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                        callback: function (options, success, response) {
                            _this.recargarNodo();
                            arbolPanel.getSelectionModel().select([data.records[0]]);                           
                        }
                    });
                }
                else if(data.records[0].raw.type == 'sistema'){
                    Ext.Ajax.request({
                        url: 'modificarRelacionSistemaSitema',
                        method: 'POST',
                        params: {
                            idsistemaDestino: idsistemaDestino,
                            idsistema: data.records[0].raw.idsistema,
                            indice: indice

                        },
                        waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                        waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                        callback: function (options, success, response) {
                            _this.recargarNodo();
                            arbolPanel.getSelectionModel().select([data.records[0]]);
                        }
                    });
                }
            };

            _this.moverRecursoHeredado = function(idFuncionalidadAdoptiva, idrecurso, externo,nodoAdoptivo, nodoContenedor){
                Ext.Ajax.request({
                    url: 'moverRecursoHeredado',
                    method: 'POST',
                    params: {
                        idfuncionalidadAdoptiva: idFuncionalidadAdoptiva,
                        idrecurso: idrecurso,
                        externo: externo

                    },
                    waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                    waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                        }
                        else{
                            mostrarMensaje(6,responseData.mensaje);
                            //Msg.util.msg(3, perfil.etiquetas.error, responseData.mensaje);
                        }
                        recordNodoSelect = nodoContenedor;
                        _this.recargarNodo();
                        arbolPanel.getSelectionModel().select([data.records[0]]);
                        recordNodoSelect = nodoAdoptivo;
                        _this.recargarNodo();
                        arbolPanel.getSelectionModel().select([data.records[0]]);

                    }
                });
            }
          
            _this.existeRecurso = function(idrecurso, idfuncionalidadAdoptiva){           
                var xhr = new XMLHttpRequest();
                var formulario = new FormData();
                formulario.append("idfuncionalidadAdoptiva", idfuncionalidadAdoptiva);
                formulario.append("idrecurso",idrecurso);
                xhr.open("POST", "existeRecurso", false); //FALSE, para sincronizar hago una petición síncrona para facilitar la recepción
                xhr.send(formulario);
                var responseData = Ext .decode(xhr.responseText);
                return responseData
            }
           
            switch (dropPosition){
                case 'before':
                    console.log('entro al before');
                    console.log(data.records[0].raw.type);
                    console.log(overModel.raw.type);
                    console.log(data.records[0].raw.heredado);
                    if(data.records[0].raw.type == 'sistema' &&  overModel.raw.type == 'recurso')
                        return false;
                    else if(data.records[0].raw.type == 'funcionalidad' && overModel.raw.type == 'recurso')
                        return false;
                    if(data.records[0].raw.type == 'funcionalidad' && overModel.parentNode.isRoot()){
                        return false;
                    }
                    else if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'sistema')
                        return false;
                    if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'funcionalidad')
                        return false;
                    if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'recurso'){
                        if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){

                            idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                            idrecursomovido = data.records[0].raw.idrecurso;
                            externo = data.records[0].parentNode.raw.externa;                           
                            var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                          
                            if(responseData.length > 0)
                                return false;
                            else
                                _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido, externo, overModel.parentNode, data.records[0].parentNode);


                        }
                        else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){
                            if(data.records[0].parentNode.raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad) {

                                idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].raw.externo;
                                var responseData = _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                              
                                if (responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva, idrecursomovido,externo, overModel.parentNode, data.records[0].parentNode);
                            }
                            else
                                return false;
                        }
                        else{
                            return false;
                        }
                      
                    }
                    else if(data.records[0].raw.type == 'sistema' || data.records[0].raw.type == 'funcionalidad'){
                        indice = overModel.raw.indice;
                        if(overModel.parentNode.raw){
                            idsistemaDestino = overModel.parentNode.raw.idsistema;
                        }
                        else{
                            idsistemaDestino = overModel.parentNode.data.id;
                        }
                        if(data.records[0].raw.type == 'sistema'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idsistema = data.records[0].raw.idsistema;
                        }
                        else if(data.records[0].raw.type == 'funcionalidad'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idfuncionalidad = data.records[0].raw.idfuncionalidad;
                        }                      
                        Ext.Ajax.request({
                            url: 'modificarIndice',
                            method: 'POST',
                            params: {
                                idsitemaOrigen:  idsitemaOrigen,
                                indiceNodo: indiceNodo,
                                indice: indice,
                                idsistemaDestino: idsistemaDestino,
                                idsistema: idsistema,
                                idfuncionalidad: idfuncionalidad

                            },

                            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                            waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                            callback: function (options, success, response) {

                            }
                        });
                        recordNodoSelect = overModel.parentNode;
                        _this.modIndex(idsistemaDestino,indice);
                    }
                    break;
                case 'after':

                    if(data.records[0].raw.type == 'sistema' &&  overModel.raw.type == 'recurso')
                        return false;
                    else if(data.records[0].raw.type == 'funcionalidad' && overModel.raw.type == 'recurso')
                        return false;
                    if(data.records[0].raw.type == 'funcionalidad' && overModel.parentNode.isRoot()){
                        return false;
                    }
                    else if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'sistema')
                        return false;
                    if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'funcionalidad')
                        return false;
                    else if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'recurso'){
                        if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){

                            idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                            idrecursomovido = data.records[0].raw.idrecurso;
                            externo = data.records[0].parentNode.raw.externa;                           
                            var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                            
                            if(responseData.length > 0)
                                return false;
                            else
                                _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido, externo,overModel.parentNode, data.records[0].parentNode);

                        }
                        else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){

                            if(data.records[0].parentNode.raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad) {

                                idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].raw.externo;                             
                                var responseData = _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                               
                                if (responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva, idrecursomovido, externo,overModel.parentNode, data.records[0].parentNode);
                            }
                            else
                                return false;

                        }
                        else{
                            return false;
                        }                  
                    }
                    else{
                        indice = parseInt(overModel.raw.indice)+1;
                        if(overModel.parentNode.raw){
                            idsistemaDestino = overModel.parentNode.raw.idsistema;
                        }
                        else{
                            idsistemaDestino = overModel.parentNode.data.id;
                        }
                        if(data.records[0].raw.type == 'sistema'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idsistema = data.records[0].raw.idsistema;
                        }
                        else if(data.records[0].raw.type == 'funcionalidad'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idfuncionalidad = data.records[0].raw.idfuncionalidad;
                        }                       
                        Ext.Ajax.request({
                            url: 'modificarIndice',
                            method: 'POST',
                            params: {
                                idsitemaOrigen:  idsitemaOrigen,
                                indiceNodo: indiceNodo,
                                indice: indice,
                                idsistemaDestino: idsistemaDestino,
                                idsistema: idsistema,
                                idfuncionalidad: idfuncionalidad

                            },

                            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                            waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                            callback: function (options, success, response) {

                            }
                        });
                        recordNodoSelect = overModel.parentNode;
                        _this.modIndex(idsistemaDestino,indice);

                    }
                    break;
                case 'append':
                    console.log('entro al append');
                    console.log(data.records[0].raw.type);
                    console.log(overModel.raw.type);
                    console.log(data.records[0].raw.heredado);
                    if(overModel.isRoot() && data.records[0].raw.type == 'funcionalidad')
                        return false;
                    else if(!overModel.isRoot()){
                        if(data.records[0].raw.type == 'sistema' && overModel.raw.type == 'funcionalidad' || overModel.raw.type == 'recurso')
                            return false;
                        else if(data.records[0].raw.type == 'funcionalidad' && overModel.raw.type == 'funcionalidad' || overModel.raw.type == 'recurso')
                            return false;
                        else if(data.records[0].raw.type == 'recurso' && overModel.raw.type == 'sistema' || overModel.raw.type == 'recurso')
                            return false;
                    }
                    if(overModel.isExpanded()){
                        if(overModel.raw.type != 'funcionalidad'){
                            indice = overModel.childNodes.length;
                            if(overModel.raw){
                                idsistemaDestino = overModel.raw.idsistema;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);
                            }
                            else{
                                idsistemaDestino = overModel.data.id;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);
                            }
                        }
                        else if(overModel.raw.type == 'funcionalidad'){
                            if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].parentNode.raw.externa;                            
                                var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                             
                                if(responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido, externo,overModel, data.records[0].parentNode);

                            }
                            else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                if(data.records[0].parentNode.raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                    idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                                    idrecursomovido = data.records[0].raw.idrecurso;
                                    externo = data.records[0].raw.externo;                                  
                                    var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                                   
                                    if(responseData.length > 0)
                                        return false;
                                    else
                                        _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido,externo, overModel, data.records[0].parentNode);

                                }
                                else
                                    return false;

                            }
                            else{
                                return false;
                            }                           
                        }

                    }
                    else if(overModel.raw.type == 'funcionalidad'){
                        overModel.expand();
                        if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                            idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                            idrecursomovido = data.records[0].raw.idrecurso;
                            externo = data.records[0].parentNode.raw.externa;                       
                            var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                            
                            if(responseData.length > 0)
                                return false;
                            else
                                _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido,externo, overModel, data.records[0].parentNode);

                        }
                        else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                            if(data.records[0].parentNode.raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].raw.externo;                               
                                var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                              
                                if(responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido,externo, overModel, data.records[0].parentNode);

                            }
                            else
                                return false;

                        }
                        else{
                            return false;
                        }
                    }
                    else if(overModel.raw && overModel.raw.type != 'funcionalidad'){
                        Ext.Ajax.request({
                            url: 'cantidadHijos',
                            method: 'POST',
                            params: {
                                idsitema: overModel.raw.idsistema
                            },

                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                indice = responseData.cantidadHijos+1;
                                idsistemaDestino = overModel.raw.idsistema;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);
                            }
                        });
                    }
                    else{
                        Ext.Ajax.request({
                            url: 'cantidadHijos',
                            method: 'POST',
                            params: {
                                idsitema: overModel.data.id
                            },

                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                indice = responseData.cantidadHijos+1;
                                idsistemaDestino = overModel.data.id;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);

                            }
                        });
                    }



                    break;
            }       

        });

        arbolPanel.keyMap = Ext.widget('keymapController');

        arbolPanel.keyMap.pressAltIS(this);
        arbolPanel.keyMap.pressAltIF(this);
        arbolPanel.keyMap.pressAltIR(this);
        arbolPanel.keyMap.deleteComponente(this,arbolPanel);
        arbolPanel.keyMap.buscarTree(this);
        arbolPanel.keyMap.limpiarTree(this);
        arbolPanel.keyMap.importarSubsistema(this);
        arbolPanel.keyMap.exportarSubsistema(this);

        Ext.getCmp('cajaTextoDerechaArbol').focus(false, 200);

    },

    onRenderDerecho: function(){      
        Ext.getCmp('fieldsetformPanel').disable();
        Ext.getCmp('fieldsetformPanel').collapse();

        Ext.getCmp('panelGrid').disable();
        Ext.getCmp('addAccion').disable();
        Ext.getCmp('deleteAccion').disable();

        this.keyMap.pressAltG(this);
        this.keyMap.abrirReferencia(this);
    },

    onBeforeload: function (store, operation) {
        if (!operation.node.isRoot()) {
            if (operation.node.raw.idsistema)
                operation.params.idsistema = operation.node.raw.idsistema;
            if (operation.node.raw.idfuncionalidad) {
                operation.params.idfuncionalidad = operation.node.raw.idfuncionalidad;
                operation.params.referencia = operation.node.raw.referencia;
                operation.params.externa = operation.node.raw.externa;
            }
            operation.params.type = operation.node.raw.type;
            operation.params.start = 0;
            operation.params.limit = 0;
        }

    },

    onLoad: function(store, records, successful, operation, eOpts ){
        Ext.getCmp('treeDD').fireEvent('itemclick',records,records);
    },

    onBeforeitemexpand: function (nodo) {
        recordNodoSelect = nodo;
        Ext.getCmp('treeDD').getSelectionModel().select([nodo]);
    },

    onItemcollapse: function (node, eOpts ){
        Ext.getCmp('treeDD').fireEvent('itemclick',node,node);
    },
    onClick : function (view, record, item) {
        Ext.getCmp('gridAcciones').getStore().proxy.extraParams.msg = perfil.etiquetas.noseencontrarondatos;
        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);

        this.ultimoRecord=record;

        Ext.getCmp('btnGuardar').disable();
        recordNodoSelect = record;
        insertarSub = false;
        insertarFunc = false;
        insertarRec = false;

        Ext.getCmp('gridAcciones').getStore().removeAll();
        Ext.getCmp('cajaTextoGrid').reset();

        if (!record.isRoot()) {
            if (record.raw.idsistema == undefined) {
                if (record.raw.type == 'recurso') {
                    modificarSub = false;
                    modificarFunc = false;
                    modificarRec = true;
                    Ext.getCmp('gridAcciones').enable();
                    Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetRecurso);

                    Ext.getCmp('btnEliminar').enable();
                    Ext.getCmp('btnAdicionar').disable();

                    Ext.getCmp('addCategoria').hide();
                    Ext.getCmp('addSubsistema').hide();
                    Ext.getCmp('addFuncionalidad').hide();
                    Ext.getCmp('addRecurso').hide();

                    Ext.getCmp('addCategoria').disable();
                    Ext.getCmp('addSubsistema').disable();
                    Ext.getCmp('addFuncionalidad').disable();
                    Ext.getCmp('addRecurso').disable();

                    Ext.getCmp('btnImportar').disable();
                    Ext.getCmp('btnExportar').disable();

                    Ext.getCmp('panelGrid').enable();
                    Ext.getCmp('addAccion').disable();
                    Ext.getCmp('deleteAccion').disable();

                    if(recordNodoSelect.raw.heredado){
                         var externoRec = recordNodoSelect.raw.externo;
                    }
                    else{
                        var externoRec = recordNodoSelect.raw.externo ? recordNodoSelect.raw.externo : recordNodoSelect.parentNode.raw.externa;
                    }

                    Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                        params:{
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idrecurso: recordNodoSelect.raw.idrecurso,
                            externa:  externoRec,
                            referencia: recordNodoSelect.parentNode.raw.referencia,
                            start:0,
                            limit:20
                        }
                    });

                    Ext.getCmp('gridAcciones').columns[2].show();

                    if(recordNodoSelect.raw.heredado){
                        if(recordNodoSelect.raw.externo){
                            var externo = true;
                            Ext.getCmp('externo').show();
                        }
                        else{
                            var externo = false;
                            Ext.getCmp('externo').hide();
                        }
                    }
                    else{
                        if(record.parentNode.raw.externa){
                            var externo = true;
                            Ext.getCmp('externo').show();

                        }
                        else{
                            var externo = false;
                            Ext.getCmp('externo').hide();
                        }
                    }



                    Ext.getCmp('descripcion').nextTab = 'abreviatura';
                    Ext.getCmp('abreviatura').nextTab = 'denominacion';
                    Ext.getCmp('abreviatura').prevTab = 'descripcion';
                    Ext.getCmp('denominacion').prevTab = 'abreviatura';

                    Ext.getCmp('visibilidad').hide();
                    Ext.getCmp('refebuton').hide();
                    Ext.getCmp('referencia').disable();


                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        //'referencia': record.raw.referencia,
                        //'visibilidad': record.raw.visibilidad,
                        'externo': externo
                    });

                    Ext.getCmp('externo').setReadOnly(true);


                    if (Ext.getCmp('abreviatura').labelEl) {
                        Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    else {
                        Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }

                }
                else{ //funcionalidad
                    modificarSub = false;
                    modificarFunc = true;
                    modificarRec = false;

                    Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetFuncionalidad);

                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        'referencia': record.raw.referencia,
                        'visibilidad': record.raw.visibilidad,
                        'externo': record.raw.externa
                    });

                    Ext.getCmp('btnEliminar').enable();

                    Ext.getCmp('btnAdicionar').enable();
                    Ext.getCmp('addCategoria').hide();
                    Ext.getCmp('addSubsistema').hide();
                    Ext.getCmp('addFuncionalidad').hide();
                    Ext.getCmp('addRecurso').show();

                    Ext.getCmp('addCategoria').disable();
                    Ext.getCmp('addSubsistema').disable();
                    Ext.getCmp('addFuncionalidad').disable();
                    Ext.getCmp('addRecurso').enable();

                    Ext.getCmp('btnImportar').disable();
                    Ext.getCmp('btnExportar').disable();

                    Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                        params:{
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idrecurso: recordNodoSelect.raw.idrecurso,
                            externa:   recordNodoSelect.raw.externa,
                            referencia: recordNodoSelect.raw.referencia,
                            start:0,
                            limit:20
                        }
                    });

                    Ext.getCmp('deleteAccion').disable();

                    if(record.raw.externa){
                        Ext.getCmp('addAccion').enable();
                        Ext.getCmp('gridAcciones').columns[2].hide();
                        Ext.getCmp('externo').show();
                    }
                    else{ //funcionalidad interna
                        Ext.getCmp('addAccion').disable();
                        Ext.getCmp('gridAcciones').columns[2].show();
                        Ext.getCmp('externo').hide();
                    }
                    Ext.getCmp('panelGrid').enable();

                    Ext.getCmp('referencia').enable();
                    Ext.getCmp('refebuton').show();
                    Ext.getCmp('visibilidad').show();                 


                    if(Ext.getCmp('referencia').labelEl){
                        Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    Ext.getCmp('referencia').columnWidth = 0.9;
                    Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                    Ext.getCmp('btnBuscarReferencia').show();
                    Ext.getCmp('referencia').allowBlank = false;

                    Ext.getCmp('externo').setReadOnly(true);

                    if (Ext.getCmp('abreviatura').labelEl) {
                        Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                    }
                    else {
                        Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                    }

                    Ext.getCmp('descripcion').nextTab = 'visibilidad';
                    Ext.getCmp('abreviatura').nextTab = 'referencia';
                    Ext.getCmp('abreviatura').prevTab = 'visibilidad';
                    Ext.getCmp('visibilidad').prevTab = 'descripcion';

                    Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                    Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
                }
            }
            else{ //sistema

                modificarSub = true;
                modificarFunc = false;
                modificarRec = false;

                Ext.getCmp('externo').show();
                Ext.getCmp('referencia').enable();
                Ext.getCmp('refebuton').show();
                Ext.getCmp('visibilidad').hide();


                Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetSubsistema);
                if(record.raw.servidorweb){
                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        'referencia': record.raw.servidorweb,
                        'visibilidad': record.raw.visibilidad,
                        'externo': true
                    });

                    if(record.parentNode.isRoot()) {
                        Ext.getCmp('externo').setReadOnly(false);

                        Ext.getCmp('descripcion').nextTab = 'externo';
                        Ext.getCmp('externo').nextTab = 'abreviatura';
                        Ext.getCmp('abreviatura').prevTab = 'externo';
                        Ext.getCmp('abreviatura').nextTab = 'referencia';
                        Ext.getCmp('externo').prevTab = 'descripcion';

                    }
                    else{
                        if(record.parentNode.raw.servidorweb)
                            Ext.getCmp('externo').setReadOnly(true);
                        else
                            Ext.getCmp('externo').setReadOnly(false);

                        Ext.getCmp('descripcion').nextTab = 'abreviatura';
                        Ext.getCmp('abreviatura').prevTab = 'descripcion';
                        Ext.getCmp('abreviatura').nextTab = 'referencia';

                    }

                }
                else{
                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        'referencia': record.raw.referencia,
                        'visibilidad': record.raw.visibilidad,
                        'externo': false
                    });
                    Ext.getCmp('externo').setReadOnly(false);

                    Ext.getCmp('descripcion').nextTab = 'externo';
                    Ext.getCmp('externo').nextTab = 'abreviatura';
                    Ext.getCmp('abreviatura').prevTab = 'externo';
                    Ext.getCmp('abreviatura').nextTab = 'referencia';
                    Ext.getCmp('externo').prevTab = 'descripcion';

                }

                Ext.getCmp('btnEliminar').enable();
                Ext.getCmp('btnAdicionar').enable();
                Ext.getCmp('addCategoria').hide();
                Ext.getCmp('addSubsistema').show();
                Ext.getCmp('addFuncionalidad').show();
                Ext.getCmp('addRecurso').hide();

                Ext.getCmp('addCategoria').disable();
                Ext.getCmp('addSubsistema').enable();
                Ext.getCmp('addFuncionalidad').enable();
                Ext.getCmp('addRecurso').disable();

                Ext.getCmp('btnImportar').enable();
                Ext.getCmp('btnExportar').enable();

                Ext.getCmp('panelGrid').disable();
                Ext.getCmp('addAccion').disable();
                Ext.getCmp('deleteAccion').disable();


                if (recordNodoSelect.raw.servidorweb ) {
                    if(modificarSub) {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }

                        Ext.getCmp('referencia').columnWidth = 1.0;
                        Ext.getCmp('btnBuscarReferencia').hide();

                        Ext.getCmp('referencia').nextTab = 'denominacion';
                        Ext.getCmp('denominacion').prevTab = 'referencia';
                    }
                }
                else {
                    if (Ext.getCmp('referencia').labelEl) {
                        Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    else {
                        Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    Ext.getCmp('referencia').columnWidth = 0.9;
                    Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                    Ext.getCmp('btnBuscarReferencia').show();
                    Ext.getCmp('referencia').allowBlank = true;


                    Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                    Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
                }


                if (Ext.getCmp('abreviatura').labelEl) {
                    Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                }
                else {
                    Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                }

            }

            Ext.getCmp('formularioPanel').loadRecord(recordModel);
            recordcombo = null;
            if(recordModel.data.icono)
                recordcombo = Ext.getCmp('icono').getStore().findRecord('icon',recordModel.data.icono);
            if(recordcombo)
                Ext.getCmp('icono').selectedIndex = recordcombo.index;
            else
                Ext.getCmp('icono').selectedIndex = null;

            Ext.getCmp('fieldsetformPanel').enable();
            Ext.getCmp('fieldsetformPanel').expand();         

        }
        else{//es la raiz

            Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetSubsistema);
            Ext.getCmp('formularioPanel').getForm().reset();
            Ext.getCmp('fieldsetformPanel').disable();
            Ext.getCmp('fieldsetformPanel').collapse();

            Ext.getCmp('panelGrid').disable();
            Ext.getCmp('addAccion').disable();
            Ext.getCmp('deleteAccion').disable();

            Ext.getCmp('btnAdicionar').enable();
            Ext.getCmp('addCategoria').hide();
            Ext.getCmp('addSubsistema').show();
            Ext.getCmp('addFuncionalidad').hide();
            Ext.getCmp('addRecurso').hide();

            Ext.getCmp('addCategoria').disable();
            Ext.getCmp('addSubsistema').enable();
            Ext.getCmp('addFuncionalidad').disable();
            Ext.getCmp('addRecurso').disable();

            Ext.getCmp('btnEliminar').disable();
            Ext.getCmp('btnImportar').enable();
            Ext.getCmp('btnExportar').disable();
          

        }
    },

    onItemcontextmenu: function(view,record, item, index, evento, eOpts){
        evento.stopEvent();
     
        Ext.getCmp('btnGuardar').disable();
        if(contextmenu!=null){
            contextmenu.destroy();
        }

        Ext.getCmp('treeDD').fireEvent('itemclick',record,record);
        Ext.getCmp('treeDD').getSelectionModel().select([record]);
        contextmenu = Ext.widget('contextMenu',{record: record});
        contextmenu.showAt(evento.getXY());
    },

    filtrarTree: function(){
        var tree = Ext.getCmp('treeDD');
        var caja = Ext.getCmp('cajaTextoDerechaArbol');
        if(Ext.getCmp('cajaTextoDerechaArbol').getValue()!='') {
            Ext.getCmp('btnBuscarTreeDerecho').enable();
            Ext.getCmp('btnLimpiarTreeDerecho').enable();
        }
        else
        {
            Ext.getCmp('btnBuscarTreeDerecho').disable();
            Ext.getCmp('btnLimpiarTreeDerecho').disable();
        }
        tree.buscarMenuIzquierdo(caja.value);
    },

    limpiarFiltroTree: function(){
        var tree = Ext.getCmp('treeDD');
        Ext.getCmp('cajaTextoDerechaArbol').reset();
        Ext.getCmp('btnBuscarTreeDerecho').disable();
        Ext.getCmp('btnLimpiarTreeDerecho').disable();
        tree.clearFilter();

    },

    insertarSubsistema: function(){

        Ext.getCmp('referencia').enable();
        Ext.getCmp('refebuton').show();
        Ext.getCmp('visibilidad').hide();
        Ext.getCmp('referencia').allowBlank = true;

        if (Ext.getCmp('abreviatura').labelEl) {
            Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }
        else {
            Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }


        Ext.getCmp('formularioPanel').getForm().reset();
        Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleInsertarSubsistema);
        Ext.getCmp('fieldsetformPanel').enable();
        Ext.getCmp('fieldsetformPanel').expand() ;

        insertarSub = true;
        insertarFunc = false;
        insertarRec = false;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;

        if(!recordNodoSelect.isRoot()) {
            if (recordNodoSelect.raw.servidorweb) {
                Ext.getCmp('externo').setReadOnly(true);
                Ext.getCmp('externo').setValue(true);
                Ext.getCmp('referencia').setValue(Ext.getCmp('formularioPanel').getRecord().data.referencia);

                Ext.getCmp('descripcion').nextTab = 'abreviatura';
                Ext.getCmp('abreviatura').prevTab = 'descripcion';
                Ext.getCmp('abreviatura').nextTab = 'referencia';
                Ext.getCmp('referencia').nextTab = 'denominacion';
                Ext.getCmp('denominacion').prevTab = 'referencia';
            }
            else{
                Ext.getCmp('externo').setReadOnly(false);
                Ext.getCmp('externo').setValue(false);
                Ext.getCmp('referencia').reset();

                Ext.getCmp('descripcion').nextTab = 'externo';
                Ext.getCmp('externo').nextTab = 'abreviatura';
                Ext.getCmp('abreviatura').prevTab = 'externo';
                Ext.getCmp('abreviatura').nextTab = 'referencia';
                Ext.getCmp('externo').prevTab = 'descripcion';
                Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
            }

        }
        else{
            Ext.getCmp('externo').show();
            Ext.getCmp('externo').setReadOnly(false);
            Ext.getCmp('externo').setValue(false);
            Ext.getCmp('referencia').reset();

            Ext.getCmp('descripcion').nextTab = 'externo';
            Ext.getCmp('externo').nextTab = 'abreviatura';
            Ext.getCmp('abreviatura').prevTab = 'externo';
            Ext.getCmp('abreviatura').nextTab = 'referencia';
            Ext.getCmp('externo').prevTab = 'descripcion';
            Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
            Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
        }



    } ,

    insertarFuncionalidad: function(){

        Ext.getCmp('referencia').allowBlank = false;
        Ext.getCmp('visibilidad').show();
        Ext.getCmp('referencia').enable();
        Ext.getCmp('refebuton').show();
      

        Ext.getCmp('descripcion').nextTab = 'visibilidad';
        Ext.getCmp('visibilidad').nextTab = 'abreviatura';
        Ext.getCmp('abreviatura').prevTab = 'visibilidad';
        Ext.getCmp('visibilidad').prevTab = 'descripcion';

        Ext.getCmp('abreviatura').nextTab = 'referencia';
        Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
        Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';


        if (Ext.getCmp('abreviatura').labelEl) {
            Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }
        else {
            Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }

        Ext.getCmp('formularioPanel').getForm().reset();
        Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleInsertarFuncionalidad);

        Ext.getCmp('fieldsetformPanel').enable();
        Ext.getCmp('fieldsetformPanel').expand() ;

        insertarSub = false;
        insertarFunc = true;
        insertarRec = false;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;

        if(!recordNodoSelect.isRoot()) {
            if (recordNodoSelect.raw.servidorweb) {
                Ext.getCmp('externo').show();
                Ext.getCmp('externo').setReadOnly(true);
                Ext.getCmp('externo').setValue(true);             
            }
            else{
                Ext.getCmp('externo').hide();
                Ext.getCmp('externo').setReadOnly(false);
                Ext.getCmp('externo').setValue(false);              
            }

        }
    },

    insertarRecurso: function(){
        var _this = this;
        var arrayAccionesChequeadas = _this.obtenerAccionesChequeadasGrid();
        if(arrayAccionesChequeadas.length == 0) {
            mostrarMensaje(6,perfil.etiquetas.msgErrorInsRec);         
            return;
        }
        Ext.getCmp('visibilidad').hide();
        Ext.getCmp('referencia').disable();
        Ext.getCmp('refebuton').hide();

        Ext.getCmp('descripcion').nextTab = 'abreviatura';
        Ext.getCmp('abreviatura').nextTab = 'denominacion';
        Ext.getCmp('abreviatura').prevTab = 'descripcion';
        Ext.getCmp('denominacion').prevTab = 'abreviatura';

        if (Ext.getCmp('abreviatura').labelEl) {
            Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
        }
        else {
            Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
        }

        Ext.getCmp('formularioPanel').getForm().reset();
        Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleInsertarRecurso);

        Ext.getCmp('fieldsetformPanel').enable();
        Ext.getCmp('fieldsetformPanel').expand() ;


        Ext.getCmp('addAccion').disable();
        Ext.getCmp('deleteAccion').disable();


        insertarSub = false;
        insertarFunc = false;
        insertarRec = true;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;

        if (recordNodoSelect.raw.externa) {
            Ext.getCmp('externo').show();
            Ext.getCmp('externo').setReadOnly(true);
            Ext.getCmp('externo').setValue(true);
            Ext.getCmp('gridAcciones').columns[2].show();
            
        }
        else{
            Ext.getCmp('gridAcciones').getStore().removeAll();
            Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                params:{
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externa,
                    insertarRec: true,
                    referencia: recordNodoSelect.raw.referencia,
                    start:0,
                    limit:20
                }
            });
            Ext.getCmp('externo').hide();
            Ext.getCmp('externo').setReadOnly(true);
            Ext.getCmp('externo').setValue(false);
            Ext.getCmp('gridAcciones').columns[2].show();           
        }

    },

    importarsubsistema: function(){
        var winImpSist = Ext.widget('ventanaImportarSistema');
        winImpSist.formularioImpSist.getForm().reset();
        winImpSist.show();
        winImpSist.center();
    },

    importarSistema: function(button){
        var _this = this;
        if(Ext.getCmp('formularioImpSist').getForm().isValid()){
            if(recordNodoSelect.raw){
                var idsistema = recordNodoSelect.raw.idsistema;
            }
            else{
                var idsistema = recordNodoSelect.data.id;
            }

            Ext.getCmp('formularioImpSist').getForm().submit({
                url: 'importarXML',
                timeout:360000,
                params:{
                    idsistema: idsistema
                },
                waitTitle: perfil.etiquetas.waitTitle, //"Por favor espere...",
                waitMsg: perfil.etiquetas.waitMsgImpSub,//'Importando sistema',

                success: function(form, action) {
                    if (action.result.codMsg == 1) {
                        mostrarMensaje(7,action.result.mensaje);                 
                        button.up('window').close();
                        _this.recargarNodo();
                    }
                },
                failure: function(form, action) {
                    button.up('window').close();
                    mostrarMensaje(6,action.result.mensaje);                    
                }
            });
        }
    },

    renderVentanaImportarSistema: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
    },

    exportarsubsistema: function(){
        document.getElementById('idsistema').value = recordNodoSelect.raw.idsistema;
        var formularioexportar = document.getElementById('exportarsistemas');
        formularioexportar.action = 'exportarsistema';
        formularioexportar.submit();
    },

    eliminarcomponente: function(){
        var _this = this;
        if (!recordNodoSelect.isRoot()) {

            Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.Importar.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(true);

            switch(recordNodoSelect.raw.type) {
                case 'sistema':
                {
                    _this.eliminarSistema();//ya
                }
                    break;
                case 'funcionalidad':
                {
                    _this.eliminarFuncionalidad();
                }
                    break;
                case 'recurso':
                {
                    _this.eliminarRecurso();
                }
                    break;
            }
        }
    },

    eliminarSistema: function(){
        var _this = this;
        mostrarMensaje(2, perfil.etiquetas.confirmPreg, eliminasist);
        //Msg.util.MostrarMsg(4,perfil.etiquetas.confirmacion,perfil.etiquetas.confirmPreg,eliminasist,this);
        function eliminasist(btn) {
            if(btn == 'YES') {
                Ext.Ajax.request({
                    url: 'eliminarsistema',
                    method: 'POST',
                    params: {
                        idsistema: recordNodoSelect.raw.idsistema
                    },
                    waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                    waitMsg: perfil.etiquetas.waitMsgElimSub,//'Eliminando datos del sistema',
                    callback: function (options, success, response) {
                        Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(7, responseData.mensaje);
                            recordNodoSelect = recordNodoSelect.parentNode;
                            _this.recargarNodo();
                            Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                        }
                        else
                            mostrarMensaje(6, responseData.mensaje);
                    }
                });
            }
        };
    },

    eliminarFuncionalidad: function(){
        var _this = this;
        mostrarMensaje(2, perfil.etiquetas.confirmPreg1,eliminafunc);
        //Msg.util.MostrarMsg(4,perfil.etiquetas.confirmacion,perfil.etiquetas.confirmPreg1,eliminafunc,this);
        function eliminafunc(btn) {
            if(btn == "YES") {
                Ext.Ajax.request({
                    url: 'eliminarfuncionalidad',
                    method: 'POST',
                    params: {
                        idfuncionalidad: recordNodoSelect.raw.idfuncionalidad
                    },
                    waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                    waitMsg: perfil.etiquetas.waitMsgElimFunc,//'Eliminando datos de la funcionalidad',
                    callback: function (options, success, response) {
                        Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                            mostrarMensaje(7, responseData.mensaje);
                            recordNodoSelect = recordNodoSelect.parentNode;
                            _this.recargarNodo();
                            Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                        }
                        else if (responseData.codMsg == 3 || responseData.codMsg == 4 || responseData.codMsg == 6) {
                            mostrarMensaje(6, responseData.mensaje);
                        }
                    }
                });
            }
        };
    },

    eliminarRecurso: function () {
        var _this = this;
        mostrarMensaje(2, perfil.etiquetas.confirmPreg2, _this.eliminarec.bind(_this, _this));
        //Msg.util.MostrarMsg(4, perfil.etiquetas.confirmacion, perfil.etiquetas.confirmPreg2, _this.eliminarec, this);

    },

    eliminarec: function (t, btn) {
        if(btn == 'YES') {
            var arrayRecursosElim = [];
            arrayRecursosElim.push(recordNodoSelect.raw.idrecurso, recordNodoSelect.raw.heredado);
            Ext.Ajax.request({
                url: 'eliminarRecursos',
                method: 'POST',
                params: {
                    arrayRecursosElim: Ext.encode(arrayRecursosElim),
                    idfuncionalidad: recordNodoSelect.parentNode.raw.idfuncionalidad
                },
                waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                waitMsg: perfil.etiquetas.waitMsgElimRec,//'Eliminando datos del recurso',
                callback: function (options, success, response) {
                    Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(7, responseData.mensaje);
                        recordNodoSelect = recordNodoSelect.parentNode;
                        t.recargarNodo();
                        Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                    }
                    else if (responseData.codMsg == 3) {
                        mostrarMensaje(7, responseData.mensaje);
                    }
                }
            });
        }
    },

    recargarNodo: function () {
        Ext.getCmp('icono').getStore().clearFilter();

        var store = Ext.getCmp('treeDD').getStore();
        if (!recordNodoSelect.isRoot()) {
            if (recordNodoSelect.isExpanded()) {
                recordNodoSelect.removeAll();
                store.load({node: recordNodoSelect});
            }
            else {
                recordNodoSelect.expand();
            }
        }
        else {
            recordNodoSelect.removeAll();
            store.load();
        }

    },

    habilitarGuardar: function(obj){       
        if(this.cambiosFormulario())
        Ext.getCmp('btnGuardar').enable();
        else
            Ext.getCmp('btnGuardar').disable();
    },

    resetearReferencia: function(){    
        if(!recordNodoSelect.isRoot()){           
            if (recordNodoSelect.raw.idsistema) {
                Ext.getCmp('refebuton').show();
                if (Ext.getCmp('formularioPanel').getRecord().data.externo != Ext.getCmp('externo').checked) {
                    if (recordNodoSelect.raw.servidorweb) {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        Ext.getCmp('referencia').columnWidth = 0.9;
                        Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                        Ext.getCmp('btnBuscarReferencia').show();

                        Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                        Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';

                    }
                    else {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }

                        Ext.getCmp('referencia').columnWidth = 1.0;
                        Ext.getCmp('btnBuscarReferencia').hide();

                        Ext.getCmp('referencia').nextTab = 'denominacion';
                        Ext.getCmp('denominacion').prevTab = 'referencia';

                    }
                    Ext.getCmp('referencia').reset();
                }
                else {
                    if (recordNodoSelect.raw.servidorweb ) {
                        if(insertarSub || modificarSub) {
                            if (Ext.getCmp('referencia').labelEl) {
                                Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                            }
                            else {
                                Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                            }

                            Ext.getCmp('referencia').columnWidth = 1.0;
                            Ext.getCmp('btnBuscarReferencia').hide();

                            Ext.getCmp('referencia').nextTab = 'denominacion';
                            Ext.getCmp('denominacion').prevTab = 'referencia';
                        }
                    }
                    else {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        Ext.getCmp('referencia').columnWidth = 0.9;
                        Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                        Ext.getCmp('btnBuscarReferencia').show();

                        Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                        Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
                    }
                    if (insertarSub) {
                        Ext.getCmp('referencia').reset();
                    }
                    else if (modificarSub) {
                        Ext.getCmp('referencia').setValue(Ext.getCmp('formularioPanel').getRecord().data.referencia);
                    }

                }
            }
        }
        else{
            if(Ext.getCmp('externo').checked){
                if (Ext.getCmp('referencia').labelEl) {
                    Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                }
                else {
                    Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                }

                Ext.getCmp('referencia').columnWidth = 1.0;
                Ext.getCmp('btnBuscarReferencia').hide();

                Ext.getCmp('referencia').nextTab = 'denominacion';
                Ext.getCmp('denominacion').prevTab = 'referencia';
            }
            else{
                if (Ext.getCmp('referencia').labelEl) {
                    Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                }
                else {
                    Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                }
                Ext.getCmp('referencia').columnWidth = 0.9;
                Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                Ext.getCmp('btnBuscarReferencia').show();

                Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
            }
        }

    },

    guardarcambios: function(){
      this.guardarcambiosFormulario();
    },
    cambiosFormulario:function(){
        var hubocambiosForm = false;
        if(Ext.getCmp('formularioPanel').getValues().denominacion)
        if(!recordNodoSelect.isRoot()) {

            //verificando si hubo cambios//
            if (Ext.getCmp('formularioPanel').getForm().isValid()) {
              
                if (Ext.getCmp('formularioPanel').getRecord().data.denominacion != Ext.getCmp('formularioPanel').getValues().denominacion) {                    
                    hubocambiosForm = true;
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.icono != Ext.getCmp('icono').getValue() ) {                    
                    if(Ext.getCmp('icono').getValue())
                    {
                        hubocambiosForm = true;
                    }
                    else
                    if(Ext.getCmp('formularioPanel').getRecord().data.icono)
                    {
                        hubocambiosForm = true;
                    }

                }
                if (Ext.getCmp('formularioPanel').getRecord().data.abreviatura != Ext.getCmp('formularioPanel').getValues().abreviatura) {                

                    if(Ext.getCmp('formularioPanel').getValues().abreviatura)
                    {
                        hubocambiosForm = true;
                    }
                    else
                    if(Ext.getCmp('formularioPanel').getRecord().data.abreviatura)
                    {
                        hubocambiosForm = true;
                    }
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.referencia != Ext.getCmp('formularioPanel').getValues().referencia)
                {

                    if(!modificarRec)
                    {
                    if(Ext.getCmp('formularioPanel').getRecord().data.referencia != "Seleccione la referencia"){
                        hubocambiosForm = true;
                    }
                    else
                    {
                        if(Ext.getCmp('formularioPanel').getValues().referencia!=""&&Ext.getCmp('formularioPanel').getValues().referencia!="Seleccione la referencia")
                        {
                            hubocambiosForm = true;
                        }
                    }
                    }
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.descripcion != Ext.getCmp('formularioPanel').getValues().descripcion) {
                    
                    if(Ext.getCmp('formularioPanel').getValues().descripcion)
                    {
                        hubocambiosForm = true;
                    }
                    else
                    
                    if(Ext.getCmp('formularioPanel').getRecord().data.descripcion)
                    {
                        hubocambiosForm = true;
                    }

                }
                if (Ext.getCmp('formularioPanel').getRecord().data.visibilidad != Ext.getCmp('visibilidad').checked) {
                    
                    if(Ext.getCmp('visibilidad').checked)
                    {
                        hubocambiosForm = true;
                    }
                    else
                   
                    if(Ext.getCmp('formularioPanel').getRecord().data.visibilidad)
                    {
                        hubocambiosForm = true;
                    }
                    
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.externo != Ext.getCmp('externo').checked) {
                 
                    if(Ext.getCmp('externo').checked)
                    {
                        hubocambiosForm = true;
                    }
                    else
                   
                    if(Ext.getCmp('formularioPanel').getRecord().data.externo)
                    {
                        hubocambiosForm = true;
                    }
                  
                }
            }
        }
        else
        {           
            if(Ext.getCmp('formularioPanel').getValues().denominacion)           
            {               
                hubocambiosForm=true;
            }
        }
        return hubocambiosForm;
    },
    guardarcambiosFormulario: function(){     
            if (Ext.getCmp('formularioPanel').getForm().isValid()) {
               
                if (insertarSub)//Insertando subsistema
                    this.addSubsistema();
                else if (insertarFunc)//Insertando funcionalidad
                    this.addFuncionalidad();
                else if (insertarRec)//Insertando recurso
                    this.addRecurso();
                else
                if (this.cambiosFormulario()) {
                    if (modificarSub) {
                        this.modSubsistema();
                    }
                    else if (modificarFunc) {
                        this.salvarDatosGrid();
                        this.modFuncionalidad();
                    }
                    else if (modificarRec) {
                        this.modRecurso();
                    }
                }
                else
                if (!this.cambiosFormulario() && modificarFunc) {
                    this.salvarDatosGrid();
                }
                else
                if (!this.cambiosFormulario() && modificarRec) {
                    this.modRecurso();
                }

            }
            else
                mostrarMensaje(6,perfil.etiquetas.errorformulario);      
    },

    addSubsistema: function(){
        var _this = this;
        var idsistema = 0;
        if(!recordNodoSelect.isRoot()){
            idsistema = recordNodoSelect.raw.idsistema;
        }

        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'insertarsistema',
            params:{
                idpadre: idsistema
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddSub,//'Guardando datos del sistema',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {
                mostrarMensaje(6, action.result.mensaje);
            }
        });
    },

    addFuncionalidad: function(){
        var _this = this;
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'insertarfuncionalidad',
            params:{
                idsistema: recordNodoSelect.raw.idsistema,
                index: recordNodoSelect.getDepth()
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddFunc,//'Guardando datos de la funcionalidad',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {                   
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {              
                mostrarMensaje(6, action.result.mensaje);
            }
        });

    },

    addRecurso: function(){
        var _this = this;
        var arrayAccChequeadas = _this.obtenerAccionesChequeadasGrid();
        var arrayIdaction = [];
        if(arrayAccChequeadas.length == 0) {          
            mostrarMensaje(6, perfil.etiquetas.msgErrorAddRec);
            return;
        }
       
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'insertarRecursos',
            params:{
                arrayAccionesChecked:Ext.encode(arrayAccChequeadas),
                idfuncionalidad:recordNodoSelect.raw.idfuncionalidad
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddRec,//'Guardando datos del recurso',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                   
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {
                mostrarMensaje(6, action.result.mensaje);
                
            }
        });

    },

    modSubsistema: function(){
        var _this = this;
        var idpadre = 0;
        if(!recordNodoSelect.parentNode.isRoot()){
            idpadre = recordNodoSelect.raw.idpadre;
        }
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'modificarsistema',            
            params:{
                idsistema: recordNodoSelect.raw.idsistema,
                idpadre: idpadre
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddSub,//'Guardando datos del sistema',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                    recordNodoSelect = recordNodoSelect.parentNode;
                   
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {                
                mostrarMensaje(6, action.result.mensaje);
            }
        });


    },

    modFuncionalidad: function(){
        var _this = this;
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'modificarfuncionalidad',
            params: {
                idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                idsistema: recordNodoSelect.parentNode.raw.idsistema
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddFunc,//'Guardando datos de la funcionalidad',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {                    
                    mostrarMensaje(7, action.result.mensaje);
                    recordNodoSelect = recordNodoSelect.parentNode;
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {             
                mostrarMensaje(6, action.result.mensaje);          
            }
        });

    },

    modRecurso: function(){
       
        var _this = this;
        var arrayAccChequeadas = _this.obtenerAccionesChequeadasGrid();
        var arrayAccionesDesche = _this.obtenerAccionesDesqueadasGrid();
        var arrayAccionesDeschecked = [];
        var arrayActionchecked = [];

        if(arrayAccionesDesche[0].idacciones.length > 0) {
            for (var i = 0; i < arrayAccionesDesche[0].idacciones.length; i++) {
                arrayAccionesDeschecked.push(arrayAccionesDesche[0].idacciones[i]);
            }
        }
        if(arrayAccChequeadas.length == 0) {
            mostrarMensaje(2, perfil.etiquetas.msgAdvertencia, _this.eliminarec.bind(_this, _this));
            //Msg.util.MostrarMsg(4,perfil.etiquetas.advertencia, perfil.etiquetas.msgAdvertencia, _this.eliminarec,this);
            return;
        }
        for (var i = 0; i < arrayAccChequeadas.length; i++) {
            arrayActionchecked.push(arrayAccChequeadas[i].idaccion);
        }

       
        Ext.getCmp('formularioPanel').getForm().submit({
            timeout: '180',
            url: 'validarRecurso',
            params:{
                arrayAccionesChecked:Ext.encode(arrayActionchecked),//aqui son las acciones chequeadas
                idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                idrecurso: recordNodoSelect.raw.idrecurso,
                arrayAccionesElim:Ext.encode(arrayAccionesDeschecked)//aqui las acciones deschequeadas
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddRec,//'Guardando datos del recurso',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                  
                    mostrarMensaje(7, action.result.mensaje);
                    recordNodoSelect = recordNodoSelect.parentNode;
                    _this.recargarNodo();
                    Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                }
            },
            failure: function(form, action) {
                if (action.result.codMsg == 2) {
                    mostrarMensaje(2, action.result.mensaje, _this.eliminarec);
                    //Msg.util.MostrarMsg(2, perfil.etiquetas.advertencia, action.result.mensaje, _this.eliminarec,this);
                }
                else{
                    mostrarMensaje(6, action.result.mensaje);                 
                }

            }
        });
    },

    insertarAccion: function(){
        var winAccion = Ext.widget('ventanaAddAccion');
        winAccion.formularioAction.getForm().reset();
        winAccion.show();
        winAccion.center();
    },

    eliminarAccion: function(button,event){
        var _this = this;
        _this.eliminarAction();
    },

    eliminarAction: function(arrayActionEliminar){
        var _this = this;
        var denominacionAccion = [];
        if(arrayActionEliminar) {
            if (arrayActionEliminar[0].denominacionAcciones.length > 0) {
                for (var i = 0; i < arrayActionEliminar[0].denominacionAcciones.length; i++) {
                    denominacionAccion.push(arrayActionEliminar[0].denominacionAcciones[i]);
                }
                mostrarMensaje(2, perfil.etiquetas.msgAdvertencia1, elimina);
                //Msg.util.MostrarMsg(4, perfil.etiquetas.advertencia, perfil.etiquetas.msgAdvertencia1, elimina, this);
            }
        }
        else {
            denominacionAccion.push(Ext.getCmp('gridAcciones').getSelectionModel().selected.items[0].data.denominacion);
            mostrarMensaje(2, perfil.etiquetas.confirmPreg3, elimina);
            //Msg.util.MostrarMsg(4, perfil.etiquetas.confirmacion, perfil.etiquetas.confirmPreg3, elimina, this);
        }

        function elimina(btn) {
            if (btn == "YES"){
                if (denominacionAccion.length == 1) {
                    var waitMsg = perfil.etiquetas.waitMsgElimAction;//"Eliminando la acción";
                }
                else {
                    var waitMsg = perfil.etiquetas.waitMsgElimAction1;//"Eliminando acciones desmarcadas";
                }
            Ext.Ajax.request({
                url: 'eliminarAccioneExterna',
                method: 'POST',
                params: {
                    denominacionAccion: Ext.encode(denominacionAccion),
                    idfuncionalidad: recordNodoSelect.data.idfuncionalidad
                },
                waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                waitMsg: waitMsg,

                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(7, responseData.mensaje);
                        var sm = Ext.getCmp('gridAcciones').getSelectionModel();
                        if (denominacionAccion.length == 1) {
                            Ext.getCmp('gridAcciones').store.remove(sm.getSelection());

                        }
                        else {
                            for (var i = 0; i < arrayActionEliminar[0].records.length; i++) {
                                Ext.getCmp('gridAcciones').store.remove(arrayActionEliminar[0].records[i]);
                            }
                        }


                    }
                    else if (responseData.codMsg == 3) {
                        mostrarMensaje(6, responseData.mensaje);
                        var sm = Ext.getCmp('gridAcciones').getSelectionModel();
                        if (denominacionAccion.length > 1) {
                            if (responseData.denominaciones) {
                                for (var i = 0; i < arrayActionEliminar[0].records.length; i++) {
                                    var denomi = arrayActionEliminar[0].records[i].raw.denominacion;
                                    for (var j = 0; j < responseData.denominaciones.length; j++) {
                                        if (responseData.denominaciones[j] == denomi) {
                                            Ext.getCmp('gridAcciones').store.remove(arrayActionEliminar[0].records[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (Ext.getCmp('gridAcciones').store.getCount() > 0) {
                        sm.select(0);
                    }

                }
            });
            }
        }

    },

    selectionchange: function(view, records){
        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
        if(!(insertarRec || modificarRec)){
            if(recordNodoSelect.raw.idfuncionalidad && recordNodoSelect.raw.externa)
                Ext.getCmp('deleteAccion').setDisabled(!records.length);
        }
    },

    beforeeditGrid: function(gridObj){
        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
        if(modificarFunc) {
            if (!recordNodoSelect.raw.externa) {
                if (gridObj.column.dataIndex == 'denominacion')
                    gridObj.cancel = true;
            }
        }
        if(insertarRec || modificarRec){
            if(gridObj.column.dataIndex == 'denominacion' || gridObj.column.dataIndex == 'descripcion')
                gridObj.cancel = true;
        }
    },

    renderGrid: function(grid,eOpts){
        grid.getStore().on('beforeload', function(store,operation,eOpts){
            if(recordNodoSelect.raw.type == "recurso") {
                store.proxy.extraParams.idfuncionalidad = recordNodoSelect.raw.idfuncionalidad;
                store.proxy.extraParams.idrecurso = recordNodoSelect.raw.idrecurso;
                store.proxy.extraParams.externa = recordNodoSelect.parentNode.raw.externa;
                store.proxy.extraParams.referencia = recordNodoSelect.parentNode.raw.referencia;
            }
            else if(recordNodoSelect.raw.type == "funcionalidad"){
                store.proxy.extraParams.idfuncionalidad = recordNodoSelect.raw.idfuncionalidad;
                store.proxy.extraParams.idrecurso = recordNodoSelect.raw.idrecurso;
                store.proxy.extraParams.externa = recordNodoSelect.raw.externa;
                store.proxy.extraParams.referencia = recordNodoSelect.raw.referencia;
            }
        });

        grid.keyMap = Ext.widget('keymapController');
        grid.keyMap.pressAltIA(this);
        grid.keyMap.deleteAccion(this,grid);
        grid.keyMap.limpiarGrid(this);
        grid.keyMap.buscarGrid(this);
    },

    closeWin:function (button) {
       
        button.up('window').close();
        Ext.getCmp('referencia').setValue(this.referenciaAux);
    },

    renderVentanaAddAccion: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        Ext.getCmp('denominacionacc').focus(false, 200);
    },

    agregarAccion:function(button){

        if(Ext.getCmp('winAddAction').formularioAction.getForm().isValid()) {

            Ext.getCmp('winAddAction').formularioAction.getForm().submit({
                url: 'adicionarAccioneExterna',
                params: {
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad
                },
                waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                waitMsg: perfil.etiquetas.waitMsgInsAcc,//"Insertando la acción",

                success: function(form, action) {

                    if (action.result.codMsg == 1) {

                   
                        mostrarMensaje(7, action.result.mensaje);
                        //Create a model instance
                        var accion = Ext.create('Conf.model.ModelStoreGrid', {
                            denominacion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[0].rawValue,
                            descripcion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[1].rawValue,
                            checked: true,
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idaccion: action.result.idaccion
                        });
                        accion.raw = {
                            denominacion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[0].rawValue,
                            descripcion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[1].rawValue,
                            checked: true,
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idaccion: action.result.idaccion
                        };
                        Ext.getCmp('gridAcciones').store.insert(0, accion);
                        Ext.getCmp('gridAcciones').cellEditing.startEditByPosition({row: 0, column: 0});

                        if (button.getId() == "aplicar"){
                            button.up('window').formularioAction.getForm().reset();
                            Ext.getCmp('aplicar').disable();
                            Ext.getCmp('aceptar').disable();
                        }
                        else
                            button.up('window').close();

                    }
                },
                failure: function(form, action) {
                   
                    mostrarMensaje(6, action.result.mensaje);

                }
            });
        }
    },

    buscarReferencia: function(){
        var arbolReferencia = null;

        if(!recordNodoSelect.isRoot()) {
            if(modificarSub || modificarFunc || modificarRec) {

                switch(recordNodoSelect.raw.type) {
                    case 'sistema':
                    {
                        arbolReferencia = Ext.widget('arbolRefSist');
                    }
                        break;
                    case 'funcionalidad':
                    {
                        arbolReferencia = Ext.widget('arbolRefFunc');
                    }
                        break;
                    case 'recurso':
                    {
                        arbolReferencia = Ext.create('Ext.form.Panel', {
                            title: 'Simple Form',
                            bodyPadding: 5,                       
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%'
                            },                         
                            defaultType: 'textfield',
                            items: [{
                                fieldLabel: 'First Name',
                                name: 'first',
                                allowBlank: false
                            },{
                                fieldLabel: 'Last Name',
                                name: 'last',
                                allowBlank: false
                            }]
                        });
                    }
                        break;
                }
            }
            else if(insertarSub || insertarFunc || insertarRec){
                if(insertarSub)
                    arbolReferencia = Ext.widget('arbolRefSist');
                else if(insertarFunc)
                    arbolReferencia = Ext.widget('arbolRefFunc');
                else if(insertarRec){
                    arbolReferencia = Ext.create('Ext.form.Panel', {
                        title: 'Simple Form',
                        bodyPadding: 5,                  
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },                      
                        defaultType: 'textfield',
                        items: [{
                            fieldLabel: 'First Name',
                            name: 'first',
                            allowBlank: false
                        },{
                            fieldLabel: 'Last Name',
                            name: 'last',
                            allowBlank: false
                        }]
                    });
                }
            }
        }
        else{
            arbolReferencia = Ext.widget('arbolRefSist');
        }
        var winReferecnia = Ext.widget('ventanaReferencia');
        winReferecnia.items.add(arbolReferencia);
        winReferecnia.show();
        winReferecnia.center();
    },

    onBeforeloadArboRefFunc: function (store, operation) {
        Ext.getCmp('arbolRefFun').fireEvent('itemclick',operation.node,operation.node);
        if (operation.node.raw.id){
            operation.params.id = operation.node.raw.id;
            operation.params.text = operation.node.raw.text;
            operation.params.type = operation.node.raw.type;
        }
    },

    onClickArboRefFunc : function (view, record, item) {

        if(record.raw) {
            if (record.raw.type == 'action') {

                this.referenciaAux = record.raw.referencia;
                Ext.getCmp('aceptar').enable();              
            } else {
                Ext.getCmp('aceptar').disable();
            }
        }else
        {
            Ext.getCmp('aceptar').disable();
        }
    },

    closeWinRef:function (button) {        
        button.up('window').close();

    },

    renderVentanaReferencia: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
    },

    onClickContextMenu: function(menu, item, eventObject, object){
        var _this = this;       
        switch(item.action) {
            case 'insertarSubsistema':
            {
                _this.insertarSubsistema();
            }
                break;
            case 'insertarFuncionalidad':
            {
                _this.insertarFuncionalidad();
            }
                break;
            case 'insertarRecurso':
            {
                _this.insertarRecurso();
            }
                break;
            case 'eliminarcomponente':
            {
                _this.eliminarcomponente();
            }
                break;
        }

    },

    onBeforeloadArboRefSist: function (store, operation) {
        Ext.getCmp('arbolRefSist').fireEvent('itemclick',operation.node,operation.node);
    },

    onClickArboRefSist : function (view, record, item) {


        if(record.raw) {
            this.referenciaAux = record.raw.id;
            Ext.getCmp('aceptar').enable();
        }
        else {
            Ext.getCmp('aceptar').disable();
        }
    },

    obtenerAccionesChequeadasGrid: function () {
        var array = [];
        Ext.getCmp('gridAcciones').store.each(function () {
            this.commit();
            if (this.data.checked) {
                array.push({
                    idaccion: this.data.idaccion,
                    idfuncionalidad: this.data.idfuncionalidad,
                    denominacion: this.data.denominacion,
                    descripcion: this.data.descripcion
                });
            }
        });

        return array;
    },

    obtenerAccionesDesqueadasGrid: function () {
        var array = [];
        var arrayIdAction = [];
        var arrayDenominacion = [];
        var arrayRecords = [];
        Ext.getCmp('gridAcciones').store.each(function () {
            this.commit();
            if (!this.data.checked) {
                arrayIdAction.push(this.raw.idaccion);
                arrayDenominacion.push(this.raw.denominacion);
                arrayRecords.push(this);

            }
        });
        array.push({
            denominacionAcciones: arrayDenominacion,
            idacciones: arrayIdAction,
            records:arrayRecords
        });

        return array;
    },
    salvarDatosGrid: function(){

        var _this = this;

        var recordsModificados = Ext.getCmp('gridAcciones').getStore().getUpdatedRecords();
        var arrayRecordsModificadosChequeados = [];

        var arrayAccionesChequeadas = _this.obtenerAccionesChequeadasGrid();
        var arrayAccionesDesChequeadas = _this.obtenerAccionesDesqueadasGrid();

        for(var i = 0; i < recordsModificados.length; i++) {
            var huboCambiosEngrid = false;

            if(recordsModificados[i].data.checked){
                if(recordsModificados[i].data.denominacion != recordsModificados[i].raw.denominacion){
                    huboCambiosEngrid = true;
                }
                if(recordsModificados[i].data.descripcion != recordsModificados[i].raw.descripcion){
                    huboCambiosEngrid = true;
                }
            }

            if(huboCambiosEngrid){
                arrayRecordsModificadosChequeados.push({
                    idaccion: recordsModificados[i].data.idaccion,
                    idfuncionalidad: recordsModificados[i].data.idfuncionalidad,
                    denominacion: recordsModificados[i].data.denominacion,
                    descripcion: recordsModificados[i].data.descripcion
                });
            }

        }

        if(recordNodoSelect.raw.externa) {
            if(arrayAccionesDesChequeadas[0].idacciones.length > 0) {
                _this.eliminarAction(arrayAccionesDesChequeadas);
            }
            if(arrayRecordsModificadosChequeados.length > 0){
                _this.modificarAccion(arrayRecordsModificadosChequeados);
            }
        }
        else{
            if(arrayRecordsModificadosChequeados.length > 0 ) {
                _this.gestionarAccionesInternas(arrayAccionesDesChequeadas,arrayAccionesChequeadas);
            }
            else{                
                for (var i = 0; i < recordsModificados.length; i++) {
                    var huboCambiosEngrid = false;
                    if(recordsModificados[i].data.checked != recordsModificados[i].raw.checked){
                            huboCambiosEngrid = true;
                    }
                    if(huboCambiosEngrid){
                        _this.gestionarAccionesInternas(arrayAccionesDesChequeadas,arrayAccionesChequeadas);
                        return;
                    }

                }
            }
        }

    },

    modificarAccion: function(arrayRecordsModificadosChequeados){
        var _this = this;
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Guardando datos de las acciones modificadas..."});
        if(!this.cambiosFormulario())
            myMask.show();

        Ext.Ajax.request({
            url: 'modificarAccioneExterna',
            method: 'POST',
            params: {
                arrayAcciones: Ext.encode(arrayRecordsModificadosChequeados)
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgModAcc,//"Guardando datos de las acciones modificadas",
            callback: function (options, success, response) {
                myMask.hide();
                if(success==true)
                {
                    Ext.getCmp('btnGuardar').disable();
                }
                responseData = Ext.decode(response.responseText);
                Ext.getCmp('gridAcciones').getStore().load({
                    params:{
                        idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                        idrecurso: recordNodoSelect.raw.idrecurso,
                        externa:   recordNodoSelect.raw.externa,
                        referencia: recordNodoSelect.raw.referencia,
                        start:0,
                        limit:20
                    }
                });
                if (responseData.codMsg == 1) {                   
                    mostrarMensaje(7, responseData.mensaje);
                }
                else if(responseData.codMsg == 3){                 
                    mostrarMensaje(6, responseData.mensaje);
                }


            }
        });
    },

    gestionarAccionesInternas: function (arrayActionEliminar, arrayActionInsertar) {
       
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Guardando datos de las acciones modificadas..."});
        if(!this.cambiosFormulario())
            myMask.show();
        var _this = this;
        var denominacionAccionesEliminar = [];

        if (arrayActionEliminar) {
            if (arrayActionEliminar[0].denominacionAcciones.length > 0) {
                for (var i = 0; i < arrayActionEliminar[0].denominacionAcciones.length; i++) {
                    denominacionAccionesEliminar.push(arrayActionEliminar[0].denominacionAcciones[i]);
                }

            }
        }
        else {
            denominacionAccionesEliminar.push(Ext.getCmp('gridAcciones').getSelectionModel().selected.items[0].data.denominacion);

        }
        Ext.Ajax.request({
            url: 'insertaraccion',
            method: 'POST',
            params: {
                accionesChequeadas: Ext.encode(arrayActionInsertar),
                denominacionAccionesEliminar: Ext.encode(denominacionAccionesEliminar),
                idfuncionalidad: recordNodoSelect.data.idfuncionalidad
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgModAccInt,//"Guardando cambios",
            callback: function (options, success, response) {
                myMask.hide();
             
                if(success==true)
                {
                    Ext.getCmp('btnGuardar').disable();
                }
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {                   
                    mostrarMensaje(7, responseData.mensaje);
                }
                else if (responseData.codMsg == 3) {                  
                    mostrarMensaje(6, responseData.mensaje);
                }

                Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                    params:{
                        idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                        idrecurso: recordNodoSelect.raw.idrecurso,
                        externa:   recordNodoSelect.raw.externa,
                        referencia: recordNodoSelect.raw.referencia,
                        start:0,
                        limit:20
                    }
                });

            }
        });

    },
    buscarCajaAcciones:function(){

  
        if(Ext.getCmp('cajaTextoGrid').getValue()!="") {
            Ext.getCmp('btnBuscarGrid').enable();
            Ext.getCmp('btnLimpiarGrid').enable();
        }
        else
        {
            Ext.getCmp('btnBuscarGrid').disable();
            Ext.getCmp('btnLimpiarGrid').disable();
        }
     
    },

    buscarrAcciones: function () {
        Ext.getCmp('gridAcciones').getStore().proxy.extraParams.msg = perfil.etiquetas.noseencontrarondatossearch;
        if(recordNodoSelect.raw.type == "recurso") {
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    denominacion: Ext.getCmp('cajaTextoGrid').getValue(),
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externo ? recordNodoSelect.raw.externo : recordNodoSelect.parentNode.raw.externa,
                    referencia: recordNodoSelect.parentNode.raw.referencia,
                    start: 0,
                    limit: 20
                }
            });
        }
        else if(recordNodoSelect.raw.type == "funcionalidad"){
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    denominacion: Ext.getCmp('cajaTextoGrid').getValue(),
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externa,
                    referencia: recordNodoSelect.raw.referencia,
                    start: 0,
                    limit: 20
                }
            });
        }

    },

    limpiarCajaRecargargrid: function () {
        Ext.getCmp('cajaTextoGrid').reset();
        Ext.getCmp('btnBuscarGrid').disable();
        Ext.getCmp('btnLimpiarGrid').disable();

        if(recordNodoSelect.raw.type == "recurso") {
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externo ? recordNodoSelect.raw.externo : recordNodoSelect.parentNode.raw.externa,
                    referencia: recordNodoSelect.parentNode.raw.referencia,
                    msg : perfil.etiquetas.noseencontrarondatos,
                    start: 0,
                    limit: 20
                }
            });
        }
        else if(recordNodoSelect.raw.type == "funcionalidad"){
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externa,
                    referencia: recordNodoSelect.raw.referencia,
                    msg : perfil.etiquetas.noseencontrarondatos,
                    start: 0,
                    limit: 20
                }
            });
        }
    }






});
