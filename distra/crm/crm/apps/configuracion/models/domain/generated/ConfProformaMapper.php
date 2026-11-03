<?php
/**
 * ConfSolicitudNegocioMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class ConfProformaMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.conf_proforma');

        $this->hasColumn(
            'idconfproforma', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => true,
                'sequence' => 'mod_crmadministracion.sec_confproforma'
            )
        );

        
        $this->hasColumn(
            'idespaciotrabajo', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );
        
         $this->hasColumn(
            'espaciotrabajo', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'activo', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}