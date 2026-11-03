<?php 
class ConflimitesModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getLimites()
    {
        try {
            $result = Array();
            $obj = new Conflimites();
            $datos = $obj->getLimites();
            $result[0]['idlminPP'] = $datos[0]['idlimite'];
            $result[0]['lminPP'] = $datos[0]['valor'];
            $result[0]['lminPPDesc'] = $datos[0]['descripcion'];
            $result[0]['idlmaxPP'] = $datos[1]['idlimite'];
            $result[0]['lmaxPP'] = $datos[1]['valor'];
            $result[0]['lmaxPPDesc'] = $datos[0]['descripcion'];
            $result[0]['idlmaxExtPP'] = $datos[2]['idlimite'];
            $result[0]['lmaxExtPP'] = $datos[2]['valor'];
            $result[0]['lmaxExtPPDesc'] = $datos[0]['descripcion'];
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function updateLimite($idlimite, $valor)
    {
        try {
            $obj = Conflimites::getById($idlimite);
            $obj->valor = $valor;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}