<?php

class BaseIdentificacionInmuebleCamp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_identificacioninmueblecamp');
        $this->hasColumn('idindentificacioninmueble', 'numeric', 19, array('notnull' => true, 'primary' => true));        
        $this->hasColumn('direccion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resolucion', 'character varying', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('area', 'numeric', 25,array('notnull' => false, 'primary' => false));
        $this->hasColumn('terminovidautil', 'character varying',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('responsable', 'character varying',255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('nroinventario', 'character varying',255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaexplotacion', 'date',array('notnull' => false, 'primary' => false));
        $this->hasColumn('idprovincia', 'numeric',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmunicipio', 'numeric',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('idautoriza', 'numeric',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('registro', 'numeric',1,array('notnull' => false, 'primary' => false));
        $this->hasColumn('x', 'character varying',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('y', 'character varying',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('z', 'character varying',19,array('notnull' => false, 'primary' => false));
        
    }
}
