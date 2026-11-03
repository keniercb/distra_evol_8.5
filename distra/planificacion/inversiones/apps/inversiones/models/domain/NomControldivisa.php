<?php

class NomControldivisa extends BaseNomControldivisa {

    //   @ author Jesús Ariel Guerra López
    // * @ package PlanificaciÃƒÂ³n
    // * @ subpackage PlanificaciÃƒÂ³n Empresarial y Presupuestaria
    public function setUp() {
        parent::setUp();
    }

    private function addWhereConParams(&$where, &$array_params, $colum_cond, $param) {
        $where .= " AND " . $colum_cond;
        $array_params[] = $param;
    }

    public function listarAsociacion($idindicador, $start, $limit) {

        $query = new Doctrine_Query ();
        $data = $query->select(
                        "n.idcontroldivisa,n.codigo as codigocd,n.denominacion as denominacioncd,cdi.idcontroldivisaindicadormodelo as idcontroldivisaindicador,ni.idindicador,ni.codigo as codigop,ni.denominacion as denominacionp"
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

    public function listarindicadoresCD($parametros, $start = 0, $limit, $rector, $idejercicio, $combo) {
        $query = new Doctrine_Query ();
        $array_parametros = array();
        $addwhere = 'Where true';
        if ($parametros) {
            foreach ($parametros as $p => $s) {

                if ($s != '') {
                    if ($p == 'denominacion') {

                        self::addWhereConParams(
                                $addwhere, $array_parametros, "upper(n.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } else if ($p == 'codigo') {
                        self::addWhereConParams($addwhere, $array_parametros, "n.codigo  LIKE ? ", ("%" . $s . "%"));
                    } else if ($p == 'estado') {
                        if ($s == 'true') {

                            self::addWhereConParams($addwhere, $array_parametros, "n.estado  = ? ", (1));
                        } else {
                            $s = 0;
                            self::addWhereConParams($addwhere, $array_parametros, "n.estado  = ? ", (0));
                        }
                    }
                }
            }
        }
        $estado = "";
        if ($rector == 0) {
            $addwhere.=" AND n.estado = 1 ";
        }

        $conn = Doctrine_Manager :: connection();
        $query = " SELECT DISTINCT n.idcontroldivisa,n.codigo,n.denominacion,n.descripcion,n.estado,cdim.idejercicio
 
FROM  mod_planificacion.nom_controldivisa n
  LEFT JOIN mod_planificacion.dat_controldivisaindicadormodelo cdim ON
   (n.idcontroldivisa =
    cdim.idcontroldivisa) " . $estado . " 
	{$addwhere}
    OFFSET ?
                               LIMIT ? ";

        $array_parametros [] = $start;
        $array_parametros [] = $limit;
        $res = $conn->execute($query, $array_parametros);
        $data->data = $res->fetchAll();


        $query1 = " SELECT COUNT(DISTINCT n.idcontroldivisa)
 
FROM  mod_planificacion.nom_controldivisa n
  LEFT JOIN mod_planificacion.dat_controldivisaindicadormodelo cdim ON
   (n.idcontroldivisa =
    cdim.idcontroldivisa) {$addwhere}";
        $rest = $conn->execute($query1);
        $vari = $rest->fetchAll();

        $data->total = $vari[0][0];

        return $data;
    }

    public function VerificarUso($array_idtiposnomenclador) {
        $query = new Doctrine_Query ();
        $data = $query
                ->from("DatControldivisaindicador n")
                ->whereIn('n.idcontroldivisa', $array_idtiposnomenclador)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        if (count($data) == 0) {
            return true;
        } else {
            return false;
        }
    }

}
?> 
