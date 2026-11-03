<?php

abstract class BaseNomNomenclador extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifinversiones.nom_nomenclador');
        $this->hasColumn('idnomenclador', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('tabla', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('esquema', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrecampo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreidtabla', 'varchar', 50, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombretablausa', 'varchar', 50, array('notnull' => true, 'primary' => false));
    }

}

