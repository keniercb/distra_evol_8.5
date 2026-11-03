<?php

class NomNombreetapaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarNomComponentesByidetapa($param) {
        return NomNombreetapa::getNommbreCompByidEtapa($param);
    }

    public function cargarNomComponentesByiformatodetapa($param) {
        return NomNombreetapa::getNommbreCompByidformatEtapa($param);
    }

    public function mismoComponentes($param) {
        $denomExiste = NomNombreetapa::compExistente($param);
        return (count($denomExiste) > 0) ? true : false;
    }

    public function addModNomComponentes($param) {
        if ($param['addMod'] == 0)
            $objNomNombreetapa = NomNombreetapa::getByid($param['idcomponente']);
        else
            $objNomNombreetapa = new NomNombreetapa();
        $objNomNombreetapa->denominacion = $param['denominacion'];
        $objNomNombreetapa->descripcion = $param['descripcion'];
        $objNomNombreetapa->save();
        return true;
    }

    public function getCompById($param) {
        return NomNombreetapa::getByid($param['idnombrecomponente'])->toArray();
    }

    public function eliminarComponente($param) {
        try {
            $collectionComp = new Doctrine_Collection('NomNombreetapa');
            foreach ($param as $index => $value) {
                $objNomnombreetapa = NomNombreetapa::getByid($value);
                $collectionComp[$index] = $objNomnombreetapa;
            }
            $collectionComp->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503)
                return '-4';
        }
    }
}
