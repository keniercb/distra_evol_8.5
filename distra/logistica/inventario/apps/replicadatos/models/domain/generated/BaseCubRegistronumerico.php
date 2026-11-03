<?php 
abstract class BaseCubRegistronumerico extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_loganalisis.cub_registronumerico'); 
       $this->hasColumn('idregistro', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loganalisis.sec_cubregistronumerico_seq')); 
       $this->hasColumn('annofabricacion', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('cantidadrecursoconsumido', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('depreciacionacumulada', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('esbaja', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('estadoperacion', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechaadq', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechaexpfin', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechaexpini', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechafingarantia', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('fechainicialgarantia', 'date', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idactividad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idarearesp', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idcentrogrupo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('iddocumentos', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idestatustecnico', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idresponsable', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idtiempo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nroinventario', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('nroserie', 'character varying', 255 , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('recursoconsumido', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('recursoconsumidomax', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('tasafiscal', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('valoradquisicion', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('valorcontable', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('vidautil', 'numeric', null, array('notnull' => false, 'primary' => false)); 
    } 
 
   public function Setup() 
    { 
       parent::setUp(); 
    } 
 }

