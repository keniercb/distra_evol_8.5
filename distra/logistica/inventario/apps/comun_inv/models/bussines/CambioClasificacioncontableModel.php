<?php

class CambioClasificacioncontableModel extends DocumentoLogisticaModel
{

    private $_maestroProductos;
    /**
     * Contructor de la clase.
     */
    public function __construct($datos)
    {
        parent::__construct($datos);
        $this->trazaDocumento = new TrazasDocumentoModel();
        $this->_maestroProductos = new MaestroProductoModel;
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovcambioccontable',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
    }

    /**
     * Devuelve los documentos.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($filtro, $dql = false)
    {
        $array = $filtro;
        unset($filtro['clasificacionanterior']);
        unset($filtro['clasificacionactual']);
        unset($filtro['idproducto']);
        $query = parent::devolverDocumentos($filtro);
        $sqlWhere = '';
        if($array['clasificacionanterior']) {
            $sqlWhere .= " AND (mccc.idcalisficacioanterior = {$array['clasificacionanterior']})";
        }
        if($array['clasificacionactual']) {
            $sqlWhere .= " AND (mccc.idclasificacioncontable = {$array['clasificacionactual']})";
        }
        if($array['idproducto']) {
            $sqlWhere .= " AND (mccc.idproducto = {$array['idproducto']})";
        }
        if($array['clasificacionanterior'] || $array['clasificacionactual'] || $array['idproducto']){
            $query->addWhere(
                "(SELECT (CASE WHEN count(mccc.idmovcambioccontable) > 0 THEN 1 ELSE 0 END) as aaa 
                FROM DatMovcambioccontable mccc
                WHERE (mccc.iddocumento = d.iddocumento)$sqlWhere LIMIT 1) = 1"
            );
        }
        $query->addSelect(
            '(SELECT count(mcc.idmovcambioccontable) FROM DatMovcambioccontable mcc '
            . 'WHERE mcc.iddocumento = d.iddocumento) AS cantproductos'
        );
        if ($dql) {
            return $query;
        }
        $datos = $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray();
        foreach ($datos as $key => $value) {
	    if ($value['idcomprobante']) {
                $sql = "select c.numerocomprobante as nrocomprobante from mod_contabilidad.dat_comprobante c where c.idcomprobante = {$value['idcomprobante']}";
                $resultComp = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
                $datos[$key]['nrocomprobante'] = $resultComp[0]['nrocomprobante'];
            }
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $datos
        );
    }
    /**
     * Adiciona los documentos.
     * @param array $datos
     * @return array
     */
    public function adicionarDocumento($datos)
    {
        $documento = parent::adicionarDocumento($datos);
        $documento->save();
        if (is_array($datos['idproductos']) && count($datos['idproductos']) > 0) {
            $this->adicionarMovimientos($documento->iddocumento, $datos['idproductos'], true);
        }
        if (is_array($datos['productos']) && count($datos['productos']) > 0) {
            $this->adicionarMovimientos($documento->iddocumento, $datos['productos']);
        }
        if ($datos['cambiarAll']){
            $this->cambiarClasificacionContableAllProductos($documento->iddocumento, $datos);
        }
      
        return array('success' => true, 'iddocumento' => $documento->iddocumento);
    }

    /**
     * Confirma el documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function confirmarDocumento($iddocumento)
    {
        if (!$this->contieneProductos($iddocumento)) {
            throw new ZendExt_Exception('LOG_LB_DOC_003');
        }
        if (!$this->validarClasificacionContable($iddocumento)) {
            throw new ZendExt_Exception('LOG_Comun_INV_001');
        }
        return parent::confirmarDocumento($iddocumento);
    }

    /**
     * Aprueba el documento.
     * @param numeric $iddocumento
     * @return numeric|boolean
     */
    public function aprobarDocumento($iddocumento, $setCronologia = false)
    {
        $this->validaOperacionesActivas($iddocumento);
        $cronologia = parent::aprobarDocumento($iddocumento, true);
        $sqlArray = array();
        $sqlArray[] = "WITH sql_update as (
                            select dp.idproducto,dp.idclasificacioncontable , dp.cantidad * dp.precio as importe, dp.cantidad * dp.precioalternativo as importealt
                            from mod_logistica.dat_movcambioccontable dm
                            inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                            where dm.iddocumento = {$iddocumento}
                    ) "
            . "update mod_logistica.dat_movcambioccontable dd "
            . "set idcalisficacioanterior = sql_update.idclasificacioncontable, importe = sql_update.importe, importealt = sql_update.importealt "
            . "from sql_update where dd.idproducto = sql_update.idproducto and dd.iddocumento = {$iddocumento};";
        $sqlArray[] = "UPDATE mod_logistica.dat_producto p SET idclasificacioncontable = ("
            . "SELECT _mcc.idclasificacioncontable FROM mod_logistica.dat_movcambioccontable _mcc "
            . "WHERE _mcc.idproducto = p.idproducto AND _mcc.iddocumento = {$iddocumento}) "
            . "WHERE p.idproducto IN (SELECT mcc.idproducto FROM mod_logistica.dat_movcambioccontable mcc "
            . "WHERE mcc.iddocumento = {$iddocumento});";


