<?php
/**
 * DatReporteFiltroNumericoMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatReporteFiltroNumericoMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.dat_reportefiltronumerico');

        $this->hasColumn(
            'idfiltro', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true
            )
        );

        $this->hasColumn(
            'valorminimo', 'numeric', 10, array(
                'type' => 'numeric',
                'length' => 10,
                'notnull' => false,
                'primary' => false
            )
        );

        $this->hasColumn(
            'valormaximo', 'numeric', 10, array(
                'type' => 'numeric',
                'length' => 10,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}