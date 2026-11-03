/**
 * Created by madrid on 31/08/2017.
 */


/*funciones generales (los renders)*/
function renderNaturaleza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stNaturaleza.data.items.length; i++)
        if (stNaturaleza.data.items[i].data.naturaleza == value) {
            m.attr = 'ext:qtip="' + stNaturaleza.data.items[i].data.denominacion + '"';
            return stNaturaleza.data.items[i].data.denominacion;
        }
}

function renderNivelPlanif(val, m) {
    if (val == "1") {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
}

function renderPlanes(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    //for (i in stModelos.data.items)
    for (var i = 0; i < stModelos.data.items.length; i++)
        if (stModelos.data.items[i].data.idmodelo == value) {
            m.attr = 'ext:qtip="' + stModelos.data.items[i].data.denominacion + '"';
            return stModelos.data.items[i].data.denominacion;
        }
}

function renderUsuarios(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stUsuarios.data.items.length; i++)
        if (stUsuarios.data.items[i].data.idusuario == value) {
            m.attr = 'ext:qtip="' + stUsuarios.data.items[i].data.nombreusuario + '"';
            return stUsuarios.data.items[i].data.nombreusuario;
        }
}

function modificarEstado(val, m) {
    if (val > 0) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true verde'
    } else {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    }
}

function modificarAprobacion(val, m) {
    if (val == 1 || val == 2) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        m.css = 'icondistra-false rojo'
    } else if (val == 3) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        m.css = 'icondistra-true amarillo'
    } else {
        if (val == 4) {
            m.attr = 'ext:qtip="' + perfil.etiquetas.lbRector + '"';
            m.css = 'icondistra-true verde'
        }
    }
}

/*function renderEspecialidad(value) {
 return getRawValue(value, Ext.getCmp('idcbespecialidad'));
 }*/
