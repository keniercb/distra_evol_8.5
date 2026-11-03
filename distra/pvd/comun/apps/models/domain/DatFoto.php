<?php 
class DatFoto extends BaseDatFoto{ 

public function setUp()
  {
    parent::setUp();
     $this->hasMany("DatPersona",array('local'=>'idpersona','foreign'=>'idpersona'));
     
 
  }
 public function insertar($idpersona,$foto,$extension,$desde,$hasta)
	{
		$this->idfoto	 =  $this->GetLLave();
		
		$this->idpersona = $idpersona;
		$this->foto	 = $foto;
		$this->extension = $extension;
		$this->desde	 = $desde;
		$this->hasta	 = $hasta;
		
		try
		{
			$this->save();
			return true;
		}
		catch (Doctrine_Exception $e)
		{   
			if(DEBUG_ERP)
				echo(__FILE__.' '.__LINE__.' '.$e->getMessage());
			
			return false;
		}
	} 
   public function modificar($idfoto,$idpersona,$foto,$extension,$desde,$hasta)
	{
	        $temp = $this->getTable('DatFoto')->find($idfoto);	        
		
		$temp->idpersona = $idpersona;
		$temp->foto	 = $foto;
		$temp->extension = $extension;
		$temp->desde	= $desde;
		$temp->hasta	 = $hasta;
		
		try
		{
			$temp->save();
			return true;
		}
		catch (Doctrine_Exception $e)
		{   
			if(DEBUG_ERP)
				echo(__FILE__.' '.__LINE__.' '.$e->getMessage());
			
			return false;
		}
	} 
   public function eliminar( $idfoto)
	{
	        $query = new Doctrine_Query ();        
          
           $result = $query ->delete()->from('DatFoto')->where("idfoto = '$idfoto'")->execute ();
            return $result == 0 ? false : true;
		
		try
		{
			$temp->save();
			return true;
		}
		catch (Doctrine_Exception $e)
		{   
			if(DEBUG_ERP)
				echo(__FILE__.' '.__LINE__.' '.$e->getMessage());
			
			return false;
		}
	} 
   
   public function GetLLave() 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query ->select('MAX(idfoto)')->from('DatFoto')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
 
   public function Buscar($idfoto) 
    { 
       try 
        { 
        $temp = $this->getTable('DatFoto')->find($idfoto);
            return $temp->toArray();
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
 
   public function GetTodos() 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->select('*')->from('DatFoto')->execute (); 
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatFoto')->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    }
	public function VerificarSiTienefoto($idpersona) 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatFoto')->where('idpersona = ? and activo = ?', array($idpersona, 1))->execute (); 
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 	
 }