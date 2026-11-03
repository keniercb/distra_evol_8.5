<?php

class DatGrupoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function adicionarCompartimentacion($sql, $denom){
        try{
            $valor = new DatGrupo();
            $verif = $valor->verficarExisteDenom($denom);
            if($verif == 0){
                $valor->denominacion = $denom;
                $valor->compartimentacion = $sql;
                $valor->save();
                return true;
            }else{
                return false;
            }
        }catch (Doctrine_Exception $e){
            die($e);
        }
    }

    public function eliminarCompartimentacion($compart){
        try{
            $objCompart = new DatGrupo();
            return $objCompart->eliminarbyIds($compart);
        }catch (Exception $e){
            throw $e;
            return false;
        }
    }
}

