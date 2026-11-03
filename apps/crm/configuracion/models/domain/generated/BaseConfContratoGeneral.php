<?php
/**
 * ConfOfertaNegocioMapper
 *
 * @package Persistencia de datos.
 * @subpackage Mapeo ORM.
 * @copyright UCID
 * @version 1.0
 */
class BaseConfContratoGeneral extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_crmadministracion.conf_contratogeneral');

        $this->hasColumn(
            'idcontratogeneral', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => true
            )
        );

        $this->hasColumn(
            'idestadoofertalisto', 'numeric', 1, array(
                'type' => 'numeric',
                'length' => 1,
                'notnull' => true,
                'primary' => false
            )
        );
        $this->hasColumn(
            'activopersona', 'numeric', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => true,
                'primary' => false
            )
        );

        //yo
        $this->hasColumn(
            'confgcontrato', 'json', array(
                'type' => 'json',
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'confgmail', 'json', array(
                'type' => 'json',
                'notnull' => true,
                'primary' => false
            )
        );

        $this->hasColumn(
            'confgjasper', 'character varying', 255, array(
                'type' => 'character varying',
                'length' => 255,
                'notnull' => false,
                'primary' => false
            )
            );

      


    }
}