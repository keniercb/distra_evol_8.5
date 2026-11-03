<?php
/**
 * Created by PhpStorm.
 * User: Gabriel Ibarra Garcia
 * Date: 21/07/16
 * Time: 04:26 PM
 */
abstract class BaseDatTipoenvaseEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_tipoenvaseentidad');
        $this->hasColumn(
            'idtipoenvaseentidad', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false,
                'primary' => true, 'sequence' => 'mod_datosmaestros.sec_dattipoenvaseentidad')
        );
        $this->hasColumn(
            'idtipoenvase', 'numeric', null,
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