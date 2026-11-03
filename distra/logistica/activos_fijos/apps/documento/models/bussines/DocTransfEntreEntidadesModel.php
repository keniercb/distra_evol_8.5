<?php

/**
 *
 */
class DocTransfEntreEntidadesModel extends DocumentoActivoModel
{
    protected $_sRegNumerico;
    protected $_sConfGeneral;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        parent:: __construct($idsubsistema);
        $this->_sRegNumerico = new RegNumericoService();        
    }

    /**
     *
     */
    public function aprobarDocumento($idDocumento, $idOperacion, $observaciones, $idEntidadPadre)
    {
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $cDatDocTransferenciaEntidades = 'DatDocTransferenciaEntidades';

        $oDocumento = Doctrine::getTable('DatDocumento')->find($idDocumento);

        $oDocumento = $this->agregarDocumentoCliente($oDocumento, $oDocumento->$cDatDocumentoActivo->$cDatDocTransferenciaEntidades->identidaddestino);
        $oDocumento->save();

        $documento = parent::aprobarDocumento($idDocumento, $idOperacion, $observaciones, $idEntidadPadre);

        $oRegNumerico = $this->_sRegNumerico->getIdesRegNumByIdDocumento($idDocumento);
        $collectionRegNumActivo = new Doctrine_Collection('DatRegnumericoActivo');

        foreach ($oRegNumerico as $value) {

            $regNumerico = Doctrine::getTable('DatRegnumerico')->find($value);
            $producto = Doctrine::getTable('DatProductoLogistica')->find($regNumerico->idproducto);

            //  Buscamos si existe un datproducto en la estructura destino con ese idindicador.
            //  El dat_producto debe tener en el campo idestrucuracomun la entidad destino, y en
            //  el campo idestructura la entidad origen del traslado
            $idEntDestino = $oDocumento->$cDatDocumentoActivo->$cDatDocTransferenciaEntidades->identidaddestino;

            $query = new Doctrine_Query();
            $query->select('p.idproducto as idproducto');
            $query->from('DatProductoLogistica p');
            $query->where('p.idestructuracomun = ? and p.idindicador = ? and p.idestructura = ?',
                array($idEntDestino, $producto->idindicador, $idEntidadPadre));
            //$query->where('p.idestructura = ? and p.idindicador = ?', array($idEntDestino, $producto->idindicador));
            $idProducto = $query->fetchOne()->idproducto;

            // Para poner el producto que lleva el movimiento
            if ($idProducto) {
                $regNumerico->idproducto = $idProducto;
                $regNumerico->save();
            } else {

                // En caso de que la entidad no tenga un idproducto de ese idindicador 
                // hay que crear un idproducto nuevo
                $prod = new DatProductoLogistica();
                $prod->idindicador = $producto->idindicador;
                $prod->idestructura = $idEntidadPadre;
                $prod->idestructuracomun = $idEntDestino;
                $prod->save();

                $regNumerico->idproducto = $prod->idproducto;
                $regNumerico->save();
            }
            //$comunAFT = ComunAFTModel::getInstance();
            //$operacion = ServiciosConfiguracionGeneralHelper::__init()->obtenerOperaciones(0, 0, 0, $idOperacion);
            /*$operacion = $comunAFT->getDatosInterfazOperacion(
                false, false, false, false, false, 0, false, $idOperacion
            );*/
            $objRegnumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value);
            $objRegnumActivo->idarearesp = $oDocumento->$cDatDocumentoActivo
                ->$cDatDocTransferenciaEntidades->identidaddestino;
            $objRegnumActivo->idestadoperacion = 6;//$operacion[0]['idestadoperacion'];
            $collectionRegNumActivo->add($objRegnumActivo);
        }

        $collectionRegNumActivo->save();

        if ($oDocumento->$cDatDocumentoActivo->masivo == 1) {
            $sql = "select dp.iddocumentos from mod_datosmaestros.dat_documentoprim dp
                    inner join mod_logistica.dat_documento d on d.iddoc = dp.iddoc
                    where d.iddocumento = {$idDocumento} 
                    ";
            $query = Zend_Registry::get('conexion');
            $docprim = $query->fetchAll($sql);
            $entidaddestino = $oDocumento->$cDatDocumentoActivo->DatDocTransferenciaEntidades->identidaddestino;
            $operaciones = $this->_mComunAFT->getDatosInterfazOperacion(
                17, false, null, false, $entidaddestino, $docprim[0]['iddocumentos'],
                false
            );
            $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                'MMAFT', $entidaddestino, $this->idsubsistema
            );

            $iddoc = $objDocPrim->iddoc;
            $idoperacionRecep = $operaciones[0]['idoperacion'];
            $idareadestino = $oDocumento->$cDatDocumentoActivo->idareadestino;
            $identidadOrigen = $this->idestructuracomun;
            $sqlTraslado = "select mrn.idregnumerico, m.idproducto, m.iddocumento, m.idmovimiento, mra.idarearesp, 
                            p.idindicador as idprod from mod_logactivofijotangible.dat_movregnumericoactivo mra
                            inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovregnumerico = mra.idmovregnumerico
                            inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
                            inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
                            where m.iddocumento = {$idDocumento}";
            $datosTraslado = $query->fetchAll($sqlTraslado);
            $dataTraslado = array();
            foreach ($datosTraslado as &$d) {
                $d['iddocumentoOld'] = $d['iddocumento'];
                $d['idestructuracomunOld'] = $d['idarearesp'];
                unset($d['iddocumento']);
                unset($d['idarearesp']);
                array_push($dataTraslado, (Object) $d);
            }
            $params = array(
                'idestructuracomun' => $idareadestino,
                'iddeposito' => $idareadestino,
                'datosTraslado' => $dataTraslado,
                'idoperacion' => $idoperacionRecep,
                'iddoc' => $iddoc,
                'identidad' => $entidaddestino,
                'identidadorigen' => $identidadOrigen,
                'trasladomasivo' => 1
            );
            $objGesDocModelo = DocumentoActivoFactory::getInstance(
                $idoperacionRecep, LogisticaGlobal::SUBSISTEMA_AFT
            );
            $doc = $objGesDocModelo->addActivoDoc($params);
        }
        return $documento;
    }

    /**
     *
     */
    public function addActivoDoc($parametros)
    {
        $cDatDocumentoActivo = 'DatDocumentoActivo';
        $cDatDocTransferenciaEntidades = 'DatDocTransferenciaEntidades';

        $documento = parent::addActivoDoc($parametros);

        if (!ctype_digit($parametros['identidaddestino'])) {
            unset($parametros['identidaddestino']);
        }

        $documento->$cDatDocumentoActivo->$cDatDocTransferenciaEntidades->synchronizeWithArray($parametros);
        $documento->save();

        return $documento;
    }

    /**
     *
     */
    private function getArrIdesRegNumEnEstructura($idEstructura)
    {
        $subQuery = new Doctrine_Query();
        $subQuery->from('DatDocumento d')
            ->innerJoin('d.DatMovimientos m')
            ->select('d.iddocumento, mr.idregnumerico AS idregnumerico');

        // Movimiento de registro numérico
        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModelMy($subQuery, 'm', 'mr', 1);

        $subQuery->whereIn('d.idestructuracomun', $this->_mComunAFT->getIdEstructurasHijas($idEstructura, true));

        $arrIdsMovregNumericos = array();
        foreach ($subQuery->fetchArray() as $value) {
            array_push($arrIdsMovregNumericos, $value['idregnumerico']);
        }

        return $arrIdsMovregNumericos;
    }

    /**
     *
     */
    private function getDatosTraslados($parametros)
    {
        $query = Zend_Registry::get('conexion');
        $select = " WITH max_cronologia AS (
                    SELECT idproducto, MAX(cronologia) as max_cron
                    FROM mod_logistica.dat_producto
                    GROUP BY idproducto
          ) select DISTINCT p.idindicador AS idprod, rn.idregnumerico as idregistronumerico,
            d.nrodoc AS nrodoc,
            d.idestructuracomun AS idestructuracomun,
            d.iddoc AS iddoc,
            docprim.denominacion as tipodoc,
            d.iddocumento,
            i.denominacion AS activo,
            ma.denominacion AS marca,
            mo.denominacion AS modelo,           
            rn.nroserie AS nserie,
            ra.nroinventario AS nroinventario,
            i.codigo, p.idproducto,m.*,
            i.denominacion as denominacion,
            d.fechacontable,
            nc.concatcta, 

    d.iddocumento, i.idindicador as id, (case when i.idpadre = i.idindicador then null else i.idpadre
     end) as _parent, i.idpadre as idpadre, (CASE WHEN (i.ordender - i.ordenizq ) = 1 THEN 1 ELSE 0 END)
     as _is_leaf, i.ordenizq as _lft, i.ordender as _rgt, i.idindicador as idindicador, i.denominacion as
     denominacion, i.numeropieza as numeropieza, i.descripcion as descripcion, i.idnaturaleza as idnaturaleza
    , i.codigo as codigo, i.nivel as nivel, i.nivel as _level, (i.codigo || ' - ' || i.denominacion) as text
    , i.idformato as idformato, i.idpais as idpais, i.idumedida as idumedida, i.estado as estado, i.activo
     as activo,  (CASE WHEN i.tipo = 2 THEN 'cog' ELSE 'box' END) as iconCls, i.tipo as tipo, i.fechainicio
     as fechainicio, i.fechafin as fechafin, i.numeropieza as codigoproveedor, i.idtabla as idtabla, i.idtablageneral
     as idtablageneral, i.arridtablas as arridtablas, i.arridtablasgenerales as arridtablasgenerales, coalesce
    (ih.precio,0) as precio, (CASE WHEN ih.tipocontrol = 2 THEN 1 ELSE 0 END) as tienelote, (CASE WHEN ih
    .tipocontrol = 3 THEN 1 ELSE 0 END) as equipo, (CASE WHEN ih.tipocontrol = 4 THEN 1 ELSE 0 END) as municion
    , ih.explotacion as explotacion, ih.almacenado as almacenado, ih.idmarca as idmarca, ih.idgruposubgrupo
     as idgruposubgrupo, ih.idmodelo as idmodelo, ih.peso as peso, ih.largo as largo, ih.ancho as ancho,
     ih.alto as alto, ih.tipocontrol as tipocontrol, ih.codigoauxiliar as codigoauxiliar, /*(SELECT img.idimagen
     FROM DatImagenindicador img WHERE img.principal = 0 AND img.idindicador = i.idindicador LIMIT 1) as
     imagen,*/ ma.denominacion as marca, ma.estado as usomarca ,  mo.denominacion as modelo, mo.estado as usomodelo
     ,  (mo.denominacion || '-' || ma.denominacion) as marcamodelo , (i.denominacion || ' '||((Case When
     ih.idmarca is not null Then (ma.denominacion  || (Case When ih.idmodelo is not null Then ' - ' Else
     '' End)) Else '' End)  || (Case When ih.idmodelo is not null Then mo.denominacion Else '' End))) as
     descripcionmarcamodelo, ra.idpadre as idpadremodulo, ra.idarbol as idarbol, ra.ordender as ordendermodulo
    , ra.ordenizq as ordenizqmodulo, ra.idarbol as idarbolmodulo, ra.asignado as asignado, ra.esmodulo as
     esmodulo, ra.esbaja as esbaja, ra.plantilla as plantilla, ra.estaentidad as estaentidad, ra.valormodulo
     as valormodulo, ra.valormoduloalternativo as valormoduloalternativo, ra.nroinventario as nroinventario,
     ra.depreciacionacumulada as depreciacionacumulada
    , ra.vidautil as vidautil, ra.porcientorecuperacion as porcientorecuperacion, ra.valorcontable as valorcontable
    , ra.fechaexpini as fechaexpini, ra.fechaexpfin as fechaexpfin, ra.fechaadq as fechaadq, ra.tasafiscal
     as tasafiscal, ra.idarearesp as idarearesp, ra.idcolorprim as idcolorprim, ra.idcolorsec as idcolorsec
    , ra.valoradquisicion as valoradquisicion, ra.idcentrocosto as idcentrocosto, ra.idestatustecnico as
     idestatustecnico, ra.idubicacion as idubicacion, ra.idactividad as idactividad, ra.annofabricacion as
     annofabricacion, ra.idcategoria as idcategoria, ra.idresponsable as idresponsable, ra.cantidadrecursoconsumido
     as cantidadrecursoconsumido, ra.fechainicialgarantia as fechainicialgarantia, ra.fechafingarantia as
     fechafingarantia, ra.recursoconsumidomax as recursoconsumidoma, confident.denominacion as denomconfmedio, 
     confident.identificador as identificador, confident.ididentificadormedio as ididentificadormedio, rnat.*,
     docprim.iddocumentos as idnomiddocprim

    FROM mod_logistica.dat_documento d 
    INNER JOIN mod_datosmaestros.dat_documentoprim dat_docprim on dat_docprim.iddoc = d.iddoc
    INNER JOIN mod_datosmaestros.nom_docprim docprim on dat_docprim.iddocumentos = docprim.iddocumentos
    INNER JOIN mod_logactivofijotangible.dat_documentoactivo da ON d.iddocumento = da .iddocumentoactivo
    INNER JOIN mod_logactivofijotangible.dat_doctransfentidades dte ON da.iddocumentoactivo = dte.iddoctranfentidades
    INNER JOIN mod_logistica.dat_movimiento m ON d.iddocumento = m.iddocumento 
    INNER JOIN mod_logistica.dat_producto p ON m.idproducto = p.idproducto
    LEFT JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
    LEFT JOIN mod_datosmaestros.nom_naturaleza natu ON natu.idnaturaleza = i.idnaturaleza
    LEFT JOIN mod_logactivofijotangible.conf_identificadormedio confident ON confident.idindicador = i.idindicador
    LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador 

    LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
    LEFT JOIN mod_logactivofijotangible.conf_gruposcuentas cgc on cgc.idgruposubgrupo = g.idgruposubgrupo
    LEFT JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = cgc.idcuentaactivo

    LEFT JOIN mod_datosmaestros.nom_marca ma ON ih.idmarca = ma.idmarca 
    LEFT JOIN mod_datosmaestros.nom_modelo mo ON ih.idmodelo = mo.idmodelo 
    INNER JOIN mod_logactivofijotangible.dat_movregnumerico mr ON m.idmovimiento = mr.idmovimiento 
    INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON mr.idregnumerico = rn.idregnumerico 
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo ra ON rn.idregnumerico = ra.idregnumerico
    left JOIN mod_logactivofijotangible.dat_regnumericoactivotransp rnat ON rnat.idregnumerico = ra.idregnumerico
    INNER JOIN max_cronologia mc ON p.idproducto = mc.idproducto AND p.cronologia = mc.max_cron";

    $estructuracomun = $this->global->estructura->idestructura;
    
    
    $queryPart = '';
    if($parametros['idarearesp']){
        $queryPart = " ra.idarearesp = {$parametros['idarearesp']} AND ";
    }
        $where = " WHERE {$queryPart} ra.idestadoperacion = 6 AND dte.identidaddestino =  $estructuracomun";

        if ($parametros['denominacion']) {
            $where .= " and i.denominacion ILIKE '%{$parametros['denominacion']}%'";
            //$query->addWhere(" i.denominacion iLike '%{$parametros['denominacion']}%' ");
        }
        if ($parametros['tipodoc']) {
            $where .= " and docprim.denominacion ILIKE '%{$parametros['tipodoc']}%'";
            //$query->addWhere(" i.denominacion iLike '%{$parametros['denominacion']}%' ");
        }
        if ($parametros['nroinventario']) {
            $where .= " and ra.nroinventario ILIKE '%{$parametros['nroinventario']}'";
            //$query->addWhere(" i.denominacion iLike '%{$parametros['denominacion']}%' ");
        }
        if ($parametros['nrodoc']) {
            $where .= " and d.nrodoc = {$parametros['nrodoc']}";
            // $query->addWhere(" doc.nrodoc = '{$parametros['nrodoc']}'");
        }        
        if($parametros['tipo'] == 0 || $parametros['tipo'] == 1){             
             $where .= " and da.tipo = {$parametros['tipo']}";            
        } 
        
        if ($parametros['marca-modelo']) {
            $where .= " and (ma.denominacion ILIKE '%{$parametros['marca-modelo']}%' OR "
                ." mo.denominacion ILIKE '%{$parametros['marca-modelo']}%')";
        }
        if ($parametros['denomidmedio'] != null) {
            $whereIdentificador = "";
            $whereIdentificador = $this->getIdentificadorDat($parametros);
            $where .= " and $whereIdentificador";
            //$query->addWhere($whereIdentificador);
        }        
        $order = " ORDER BY i.codigo ASC";
        $sql = $select.$where.$order;
        $total = count($query->fetchAll($sql));
        
        if ($parametros['limit']) {
            $select .= " LIMIT {$parametros['limit']} OFFSET {$parametros['start']}";
        }
        
        $result = $query->fetchAll($sql);
        foreach ($result as &$re){
            $re['idregnumerico'] = $re['idregistronumerico'];
        }
        return array('datos' => $result, 'cantidad' => $total);
    }

    public function getIdentificadorDat($parametros)
    {
        $whereIdentificador .= "(";
        $queryaux = Zend_Registry::get('conexion');
        $select = " select DISTINCT confident.identificador, confident.nombretabla";
        $from = " FROM mod_logactivofijotangible.conf_identificadormedio confident";
        $indicadoresmedios = $queryaux->fetchAll($select.$from);


        foreach ($indicadoresmedios as $pos => $item) {
            if ($item['nombretabla'] == "dat_regnumericoactivotransp") {
                $whereIdentificador .= " rnat.".$item['identificador']." ILIKE '%".
                    $parametros['denomidmedio']."%'";
            }
            if ($item['nombretabla'] == "dat_regnumericoactivo") {
                $whereIdentificador .= " ra.".$item['identificador']." ILIKE '%".
                    $parametros['denomidmedio']."%'";
            }
            if ($item['nombretabla'] == "dat_registronumerico") {
                $whereIdentificador .= " rn.".$item['identificador']." ILIKE '%".
                    $parametros['denomidmedio']."%'";
            }

            if (count($indicadoresmedios) > $pos + 1) {
                $whereIdentificador .= " OR ";
            }
        }
        $whereIdentificador .= ")";
        return $whereIdentificador;
    }

    /* Hay que arreglarlo que no funciona correctamente */

    private function getDatosTrasladosdos($parametros)
    {
        //$idEstructura = $parametros['idarearesp'];        
        $query = new Doctrine_Query();
        $query->select('d.iddocumento')
            ->from('DatDocumento d')
            ->innerJoin('d.DatDocumentoActivo da')
            ->innerJoin('da.DatDocTransferenciaEntidades dte')
            ->innerJoin('d.DatMovimientos m')
            ->innerJoin('m.DatProductoLogistica p');


        // Relación con nomenclador de producto
        $this->_mMaestroProd->addQueryNomIndicador($query, 'p', 'i', 'ih', $parametros, false, 2, false);

        // Relación con marcas y modelos
        $this->_mMaestroProd->addQueryJoinMarcaModelo($query, 'ih', 'ma', 'mo', true, true);

        // Movimiento de registro numérico
        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModelMy($query, 'm', 'mr', 1);

        // Registro numérico
        $query = $this->_mRegNumerico->addJoinModel($query, 'mr', 'rn', false);

        // Registro numérico activo
        $this->_mRegNumActivo->addJoinModel($query, 'rn', 'ra', true, false, true);

        /* $query->addWhere(
          'd.idestructuracomun <> ? AND ra.idarearesp =  ?',
          array($parametros['idarearesp'], $parametros['idarearesp'])
          ); */

        $query->addWhere("ra.idarearesp = {$parametros['idarearesp']}");


        // Hasta aqui todo bien
        /*  $arrIdsMovregNumericos = $this->getArrIdesRegNumEnEstructura($idEstructura);

          if (count($arrIdsMovregNumericos)) {
          $query->whereIn('mr.idregnumerico', $arrIdsMovregNumericos);
          } */


        if ($parametros['nrodoc']) {
            $query->addWhere('d.nrodoc = ?', $parametros['nrodoc']);
        }
        if ($parametros['idmarca']) {
            $query->addWhere('ih.idmarca = ?', array($parametros['idmarca']));
        }
        if ($parametros['idmodelo']) {
            $query->addWhere('ih.idmodelo = ?', array($parametros['idmodelo']));
        }
        if ($parametros['nroserie']) {
            $query->addWhere("rn.nroserie iLike '%{$parametros['nroserie']}%'");
        }
        if ($parametros['criterio']) {
            $query->addWhere(" i.denominacion iLike '%{$parametros['criterio']}%' ");
        }
        $query->select(
            ' DISTINCT p.idindicador AS idprod,
              d.nrodoc AS nrodoc,
              d.idestructuracomun AS idestructuracomun,
              d.iddoc AS iddoc,
              d.iddocumento,
              i.denominacion AS activo,
              ma.denominacion AS marca,
              mo.denominacion AS modelo,
              rn.idregnumerico AS idregnumerico,
              rn.nroserie AS nserie,
              ra.nroinventario AS nroinventario,
              i.codigo, p.idproducto,m.*
              '
        );
        $total = $query->count();

        if ($parametros['limit']) {
            $this->_mComunAFT->configStartAndLimitInParams($parametros, $parametros['start'], $parametros['limit']);
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        return array('datos' => $query->fetchArray(), 'cantidad_filas' => $total);
    }

    /**
     *
     */
    public function getTraslados($parametros)
    {       
        $datos = $this->getDatosTraslados($parametros);


        foreach ($datos['datos'] as &$value) {
            //$estructura = $this->_sEstrComposicion->obtenerPadreEntidad($value['idestructuracomun']);
			$estructura = $this->_mComunAFT->getEstructuraOpPadreSuperior($value['idestructuracomun']);
            if ($value['denomconfmedio'] && $value[$value['identificador']]) {
                $value['denomidmedio'] = $value['denomconfmedio'].': '.$value[$value['identificador']];
            }
            $value['estructuradenom'] = $estructura[0]['denominacion'];
            $value['idestructuraorigen'] = $estructura[0]['idestructura'];
            $value['marca-modelo'] = $value['marca'];
            unset($value['id']);

            if (strlen($value['modelo'])) {
                $value['marca-modelo'] .= ' - '.$value['modelo'];
            }
        }
        return $datos;
    }

    /**
     *
     */
    public function getEstructuraOrigen($parametros)
    {
        $idEstructura = $parametros['idarearesp'];

        $query = new Doctrine_Query();
        $query->select('d.iddocumento')
            ->from('DatDocumento d')
            ->innerJoin('d.DatDocTransferenciaEntidades dte ON d.iddocumento = dte.iddoctranfentidades')
            ->innerJoin('d.DatMovimientos m');

        // Movimiento de registro numérico
        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModelMy($query, 'm', 'mr', 1);

        // Registro numérico
        $query = $this->_mRegNumerico->addJoinModel($query, 'mr', 'rn', false, false, false);

        $query->addWhere(
            'd.idestructuracomun <> ? AND ra.idarearesp =  ?', array($idEstructura, $idEstructura)
        );

        $arrIdsMovregNumericos = $this->getArrIdesRegNumEnEstructura($idEstructura);
        if (count($arrIdsMovregNumericos)) {
            $query->whereIn('mr.idregnumerico', $arrIdsMovregNumericos);
        }

        $total = $query->count();

        if ($parametros['limit']) {
            $this->_mComunAFT->configStartAndLimitInParams($parametros, $parametros['start'], $parametros['limit']);
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }

        $datos = $query->fetchArray();

        foreach ($datos as &$value) {
            $estructura = $this->_sEstrComposicion->obtenerPadreEntidad($value['idestructuracomun']);

            $value['estructuradenom'] = $estructura[0]->denominacion;
        }

        return array('datos' => $datos, 'cantidad_filas' => $total);
    }

    /**
     *
     */
    public function getDatEspecificosDoc($idDocumento)
    {
        $oTransfEntidades = Doctrine::getTable('DatDocTransferenciaEntidades')->find($idDocumento);
        $idAreaDestino = $oTransfEntidades->identidaddestino;
        //$estructura = $this->_sEstrComposicion->getEstructura($idAreaDestino);
        $estructura = $this->integrator->metadatos->DameEstructura($idAreaDestino);

        $campo = new stdClass();

        $campo->xtype = "textarea";
        $campo->name = "Entidad destino";
        $campo->anchor = "95%";
        $campo->fieldLabel = "Entidad destino";
        $campo->data = $estructura[0]->denominacion;
        return array("data" => array($campo));
    }

}
