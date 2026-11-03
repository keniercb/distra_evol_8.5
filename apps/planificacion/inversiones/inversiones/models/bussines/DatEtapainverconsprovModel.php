<?php

class DatEtapainverconsprovModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function eliminarConstrucutorEtap($param, $params) {
        // try {
        $des = "Se eliminó el constructor de id: ";
        $model = new InversionesModel();
        $model->eliminarConstEnEtapa($param, $params);
        $model->guardarValorTotalConstuctoresEnEtapa($params);
        $collectionDatEtapainverconsprov = new Doctrine_Collection('DatEtapainverconsprov');
        foreach ($param as $index => $idelementotipomodelovalor) {
            $objetapinvconsprov = DatEtapainverconsprov::getByid($idelementotipomodelovalor); 
            $des = $des . " {$objetapinvconsprov->idconstructor} de la provincia: {$objetapinvconsprov->iddpt},";
//print_r('---');print_r($objetapinvconsprov->toArray());
            $collectionDatEtapainverconsprov[$index] = $objetapinvconsprov;
        }
        $collectionDatEtapainverconsprov->delete();

        //Insertar Traza
//        HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Constructor', 'eliminar', 'dat_etapinverconsprov', 
//                $params['idinversion'], $des, $params['idusuario']);
        return true;
        /* } catch (Doctrine_Exception $ee) {
          return '-4';
          } */
    }

    public function adicionarConstrucutorEtap($param, $idinvers, $idUser) {
        $des = "Se adicionó el constructor de id: ";
        $collectionDatEtapainverconsprov = new Doctrine_Collection('DatEtapainverconsprov');
        foreach ($param as $index => $datosConst) {

            $des = $des . " {$datosConst->denominacion} de la provincia: {$datosConst->denomdpt},";

            $objetapinvconsprov = new DatEtapainverconsprov();
            $objetapinvconsprov->idetapainversion = $datosConst->idetapainversion;
            $objetapinvconsprov->iddpt = $datosConst->iddpt;
            $objetapinvconsprov->idconstructor = is_numeric($datosConst->denominacion) ? $datosConst->denominacion : $datosConst->idconstructor;
            $collectionDatEtapainverconsprov[$index] = $objetapinvconsprov;
        }
        $collectionDatEtapainverconsprov->save();

        //Insertar Traza
//        HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Constructor', 'adicionar', 'dat_etapinverconsprov', $idinvers, $des, $idUser);
        return true;
        /* } catch (Doctrine_Exception $ee) {
          return '-4';
          } */
    }

}
