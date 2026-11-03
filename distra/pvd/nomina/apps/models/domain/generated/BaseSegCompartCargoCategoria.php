<?php

abstract class BaseSegCompartCargoCategoria extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.seg_compartcargocategoria');

        $this->hasColumn('idcompartcargocategoria', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_seg_compartcargocategoria'
        ));

		$this->hasColumn('idcargo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idcategoria', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
    }
}
