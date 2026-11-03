<?php
/**
 * DatReporteFiltroNomencladorMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatReporteFiltroNomencladorMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_rrhhmaestro.dat_reportefiltronomenclador');

        $this->hasColumn(
            'idfiltro', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true
            )
        );

        $this->hasColumn(
            'nomidentificador', 'character varying', 100, array(
                'type' => 'character varying',
                'length' => 100,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'nomdenominacion', 'character varying', 100, array(
                'type' => 'character varying',
                'length' => 100,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'tipofuentedatos', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'sentenciasql', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => false,
                'primary' => false
            )
        );

        $this->hasColumn(
            'nomservicio', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => false,
                'primary' => false
            )
        );
    }
}