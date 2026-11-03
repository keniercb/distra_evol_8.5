<?php
class ConfHabhorarionocturnidad extends BaseNomHorarionocturnidad
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabhorarionocturnidad')->find($id);
    }

    public function getHabilitarhorarionocturnidad()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabhorarionocturnidad conf');
        return $query->execute()->toArray();
    }

    public function EliminarHorario()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfHabhorarionocturnidad x')
            ->execute();
        return true;
    }
}
?>
