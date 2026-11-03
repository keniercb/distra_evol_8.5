<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDesgloselemento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_desgloselemento');
        $this->hasColumn(
            'iddesgloselemento', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_desgloselemento')
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idelementofactura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciotarifa', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciotarifaoriginal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciotarifafactura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importe', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
