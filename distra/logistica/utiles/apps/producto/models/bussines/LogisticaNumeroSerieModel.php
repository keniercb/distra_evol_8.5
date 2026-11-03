<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tool | Templates
 * and open the template in the editor.
 */

/**
 * Description of NumeroSerieModel
 *
 * @author Kenier
 */
class LogisticaNumeroSerieModel extends BaseModel  
{
    /**
     * @var UtilesubicacionService
     */
    private $ubicacion;

    public function __construct()
    {
        parent::__construct(true);
        $this->ubicacion = new UtilesubicacionService();
    }

    /**
     * Incluye los datos de numero de serie en la consulta.
     * @param Doctrine_Query $query
     */
    private function selectNroSerie($query)
    {
        $query->addSelect(
            "ns.idnroserie AS idnroserie, ns.idproducto AS idproducto, ns.nroserie AS nroserie, ns.numero AS numero, "
            . "ns.idestructuraubicacion AS idestructuraubicacion, ns.idconservacion AS idconservacion, "
            . "ns.annofabricacion AS annofabricacion, ns.annoconservacion AS annoconservacion, ns.estado AS estado, "
            . "(eu.codigo || '-' || eu.descripcion) AS descripcion, nc.denominacion AS tipoconservacion, pl.idindicador AS idindicador, "
            . "pl.idestructura AS idestructuraop, pl.idestructuracomun AS idestructuracomun, ni.codigo AS codigo, "
            . "ni.denominacion AS denominacion, ma.idmarca AS idmarca, ma.denominacion AS marca, "
            . "mo.idmodelo AS idmodelo, mo.denominacion AS modelo, ns.nropieza AS nropieza"
        );
    }

    /**
     * Devuelve los numeros de serie.
     * @param array $filtro
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function cargarNroSerie($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()->where('ns.idproducto = ?', $filtro['idproducto']);
        if ($filtro['idproducto'] && $filtro['allnroserie']) {
            $query->select('ns.idnroserie')->from('DatNroserie ns');
            if ($filtro['idmovimiento']) {
                $query->select('mns.idmovnumeroserie, mns.idmovimiento')
                    ->from('DatMovnroserie mns')->innerJoin('mns.DatNroserie ns');
            }
        } if ($filtro['idproducto'] && $filtro['existencia']) {
            $query->select('ns.idnroserie')->from('DatNroserie ns');
        } else {
            $query->select('mns.idmovnumeroserie, mns.idmovimiento')
                ->from('DatMovnroserie mns')->innerJoin('mns.DatNroserie ns')
                ->where('mns.idmovimiento = ?', $filtro['idmovimiento']);
        }
        $this->selectNroSerie($query);
        $query->innerJoin('ns.DatProductoLogistica pl')
            ->innerJoin('pl.NomIndicador ni')
            ->leftJoin('ns.NomMarca ma')
            ->leftJoin('ns.NomModelo mo')
            ->innerJoin('ns.NomConservacion nc')
            ->innerJoin('ns.DatEstructuraubicacion eu')
            ->orderBy('ns.annofabricacion,ns.idnroserie');
        $this->filtroNroSerie($query, $filtro);
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Incluye los filtros generales de numero de serie.
     * @param Doctrine_Query $query
     * @param array $filtro
     */
    private function filtroNroSerie($query, $filtro)
    {
        if ($filtro['criterio']) {
            $query->addWhere("ns.nroserie ILIKE '%{$filtro['criterio']}%'");
        }
        if ($filtro['nroserie']) {
            $query->addWhere("ns.nroserie ILIKE '%{$filtro['nroserie']}%'");
        }
        if ($filtro['numero']) {
            $query->addWhere("ns.numero ILIKE '%{$filtro['numero']}%'");
        }
        if ($filtro['idestructuraubicacion']) {
            $query->addWhere('ns.idestructuraubicacion = ?', $filtro['idestructuraubicacion']);
        }
        if ($filtro['annofabricacion']) {
            $query->addWhere('ns.annofabricacion = ?', $filtro['annofabricacion']);
        }
        if ($filtro['annoconservacion']) {
            $query->addWhere('ns.annoconservacion = ?', $filtro['annoconservacion']);
        }
        if ($filtro['idconservacion']) {
            $query->addWhere('ns.idconservacion = ?', $filtro['idconservacion']);
        }
        if ($filtro['existencia']) {
            $query->addWhere("ns.estado = 2 OR ns.estado = 3");
        }
        if ($filtro['estado']) {
            $query->addWhere('ns.estado = ?', $filtro['estado']);
        }
        if ($filtro['idmarca']) {
            $query->addWhere('ns.idmarca = ?', $filtro['idmarca']);
        }
        if ($filtro['idmodelo']) {
            $query->addWhere('ns.idmodelo = ?', $filtro['idmodelo']);
        }
        if ($filtro['nropieza']) {
            $query->addWhere('ns.nropieza = ?', $filtro['nropieza']);
        }
        if ($filtro['idpadre']) {
            $query->innerJoin('ns.DatMovnroserie mns')->innerJoin('mns.DatMovimientos m')
                ->addWhere('m.iddocumento = ? AND ns.estado = 5', $filtro['idpadre']);
            if ($filtro['iddocumento']) {
                $query->addWhere(
                    'mns.idnroserie NOT IN (SELECT mns2.idnroserie FROM DatMovnroserie mns2 '
                    . 'INNER JOIN mns2.DatMovimientos m2 WHERE m2.iddocumento = ?)', array($filtro['iddocumento'])
                );
            }
        } elseif ($filtro['salida']) {
            $query->addWhere('ns.estado = 2 AND ns.nroserie IS NOT NULL');
        }
    }

