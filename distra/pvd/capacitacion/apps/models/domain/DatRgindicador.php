<?php
class DatRgindicador extends BaseDatRgindicador
{
    public function setUp()
    {
        $this->hasOne(
            'NomIndicadoramedir', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasMany(
            'DatEvalrg', array('local' => 'idrgindicador', 'foreign' => 'idrgindicador')
        );
        parent::setUp();
    }

    public function getById($idrgindicador)
    {
        return Doctrine::getTable('DatRgindicador')->find($idrgindicador);
    }

    public function getIndicadores($idrgperiodo, $idreciengraduado, $identidad, $filtro, $inicio, $limite)
    {
        $per = (isset($idrgperiodo))?" AND v.idrgperiodo = '$idrgperiodo'":'';
        $queryObj = Doctrine_Query::create()
            ->select('im.*, im.denominacion as indicador, m.idrgindicador as idrgindicador, m.idreciengraduado, v.idvalorescala as idvalor')
            ->from('NomIndicadoramedir im')
            ->leftJoin("im.DatRgindicador m ON m.idindicador = im.idindicador AND m.idreciengraduado = '$idreciengraduado'")
            ->leftJoin("m.DatEvalrg v ON v.idrgindicador = m.idrgindicador". $per)
            ->where("im.identidad = '$identidad' AND im.fdesde <= now() and (now() <= im.fhasta or im.fhasta is null)")
            ->orderBy('m.fregistro ASC');
        if ($filtro) {
            $queryObj->addWhere("im.denominacion ilike '%$filtro%'");
        }
        if (!empty($inicio) && !empty($limite)) {
            $queryObj->start($inicio)
                ->limit($limite);
        }
        return $queryObj->fetchArray();
    }

    public function eliminarByIndicador($indicadores, $idreciengraduado)
    {
        $query = new Doctrine_Query();
        return $query->delete('DatRgindicador')
            ->where("idreciengraduado = '$idreciengraduado'")
            ->andWhereNotIn('idindicador', $indicadores)
            ->execute();
    }

    public function existeInd($idindicador, $idreciengraduado)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatRgindicador c')
            ->where("c.idindicador = '$idindicador' AND c.idreciengraduado = '$idreciengraduado'");
        return $queryObj->fetchArray();
    }
}