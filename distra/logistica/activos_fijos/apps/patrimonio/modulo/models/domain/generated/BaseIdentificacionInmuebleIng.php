<?php

class BaseIdentificacionInmuebleIng extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_identificacioninmuebleing');
        $this->hasColumn('idindentificacioninmuebleing', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idtipoobra', 'numeric',19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('inventario', 'character varying',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('montana', 'numeric',1,array('notnull' => false, 'primary' => false));
        $this->hasColumn('zonadefensa','character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pertenece', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestatustecnico', 'numeric',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadooperativo',  'numeric',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('idautoriza',  'numeric',19,array('notnull' => false, 'primary' => false));
        
        $this->hasColumn('observaciones', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('x', 'character varying',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('y', 'character varying',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('z', 'character varying',19,array('notnull' => false, 'primary' => false));

    }
}
