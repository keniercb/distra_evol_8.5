<?php

/**
 * DatReporteMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class DatReporteMapper extends Doctrine_Record {

    public function setTableDefinition() {

        $this->setTableName('mod_rrhhmaestro.dat_reporte');

        $this->hasColumn(
                'idreporte', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_rrhhmaestro.sec_reporte'
                )
        );

        $this->hasColumn(
                'idpadre', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
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

        $this->hasColumn(
                'agrupador', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => true,
            'primary' => false
                )
        );

        $this->hasColumn(
                'general', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'identificador', 'character varying', 50, array(
            'type' => 'character varying',
            'length' => 50,
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'tipocontenido', 'numeric', 1, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'recurso', 'character varying', 100, array(
            'type' => 'character varying',
            'length' => 100,
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'url', 'character varying', 150, array(
            'type' => 'character varying',
            'length' => 150,
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'nombrecomponente', 'character varying', 100, array(
            'type' => 'character varying',
            'length' => 100,
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'idmodulo', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false
                )
        );

        $this->hasColumn(
                'otroformato', 'numeric', null, array(
            'type' => 'numeric',
            'notnull' => false,
            'primary' => false
                )
        );

        $this->hasColumn(
                'activo', 'numeric', null, array(
            'type' => 'numeric',
            'notnull' => true,
            'default' => 1,
            'primary' => false
                )
        );
        
        $this->hasColumn(
            'activo', 'numeric', null, array(
                'type' => 'numeric',
                'notnull' => true,
                'default' => 1,
                'primary' => false
            )
        );
    }

}
