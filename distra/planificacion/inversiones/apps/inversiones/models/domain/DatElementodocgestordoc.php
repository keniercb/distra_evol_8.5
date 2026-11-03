<?php

class DatElementodocgestordoc extends BaseDatElementodocgestordoc {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapaElementoinversion', array('local' => 'idetapaelementoinversion', 'foreign' => 'idetapaelementoinversion'));
    }

    public function getByid($idelementodocgestordoc) {
        return Doctrine::getTable('DatElementodocgestordoc')->find($idelementodocgestordoc)->toArray();
    }

    public function listarGestionarDoc($params, $val) {

        $objdatoinversion = new DatElementodocgestordoc();
        $objdatoinversion->idetapaelementoinversion = $params['idelemento'];
        $objdatoinversion->idcontenido = $val;
        $objdatoinversion->save();
        $idinversion = $objdatoinversion->idelementodocgestordoc;
        return $idinversion;
    }

    public function adicionar($params) {

        $objElementoGestor = new DatElementodocgestordoc();
        $objElementoGestor->idetapaelementoinversion = $params['idelemento'];
        $objElementoGestor->idcontenido = $params['idcontenido'];
        $objElementoGestor->save();
        $idelementodocgestordoc = $objElementoGestor->idelementodocgestordoc;
        return $idelementodocgestordoc;
    }

    public function EliminarDoc($id) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatElementodocgestordoc')
                        ->where('idelementodocgestordoc=?', array($id))
                        ->execute();
    }

    public function EliminarDocdadoIdElem($id) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatElementodocgestordoc')
                        ->where('idetapaelementoinversion=?', array($id))
                        ->execute();
    }

    public function contenidoPorIdEle($idelemento) {
        $query = new Doctrine_Query();
        $datos = $query->select("de.idcontenido")
                ->from("DatElementodocgestordoc de")
                ->addWhere("de.idetapaelementoinversion=?", $idelemento)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    public function contenidoPorIdEtapa($idetapa) {
        $query = new Doctrine_Query();
        $datos = $query->select("de.idelementodocgestordoc")
                ->from("DatElementodocgestordoc de")
                ->innerJoin('de.DatEtapaElementoinversion n')
                ->addWhere("n.idetapainversion=?", $idetapa)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    public function deleteElemDoc($dat) {
        $conn = Doctrine_Manager::connection();
        if ($dat != 0) {
            $sql = "DELETE FROM mod_planifinversiones.dat_elementodocgestordoc"
                    . " WHERE (idelementodocgestordoc =" . $dat . ")";
            $conn->execute($sql);
            return true;
        } else {
            return false;
        }
    }

    public function validarExistencia($idelemento) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT e.idelementodocgestordoc
				FROM mod_planifinversiones.dat_elementodocgestordoc e
				WHERE e.idetapaelementoinversion = " . $idelemento;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}
