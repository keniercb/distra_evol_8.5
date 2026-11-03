<?php

abstract class BaseSegUsuarioNomina extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.seg_usuarionomina');

        $this->hasColumn('idusuario', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_usuarionomina'
        ));

		$this->hasColumn('nombreusuario', 'character varying', 30, array(
            'type' => 'character varying',
            'length' => 30,
            'notnull' => true,
            'primary' => false
        ));
        $this->hasColumn('contrasenna', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => true,
            'primary' => false
        ));
    }
}
