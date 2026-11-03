Ext.ns('Pvd.ControlAsistencia.Asistencia');
//Controlador de la vista del componente
Pvd.ControlAsistencia.Asistencia.Controlador = {

    init: function (idioma, vista, modelo) {
        this.recordsLoaded = new Array();
        var scope = this;
        this.sesiones;
        this.tipocontrolacceso;
        this.otrodia;
        this.record;
        this.nodeSelected;
        this.recordps;
        this.nodeSelectedps;
        this.recordss;
        this.nodeSelectedss;
        this.ListadoPersonas;
        this.cmListadoPersonas;
        this.stListadoPersonas;
        this.causaasistencia;
        this.causaasistenciaps;
        this.causaasistenciass;
        this.certificados;
        var recordsEdit = null;
        this.limite = 15;

        modelo.storeTurnoTrabajo.load({
            params: {fecha: vista.fechaBuscar.getRawValue()},
            callback: function (r, opt, succ) {
                //vista.cbturno.setValue(r[0].data.idturnotrabajop);
                //creando el grid de asistencia dinamico en funcion del trabajo con las sesiones
                Ext.Ajax.request({
                    url: 'getpersonasasistencia',
                    params: {
                        fecha: vista.fechaBuscar.getRawValue()/*,fechat:vista.cbturno.store.data.items[0].data.fecha,
                         idgrupodescanso: vista.cbturno.store.data.items[0].data.idgrupodescanso,
                         idturnotrabajo: vista.cbturno.store.data.items[0].data.idturnotrabajo*/
                    },
                    method: "POST",
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        scope.sesiones = responseData.sesiones;
                        scope.otrodia = responseData.otrodia;
                        createGrid(responseData);
                        /*if(responseData.habca == 1){
                         scope.actualizar();
                         }*/
                    }
                });
            }
        });

        vista.cbturno.on('select', function (cb, r, i) {
            var turno = modelo.storeTurnoTrabajo.getAt(modelo.storeTurnoTrabajo.find('idturnotrabajop', vista.cbturno.getValue())).data;
            vista.Maskara.show();
            Ext.Ajax.request({
                url: 'getpersonasasistencia',
                params: {
                    fecha: vista.fechaBuscar.getRawValue(),
                    fechat: turno.fecha,
                    idgrupodescanso: turno.idgrupodescanso,
                    idturnotrabajo: turno.idturnotrabajo
                },
                method: "POST",
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    scope.sesiones = responseData.sesiones;
                    scope.otrodia = responseData.otrodia;
                    if (scope.otrodia == 1) {
                        scope.ListadoPersonas.getColumnModel().setHidden(5, false);
                        scope.ListadoPersonas.getColumnModel().setHidden(7, false);
                    } else {
                        scope.ListadoPersonas.getColumnModel().setHidden(5, true);
                        scope.ListadoPersonas.getColumnModel().setHidden(7, true);
                    }
                    scope.stListadoPersonas.removeAll();
                    scope.stListadoPersonas.loadData({
                        datos: responseData.datos
                    }, true);
                    vista.Maskara.hide();
                }
            });

        });

        function createGrid(responseData) {
            var sesiones = responseData.sesiones;
            var otrodia = responseData.otrodia;
            scope.certificados = responseData.certificados;
            var columns = new Array();
            var indexs = new Array();
            var continentGroupRow = new Array();
            scope.causaasistencia = new Ext.components.TreeComboBox({
                id: 'causaasistencia',
                anchor: '100%',
                editable: true,
                enableKeyEvents: true,
                mostrarBtnLimpiar: true,
                treeConfig: {
                    rootVisible: false,
                    loader: modelo.TreePanelLoader,
                    border: false,
                    autoScroll: true
                },
                onClick: function (node) {

                    if (!node.attributes.leaf) {
                        scope.causaasistencia.reset();
                        return false;
                    } else {
                        scope.causaasistencia.valueNotFoundText = node.text;
                        scope.causaasistencia.setValue(node.id);
                        scope.causaasistencia.collapse();
                        vista.record = node.attributes;
                        scope.record = node.attributes;

                        scope.ListadoPersonas.getSelectionModel().getSelected().data.idcausa = node.attributes.idcausa;
                        scope.ListadoPersonas.getSelectionModel().getSelected().data.denominacion = node.text;

                        vista.nodeSelected = node.attributes;
                        scope.nodeSelected = node.attributes;

                    }
                },
                onTriggerClick: function () {
                    if (this.disabled) {
                        return;
                    }
                    if (this.isExpanded()) {
                        this.collapse();
                    } else {
                        this.onFocus({});
                        this.expand();
                    }
                },
                listeners: {
                    keypress: function (tf, e) {
                        if (e.getKey() == 8 || e.getKey() == 46) {
                            return false;
                        }

                    }
                }
            });

            scope.causaasistenciaps = new Ext.components.TreeComboBox({
                id: 'causaasistenciaps',
                anchor: '100%',
                editable: true,
                enableKeyEvents: true,
                mostrarBtnLimpiar: true,
                treeConfig: {
                    rootVisible: false,
                    loader: modelo.TreePanelLoaderSesiones,
                    border: false,
                    autoScroll: true
                },
                onClick: function (node) {
                    if (!node.attributes.leaf) {
                        scope.causaasistenciaps.reset();
                        return false;
                    } else {

                        scope.causaasistenciaps.valueNotFoundText = node.text;
                        scope.causaasistenciaps.setValue(node.id);
                        scope.causaasistenciaps.collapse();
                        vista.recordps = node.attributes;
                        scope.recordps = node.attributes;
                        scope.ListadoPersonas.getSelectionModel().getSelected().data.idcausaps = node.attributes.idcausa;
                        scope.ListadoPersonas.getSelectionModel().getSelected().data.denominacionps = node.text;
                        vista.nodeSelectedps = node.attributes;
                        scope.nodeSelectedps = node.attributes;

                    }
                },
                onTriggerClick: function () {
                    if (this.disabled) {
                        return;
                    }
                    if (this.isExpanded()) {
                        this.collapse();
                    } else {
                        this.onFocus({});
                        this.expand();
                    }
                },
                listeners: {
                    keypress: function (tf, e) {
                        if (e.getKey() == 8 || e.getKey() == 46) {
                            return false;

                        }

                    }
                }
            });

            scope.causaasistenciass = new Ext.components.TreeComboBox({
                id: 'causaasistenciass',
                anchor: '100%',
                editable: true,
                enableKeyEvents: true,
                mostrarBtnLimpiar: true,
                treeConfig: {
                    rootVisible: false,
                    loader: modelo.TreePanelLoaderSesiones,
                    border: false,
                    autoScroll: true
                },
                onClick: function (node) {

                    if (!node.attributes.leaf) {
                        scope.causaasistenciass.reset();
                        return false;
                    } else {

                        scope.causaasistenciass.valueNotFoundText = node.text;
                        scope.causaasistenciass.setValue(node.id);
                        scope.causaasistenciass.collapse();
                        vista.recordss = node.attributes;
                        scope.recordss = node.attributes;

                        scope.ListadoPersonas.getSelectionModel().getSelected().data.idcausass = node.attributes.idcausa;
                        scope.ListadoPersonas.getSelectionModel().getSelected().data.denominacionss = node.text;
                        vista.nodeSelectedss = node.attributes;
                        scope.nodeSelectedss = node.attributes;

                    }
                },
                onTriggerClick: function () {
                    if (this.disabled) {
                        return;
                    }
                    if (this.isExpanded()) {
                        this.collapse();
                    } else {
                        this.onFocus({});
                        this.expand();
                    }
                },
                listeners: {
                    keypress: function (tf, e) {
                        if (e.getKey() == 8 || e.getKey() == 46) {
                            return false;
                        }

                    }
                }
            });

            function formatDatev(value, metaData, record, rowIndex, colIndex, store) {
                if (!Ext.isEmpty(record.get('inicioturno')))
                    metaData.attr = 'ext:qtip=Turno:' + record.get('turno');
                else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (value) {
                    if (record.get('presente') == 0) {
                        return (value instanceof Date) ? '<i><b>' + value.format('d/m/Y') + '</i></b>' : '<i><b>' + value + '</i></b>';
                    } else {
                        return (value instanceof Date) ? value.format('d/m/Y') : value;
                    }
                } else {

                }

            };

            function combo(val, metaData, rec, rowIndex, colIndex, store) {
                if (scope.certificados.indexOf(rec.get('idcausa')) != -1) {
                    if (rec.get('certificadocontinuado') == 1) {
                        metaData.attr = 'ext:qtip=Certificado-Continuado';
                    } else {
                        metaData.attr = 'ext:qtip=Certificado-Inicial';
                    }
                } else {
                    if (!Ext.isEmpty(rec.get('inicioturno')))
                        metaData.attr = 'ext:qtip=Turno:' + rec.get('turno');
                    else
                        metaData.attr = 'ext:qtip=SinTurno';
                }
                if (val) {
                    var valor = "";
                    var color = '#ffffff';
                    if (rec.get('presente') == 0) {
                        return '<span  style=" font-size: 11; color:' + rec.data.color + '"><b><i>' + rec.data.denominacion + '</i></b></span>';
                    }

                    return '<span  style=" font-size: 11; color:' + rec.data.color + '"><b>' + rec.data.denominacion + '</b></span>';
                }
                else
                    return val;
            }

            function combops(val, metaData, rec, rowIndex, colIndex, store) {
                if (val) {
                    var valor = "";
                    var color = '#ffffff';
                    if (rec.get('presente') == 0) {
                        return '<span  style=" font-size: 11; color:' + rec.data.colorps + '"><b><i>' + rec.data.denominacionps + '</i></b></span>';
                    }

                    return '<span  style=" font-size: 11; color:' + rec.data.colorps + '"><b>' + rec.data.denominacionps + '</b></span>';
                }
                else
                    return val;
            }

            function comboss(val, metaData, rec, rowIndex, colIndex, store) {
                if (val) {
                    var valor = "";
                    var color = '#ffffff';
                    if (rec.get('presente') == 0) {
                        return '<span  style=" font-size: 11; color:' + rec.data.colorss + '"><b><i>' + rec.data.denominacionss + '</i></b></span>';
                    }

                    return '<span  style=" font-size: 11; color:' + rec.data.colorss + '"><b>' + rec.data.denominacionss + '</b></span>';
                }
                else
                    return val;
            }

            function horas(val, metaData, record, rowIndex, colIndex, store) {
                if (!Ext.isEmpty(record.get('inicioturno')))
                    metaData.attr = 'ext:qtip=Turno:' + record.get('turno');
                else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (val) {
                    var fh = val.split(' ');
                    if (record.get('presente') == 0) {
                        if (fh.length > 1) {
                            var horacompleta = fh[1].split(':');
                            return '<i><b>' + horacompleta[0] + ':' + horacompleta[1] + '</b></i>';
                        }
                        else {
                            return '<i><b>' + val + '</b></i>';
                        }
                    } else {
                        if (fh.length > 1) {
                            var horacompleta = fh[1].split(':');
                            return horacompleta[0] + ':' + horacompleta[1];
                        }
                        else {
                            return val;
                        }
                    }
                }
                else {

                }
            }

            function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
                if (!Ext.isEmpty(record.get('inicioturno')))
                    metaData.attr = 'ext:qtip=Turno:' + record.get('turno');
                else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.get('presente') == 0 && val != null) {
                    return '<i><b>' + val + '</b></i>';
                } else {
                }
                return val;
            }

            function ActivarColoresHrasDesc(val, metaData, record, rowIndex, colIndex, store) {
                if (!Ext.isEmpty(record.get('inicioturno')))
                    metaData.attr = 'ext:qtip=Turno:' + record.get('turno');
                else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.get('presente') == 0 && val != null) {
                    return '<i><b>' + val + '</b></i>';
                } else {
                }
                if(!Ext.isEmpty(val))
                    return '</center></span><span style=" color:' + '#c30703' + '">' + val + '</span>';

            }

            function ActivarColoresHrasTrab(val, metaData, record, rowIndex, colIndex, store) {
                if(!Ext.isEmpty(val)){
                    var trt = val.split(":");
                    if(trt.length != 1){
                        if(val == '00:00:00')
                            var hrstrab = " ";
                        else
                            var hrstrab = trt[0]+':'+trt[1];
                    }else
                        var hrstrab = val;
                }else
                    var hrstrab = val;

                if (!Ext.isEmpty(record.get('inicioturno')))
                    metaData.attr = 'ext:qtip=Turno:' + record.get('turno');
                else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.get('presente') == 0 && val != null) {
                    return '<i><b>' + hrstrab + '</b></i>';
                } else {
                }
                if(!Ext.isEmpty(hrstrab))
                    return '</center></span><span style=" color:' + '#33aa33' + '">' + hrstrab + '</span>';
            }

            function controlador(val, metaData, record, rowIndex, colIndex, store) {
                if (!Ext.isEmpty(record.get('inicioturno')))
                    metaData.attr = 'ext:qtip=Turno:' + record.get('turno');
                else
                    metaData.attr = 'ext:qtip=SinTurno';
                if (record.data.actualizado == 1) {
                    val = 'Control de Acceso';
                    return val;
                } else {
                    return val;
                }
            }

            scope.causaasistencia.on('expand', function (th) {
                var root = scope.causaasistencia.tree.root;
                if (root.childNodes.length > 0)
                    modelo.TreePanelLoader.load(root);
            });

            scope.causaasistenciaps.on('expand', function (th) {
                var root = scope.causaasistenciaps.tree.root;
                if (root.childNodes.length > 0)
                    modelo.TreePanelLoaderSesiones.load(root);
            });

            scope.causaasistenciass.on('expand', function (th) {
                var root = scope.causaasistenciass.tree.root;
                if (root.childNodes.length > 0)
                    modelo.TreePanelLoaderSesiones.load(root);
            });

            var smPersonacausa = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            });

            var expander = new Ext.grid.RowExpander({
                tpl: new Ext.Template(
                    '<br><p><b>R&eacute;gimen de trabajo:</b> {regimen}</p><br><p><b>Grupo de trabajo:</b> {grupo}</p><br><p><b>Turno de trabajo:</b> {turno_denom} [ {turno} ]</p><br><p><b>Observaci&oacute;n:</b> {observacion}</p><br>'
                )
            });

            columns.push(smPersonacausa);
            columns.push(expander);
            columns.push({
                header: 'idasistencia',
                width: 100,
                hidden: true,
                hideable: false,
                dataIndex: 'idasistencia'
            });
            columns.push({header: 'idpersona', width: 100, hidden: true, hideable: false, dataIndex: 'idpersona'});
            columns.push({
                header: 'Nombres y apellidos',
                width: 200,
                dataIndex: 'nombreapellidos',
                renderer: ActivarColores
            });
            indexs.push({name: 'idasistencia'});
            indexs.push({name: 'idpersona'});
            indexs.push({name: 'nombreapellidos'});

            if (sesiones == '1') {
                continentGroupRow.push({header: ' ', align: 'center', colspan: 4});
                continentGroupRow.push({header: 'Primera sesi&oacute;n', align: 'center', colspan: 8})
                columns.push({
                    header: 'Entrada',
                    width: 60,
                    dataIndex: 'fechahoraentradaps',
                    editor: vista.horaentradaps,
                    renderer: horas
                });
                columns.push({
                    header: 'Salida',
                    width: 60,
                    dataIndex: 'fechahorasalidaps',
                    editor: vista.horasalidaps,
                    renderer: horas
                });
                columns.push({
                    header: 'Causa ausencia',
                    width: 210,
                    dataIndex: 'denominacionps',
                    editor: scope.causaasistenciaps,
                    renderer: combops
                });
                columns.push({header: 'idcausaps', hidden: true, hideable: false, width: 100, dataIndex: 'idcausaps'});
                columns.push({header: 'colorps', hidden: true, hideable: false, width: 100, dataIndex: 'colorps'});
                columns.push({
                    header: 'abreviaturaps',
                    hidden: true,
                    hideable: false,
                    width: 100,
                    dataIndex: 'abreviaturaps'
                });
                columns.push({header: 'Perdidas', width: 60, dataIndex: 'hrsdescontadasps', renderer: ActivarColores});
                columns.push({header: 'Extras', width: 60, dataIndex: 'horasextrasps', renderer: ActivarColores});
                indexs.push({name: 'fechahoraentradaps'});
                indexs.push({name: 'fechahorasalidaps'});
                indexs.push({name: 'denominacionps'});
                indexs.push({name: 'idcausaps'});
                indexs.push({name: 'colorps'});
                indexs.push({name: 'abreviaturaps'});
                indexs.push({name: 'hrsdescontadasps'});
                indexs.push({name: 'horasextrasps'});

                continentGroupRow.push({header: 'Segunda sesi&oacute;n', align: 'center', colspan: 8});
                columns.push({
                    header: 'Entrada',
                    width: 60,
                    dataIndex: 'fechahoraentradass',
                    editor: vista.horaentradass,
                    renderer: horas
                });
                columns.push({
                    header: 'Salida',
                    width: 60,
                    dataIndex: 'fechahorasalidass',
                    editor: vista.horasalidass,
                    renderer: horas
                });
                columns.push({
                    header: 'Causa ausencia',
                    width: 210,
                    dataIndex: 'denominacionss',
                    editor: scope.causaasistenciass,
                    renderer: comboss
                });
                columns.push({header: 'idcausass', hidden: true, hideable: false, width: 100, dataIndex: 'idcausass'});
                columns.push({header: 'colorss', hidden: true, hideable: false, width: 100, dataIndex: 'colorss'});
                columns.push({
                    header: 'abreviaturass',
                    hidden: true,
                    hideable: false,
                    width: 100,
                    dataIndex: 'abreviaturass'
                });
                columns.push({header: 'Perdidas', width: 60, dataIndex: 'hrsdescontadasss', renderer: ActivarColores});
                columns.push({header: 'Extras', width: 60, dataIndex: 'horasextrasss', renderer: ActivarColores});
                indexs.push({name: 'fechahoraentradass'});
                indexs.push({name: 'fechahorasalidass'});
                indexs.push({name: 'denominacionss'});
                indexs.push({name: 'idcausass'});
                indexs.push({name: 'colorss'});
                indexs.push({name: 'abreviaturass'});
                indexs.push({name: 'hrsdescontadasss'});
                indexs.push({name: 'horasextrasss'});

                continentGroupRow.push({header: ' ', align: 'center', colspan: 20})
            }
            else {
                if (otrodia == 1)
                    columns.push({
                        header: 'Fecha entrada',
                        width: 85,
                        dataIndex: 'fechaentrada',
                        editor: vista.desdeentrada,
                        renderer: formatDatev
                    });
                else
                    columns.push({
                        header: 'Fecha entrada',
                        width: 85,
                        dataIndex: 'fechaentrada',
                        editor: vista.desdeentrada,
                        renderer: formatDatev,
                        hidden: true
                    });
                columns.push({
                    header: 'Hora entrada',
                    width: 80,
                    dataIndex: 'fechahoraentrada',
                    editor: vista.horaentrada,
                    renderer: horas
                });
                if (otrodia == 1)
                    columns.push({
                        header: 'Fecha salida',
                        width: 85,
                        dataIndex: 'fechasalida',
                        editor: vista.hastasalida,
                        renderer: formatDatev
                    });
                else
                    columns.push({
                        header: 'Fecha salida',
                        width: 85,
                        dataIndex: 'fechasalida',
                        editor: vista.hastasalida,
                        renderer: formatDatev,
                        hidden: true
                    });
                columns.push({
                    header: 'Hora salida',
                    width: 80,
                    dataIndex: 'fechahorasalida',
                    editor: vista.horasalida,
                    renderer: horas
                });
                columns.push({header: 'color', hidden: true, hideable: false, width: 100, dataIndex: 'color'});
                columns.push({
                    header: 'abreviatura',
                    hidden: true,
                    hideable: false,
                    width: 100,
                    dataIndex: 'abreviatura'
                });
                indexs.push({name: 'fechaentrada'});
                indexs.push({name: 'fechahoraentrada'});
                indexs.push({name: 'fechasalida'});
                indexs.push({name: 'fechahorasalida'});
                indexs.push({name: 'color'});
            }

            columns.push({
                header: 'Causa ausencia',
                width: 200,
                dataIndex: 'denominacion',
                editor: scope.causaasistencia,
                renderer: combo
            });
            columns.push({header: 'idcausa', hidden: true, hideable: false, width: 100, dataIndex: 'idcausa'});
            columns.push({
                header: 'tieneperiodo',
                hidden: true,
                hideable: false,
                width: 110,
                dataIndex: 'tieneperiodo'
            });
            columns.push({
                header: 'tieneentradasalida',
                hidden: true,
                hideable: false,
                width: 110,
                dataIndex: 'tieneentradasalida'
            });
            columns.push({header: 'Desde', width: 70, dataIndex: 'fdesde', editor: vista.desde, renderer: formatDatev});
            columns.push({header: 'Hasta', width: 70, dataIndex: 'fhasta', editor: vista.hasta, renderer: formatDatev});
            columns.push({header: 'color', hidden: true, hideable: false, width: 100, dataIndex: 'color'});
            columns.push({
                header: 'fecharegistro',
                width: 100,
                dataIndex: 'fecharegistro',
                hidden: true,
                hideable: false
            });
            columns.push({header: 'Perdidas', width: 70, dataIndex: 'hrsdescontadas', renderer: ActivarColoresHrasDesc});
            columns.push({header: 'Trabajadas',width: 70,dataIndex: 'hrstrabajadas',renderer: ActivarColoresHrasTrab});
            if (sesiones == '0') {
                columns.push({header: 'Horas extras', width: 90, dataIndex: 'horasextras', renderer: ActivarColores});
            }
            columns.push({header: 'idcategoria', hidden: true, hideable: false, width: 100, dataIndex: 'idcategoria'});
            columns.push({
                header: 'idcontrolador',
                hidden: true,
                hideable: false,
                width: 80,
                dataIndex: 'idcontrolador'
            });
            columns.push({header: 'Controlado por', width: 200, dataIndex: 'controlador', renderer: controlador});
            columns.push({
                header: 'idmodifica',
                hidden: true,
                hideable: false,
                width: 80,
                dataIndex: 'idpersonamodifica'
            });
            columns.push({header: 'Modificada por', width: 200, dataIndex: 'personamodifica'});
            columns.push({header: 'idarea', width: 100, hidden: true, hideable: false, dataIndex: 'idarea'});
            columns.push({header: 'Área', width: 100, hidden: true, hideable: false, dataIndex: 'denomarea'});
            columns.push({
                header: 'idpersonacertifica',
                hidden: true,
                hideable: false,
                width: 200,
                dataIndex: 'idpersonacertifica'
            });
            columns.push({
                header: 'Certificado', width: 70, dataIndex: 'certificado', renderer: function (val) {
                    if (val == 1)return '</center></span><span style=" color:' + '#33aa33' + '"><b>&#10004;</b></span>'; else return '';
                }
            });
            columns.push({header: 'Certificado por', width: 200, dataIndex: 'personacertifica'});
            columns.push({
                header: 'Aprobado', width: 70, dataIndex: 'aprobado', renderer: function (val) {
                    if (val == 1)return '</center></span><span style=" color:' + '#2b9c26' + '"><b>&#10004;</b></span>'; else return '';
                }
            });
            columns.push({header: 'Aprobado por', width: 200, dataIndex: 'personaaprueba'});
            columns.push({
                header: 'Observación',
                width: 200,
                dataIndex: 'observacion',
                editor: vista.observacion,
                renderer: ActivarColores
            });
            columns.push({header: 'otrodia', hidden: true, hideable: false, width: 100, dataIndex: 'otrodia'});
            columns.push({header: 'turno', hidden: true, hideable: false, width: 100, dataIndex: 'turno'});
            columns.push({header: 'inicioturno', hidden: true, hideable: false, width: 100, dataIndex: 'inicioturno'});
            columns.push({header: 'hfinturno', hidden: true, hideable: false, width: 100, dataIndex: 'hfinturno'});
            columns.push({header: 'finiturno', hidden: true, hideable: false, width: 100, dataIndex: 'finiturno'});
            columns.push({header: 'finturno', hidden: true, hideable: false, width: 100, dataIndex: 'finturno'});
            columns.push({header: 'regimen', hidden: true, hideable: false, width: 100, dataIndex: 'regimen'});
            columns.push({header: 'grupo', hidden: true, hideable: false, width: 100, dataIndex: 'grupo'});
            columns.push({header: 'turno', hidden: true, hideable: false, width: 100, dataIndex: 'turno_denom'});
            columns.push({header: 'numid', hidden: true, hideable: false, width: 100, dataIndex: 'numid'});
            columns.push({
                header: 'certificadocontinuado',
                hidden: true,
                hideable: false,
                width: 100,
                dataIndex: 'certificadocontinuado'
            });
            columns.push({
                header: 'ultimocertcontinuado',
                hidden: true,
                hideable: false,
                width: 100,
                dataIndex: 'ultimocertcontinuado'
            });
            columns.push({
                header: 'ultimocertinicial',
                hidden: true,
                hideable: false,
                width: 100,
                dataIndex: 'ultimocertinicial'
            });


            indexs.push({name: 'denominacion'});

            indexs.push({name: 'idcausa'});
            indexs.push({name: 'tieneperiodo'});
            indexs.push({name: 'tieneentradasalida'});
            indexs.push({name: 'fdesde'});
            indexs.push({name: 'fhasta'});
            indexs.push({name: 'color'});
            indexs.push({name: 'fecharegistro'});
            indexs.push({name: 'hrsdescontadas'});
            indexs.push({name:'hrstrabajadas'});
            if (sesiones == '0') {
                indexs.push({name: 'horasextras'});
            }
            indexs.push({name: 'idcategoria'});
            indexs.push({name: 'idcontrolador'});
            indexs.push({name: 'controlador'});
            indexs.push({name: 'idpersonamodifica'});
            indexs.push({name: 'personamodifica'});
            indexs.push({name: 'observacion'});
            indexs.push({name: 'idarea'});
            indexs.push({name: 'denomarea'});
            indexs.push({name: 'idpersonacertifica'});
            indexs.push({name: 'certificado'});
            indexs.push({name: 'personacertifica'});
            indexs.push({name: 'aprobado'});
            indexs.push({name: 'personaaprueba'});
            indexs.push({name: 'otrodia'});
            indexs.push({name: 'turno'});
            indexs.push({name: 'inicioturno'});
            indexs.push({name: 'hfinturno'});
            indexs.push({name: 'finiturno'});
            indexs.push({name: 'finturno'});
            indexs.push({name: 'regimen'});
            indexs.push({name: 'grupo'});
            indexs.push({name: 'turno_denom'});
            indexs.push({name: 'numid'});
            indexs.push({name: 'certificadocontinuado'});
            indexs.push({name: 'ultimocertcontinuado'});
            indexs.push({name: 'ultimocertinicial'});

            var group = new Ext.ux.grid.ColumnHeaderGroup({
                rows: [continentGroupRow]
            });

            scope.cmListadoPersonas = new Ext.grid.ColumnModel(columns);

            var plantillaapa = new Ext.data.Record.create(indexs);
            var myReaderapa = new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            }, plantillaapa);

            scope.stListadoPersonas = new Ext.data.GroupingStore({
                url: 'getpersonasasistencia',
                remoteSort: true,
                remoteGroup: true,
                pruneModifiedRecords: true,
                reader: myReaderapa,
                sortInfo: {field: 'denomarea', direction: "ASC"},
                groupField: 'denomarea',
                listeners: {
                    load: function (st, recs, opt) {
                        // if(st.reader.jsonData.habca == 1 || responseData.habca == 1){
                        scope.tipocontrolacceso = responseData.tipoca;
                        if (scope.tipocontrolacceso == 2) {
                            vista.btnActualizar.setText('Tempus')
                            vista.btnActualizar.setVisible(true);
                        } else if (scope.tipocontrolacceso == 1) {
                            vista.btnActualizar.setText('Control de acceso')
                            vista.btnActualizar.setVisible(true);
                        } else if (scope.tipocontrolacceso == 3) {
                            vista.btnActualizar.setText('ANVIZ')
                            vista.btnActualizar.setVisible(true);
                        } else {
                            vista.btnActualizar.setVisible(false);
                        }
                        // vista.btnActualizar.setVisible(true);
                        // }else{
                        //     vista.btnActualizar.setVisible(false);
                        // }
                        if (!Ext.isEmpty(st.reader.jsonData.sinregimen))
                            mostrarMensaje(1, idioma.MsgPeopleNoRegimen + '<ul>' + st.reader.jsonData.sinregimen + '</ul>');
                        else if (!Ext.isEmpty(responseData.sinregimen))
                            mostrarMensaje(1, idioma.MsgPeopleNoRegimen + '<ul>' + responseData.sinregimen + '</ul>');
                        if (!Ext.isEmpty(st.reader.jsonData.sincalendario))
                            mostrarMensaje(1, idioma.MsgPeopleNoCalendario + '<ul>' + st.reader.jsonData.sincalendario + '</ul>');
                        else if (!Ext.isEmpty(responseData.sincalendario))
                            mostrarMensaje(1, idioma.MsgPeopleNoCalendario + '<ul>' + responseData.sincalendario + '</ul>');
                        if (recs.length == 0) {
                            var x = (st.reader.jsonData.cod > 0) ? st.reader.jsonData.cod : responseData.cod;

                            if (x == 5)
                                mostrarMensaje(1, idioma.MsgConfigCargos);
                            else if (x == 6)
                                mostrarMensaje(1, idioma.MsgConfigCargosNoPeople);
                            else if (x == 7)
                                mostrarMensaje(1, idioma.MsgConfigNoCargos);
                            if (x == 8)
                                mostrarMensaje(1, idioma.MsjNoPerfil);
                            else if (x == 3)
                                mostrarMensaje(1, idioma.MsgConfigEstructuraAsist);

                            vista.btnGuardar.disable();
                            // vista.fechaBuscar.disable();
                        }
                        else {
                            vista.btnGuardar.enable();
                            vista.fechaBuscar.enable();

                        }
                    }
                }
            });

            scope.smListadoPersonas = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });

            scope.ListadoPersonas = new Ext.grid.EditorGridPanel({
                id: 'listadoPersonas',
                store: scope.stListadoPersonas,
                sm: smPersonacausa/*scope.smListadoPersonas*/,
                loadMask: {msg: "Cargando datos..."},
                plugins: (sesiones == '1') ? [expander, group] : [expander],
                cm: scope.cmListadoPersonas,
                stripeRows: true,
                clicksToEdit: 1,
                viewConfig: {
                    forceFit: true,
                    getRowClass: function (rec, ind) {
                        return 'asistencia' + rec.data.idcausa;
                    }
                },
                view: new Ext.grid.GroupingView({
                    groupByText: ' ',
                    enableGroupingMenu: false,
                    enableNoGroups: false,
                    showGroupName: false,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
                }),
                tbar: ['Nombre y apellidos: ', vista.tfbuscar, '', vista.btnBuscar, '', vista.btnLimpiar, '-', vista.btnAct, '-', vista.btnCertificar, /* vista.btnQuitarCertificacion, '-', */vista.btnEliminar, vista.btnCausas]
            });

            scope.ListadoPersonas.getSelectionModel().on('rowdeselect', function () {
                if (scope.ListadoPersonas.getSelectionModel().getCount() == 0) {
                    vista.btnCertificar.disable();
                    // vista.btnQuitarCertificacion.disable();
                    vista.btnEliminar.disable();
                    vista.btnCausas.disable();
                    modelo.storeMultiplesCausas.removeAll();
                    vista.panelcausas.collapse();
                } else if(scope.ListadoPersonas.getSelectionModel().getCount() == 1) {
                    vista.btnCausas.enable();
                }
            }, this);

            scope.ListadoPersonas.getSelectionModel().on('rowselect', function () {
                s = scope.ListadoPersonas.getSelectionModel().getSelected();
                if (s.data.presente == 0) {
                    mostrarMensaje(2, scope.ListadoPersonas.getSelectionModel().getSelected().data.nombreapellidos + ' ' + 'no trabaja el dia' + ' ' + vista.fechaBuscar.getRawValue() + '. &iquest;Est&aacute; seguro que quiere modificar sus datos?', function (btnPresionado) {
                    });
                }
                if (scope.ListadoPersonas.getSelectionModel().getCount() > 0) {
                    vista.btnCertificar.enable();
                    //vista.btnQuitarCertificacion.enable();
                    vista.btnEliminar.enable();
                    // modelo.storeMultiplesCausas.load({params: {idpersona: scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,fecha: vista.fechaBuscar.getRawValue()}});
                }
                
                if (scope.ListadoPersonas.getSelectionModel().getCount() == 1 && (s.data.certificado == 0 || Ext.isEmpty(s.data.certificado))) {
                    vista.btnCausas.enable();
                } else {
                    vista.btnCausas.disable();
                }

            }, this);

            vista.listadoAsistencia.add(scope.ListadoPersonas);
            vista.listadoAsistencia.doLayout();

            scope.stListadoPersonas.loadData({
                datos: responseData.datos,
            }, true);

            scope.ListadoPersonas.on('beforeedit', function (e) {
                if ((e.record.data.aprobado == 0 || Ext.isEmpty(e.record.data.aprobado)) && (e.record.data.certificado == 0 || Ext.isEmpty(e.record.data.certificado))) {
                    if (scope.ListadoPersonas.getSelectionModel().getSelected().data.otrodia == 1) {
                        vista.hastasalida.setMinValue(e.record.data.fechaentrada);
                        vista.hastasalida.setMaxValue(e.record.data.finturno);
                    }
                    //scope.recordsEdit = scope.smListadoPersonas.getSelections();
                    scope.recordsEdit = smPersonacausa.getSelections();
                    if (e.record.data.presente == 0 && e.field == 'denominacion') {
                        return false;
                    }

                    if (e.record.data.fecharegistro != vista.fechaBuscar.getRawValue() && e.field == 'fhasta' && !Ext.isEmpty(e.record.data.idcausa)) {
                        vista.hasta.setMinValue(e.record.data.fdesde);
                        return true;
                    }

                    if (e.record.data.fecharegistro == vista.fechaBuscar.getRawValue() || e.record.data.inicioturno == vista.fechaBuscar.getRawValue() || e.record.data.finturno == vista.fechaBuscar.getRawValue()) {
                        if (e.field == 'fechahoraentrada' || e.field == 'fechahorasalida' ||
                            e.field == 'fechaentrada' || e.field == 'fechasalida') {
                            if (e.field == 'fechaentrada' || e.field == 'fechasalida') {
                                if (e.field == 'fechaentrada') {
                                    e.record.set('fechaentrada', vista.fechaBuscar.getRawValue());
                                    return false;
                                }
                                if (scope.ListadoPersonas.getSelectionModel().getSelected().data.otrodia == 0 && e.field == 'fechasalida') {
                                    e.record.set('fechasalida', vista.fechaBuscar.getRawValue());
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                            else
                                return true;

                        }
                        else {
                            if ((e.field == 'fdesde' || e.field == 'fhasta')) {
                                if (!Ext.isEmpty(e.record.data.idcausa)) {
                                    if (e.record.data.tieneperiodo == 1) {
                                        if (!Ext.isEmpty(e.record.data.fdesde) && vista.fechaBuscar.getRawValue() != e.record.data.fdesde)
                                            return false;
                                        else {
                                            if (e.field == 'fdesde') {
                                                Ext.each(scope.recordsEdit, function(rec){
                                                    rec.set('fdesde', vista.fechaBuscar.getRawValue());
                                                });
                                                return false;
                                            }
                                            else
                                                return true;
                                        }
                                    }
                                    else
                                        return false;
                                }
                                else
                                    return false;
                            }
                            else {
                                if (e.field == 'denominacion') {
                                    if (e.record.data.idcategoria == null) {
                                        modelo.TreePanelLoader.baseParams.idcategoria = -1;
                                    } else {
                                        modelo.TreePanelLoader.baseParams.idcategoria = e.record.data.idcategoria;
                                    }
                                    return true;
                                }
                                else {
                                    if (e.field == 'denominacionps' || e.field == 'denominacionss') {
                                        if (e.record.data.idcategoria == null) {
                                            modelo.TreePanelLoader.baseParams.idcategoria = -1;
                                        } else {
                                            modelo.TreePanelLoader.baseParams.idcategoria = e.record.data.idcategoria;
                                        }
                                        return true;
                                    }
                                    else {
                                        if (e.field == 'fechahoraentradaps' || e.field == 'fechahorasalidaps' || e.field == 'fechahoraentradass' || e.field == 'fechahorasalidass') {
                                            return true;
                                        }
                                        else {
                                            if (e.field == 'observacion')
                                                return true;
                                            else
                                                return false;
                                        }
                                    }
                                }

                            }
                        }
                    }
                    else
                        return false;
                }
                else
                    return false;
            });

            scope.ListadoPersonas.on('afteredit', function (e) {
                Ext.each(scope.recordsEdit, function (rec) {
                    if (scope.certificados.indexOf(rec.data.idcausa) != -1 && e.field == 'denominacion') {
                        if (!Ext.isEmpty(rec.data.ultimocertcontinuado) || !Ext.isEmpty(rec.data.ultimocertinicial)) {
                            Ext.MessageBox.confirm('Confirmación', '¿Este certificado es continuación de otro?', function (btnPresionado) {
                                if (btnPresionado == 'yes') {
                                    rec.set('certificadocontinuado', 1);
                                } else {
                                    rec.set('certificadocontinuado', 0);
                                }
                            });
                        } else {
                            rec.set('certificadocontinuado', 0);
                        }
                    }

                    if (e.field == 'denominacion') {
                        if (Ext.isEmpty(e.value)) {
                            rec.set(e.field, '');
                            rec.set('idcausa', '');
                            rec.set('abreviatura', '');
                            rec.set('color', '');
                            rec.set('tieneperiodo', '');
                            rec.set('tieneentradasalida', '');
                        }
                        else {
                            rec.set(e.field, vista.nodeSelected.denominacion);
                            rec.set('idcausa', vista.nodeSelected.idcausa);
                            rec.set('abreviatura', vista.nodeSelected.abreviatura);
                            rec.set('color', vista.nodeSelected.color);
                            rec.set('tieneperiodo', vista.nodeSelected.tieneperiodo);
                            rec.set('tieneentradasalida', vista.nodeSelected.tieneentradasalida);

                            if (vista.nodeSelected.tieneperiodo != 1 && vista.nodeSelected.tieneentradasalida != 1) {
                                if (scope.sesiones == '1') {
                                    rec.set('fechahoraentradaps', '');
                                    rec.set('fechahorasalidaps', '');
                                    rec.set('fechahoraentradass', '');
                                    rec.set('fechahorasalidass', '');
                                    rec.set('denominacionps', '');
                                    rec.set('denominacionss', '');
                                    rec.set('abreviaturaps', '');
                                    rec.set('colorps', '');
                                    rec.set('abreviaturass', '');
                                    rec.set('colorss', '');
                                    rec.set('hrsdescontadasps', '');
                                    rec.set('hrsdescontadasss', '');
                                    rec.set('horasextrasps', '');
                                    rec.set('horasextrasss', '');
                                }
                                else {
                                    rec.set('fechahoraentrada', '');
                                    rec.set('fechaentrada', '');
                                    rec.set('fechahorasalida', '');
                                    rec.set('fechasalida', '');
                                }

                                rec.set('fdesde', '');
                                rec.set('fhasta', '');
                            }
                            else {
                                if (vista.nodeSelected.tieneperiodo == 1 && vista.nodeSelected.tieneentradasalida == 1) {
                                    if (!Ext.isEmpty(rec.data.fdesde) || !Ext.isEmpty(rec.data.fhasta)) {
                                        if (scope.sesiones == '1') {
                                            rec.set('fechahoraentradaps', '');
                                            rec.set('fechahorasalidaps', '');
                                            rec.set('fechahoraentradass', '');
                                            rec.set('fechahorasalidass', '');
                                            rec.set('denominacionps', '');
                                            rec.set('denominacionss', '');
                                            rec.set('abreviaturaps', '');
                                            rec.set('colorps', '');
                                            rec.set('abreviaturass', '');
                                            rec.set('colorss', '');
                                            rec.set('hrsdescontadasps', '');
                                            rec.set('hrsdescontadasss', '');
                                            rec.set('horasextrasps', '');
                                            rec.set('horasextrasss', '');
                                        }
                                        else {
                                            rec.set('fechahoraentrada', '');
                                            rec.set('fechaentrada', '');
                                            rec.set('fechahorasalida', '');
                                            rec.set('fechasalida', '');
                                        }
                                    }
                                    else {
                                        rec.set('fdesde', '');
                                        rec.set('fhasta', '');
                                    }
                                }
                                else {
                                    if (vista.nodeSelected.tieneperiodo == 1) {
                                        if (scope.sesiones == '1') {
                                            rec.set('fechahoraentradaps', '');
                                            rec.set('fechahorasalidaps', '');
                                            rec.set('fechahoraentradass', '');
                                            rec.set('fechahorasalidass', '');
                                            rec.set('denominacionps', '');
                                            rec.set('denominacionss', '');
                                            rec.set('abreviaturaps', '');
                                            rec.set('colorps', '');
                                            rec.set('abreviaturass', '');
                                            rec.set('colorss', '');
                                            rec.set('hrsdescontadasps', '');
                                            rec.set('hrsdescontadasss', '');
                                            rec.set('horasextrasps', '');
                                            rec.set('horasextrasss', '');
                                        }
                                        else {
                                            rec.set('fechahoraentrada', '');
                                            rec.set('fechaentrada', '');
                                            rec.set('fechahorasalida', '');
                                            rec.set('fechasalida', '');
                                        }
                                    }
                                    else {
                                        rec.set('fdesde', '');
                                        rec.set('fhasta', '');
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (e.field == 'denominacionps') {
                            if (Ext.isEmpty(e.value)) {
                                rec.set(e.field, '');
                                rec.set('idcausaps', '');
                                rec.set('abreviaturaps', '');
                                rec.set('colorps', '');
                                rec.set('tieneperiodo', '');
                                rec.set('tieneentradasalida', '');
                            }
                            else {
                                rec.set(e.field, vista.nodeSelectedps.denominacion);
                                rec.set('idcausaps', vista.nodeSelectedps.idcausa);
                                rec.set('abreviaturaps', vista.nodeSelectedps.abreviatura);
                                rec.set('colorps', vista.nodeSelectedps.color);
                                rec.set('tieneperiodo', vista.nodeSelectedps.tieneperiodo);
                                rec.set('tieneentradasalida', vista.nodeSelectedps.tieneentradasalida);
                                rec.set('idcausa', '');
                                rec.set('fdesde', '');
                                rec.set('fhasta', '');
                                rec.set('color', '');
                                rec.set('abreviatura', '');
                                rec.set('denominacion', '');
                            }
                        }
                        else {
                            if (e.field == 'denominacionss') {
                                if (Ext.isEmpty(e.value)) {
                                    rec.set(e.field, '');
                                    rec.set('idcausass', '');
                                    rec.set('abreviaturass', '');
                                    rec.set('colorss', '');
                                    rec.set('tieneperiodo', '');
                                    rec.set('tieneentradasalida', '');
                                }
                                else {
                                    rec.set(e.field, vista.nodeSelectedss.denominacion);
                                    rec.set('idcausass', vista.nodeSelectedss.idcausa);
                                    rec.set('abreviaturass', vista.nodeSelectedss.abreviatura);
                                    rec.set('colorss', vista.nodeSelectedss.color);
                                    rec.set('tieneperiodo', vista.nodeSelectedss.tieneperiodo);
                                    rec.set('tieneentradasalida', vista.nodeSelectedss.tieneentradasalida);
                                    rec.set('idcausa', '');
                                    rec.set('fdesde', '');
                                    rec.set('fhasta', '');
                                    rec.set('color', '');
                                    rec.set('abreviatura', '');
                                    rec.set('denominacion', '');
                                }
                            }
                            else {
                                if (e.field == 'fechahoraentrada' || e.field == 'fechahorasalida') {
                                    if (Ext.isEmpty(e.value) && !Ext.isEmpty(e.originalValue)) {
                                        mostrarMensaje(2, '¿Está seguro que desea eliminar la hora seleccionada?', function (btnPresionado) {
                                            if (btnPresionado == 'ok') {
                                                rec.set(e.field, "");
                                            } else {
                                                rec.set(e.field, e.originalValue);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        rec.set(e.field, e.value);
                                    }
                                    if (!isNaN(rec.data.idcausa) && rec.data.tieneentradasalida != 1) {
                                        if (rec.data.tieneperiodo == 1) {
                                            rec.set('fdesde', '');
                                            rec.set('fhasta', '');
                                        }
                                        
                                        if(rec.data.idcausa != -1){
                                            rec.set('denominacion', '');
                                        }
                                        rec.set('idcausa', '');
                                        rec.set('abreviatura', '');
                                        rec.set('color', '');
                                        rec.set('tieneperiodo', '');
                                        rec.set('tieneentradasalida', '');

                                    }
                                    if (!Ext.isEmpty(e.value) || (!Ext.isEmpty(rec.data.fdesde) || !Ext.isEmpty(rec.data.fhasta))) {
                                        rec.set('fdesde', '');
                                        rec.set('fhasta', '');
                                    }
                                    if (!Ext.isEmpty(e.value) && !Ext.isEmpty(e.originalValue) && e.value != e.originalValue && rec.data.observacion == 'Actualizado desde Tempus') {
                                        rec.set('observacion', '');
                                    }

                                } else {
                                    if (e.field == 'fdesde' || e.field == 'fhasta') {
                                        if (Ext.isEmpty(e.value))
                                            rec.set(e.field, e.value);
                                        else if (e.value instanceof Date)
                                            rec.set(e.field, e.value.format('d/m/Y'));
                                        else
                                            rec.set(e.field, '');

                                        if (!Ext.isEmpty(e.value)) {
                                            if (scope.sesiones == '1') {
                                                rec.set('fechahoraentradaps', '');
                                                rec.set('fechahorasalidaps', '');
                                                rec.set('fechahoraentradass', '');
                                                rec.set('fechahorasalidass', '');
                                                rec.set('idcausaps', '');
                                                rec.set('idcausass', '');
                                                rec.set('denominacionps', '');
                                                rec.set('denominacionss', '');
                                                rec.set('colorps', '');
                                                rec.set('colorss', '');
                                                rec.set('hrsdescontadasps', '');
                                                rec.set('hrsdescontadasss', '');
                                                rec.set('horasextrasps', '');
                                                rec.set('horasextrasss', '');
                                            }
                                            else {
                                                rec.set('fechahoraentrada', '');
                                                rec.set('fechaentrada', '');
                                                rec.set('fechahorasalida', '');
                                                rec.set('fechasalida', '');
                                            }

                                        }
                                    }
                                    else {
                                        if (e.field == 'fechahoraentradaps' || e.field == 'fechahorasalidaps' || e.field == 'fechahoraentradass' || e.field == 'fechahorasalidass') {
                                            if (Ext.isEmpty(e.value) && !Ext.isEmpty(e.originalValue)) {
                                                mostrarMensaje(2, '¿Está seguro que desea eliminar la hora seleccionada?', function (btnPresionado) {
                                                    if (btnPresionado == 'ok') {
                                                        rec.set(e.field, "");
                                                    } else {
                                                        rec.set(e.field, e.originalValue);
                                                    }
                                                });
                                            }
                                            rec.set('fdesde', '');
                                            rec.set('fhasta', '');
                                            rec.set('idcausa', '');
                                            rec.set('color', '');
                                            rec.set('abreviatura', '');
                                            rec.set('denominacion', '');

                                            if (e.field == 'fechahoraentradaps' || e.field == 'fechahorasalidaps') {
                                                // rec.set('idcausaps', '');
                                                rec.set('denominacionps', '');
                                                rec.set('colorps', '');
                                                rec.set('hrsdescontadasps', '');
                                                rec.set('horasextrasps', '');
                                            }

                                            if (e.field == 'fechahoraentradass' || e.field == 'fechahorasalidass') {
                                                rec.set('denominacionss', '');
                                                rec.set('colorss', '');
                                                rec.set('hrsdescontadasss', '');
                                                rec.set('horasextrasss', '');
                                            }
                                        }
                                        else {
                                            if (e.field == 'fechasalida') {
                                                rec.set('fechasalida', e.value.format('d/m/Y'))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(rec.data.idcausa != -1){
                        rec.set('hrsdescontadas', '');
                        rec.set('hrstrabajadas', '');
                    }
                    rec.set('horasextras', '');
                });
            });

            scope.causaasistencia.on('valueReseted', function (ov) {
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechahoraentrada', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechahorasalida', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechaentrada', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechasalida', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fdesde', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fhasta', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('idcontrolador', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('controlador', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('idpersonamodifica', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('personamodifica', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('observacion', '');
            });

            scope.causaasistenciaps.on('valueReseted', function (ov) {
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechahoraentradaps', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechahorasalidaps', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fdesde', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fhasta', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('idcontrolador', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('controlador', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('idpersonamodifica', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('personamodifica', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('observacion', '');
            });

            scope.causaasistenciass.on('valueReseted', function (ov) {
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechahoraentradass', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fechahorasalidass', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fdesde', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('fhasta', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('idcontrolador', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('controlador', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('idpersonamodifica', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('personamodifica', '');
                scope.ListadoPersonas.getSelectionModel().getSelected().set('observacion', '');
            });
        }

        //creando el grid de asistencia dinamico en funcion del trabajo con las sesiones

        vista.btnBuscar.on('click', function () {
            buscarpersona();
        }, this);

        buscarpersona = function () {
            var tVal = vista.tfbuscar.getRawValue().toLowerCase();
            var cant = scope.stListadoPersonas.getCount();
            var listpersonas = scope.stListadoPersonas.getRange(0, cant);
            var cont = 0;
            var conicidencias = new Array();
            if (tVal != ' ') {
                Ext.each(listpersonas, function (rec) {
                    var tStr = rec.data.nombreapellidos.toString().toLowerCase();
                    if (tStr.indexOf(tVal) != -1) {
                        conicidencias.push(new modelo.recQrElement({
                            idasistencia: rec.data.idasistencia,
                            idpersona: rec.data.idpersona,
                            nombreapellidos: rec.data.nombreapellidos,
                            fechahoraentrada: rec.data.fechahoraentrada,
                            fechaentrada: rec.data.fechaentrada,
                            idcausa: rec.data.idcausa,
                            fdesde: rec.data.fdesde,
                            fhasta: rec.data.fhasta,
                            hrsdescontadas: rec.data.hrsdescontadas,
                            hrstrabajadas: rec.data.hrstrabajadas,
                            fechahorasalida: rec.data.fechahorasalida,
                            fechasalida: rec.data.fechasalida,
                            fecharegistro: rec.data.fecharegistro,
                            denominacion: rec.data.denominacion,
                            abreviatura: rec.data.abreviatura,
                            tieneperiodo: rec.data.tieneperiodo,
                            tieneentradasalida: rec.data.tieneentradasalida,
                            color: rec.data.color,
                            presente: rec.data.presente,
                            idcategoria: rec.data.idcategoria,
                            observacion: rec.data.observacion,
                            idarea: rec.data.idarea,
                            denomarea: rec.data.denomarea,
                            horasextras: rec.data.horasextras,
                            idcontrolador: rec.data.idcontrolador,
                            controlador: rec.data.controlador,
                            idpersonamodifica: rec.data.idpersonamodifica,
                            personamodifica: rec.data.personamodifica,
                            actualizado: rec.data.actualizado,
                            idpersonacertifica: rec.data.idpersonacertifica,
                            personacertifica: rec.data.personacertifica,
                            certificado: rec.data.certificado,
                            aprobado: rec.data.aprobado,
                            personaaprueba: rec.data.personaaprueba,
                            otrodia: rec.data.otrodia,
                            turno: rec.data.turno,
                            inicioturno: rec.data.inicioturno,
                            hfinturno: rec.data.hfinturno,
                            finiturno: rec.data.finiturno,
                            finturno: rec.data.finturno,
                            regimen: rec.data.regimen,
                            grupo: rec.data.grupo,
                            turno_denom: rec.data.turno_denom
                        }));
                    }
                });
                scope.stListadoPersonas.removeAll();
                scope.ListadoPersonas.getStore().add(conicidencias);

                if (conicidencias.length == 0) {
                    mostrarMensaje(1, idioma.MsgNoResultMostrar);
                }
            }
        }

        vista.btnLimpiar.on('click', function () {
            vista.tfbuscar.reset();
            scope.stListadoPersonas.removeAll();
            scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
            //scope.createListado();
            vista.btnCertificar.disable();
            vista.btnEliminar.disable();
            vista.btnCausas.disable();
            //scope.ListadoPersonas.getStore().add(scope.recordsLoaded);
        });

        vista.btnAct.on('click', function () {
            vista.tfbuscar.reset();
            modelo.storeTurnoTrabajo.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
            scope.stListadoPersonas.removeAll();
            scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
            //scope.createListado();
            vista.btnCertificar.disable();
            vista.btnEliminar.disable();
            vista.btnCausas.disable();
        });

        vista.btnLimpiarturno.on('click', function () {
            vista.btnCertificar.disable();
            vista.btnEliminar.disable();
            vista.btnCausas.disable();
            vista.cbturno.clearValue();
            scope.stListadoPersonas.removeAll();
            vista.Maskara.show();
            Ext.Ajax.request({
                url: 'getpersonasasistencia',
                params: {
                    fecha: vista.fechaBuscar.getRawValue()
                },
                method: "POST",
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    scope.sesiones = responseData.sesiones;
                    scope.otrodia = responseData.otrodia;
                    if (scope.otrodia == 1) {
                        scope.ListadoPersonas.getColumnModel().setHidden(5, false);
                        scope.ListadoPersonas.getColumnModel().setHidden(7, false);
                    } else {
                        scope.ListadoPersonas.getColumnModel().setHidden(5, true);
                        scope.ListadoPersonas.getColumnModel().setHidden(7, true);
                    }
                    scope.stListadoPersonas.removeAll();
                    scope.stListadoPersonas.loadData({
                        datos: responseData.datos
                    }, true);
                    vista.Maskara.hide();
                }
            });
        });

        vista.btnGuardar.on('click', function () {
            //this.guardar();
            this.existeAsistenciaPeriodo();
        }, this);

        this.existeAsistenciaPeriodo = function(){
            var idasistencia = new Array();
            var idpersonas = new Array();
            var idcargos = new Array();
            var fdesde = new Array();
            var fhasta = new Array();
            if (scope.stListadoPersonas.modified.length > 0) {
                Ext.each(scope.stListadoPersonas.modified, function (recs) {
                    idasistencia.push(recs.data.idasistencia);
                    idpersonas.push(recs.data.idpersona);
                    idcargos.push(recs.data.idcargo);
                    fdesde.push(recs.data.fdesde);
                    fhasta.push(recs.data.fhasta);
                });
                Ext.Ajax.request({
                    url: 'existeAsistenciaPeriodo',
                    params: {
                        idasistencia: Ext.encode(idasistencia),
                        idpersonas: Ext.encode(idpersonas),
                        idcargos: Ext.encode(idcargos),
                        fdesde: Ext.encode(fdesde),
                        fhasta: Ext.encode(fhasta)
                    },
                    method: "POST",
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.msg == 1) {
                            mostrarMensaje(2, idioma.MsjPerAsist + '<ul>' + responseData.personasconasist + '</ul>' + '<ul>' + '¿Desea registrar la asistencia?' + '</ul>', function (btnPresionado) {
                                if (btnPresionado == 'ok') {
                                    scope.guardar();
                                }
                            });
                        }else{
                            scope.guardar();
                        }
                    }
                });
            }
        };

        this.guardar = function () {
            var idasistencia = new Array();
            var idpersonas = new Array();
            var idcausa = new Array();
            var fdesde = new Array();
            var fhasta = new Array();
            var hrsdescontadas = new Array();
            var horasextras = new Array();
            var personas = new Array();
            var persons = new Array();
            var personasSinDatos = new Array();
            var observacion = new Array();
            var otrodia1 = new Array();
            var certificadocontinuado = new Array();
            var turno = "";
            if (!Ext.isEmpty(vista.cbturno.getValue()))
                turno = modelo.storeTurnoTrabajo.getAt(modelo.storeTurnoTrabajo.find('idturnotrabajop', vista.cbturno.getValue())).data;

            if (scope.sesiones == '1') {
                var idcausaps = new Array();
                var idcausass = new Array();
                var horaentradaps = new Array();
                var horasalidaps = new Array();
                var horaentradass = new Array();
                var horasalidass = new Array();
            }
            else {
                var fechaentrada = new Array();
                var horaentrada = new Array();
                var fechasalida = new Array();
                var horasalida = new Array();
            }

            if (scope.stListadoPersonas.modified.length > 0) {
                Ext.each(scope.stListadoPersonas.modified, function (recs) {
                    idasistencia.push(recs.data.idasistencia);
                    idpersonas.push(recs.data.idpersona);
                    
                    if(recs.data.idcausa == -1){
                        idcausa.push(recs.data.idcausa);
                        hrsdescontadas.push(recs.data.hrsdescontadas);
                    }else{
                        idcausa.push(recs.data.idcausa);
                        hrsdescontadas.push(recs.data.hrsdescontadas);
                    }
                    fdesde.push(recs.data.fdesde);
                    fhasta.push(recs.data.fhasta);
                    hrsdescontadas.push(recs.data.hrsdescontadas);
                    horasextras.push(recs.data.horasextras);
                    observacion.push(recs.data.observacion);
                    otrodia1.push(recs.data.otrodia);
                    certificadocontinuado.push(recs.data.certificadocontinuado);

                    if (scope.sesiones == '1') {

                        idcausaps.push(recs.data.idcausaps);
                        idcausass.push(recs.data.idcausass);
                        horaentradaps.push(recs.data.fechahoraentradaps);
                        horasalidaps.push(recs.data.fechahorasalidaps);
                        horaentradass.push(recs.data.fechahoraentradass);
                        horasalidass.push(recs.data.fechahorasalidass);


                        if ((Ext.isEmpty(recs.data.fechahoraentradaps) && Ext.isEmpty(recs.data.idcausaps)) || (Ext.isEmpty(recs.data.fechahoraentradass) && Ext.isEmpty(recs.data.idcausass))) {
                            if (recs.data.presente == 1)
                                personasSinDatos.push(recs.data.nombreapellidos);
                        }

                        var causa;
                        modelo.storeCausasAusencia.each(function (r) {
                            if (r.data.idcausa == recs.data.idcausa) {
                                causa = r;
                                return false
                            }
                        });

                        //rango de fechas
                        if (!Ext.isEmpty(recs.data.idcausa)) {
                            if (Ext.isEmpty(recs.data.fdesde) || Ext.isEmpty(recs.data.fhasta)) {
                                personas.push(recs.data.nombreapellidos);
                            }
                        }
                        else {

                        }
                    }
                    else {
                        fechaentrada.push(recs.data.fechaentrada);
                        horaentrada.push(recs.data.fechahoraentrada);
                        fechasalida.push(recs.data.fechasalida);
                        horasalida.push(recs.data.fechahorasalida);

                        if (Ext.isEmpty(recs.data.fechahoraentrada) && Ext.isEmpty(recs.data.idcausa)) {
                            if (recs.data.presente == 1)
                                personasSinDatos.push(recs.data.nombreapellidos);
                        }

                        var causa;
                        modelo.storeCausasAusencia.each(function (r) {
                            if (r.data.idcausa == recs.data.idcausa) {
                                causa = r;
                                return false
                            }
                        });

                        if (!Ext.isEmpty(recs.data.idcausa)) {
                            if (recs.data.tieneentradasalida == 1 && recs.data.tieneperiodo == 1) {
                                if ((Ext.isEmpty(recs.data.fechahoraentrada) && Ext.isEmpty(recs.data.fdesde) && Ext.isEmpty(recs.data.fhasta)) ||
                                    ((Ext.isEmpty(recs.data.fdesde) || Ext.isEmpty(recs.data.fhasta)) && Ext.isEmpty(recs.data.fechahoraentrada))) {
                                    personas.push(recs.data.nombreapellidos);
                                }
                            }
                            else {
                                if (recs.data.tieneentradasalida == 1 && Ext.isEmpty(recs.data.fechahoraentrada)) {
                                    personas.push(recs.data.nombreapellidos);
                                }
                                if (recs.data.tieneperiodo == 1 && (Ext.isEmpty(recs.data.fdesde) || Ext.isEmpty(recs.data.fhasta))) {
                                    personas.push(recs.data.nombreapellidos);
                                }
                                if (!Ext.isEmpty(recs.data.fechaentrada) && !Ext.isEmpty(recs.data.fechasalida)) {
                                    if ((!Ext.isEmpty(recs.data.fechasalida) && (Ext.isEmpty(recs.data.fechahoraentrada) || Ext.isEmpty(recs.data.fechahorasalida))) ||
                                        (!Ext.isEmpty(recs.data.fechahorasalida) && (Ext.isEmpty(recs.data.fechasalida) || Ext.isEmpty(recs.data.fechahoraentrada)))
                                    ) {
                                        personas.push(recs.data.nombreapellidos);
                                    }
                                }

                            }
                        } else {
                            if (!Ext.isEmpty(recs.data.fechaentrada) && !Ext.isEmpty(recs.data.fechasalida)) {
                                if ((!Ext.isEmpty(recs.data.fechasalida) && (Ext.isEmpty(recs.data.fechahoraentrada) /*|| Ext.isEmpty(recs.data.fechahorasalida)*/)) ||
                                    (!Ext.isEmpty(recs.data.fechahorasalida) && (Ext.isEmpty(recs.data.fechasalida) || Ext.isEmpty(recs.data.fechahoraentrada)))
                                ) {
                                    personas.push(recs.data.nombreapellidos);
                                }
                            }

                            if (!Ext.isEmpty(recs.data.fechahoraentrada) && !Ext.isEmpty(recs.data.fechahorasalida)) {
                                var fhearr = recs.data.fechahoraentrada.split(":");
                                var fhsarr = recs.data.fechahorasalida.split(":");
                                if ((recs.data.fechasalida == recs.data.fechaentrada) || (Ext.isEmpty(recs.data.fechahoraentrada) && Ext.isEmpty(recs.data.fechahorasalida))) {
                                    if ((parseInt(fhearr[0]) == parseInt(fhsarr[0]) && parseInt(fhearr[1]) > parseInt(fhsarr[1])) ||
                                        (parseInt(fhearr[0]) > parseInt(fhsarr[0])))
                                        persons.push(recs.data.nombreapellidos);
                                }
                            }


                        }
                    }

                });
                if (persons.length == 0) {
                    if (personasSinDatos.length == 0) {
                        if (personas.length == 0) {

                            PVD.mostrarMascara('mascaraEnviarDatos', 'Información', idioma.MaskEnviarDatos);
                            Ext.Ajax.request({
                                url: 'guardarasistencia',
                                method: 'POST',
                                params: {
                                    idasistencia: Ext.encode(idasistencia),
                                    idpersonas: Ext.encode(idpersonas),
                                    fechaentrada: Ext.encode(fechaentrada),
                                    horaentrada: Ext.encode(horaentrada),
                                    fechasalida: Ext.encode(fechasalida),
                                    horasalida: Ext.encode(horasalida),
                                    fdesde: Ext.encode(fdesde),
                                    idcausa: Ext.encode(idcausa),
                                    fhasta: Ext.encode(fhasta),
                                    hrsdescontadas: Ext.encode(hrsdescontadas),
                                    horasextras: Ext.encode(horasextras),
                                    observacion: Ext.encode(observacion),
                                    idcausaps: Ext.encode(idcausaps),
                                    idcausass: Ext.encode(idcausass),
                                    horaentradaps: Ext.encode(horaentradaps),
                                    horasalidaps: Ext.encode(horasalidaps),
                                    horaentradass: Ext.encode(horaentradass),
                                    horasalidass: Ext.encode(horasalidass),
                                    fecharegistro: vista.fechaBuscar.getRawValue(),
                                    otrodia: Ext.encode(otrodia1),
                                    fechat: Ext.encode(turno.fecha),
                                    idgrupodescanso: Ext.encode(turno.idgrupodescanso),
                                    idturnotrabajo: Ext.encode(turno.idturnotrabajo),
                                    certificadocontinuado: Ext.encode(certificadocontinuado)
                                },
                                callback: function (options, success, response) {
                                    //PVD.ocultarMascara('mascaraEnviarDatos');
                                    var responseData = Ext.decode(response.responseText);

                                    if (responseData.cod == 10) {
                                        mostrarMensaje(3, idioma.MsgPerosnasConDatos + ' ' + responseData.datos);
                                        //scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                    }
                                    else {
                                        if (responseData.msg == 3) {
                                            mostrarMensaje(1, idioma.MsjNoSubVac + '<ul>' + responseData.personas + '</ul>');
                                            //scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                        }
                                        if (responseData.cod == 1) {
                                            mostrarMensaje(1, idioma.MsgGuardarSatisfactorio);
                                            //scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                        }
                                        if (responseData.msg == 2) {
                                            mostrarMensaje(1, 'Para ' + responseData.personassindiascausa +
                                                ' la cantidad de incidencias de la causa ' + responseData.causa + ' exede el máximo permitido para el período.');
                                            //scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                        }
                                    }
                                    //scope.createListado();
                                    scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                    vista.btnCertificar.disable();
                                    vista.btnEliminar.disable();
                                    vista.btnCausas.disable();
                                    PVD.ocultarMascara('mascaraEnviarDatos');
                                }
                            });
                        }
                        else {
                            mostrarMensaje(3, idioma.MsgFaltanDatosPeriodo + personas.join(', '));
                        }
                    }
                    else {
                        mostrarMensaje(3, idioma.MsgPersonasSinDatos + personasSinDatos.join(', '));
                    }
                } else {
                    mostrarMensaje(3, idioma.MsgErrorHoras + persons.join(', ') + idioma.MsgErrorHoras2);
                }
            }
            else {
                mostrarMensaje(3, idioma.MsgLLenarDatosAsistencia);
            }
        }

        vista.fechaBuscar.on('setValue', function (th, gv, v) {
            if (formatDate(gv.dateFormat('d/m/Y')) != formatDate(v.dateFormat('d/m/Y'))) {
                modelo.storeTurnoTrabajo.removeAll();
                vista.cbturno.reset();
                vista.Maskara.show();
                modelo.storeTurnoTrabajo.load({
                    params: {fecha: v.dateFormat('d/m/Y')},
                    callback: function (r, opt, succ) {
                        if (r.length == 0) {
                            vista.cbturno.setValue('');
                            fechat = '';
                            idgrupodescanso = '';
                            idturnotrabajo = '';
                        } else {
                            //vista.cbturno.setValue(r[0].data.idturnotrabajop);
                            fechat = r[0].data.fecha;
                            idgrupodescanso = r[0].data.idgrupodescanso;
                            idturnotrabajo = r[0].data.idturnotrabajo;
                        }
                        Ext.Ajax.request({
                            url: 'getpersonasasistencia',
                            params: {
                                fecha: v.dateFormat('d/m/Y'),
                                //fechat:fechat,
                                //idgrupodescanso: idgrupodescanso,
                                //idturnotrabajo: idturnotrabajo
                            },
                            method: "POST",
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                scope.sesiones = responseData.sesiones;
                                scope.otrodia = responseData.otrodia;
                                if (scope.otrodia == 1) {
                                    scope.ListadoPersonas.getColumnModel().setHidden(5, false);
                                    scope.ListadoPersonas.getColumnModel().setHidden(7, false);
                                } else {
                                    scope.ListadoPersonas.getColumnModel().setHidden(5, true);
                                    scope.ListadoPersonas.getColumnModel().setHidden(7, true);
                                }
                                scope.stListadoPersonas.removeAll();
                                scope.stListadoPersonas.loadData({
                                    datos: responseData.datos
                                }, true);
                                vista.desde.setMinValue(v.dateFormat('d/m/Y'));
                                vista.hasta.setMinValue(v.dateFormat('d/m/Y'));
                                vista.desde.setMaxValue(v.dateFormat('d/m/Y'));
                                vista.Maskara.hide();
                            }
                        });
                    }
                });

            }
        });

        function formatDate(date) {
            var explodeDate = date.split('/');
            return parseInt(explodeDate[2] + explodeDate[1] + explodeDate[0]);
        }

        vista.btnResumen.on('click', function () {
            vista.Maskara.show();
            vista.winResumen.show();
            vista.winResumen.maximize();
            ActualizarResumen(perfil.idestructuracomun);
        });

        vista.btnActualizar.on('click', function () {
            this.actualizar();
        }, this);

        this.actualizar = function () {
            if (scope.tipocontrolacceso == 2) {
                var mensaje = idioma.lbTitMsgSeguroActualizarTempus;
            } else if (scope.tipocontrolacceso == 1) {
                var mensaje = idioma.lbTitMsgSeguroActualizar;
            } else {
                var mensaje = idioma.lbTitMsgSeguroActualizarReloj;
            }
            mostrarMensaje(2, mensaje, function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgActualizando);
                    var idspersonas = new Array();
                    var datos = new Array();
                    var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
                    if (seleccionados.length > 0) {
                        Ext.each(scope.ListadoPersonas.getSelectionModel().getSelections(), function (rec) {
                            idspersonas.push(rec.data.idpersona);
                            datos.push(rec.data);
                        });
                    } else {
                        Ext.each(scope.stListadoPersonas.getRange(), function (rec) {
                            idspersonas.push(rec.data.idpersona);
                            datos.push(rec.data);
                        });
                    }
                    Ext.Ajax.request({
                        url: 'actualizardatos',
                        params: {fechacontrol: vista.fechaBuscar.getRawValue(), idspersonas: Ext.encode(idspersonas), datos: Ext.encode(datos)},
                        method: "POST",
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            Ext.getBody().unmask();
                            var fecha = vista.fechaBuscar.getRawValue();
                            if (responseData.cod == 2) {
                                mostrarMensaje(1, idioma.MsjNoDatosCA + vista.fechaBuscar.getRawValue());
                            } else if (responseData.cod == 3) {
                                mostrarMensaje(1, idioma.MsjNoCargo);
                            } else if (responseData.cod == 4) {
                                mostrarMensaje(1, idioma.MsjSinCnx);
                            } else if (responseData.cod == 5) {
                                mostrarMensaje(1, idioma.MsjSinCnxTempus);
                            } else
                                mostrarMensaje(1, idioma.MsjActualizado);
                        },
                        success: function () {
                            // scope.createListado();
                            scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                            vista.btnCertificar.disable();
                            vista.btnEliminar.disable();
                            vista.btnCausas.disable();
                        }
                    });
                    //Ext.getBody().unmask();
                }
            });
        }

        function ActualizarResumen(estructura) {
            modelo.stListadoResumen.removeAll();
            modelo.stListadoResumen.baseParams.fecha = vista.fechaBuscar.getRawValue();
            modelo.stListadoResumen.baseParams.idestructura = estructura;
            modelo.stListadoResumen.load({
                params: {start: 0, limit: 15}, callback: function (rec, opt, suc) {
                }
            });
        }

        modelo.stListadoResumen.on('beforeload', function (th, opt) {
            scope.limite = opt.params.limit;
        });

        modelo.stListadoResumen.on('load', function (st, recs, opt) {
            if (recs.length > 0) {
                vista.Maskara.hide();
                vista.graficaResumen.chartType = 'column';
                vista.graficaResumen.chartDatas = modelo.stListadoResumen.reader.jsonData.resumen;
                vista.graficaResumen.chartTitle = 'Resumen de la asistencia'
                vista.graficaResumen.chartDataElement = 'Cantidad de personas'
                vista.graficaResumen.renderChart();
                vista.ListadoResumen.enable();
                vista.graficaResumen.enable();
            }
            else {
                vista.Maskara.hide();
                mostrarMensaje(1, idioma.MsgConfigEstructuraAsist);
                vista.graficaResumen.chartType = 'column';
                vista.graficaResumen.chartDatas = [{name: 'Cantidad', data: [['No exiten datos.', 0]]}];
                vista.graficaResumen.chartTitle = 'Resumen de la asistencia'
                vista.graficaResumen.chartDataElement = 'Cantidad de personas'
                vista.graficaResumen.renderChart();
                mostrarMensaje(1, idioma.MsgNoDataAsistencia);
                vista.ListadoResumen.disable();
                vista.graficaResumen.disable();
            }
        });

        // vista.btnCertificar.menu.items.items[0].setHandler(function () {
        vista.btnCertificar.setHandler(function () {
            Ext.getBody().mask(idioma.lbTitMsgCertificando);
            var idspersonas = new Array();
            var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(scope.ListadoPersonas.getSelectionModel().getSelections(), function (rec) {
                    idspersonas.push(rec.data.idpersona);
                });
            } else {
                Ext.each(scope.stListadoPersonas.getRange(), function (rec) {
                    idspersonas.push(rec.data.idpersona);
                });
            }
            Ext.getBody().unmask();
            if (idspersonas.length > 0) {
                Ext.Ajax.request({
                    url: 'certificar',
                    params: {fechacontrol: vista.fechaBuscar.getRawValue(), idspersonas: Ext.encode(idspersonas)},
                    method: "POST",
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        Ext.getBody().unmask();
                        if (responseData.cod == 4)
                            mostrarMensaje(1, idioma.MsjPersonasNoCert + responseData.persnocert.join(', ') + ' .');
                        else if (responseData.cod == 3)
                            mostrarMensaje(1, 'La asistencia de la(s) persona(s) seleccionada(s) ya está(n) certificada(s).');
                        else if (responseData.cod == 1) {
                            mostrarMensaje(1, idioma.MsjCertificadaok);
                        }
                    },
                    success: function () {
                        scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                        vista.btnCertificar.disable();
                        vista.btnEliminar.disable();
                        vista.btnCausas.disable();
                    }
                });
            } else {
                Ext.getBody().unmask();
                mostrarMensaje(1, idioma.MsjNosepuedeCertificar);
            }
        });

        /* vista.btnCertificar.menu.items.items[1].setHandler(function () {
         Ext.getBody().mask(idioma.lbbtnQuitarCertificacion);
         var idasistencia = new Array();
         var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
         if (seleccionados.length > 0) {
         Ext.each(scope.ListadoPersonas.getSelectionModel().getSelections(), function (rec) {
         idasistencia.push(rec.data.idasistencia);
         });
         } else {
         Ext.each(scope.stListadoPersonas.getRange(), function (rec) {
         idasistencia.push(rec.data.idasistencia);
         });
         }
         if (idasistencia.length > 0) {
         Ext.Ajax.request({
         url: 'quitarcertificacion',
         params: {fechacontrol: vista.fechaBuscar.getRawValue(), idasistencia: Ext.encode(idasistencia)},
         method: "POST",
         callback: function (options, success, response) {
         var responseData = Ext.decode(response.responseText);
         Ext.getBody().unmask();
         if (responseData.cod == 1)
         mostrarMensaje(1, idioma.MsjQuitarCertok);
         },
         success: function () {
         scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
         vista.btnCertificar.disable();
         vista.btnEliminar.disable();
         }
         });
         } else {
         Ext.getBody().unmask();
         mostrarMensaje(1, idioma.MsjNosepuedeQuitarCertificar);
         }

         });*/

        vista.btnEliminar.on('click', function () {
            mostrarMensaje(2, '&iquest;Est&aacute; seguro que desea eliminar la asistencia de la(s) persona(s)?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando la asistencia de la(s) persona(s) en el d&iacute;a...');
                    var idasistencia = new Array();
                    var seleccionados = scope.ListadoPersonas.getSelectionModel().getSelections();
                    if (seleccionados.length > 0) {
                        Ext.each(scope.ListadoPersonas.getSelectionModel().getSelections(), function (rec) {
                            idasistencia.push(rec.data.idasistencia);
                        });
                    } else {
                        Ext.each(scope.stListadoPersonas.getRange(), function (rec) {
                            idasistencia.push(rec.data.idasistencia);
                        });
                    }
                    if (idasistencia.length > 0) {
                        Ext.Ajax.request({
                            url: 'eliminarasistencia',
                            params: {
                                fechacontrol: vista.fechaBuscar.getRawValue(),
                                idasistencia: Ext.encode(idasistencia)
                            },
                            method: "POST",
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                Ext.getBody().unmask();
                                if (responseData.cod == 1)
                                    mostrarMensaje(1, 'La asistencia de la(s) persona(s) ha sido eliminada satisfactoriamente.');
                            },
                            success: function () {
                                vista.btnCertificar.disable();
                                vista.btnEliminar.disable();
                                vista.btnCausas.disable();
                                scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                modelo.storeMultiplesCausas.load({params: {idpersona: scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,fecha: vista.fechaBuscar.getRawValue()}});
                                vista.panelcausas.collapse();
                            }
                        });
                    } else {
                        Ext.getBody().unmask();
                        //mostrarMensaje(1, 'La asistencia no pudo ser eliminada');
                    }
                }
            });
        });

        this.createListado = function () {
            var turno = -1;
            if (!Ext.isEmpty(vista.cbturno.getValue()))
                var turno = modelo.storeTurnoTrabajo.getAt(modelo.storeTurnoTrabajo.find('idturnotrabajop', vista.cbturno.getValue())).data;
            vista.Maskara.show();
            Ext.Ajax.request({
                url: 'getpersonasasistencia',
                params: {
                    fecha: vista.fechaBuscar.getRawValue(),
                    fechat: (turno != -1) ? turno.fecha : -1,
                    idgrupodescanso: turno.idgrupodescanso,
                    idturnotrabajo: turno.idturnotrabajo
                },
                method: "POST",
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    scope.sesiones = responseData.sesiones;
                    scope.otrodia = responseData.otrodia;
                    if (scope.otrodia == 1) {
                        scope.ListadoPersonas.getColumnModel().setHidden(5, false);
                        scope.ListadoPersonas.getColumnModel().setHidden(7, false);
                    } else {
                        scope.ListadoPersonas.getColumnModel().setHidden(5, true);
                        scope.ListadoPersonas.getColumnModel().setHidden(7, true);
                    }

                    scope.stListadoPersonas.removeAll();
                    scope.stListadoPersonas.loadData({
                        datos: responseData.datos
                    }, true);
                    vista.Maskara.hide();
                }
            });
        }

        /* vista.btnCancelarCertCont.on('click', function () {
         vista.ventanaCertCont.hide();
         }, this);

         Ext.getCmp("no").on('check', function (chek, checked) {
         if (checked == true) {
         Ext.getCmp("si").setValue(false);
         }
         });

         Ext.getCmp("si").on('check', function (chek, checked) {
         if (checked == true) {
         Ext.getCmp("no").setValue(false);
         }
         });*/

        /*Multiples causas*/

        Ext.Ajax.request({
            url: 'existeMultiplescausas',
            method:'POST',
            scope: this,
            callback: function() {
            },
            success: function (r) {
                var responseData = Ext.decode(r.responseText);
                if(responseData == 1){
                    vista.btnCausas.show();
                    vista.panelcausas.show();



                    this.accion = 'ADD';

                    // vista.ventanamc.on('beforeshow',function(){
                    //     vista.formulariomc.getForm().reset();
                    // });

                    vista.btnCausas.on('click', function () {
                        modelo.storeMultiplesCausas.load({params: {idpersona: this.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,fecha: vista.fechaBuscar.getRawValue()}});
                        vista.panelcausas.expand();
                    }, this);

                    vista.btnAdicionarCausa.on('click',function(){
                        if(this.ListadoPersonas.getSelectionModel().getCount()>0){
                            var record = this.ListadoPersonas.getSelectionModel().getSelected();
                        
                            // modelo.crearStoreHoras.load({
                            //     params: {
                            //         id: record.data.idpersona,
                            //         horainicio: record.json.horainicio,
                            //         horafin: record.json.horafin,
                            //     }
                            // });

                            
                            var vistaAddModCausa = new Pvd.ControlAsistencia.Asistencia.AdicionarModMultiCausal(
                                idioma, 
                                modelo, 
                                vista.fechaBuscar.getValue()
                            );

                            vistaAddModCausa.loadDataInicial(
                                'ADD',
                                record,
                                vista.fechaBuscar.getValue()
                            );

                            vistaAddModCausa.on({
                                scope: this,
                                aceptar: function (fechaBuscar) {
                                    vistaAddModCausa.close();
                                    // this.stListadoPersonas.load({params: {fecha: fechaBuscar}});
                                    // vista.panelcausas.collapse();
                                },
                                destroy: function () {
                                    this.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                    vista.panelcausas.collapse();
                                }
                            });
    
                            // getMultiplesCausas();
                        }else{
                            mostrarMensaje(3,'Debe seleccionar una persona para poder realizar esta acción');
                        }  
                    },this);

                    vista.btnModificarCausa.on('click',function() {
                        var record = this.ListadoPersonas.getSelectionModel().getSelected();
                        
                        var vistaAddModCausa = new Pvd.ControlAsistencia.Asistencia.AdicionarModMultiCausal(idioma, modelo, vista.fechaBuscar.getValue());

                        vistaAddModCausa.loadDataInicial(
                            'UPD',
                            record,
                            vista.fechaBuscar.getValue(),
                            vista.smgridlistadoCausas.getSelected()
                        );

                        vistaAddModCausa.on({
                            scope: this,
                            aceptar: function (fechaBuscar) {
                                vistaAddModCausa.close();
                                this.stListadoPersonas.load({params: {fecha: fechaBuscar}});
                                vista.panelcausas.collapse();
                            }
                        });
                        return;

                        this.accion = 'UPD';
                        vista.ventanamc.setTitle('Modificar causa');
                        vista.btnAplicar.hide();
                        vista.ventanamc.show();
                        console.log(vista.smgridlistadoCausas.getSelected());
                        // vista.causasausenciamc.setValue('');
                        // vista.causasausenciamc.valueNotFoundText = '';      
                        vista.causasausenciamc.limpiarValor();

                        vista.formulariomc.getForm().reset();
                        // vista.formulariomc.getForm().loadRecord(vista.smgridlistadoCausas.getSelected());
                        vista.formulariomc.getForm().setValues({
                            idcausa: vista.smgridlistadoCausas.getSelected().get('idcausa'),
                            denomcausa: vista.smgridlistadoCausas.getSelected().json.denomcausa,
                            horaentradamc: vista.smgridlistadoCausas.getSelected().json.horaentradamc,
                            horasalidamc: vista.smgridlistadoCausas.getSelected().json.fechasalida_format,
                        });
                        vista.observacionmc.setValue(vista.smgridlistadoCausas.getSelected().get('observaciones'));

                        // vista.causasausenciamc.setValue(vista.smgridlistadoCausas.getSelected().get('idcausa'));
                        // vista.causasausenciamc.setRawValue(vista.smgridlistadoCausas.getSelected().json.denomcausa);
                        // vista.horaentradamc.setValueByFecha(vista.smgridlistadoCausas.getSelected().json.fechaentrada_format);
                        // vista.horasalidamc.setValueByFecha(vista.smgridlistadoCausas.getSelected().json.fechasalida_format);
                    },this);
                    vista.btnEliminarCausa.on('click',function(){
                        mostrarMensaje(2,'¿Está seguro que desea eliminar la causa seleccionada?',function(btn){
                            if(btn == 'ok')
                            {
                                Eliminar();
                            }
                        })
                    });

                    vista.smgridlistadoCausas.on('selectionchange',function(){
                        if(vista.smgridlistadoCausas.getCount()>0)
                        {
                            vista.btnModificarCausa.enable();
                            vista.btnEliminarCausa.enable();
                        }
                        else
                        {
                            vista.btnModificarCausa.disable();
                            vista.btnEliminarCausa.disable();
                        }
                    });

                    // vista.btnCancelar.on('click',function(){
                    //     vista.ventanamc.hide();
                    // });

                    // vista.btnAplicar.on('click', function() {
                    //     ADDUPD(this.accion, 'APLIC');
                    
                    //     vista.causasausenciamc.setValue('');
                    //     vista.causasausenciamc.valueNotFoundText = '';                  
                    //     //Ocultar la ventana después de aplicar
                    //     //vista.ventanamc.hide();
                    // },this);

                    // vista.btnAceptar.on('click',function(){
                    //     ADDUPD(this.accion,'ACEPT');
                    // },this);

                    function ADDUPD(accion, boton)
                    {
                        if(vista.formulariomc.getForm().isValid())
                        {
                            var idasistenciamultiplescausas = -1;
                            var url = 'adicionarMultiplesCausas';
                            if(accion == 'ADD')
                            {
                                idcausa = vista.causasausenciamc.getValue();
                                url = 'adicionarMultiplesCausas';
                                Ext.getBody().mask('Adicionar causa');
                            }
                            else
                            {
                                idasistenciamultiplescausas = vista.smgridlistadoCausas.getSelected().get('idasistenciamultiplescausas');
                                if(!isNaN(vista.causasausenciamc.getValue()))
                                    idcausa = vista.causasausenciamc.getValue();
                                else
                                    idcausa = vista.smgridlistadoCausas.getSelected().get('idcausa');
                                url = 'modificarMultiplesCausas';
                                Ext.getBody().mask('Modificar causa');
                            }
                            var hentrada=vista.horaentradamc.getValue()+':00';
                            var hsalida=vista.horasalidamc.getRawValue()+':00';

                            var inicioturno = scope.ListadoPersonas.getSelectionModel().getSelected().data.inicioturno;
                            var hfinturno = scope.ListadoPersonas.getSelectionModel().getSelected().data.hfinturno;

                            // var escogido = convertirHorasTextoASegundos(hentrada, hsalida);
                            // var dato = convertirHorasTextoASegundos(inicioturno, hfinturno);
                            var incorrecto = false;

                            // if (hfinturno <= inicioturno) {
                            //     if (
                            //         (hentrada >= inicioturno || hentrada <= hfinturno)
                            //         && (hsalida >= inicioturno || hsalida <= hfinturno)
                            //         && hentrada != hsalida
                            //     ) {
                            //         incorrecto = false;
                            //     }
                            // } else {
                            //     if (
                            //         hentrada >= inicioturno && hentrada <= hfinturno
                            //         && hsalida >= inicioturno && hsalida <= hfinturno
                            //         && hentrada < hsalida
                            //     ) {
                            //         incorrecto = false;
                            //     }
                            // }

                            if(scope.ListadoPersonas.getSelectionModel().getCount()>0){
                                if(incorrecto){
                                    Ext.getBody().unmask();
                                    mostrarMensaje(3,'Debe escoger un horario dentro del turno de trabajo de la persona (<b>'+scope.ListadoPersonas.getSelectionModel().getSelected().data.inicioturno+'--'+scope.ListadoPersonas.getSelectionModel().getSelected().data.hfinturno+').</b>');
                                }else{
                                Ext.Ajax.request({
                                    url: url,
                                    method:'POST',
                                    params: {
                                        idasistenciamultiplescausas:idasistenciamultiplescausas,
                                        idcausa:idcausa,
                                        denomcausa:vista.causasausenciamc.getRawValue(),
                                        idpersona:scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,
                                        fecharegistro: vista.fechaBuscar.getRawValue(),
                                        horaentrada:vista.horaentradamc.getValue(),
                                        horasalida:vista.horasalidamc.getRawValue(),
                                        // horasalidaOtroDia: convertirHorasTextoASegundos(hentrada, hsalida),
                                        observaciones: vista.observacionmc.getRawValue(),
                                        idasistencia: scope.ListadoPersonas.getSelectionModel().getSelected().data.idasistencia},
                                    callback: function (options,success,response){
                                        Ext.getBody().unmask();
                                        var responseData = Ext.decode(response.responseText);
                                       
                                                    if(responseData.cod == 1)
                                                {
                                                    if(boton == 'ACEPT')
                                                    {
                                                        vista.ventanamc.hide();
                                                    }
                                                    vista.formulariomc.getForm().reset();
                                                    if(accion == 'ADD')
                                                        mostrarMensaje(1,'La causa fue adicionada satisfactoriamente');
                                                    else
                                                        mostrarMensaje(1,'La causa fue modificada satisfactoriamente');
                                     
                                                    modelo.storeMultiplesCausas.load({params: {idpersona: scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona, fecha: vista.fechaBuscar.getRawValue()}});
                                                    console.log(scope.ListadoPersonas.getSelectionModel().getSelected());
                                                    
                                                    if(boton == 'ACEPT'){
                                                        scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                                        vista.panelcausas.collapse();
                                                    }
                                                    if(boton == 'APLIC'){
                                                        getMultiplesCausas();
                                                    }
                                                }else if (responseData.cod == 3) {
                                                    mostrarMensaje(3,'La causa que desea adicionar ya existe');
                                                } else if (responseData.cod == 4) {
                                                    mostrarMensaje(3,'No puede sobrepasar las horas de la jornada laboral.');
                                                } else if (responseData.cod == 5) {
                                                    mostrarMensaje(3,'No puede repetir la entrada y/o salida.');
                                                } else if (responseData.cod == 6) {
                                                    mostrarMensaje(3,'No puede solapar rangos.');
                                                }
                                    }
                                });
                                }
                            }else{
                                Ext.getBody().unmask();
                                vista.ventanamc.hide();
                                vista.formulariomc.getForm().reset();
                                vista.panelcausas.collapse();
                                mostrarMensaje(3,'Debe seleccionar una persona para poder realizar esta acción');
                            }

                        }
                    }

                    function getMultiplesCausas() {
                        Ext.Ajax.request({
                            url: 'getMultiplesCausas',
                            method: 'POST',
                            params: {
                                idpersona: scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,
                                fecha: vista.fechaBuscar.getRawValue()
                            },
                            callback: function(options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                console.log(scope.ListadoPersonas.getSelectionModel().getSelected());
                                var recordData = scope.ListadoPersonas.getSelectionModel().getSelected().json;

                                var horainicio = recordData.horainicio;
                                var horafin = recordData.horafin;

                                var time = horainicio.split(':').map(Number);
                                var fechaBuscar = vista.fechaBuscar.getValue();

                                var combinedDateInicio = new Date(
                                    fechaBuscar.getFullYear(),
                                    fechaBuscar.getMonth(),
                                    fechaBuscar.getDate(),
                                    time[0],
                                    time[1],
                                    time[2]
                                );

                                var time = horafin.split(':').map(Number);
                                var fechaBuscar = vista.fechaBuscar.getValue();

                                var combinedDateFin = new Date(
                                    fechaBuscar.getFullYear(),
                                    fechaBuscar.getMonth(),
                                    fechaBuscar.getDate() + recordData.otrodia,
                                    time[0],
                                    time[1],
                                    time[2]
                                );

                                vista.horaentradamc.actualizarMinMaxValue(combinedDateInicio, combinedDateFin);
                                vista.horasalidamc.actualizarMinMaxValue(combinedDateInicio, combinedDateFin);

                                this.accion = 'ADD';
                                vista.ventanamc.setTitle('Adicionar causa');
                                vista.btnAplicar.show();
                                vista.formulariomc.getForm().reset();
                                vista.horaentradamc.setValue('');
                                vista.causasausenciamc.setValue('');
                                vista.causasausenciamc.valueNotFoundText = '';
                                vista.horaentradamc.enable();
                                vista.ventanamc.show();
                                if (responseData.cont == 0) {
                                } else{
                                    for (let index = 0; index < responseData.datos.length; index++) {
                                        const element = responseData.datos[index];
                                        var [fechaParte, horaParte] = element.fechaentrada.split(' ');

                                        var [dia, mes, año] = fechaParte.split('/');

                                        var [hora, minuto] = horaParte.split(':');

                                        var nuevaFecha1 = `${año}-${mes}-${dia} ${hora}:${minuto}`;

                                        var [fechaParte, horaParte] = element.fechasalida.split(' ');

                                        var [dia, mes, año] = fechaParte.split('/');

                                        var [hora, minuto] = horaParte.split(':');

                                        var nuevaFecha2 = `${año}-${mes}-${dia} ${hora}:${minuto}`;
                                        
                                        vista.horaentradamc.removeDataByInicioFin(nuevaFecha1, nuevaFecha2);
                                        vista.horasalidamc.removeDataByInicioFin(nuevaFecha1, nuevaFecha2);
                                    }
                                }
                            }
                        });
                    }

                    function Eliminar()
                    {
                        Ext.getBody().mask('Eliminando la causa seleccionada...');
                        Ext.Ajax.request({
                            url: 'eliminarMultiplesCausas',
                            method:'POST',
                            scope: this,
                            params: {idasistenciamultiplescausas:vista.smgridlistadoCausas.getSelected().get('idasistenciamultiplescausas'),
                                    idasistencia: scope.ListadoPersonas.getSelectionModel().getSelected().data.idasistencia,
                                    idpersona:scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,
                                    fecharegistro: vista.fechaBuscar.getRawValue()},
                            callback: function() {
                                Ext.getBody().unmask();
                            },
                            success: function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if (responseData.codMsg == 1)
                                    mostrarMensaje(1, 'La causa fue eliminada satisfactoriamente');
                                modelo.storeMultiplesCausas.load({params: {idpersona: scope.ListadoPersonas.getSelectionModel().getSelected().data.idpersona,fecha: vista.fechaBuscar.getRawValue()}});
                                scope.stListadoPersonas.load({params: {fecha: vista.fechaBuscar.getRawValue()}});
                                vista.panelcausas.collapse();
                            }
                        });
                    }

                }else{
                    vista.btnCausas.hide();
                    vista.panelcausas.hide();
                }
            }
        });

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'blg',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 66: { //b para buscar
                        buscarpersona();
                        break;
                    }
                    case 76: { //l para limpiar
                        vista.tfbuscar.reset();
                        // scope.stListadoPersonas.load({params:{fecha:vista.fechaBuscar.getRawValue()}});
                        scope.createListado();
                        scope.btnCertificar.disable();
                        scope.btnEliminar.disable();
                        scope.btnCausas.disable();
                        break;
                    }
                    case 71: { //g para guardar
                        scope.guardar();
                        break;
                    }
                }
            }
        }, {
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'zu',
            handler: function (k, e) {
                switch (k) {
                    case 90: { //z para actualizar
                        scope.actualizar();
                        break;
                    }
                    case 85: { //u para resumen
                        //vista.Maskara.show();
                        vista.winResumen.show();
                        vista.winResumen.maximize();
                        ActualizarResumen(perfil.idestructuracomun);
                        break;
                    }
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                buscarpersona();
            }
        }]);

    }

};

function convertirHorasTextoASegundos(horaTxtInicio, horaTxtFin) {
    const [h1, m1, s1] = horaTxtInicio.split(':').map(Number);
    const segundosInicio = h1 * 3600 + m1 * 60 + s1;

    const [h2, m2, s2] = horaTxtFin.split(':').map(Number);
    let segundosFin = h2 * 3600 + m2 * 60 + s2;

    if (segundosFin <= segundosInicio) {
        segundosFin += 24 * 3600;
    }

    const horas = Math.floor(segundosFin / 3600);
    const minutos = Math.floor((segundosFin % 3600) / 60);
    const segundos = segundosFin % 60;

    return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0');
}