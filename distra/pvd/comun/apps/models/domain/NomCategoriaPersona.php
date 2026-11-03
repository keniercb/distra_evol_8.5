<?php 
class NomCategoriaPersona extends BaseNomCategoriaPersona
 { 
   
 public function insertar($denom,$descripcion,$desde,$hasta)
	{
		$this->idcategoriapersona	 =  $this->GetLLave();
		
		$this->denom = $denom;
		$this->descripcion = $descripcion;
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
   public function modificar($idcategoriapersona,$denom,$descripcion,$desde,$hasta)
	{
	        $temp = $this->getTable('NomCategoriaPersona')->find($idcategoriapersona);	        
		
		$temp->denom = $denom;
		$temp->descripcion = $descripcion;
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
   public function eliminar( $idcategoriapersona)
	{
	        $query = new Doctrine_Query ();        
          
           $result = $query ->delete()->from('NomCategoriaPersona')->where("idcategoriapersona = '$idcategoriapersona'")->execute ();
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
          $result = $query ->select('MAX(idcategoriapersona)')->from('NomCategoriaPersona')->execute(); 
          $arr = $result->toArray(); 
          return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
 
   public function Buscar($idcategoriapersona) 
    { 
       try 
        { 
        $temp = $this->getTable('NomCategoriaPersona')->find($idcategoriapersona);
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
          $result = $query->select('*')->from('NomCategoriaPersona')->fetchArray();
          return $result;
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
    
    public function GetTodosActivos() 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->select('idcategoriapersona as codigo, denom, idcategoriapersona')->from('NomCategoriaPersona')
          ->where("hasta is null")->execute (); 
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
          $result = $query->from('NomCategoriaPersona')->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
	public function GetCategoriasById($id) 
    { 
       try 
        { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomCategoriaPersona c')->where("c.idcategoriapersona = '$id'")->execute ();
          return $result->toArray(); 
        } 
       catch(Doctrine_Exception $e) 
        { 
          return $e; 
        }
    } 
 }//fin clase 
?>