    /**
     * Adiciona los numeros de serie aperturados y recepcionados.
     * @param array $datos
     * @param boolean $actualizar [Opcional] Determina si actualiza el movimiento.
     * @return boolean
     */
    public function adicionarNumeroserie($datos, $actualizar = true)
    {
        if ($datos['idaplicar']) {
            $query = new Doctrine_Query();
            $query->update('DatNroserie');
            foreach ($datos['series'] as $value) {
                if ($value['idmovnumeroserie'] == $datos['idaplicar']) {
                    if ($datos['aplicar'][0]['annofab'] == 1 && $value['annofabricacion']) {
                        $query->set('annofabricacion', $value['annofabricacion']);
                    }
                    if ($datos['aplicar'][0]['descrip'] == 1 && $value['idestructuraubicacion']) {
                        $query->set('idestructuraubicacion', $value['idestructuraubicacion']);
                    }
                    if ($datos['aplicar'][0]['num'] == 1 && $value['numero']) {
                        $query->set('numero', $value['numero']);
                    }
                    if ($datos['aplicar'][0]['annocons'] == 1 && $value['annoconservacion']) {
                        $query->set('annoconservacion', $value['annoconservacion']);
                    }
                    if ($datos['aplicar'][0]['tipoconser'] == 1 && $value['idconservacion']) {
                        $query->set('idconservacion', $value['idconservacion']);
                    }
                    $sub = "idnroserie IN (SELECT m.idnroserie FROM DatMovnroserie m WHERE m.idmovimiento = {$value['idmovimiento']})";
                    $query->where("idproducto = {$value['idproducto']} AND {$sub}")->execute();
                }
            }
        } else {
            $collection = new Doctrine_Collection('DatNroserie');
            foreach ($datos['series'] as $value) {
                $this->getIdNroSerie($value['nroserie'], $value['idproducto'], $value['idnroserie']);
                $nroSerie = new DatNroserie();
                $nroSerie->assignIdentifier($value['idnroserie']);
                $nroSerie->synchronizeWithArray($value);
                $collection->add($nroSerie);
            }
            if ($collection->count() > 0) {
                $collection->save();
                return true;
            }
            if ($datos['cantidad']) {
                $this->generarNrosSerie($datos);
            } else {
                $datos['cantidad'] = 1;
                $nroSerie = new DatNroserie();
                $datos['idnroserie'] = $this->getIdNroSerie($datos['nroserie'], $datos['idproducto']);
                if ($datos['idnroserie']) {
                    $nroSerie->assignIdentifier($datos['idnroserie']);
                }
                $nroSerie->synchronizeWithArray($datos);
                $movNroSerie = new DatMovnroserie();
                $movNroSerie->synchronizeWithArray($datos);
                $nroSerie->DatMovnroserie = $movNroSerie;
                $nroSerie->save();
            }
            if ($actualizar) {
                $this->actualizarMovimiento($datos);
            }
            $this->registrarDiferencia($datos);
            $this->actualizarProductoCmpto($datos);
        }
        return true;
    }

