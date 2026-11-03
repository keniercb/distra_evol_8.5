<?php

/**
 * @class MunicionesModel
 * @package Inventario
 * @subpackage Armamento
 * @author Antonio Diaz Soutuyo
 * @version 1.0
 */
class MunicionesModel extends BaseModel
{
    /**
     * @var UtilesubicacionService
     */
    private $ubicacion;
    /**
     * Constructor de la clase.
     */
    public function __construct()
    {
        parent::__construct(true);
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProductoLogistica',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductomunic(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatDocumentoPadre',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
        $this->ubicacion = new UtilesubicacionService();
    }

    /**
     * Selecciona los datos comunes de las partidas.
     * @param Doctrine_Query $query
     * @param boolean $denominacion [Opcional] Selecciona la denominacion de los años y marcas en lugar del id.
     */
    private function selectPartida($query, $denominacion = false)
    {
        $query->addSelect(
            'pm.idproductomunic AS idproductomunic, coalesce(pm.existencia, 0) AS existencia, '
            . 'pm.elemembalajes AS elemembalajes, pm.indice AS indice, pm.estiba AS estiba, pm.hilera AS hilera, '
            . 'pm.numeropartida AS numeropartida, pm.idpartida AS idpartida, pm.idpartidapolvuno AS idpartidapolvuno, '
            . 'pm.idpartidapolvdos AS idpartidapolvdos, pm.idpartidaexplosivo AS idpartidaexplosivo, '
            . 'pm.idpartidaespoleta AS idpartidaespoleta, pm.idpartidaestopin AS idpartidaestopin, pm.idfab AS idfab, '
            . 'pm.idfabpolvuno AS idfabpolvuno, pm.idfabpolvdos AS idfabpolvdos, pm.idfabexplosivo AS idfabexplosivo, '
            . 'pm.idfabespoleta AS idfabespoleta, pm.idfabestopin AS idfabestopin, '
            . 'pm.idpartidaestopin AS idpartidaestopin, pm.checksum AS checksum, pm.estado as estado, '
            . 'pl.idproducto AS idproducto, pl.idestructura AS idestructura, '
            . 'pl.idestructuracomun AS idestructuracomun, eu.idestructuraubicacion AS idestructuraubicacion, '
            . "(eu.codigo || '-' || eu.descripcion) AS ubicacion, "
            . "(coalesce(pm.existencia, 0) - coalesce((SELECT sum(pmc.cantidad) FROM DatProductomunicComprometido pmc "
            . "WHERE pmc.idproductomunic = pm.idproductomunic AND pmc.estado = 1), 0)) AS disponible"
        );
        if ($denominacion) {
            $query->addSelect(
                "(CASE WHEN pm.idanno = '0' THEN 'S/Datos' ELSE pm.idanno END) AS idanno, "
                . "(CASE WHEN pm.idannopolvuno = '0' THEN 'S/Datos' ELSE pm.idannopolvuno END) AS idannopolvuno, "
                . "(CASE WHEN pm.idannopolvdos = '0' THEN 'S/Datos' ELSE pm.idannopolvdos END) AS idannopolvdos, "
                . "(CASE WHEN pm.idannoexplosivo = '0' THEN 'S/Datos' ELSE pm.idannoexplosivo END) AS idannoexplosivo, "
                . "(CASE WHEN pm.idannoespoleta = '0' THEN 'S/Datos' ELSE pm.idannoespoleta END) AS idannoespoleta, "
                . "(CASE WHEN pm.idannoestopin = '0' THEN 'S/Datos' ELSE pm.idannoestopin END) AS idannoestopin, "
                . "maPI.denominacion AS idmarcapolvuno, maPII.denominacion AS idmarcapolvdos, "
                . "maExp.denominacion AS idmarcaexplosivo, maEsp.denominacion AS idmarcaespoleta, "
                . "maEst.denominacion AS idmarcaestopin"
            );
        } else {
            $query->addSelect(
                'pm.idanno AS idanno, pm.idannopolvuno AS idannopolvuno, pm.idannopolvdos AS idannopolvdos, '
                . 'pm.idannoexplosivo AS idannoexplosivo, pm.idannoespoleta AS idannoespoleta, '
                . 'pm.idannoestopin AS idannoestopin, maPI.idmarcaarmamento AS idmarcapolvuno, '
                . 'maPII.idmarcaarmamento AS idmarcapolvdos, maExp.idmarcaarmamento AS idmarcaexplosivo, '
                . 'maEsp.idmarcaarmamento AS idmarcaespoleta, maEst.idmarcaarmamento AS idmarcaestopin'
            );
        }
    }

