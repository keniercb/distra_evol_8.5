<?php
class DatEntregaextraplan extends BaseDatEntregaextraplan
{

    //   @ author Jesús Ariel Guerra López
    // * @ package PlanificaciÃƒÂ³n
    // * @ subpackage PlanificaciÃƒÂ³n Empresarial y Presupuestaria
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'Datentregaextraplanindicador',
            array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
    }

    /*private function addWhereConParams(&$where, &$arrayParams, $columCond,
        $param
    )
    {
        $where .= " AND " . $columCond;
        $arrayParams[] = $param;
    }*/

    public function listarAsociacion($idindicador, $start, $limit)
    {

        $query = new Doctrine_Query();
        $data = $query->select(
            "n.idcontroldivisa,n.codigo as codigocd,
            n.denominacion as denominacioncd,
            cdi.idcontroldivisaindicadormodelo as idcontroldivisaindicador,
            ni.idindicador,ni.codigo as codigop,ni.denominacion as denominacionp"
        )
            ->from("NomControldivisa n")
            ->innerjoin("n.DatControldivisaindicadormodelo cdi")
            ->innerjoin("cdi.NomIndicador ni")
            ->where('ni.idindicador=?', $idindicador)
            ->offset($start)
            ->limit($limit)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $data;
    }

    /*public function listarindicadoresCD($parametros, $limit,
        $rector, $start = 0
    )
    {
        $query = new Doctrine_Query();
        $arrayParametros = array();
        $addwhere = 'Where true';
        if ($parametros) {
            foreach ($parametros as $p => $s) {

                if ($s != '') {
                    if ($p == 'denominacion') {

                        self::addWhereConParams(
                            $addwhere, $arrayParametros,
                            "upper(n.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } else {
                        if ($p == 'codigo') {
                            self::addWhereConParams(
                                $addwhere, $arrayParametros,
                                "n.codigo  LIKE ? ", ("%" . $s . "%")
                            );
                        } else {
                            if ($p == 'estado') {
                                if ($s == 'true') {

                                    self::addWhereConParams(
                                        $addwhere, $arrayParametros,
                                        "n.estado  = ? ", (1)
                                    );
                                } else {
                                    $s = 0;
                                    self::addWhereConParams(
                                        $addwhere, $arrayParametros,
                                        "n.estado  = ? ", (0)
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        $estado = "";
        if ($rector == 0) {
            $estado = " WHERE n.estado = 1";
        }

        $conn = Doctrine_Manager:: connection();
        $query
            = " SELECT DISTINCT n.idcontroldivisa,n.codigo,n.denominacion,n.descripcion,n.estado,cdim.idejercicio
 
FROM  mod_planificacion.nom_controldivisa n
  LEFT JOIN mod_planificacion.dat_controldivisaindicadormodelo cdim ON
   (n.idcontroldivisa =
    cdim.idcontroldivisa) " . $estado . " 
	$addwhere
    OFFSET ?
                               LIMIT ? ";

        $arrayParametros [] = $start;
        $arrayParametros [] = $limit;
        $res = $conn->execute($query, $arrayParametros);
        $data->data = $res->fetchAll();


        $queryUno
            = " SELECT COUNT(DISTINCT n.idcontroldivisa)
 
FROM  mod_planificacion.nom_controldivisa n
  LEFT JOIN mod_planificacion.dat_controldivisaindicadormodelo cdim ON
   (n.idcontroldivisa =
    cdim.idcontroldivisa) " . $estado;
        $rest = $conn->execute($queryUno);
        $vari = $rest->fetchAll();

        $data->total = $vari[0][0];

        return $data;
    }*/

    public function VerificarUso($arrayIdtiposnomenclador)
    {
        $query = new Doctrine_Query();
        $data = $query
            ->from("DatControldivisaindicador n")
            ->whereIn('n.idcontroldivisa', $arrayIdtiposnomenclador)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        if (count($data) == 0) {
            return true;
        } else {
            return false;
        }
    }

}
