<?php

class DatCargadocumento extends BaseDatCargadocumento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipomaterial',
            array('local' => 'idtipomaterial', 'foreign' => 'idtipomaterial')
        );
    }

    function listarTodos()
    {
        $list = Doctrine::getTable('DatCargadocumento')->findAll(
            Doctrine::HYDRATE_ARRAY
        );
        return $list;
    }

    function listarDocumentosConTipomaterial($parametros)
    {

        $query = new Doctrine_Query();
        $queryTotal = new Doctrine_Query();


        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {

                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                            "upper(dacd.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                        $queryTotal->addWhere(
                            "upper(dacd.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'tipomaterial') {
                        $query->addWhere(
                            "upper(dacd.idtipomaterial)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                        $queryTotal->addWhere(
                            "upper(dacd.idtipomaterial)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'cargo') {
                        $query->addWhere(
                            "upper(dacd.idcargadocumento)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                        $queryTotal->addWhere(
                            "upper(dacd.idcargadocumento)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'fecha') {
                        $query->addWhere(
                            "upper(dacd.fecha)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                        $queryTotal->addWhere(
                            "upper(dacd.fecha)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'hora') {
                        $query->addWhere(
                            "upper(dacd.hora)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                        $queryTotal->addWhere(
                            "upper(hora)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    }
                }
            }
        }
        $res = $query->select(
            'dacd.denominacion, dacd.idtipomaterial , dacd.idcargadocumento, dacd.fecha, dacd.hora'
        )->from('DatCargadocumento dacd')->orderby('dacd.denominacion')
            ->offset($parametros['start'])->limit($parametros['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $total = $queryTotal->Select('COUNT(dacd.denominacion)')
            ->from('DatCargadocumento dacd')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $res[20]['total'] = $total[0]['COUNT'];
        return $res;
    }

    function obtenerDocumentoDadoId($iddocumento)
    {
        $documento = Doctrine::getTable('DatCargadocumento')->find(
            $iddocumento
        );
        return $documento;
    }

    function eliminarDocumento($denominacion)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatCargadocumento')->from('DatCargadocumento')
            ->where('denominacion = ?', $denominacion)->execute();
    }

}
