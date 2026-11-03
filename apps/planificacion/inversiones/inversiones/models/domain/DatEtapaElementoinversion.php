<?php

class DatEtapaElementoinversion extends BaseDatEtapaElementoinversion {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasOne('DatEtapaInversion', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
        $this->hasMany('DatElementotipomodelovalor', array('local' => 'idelemento', 'foreign' => 'idetapaelementoinversion'));
    }

    public function getByid($idetapa) {
        return Doctrine::getTable(DatEtapaElementoinversion)->find($idetapa);
    }

    public function adicionarElemtInv($params) {
        $objdato = new DatEtapaElementoinversion();
        $objdato->idetapainversion = $params['idetapainversion'];
        $objdato->idelemento = $params['idelemento'];
        $objdato->save();
        return true;
    }

    public function deleteEt($parametros, $dat) {
        $query = new Doctrine_Query();
        $aux = $query->delete()
                ->from('DatEtapaElementoinversion ')
                ->where('idetapainversion=? ', array($parametros['idetapainversion']))
                ->execute();
        return $aux;
    }

    public function getIdelementotipomodelovalor($idelemento) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                n.idelementotipomodelovalor
              FROM
                mod_planifinversiones.dat_etapaelementoinversion e
                LEFT OUTER JOIN mod_planifinversiones.dat_elementotipomodelovalor n ON (e.idetapaelementoinversion = n.idelemento)
              WHERE
                e.idelemento = " . $idelemento;
        $datosListar = $conn->execute($sql);
        return $datosListar->fetchAll(PDO::FETCH_ASSOC);
    }

    public function elementoEnUso($param) {
        $bandera = 1;
        $query = new Doctrine_Query();
        foreach ($param as $elemento) {
            $aux = $query->select('de.idelemento')
                    ->from('DatEtapaElementoinversion de')
                    ->where('de.idelemento = ? ', array($elemento))
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            if (count($aux) > 0) {
                $bandera = 0;
                break;
            }
        }
        return $bandera;
    }

}
