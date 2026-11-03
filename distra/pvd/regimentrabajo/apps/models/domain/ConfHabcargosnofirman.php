<?php
class ConfHabcargosnofirman extends BaseConfHabcargosnofirman
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabcargosnofirman')->find($id);
    }

    public function getHabilitarcargosnofirman()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabcargosnofirman conf');
        return $query->execute()->toArray();
    }	
}
?>
