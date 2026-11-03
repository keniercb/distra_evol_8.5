<?php
class ConfHabcontrolacceso extends BaseConfHabcontrolacceso
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabcontrolacceso')->find($id);
    }

    public function getHabilitarcontrolacceso()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabcontrolacceso conf');
        return $query->execute()->toArray();
    }	
}
?>
