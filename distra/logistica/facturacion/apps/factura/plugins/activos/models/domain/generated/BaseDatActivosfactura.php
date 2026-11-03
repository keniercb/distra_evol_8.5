<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatActivosfactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_activosfactura');
        $this->hasColumn(
            'idelementofactura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idtipoprecio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idproducto', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'referencia', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'referenciaalt', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'mediatotal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
