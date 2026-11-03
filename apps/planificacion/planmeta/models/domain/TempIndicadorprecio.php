<?php

class TempIndicadorprecio extends BaseTempIndicadorprecio {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'NomIndicador', array('local' => 'codigo', 'foreign' => 'codigo')
        );
    }

    public function getConcepto($idespLoguada, $iddatosnomAexcluir, $start, $limit, $contar = null
    ) {
        $query = Doctrine_Query::create();
        $query->from('TempIndicadorprecio ip');
        $query->addWhere(
                '( ip.iddatosnomenclador is null
            OR ( ip.iddatosnomenclador <> ?
            AND ip.iddatosnomenclador <> ? )) AND ip.idespecialidad = ? ', array($iddatosnomAexcluir[0], $iddatosnomAexcluir[1],
            $idespLoguada)
        );
        if ($contar) {
            return $query->select('COUNT(ip.idindicador) as total')->execute()
                            ->getFirst()->total;
        }
        $query->offset($start)
                ->limit($limit);
        $arrayCollTempindp = $query->execute();
        $arrayCods = array();
        foreach ($arrayCollTempindp as $valor) {
            $arrayCods[] = $valor->codigo;
        }
        $arrayCollNomind = array();
        if ($arrayCods[0] != null) {
            $queryDos = Doctrine_Query::create();
            $queryDos->from('NomIndicador ind');
            $queryDos->whereIn('ind.codigo', $arrayCods);
            $queryDos->orderBy('ind.codigo');
            $arrayCollNomind = $queryDos->execute();
        }
        $arrayCollNomindplanif = array();
        if ($arrayCods[0] != null) {
            $queryTres = Doctrine_Query::create();
            $queryTres->from('NomIndicadorplanif indp');
            $queryTres->innerJoin('indp.NomIndicador ind');
            $queryTres->whereIn('ind.codigo', $arrayCods);
            $queryTres->orderBy('ind.codigo');
            $arrayCollNomindplanif = $queryTres->execute();
        }
        $arrayCollNomindhoja = array();
        if ($arrayCods[0] != null) {
            $queryCuatro = Doctrine_Query::create();
            $queryCuatro->from('NomIndicadorhoja indh');
            $queryCuatro->innerJoin('indh.NomIndicador i');
            $queryCuatro->innerJoin('i.NomIndicadorplanif indp');
            $queryCuatro->where('i.nivel = ?', 4);
            $queryCuatro->whereIn('i.codigo', $arrayCods);
            $queryCuatro->orderBy('i.codigo');
            $arrayCollNomindhoja = $queryCuatro->execute();
        }
        $arrayLocalizacion = array();
        foreach ($arrayCollNomind as $indiceNomind => $valor) {
            $arrayLocalizacion['cod' . $valor->codigo] = array('ok',
                $indiceNomind);
        }

        return array('tempind' => $arrayCollTempindp,
            'nomind' => $arrayCollNomind,
            'nomindplanif' => $arrayCollNomindplanif,
            'nomindhoja' => $arrayCollNomindhoja,
            'localizacion' => $arrayLocalizacion);
    }

    public function obtenerPrecio($idindicador)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT
  ip.precio
FROM
  mod_datosmaestros.nom_indicador i
  inner join mod_planifimportacion.temp_indicadorprecio ip on(i.codigo=ip.codigo)
  where i.idindicador=$idindicador";
        $res = $conn->execute($sql);
        $data = $res->fetchAll(PDO::FETCH_COLUMN);

        return $data;
    }

}
