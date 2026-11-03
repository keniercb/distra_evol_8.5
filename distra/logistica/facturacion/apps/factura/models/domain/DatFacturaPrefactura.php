<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatFacturaPrefactura extends BaseDatFacturaPrefactura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
    }

    public function getJoinPrefacturaFactura(Doctrine_Query $query, $alias = 'df', $aliasP = 'pf')
    {
        $query->leftJoin("{$alias}.DatFacturaPrefactura {$aliasP}");
        $query->addSelect(
            "{$aliasP}.reservaprecio as reservaprecio,{$aliasP}.reservadisponible as reservadisponible"
        );
        return $query;
    }
}
