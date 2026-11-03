<?php
class ConfHabilitarhorario extends BaseConfHabilitarhorario
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabilitarhorario')->find($id);
    }

    public function getHabilitarhorario()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabilitarhorario conf');
        return $query->execute()->toArray();
    }	
}
?>
