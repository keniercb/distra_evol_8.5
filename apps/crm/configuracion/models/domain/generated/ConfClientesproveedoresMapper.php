<?php
/**
 * ConfClientesproveedoresMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class ConfClientesproveedoresMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.conf_clientesproveedores');

        $this->hasColumn(
            'idconfclientesproveedores', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => true
            )
        );

        $this->hasColumn(
            'activo', 'numeric', 1, array(
                'type' => 'numeric  ',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'config', 'json', 1, array(
                'type' => 'numeric  ',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}