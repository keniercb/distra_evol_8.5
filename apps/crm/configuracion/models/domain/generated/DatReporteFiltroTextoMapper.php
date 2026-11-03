<?php
/**
 * DatReporteFiltroTextoMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatReporteFiltroTextoMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.dat_reportefiltrotexto');

        $this->hasColumn(
            'idfiltro', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true
            )
        );

        $this->hasColumn(
            'longitudminima', 'numeric', 3, array(
                'type' => 'numeric',
                'length' => 3,
                'notnull' => false,
                'primary' => false
            )
        );

        $this->hasColumn(
            'longitudmaxima', 'numeric', 3, array(
                'type' => 'numeric',
                'length' => 3,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}