function renderEspecialidad(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (i in stEspecialidadesTodas.data.items)
        if (stEspecialidadesTodas.data.items[i].data.idespecialidad == value) {
            m.attr = 'ext:qtip="' + stEspecialidadesTodas.data.items[i].data.denespecialidad + '"';
            return stEspecialidadesTodas.data.items[i].data.denespecialidad;
        }
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    //for (i in stum.data.items)
    for (var i = 0; i < stum.data.items.length; i++)
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function crearToolTipNro(v, m) {
    m.attr = 'ext:qtip="' + separadorDeMiles(v) + '"';
    return separadorDeMiles(v);
}

function separadorDeMiles(nStr) {
    nStr += '';
    ds = nStr.replace(/,/g, '');
    nStr = ds;
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function seisdecimales(val, m) {
    valuecol = parseFloat(val).toFixed(6);
    m.attr = 'ext:qtip="' + valuecol + '"';
    return valuecol;
}

function renderCB(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stCB.data.items.length; i++)
        if (stCB.data.items[i].data.idcentrobalance == value) {
            m.attr = 'ext:qtip="' + stCB.data.items[i].data.centrobalance + '"';
            return stCB.data.items[i].data.centrobalance;
        }
}
function renderCargo(value, m) {
    m.attr = 'ext:qtip="' + value + '"';

    //for (i in stum.data.items)
    for (var i = 0; i < stCargos.getTotalCount(); i++)
        if (stCargos.data.items[i].data.idcargo == value) {
            m.attr = 'ext:qtip="' + stCargos.data.items[i].data.denominacion + '"';
            return stCargos.data.items[i].data.denominacion;
        }

}

function renderActivos(value, m) {
    m.attr = 'ext:qtip="' + value + '"';

    //for (i in stum.data.items)
    for (var i = 0; i < stActivos.getTotalCount(); i++)
        if (stActivos.data.items[i].data.idcargo == value) {
            m.attr = 'ext:qtip="' + stActivos.data.items[i].data.denominacion + '"';
            return stActivos.data.items[i].data.denominacion;
        }

}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + ' - <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

//controlando la activación del panel Normas-Reglas-Salidas
function controlarPaneles() {
    if (smGpGestAct.getSelections().length == 1) {
        if (smGpGestAct.getSelected().data.nivel == ultimonivel) {
            tabsNormasReglasSalidas.expand();
            tabsNormasReglasSalidas.setDisabled(false);
            if (tabsNormasReglasSalidas.getActiveTab().getItemId() == 'tabNormas') {
                stGpGestNorm.load();
            } else {
                if (tabsNormasReglasSalidas.getActiveTab().getItemId() == 'tabReglas') {
                    stgpGestReglas.load();
                } else if (tabsNormasReglasSalidas.getActiveTab().getItemId() == 'tabSalidas') {
                    stGpGestSalida.load();
                } else if (tabsNormasReglasSalidas.getActiveTab().getItemId() == 'tabCargos') {
                    stGpGestCargo.load();
                } else if (tabsNormasReglasSalidas.getActiveTab().getItemId() == 'tabActivos') {
                    stGpGestActivos.load();
                }
            }
        } else {
            tabsNormasReglasSalidas.collapse();
            tabsNormasReglasSalidas.setDisabled(true);
        }
    } else {
        tabsNormasReglasSalidas.collapse();
        tabsNormasReglasSalidas.setDisabled(true);
        stGpGestNorm.removeAll();
        stgpGestReglas.removeAll();
        stGpGestSalida.removeAll();
        stGpGestCargo.removeAll();
        stGpGestActivos.removeAll();
    }
}

function asociarPlanesByEspecialidades() {


    cbmodelo1 = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbmodelo1',
        fieldLabel: 'Plan',
        anchor: '100%',
        typeAhead: true,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        hiddenName: 'idmodelo',
        allowBlank: true,
        store: stModelos,
        mode: 'local',
        triggerAction: 'all'
    });

    cbmodeloparasalida1 = new Ext.form.ComboBox({
        emptyText: perfil.etiquetas.lbSeleccione,
        loadingText: perfil.etiquetas.lbCargando,
        id: 'cbmodeloparasalida1',
        fieldLabel: 'Plan para indicadores de salida',
        anchor: '100%',
        typeAhead: true,
        displayField: 'denominacion',
        valueField: 'idmodelo',
        hiddenName: 'idmodelo',
        allowBlank: true,
        store: stModelos,
        mode: 'local',
        triggerAction: 'all'
    });

    checkCompartir = [];
    stespecialidcompartir = new Ext.data.Store({
        url: 'listarEspecialidadesYValorUltimoNivel',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idespecialidad'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            beforeload: function (st, opt) {

                demandantes = cbDemandantes1.getCheckedValue();
                if (cbDemandantes1.getCheckedValue() == "" && objectDemandada[0] != undefined) {
                    demandantes = objectDemandada;
                }
                st.baseParams.demandantes = Ext.encode(demandantes);
                st.baseParams.idespecialidadCreador = Number(gpActividades.getSelectionModel().getSelected().data.idespecialidad);
                st.baseParams.comboListar = 'compartidas';
            },
            load: function (st, rec, opt) {
                var valores = st.data.items;
                if (checkCompartir.length > 0) {
                    for (var i = 0; i < checkCompartir.length; i++) {
                        for (var j = 0; j < valores.length; j++) {
                            if (checkCompartir[i].id == valores[j].data.idespecialidad) {
                                rec[j].set('checked', true);
                            }
                        }
                    }
                }
            }
        }
    });

    cbEspecialidadCompartida1 = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        enableQtip: true,
        fieldLabel: 'Compartir',
        displayField: 'denominacion',
        id: 'cbEspecialidadCompartida1',
        valueField: 'idespecialidad',
        store: stespecialidcompartir,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idespecialidadcomp',
        triggerAction: 'all',
        editable: true,
        anchor: '100%',
        mode: 'remote',
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            expand: function (cb) {
                cb.store.reload();
            },
            change: function (cb, newV, oldV) {
                checkCompartir = [];
                var valoresN = newV.split(',');
                for (var i = 0; i < valoresN.length; i++) {
                    checkCompartir.push({id: valoresN[i]});
                }
            }
        }
    });


    checkDemandadas = [];
    stespecialiddemandante = new Ext.data.Store({
        url: 'listarEspecialidadesYValorUltimoNivel',
        reader: new Ext.data.JsonReader({
            root: 'data'
        },
                [{
                        name: 'idespecialidad'
                    }, {
                        name: 'denominacion'
                    }]),
        listeners: {
            beforeload: function (st, opt) {
                compartidas = cbEspecialidadCompartida1.getCheckedValue();
                if (cbEspecialidadCompartida1.getCheckedValue() == "" && objectCompartida[0] != undefined) {
                    compartidas = objectCompartida;
                }

                st.baseParams.idespecialidadCreador = Number(gpActividades.getSelectionModel().getSelected().data.idespecialidad);
                st.baseParams.compartidas = Ext.encode(compartidas);
                st.baseParams.comboListar = 'demandantes';
            },
            load: function (st, rec, opt) {
                var valores = st.data.items;
                if (checkDemandadas.length > 0) {
                    for (var i = 0; i < checkDemandadas.length; i++) {
                        for (var j = 0; j < valores.length; j++) {
                            if (checkDemandadas[i].id == valores[j].data.idespecialidad) {
                                rec[j].set('checked', true);
                            }
                        }
                    }
                }
            }
        }
    });


    cbDemandantes1 = new Ext.ux.form.LovCombo({
        xtype: 'combo',
        enableQtip: true,
        fieldLabel: perfil.etiquetas.lbOrganosDemandantes,
        displayField: 'denominacion',
        id: 'cbDemandantes1',
        valueField: 'idespecialidad',
        store: stespecialiddemandante,
        autoCreate: true,
        typeAhead: true,
        hiddenName: 'idespecialidadesdem',
        triggerAction: 'all',
        editable: true,
        anchor: '100%',
        mode: 'remote',
        emptyText: perfil.etiquetas.lbSeleccione,
        listeners: {
            expand: function (cb) {
                cb.store.reload();
            },
            change: function (cb, newV, oldV) {
                checkDemandadas = [];
                var valoresN = newV.split(',');
                for (var i = 0; i < valoresN.length; i++) {
                    checkDemandadas.push({id: valoresN[i]});
                }
            }
        }
    });

    fpActividad = new Ext.FormPanel({
        labelWidth: 75,
        frame: true,
        autoHeight: true,
        labelAlign: 'top',
        id: 'id_formactividadAsc',
        items: [{
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 0.9,
                        items: cbmodelo1
                    }]
            }, {
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 0.9,
                        items: cbmodeloparasalida1
                    }]
            },
            {
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 0.9,
                        items: cbDemandantes1
                    }]
            }, {
                layout: 'column',
                items: [{
                        layout: 'form',
                        columnWidth: 0.9,
                        items: cbEspecialidadCompartida1
                    }]
            }]
    });

    winAsocPlan = new Ext.Window({
        modal: true,
        closeAction: 'destroy',
        width: 350,
        height: 300,
        layout: 'fit',
        constrain: true,
        autoHeight: true,
        title: 'Asociar a plan y especialidades',
        items: [fpActividad],
        buttons: [{
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    winAsocPlan.close();
                }
            }, {
                iconCls: 'aceptar',
                tooltip: 'Guardar los datos y cerrar ventana',
                id: 'btnaceptar2',
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    submitAsociar();
                }
            }],
        listeners: {
            beforeshow: function () {
                if (smGpGestAct.getSelected().data.idmodelo != null)
                    cbmodelo1.setValue(smGpGestAct.getSelected().data.idmodelo);
                if (smGpGestAct.getSelected().data.idmodelosalida != null)
                    cbmodeloparasalida1.setValue(smGpGestAct.getSelected().data.idmodelosalida);
            }
        }
    });

    return winAsocPlan.show();
}

