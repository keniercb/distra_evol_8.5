<?php

/**
 * Clase base BaseDatServidorxmpp.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
abstract class BaseDatServidorxmpp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_servidorxmpp');
        $this->hasColumn(
            'fqdn',
            'character varying',
            null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idservidor',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'password',
            'character varying',
            null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'usuario',
            'character varying',
            null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'puerto',
            'integer',
            null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ssl',
            'boolean',
            1,
            array(
                'ntype' => 'bool',
                'alltypes' => array(0 => 'boolean',),
                'notnull' => false,
                'primary' => false,
            )
        );
        $this->hasColumn(
            'tsl',
            'boolean',
            1,
            array(
                'ntype' => 'bool',
                'alltypes' => array(0 => 'boolean',),
                'notnull' => false,
                'primary' => false,
            )
        );
    }

}