    /**
     * Adiciona los numeros de serie salientes y devueltos.
     * @param array $datos
     * @param boolean $afecta [Opcional] Determina si afecta la disponibilidad del producto.
     * @return array
     */
    public function addMovNroSerie($datos, $afecta = false)
    {
        $collection = new Doctrine_Collection('DatMovnroserie');
        foreach ($datos as $value) {
            $objMovSerie = new DatMovnroserie();
            $idproducto = $value['idproducto'];
            $idmovimiento = $value['idmovimiento'];
            $idnroserie[] = $value['idnroserie'];
            $objMovSerie->synchronizeWithArray($value);
            $collection->add($objMovSerie);
        }
        if ($collection->count() > 0) {
            $collection->save();
            Doctrine_Query::create()->update('DatNroserie')->set('estado', 3)->where('estado = 2')
                ->whereIn('idnroserie', $idnroserie)
                ->execute();
            $array = array('idproducto' => $idproducto, 'idmovimiento' => $idmovimiento, 'cantidad' => count($datos));
            $this->actualizarMovimiento($array, $afecta);
            $this->actualizarCumplimientoSalida($array);
            $this->actualizarCumplimientoFactura($datos, $idmovimiento);
        }
        return array('success' => true);
    }

    /**
     * Elimina los numeros de serie.
     * @param array $idmovnroserie
     * @param boolean $afecta [Opcional] Determina si afecta la disponibilidad del producto.
     * @return array
     */
    public function eliminarNumeroserie($idmovnroserie, $afecta = false)
    {
        $producto = Doctrine_Query::create()
            ->select(
                'm.idproducto AS idproducto, m.idmovimiento AS idmovimiento, count(ns.idmovnumeroserie) AS cantidad'
            )
            ->from('DatMovnroserie ns')
            ->innerJoin('ns.DatMovimientos m')
            ->whereIn('ns.idmovnumeroserie', $idmovnroserie)
            ->groupBy('m.idmovimiento')
            ->fetchArray();
        $str = implode(',', $idmovnroserie);
        $sub = "idnroserie IN (SELECT m.idnroserie FROM DatMovnroserie m WHERE m.idmovnumeroserie IN ({$str}))";
        Doctrine_Query::create()->update('DatNroserie')->set('estado', 2)->where("estado = 3 AND {$sub}")->execute();
        $sql = "DELETE FROM mod_loginventario.dat_nroserie ns WHERE coalesce((SELECT count(mns.idmovnumeroserie) "
            . "FROM mod_loginventario.dat_movnroserie mns WHERE mns.idnroserie = ns.idnroserie), 0) = 1 "
            . "AND ns.idnroserie IN (SELECT m.idnroserie FROM mod_loginventario.dat_movnroserie m "
            . "WHERE m.idmovnumeroserie IN ({$str}))";
        Doctrine_Manager::connection()->fetchAll($sql);
        Doctrine_Query::create()->delete('DatMovnroserie')->whereIn('idmovnumeroserie', $idmovnroserie)->execute();
        $datos = array('idmovimiento' => $producto[0]['idmovimiento'], 'cantidad' => count($idmovnroserie));
        $this->actualizarMovimiento($datos, $afecta, true);
        $this->registrarDiferencia($datos);
        $this->actualizarCumplimientoSalida($producto[0], true);
        $this->actualizarCumplimientoFactura($producto, $producto[0]['idmovimiento'], true);
        return array('success' => true);
    }
    
