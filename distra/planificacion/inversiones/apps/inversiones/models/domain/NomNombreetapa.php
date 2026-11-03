<?php

class NomNombreetapa extends BaseNomNombreetapa {

    public function setUp() {
        parent :: setUp();
        $this->hasMany('DatEtapa', array('local' => 'idnombreetapa', 'foreign' => 'idnombreetapa'));
    }

    public function getByid($idnombreetapa) {
        return Doctrine::getTable('NomNombreetapa')->find($idnombreetapa);
    }

    public function getNommbreCompByidEtapa($param) {
        $query = new Doctrine_Query();
        return $query->select("ne.*")
                        ->from("NomNombreetapa ne")
                        ->where("ne.idnombreetapa=?", $param['idetapa'])
                        ->offset($param['start'])
                        ->limit($param['limit'])
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getNommbreComp($param) {
        $query = new Doctrine_Query();
        return $query->select("ne.*")
                        ->from("NomNombreetapa ne")
                        ->offset($param['start'])
                        ->limit($param['limit'])
                        ->orderBy("ne.idnombreetapa")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function getNommbreCompByidformatEtapa($param) {
        $query = new Doctrine_Query();
        $f = $param['filtros'];
        foreach ($f as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $query->addWhere("upper(ne.denominacion)  LIKE '%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'descripcion') {
                $query->addWhere("upper(ne.descripcion)  LIKE '%" . strtoupper($datos['data']['value']) . "%'");
            }
        }
        if ($param['idetapas']) {
            return $query->select("ne.*")
                            ->from("NomNombreetapa ne")
                            ->whereNotIn('ne.idnombreetapa', json_decode(stripslashes($param['idetapas'])))
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                            ->execute();
        } else {
            return $query->select("ne.*")
                            ->from("NomNombreetapa ne")
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                            ->execute();
        }
    }

    public function compExistente($param) {
        $query = new Doctrine_Query();
        return $query->select("ne.denominacion")
                        ->from("NomNombreetapa ne")
                        ->where("ne.denominacion=?", $param['denominacion'])
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

}
