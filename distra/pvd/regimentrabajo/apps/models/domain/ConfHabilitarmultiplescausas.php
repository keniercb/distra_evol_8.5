<?php
class ConfHabilitarmultiplescausas extends BaseConfHabilitarmultiplescausas
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabilitarmultiplescausas')->find($id);
    }

    public function gethabilitarmultiplescausas()
    {
        $result =  $this->gethabilitarvariascausas();
        foreach ($result as $v){
            if($v['habilitadomc'] == 1){
                $result[$v]['habilitadomc'] = true;
            }
        }
        return $result;
    }

    public function gethabilitarvariascausas()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT 
                  id,
                  habilitado as habilitadomc
                FROM 
                  mod_regimentrabajo.conf_habilitarmultiplescausas ;";
        return $conn->fetchAll($sql);
    }

    public function sethabilitarmultiplescausas($habvariascausas)
    {
        try {
            $obj = $this->getById(1);
            if (!$obj) {
                $obj = new ConfHabilitarmultiplescausas();
                $obj->id = 1;
            }
            if($habvariascausas == 'true')
                $obj->habilitado = 1;
            else
                $obj->habilitado = 0;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
?>