function submitAsociar() {

    codAdicionar = gpActividades.getSelectionModel().getSelected().data.codigo;
    especialidadesdeman = cbDemandantes1.getValue().split(',');
    especialidadescomp = cbEspecialidadCompartida1.getValue().split(',');
    idarbolAdicionar = gpActividades.getSelectionModel().getSelected().data.idarbol;
    idactividad = gpActividades.getSelectionModel().getSelected().data.idactividad;
    acts = [];
    for (var i = 0; i < gpActividades.getSelectionModel().selections.length; i++) {

        acts.push(gpActividades.getSelectionModel().getSelections()[i].data);

    }

    Ext.getCmp('id_formactividadAsc').getForm().submit({
        url: 'asociarActividad',
        waitMsg: 'Guardando datos...',
        params: {
            //codAdicionar: codAdicionar,
            //idarbolAdicionar: idarbolAdicionar,
            // idformato: gpActividades.getSelectionModel().getSelected().data.codigo,
            nivelAdicionar: 4,
            idespecialidad: idespecialidadLog,
            demandantes: Ext.encode(especialidadesdeman),
            compartidas: Ext.encode(especialidadescomp),
            ultimonivel: true,
            // idactividad:idactividad,
            actividades: Ext.encode(acts),
            asociar: true,
            idmodeloAsc: Ext.getCmp('cbmodelo1').getValue(),
            idmodeloSalidaAsc: Ext.getCmp('cbmodeloparasalida1').getValue()
        },
        failure: function (form, action) {
            var cont = 0;
            if (action.result.codMsgM == 1) {
                mostrarMensaje(1, "Los datos fueron actualizados satisfactoriamente.");
                cont++;

                stGpActividades.reload({
                    params: {
                        anode: null
                    }
                });

                winAsocPlan.close();
            }
            if (action.result.codMsgM == 22) {
                mostrarMensaje(1, "Ya existe una actividad con ese c&oacute;digo.");
                cont++;
            }
            if (cont === 0) {
                mostrarMensaje(1, "Ocurri&oacute un error en la Base de datos");
            }
        }
    });


}

