<?php 
abstract class BaseDatUbicacionvivienda extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_logpatrimonio.dat_ubicacionvivienda'); 
       $this->hasColumn('idasentamiento', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idmunicipio', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('piso', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true));
       $this->hasColumn('carretera', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('finca', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('calleavenida', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('numero', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nroapto', 'character varying', 20 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('camino', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('varianteubicacion', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('manzana', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('entrecalle', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('barrioreparto', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('localidad', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idprovincia', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('distrito', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('kilometro', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('edificio', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }//fin clase 
?>

