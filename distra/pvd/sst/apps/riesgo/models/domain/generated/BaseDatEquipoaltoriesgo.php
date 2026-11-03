<?php 
abstract class BaseDatEquipoaltoriesgo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_equipoaltoriesgo');
        $this->hasColumn(
            'idequipoaltoriesgo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_equipoaltoriesgo')
        );
        $this->hasColumn('idclasifequipo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('inventario', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('modelo', 'character varying', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpaisfabricante', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('annofabricacion', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('serie', 'character varying', array('notnull' => false, 'primary' => false));
        $this->hasColumn('presioncalculo', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('presionautorizada', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('capacidadcalculo', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('capacidadautorizada', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('ubicacion', 'character varying', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', array('notnull' => true, 'primary' => false));
    }
}