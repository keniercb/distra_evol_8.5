<?php

/**
 * @class      TransferenciareaModel
 *
 * @package Inventario
 * @subpackage Movimiento
 * @author Manuel Yhon Figueroa y Antonio Diaz Soutuyo
 * @copyright XETID
 * @version 1.0
 */
class TransferenciareaModel extends MovimientosModel
{
    /**
     * @var UtilesubicacionService
     */
    private $ubicacion;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->tryInyector();
        $this->ubicacion = new UtilesubicacionService();
    }

    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idtransferenciaarea')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'idtipotransferencia', 'foreign' => 'idtipotransferencia')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new NomTipotransferencia(), $relations);

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatArea(), $relations);

        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatTransferenciaAreas',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
    }

    /**
     * Metodo para devolver los documentos de trasnferencia entre areas
     * @params array $datosDoc Arreglo con los parametros para filtrar los
     * documentos
     *
     * @return array
     */
    public function devolverDocumentos($filtro)
    {
        $query = parent::devolverDocumentos($filtro);
        $trasnferenciareas = new DatTransferenciaAreas();
        $trasnferenciareas->getJoinDatTransferenciareas($query, 'd');
        $trasnferenciareas->getDatosTransferenciaareas($query, $filtro);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Metodo para adicionar un documento de transferencia entre areas y
     * los movimientos del producto
     *
     * @params array $datosDoc Arreglo con los parametros para adicionar
     *         un documento de transferencia entre areas
     *
     * @return array
     */
    public function adicionarDocumento($datosDoc)
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $transferenciaAreas = new DatTransferenciaAreas();
        if ($datosDoc['iddocumento']) {
            $transferenciaAreas->assignIdentifier($datosDoc['iddocumento']);
        }
        $datosDoc['areaorigen'] = $datosDoc['idareaorigen'];
        $datosDoc['areadestino'] = $datosDoc['idareadestino'];
        $transferenciaAreas->synchronizeWithArray($datosDoc);
        $documento->DatTransferenciaAreas = $transferenciaAreas;
        $documento->save();
        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $this->producto->adicionarMovimientos($documento->iddocumento, $datosDoc['idproductos']);
        }
        return array(
            'iddocumento' => $documento->iddocumento,
            'cantproductos' => $this->cantidadMovimientos($documento->iddocumento)
        );
    }

    /**
     * Función que permite duplicar una transfernecia entre areas
     * @param numeric $iddocumento
     * @return Interger
     */
    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $transferencia = Doctrine::getTable('DatTransferenciaAreas')->find($iddocumento);
        $nuevoDoc = $transferencia->copy();
        $datos = $transferencia->toArray();
        $datos['idtransferenciaarea'] = $idCopia;
        $nuevoDoc->synchronizeWithArray($datos);
        $nuevoDoc->save();
        return $nuevoDoc->idtransferenciaarea;
    }
    
    /**
     * Elimina el documento seleccionado.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        Doctrine_Query::create()->delete('DatUbicacionComprometida')->where('iddocumento = ?', $iddocumento)->execute();
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Aprueba el documento de transferencia entre areas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function aprobarDocumento($iddocumento)
    {
        parent::aprobarDocumento($iddocumento, true);
        $productos = $this->cargarMovTransferencia(null, true)
            ->select(
                "mt.idmovtransferencia, m.idproducto AS idproducto, eud.idestructuraubicacion AS idubicacion, "
                . "eud.idarea AS idarea, ap.idareaproducto AS idareaproducto, "
                . "up.idubicacionproducto AS idubicacionproducto, mt.cantidad, true AS esarea, true AS bandUbicar"
            )
            ->innerJoin('mt.DatMovimientos m')->innerJoin('euo.DatUbicacionproducto up')
            ->innerJoin('euo.DatArea a')->innerJoin('a.DatAreaproducto ap')
            ->where(
                'm.iddocumento = ? AND ap.idproducto = up.idproducto AND up.idproducto = m.idproducto', $iddocumento
            )
            ->fetchArray();
        $this->ubicacion->desubicarProducto($productos);
        if ($this->existComponent('log.inv.municiones')) {
            $municionesService = new MunicionesService();
            $municionesService->aprobarPartidaTransferencia($iddocumento);
        }
        $this->ubicacion->cambiarEstado($iddocumento, 2);
        return array('success' => true);
    }
    
    /**
     * Elimina los movimiemientos seleccionados del documento.
     * @param array $idmovimientos
     * @param numeric $iddocumento
     * @return array
     */
    public function eliminarMovimientos($idmovimientos, $iddocumento)
    {
        $str = implode(',', $idmovimientos);
        Doctrine_Query::create()
            ->delete('DatUbicacionComprometida')
            ->where(
                "iddocumento = ? AND idproducto IN (SELECT m.idproducto FROM DatMovimientos m "
                . "WHERE m.idmovimiento IN ({$str}))", $iddocumento
            )
            ->execute();
        return parent::eliminarMovimientos($idmovimientos, $iddocumento);
    }

    /**
     * Devuelve los datos a los movimientosde transferencia entre areas.
     * @params array $filtro
     * @params array $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarMovTransferencia($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()->select(
            'mt.idmovimiento, mt.cantidad, euo.idestructuraubicacion AS idubicacionorigen, '
            . 'euo.descripcion AS origen, eud.idestructuraubicacion AS idubicaciondestino, '
            . 'eud.descripcion AS destino'
        );
        if ($filtro['idmovimiento']) {
            $query->where('mt.idmovimiento = ?', $filtro['idmovimiento']);
        }
        if ($filtro['partida']) {
            $query->addSelect(
                    'mt.idmovtransferenciamunic, mt.idpartidaorigen, mt.idpartidadestino, mt.estiba, mt.hilera'
                )
                ->from('DatMovtransferenciamunic mt')
                ->innerJoin('mt.DatProductomunic pmo ON (pmo.idproductomunic = mt.idpartidaorigen)')
                ->innerJoin('mt.DatProductomunic pmd ON (pmd.idproductomunic = mt.idpartidadestino)')
                ->innerJoin('pmo.DatEstructuraubicacion euo')
                ->innerJoin('pmd.DatEstructuraubicacion eud');
        } else {
            $query->addSelect('mt.idmovtransferencia, mu.idmovubicacion AS idmovubicacion')
                ->from('DatMovtransferencia mt')
                ->innerJoin(
                    'mt.DatEstructuraubicacion euo ON (euo.idestructuraubicacion = mt.idestructuraubicacionorigen)'
                )
                ->innerJoin(
                    'mt.DatEstructuraubicacion eud ON (eud.idestructuraubicacion = mt.idestructuraubicaciondestino)'
                )
                ->innerJoin('eud.DatMovubicacion mu');
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * 
     * @param array $datos
     */
    public function adicionarMovTransferencia($datos)
    {
        $datos['cantidad'] *= ($datos['revertir'] ? -1 : 1);

        $mov = new DatMovimientos();
        $mov->assignIdentifier($datos['idmovimiento']);
        $array = array(
            'cantidad' => $mov->cantidad + $datos['cantidad'],
            'importecontable' => $mov->preciocontable * ($mov->cantidad + $datos['cantidad']),
            'importealternativo' => $mov->precioalternativo * ($mov->cantidad + $datos['cantidad'])
        );
        $mov->synchronizeWithArray($array);
        $mov->save();

        if ($datos['partida']) {
            $destino = $this->getProductoMunicDestino($datos);
            $destino['idpartidadestino'] = $this->adicionarPartida($destino);
            $datos = $destino;
            $id = $datos['idmovtransferenciamunic'] = $this->getIdMovTransferencia($destino);
            $record = new DatMovtransferenciamunic();
            $tabla = 'DatMovtransferenciamunic';
            $llave = 'idmovtransferenciamunic';
        } else {
            $id = $datos['idmovtransferencia'] = $this->getIdMovTransferencia($datos);
            $this->actualizarMovUbicacion($datos);
            $record = new DatMovtransferencia();
            $tabla = 'DatMovtransferencia';
            $llave = 'idmovtransferencia';
        }

        if ($id) {
            $record->assignIdentifier($id);
            $cantidad = $datos['cantidad'] + $record->cantidad;
            if ($cantidad == 0) {
                Doctrine_Query::create()->delete($tabla)->where("{$llave} = ?", $id)->execute();
            }
        }
        $cantidad = (float) $record->cantidad;
        $record->synchronizeWithArray($datos);
        $record->cantidad = $cantidad + $datos['cantidad'];
        $record->save();

        $this->adicionarUbicacionComprometida($datos);
        return array('success' => true);
    }

    /**
     * Metodo para confirmar si el documento tiene productos
     * @params Integer $iddocumento
     *
     * @return boolean
     */
    public function contieneProductos($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(
            array('iddocumento' => implode(',', Zend_Json::decode($iddocumento)))
        );
        if ($datosBusqueda['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    /**
     * Método que permite confirmar si un producto tiene cantidad registrada
     *
     * @param Integer $iddocumento Identificador de documento
     *
     * @return boolean
     */
    public function contieneCantidad($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(
            array('iddocumento' => implode(',', Zend_Json::decode($iddocumento))), true
        );
        $datosBusqueda->addWhere('mov.cantidad = 0');
        if ($datosBusqueda->count() > 0) {
            return false;
        }
        return true;
    }

    /**
     * Metodo para cargar las areas de origen y destino
     * @params Integer $iddeposito
     *
     * @return array
     */
    public function cargarAreasOrigenDestino($iddeposito)
    {
        $datArea = new DatArea();
        return $datArea->obtenerAreasSinSecciones($iddeposito);
    }

    /**
     * Devuelve las areas del deposito.
     * @params numeric $iddeposito
     * @return array
     */
    public function cargarAreasXTipoTransferencia($iddeposito)
    {
        $query = $this->ubicacion->devolverAreasPorDeposito($iddeposito, true);
        $query->addSelect(
                "(SELECT array_to_string(array_agg(tt.idtipotransferencia), ',') FROM NomTipoarea ta "
                . "INNER JOIN ta.NomTipotransferenciaarea tta ON tta.idnomtipoarea = ai.idnomtipoarea "
                . "INNER JOIN tta.NomTipotransferencia tt ON tt.idtipotransferencia = tta.idtipotransferencia "
                . "WHERE ta.idnomtipoarea = ai.idnomtipoarea) AS idtipotransferencia"
            )
            ->innerJoin('a.DatAreainventario ai');
        return $query->fetchArray();
    }

    public function obtenerUbicacionProducto($filtro)
    {
        return $this->ubicacion->cargarUbicacionesProducto($filtro);
    }

    public function obtenerUbicacionDestino($filtro)
    {
        $cfg = new Datconfigubicacion();
        $confubic = $cfg->cargarDatos($this->global->Estructura->idestructura);
        $query = $this->ubicacion->dameUbicacionesPorArea($filtro, true);
        $query->addSelect(
                "coalesce(up.cantidad, 0) AS cantidad, (coalesce(up.cantidad, 0) - coalesce((SELECT sum(uc.cantidad) "
                . "FROM DatUbicacionComprometida uc WHERE uc.idubicacion = up.idubicacion "
                . "AND uc.idproducto = {$filtro['idproducto']} AND uc.estado = 1), 0)) AS disponible"
            )
            ->leftJoin(
                "eu.DatUbicacionproducto up ON (up.idubicacion = eu.idestructuraubicacion "
                . "AND up.idproducto = {$filtro['idproducto']})"
            )
            ->orderBy('eu.idestructuraubicacion');
        if (!$confubic['estructura']) {
            $query->addWhere('(eu.ordender - eu.ordenizq) = 1');
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    /**
     * Devuelve el idmovtransferencia.
     * @params array $datos
     * @return numeric
     */
    private function getIdMovTransferencia($datos)
    {
        if ($datos['idmovtransferencia'] || $datos['idmovtransferenciamunic']) {
            return $datos['idmovtransferencia'] ? $datos['idmovtransferencia'] : $datos['idmovtransferenciamunic'];
        }
        $query = Doctrine_Query::create()->where('m.idmovimiento = ?', $datos['idmovimiento']);
        if ($datos['idpartidaorigen']) {
            $query->select('m.idmovtransferenciamunic AS id')
                ->from('DatMovtransferenciamunic m')
                ->addWhere('m.idpartidaorigen = ?', $datos['idpartidaorigen'])
                ->addWhere('m.idpartidadestino = ?', $datos['idproductomunic']);
        } else {
            $query->select('m.idmovtransferencia AS id')
                ->from('DatMovtransferencia m')
                ->addWhere('m.idestructuraubicacionorigen = ?', $datos['idestructuraubicacionorigen'])
                ->addWhere('m.idestructuraubicaciondestino = ?', $datos['idestructuraubicaciondestino']);
        }
        $mt = $query->fetchOne();
        return $mt->id;
    }

    /**
     * devuelve los datos de la partida destino.
     * @param array $filtro
     * @return array
     */
    private function getProductoMunicDestino($filtro)
    {
        $query = Doctrine_Query::create()
            ->select(
                "pmo.*, pmo.idproductomunic AS idpartidaorigen, pmd.idproductomunic AS idproductomunic, "
                . "0 AS existencia, {$filtro['idestructuraubicacion']} AS idestructuraubicacion, "
                . "{$filtro['idubicacion']} AS idubicacion, {$filtro['estiba']} AS estiba, "
                . "{$filtro['hilera']} AS hilera, 1 AS estado, mpm.idmovproductomunic AS idmovproductomunic, "
                . "{$filtro['idmovimiento']} AS idmovimiento, {$filtro['iddocumento']} AS iddocumento, "
                . "pmc.idproductomuniccomprometido AS idproductomuniccomprometido, "
                . "uc.idubicacioncomprometida AS idubicacioncomprometida, {$filtro['cantidad']} AS cantidad"
            )
            ->from('DatProductomunic pmo')
            ->leftJoin(
                "pmo.DatProductomunic pmd ON (pmd.checksum = pmo.checksum AND pmd.estiba = {$filtro['estiba']} "
                . "AND pmd.hilera = {$filtro['hilera']} "
                . "AND pmd.idestructuraubicacion = {$filtro['idestructuraubicacion']})"
            )
            ->leftJoin(
                "pmd.DatMovproductomunic mpm ON (mpm.idproductomunic = pmd.idproductomunic "
                . "AND mpm.idmovimiento = {$filtro['idmovimiento']})"
            )
            ->leftJoin(
                "pmd.DatProductomunicComprometido pmc ON (pmc.idproductomunic = pmo.idproductomunic "
                . "AND pmc.iddocumento = {$filtro['iddocumento']})"
            )
            ->leftJoin(
                "pmo.DatUbicacionComprometida uc ON (uc.idubicacion = pmo.idestructuraubicacion "
                . "AND uc.idproducto = pmo.idproducto AND uc.iddocumento = {$filtro['iddocumento']})"
            )
            ->where('pmo.idproductomunic = ?', $filtro['idpartidaorigen']);
        return $query->fetchArray()[0];
    }

    /**
     * Adiciona la nueva partida y devuelve el idproductomunic.
     * @param array $datos
     * @param integer $cantidad
     * @return numeric
     */
    private function adicionarPartida($datos)
    {
        $cantidad = $datos['cantidad'];
        $pm = new DatProductomunic();
        if ($datos['idproductomunic']) {
            $pm->assignIdentifier($datos['idproductomunic']);
        }
        $pm->synchronizeWithArray($datos);

        $mpm = new DatMovproductomunic();
        if ($datos['idmovproductomunic']) {
            $mpm->assignIdentifier($datos['idmovproductomunic']);
            $datos['cantidad'] += $mpm->cantidad;
        }
        $mpm->synchronizeWithArray($datos);
        $pm->DatMovproductomunic[] = $mpm;
        $pm->save();

        $pmc = new DatProductomunicComprometido();
        if ($datos['idproductomuniccomprometido']) {
            $pmc->assignIdentifier($datos['idproductomuniccomprometido']);
        }
        $datos['idproductomunic'] = $datos['idpartidaorigen'];
        $datos['cantidad'] = $cantidad + $pmc->cantidad;
        $pmc->synchronizeWithArray($datos);
        $pmc->save();

        return $pm->idproductomunic;
    }

    /**
     * Actualiza los movimientos de la ubicacion.
     * @param array $datos
     * @param boolean $revertir [Opcional]
     * @return boolean
     */
    private function actualizarMovUbicacion($datos)
    {
        $datos['idestructuraubicacion'] = $datos['idestructuraubicaciondestino'];
        if (!$datos['idmovubicacion']) {
            $obj = Doctrine::getTable('DatMovubicacion')
                ->findByDql(
                    'idestructuraubicacion = ? AND idmovimiento = ?',
                    array($datos['idestructuraubicacion'], $datos['idmovimiento'])
                )
                ->getFirst();
            $datos['idmovubicacion'] = $obj->idmovubicacion;
        }
        $record = new DatMovubicacion();
        if ($datos['idmovubicacion']) {
            $record->assignIdentifier($datos['idmovubicacion']);
            $datos['cantidad'] += $record->cantidad;
        }
        $record->synchronizeWithArray($datos);
        $record->save();
        return true;
    }
    
    /**
     * Adiciona la cantidad comprometida para la ubicacion correspondiente.
     * @param array $datos
     * @return boolean
     */
    private function adicionarUbicacionComprometida($datos)
    {
        if (!$datos['idubicacioncomprometida']) {
            $ubicacion = Doctrine::getTable('DatUbicacionComprometida')
                ->findByDql(
                    'idubicacion = ? AND iddocumento = ? AND idproducto = ?',
                    array($datos['idubicacion'], $datos['iddocumento'], $datos['idproducto'])
                )
                ->getFirst();
            $datos['idubicacioncomprometida'] = $ubicacion->idubicacioncomprometida;
        }
        $record = new DatUbicacionComprometida();
        if ($datos['idubicacioncomprometida']) {
            $record->assignIdentifier($datos['idubicacioncomprometida']);
            $datos['cantidad'] += $record->cantidad;
        }
        $record->synchronizeWithArray($datos);
        $record->save();
        return true;
    }

}
