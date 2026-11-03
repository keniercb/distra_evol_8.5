<?php
class ConfHabilitarsubvac extends BaseConfHabilitarsubvac
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabilitarsubvac')->find($id);
    }

    public function getHabilitarSubVac()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabilitarsubvac conf');
        return $query->execute()->toArray();
    }	
}
?>