    /**
     * Elimina los numeros de serie de un documento o movimientos de entrada eliminados.
     * @param numeric $iddocumento
     * @param array $idmovimientos
     * @param boolean $esSalida [Opcional]
     * @return boolean
     */
    public function eliminarNrosCancelados($iddocumento, $idmovimientos, $esSalida = false)
    {
        if (is_array($idmovimientos) && count($idmovimientos) > 0) {
            $str = implode(',', $idmovimientos);
            $sub .= "WHERE mns.idmovimiento IN ({$str})";
        } else {
            $sub .= "INNER JOIN mod_logistica.dat_movimiento m ON m.idmovimiento = mns.idmovimiento "
                . "WHERE m.iddocumento = {$iddocumento}";
        }
        $accion = "DELETE FROM";
        if ($esSalida) {
            $accion = "UPDATE";
            $set = "SET estado = 2";
            $where = "AND estado = 3";
        }
        $sql = "{$accion} mod_loginventario.dat_nroserie ns {$set} WHERE idnroserie IN (SELECT mns.idnroserie "
            . "FROM mod_loginventario.dat_movnroserie mns {$sub}) {$where}";
        $eliminados = Doctrine_Manager::connection()->fetchAll($sql);
        return count($eliminados) > 0;
    }

    /**
     * Genera varios numeros de serie simultaneamente.
     * @param array $datos
     * @return boolean
     */
    private function generarNrosSerie($datos)
    {
        $sql = "select mod_loginventario.f_adiccionarnroserie({$datos['idproducto']}, "
            . "{$datos['idestructuraubicacion']}, '{$datos['annofabricacion']}', {$datos['idconservacion']}, "
            . "'{$datos['annoconservacion']}', {$datos['cantidad']}, {$datos['idmovimiento']}, '{$datos['numero']}');";
        $connexion = Zend_Registry::get('conexion');
        $connexion->execute($sql);
        return true;
    }

    /**
     * Devuelve los años de fabricación o conservación del númenro de serie del producto en el depósito
     * (tipo 1: "annofabricacion" tipo 2: "annoconservacion").
     * @param array $filtro
     * @return array
     */
    public function cargarAnnosNroSerie($filtro)
    {
        $select = $filtro['tipo'] == 1 ? "annofabricacion" : "annoconservacion";
        $query = Doctrine_Query::create()
            ->select("ns.idnroserie, ns.{$select} AS denominacion")
            ->from('DatNroserie ns')
            ->innerJoin('ns.DatProductoLogistica p')
            ->where(
                "ns.idproducto = ? AND p.idestructura = ? AND ns.{$select} IS NOT NULL AND ns.{$select} <> ''",
                array($filtro['idproducto'], $filtro['idestructura'])
            )
            ->orderBy("ns.{$select}");
        return array('datos' => $query->fetchArray(), 'total' => $query->count());
    }

    /**
     * Devuelve el identificador del numero de serie (idnroserie).
     * @param string $nroserie
     * @param numeric $idproducto
     * @param numeric $idnroserie [Opcional]
     * @return numeric
     * @throws LogisticaException Excepcion que lanza en caso de que exista el numero de serie.
     */
    private function getIdNroSerie($nroserie, $idproducto, $idnroserie)
    {
        $query = Doctrine_Query::create()
            ->select('ns.idnroserie, mns.idmovnumeroserie AS idmovnumeroserie, mns.idmovimiento AS idmovimiento')
            ->from('DatNroserie ns')
            ->innerJoin('ns.DatMovnroserie mns')
            ->innerJoin('mns.DatMovimientos m')
            ->where('ns.nroserie = ? AND ns.idproducto = ? AND ns.estado = 4', array($nroserie, $idproducto));
        if ($idnroserie) {
            $query->addWhere('ns.idnroserie <> ?', $idnroserie);
        }
        if ($query->count() > 0) {
            throw new LogisticaException('LOG_LB_NroSe_002');
        }
        $query->where(
            "ns.nroserie = ? AND ns.idproducto = ? AND ((ns.estado = 5 AND m.cronologia = 0 AND m.signo = '+') "
            . "OR ns.estado <> 5)", array($nroserie, $idproducto)
        );
        if ($idnroserie) {
            $query->addWhere('ns.idnroserie <> ?', $idnroserie);
        }
        if ($query->count() > 0) {
            throw new LogisticaException('LOG_LB_NroSe_001');
        }
        $nro = $query->fetchArray();
        return count($nro) == 1 ? $nro[0]['idnroserie'] : $idnroserie;
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
     * Actualiza el cumplimiento de entrega por concepto de devolución de faltantes (Ajuste).
     * @param array $datos
     * @return boolean
     */
    private function actualizarProductoCmpto($datos)
    {
        if (LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_RESERVA)) {
            $mov = Doctrine::getTable('DatMovimientos')->find($datos['idmovimiento']);
            $array = array('iddocumento' => $mov->iddocumento, 'idmovimientos' => array($mov->idmovimiento));
            $recepcion = new RecepcionService();
            $recepcion->actualizarProductoCmpto($array);
        }
        return true;
    }

