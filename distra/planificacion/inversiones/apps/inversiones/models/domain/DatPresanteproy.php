<?php

class DatPresanteproy extends BaseDatPresanteproy {

    public function setUp() {
        parent :: setUp();
    }

    public function EliminarDadoIdP($id) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatPresanteproy')
                        ->whereIn('idpresanteproy', $id)
                        ->execute();
        return false;
    }

    public function adicionarPre($params, $arre) {
        $objdato = new DatPresanteproy();
        $objdato->idinversion = $params['id'];
        $objdato->idmonedaentidad = $arre['idmoneda'];
        $objdato->valor = $arre['valor'];
        $objdato->save();
        $idinversion = $objdato->idinversion;
        return $idinversion;
    }

    public function adicionarPreMod($params, $arre, $objPRE) {
        $objdato = $objPRE;
        $objdato->idinversion = $params['id'];
        $objdato->idmonedaentidad = $arre['idmoneda'];
        $objdato->valor = $arre['valor'];
        $objdato->save();
        $idinversion = $objdato->idinversion;
        return $idinversion;
    }

    public function EliminarP($id) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT de.idpresanteproy
				FROM mod_planifinversiones.dat_presanteproy de
				WHERE de.idinversion = " . $id;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        if ($datos[0] != "") {
            $query = new Doctrine_Query();
            return $query->delete()
                            ->from('DatPresanteproy')
                            ->where('idinversion=?', array($id))
                            ->execute();
        } else {
            return false;
        }
    }

    function obtenerMonedaRepetida($moneda, $idinversion) {

        foreach ($moneda as $key => $data) {
            $array[$key] = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
        }
        $query = Doctrine_Query::create();
        $query->from('DatPresanteproy n')
                ->whereIn('n.idmonedaentidad', $array)
                ->addwhere(' n.idinversion=?', $idinversion)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        if ($result == null) {
            $cont = 1;
        } else {
            foreach ($result as $key => $dato) {
                foreach ($moneda as $key => $datas) {
                    if ($dato['idmonedaentidad'] != $datas->moneda) {
                        $cont = 1;
                    }
                }
            }
        }

        if ($cont == 1) {
            return true;
        } else {
            return false;
        }
    }

    function obtenerMonedaRepetidaMod($moneda, $idinversion, $idpresanteproy) {
        foreach ($moneda as $key => $data) {
            $array[$key] = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
        }
        $query = Doctrine_Query::create();
        $query->from('DatPresanteproy n')
                ->whereIn('n.idmonedaentidad', $array)
                ->addwhere(' n.idinversion=?  AND n.idpresanteproy<>?', array($idinversion, $idpresanteproy))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }


    function getPlanPreparacionByInversion($idinversion) {

        $query = Doctrine_Query::create();
        $query->from('DatPresanteproy n')
            ->whereIn('n.idinversion', $idinversion)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

}

