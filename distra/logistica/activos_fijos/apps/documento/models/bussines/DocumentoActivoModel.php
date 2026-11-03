<?php

/**
 *
 */
class DocumentoActivoModel extends DocumentoLogisticaModel
{
    //protected $_sConfGeneral;
    protected $_sEstrComposicion;
    protected $_sContabilidad;
    protected $_sRecHumanos;
    protected $_sMovimiento;
    protected $_sRegNumerico;
    protected $_mMaestroProd;
    protected $_mProdLog;
    protected $_mRegNumerico;
    protected $_mRegNumActivo;
    protected $_mComunAFT;
    protected $_oDatDocumento;
    protected $_sConfGeneral;
    protected $idsubsistema;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        $this->idsubsistema = $idsubsistema;
        parent::__construct(
            array('alias' => 'MMAFT', 'noexception' => true, 'subsistema' => $this->idsubsistema)
        );

        $this->estados = array(
            1 => 'Elaboración', 2 => 'Preparado', 3 => 'Aprobado', 5 => 'Anulado', 6 => 'Cancelado'
        );
//        $this->slogiticaDoc = $this->documentosHelper;        
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();


        $this->_sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        $this->_sRecHumanos = ServiciosRecursosHumanosHelper::__init();

        // Se comentario para mejorar rendimiento
        $this->_sMovimiento = new MovimientoService($this->idsubsistema);
        $this->_sRegNumerico = new RegNumericoService();

        $this->_mMaestroProd = new MaestroProductoModel();
        $this->_mProdLog = new LogisticaProductoModel();
        $this->_mRegNumerico = new RegNumericoModel();
        $this->_mRegNumActivo = new RegNumericoActivoModel($this->idsubsistema);
        $this->_oDatDocumento = new DatDocumentoActivo();

