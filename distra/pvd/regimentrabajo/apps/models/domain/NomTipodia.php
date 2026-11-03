<?php 
class NomTipodia extends BaseNomTipodia
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('ConfCalendario', array('local'=>'idtipodedia','foreign'=>'idtipodedia'));
         $this->hasMany('ConfCalendariopersona', array('local'=>'idtipodedia','foreign'=>'idtipodedia'));

    } 
 
   public function Buscar($idtipodocidentidad) 
    { 
          $temp = $this->conn->getTable('NomTipodia')->find($idtipodocidentidad); 
           return $temp->toArray();
    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomTipodia')->execute (); 
          return $result->toArray();
    } 
 
   public function GetPorLimite($limit,$start)
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomTipodia')->limit($limit)->offset($start)->execute ();
          return $result->toArray();
    } 

   public function GetAllFind($criterio)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('NomTipodia td')
              ->where("td.denominacion ilike '%".$criterio."%'")
              ->execute ();
          return $result->toArray();
    }

   public function GetByLimitFind($criterio,$limit,$start)
    {
          $query = new Doctrine_Query ();
          $result = $query->from('NomTipodia')
              ->where("td.denominacion ilike '%".$criterio."%'")
              ->limit($limit)->offset($start)->execute ();
          return $result->toArray();
    }

    public function DiaLaborable()
    {
        $query = new Doctrine_Query ();
        $result = $query
            ->select('td.idtipodedia')
            ->from('NomTipodia td')
            ->where('td.trabajo = ?', 1)
            ->AndWhere('td.feriado = ?', 0)
            ->execute ();
        return $result->toArray();
    }
	
	    public function DiaFeriado()
    {
        $query = new Doctrine_Query ();
        $result = $query
            ->select('td.idtipodedia')
            ->from('NomTipodia td')
            ->where('td.trabajo = ?', 0)
            ->AndWhere('td.feriado = ?', 1)
            ->execute ();
        return $result->toArray();
    }

}//fin clase 
?>