    /**
     * Devuelve las partidas del producto.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarMuniciones(&$filtro, $dql = false)
    {
        $query = Doctrine_Query::create();
        if ($filtro['idproducto'] /*&& $filtro['contabilizado']*/) {
            $query->select('pm.idproductomunic')->from('DatProductomunic pm');
            if ($filtro['idmovimiento']) {
                $query->addSelect(
                        'mpm.idmovproductomunic AS idmovproductomunic, mpm.idmovimiento AS idmovimiento, '
                        . '_m.iddocumento AS iddocumento, coalesce(mpm.cantidad, 0) AS cantidad, '
                        . 'coalesce(mpm.cantidad, 0) AS _cantidad,(SELECT _pmc.idproductomuniccomprometido '
                        . 'FROM DatProductomunicComprometido _pmc WHERE _m.iddocumento = _pmc.iddocumento '
                        . 'AND _pmc.idproductomunic = mpm.idproductomunic) AS idproductomuniccomprometido, '
                        . '(SELECT _uc.idubicacioncomprometida FROM DatUbicacionComprometida _uc '
                        . 'WHERE _uc.idubicacion = pm.idestructuraubicacion AND _uc.iddocumento = _m.iddocumento '
                        . 'AND _uc.idproducto = pm.idproducto) AS idubicacioncomprometida'
                    )
                    ->leftJoin(
                        "pm.DatMovproductomunic mpm ON (mpm.idproductomunic = pm.idproductomunic) "
                        /*. "AND mpm.idmovimiento = {$filtro['idmovimiento']})"*/
                    )
                    ->leftJoin('mpm.DatMovimientos _m');
                if ($filtro['devolucion']) {
                    $this->selectDatosDevolucion($query, $filtro['idmovimiento'], $filtro['idpadre']);
                }
            }
        } else {
            $query->select(
                    'mpm.idmovproductomunic, mpm.idmovimiento, coalesce(mpm.cantidad, 0) AS cantidad, '
                    . 'coalesce(mpm.cantidad, 0) AS _cantidad'
                )
                ->from('DatMovproductomunic mpm')->innerJoin('mpm.DatProductomunic pm')
                ->innerJoin('mpm.DatMovimientos m')
                ->where('mpm.idmovimiento = ? and pm.idproducto = ?', array($filtro['idmovimiento'], $filtro['idproducto']));
        }
        $query->innerJoin('pm.DatProductoLogistica pl')->innerJoin('pm.DatEstructuraubicacion eu')
            ->innerJoin('pm.NomMarcaarmamento maPI ON pm.idmarcapolvuno = maPI.idmarcaarmamento')
            ->innerJoin('pm.NomMarcaarmamento maPII ON pm.idmarcapolvdos = maPII.idmarcaarmamento')
            ->innerJoin('pm.NomMarcaarmamento maExp ON pm.idmarcaexplosivo = maExp.idmarcaarmamento')
            ->innerJoin('pm.NomMarcaarmamento maEsp ON pm.idmarcaespoleta = maEsp.idmarcaarmamento')
            ->innerJoin('pm.NomMarcaarmamento maEst ON pm.idmarcaestopin = maEst.idmarcaarmamento')
            ->orderBy('pm.idproductomunic');
        $this->selectPartida($query, $filtro['pornombre']);
        $this->fitroPartida($filtro, $query);
        if ($dql) {
            return $query;
        }
        return array(
            'total' => (!$filtro['contabilizado']) ? $this->getTotalPartidas($filtro) : $this->getTotalPartidasProducto($filtro), 'cantidad' => $query->count(),
            'totalDesglozado' => $this->getTotalPartidasProductoDesglozadoAprobados($filtro, 1),
            'totalAprobado' => $this->getTotalPartidasProductoDesglozadoAprobados($filtro, 2),
            'indice' => $this->getIndice($filtro),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Incluye los filtros para la consulta de datos de partidas.
     * @param array $filtro
     * @param Doctrine_Query $query
     */
    private function fitroPartida($filtro, $query)
    {
        if ($filtro['criterio']) {
            $query->addWhere(
                "pm.idpartida ILIKE '%{$filtro['criterio']}%' OR pm.idanno ILIKE '%{$filtro['criterio']}%' "
                . "OR pm.idfab ILIKE '%{$filtro['criterio']}%'"
            );
        }
        if ($filtro['idproducto']) {
            $query->addWhere('pm.idproducto = ?', $filtro['idproducto']);
        }
        if ($filtro['estado']) {
            $query->addWhere('pm.estado = ?', $filtro['estado']);
        }
        if ($filtro['salida']) {
            $query->addWhere('pm.existencia > 0');
        }
        if ($filtro['contabilizado'] && $filtro['idmovimiento']) {
            $query->addWhere('mpm.cantidad > 0');
        }
        if ($filtro['idarea']) {
            $query->addWhere('eu.idarea = ?', $filtro['idarea']);
        }
        if ($filtro['idestructuraubicacion']) {
            $query->addWhere('eu.idestructuraubicacion = ?', $filtro['idestructuraubicacion']);
        }
        if ($filtro['estiba']) {
            $query->addWhere('pm.estiba = ?', $filtro['estiba']);
        }
        if ($filtro['hilera']) {
            $query->addWhere('pm.hilera = ?', $filtro['hilera']);
        }
        if ($filtro['idanno']) {
            $query->addWhere('pm.idanno = ?', $filtro['idanno']);
        }
        if ($filtro['idannopolvuno']) {
            $query->addWhere('pm.idannopolvuno = ?', $filtro['idannopolvuno']);
        }
        if ($filtro['idannopolvdos']) {
            $query->addWhere('pm.idannopolvdos = ?', $filtro['idannopolvdos']);
        }
        if ($filtro['idannoexplosivo']) {
            $query->addWhere('pm.idannoexplosivo = ?', $filtro['idannoexplosivo']);
        }
        if ($filtro['idannoespoleta']) {
            $query->addWhere('pm.idannoespoleta = ?', $filtro['idannoespoleta']);
        }
        if ($filtro['idannoestopin']) {
            $query->addWhere('pm.idannoestopin = ?', $filtro['idannoestopin']);
        }
        if ($filtro['idmarcapolvuno']) {
            $query->addWhere('pm.idmarcapolvuno = ?', $filtro['idmarcapolvuno']);
        }
        if ($filtro['idmarcapolvdos']) {
            $query->addWhere('pm.idmarcapolvdos = ?', $filtro['idmarcapolvdos']);
        }
        if ($filtro['idmarcaexplosivo']) {
            $query->addWhere('pm.idmarcaexplosivo = ?', $filtro['idmarcaexplosivo']);
        }
        if ($filtro['idmarcaespoleta']) {
            $query->addWhere('pm.idmarcaespoleta = ?', $filtro['idmarcaespoleta']);
        }
        if ($filtro['idmarcaestopin']) {
            $query->addWhere('pm.idmarcaestopin = ?', $filtro['idmarcaestopin']);
        }
        if ($filtro['idpartida']) {
            $query->addWhere('pm.idpartida = ?', $filtro['idpartida']);
        }
        if ($filtro['idpartidapolvuno']) {
            $query->addWhere('pm.idpartidapolvuno = ?', $filtro['idpartidapolvuno']);
        }
        if ($filtro['idpartidapolvdos']) {
            $query->addWhere('pm.idpartidapolvdos = ?', $filtro['idpartidapolvdos']);
        }
        if ($filtro['idpartidaexplosivo']) {
            $query->addWhere('pm.idpartidaexplosivo = ?', $filtro['idpartidaexplosivo']);
        }
        if ($filtro['idpartidaespoleta']) {
            $query->addWhere('pm.idpartidaespoleta = ?', $filtro['idpartidaespoleta']);
        }
        if ($filtro['idpartidaestopin']) {
            $query->addWhere('pm.idpartidaestopin = ?', $filtro['idpartidaestopin']);
        }
        if ($filtro['idfab']) {
            $query->addWhere('pm.idfab = ?', $filtro['idfab']);
        }
        if ($filtro['idfabpolvuno']) {
            $query->addWhere('pm.idfabpolvuno = ?', $filtro['idfabpolvuno']);
        }
        if ($filtro['idfabpolvdos']) {
            $query->addWhere('pm.idfabpolvdos = ?', $filtro['idfabpolvdos']);
        }
        if ($filtro['idfabexplosivo']) {
            $query->addWhere('pm.idfabexplosivo = ?', $filtro['idfabexplosivo']);
        }
        if ($filtro['idfabespoleta']) {
            $query->addWhere('pm.idfabespoleta = ?', $filtro['idfabespoleta']);
        }
        if ($filtro['idfabestopin']) {
            $query->addWhere('pm.idfabestopin = ?', $filtro['idfabestopin']);
        }
    }
    
    /**
     * Obtiene los datos de la devolucion.
     * @param Doctrine_Query $query
     */
    private function selectDatosDevolucion($query, $idmovimiento, $idpadre)
    {
        $query->addSelect(
                "_mpm.cantidad AS entregado, coalesce((SELECT sum(mpm_.cantidad) FROM DatMovproductomunic mpm_ "
                . "INNER JOIN pm.DatMovimientos m_ ON m_.idmovimiento = mpm_.idmovimiento "
                . "INNER JOIN m_.DatDocumentoPadre dp_ ON dp_.iddocumento = m_.iddocumento "
                . "WHERE mpm_.idproductomunic = pm.idproductomunic AND mpm_.idmovimiento <> {$idmovimiento} "
                . "AND dp_.idpadre = {$idpadre}), 0) AS resto"
            )
            ->innerJoin('pm.DatMovimientos m')
            ->innerJoin('m.DatMovproductomunic _mpm')
            ->where('_mpm.idproductomunic = pm.idproductomunic AND m.iddocumento = ? AND _mpm.cantidad > 0', $idpadre);
    }

    /**
     * Adiciona las partidas entrantes.
     * @param array $partidas
     * @param numeric $indice
     * @param boolean $actualizar [Opcional] Determina si actualiza el movimiento.
     * @return array
     */
    public function adicionarPartida($partidas, $indice, $desglose, $actualizar = true)
    {
        $checksum = $excepciones = array();
        $cantidad = 0;
        $collection = new Doctrine_Collection('DatProductomunic');
        foreach ($partidas as $value) {
            $value['indice'] = $indice;
            $idmovimiento = $value['idmovimiento'];
            $idproductomunic = $value['idproductomunic'];
            $cantidad += $value['cantidad'] - $value['_cantidad'];
            $value['checksum'] = $this->getCheckSum($value);
            $value['_id'] = $value['checksum'] . $value['hilera'] . $value['estiba'] . $value['idestructuraubicacion'];
            $value['_idproductomunic'] = $value['idproductomunic'];
            $value['idproductomunic'] = $this->getIdProdMunicion($value);
            $idtemp = $value['_idmovproductomunic'] = $value['_idmovproductomunic'] ? $value['_idmovproductomunic'] :
                $value['idmovproductomunic'];
            $value['idmovproductomunic'] = $this->getIdMovProdMunicion($value);
            if (($idtemp && $idtemp != $value['idmovproductomunic'])) {
                $idmpm[] = $idtemp;
            }
            if (!$this->existeCheckSum($checksum, $value, $excepciones) && !$idtemp && !$value['excepcion']) {
                $record = $this->procesarProdMunicion($value, $idtemp != $value['idmovproductomunic']);
                $collection->add($record, $value['_id']);
            } elseif (!$value['excepcion']) {
                $record = $this->procesarProdMunicion($value, $idtemp != $value['idmovproductomunic']);
                $collection->set($value['_id'], $record);
            }

            if ($desglose && $idproductomunic) {
                $result = $this->getEstadoPartida($idproductomunic);
                if ($result[0]['estado'] == 2) {
                    $this->DesubicarProductosAdicionar($idproductomunic);
                }
            }
        }
        if ($collection->count() > 0) {
            $collection->save();
            if (is_array($idmpm) && count($idmpm) > 0) {
                $this->eliminarPartida($idmpm);
            }
            $datos = array('idmovimiento' => $idmovimiento, 'cantidad' => $cantidad);
            if ($actualizar && !$desglose) {
                $this->actualizarMovimiento($datos);
            }
            $this->registrarDiferencia($datos);
        }
        return array('success' => true, 'excepciones' => array_values($excepciones));
    }

    /**
     * Adiciona las partidas salientes.
     * @param array $partidas
     * @param boolean $afecta [Opcional]
     * @return array
     */
    public function adicionarPartidaSalida($partidas, $afecta = false)
    {
        //print_r(array($partidas, $afecta));die;
        $cantidad = $_cant = $cant = 0;
        $collection = new Doctrine_Collection('DatProductomunic');
        foreach ($partidas as $value) {
            $idmovimiento = $value['idmovimiento'];
            $_cant += $value['_cantidad'];
            $cant += $value['cantidad'];
            $cantidad += $value['cantidad'] - $value['_cantidad'];
            $record = $this->procesarProdMunicion($value, false, true);
            $collection->add($record);
            $value['idubicacion'] = $value['idestructuraubicacion'];
            $this->ubicacion->adicionarUbicacionComprometida($value);
        }
        if ($collection->count() > 0) {
            $collection->save();
            $datos = array('idmovimiento' => $idmovimiento, 'cantidad' => $cantidad);
            $this->actualizarMovimiento($datos, $afecta);
            $borrar = $_cant > $cant;
            $this->actualizarCumplimientoSalida($idmovimiento, abs($cant - $_cant), $borrar);
        }
        return array('success' => true, 'excepciones' => array());
    }

    /**
     * Prepara el objecto de DatProductomunic para adicionarlo y lo devuelve.
     * @param array $datos
     * @param boolean $incrementar [Opcional]
     * @param boolean $compromiso [Opcional]
     * @return Doctrine_Record
     */
    private function procesarProdMunicion($datos, $incrementar = false, $compromiso = false)
    {
        $record = new DatProductomunic();
        if ($datos['idproductomunic']) {
            $record->assignIdentifier($datos['idproductomunic']);
            if ($incrementar) {
                $datos['elemembalajes'] = $record->elemembalajes;
                $datos['idestructuraubicacion'] = $record->idestructuraubicacion;
                $datos['hilera'] = $record->hilera;
                $datos['estiba'] = $record->estiba;
            }
        }
        if ($compromiso) {
            $record->DatProductomunicComprometido[] = $this->procesarProdMunicionComprometido($datos);
        } else {
            $record->synchronizeWithArray($datos);
        }
        $record->DatMovproductomunic[] = $this->procesarMovProdMunicion($datos, $incrementar);
        return $record;
    }

    /**
     * Prepara el objecto de DatMovproductomunic para adicionarlo y lo devuelve.
     * @param array $datos
     * @param boolean $incrementar [Opcional]
     * @return Doctrine_Record
     */
    private function procesarMovProdMunicion($datos, $incrementar = false)
    {
        $record = new DatMovproductomunic();
        if ($datos['idmovproductomunic']) {
            $record->assignIdentifier($datos['idmovproductomunic']);
            if ($incrementar) {
                $datos['cantidad'] += $record->cantidad;
            }
        }
        $record->synchronizeWithArray($datos);
        return $record;
    }
    
    /**
     * Prepara un DatProductomunicComprometido para adicionar o actualizar y lo devuelve.
     * @param array $datos
     * @return array Contiene el LoteCompormetido, el idproducto y la cantidad que no pudo ser procesada.
     */
    private function procesarProdMunicionComprometido($datos)
    {
        $this->checkDisponible($datos['idproductomunic'], $datos['cantidad']);
        if (!$datos['idproductomuniccomprometido']) {
            $obj = $this->findProdMunicionComprometido($datos['idproductomunic'], $datos['iddocumento']);
            $datos['idproductomuniccomprometido'] = $obj->idproductomuniccomprometido;
        }
        $record = new DatProductomunicComprometido();
        if ($datos['idproductomuniccomprometido']) {
            $record->assignIdentifier($datos['idproductomuniccomprometido']);
        }
        $record->synchronizeWithArray($datos);
        return $record;
    }

    /**
     * Elimina las partidas.
     * @param array $idmpm
     * @param boolean $afecta [Opcional]
     * @return array
     */
    public function eliminarPartida($idmpm, $afecta = false)
    {
        $datos = Doctrine_Query::create()
            ->select(
                "max(mpm.idmovimiento) AS idmovimiento, sum(mpm.cantidad) AS cantidad, "
                . "array_to_string(array_agg(mpm.idproductomunic), ',') AS ids"
            )
            ->from('DatMovproductomunic mpm')
            ->whereIn('mpm.idmovproductomunic', $idmpm)
            ->fetchArray();
        Doctrine_Query::create()->delete('DatMovproductomunic')->whereIn('idmovproductomunic', $idmpm)->execute();
        $sql = "DELETE FROM mod_loginventario.dat_productomunic pm WHERE pm.idproductomunic IN ({$datos[0]['ids']}) "
            . "AND coalesce((SELECT count(mpm.idmovproductomunic) FROM mod_loginventario.dat_movproductomunic mpm "
            . "WHERE mpm.idproductomunic = pm.idproductomunic), 0) = 0";
        $connexion = Zend_Registry::get('conexion');
        $connexion->execute($sql);
        $this->actualizarMovimiento($datos[0], $afecta, true);
        $this->registrarDiferencia($datos);
        return array('success' => true);
    }
    
    /**
     * Elimina las partidas de un documento o movimientos de entrada eliminadas.
     * @param numeric $iddocumento
     * @param array $idmovimientos
     * @return boolean
     */
    public function eliminarPartidasCanceladas($iddocumento, $idmovimientos)
    {
        $query = Doctrine_Query::create()->select('mpm.idmovproductomunic')->from('DatMovproductomunic mpm');
        if (is_array($idmovimientos) && count($idmovimientos) > 0) {
            $query->whereIn('mpm.idmovimiento', $idmovimientos);
        } else {
            $query->innerJoin('mpm.DatMovimientos m')->where('m.iddocumento = ?', $iddocumento);
        }
        if ($query->count() > 0) {
            $datos = $query->fetchArray();
            $idmpm = $this->objectHelper->extractValueFromArrayColumn($datos, 'idmovproductomunic');
            $this->eliminarPartida($idmpm);
        }
        return true;
    }

    /**
     * Actualiza los datos del movimiento.
     * @param array $datos
     * @param boolean $afecta [Opcional] Determina si afecta la disponibilidad del producto.
     * @param boolean $borrar [Opcional] Determina si la accion a realizar es borrar.
     * @return boolean
     */
    private function actualizarMovimiento($datos, $afecta = false, $borrar = false)
    {
        $mov = Doctrine::getTable('DatMovimientos')->find($datos['idmovimiento'])->toArray();
        $mov['entrada'] = true;
        $mov['cantidad'] += (($borrar ? -1 : 1) * $datos['cantidad']);
        $producto = new LogisticaProductoModel();
        $producto->modificarMovimientos(array($mov), $afecta);
        return true;
    }
    
    /**
     * Registra las difenrencias por cantidad de la recepcion.
     * @param array $datos
     * @return boolean
     */
    private function registrarDiferencia($datos)
    {
        $diferencia = Doctrine_Query::create()->select(
                'mr.idmovimiento, abs(mr.cantidad - m.cantidad) AS cantidaddiferencia, '
                . '(CASE WHEN mr.cantidad < m.cantidad THEN 1 WHEN mr.cantidad > m.cantidad THEN 2 END) AS signo, '
                . '0 AS preciodiferencia, 0 AS importediferencia'
            )
            ->from('DatMovrecepcion mr')
            ->innerJoin('mr.DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->where('mr.idmovimiento = ? AND d.estado = 1', $datos['idmovimiento'])
            ->fetchArray();
        if (count($diferencia) > 0) {
            $reclamacion = new ReclamacionService();
            $reclamacion->registrarDiferencias($diferencia[0]);
        }
        return true;
    }

    /**
     * Devuelve los indices de un producto o movimiento.
     * @param array $filtro
     * @return array
     */
    public function getIndice($filtro)
    {
        $query = Doctrine_Query::create()->select('pm.indice')->from('DatProductomunic pm');
        if ($filtro['idproducto']) {
            $query->select('pm.indice')->where('pm.idproducto = ?', $filtro['idproducto']);
        } else {
            $query->innerJoin('pm.DatMovproductomunic m')->where('m.idmovimiento = ?', $filtro['idmovimiento']);
        }
        return $query->fetchArray()[0]['indice'];
    }

    /**
     * Devuelve la suma total de partidas del movimiento.
     * @param array $filtro
     * @return integer
     */
    public function getTotalPartidas($filtro)
    {
        $total = Doctrine_Query::create()
            ->select('coalesce(sum(mpm.cantidad), 0) AS total')
            ->from('DatMovproductomunic mpm')
            ->where('mpm.idmovimiento = ?', $filtro['idmovimiento'])
            ->fetchArray();
        return is_array($total[0]) ? (int) $total[0]['total'] : 0;
    }

    /**
     * Devuelve la suma total de partidas del producto.
     * @param array $filtro
     * @return integer
     */
    public function getTotalPartidasProducto($filtro)
    {
        $total = Doctrine_Query::create()
            ->select('coalesce(sum(mpm.cantidad), 0) AS total')
            ->from('DatProductomunic pm')
            ->innerJoin('pm.DatMovproductomunic mpm')
            ->where('pm.idproducto = ?', $filtro['idproducto'])
            ->fetchArray();
        return is_array($total[0]) ? (int) $total[0]['total'] : 0;
    }

    /**
     * Devuelve la suma total de partidas del producto desglozados o aprobados(estado 1-desglozado, estado 2-aprobado).
     * @param array $filtro
     * @return integer
     */
    public function getTotalPartidasProductoDesglozadoAprobados($filtro, $estado)
    {
        $total = Doctrine_Query::create()
            ->select('coalesce(sum(mpm.cantidad), 0) AS total')
            ->from('DatProductomunic pm')
            ->innerJoin('pm.DatMovproductomunic mpm')
            ->where('pm.idproducto = ? and pm.estado = ?', array($filtro['idproducto'],$estado))
            ->fetchArray();
        return is_array($total[0]) ? (int) $total[0]['total'] : 0;
    }

    /**
     * Devuelve la codificacion de los datos no cambiable de la partida.
     * Nota: los datos de la partida tienen que tener en un orden especifico.
     * @param array $datos
     * @return string
     */
    public function getCheckSum($datos)
    {
        unset($datos['primaryKeyField']);
        unset($datos['_id']);
        unset($datos['_idproductomunic']);
        unset($datos['_idmovproductomunic']);
        unset($datos['idtemp']);
        unset($datos['idmovproductomunic']);
        unset($datos['idproductomunic']);
        unset($datos['idmovimiento']);
        unset($datos['iddocumento']);
        unset($datos['idproducto']);
        unset($datos['idproductomuniccomprometido']);
        unset($datos['idubicacioncomprometida']);
        unset($datos['idestructuraubicacion']);
        unset($datos['indice']);
        unset($datos['existencia']);
        unset($datos['disponible']);
        unset($datos['cantidad']);
        unset($datos['_cantidad']);
        unset($datos['elemembalajes']);
        unset($datos['hilera']);
        unset($datos['estiba']);
        unset($datos['estado']);
        unset($datos['idrevest']);
        unset($datos['checksum']);
        unset($datos['excepcion']);

        return md5(implode("-", $datos));
    }

    /**
     * Verifica si la partida fue procesada.
     * @param array $checksum
     * @param array $datos
     * @param array $excepciones
     * @return boolean
     */
    private function existeCheckSum(&$checksum, &$datos, &$excepciones)
    {
        $checksum = array_filter($checksum, function(&$item) use (&$datos) {
            if ($item['checksum'] == $datos['checksum'] && $item['hilera'] == $datos['hilera'] &&
                $item['estiba'] == $datos['estiba'] && $item['idestructuraubicacion'] == $datos['idestructuraubicacion']
            ) {
                $datos['cantidad'] += $item['cantidad'];
                $datos['procesado'] = true;
                return true;
            }
        });
        if ($datos['idproductomunic'] && !$datos['excepcion'] && (!$datos['_idmovproductomunic'] ||
            $datos['_idproductomunic'] != $datos['idproductomunic'])) {
            unset($datos['idmovproductomunic']);
            $datos['excepcion'] = true;
            $excepciones[$datos['_id']] = $datos;
        } else {
            $datos['excepcion'] = false;
        }
        if (!$datos['procesado'] && !$datos['idmovproductomunic']) {
            $checksum[] = $datos;
            return false;
        }
        return true;
    }

    /**
     * Devuelve el idproductomunic en caso de coincidir con los datos de la partida.
     * @param array $filtro
     * @return numeric
     */
    private function getIdProdMunicion($filtro)
    {
        $params = array(
            $filtro['idproducto'], $filtro['checksum'], $filtro['hilera'], $filtro['estiba'],
            $filtro['idestructuraubicacion']
        );
        $pm = Doctrine_Query::create()
            ->select('pm.idproductomunic')
            ->from('DatProductomunic pm')
            ->where(
                'pm.idproducto = ? AND pm.checksum = ? AND pm.hilera = ? AND pm.estiba = ? '
                . 'AND pm.idestructuraubicacion = ?', $params
            )
            ->fetchOne();
        return $pm->idproductomunic;
    }

    /**
     * Devuelve el idmovproductomunic en caso de coincidir con los datos del movimiento de la partida.
     * @param array $filtro
     * @return numeric
     */
    private function getIdMovProdMunicion($filtro)
    {
        $params = array(
            $filtro['checksum'], $filtro['hilera'], $filtro['estiba'], $filtro['idestructuraubicacion'],
            $filtro['idproducto'], $filtro['idmovimiento']
        );
        $query = Doctrine_Query::create()
            ->select('mpm.idmovproductomunic')
            ->from('DatMovproductomunic mpm')
            ->innerJoin('mpm.DatProductomunic pm')
            ->where(
                'pm.checksum = ? AND pm.hilera = ? AND pm.estiba = ? AND pm.idestructuraubicacion = ? '
                . 'AND pm.idproducto = ? AND mpm.idmovimiento = ?', $params
            );
        if ($filtro['idmovproductomunic'] && $query->count() == 0) {
            $query->where('mpm.idmovproductomunic = ?', $filtro['idmovproductomunic']);
        }
        $mpm = $query->fetchArray();
        return $mpm[0]['idmovproductomunic'];
    }

    /**
     * Actualiza la existencia de las partidas del documento.
     * @param numeric $iddocumento
     * @param boolean $cancelar [Opcional]
     * @return boolean
     */
    public function aprobarPartida($iddocumento, $cancelar = false)
    {
        $flag = $cancelar ? '1' : '0';
        $sql = "UPDATE dat_productomunic pm SET estado = 2, "
            . "existencia = (SELECT (CASE WHEN (m2.signo = '+' AND {$flag} = '0') "
            . "OR (m2.signo = '-' AND {$flag} = '1') THEN pm.existencia + mpm2.cantidad "
            . "ELSE pm.existencia - mpm2.cantidad END) "
            . "FROM dat_movimiento m2 INNER JOIN dat_movproductomunic mpm2 ON mpm2.idmovimiento = m2.idmovimiento "
            . "WHERE pm.idproductomunic = mpm2.idproductomunic AND m2.iddocumento = {$iddocumento}) "
            . "WHERE pm.idproductomunic IN (SELECT mpm.idproductomunic FROM dat_movproductomunic mpm "
            . "INNER JOIN dat_movimiento m ON (m.idmovimiento = mpm.idmovimiento) "
            . "WHERE m.iddocumento = {$iddocumento})";
        Doctrine_Manager::connection()->fetchAll($sql);
        $this->cambiarEstadoPartidaComprometida($iddocumento, 2);
        $this->ubicarOrDesubicarProductos($iddocumento, !$cancelar);
        return true;
    }
    
    /**
     * Actualiza la existencia de las partidas de origen y destino de la transferencia entre areas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function aprobarPartidaTransferencia($iddocumento)
    {
        $sql = "UPDATE mod_loginventario.dat_productomunic pm 
            SET estado = 2, existencia = (
                SELECT (
                    CASE 
                        WHEN pm.idproductomunic = _mtpm.idpartidaorigen THEN pm.existencia - _mtpm.cantidad 
                        WHEN pm.idproductomunic = _mtpm.idpartidadestino THEN pm.existencia + _mtpm.cantidad 
                        ELSE pm.existencia
                    END
                ) 
                FROM mod_logistica.dat_movimiento _m 
                INNER JOIN mod_loginventario.dat_movtransferenciamunic _mtpm ON _m.idmovimiento = _mtpm.idmovimiento 
                WHERE (_mtpm.idpartidaorigen = pm.idproductomunic OR _mtpm.idpartidadestino = pm.idproductomunic) 
                    AND _m.iddocumento = {$iddocumento}
            ) 
            WHERE pm.idproductomunic IN (
                SELECT pm2.idproductomunic FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_loginventario.dat_movtransferenciamunic mtpm ON m.idmovimiento = mtpm.idmovimiento 
                INNER JOIN mod_loginventario.dat_productomunic pm2 ON pm2.idproductomunic = mtpm.idpartidaorigen 
                    OR pm2.idproductomunic = mtpm.idpartidadestino 
                WHERE m.iddocumento = {$iddocumento}
            )";
        Doctrine_Manager::connection()->fetchAll($sql);
        $this->cambiarEstadoPartidaComprometida($iddocumento, 2);
        $this->ubicarOrDesubicarProductos($iddocumento, true, true);
        return true;
    }

    /**
     * Ubica o desubica las partidas del documento.
     * @param numeric $iddocumento
     * @param boolean $ubicar [Opcional]
     * @param boolean $transferencia [Opcional]
     * @return boolean
     */
    private function ubicarOrDesubicarProductos($iddocumento, $ubicar = false, $transferencia = false)
    {
        $ubicacion = new UtilesubicacionService();
        $query = Doctrine_Query::create()
            ->select('pm.idproductomunic, pm.idproducto, pm.idestructuraubicacion AS idubicacion')
            ->from('DatProductomunic pm')
            ->where("m.iddocumento = ?", $iddocumento);
        if ($transferencia) {
            $query->addSelect(
                    "mtpm.cantidad AS cantidad, "
                    . "(CASE WHEN pm.idproductomunic = mtpm.idpartidaorigen THEN '-' ELSE '+' END) AS signo"
                )
                ->innerJoin(
                    'pm.DatMovtransferenciamunic mtpm ON pm.idproductomunic = mtpm.idpartidaorigen '
                    . 'OR pm.idproductomunic = mtpm.idpartidadestino'
                )
                ->innerJoin('mtpm.DatMovimientos m');
        } else {
            $query->addSelect('mpm.cantidad AS cantidad, m.signo AS signo')->innerJoin('pm.DatMovproductomunic mpm')
                ->innerJoin('mpm.DatMovimientos m');
        }
        $partidas = $query->fetchArray();
        foreach ($partidas as $value) {
            if (($value['signo'] == LogisticaMovimientoModel::SIGNO_MOV_SUMA && $ubicar) ||
                ($value['signo'] == LogisticaMovimientoModel::SIGNO_MOV_RESTA && !$ubicar)) {
                $ubicacion->ubicarProducto($value);
            } else {
                $resp = $ubicacion->cargarUbicacionesProducto($value, true)->fetchArray();
                $array[] = array(
                    'cantidad' => $value['cantidad'], 'idareaproducto' => $resp[0]['idareaproducto'],
                    'idubicacionproducto' => $resp[0]['idubicacionproducto']
                );
                $ubicacion->desubicarProducto($array);
            }
        }
        return true;
    }
    
    /**
     * Cambia el estado de compromiso de la partida.
     * @param numeric $iddocumento
     * @param integer $estado
     * @return boolean
     */
    private function cambiarEstadoPartidaComprometida($iddocumento, $estado)
    {
        Doctrine_Query::create()
            ->update('DatProductomunicComprometido')
            ->set('estado', $estado)
            ->where('iddocumento = ?', $iddocumento)
            ->execute();
        return true;
    }

    public function crearExcelPartidas($filtro)
    {
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarMuniciones($filtro, true)
            ->addSelect('i.denominacion AS denominacion, i.codigo AS codigo')
            ->innerJoin('pl.NomIndicador i')->addWhere('pm.existencia > 0')
            ->fetchArray();
        foreach ($datos as $key => $value) {
            $datos[$key]['cantidad'] = $filtro['proceso'] ? $value['cantidad'] : $value['existencia'];
            $deposito = $this->estructuraHelper->getEstructura($value['idestructura']);
            $datos[$key]['deposito'] = $deposito[0]->denominacion;
            $estructura = $this->estructuraHelper->getEstructura($value['idestructuracomun']);
            $datos[$key]['estructura'] = $estructura[0]->denominacion;
            $datos[$key]['codigoestructura'] = $estructura[0]->codigo;
        }
        $columns = array(
            array(
                'header' => 'Entidad', 'dataIndex' => 'codigoestructura'
            // ,Para el MINFAR usan el codigo como nombre en vez de usar el nombre de la estructura
            ),
            array('header' => 'Dep&oacute;sito', 'dataIndex' => 'deposito',),
            array('header' => 'C&oacute;digo', 'dataIndex' => 'codigo'),
            array('header' => 'Den&oacute;minacion', 'dataIndex' => 'denominacion'),
            array('header' => 'Ubicaci&oacute;n', 'dataIndex' => 'ubicacion'),
            array('header' => 'Estiba', 'dataIndex' => 'estiba'),
            array('header' => 'Hilera', 'dataIndex' => 'hilera'),
            array('header' => 'MGP', 'dataIndex' => 'idpartida'),
            array('header' => 'MGA', 'dataIndex' => 'idanno'),
            array('header' => 'MGF', 'dataIndex' => 'idfab'),
            array('header' => 'Cantidad', 'dataIndex' => 'cantidad'),
            array('header' => 'PIM', 'dataIndex' => 'idmarcapolvuno'),
            array('header' => 'PIP', 'dataIndex' => 'idpartidapolvuno'),
            array('header' => 'PIA', 'dataIndex' => 'idannopolvuno'),
            array('header' => 'PIF', 'dataIndex' => 'idfabpolvuno'),
            array('header' => 'PIIM', 'dataIndex' => 'idmarcapolvdos'),
            array('header' => 'PIIP', 'dataIndex' => 'idpartidapolvdos'),
            array('header' => 'PIIA', 'dataIndex' => 'idannopolvdos'),
            array('header' => 'PIIF', 'dataIndex' => 'idfabpolvdos'),
            array('header' => 'ExM', 'dataIndex' => 'idmarcaexplosivo'),
            array('header' => 'ExP', 'dataIndex' => 'idpartidaexplosivo'),
            array('header' => 'ExA', 'dataIndex' => 'idannoexplosivo'),
            array('header' => 'ExF', 'dataIndex' => 'idfabexplosivo'),
            array('header' => 'EspM', 'dataIndex' => 'idmarcaespoleta'),
            array('header' => 'EspP', 'dataIndex' => 'idpartidaespoleta'),
            array('header' => 'EspA', 'dataIndex' => 'idannoespoleta'),
            array('header' => 'EspF', 'dataIndex' => 'idfabespoleta'),
            array('header' => 'EstM', 'dataIndex' => 'idmarcaestopin'),
            array('header' => 'EstP', 'dataIndex' => 'idpartidaestopin'),
            array('header' => 'EstA', 'dataIndex' => 'idannoestopin'),
            array('header' => 'EstF', 'dataIndex' => 'idfabestopin')
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return array('dirFichero' => '/logistica/inventario/armamento/' . $fichero);
    }
    
    /**
     * Verifica si hay disponibilidad para la partida.
     * @param numeric $idproductomunic
     * @param integer $cantidad
     * @param boolean $exception [Opcional] Determina si se lanza la excepcion de hacerse negativa la dispobibilidad.
     * @return boolean
     * @throws ZendExt_Exception Excepcion que lanza si la disponibilidad se hace negativa.
     */
    private function checkDisponible($idproductomunic, $cantidad, $exception = false)
    {
        $cant = Doctrine_Query::create()
            ->select('pm.idproductomunic')
            ->from('DatProductomunic pm')
            ->where(
                'pm.idproductomunic = ? AND (coalesce(pm.existencia, 0) - ? < coalesce((SELECT sum(pmc.cantidad) '
                . 'FROM DatProductomunicComprometido pmc WHERE pmc.idproductomunic = pm.idproductomunic '
                . 'AND pmc.estado = 1), 0))', array($idproductomunic, $cantidad)
            )
            ->count();
        if ($cant > 0 && $exception) {
            throw new ZendExt_Exception('LOG_LB_PARTIDA_001');
        }
        return $cant == 0;
    }
    
    /**
     * Devuelve el DatProductomunicComprometido si existe.
     * @param numeric $idproductomunic
     * @param numeric $iddocumento
     * @return Doctrine_Record
     */
    private function findProdMunicionComprometido($idproductomunic, $iddocumento)
    {
        $obj = Doctrine_Query::create()
            ->from('DatProductomunicComprometido pmc')
            ->where('pmc.idproductomunic = ? AND pmc.iddocumento = ?', array($idproductomunic, $iddocumento))
            ->fetchOne();
        return $obj;
    }

    /**
     * Actualiza el cumplimiento de entrega del producto del documento de salida que contiene el movimiento.
     * @param numeric $idmovimiento
     * @param integer $cantidad
     * @param boolean $borrar [Opcional]
     * @return boolean
     */
    private function actualizarCumplimientoSalida($idmovimiento, $cantidad, $borrar = false)
    {
        $datos = Doctrine_Query::create()
            ->select(
                "e.iddocumento, e.origen, array_to_string(array_agg(dp.idpadre), ',') AS idpadres, "
                . "d.idestructuracomun AS idestructuracomun, dc.idcliente AS idcliente, m.idproducto AS idproducto"
            )
            ->from('DatEntrega e')
            ->innerJoin('e.DatDocumento d')
            ->innerJoin('d.DatDocumentoCliente dc')
            ->innerJoin('d.DatMovimientos m')
            ->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
            ->where('m.idmovimiento = ?', $idmovimiento)
            ->groupBy('e.iddocumento, d.iddocumento, dc.iddocumentocliente, m.idproducto')
            ->fetchArray();
        $salida = new DocumentosalidaService();
        if ($datos[0]['origen'] == 1) {
            // Actualiza el cumplimiento de entrega de la orden de despacho.
            $salida->actualizarCumplimientoProdOrden($datos[0], $cantidad, $borrar);
        } elseif ($datos[0]['origen'] == 2) {
            // Actualiza el cumplimiento de la solicitid de entrega del producto.
            $salida->actualizarCumplimientoSolEntrega($datos[0], $cantidad, $borrar);
        } else {
            // Actualiza el cumplimiento de devolucion del producto.
            $datos = Doctrine_Query::create()
                ->select("d.iddocumento, m.idmovimiento AS idmovimiento")
                ->from('DatDocumento d')->innerJoin('d.DatMovimientos m')
                ->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
                ->where('m.idmovimiento = ?', $idmovimiento)
                ->fetchArray();
            if (count($datos) > 0) {
                $devolucion = new DevolucionService();
                $devolucion->actualizarProductoCmplto($datos[0]['iddocumento'], false, array($idmovimiento));
            }
        }
        return true;
    }

    /**
     * Devuelve el estado de las partidas del documento.
     * @param numeric $idproductomunic
     * @return Doctrine_Record
     */
    public function getEstadoPartida($idproductomunic)
    {
        $estado = Doctrine_Query::create()
            ->select('pm.estado')
            ->from('DatProductomunic pm')
            ->where(
                'pm.idproductomunic = ?', array($idproductomunic)
            )->fetchArray();
        return $estado;
    }

    /**
     * Actualiza la existencia de las partidas por desglose del documento.
     * @param numeric $iddocumento
     * @param boolean $cancelar [Opcional]
     * @return boolean
     */
    public function aprobarPartidaDesglose($iddocumento)
    {
        $this->aprobarExistenciasEstadoPartidasDesglose($iddocumento);
        $this->cambiarEstadoPartidaComprometida($iddocumento, 2);
        $this->ubicarOrDesubicarProductos($iddocumento, true);
        return true;
    }

    /**
     * Aprueba la existencia de las partidas por desglose del documento.
     * @param numeric $iddocumento
     * @param boolean $cancelar [Opcional]
     * @return boolean
     */
    public function aprobarExistenciasEstadoPartidasDesglose($iddocumento)
    {
        $sql = "UPDATE mod_loginventario.dat_productomunic pm
            SET estado = 2, existencia = (
                SELECT _mtpm.cantidad
                FROM mod_logistica.dat_movimiento _m
                INNER JOIN mod_loginventario.dat_movproductomunic _mtpm ON _m.idmovimiento = _mtpm.idmovimiento
                WHERE _mtpm.idproductomunic = pm.idproductomunic
                 AND _m.iddocumento = {$iddocumento}
            )
            WHERE pm.idproductomunic IN (
                SELECT mpm.idproductomunic FROM mod_logistica.dat_movimiento m
                INNER JOIN mod_loginventario.dat_movproductomunic mpm ON m.idmovimiento = mpm.idmovimiento
                WHERE  mpm.idproductomunic = pm.idproductomunic
                  AND m.iddocumento = {$iddocumento}
            )";
        Doctrine_Manager::connection()->fetchAll($sql);
    }

    private function DesubicarProductosAdicionar($iddocumento, $transferencia = false)
    {
        $ubicacion = new UtilesubicacionService();
        $query = Doctrine_Query::create()
            ->select('pm.idproductomunic, pm.idproducto, pm.idestructuraubicacion AS idubicacion')
            ->from('DatProductomunic pm')
            ->where("pm.idproductomunic = ?", $iddocumento);
        if ($transferencia) {
            $query->addSelect(
                "mtpm.cantidad AS cantidad, "
                . "(CASE WHEN pm.idproductomunic = mtpm.idpartidaorigen THEN '-' ELSE '+' END) AS signo"
            )
                ->innerJoin(
                    'pm.DatMovtransferenciamunic mtpm ON pm.idproductomunic = mtpm.idpartidaorigen '
                    . 'OR pm.idproductomunic = mtpm.idpartidadestino'
                )
                ->innerJoin('mtpm.DatMovimientos m');
        } else {
            $query->addSelect('mpm.cantidad AS cantidad, m.signo AS signo')->innerJoin('pm.DatMovproductomunic mpm')
                ->innerJoin('mpm.DatMovimientos m');
        }
        $partidas = $query->fetchArray();
        foreach ($partidas as $value) {
            $resp = $ubicacion->cargarUbicacionesProducto($value, true)->fetchArray();
            $array[] = array(
                'cantidad' => $value['cantidad'], 'idareaproducto' => $resp[0]['idareaproducto'],
                'idubicacionproducto' => $resp[0]['idubicacionproducto']
            );
            $ubicacion->desubicarProducto($array);
        }
        return true;
    }
}