/**
 * funciones de las acciones de los botones   (activar o desactivar)-----
 */

function axuliarBtnasociar(record, sm) {
    if (record && record.data.esultimonivel && (sm.getSelections().length == 1)) {
        btnDuplicarActividad.enable()
    } else {
        btnDuplicarActividad.disable()
    }
}

function axuliarBtnasociarEspPlanes(record, sm) {
    if (record && record.data.esultimonivel && (sm.getSelections().length > 0) && parseInt(record.data.idaprobacion) == 1) {
        btnAsociarEspPlanes.enable()
    } else {
        btnAsociarEspPlanes.disable()
    }
}

function axuliarBtnAdd(record, sm) {

    btnAdicionarActividad.disable();
    if (record && parseInt(record.data.idaprobacion) == 1) {

        if (record.data.esultimonivel) {
            btnAdicionarActividad.disable();
        }
        if ((!record.data.esultimonivel) && (sm.getSelections().length == 1)) {
            btnAdicionarActividad.enable()
        }
        if (sm.getSelections().length == 0) {
            btnAdicionarActividad.enable();
        }

    }

}

function axuliarBtnModificarAct(record, sm) {
    if (record && (sm.getSelections().length == 1) && (parseInt(sm.selections.items[0].data.estado) == 0 && parseInt(sm.selections.items[0].data.idaprobacion) == 1)) {
        btnModificarActividad.enable();
    } else {
        btnModificarActividad.disable();
    }
}

function axuliarBtnEliminarAct(record, sm) {
    if ((record && sm.getSelections().length > 0) && (parseInt(sm.selections.items[0].data.estado) == 0 && parseInt(sm.selections.items[0].data.idaprobacion) == 1)) {
        btnEliminarActividad.enable();
    } else {
        btnEliminarActividad.disable();
    }
}

function axuliarBtnActivarDesactAct(record, sm) {
    btnActivarActividad.disable();
    btnDesactivarActividad.disable();
    if (record) {
        for (i = 0; i < sm.getSelections().length; i++) {
            if (parseInt(sm.selections.items[i].data.idaprobacion) == 4) {
                if (sm.selections.items[i].data.estado == 0) {
                    btnActivarActividad.enable();
                }

                if (sm.selections.items[i].data.estado == 1) {
                    btnDesactivarActividad.enable();
                }
            }
        }
    }

}

