<?php

class DatFinanciamiento extends BaseDatFinanciamiento {

    public function setUp() {
        parent :: setUp();
    }

    public function adicionarFinan($params, $arre, $objFinan) {
        $objdatoinversion = $objFinan ? $objFinan : new DatFinanciamiento();
        //	$objdatoinversion = new DatFinanciamiento();
        $objdatoinversion->idinversion = $params['id'];
        $objdatoinversion->idmonedaentidad = $arre['idmoneda'];
        $objdatoinversion->idtipofinanciamiento = $arre['tipo'];
        $objdatoinversion->idfinancista = $arre['financista'];
        $objdatoinversion->valor = $arre['valor'];
        $objdatoinversion->porcientointeres = $arre['porcientointeres'];
        $objdatoinversion->plazoamortizacion = $arre['plazoamortizacion'];
        $objdatoinversion->gracia = $arre['gracia'];
        $objdatoinversion->save();
        return 1;
    }

    public function EliminarF($id) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT de.idfinanciamiento
				FROM mod_planifinversiones.dat_financiamiento de
				WHERE de.idinversion = " . $id;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        if ($datos[0] != "") {
            $query = new Doctrine_Query();
            return $query->delete()
                            ->from('DatFinanciamiento')
                            ->where('idinversion=?', array($id))
                            ->execute();
        } else {
            return false;
        }
    }

    public function EliminarDadoIdF($id) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatFinanciamiento')
                        ->whereIn('idfinanciamiento', $id)
                        ->execute();
        return false;
    }

    function obtenerMonedaRepetidaFin($moneda, $idinversion) {
        foreach ($moneda as $key => $data) {
            $array[$key] = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
        }
        $query = Doctrine_Query::create();
        $query->from('DatFinanciamiento n')
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
        if ($cont >= 1) {
            return true;
        } else {
            return false;
        }
    }

    function obtenerMonedaRepetidaModFin($moneda, $idinversion, $idfinanciamiento) {
        foreach ($moneda as $key => $data) {
            $array[$key] = is_numeric($data->moneda) ? $data->moneda : $data->idmonedaentidad;
        }
        $query = Doctrine_Query::create();
        $query->from('DatFinanciamiento n')
                ->whereIn('n.idmonedaentidad', $array)
                ->addwhere(' n.idinversion=?  AND n.idfinanciamiento<>?', array($idinversion, $idfinanciamiento))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    function obtenerFinancistaRepetida($financi, $idinversion) {
        foreach ($financi as $key => $data) {
            $array[$key] = is_numeric($data->financi) ? $data->financi : $data->idfinancista;
        }
        $query = Doctrine_Query::create();
        $query->from('DatFinanciamiento n')
                ->whereIn('n.idfinancista', $array)
                ->addwhere(' n.idinversion=?', $idinversion)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        if ($result == null) {
            $cont = 1;
        } else {
            foreach ($result as $key => $dato) {
                foreach ($financi as $key => $datas) {
                    if ($dato['idfinancista'] != $datas->financi) {
                        $cont = 1;
                    }
                }
            }
        }
        if ($cont >= 1) {
            return true;
        } else {
            return false;
        }
    }

    function obtenerFinancistaRepetidaMod($financi, $idinversion, $idfinanciamiento) {
        foreach ($financi as $key => $data) {
            $array[$key] = is_numeric($data->financi) ? $data->financi : $data->idfinancista;
        }
        $query = Doctrine_Query::create();
        $query->from('DatFinanciamiento n')
                ->whereIn('n.idfinancista', $array)
                ->addwhere(' n.idinversion=?  AND n.idfinanciamiento<>?', array($idinversion, $idfinanciamiento))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    function obtenerTipoFinancistaRepetida($tipo, $idinversion) {
        foreach ($tipo as $key => $data) {
            $array[$key] = is_numeric($data->tipo) ? $data->tipo : $data->idtipofinanciamiento;
        }
        $query = Doctrine_Query::create();
        $query->from('DatFinanciamiento n')
                ->whereIn('n.idtipofinanciamiento', $array)
                ->addwhere(' n.idinversion=?', $idinversion)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        if ($result == null) {
            $cont = 1;
        } else {
            foreach ($result as $key => $dato) {
                foreach ($tipo as $key => $datas) {
                    if ($dato['idtipofinanciamiento'] != $datas->tipo) {
                        $cont = 1;
                    }
                }
            }
        }

        if ($cont >= 1) {
            return true;
        } else {
            return false;
        }
    }

    function obtenerTipoFinancistaRepetidaMod($tipo, $idinversion, $idfinanciamiento) {
        foreach ($tipo as $key => $data) {
            $array[$key] = is_numeric($data->tipo) ? $data->tipo : $data->idtipofinanciamiento;
        }
        $query = Doctrine_Query::create();
        $query->from('DatFinanciamiento n')
                ->whereIn('n.idtipofinanciamiento', $array)
                ->addwhere(' n.idinversion=?  AND n.idfinanciamiento<>?', array($idinversion, $idfinanciamiento))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    function buscarfinanDadoTipoF($idfinanciamiento) {
        $query = Doctrine_Query::create();
        $query->select('n.idtipofinanciamiento,n.idfinancista,n.porcientointeres,n.valor, n.idmonedaentidad, n.gracia, n.plazoamortizacion')
                ->from('DatFinanciamiento n')
                ->whereIn('n.idfinanciamiento', $idfinanciamiento)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    function buscartipoF($idfinanciamiento, $idinv) {
        $query = Doctrine_Query::create();
        $query->select('n.idfinanciamiento')
                ->from('DatFinanciamiento n')
                ->where('n.idtipofinanciamiento=? and n.idinversion=? and n.porcientointeres <> 0', array($idfinanciamiento, $idinv))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    function buscarFinancista($idfinancista, $idinv) {
        $query = Doctrine_Query::create();
        $query->select('n.idfinanciamiento')
                ->from('DatFinanciamiento n')
                ->where('n.idfinancista=? and n.idinversion=?', array($idfinancista, $idinv))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

//

    function presuTFinanci($idmoneda, $idinversion, $porciento) {
        $con = Doctrine_Manager::connection();
        if ($porciento == 0) {
            $ADDWHERE = " dfi.porcientointeres > 0";
        } else {
            $ADDWHERE = " dfi.porcientointeres = 0";
        }
        $query = " SELECT 
                            sum(dfi.valor) total
                        FROM mod_planifinversiones.dat_financiamiento dfi
                        INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dfi.idmonedaentidad = dme.idmonedaentidad)
                        WHERE dme.idmoneda = $idmoneda and $ADDWHERE  and dfi.idinversion = $idinversion
                        "; //print_r($query);
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}