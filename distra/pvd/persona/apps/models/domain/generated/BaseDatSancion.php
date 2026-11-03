<?php
abstract class BaseDatSancion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_sancion');
        $this->hasColumn(
            'idsancionp', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_sancionp')
        );
        $this->hasColumn('idsancion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmotivosancion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tiemposancion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('unidadtiempo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fimposicion', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('frehabilitacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resolucion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fnotificacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcargofacultado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resrehabilitacion', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}