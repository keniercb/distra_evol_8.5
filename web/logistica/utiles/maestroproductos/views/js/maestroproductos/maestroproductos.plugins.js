Ext.ns('LOG.lb.maestroproductos');//
LOG.lb.maestroproductos.PluginEspecialidad = function (tipo, restringir) {
    function initComboEspecialidad(v, scope) {
        tipo = tipo || 2;
        tipo = 1;
        restringir = restringir || '';
        if (tipo == 1) {
            scope.dirURL = '/logistica/utiles/plugin/index.php/sistemasexternos/';
            scope.comboEspecialidad = new LOG.util.ComboBox({
                width: 200,
                url: scope.dirURL + 'cargarEspecialidad' + restringir,
                valueField: 'idespecialidad',
                displayField: 'denespecialidad'
            });
            scope.comboEspecialidad.store.on({
                'load': function (st, rd) {
                    var datos = rd[0].data;
                    var esta = false;
                    Ext.each(rd, function (rec) {
                        if (rec.data.idespecialidad == idEspecialidad) {
                            esta = true;
                            return;
                        }
                    });
                    if (!esta) {
                        idEspecialidad = datos.idespecialidad;
                    }
                    v.storePrincipal.initBaseParams.idEspecialidad = idEspecialidad;
                    scope.comboEspecialidad.setValue(idEspecialidad);
                }
            });
        } else {
            scope.comboEspecialidad = new LOG.util.TreeCombo({
                url: '/configuracion/especialidad/index.php/especialidad/cargararbol',
                valueField: 'idespecialidad',
                name: 'idespecialidad',
                selectOnlyLeaf: false,
                displayField: 'denespecialidad',
                allowBlank: false
            });
            scope.comboEspecialidad.tpDatos.getLoader().baseParams = {
                opcion: 1
            };
        }
        v.autoLoad = false;
        var tree = v.arbolProductos;
        scope.comboEspecialidad.fireEvent = scope.comboEspecialidad.fireEvent.createSequence(function (e, args) {
            if ('valuechange' == e) {
                if (tipo == 2) {
                    args = scope.comboEspecialidad.getValue();
                }
                if (String(v.idEspecialidad) !== String(args)) {
                    var params = v.getStorePrincipal().lastOptions ? v.getStorePrincipal().lastOptions.params : {};
                    params = params || {};
                    params.idEspecialidad = args;
                    if (v.activeView == 0) {
                        v.getStorePrincipal().baseParams = params;
                        v.getStorePrincipal().initBaseParams.idEspecialidad = args;
                        v.getStorePrincipal().load({params: params});
                        v.idEspecialidad = args;
                        if (tree) {
                            tree.getLoader().baseParams.idEspecialidad = args;
                            tree.getLoader().load(tree.getRootNode());
                            tree.getRootNode().expand();
                        }
                    } else {
                        if (v.treeGrid) {
                            v.treeGrid.getStore().baseParams.idEspecialidad = args;
                            v.treeGrid.getStore().load();
                        }
                    }
                }
            }
        });
    }

    return {
        init: function (v) {
            v.autoLoad = false;
            v.getPanelSuperior().onRender = v.getPanelSuperior().onRender.createSequence(function () {
                initComboEspecialidad(v, this);
                v.getPanelSuperior().add({
                    border: false,
                    tbar: ['-', '->', LOG.lb.maestroproductos.Idioma.lbEspecialidad, '', this.comboEspecialidad]
                });
                v.getPanelSuperior().doLayout();
            });
        }
    };
};
LOG.lb.maestroproductos.NivelPlan = function () {
    return {
        init: function (v) {
            if (planificacion) {
                v.insertToolbarButton(LOG.util.UIManager.createBtn({
                    iconCls: 'definir',
                    isContextual: true,
                    text: LOG.lb.maestroproductos.Idioma.lbNivelPlan,
                    tooltip: LOG.lb.maestroproductos.Idioma.ttNivelPlan,
                    controlFn: function (btn, vista) {
                        if (vista.grantedAction('RGESTI')) {
                            btn.setVisible(true);
                        } else {
                            btn.setVisible(false);
                        }
                        btn.disable();
                        vista.arbolProductos.getSelectionModel().fireEvent = vista.arbolProductos.getSelectionModel().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                btn.enable();
                                var node = vista.getElementoSeleccionado().nodo;
                                if (node.id != 0
                                    && node.attributes
                                    && node.attributes.activo == 0) {

                                    btn.disable();
                                }
                                if (node.id == 0) {
                                    btn.disable();
                                }
                            }
                        }, vista.arbolProductos);

                        vista.getSmPrincipal().fireEvent = vista.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'rowselect' && vista.getSmPrincipal().getSelected().data.estado == 1) {
                                if (vista.getSmPrincipal().getSelected().data.nivelplanif == 1) {
                                    btn.setText(LOG.lb.maestroproductos.Idioma.lbElimNivelPlan);
                                } else {
                                    btn.setText(LOG.lb.maestroproductos.Idioma.lbNivelPlan);
                                }
                                btn.enable();
                            }
                            if (e == 'rowdeselect') {
                                btn.setText(LOG.lb.maestroproductos.Idioma.lbNivelPlan);
                                btn.disable();
                            }
                        });
                    },
                    handler: function (vista) {
                        var tree = v.arbolProductos;
                        //var nodo = tree.getSelectedNode();
                        var nodo = tree.getSelectedNode() ? tree.getSelectedNode() : v.getElementoSeleccionado().nodo;
                        v.modelo.setNivelPlanificacion({
                            id: nodo.id != 0 ? nodo.id : false,
                            fn: function () {
                                v.getStorePrincipal().reload();
                            }
                        });
                    }
                }), v.listaBotones.count() - 2);
            }
        }
    }
}
LOG.lb.maestroproductos.ViewSwitcher = function () {
    function ventanaCambioVista() {
        var vista = this.view;
        var panelVistas = LOG.util.UIManager.initColumnForm({
            region: 'center',
            columnas: 2,
            frame: true
        });
        panelVistas.addComponent({
            html: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABBCAYAAADi8ZtAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAAHdElNRQfdCQgANibxwftHAAAExklEQVR4Xu2dbW8TRxDH//dsxy4hJBAitQmoqvqmVdsXlZD4BP3GfY+EqFqElFimxhVuDTFJ3TQmMdh39p07s/FGh30mNAbp9jKrrG9lnTez87vZp9vdsSYUkArHx8cYjUYqjsdjxHGsrkmSqDRf+Sc6WpZ1nk7nI+nlNMB61brVab7atg3HcdTVdV2V5qvnebBmYXa7XTz4rYGJfwP94RgWy8QfE/XxroTpr3T6f91LN6ssU/kuneenknXJfJUip0W9lK6y/r+FatnBt9tlVFaCeZidTgcHR31sbm0jTIDNVQ/Ju8a73CMnv15aA4xjJbDx4OkJ7myUEZ/uk2U68zDb7Ta6vQE2NrfxshdhreKqalRCvjTguxZqL4b45vMKot6fCHx3Hmar1cK/p5GC2fonJJgOwcxXQa66NIwjIJj1/SG+26li0G2SZWbAbDabOBkkuHFrG7XOANepThaW+Xt8fMfCHwdD3PtqFa87dfhZltloNNAPoWA+ab/FatkWy8wfS3gEs9UNcf/r6zh+sZcNs16vYzB2sE4wfz8gy1yhNlNsM3c4GWbzIMSPX17D38+fIAgyhia1Wo16sR7Wbn6Bn3dfo0K9Jgn504BNw5ujfoyfflhH9/njbMvc29tDNPFx6/YOEvrBKlumNJq5oxl4Nn5pnmLnZhkvn/2a3Zvd3d3FCAGNM3dQLlF1+5mXu4KIQGcaeNg4wdZaGX89fQSfxplzdageU7IxikHm+7HRfDQzaRDzzeuDpJtMzubLBeYHqcuMmxZWs2aIL1KmNSCWWZDnQarZgoDUxRDLLBBQgSkwC6SBAhVFLFNgFkgDBSqKWKbALJAGClQUscwiwJyuYxaYBsPUC9G5CBNanC4wDYapIca844CiwDQUpnqHSTGJaQsJbSUJ3/QFpqEsldhctSZj2hM0HCLqC0yTWTJOskza0MWbvMJQLNNkmqoDlMSY8O48itJmmkwzJbva7leQslz5Yli0X1NgFuEx4A3PVA6BWQSY0zIIzCLApI4Qb8YWmEWAKdN5BaE4LYaszjOc59kpJDYsPn2Eo+HlueLi09jSdeDQsTFuEAhMk58GNbZ0PXilAH61KjBNhclVLNWxVL26sD0fQUVgmsryXG62TodO6LI5LioNNa1wea+1hNxqQB/DxgK+dzqPT1erlqR/lFuSacGm5+wttkyaVegP6bw1CcZoYCFMnrgdxbIR3hiSF03ncYdJgjkakEbRHFYXSiowL1SROTcITHNYvVfSzGUjamZBgpEaEMs0Elu20AKzADDVa7Cs1XlSzZpH1542jXOWKTANg8nrf7R7jFnRBaZhMHmSfdHcLDs/0UHOmTUD7Lnjmllx2YMNBx6glHzpH+UZp3pFSX/a89CcxyHtPWGdXGE0D0P1GkwsNH9IaekP2uSq5Ps719Dbry/2a3J0EmJj6y4GUXzmPkpCLjWgPA+VXPRePVMnQc9ZJnscYidhjiPHeeeS4IxQ3CweHr6iA/f9bF9gURRBx7THPu2tjz31aW99nLe4l/o02PXIQnvn446O9s6nPfOx4THITJjspS+kXbgMbtb1Irtc5MjwGGYapAD9uEDTIDlnhsjfsSXqmAbK6blqVvxnflwol83tMv4z/wNufTnPufuBIwAAAABJRU5ErkJggg==">'
        });
        panelVistas.addComponent({
            html: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABBCAIAAABtkwwXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATcSURBVHhe7dx5c6JIFADw+f4fY7dqarf2yP41mxlHjYoHHniAKKIgHkHxAEUUNMnMmzCbXVxMMkJrVXxUV055TX55ttDS792Xx03TtKu/qT9i/E8f2J+JtffX3O+f679cc+S6OGPkP2N8S5SGw6FL+s79BN8zbKun2Y3herTYqoYTepsst/zA4vsrabQZzJwRgS5CP+ZXBpyZu5xodsdOS+x0u12PrKIopZogjzYZcckPrfog/NYYWoX2klNMrreq9VYkujhXzJZqRVi9rdpcvSGKokdWkiRX9oYzGGlZItDKspkTFiALX+TbCxJdnCdmZ1lVzA/MXLy1K9Uaz/Me2VarBbIddXOVn0VqeqRKpEVZne2a6aZxXZkT6uIsYWOc/mtmIqp2ocjUajWPbLPZdGX/yk+jNf0zmRb7R/ZTZU6uF0IH/0zYOKf/9iibowvlctkjW6/XQVZSN5DVVHORItAgbJI3WMWkxcUNb5Do4lwxs8Liip6KI5tKZ4vFokeWZdlv4yzIVuaUQEZWWCb5b+NsXlwmeIPQ/+8suDlxCc91eAVLptI0TXtkYXQA2e7YHkydtXO3ssNv9u6+PdrUe6vhzFmsdxaZXkgc+Ysxd3cPFWUlaU4iSeVyOY9stVoFWUWzZ6ud+wsSmzKxQVZbbOFQSMQ/Y8zGwOpOtvGbZDqd9shWKpUTyjpvVTYWT6BsyPnt5mw0FqcoCnM2TNyDsnAWhqNBEGmUDaL33L5PsqlUyjMaYM4GJEfZgIAHd0dZlCUlQCou5izKkhIgFRdzFmVJCZCK65OzD48bns8GJPeRvdvtHu7vGYYpVpunmkV8s3NdMCPz7zWYbVk7x2ZKJZQNkrY+Oaur6nqxKNJ0sdLojjcnmfm+jJwdNBuAS2cyhXIdZY9OW5+c7ZSKWlfOUVSeQdmjYb/4yIoFWm2L2UQiX+IwZ4+m9ZFtF/MoezTo047+owHKEpGVmNKo08bRICCuT86ibEBTd3ccDUJh9AmCr2AnlMWzrlCwD18ppFJ4pRCE2EcWr26DgD53PguTBpZh4IxMQF+fnMVZxICmB8+69me+zRPcP3sZs4h779boJO9M7k/sRh/uTL4MWTeZn94H290TvBtbN7eSao0NuLGeYC+hPLt/NMjL74qbm7sfDfr6x6u6IwwszXAuUXaK4+zrM+U/j3w5Z/F9sKNg/WZk9sZZlEXZ4wRI7YWjAXFZXFsTMjGuWgoZ9P8zMpizIRO7OeuzhvG0627f7NWtz7pbd6043ot4dCZDzsq+a8Xd+gYoG1A2maL26xu4NTlQNqAslc7s1+Rw68iA7NwiOz/L91ZQuOvtzcg0B2sYDXJ0fr+OjFv7SB5vhNsNzJ+OjfDbdLmFwajeM6Xx+nZuE+qFxJG/GHO+2ubbpjRyfGofufW6utq2M7LlMZEGpVSgupw0go9E4hM67NeEhT+trW6Uya5SZffrdUGNOY7jhFanie0oAaAT2zLLcvs15qAuoizLgiDASQKsBoEXOKjakUgk4vF4NBqNRCKfHrePF7+5DgACLIADRAAFXIAGdAAIjO7L4PeKk1DLs9/vw09hwIXzBLhwgIcWCgWo5JPNZmFn2OC6DTZYO3KxmyvgagAL4AARQAEXoAEdAAKjR/bosw3c8ZDA95xFoNAFvgLTQ9RyFqYfqgAAAABJRU5ErkJggg==">'
        });
        var cbUnaColumna, cbDosColumnas;
        panelVistas.addComponent(cbUnaColumna = new Ext.form.Radio({
            boxLabel: 'Una columna',
            name: 'vista',
            value: 1
        }));
        panelVistas.addComponent(cbDosColumnas = new Ext.form.Radio({
            boxLabel: 'Dos columnas',
            name: 'vista',
            value: 2
        }));
        panelVistas.init();
        var winVista = new LOG.util.Window({
            usarAplicar: false,
            vistaActual: 0,
            title: 'Cambiar vista',
            resizable: false,
            height: 200,
            width: 340,
            aceptarFn: function () {
                if (cbDosColumnas.getValue() == true && vista.activeView != 0) {
                    vista.activeView = 0;
                    vista.panelConetnido.getLayout().setActiveItem(0);
                    return;
                }
                if (cbUnaColumna.getValue() == true && vista.activeView != 1) {
                    vista.activeView = 1;
                    vista.panelConetnido.getLayout().setActiveItem(1);
                    return;
                }
            },
            listeners: {
                'show': function () {
                    if (vista.activeView == 1) {
                        cbUnaColumna.setValue(true);
                    } else if (vista.activeView == 0) {
                        cbDosColumnas.setValue(true);
                    }
                }
            },
            items: [panelVistas]
        });
        winVista.show();
    }

    return {
        init: function (v) {
            v.activeView = 0;
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'configuracion',
                text: LOG.util.Idioma.lbBtnConfiguracion,
                tooltip: LOG.lb.maestroproductos.Idioma.ttBtnConfiguracion,
                handler: ventanaCambioVista,
                view: v
            }), v.listaBotones.count() - 1);
        }
    };
}
LOG.lb.maestroproductos.WinGestIndicador = Ext.extend(LOG.util.Window, {
    width: 750,
    height: 580,
    record: null,
    nivelSurtido: false,
    nodo: null,
    tipo: 1,
    heightPanels: 255,
    resizable: false,
    adqquisicion: new Array(),
    idindic: null,
    constructor: function (config) {
        var _this = this;
        LOG.lb.maestroproductos.WinGestIndicador.superclass.constructor.call(this, config);
        this.listeners = {
            'afterlayout': function () {
                _this.treeView.getLoader().load(_this.treeView.getRootNode(), function () {
                    _this.treeView.getRootNode().expand();

                });
            }
        }
        this.initFields();
        this.buildWind();
    },
    initFields: function () {
        var _this = this;
        let isCimex = LOG.util.isVariableGlobalActiva('VG_ISCIMEX');

        if (isCimex) {
            var cbCodigoBarras = new LOG.lb.maestroproductos.CodigoBarras({
                idioma: this.idioma,
                allowBlank: false
            });
        } else {
            var cbCodigoBarras = new LOG.util.Prototipos.inputEntero({
                fieldLabel: this.idioma.lbCodigoBarras,
                name: 'codigobarra',
                maxLength: 20
            });
        }
        

        this.fields = {
            generales: {
                cbFormatoCodigo: new LOG.util.ComboBox({
                    url: 'cargarFormatos',
                    valueField: 'idformato',
                    name: 'idformato',
                    displayField: 'nombre',
                    autoSelect: true,
                    selectOnFocus: false,
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbFormato,
                    allowBlank: false,
                    isCombo: true
                }),
                txtCodigo: LOG.util.Prototipos.inputTexto({
                    name: 'codigo',
                    hideLabel: true,
                    allowBlank: false,
                    regex: LOG.util.Regex.digito,
                    maskRe: LOG.util.Regex.digito,
                    regexText: LOG.lb.maestroproductos.Idioma.msgCodigoIncorrecto,
                    disabled: true
                }),
                lbCodigo: new Ext.form.Label({
                    autoShow: true,
                    text: this.idioma.lbCodigo + ':',
                    style: 'font-size:12px;',
                    anchor: '95%',
                    disabled: true
                }),
                txtDenominacion: new Ext.form.TextArea({
                    name: 'denominacion',
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbDenom,
                    height: 70,
                    maxLength: 255,
                    regex: LOG.util.Regex.general,
                    regexText: LOG.lb.maestroproductos.Idioma.rgtDenominacion,
                    allowBlank: false
                }),
                cbUM: new LOG.util.ComboBox({
                    url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
                    valueField: 'idunidadmedida',
                    name: 'idumedida',
                    selectOnlyLeaf: true,
                    displayField: 'abreviaturaunidadmedida',
                    fieldLabel: 'Unidad de medida',
                    allowBlank: false,
                    resizable: true,
                    listWidth: 300
                }),
                cbNaturaleza: new LOG.util.TreeCombo({
                    url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
                    name: 'idnaturaleza',
                    selectOnlyLeaf: true,
                    fieldLabel: 'Naturaleza',
                    allowBlank: false,
                    resizable: true,
                    listWidth: 300

                }),
                cbProductora: new LOG.util.ComboBox({
                    fieldLabel: 'Fabricante',
                    url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
                    hiddenName: 'idfabricante',
                    valueField: 'idclientesproveedores',
                    name: 'fabricante',
                    displayField: 'nombre',
                    autoSelect: false,
                    allowBlank: true,
                    mode: 'remote',
                    pageSize: 10,
                    minChars: 0,
                    resizable: true,
                }),
                tfDescVenta: LOG.util.Prototipos.inputTexto({
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbDescVenta,
                    name: 'descripcionventa',
                    maxLength: 30,
                    allowBlank: true
                }),
                tfPrecio: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbPrecio,
                    name: 'precio',
                    maxLength: 17,
                    allowBlank: true
                }),
                cbPais: new LOG.util.ComboBox({
                    url: 'cargarPaises',
                    valueField: 'idpais',
                    autoLoad: true,
                    forceSelection: true,
                    name: 'idpais',
                    displayField: 'nombrepais',
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbPais,
                    allowBlank: true,
                    disabled: true,
                    isCombo: true,
                    resizable: true,
                    listWidth: 300
                }),
                cbTipo: new LOG.util.ComboBox({
                    name: 'tipo',
                    valueField: 'idtipo',
                    displayField: 'tipo',
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbTipo,
                    allowBlank: false,
                    resizable: true,
                    listWidth: 300,
                    store: new Ext.data.ArrayStore({
                        fields: ['idtipo', 'tipo'],
                        data: [
                            [1, LOG.lb.maestroproductos.Idioma.lbTipoProd],
                            [2, LOG.lb.maestroproductos.Idioma.lbTipoServ],
                            [3, LOG.lb.maestroproductos.Idioma.lbTipoConj]
                        ]
                    })
                }),
                fInicio: new Ext.form.DateField({
                    name: 'fechainicio',
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbInicio,
                    //minValue: new Date(),
                    endDateField: 'dffechafin',
                    id: 'dffechaini',
                    editable: false,
                    format: LOG.util.Idioma.lbFormatoFecha,
                    vtype: 'daterange'
                }),
                fFin: new Ext.form.DateField({
                    name: 'fechafin',
                    fieldLabel: LOG.lb.maestroproductos.Idioma.lbFin,
                    startDateField: 'dffechaini',
                    id: 'dffechafin',
                    editable: false,
                    format: LOG.util.Idioma.lbFormatoFecha,
                    vtype: 'daterange'
                }),
                htmlDescripcion: new Ext.form.TextArea({
                    name: 'descripcion',
                    height: this.heightPanels - 15
                })
            },
            plan: {
                cbCentro: new LOG.util.LovCombo({
                    url: 'cargarCentrosBalance',
                    name: 'idcentrobalance',
                    valueField: 'id',
                    autoLoad: true,
                    displayField: 'denominacion',
                    fieldLabel: this.idioma.lbCentro,
                    isCombo: true
                }),
                cbPlandirecto: new LOG.util.ComboBox({
                    url: 'cargarPlanes',
                    name: 'plandirecto',
                    valueField: 'idmodelo',
                    autoLoad: true,
                    displayField: 'denominacion',
                    fieldLabel: this.idioma.lbPlan,
                    isCombo: true
                }),
                /* cbVia: new LOG.util.LovComboNomenclador({
                 modelo: 'NomViaadquisicion',
                 idnom: 'idviaadquisicion',
                 autoLoad: true,
                 entidad: false,
                 controller: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/',
                 fieldLabel: this.idioma.lbVia,
                 isCombo: true
                 }),
                 cbOrgano: new LOG.util.LovComboNomenclador({
                 modelo: 'NomOrganosatisface',
                 idnom: 'idorganosatisface',
                 autoLoad: true,
                 entidad: false,
                 controller: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/',
                 fieldLabel: this.idioma.lbOrgano,
                 isCombo: true
                 }),*/
                nfFlete: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbFelete,
                    maxLength: 17,
                    name: 'flete'
                }),
                nfContingencia: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbContingencia,
                    maxLength: 17,
                    name: 'contingencia'
                }),
                nfPrecio: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbPreciov,
                    maxLength: 17,
                    name: 'precioventa'
                }),
                nfDivisa: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbPrecioDivisa,
                    maxLength: 17,
                    name: 'preciodivisa'
                }),
                //precio-planificacion new
                /*nfPrecioPlanif: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: 'precio',
                    //this.idioma.lbPrecioDivisa,
                    maxLength: 17,
                    name: 'precioplanif'
                }),*/
                nfCobertura: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbCobertura,
                    maxLength: 17,
                    name: 'cobertura'
                }),
                nfMargen: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbMargen,
                    maxLength: 17,
                    name: 'margencomercial'
                }),
                chBalance: new Ext.form.Checkbox({
                    name: 'balanceable',
                    boxLabel: this.idioma.lbIncBalance
                })
            },
            producto: {
                /*cbPresentacion: LOG.util.Prototipos.inputEntero({
                    fieldLabel: this.idioma.lbFormaPresentacion,
                    name: 'formapresentacion'
                }),*/
                cbCodigoBarras: cbCodigoBarras,
                cbControl: new LOG.util.ComboBox({
                    name: 'tipocontrol',
                    valueField: 'idforma',
                    displayField: 'forma',
                    descField: 'desc',
                    fieldLabel: this.idioma.lbFormaAlmacen,
                    store: new Ext.data.ArrayStore({
                        fields: ['idforma', 'forma', 'desc'],
                        data: [
                            [1, this.idioma.lbFormaNinguna, this.idioma.lbDesFormaNinguna],
                            [2, this.idioma.lbFormaLote, this.idioma.lbDesFormaLote],
                            [3, this.idioma.lbFormaSerie, this.idioma.lbDesFormaSerie],
                            [4, this.idioma.lbFormaPartidas, this.idioma.lbDesFormaPartidas],
                            [5, this.idioma.lbFormaTallas, this.idioma.lbDesFormaTallas],
                        ]
                    })
                }),
                tfNroPieza: LOG.util.Prototipos.inputTexto({
                    fieldLabel: this.idioma.lbNroPieza,
                    //disabled : true,
                    name: 'numeropieza',
                    maxLength: 50
                }),
                nfCodigoAuxiliar: LOG.util.Prototipos.inputTexto({
                    fieldLabel: this.idioma.lbCodigoAuxiliar,
                    name: 'codigoauxiliar',
                    maxLength: 50
                }),
                cbGrupo: new LOG.util.ComboBox({
                    url: '/logistica/utiles/maestroproductos/index.php/gestgruposubgrupo/cargarsubgrupos',
                    name: 'idgruposubgrupo',
                    valueField: 'idgruposubgrupo',
                    autoLoad: true,
                    autoSelect: false,
                    displayField: 'denominacionlarga',
                    descField: 'desc',
                    fieldLabel: 'Grupo',
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'remote',
                    minChars: 0,
                    listWidth: 300,
                    //pageSize: 20,
                    isCombo: true
                }),
                cbMarca: new LOG.util.ComboBox({
                    url: 'getMarcas',
                    name: 'idmarca',
                    valueField: 'idmarca',
                    displayField: 'denominacion',
                    autoLoad: true,
                    autoSelect: false,
                    descField: 'desc',
                    fieldLabel: 'Marca',
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'remote',
                    minChars: 0,
                    listWidth: 300,
                    pageSize: 30,
                    isCombo: true
                }),
                cbModelo: new LOG.util.ComboBox({
                    url: 'getModelos',
                    name: 'idmodelo',
                    autoLoad: true,
                    autoSelect: false,
                    valueField: 'idmodelo',
                    displayField: 'denominacion',
                    descField: 'desc',
                    fieldLabel: 'Modelo',
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'remote',
                    minChars: 0,
                    listWidth: 300,
                    pageSize: 30,
                    isCombo: true
                }),
                cbElementoGasto: new LOG.util.ComboBox({
                    url: 'obtenerElementos',
                    name: 'idelementogasto',
                    valueField: 'idelementoobjeto',
                    displayField: 'descripcion',
                    autoLoad: true,
                    autoSelect: false,
                    descField: 'desc',
                    fieldLabel: 'Elemento de gasto',
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'local',
                    minChars: 0,
                    listWidth: 300,
                    //pageSize: 20,
                    isCombo: true
                }),
                cbElementoGastoAlt: new LOG.util.ComboBox({
                    url: 'obtenerElementos',
                    name: 'idelementogastoalt',
                    valueField: 'idelementoobjeto',
                    displayField: 'descripcion',
                    autoLoad: true,
                    autoSelect: false,
                    descField: 'desc',
                    fieldLabel: 'Elemento de gasto alternativo',
                    selectOnFocus: true,
                    forceSelection: true,
                    mode: 'local',
                    minChars: 0,
                    listWidth: 300,
                    //pageSize: 20,
                    isCombo: true
                }),
                chExplotacion: new Ext.form.Checkbox({
                    name: 'explotacion',
                    boxLabel: this.idioma.lbDestExplot
                }),
                chAlmacen: new Ext.form.Checkbox({
                    name: 'almacenado',
                    boxLabel: this.idioma.lbDestAlm
                }),
                chUH: new Ext.form.Checkbox({
                    name: 'isuh',
                    boxLabel: this.idioma.lbDestUH
                })
            },
            dimensiones: {
                nfAncho: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbAncho,
                    maxLength: 13,
                    decimalPrecision: 2,
                    name: 'ancho'
                }),
                nfLargo: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbLargo,
                    maxLength: 13,
                    decimalPrecision: 2,
                    name: 'largo'
                }),
                nfAlto: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbAlto,
                    maxLength: 13,
                    decimalPrecision: 2,
                    name: 'alto'
                }),
                nfPeso: LOG.util.Prototipos.inputDecimal({
                    fieldLabel: this.idioma.lbPeso,
                    maxLength: 13,
                    decimalPrecision: 2,
                    name: 'peso'
                })
            }
        };
        this.fields.generales.cbFormatoCodigo.getStore().on({
            'load': function (st) {
                if (generarcodigo != true) {
                    Ext.each(st.data.items, function(format) {
                        if (format.data.idformato == _this.getData().idformato) {
                            Ext.each(format.json.partes, function(part) {
                                if (part.nivel == _this.getData().nivel-1){
                                    _this.longitudCodigoPadre = part.longitud;
                                }
                            });
                        }
                    });
                }
            }
        });
        this.fields.generales.cbFormatoCodigo.on({
            'change': function (cb, nv, ov) {
                if (nv != null) {
                    var rec = cb.getStore().getById(nv).json;
                    var dat = _this.getData();
                    if (_this.modo == 1) {
                        _this.fields.generales.cbUM.allowBlank = (dat.nivel == rec.partes.length - 1 || dat.nivel == rec.partes.length) ? false : true;
                    }
                    if (_this.modo == 2) {
                        _this.fields.generales.cbUM.allowBlank = (dat.nivel < rec.partes.length) ? true : false;
                    }
                    _this.fields.generales.lbCodigo.setText(_this.idioma.lbCodigo + _this.formatoCodigo(rec.partes, _this.getData()), false);
                }
            },
            'select': function (cb, rec, index) {
                var dat = _this.getData();
                if (_this.modo == 1) {
                    _this.fields.generales.cbUM.allowBlank = (dat.nivel == rec.json.partes.length - 1 || dat.nivel == rec.json.partes.length) ? false : true;
                }
                if (_this.modo == 2) {
                    _this.fields.generales.cbUM.allowBlank = (dat.nivel < rec.json.partes.length) ? true : false;
                }
                _this.fields.generales.lbCodigo.setText(_this.idioma.lbCodigo + _this.formatoCodigo(rec.json.partes, dat), false);
            }
        });
        this.fields.producto.cbMarca.on({
            'change': function (cb, nv, ov) {
                var rec = cb.getStore().getById(nv).json;
                _this.fields.producto.cbModelo.getStore().baseParams.idmarca = nv;
                _this.fields.producto.cbModelo.setValue(null);
                _this.fields.producto.cbModelo.getStore().load({
                    params: {
                        idmarca: nv
                    }
                });
            }
        })
        this.fields.producto.cbModelo.getStore().on({
            'beforeload': function (cb, nv, ov) {
                _this.fields.producto.cbModelo.getStore().baseParams.idmarca = _this.fields.producto.cbMarca.getValue();
            }
        })
        LOG.util.UIManager.encadenaFn(this.fields.generales.cbFormatoCodigo.getStore(), 'fireEvent', function (e) {
            if (e == 'load') {
                if (_this.fields.generales.cbFormatoCodigo.getStore().getCount() > 0) {
                    _this.setLoadInfo();
                    _this.cortarCodigo();
                }
            }
        }, 'cortar');
    },
    buildWind: function () {
        var pCodigo = new LOG.util.ColumnForm({
            columnas: 1
        });
        pCodigo.addComponent(this.fields.generales.cbFormatoCodigo);
        pCodigo.addComponent(this.fields.generales.lbCodigo);
        pCodigo.addComponent(this.fields.generales.txtCodigo);
        var pDenom = new LOG.util.ColumnForm({
            columnas: 1
        });
        pDenom.addComponent(this.fields.generales.txtDenominacion);
        pDenom.init();
        pCodigo.init();
        var panelSuperior = new LOG.util.ColumnForm({});
        panelSuperior.addComponent(pCodigo);
        panelSuperior.addComponent(pDenom);
        var panelInferior = new LOG.util.ColumnForm({
            columnas: 4
        });
        panelInferior.addComponent(this.fields.generales.cbUM);
        panelInferior.addComponent(this.fields.generales.cbNaturaleza);
        panelInferior.addComponent(this.fields.generales.cbProductora);
        panelInferior.addComponent(this.fields.generales.tfDescVenta);
        panelInferior.addComponent(this.fields.generales.tfPrecio);
        panelInferior.addComponent(this.fields.generales.cbPais);
        panelInferior.addComponent(this.fields.generales.cbTipo);
        panelInferior.addComponent(this.fields.generales.fInicio);
        panelInferior.addComponent(this.fields.generales.fFin);
        
        panelInferior.init();

        var panelGeneral = new LOG.util.ColumnForm({
            columnas: 1,
            region: 'center'
        });
        panelGeneral.addComponent(panelSuperior);
        panelGeneral.addComponent(panelInferior);
        panelGeneral.init();
        this.panelFormulario = LOG.util.UIManager.initForm({
            region: 'center',
            fileUpload: true,
            frame: true,
            items: [panelGeneral]
        });
        this.add(this.panelFormulario);
        this.initTabPanel();
        if (this.modelo) {
            this.modelo.bindForm(this.panelFormulario);
            this.modelo.addActionButton(this.listaBotones.getItem(1));
            this.modelo.addActionButton(this.listaBotones.getItem(2));
        }
    },
    setNode: function (node) {
        this.nodo = node;
        this.record = null;
    },
    setRecord: function (rec) {
        this.nodo = null;
        this.record = rec;
        if (this.tipo == 3) {
            this.nivelSurtido = 1;
        }
    },
    initTabPanel: function () {
        this.tpDatos = new Ext.TabPanel({
            region: 'south',
            activeTab: 0,
            frame: true,
            layoutOnTabChange: true,
            enableTabScroll:true,
            defaults: {
                closable: false,
                autoScroll:true
            }
        });
        this.tpDatos.add(this.tabProducto());
        this.tpDatos.add(this.tabPlan());
        if (centrobalance) {
            this.fields.plan.cbCentro.allowBlank = false;
        } else {
            this.fields.plan.cbCentro.allowBlank = true;
        }
        this.tpDatos.add(this.tabConjunto());
        this.tpDatos.add(this.tabDescripcion());
        this.tpDatos.add(this.tabImagenes());
        this.tpDatos.add(this.tabMedicamentos());
        this.panelFormulario.add(this.tpDatos);
    },
    tabDescripcion: function () {
        return LOG.util.UIManager.initPanel({
            region: 'center',
            height: this.heightPanels,
            iconCls: 'icondistra-nuevo',
            layout: 'fit',
            title: LOG.lb.maestroproductos.Idioma.lbDescript,
            items: [this.fields.generales.htmlDescripcion]
        });
    },
    tabPlan: function () {
        var _this = this;
        var panel = new LOG.util.ColumnForm({
            title: this.idioma.lbDatosPlan,
            columnas: 3,
            frame: true
        });

        for (var field in this.fields.plan) {
            var cmp = this.fields.plan[field];
            panel.addComponent(cmp);
        }
        panel.init();

        this.viaadquisicionView = new LOG.lb.maestroproductos.NomPlan({
            height: 185,
            bodyStyle: 'padding:5px 0 5px 5px',
            columnWidth: .47,
            formaVisualizacion: 'panel',
            region: 'east',
            modoSeleccion: 1,
            frame: true,
            autoLoad: false,
            parent: _this,
            baseParams: {
                modelo: 'NomViaadquisicion',
                idnom: 'idviaadquisicion'
            },
            initDefaultColumns: function () {
                var _this = this;
                this.addGridColumn({
                    header: 'V\xeda de adquisici\xf3n',
                    width: 150,
                    dataIndex: 'denominacion',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idorganosatisface'
                });
            }
        });
        var contactMenu = new Ext.menu.Menu({
            items: [new Ext.Action({
                text: 'Desociar',
                iconCls: 'cancelar',
                handler: function () {
                    //Ext.Msg.alert('Action executed', 'Send instant message...');
                }
            })]
        });
//arbol visualizacion
        this.treeView = new Ext.tree.TreePanel({
            xtype: 'treepanel',
            height: 175,
            bodyStyle: 'padding:5px 5px 5px 5px',
            region: 'west',
            autoScroll: true,
            rootVisible: false,
            useArrows: true,
            //frame:true,

            root: new Ext.tree.AsyncTreeNode({
                id: '0',
                expanded: true,
                text: 'Organo - Via'
            }),
            listeners: {
                'beforeload': function (nodo) {
                    var loader = nodo.getLoader();
                    loader.clearOnLoad = true;
                    loader.dataUrl = '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarArbolPlanificacion';
                    loader.baseParams.id = _this.parentUI.getSmPrincipal().getSelected() ? _this.parentUI.getSmPrincipal().getSelected().get('idindicador') : _this.parentUI.arbolProductos.getSelectedNode().id;
                    this.getEl().mask("Loading", 'x-mask-loading');

                },
                'beforeexpandnode': function (nodo) {
                    //return nodo.attributes.hasOwnProperty('checked');
                },
                'checkchange': function (nodo) {
                    var idarray = Array();
                    Ext.each(_this.treeView.getChecked('id'), function (r) {
                        idarray.push(r);
                    });
                    if (idarray.length == 0) {
                        _this.buttonDesasociar.setDisabled(true);
                    } else {
                        _this.buttonDesasociar.setDisabled(false);
                    }
                },
                'contextmenu': function (node, e) {
                    node.select();
                    var contextMenu;
                    // console.info(node.getOwnerTree());
                    // var c = node.getOwnerTree().contextMenu;
                    contextMenu = contactMenu;
                    if (contextMenu) {
                        contextMenu.contextNode = node;
                        contextMenu.showAt(e.getXY());
                    }
                    //c.contextNode = node;
                    // c.showAt(e.getXY());
                },
                'load': function () {
                    this.getEl().unmask();
                }

            }
        });

        //_this.treeView.setRootNode(_this.root);

        _this.treeView.getLoader().on({
            'beforeload': function (loader) {
                loader.clearOnLoad = true;
                loader.dataUrl = '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarArbolPlanificacion';
                loader.baseParams.id = _this.parentUI.getSmPrincipal().getSelected() ? _this.parentUI.getSmPrincipal().getSelected().get('idindicador') : _this.parentUI.arbolProductos.getSelectedNode().id;
                _this.treeView.getEl().mask("Loading", 'x-mask-loading');
            }
        });
        //arbol de organos
        this.treeGridOrganos = new LOG.lb.maestroproductos.TreeGrid({
            columnWidth: .53,
            autoScroll: true,
            disabled: true,
            maskDisabled: true,
            height: 169,
            columns: [{
                header: this.idioma.lbOrgano,
                dataIndex: 'denominacion',
                width: 230
            }],
            dataUrl: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomenclador',
            listeners: {
                'checkchange': function (nodo, checked) {
                    if (checked)
                        nodo.select();
                    else
                        nodo.unselect();
                },
                'beforeload': function () {
                    // this.getEl().mask("Loading", 'x-mask-loading');
                },
                'load': function (loader, node, response) {
                    //   if(loader.loading==false){
                    //     this.getEl().unmask();
                    // }else{
                    ///     this.getEl().mask("Loading", 'x-mask-loading');
                }
//

                //  this.getEl().unmask();
                // idnodo = null;
                // inicial = false;
                //}
            }
        });
        this.buttonAdicionar = new LOG.util.Prototipos.botonAdicionar({
            iconCls: 'aceptar',
            text: 'Asociar',
            isContextual: true,
            disabled: true,
            tooltip: this.idioma.ttAdicionarClasificacion,
            handler: function () {
                if (/*_this.organoView.nomView.getSmPrincipal().hasSelection()
                 &&*/ _this.viaadquisicionView.nomView.getSmPrincipal().hasSelection()) {
                    _this.buttonAdicionar.setDisabled(false);
                    //_this.parentUI.winIndicador.listaBotones.arrayData[2].enable();
                    //_this.treeView.getEl().mask("Loading", 'x-mask-loading');

                    var idvias = Array();
                    var idorganos = Array();
                    var treeNode = _this.treeView.getRootNode();

                    Ext.each(_this.viaadquisicionView.nomView.getSmPrincipal().getSelections(), function (r) {
                        idvias.push(r.json.idviaadquisicion);
                        var hijos = Array();
                        Ext.each(_this.treeGridOrganos.getChecked(), function (p) {
                            hijos.push({
                                id: p.id,
                                idorganosatisface: p.id,
                                text: p.attributes.denominacion,
                                leaf: false,
                                expanded: true
                            });
                            /*_this.treeGridOrganos.getNodeById(p.id).getUI().checkbox.checked = false;
                            _this.treeGridOrganos.getNodeById(p.id).getUI().toggleCheck(false);
                            _this.viaadquisicionView.nomView.getSmPrincipal().clearSelections();*/
                        });
                        var nodes = _this.treeView.root.childNodes;
                        var exists = false;
                        if (nodes.length > 0) {
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].attributes.id == r.json.idviaadquisicion) {
                                    exists = true;
                                    mostrarMensaje(3, 'La asociaci\xf3n que quiere adicionar ya existe.');
                                }
                            }
                        }
                        if (!exists) {
                            treeNode.appendChild({
                                id: r.json.idviaadquisicion,
                                text: r.json.denominacion,
                                leaf: false,
                                children: hijos
                            });
                            _this.adqquisicion.push({
                                idviaadquisicion: r.json.idviaadquisicion,
                                children: hijos
                            });
                        }
                        _this.treeView.getEl().unmask();

                    });
                    idorganos.push(_this.treeGridOrganos.getChecked('id'));


                    /*var idvias = Array();
                    var idorganos = Array();
                    Ext.each(_this.viaadquisicionView.nomView.getSmPrincipal().getSelections(), function(r) {
                        idvias.push(r.json.idviaadquisicion);
                    });
                    idorganos.push(_this.treeGridOrganos.getChecked('id'));

                    Ext.each(_this.treeGridOrganos.getChecked(), function(p) {
                        _this.treeGridOrganos.getNodeById(p.id).getUI().checkbox.checked = false;
                        _this.treeGridOrganos.getNodeById(p.id).getUI().toggleCheck(false);
                    });
                    _this.treeGridOrganos.getEl().mask();
                    _this.viaadquisicionView.nomView.getSmPrincipal().clearSelections();
                    _this.viaadquisicionView.getEl().mask();

                     if (centrobalance && _this.tipo == 1) {
                         _this.aceptarFn(true, idvias,idorganos);
                     } else {
                         Ext.Ajax.request({
                             url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/asociarPlanificacion',
                             method: 'POST',
                             params: {
                                 idindicador: _this.tipo == 1 ? _this.idindicador : _this.parentUI.getSmPrincipal().getSelected().get('idindicador'),
                                 idviaadquisicion: idvias,
                                 idorganosatisface: idorganos
                             },
                             callback: function(opt, success, response) {
                                 if (success) {
                                     _this.treeView.getLoader().on({
                                         scope: this, beforeload: function() {
                                             _this.treeView.getEl().mask("Loading", 'x-mask-loading');
                                         }
                                     });
                                     _this.cantasociados = response.getResponseHeader.length;
                                     _this.treeView.getLoader().load(_this.treeView.getRootNode(), function() {
                                         _this.treeView.getRootNode().expand();
                                         _this.treeView.getEl().unmask();
                                         _this.viaadquisicionView.getEl().unmask();
                                     });

                                 } else {
                                     var responseText = Ext.decode(response.responseText);
                                     if (responseText.codMsg == 1) {
                                         mostrarMensaje(3, 'Ya existe la asociacion');
                                     } else {
                                         mostrarMensaje(3, 'Ha ocurrido un error al asociar');
                                     }
                                 }
                             }
                         });
                     }*/
                }
            }
        });
        this.buttonDesasociar = new LOG.util.Prototipos.botonAdicionar({
            iconCls: 'cancelar',
            text: 'Desasociar',
            isContextual: true,
            disabled: true,
            handler: function () {
                var idviaaqui = Array();
                var idviasorganos = Array();

                if (_this.treeView.getChecked()) {
                    _this.buttonDesasociar.setDisabled(true);
                    _this.treeView.getEl().mask("Loading", 'x-mask-loading');
                    Ext.each(_this.treeView.getChecked(), function (l) {
                        if (l.leaf == true) {
                            idviasorganos.push(l.parentNode.id + '-' + l.id);
                        } else {
                            idviaaqui.push(l.id);
                        }
                    });

                    var valindicador = null;
                    if (_this.parentUI.getSmPrincipal().getSelected()) {
                        valindicador = _this.parentUI.getSmPrincipal().getSelected().get('idindicador');
                    } else if (_this.tipo == 2) {
                        valindicador = _this.parentUI.arbolProductos.getSelectedNode().id
                    } else {
                        valindicador = _this.idindic;
                    }

                    Ext.Ajax.request({
                        url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/desasociarPlanificacion',
                        method: 'POST',
                        params: {
                            idindicador: valindicador,
                            idviaadquisicion: Ext.encode(idviaaqui),
                            idviasorganos: Ext.encode(idviasorganos)
                        },
                        callback: function (opt, success, response) {
                            //if (success) {
                            _this.treeView.getLoader().on({
                                scope: this, beforeload: function () {
                                    _this.treeView.getEl().mask("Loading", 'x-mask-loading');
                                }
                            });
                            _this.treeView.getLoader().load(_this.treeView.getRootNode(), function () {
                                _this.treeView.getRootNode().expand();
                                _this.treeView.getEl().unmask();
                            });

                            /* } else {
                             var responseText = Ext.decode(response.responseText);
                             if (responseText.codMsg == 1) {
                             mostrarMensaje(3, 'Ya existe la asociacion');
                             } else {
                             mostrarMensaje(3, 'Ha ocurrido un error al asociar');
                             }
                             }*/
                        }
                    });
                } else {
                    idviaaqui = _this.treeView.getSelectionModel().selNode.leaf ? _this.treeView.getSelectionModel().selNode.parentNode.id : _this.treeView.getSelectionModel().selNode.id;
                    if (idviaaqui) {
                        _this.buttonDesasociar.setDisabled(true);
                        _this.treeView.getEl().mask("Loading", 'x-mask-loading');

                        var record = Array();
                        var nodes = _this.treeView.root.childNodes;
                        if (nodes.length > 0) {
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i].attributes.id == idviaaqui) {
                                    record.push({id: r.json.idviaadquisicion});
                                }
                            }
                        }
                        var treeNode = _this.treeView.getRootNode();
                        treeNode.removeChild(record);
                        treeNode.expand();
                        _this.treeView.getEl().unmask();
                    }
                }
            }
        });

        var visualizacion = {
            xtype: 'panel',
            layout: 'column',
            region: 'west',
            height: 225,
            width: 244,
            margins: '5 5 5 5',
            title: this.idioma.lbvisualizacion,
            bbar: new Ext.Toolbar({
                items: ['->', this.buttonDesasociar]
            }),
            items: [this.treeView]
        };

        this.panelVisualizacion = new LOG.util.ColumnForm({
            columnas: 1
        });

        this.panelVisualizacion.addComponent(visualizacion);

        this.panelVisualizacion.init();

        var panel2 = {
            xtype: 'panel',
            layout: 'column',
            region: 'center',
            title: this.idioma.lbVistaOrganoViaadquisicion,
            /*frame: true,*/
            items: [{
                title: this.idioma.lbasociacionvia,
                region: 'center',
                margins: '5 5 5 5',
                height: 225,
                width: 476,
                layout: 'column',
                bbar: new Ext.Toolbar({
                    items: ['->', this.buttonAdicionar]
                }),
                items: [this.viaadquisicionView, /*this.organoView*/this.treeGridOrganos]
            }, this.panelVisualizacion/*, {
                    title: this.idioma.lbvisualizacion,
                    region: 'west',
                    height: 225,
                    width: 244,
                    margins: '5 5 5 5',
                    //layout: 'column',
                    //frame: false,
                    bbar: new Ext.Toolbar({
                        items: ['->', this.buttonDesasociar]
                    }),
                    items: [this.treeView]
                }*/]
        };
        var panelPlan = {
            region: 'center',
            title: 'Navigation',
            layout: 'border',
            // frame: true,
            items: [{xtype: 'panel', region: 'west', width: '250'}, this.organoView, this.viaadquisicionView]
        };
        var tabs = new Ext.TabPanel({
            activeTab: 0,
            items: [panel, panel2]
        });
        return LOG.util.UIManager.initPanel({
            region: 'center',
            height: this.heightPanels,
            iconCls: 'icondistra-planificacion',
            layout: 'fit',
            title: LOG.lb.maestroproductos.Idioma.lbDatosPlan,
            items: [tabs]
        });
    },
    tabProducto: function () {
        var panel = new LOG.util.ColumnForm({
            columnas: 4,
            region: 'north',
            height: 150
        });

        var panelDimensiones = new LOG.util.ColumnForm({
            columnas: 4
        });
        for (var field in this.fields.producto) {
            panel.addComponent(this.fields.producto[field]);
        }
        for (var field in this.fields.dimensiones) {
            panelDimensiones.addComponent(this.fields.dimensiones[field]);
        }
        panel.init();
        panelDimensiones.init();
        var fsEnsamblaje = new Ext.form.FieldSet({
            region: 'center',
            layout: 'fit',
            title: this.idioma.lbDatosEmbalaje,
            items: [panelDimensiones]
        });
        return LOG.util.UIManager.initPanel({
            region: 'center',
            height: this.heightPanels,
            iconCls: 'icondistra-historial',
            layout: 'border',
            visible: false,
            frame: true,
            title: LOG.lb.maestroproductos.Idioma.lbDatosProducto,
            items: [panel, fsEnsamblaje]
        });
    },
    getCamposMedicamentos: function(){
        var _this = this;
        this.comboFormaFarmaceutica = new LOG.util.ComboBox({
            name: 'idforma',
            hiddenName: 'idforma',
            valueField: 'idforma',
            displayField: 'text',
            url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarFormaFarmaceutica',
            //url: '/logistica/utiles/maestroproductos/index.php/codificador/cargarFormaFarmaceutica',
            fieldLabel: _this.idioma.lbFormaFarm,
            mode: 'local',
            autoLoad: true,
            width: '98%',
            allowBlank: true,
        });

        //_this.comboFormaFarmaceutica.expand();

        this.tipoEnvase = new LOG.util.ComboBox({//presentacion
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getTipoEnvase',
            name: 'idtipoenvase',
            autoLoad: true,
            hiddenName: 'idpresentacion',
            valueField: 'idtipoenvase',
            disabled: false,
            displayField: 'denominacion',
            mode: 'local',
            allowBlank: true,
            anchor: '80%',
            //emptyText: _this.idioma.lbSeleccione,
            fieldLabel: _this.idioma.lbTipoEnvase
        });

        this.unidadMedidaPresent = new LOG.util.ComboBox({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
            valueField: 'idunidadmedida',
            hiddenName: 'idumcomposicion',
            name: 'idunidadmedida',
            selectOnlyLeaf: true,
            displayField: 'abreviaturaunidadmedida',
            //fieldLabel: 'Unidad de medida',
            allowBlank: true
        });

        this.capacidad = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'dosisunitaria',
            maxLength: '19',
            fieldLabel: _this.idioma.lbDosisunitaria,
            autoCreate: true,
            allowBlank: true,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true
        });

        this.composicion = new LOG.util.Prototipos.inputDecimal({
            anchor: '95%',
            name: 'composicion',
            maxLength: '19',
            fieldLabel: _this.idioma.lbComposicion,
            autoCreate: true,
            allowBlank: true,
            decimalPrecision: 5,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true

        });

        this.unidpresen = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'unidadpresent',
            maxLength: '19',
            fieldLabel: 'Unidad presentaci\xf3n(UP)',
            autoCreate: true,
            allowBlank: true,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true

        });

        this.peso = new LOG.util.Prototipos.inputDecimal({
            name: 'pesoenvase',
            allowBlank: true,
            anchor: '95%',
            decimalPrecision: 5,
            fieldLabel: _this.idioma.lbPesoenvase
        });        

        this.temperatura = new LOG.util.Prototipos.inputDecimal({
            anchor: '95%',
            name: 'temperatura',
            maxLength: 5,
            decimalPrecision: 2,
            fieldLabel: _this.idioma.lbTemperatura,
            autoCreate: true,
            allowBlank: true,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true
        });

        this.umpeso = new LOG.util.ComboBox({
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarComboUM',
            valueField: 'idunidadmedida',
            name: 'idumedida',
            hiddenName: 'idumpeso',
            selectOnlyLeaf: true,
            displayField: 'abreviaturaunidadmedida',
            //fieldLabel: 'Unidad de embalaje',
            allowBlank: true
        });

        return [
            _this.comboFormaFarmaceutica,
            _this.composicion,
            _this.unidadMedidaPresent,
            _this.tipoEnvase,
            _this.unidpresen,
            _this.capacidad,
            _this.peso,
            _this.umpeso,
            _this.temperatura
            //_this.formafarmaceutica
            //_this.temperatura
        ]
    },
    tabMedicamentos: function () {
        let _this = this;
        let camposMedicamentos = _this.getCamposMedicamentos();

        let clsFormaPresent = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        clsFormaPresent.addComponent(camposMedicamentos[0]);

        let clscomposicion = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        let clspeso = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        let clscapacidad = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        clscomposicion.addComponent(camposMedicamentos[1]);
        clscomposicion.addComponent(camposMedicamentos[2]);
        clsFormaPresent.addComponent(clscomposicion);
        clsFormaPresent.addComponent(camposMedicamentos[3]);
        clsFormaPresent.addComponent(camposMedicamentos[4]);

        clscapacidad.addComponent(camposMedicamentos[5]);
        clscapacidad.addComponent(camposMedicamentos[8]);
        clsFormaPresent.addComponent(clscapacidad);

        clspeso.addComponent(camposMedicamentos[6]);
        clspeso.addComponent(camposMedicamentos[7]);
        clsFormaPresent.addComponent(clspeso);

        let fsOtrosDatos = new Ext.form.FieldSet({
            region: 'center',
            layout: 'fit',
            title: '',
            items: [clsFormaPresent]
        });
        
        return LOG.util.UIManager.initPanel({
            region: 'center',
            height: this.heightPanels,
            iconCls: 'icondistra-ptoflotante',
            layout: 'border',
            visible: false,
            frame: true,
            title: LOG.lb.maestroproductos.Idioma.lbDatosMedicamentos,
            items: [fsOtrosDatos]
        });
    },
    tabImagenes: function () {
        this.initTemplates();
        var _this = this;
        this.stImagenes = new Ext.data.JsonStore({
            url: 'getImagenesIndicador',
            root: 'data',
            fields: ['url'],
            listeners: {
                'add': function (store, records, index) {
                    //Ext.erp.arrVisor.push(records[0].get('url'));
                }
            }
        });
        var panelImagenes = LOG.util.UIManager.initPanel({
            layout: 'fit',
            region: 'center',
            items: [
                _this.dvImagenes = new Ext.DataView({
                    region: 'center',
                    style: 'overflow:auto',
                    multiSelect: true,
                    itemSelector: 'div.thumb-wrap',
                    emptyText: '<div style="padding:10px;">' + _this.idioma.lbMsgNoImagenes + '</div>',
                    store: _this.stImagenes,
                    tpl: _this.thumbTemplate
                })
            ]
        });
        var fs = {
            hideLabel: true,
            xtype: 'fileupload',
            buttonOnly: true,
            name: 'foto',
            buttonText: _this.idioma.lbBtnAdicionar,
            buttonCfg: {
                tooltip: '',
                text: '',
                iconCls: 'icondistra-adicionar'
            },
            listeners: {
                'fileselected': function (fs, v) {
                    if (!_this.winImagen) {
                        _this.winImagen = new LOG.util.Window({
                            usarAplicar: false,
                            resizable: false,
                            title: _this.idioma.lbTitWinImagen,
                            width: 350,
                            height: 450,
                            items: [
                                LOG.util.UIManager.initPanel({
                                    region: 'center',
                                    html: '<img id="' + _this.idCmp + '_Imagen" title="imagen" style="width: 100%; height: 100%;">'
                                })
                            ],
                            aceptarFn: function () {
                                _this.modelo.cargaInicial({
                                    url: '/logistica/utiles/plugin/index.php/imagen/salvarImagen',
                                    imagen: _this.winImagen.base64Img
                                }, function (datos, resp) {
                                    var id = resp.idimagen;
                                    var base64 = resp.imagen;
                                    if (!_this.stImagenes.getById(id)) {
                                        _this.stImagenes.insert(0, new _this.stImagenes.recordType({
                                            url: base64
                                        }, id));
                                        _this.modelo.addImagen(id);
                                    }
                                }, 'Salvando imagen.');
                            }
                        });
                        _this.winImagen.on({
                            'show': function () {
                                var oFReader = new FileReader();
                                var objImg = document.getElementById(_this.idCmp + '_Imagen');
                                oFReader.onload = function (oFREvent) {
                                    objImg.src = oFREvent.target.result;
                                    _this.winImagen.base64Img = oFREvent.target.result;
                                };
                                var obj = fs.fileInput.dom.files[0];
                                oFReader.readAsDataURL(obj);

                            }
                        });
                    }

                    _this.winImagen.show();
                    _this.winImagen.doLayout();
                }
            }
        };
        return LOG.util.UIManager.initPanel({
            region: 'center',
            height: this.heightPanels,
            tbar: [
                fs,
                LOG.util.UIManager.createBtn({
                    iconCls: 'icondistra-eliminar',
                    tooltip: _this.idioma.lbBtnEliminarImagen,
                    handler: function () {
                        var idSeleccionados = _this.dvImagenes.getSelectedRecords();
                         _this.modelo.deleteImagen(idSeleccionados,
                            _this.parentUI.getSmPrincipal().getSelected().get('idindicador'),
                            _this);
                    }
                })/*,
                LOG.util.UIManager.createBtn({
                    iconCls: 'maximizar',
                    tooltip: _this.idioma.lbBtnMaximizarImagen,
                    handler: function () {
                    }
                })*/
                
            ],
            iconCls: 'icondistra-adicionar',
            layout: 'border',
            visible: false,
            frame: false,
            title: LOG.lb.maestroproductos.Idioma.lbImagenes,
            items: [panelImagenes]
        });
    },
    tabConjunto: function () {
        var _this = this;
        var listaBotones = new LOG.util.List();
        listaBotones.add(LOG.util.Prototipos.botonAdicionar({
            scope: this,
            tooltip: '',
            handler: function () {
                _this.ventanaIndicador();
            },
            controlFn: function (b, _caller) {

            }
        }));

        listaBotones.add(LOG.util.Prototipos.botonEliminar({
            scope: this,
            tooltip: '',
            handler: function () {
                var seleccion = _this.gridConjunto.getSmPrincipal().getSelections();
                mostrarMensaje(2, (seleccion.length > 1) ? _this.idioma.lbQuestProductosEliminar : _this.idioma.lbQuestProductoEliminar, function(btn, text) {
                    if (btn === 'ok') {
                        productos = new Array();
                        Ext.each(seleccion, function(sel) {
                            if (sel.json.idindicadorconjunto)
                                productos.push(sel.json.idindicadorconjunto);
                        });
                        Ext.MessageBox.wait(_this.idioma.msgEliminando, _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: 'eliminarConjunto',
                            method: 'post',
                            params: {
                                datos: Ext.encode(productos)
                            },
                            success: function(rp) {
                                Ext.MessageBox.hide();
                                _this.gridConjunto.getStorePrincipal().reload({
                                    callback: function(st){

                                    }
                                });
                            }
                        });
                    }
                });
            },
            controlFn: function(b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (_caller.getGridPrincipal().getSelectionModel().getSelections().length > 0) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        }));
        this.gridConjunto = new LOG.util.UITemplate({
            busquedaBasica: false,
            autoSelect: false,
            autoLoad: false,
            gridEditable: true,
            //dirController: '/logistica/utiles/plugin/index.php/pluginsustituto',
            urlBusquedaGridPrincipal: 'getConjuntoIndicador',
            idGridPrincipal: 'idindicadorconjunto',
            formaVisualizacion: 'panel',
            listaBotones: listaBotones
        });
        this.gridConjunto.addGridColumn({
            dataIndex: 'idindicadorconjunto'
        });
        this.gridConjunto.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.gridConjunto.addGridColumn({
            header: this.idioma.lbCodigo,
            dataIndex: 'codigo'
        });
        this.gridConjunto.addGridColumn({
            header: this.idioma.lbCodigoProveedor,
            dataIndex: 'numeropieza'
        });
        this.gridConjunto.addGridColumn({
            header: this.idioma.lbDenom,
            dataIndex: 'denominacion',
            autoExpand: true
        });
        this.gridConjunto.addGridColumn({
            header: this.idioma.lbCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function(t) {
                        t.selectText(0, t.getValue().length);
                    }
                }
            })
        });

        this.gridConjunto.init();

        return LOG.util.UIManager.initPanel({
            region: 'center',
            height: this.heightPanels,
            iconCls: 'icondistra-tileview-detalles',
            layout: 'fit',
            title: LOG.lb.maestroproductos.Idioma.lbConjunto,
            items: [this.gridConjunto.view()]
        });
    },
    ventanaIndicador: function() {
        var _this = this;
        var idseleccionados = _this.gridConjunto.getStorePrincipal().reader.jsonData.adicionados;
        //idseleccionados = idseleccionados.concat([scope.view.getSmPrincipal().getSelected().data.idindicador]);
        Ext.each(_this.gridConjunto.getStorePrincipal().getRange(), function(record) {
            if (!record.data.idindicadorconjunto) {
                idseleccionados.push(record.data.idindicador);
            }
        });
        var parametros = {};
        parametros.idseleccionados = Ext.encode(idseleccionados);
        LOG.inv.maestroproductos.Loader.init(function() {
            var ventana = new LOG.lb.maestroproductos.UIProductos({
                tipo: 1,
                constrain: true,
                usarAplicar: true,
                //modoSeleccion: 1,
                parametros: parametros,
                doAction: function(r) {
                    //Ext.MessageBox.wait(_this.idioma.msgGuardando, _this.idioma.msgEspere || '...');
                    //var idsustituto = undefined;
                    var recordType;
                    Ext.each(r, function(rec) {
                        recordType = new _this.gridConjunto.storePrincipal.recordType({
                            idindicadorconjunto: null,
                            idindicador: rec.json.idindicador,
                            codigo: rec.json.codigo,
                            numeropieza: rec.json.codigoproveedor,
                            denominacion: rec.json.denominacion,
                            cantidad: 0,
                        });
                        _this.gridConjunto.storePrincipal.add(recordType);
                    });
                    _this.modelo.setConjunto(_this.gridConjunto.getGridPrincipal().getStore().getModifiedRecords());
                    /*Ext.Ajax.request({
                        url: '/logistica/utiles/plugin/index.php/pluginsustituto/adicionarSustituto',
                        method: 'post',
                        params: {
                            idsustituto: idsustituto,
                            idindicador: scope.view.getSmPrincipal().getSelected().data.idindicador,
                            fecha: _this.dfFecha.getValue()
                        },
                        success: function(rp) {
                            Ext.MessageBox.hide();
                            _this.gridSustituto.getStorePrincipal().reload();
                        }
                    });*/
                }
            });
            ventana.show();
        })
    },
    aceptarFn: function (apply) {
        var _this = this;
        if (centrobalance) {
            /*var record1 = Array();

            Ext.each(_this.viaadquisicionView.nomView.getSmPrincipal().getSelections(), function (r) {
                idvias.push(r.json.idviaadquisicion);
                var nodes = _this.treeView.root.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    record1.push({id: r.json.idviaadquisicion});
                }
            });
            var treeNode = _this.treeView.getRootNode();
            treeNode.removeChild(record1, true);
            treeNode.expand();

            var treeNode = _this.treeView.getRootNode();
            treeNode.collapse();
            //treeNode.expand();

            idorganos.push(_this.treeGridOrganos.getChecked('id'));*/
            /*Ext.each(_this.treeGridOrganos.getChecked(), function (p) {
                _this.treeGridOrganos.getNodeById(p.id).getUI().checkbox.checked = false;
                _this.treeGridOrganos.getNodeById(p.id).getUI().toggleCheck(false);
                _this.viaadquisicionView.nomView.getSmPrincipal().clearSelections();
            });

            if (_this.parentUI.winIndicador.treeView.root.childNodes.length == 0 || _this.cantasociados == 0) {
                mostrarMensaje(3, _this.idioma.msgSeleccionOrgano);
                return;
            }*/
        }

        LOG.util.UIManager.encadenaFn(this, 'postSaveFn', function () {
            if ((!centrobalance && !apply) || apply) {
                _this.modelo.reset();
            }
            if (apply && _this.tipo == 1) {
                var idFormato = _this.getData().idformato;
                if (idFormato != 0) {
                    _this.fields.generales.cbFormatoCodigo.setValue(null);
                    _this.fields.generales.cbFormatoCodigo.setValue(idFormato);
                    _this.modelo.idformato = idFormato;
                    _this.modelo.idpadre = _this.getData().idindicador;
                    _this.modelo.codigoPadre = _this.getData().codigo;
                    _this.fields.generales.cbFormatoCodigo.fireEvent('change', _this.fields.generales.cbFormatoCodigo, idFormato, null)
                }
            }
        });
        var msg = _this.tipo == 1 ? null : (_this.tipo == 2) ? _this.idioma.lbMsgObjetoModificado : " La clasificaci\xf3n ha sido duplicada satisfactoriamente";
        LOG.util.UIManager.encadenaFn(this, 'postSaveFn', function () {
            if (!apply) {
                _this.close();
            }
            /*if (!apply) {
               if (!centrobalance) {
                  _this.close();
            }*/
        });
        this.modelo.idespecialidad = this.parentUI.idEspecialidad;
        this.modelo.nivel = _this.tipo == 1 ? this.modelo.nivel : ((this.modelo.nivel || 0) + 1);
        var conjuntosMod = _this.gridConjunto.getGridPrincipal().getStore().getModifiedRecords();
        if(conjuntosMod.length > 0){
            var prodConjunto = new Array();
            Ext.each(conjuntosMod, function(record){
                prodConjunto.push(record.data);
            });
        }

        var p_nivelsurtido = _this.nivelSurtido;
        var p_idpadreOK = _this.tipo == 1 ? _this.nodo.attributes.idindicador : null;
        var P_datosvisualizacion = Ext.encode(_this.adqquisicion);
        var p_indconjunto = Ext.encode(prodConjunto);

        var fnFail = function(resp) {
            if(resp.errorCode == 'GRUPO_USADO_MULTIPLES_ENTIDADES'){
                var mesg = "Si modifica el grupo es posible que se descuadren los balances contables de las siguientes entidades: </br>"
                    .concat(resp.entidades.map(e => "<b>" + e + "</b>").join('</br>'))
                    .concat("</br>¿Está seguro que desea continuar?");
                mostrarMensaje(2, mesg, function(btn){
                    if(btn=='ok'){
                        _this.modelo.salvar({
                            nivelsurtido: p_nivelsurtido,
                            idpadreOK: p_idpadreOK,
                            datosvisualizacion: P_datosvisualizacion,
                            indconjunto: p_indconjunto,
                            forzarGrupo: 1
                        }, this.postSaveFn, null, msg, true);
                    }
                });
            }
        }

        this.modelo.salvar({
            nivelsurtido: _this.nivelSurtido,
            idpadreOK: _this.tipo == 1 ? _this.nodo.attributes.idindicador : null,
            /*idviaadquisicion: idvias,
            idorganosatisface: idorganos*/
            datosvisualizacion: Ext.encode(_this.adqquisicion),
            indconjunto: Ext.encode(prodConjunto)
        }, this.postSaveFn, fnFail, msg);

        return false;
    },
    getData: function () {
        return this.record != null ? this.record.json : (
            this.nodo != null ? this.nodo.attributes : {
                nivel: 0,
                codigo: ''
            });
    },
    formatoCodigo: function (partes, node) {
        var data = this.getData(), longitudPadre = 0, nivel = node.nivel;
        if (this.tipo != 1) {
            nivel -= 1;
            if (this.tipo != 3) {
                this.modelo.idpadre = null;
            }
        } else {
            this.modelo.idpadre = (data.idindicador) ? data.idindicador : data.idpadre;
            this.modelo.codigoPadre = data.codigo;
        }
        var formatoCodigo = ':(', hasPartes = false, initPos = 0, isLeveCurrent = false;
        for (var i = 0; i < partes.length; i++) {
            var seccionFormato = '', hasSeccion = false, longitud = partes[i].longitud;
            isLeveCurrent = (i == nivel || isLeveCurrent);
            longitudPadre += parseInt((isLeveCurrent) ? 0 : longitud);
            for (var j = 0; j < longitud; j++) {
                hasSeccion = true;
                seccionFormato += (!isLeveCurrent) ? node.codigo.substr(initPos, longitud) : '#';
                if (!isLeveCurrent) {
                    break;
                }
            }
            initPos += parseInt(longitud);
            if (i == nivel) {
                seccionFormato = '<span style="color: #FF0000">' + seccionFormato + '</span>';
                this.fields.generales.txtCodigo.minLength = longitud;
                this.fields.generales.txtCodigo.maxLength = longitud;
                this.fields.generales.txtCodigo.minLengthText = this.idioma.msgMinLengthCodigo.replace('_lg', longitud);
                this.fields.generales.txtCodigo.maxLengthText = this.idioma.msgMaxLengthCodigo.replace('_lg', longitud);
                if (generarcodigo != true) {
                    this.fields.generales.txtCodigo.enable();
                    this.fields.generales.lbCodigo.enable();
                }
            }
            if (hasSeccion) {
                if (hasPartes) {
                    formatoCodigo += '.' + seccionFormato;
                } else {
                    formatoCodigo += seccionFormato;
                }
                hasPartes = true;
            }
        }
        this.nivelSurtido = (nivel == (partes.length - 1)) ? 1 : 0;
        this.longitudCodigoPadre = longitudPadre;
        this.cortarCodigo();
        formatoCodigo += ')';
        return formatoCodigo;
    },
    setMode: function (mode) {

        this.tipo = mode;
        if (mode == 2) {
            this.getButton(1).setVisible(false);
            this.fields.generales.txtCodigo.disable();
        } else if (mode == 3) {
            this.getButton(1).setVisible(false);
            if (generarcodigo != true) {
                this.fields.generales.txtCodigo.setValue("");
                this.fields.generales.txtCodigo.enable();
            }
        } else {
            this.getButton(1).setVisible(true);
            if (generarcodigo != true) {

                this.fields.generales.txtCodigo.setValue("");
                this.fields.generales.txtCodigo.enable();
            }
        }
        this.fields.generales.cbNaturaleza.idSeleccionado = null;
        this.fields.generales.cbUM.idSeleccionado = null;
    },
    onShowHandler: function () {
        this.fields.generales.txtDenominacion.enable();
        if (this.fields.producto) {
            this.fields.producto.tfNroPieza.enable();
        }
        if(this.getData()._is_leaf && this.tipo != 1) {
            if (this.getData().denominacion && this.getData().denominacion.length > 0 && !this.parentUI.grantedAction('RMODDENOMINACION')) {
                this.fields.generales.txtDenominacion.disable();
            }
            if (this.fields.producto && this.getData().numeropieza && this.getData().numeropieza.length > 0 && !this.parentUI.grantedAction('RMODNUMEROPIEZA')) {
                this.fields.producto.tfNroPieza.disable();
            }
        }

        this.loadInfo = 1;
        this.panelFormulario.getForm().reset();
        this.modelo.reset();
        var _this = this;
        if (this.tipo != 1) {
            this.panelFormulario.getForm().loadRecord({
                data: this.getData()
            });
            //linea nueva
            var valor = this.getData().idformato;
            this.modelo.loadRecord(this.getData());
            this.fields.generales.txtCodigo.focus(false, 100);
            this.fields.generales.cbNaturaleza.setRawValue(this.getData().naturaleza);
            this.fields.generales.cbNaturaleza.fireEvent('select');
            _this.modelo.idnaturaleza = this.getData().idnaturaleza;
            _this.modelo.idnaturaleza = this.getData().idnaturaleza;
            _this.modelo.idpais = this.getData().idpais;
            
            this.fields.generales.cbProductora.setRawValue(this.getData().fabricante); 

            this.fields.generales.cbUM.setRawValue(this.getData().umedida);
            this.fields.generales.cbUM.fireEvent('select');
            if (this.getData().imagenes) {
                Ext.each(this.getData().imagenes, function (i) {
                    if (!_this.stImagenes.getById(i.idimagen)) {
                        _this.stImagenes.insert(0, new _this.stImagenes.recordType({
                            url: i.url
                        }, i.idimagen));
                    }
                });
            }
            this.setLoadInfo();
            this.cortarCodigo();
        } else {
            var datos = this.getData();
            if (datos.nivel != 0) {
                this.panelFormulario.getForm().loadRecord({
                    data: datos
                });
                this.fields.generales.txtCodigo.setValue("");
                this.fields.generales.txtDenominacion.setValue("");
                _this.modelo.idformato = datos.idformato;
                _this.modelo.idnaturaleza = datos.idnaturaleza;
                _this.modelo.idpais = datos.idpais;
                this.fields.generales.cbNaturaleza.setRawValue(this.getData().naturaleza);
                this.fields.generales.cbUM.setRawValue(this.getData().umedida);
                this.fields.generales.cbUM.fireEvent('select');
            }
            if (this.getData().idformato != 0) {
                this.fields.generales.cbFormatoCodigo.setValue(this.getData().idformato);
                this.fields.generales.cbTipo.setValue(this.getData().tipo);
                this.fields.generales.txtCodigo.focus(false, 100);
                this.fields.generales.cbTipo.disable();
                this.modelo.tipo = this.getData().tipo;
            } else {
                this.fields.generales.cbFormatoCodigo.enable();
                this.fields.generales.cbTipo.enable();
            }
        }
        this.fields.generales.cbFormatoCodigo.focus();
        this.fields.generales.lbCodigo.setText(this.idioma.lbCodigo);
        this.fields.generales.cbFormatoCodigo.getStore().fireEvent('load', this.fields.generales.cbFormatoCodigo.getStore());
        //linea nueva
        //if ($valor) {
        this.fields.generales.cbFormatoCodigo.setValue(valor);
        // }


        this.tpDatos.setActiveTab(0);
        this.setTitle(this.tipo == 1 ? LOG.lb.maestroproductos.Idioma.lbTitWinAdicionar : LOG.lb.maestroproductos.Idioma.lbTitWinModificar);
        if (this.tipo == 3) {
            this.setTitle(LOG.lb.maestroproductos.Idioma.lbTitWinDuplicar);
            this.fields.generales.txtCodigo.setValue("");
        }

        if (generarcodigo == true) {
            this.fields.generales.txtCodigo.disable();
        }
        this.gridConjunto.getStorePrincipal().removeAll();
        _this.modelo.setConjunto(new Array());
        this.gridConjunto.getStorePrincipal().on(
            'beforeload', function(st) {
                st.initBaseParams.idpadre = _this.getData().idindicador || -1;
            }
        );
        this.gridConjunto.getStorePrincipal().on(
            'load', function(st){
                st.commitChanges();
            }
        );
        this.gridConjunto.getGridPrincipal().on(
            'afteredit', function(e){
                _this.modelo.habilitarBotones(false);
                _this.modelo.setConjunto(_this.gridConjunto.getGridPrincipal().getStore().getModifiedRecords());
            }
        );
        this.gridConjunto.getStorePrincipal().load();

    },
    setLoadInfo: function () {
        if (this.loadInfo == 1) {
            this.loadInfo = 2;
            return;
        }
        if (this.loadInfo == 2) {
            this.loadInfo = 3;
            return;
        }
        this.loadInfo = 1;
    },
    cortarCodigo: function () {
        if (generarcodigo == true) {
            return;
        }
        if (this.loadInfo == 3) {
            this.modelo.codigoPadre = this.fields.generales.txtCodigo.getValue().substring(0, this.longitudCodigoPadre);
            var value = this.fields.generales.txtCodigo.getValue().substring(this.longitudCodigoPadre);
            this.fields.generales.txtCodigo.setValue(value);
            this.modelo.codigo = value;
            this.loadInfo = 1;
            this.modelo.setDefaulFormValues();
        }
    },
    initTemplates: function () {
        this.thumbTemplate = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
            '<div class="thumb"><img src="{url}"></div>',
            '</div>',
            '</tpl>'
        );
        this.thumbTemplate.compile();
    },
    closeFn: function () {
        this.stImagenes.removeAll();
    }
});
LOG.lb.maestroproductos.NomPlan = Ext.extend(LOG.util.Panel, {
    layout: 'fit',
    //frame: true,
    border: false,
    bodyBorder: false,
    constructor: function (config) {
        var _this = this;
        this.parent = config.parent,
            config.urlBusquedaGridPrincipal = 'cargarnomenclador';
        config.dirController = '/configuracion/nomgenerales/index.php/nomencladoresgenerales';
        this.nomView = new LOG.util.UITemplate(config);
        this.nomView.init();
        this.items = [this.nomView.view({region: 'center'})];
        this.nomView.storePrincipal.load();
        LOG.lb.maestroproductos.NomPlan.superclass.constructor.call(this, config);
        this.nomView.getGridPrincipal().getSelectionModel().fireEvent = this.nomView.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'rowselect') {
                _this.parent.buttonAdicionar.setDisabled(false);
                _this.parent.treeGridOrganos.setDisabled(false);
            }
            if (e == 'rowdeselect') {
                _this.parent.buttonAdicionar.setDisabled(true);
                _this.parent.treeGridOrganos.setDisabled(true);
            }
        });
    }
});

