<?php

abstract class BaseDatOrdenReclamacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_ordenreclamacion');
        $this->hasColumn(
            'idordenreclamacion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datordenreclamacion')
        );
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechareclamacion', 'character varing', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('formapago', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('posecionmedio', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varing', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

