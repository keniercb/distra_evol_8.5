<?php
/**
 * DatPlantillaMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatPlantillaMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.dat_plantilla');

        $this->hasColumn(
            'idplantilla', 'numeric', 10, array(
                'type' => 'numeric',
                'length' => 10,
                'notnull' => true,
                'primary' => true,
                'sequence'=>'mod_crmadministracion.sec_plantilla'
            )
        );

        $this->hasColumn(
            'denominacion', 'character varying', 100, array(
                'type' => 'character varying',
                'length' => 100,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'identidad', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}