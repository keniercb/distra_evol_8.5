<?php

class DatOrganosatisfaceentidad extends BaseDatOrganosatisfaceentidad {

    public function setUp() {
        parent::setUp();
    }

    public function listarOrganosRelacionados($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $condiciones[] = "upper(os." . $datos['field'] . ") LIKE '%" . $temp . "%'";
                }
                    if ($datos['field'] == 'prioridad') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $sqlSigno = "<";
                        } else {
                            if ($datos['data']['comparison'] == 'gt') {
                                $sqlSigno = ">";
                            } else {
                                $sqlSigno = "=";
                            }
                        }
                        $condiciones[] = "ose.prioridad $sqlSigno  {$datos['field']}";
                        
                    }
            }
        }  //Fin de los filtros

        $WHERE = " ";
        foreach ($condiciones as $condicion) {
            /* if ($WHERE == "") {
              $WHERE = 'AND ' . $condicion;
              } else { */
            $WHERE = $WHERE . " AND " . $condicion;
            //}
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT ose.idorganosatisfaceentidad,
                        ose.idorganosatisface,
                        os.denominacion,
                        os.descripcion,
                        ose.prioridad,
                        count(*) OVER() as total
                 FROM mod_planificacion.dat_organosatisfaceentidad ose
                      INNER JOIN mod_datosmaestros.nom_organosatisface os ON (
                        ose.idorganosatisface = os.idorganosatisface) 
                        WHERE ose.identidad = {$params['identidad']} AND os.estado = 1 $WHERE
                        ORDER BY ose.prioridad $delimitando";
        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarOrganosAdd($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $condiciones[] = "upper(os." . $datos['field'] . ") LIKE '%" . $temp . "%'";
                }
            }
        }  //Fin de los filtros

        $WHERE = " ";
        foreach ($condiciones as $condicion) {
            /* if ($WHERE == "") {
              $WHERE = 'AND ' . $condicion;
              } else { */
            $WHERE = $WHERE . " AND " . $condicion;
            //}
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT os.idorganosatisface,
                    os.denominacion,
                    os.descripcion,
                    count(*) OVER() as total
                    FROM mod_datosmaestros.nom_organosatisface os
                         LEFT JOIN mod_planificacion.dat_organosatisfaceentidad ose ON
                           os.idorganosatisface = ose.idorganosatisface AND ose.identidad = {$params['identidad']}
                    WHERE ose.idorganosatisfaceentidad IS NULL AND os.nivelarbol IS NOT NULL $WHERE
                    ORDER BY os.denominacion
                    $delimitando";
        $data = $conn->execute($query)
                ->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function adicionarOrganos($params) {
        $almacenados = array();
        foreach ($params['organos'] as $organo) {
            $objDatOrganosatisfaceentidad = Doctrine::getTable('DatOrganosatisfaceentidad')->findByDql("idorganosatisface ={$organo->organo->idorganosatisface} AND identidad ={$params['identidad']}");
            if ($objDatOrganosatisfaceentidad[0]->idorganosatisfaceentidad == null && $objDatOrganosatisfaceentidad[0]->idorganosatisfaceentidad == '') {
                $objDatOrganosatisfaceentidad = new DatOrganosatisfaceentidad();
                if (is_object($objDatOrganosatisfaceentidad)) {
                    $objDatOrganosatisfaceentidad->identidad = $params['identidad'];
                    $objDatOrganosatisfaceentidad->idorganosatisface = $organo->organo->idorganosatisface;
                    $objDatOrganosatisfaceentidad->prioridad = 999;
                    $objDatOrganosatisfaceentidad->save();
                    $almacenados[] = $objDatOrganosatisfaceentidad->toArray();
                }
            }
        }
        return $almacenados;
    }

    public function eliminarOrganos($idorganosatisfaceentidad) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM
                      mod_planificacion.dat_organosatisfaceentidad
                  WHERE 
                    idorganosatisfaceentidad IN($idorganosatisfaceentidad);";
        $conn->execute($query);
        return 1;
    }

    public function actualizarPrioridad($params) {
        foreach ($params['arrayprioridad'] as $value) {
            $objOrganosatisfaceentidad = Doctrine::getTable('DatOrganosatisfaceentidad')->find($value->organo->idorganosatisfaceentidad);
            if ($objOrganosatisfaceentidad->idorganosatisfaceentidad != null) {
                $objOrganosatisfaceentidad->prioridad = $value->organo->prioridad;
                $objOrganosatisfaceentidad->save();
                $data = 1;
            } else {
                $data = 2;
            }
        }
        return $data;
    }

}
