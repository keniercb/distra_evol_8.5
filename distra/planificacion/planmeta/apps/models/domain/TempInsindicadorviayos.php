<?php
class TempInsindicadorviayos extends BaseTempInsindicadorviayos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local' => 'iddatosnomenclador','foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
            'NomIndicador', array('local' => 'codigo', 'foreign' => 'codigo')
        );
    }

    public function getConceptoSql($idesplogueada, $iddatosnomAexcluiruno, $iddatosnomAexcluirDos, $start,
        $limit, $arrayFiltros, $tablatemporal, $contar = null
    )
    {
        if (is_array($arrayFiltros)) {
            foreach ($arrayFiltros as $k => $valor) {
                unset($arrayFiltros[$k]);
                $arrayFiltros[$k]['field'] = $valor->field;
                $arrayFiltros[$k]['data']['comparison']
                    = $valor->data->comparison;
                $arrayFiltros[$k]['data']['type'] = $valor->data->type;
                $arrayFiltros[$k]['data']['value'] = $valor->data->value;
            }
        }
        $where = DatImportarModel::SqlFiltros($arrayFiltros, "tinvos.");
        if ($where != '') {
            $where = "AND " . $where;
        }
        $query = Doctrine_Query::create();
        $query->from($tablatemporal . ' tinvos');
        $query->addWhere(
            'tinvos.iddatosnomenclador is null
            OR (tinvos.iddatosnomenclador <> ?
            AND tinvos.iddatosnomenclador <> ? ) ',
            array($iddatosnomAexcluiruno, $iddatosnomAexcluirDos)
        );
        $query->addWhere("tinvos.idespecialidad = ? {$where}", $idesplogueada);
        if ($contar) {
            $query->select('COUNT(tinvos.idinsindicadorviayos) as total');
            $res = $query->execute()->toArray();
            return $res[0]['total'];
        }
        $query->leftJoin('tinvos.NomIndicador ind');
        $query->leftjoin('ind.DatIndicadorviaadquisicion via')
            ->leftjoin(
                "via.DatIndicadorviaadquisicionorganosatisface dn WITH via.idindicador = dn.idindicador"
            );
        $query->offset($start)->limit($limit)->orderby('codigo');
        return $query->execute();
    }

}
