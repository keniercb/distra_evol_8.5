<?php

class NomColumna extends BaseNomColumna {

    public function setUp() {
        parent::setUp();

        $this->hasMany(
                'NomTipomodelocolumna', array('local' => 'idcolumna', 'foreign' => 'idcolumna'));
    }

    //Se emplea desde tipo de modelo
    public function getTodosActivos() {
        $query = new Doctrine_Query();
        $result = $query->select('n.denominacion,n.idcolumna')
                        ->from('NomColumna n')->execute();
        return $result->toArray();
    }

//Se emplea desde tipo de modelo dado un idtipomodelo
    public function getTodosActivosXIdTM($idtipomodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('n.denominacion,n.idcolumna')
                ->from('NomColumna n')
                ->where('n.idcolumna NOT IN 
                    (SELECT tmc.idcolumna
                        FROM NomTipomodelocolumna tmc 
                        WHERE tmc.idtipomodelo = ?)', $idtipomodelo)
                ->orderby('n.denominacion')
                ->execute();
        return $result->toArray();
    }

    public function Listar($parametros, $start, $limit, $idtipomodelo) {
        $query = new Doctrine_Query();
        $query->from('NomColumna n');
        $querytotal = new Doctrine_Query();
        //costruyo el filtro
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                        $querytotal->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } elseif ($p == 'enuso') {
                        if ($s == 1) {
                            $query->addWhere('n.idcolumna in (SELECT ntc.idcolumna FROM NomTipomodelocolumna ntc )');
                            $querytotal->addWhere('n.idcolumna in (SELECT ntc.idcolumna FROM NomTipomodelocolumna ntc )');
                        } else {
                            $query->addWhere('n.idcolumna not in (SELECT ntc.idcolumna FROM NomTipomodelocolumna ntc)');
                            $querytotal->addWhere('n.idcolumna not in (SELECT ntc.idcolumna FROM NomTipomodelocolumna ntc)');
                        }
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
                            $querytotal->addWhere("upper(n.descripcion) LIKE '%" . strtoupper($s) . "%'");
                        }
                    }
                }
            }
        }
        if ($idtipomodelo) {
            $query->addWhere('n.idcolumna NOT IN 
                    (SELECT tmc.idcolumna
                        FROM NomTipomodelocolumna tmc 
                        WHERE tmc.idtipomodelo = ?)', $idtipomodelo);
            $querytotal->addWhere('n.idcolumna NOT IN 
                    (SELECT tmc.idcolumna
                        FROM NomTipomodelocolumna tmc 
        WHERE tmc.idtipomodelo = ?)', $idtipomodelo);
        }

        if ($parametros['denominacion'] == null && $parametros['enuso'] == null) {
            $data->data = $query->select("n.idcolumna,n.denominacion,n.descripcion")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy('n.denominacion,n.descripcion')
                    ->execute()
                    ->toArray(true);
        } else {
            $data->data = $query->select("n.idcolumna,n.denominacion,n.descripcion")
                    ->offset($start)
                    ->limit($limit)
                    ->orderBy('n.denominacion,n.descripcion')
                    ->execute()
                    ->toArray(true);
        }

        $data->total = $querytotal
                        ->select('COUNT(n.idcolumna) as total')
                        ->from('NomColumna n')
                        ->execute()->getFirst()->total;
        return $data;
    }

    public function BuscarHijos($idcolumna) {
        $query = new Doctrine_Query();
        return $query->from('NomColumna n')
                        ->where('n.idcolumna<>?', array($idcolumna))
                        ->execute()
                        ->toArray();
    }

    //Para obtener la cantidad total de elementos en BD
    public function cantidad() {
        $query = Doctrine_Query:: create();
        return $query->select('COUNT(idcolumna) as total')->from('NomColumna')
                        ->execute()->getFirst()->total;
    }

    public function validarDenominacion($denominacion, $idcolumna) {
        $query = new Doctrine_Query();
        if ($idcolumna) {
            $columna = Doctrine::getTable('NomColumna')->find($idcolumna);
            if (strtolower($denominacion) != strtolower($columna->denominacion)) {
                return $query->from('NomColumna n')
                                ->where("n.denominacion = ?", $denominacion)
                                ->execute()->toArray();
            } else {
                return array();
            }
        }
        return $query->from('NomColumna n')
                        ->where(strtolower("n.denominacion = ?"), strtolower($denominacion))
                        ->execute()->toArray();
    }

    public function getPorDenominacion($denominacion) {
        $query = new Doctrine_Query();
        $result = $query->select('n.denominacion,n.idcolumna')
                ->from('NomColumna n')
                ->where("upper(n.denominacion) LIKE ?", strtoupper($denominacion))
                ->execute();
        return $result;
    }

    public function getDenominacionDadoIdColumna($idcolumna) {
        $query = new Doctrine_Query();
        $res = $query->select('n.denominacion')
                ->from('NomColumna n')
                ->where('n.idcolumna =?', $idcolumna)
                ->execute()
                ->toArray();
        return $res;
    }

    public function verificarexistetcia($denominacion, $idcolumna) {
        $query = new Doctrine_Query();
        if ($idcolumna) {
            $columna = Doctrine::getTable('NomColumna')->find($idcolumna);
            $idp = $query->from('NomColumna n')
                            ->where("upper(n.denominacion) = ?", trim(strtoupper($denominacion)))
                            ->execute()->toArray();
            if (trim(strtolower($denominacion)) != trim(strtolower($columna->denominacion))) {
                if ($idcolumna == $idp['idcolumna']) {
                    return array();
                } else {
                    return $idp;
                }
            } else {
                return array();
            }
        }
        return $query->from('NomColumna n')
                        ->where("upper(n.denominacion) = ?", trim(strtoupper($denominacion)))
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute(
        );
    }

    public function verEnUso($idcolumna) {
        $query = new Doctrine_Query();
        $result = $query->select('n.idcolumna')
                ->from('NomTipomodelocolumna n')
                ->where('n.idcolumna =?', $idcolumna)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function exiteColumnaEnTipoDeModelo($idcolumna) {
        $query = new Doctrine_Query();
        $arr = $query->select('n.idcolumna')
                ->from('NomTipomodelocolumna n')
                ->where('n.idcolumna= ?', $idcolumna)
                ->execute()
                ->toArray();

        if ($arr[0]['idcolumna'] != null) {
            return true;
        }
        return false;
    }

    public function buscarDenominacion($idcolumna) {
        $query = new Doctrine_Query();
        $result = $query->select('n.denominacion')
                ->from('NomColumna n')
                ->where('n.idcolumna =?', $idcolumna)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

}