function axuliarBtnAprobDesaproAct(record, sm) {
    btnAprobarActividadRector.disable();
    btnDesaprobarActividadRector.disable();
    btnAprobarActividadEspecialista.disable();
    btnDesaprobarActividadEspecialista.disable();

    if (record) {
        for (var i = 0; i < sm.getSelections().length; i++) {

            if (parseInt(sm.selections.items[i].data.idaprobacion) == 1) {
                if (Ext.getCmp('btnAprobarActividadRector').hidden) {
                    btnAprobarActividadEspecialista.enable();
                } else {
                    btnAprobarActividadRector.enable();
                }
            }

            if (parseInt(sm.selections.items[i].data.idaprobacion) == 4) {
                if (!Ext.getCmp('btnAprobarActividadRector').hidden) {
                    btnDesaprobarActividadRector.enable();
                }
            }

            if (parseInt(sm.selections.items[i].data.idaprobacion) == 3) {

                if (!Ext.getCmp('btnAprobarActividadRector').hidden) {
                    btnAprobarActividadRector.enable();
                    btnDesaprobarActividadRector.enable();
                }
                if (Ext.getCmp('btnAprobarActividadRector').hidden) {
                    btnDesaprobarActividadEspecialista.enable();
                }
            }
        }
    }

}

function comportamientos(tipo_comp, array) {
    var aux = array;
    var arreglo = [];
    var cadena = '';
    var bandera = true;
    for (var a = 0; a < aux.length; a++) {
        if (aux[a].idespecialidad)
            arreglo.push(aux[a].denominacionEsp);
        if (tipo_comp == 'compartida') {
            checkCompartir.push({id: aux[a].idespecialidad});
            if (objectCompartida == "") {
                objectCompartida = aux[a].idespecialidad;
            } else {
                objectCompartida += ", " + aux[a].idespecialidad;
            }
        }
        if (tipo_comp == 'demandada') {
            checkDemandadas.push({id: aux[a].idespecialidad});
            if (objectDemandada == "") {
                objectDemandada = aux[a].idespecialidad;
            } else {
                objectDemandada += ", " + aux[a].idespecialidad;
            }


        }
    }
    for (i = 0; i < arreglo.length; i++) {
        if (bandera) {
            cadena = arreglo[i];
            bandera = false;
        } else {
            cadena = cadena + ',' + arreglo[i];
        }
    }
    return cadena;
}

function comportamientoPlan(idmodelo) {
    var aux = stModelos.data.items;
    var arreglo = [];
    var cadena = '';
    var bandera = true;
    for (var a = 0; a < aux.length; a++) {
        if (parseInt(aux[a].data.idmodelo) == idmodelo) {
            cadena = aux[a].data.denominacion;
        }
    }
    return cadena;
}

function comportamientoFormato(idformato) {
    var aux = stformato.data.items;
    var cadena = '';
    for (var a = 0; a < aux.length; a++) {
        if (parseInt(aux[a].data.idformato) == idformato) {
            cadena = aux[a].data.nombre;
        }
    }
    return cadena;
}

