<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatPuntualizacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_puntualizacion');
        $this->hasColumn(
            'idpuntualizacion', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_puntualizacion')
        );
        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idactividadpuntualizacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idautorpunt', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestadoaprobpunt', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'activa', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'ejecutada', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );		
        $this->hasColumn(
            'fechacreacionpunt', 'TIMESTAMP', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechacontrolcambiopunt', 'TIMESTAMP', null,
            array('notnull' => true, 'primary' => false)
        );	
		$this->hasColumn(
            'suspendida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		  
		
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase


