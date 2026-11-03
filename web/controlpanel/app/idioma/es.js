Ext.define ('Util.idioma.es', {

    alias: 'widget.idiomaES',
    idioma:{
    /**------------Principal.js-----------------------------**/

        textAyuda          : 'Ayuda',
        tooltipAyuda       : 'Ayuda <b>(Alt+H)</b>',

    /**------------PanelCenter.js-----------------------------**/
        textCargando       : 'Cargando ...',
        headerNamePack     : 'Paquetes',
        headerVersionInstall  : 'Versi&oacute;n instalada',
        headerEstado       : 'Estado',
        headerVersionPack  : 'Versi&oacute;n del paquete',
        headerDescripPack  : 'Descripci&oacute;n',  //headerEstado
        namePack           : 'Nombre del paquete:',
        emptyTextSearch    : 'Buscar',

        emptyMsgToolbar    : '0 Resultado a mostrar',
        displayMsgToolbar  : 'Mostrando de {0} - {1} de {2}',
        beforePageTextToolbar: 'Página',
        afterPageTextToolbar: 'de {0}',
        firstTextToolbar   : 'Primera Página',
        prevTextToolbar    : 'Página anterior',
        nextTextToolbar    : 'Página siguiente',
        lastTextToolbar    : 'Última Página',
        refreshTextToolbar : 'Actualizar',

        labelInstalar: '<u>I</u>nstalar',
        toolTipInstalar: 'Instalar paqute <b>(Ctrl+Shift+I)</b>',
        labelDesintalar: '<u>D</u>esintalar',
        toolTipDesintalar: 'Desinstalar paquete <b>(Ctrl+Shift+D)</b>',
        labelActualizar: 'Actuali<u>z</u>ar',
        toolTipActualizar: 'Actualizar aplicación <b>(Ctrl+Alt+Z)</b>',
        labelReinstalar: '<u>R</u>einstalar',
        toolTipReinstalar: 'Reinstalar paquete <b>(Shift+Alt+R)</b>',
        labelRevertir: 'Revertir actuali<u>z</u>aci&oacute;n',
        toolTipRevertir: 'Revertir actualizaci&oacute;n <b>(Alt+Z)</b>',

        msgReintall   : '¿Est&aacute; seguro que quiere reinstalar el paquete seleccionado?',
        labelEstado: 'Estado:',
        noseencontrarondatos       :"No existen datos que se correspondan con los criterios de búsqueda especificados.",


    /**------------PanelEast.js-----------------------------**/
        titlePanelEast : 'Detalles',

    /**------------PanelWeast.js-----------------------------**/
        titlePanelWeast     : 'Gestionar repositorios',
        textAddRepo         : 'Ad<u>i</u>cionar',
        tooltipAddRepo      : 'Adicionar repositorio <b>(Alt+I)</b>',
        textModRepo          : '<u>M</u>odificar',
        tooltipModRepo      : 'Modificar repositorio <b>(Alt+M)</b>',
        textElimRepo        : 'Eliminar',
        tooltipElimRepo     : 'Eliminar repositorio <b>(DEL)</b>',

    /**------------WinAux.js-----------------------------**/
        titlePackInstall    : 'Aplicaciones que se instalar&aacute;n',
        titlePackDesintal   : 'Aplicaciones que se desinstalar&aacute;n',
        labelDescrip        : 'Descripción',
        titlePackActual     : 'Paquetes que se actualizar&aacute;n',
        titlePackCnx        : 'Conexi&oacute;n a base de datos',
        blankText           : 'Este campo es obligatorio.',
        regexTextBd         : 'Solo admite caracteres alfanuméricos y los caracter especiales (_-.).',
        regexTextpuerto     : 'Solo se admiten n&uacute;meros',
        maxLengthText       : 'El tama&ntilde;o m&aacute;ximo requerido es de {0} caracteres.',
        maxTextL            : 'El m&aacute;ximo valor permitido es {0}.',

        labelServidor       : 'Servidor',
        labelBD             : 'Base de datos',
        labelPuerto         : 'Puerto',
        labelUsuario        : 'Usuario',
        labelPass           : 'Contrase&ntilde;a',

        textMsgInstall      : 'Instalando su aplicaci&oacute;n, por favor espere...',
        titleInstaller      : 'Instalando',
        msgDesintalar       : 'El paquete ha sido desinstalado satisfactoriamente.',
        msgErrorDesintalar  : 'Imposible desinstalar el paquete.',

        textCancelar        : 'Cancelar',
        tooltipCancelar     : 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
        textAplicar         : 'Aplicar',
        tooltipAplicar      : 'Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>',
        textAceptar         : 'Aceptar',
        tooltipAceptar      : 'Guardar datos y cerrar ventana <b>(Enter)</b>',
        textMsgAddDependen  : '¿Desea agregar esta dependencia al repositorio de paquetes?',


    /**------------TreePanelRepositorio.js---------------------**/
        textRootTreeRepo    :  'Repositorios de paquetes',


    /**------------WindAddRepo.js-----------------------------**/
        textDirUrlRepo     : 'Direcci&oacute;n URL',
        emptyTextDirUrl    : 'Dirección URL del repositorio',
        textDenominRepo    : 'Denominaci&oacute;n',
        titleWinAddRepo    : 'Adicionar repositorio',
        titleFielSetAddrepo: 'Direcci&oacute;n del nuevo repositorio',

        titleWinModRepo    :  'Modificar repositorio',
        titleElimRepo      :  'Eliminar repositorio',
        msgElimRepo        :  '¿Est&aacute; seguro que quiere eliminar el repositorio seleccionado?',


    /**------------ActionView.js---------------------------------**/
        msgLoandingMask         : 'Espere por favor...',
        msgWait                 : 'Enviando datos ...',
        titleWinModifRepo       : 'Modificar repositorio',
        titleElimRepositorio    : 'Eliminar repositorio',
        msgElimRepositorio      : '¿Seguro que desea eliminar el repositorio seleccionado?',

        tplVersion              : 'Versión: ',
        tplDescrip              : 'Descripción:',
        tplDesarroll            : 'Desarrollado por:',
        tplDependen             : 'Dependencias:',
        textEmptyData           : 'Ning&uacute;n dato que mostrar.',
        textError               : 'Error',
        textInformacion         : 'Informaci&oacute;n',

        msgReintallApp          : 'Reinstalando su aplicaci&oacute;n, por favor espere...',
        msgReintallProgess      : 'Reinstalando...',
        titleReintall           : 'Reinstalando',

        msgUpdateApp            :   'Actualizando su aplicación, por favor espere...',
        titleUpdateApp          : 'Actualizando',

        titleConfirmCompile     : 'Compilar archivos PHP',
        msgConfirmCompile       : '¿Desea compilar los archivos PHP del paquete?',

        titleDatosBD     : 'Limpiar base datos',
        msgDatosBD       : '¿Desea eliminar la información en base de datos correspondiente al paquete?'


    }

});

