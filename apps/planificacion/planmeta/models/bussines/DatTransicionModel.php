<?php

class DatTransicionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function cargarTransicion($parametros,$idflujo)
    {
        $obj = new DatTransicion();
        $resulta = $obj->devolverTransiciones($parametros,$idflujo);
        $resultados->data = $resulta['datos'];
        $resultados->cant = $resulta['cantidad'];

        foreach ($resultados->data as $key => $value) {
            $resultados->data[$key]['estadoinicial'] = DatTransicion::devolverNombreDadoId($value['idestadoinicial']);
            $resultados->data[$key]['estadofinal'] = DatTransicion::devolverNombreDadoId($value['idestadofinal']);
        }

        return $resultados;
    }

    public function salvarTransicion($parametros){
//        DatTransicion::insertarNuevaTransicion($parametros);
        try {
            $arrIdUser = $parametros['userAto'];
    
            $nomTransicion = new DatTransicion();
            $nomTransicion->idflujotrabajo = $parametros['idflujo'];
            $nomTransicion->idestadoinicial = $parametros['idestadoinic'];
            $nomTransicion->idestadofinal = $parametros['idestadofinal'];
            $nomTransicion->inicial = $parametros['inicial'];
            $nomTransicion->save();
            $idTransicion = $nomTransicion->idtransicion;
            //$idTransicion = DatTransicion::salvar($nomTransicion);
            
            $collectionUserTrans = new Doctrine_Collection('DatUsuariotransicion');
            foreach ($arrIdUser as $index => $iduser) {
                $objDatetapa = new DatUsuariotransicion();
                $objDatetapa->idtransicion = $idTransicion;
                $objDatetapa->idusuario = $iduser;
                $collectionUserTrans[$index] = $objDatetapa;
            }
            $collectionUserTrans->save();
        } catch (Doctrine_Exception $ee) {
                return '-4';
        }
    }
    
    public function setTransiciones($parametros, $users){
        DatTransicion::setTransicion($parametros, $users);
    }
    
    public function eliminarTransiciones($idflujo,$idtrans){
        DatTransicion::deleteTransicion($idflujo,$idtrans);
    }
}
