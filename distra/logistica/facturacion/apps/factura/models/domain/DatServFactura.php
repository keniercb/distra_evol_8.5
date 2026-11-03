<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatServFactura extends BaseDatServFactura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatServFacturaProducto', array('local' => 'idservfactura', 'foreign' => 'idservfactura')
        );
        $this->hasOne(
            'DatDocfactura', array('local' => 'idfactura', 'foreign' => 'idfactura')
        );
        $this->hasOne(
            'NomIndicador', array('local' => 'idservicio', 'foreign' => 'idindicador')
        );
        $array[] = array('cardinalidad' => 'many', 'relation' => 'DatServFactura',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idservicio'));
        UtilesDoctrineModel::tryInyectRelactions(new NomIndicador(), $array);
    }
}
