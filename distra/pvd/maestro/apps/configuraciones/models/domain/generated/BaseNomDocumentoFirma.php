<?php
/**
 * BaseNomDocumentoFirma
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class BaseNomDocumentoFirma extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_rrhhmaestro.nom_documentofirma');

        $this->hasColumn(
            'iddocumentofirma', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true,
                'sequence'=>'mod_rrhhmaestro.sec_documentofirma'
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

        $this->hasColumn(
            'modulo', 'character varying', 100, array(
                'type' => 'character varying',
                'length' => 100,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}