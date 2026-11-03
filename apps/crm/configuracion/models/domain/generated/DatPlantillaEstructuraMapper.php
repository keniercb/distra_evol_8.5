<?php
/**
 * DatPlantillaEstructuraMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatPlantillaEstructuraMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.dat_plantillaestructura');

        $this->hasColumn(
            'idestructura', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true,
                'sequence'=>'mod_crmadministracion.sec_plantillaestructura'
            )
        );

        $this->hasColumn(
            'region', 'character varying', 1, array(
                'type' => 'character varying',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );
		
		$this->hasColumn(
            'posicion', 'character varying', 1, array(
                'type' => 'character varying',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );
		
		$this->hasColumn(
            'tipo', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );
		
		$this->hasColumn(
            'texto', 'text', null, array(
                'type' => 'text',
                'notnull' => false,
                'primary' => false
            )
        );
		
		$this->hasColumn(
            'img', 'bytea', null, array(
                'type' => 'bytea',
                'notnull' => false,
                'primary' => false
            )
        );
		
        $this->hasColumn(
            'idplantilla', 'numeric', 10, array(
                'type' => 'numeric',
                'length' => 10,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}