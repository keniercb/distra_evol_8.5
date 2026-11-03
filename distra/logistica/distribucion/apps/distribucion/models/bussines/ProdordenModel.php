<?php

/**
 * Description of ProdordenModel
 *
 * @author Kenier Cumba Bueno
 */
class ProdordenModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatProdorden',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos, $relations);
        $relations[] = array(
            'cardinalidad' => 'many',
            'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProdorden, $relations);
    }

    public function innerJoinDatProdordenByCampos(
        Doctrine_Query $query, $aliasExterno, $aliasLocal = 'dpo', $filtrosJoin = array()
    )
    {
        $arrayOn = array();
        if ($filtrosJoin['idproducto']) {
            $arrayOn[] = "{$aliasLocal}.idproducto = {$filtrosJoin['idproducto']}";
        }
        if ($filtrosJoin['idcliente']) {
            $arrayOn[] = "{$aliasLocal}.idcliente = {$filtrosJoin['idcliente']}";
        }
        if ($filtrosJoin['idorden']) {
            $arrayOn[] = "{$aliasLocal}.idorden IN ({$filtrosJoin['idorden']})";
        }
        $query->innerJoin("{$aliasExterno}.DatProdorden {$aliasLocal}")
                ->addSelect($this->getSelectStringForQueryProdOrden($aliasLocal));
        if (count($arrayOn)) {
            $query->andWhere(implode(' AND ', $arrayOn));
        }
        if ($filtrosJoin['cumplimiento']) {
            $this->innerJoinDpoCumplimiento($query, $aliasLocal, 'cmpto');
        }
    }

    public function getSelectStringForQueryProdOrden($alias = 'dpo')
    {
        $arrayQueryStrings = array(
            'idprodorden' => '_t.idprodorden',
            'idorden' => '_t.idorden',
            'idproducto' => '_t.idproducto',
            'ordenado' => '_t.cantidad',
            'cancelar' => '_t.cancelar',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    public function innerJoinDpoCumplimiento(Doctrine_Query $query, $aliasPo = 'dpo', $aliasLocal = 'cpmto')
    {
        $query->innerJoin("{$aliasPo}.DatProdordencmpto {$aliasLocal}");
        $query->addSelect($this->getSelectStringForQueryCmpto());
    }

    public function getSelectStringForQueryCmpto($alias = 'cpmto')
    {
        $arrayQueryStrings = array(
            'idprodorden' => '_t.idprodorden',
            'enproceso' => '_t.enproceso',
            'entregado' => '_t.entregado',
            'pendiente' => '_t.pendiente',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    public function getDqlDatProdorden($parametros = array())
    {
        $query = (new Doctrine_Query())
                ->from('DatProdorden dpo')
                ->addSelect($this->getSelectStringForQueryProdOrden('dpo') . ',dpo.idprodorden');
        if ($parametros['cumplimiento']) {
            $this->innerJoinDpoCumplimiento($query, 'dpo', 'cpmto');
        }
        return $query;
    }

    /**
     * idproducto, idcliente, iddocumento
     * @param type $parametros
     */
    public function devolverCantidadPendiente($parametros = array())
    {
        $query = $this->getDqlDatProdorden(array('cumplimiento' => true));
        $this->addQueryFilters($query, '', $parametros);
        if ($parametros['ubicaciones']) {
            $this->addDqlUbicaciones($query, $parametros);
        }
        if ($parametros['ordenar']) {
            $query->orderBy("cantidadoriginal {$parametros['ordenar']}");
        }
        return $query->fetchArray();
    }

    public function addQueryFilters(Doctrine_Query $query, $alias = 'dpo', $parametros = array())
    {
        if ($parametros['idproducto']) {
            $query->andWhere("{$alias}.idproducto = ?", array($parametros['idproducto']));
        }
        if ($parametros['idcliente']) {
            $query->andWhere("{$alias}.idcliente = ?", array($parametros['idcliente']));
        }
        if ($parametros['iddocumento']) {
            if (!is_array($parametros['iddocumento'])) {
                $parametros['iddocumento'] = explode(',', $parametros['iddocumento']);
            }
            $query->andWhereIn("{$alias}.idorden", $parametros['iddocumento']);
        }
    }

    private function addDqlUbicaciones(Doctrine_Query $query, $parametros = array())
    {
        $query->innerJoin('dpo.DatProdordenarea dpoa')
                ->innerJoin('dpoa.DatAreaproducto _dap')
                ->addSelect($this->getSelectStringForQueryProdOrdenarea('dpoa'))
                ->addSelect('dpoa.idprodordenarea, _dap.idarea');
        if ($parametros['idarea']) {
            $query->addWhere('distinct _dap.idarea = ?', array($parametros['idarea']));
        }
    }

    public function getSelectStringForQueryProdOrdenarea($alias = 'dpoa')
    {
        $arrayQueryStrings = array(
            //'no_key' => '_t.idprodordenarea',
            'idprodordenarea' => '_t.idprodordenarea',
            'idareaproducto' => '_t.idareaproducto',
            'ordenadoarea' => '_t.cantidad',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    public function actualizarCumplimientoByParams($parametros = array())
    {
        if (!count($parametros) || !count($parametros['productos'])) {
            return false;
        }        
        $collectionCumplimiento = new Doctrine_Collection('DatProdordencmpto');
        foreach ($parametros['productos'] as $datosMovimiento) {
            $datosMovimiento['cumplimiento'] = true;
            $datosMovimiento['idcliente'] = $parametros['idcliente'];
            $datosMovimiento['iddocumento'] = $datosMovimiento['iddocorigen'];

            if ($datosMovimiento['enprocesoviejo'] > $datosMovimiento['enprocesonuevo']) {
                $datosMovimiento['ordenar'] = 'DESC';
            } else {
                $datosMovimiento['ordenar'] = 'ASC';
            }
            $query = $this->devolverCantidadPendiente($datosMovimiento);
            $enprocesoTotal = $datosMovimiento['enprocesoviejo'] - $datosMovimiento['enprocesonuevo'];
            $entregadoTemp = $datosMovimiento['entregado'];
            if ($parametros['reserva'] && isset($datosMovimiento['entregado'])) {
                $datosMovimiento['entregaranular'] = $datosMovimiento['entregado'];
            }
            foreach ($query as $index => $prodorden) {
                $cumplimiento = new DatProdordencmpto;
                $cumplimiento->assignIdentifier($prodorden['idprodorden']);
                $datosMovimiento['entregado'] = 0;
                if ($entregadoTemp > 0) {
                    if ($entregadoTemp > $cumplimiento->enproceso) {
                        $datosMovimiento['entregado'] = $cumplimiento->enproceso;
                        $entregadoTemp -= $cumplimiento->enproceso;
                    } else {
                        $datosMovimiento['entregado'] = $entregadoTemp;
                        $entregadoTemp -= $datosMovimiento['entregado'];
                    }
                } else if ($entregadoTemp < 0) {
                    if (($entregadoTemp + $cumplimiento->entregado) >= 0) {
                        $cumplimiento->pendiente += abs($entregadoTemp);
                        $cumplimiento->entregado -= abs($entregadoTemp);
                        $entregadoTemp -= $entregadoTemp;
                    } else {
                        $cumplimiento->pendiente += $cumplimiento->entregado;
                        $cumplimiento->entregado -= $cumplimiento->entregado;
                        $entregadoTemp += $cumplimiento->entregado;
                    }
                }
                if ($index == (count($query) - 1)) {
                    $enproceso = $enprocesoTotal;
                    $ultimo = true;
                } else if ($enprocesoTotal > 0) {
                    if (($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enprocesoTotal)) < 0) {
                        $enproceso = $cumplimiento->enproceso;
                    } else {
                        $enproceso = $enprocesoTotal;
                    }
                } else {
                    if (($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enprocesoTotal) +
                            $cumplimiento->entregado) >
                            $prodorden['ordenado']) {
                        $enproceso = -$cumplimiento->pendiente;
                    } else {
                        $enproceso = $enprocesoTotal;
                    }
                }
                $this->modificarCumplimiento(
                    $cumplimiento, $datosMovimiento, $enprocesoTotal, $enproceso, $prodorden, $ultimo
                );
                $collectionCumplimiento->add($cumplimiento);
            }

            if (class_exists('PedidoService')) {
                $pedidoService = new PedidoService();
                $objDistibucionPedido = new DatDistribucionpedido();
                $datosPedido = $objDistibucionPedido->getPedidoByIdDocumento(
                    array('iddocumento' => $datosMovimiento['iddocorigen'])
                );
                if (count($datosPedido) > 0) {
                    foreach ($datosPedido as $objPedido) {
                        $params = array(
                            'idpedido' => $objPedido['idpedido'], 'idproducto' => $objPedido['idindicador'],
                            'salida' => true,
                            'estadonuevo' => ($this->entregadoTotalPedido($objPedido)[0]['entregado'] +
                            $datosMovimiento['entregado'] == $objPedido['pedida']) ? 4 : 2
                        );
                        $pedidoService->aprobarDistribucion($params);
                    }
                }
            }
            if ($parametros['reserva']) {
                $comunReserva = new ComunReservaService();
                $datosMovimiento['idcliente'] = $parametros['idcliente'];
                $comunReserva->actualizarDatosCumplimiento($datosMovimiento, 3);
            }
        }
        if ($collectionCumplimiento->count()) {
            $collectionCumplimiento->save();
        }
        return true;
    }

    public function modificarCumplimiento(
    &$cumplimiento, &$datosMovimiento, &$enprocesoTotal, &$enproceso, $prodorden, &$ultimo
    )
    {
        if ($ultimo || ($cumplimiento->enproceso - ($datosMovimiento['entregado'] + $enproceso)) >= 0) {
            $enprocesoTotal -= $enproceso;
            $cumplimiento->enproceso -= ($datosMovimiento['entregado'] + $enproceso);
            $cumplimiento->entregado += $datosMovimiento['entregado'];
            $pendienteTemp = $cumplimiento->pendiente + $enproceso;
            if ($pendienteTemp < 0) {
                $cumplimiento->pendiente = 0;
            } else {
                if (($cumplimiento->enproceso + $cumplimiento->entregado + $pendienteTemp) >= $prodorden['ordenado']
                ) {
                    $pendienteTemp = $prodorden['ordenado'] - ($cumplimiento->enproceso + $cumplimiento->entregado);
                    $cumplimiento->pendiente = ($pendienteTemp > 0) ? $pendienteTemp : 0;
                } else {
                    $cumplimiento->pendiente += $enproceso;
                }
            }
        }
    }

    public function entregadoTotalPedido($parametros)
    {
        $entregado = "coalesce((SELECT sum(pcto1.entregado) FROM DatProdordencmpto pcto1
            LEFT JOIN pcto1.DatProdorden dpo1
            LEFT JOIN dpo1.DatDistribucion dd1
            LEFT JOIN dd1.DatDistribucionpedido ddp1
            LEFT JOIN ddp1.DatPedido dp1
            LEFT JOIN dp1.DatProductopedido dpp1
            LEFT JOIN dpo1.DatProductoLogistica p1
            WHERE ddp1.idpedido = {$parametros['idpedido']} and p1.idindicador = dpp1.idproducto
            and dpp.idproducto = p1.idindicador
            GROUP BY dp1.iddocumento),0) as entregado";
        $query = Doctrine_Query::create()
                ->select(
                    "dpp.idproductopedido,
                dpp.cantidad as cantidad"
                )
                ->addSelect($entregado)
                ->from('DatProductopedido dpp')
                ->innerJoin("dpp.DatPedido dp")
                ->leftJoin("dp.DatDistribucionpedido ddp")
                ->leftJoin("ddp.DatDistribucion dd")
                ->leftJoin("dd.DatProdorden dpo")
                ->leftJoin("dpo.DatProdordencmpto pcto")
                ->where('dpp.idpedido = ?', array($parametros['idpedido']))
                ->addWhere('dpp.idproducto = ?', array($parametros['idindicador']));
        return $query->fetchArray();
    }

}
