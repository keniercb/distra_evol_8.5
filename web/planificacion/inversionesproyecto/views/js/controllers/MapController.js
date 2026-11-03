/**
 * Clase controladora para el metodo curva de conflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */

Planificacion.Integracion.MapController = Ext.extend(Std.Base.Controller, {
    constructor: function() {
        var config = {
            labels: Planificacion.Integracion.Etiquetas,
            globals: {
                dirImg: Planificacion.Integracion.Imagenes
            }
        };
        this.init(config);
    },
    /**
     * Muestra la ayuda del componente
     * @copyright XETID Cuba
     * @name mostrarAyuda
     * @author Ing. Frank David Corona Prendes
     * @param referencia
     */
    mostrarAyuda: function(referencia) {
        var title = 'Ayuda';
        help.show(title, referencia);
    },
    /**
     * Función para mostrar la ventana adicionar fuerzas y actos
     * @copyright XETID Cuba
     * @name mostrarVentanaAdicionar
     * @author Ing Grabiel Montero Coello
     * @param ob: Objeto con la configuración
     */
    mostrarVentanaAdicionar: function(ob) {
        var me = this;
        var comps = me._getItem('componentes');
        var tabpanel = new Planificacion.Integracion.TabpanelAdicionarFuerzaacto({
            controller: ob.controller
        });
        me.win = new Ext.Window({
            width: 400,
            modal: true,
            title: 'Adicionar',
            resizable: false,
            items: [tabpanel],
            bodyStyle: 'padding-top:3px'
        });
        me.win.show();
    },
    /**
     * Función para gestionar los actos
     * @copyright XETID Cuba
     * @name gestionarActo
     * @author Ing Grabiel Montero Coello
     * @param ob: Objeto con los datos
     */
    gestionarActo: function(ob) {
        var me = this;
        var etiquetas = me._getLabel('Map');
        var mensaje = (ob.accion == 'ins') ? etiquetas.msgAddacto : etiquetas.msgDelacto;
        mensaje = (ob.accion == 'mod') ? (ob.records.length > 1) ? etiquetas.msgModactos : etiquetas.msgModacto : mensaje;
        Secodena.mostrarMascara('actos', '', mensaje);
        if (ob.records) {
            var data = [];
            if (ob.accion == 'del') {
                Ext.each(ob.records, function(r) {
                    data.push(r.get('idacto'));
                });
            } else
                data = ob.records;
        }
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'map/gestionaracto',
            params: {
                accion: ob.accion,
                acto: ob.records ? Ext.encode(data) : Ext.encode(ob.form.getValues()),
                idestudiomap: me._getItem('idestudiomap')
            },
            callback: function(opt, success, response) {
                Secodena.ocultarMascara('actos');
                if (ob.store)
                    ob.store.reload();
                if (ob.clean)
                    ob.form.reset();
                if (ob.close)
                    ob.win.close();
                var oRes = Ext.decode(response.responseText);
                var tipo;
                if (oRes.idacto == -1) {
                    mensaje = 'El acto que quiere adicionar ya existe.'
                    tipo = 3;
                } else {
                    mensaje = (ob.accion == 'ins') ? etiquetas.msgAddactoSuccess : etiquetas.msgDelactoSuccess;
                    mensaje = (ob.accion == 'mod') ? (ob.records.length > 1) ? etiquetas.msgModactosSuccess : etiquetas.msgModactoSuccess : mensaje;
                    tipo = 1;
                }
                mostrarMensaje(tipo, mensaje);
                if (ob.accion == 'del')
                    me.eliminarColumnas(oRes.idacto);
                me.construirMatriz(oRes.idacto, ob.accion);
            }
        });
    },
    /**
     * Función para gestionar las fuerzas
     * @copyright XETID Cuba
     * @name gestionarFuerza
     * @author Ing Grabiel Montero Coello
     * @param ob: Objeto con los datos
     */
    gestionarFuerza: function(ob) {
        var me = this;
        var tipo;
        var etiquetas = me._getLabel('Map');
        var mensaje = (ob.accion == 'ins') ? etiquetas.msgAddfuerza : etiquetas.msgModfuerza;
        mensaje = (ob.accion == 'del') ? etiquetas.msgDelfuerza : mensaje;
        Secodena.mostrarMascara('fuerza', '', mensaje);
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'map/gestionarfuerza',
            params: {
                accion: ob.accion,
                fuerza: ob.record ? Ext.encode(ob.record.get('idfuerza')) : Ext.encode(ob.form.getValues()),
                idestudiomap: me._getItem('idestudiomap')
            },
            callback: function(opt, success, response) {
                Secodena.ocultarMascara('fuerza');
                if (ob.store)
                    ob.store.reload();
                if (ob.clean)
                    ob.form.reset();
                if (ob.close)
                    ob.win.close();
                var oRes = Ext.decode(response.responseText);
                if (oRes.idfuerza != -1) {
                    tipo = 1;
                    mensaje = (ob.accion == 'ins') ? etiquetas.msgAddfuerzaSuccess : etiquetas.msgModfuerzaSuccess;
                    mensaje = (ob.accion == 'del') ? etiquetas.msgDelfuerzaSuccess : mensaje;
                } else {
                    mensaje = 'La fuerza que quiere adicionar ya existe.';
                    tipo = 3;
                }
                mostrarMensaje(tipo, mensaje);
                me.construirMatriz();
            }
        });
    },
    /**
     * Función para inicializar el validor de campos en un componente
     * @copyright XETID Cuba
     * @name initValidator
     * @author Ing Alejandro Medina Mejias
     * @param validator: Encargado de comprobar los datos
     * @param fields: Campos que contiene el componente
     * @param buttons: Botones de acción
     */
    initValidator: function(validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function(i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    },
    /**
     * Función para obtener los datos para construir el grid matriz
     * @copyright XETID Cuba
     * @name construirMatriz
     * @author Ing Grabiel Montero Coello
     */
    construirMatriz: function(btnResultado, btnResumen) {
        var _this = this;
        var etiquetas = _this._getLabel('Map');

        Secodena.mostrarMascara('matriz', '', 'Cargando datos...');
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'map/obtenermatriz',
            params: {
                idestudiomap: _this._getItem('idestudiomap')
            },
            callback: function(opt, success, response) {
                Secodena.ocultarMascara('matriz');
                var oRes = Ext.decode(response.responseText);
                if (!oRes.success) {
                    mostrarMensaje(1, etiquetas[oRes.message], function() {
                    });
                } else {
                    _this.construirColumnasMatriz(oRes);
                    if (oRes.fuerzas[0]['i' + oRes.actos[0].idacto]) {
                        if (btnResultado) {
                            btnResultado.enable();
                            btnResumen.enable();
                        }
                    }
                }
            }
        });
    },
    /**
     * Función para crear el grid matriz
     * @copyright XETID Cuba
     * @name construirColumnasMatriz
     * @author Ing Grabiel Montero Coello
     * @param ob: Objeto con los datos para crear el grid matriz
     */
    construirColumnasMatriz: function(ob) {
        var gp = this._getItem('gridMatriz');
        var etiquetas = this._getLabel('Map');
        if (ob) {
            var names = ['i', 'ci', 'ch', 'fpp', 'fpi'];
            var tips = ['Interés', 'Control institucional ', 'Control de hecho', 'Factor de ponderación del peso', 'Factor de ponderación del interés'];
            var fields = [{name: 'fza'}, {name: 'desc'}];
            var colIndex = [{dataIndex: 'fza', align: ob.config.align, width: 120}];
            var columns = [[{header: ''}], [{align: ob.config.align, header: etiquetas.lbFuerza}]];

            function makeColumnModel(a, i) {
                Ext.each(names, function(n, key) {
                    columns[1].push({
                        id: n + a.idacto,
                        name: 'h' + a.idacto,
                        align: ob.config.align,
                        header: "<span title='" + tips[key] + "' style='width: 100%;display: block;'>" + n.toUpperCase() + "</span>"
                    });
                    colIndex.push({
                        dataIndex: n + a.idacto,
                        editor: new Ext.form.NumberField({
                            maxValue: 1,
                            name: n + a.idacto,
                            decimalPrecision: 4,
                            allowBlank: false,
                            minValue: (n == 'i') ? -1 : 0,
                            minText: (n == 'i') ? etiquetas.textN11 : etiquetas.text01,
                            maxText: (n == 'i') ? etiquetas.textN11 : etiquetas.text01
                        })
                    });
                    fields.push({name: n + a.idacto});
                });
            }

            function setRecord(r, a, i, f) {
                Ext.each(names, function(n) {
                    var pos = n + a.idacto;
                    if (f[pos]) {
                        r.set((n + a.idacto), f[pos]);
                    } else {
                        r.set((n + a.idacto), "");
                    }

                });
                r.set('acto' + a.idacto, a.idacto);
            }

            function getData() {
                gp.getStore().removeAll();
                Ext.each(ob.fuerzas, function(f) {
                    var r = new Ext.data.Record({
                        fza: f.denominacion,
                        idfuerza: f.idfuerza,
                        desc: f.descripcion
                    });
                    Ext.each(ob.actos, function(a, i) {
                        setRecord(r, a, i, f);
                        if (i + 1 == ob.actos.length)
                            r.set('peso', f.peso);
                    });
                    gp.getStore().add(r);
                });
                gp.getStore().actos = ob.actos;
            }

            Ext.each(ob.actos, function(a, i) {
                columns[0].push({
                    name: 'h' + a.idacto,
                    header: a.denominacion,
                    colspan: ob.config.colspan
                });
                makeColumnModel(a, i);
                if (i + 1 == ob.actos.length) {
                    columns[0].push({header: ''});
                    columns[1].push({header: etiquetas.lbPesofuerza});
                    colIndex.push({
                        align: 'center',
                        dataIndex: 'peso',
                        width: 120, renderer: function(v) {
                            return v;
                        }
                    });
                    fields.push({name: 'peso'});
                }
            });
            getData();
            gp.getColumnModel().setConfig(colIndex);
            gp.getColumnModel().headers = columns;
            gp.getStore().fields = fields;
            gp.getView().refresh(true);
        }
        else
            this.estadoInicial(gp);

    },
    /**
     * Función para crear el grid vacío como estado inicial
     * @copyright XETID Cuba
     * @name estadoInicial
     * @author Ing Grabiel Montero Coello
     * @param g: Gridpanel matriz
     */
    estadoInicial: function(g) {
        var etiquetas = this._getLabel('Map');
        g.getView().refresh(true);
        g.getColumnModel().setConfig([
            {dataIndex: 'fza', align: 'left', width: 120},
            {dataIndex: 'peso', align: 'left', width: 120}
        ]);
        g.getColumnModel().headers = [[
                {header: ''},
                {header: ''}
            ], [
                {align: 'left', header: etiquetas.lbFuerza},
                {align: 'left', header: etiquetas.lbPesofuerza}
            ]];
        g.getStore().fields = [];
        g.getView().refresh(true);
    },
    /**
     * Función para eliminar las columnas del grid matriz asociadas a los actos eliminados
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name eliminarColumnas
     * @param deletedActos: Arreglo con los identificadores de los actos eliminados
     */
    eliminarColumnas: function(deletedActos) {
        var me = this;
        var gp = me._getItem('gridMatriz');
        var cm = gp.getColumnModel();
        var head1 = [];
        Ext.each(deletedActos, function(id) {
            Ext.each(cm.headers[1], function(h, i) {
                if (h && h.name) {
                    var aux = h.name.split(id);
                    if (aux.length < 2)
                        head1.push(h);
                }
            });
            cm.headers[1] = head1;
            head1 = [];
        });
        gp.getView().refresh(true);
    },
    /**
     * Función para mostrar la ventana para modificar los datos
     * @copyright XETID Cuba
     * @name mostrarWinGestion
     * @author Ing Grabiel Montero Coello
     * @param ob: Objeto con la configuración para la ventana y sus componentes hijos
     */
    mostrarWinGestion: function(ob) {
        var me = this;
        var win = new Planificacion.Integracion.WinGestionarFuerzaacto({
            cmp: ob.cmp,
            title: ob.title,
            accion: ob.accion,
            record: ob.record,
            controller: ob.controller,
            idestudiomap: ob.idestudiomap
        });
        win.show();
    },
    /**
     * Función para obtener los cálculos realizados sobre la matriz del modelo de aálisis político
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name generarResultado
     * @param ob: Objeto con los valores necesarios para realizar los cálculos
     */
    generarResultado: function(ob) {
        var me = this;
        var id = me._getItem('idestudiomap')
        var etiquetas = me._getLabel('Map');
        Secodena.mostrarMascara('resultado', '', etiquetas.msgResultado);
        var data = [];
        Ext.each(ob.records, function(r) {
            data.push(r.data);
        });
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'map/generarresultado',
            params: {
                objetos: Ext.encode(data),
                idestudiomap: id
            },
            callback: function(opt, success, response) {
                Secodena.ocultarMascara('resultado');
                var acto = 0;
                var oRes = Ext.decode(response.responseText);
                me.winResultado(acto, oRes, ob.altura);
                me.construirMatriz();
                me._getItem('btnGuardar').disable();
            }
        });
    },
    obtenerResultado: function(ob) {
        var me = this;
        var id = me._getItem('idestudiomap');
        var data = [];
        Ext.each(ob.records, function(r) {
            data.push(r.data);
        });
        var win = new Planificacion.Integracion.WinObtenerResultados({
            objproyecto: ob.objproyecto,
            altura: ob.altura,
            ancho: ob.ancho,
            objetos: data,
            idestudiomap: id
        });
        win.show();
    },
    guardarValoracion: function() {
        var me = this._getItem('objresultado');

        Secodena.mostrarMascara('mses2', '', 'Guardando los datos...');

        me.objproyecto.save();
        me.objproyecto.on("objetoguardado", function(obj, resp) {
            Secodena.ocultarMascara('mses2');
            var mensaje = resp.mensaje;
            var tipo = resp.tipo;

            mostrarMensaje(tipo, mensaje, function() {});
        });
        me.objproyecto.on("errorconfiguracion", function() {
            Secodena.ocultarMascara('mses2');
        });
    },
    guardarDatosMatriz: function(ob) {
        var _this = this;
        var id = _this._getItem('idestudiomap');
        var etiquetas = _this._getLabel('Map');
        var me = _this._getItem('objeto');

        Secodena.mostrarMascara('guardar', '', etiquetas.msgGuardando);
        var data = [];
        Ext.each(ob.records, function(r) {
            data.push(r.data);
        });
        Ext.Ajax.request({
            url: Planificacion.Integracion.UrlModulo + 'map/guardardatosmatriz',
            params: {
                objetos: Ext.encode(data),
                idestudiomap: id
            },
            callback: function(opt, success, response) {
                Secodena.ocultarMascara('guardar');
                var response = Ext.decode(response.responseText);
                if (response.codMsg != 3) {
                    mostrarMensaje(1, 'Los datos de la matriz han sido actualizados satisfactoriamente.', function() {
                        _this.construirMatriz(me.btnGenerarresultado, me.btnObtenerresultado);
                        me.gpMatriz.getStore().reload();
                        me.btnGuardar.disable(true);
                    });
                } else {
                    mostrarMensaje(3, 'Ha ocurrido un error al actualizar los datos de la matriz.');
                }

            }
        });
    },
    /**
     * Función para validar cuando el grid tiene todos sus records válidos
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name validarMatriz
     * @param store: Store del grid matriz
     * @param btn: Botón ha habilitar/deshabilitar
     */
    validarMatriz: function(store) {
        var me = this._getItem('objeto');
        var etiquetas = this._getLabel('Map');
        var actos = store.actos;
        var datos = store.data.items;

        for(var key1 in actos){
            if(actos.hasOwnProperty(key1)){
                var idacto = parseInt(actos[key1].idacto);
                var sumaci = parseFloat(0.0);
                var sumach = parseFloat(0.0);
                var campovacioci = 0;
                var campovacioch = 0;

                var posci = 'ci' + idacto;
                var posch = 'ch' + idacto;

                for(var key in datos){
                    if(datos.hasOwnProperty(key)){

                        var val = parseFloat(eval("datos[key].data." + posci));
                        if (val || val == 0){
                            if(val > 0){
                                var aux = (val * 10) + (sumaci * 10);
                                sumaci = aux / 10;
                            }
                        }else{
                            campovacioci ++;
                        }

                        var val1 = parseFloat(eval("datos[key].data." + posch));
                        if (val1 || val1 == 0){
                            if(val1 > 0){
                                var aux = (val1 * 10) + (sumach * 10);
                                sumach = aux / 10;
                            }
                        }else{
                            campovacioch++;
                        }
                    }
                }
                if (sumaci > 1 || (sumaci < 1 && campovacioci == 0)) {
                    me.validado = 2;                                                                                    //mostrarMensaje(3, 'La suma del control institucional de todas las fuerzas para este acto deben ser igual a 1.');
                    break;
                } else if (sumach > 1 || (sumach < 1 && campovacioch == 0)) {
                    me.validado = 3;                                                                                    //mostrarMensaje(3, 'La suma del control de hecho de todas las fuerzas para este acto deben ser igual a 1.');
                    break;
                }else{
                    me.validado = 1;
                }
            }
        }
    },
    habilitarGuardar: function(store, btnGuardar, btnGenerarResultados, btnObtenerResultados) {
        var me = this._getItem('objeto');

        var actos = store.actos;
        var datos = store.data.items;
        var valido = true;

        Ext.each(actos, function(act) {
            var idacto = act.idacto;
            var posi = 'i' + idacto;
            var posci = 'ci' + idacto;
            var posch = 'ch' + idacto;
            var posfpp = 'fpp' + idacto;
            var posfpi = 'fpi' + idacto;

            Ext.each(datos, function(dat) {
                if (!dat.data[posi] || !dat.data[posci] || !dat.data[posch] || !dat.data[posfpp] || !dat.data[posfpi]) {
                    valido = false;
                }
            });
        });
        if (valido) {
            if(me.validado == 1){
                btnGuardar.enable();
                btnGenerarResultados.enable();
                btnObtenerResultados.enable();
            }else {
                btnGuardar.disable();
                btnGenerarResultados.disable();
                btnObtenerResultados.disable();
                if(me.validado == 2){
                    mostrarMensaje(3, 'La suma del control institucional de todas las fuerzas para este acto deben ser igual a 1.');
                }else{
                    mostrarMensaje(3, 'La suma del control de hecho de todas las fuerzas para este acto deben ser igual a 1.');
                }
            }
        } else {
            btnGuardar.disable();
            btnGenerarResultados.disable();
            btnObtenerResultados.disable();
        }
    },
    winResultado: function(acto, oRes, altura) {
        var cantactos = oRes.length;
        var me = this;
        var btnCerrar = new ExtExtend.Components.buttons.btnCerrar({
            handler: function() {
                win.close();
            }
        });
        var btnSiguiente = new ExtExtend.Components.Button({
            iconCls: (cantactos == 1) ? 'extExtend_guardar' : 'extExtend_siguiente',
            text: (cantactos == 1) ? 'Finalizar' : 'Siguiente',
            tooltip: (cantactos == 1) ? 'Finalizar y guardar' : 'Siguiente acto',
            minWidth: 80,
            handler: function() {
                acto++;
                if (acto == cantactos) {
                    alert('integracion con gestor documental');
                } else if (acto == cantactos - 1) {
                    btnSiguiente.setText('Finalizar');
                    btnSiguiente.setIconClass('extExtend_guardar');
                    me.siguienteActo(oRes, acto, win);
                    win.render();
                    win.doLayout();
                } else {
                    me.siguienteActo(oRes, acto, win);
                    win.render();
                    win.doLayout();
                }

            }
        });
        var win = new Ext.Window({
            id: 'winResultado',
            width: 750,
            height: altura,
            closeAction: 'destroy',
            title: 'Resultados',
            autoScroll: true,
            buttons: [btnCerrar, btnSiguiente]
        });
        win.show();
        me.siguienteActo(oRes, acto, win);

    },
    siguienteActo: function(oRes, acto, win) {
        win.body.dom.innerHTML = oRes[acto];
    },
    finalizarResultados: function() {
        alert('Finalizar');
    },
    exportarResultados: function(idestudiomap, valores) {
        Secodena.mostrarMascara('reporteresultados', '', 'Generando reporte...');

        var iframe = document.createElement("iframe");
        iframe.src = document.location.protocol + '//' + document.location.host + '//planificacion/herramientasintegracion/index.php/map/getreporte?idestudiomap=' + idestudiomap + '&tiporeporte=' + valores.farchivo + '&denomreporte=' + valores.narchivo;
        iframe.style.display = 'none';
        iframe.onload = function() {
            Secodena.ocultarMascara('reporteresultados');
        }
        document.body.appendChild(iframe);

    },
	obtenerReporte: function(params){
		
        obj = {
            view: this,
            path: '/planificacion/herramientasintegracion/index.php/map/obtenerReporte',
            baseParams: {
                idestudiomap: params.idestudiomap,
                denominacion: params.denominacion,
                exportFormat:['RTF','PDF']
            },
            fnFailure : function () {
                mostrarMensaje(1, 'Por favor haga la configuraci&oacute;n del usuario.');
            }
        };

        reportesge.create(obj);

    }

});