function aprobarActividades(valor, rector) {
    actividadesUpd = [];
    recordsArray = smGpGestAct.getSelections();
    if (recordsArray.length > 0) {
        for (var i = 0; i < recordsArray.length; i++) {
            actividadesUpd.push({
                idactividad: recordsArray[i].data.idactividad,
                nivel: recordsArray[i].data.nivel,
                idarbol: recordsArray[i].data.idarbol,
                idpadre: recordsArray[i].data.idpadre,
                ordender: recordsArray[i].data.ordender,
                ordenizq: recordsArray[i].data.ordenizq
            });
        }
        mymask.show();
        Ext.Ajax.request({
            url: 'aprobarDesaprobarActividad',
            params: {
                actividades: Ext.encode(actividadesUpd),
                idaprobacion: valor,
                esrector: rector
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgM == 24) {
                    /*if (smGpGestAct.getSelections().length == 1) {
                     stGpActividades.reload({
                     params: {
                     anode: smGpGestAct.getSelected().data._parent
                     }
                     });
                     } else {
                     stGpActividades.reload({
                     params: {
                     anode: null
                     }
                     });
                     }*/
                    nivelAdicionar = Number(gpActividades.getSelectionModel().getSelected().data.nivel);
                    idarbolAdicionar = gpActividades.getSelectionModel().getSelected().data.idarbol;
                    idpadreAdicionar = gpActividades.getSelectionModel().getSelected().data.idactividad;

                    var nodeload = idarbolAdicionar == idpadreAdicionar ? null : idpadreAdicionar;
                    if (nodeload != null && (parseInt(nivelAdicionar) == 3 || parseInt(nivelAdicionar) == 4) && (gpActividades.getSelectionModel().getSelected().data._is_leaf == true)) {
                        nodeload = idarbolAdicionar;
                    }

                    if (parseInt(cbNiveles.getValue()) == parseFloat(gpActividades.getSelectionModel().getSelected().data.nivel)) {
                        stGpActividades.baseParams.start = offsetActividades;
                    }
                    stGpActividades.reload({
                        params: {
                            anode: smGpGestAct.getSelected().data._parent
                        }
                    });
                    /* offsetActividades = 0;*/

                    if (valor > 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgAprobarActividadOk);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobarActividadOk);
                    }
                } else {
                    if (valor > 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgAprobarActividadNo);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgDesaprobarActividadNo);
                    }
                }
            }
        });
    }
}

function habilitarActividades(valor) {
    actividadesUpd = [];
    recordsArray = smGpGestAct.getSelections();
    if (recordsArray.length > 0) {
        for (var i = 0; i < recordsArray.length; i++) {
            actividadesUpd.push({
                idactividad: recordsArray[i].data.idactividad,
                idarbol: recordsArray[i].data.idarbol,
                ordender: recordsArray[i].data.ordender,
                ordenizq: recordsArray[i].data.ordenizq
            });
        }
        //envío la actualización
        mymask.show();
        Ext.Ajax.request({
            url: 'activarDesactivarActividad',
            params: {
                actividades: Ext.encode(actividadesUpd),
                estado: valor
            },
            callback: function (options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgM == 24) {
                    if (valor > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgActivarActividadOk);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgDesactivarActividadOk);
                    }
                    if (smGpGestAct.getSelections().length == 1) {
                        //rowSel = smGpGestAct.getSelected();
                        stGpActividades.reload({
                            params: {
                                anode: smGpGestAct.getSelected().data._parent
                            }
                        });

                    } else {
                        stGpActividades.reload({
                            params: {
                                anode: null
                            }
                        });
                    }
                } else {
                    if (valor > 0) {
                        mostrarMensaje(1, perfil.etiquetas.msgActivarActividadNo);
                    } else {
                        mostrarMensaje(1, perfil.etiquetas.msgDesactivarActividadNo);
                    }
                }

            }
        });
    }
}

function formPanelModificar() {

    //******Denominacion**********************
    denominacionMod = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'denominacionMod',
        fieldLabel: 'Denominación',
        anchor: '99%',
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        //vtype: 'validarEspaciosEnBlanco',
        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
        allowBlank: false,
        maxLength: 255,
        maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
        blankText: perfil.etiquetas.lbRequerido
    });

    //******Descripcion**********************
    descripcionMod = new Ext.form.TextArea({
        xtype: 'textarea',
        id: 'descripcionMod',
        anchor: '100%',
        maxLength: 255,
        regex: /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        vtype: 'validarEspaciosEnBlanco',
        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales(-),(_).',
        fieldLabel: perfil.etiquetas.lbDescripcion,
        editable: false
    });

}

