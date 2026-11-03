<?php

/**
 * @class AperturaModel
 * (Descripcion de la clase, objetivo)
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class AperturaModel extends EntradaModel
{
    public function __construct($datos = array())
    {
        parent::__construct($datos);
    }

    public function cargaInicial()
    {
        $datos = parent::cargaInicial();
        $result = $this->configuracionService->devolverConfiguracion($this->idestructuracomun);
        $datos['contintegrada'] = $result['contintegrada'];
        $datos['aprobados'] = $this->existenTodosAprobados();
        $datos['monedas'] = array(
            'contable' => $this->tipoMoneda['codCont'], 'alternativa' => $this->tipoMoneda['idalternativa']
        );
        return $datos;
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return array
     */
    public function devolverDocumentos($datosDoc = array())
    {
        $query = parent::devolverDocumentos($datosDoc);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
        );
    }

    /**
     * Adiciona un documento.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return numeric
     */
    public function adicionarDocumento($datosDoc = array())
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $documento->save();
        $this->trazaDocumento->guardarTraza('Documento adicionado', $documento->iddocumento);
        if ($datosDoc['tarjeta'] && $datosDoc['tarjeta']['idindicador']) {
            $datosDoc['tarjeta']['iddocumento'] = $documento->iddocumento;
            $datosDoc['tarjeta']['idestructura'] = $datosDoc['idestructuracomun'];
            $this->producto->adicionarProductoEstructuras(array($datosDoc['tarjeta']));
        } elseif ($datosDoc['tarjeta']) {
            foreach ($datosDoc['tarjeta'] as $index => $prod) {
                $datosDoc['tarjeta'][$index]['iddocumento'] = $documento->iddocumento;
                $datosDoc['tarjeta'][$index]['idestructura'] = $datosDoc['idestructuracomun'];
                $datosDoc['tarjeta'][$index]['entrada'] = true;
            }
            $this->producto->adicionarProductoEstructuras($datosDoc['tarjeta']);
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $datosDoc['productos'][0]['entrada'] = true;
            $this->producto->modificarMovimientos($datosDoc['productos']);
        }
        $this->procesarMonedas($datosDoc['monedas'], $documento->iddocumento);
        return array(
            'iddocumento' => $documento->iddocumento, 'numeroref' => $documento->numeroref,
            'fechacontable' => $documento->fechacontable
        );
    }

    /**
     * Confirma el documento de apertura.
     * @param numeric $iddocumento
     */
    public function confirmarDocumento($iddocumento)
    {
        $this->actualizarMovUbicacion($iddocumento);
        return parent::confirmarDocumento($iddocumento);
    }

    /**
     * @param Integer $iddocumento Identificador del documento a aprobar
     * @return boolean
     */
    public function aprobarDocumento($iddocumento)
    {
        $this->actualizarUbicacion($iddocumento, true);
        $cronologia = parent::aprobarDocumento($iddocumento, true);
        if ($this->existComponent('log.inv.municiones')) {
            $municionesService = new MunicionesService();
            $municionesService->aprobarPartida($iddocumento);
        }
        $this->nroSerieService->actualizarEstadoNumeroSerie($iddocumento);
        $this->loteService->actualizarExistenciaLote($iddocumento, true, $cronologia);
        $this->getProductoModel()->aprobarMovimientos($iddocumento, $cronologia, true);
        Doctrine_Query::create()->update('DatDocumento')->set('idcomprobante', -1)
            ->where('iddocumento = ?', array($iddocumento))->execute();
        return true;
    }

    /**
     * Verifica si todos los documentos de apertura del depósito están aprobados.
     * @return boolean
     */
    public function existenTodosAprobados()
    {
        $datos = Doctrine_Query::create()
            ->select(
                "count(d.iddocumento) AS todos, (SELECT count(d2.iddocumento) FROM DatDocumento d2 "
                . "WHERE d2.iddoc = {$this->iddoc} AND d2.estado = 3) AS aprobados"
            )
            ->from('DatDocumento d')
            ->where('d.iddoc = ?', $this->iddoc)
            ->fetchArray();
        return $datos[0]['todos'] > 0 && $datos[0]['todos'] == $datos[0]['aprobados'];
    }

    /**
     * Devuelve los movimientos de la apertura.
     * @param array $filtro
     * @return array
     */
    public function devolverMovimientos($filtro)
    {
        $query = $this->getProductoModel()->devolverMovimientos($filtro, true);
        $maestroP = new MaestroProductoModel();
        return array(
            'cantidad' => $query->count(),
            'datos' => $maestroP->addSelectionData($this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray())
        );
    }

    /**
     * Elimina uno o varios moviminetos.
     * @param array $arrIdMov
     */
    public function eliminarMovimientos($arrIdMov)
    {
        $this->nroSerieService->eliminarNrosCancelados(null, $arrIdMov);
        if ($this->existComponent('log.inv.municiones')) {
            $municiones = new MunicionesService();
            $municiones->eliminarPartidasCanceladas(null, $arrIdMov);
        }
        $this->getProductoModel()->eliminarMovimientos(false, $arrIdMov, false, false);
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param integer $iddocumento
     * @return boolean
     */
    public function productosConPrecio($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ? AND m.preciocontable = 0 AND m.precioalternativo = 0', $iddocumento);
        if ($this->alternativa == 1) {
            $query->leftJoin('m.DatMovmoneda mn')
                ->where('m.iddocumento = ?', $iddocumento)
                ->groupBy('m.idmovimiento, mn.idmovmoneda')
                ->having('mn.precio = 0 OR count(mn.idmovmoneda) = 0');
        }
        if ($query->count() > 0) {
            if ($this->alternativa == 1) {
                throw new LogisticaException('LOG_LB_DOC_013');
            }
            return false;
        }
        return true;
    }

    public function importarFichero($file, $params)
    {
        $error = $file['error'];
        //Doctrine_Query::create()->delete('DatImpapertura')->where('iddocumento = ?', $params['iddocumento'])->execute();
        Doctrine_Query::create()->delete('DatImpapertura')->execute();
        $collection = new Doctrine_Collection('DatImpapertura');
        $collection->synchronizeWithArray($file['productos']);
        $collection->save();
        //return true;
        if (!$error) {
            if((new VariablesGlobalesModel())->obtenerValor('farmacia') == 1){            
                $sql = "SELECT * FROM mod_loginventario.f_importaapertura({$params['iddocumento']}) q;";
                // Productos con tarjeta creada. Error 1.
                // Lotes sin fecha de producción. Erro r 2.
                // Productos duplicados. Error 3.
                // Codigo producto nulo. Error 4.
                // Rango de fecha incorrecto. Error 5.
                // Fecha mayor a la actual. Error 6.
                // Fecha no valida. Error 7.
                $result = Doctrine_Manager::connection()->fetchOne($sql);
            }else{                
                $sql = "SELECT * FROM mod_loginventario.f_importaaperturamoncar({$params['iddocumento']}) q;";
                // Productos con tarjeta creada. Error 1.
                // Lotes sin fecha de producción. Erro r 2.
                // Productos duplicados. Error 3.
                // Codigo producto nulo. Error 4.
                // Rango de fecha incorrecto. Error 5.
                // Fecha mayor a la actual. Error 6.
                // Fecha no valida. Error 7.
                $result = Doctrine_Manager::connection()->fetchOne($sql);
            }
        }
        /*$sql = "DELETE FROM mod_loginventario.dat_impapertura a WHERE iddocumento = ? AND a.idimpapertura NOT IN (
            SELECT _a.idimpapertura
            FROM mod_loginventario.dat_impapertura _a 
            LEFT JOIN mod_datosmaestros.nom_indicador i ON i.codigo = _a.codigoproducto
            WHERE _a.iddocumento = a.iddocumento AND (
                  (_a.cantidadlote > 0 AND _a.fechaproduccion IS NULL)
                  OR _a.codigoproducto IS NULL
                  OR (
                    (_a.fechafabricacion > _a.fechavencimiento AND _a.fechafabricacion IS NOT NULL AND _a.fechavencimiento IS NOT NULL) 
                    OR (_a.fechaproduccion > _a.fechavencimientolote AND _a.fechaproduccion IS NOT NULL AND _a.fechavencimientolote IS NOT NULL)
                  )
                  OR _a.errorfecha IS NOT NULL
                  OR (
                       SELECT (count(_a2.codigoproducto) > 1)
                       FROM mod_loginventario.dat_impapertura _a2
                       WHERE _a2.iddocumento = _a.iddocumento
                             AND (_a2.cantidadlote = 0
                             OR _a2.cantidadlote IS NULL)
                             AND _a2.codigoproducto = _a.codigoproducto
                       GROUP BY _a2.categoria,
                                _a2.codigoproducto
                       LIMIT 1
                  ) = true
                  OR (_a.fechafabricacion > current_date and _a.fechafabricacion IS NOT NULL)
                  OR (_a.fechaproduccion > current_date AND _a.fechaproduccion IS NOT NULL)
                  OR i.idindicador IS NULL
            )
        )";
        Doctrine_Manager::connection()->execute($sql, array($params['iddocumento']));*/
        if (!$error && substr_count($result, '1') > 0) {
            $error = 1;
        }
        $cont = substr_count($result, ',');
        if ((!$error && $cont > 0) || ($error == 1 && $cont > 1)) {
            $error = 2;
        }
        $sql = "SELECT count(idmovimiento) AS cantidad FROM mod_logistica.dat_movimiento WHERE iddocumento = ?";
        $prod = Doctrine_Manager::connection()->fetchRow($sql, array($params['iddocumento']));
        if (!$error && $collection->count() == $prod['cantidad']) {
            Doctrine_Query::create()->delete('DatImpapertura')->where('iddocumento = ?', $params['iddocumento'])
                ->execute();
        }
        return array(
            'total' => $collection->count(), 'cantidad' => $prod['cantidad'], 'datos' => $collection->toArray(),
            'error' => $error
        );
    }

    public function sincronizarArray($datos, $params)
    {
        $campos = array('codigoproducto','descripcionproducto', 'um', 'clasificacioncontable', 'minimo', 'maximo', 
            'categoria', 'fechafabricacion','fechavencimiento', 'cantidad', 'precio', 'importe','fechaproduccion',
            'nrolote', 'fechavencimientolote', 'cantidadlote', 'codigofabricante', 'ubicacion','naturaleza'
        );/*
        $campos = array(
            'codigoempresa', 'nombreempresa', 'codigodeposito', 'nombredeposito', 'codigoproducto',
            'descripcionproducto', 'um', 'clasificacioncontable', 'minimo', 'maximo', 'categoria', 'fechafabricacion',
            'fechavencimiento', 'cantidad', 'precio', 'importe', 'precioalt', 'importealt', 'fechaproduccion',
            'fechavencimientolote', 'cantidadlote', 'codigofabricante', 'municipios', 'organismos', 'ubicacion'
        );*/
        $productos = array();
        foreach ($datos as $index => $item) {
            if ($index > 0) {
                $prod = array();
                foreach ($item as $key => $value) {
                    $value = trim($value);
                    if (substr_count($campos[$key], 'fecha') > 0 && $value) {
                        $temp = null;
                        $temp = explode('-', $value);
                        if (substr_count($value, '/')) {
                            $temp = explode('/', $value);
                        }
                        if (!checkdate($temp[0], $temp[1], $temp[2])) {
                            $error = 7;
                            $prod['errorfecha'] = $this->getError($campos[$key]) . ' ';
                            continue;
                        }
                        $date = new DateTime();
                        if (substr_count($value, '-')) {
                            $date = $date->createFromFormat('m-d-y', $value);
                        } else {
                            $date = $date->createFromFormat('m/d/y', $value);
                        }
                        $value = $date->format('d/m/Y');
                    }
                    if ($value && (substr_count($campos[$key], 'cantidad') || substr_count($campos[$key], 'precio') ||
                        substr_count($campos[$key], 'importe') || $campos[$key] == 'minimo' ||
                        $campos[$key] == 'maximo')) {
                        $value = str_replace(',', '', $value);
                    }
                    $prod[$campos[$key]] = $value ? $value : null;
                }
                $prod['nro'] = $index + 1;
                $prod['iddocumento'] = $params['iddocumento'];
                $productos[] = $prod;
            }
        }
        return array('productos' => $productos, 'error' => $error);
    }
    
    public function cargarProductoError($filtro)
    {
        $selectD = "(SELECT (count(_a.codigoproducto) > 1) AS duplicado FROM mod_loginventario.dat_impapertura _a "
            . "WHERE _a.iddocumento = a.iddocumento AND (_a.cantidadlote = 0 OR _a.cantidadlote IS NULL) "
            . "AND _a.codigoproducto = a.codigoproducto GROUP BY _a.categoria, _a.codigoproducto LIMIT 1)";
        $whereD = str_replace('_a', '_a2', $selectD);
        
        $selectF = "(a.fechafabricacion > current_date AND a.fechafabricacion IS NOT NULL) AS actualp, "
            . "(a.fechaproduccion > current_date AND a.fechaproduccion IS NOT NULL) AS actuall";
        $whereF = "(a.fechafabricacion > current_date and a.fechafabricacion IS NOT NULL) OR "
            . "(a.fechaproduccion > current_date AND a.fechaproduccion IS NOT NULL)";
        
        $sqlCant = "a.cantidadlote > 0 AND a.fechaproduccion IS NULL";
        $sqlP = "(a.fechafabricacion > a.fechavencimiento "
            . "AND a.fechafabricacion IS NOT NULL AND a.fechavencimiento IS NOT NULL)";
        $sqlL = "(a.fechaproduccion > a.fechavencimientolote AND a.fechaproduccion IS NOT NULL "
            . "AND a.fechavencimientolote IS NOT NULL)";
        
        $sql = "SELECT a.*, (CASE WHEN {$sqlCant} THEN true END) AS sinfecha, ({$sqlP}) AS rangop, ({$sqlL}) AS rangol, "
            . "{$selectD} AS duplicado, {$selectF} FROM mod_loginventario.dat_impapertura a "
            . "WHERE a.iddocumento = ? AND (({$sqlCant}) OR a.codigoproducto IS NULL OR ({$sqlP} OR {$sqlL}) "
            . "OR a.errorfecha IS NOT NULL OR {$whereD} = true OR {$whereF}) "
            . "ORDER BY a.idimpapertura";
        $cantidad = count(Doctrine_Manager::connection()->fetchAll($sql, array($filtro['iddocumento'])));
        return array(
            'cantidad' => $cantidad,
            'datos' => Doctrine_Manager::connection()
                ->fetchAll($sql . " OFFSET {$filtro['start']} LIMIT {$filtro['limit']}", array($filtro['iddocumento']))
        );
    }
    
    private function getError($campo)
    {
        switch ($campo) {
            case 'fechafabricacion':
                return 1;
            case 'fechavencimiento':
                return 2;
            case 'fechaproduccion':
                return 3;
            default:
                return 4;
        }
    }
    
    public function eliminarImportar($iddocumento)
    {
        Doctrine_Query::create()->delete('DatImpapertura')->where('iddocumento = ?', $iddocumento)->execute();
    }

}
