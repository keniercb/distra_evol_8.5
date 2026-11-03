<?php
class ConfHabilitarfinmesModel extends ZendExt_Model 
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    } 

    public function getHabilitarfinmes()
    {
        $result = ConfHabilitarfinmes::getHabilitarfinmes();
        foreach ($result as $v){
            if($v['habilitado'] == 1){
                $result[$v]['habilitado'] = true;
            }
        }
      return $result;
    }

    public function setHabilitarfinmes($habilitado)
    {
        try {

            $obj = ConfHabilitarfinmes::getById(1);

            if($habilitado == 'true')
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
