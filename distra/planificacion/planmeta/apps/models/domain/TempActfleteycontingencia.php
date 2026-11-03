<?php

class TempActfleteycontingencia extends BaseTempActfleteycontingencia
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local'   => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'NomIndicador', array('local' => 'codigo', 'foreign' => 'codigo')
        );
    }

    public function getConcepto($idesplogueada, $iddatosnomaexcluir, $start,
        $limit, $contar = null
    ) 
    {
        $query = Doctrine_Query::create();
        $query->from('TempActfleteycontingencia ip');
        $query->addWhere(
            '( ip.iddatosnomenclador is null OR ( ip.iddatosnomenclador <> ? 
                AND ip.iddatosnomenclador <> ? )) AND ip.idespecialidad = ? ',
            array($iddatosnomaexcluir[0], $iddatosnomaexcluir[1],
                  $idesplogueada)
        );
        if ($contar) {
            return $query->select('COUNT(ip.idactfleteycontingencia) as total')
                ->execute()->getFirst()->total;
        }
        $query->offset($start)
            ->limit($limit);
        $arraycolltempindp = $query->execute();
        $arraycods = array();
        foreach ($arraycolltempindp as $valor) {
            $arraycods[] = $valor->codigo;
        }

        $arraycollnomind = array();
        if ($arraycods[0] != null) {
            $queryind = Doctrine_Query::create();
            $queryind->from('NomIndicador ind');
            $queryind->whereIn('ind.codigo', $arraycods);
            $arraycollnomind = $queryind->execute();
        }

        $arrayCollNomindplanif = array();
        if ($arraycods[0] != null) {
            $queryTres = Doctrine_Query::create();
            $queryTres->from('NomIndicadorplanif indp');
            $queryTres->innerJoin('indp.NomIndicador ind');
            $queryTres->whereIn('ind.codigo', $arraycods);
            $arrayCollNomindplanif = $queryTres->execute();
        }

        $arraylocalizacion = array();
        foreach ($arraycollnomind as $indicenomind => $valor) {
            $arraylocalizacion['cod' . $valor->codigo] = array('ok',
                                                                $indicenomind);
        }
        return array('tempind'      => $arraycolltempindp,
                     'nomind'       => $arraycollnomind,
                     'nomindplanif' => $arrayCollNomindplanif,
                     'localizacion' => $arraylocalizacion);
    }

}
