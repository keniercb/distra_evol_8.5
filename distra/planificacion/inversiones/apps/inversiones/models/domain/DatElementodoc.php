<?php

class DatElementodoc extends BaseDatElementodoc {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
    }

    public function getByid($idelementodoc) {
        return Doctrine::getTable('DatElementodoc')->find($idelementodoc)->toArray();
    }

    public function getDocByidelemento($param) {
        $query = new Doctrine_Query();
        return $query->select("ded.*")
                        ->from("DatElementodoc ded")
                        ->Where('ded.idelemento=?', $param['idelemento'])
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function buscarDocumentoByElemento($idElemeto) {
        $conn = Doctrine_Manager::connection();
        $sql = "select ed.*
                FROM mod_planifinversiones.dat_elementodoc ed where ed.idelemento = $idElemeto";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        //print_r();die;
        return $datos;
    }

    public function guardarElementodoc($param) {
        $objElementoDoc = new DatElementodoc();
        $objElementoDoc->idelemento = $param['idelemento'];
        $objElementoDoc->iddocumentos = $param['iddocumento'];
        $objElementoDoc->save();

        $idelementodoc = $objElementoDoc->idelementodoc;
        if($idelementodoc){
            $objElemento = Doctrine::getTable('DatElemento')->find($param['idelemento']);
            $objElemento->documento = 1;
            $objElemento->save();
        }
        return $idelementodoc;
    }

    public function updateElementodoc($param) {

        $elemento = Doctrine::getTable('DatElementodoc')->findByDql("idelemento = {$param['idelemento']}");
        $objElementoDoc = Doctrine::getTable('DatElementodoc')->find($elemento->toArray()[0]['idelementodoc']);
        $objElementoDoc->iddocumentos = $param['iddocumento'];
        $objElementoDoc->save();

        $idelementodoc = $objElementoDoc->idelementodoc;
        return $idelementodoc;
    }



}
