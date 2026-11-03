<?php
/**
 * DatModuloReporteMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatModuloReporteMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.dat_moduloreporte');

        $this->hasColumn(
            'idmodulo', 'numeric', 3, array(
                'type' => 'numeric',
                'length' => 3,
                'notnull' => true,
                'primary' => true,
                'sequence'=>'mod_crmadministracion.sec_moduloreporte'
            )
        );

        $this->hasColumn(
            'identificador', 'character varying', 50, array(
                'type' => 'character varying',
                'length' => 50,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'denominacion', 'character varying', 150, array(
                'type' => 'character varying',
                'length' => 150,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}