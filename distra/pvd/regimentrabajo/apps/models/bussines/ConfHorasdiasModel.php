<?php
class ConfHorasdiasModel extends ZendExt_Model
 {

    public function setUp()
    { 
        parent::ZendExt_Model();
    }

    function setHorasDias($id)
    {
        try {
            $diasobj = ConfHorasdias::getById(1);
            $horasobj = ConfHorasdias::getById(2);
            if($id == 1){
                $diasobj->horasdias = 1;
                $horasobj->horasdias = 0;
            }
            else if($id == 2){
                $horasobj->horasdias = 1;
                $diasobj->horasdias = 0;
            }
            $diasobj->save();
            $horasobj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

 }
