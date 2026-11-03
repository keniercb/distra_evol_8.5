Utilidades.Cmp.botonGrafica = function(opciones) {
    var _this = this;
    this.idioma = opciones.idioma;
    this.entidad = opciones.nodeEntidad;
    this.idejercicio = opciones.idejercicio;
    this.ejercicio = opciones.ejercicio;

    this.winGraficas = null;
    this.pGraficas = null;

    this.mbGrafica = new Ext.Toolbar.MenuButton({
        id: 'btnGraficasInversiones',
        disabled: true,
        text: 'Graficar',
        tooltip: "Graficar",
        iconCls: 'graficar',
        scope:this,
        menu: {
            items: [{
                id: 'controlejecucion',
                itemCls: 'x-menu-item icondistra-reportegrafico',
                iconCls: 'imagen-none',
                //tooltip: 'Ver Demanda',
                text: 'Control de la ejecuci\xF3n',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 0);
                }
            }, {
                id: 'formapropiedad',
                itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-verde',
                iconCls: 'imagen-none',
                text: 'Plan-Forma de Propiedad',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 1);
                }
            }, {
                id: 'tipocredito',
                // icon: perfil.dirImg + 'ver.png',
                itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-rojo',
                iconCls: 'imagen-none',
                text: 'Inversiones por tipo de finaciamiento',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 2);
                }
            }, {
                id: 'costoinversion',
                // icon: perfil.dirImg + 'ver.png',
                itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-amarillo',
                iconCls: 'imagen-none',
                text: 'Inversiones m\xE1s costosas',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 3);
                }
            }, {
                id: 'equipos',
                itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-negro',
                iconCls: 'imagen-none',
                text: 'Equipos',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 4);
                }
            }, {
                id: 'masequipos',
                itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-rosado',
                iconCls: 'imagen-none',
                text: 'Inversiones con m\xE1s equipos',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 5);
                }
            }, {
                id: 'tipoinversion',
                itemCls: 'x-menu-item icondistra-reportegrafico  sisplanico-azul',
                iconCls: 'imagen-none',
                text: 'Resumen por tipo de inversi\xF3n',
                handler: function() {
                    _this.mostrarVentanaGraficas(_this.entidad, _this.idejercicio, _this.ejercicio, 6);
                }
            }]
        }
    });

    this.botonMenuGrafica = function() {
        return this.mbGrafica;
    };

    this.actualizarParametros = function(nodeEntidad, idejercicio, ejercicio) {
        _this.entidad = nodeEntidad;
        _this.idejercicio = idejercicio;
        _this.ejercicio = ejercicio;

        graficas = _this.getGraficas();
        graficas.actualizarParametros(nodeEntidad, idejercicio, ejercicio);
    };

    this.mostrarVentanaGraficas = function(nodeEntidad, idejercicio, ejercicio, tabActivo){

        _this.crearVentana();
        _this.actualizarParametros(_this.entidad, _this.idejercicio, _this.ejercicio);
        _this.winGraficas.setTitle(_this.entidad.text);
        _this.winGraficas.show();
        _this.pGraficas.activate(tabActivo);
    };

    this.getGraficas = function(){
        this.Graficas = new Utilidades.Cmp.CmpGrafica({
            idioma: this.idioma,
            ejercicio: this.idejercicio,
            idejercicio: this.idejercicio,
            nodeEntidad:  this.entidad
        });

        return this.Graficas;
    }

    this.crearVentana = function(){

        this.Graficas = new Utilidades.Cmp.CmpGrafica({
            idioma: this.idioma,
            ejercicio: this.ejercicio,
            idejercicio: this.idejercicio,
            nodeEntidad:  this.entidad
        });

        _this.pGraficas = this.Graficas.panelGraficas();

        this.winGraficas = new Ext.Window({
            title: '',
            closable: true,
            graggable: false,
            maximized: true,
            modal: true,
            border: false,
            layout: 'border',
            closeAction: 'close',
            items: [_this.pGraficas]
        });
    }
}
