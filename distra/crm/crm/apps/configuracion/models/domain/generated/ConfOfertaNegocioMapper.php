<?php
/**
 * ConfOfertaNegocioMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class ConfOfertaNegocioMapper extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.conf_ofertanegocio');

        $this->hasColumn(
            'idconfoferta', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => true
            )
        );

        $this->hasColumn(
            'idestadosolicitudinsertar', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => false
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
            'activo', 'numeric', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );
        $this->hasColumn(
            'idestadosolicitudofertainsertar', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );
    }
}