LOG.lb.maestroproductos.CodigoBarras = Ext.extend(Ext.form.TriggerField, {
    name: 'codigobarra',
    maxLength: 20,
    triggerClass: 'x-form-search-trigger',
    regex: LOG.util.Regex.digito,
    enableKeyEvents: true,
    tamannoCodigoBarras: [8, 12, 13, 14, 18],
    isCodigoChequeoCorrecto: false,
    constructor: function (config) {
        this.fieldLabel = config.idioma.lbCodigoBarras;
        this.allowBlank = config.allowBlank;
        LOG.lb.maestroproductos.CodigoBarras.superclass.constructor.call(this, config);

        this.on('keyup', this.onKeyUp, this);
    },
    validator: function (value) {
        if (!this.isLengthCodigoBarrasCorrecto(value.length)) {
            return 'El tamaño del codigo debe ser alguno de: ' + this.tamannoCodigoBarras.join(', ')
        }
        if (!this.isCodigoChequeoCorrecto) {
            return 'Codigo de chequeo incorrecto';
        }
        return true;
    },
    isLengthCodigoBarrasCorrecto: function (length) {
        return this.tamannoCodigoBarras.includes(length);
    },
    onTriggerClick: function () {
        let win = this.crearVentanaSeleccionEstandar();
        win.on({
            scope: this,
            show: function () {
                
            }
        });

        win.show();
    },
    onKeyUp: function (event, field) {
        console.log('lol');
        this.isCodigoChequeoCorrecto = false;
        if (this.isLengthCodigoBarrasCorrecto(this.getValue().length)) {
            this.chequearCodigoBarras(this.getValue());
        }
    },
    crearVentanaSeleccionEstandar: function () {
        let me = this;

        let btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            handler: function () {
                me.winForm.close();
            }
        });

        let btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            scope: this,
            handler: function () {
                if (cbEstandarCodigoBarras.getValue()) {
                    me.generarCodigoBarras(cbEstandarCodigoBarras.getValue());
                }
            }
        });

        let cbEstandarCodigoBarras = new LOG.util.ComboBox({
            url: '/logistica/utiles/maestroproductos/index.php/estandarcodigobarras/cargarEstandaresCodigoBarra',
            name: 'idestandarcodigobarra',
            valueField: 'idestandarcodigobarra',
            autoLoad: true,
            autoSelect: false,
            displayField: 'denominacion',
            descField: 'desc',
            fieldLabel: 'Estandar',
            selectOnFocus: true,
            forceSelection: true,
            mode: 'local',
            // minChars: 0,
            listWidth: 300,
            //pageSize: 20,
            isCombo: true
        });

        let form = new Ext.FormPanel({
            // labelWidth: 50,
            // labelAlign: 'top',
            //region: 'center',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            // style: 'margin: 0 0 0 5',
                            items: [cbEstandarCodigoBarras]
                        }
                    ]
                }
            ]
        });

        return this.winForm = new Ext.Window({
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.30,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            layout: 'fit',
            buttons: [btnCancelar, btnAceptar],
            items: [form]
        });

        //win.show();
    },
    generarCodigoBarras: function (idestandarcodigobarra) {
        Ext.Ajax.request({
            url: '/logistica/utiles/maestroproductos/index.php/estandarcodigobarras/generarCodigoBarras',
            method: 'POST',
            scope: this,
            params: {
                idestandarcodigobarra: idestandarcodigobarra
            },
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codigoMsg === 1) {
                    this.setValue(responseData.codigoBarras);
                    this.setRawValue(responseData.codigoBarras);
                    this.isCodigoChequeoCorrecto = true;
                    this.validate();
                    // this.clearInvalid();
                    this.winForm.close();
                }
            }
        });
    },
    chequearCodigoBarras: function (codigobarra) {
        Ext.Ajax.request({
            url: '/logistica/utiles/maestroproductos/index.php/estandarcodigobarras/comprobarCodigoBarras',
            method: 'POST',
            scope: this,
            autoAbort: true,
            params: {
                codigobarra: codigobarra
            },
            callback: function(options, success, response)
            {
                var responseData = Ext.decode(response.responseText);
                if (responseData.codigoMsg == 1) {
                    if (responseData.isCorrecto) {
                        mostrarMensaje(1, 'El codigo de chequeo es correcto.');
                        this.isCodigoChequeoCorrecto = true;
                    } else {
                        mostrarMensaje(1, 'El codigo de chequeo es incorrecto.');
                        this.isCodigoChequeoCorrecto = false;
                    }
                } else if (responseData.codigoMsg == -1) {
                    mostrarMensaje(1, responseData.msg);
                }
            }
        });
    }
});