function verResumenGastos() {

    Ext.apply(Ext.form.VTypes, {
        validarEspaciosEnBlanco: function (value, field) {
            return ((/^([0-9]+|([0-9]*(.|,)[0-9]+))$/.test(value)));
        },
        validarEspaciosEnBlancoText: 'Solo se admiten números enteros positivos y números decimales.'
    });
    var costoDirecto = {
        xtype: 'numberfield',
        id: 'costoDirecto',
        width: 110,
        decimalPrecision: 2,
        height: 25,
        vtype: 'validarEspaciosEnBlanco',
        fieldLabel: perfil.etiquetas.lbGastosDirectos,
        readOnly: true
    };
    var costoIndirecto = {
        xtype: 'numberfield',
        id: 'costoIndirecto',
        width: 110,
        height: 25,
        decimalPrecision: 2,
        fieldLabel: perfil.etiquetas.lbGastosIndirectos,
        editable: true,
        vtype: 'validarEspaciosEnBlanco',
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regexText: "Solo admite números enteros y reales de 5 dígitos. Con 2 cifras decimales."
    };
    var otrosCostos = {
        xtype: 'numberfield',
        id: 'otrosCostos',
        width: 110,
        height: 25,
        vtype: 'validarEspaciosEnBlanco',
        decimalPrecision: 2,
        fieldLabel: perfil.etiquetas.lbGastosOtros,
        editable: true,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regexText: "Solo admite números enteros y reales de 5 dígitos. Con 2 cifras decimales."
    };
    fpResumenCosto = new Ext.FormPanel({
        id: 'fpResumenCosto',
        autoHeight: true,
        title: 'Importes',
        width: 400,
        height: 200,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                bodyStyle: "padding:5px 0px 0px 25px",
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:8px 0px 0px",
                        items: [costoDirecto]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:8px 0px 0px",
                        items: [costoIndirecto]
                    }
                    , {
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:8px 0px 0px",
                        items: [otrosCostos]
                    }
                ]
            }
        ]
    });

    wverResumenCosto = new Ext.Window({
        id: 'wverResumenCosto',
        layout: 'fit',
        width: 450,
        height: 200,
        frame: true,
        constrain: true,
        modal: true,
        closeAction: 'destroy',
        title: perfil.etiquetas.verResumenGastos,
        items: [fpResumenCosto],
        tbar: [{
                // icon: perfil.dirImg + 'exportar.png',
                iconCls: 'exportar',
                id: 'btnver',
                tooltip: 'Exportar <b>(Alt+E)</b>',
                text: 'Exportar',
                handler: function () {
                    exportarResumenCosto();
                }
            }],
        buttons: [{
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: perfil.etiquetas.lbttCancelar,
                text: perfil.etiquetas.lbCancelar,
                handler: function () {
                    Ext.getCmp('wverResumenCosto').destroy();
                }
            }, {
                // icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                id: 'btnaceptarcosto',
                tooltip: perfil.etiquetas.lbttAceptar,
                text: perfil.etiquetas.lbAceptar,
                handler: function () {
                    guardarResumenCosto();
                    Ext.getCmp('wverResumenCosto').destroy();
                }
            }
        ]
    }).show();

    Ext.Ajax.request({
        url: 'calcularCostoDirecto',
        params: {
            idactividad: smGpGestAct.getSelected().data.idactividad
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            Ext.getCmp('costoDirecto').setValue(responseData.importe);
            Ext.getCmp('costoIndirecto').setValue(responseData.importeind);
            Ext.getCmp('otrosCostos').setValue(responseData.otrosimp);
        }
    });
}

function guardarResumenCosto() {
    Ext.Ajax.request({
        url: 'guardarResumenCosto',
        params: {
            idactividad: smGpGestAct.getSelected().data.idactividad,
            costosindirectos: Ext.getCmp('costoIndirecto').getValue(),
            otroscostos: Ext.getCmp('otrosCostos').getValue()
        },
        callback: function (options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData == undefined) {
                mostrarMensaje(3, 'error');
                return;
            }
            if (responseData.codMsg1 == 1) {
                recarga(gpGestSalidas.getStore());
                mostrarMensaje(1, 'El(Los) costo(s) ha(n) sido adicionado(s) satisfactoriamente');
            } else if (responseData.codMsg1 == 2) {
                mostrarMensaje(1, 'El(Los) costo(s) ha(n) sido modificado(s) satisfactoriamente');
            } else if (responseData.codMsg1 == 3) {
                mostrarMensaje(1, 'El(Los) costo(s) ha(n) sido eliminado(s) satisfactoriamente');
            }
        }
    });
}