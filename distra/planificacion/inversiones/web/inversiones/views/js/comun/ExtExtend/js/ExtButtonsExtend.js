/**
 * Created by john on 13/05/15.
 */

/**
 * Script con los botones del sistema
 * requires : [
 *      _ExtBase(dev).js,
 *      ExtExtends.js
 *  ]
 */

(function(_){

    var cls = _.Class,
        reg = Ext.reg,
        comps = _.Components,
        buttons = comps.buttons,
        utils = _.Utils;

    comps.baseButton = (new _.FacadeFactory({
        $extend : _.boxComponent,
        tooltipStyle: {
            'font-weight': 'bold'
        },
        tooltip: '',
        key: {},
        disableContextMenu : true,
        prepareTooltip : function(pTooltip){
            this.tooltip = (pTooltip ? pTooltip : '') + utils.getTooltip(this.key);
        },
        prepareButton : function(){
            this.key = utils.checkDataType(this.key,{});
            this.key.style = this.key.style ? this.key.style : this.tooltipStyle;

            this.prepareTooltip(this.tooltip);
        },

        getResizeEl : function(){}
    },{
        objects : {
            2 : {
                getResizeEl : function(){
                    return Ext.BoxComponent.prototype.getResizeEl.apply(this,arguments);
                }
            },
            3 : {
                getResizeEl : function(){
                    return Ext.Button.prototype.getResizeEl.apply(this,arguments);
                }
            }
        }
    })).getObject(_.ExtVersion);

    comps.Button = cls({
        $extend : Ext.Button,
        $implement : comps.baseButton,
        constructor: function (config) {
            comps.Button.superclass.constructor.apply(this,arguments);
            this.prepareButton();
        }
    });
    reg('btnButton', comps.Button);

    comps.SplitButton = cls({
        $extend : Ext.SplitButton,
        $implement : comps.baseButton,
        constructor : function(){
            comps.SplitButton.superclass.constructor.apply(this,arguments);
            this.prepareTooltip(this.tooltip);
        }
    });
    reg('SplitButton', comps.SplitButton);

    buttons.btnAceptar = cls({
        $extend : comps.Button,
        text: "Aceptar",
        iconCls: 'extExtend_aceptar',
        tooltip: "Guardar datos y cerrar ventana",
        key: {
            key: 13,
            alt: false,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAceptar', buttons.btnAceptar);

    buttons.btnCancelar = cls({
        $extend : comps.Button,
        text: "Cancelar",
        tooltip: "Cerrar ventana sin guardar los datos",
        iconCls: 'extExtend_cancelar',
        key: {
            key: 'x',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnCancelar', buttons.btnCancelar);

    buttons.btnCerrar = cls({
        $extend : buttons.btnCancelar,
        text: "Cerrar"
    });
    reg('btnCerrar', buttons.btnCerrar);

    buttons.btnAplicar = cls({
        $extend : comps.Button,
        text: "Aplicar",
        tooltip: "Guardar datos y limpiar los campos",
        iconCls: 'extExtend_aplicar',
        key: {
            key: 'p',
            alt: true,
            ctrl: true,
            shift: false
        }
    });
    reg('btnAplicar', buttons.btnAplicar);

    buttons.btnAdicionar = cls({
        $extend : comps.Button,
        text: "Ad<u>i</u>cionar",
        iconCls: 'extExtend_adicionar',
        tooltip: "Adicionar",
        key: {
            key: 'i',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAdicionar', buttons.btnAdicionar);

    buttons.btnModificar = cls({
        $extend : comps.Button,
        text: "<u>M</u>odificar",
        iconCls: 'extExtend_modificar',
        tooltip: "Modificar",
        key: {
            key: 'm',
            alt: true,
            shift: false,
            ctrl: false
        }
    });
    reg('btnModificar', buttons.btnModificar);

    buttons.btnEliminar = cls({
        $extend : comps.Button,
        text: "Eliminar",
        iconCls: 'extExtend_eliminar',
        tooltip: "Eliminar",
        key: {
            key: 46,
            alt: false,
            ctrl: false,
            shift: false
        }
    });
    reg('btnEliminar', buttons.btnEliminar);

    buttons.btnDuplicar = cls({
        $extend : comps.Button,
        text: "Duplicar",
        iconCls: 'extExtend_duplicar',
        tooltip: "Duplicar",
        key: {
            key: 'D',
            alt: true,
            ctrl: true,
            shift: false
        }
    });
    reg('btnDuplicar', buttons.btnDuplicar);

    buttons.btnGuardar = cls({
        $extend : comps.Button,
        text: "<u>G</u>uardar",
        iconCls: 'extExtend_guardar',
        tooltip: "Guardar",
        key: {
            key: 'G',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnGuardar', buttons.btnGuardar);

    buttons.btnAbrir = cls({
        $extend : comps.Button,
        text: "Abrir",
        iconCls: 'extExtend_abrir',
        tooltip: "Abrir",
        key: {
            key: 'A',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAbrir', buttons.btnAbrir);

    buttons.btnActualizar = cls({
        $extend : comps.Button,
        text: "Actuali<u>z</u>ar",
        iconCls: 'extExtend_actualizar',
        tooltip: "Actualizar",
        key: {
            key: 'Z',
            alt: true,
            ctrl: true,
            shift: false
        }
    });
    reg('btnActualizar', buttons.btnActualizar);

    buttons.btnVerDetalles = cls({
        $extend : comps.Button,
        text: "Ver <u>d</u>etalles",
        iconCls: 'extExtend_verdetalles',
        tooltip: "Ver detalles",
        key: {
            key: 'D',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnVerDetalles', buttons.btnVerDetalles);

    buttons.btnVer = cls({
        $extend : comps.Button,
        text: "Ver",
        iconCls: 'extExtend_ver',
        tooltip: "Ver",
        key: {
            key: 'V',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnVer', buttons.btnVer);

    buttons.btnAsociar = cls({
        $extend : comps.Button,
        text: "Asociar",
        iconCls: 'extExtend_asociar',
        tooltip: "Asociar",
        key: {
            key: 'K',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAsociar', buttons.btnAsociar);

    buttons.btnExportar = cls({
        $extend : comps.Button,
        text: "<u>E</u>xportar",
        iconCls: 'extExtend_exportar',
        tooltip: "Exportar",
        key: {
            key: 'E',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnExportar', buttons.btnExportar);

    buttons.btnAyuda = cls({
        $extend : comps.Button,
        text: "Ayuda",
        iconCls: 'extExtend_ayuda',
        tooltip: "Ayuda",
        key: {
            key: 'H',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAyuda', buttons.btnAyuda);

    buttons.btnVerMapa = cls({
        $extend : comps.Button,
        text: "Ver mapa",
        iconCls: 'extExtend_vermapa',
        tooltip: "Ver mapa",
        key: {
            key: 'O',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnVerMapa', buttons.btnVerMapa);

    buttons.btnCambiarDeProblema= cls({
        $extend : comps.Button,
        text: "Cambiar de problema",
        iconCls: 'extExtend_cambiardeproblema',
        tooltip: "Cambiar de problema"
    });
    reg('btnCambiarDeProblema', buttons.btnCambiarDeProblema);

    buttons.btnGraficar = cls({
        $extend : comps.Button,
        text: "Graficar",
        iconCls: 'extExtend_graficar',
        tooltip: "Graficar",
        key: {
            key: 'M',
            alt: true,
            ctrl: true,
            shift: false
        }
    });
    reg('btnGraficar', buttons.btnGraficar);

    buttons.btnBuscar= cls({
        $extend : comps.Button,
        text: "Buscar",
        iconCls: 'extExtend_buscar',
        tooltip: "Buscar",
        key: {
            key: 'B',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnBuscar', buttons.btnBuscar);

    buttons.btnLimpiar = cls({
        $extend : comps.Button,
        text: "Limpiar",
        iconCls: 'extExtend_limpiar',
        tooltip: "Limpiar",
        key: {
            key: 'L',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnLimpiar', buttons.btnLimpiar);

    buttons.btnImportar = cls({
        $extend : comps.Button,
        text: "Importar",
        iconCls: 'extExtend_importar',
        tooltip: "Importar",
        key: {
            key: 'I',
            alt: true,
            ctrl: true,
            shift: false
        }
    });
    reg('btnImportar', buttons.btnImportar);

    buttons.btnValidar = cls({
        $extend : comps.Button,
        text: "Validar",
        iconCls: 'extExtend_validar',
        tooltip: "Validar",
        key: {
            key: 'V',
            alt: true,
            ctrl: true,
            shift: false
        }
    });
    reg('btnValidar', buttons.btnValidar);
    //------------------------------------------------------------------------------------------------------------------ Gráfico Linea de tiempo
    buttons.btnAcercar = cls({
        $extend : comps.Button,
        text: "Acercar",
        iconCls: 'extExtend_adicionar',
        tooltip: "Acercar",
        key: {
            key: 'Z',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAcercar', buttons.btnAcercar);

    buttons.btnAlejar = cls({
        $extend : comps.Button,
        text: "Alejar",
        iconCls: 'extExtend_eliminar',
        tooltip: "Alejar",
        key: {
            key: 'Z',
            alt: false,
            ctrl: true,
            shift: false
        }
    });
    reg('btnAlejar', buttons.btnAlejar);

    buttons.btnIzquierda = cls({
        $extend : comps.Button,
        text: "Izquierda",
        iconCls: 'extExtend_anterior',
        tooltip: "Mover a la izquierda",
        key: {
            key: 'Q',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnIzquierda', buttons.btnIzquierda);

    buttons.btnDerecha = cls({
        $extend : comps.Button,
        text: "Derecha",
        iconCls: 'extExtend_siguiente',
        tooltip: "Mover a la derecha",
        key: {
            key: 'W',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnDerecha', buttons.btnDerecha);

    buttons.btnFiltrar = cls({
        $extend : comps.Button,
        text: "Filtrar",
        iconCls: 'extExtend_filtrar',
        tooltip: "Filtar",
        key: {
            key: 'F',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnFiltrar', buttons.btnFiltrar);

    buttons.btnUbicar = cls({
        $extend : comps.Button,
        text: "Ubicar",
        iconCls: 'extExtend_ubicar',
        tooltip: "Ubicar",
        key: {
            key: 'U',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnUbicar', buttons.btnUbicar);

    buttons.btnAjustar = cls({
        $extend : comps.Button,
        text: "Ajustar",
        iconCls: 'extExtend_ajustar',
        tooltip: "Ajustar",
        key: {
            key: 'U',
            alt: true,
            ctrl: false,
            shift: false
        }
    });
    reg('btnAjustar', buttons.btnAjustar);

    buttons.btnInicio = cls({
        $extend : comps.Button,
        text: "Inicio",
        iconCls: 'extExtend_inicio',
        tooltip: "Ir al inicio",
        key: {
            key: 'I',
            alt: false,
            ctrl: true,
            shift: false
        }
    });
    reg('btnInicio', buttons.btnInicio);
    //------------------------------------------------------------------------------------------------------------------ problema
    buttons.btnSeguimiento = cls({
        $extend : comps.Button,
        text: "Seguimiento",
        iconCls: 'extExtend_seguimiento',
        tooltip: "Seguimiento",
        key: {
            key: 'S',
            alt: false,
            ctrl: true,
            shift: false
        }
    });
    reg('btnSeguimiento', buttons.btnSeguimiento);


    //extExtend_filtro

})(ExtExtend);