    /**
     * Actualiza el estado de los numeros de serie de un documento.
     * @param numeric $iddocumento
     * @param boolean $cancelar
     * @param boolean $baja
     * @return boolean
     */
    public function actualizarEstadoNumeroSerie($iddocumento, $cancelar = false, $baja = false)
    {
        $flag = $cancelar ? '1' : '0';
        $baja = $baja ? '1' : '0';
        $sql = "UPDATE dat_nroserie ns SET estado = (SELECT (CASE WHEN (m2.signo = '+' AND {$flag} = '0') "
            . "OR (m2.signo = '-' AND {$flag} = '1') THEN 2 WHEN m2.signo = '-' AND {$baja} = '1' THEN 4 ELSE 5 END) "
            . "FROM dat_movimiento m2 INNER JOIN dat_movnroserie mns2 ON mns2.idmovimiento = m2.idmovimiento "
            . "WHERE ns.idnroserie = mns2.idnroserie AND m2.iddocumento = {$iddocumento} Limit 1) "
            . "WHERE ns.idnroserie IN (SELECT mns.idnroserie FROM dat_movnroserie mns INNER JOIN dat_movimiento m "
            . "ON (m.idmovimiento = mns.idmovimiento) WHERE m.iddocumento = {$iddocumento})";
        Doctrine_Manager::connection()->fetchAll($sql);
        $this->ubicarOrDesubicarProductos($iddocumento, !$cancelar);
        return true;
    }

    /**
     * Ubica o desubica los numeros de serie.
     * @param numeric $iddocumento
     * @param boolean $ubicar [Opcional]
     * @return boolean
     */
    private function ubicarOrDesubicarProductos($iddocumento, $ubicar = false)
    {
//        $query = Doctrine_Query::create()
//            ->select(
//                'count(mns.idnroserie) AS cantidad, ns.idestructuraubicacion AS idubicacion, '
//                . 'ns.idproducto AS idproducto, m.signo AS signo'
//            )
//            ->from('DatMovnroserie mns')
//            ->innerJoin('mns.DatNroserie ns')
//            ->innerJoin('mns.DatMovimientos m')
//            ->where('m.iddocumento = ?', array($iddocumento))
//            ->groupBy('ns.idestructuraubicacion, ns.idproducto, mns.idmovimiento, m.signo');
//        $mov = $query->fetchArray();
        $sql = "SELECT count(d.idnroserie) AS cantidad, m.idestructuraubicacion AS idubicacion, m.idproducto, m2.signo "
            . "FROM mod_loginventario.dat_movnroserie d INNER JOIN mod_loginventario.dat_nroserie m "
            . "ON d.idnroserie = m.idnroserie INNER JOIN mod_logistica.dat_movimiento m2 "
            . "ON d.idmovimiento = m2.idmovimiento WHERE m2.iddocumento = {$iddocumento} "
            . "GROUP BY m.idestructuraubicacion, m.idproducto, d.idmovimiento, m2.signo";
        $mov = Doctrine_Manager::connection()->fetchAll($sql);
        foreach ($mov as $value) {
            if (($value['signo'] == LogisticaMovimientoModel::SIGNO_MOV_SUMA && $ubicar) ||
                ($value['signo'] == LogisticaMovimientoModel::SIGNO_MOV_RESTA && !$ubicar)) {
                $this->ubicacion->ubicarProducto($value);
            } else {
                $resp = $this->ubicacion->cargarUbicacionesProducto($value, true)->fetchArray();
                $array[0] = array(
                    'cantidad' => $value['cantidad'], 'idareaproducto' => $resp[0]['idareaproducto'],
                    'idubicacionproducto' => $resp[0]['idubicacionproducto']
                );
                $this->ubicacion->desubicarProducto($array);
            }
        }
        return true;
    }

