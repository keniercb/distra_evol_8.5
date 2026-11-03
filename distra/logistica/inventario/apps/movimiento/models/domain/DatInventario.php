<?php

class DatInventario extends BaseDatInventario
{
    public function setUp()
    {
        $this->hasOne(
            'DatDocumento', array(
                'foreign' => 'iddocumento', 'local' => 'idinventario'
            )
        );
        parent::setUp();
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(idinventario)')
            ->from('DatInventario')->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatInventario')->execute();
        return $result->toArray();
    }

    public function getJoinDatInventario(Doctrine_Query $query, $datosDoc, $aliasExterno, $aliasLocal = 'i')
    {
        if ($datosDoc['area']) {
            $query->addWhere('i.idarea = ?', $datosDoc['area']);
        }
        if ($datosDoc['tipoinventario']) {
            $query->addWhere('i.tipoinventario = ?', $datosDoc['tipoinventario']);
        }
        return $query->addSelect(
            "{$aliasLocal}.idinventario as idinventario,
             {$aliasLocal}.tipoinventario as tipoinventario,
             {$aliasLocal}.idarea as idarea,
             {$aliasLocal}.diario as diario,
             {$aliasLocal}.idperiodo as idperiodo"
        )->innerJoin("{$aliasExterno}.DatInventario {$aliasLocal}");
    }

    public function ObtenerInventarioDadoId($iddocumento)
    {
        return Doctrine_Query::create()->select(
                    'di.tipoinventario, di.idarea, dd.anno, dd.nrodoc, dd.numeroref, dd.idestructuracomun, '
                    . 'dd.observaciones, dd.idoperacion'
                )
                ->from('DatDocumento dd')
                ->innerJoin('dd.DatInventario di')
                ->where("di.idinventario = ?", array($iddocumento))
                ->fetchArray();
    }

    public function getNroDocInventario(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'i')
    {
        return $query->addSelect(
            "(case when {$aliasLocal}.idinventario IS NOT NULL then {$aliasExterno}.nrodoc else '-' end) as nrodoc"
        )->innerJoin(
            "{$aliasExterno}.DatInventario {$aliasLocal}"
        );
    }
}