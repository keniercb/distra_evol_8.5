<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TransferenciasAlmacenesModel
 *
 * @author kenier
 */
class TransferenciasAlmacenesModel extends DocumentosalidaModel
{
    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatProductoLogistica',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relations);
    }

    /**
     * Contabiliza los productos transferidos al deposito destino.
     * @param numeric $idDocumento
     * @param numeric $idCliente
     */
    public function contabilizarTransferencia($idDocumento, $idCliente)
    {
        $productos = Doctrine_Query::create()
            ->select(
                "p.idproducto, _p.idproducto AS id, p.idindicador, coalesce(_p.cronologia, 1) AS cronologia, "
                . "coalesce(_p.idumedida, p.idumedida) AS idumedida, {$idCliente} AS idestructura, "
                . "coalesce(_p.idcategoria, p.idcategoria) AS idcategoria, coalesce(_p.minimo, p.minimo) AS minimo, "
                . "coalesce(_p.maximo, p.maximo) AS maximo, (coalesce(_p.cantidad, 0) + m.cantidad) AS cantidad, "
                . "coalesce(_p.precio, p.precio) AS precio, "
                . "(((coalesce(_p.cantidad, 0) + m.cantidad) * coalesce(_p.precio, p.precio)) + "
                . "coalesce(_p.importe, 0)) AS importe, "
                . "coalesce(_p.precioalternativo, p.precioalternativo) AS precioalternativo, "
                . "(((coalesce(_p.cantidad, 0) + m.cantidad) * coalesce(_p.precioalternativo, p.precioalternativo)) + "
                . "coalesce(_p.importealternativo, 0)) AS importealternativo, "
                . "coalesce(_p.idclasificacioncontable, p.idclasificacioncontable) AS idclasificacioncontable"
            )
            ->from('DatProductoLogistica p')
            ->innerJoin('p.DatMovimientos m')
            ->leftJoin(
                "p.DatProductoLogistica _p ON (_p.idindicador = p.idindicador AND _p.idestructura = p.idestructura "
                . "AND _p.idestructura = {$idCliente} AND _p.idcategoria = p.idcategoria "
                . "AND _p.idumedida = p.idumedida)"
            )
            ->where('m.iddocumento = ?', $idDocumento)
            ->fetchArray();
        $collection = new Doctrine_Collection('DatProductoLogistica');
        foreach ($productos as $value) {
            $value['idproducto'] = $value['id'];
            $record = new DatProductoLogistica();
            if ($value['idproducto']) {
                $record->assignIdentifier($value['idproducto']);
            }
            $record->synchronizeWithArray($value);
            $collection->add($record);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
    }

}