        $this->_mComunAFT = ComunAFTModel::getInstance($this->idsubsistema);
    }

    /**
     *
     */ /*    Esto se comentario porque ya existe un metodo llamado asi mismo en la clase padre(Adrian)
      public function devolverUltimoNumeroDoc($iddoc = null, $idestructuracomun = null)
      {
      $query = new Doctrine_Query();
      $query->select('MAX(d.nrodoc) as numero')
      ->from('DatDocumento d');
      $query->addWhere('d.iddoc = ?', array($iddoc));
      $query->whereIN('d.idestructuracomun', $this->_mComunAFT->getIdEstructurasHijas($idestructuracomun));
      $numero = $query->fetchArray();
      return $numero[0]['numero'];
      } */

    /**
     *
     */
    public function existeDocumento($idDocumento, $estado = 1)
    {
        $query = new Doctrine_Query();
        $query->from('DatDocumento d');
        $query->addWhere('d.iddocumento = ? and d.estado = ?', array($idDocumento, $estado));

        return ($query->count() == 1) ? true : false;
    }

    // Este es el que hay que modificar para cargar los documentos a la hora de adicionar,
    // siempre y cuando que vengan los parametros de: areasseleccionada= arearesp y idestructura = 100000532
    // El parametro $paraLosDocumentos es para saber si se esta llamadno esta funcion para cargar los tipos de
    // documentos en dependencia de las operaciones.
    /**
     *
     */
    public function getOperaciones($parametros, $paraLosDocumentos = false, $cargarInveParcialTotal = true)
    {
        if (!$parametros['iddoc'] && !$paraLosDocumentos) {
			$codigo = ($parametros['codigooper']) ? $parametros['codigooper'] : false;
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                $parametros['operacionEspecifica'], false, $codigo, false, $parametros['idestructura'], ($parametros['idDocPrim'])?$parametros['idDocPrim']:0,
                $parametros['idfuncionalidad']
            );
        } else {
            $configServ = new ConfiguracionActivosService();
            $result = $configServ->getConfiguracionPG($this->global->Estructura->idestructura, ($this->idsubsistema == LogisticaGlobal::SUBSISTEMA_AFT) ? 0 : 1);
            $flag = $this->objectHelper->getBooleanStr($result[0]['contabilidad']);
            $operaciones = self::getOperacionesAux($flag, $parametros);
        }

        if (
            $parametros['operacionEspecifica'] && $parametros['operacionEspecifica'] == 17 && count($operaciones) == 0
        ) {
            /**
             *  Exepción lanzada para el caso de no encontrarse operaciones configuradas para el caso de una recepción
             *  de un traslado desde otra entidad
             */
            throw new ZendExt_Exception('LOG_AFT_DOC_007');
        }
        if (!$cargarInveParcialTotal) {
            foreach ($operaciones as $pos => $oper) {
                if ($oper['codigo'] == "OPER_AJUSTE_FALTANTE" || $oper['codigo'] == "OPER_AJUSTE_SOBRANTE") {
                    unset($operaciones[$pos]);
                }
            }
        }
        return array_values($operaciones);
    }

    /**
     * @param $flag
     * @param $parametros
     *
     * @return array
     */
    public function getOperacionesAux($flag, $parametros)
    {
        if ($flag && $flag != 'false') {
            if ($this->configuracionHelper->subsistemaAperturado(
                    $this->global->Estructura->idestructura, $this->idsubsistema//$parametros['subsistema']
                ) == 0
            ) {
                // Estoy en carga inicial y solo debo cargar operacion apertura
                $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                    $parametros['operacionEspecifica'], false, 'OPER_APERTURA', false, $parametros['idestructura'],
                    $parametros['iddoc'], $parametros['idfuncionalidad']
                );
            } else {
                // No estoy en carga inicial y no se pueden cargar las aperturas

                $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                    $parametros['operacionEspecifica'], false, false, false, $parametros['idestructura'],
                    $parametros['iddoc'], $parametros['idfuncionalidad']
                );

                foreach ($operaciones as $pos => $oper) {
                    if ($oper['codigo'] == 'OPER_APERTURA') {
                        unset($operaciones[$pos]);
                        break;
                    }
                }
                $operaciones = array_values($operaciones);
            }
        } else {
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                $parametros['operacionEspecifica'], false, false, false, $parametros['idestructura'],
                $parametros['iddoc'], $parametros['idfuncionalidad']
            );
        }

        return $operaciones;
    }

    /**
     *
     * @param $idDocumento
     * @return array
     */
    private function getProductosEnDocumento($idDocumento)
    {
        $_sMovimiento = new MovimientoService();
        $query = $_sMovimiento->getQueryDatMovimientos('m', false);
        $query->addSelect('m.idmovimiento, m.idproducto');
        $query->addWhere('m.iddocumento = ?', array($idDocumento));

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getJoinDocActivos(Doctrine_Query $query, $aliasExt, $alias = 'de', $onlyRoot = false)
    {//
        $query->innerJoin("{$aliasExt}.DatDocumentoActivo $alias")
            ->addSelect("de.idcentrocosto as idcentrocosto")
            // ----- Utilizado hasta el momento para los cambios masivos de responsables --
            ->addSelect("{$alias}.idareadestino as idareadestino")
            ->addSelect("{$alias}.idresponsabledestino as idresponsabledestino")
            ->addSelect("{$alias}.idcentrocostodestino as idcentrocostodestino")
            // -----
        ;

        if (!$onlyRoot) {
            $query->leftJoin("{$alias}.DatResponsable resp")
                ->leftJoin("resp.DatPersona pers")
                ->addSelect("(pers.nombre || ' ' || pers.papel || ' ' || pers.sapel) as nombreresponsabledestino");

            $query->leftJoin("{$alias}.DatDocEnviadoReparar er")
                ->addSelect(
                    "er.identidaddestino as identidaddestinoenvrep, er.idtransportador as idpersona, er.chapatransportador as chapatransportador"

                );
            /* addSelect(
              "er.identidaddestino as identidaddestinoenvrep, er.idclientesproveedores as idclientesproveedores"
              ."envrep"
              ) */

            $query->leftJoin("{$alias}.DatDocBajaDesarme bd")
                ->addSelect(
                    "bd.entidad as entidadBajadesarme,bd.iddestinofinal as iddestinofinalBajadesarme, bd.informetecnico"
                    . " as informetecnicoBajadesarme"
                );

            $query->leftJoin("{$alias}.DatDocBajaVenta bv")
                ->addSelect(
                    "bv.entidad as entidadBajaVenta,bv.iddestinofinal as iddestinofinal,
                    bv.nrocontrato as nrocontratoBajaVenta,bv.informetecnico as informetecnico, 
                    bv.idclientesproveedoresbajaventa as idclientesproveedoresbajaventa"
                );
            /* ->addSelect(
              "bv.entidad as entidadBajaVenta,bv.iddestinofinal as iddestinofinal,
              bv.nrocontrato as nrocontratoBajaVenta,bv.informetecnico as informetecnico, bv.idclientesproveedoresbajaventa as idclientesproveedoresbajaventa "
              ); */
            $query->leftJoin("{$alias}.DatDocAlquiler docalquiler")
                ->addSelect(
                    "docalquiler.nrocontrato as nrocontratoalquiler, "
                    . "docalquiler.fechainicio as fechainicioalquiler, docalquiler.fechafin as fechafinalquiler, "
                    . "docalquiler.direccion as direccionalquiler, docalquiler.idcliente as idclientealq"
                );
            /* ->addSelect(
              "docalquiler.idcliente as idclientealquiler,docalquiler.nrocontrato as nrocontratoalquiler, "
              ."docalquiler.fechainicio as fechainicioalquiler, docalquiler.fechafin as fechafinalquiler, "
              ."docalquiler.direccion as direccionalquiler"
              ); */

            $query->leftJoin("{$alias}.DatDocUsufructo usufruc")
                ->addSelect(
                    "usufruc.nrocontrato as nrocontratousuf, "
                    . "usufruc.fechainicio as fechainiciousuf, usufruc.fechafin as fechafinusuf, "
                    . "usufruc.direccion as direccionusuf, usufruc.idcliente as idclienteusuf"
                );
            /* ->addSelect(
              "usufruc.idcliente as idclientealusuf,usufruc.nrocontrato as nrocontratousuf, "
              ."usufruc.fechainicio as fechainiciousuf, usufruc.fechafin as fechafinusuf, "
              ."usufruc.direccion as direccionusuf"
              ); */
            $query->leftJoin("{$alias}.DatDocArrendamiento arr")
                ->addSelect(
                    "arr.nrocontrato as nrocontratoarr, "
                    . "arr.fechainicio as fechainicioarr, arr.fechafin as fechafinarr, "
                    . "arr.direccion as direccionarr, arr.idcliente as idclientearrend"
                );
            /* ->addSelect(
              "arr.idcliente as idclientearr,arr.nrocontrato as nrocontratoarr, "
              ."arr.fechainicio as fechainicioarr, arr.fechafin as fechafinarr, "
              ."arr.direccion as direccionarr"
              ); */

            $query->leftJoin("{$alias}.DatDocAltaCompra docaltacompra")
                ->addSelect(
                    "docaltacompra.nrocontrato as nrocontrato, docaltacompra.nrofactura as nrofactura"
                );
            /* ->addSelect(
              "docaltacompra.idclientesproveedores as idclientesproveedores,
              docaltacompra.nrocontrato as nrocontrato, docaltacompra.nrofactura as nrofactura"
              ); */

            $query->leftJoin("{$alias}.DatDocPrestamo prestamo")
                ->addSelect(
                    "prestamo.idpersona as idpersona, prestamo.idclientesproveedores as idclientesproveedorespres"
                );
            /* ->addSelect(
              "prestamo.idclientesproveedores as idclientesproveedoresprestamo,
              prestamo.idpersona as idpersona"
              ); */

            $query->leftJoin("{$alias}.DatDocInventarioParcial dociventario")
                ->addSelect("dociventario.mensual as mensualInventario,dociventario.areas as idareasInventario");

            $query->leftJoin("{$alias}.DatDocumentoOrigen docorigen")
                ->addSelect(
                    "docorigen.fecha as fecha,docorigen.iddocinventario as iddocinventario,
                 docorigen.clave as clave,docorigen.numero as numero"
                );

            $query->leftJoin("{$alias}.DatDocTransferenciaEntidades doctranfentidades")
                ->addSelect("doctranfentidades.identidaddestino as identidaddestino");                
        }
        return $query;
    }

    /**
     *
     */
    public function getDocumentosActivos($parametros)
    {
        new DatDocumentoActivo();
        $query = $this->getQueryDocumento('d');

        if($parametros['idarearesp']){
            $parametros['idestructuracomun'] = $parametros['idarearesp'];
        }else{
            $classEstructura = 'Estructura';
            $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
            $parametros['idestructura'] = ($parametros['idestructuracomun']) ? $parametros['idestructuracomun'] :
                $idEstructuraGlobal;
            // Buscar los id de las estructuras hijas de la estructura seleccionada
            /* $parametros['idestructuracomun'] = $this->_mComunAFT->getIdEstructurasHijas(
                 $parametros['idestructuracomun'], true
             );*/
            $parametros['idestructuracomun'] = $this->_mComunAFT->getIdsAreasHijas();
            $parametros['idestructuracomun'][] = $parametros['idestructura'];
            unset($parametros['idestructura']);
        }

        $query = $this->addFiltersQueryDocumento($query, $parametros, 'd');
        if (!is_null($parametros['tipo'])) {
            $query->addWhere('de.tipo = ?', array($parametros['tipo']));
        }
        if ($parametros['masivo']) {
            $query->addWhere('de.masivo = ?', array(1));
        } else {
            $query->addWhere('de.masivo = ?', array(0));
        }
        $query = $this->getJoinDocActivos($query, 'd');
        $query->leftJoin('d.DatDocumentoCliente dclient');
        $query->addSelect('d.idcomprobante as idcomprobante');
        $query->addSelect('dclient.idcliente as idcliente');
        $query->addSelect('d.observaciones as observaciones');
        $query->addSelect('dclient.idcondicionpago as idcondicionpago');
        $query->addSelect(
            "ROUND((COALESCE ((SELECT SUM(mov.cantidad)
             FROM DatMovimientos mov WHERE mov.iddocumento = d.iddocumento), 0)),0) as cant_medios"
        );
        $total = $query->count();
        new DatMovRegnumerico();
        new DatMovRegnumericoActivo();
        $query->addSelect(
            "ROUND((COALESCE ((
                SELECT SUM( 
                    CASE WHEN movrna1.diferenciavalor > 0 THEN movrna1.diferenciavalor ELSE movrna1.valorcontable END
                )
                FROM DatMovimientos mov1
                INNER JOIN mov1.DatMovRegnumerico movrn1
                INNER JOIN movrn1.DatMovRegnumericoActivo movrna1
                WHERE mov1.iddocumento = d.iddocumento
            ), 0)),2) as importe"
        );
        // print_r($query->getSqlQuery());die;

        if ($parametros['start'] >= 0 && $parametros['limit'] >= 0) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        $tempDatos = $query->fetchArray();

        $areasdlDoc = array();
        $areasDestDoc = array();

        foreach ($tempDatos as &$documento) {

            $documentoOrigen = Doctrine::getTable('DatDocumentoPadre')
                ->findByDql('idpadre =?', array($documento['iddocumento']));

            $this->getDocumentosActivosAux($documentoOrigen, $documento, $areasdlDoc);

            $areaResp = $areasdlDoc[$documento['idestructuracomun']];

            if ($documento['idestructuradocgenerado'] != null) {
                $idAreaG = $documento['idestructuradocgenerado'];
                (!$areasdlDoc[$idAreaG]) ?
                    //$areasdlDoc[$idAreaG] = $this->_sEstrComposicion->getEstructura($idAreaG) : '';
                    $areasdlDoc[$idAreaG] = $this->integrator->metadatos->DameEstructura($idAreaG) : '';
                $areaRespG = $areasdlDoc[$idAreaG];
                $documento['denomestructuradocgenerado'] = $areaRespG[0]->denominacion;
            }
            if ($documento['identidaddestinoenvrep'] != null) {
                $idAreaG = $documento['identidaddestinoenvrep'];
                (!$areasdlDoc[$idAreaG]) ?
                    //$areasdlDoc[$idAreaG] = $this->_sEstrComposicion->getEstructura($idAreaG) : '';
                    $areasdlDoc[$idAreaG] = $this->integrator->metadatos->DameEstructura($idAreaG) : '';
                $areaRespG = $areasdlDoc[$idAreaG];
                $documento['denomestructuradocenvrep'] = $areaRespG[0]->denominacion;
            }
            $destino = $this->getReturnDestino($documento);
            if ($destino != null) {
                $documento['destino'] = $destino;
            }

            $documento['arearesp'] = $areaResp[0]->denominacion;
            //area destino
            if (is_numeric($documento['idareadestino'])) {
                if (!$areasDestDoc[$documento['idareadestino']]) {
                    $areasDestDoc[$documento['idareadestino']] = $this->integrator->metadatos->DameEstructura($documento['idareadestino']);
                }
                $documento['denomarearespdestino'] = $areasDestDoc[$documento['idareadestino']][0]->denominacion;
            }

            //$documento['arearesp'] = $areaResp['denominacion'];
            $documento['idarearesp'] = $documento['idestructuracomun'];
           // $documento['idusuario'] = $documento['idusuario'];

            if($documento['idcomprobante'] != null && $documento['idcomprobante'] != -1){
                $sql = "SELECT * FROM mod_contabilidad.dat_comprobante comp 
                        WHERE comp.idcomprobante = {$documento['idcomprobante']}";
                $conn = Zend_Registry::get('conexion');
                $comprobante = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $documento['numerocomprobante'] = $comprobante[0]['numerocomprobante'];
            }
            $sql = "SELECT nombreusuario FROM mod_seguridad.seg_usuario segus INNER JOIN mod_logistica.dat_documento doc on segus.idusuario = doc.idusuario
            WHERE segus.idusuario = {$documento['idusuario']}";
            $conn = Zend_Registry::get('conexion');
            $comprobante = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $documento['usuario'] = $comprobante[0]['nombreusuario'];
            $documento['usuariocreador'] = $comprobante[0]['nombreusuario'];

            if ($documento['usuario']) {
                $sql = "
                select did.numero as idsuin
                from mod_seguridad.seg_usuario usu
                inner join mod_persona.dat_persona per on(usu.idpersona = per.idpersona)
                inner join mod_persona.dat_docidentidad did on(per.idpersona = did.idpersona and did.principal = 1)
                where usu.idusuario = {$documento['idusuario']}
            ";
            $conn = Zend_Registry::get('conexion');
            $rres = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $documento['cicreadopor'] = $rres[0]['idsuin'];
            }

            if ($documento['aprobadopor']) {
                $sql = "
                select did.numero as idsuin,usu.nombreusuario
                from mod_seguridad.seg_usuario usu
                left join mod_persona.dat_persona per on(usu.idpersona = per.idpersona)
                left join mod_persona.dat_docidentidad did on(per.idpersona = did.idpersona and did.principal = 1)
                where usu.idusuario = {$documento['aprobadopor']}
            ";
            $conn = Zend_Registry::get('conexion');
            $rres = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $documento['ciaprobadopor'] = $rres[0]['idsuin'];
            $documento['usuarioaprobador'] = $rres[0]['nombreusuario'];
            }
        }
        //print_r($tempDatos);
        $docsOper = [];
        foreach($tempDatos as &$documento){
            $docsOper[] = $documento['idoperacion'];
        }
        $operacionContable = [];
        if(count($docsOper) > 0){
            $sql1 = "SELECT * FROM mod_datosmaestros.nom_operacion oper 
                        WHERE oper.idnomoperaciones IN (".implode(",", $docsOper).")";
                        
            $conn1 = Zend_Registry::get('conexion');
            $operacionContable = $conn1->execute($sql1)->fetchAll(PDO::FETCH_OBJ);
        }

        foreach($tempDatos as &$documento){
            foreach($operacionContable as $oper){
                if($documento['idoperacion'] == $oper->idnomoperaciones){
                    $documento['codigooperacion'] = $oper->codigooperacion;
                }
            }
        }
        

        return array('cantidad' => $total, 'datos' => $tempDatos);
    }

    public function getReturnDestino($identidaddestino)
    {
        if ($identidaddestino['identidaddestino'] != null) {
            $idfila = $identidaddestino['identidaddestino'];
        } else if ($identidaddestino['identidaddestinoenvrep'] != null) {
            $idfila = $identidaddestino['identidaddestinoenvrep'];
        } else if ($identidaddestino['iddestinofinalBajadesarme'] != null) {
            $iddestinofinal = $identidaddestino['iddestinofinalBajadesarme'];
        } else if ($identidaddestino['idclientesproveedoresbajaventa']) {
            $idcliente = $identidaddestino['idclientesproveedoresbajaventa'];
        } else if ($identidaddestino['iddestinofinal'] != null) {
            $iddestinofinal = $identidaddestino['iddestinofinal'];
        } else if ($identidaddestino['idclientealq'] != null) {
            $idcliente = $identidaddestino['idclientealq'];
        } else if ($identidaddestino['idclientesproveedorespres'] != null) {
            $idcliente = $identidaddestino['idclientesproveedorespres'];
        } else if ($identidaddestino['idclienteusuf'] != null) {
            $idcliente = $identidaddestino['idclienteusuf'];
        } else if ($identidaddestino['idclientearrend'] != null) {
            $idcliente = $identidaddestino['idclientearrend'];
        }

        if ($idfila != null) {
            //$denominacion = $this->_sEstrComposicion->getEstructura($idfila);
            $denominacion = $this->integrator->metadatos->DameEstructura($idfila);
            return $denominacion[0]->denominacion;
        }

        if ($iddestinofinal != null) {
            $destinofinal = Doctrine::getTable('NomDestinoFinal')->find($iddestinofinal);
            return $destinofinal->denominacion;
        }
        if ($idcliente != null) {
            $cliente = DatosMaestrosHelper::__init();
            $dat = $cliente->getClientesProveedorByParams($idcliente);
            return $dat['datos'][0]['nombre'];
        }
        if ($identidaddestino['idestructuradocgenerado'] != null) {
            //$denominacion = $this->_sEstrComposicion->getEstructura($identidaddestino['idestructuradocgenerado']);
            $denominacion = $this->integrator->metadatos->DameEstructura($identidaddestino['idestructuradocgenerado']);
            return $denominacion[0]->denominacion;
        }
    }

    public function getDocumentosActivosAux($documentoOrigen, &$documento, &$areasdlDoc)
    {

        $cDatDocumentoActivo = 'DatDocumentoActivo';
        if ($documentoOrigen) {
            $objDocgenerado = Doctrine::getTable('DatDocumento')->find($documentoOrigen[0]->iddocumento);
            $idEstrucDocGenerado = ($objDocgenerado->idestructuracomun) ? $objDocgenerado->idestructuracomun : null;
            $idCCostoDocGenerado = ($objDocgenerado->$cDatDocumentoActivo->idcentrocosto) ?
                $objDocgenerado->$cDatDocumentoActivo->idcentrocosto : null;
        }

        if ($documento['identidaddestino']) {
            $idEstrucDocGenerado = $documento['identidaddestino'];
        }

        $documento['idestructuradocgenerado'] = $idEstrucDocGenerado;
        $documento['idcentrocostodocgenerado'] = $idCCostoDocGenerado;
        if (!$areasdlDoc[$documento['idestructuracomun']]) {
            $idArea = $documento['idestructuracomun'];
            $areasdlDoc[$idArea] = $this->integrator->metadatos->DameEstructura($idArea);
            //$this->_sEstrComposicion->getEstructura($idArea);
        }
    }

    /**
     *
     */
    public function getListadoDocSubSisteActivos($idEstructura)
    {
        return $this->_sConfGeneral->documentosPorSubsistemaEntidad($this->idsubsistema, $idEstructura);

    }

    /**
     *
     */
    public function getTiposDeReporteOperaciones($idOperacion)
    {
        $datos = $this->_mComunAFT->getDatosInterfazByIdOperacion($idOperacion);

        if ($datos['reportes']) {
            if ($datos['reportes'][0]) {
                return $datos['reportes'];
            }
            return array($datos['reportes']);
        }
        return array();
    }

    /**
     * @param $operaciones
     * @param $arrIdDocs
     * @param $parametros
     */
    public function auxGetTiposDocumentos($operaciones, &$arrIdDocs, $parametros)
    {
        foreach ($operaciones as $operacion) {

            if ($operacion['codigo'] != 'OPER_DEPRECIACION' && (array_search($operacion['iddoc'], $arrIdDocs) === false)
            ) {
                if ($parametros['operacionesEntrada'] != -1) {
                    if ($operacion['tipo'] == 'entrada' && $operacion['autogenerada'] == '0') {
                        array_push($arrIdDocs, $operacion['iddoc']);
                    }
                } else {
                    self::auxGetTiposDocumentosDos($operacion, $arrIdDocs, $parametros);
                }
            }
        }
    }

    /*     * *
     * @param $operacion
     * @param $arrIdDocs
     * @param $parametros
     */

    public function auxGetTiposDocumentosDos($operacion, &$arrIdDocs, $parametros)
    {
        if ($parametros['areaseleccionada'] == 'arearesp' && $operacion['codigo'] != 'OPER_INV_TOTAL') {
            array_push($arrIdDocs, $operacion['iddoc']);
        } else {
            if (($operacion['codigo'] == 'OPER_INV_TOTAL' || $operacion['codigo'] == 'OPER_INV_PARCIAL') && ($parametros['areaseleccionada'] == 'otra' || $parametros['areaseleccionada'] == 'entidad')
            ) {
                array_push($arrIdDocs, $operacion['iddoc']);
            }
        }
    }

    /**
     * @param $parametros
     *
     * @return array
     * @throws ZendExt_Exception
     */
    public function getTiposDocumentos($parametros)
    {
        $documentos = array();
        $arrIdDocs = array();
        $operaciones = $this->getOperaciones($parametros, true);
        self::auxGetTiposDocumentos($operaciones, $arrIdDocs, $parametros);
        $arrTipoDocs = $this->configuracionHelper->documentosPorSubsistemaEntidad(
            $parametros['subsistema'], $parametros['idestructura'], array()
        );

        foreach ($arrIdDocs as $iddoc) {
            foreach ($arrTipoDocs as $docsSubSistema) {
                if ($docsSubSistema->iddoc == $iddoc) {
                    array_push($documentos, $docsSubSistema);
                }
            }
        }

        return $documentos;
    }

    /**
     *
     */
    protected function getMovDadoIdDoc($color, $idDocumento)
    {
        $sRegNumActivo = new RegNumActivoService();


        $mMovRegNum = new MovRegNumericoModel();

        $_sMovimiento = new MovimientoService();
        $query = $mMovRegNum->getDqlMovsRegNumericos(array(), 'mr');
        $_sMovimiento->getJoinDatMovimiento($query, 'mr', 'm');
        $query->leftJoin("m.DatProductoLogistica p");

        $sRegNumActivo->getJoinMovRegNumericoActivo($query, 'mra', 'mr', true, true, false);

        $sRegNumActivo->getJoinMovRegNumericoInventario($query, 'mri', 'mra', true, true, false);

        $query->addSelect(
            'm.idmovimiento as idmovOld, m.cantidad as cantidad_old'
        );

        $query->addSelect(
            'p.idestructura as idestructuraop, p.idproducto as idproducto'
        );

        $query->addSelect(
            '(SELECT COUNT(m2.idmovimiento) FROM DatMovimientos m2
             INNER JOIN m2.DatMovRegnumerico mr2
             INNER JOIN m2.DatProductoLogistica p2
             INNER JOIN mr2.DatMovRegnumericoInventario mri2
             WHERE  p.idestructura = p2.idestructura and m.idmovimiento = m2.idmovimiento and mri.color = mri2.color)
             AS cantidad
            '
        );

        if ($color) {
            $query->addWhere('mri.color = ?', array($color));
        }

        $query->addWhere('m.iddocumento = ?', array($idDocumento));
        $query->orderBy('idestructuraop, idproducto, idregnumerico ASC');

        $datos = $query->fetchArray();
        $enviar = Array();
        foreach ($datos as $dat) {
            unset($dat['idmovregnumerico']);
            unset($dat['idmovimiento']);
            unset($dat['iddocumento']);

            $enviar[] = $dat;
        }

        return $enviar;
    }

    /**
     * Este método se utiliza en el grid de servicio de documento->"griddocumento.serv.js"
     * para cargar los doc que sean solo de operaciones de entrada para cada entidad/area de responsabilidad
     */
    public function getOperacionesEntrada($parametros)
    {
        if (!$parametros['idestructura']) {
            $classEstructura = 'Estructura';
            $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
            $parametros['idestructura'] = $idEstructuraGlobal;
        }
        $result = array();

        $operaciones = $this->getOperaciones($parametros, true);
        foreach ($operaciones as $value) {
            if ($value['tipo'] == 'entrada' && $value['autogenerada'] == '0') {
                $result[] = $value;
            }
        }
        return $result;
    }

    private function getOperacionCambProp() {
        $conn = Zend_Registry::get('conexion');

        $result = $conn->execute(
            "select op.idnomoperaciones from mod_datosmaestros.nom_operacion op 
             where op.codigooperacion in ('OPER_MOD_PROPIEDAD','OPER_MOD_PROP_UH') and idsubsistema = {$this->idsubsistema}"
        )->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    /**
     * Método que devuelve los documentos que contabilizan según la configuración realizada en configuracion.xml
     */
    public function getDocumentosContabilizan()
    {
        $arrIdesOper = $this->_mComunAFT->getArrayIdOpersQueContabililzan(false);
        //print_r($arrIdesOper);die;
        $idOperModProp = $this->getOperacionCambProp();

        $query = Doctrine_Query::create()->addSelect(
            'd.iddocumento,d.nrodoc,d.fechacontable,d.idusuario,
            d.iddoc,d.idoperacion, ndocp.denominacion as documento, d.estado as estado'
        );
        $query->addSelect(
            '(SELECT SUM(mra.valorcontable) 
            FROM DatMovRegnumerico mrn, DatMovRegnumericoActivo mra, DatMovimientos m
             WHERE m.iddocumento = d.iddocumento AND m.idmovimiento = mrn.idmovimiento
              AND mrn.idmovregnumerico = mra.idmovregnumerico) 
              AS importetotal'
        );

        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $dualidad = 0;
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $dualidad = 1;
                break;
            }
        }

        if ($dualidad) {
            $query->addSelect(
                '(SELECT SUM(mra1.valorcontablealternativo) FROM DatMovRegnumerico mrn1, DatMovRegnumericoActivo mra1, DatMovimientos m1
             WHERE m1.iddocumento = d.iddocumento AND m1.idmovimiento = mrn1.idmovimiento
              AND mrn1.idmovregnumerico = mra1.idmovregnumerico) AS importetotalalt');
        }


        $query->addSelect(
            '(SELECT SUM(COALESCE(mra2.depreciacion,0)) FROM DatMovRegnumerico mrn2, DatMovRegnumericoActivo mra2, DatMovimientos m2
             WHERE m2.iddocumento = d.iddocumento AND m2.idmovimiento = mrn2.idmovimiento
              AND mrn2.idmovregnumerico = mra2.idmovregnumerico) AS depreciaciontotal'
        );

        if ($dualidad) {
            $query->addSelect(
                '(SELECT SUM(COALESCE(mra3.depreciacioncuc,0)) FROM DatMovRegnumerico mrn3, DatMovRegnumericoActivo mra3, DatMovimientos m3
                 WHERE m3.iddocumento = d.iddocumento AND m3.idmovimiento = mrn3.idmovimiento
                  AND mrn3.idmovregnumerico = mra3.idmovregnumerico) AS depreciaciontotalalt'
            );
        }

        $query->from("DatDocumento d")
            ->innerJoin("d.DatDocumentoprim docp")
            ->innerJoin('docp.DatEstructurasubsist ess')
            ->innerJoin('docp.NomDocprim ndocp')
            ->whereIn("d.idoperacion", $arrIdesOper)
            ->addWhere("d.estado = 3 AND d.idcomprobante IS NULL and ess.idestructuracomun = {$this->global->Estructura->idestructura}")
        ;

        if (count($idOperModProp)){
            $query->orWhere("d.estado = 3 AND d.idcomprobante IS NULL and ess.idestructuracomun = {$this->global->Estructura->idestructura} and 
                d.idoperacion in (".implode(',', $idOperModProp).") and (
                SELECT COUNT(dmrna.idmovregnumerico) FROM DatMovRegnumericoActivo dmrna
                INNER JOIN dmrna.DatMovRegnumerico dmrn
                INNER JOIN dmrn.DatMovimientos mov
                WHERE mov.iddocumento = d.iddocumento AND dmrna.idgruposubgrupo <> dmrna.idgruposubgrupoold
            ) > 0");
        }

        $data = $query->fetchArray();

        foreach ($data as $index => $dat) {
            $operacion = $this->configuracionHelper->obtenerOperaciones(0, 0, 0, $dat['idoperacion']);
            $data[$index]['operacion'] = $operacion[0]['denominacion'];
            if ($operacion[0]['codigooperacion'] == 'OPER_DEPRECIACION') {
                $data[$index]['importetotal'] = $this->importeTotalDocumentoByID($dat['iddocumento'], 'depreciacion');
                $data[$index]['importetotalalt'] = $this->importeTotalDocumentoByID($dat['iddocumento'], 'depreciacioncuc');
            }else if(
                $operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR' ||
                $operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR_DIS' ||
                $operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR_UH' ||
                $operacion[0]['codigooperacion'] == 'OPER_MOD_VALOR_DIS_UH')
            {
                $data[$index]['importetotal'] = $this->importeTotalDocumentoByID($dat['iddocumento'], 'diferenciavalor') + $this->importeTotalDocumentoByID($dat['iddocumento'], 'diferenciadepreciacion');
                $data[$index]['importetotalalt'] = $this->importeTotalDocumentoByID($dat['iddocumento'], 'diferenciavaloralternativo') + $this->importeTotalDocumentoByID($dat['iddocumento'], 'diferenciadepreciacionalternativo');;
                
            }else if(
                $operacion[0]['codigooperacion'] == 'OPER_MOD_PROPIEDAD')
            {
                $data[$index]['importetotal'] = $this->importeModProp($dat['iddocumento'], 'valorcontable');
                $data[$index]['importetotalalt'] = 0;
            }else{
                $data[$index]['importetotal'] = $this->importeTotalDocumentoByID($dat['iddocumento'], 'valorcontable');
                $data[$index]['importetotalalt'] = $this->importeTotalDocumentoByID($dat['iddocumento'], 'valorcontablealternativo');
            }
        }

        return $data;
    }

    private function importeTotalDocumentoByID($idDocumento, $campo = ''){

        $sql = "SELECT sum(round(mrna.{$campo},2)) as importe
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico                
                WHERE dm.iddocumento = {$idDocumento}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return count($datos) > 0 ?  $datos[0]['importe'] : 0;
    }

    private function importeModProp($idDocumento, $campo = ''){

        $sql = "SELECT sum(round(mrna.{$campo},2)) as importe
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico                
                WHERE dm.iddocumento = {$idDocumento} and mrna.idgruposubgrupo <> mrna.idgruposubgrupoold";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return count($datos) > 0 ?  $datos[0]['importe'] : 0;
    }

    private function importeAlterno($param)
    {
        $query = Doctrine_Query::create()
            ->select('SELECT SUM(mra.valorcontable) as p')
            ->from('DatMovRegnumericoActivo mra')
            ->whereIn('mra.idmovregnumerico', $param);
        return $query->fetchArray();
    }

    /**
     *
     */
    public function getImporteTotalDocumento($idDocumento)
    {
        $sql = "SELECT SUM(mra.valorcontable) as importe
                FROM mod_logistica.dat_movimiento m
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn 
                            ON m.idmovimiento = mrn.idmovimiento 
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mra 
                            ON mra.idmovregnumerico = mrn.idmovregnumerico 
                WHERE (m.iddocumento = $idDocumento)
        ";

        $conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sql);
        $datos = $respdata->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['importe'];
    }

    /**
     *
     */
    public function getImporteTotalDocumentoAlternativos($idDocumento)
    {
        $sql = "SELECT SUM(mra.valorcontablealternativo) as importe
                FROM mod_logistica.dat_movimiento m
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn
                            ON m.idmovimiento = mrn.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mra
                            ON mra.idmovregnumerico = mrn.idmovregnumerico
                WHERE (m.iddocumento = $idDocumento)
        ";

        $conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sql);
        $datos = $respdata->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['importe'];
    }

    /**
     *
     */
    public function getImporteTotalDocumentoDepreciacion($idDocumento)
    {
        $sql = "SELECT SUM(mra.depreciacionacumulada) as importe
                FROM mod_logistica.dat_movimiento m
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn 
                            ON m.idmovimiento = mrn.idmovimiento 
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mra 
                            ON mra.idmovregnumerico = mrn.idmovregnumerico 
                WHERE (m.iddocumento = $idDocumento)
        ";

        $conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sql);
        $datos = $respdata->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['importe'];
    }



    /**
     *
     */
    public function getImporteTotalDocumentoDepreciacionAlternativos($idDocumento)
    {
        $sql = "SELECT SUM(mra.depreciacionacumuladaalternativo) as importe
                FROM mod_logistica.dat_movimiento m
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn
                            ON m.idmovimiento = mrn.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mra
                            ON mra.idmovregnumerico = mrn.idmovregnumerico
                WHERE (m.iddocumento = $idDocumento)
        ";

        $conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sql);
        $datos = $respdata->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['importe'];
    }



    /**
     *
     */
    public function getCentrosCostos($idAreaResp, $idEstructura)
    {
        $_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        return $_sContabilidad->obtenerCentrosNivelPorAreas($idAreaResp, $idEstructura);
    }

    /**
     *
     */
    public function getDatosCargaInicial()
    {
        $usuariosCreadores = $this->devolverUsuarios();
        $usuariosOtros = $this->devolverUsuarios('aprobadopor');

        return array(
            'usuarios' => array_merge($usuariosCreadores, $usuariosOtros), 'iddocs' => $this->getDatosTiposDocumentos()
        );
    }

    /**
     * Método que devuelve los nombres de los tipo de documento
     * para el combo de la búsqueda
     *
     * @return array
     */
    public function getDatosTiposDocumentos()
    {
        return $this->configuracionHelper->documentosPorSubsistemaEntidad(
            $this->idsubsistema, $this->idestructuracomun
        );
    }

    /**
     *
     */
    public function getDatosInicialesComponente($parametros)
    {
        $usuarios = array();
        if ($parametros['usuarios'] == 'cargausuarios') {
            $usuarios = $this->devolverUsuarios();
            $usuarios = array_merge($usuarios, $this->devolverUsuarios('aprobadopor'));
        }

        $classEstructura = 'Estructura';

        $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        $parametros['idestructura'] = ($parametros['idestructura']) ?
            $parametros['idestructura'] : $idEstructuraGlobal;

        $arrIdesEstructuras = $this->_mComunAFT->getIdEstructurasHijas($parametros['idestructura'], true);

        $operaciones = $this->getOperaciones($parametros);

        if (!$parametros['nocargaentidad']) {
            //$ent = $this->_sEstrComposicion->getEstructura($parametros['idestructura']);
            $ent = $this->integrator->metadatos->DameEstructura($parametros['idestructura']);
            $direccion = $ent[0]->direccion;
            $codigo = $ent[0]->codigo;
            $entidad = $ent[0]->denominacion;
            $identidad = $ent[0]->idestructura;
        }

        $documentos = $this->getListadoDocSubSisteActivos($arrIdesEstructuras);

        return array(
            'operaciones' => $operaciones,
            'documentos' => $documentos,
            'usuarios' => $usuarios,
            'entidadCodigo' => $codigo,
            'entidadDireccion' => $direccion,
            'entidad' => $entidad,
            'identidad' => $identidad
        );
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
        // Creando/Buscando a partir del idpersona (es lo que viene como idresponsabledestino) el idreponsable de aft
        if($parametros['idresponsabledestino']){
            $idPersona = $parametros['idresponsabledestino'];
            $query = new Doctrine_Query();
            $idResponsable = $query->select('idresponsable')
                ->from('DatResponsable')
                ->where('idpersona =?', $idPersona)
                ->fetchOne()->idresponsable;
            if (!$idResponsable) {
                $responsable = new DatResponsable();
                $responsable->tipo = (ComunAFTModel::integradoPersona()) ? 2 : 1;
                $responsable->idpersona = $idPersona;
                $responsable->save();
                $parametros['idresponsabledestino'] = $responsable->idresponsable;
            }else{
                $parametros['idresponsabledestino'] = $idResponsable;
            }
        }else {
            unset($parametros['idresponsabledestino']);
        }

        new DatDocumentoActivo();
        $cDatDocumentoActivo = 'DatDocumentoActivo';

        if ($parametros['trasladomasivo']) {
            $idejercicio = $this->configuracionHelper
                ->getEjercicioActualSubsistema($parametros['identidad'], $this->idSubsistema);
            $idestructuras = $this->_mComunAFT->getIdsAreasHijas(array('idestructuradestino'=>$parametros['identidad']));
        } else {
            $idejercicio = $this->configuracionHelper
                ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
            $idestructuras = $this->_mComunAFT->getIdsAreasHijas();
        }

        $parametros['numeroref'] = $this->devolverUltimoNumeroDoc(
            $parametros['iddoc'], $idestructuras, $idejercicio
        );
        $datDocumento = $this->adicionarDocumento($parametros);

        $datDocumento->$cDatDocumentoActivo->synchronizeWithArray($parametros);

        if ($parametros['iddocumento'] && ($parametros['numero'] == '' && $parametros['fecha'] == '' &&
                $parametros['iddocinventario'] == '' && $parametros['clave'] == '')
        ) {

            $del = Doctrine::getTable('DatDocumentoOrigen')->find($parametros['iddocumento']);
            if ($del) {
                $del->delete();
            }
        }

        return $datDocumento;
    }

    /**
     *
     */
    public function addFiltersQueryDocumentoAux($query, $parametros, $alias = 'd')
    {
        if ($parametros['iddoc']) {
            $query->addWhere("{$alias}.iddoc = ? ", array($parametros['iddoc']));
        }

        if ($parametros['desde']) {
            $query->addWhere(
                "{$alias}.fechacontable >= ? ", array($parametros['desde'])
            );
        }

        if ($parametros['hasta']) {
            $query->addWhere(
                "{$alias}.fechacontable <= ? ", array($parametros['hasta'])
            );
        }

        if ($parametros['estadoMenor']) {
            $query->addWhere(
                "{$alias}.estado < ? ", array($parametros['estadoMenor'])
            );
        }

        if ($parametros['anno']) {
            $query->addWhere("{$alias}.anno = ? ", array($parametros['anno']));
        }

        if ($parametros['idusuario']) {
            $query->addWhere(
                "{$alias}.idusuario = ? ", array($parametros['idusuario'])
            );
        }
        $query = self::addFiltersQueryDocumentoAuxTres($query, $parametros, $alias = 'd');

        return $query;
    }

    public function addFiltersQueryDocumentoAuxTres($query, $parametros, $alias = 'd')
    {
        if ($parametros['aprobadopor']) {
            $query->addWhere(
                "{$alias}.aprobadopor = ? ", array($parametros['aprobadopor'])
            );
        }

        if ($parametros['criterio']) {
            $criterio = $parametros['criterio'];
            if (is_numeric($parametros['criterio'])) {
                $query->addWhere("{$alias}.nrodoc = $criterio or {$alias}.anno = $criterio");
            } else {
                $query->addWhere("{$alias}.nrodoc = -1 or {$alias}.anno = -1");
            }
        }

        if ($parametros['fecha']) {
            $query->addWhere("{$alias}.fechacontable = ?", array($parametros['fecha']));
        }

        return $query;
    }

    /**
     *
     */
    public function addFiltersQueryDocumento($query, $parametros, $alias = 'd')
    {
        if (!is_array($parametros['idestructuracomun'])) {
            $query->addWhere(
                "{$alias}.idestructuracomun = ? ", array($parametros['idestructuracomun'])
            );
        } else {
            if (is_array($parametros['idestructuracomun'])) {
                $query->whereIn(
                    "{$alias}.idestructuracomun", $parametros['idestructuracomun']
                );
            }
        }

        if ($parametros['idestructura']) {
            $query = $this->_sEstrComposicion->obtenerDqlNomFilaHijos(
                $query, $alias, 'idestructuracomun', $parametros['idestructura']
            );
        }

        if ($parametros['nrodoc']) {
            $query->addWhere(
                "{$alias}.nrodoc = ? ", array($parametros['nrodoc'])
            );
        }

        if ($parametros['idoperacion']) {
            if (!is_array($parametros['idoperacion'])) {
                $query->addWhere(
                    "{$alias}.idoperacion = ? ", array($parametros['idoperacion'])
                );
            } else {
                $query->andWhereIn(
                    "{$alias}.idoperacion", $parametros['idoperacion']
                );
            }
        }

        $query = self::addFiltersQueryDocumentoAuxDos($query, $parametros, $alias = 'd');

        $query = self::addFiltersQueryDocumentoAux($query, $parametros, $alias = 'd');
        return $query;
    }
    
    public function addFiltersQueryDocumentoAuxDos($query, $parametros, $alias = 'd')
    {

        if ($parametros['estado']) {
            $query->addWhere("{$alias}.estado = ? ", array($parametros['estado']));
        }

        if ($parametros['idestado']) {
            if (is_array($parametros['idestado'])) {
                $query->andWhereIn("{$alias}.estado", $parametros['idestado']);
            } else {
                $query->addWhere("{$alias}.estado = ? ", array($parametros['idestado']));
            }
        } else {
            $query->addWhere("{$alias}.estado <> ? ", 5);
            $query->addWhere("{$alias}.estado <> ? ", 10);
        }

        return $query;
    }

    /**
     *
     */
    private function delProdActivo($arregloProductos)
    {
        //Paso 0- Busco si hay otro documento que tenga un movimiento con ese producto, 
        //si no hay borro del datProducto

        $_sMovimiento = new MovimientoService();
        if (count($arregloProductos)) {
            $_mRegNumerico = new RegNumericoModel();
            foreach ($arregloProductos as $value) {

                $query = $_sMovimiento->getQueryDatMovimientos('m', false);
                $query->addWhere('m.idproducto = ?', array($value['idproducto']));

                if ($query->count() == 0) {
                    Doctrine::getTable('DatProductoLogistica')->find($value['idproducto'])->delete();
                } else {

                    $subQuery = $_mRegNumerico->getQueryRegNumerico('rn', true);
                    $subQuery->select('rn.idregnumerico AS idregnumerico');

                    $mMovRegNum = new MovRegNumericoModel();
                    $mMovRegNum->addJoinModelMy($subQuery, 'rn', 'mr', 1);

                    $subQuery->addWhere(' rn.idproducto = ?', array($value['idproducto']));

                    $arrAux = $subQuery->fetchArray();
                    $arrIdesRegNumerico = array();

                    foreach ($arrAux as $dat) {
                        array_push($arrIdesRegNumerico, $dat['idregnumerico']);
                    }

                    $query = $_mRegNumerico->getQueryRegNumerico('rn', true);
                    if(count($arrIdesRegNumerico) > 0){
                        $query->whereNotIn('rn.idregnumerico', $arrIdesRegNumerico)->delete();
                    }
                }
            }
        }
    }

    /**
     *
     */
    private function delMovimientos($productosMovimientos)
    {
        //print_r($productosMovimientos);die;
        $_sMovimiento = new MovimientoService();
        foreach ($productosMovimientos as $value) {
            $_sMovimiento->eliminarProductoDoc($value['idmovimiento']);
        }
    }

    /**
     *
     */
    public function delDocActivo($parametros)
    {
        //print_r($parametros);die;
        $productosMovimientos = $this->getProductosEnDocumento($parametros['iddocumento']);
        $response = parent::eliminarDocumento($parametros['iddocumento']);
        $doc = Doctrine::getTable('DatDocumento')->find($parametros['iddocumento']);
        if ($doc) {
            if ($doc->estado == 5) {
                $this->delMovimientos($productosMovimientos);
            }
        } /*else {
            $this->delProdActivo($productosMovimientos);
        }*/


        // Busco el concepto de la operación para modificar la disponibilidad
        $this->actualizarMovDeOperacion($parametros['idoperacion'], $parametros['iddocumento']);
        $docOrigen = new DocOrigenModel();
        $docOrigen->getEliminarDocOrigen($parametros);

        return $response;
    }

    protected function actualizarMovDeOperacion($idOperacion, $idDocumento)
    {
        // Busco el concepto de la operación para modificar la disponibilidad
        $oper = $this->_mComunAFT->getOperacionSobreMediosById($idOperacion);
        if ($oper->signo == '-' && $oper->afectadisponible == 1) {

            //  Busco los movs aft con su cantidad de cada movimieto del documento
            $_sMovimiento = new MovimientoService();
            $movs = $_sMovimiento->getMovsConCantReal(array('iddocumento' => $idDocumento));
            foreach ($movs['datos'] as $mov) {
                $_sMovimiento->modDisponibilidadMedios($mov['idproducto'], $mov['cantreal'], '+');
            }
        }
    }

    /**
     *
     */
    protected function setDatosInterfazRegNumerico($datDocumento)
    {
        $maestroProducto = new MaestroProductoModel();
        $documento = $datDocumento->toArray();
        $query = new Doctrine_Query();

        $query->from('DatProductoLogistica p')
            ->where('p.idproducto = ?', array($documento['DatMovimientos'][0]['idproducto']));

        $maestroProducto->addQueryNomIndicador($query, 'p', 'i', 'ih');

        $producto = $query->fetchOne();
        $idCCosto = $documento['DatMovimientos'][0]['DatMovRegnumerico'][0]['DatMovRegnumericoActivo']['idcentrocosto'];

        $datos = array(
            'codprod' => $producto['codigo'],
            'denominacion' => $producto['denominacion'],
            'idmovimiento' => $documento['DatMovimientos'][0]['idmovimiento'],
            'idprod' => $producto['idindicador'],
            'idproducto' => $documento['DatMovimientos'][0]['idproducto'],
            'idestado' => $datDocumento->estado,
            'idoperacion' => $datDocumento->idoperacion,
            'cantidad' => $documento['DatMovimientos'][0]['cantidad'],
            'idnaturaleza' => $producto['idnaturaleza'],
            'tipo_interfaz' => 'entrada',
            'idcentrocosto' => $idCCosto,
            'arridtablas' => $producto['arridtablas']
        );
        return $datos;
    }

    /*
     * Genera los numeros de inventario
     * */

    public function auxAprobarDocOper($datOperacion, $idEntidadPadre, $idDocumento)
    {
        $sCfgAFT = new ConfiguracionActivosService();
        if ($datOperacion['tipo'] == 'entrada' && ($datOperacion['autogenerada'] == '0') || ($datOperacion['autogenerada'] == '1' && $datOperacion['codigo'] == 'OPER_REC_TRAS_EXTER')
        ) {
            $cfg = $sCfgAFT->getConfiguracionPG($idEntidadPadre);
            if ($cfg[0]['autogenerado'] == 1) {
                $conn = Zend_Registry::get('conexion');
                $conn->fetchAll(
                    "select * from \"mod_logactivofijotangible\".\"f_generanroserie\"($idDocumento, "
                    . "$idEntidadPadre)"
                );
            }
        }
    }

    /*
     * Para actualizar la disponibilidad de los medios
     * */

    public function auxAprobarDocTrans($parametros)
    {
        if ($this->existComponent('log.trans.tripulacion')) {
            $cdt = new ControlDisponibilidadModel();
            $cdt->actualizarDisponibilidad($parametros);
        }
    }

    /**
     *
     */
    public function aprobarDocumento($idDocumento, $idOperacion, $observaciones, $idEntidadPadre, $signo)
    {
        $sRegNumActivo = new RegNumActivoService();

        $idEntidadPadre = ($idEntidadPadre) ? $idEntidadPadre : $this->idestructuracomun;
        $datOperacion = $this->_mComunAFT->getDatosInterfazByIdOperacion($idOperacion);
        if (!$datOperacion['tipo']) {
            throw new ZendExt_Exception('LOG_AFT_DOC_009');
        }

        $sCfgAFT = new ConfiguracionActivosService();
        $confEntidad = $sCfgAFT->getConfiguracionPG($idEntidadPadre);
        // Genera los numeros de inventario si son automaticos en la entidad.
        if ($confEntidad[0]['autogenerado'] == 1) {
            self::auxAprobarDocOper($datOperacion, $idEntidadPadre, $idDocumento);
        }

        // Si es necesario se deprecian los medios que es estan aprobando en dependencia de la
        // operacion y si esta integrado a la contabilidad y si la entidad deprecia.
        /*
         * Kenier y jenny me dijeron que quitara esto
         * if ($confEntidad[0]['depreciacion']) {
            $integradoCont = $this->_mComunAFT->integradoContabiliadConf($idEntidadPadre);

            if ($integradoCont == 1 && $datOperacion['debe_depreciar'] === '1') {
                $arrIdregnumericos = array();
                $depPreServ = new DepreciacionService();
                $arrIdregnumericos = $sRegNumActivo->getArrIdsRegNumericosByIddocumento($idDocumento);

                $depPreServ->depreciarByArrIdesRegNumericos($arrIdregnumericos, $datOperacion['codigo']);

                // Aqui lo que se hace es actualizar los valores de depreciacion de movRegNum del documento en cuestion,
                // a partir del RenNum para que en caso de que se deprecien algunos medios, estos no pierdan los valores
                // de depreciacion.
                $sRegNumActivo->setValoresDepreInMovRnaFromRnaDadoDoc($idDocumento);
            }
        }*/

        //  Replica los movimientos en el registro numérico y después se aprueba el documento
        // 5 seg para 100 registros
        $sRegNumActivo->actualizarRegNumByIdDocumento($idDocumento, $idOperacion);

        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        $parametros = array('observaciones' => $doc->observaciones, 'iddocumento' => $doc->iddocumento);
        $parametros['observacionesParams'] = $observaciones;

        // actualizar la disponibilidad de los medios
        self::auxAprobarDocTrans($parametros);
        
        // Esto pone los documentos que no contabilizan con idcomprobante en -1
        self::actializarComprobante($idDocumento);

        $cronologia = parent::aprobarDocumento($idDocumento, true);

        // Se quito porque carecia de sentido
        // Se llama al metodo comun de logistica, pero este no va a modificar ni la cantidad ni la disponibilidad
        // en dat_producto
        /* $this->producto->aprobarMovimientos(
          $idDocumento, $cronologia, ($datOperacion['tipo'] == 'entrada') ? true : false, false
          ); */

        // En este paso se modifica la cantidad y la disponibilidad, segun la configuracion del fichero
        // configuracion.xml
        // Si se rebaja o se incrementa la cantidad y la dispobilidad segun corresponda con el caso en cuestion

        /*
         * NOTA ACLARATORIA:
         * EN LAS ENTRADAS SOLO EXISTEN DOS CASOS:
         *  1- EN LAS ENTRADAS REGULARES EN LAS QUE SE INCREMENTA LA CANTIDAD Y LA DISPONIBILIDAD, EJEMPLO UNA COMPRA
         *  2- EN LAS RECEPCIONES, EN LAS QUE SOLO SE INCREMENTA LA DISPONIBILIDAD,
         *              YA QUE POR EJEMPLO: UN ENVIADO A REPARAR SOLO REBAJA DISPONIBLE, Y CUANDO SE RECEPCIONES DEL TALLER
         *     ESE DISPONIBLE SE TIENE QUE INCREMENTAR, SOLO EL DISPONIBLE Y NO LA CANTIDAD, PORQUE LA CANTIDAD NUNCA
         *     SE REBAJO A LA HORA DE ENVIARLO A TALLER.
         * EN LAS NO ENTRADAS EXISTE SOLO UN CASO:
         *  1- QUE REBAJE SOLO LA CANTIDAD, PORQUE LA DISPONIBILIDAD SE REBAJA A LA HORA DE HACER EL MOVIMIENTO DEL
         *     REGISTRO NUMERICO.
         * */

        self::auxAprobarDocSignos($datOperacion, $doc);

        $this->producto->getMovimientoModel()->aprobarCronologiaProductos($idDocumento, $cronologia);
        //Para actualizar la cronologia de movimiento para el 107
        $datMov = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ?', array($idDocumento));
        $datMov[0]->cronologia = $cronologia;
        $datMov->save();
        return $cronologia;
    }

    public function updatesMovCientoDiecisiete($mov)
    {
        $query = Doctrine_Query::create();
        new DatMovRegnumericoActivo();
        new DatRegnumericoActivo();
        new DatMovRegnumerico();

        $query->from('DatRegnumericoActivo rna');
        $query->innerJoin('rna.DatRegnumerico rn');
        $query->innerJoin('rn.DatProductoLogistica p');
        $query->innerJoin('p.DatMovimientos mov');
        $query->innerJoin('mov.DatMovRegnumerico mrn');
        $query->innerJoin('mrn.DatMovRegnumericoActivo mrna');
        $query->addSelect('sum(mrna.valorcontablealternativo) as importealternativo');
        $query->addSelect('sum(mrna.valorcontable) as importecontable');
        $query->addSelect('mov.idmovimiento as idmovimiento');
        $query->addSelect('p.importe as importeProd, p.importealternativo as importealternativoProd');
        $query->addSelect('p.idproducto as idproducto');
        $query->where("mov.iddocumento = {$mov->iddocumento}");
        $query->addWhere("mov.idproducto = {$mov->idproducto}");
        $query->groupBy('rna.idregnumerico, mov.idmovimiento, p.importe, p.importealternativo, p.idproducto');
        $datos = $query->fetchArray();
        return $datos;
    }

    public function auxAprobarDocSignos($datOperacion, $doc)
    {

        $cDatMovimientos = 'DatMovimientos';
        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $movService = new MovimientoService();
        if ($datOperacion['signo'] == '+') {
            //Se incrementa la cantidad y la disponibilidad
            if ($datOperacion['afectacantidad'] == $datOperacion['afectadisponible']) {
                foreach ($doc->$cDatMovimientos as $pos => $mov) {
                    $cantidad = $mov->$cDatMovRegnumerico->Count();
                    $datos = $this->updatesMovCientoDiecisiete($mov);
                    //inserta en mod_logubicacion.dat_ubicacionproducto y at_areaproducto(107)
                    $this->insertarUbicacion($mov->$cDatMovRegnumerico, $datos[0]['idproducto'],$datOperacion['signo']);

                    $datMovimientos = Doctrine::getTable('DatMovimientos')->find($datos[0]['idmovimiento']);
                    $datMovimientos->importetotal = $datos[0]['importecontable'] + $datos[0]['importeProd'];
                    $datMovimientos->importealternativo = $datos[0]['importealternativo'] + $datos[0]['importealternativoProd'];
                    $datMovimientos->importecontable = $datos[0]['importecontable'];

                    $datProducto = Doctrine::getTable('DatProductoLogistica')->find($datos[0]['idproducto']);
                    $datProducto->importe = $datMovimientos->importetotal;
                    $datProducto->importealternativo = $datMovimientos->importealternativo;

                    $datMovimientos->existenciaactual = $cantidad;
                    $datMovimientos->signo = $datOperacion['signo'];
                    $datProducto->save();
                    $datMovimientos->save();

                    $movService->modCantidadDisponiblieMedios($mov->idproducto, $cantidad, $datOperacion['signo']);
                }
            }
            if ($datOperacion['afectacantidad'] == 0 && $datOperacion['afectadisponible'] == 1) {
                foreach ($doc->$cDatMovimientos as $pos => $mov) {
                    $cantidad = $mov->$cDatMovRegnumerico->Count();
                    $movService->modDisponibilidadMedios($mov->idproducto, $cantidad, $datOperacion['signo']);
                }
            }
        }
        self::auxAprobarDocSignosDos($datOperacion, $doc);
    }

    public function insertarUbicacion($cDatMovRegnumerico, $idproducto, $signo)
    {
        $ubicacion = new UtilesubicacionService();
        foreach ($cDatMovRegnumerico as $datmovregnumerico) {
            $regnumerico = Doctrine::getTable('DatRegnumericoActivo')->find($datmovregnumerico->idregnumerico);
            $param['idubicacion'] = $regnumerico->idubicacion;
            $param['idproducto'] = $idproducto;
            $param['cantidad'] = 1;
            if ($regnumerico->idubicacion) {
                if($signo == "+"){
                    $ubicacion->ubicarProducto($param);
                }else{

                    $resp = $ubicacion->cargarUbicacionesProducto($param, false);

                    $array[0] = array(
                        'cantidad' => $resp['cantidad'], 'idareaproducto' => $resp['datos'][0]['idareaproducto'],
                        'idubicacionproducto' => $resp['datos'][0]['idubicacionproducto']
                    );
                    $ubicacion->desubicarProducto($array);

                }
            }
        }
    }

    /*public function updateModLogUbicacion()
    {
        $sqlUpdateProducto = "update mod_logistica.dat_producto
                              set disponible = coalesce(disponible,0) {$operacion} t.cant
                              from (select sum(cantidad) as cant, idproducto as id
                              from mod_logdistribucion.dat_prodorden dpo where {$where} group by idproducto) as t
                              where idproducto = t.id";
        $sqlUpdateAreaproducto = "update mod_logubicacion.dat_areaproducto
                                  set disponible = coalesce(disponible,0) {$operacion} t.cant
                                  from (select dpo.idproducto as id, poa.idareaproducto as area,
                                  sum(poa.cantidad)as cant
                                  from mod_logdistribucion.dat_prodorden dpo
                                  inner join mod_logdistribucion.dat_prodordenarea poa
                                  on poa.idprodorden = dpo.idprodorden
                                  where {$where}
                                  group by dpo.idproducto, poa.idareaproducto) as t where t.area = idarea
                                  and t.id = idproducto";
        $conexion = Zend_Registry::get('conexion');
        $conexion->execute($sqlUpdateProducto);
        $conexion->execute($sqlUpdateAreaproducto);
    }*/

    public function auxAprobarDocSignosDos($datOperacion, $doc)
    {
        $cDatMovimientos = 'DatMovimientos';
        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $movService = new MovimientoService();
        if ($datOperacion['signo'] == '-') {
            //Se rebaja solo la cantidad
            if ($datOperacion['afectacantidad'] == 1) {
                $facturacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
                //$contabilidad = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_CONT);
                $aux = true;
                if ($facturacion && $datOperacion['codigo'] == 'OPER_BAJA_VENTA') {
                    $aux = false;
                }
                // AQUI SE REBAJA CANTIDAD
                if ($aux) {
                    foreach ($doc->$cDatMovimientos as $pos => $mov) {
                        $cantidad = $mov->$cDatMovRegnumerico->Count();
                        $datos = $this->updatesMovCientoDiecisiete($mov);

                        //inserta en mod_logubicacion.dat_ubicacionproducto y at_areaproducto(107)
                        $this->insertarUbicacion($mov->$cDatMovRegnumerico, $datos[0]['idproducto'],$datOperacion['signo']);

                        $datMovimientos = Doctrine::getTable('DatMovimientos')->find($datos[0]['idmovimiento']);
                        $datMovimientos->importetotal = $datos[0]['importeProd'] - $datos[0]['importecontable'];
                        $datMovimientos->importealternativo = $datos[0]['importealternativoProd'] - $datos[0]['importealternativo'];
                        $datMovimientos->importecontable = $datos[0]['importecontable'];

                        $datProducto = Doctrine::getTable('DatProductoLogistica')->find($datos[0]['idproducto']);
                        $datProducto->importe = $datMovimientos->importetotal;
                        $datProducto->importealternativo = $datMovimientos->importealternativo;
                        $datProducto->save();
						$datMovimientos->existenciaactual = $cantidad;
                        $datMovimientos->signo = $datOperacion['signo'];
                        $datMovimientos->save();
                        $movService->modCantidadMedios($mov->idproducto, $cantidad, $datOperacion['signo']);
                    }
                }
            }
        }
    }

    /**
     * Este método esta redefinido en las clases hijas
     */
    public function getDatEspecificosDoc($parametros = array())
    {
        return array('data' => $parametros);
    }

    /**
     *
     */
    public function loadDocumentoFromDataDocInventario(&$docActivo, $arrDocInventario)
    {

        $docActivo->save();
        $idDocActivo = $docActivo->iddocumento;
        $idEstructura = $docActivo->idestructuracomun;
	$idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        $classEstructura = 'Estructura';

	//$cProductoLogistica = 'DatProductoLogistica';
        $cMovimiento = 'DatMovimientos';
        $cDatRegnumerico = 'DatRegnumerico';
        $cDatRegNumeActivo = 'DatRegnumericoActivo';
        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $datosInsertar = array();
        $arrIdsIndicador = array();
        
        new DatMovRegnumerico();

        // Validando que los indicadores de los aft/utiles a adicionar tengan un idnaturaleza, tengan un grupo, tengan
        // y marcado explotacion
        $idindicadores = array();
        foreach ($arrDocInventario as $value){
            array_push($idindicadores, $value['idindicador']);
        }

        if(count($idindicadores) > 0){
            //$orContabilidad = "";
            //$idEstructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
            if($this->_mComunAFT->integradoContabiliadConf($idEstructuraGlobal)){
                $orContabilidad = " OR drna.idgruposubgrupo is null ";
            }
            $ids = implode(",", $idindicadores);
            $sql = "SELECT i.codigo, i.denominacion 
                    FROM mod_datosmaestros.nom_indicador i  
                    INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                    WHERE (
                    --  (i.idnaturaleza is NULL OR i.idnaturaleza = -1) 
                      ih.explotacion = 0  
                      --$orContabilidad   
                      )
                       AND i.idindicador IN ({$ids})
              ";

            // adrian aki fula
            $conn = Zend_Registry::get('conexion');
            $prods = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
         
            $arrStrProds = "";
            if(count($prods) > 0){
                foreach ($prods as $p){
                    $arrStrProds.= " <br><b>" . $p['codigo'] . ' - ' . $p['denominacion'] . "</b> ";
                }

                $errorMsg =  ". Revise que tenga marcado la opción <b>explotación</b> en el maestro de 
productos y servicios los códigos siguientes: ". $arrStrProds;

                throw new LogisticaException('LOG_AFT_DOC_014', null, false, $errorMsg);
            }
        }

        self::auxInsertarDatos($arrDocInventario, $datosInsertar, $arrIdsIndicador);

		/*print_r($arrDocInventario);
		print_r($datosInsertar);
		print_r($arrIdsIndicador);*/
		

        $arrIdsProdCreados = array();
        if (count($arrIdsIndicador)) {
            $query = new Doctrine_Query();
            $arrIdsProdCreados = $query->select('p.idproducto, p.idindicador')
                ->from('DatProductoLogistica p')
                ->addWhere('p.idestructura = ?', array($idEstructura))
	    	// Creo que aqui es donde le falta un where
                ->whereIn('p.idindicador', $arrIdsIndicador)
                ->addWhere('p.idclasificacioncontable is null')
                ->fetchArray();
        }





        self::auxInsertarDatosIndicador($arrIdsProdCreados, $datosInsertar);
//        $collDatMovimientos = new Doctrine_Collection('DatMovimientos');
        // Para los plugins
        $plugins = LogisticaConfigHelper::__init()->loadConfig('listaplugins')->plugins;
        
        foreach ($datosInsertar as $idIndicador => $value) {

            $cantidad = $value['cantidad'];

            $datos = array(
                'iddocumento' => $idDocActivo,
                'idestructuracomun' => $idEstructura,
                'idindicador' => $idIndicador
            );

            $datos = array_merge($datos, $value);

            $producto = new DatProductoLogistica();
            $producto->idestructura = $idEstructura;
            $producto->idestructuracomun = $idEstructuraGlobal;
            $producto->idindicador = $idIndicador;

            if ($datos['idproducto']) {
                $producto->assignIdentifier($datos['idproducto']);
            } else {
                $producto->cantidad = 0;
                $producto->disponible = 0;
            }

            unset($datos['idproducto']);

            $movimiento = new DatMovimientos();
            $movimiento->synchronizeWithArray($datos);
            $movimiento->cantidad = $cantidad;
            
            for ($i = 0; $i < $cantidad; $i++) {
                
                
                $datosRegNumerico = ($value['nroserie'][$i]) ? $value['nroserie'][$i] : array();

                $regNumerico = new DatRegnumerico();
                $regNumerico->synchronizeWithArray($datosRegNumerico);
                $regNumerico->nroserie = (count($datosRegNumerico) > 0) ?  $datosRegNumerico : '';
                
                $regNumericoActivo = new DatRegnumericoActivo();
                $regNumericoActivo->synchronizeWithArray($datosRegNumerico);

                // Para evitar los valores nulos
                $valorcont = ($value['valorcontable'][0] != null && $value['valorcontable'][0] != '') ? $value['valorcontable'][0] : 0;
                $valorcontalt = ($value['valorcontablealternativo'][0] != null && $value['valorcontablealternativo'][0] != '') ? $value['valorcontablealternativo'][0] : 0;

                $regNumericoActivo->valorcontable = $valorcont;
                $regNumericoActivo->valorcontablealternativo = $valorcontalt;
                $regNumericoActivo->valoradquisicion = $valorcont;
                $regNumericoActivo->valoradquisicionalternativo = $valorcontalt;

                $movRegNumerico = new DatMovRegnumerico(); 
                $movRegNumerico->synchronizeWithArray($datosRegNumerico);
                $movRegNumerico->$cMovimiento = $movimiento;                
                
                $movRegNumericoActivo = new DatMovRegnumericoActivo();
                $movRegNumericoActivo->synchronizeWithArray($datosRegNumerico);

                $movRegNumericoActivo->valorcontable = $valorcont;
                $movRegNumericoActivo->valorcontablealternativo = $valorcontalt;
                $movRegNumericoActivo->valoradquisicion = $valorcont;
                $movRegNumericoActivo->valoradquisicionalternativo = $valorcontalt;
                $movRegNumericoActivo->idarearesp = $datos['idestructuracomun'];
                $movRegNumericoActivo->idcentrocosto = $docActivo->$cDatDocumentoActivo->idcentrocosto;                

                /*
                 *  Llenar los datos de datmovregnumericoactivo de depreciacion 
                 *    --- vidautil, tasafiscal, porcientorecuperacion ---
                 * */

                $query = new Doctrine_Query();
                $arrIdsProdCreados = $query->select('i.idindicador,ih.idgruposubgrupo as idgruposubgrupo')
                    ->from('NomIndicador i')
                    ->innerJoin('i.NomIndicadorhoja ih')
                    ->addWhere('i.idindicador = ?', array($idIndicador))
                    ->fetchArray();

                self::auxMovRegNum($arrIdsProdCreados, $movRegNumericoActivo);                

                self::auxPlugin($plugins, $movRegNumericoActivo, $regNumericoActivo, $datosRegNumerico);

                $movRegNumerico->$cDatMovRegnumericoActivo = $movRegNumericoActivo;
                $regNumerico->$cDatMovRegnumerico->add($movRegNumerico);
                $regNumerico->$cDatRegNumeActivo = $regNumericoActivo;
                $producto->$cDatRegnumerico->add($regNumerico);
            }
            $producto->$cMovimiento->add($movimiento);
            $producto->save();
        }
    }

    public function auxPlugin($plugins, $movRegNumericoActivo, $regNumericoActivo, $datosRegNumerico)
    {
        // Poniendole al Doctine_Object que se forma los plugins de registro numerico
        foreach ($plugins as $plugin) {
            if ($plugin['activo'] == 1) {
                $obj = $plugin['clase'];
                $pluginModel = new $obj();

                $pluginModel->initBaseMovRelation($movRegNumericoActivo);
                $pluginModel->initBaseRelation($regNumericoActivo);

                $pluginModel->beforeSaveMov($movRegNumericoActivo, $datosRegNumerico);
                $pluginModel->beforeSave($regNumericoActivo, $datosRegNumerico);
            }
        }
    }

    public function auxMovRegNum($arrIdsProdCreados, &$movRegNumericoActivo)
    {
        if ($arrIdsProdCreados[0]['idgruposubgrupo'] != null) {
            $querydos = new Doctrine_Query();
            $arrIdsProdCreadosGrupo = $querydos
                ->addSelect('gh.vidautil as vidautil, gh.porcientorecuperacion as porcientorecuperacion')
                ->addSelect('gh.tasafiscalmin as tasafiscalmin,gh.tasafiscalmax as tasafiscalmax')
                ->from('NomGruposubgrupo g')
                ->innerJoin('g.NomGruposubgrupohoja gh')
                ->addWhere('g.idgruposubgrupo = ?', array($arrIdsProdCreados[0]['idgruposubgrupo']))
                ->fetchArray();
            $movRegNumericoActivo->vidautil = ($arrIdsProdCreadosGrupo[0]['vidautil'] != null) ?
                $arrIdsProdCreadosGrupo[0]['vidautil'] : 0;
            $movRegNumericoActivo->porcientorecuperacion = ($arrIdsProdCreadosGrupo[0]['porcientorecuperacion'] != null) ?
                $arrIdsProdCreadosGrupo[0]['porcientorecuperacion'] : 0;
            $movRegNumericoActivo->tasafiscal = ($arrIdsProdCreadosGrupo[0]['tasafiscalmin'] != null) ?
                $arrIdsProdCreadosGrupo[0]['tasafiscalmin'] : 0;
        } else {
            $movRegNumericoActivo->vidautil = 0;
            $movRegNumericoActivo->porcientorecuperacion = 0;
            $movRegNumericoActivo->vidautil = 0;
        }
    }

    public function auxInsertarDatos($arrDocInventario, &$datosInsertar, &$arrIdsIndicador)
    {
        foreach ($arrDocInventario as $value) {
            $arrIdsIndicador[] = $value['idindicador'];
            $value['nroserie'] = explode(',', $value['nroserie']);
            $value['valorcontable'] = explode(',', $value['preciocontable']);
            $value['valorcontablealternativo'] = explode(',', $value['precioalternativo']);
            $datosInsertar[$value['idindicador']]['cantidad'] = $value['cantidad'];
            if ($value['nroserie']) {
                $datosInsertar[$value['idindicador']]['nroserie'] = $value['nroserie'];
            }
            if ($value['valorcontable']) {
                $datosInsertar[$value['idindicador']]['valorcontable'] = $value['valorcontable'];
            }
            if ($value['valorcontablealternativo']) {
                $datosInsertar[$value['idindicador']]['valorcontablealternativo'] = $value['valorcontablealternativo'];
            }
        }
    }

    public function auxInsertarDatosIndicador($arrIdsProdCreados, &$datosInsertar)
    {
        foreach ($arrIdsProdCreados as $value) {
            if ($datosInsertar[$value['idindicador']]) {
                $datosInsertar[$value['idindicador']]['idproducto'] = $value['idproducto'];
            }
        }
    }

    public function loadDocumentoFromDataDocMantenimeinto(&$docActivo, $params)
    {
        $docActivo->save();
        $idDocActivo = $docActivo->iddocumento;
//        $idEstructura = $docActivo->idestructuracomun;


        $saveprod = new MovimientoActivoFijoModel();
        $arrIdesRegNum = array();
        $arrIdsIndicador = array();
        foreach ($params['envmantenimiento'] as $value) {
            array_push($arrIdsIndicador, $value->idindicador);
            array_push($arrIdesRegNum, $value->idregnumerico);
        }
        $arrIdsIndicador = array_unique($arrIdsIndicador);
        $parametros['arrayidregNum'] = $arrIdesRegNum;
        $regNumActivo = new RegNumActivoService();
        $datRegnumAFT = $regNumActivo->getMediosDisponibles($parametros, false);
//        $parametros['arrayidregNum'] = $arrIdesRegNum;
//        $regNumActivo = new RegNumericoActivoModel();
        //  $datRegnumAFT = $regNumActivo ->getMediosDisponibles($parametros,false);       

        $saveprod->adicionarProductos(
            $params['entidadpadre'], $arrIdsIndicador, $idDocActivo, $params['idoperacion']
        );

        $producto = $saveprod->getArrActivosEnDoc($idDocActivo);
        $param['action'] = 'cargarproductos';
        $param['iddocIntegracionInventario'] = 'false';
        $param['iddocumento'] = $idDocActivo;
        $datos = $saveprod->getDatos($param);
        $this->getConstruirMov($datos['datos'], $datRegnumAFT['datos'], $params, $docActivo);
    }

    public function getConstruirMov($datRegnumAFTProd, $datRegnumAFT, $params, $docActivo)
    {
        $cProductoLogistica = 'DatProductoLogistica';
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $plugins = LogisticaConfigHelper::__init()->loadConfig('listaplugins')->plugins;
        $movRegNumericoCollec = new Doctrine_Collection('DatMovRegnumerico');

        foreach ($datRegnumAFTProd as $datRegAFTProd) {
            $movimiento = Doctrine::getTable('DatMovimientos')->find($datRegAFTProd['idmovimiento']);
            $contador = 0;
            foreach ($datRegnumAFT as $regNum) {
                if ($datRegAFTProd['idindicador'] == $regNum['idindicador']) {
                    $contador++;

                    $movRegNumerico = new DatMovRegnumerico();
                    $movRegNumerico->idmovimiento = $datRegAFTProd['idmovimiento'];
                    $movRegNumerico->idregnumerico = $regNum['idregnumerico'];

                    $movRegNumericoActivo = new DatMovRegnumericoActivo();
                    if ($regNum['nroinventario'] != null) {
                        $nroinventario = split('MB', $regNum['nroinventario']);
                        $nroinventario = $nroinventario[1];
                    }
                    $regNum['nroinventario'] = ($regNum['nroinventario'] != null) ? $nroinventario : null;
                    $movRegNumericoActivo->synchronizeWithArray($regNum);

                    $movRegNumericoActivo->idarearesp = $params['entidadpadre'];
                    $movRegNumericoActivo->idcentrocosto = $docActivo->$cDatDocumentoActivo->idcentrocosto;

                    $regNumericoActivo = new DatRegnumericoActivo();
                    $regNumericoActivo->synchronizeWithArray($regNum);

                    foreach ($plugins as $pos => $plugin) {
                        if ($plugin['activo'] == 1) {
                            $obj = $plugin['clase'];
                            $pluginModel = new $obj();

                            $pluginModel->initBaseMovRelation($movRegNumericoActivo);
                            $pluginModel->initBaseRelation($regNumericoActivo);

                            $pluginModel->beforeSaveMov($movRegNumericoActivo, $regNum);
                            $pluginModel->beforeSave($regNumericoActivo, $regNum);
                        }
                    }
                    $movRegNumerico->$cDatMovRegnumericoActivo = $movRegNumericoActivo;
                }
            }
            $movimiento->cantidad = $movimiento->cantidad + $contador;
            $movimiento->$cProductoLogistica->disponible = $movimiento->$cProductoLogistica->disponible - $contador;
            $movimiento->save();

            $movRegNumericoCollec->add($movRegNumerico);
            $movRegNumericoCollec->save();
        }
    }

    public function getValidarDatRegNum($idDocumento, $tipo)
    {
        $mMovActivoFijo = new MovimientoActivoFijoModel();
        $mRegNumActivo = new RegNumericoActivoModel();
        $mRegNumActivo->loadPluginsFromFile('listaplugins')->buildRelations();
        $parametros['iddocumento'] = $idDocumento;
        $parametros['action'] = "cargarproductos";
        $parametros['iddocIntegracionInventario'] = false;
        $datos = $mMovActivoFijo->getDatos($parametros);
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        $doc = $doc->toArray();
        $params['idoperacion'] = $doc['idoperacion'];
        foreach ($datos['datos'] as $movRegAFT) {
            $params['idmovimiento'] = $movRegAFT['idmovimiento'];
            $params['idproducto'] = $movRegAFT['idproducto'];
            $params['tipo_interfaz'] = ($movRegAFT['signo'] == "+") ? "entrada" : "salida";
            $params['idestructuraop'] = $movRegAFT['idestructura'];
            $params['idestructuracomun'] = ($movRegAFT['idestructuracomun']) ? $movRegAFT['idestructuracomun'] :
                $movRegAFT['DatProductoLogistica']['idestructuracomun'];
            $params['action'] = "cargarseriesdemovimiento";
            $resultado = $mRegNumActivo->cargarMovimientosActivos($params);
            $resultado = $resultado['query']->fetchArray();
            $datRegNum = (count($resultado) > 0) ? $resultado : array();

            if (!$datRegNum) {
                return array('mov' => true);
            } else {
                $natu = new ConfiguracionActivosService($tipo);				
				$incluirValidacionDepreciacion = $datRegNum[0]['isuh'] == 1 ? false : true;
				
                $natura = $natu->getConfDatPorNaturaleza($movRegAFT['idnaturaleza'], $params['idestructuracomun'], $incluirValidacionDepreciacion);
                $datGrid = array();
				
                $arrayDat = self::getColumnasYRegNumerico($datRegNum, $natura, $datGrid);

                if (count($arrayDat) > 0) {
                    $resultotal[] = $arrayDat;
                } else {
                    $resultotal = null;
                }
            }
        }

        return $resultotal;
    }

    /* metodo que se encarga de recorrer las columnas obligatorias y los regnumerico para saber que datos les 
      falta a los registros numericos
     */

    public function getColumnasYRegNumerico($datRegNum, $columnasMostrar, $datGrid)
    {
        foreach ($datRegNum as $regnum) {
            $count = 0;
            foreach ($columnasMostrar as $column) {
                if (!$column->allowBlank && $column->name != 'fechainicialgarantia' &&
                    $column->name != 'fechafingarantia'
                ) {
					if($regnum['idnaturaleza'] == -5 && ($column->name == "vidautil" ||
														$column->name == "tasafiscal" ||
														$column->name == "porcientorecuperacion" ||
														$column->name == "depreciacionacumulada" ))
						continue;
				
				
					$column->name = ($column->name == "nrochasis") ? "nroserie" : $column->name;
                    // 
                    if ($regnum[$column->name] == "" && !$column->allowBlank && $column->name != "fechaexpini") {
                        $datGrid['denominacion'] = $regnum['denominacion'];
                        $datGrid['novalido'][$count]['cant'] += 1;
                        $datGrid['novalido'][$count]['hedaer'] = $column->label;
						$datGrid['novalido'][$count]['name'] = $column->name;
                        $count++;
                    }
                }
            }
        }
        return $datGrid;
    }

    public function getExisteDocAjustesInventario($iddocumento)
    {
        new DatDocumentoPadre();
        $doc = Doctrine::getTable('DatDocumentoPadre')
            ->findByDql('iddocumento = ?', array($iddocumento));
        $doc = $doc->toArray();
        if (count($doc) > 0 && $doc[0]['idpadre'] != null) {
            $result = 0;
        } else {
            $result = 1;
        }
        return $result;
    }

    public function getDocumentos($parametros)
    {

        if ($parametros['codigooperacion'])
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(false, false, $parametros['codigooperacion']);

        $idoperaciones = array();
        if ($parametros['idoperacion']) {
            $idoperaciones = $parametros['idoperacion'];
        }
        foreach ($operaciones as $oper) {
            array_push($idoperaciones, $oper['idoperacion']);
        }

        $parametros['idoperacion'] = $idoperaciones;

        $query = $this->getQueryDocumento('d');
        $classEstructura = 'Estructura';
        $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        // Buscar los id de las estructuras hijas de la estructura seleccionada
        
		/*$parametros['idestructuracomun'] = $this->_mComunAFT->getIdEstructurasHijas(
            $idEstructuraGlobal, false, true, false
        );*/
		
		$parametros['idestructuracomun'] = $this->_mComunAFT->getIdsAreasHijas();
        $parametros['idestructuracomun'][] = $parametros['idestructura'];
        unset($parametros['idestructura']);
		
		
		
        $query = $this->addFiltersQueryDocumento($query, $parametros, 'd');
        if ($parametros['dql']) {
            return $query;
        }
        return $query->fetchArray();
    }

    public function getupdateUsoDepConfiguracionPG($identidad)
    {
        $doc = Doctrine::getTable('DatDocumento')->findByDql('idestructuracomun = ?', array($identidad));
        $doc = $doc->toArray();
        $bandera = true;
        foreach ($doc as $dat) {
            if ($dat['estado'] == 2 || $dat['estado'] == 3) {
                $bandera = false;
                break;
            }
        }
        if ($bandera) {
            $sCfgAFT = new ConfiguracionActivosService();
            $sCfgAFT->updateUsoDepConfiguracionPG($this->global->Estructura->idestructura, 0);
        }
    }

    public function integradoContabiliad($idestructura)
    {
        return ComunAFTModel::integradoContabiliadConf($idestructura);
    }

    public function cargarTipoDocVentaAlquiler()
    {
        $classEstructura = 'Estructura';
        $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;

        $codigoBajaVenta = 'OPER_BAJA_VENTA';
        $codigoAlquiler = 'OPER_ALQUILER';

        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, false, false, $idEstructuraGlobal, false, false
        );
        $oparaciones_resp = array();
        foreach ($operaciones as $pos => $oper) {
            if ($oper['codigo'] == $codigoBajaVenta || $oper['codigo'] == $codigoAlquiler) {
                array_push($oparaciones_resp, $oper);
            }
        }
        $oparaciones_resp = array_values($oparaciones_resp);
        return $oparaciones_resp;
    }

    public function getDocVentaAlquiler($idoperacion)
    {

        $parametros = array(
            'idestado' => 3,
            'idoperacion' => $idoperacion
        );

        $query = $this->getQueryDocumento('d');

        $classEstructura = 'Estructura';
        $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
        $datosOperacion = $this->configuracionHelper->obtenerOperaciones(
            $idEstructuraGlobal, $this->idsubsistema, null, $idoperacion
        );
        $parametros['idestructuracomun'] = $idEstructuraGlobal;
        // Buscar los id de las estructuras hijas de la estructura seleccionada
        $parametros['idestructuracomun'] = $this->_mComunAFT->getIdEstructurasHijas(
            $parametros['idestructuracomun'], true
        );

        $query = $this->addFiltersQueryDocumento($query, $parametros, 'd');
        $query->addWhere('d.idoperacion = ?', $idoperacion);

        $query->innerJoin("d.DatDocumentoActivo da")->addSelect("da.idcentrocosto as idcentrocosto");
        $query->innerJoin("d.DatDocumentoCliente dc")
            ->addSelect("dc.idcliente as idcliente, dc.tipocliente as tipocliente");

        /* $query->leftJoin('d.DatDocumentoCliente dclient');
          $query->addSelect('dclient.idcliente as idcliente '); */
        $query->addSelect(
            "ROUND((COALESCE ((SELECT SUM(mov.cantidad)
                 FROM DatMovimientos mov where mov.iddocumento = d.iddocumento), 0)),0) as cant_registros"
        );

        $query->addSelect(
            "(SELECT COUNT(movv.idmovimiento)
                FROM DatMovimientos movv where movv.iddocumento = d.iddocumento) as cant_movimientos"
        );

        if ($datosOperacion[0]['codigooperacion'] == 'OPER_ALQUILER') {
            $query->leftJoin("da.DatDocAlquiler docalquiler")
                ->addSelect(
                    "docalquiler.nrocontrato as nrocontratoalquiler, " .
                    "docalquiler.fechainicio as fechainicioalquiler, docalquiler.fechafin as fechafinalquiler, " .
                    "docalquiler.direccion as direccionalquiler"
                );
        } else {
            $query->leftJoin("da.DatDocBajaVenta bv")
                ->addSelect(
                    "bv.entidad as entidadBajaVenta,bv.iddestinofinal as iddestinofinal,
        bv.nrocontrato as nrocontratoBajaVenta,bv.informetecnico as informetecnico"
                );

            $query->addWhere(
                'd.iddocumento not in ' .
                '(SELECT ddp.idpadre FROM DatDocfactura df ' .
                'INNER JOIN df.DatDocumento dd INNER JOIN dd.DatDocumentoPadre ddp ' .
                'WHERE dd.estado <> 7)'
            );
        }

        $datos = $query->fetchArray();
        $total = $query->count();
        return array('datos' => $datos, 'cantidad' => $total);
    }

    public function getMediosRegistrosDocumento($documentos)
    {
        $mMovRegNum = new MovRegNumericoModel();
        $_sMovimiento = new MovimientoService();
        $query = $mMovRegNum->getDqlMovsRegNumericos(array(), 'mr');
        $_sMovimiento->getJoinDatMovimiento($query, 'mr', 'm');
        $query->leftJoin("m.DatProductoLogistica p");
        $query->addSelect(
            'm.idmovimiento as idmovOld, 1 as cantidad, p.idindicador as idindicador'
        );
        $query->addSelect(
            'p.idestructura as idestructuraop, p.idproducto as idproducto'
        );
        $query->andWhereIn('m.iddocumento', $documentos);
        $query->orderBy('idestructuraop, idproducto, idregnumerico ASC');
        $datos = $query->fetchArray();
        return $datos;
    }

    public function devolverMediosAEntidadOrigen($arrIdregistros)
    {

        $collectionRegNumActivo = new Doctrine_Collection('DatRegnumericoActivo');

        foreach ($arrIdregistros as $value) {

            $regNumerico = Doctrine::getTable('DatRegnumerico')->find($value);
            $producto = Doctrine::getTable('DatProductoLogistica')->find($regNumerico->idproducto);

            $idEntidadALaQueSeDevuelve = $producto->idestructura;
            $idEntidadQueDevuelve = $producto->idestructuracomun;
            $idIndicador = $producto->idindicador;

            //  Buscamos si existe un idproducto en la estructura con ese idindicador.
            $query = new Doctrine_Query();
            $query->select('p.idproducto as idproducto');
            $query->from('DatProductoLogistica p');
            $query->where('p.idestructuracomun = ? AND p.idestructura = ? AND p.idindicador = ?',
                array($idEntidadALaQueSeDevuelve, $idEntidadQueDevuelve, $idIndicador));
            //$query->where('p.idestructura = ? and p.idestructuracomun = ? and p.idindicador = ?',
            //    array($idEntidadOrigen, $idEntidadOrigen, $producto->idindicador));
            $idProducto = $query->fetchOne()->idproducto;

            if ($idProducto) {
                $regNumerico->idproducto = $idProducto;
                $regNumerico->save();
            } else {

                // En caso de que la entidad no tenga un idproducto de ese idindicador
                // hay que crear un idproducto nuevo
                $prod = new DatProductoLogistica();
                $prod->idindicador = $idIndicador;
                $prod->idestructura = $idEntidadQueDevuelve;
                $prod->idestructuracomun = $idEntidadALaQueSeDevuelve;
                $prod->save();
                //print_r($prod->toArray());
                //die;

                $regNumerico->idproducto = $prod->idproducto;
                $regNumerico->save();
            }
            $objRegnumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value);
            $objRegnumActivo->idarearesp = $idEntidadALaQueSeDevuelve;
            $objRegnumActivo->idestadoperacion = 8;
            $collectionRegNumActivo->add($objRegnumActivo);
        }
        $collectionRegNumActivo->save();
    }

    /**
     * @param $identidad
     * @param $parametros
     * @return array
     *  Esto devuelve los medios que una vez fueron trasladados desde una entidad A a una entidad B, sin embargo
     *  la entidad B los rechaza y vuelven a la entidad A.
     */
    public function cargarMediosDevueltos($params)
    {

        $identidad = $params['identidad'];
        unset($params['identidad']);

        $regNumActivModel = new RegNumericoActivoModel();
        $query = $regNumActivModel->getQueryDataVisualizarRegNumActivos($params);
        $query->addSelect('p.idestructura as idestructuravieja');
        $query->addSelect('p.idestructura as idestructuraorigen');
        
        $query->addWhere('drna.idestadoperacion = ?', array(8));
        if($identidad){
          //  $query->addWhere('p.idestructuracomun = ?', array($identidad));
          $query->addWhere('p.idestructuracomun = ? and drna.idarearesp = ?',array($identidad, $identidad));

        }
     //   $query->addWhere('drna.plantilla = 1 ');

        if ($params['denomidmedio'] && $params['denomidmedio'] != '')
            $query = $this->getWhereIdentificador($params, $query, 'rn', 'drna', 'drnat');
        if ($params['marca-modelo'] && $params['marca-modelo'] != '') {
            $query = $query->andWhere("nmarc.denominacion ILIKE '%{$params['marca-modelo']}%' OR 
                                        nmod.denominacion ILIKE '%{$params['marca-modelo']}%'");
        }

        $datos = $query->fetchArray();
        foreach ($datos as $key => $value) {
            //$estructuraOrigen = $this->_sEstrComposicion->getEstructura($datos[$key]['idestructuravieja']);
           // $objDocumento = Doctrine::getTable('DatDocumento')->find($value['idregnumerico']);


            $estructuraOrigen = $this->integrator->metadatos->DameEstructura($datos[$key]['idestructuravieja']);
            $datos[$key]['estructuraorigen'] = $estructuraOrigen[0]->text;
            if ($value['cfgIndMed_denominacion'] && $value[$value['cfgIndMed_identificador']]) {
                $datos[$key]['denomidmedio'] = $value['cfgIndMed_denominacion'] . ': ' . $value[$value['cfgIndMed_identificador']];
            }
        }
        return $datos;
    }

    public function getWhereIdentificador($parametros, $query, $aliasRN = 'rn', $aliasRNA = 'rna', $aliasRNAT = 'rnt')
    {
        $whereIdentificador = "";
        $queryaux = Zend_Registry::get('conexion');
        $select = " select DISTINCT confident.identificador, confident.nombretabla";
        $from = " FROM mod_logactivofijotangible.conf_identificadormedio confident";
        $indicadoresmedios = $queryaux->fetchAll($select . $from);


        foreach ($indicadoresmedios as $pos => $item) {
            if ($item['nombretabla'] == "dat_regnumericoactivotransp") {
                $whereIdentificador .= " $aliasRNAT." . $item['identificador'] . " ILIKE '%" .
                    $parametros['denomidmedio'] . "%'";
            }
            if ($item['nombretabla'] == "dat_regnumericoactivo") {
                $whereIdentificador .= " $aliasRNA." . $item['identificador'] . " ILIKE '%" .
                    $parametros['denomidmedio'] . "%'";
            }
            if ($item['nombretabla'] == "dat_registronumerico") {
                $whereIdentificador .= " $aliasRN." . $item['identificador'] . " ILIKE '%" .
                    $parametros['denomidmedio'] . "%'";
            }

            if (count($indicadoresmedios) > $pos + 1) {
                $whereIdentificador .= " OR ";
            }
        }

        if ($whereIdentificador != "") {
            $query = $query->andWhere($whereIdentificador);
        }

        return $query;
    }

    /**
     * @param $iddocumento
     * @param bool $cancelar
     * @return Doctrine_Query
     * @throws Doctrine_Query_Exception
     *
     * Reimplementacion del metodo de DocumntoLogisticaModel, para poder sacar correctamente el numero del documento.
     */
    public function actualizarAprobadoPoryFecha($iddocumento, $cancelar = false)
    {
        //$idestructuras = $this->_mComunAFT->getIdEstructurasHijas($this->idestructuracomun, false, true, false);
		$idestructuras = $this->_mComunAFT->getIdsAreasHijas();
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $this->idsubsistema);

        $fecha = ($fecha->fecha) ? $fecha->fecha : date('d/m/Y');


        $docActualizar = Doctrine_Query::create()->update('DatDocumento')->set('aprobadopor', $this->idusuario)
            ->set('fechacontable', '?', $fecha);
        if ($cancelar) {
            $docActualizar->set('idnodo', 'null')
                ->set('controlfirma', 0);
        } else {
            $datosDoc = Doctrine::getTable('DatDocumento')->find($iddocumento)->toArray();
            $docActualizar->set('nrodoc',
                $this->devolverUltimoNumeroDoc($datosDoc['iddoc'], $idestructuras, $datosDoc['idejercicio'], 'nrodoc'));
        }
        $docActualizar->where('iddocumento = ?', array($iddocumento))
            ->execute();
        return $docActualizar;
    }

    public function generarDocumento($parametros)
    {

        // En caso de que el documento que se genera sea una reevaluacion
        if ($parametros['revaluado']) {
            $revaluado = $parametros['revaluado'];
        }

        ini_set('memory_limit', '2048M');
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $sRegNumActivo = new RegNumActivoService();

        $sRegNumActivo->initReNumActivoModel();
        $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();

        $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
            false, false, $parametros['codigooperacion'], false, $parametros['idestructuraEntidad']
        );

        if (count($operaciones) == 0) {
            throw new Exception('LOG_LB_DOC_001');
        } else {
            $parametros['idoperacion'] = $operaciones[0]['idoperacion'];
            $parametros['iddoc'] = $operaciones[0]['iddocentidad'];
            $valores = array();
            $cEstructura = 'Estructura';
            $identidad = ($parametros['idestructuraEntidad']) ? $parametros['idestructuraEntidad'] :
                ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;


            $datDocumento = $this->addActivoDoc($parametros);

            foreach ($parametros['datos'] as $key => $value) {
                $objDatRegnumericoActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                // En caso de que el documento sea de reevaluacion
                if ($value->valorcontablerevaluado && $value->depreciacionrev) {
                    $objDatRegnumericoActivo->valorcontable = $value->valorcontablerevaluado;
                    $objDatRegnumericoActivo->valorcontablealternativo = 0;
                    $objDatRegnumericoActivo->depreciacionacumulada = $value->depreciacionrev;
                    $objDatRegnumericoActivo->depreciacionacumuladaalternativo = 0;
                }
                $datos = $objDatRegnumericoActivo->toArray();
                foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                    $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin($value->idregnumerico);
                    $datos = array_merge($datos, $objDatRegnumericoActivoTransp->toArray());
                }

                $datos['idprod'] = $value->idprod;
                $valores[$key] = $datos;
            }
            new DatMovRegnumerico();
            new DatMovRegnumericoActivo();
            $_sMovimiento = new MovimientoService();
            $datDocumento = $_sMovimiento->crearMovimiento($valores, $datDocumento);
            $datDocumento->save();
            return $datDocumento;
        }
    }
    
    Public function updateregnumericoactivo(){
        $conn = Zend_Registry::get('conexion');        
        $querymaxdoc = "SELECT max(d.iddocumento) FROM mod_logistica.dat_documento d";
        $result = $conn->fetchAll($querymaxdoc);

        $queymaxmov =" SELECT  m.idmovimiento 
                            from mod_logistica.dat_movimiento m 
                            where iddocumento = {$result[0]['max']}";
        $idmmovimiento = $conn->fetchAll($queymaxmov);

         $sqlupdate = "
                UPDATE 
                mod_logactivofijotangible.dat_regnumericoactivo a
                SET idgruposubgrupo = b.idgruposubgrupo,
                    denominacion = b.denominacion,
                    idnaturaleza = b.idnaturaleza
                from (
                  SELECT ih.idgruposubgrupo, rn.idregnumerico, i.denominacion, i.idnaturaleza
                  FROM mod_logactivofijotangible.dat_registronumerico rn 
                  inner join  mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idregnumerico = rn.idregnumerico
                  inner join mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto 
                  inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                  inner join mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = i.idindicador
                  where  mrn.idmovimiento = {$idmmovimiento[0]['idmovimiento']}
                ) b
                WHERE 
                a.idregnumerico = b.idregnumerico";

        if ($idmmovimiento[0]['idmovimiento']) {
                $conn->execute($sqlupdate);
            }
    }
    public function addDocumentoFirma($params)
    {
        $doc = Doctrine::getTable('DatDocumento')
            ->findByDql('iddocumento =?', array($params['iddocumento']));
        return $doc[0];
    }

    public function obtenerNroDoc($iddocumento)
    {
        $datosDoc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        return $datosDoc->nrodoc;
    }
    
    public function confirmarDocumento($iddocumento)
    {
        $success = parent::confirmarDocumento($iddocumento);
        if($success)
            $this->actualizarCentrosCosto ($iddocumento);
        return $success;
    }
    
    public function actualizarCentrosCosto($idDocumento){
        
        $sql = "UPDATE mod_logactivofijotangible.dat_movregnumericoactivo mrnaext
            set idcentrocosto = COALESCE (
            (
            SELECT docaft.idcentrocosto
            FROM mod_logactivofijotangible.dat_documentoactivo docaft
            where docaft.iddocumentoactivo = $idDocumento
            ),
              (
              SELECT rna.idcentrocosto 
                FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrna on mrna.idregnumerico = rna.idregnumerico
                INNER JOIN mod_logistica.dat_movimiento m on m.idmovimiento = mrna.idmovimiento
                where mrna.idmovregnumerico = mrnaext.idmovregnumerico and m.iddocumento =  $idDocumento
              )
            )
            where mrnaext.idmovregnumerico IN (
                  select movrn.idmovregnumerico 
                  from mod_logactivofijotangible.dat_movregnumerico movrn
                  inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = movrn.idmovimiento
                  where mov.iddocumento = $idDocumento
              )";
        
        $conn = Zend_Registry::get('conexion');
        $conn->execute($sql);
    }

    public function getAreasResponsabilidad($params) {
        return $this->_mComunAFT->getAreasHijas($params);
    }
	
	public function actalizarValorDepreciacion($iddocumento){
		$sql = "update mod_logactivofijotangible.dat_movregnumericoactivo mrna
				set depreciacion = mrna.depreciacionacumulada,
					depreciacioncuc = mrna.depreciacionacumuladaalternativo
				where mrna.idmovregnumerico IN (
					select mrn.idmovregnumerico
					from mod_logactivofijotangible.dat_movregnumerico mrn
					inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
					where m.iddocumento in ($iddocumento)
				)";
        
        $conn = Zend_Registry::get('conexion');
        $conn->execute($sql);
	}



    public function agregarDocumentoCliente($documento, $identidadorigen)
    {
        if(!$identidadorigen)
            $identidadorigen = $this->global->Estructura->idestructura;

        $sql = "SELECT cp.idclientesproveedores 
                FROM mod_datosmaestros.nom_clientesproveedor cp
                 WHERE cp.idestructura = {$identidadorigen}";
        $conn = Zend_Registry::get('conexion');
        $clientes = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        if(count($clientes) == 0){
            $documento->DatDocumentoCliente[0]->idcliente = $identidadorigen;
            $documento->DatDocumentoCliente[0]->tipocliente = 3;
        }else{
            $documento->DatDocumentoCliente[0]->idcliente = $clientes[0]['idclientesproveedores'];
            $documento->DatDocumentoCliente[0]->tipocliente = 1;
        }
        $documento->DatDocumentoCliente[0]->idestructura = $identidadorigen;

        return $documento;
    }


    // Si devuelve 1-> OK
    // Si devuelve 2-> Error de validacion (No es el ultimo documento de uno o varios activos)
    // Si devuelve 3-> Error de validacion del tipo de documento que se intenta desaprobar
    // Si devuelve 4-> Error interno
    public function desaprobarDocumento($doc){

	    try{
            $operacion = $this->_mComunAFT->getDatosInterfazByIdOperacion($doc->idoperacion);

            if(
                $operacion['codigo'] != 'OPER_MEDIOPROPIOS'
                && $operacion['codigo'] !=  'OPER_ALTA'
                && $operacion['codigo'] !=  'OPER_ALTA_AJUSTE'
                && $operacion['codigo'] !=  'OPER_COMPRA'
                && $operacion['codigo'] !=  'OPER_BAJA'
                && $operacion['codigo'] !=  'OPER_MOD_VALOR'
                && $operacion['codigo'] !=  'OPER_REEVALUACION'
                && $operacion['codigo'] !=  'OPER_MOD_PROPIEDAD'
                && $operacion['codigo'] !=  'DOC_MOD_PROP_GRAL'
                && $operacion['codigo'] !=  'OPER_BAJA_DESARME'
                && $operacion['codigo'] !=  'OPER_PERDIDA'
                && $operacion['codigo'] !=  'OPER_BAJA_DEFINITIVA'
                && $operacion['codigo'] !=  'OPER_BAJA_VENTA'
                && $operacion['codigo'] !=  'OPER_UTILESHERRA'
                && $operacion['codigo'] !=  'OPER_UTILESHERRA_EXT'
                && $operacion['codigo'] !=  'OPER_AFTUSO'
                && $operacion['codigo'] !=  'OPER_BAJAUTILHERRA'

            ) {
                return 3;
            }

            $estadoCanceladoDoc = EstadoDocumentoModel::ESTADO_CANCELADO;

            // **** Valida si el documento es el ultimo para todos los activos y utiles que estan en el
            $sql = "SELECT mrn.idregnumerico, (
                  -- selecciona el ultimo iddocumento para cada rn
                  SELECT dd.iddocumento 
                  FROM mod_logistica.dat_documento dd
                  INNER JOIN mod_logistica.dat_movimiento mm on mm.iddocumento = dd.iddocumento
                  INNER JOIN mod_logactivofijotangible.dat_movregnumerico mmrn on mmrn.idmovimiento = mm.idmovimiento
                  WHERE mmrn.idregnumerico = mrn.idregnumerico and dd.estado <> $estadoCanceladoDoc
                  ORDER BY mmrn.idmovregnumerico DESC limit 1                
                ) = {$doc->iddocumento} as esta
                FROM mod_logactivofijotangible.dat_movregnumerico mrn
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
                INNER JOIN mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
                
                WHERE d.iddocumento = {$doc->iddocumento}
            ";

            $conn = Zend_Registry::get('conexion');
            $dataMrn = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            foreach ($dataMrn as $mrn){
                if(!$mrn['esta'] || $mrn['esta'] == false){
                    return 2;
                }
            }


            // ***** Fin Validacion ****

            // Ejecutar servicio para cancelar el comprobante
            ServiciosContabilidadFinanzasHelper::__init()->anularComprobante($doc);

            // Revirtiendo el documento a estado confirmado
            $doc->estado = $estadoCanceladoDoc;
            $doc->nrodoc = null;
            $doc->save();

            // Revirtiendo los datos del registro numerico

            $collRn = new Doctrine_Collection('DatRegnumerico');
            foreach ($dataMrn as $mrn){

                $sqlMrnAft = "select mrna.*, nop.codigooperacion, nop.idnomoperaciones
                            from mod_logactivofijotangible.dat_movregnumerico mrn
                            inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
                            inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
                            inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento                            
                            inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = d.idoperacion                            
                            where mrn.idregnumerico = {$mrn['idregnumerico']} 
                              and d.iddocumento <> {$doc->iddocumento} and d.estado <> $estadoCanceladoDoc
                            order by d.cronologia DESC
                            limit 1";
                $mrnAft = $conn->execute($sqlMrnAft)->fetchAll(PDO::FETCH_ASSOC);

                if(count($mrnAft) == 0){
                    // Es un alta y el rn hay que eliminarlo
                    Doctrine_Query::create()->delete('DatRegnumericoActivo')->where('idregnumerico = ?', $mrn['idregnumerico'])->execute();
                }else{
                    $oldOperacion = $this->_mComunAFT->getDatosInterfazByIdOperacion($mrnAft[0]['idnomoperaciones']);
                    if($oldOperacion['idestadoperacion'] != null)
                        $mrnAft[0]['idestadoperacion'] = $oldOperacion['idestadoperacion'];

                    $rn = Doctrine::getTable('DatRegnumerico')->find($mrn['idregnumerico']);
                    $rn->synchronizeWithArray($mrnAft[0]);

                    if(strpos( $operacion['codigo'], 'OPER_BAJA' ) !== false){
                        $mrnAft[0]['esbaja'] = 0;
                    }
                    $rn->DatRegnumericoActivo->synchronizeWithArray($mrnAft[0]);
                    $collRn->add($rn);
                }
            }
            $collRn->save();
            return 1;
        }
	    catch (Exception $exc){
	        //print_r($exc);die;
	        return 4;
        }
    }

    public function cancelarEstadoDoc($iddocumento) 
    {
        $this->trazaDocumento->guardarTraza('Estado anulado ', $iddocumento);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ELABORACION);
    }

    public function actializarComprobante($iddocumento){
        $query = "SELECT valor  FROM mod_logistica.nom_variableglobal gb where gb.nombre = 'OPER_NO_CONTABILIZA'";
        $result = explode(',',LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($query));
        if(count($result)){
            foreach ($result as $idopernoc){
                Doctrine_Query::create()->update('DatDocumento')->set('idcomprobante', -1)
                ->where('iddocumento = ? and idoperacion = ?', array($iddocumento, $idopernoc))
                ->execute();
            }
        }
    }

    public function devolverUsuarios($campo = 'idusuario')
    {
        $objIddocMMAFT = $this->documentosHelper->devuelveIddocByIdEstructura(
            'MMAFT', $this->idestructuracomun, $this->idsubsistema
        );
        $objIddocCUHFAR = $this->documentosHelper->devuelveIddocByIdEstructura(
            'SCM120G', $this->idestructuracomun, $this->idsubsistema
        );
        $objIddocCUHE = $this->documentosHelper->devuelveIddocByIdEstructura(
            'cuhe', $this->idestructuracomun, $this->idsubsistema
        );
         $objIddocCUHE = $this->documentosHelper->devuelveIddocByIdEstructura(
            'uh', $this->idestructuracomun, $this->idsubsistema
        );
        $objIddocDep = $this->documentosHelper->devuelveIddocByIdEstructura(
            'DepAFT', $this->idestructuracomun, $this->idsubsistema
        );
        $iddoc = array($objIddocMMAFT->iddoc);
        if ($objIddocCUHFAR->iddoc) {
            $iddoc[] = $objIddocCUHFAR->iddoc;
        }
        if ($objIddocCUHE->iddoc) {
            $iddoc[] = $objIddocCUHE->iddoc;
        }
        if ($objIddocUH->iddoc) {
            $iddoc[] = $objIddocUH->iddoc;
        }
        if ($objIddocDep->iddoc) {
            $iddoc[] = $objIddocDep->iddoc;
        }
        $dql = Doctrine_Query::create()->select("DISTINCT d.{$campo} as id")->from('DatDocumento d')->groupBy("d.{$campo}");
        if (count($iddoc)) {
            $dql->andWhereIn('d.iddoc', $iddoc);
        }

        $queryResults = $dql->fetchArray();

        $usuariosDevueltos = array($this->idusuario);
        foreach ($queryResults as $idusuario) {
            //if (!array_search($idusuario['id'], $usuariosDevueltos)) {
            array_push($usuariosDevueltos, $idusuario['id']);
            //}
        }
        return ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
    }

    public function getCondicionPagoByProv($params) {
        $proveedor = $this->configuracionHelper->getClientesProveedorByParams(
            $params['idclienteproveedor'], null, null, null, null, null
        );

        $array = array();
        $arrayId = array();
        $count = 0;
        foreach ($proveedor['datos'][0]['cobrospagos'] as $cond) {
            if (!in_array($cond['idterminodepago'], $arrayId) && $cond['idclasificacion'] == 2 && $cond['idterminodepago'] != null) {
                if (isset($params['query']) && strlen($params['query']) > 0) {
                    if (stripos($cond['nombreterminodepago'], $params['query']) !== false) {
                        $arrayId[] = $cond['idterminodepago'];
                        $array[] = array('idterminodepago' => $cond['idterminodepago'], 'nombre' => $cond['nombreterminodepago']);
                        $count++;
                    }
                } else {
                    $arrayId[] = $cond['idterminodepago'];
                    $array[] = array('idterminodepago' => $cond['idterminodepago'], 'nombre' => $cond['nombreterminodepago']);
                    $count++;
                }
            }
        }
        return array('cantidad' => $count, 'datos' => $array);
    }

    public function fBalanceExportarConso($params){
        
        $conn = Zend_Registry::get('conexion');
         //Obtener fecha inicio del Ejercicio
         $identidad = $this->global->Estructura->idestructura;
         $periodoActual=$this->global->Periodo->periodoactual;
         $idEstructura = $this->global->EstructuraEconomica->idestructuracomun;
         $fechaSubsist = $this->integrator->datosmaestros->fechaContableSubsistema($idEstructura, 11);
         $ejercicio = $conn->fetchAll(
            "SELECT e.inicio, e.fin from mod_datosmaestros.dat_ejerciciocontable e
        inner join mod_datosmaestros.dat_periodocontable pc on (pc.idejercicio = e.idejercicio)
        where pc.idperiodo = $periodoActual"
        )[0];

        $fechaInicoEjercicio = $ejercicio['inicio'];
        $fechaFinEjercicio = $ejercicio['fin'];
        $idestructuracomun = $this->global->Estructura->idestructura;
        $fechainicio = $params['fechainicio'];
        $fechafin= ($params['fechafin']) ? $params['fechafin']:$fechaSubsist;

        $query = "SELECT distinct * FROM mod_logactivofijotangible.f_exportaractivoconso(
            {$idestructuracomun},
           '{$fechainicio}'::date,
           '{$fechafin}'::date,
           '{$fechaInicoEjercicio}'::date,
           '{$fechaFinEjercicio}'::date
           
    )";
        $resultado = $conn->fetchAll($query);
     
        $arrayfinal = array();
        
      
        foreach ($resultado as $k => $result){
         
                    $arrayfinal[$k]['Mes_inicio'] = $result['mesinicio'];
                    $arrayfinal[$k]['Año_inicio'] = $result['annoinicio'];
                    $arrayfinal[$k]['Mes_fin'] = $result['mesfin'];
                    $arrayfinal[$k]['Año_fin'] = $result['annofin'];
                    $arrayfinal[$k]['Cuenta'] = $result['cuenta'];
                    $arrayfinal[$k]['Descripcion'] = $result['descripcion'];
                    $arrayfinal[$k]['SaldoApertura'] = $result['saldoapertura'];
                    $arrayfinal[$k]['SaldoAltas'] = $result['saldoalta'];
                    $arrayfinal[$k]['Saldo_Altas_Traspasos'] = $result['saldoaltatraspaso'];
                    $arrayfinal[$k]['Saldo_Bajas'] = $result['saldobajas'];
                    $arrayfinal[$k]['Saldo_Bajas_Traspasos'] = $result['saldobajastraspaso'];
                    $arrayfinal[$k]['Saldo_depreciacion'] = $result['saldodepreciacion'];
                    $arrayfinal[$k]['Saldo_Reclasificacion'] = $result['saldoreclasificacion'];
                    $arrayfinal[$k]['Saldo_Ajustes'] = $result['saldoajustes'];
                    $arrayfinal[$k]['Saldo_FaltanteSobrante'] = $result['saldofaltantesobrante'];
                    $arrayfinal[$k]['Saldo_Final'] = $result['saldofinal'];
                    $arrayfinal[$k]['Periodo'] = $result['proximoperiodo'];
                   //array_push($arrayfinal, $arrayfinal[$k]);
                 
                
        }//print_r($arrayfinal);die;
       
        $fecha = date('dmY');

        $filas = "";
        foreach($arrayfinal as $datosf){
           
            $Mes_inicio = $datosf['Mes_inicio'];
            $Año_inicio = $datosf['Año_inicio'];
            $Mes_fin = $datosf['Mes_fin'];
            $Año_fin = $datosf['Año_fin'];
            $Cuenta = $datosf['Cuenta'];
            $Descripcion = $datosf['Descripcion'];
            $Saldo_Apertura = $datosf['SaldoApertura'];
            $Saldo_Altas = $datosf['SaldoAltas'];
            $Saldo_Altas_Traspasos = $datosf['Saldo_Altas_Traspasos'];
            $saldoBajas = $datosf['Saldo_Bajas'];
            $saldoBajasTraspasos = $datosf['Saldo_Bajas_Traspasos'];
            $Saldo_Depreciacion = $datosf['Saldo_depreciacion'];
            $Saldo_Reclasificación = $datosf['Saldo_Reclasificacion'];
            $Saldo_Ajustes = $datosf['Saldo_Ajustes'];
            $Saldo_Faltante_Sobrante = $datosf['Saldo_FaltanteSobrante'];
            $SaldoFinal = $datosf['Saldo_Final'];
            $Periodo = $datosf['Periodo'];

         
            $filas = $filas .'"' . $Mes_inicio . '"'." " . $Año_inicio." ".'"' .$Mes_fin . '"'." " .$Año_fin." ".'"' . $Cuenta. '"'." ".'"' . $Descripcion 
            . '"'." ". $Saldo_Apertura." " . $Saldo_Altas." ". $Saldo_Altas_Traspasos." ". $saldoBajas ." " . $saldoBajasTraspasos
           ." ". $Saldo_Depreciacion." " . $Saldo_Reclasificación
           ." " . $Saldo_Ajustes." " . $Saldo_Faltante_Sobrante." " . $SaldoFinal." ".'"' . " ". '"'." ".'"' . $Periodo . '"'. "\r\n";
        }
        //print_r($arrayfinal);die;
        $filecontent =  $filas;
    //    print_r($filecontent);die;
        return $filecontent;
    }

    /*public function ignorarMediosTrasladados($idregistros){
        if(!$idregistros || !is_array($idregistros) || count($idregistros) < 1){
            return false;
        }
        $sql_rn = implode(',', $idregistros);
        $sql = "update mod_logactivofijotangible.dat_regnumericoactivo rna
        set idestadoperacion = 7, esbaja = 1
        where rna.idregnumerico IN ({$sql_rn})";

        $conexion = Zend_Registry::get('conexion');
        $conexion->execute($sql);
        return true;

    }*/
}
