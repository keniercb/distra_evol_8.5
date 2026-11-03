<?php

abstract class BaseNomActividad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planificacion.nom_actividad');
        $this->hasColumn(
                'idactividad', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_actividad')
        );
        $this->hasColumn(
                'codigo', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'descripcion', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'ordenizq', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'ordender', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idpadre', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'estado', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idformato', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
       /* $this->hasColumn(
                'iddatosnomenclador', 'numeric', null, array('notnull' => FALSE, 'primary' => false)
        );*/
        $this->hasColumn(
                'nivel', 'numeric', null, array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
                'idarbol', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'normada', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idespecialidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
         $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
