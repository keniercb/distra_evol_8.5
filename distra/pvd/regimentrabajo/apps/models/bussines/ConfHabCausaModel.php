<?php
class ConfHabCausaModel extends ZendExt_Model
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    } 

    public function getHabilitarcausa()
    {
        $result = ConfHabcausa::getHabilitarcausa();
        foreach ($result as $v){
            if($v['habilitado'] == 1){
                $result[$v]['habilitado'] = true;
            }
        }
        return $result;
    }

    public function setHabilitarcausa($habilitadoA,$habilitadoT,$habilitadoSA,$habilitadoTSA)
    {
        try {
            $objA = ConfHabcausa::getById(1);
            if($habilitadoA == 'true')
                $objA->habilitado = 1;
            else
                $objA->habilitado = 0;
            $objA->save();

            $objT = ConfHabcausa::getById(2);
            if($habilitadoT == 'true')
                $objT->habilitado = 1;
            else
                $objT->habilitado = 0;
            $objT->save();

            $objSA = ConfHabcausa::getById(3);
            if($habilitadoSA == 'true')
                $objSA->habilitado = 1;
            else
                $objSA->habilitado = 0;
            $objSA->save();

            $objTSA = ConfHabcausa::getById(4);
            if($habilitadoTSA == 'true')
                $objTSA->habilitado = 1;
            else
                $objTSA->habilitado = 0;
            $objTSA->save();

            return true;
        } catch (Exception $e) {
            return false;
       }
    }
 }
