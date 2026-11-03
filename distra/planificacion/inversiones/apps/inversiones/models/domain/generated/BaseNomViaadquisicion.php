<?php

abstract class BaseNomViaadquisicion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.nom_viaadquisicion');
        $this->hasColumn(
                'idviaadquisicion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_viaadquisicion')
        );
        $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('color', 'character varying', 20, array('notnull' => true, 'primary' => false));
        $this->hasColumn('uriviaadquisicion', 'character varying', 100, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
?>

