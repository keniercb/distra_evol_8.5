<?php
/**
 * BaseNomTipoFirma
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class BaseNomTipoFirma extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.nom_tipofirma');

        $this->hasColumn(
            'idtipofirma', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true,
                'sequence'=>'mod_rrhhmaestro.sec_tipofirma'
            )
        );

        $this->hasColumn(
            'denominacion', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}