    public function crearExcelNroSerie($filtro)
    {
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarNroSerie($filtro, true)->fetchArray();
        foreach ($datos as $key => $nro) {
            $deposito = $this->estructuraHelper->getEstructura($nro['idestructuraop']);
            $datos[$key]['deposito'] = $deposito[0]->denominacion;
            $estructura = $this->estructuraHelper->getEstructura($nro['idestructuracomun']);
            $datos[$key]['estructura'] = $estructura[0]->denominacion;
            $datos[$key]['codigoestructura'] = $estructura[0]->codigo;
        }
        $columns = array(
//            array('header' => 'C&oacute;digo de la Entidad ', 'dataIndex' => 'codigoestructura'),
            array('header' => 'Entidad', 'dataIndex' => 'codigoestructura'/* , estructura */),
            array('header' => 'Dep&oacute;sito', 'dataIndex' => 'deposito'),
            array('header' => 'C&oacute;digo', 'dataIndex' => 'codigo'),
            array('header' => 'Denominaci&oacute;n', 'dataIndex' => 'denominacion'),
            array('header' => 'Ubicaci&oacute;n', 'dataIndex' => 'descripcion'),
            array('header' => 'N&uacute;mero', 'dataIndex' => 'numero'),
            array('header' => 'Nro de serie', 'dataIndex' => 'nroserie'),
            array('header' => 'Año de fabricaci&oacute;n', 'dataIndex' => 'annofabricacion'),
            array('header' => 'Año', 'dataIndex' => 'annoconservacion'),
            array('header' => 'Situaci&oacute;n', 'dataIndex' => 'tipoconservacion') /*,
           array('header' => 'Marca', 'dataIndex' => 'marca'),
            array('header' => 'Modelo', 'dataIndex' => 'modelo'),
            array('header' => 'N&uacute;nmero de pieza', 'dataIndex' => 'nropieza')*/
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return '/logistica/utiles/producto/' . $fichero;
    }

    /**
     * Verifica si los números de serie no está repetido y no han sido dado de baja.
     * @param array $params
     * @return boolean
     * @throws LogisticaException
     */
    public function validarExistenciaNroSerieModel($params)
    {
        $estado = isset($params['entrada']) ? [1, 2, 3] : [4];
        $query = Doctrine_Query::create()
            ->from('DatNroserie ns')
            ->where('ns.nroserie = ?', $params['nroserie'])
            ->whereIn('ns.estado', $estado);
        if ($estado[0] == 4 && $query->count() > 0) {
            throw new LogisticaException('LOG_LB_NroSe_002');
        }
        if ($estado[0] != 4) {
            $query->addWhere(
                'ns.idnroserie IN (SELECT mns.idnroserie FROM DatMovnroserie mns INNER JOIN mns.DatMovimientos m '
                . 'ON m.idmovimiento = mns.idmovimiento INNER JOIN m.DatDocumento d ON d.iddocumento = m.iddocumento '
                . 'WHERE d.estado IN (1, 2))'
            );
        }
        return $query->count() == 0;
    }

    /**
     * Actualiza el cumplimiento del documento de salida que contiene el movimiento.
     * @param array $datos
     * @param boolean $borrar [Opcional]
     * @return array
     */
    private function actualizarCumplimientoSalida($datos, $borrar = false)
    {
        $doc = Doctrine_Query::create()->select(
                "e.iddocumento, e.origen, array_to_string(array_agg(dp.idpadre), ',') AS idpadres, "
                . "d.idestructuracomun AS idestructuracomun, dc.idcliente AS idcliente, m.idproducto AS idproducto"
            )
            ->from('DatEntrega e')->innerJoin('e.DatDocumento d')->innerJoin('d.DatDocumentoCliente dc')
            ->innerJoin('d.DatMovimientos m')->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
            ->where('m.idmovimiento = ?', $datos['idmovimiento'])
            ->groupBy('e.iddocumento, d.iddocumento, dc.iddocumentocliente, m.idproducto')
            ->fetchArray();
        $salida = new DocumentosalidaService();
        if ($doc[0]['origen'] == 1) {
            // Actualiza el cumplimiento de entrega de la orden de despacho.
            $salida->actualizarCumplimientoProdOrden($doc[0], $datos['cantidad'], $borrar);
        } elseif ($doc[0]['origen'] == 2) {
            // Actualiza el cumplimiento de la solicitid de entrega del producto.
            $salida->actualizarCumplimientoSolEntrega($doc[0], $datos['cantidad'], $borrar);
        } else {
            // Actualiza el cumplimiento de devolucion del producto.
            $doc = Doctrine_Query::create()
                ->select("d.iddocumento, m.idmovimiento AS idmovimiento")
                ->from('DatDocumento d')->innerJoin('d.DatMovimientos m')
                ->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
                ->where('m.idmovimiento = ?', $datos['idmovimiento'])
                ->fetchArray();
            if (count($doc) > 0) {
                $devolucion = new DevolucionService();
                $devolucion->actualizarProductoCmplto($doc[0]['iddocumento'], false, array($datos['idmovimiento']));
            }
        }
        return true;
    }

    private function actualizarCumplimientoFactura($params, $idmovimiento, $borrar = false)
    {
        $cantproductos = isset($params[0]['cantidad']) ? $params[0]['cantidad'] : count($params);
        $doc = Doctrine_Query::create()
            ->select(
                "e.idfactura, array_to_string(array_agg(dp.idpadre), ',') AS idpadres, " .
                "d.idestructuracomun AS idestructuracomun, dc.idcliente AS idcliente, m.idproducto as idproducto, " .
                "m.cantidad as cantidad"
            )
            ->from('DatDocfactura e')
            ->innerJoin('e.DatDocumento d')
            ->innerJoin('d.DatDocumentoCliente dc')
            ->innerJoin('d.DatMovimientos m')
            ->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
            ->where('m.idmovimiento = ?', $idmovimiento)
            ->groupBy('e.idfactura, d.iddocumento, dc.iddocumentocliente, m.idproducto, m.cantidad')
            ->fetchArray();
        if (count($doc) > 0) {
            $cantidadTotal = ($borrar) ? $doc[0]['cantidad'] - $cantproductos : $doc[0]['cantidad'] + $cantproductos;
            $datosCmpto = array();
            $arrayProductos = array(
                'idproducto' => $doc[0]['idproducto'], 'iddocorigen' => explode(',', $doc[0]['idpadres']),
                'enprocesonuevo' => $cantidadTotal, 'enprocesoviejo' => $doc[0]['cantidad'], 'entregado' => 0);
            $datosCmpto['productos'][0] = $arrayProductos;
            $datosCmpto['idcliente'] = $doc[0]['idcliente'];
            if (count($datosCmpto) > 0) {
                $prodOrdenModel = new ProdordenModel();
                $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
            }
        }
        return true;
    }

    //Facturacion
    /**
     * Devuelve los numeros de serie disponible.
     * @param array $filtro
     * @return array
     */
    public function getNumerosSeriesDisponibles($filtro)
    {
        $numeros = Doctrine_Query::create()
            ->select('ns.idnroserie as idnroserie')
            ->from('DatNroserie ns')
            ->where('ns.idproducto = ? AND ns.estado = 2 AND ns.nroserie IS NOT NULL', $filtro['idproducto'])
            ->limit($filtro['autorizado'])
            ->fetchArray();
        return $numeros;
    }

    /**
     * Cambia el estado del numero de serie.
     * @param numeric $idmovimiento
     */
    public function cambiaEstadoFacturacion($idmovimiento)
    {
        Doctrine_Query::create()
            ->update('DatNroserie')
            ->set('estado', 2)
            ->where("idnroserie IN (SELECT m.idnroserie FROM DatMovnroserie m WHERE m.idmovimiento = {$idmovimiento})")
            ->execute();
    }

    public function getNumerosEnDoc($idsdocumentos)
    {
        $documentos = implode(',', $idsdocumentos);
        $numeros = Doctrine_Query::create()
            ->select('mv.idnroserie as idnroserie')
            ->from('DatMovnroserie mv')
            ->where(
                "mv.idmovimiento IN (SELECT mov.idmovimiento FROM DatMovimientos mov "
                . "WHERE mov.iddocumento IN ({$documentos}))"
            )
            ->fetchArray();
        return $numeros;
    }
    //Fin Facturacion
}