<?php

abstract class BaseDatSolicitud711 extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_plan711.dat_solicitud711');
        $this->hasColumn(
                'idsolicitud711', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_plan711.sec_solicitud711')
        );
        $this->hasColumn(
                'idplan711', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'identidadcliente', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'identidaddestino', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosempimp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idcodigodecc', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatoscc', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosestado', 'numeric', null, array('notnull' => false, 'primary' => false)
        ); 
        $this->hasColumn(
                'iddirector', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddirectorecon', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idespecialista', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechapresped', 'timestamp', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'descripciongeneral', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'suministrototal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'otrosgastos', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'totalgeneral', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'antecedentes', 'text', null, array('notnull' => false, 'primary' => false)
        );
         $this->hasColumn(
                'lugarentrega', 'text', null, array('notnull' => false, 'primary' => false)
        );		
        $this->hasColumn(
                'nosolicitud', 'numeric', null, array('notnull' => false, 'primary' => false)
        );        
        $this->hasColumn(
                'iddatosffsol', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosffsol_old', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'textnosolicitudo', 'text', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'codigoaprob', 'text', null, array('notnull' => false, 'primary' => false)
        ); 
		        
        $this->hasColumn(
                'paraconsolidar', 'boolean', null, array('notnull' => false, 'primary' => false)
        ); 	
        $this->hasColumn(
                'estaconsolidada', 'boolean', null, array('notnull' => false, 'primary' => false)
        );        
        $this->hasColumn(
                'esconsolidada', 'boolean', null, array('notnull' => false, 'primary' => false)
        ); 
        $this->hasColumn(
                'iddatostarea', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idespecialistacs', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idcomprador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'idtiposolicitudplan', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'nombreentidad', 'text', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'idproductoindicador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'iddatosgrupcomercial', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'flete', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'seguro', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
        $this->hasColumn(
                'idcodigocupdunas', 'numeric', null, array('notnull' => true, 'primary' => false)
        );       
    }

    public function Setup() {
        parent::setUp(); 
        
        $this->hasOne(
                'DatPlan711', array('local' => 'idplan711',
            'foreign' => 'idplan711')
        );
        
        $this->hasOne(
                'DatCodigodeCC', array('local' => 'idcodigodecc',
            'foreign' => 'idcodigodecc')
        );
    }

}
