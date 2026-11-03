<?php
class DatSubtipobalancebalanceactividad
    extends BaseDatSubtipobalancebalanceactividad
{

    public function setUp()
    {
        parent::setUp();

        $this->hasMany(
            'NomActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasMany(
            'DatSubtipobalancebalance',
            array('local' => 'idsubtipobalancebalance',
                  'foreign' => 'idsubtipobalancebalance')
        );
    }

    private function addWhereConParams(&$where, $columCond,
        $param
    )
    {
        $where .= " AND " . $columCond . $param;
    }

    public function listarAsociaciones($params, $idsubtipobalancebalance,
        $identidad, $idejercicio
    )
    {
        $conn = Doctrine_Manager::connection();
        $condiciones = array();
        $addwhere = "";
        $ADDWHERE = "";
        $paramsQuery = array();
        foreach ($params['filtros'] as $p => $s) {
            if ($s != null) {

                if ($s['field'] == 'codigo') {
                    self::addWhereConParams(
                        $addwhere, "upper(a.codigo)  LIKE",
                        ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } else {
                    if ($s['field'] == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, "upper(a.denominacion)  LIKE",
                            ("'%" . strtoupper($s['data']['value']) . "%'")
                        );
                    } else {
                        if ($s['field'] == 'descripcion') {
                            self::addWhereConParams(
                                $addwhere, "upper(a.descripcion)  LIKE",
                                ("'%" . strtoupper($s['data']['value']) . "%'")
                            );
                        } else {
                            if ($s['field'] == 'nivelactividadmanual') {
                                {
                                    $cond = "=";
                                    if ($s['data']['comparison'] == "gt") {
                                        $cond = ">";
                                    } elseif ($s['data']['comparison']
                                        == "lt"
                                    ) {
                                        $cond = "<";
                                    }
                                    $condiciones[]
                                        = "aem.nivelactividadmanual {$cond} "
                                        . ($s['data']['value']);
                                }
                            }
                        }
                    }
                }
            }
        }
        $ADDWHERE = '';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }

        $query
            = "SELECT a.idactividad,a.codigo, a.denominacion,a.descripcion,
 aem.nivelactividadmanual FROM mod_planificacion.nom_actividad a
                    INNER JOIN mod_planificacion.dat_actividadentidad ae
                    ON (ae.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.dat_actividadentidadmanual aem
                     ON (aem.idactividadentidad = ae.idactividadentidad)
                    INNER JOIN mod_planificacion.dat_subtipobalancebalanceactividad sbba
                    ON (sbba.idactividad = a.idactividad)
                    INNER JOIN mod_planificacion.dat_subtipobalancebalance sbb
                    ON(sbba.idsubtipobalancebalance = sbb.idsubtipobalancebalance)
                    WHERE ae.identidad =$identidad and ae.idejercicio =$idejercicio
                    AND sbb.idsubtipobalancebalance = $idsubtipobalancebalance 
                    $addwhere $ADDWHERE";
        $actividadesAsociadas = $conn->execute($query)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $actividadesAsociadas;
    }

    public function buscarrelacion($idsubtipobalancebalance, $idactividad)
    {
        $query = new Doctrine_Query();
        return $query->select('sbba.idsubtipobalancebalanceactividad')
            ->from('DatSubtipobalancebalanceactividad sbba')
            ->where(
                'sbba.idactividad=? AND sbba.idsubtipobalancebalance=?',
                array($idactividad, $idsubtipobalancebalance)
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function insertarSBBA($dat, $params)
    {
        $objdatoinversion = new DatSubtipobalancebalanceactividad();
        $objdatoinversion->idsubtipobalancebalance
            = $params['idsubtipobalancebalance'];
        $objdatoinversion->idactividad = $dat;
        $objdatoinversion->save();
        return true;
    }

}
