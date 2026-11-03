<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatProdFactura extends BaseDatProdFactura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatProdFactura',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        UtilesDoctrineModel::tryInyectRelactions(new DatMovimientos(), $array);
    }

    public function getProdFactura($movimiento)
    {
        $obj = Doctrine::getTable('DatProdFactura')
            ->findByDql(
                'idmovimiento = ?', array($movimiento)
            );
        return $obj;
    }
}
