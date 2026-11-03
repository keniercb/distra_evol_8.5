<?php
/**
 * DatReporteFiltroMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatReporteFiltroMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.dat_reportefiltro');

        $this->hasColumn(
            'idfiltro', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => true,
                'sequence'=>'mod_crmadministracion.sec_reportefiltro'
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
            'orden', 'numeric', 2, array(
                'type' => 'numeric',
                'length' => 2,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'anchocolumna', 'numeric', 4, array(
                'type' => 'numeric',
                'length' => 4,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'nombreparametro', 'character varying', 50, array(
                'type' => 'character varying',
                'length' => 50,
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
            'javatype', 'character varying', 50, array(
                'type' => 'character varying',
                'length' => 50,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'idreporte', 'numeric', 19, array(
                'type' => 'numeric',
                'length' => 19,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}