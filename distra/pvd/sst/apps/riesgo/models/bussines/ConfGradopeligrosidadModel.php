<?php 
class ConfGradopeligrosidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getGrado($limit, $start)
    {
        try {

            $obj = new ConfGradopeligrosidad();
            $datos = $obj->getConfGradopeligrosidad($start, $limit) ;

            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addGrado($idexpresionmatematica)
    {
        try {
                ConfGradopeligrosidad::deleteAll();
                $obj = new ConfGradopeligrosidad();
                if($idexpresionmatematica!=null && $idexpresionmatematica!=''){
                    $obj->idexpresionmatematica = $idexpresionmatematica;
                }else{
                    return false;
                }
                $obj->save();
                return true;
        } catch (Exception $e) {
            return 2;
        }
    }

}