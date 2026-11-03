<?php

abstract class BaseNomSituacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.nom_situacion');
        $this->hasColumn('izq', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('der', 'numeric', null, array('notnull' => true, 'primary' => false));
       // $this->hasColumn('alia', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('color', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('asociadocargo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        //$this->hasColumn('categorias', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idsituacion', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_situacion')
        );
    }

}

