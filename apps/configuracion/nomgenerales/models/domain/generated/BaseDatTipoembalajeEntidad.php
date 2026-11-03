<?php
/**
 * Created by PhpStorm.
 * User: Gabriel Ibarra Garcia
 * Date: 21/07/16
 * Time: 04:26 PM
 */
abstract class BaseDatTipoembalajeEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_tipoembalajeentidad');
        $this->hasColumn(
            'idtipoembalajeentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
                'primary' => true, 'sequence' => 'mod_datosmaestros.sec_dattipoembalajeentidad')
        );
        $this->hasColumn(
            'idtipoembalaje', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
                'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
                'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}