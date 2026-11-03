<?php 
class NomSexo extends BaseNomSexo
 { 
   public function insertar($denom,$desde,$hasta)
	{
		$this->idsexo	 =  $this->GetLLave();
		
		$this->denom = $denom;
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
   public function modificar($idsexo,$denom,$desde,$hasta)
	{
	        $temp = $this->getTable('NomSexo')->find($idsexo);	        
		
		$temp->denom = $denom;
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
   public function eliminar( $idsexo)
	{
	        $query = new Doctrine_Query ();        
          
           $result = $query ->delete()->from('NomSexo')->where("idsexo = '$idsexo'")->execute ();
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
          $result = $query ->select('MAX(idsexo)')->from('NomSexo')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
 
   public function Buscar($idsexo) 
    { 
       try 
        { 
          $temp = $this->conn->getTable('NomSexo')->find($idsexo); 
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
          $result = $query->select('idsexo, denom')->from('NomSexo')->where("hasta < 'now()' or hasta IS NULL")->execute (); 
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
          $result = $query->from('NomSexo')->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
	
	public function GetActivos() 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomSexo')->where("(hasta > 'now()' or hasta IS NULL) and (desde <= 'now()') ")->execute ();
		  return $result->toArray(); 
		  
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    }

    public function GetSexoById($id) 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomSexo s')->where("s.idsexo = '$id'")->execute ();
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    }	
 }//fin clase 
?>

