<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatActividadesFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_actividadesfactura');
        $this->hasColumn(
            'idelementofactura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
