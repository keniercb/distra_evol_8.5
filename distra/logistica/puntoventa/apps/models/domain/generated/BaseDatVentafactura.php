<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatVentafactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_ventafactura');
        $this->hasColumn(
            'idventas', 'numeric', null, array(
            'notnull' => false, 'primary' => true
            )
        );
        $this->hasColumn(
            'idfactura', 'numeric', null, array(
            'notnull' => false, 'primary' => true
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
