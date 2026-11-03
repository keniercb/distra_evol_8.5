<?php

class DatGrupousuarioModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function actualizarUsers(array $arr, $idcompart){
        try{
            $objUserCompart = new DatGrupousuario();
            foreach ($arr as $k) {
                $arrIdUsers[] = $k->idusuario;
            }
            $arrTmp = $objUserCompart->getGrupousuariosbyArrIds($arrIdUsers);
            $colUsers = new Doctrine_Collection('DatGrupousuario');
            foreach ($arr as $k => $v) {
                $recUser = $this->verifExiste($v->idusuario, $arrTmp);
                if($recUser['obj'] == 'null'){
                    $colUsers[$k]->idusuario = $v->idusuario;
                    $colUsers[$k]->idpersona = $v->idpersona;
                    $colUsers[$k]->idgrupo = $idcompart;
                }elseif($recUser['obj']->idgrupo != $idcompart){
                    $recUser['obj']->idusuario = $v->idusuario;
                    $recUser['obj']->idgrupo = $idcompart;
                    $recUser['obj']->save();
                }
            }
            return $colUsers->save();
        }catch(Exception $e) {
            die($e->getMessage());
        }
    }

    public function verifExiste($valor, array $arrToCheck){
        foreach ($arrToCheck as $val) {
            if($val->idusuario == $valor){
                return array('obj'=>$val);
                break;
            }
        }
        return array('obj'=>'null');
    }

    public function eliminarUsuarios($usuarios){
        try{
            $objUserCompart = new DatGrupousuario();
            return $objUserCompart->eliminarbyIds($usuarios);
        }catch (Exception $e){
            throw $e;
            return false;
        }
    }
}