        foreach ($sqlArray as $sql) {
            $this->doctrineHelper->getConnection()->execute($sql);
        }
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        $this->crearMovimientos($iddocumento, $cronologia);
        return true;
    }

    private function crearMovimientos($iddocumento, $cronologia)
    {
        $sqlArray = array();
        $sqlArray[] = "INSERT INTO mod_logistica.dat_movimiento
        ( iddocumento, idproducto, idclasificacion,  importecontable,  importealternativo,  signo, cronologia) 
        SELECT iddocumento,  idproducto,  idclasificacioncontable,  importe,  importealt,  '+',  {$cronologia}
        FROM  mod_logistica.dat_movcambioccontable where iddocumento = {$iddocumento};";
        $idCopia = parent::copiarDocumento($iddocumento, true);
        //$this->estadoModel->setEstadoDocumento($idCopia, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        Doctrine_Query::create()->from('DatDocumento')->update()
            ->set('idcomprobante', '-1')->where('iddocumento = ?',$idCopia)->execute();
        $sqlArray[] = "INSERT INTO mod_logistica.dat_movimiento 
        (iddocumento, idproducto, idclasificacion,  importecontable,  importealternativo, signo, cronologia)
         SELECT {$idCopia},  idproducto,  idcalisficacioanterior,  importe,  importealt, '-',  {$cronologia}
         FROM mod_logistica.dat_movcambioccontable where iddocumento = {$iddocumento}";
        foreach ($sqlArray as $sql) {
            $this->doctrineHelper->getConnection()->execute($sql);
        }
    }

    /**
     * Devuelve los productos.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarProductos($filtro, $dql = false)
    {
        $query = $this->getProductoModel()->cargarProductos($filtro, true);
        $query->addWhere(
            'p.idproducto NOT IN (SELECT _mcc.idproducto FROM DatMovcambioccontable _mcc '
            . 'INNER JOIN _mcc.DatDocumento d_ ON (d_.iddocumento = _mcc.iddocumento) WHERE d_.estado IN (1, 2))'
        );
        if ($dql) {
            return $query;
        }
        
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->_maestroProductos->setLastLevel(
                $this->doctrineHelper->addQueryLimits($query, $filtro)
                ->fetchArray()
            )
        );
    }

    /**
     * Devuelve los cambios de clasificacion contable de los productos del documento.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverMovimientos($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                'mcc.idmovcambioccontable, mcc.idclasificacioncontable, mcc.idmovcambioccontable AS idmovimiento, '
                . '(coalesce(mcc.idclasificacioncontable, -1) <> coalesce(p.idclasificacioncontable, -1)) AS editado'
            )
            ->from('DatMovcambioccontable mcc');
        $this->getProductoModel()->getJoinDatProducto($query, 'mcc');
        $maestro = new MaestroProductoModel();
        $maestro->addQueryNomIndicador($query, 'p', 'i', 'ih', true, 'ngs', 2, false);
        if (class_exists('NomencladoresLogService')) {
            $nomenclador = new NomencladoresLogService();
            $nomenclador->innerJoinNomCategoria($query, 'p', 'nc');
            /* $nomenclador->getJoinClasificacionCont($query, 'p', 'left', 'ncc');
              $query->addSelect('ncc.denominacion as clasficacionold'); */
            $nomenclador->getJoinClasificacionCont($query, 'mcc');
        }
        $query->addSelect("(SELECT _nc.denominacion FROM NomClasificacioncontablelog _nc "
            . "WHERE _nc.idclasificacioncontable = coalesce(mcc.idcalisficacioanterior,p.idclasificacioncontable)) as clasficacionold");

        if (class_exists('NomUnidadmedida')) {
            $this->configuracionHelper->getQueryJoinUnidadMedida(
                $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida,um.decimales as decimales', 'leftJoin'
            );
        }
        if ($filtro['criterio']) {
            $criterio = $filtro['criterio'];
            $query->andWhere("(i.denominacion ILIKE '%{$criterio}%' OR i.codigo LIKE '%{$criterio}%')");
        }
        $query->andWhere("mcc.iddocumento = ?", $filtro['iddocumento']);
        if ($dql) {
            return $query;
        }
        $resp = array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
        return $this->getProductoModel()->concatenarDeposito($resp);
    }

    /**
     * Adiciona los cambios de clasificacion contable de los productos para el documento.
     * @param numeric $iddocumento
     * @param array $productos
     * @param boolean $nuevo [Opcional]
     * @return boolean
     */
    public function adicionarMovimientos($iddocumento, $productos, $nuevo = false)
    {
        $collection = new Doctrine_Collection('DatMovcambioccontable');
        foreach ($productos as $value) {
            $idprod = is_array($value) ? $value['idproducto'] : $value;
            $prod = Doctrine::getTable('DatProductoLogistica')->find($idprod);
            if ($prod && !$this->existeProdClasificacion($iddocumento, $idprod, $nuevo)) {
                $datos['idmovcambioccontable'] = is_array($value) ? $value['idmovcambioccontable'] : null;
                $datos['iddocumento'] = $iddocumento;
                $datos['idproducto'] = $idprod;
                $datos['idclasificacioncontable'] = is_array($value) ? $value['idclasificacioncontable'] :
                    $prod->idclasificacioncontable;
                $record = new DatMovcambioccontable();
                if ($datos['idmovcambioccontable']) {
                    $record->assignIdentifier($datos['idmovcambioccontable']);
                }
                $record->synchronizeWithArray($datos);
                $collection->add($record);
            }
        }
        if ($collection->count()) {
            $collection->save();
            return array('success' => true, 'iddocumento' => $iddocumento);
        }
        return array('success' => false);
    }

    public function cambiarClasificacionContableAllProductos($iddocumento, $datos) 
    {           
      $params['idestructuracomun'] = $datos['idestructuracomun'];
      $params['lento'] = ($datos['lento']) ? 1 : 0;
      $params['limit'] = ($datos['limit']) ? ($datos['limit']) : 30;
      $params['start'] = ($datos['start']) ? ($datos['start']) : 0;
      $params['cambiarAll'] = true ;
     
      $productos = $this->cargarProductosOciosos($params);
      //print_r($productos);die;
      $collection = new Doctrine_Collection('DatMovcambioccontable');
        foreach ($productos['datos'] as $value) {
            $idprod = is_array($value) ? $value['idproducto'] : $value;
            $prod = Doctrine::getTable('DatProductoLogistica')->find($idprod);
            if ($prod && !$this->existeProdClasificacion($iddocumento, $idprod, $nuevo = false)) {
                $datos['idmovcambioccontable'] = ($value['idmovcambioccontable']) ? $value['idmovcambioccontable'] : null;
                $datos['iddocumento'] = $iddocumento;
                $datos['idproducto'] = $idprod;
                $datos['idclasificacioncontable'] = $datos['idclasificacioncontable'];
                $datos['idclasificacionanterior'] = is_array($value) ? $value['idclasificacioncontable'] :
                    $prod->idclasificacioncontable;
                $record = new DatMovcambioccontable();
                if ($datos['idmovcambioccontable']) {
                    $record->assignIdentifier($datos['idmovcambioccontable']);
                }
                $record->synchronizeWithArray($datos);
                $collection->add($record);
            }
        }
        if ($collection->count()) {
            $collection->save();
            return array('success' => true, 'iddocumento' => $iddocumento);
        }
        return array('success' => false);      
    }

    /**
     * Elimina los cambios de clasificacion contable de los productos del documento.
     * @param array $arridmovcambioccontable
     * @return boolean
     */
    public function eliminarMovimientos($arridmovcambioccontable)
    {
        Doctrine_Query::create()
            ->delete('DatMovcambioccontable')
            ->whereIn('idmovcambioccontable', $arridmovcambioccontable)
            ->execute();
        return true;
    }

    /**
     * Verifica si existe el movimiento de clasificacion contable del producto.
     * @param numeric $iddocumento
     * @param numeric $idproducto
     * @param boolean $verificar [Opcional]
     * @return boolean
     */
    public function existeProdClasificacion($iddocumento, $idproducto, $verificar = true)
    {
        if (!$verificar) {
            return false;
        }
        $query = Doctrine_Query::create()
            ->from('DatMovcambioccontable mcc')
            ->where('mcc.iddocumento = ? AND mcc.idproducto = ?', array($iddocumento, $idproducto));
        return $query->count() > 0;
    }

    /**
     * Verifica si el documento contiene productos.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function contieneProductos($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovcambioccontable mcc')
            ->where('mcc.iddocumento = ?', $iddocumento);
        return $query->count() > 0;
    }

    /**
     * Verifica si los productos del documento cambiaron la clasificacion contable.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function validarClasificacionContable($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovcambioccontable mcc')
            ->innerJoin('mcc.DatProductoLogistica p')
            ->where(
                'mcc.iddocumento = ? '
                . 'AND coalesce(mcc.idclasificacioncontable, -1) <> coalesce(p.idclasificacioncontable, -1)', $iddocumento
            )
            ->orderBy('mcc.idmovcambioccontable');
        return $query->count() > 0;
    }

    private function validaOperacionesActivas($iddocumento)
    {
        $estadoContabilizado = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
        $estadoCancelado = EstadoDocumentoModel::ESTADO_CANCELADO;
        $sqlVerify = "select count(mcc.idmovcambioccontable) as total
                from mod_logistica.dat_movcambioccontable mcc
                join mod_logistica.dat_movimiento m on m.idproducto = mcc.idproducto
                join mod_logistica.dat_documento dd on m.iddocumento = dd.iddocumento
                where mcc.iddocumento = {$iddocumento} and dd.estado in({$estadoContabilizado},{$estadoCancelado}) and dd.idcomprobante is null";
        $result = $this->doctrineHelper->getConnection()->fetchAll($sqlVerify);
        if($result[0]['total'] > 0 ){
            throw new ZendExt_Exception('LOG_Comun_INV_002');
        }
    }
    
    	public function replicarClasificacion($idmovcambioccontable){
		$queryResult = Doctrine_Query::create()->select('mcc.iddocumento, mcc.idclasificacioncontable')
                ->from('DatMovcambioccontable mcc')                
                ->where('mcc.idmovcambioccontable = ? ', array($idmovcambioccontable))
                ->fetchArray();
		if(count($queryResult) > 0){
			$sqlUpdate = "UPDATE mod_logistica.dat_movcambioccontable 
			SET idclasificacioncontable = {$queryResult[0]['idclasificacioncontable']}
			WHERE iddocumento = {$queryResult[0]['iddocumento']};";
			$this->doctrineHelper->getConnection()->execute($sqlUpdate);
		}
    }

    public function cargarProductosOciosos(/*$filtro, $dql = false,*/$params)
        {
            
            //$encodeDeposito = Zend_Json::decode($params['idestructuracomun']);
            //$diffDate = $this->calculaFecha($params['valor']);
            $fechafin = $params['fechafin']; 
            $fechafin = $fechafin ? "'{$fechafin}'" : 'null';
            $desde = $params['desde'] ? $params['desde'] : 'null';
            $hasta = $params['hasta'] ? $params['hasta'] : 'null';
            //$dateActual = $diffDate['fechafin'];
            $criterio = ($params['denominacion']) ? $params['denominacion'] : '';
            $idnaturaleza = ($params['idnaturaleza']) ? $params['idnaturaleza'] : 'null';
            $iddeposito = ($params['idestructuracomun']) ? "'{{$params['idestructuracomun']}}'" : '{}';
            //print_r($iddeposito);die;
            $idestructuracomun = $this->global->Estructura->idestructura;
            //print_r($idestructuracomun);die;
            $idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
            //print_r($idsubsistema);die;
            $limit = $params['limit'];
            $start = $params['start'];
            $tiporeporte = ($params['lento'] == 1) ? 1 : 0;
            $iddocumento = ($params['iddocumento']) ? $params['iddocumento'] : 'null';
           // print_r($params);die;
            $sql = "SELECT * FROM mod_loginventario.f_reclentomov_tiporeporte(
              {$iddeposito},
              {$fechafin},
              {$desde},
              {$hasta},
              '{$criterio}',
              {$idestructuracomun},
              '{$idsubsistema}',
               {$idnaturaleza},
               {$tiporeporte},
               {$iddocumento}
               
            )";

             $conn = Zend_Registry::get('conexion');
             return array(
                 'cantidad' => $conn->execute($sql)->rowCount(),
                 'datos' => $conn->execute($params['cambiarAll'] ? $sql : $sql ." limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
             );
        }
        public function cargarClasificacion()
        {
            $sql = "select ncc.idclasificacioncontable,ncc.denominacion
            from mod_logistica.nom_clasificacioncontable ncc";
    
              $conn = Zend_Registry::get('conexion');
              return array(
                  'cantidad' => $conn->execute($sql)->rowCount(),
                  'datos' => $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC)
              );
            
        }
}
