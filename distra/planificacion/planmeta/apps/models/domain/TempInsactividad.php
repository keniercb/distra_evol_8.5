<?php

class TempInsactividad extends BaseTempInsactividad {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'NomActividad', array('local' => 'codigo', 'foreign' => 'codigo')
        );
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    ) {
        $query = Doctrine_Query::create();
        $query->from('TempInsactividad ia')->addWhere(
                'ia.iddatosnomenclador is null OR ia.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                            ->select('COUNT(ia.idinsactividad ) as total')
                            ->execute()->getFirst()->total;
        } else {
            $arrayparalelo = array();
            $arrayobjstempInsactvs = $query
                    ->orderby('ia.codigo')
                    ->offset($start)->limit($limit)
                    ->execute();


            $arraycodsactvs = array();
            foreach ($arrayobjstempInsactvs as $key => $valor) {
                $arraycodsactvs[] = $valor->codigo;
            }

            if ($arraycodsactvs[0] != null) {
                $query = Doctrine_Query::create();
                $query->from('NomActividad act');
                $query->whereIn('codigo', $arraycodsactvs);
                $query->select('act.idactividad,act.codigo');
                $arrayacts = $query->execute()->toArray();
                unset($arraycodsactvs);
                $arraycods = array();
                foreach ($arrayacts as $key => $valact) {
                    unset($arrayacts[$key]);
                    $arraycods['cod' . $valact['codigo']] = $valact;
                }
                unset($arrayacts);
                foreach ($arrayobjstempInsactvs as $indice => $valtempact) {
                    $arrayparalelo[$indice]['idactividad'] = $arraycods['cod'
                            . $valtempact->codigo]['idactividad'];
                }
            }
        }
        return array($arrayobjstempInsactvs, $arrayparalelo);
    }

    public function getConceptosNew($iddatosnomaexcluir, $abrev, $buscarPadres = true, $start = 0, $limit = 10000, $iscount = null) {
        $query = Doctrine_Query::create();
        $query->from('TempInsactividad ia')
                ->addWhere('ia.iddatosnomenclador is null OR ia.iddatosnomenclador <> ?', $iddatosnomaexcluir);
        if (!$buscarPadres) {
            //Filtrando por "niveles", para trabajar en forma de árbol
            $query->addWhere('ia.nivel is null OR ia.nivel = ?', $abrev);
        }
        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                            ->select('COUNT(ia.idinsactividad ) as total')
                            ->execute()->getFirst()->total;
        } else {
            $arrayparalelo = array();
            $arrayobjstempInsactvs = $query
                    ->orderby('ia.codigo')
                    ->offset($start)->limit($limit)
                    ->execute();

            $arraycodsactvs = array();
            if ($buscarPadres) {
                //Acomodando los codigos de las actividades temporales como posibles padres
                foreach ($arrayobjstempInsactvs as $key => $valor) {
                    $arraycodsactvs[$valor->codigo]['codigo'] = $valor->codigo;
                    $arraycodsactvs[$valor->codigo]['iddatosnomenclador'] = $valor->iddatosnomenclador;
                }
                return $arraycodsactvs;
            }
            //Acomodando los codigos de las actividades temporales en un arreglo para buscar si ya existen
            foreach ($arrayobjstempInsactvs as $key => $valor) {
                $arraycodsactvs[] = $valor->codigo;
            }
            //Buscando si ya existen estas actividades
            if ($arraycodsactvs[0] != null) {
                $query = Doctrine_Query::create();
                $query->from('NomActividad act');
                $query->whereIn('codigo', $arraycodsactvs);
                $query->select('act.idactividad,act.codigo');
                $arrayacts = $query->execute()->toArray();
                //Acomodando las actividades ya existentes en un arreglo
                $arraycods = array();
                foreach ($arrayacts as $key => $valact) {
                    unset($arrayacts[$key]);
                    $arraycods[$valact['codigo']] = $valact;
                }
                unset($arrayacts);
            }
        }
        return array($arrayobjstempInsactvs, $arraycods);
    }

}
