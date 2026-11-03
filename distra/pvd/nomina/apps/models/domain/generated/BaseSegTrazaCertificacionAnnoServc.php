<?php

abstract class BaseSegTrazaCertificacionAnnoServc extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.seg_trazacertificacionannoservc');

        $this->hasColumn('idtrazacertificacionannoservc', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_trazacertificacionannoservc'
        ));

		$this->hasColumn('idcertificacionannoservc', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idusuario', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        $this->hasColumn('annosajuste', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('mesesajuste', 'numeric', 2, array(
            'type' => 'numeric',
            'length' => 2,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('fecha', 'date', null, array(
            'type' => 'date',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
    }
}
