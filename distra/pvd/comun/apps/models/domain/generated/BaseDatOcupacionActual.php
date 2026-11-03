<?php 
abstract class BaseDatOcupacionActual extends Doctrine_Record 
 { 
   public function setTableDefinition() 
    { 
       $this->setTableName('mod_persona.dat_ocupacionactual'); 
       $this->hasColumn('idocupacionactual', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' =>'mod_persona.sec_datocupacionactual')); 
       $this->hasColumn('idpersona', 'numeric', null , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idorganismo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('identidad', 'numeric', null, array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idcargo', 'numeric', null , array('notnull' => false, 'primary' => false)); 
       $this->hasColumn('idpuestotrabajo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));  
	   $this->hasColumn('idgrado', 'numeric', null, array('notnull' => false, 'primary' => false));
	   $this->hasColumn('idtipoorgano', 'numeric', null, array('notnull' => false, 'primary' => false));
	   $this->hasColumn('idsubordinacion', 'numeric', null, array('notnull' => false, 'primary' => false));  
	   $this->hasColumn('idesfera', 'numeric', null, array('notnull' => false, 'primary' => false));  
	   $this->hasColumn('organismo', 'character varying', 255, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('entidad', 'character varying', 255, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('cargo', 'character varying', 255, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('puestotrabajo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('tipoocupacion', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('idnomencladorcargo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('numorden', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('anexo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('parrafo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('iddequieneslaorden', 'numeric', null, array('notnull' => false, 'primary' => false)); 	  
	   $this->hasColumn('idmotivoponerencargo', 'numeric', null, array('notnull' => false, 'primary' => false)); 
	   $this->hasColumn('fechainicioorden', 'date', null, array('notnull' => false, 'primary' => false));  
	   $this->hasColumn('fechafinorden', 'date', null, array('notnull' => false, 'primary' => false));  
	   $this->hasColumn('estadocargo', 'numeric', null, array('notnull' => false, 'primary' => false));  
    }   

 }//fin clase 
?>

