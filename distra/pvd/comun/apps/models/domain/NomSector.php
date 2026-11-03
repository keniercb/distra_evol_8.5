<?php
class NomSector extends BaseNomSector
 {
   public function setUp()
    {   parent::setUp();
         $this->hasOne('DatPersonaestratificacionsocial', array('local'=>'idsector','foreign'=>'idsector'));

    }

   public function Buscar($idsector)
    {
          $temp = $this->conn->getTable('NomSector')->find($idsector);
           return $temp->toArray();
    }

   public function GetTodos()
    {
          $query = new Doctrine_Query ();
          $result = $query->from('NomSector')->execute ();
          return $result->toArray();

    }

   public function GetPorLimite($limite = 10,$inicio = 0)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('NomSector')->limit($limite = 10)->offset($inicio = 0)->execute ();
          return $result->toArray();

    }
	public function GetActivos()
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomSector d')
						->where("(fechafin > 'now()' or fechafin IS NULL) and (fechainicio <= 'now()')")
						->setHydrationMode(Doctrine::HYDRATE_ARRAY)
						->execute ();
        return $result;
    }
	public function cant($id_nomenclador)
	{
			try
			{
				$contador = 0;
				$sql = new Doctrine_Query ();
				$contador = $sql->select('a.idpersona')
							->from('DatPersonaestratificacionsocial a')
							->innerJoin('a.NomSector b')
							->where("b.idsector ='$id_nomenclador'")
							->count();
				return $contador;
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
          $result = $query->from('NomSector')->where("(fechafin >= 'now()' or fechafin IS NULL) and (fechainicio <= 'now()' or fechainicio IS NULL) ")->execute ();
		  return $result->toArray();

        }
       catch(Doctrine_Exception $e)
        {
          return $e;
        }
    }
 public function GetListTodos($limit,$start)
    {
       try
        {
          $query = new Doctrine_Query ();
          $result = $query->select('p.*')
			->from('NomSector p')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY)
			->limit($limit)
             ->offset($start)
			  ->orderBy('p.denom ASC')
			->execute ();
          return $result;


        }
       catch(Doctrine_Exception $e)
        {
          return $e;
        }
    }
	public function GetCantListTodos()
    {
       try
        {
          $query = new Doctrine_Query ();
          $result = $query->select('p.*')
			->from('NomSector p')->count();
          return $result;


        }
       catch(Doctrine_Exception $e)
        {
          return $e;
        }
    }
	public function verifExist($denom)
    {
       try
        {
          $query = new Doctrine_Query ();
          $result = $query->select('p.*')
			->from('NomSector p')
		    ->where("denom=?",array($denom))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
		  if(count($result))
           return true;
          else  return false;
        }
       catch(Doctrine_Exception $e)
        {
          return $e;
        }
    }
	public function verifExistMod($id,$denom)
    {
       try
        {
          $query = new Doctrine_Query ();
          $result = $query->select('p.*')
			->from('NomSector p')
		    ->where("p.idsector!=? and p.denom=?",array($id,$denom))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
		  if(count($result))
           return true;
          else  return false;
        }
       catch(Doctrine_Exception $e)
        {
          return $e;
        }
    }
}//fin clase
?>