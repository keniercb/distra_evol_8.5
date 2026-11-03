<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AuditoriaDocumentoModel
 *
 * @author kenier
 */
class AuditoriaDocumentoModel extends BaseModel
{
    private $arrayTipoDocumentos,$documentoModel, $idusuario;
    public function __construct($datos = array())
    {
        parent::__construct();
        $this->initTipoDocumentos();
        $this->documentoModel = new DocumentoLogisticaModel;
        $this->documentoModel->setIdSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatDocfactura',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idfactura'));
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatAjuste',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idajuste'));
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatDistribucion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddistribucion'));
        $this->doctrineHelper->tryInyectRelactions(
            new DatDocumento(), $array
        );
    }
    
    public function devolverTipoDocumentos()
    {
        $result = array();
        foreach (array_keys($this->arrayTipoDocumentos) as $alias) {
            $doc = $this->configuracionHelper->getDocumentsByParams(array('abreviatura' => $alias));
            if($doc[0]){
                array_push($result,
                    array(
                    'alias' => $alias,
                    'denominacion' => $doc[0]['denominacion']
                ));
            }
        }
        return $result;
    }


    public function devolverDepositos(){
        $idsDeposit = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado,8);
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(false, false, false, null, null, $idsDeposit, -1);
        $datos = array();
        foreach ($depositos as $index => $r) {
            $uxiliar  = ($r['DatEstructuraop'][0]['codigo']) ? $r['DatEstructuraop'][0]['codigo']. '-':'';
            $datos[$index]['iddeposito'] = $r['idfila'];
            $datos[$index]['id'] = $r['idfila'];
            $datos[$index]['deposito'] = $uxiliar.$r['text'];
            $datos[$index]['text'] = $r['text'];
            $datos[$index]['leaf'] = true;
        }
        return $datos;
    }

    public function initTipoDocumentos()
    {
        $this->arrayTipoDocumentos = array();
        $this->arrayTipoDocumentos['ajusteLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['aperturaLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['conciliacionLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['conduceLog'] = LogisticaGlobal::SUBSISTEMA_FAC;
        $this->arrayTipoDocumentos['entregaLog'] = LogisticaGlobal::SUBSISTEMA_DIST;
        $this->arrayTipoDocumentos['recepcionLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['valedev'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['valedevLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['valeLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['solEntrega'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['inventariogLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['informediferenciaLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        //$this->arrayTipoDocumentos['distribucionLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['facturaLog'] = LogisticaGlobal::SUBSISTEMA_FAC;
        $this->arrayTipoDocumentos['transferenciareaLog'] = LogisticaGlobal::SUBSISTEMA_INV;
        $this->arrayTipoDocumentos['transferenciaLog'] = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function devolverDocumentos($parametros = array()){
        $parametros['start']  = $parametros['start'] ? $parametros['start'] : 0;
        $parametros['limit']  = $parametros['limit'] ? $parametros['limit'] : 30;
        if(!$parametros['idestructura']){
            $depositos = $this->devolverDepositos();
            $arrayestructuras = $this->objectHelper->extractValueFromArrayColumn($depositos, 'iddeposito');
            $idestructuras = implode(",", $arrayestructuras);
        }

        $nrodoc = 'null';
        if ($parametros['nrodoc']) {
            $nrodoc = $parametros['nrodoc'];
        } else if ($parametros['criterio']) {
            $nrodoc = $parametros['criterio'];
        }
        $estado = $parametros['estado'] ? $parametros['estado'] : 'null';
        $alias = $parametros['alias'] ? $parametros['alias'] : null;
        $iddeposito = $parametros['iddeposito'] ? $parametros['iddeposito'] : 'null';
        if ($parametros['desde'] || $parametros['hasta']) {
            if ($parametros['desde']) {
                $des = substr($parametros['desde'], 0, 10);
                $desde = $this->convertirFecha($des);
            } else {
                $desde = 'null';
            }
            if ($parametros['hasta']) {
                $has = substr($parametros['hasta'], 0, 10);
                $hasta = $this->convertirFecha($has);
            } else {
                $hasta = 'null';
            }
        } else {
            $desde = 'null';
            $hasta = 'null';
        }

        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,10);

        $sql = "select * from mod_loginventario.f_listadoauditoria("
            . "{$this->global->Estructura->idestructura}, "."'{" . $idestructuras . "}'".", "
            . "{$nrodoc}, {$estado}, '$alias', {$iddeposito},"
            . "{$desde}, {$hasta}, 10, '{$fecha->fecha}') q ";
        $datos = Doctrine_Manager::connection()->fetchAll($sql . "offset {$parametros['start']} limit {$parametros['limit']}");
        $sql = str_replace('*', 'count(*)', $sql);
        $cantidad = Doctrine_Manager::connection()->fetchAll($sql);

        $usuario = $this->documentoModel->cargaInicial();
        return array(
            /*'cantidad'=>$query->count(),
            'datos'=>$this->getInfo($this->doctrineHelper->addQueryLimits($query,$parametros)->fetchArray()),*/
            'cantidad'=>$cantidad[0]['count'],
            'datos'=> $datos,
            'usuarios' => $usuario['usuarios'],
            'documentos' => $usuario['iddocs'],
            'depositos' => $depositos
        );
    }

    public function convertirFecha($fecha){
        $arrayFecha = explode('-', $fecha);
        return "'{$arrayFecha[2]}/{$arrayFecha[1]}/{$arrayFecha[0]}'";
    }

    public function devolverMovimientos($parametros){
        $doc = Doctrine::getTable('DatDocumento')->find($parametros['iddocumento']);
        $datosPrim = $this->configuracionHelper->getTipoDocumentoById($doc->iddoc);
        if ($datosPrim->abreviatura == 'entregaLog') {
            $maestroProductos = new MaestroProductoModel;
            $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatProdorden',
                'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto'));
            $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
            $query = new Doctrine_Query();
            $query->select('p.idindicador, p.idproducto, p.precio as preciocontable,
                            p.precioalternativo as precioalternativo')
                ->from('DatProductoLogistica p')
                ->innerJoin('p.DatProdorden dpo')
                ->where('dpo.idorden = ?', array($parametros['iddocumento']));
            $maestroProductos->addQueryNomIndicador($query, 'p', 'i', 'ih', true, 'ngs', 2, false);
            if (class_exists('NomUnidadmedida')) {
                $this->configuracionHelper->getQueryJoinUnidadMedida(
                    $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida,um.decimales as decimales', 'leftJoin'
                );
            }
            if (class_exists('NomencladoresLogService')) {
                $nomenclador = new NomencladoresLogService();
                $nomenclador->innerJoinNomCategoria($query, 'p', 'nc');
            }
            $query->addSelect(
                "(SELECT SUM(dpord.cantidad) FROM DatProdorden dpord ".
                "WHERE dpord.idproducto = p.idproducto AND dpord.idorden = {$parametros['iddocumento']}) as cantidad"
            );
            $query->addSelect(
                "(SELECT SUM(dpord1.cantidad * p.precio) FROM DatProdorden dpord1 ".
                "WHERE dpord1.idproducto = p.idproducto AND dpord1.idorden = {$parametros['iddocumento']}) as importe"
            );
            $query->addSelect(
                "(SELECT SUM(dpord2.cantidad * p.precioalternativo) FROM DatProdorden dpord2 ".
                "WHERE dpord2.idproducto = p.idproducto AND dpord2.idorden = {$parametros['iddocumento']}) as importealternativo"
            );
            $datos = $query->fetchArray();
            $maestroProductos->addSelectionData($datos);
            /*foreach($datos as &$d){
                $ind = $maestroProductos->cargarGridNomenclador(
                    array('idindicador' => $d['idindicador'])
                )['datos'];
                $d = array_merge($d, $ind[0]);
            }*/
            return array('cantidad'=> $query->count(), 'datos'=> $datos);
        } else {
            $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatMovdiferencia',
                'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
            $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatMovdiferenciacalidad',
                'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
            $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
            $query = $this->documentoModel->getProductoModel()->devolverMovimientos($parametros, true);
            $query->leftJoin('mov.DatMovdiferencia movd');
            $query->addSelect(
                'movd.cantidaddiferencia as cantidaddiferencia'
            );
            $query->addSelect(
                '(SELECT SUM(movdc.cantidaddiferencia) FROM DatMovdiferenciacalidad movdc '.
                'WHERE movdc.idmovimiento = mov.idmovimiento) as cantidadcalidad'
            );
            return $this->documentoModel->getProductoModel()->concatenarDeposito(
                array('cantidad' => $query->count(), 'datos' => $this->doctrineHelper->addQueryLimits($query, $parametros)
                    ->fetchArray())
            );
        }

    }

    public function filtrar(Doctrine_Query $query, $parametros){
        $query->leftJoin('d.DatDocfactura df');
        $query->leftJoin('d.DatAjuste da');
        $query->leftJoin('d.DatDistribucion ddist');
        $query->leftJoin("df.DatSerieDocumentoEntidad dse")->leftJoin("dse.NomSerieDocumento nsd");
        $query->addSelect(
            "(CASE WHEN df.idfactura IS NOT NULL THEN ".
            "(CASE WHEN df.idseriedocentidad IS NULL then " .
            "''||df.nrofactura ELSE nsd.denominacion||' - '||df.nrofactura END) ".
            "ELSE ''||d.nrodoc END) as nrodoc"
        );
        $query->addSelect('df.iddeposito as iddeposito');
        $query->addSelect('da.contabilizadopor as contabilizadopor');
        $query->innerJoin('d.DatDocumentoprim ddp');
        $query->innerJoin('ddp.NomDocprim ndp');
        $query->addSelect('ndp.abreviatura as abreviatura');
        if($parametros['alias']){
            $query->andWhere('ndp.abreviatura = ?', array($parametros['alias']));
        }
        $query->addSelect('(SELECT COUNT(DISTINCT dpo.idproducto) FROM DatProdorden dpo WHERE dpo.idorden = d.iddocumento) as cantproductosdist');

        if(!$parametros['alias'] || $parametros['alias'] == 'facturaLog' || $parametros['alias'] == 'conduceLog' || $parametros['alias'] == 'entregaLog'){
            $andFactura = "";
            $andDistribucion = "";
            if($parametros['alias']){
                $andFactura .= " AND ndp.abreviatura = '{$parametros['alias']}'";
                $andDistribucion .= " AND ndp.abreviatura = '{$parametros['alias']}'";
            }
            if($parametros['criterio'])
                $parametros['nrodoc'] = $parametros['criterio'];
            if ($parametros['nrodoc']){
                $andFactura .= " AND df.nrofactura = {$parametros['nrodoc']}";
                $andDistribucion .= " AND d.nrodoc = {$parametros['nrodoc']}";
            }
            if ($parametros['estado']) {
                $andFactura .= " AND d.estado = {$parametros['estado']}";
                $andDistribucion .= " AND d.estado = {$parametros['estado']}";
            } else {
                $andFactura .= " AND d.estado IN (1,2,4)";
            }
            if ($parametros['desde'] || $parametros['hasta']) {
                if ($parametros['desde']) {
                    $andFactura .= " AND d.fechacontable >= '".date('Y-m-d', strtotime($parametros['desde']))."'";
                    $andDistribucion .= " AND d.fechacontable >= '".date('Y-m-d', strtotime($parametros['desde']))."'";
                }
                if ($parametros['hasta']) {
                    $andFactura .= " AND d.fechacontable <= '".date('Y-m-d', strtotime($parametros['hasta']))."'";
                    $andDistribucion .= " AND d.fechacontable <= '".date('Y-m-d', strtotime($parametros['hasta']))."'";
                }
            }
            $estructuras = (is_array($parametros['idestructura']))
                                ? $parametros['idestructura']
                                : array($parametros['idestructura']);
            $query->orWhere("df.iddeposito IN (".implode(',', $estructuras).")".$andFactura);
            $query->orWhere(
                "ddist.iddistribucion IN (SELECT dist.iddistribucion FROM ".
                "DatDistribucion dist INNER JOIN dist.DatProdorden dpor INNER JOIN dpor.DatProductoLogistica dplog ".
                "WHERE dplog.idestructura IN (".implode(',', $estructuras).")) ".$andDistribucion
            );
        }
    }

    public function getInfo($array = array()){
        $cacheOperacion = $cacheDocumento = $cacheUsuario = $caheCliente = array();
        foreach($array as $pos =>&$documento){
            //$this->getOperacion($cacheOperacion,$documento['idoperacion']);
            $this->getDocumento($cacheDocumento,$documento['iddoc']);
            $documento['iddoc'] = $cacheDocumento[$documento['iddoc']]->denominacion;
            $this->getUsuario($cacheUsuario,$documento['idusuario']);
            $this->getUsuario($cacheUsuario,$documento['aprobadopor']);
        }
        return $array;
    }

    public function getOperacion($cacheOperacion, $idOperacion)
    {
        if(!array_key_exists($idOperacion, $cacheOperacion)){
            $cacheOperacion[$idOperacion] = $this->configuracionHelper->getOperacionesPorId($idOperacion);
        }
    }

    public function getDocumento(&$cacheDocumento, $documento)
    {
        if(!array_key_exists($documento, $cacheDocumento)){
            $cacheDocumento[$documento] = $this->configuracionHelper->getTipoDocumentoById($documento);
        }
    }

    public function getUsuario($cacheUsuario, $usuario)
    {
        if(!array_key_exists($usuario, $cacheUsuario)){
            $cacheUsuario[$usuario] = [];
        }
    }

    public function getMonedas(){
        return LogisticaGlobal::__init()->getMonedaEntidad();
    }

}
