<?php

/**
 * BaseConfFirmaDocumento
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class BaseConfFirmaDocumento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_firmadocumento');

        $this->hasColumn(
            'idfirmadocumento', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true,
                'sequence' => 'mod_rrhhmaestro.sec_firmadocumento'
            )
        );

        $this->hasColumn(
            'iddocumentofirma', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'idtipofirma', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'idpersona', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'identidad', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'orden', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false,
            )
        );


    }
}