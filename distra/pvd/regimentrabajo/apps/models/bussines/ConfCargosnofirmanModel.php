<?php
class ConfCargosnofirmanModel extends ZendExt_Model
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    } 

    public function getHabilitarcargosnofirman()
    {
        $result = ConfHabcargosnofirman::getHabilitarcargosnofirman();
        foreach ($result as $v){
            if($v['habilitado'] == 1){
                $result[$v]['habilitado'] = true;
            }
        }
      return $result;
    }

    public function setHabilitarcargosnofirman($habilitado,$idcargos)
    {
        try {
            $Confcargos = new ConfCargosnofirman();
            $Confcargos->DelCargosnofirman();
            if(!empty($idcargos)){
                foreach ($idcargos as $v) {
                    $objtemp = new ConfCargosnofirman();
                    $objtemp->idcargo = $v;
                    $objtemp->save();
                }
            }
            $obj = ConfHabcargosnofirman::getById(1);
            if($habilitado == 'true'){
                $obj->habilitado = 1;
            }
            else{
                $obj->habilitado = 0;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
       }
    }
 }
