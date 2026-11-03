<?php

class DatPriorizarEntidadesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function ListarCentrosBalance($params)
    {


        /* if(is_array( $params['filtros'] )){
          foreach ($params['filtros'] as $key => $datos) {
          if ($datos['field'] == 'denominacion') {
          //por implementar hay que solicitar un servicio de estructura
          // por denominacion
          //"upper(est.denominacion) LIKE ?";
          //$datos['data']['value']
          }
          }
          } */

        $query = new Doctrine_Query();
        $query->select('d.*,count(pcb.idcentrobalance) as total');
        $data->data = $query->from('DatEntidaddatosnomenclador d')
            ->leftJoin('d.DatPrioridadcentrobalance pcb')
            ->where('d.iddatosnomenclador=?', 1)
            ->offset($params['start'])
            ->limit($params['limit'])
            ->groupby(
                'd.identidaddatosnomenclador, d.identidad, d.iddatosnomenclador'
            )
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        $data->total = $query->count();

        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT count(esp.idespecialidad) as totalesp
                       FROM mod_datosmaestros.nom_especialidad esp
                       WHERE esp.idespecialidad IS NOT NULL";
        $res = $conn->execute($sql);
        $data->totalesp = $res->fetchAll(PDO::FETCH_ASSOC);
        $data->totalesp = $data->totalesp[0]['totalesp'];

        if (is_array($data->data)) {
            foreach ($data->data as $k => $valor) {
                $enti = $this->integrator->metadatos->DameEstructura(
                    $valor['identidad']
                );
                $data->data[$k]['denominacion'] = $enti[0]->denominacion;
                $data->data[$k]['totalesp'] = $data->totalesp;
            }

            if ($params['filtros'] || $params['filtrosgrid']) {
                foreach ($data->data as $j => $v) {
                    if ($params['filtros']) {
                        if (stristr(
                            strtoupper($data->data[$j]['denominacion']),
                            strtoupper($params['filtros'])
                        ) == false
                        ) {
                            unset($data->data[$j]);
                        }
                    }
                    if ($params['filtrosgrid']) {
                        if (stristr(
                            strtoupper($data->data[$j]['denominacion']),
                            strtoupper(
                                $params['filtrosgrid'][0]['data']['value']
                            )
                        ) == false
                        ) {
                            unset($data->data[$j]);
                        }
                    }

                }
                $resp = array();
                $i = 0;
                foreach ($data->data as $val) {
                    $resp[$i++] = $val;
                }
            }

            $data->total = count($resp);
            if ($resp != null) {
                $data->data = $resp;
            }
        }
        return $data;
    }

    public function listarEspecialidades($params)
    {
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
//            $WHERE = "codespecialidad LIKE '" . $especialidades[0]['codespecialidad'] . "%'";
        $especialidades = $this->nomenclador->selectParam(
            'nom_especialidad', array('idespecialidad', 'denespecialidad'),
            $params['start'], $params['limit'], $WHERE
        );
        /*foreach ($especialidades as $valorEspecialidad) {
            $arrayTmpIdesp["idesp" . $valorEspecialidad['idespecialidad']]
                = $valorEspecialidad['idespecialidad'];
        }*/
        $arrayParametros = array();
        $condiciones = array();
        $arrayParametros[] = $params['idcb'];
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $key => $datos) {
                if ($datos['field'] == 'denespecialidad') {
                    $condiciones[] = "upper(esp.denespecialidad)  LIKE ? ";
                    $arrayParametros[] = "%" . strtoupper(
                        $datos['data']['value']
                    ) . "%";
                } else {
                    if ($datos['field'] == 'prioridad') {
                        $cond = "=";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $condiciones[] = " pcb.prioridad {$cond} ? ";
                        $arrayParametros[] = $datos['data']['value'];
                    }
                }
            }
        }

        $ADDWHERE = ' ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        $conn = Doctrine_Manager::connection();


        $sql
            = "SELECT esp.idespecialidad,esp.denespecialidad,pcb.prioridad
                       FROM mod_datosmaestros.nom_especialidad esp
                       LEFT JOIN mod_planificacion.dat_prioridadcentrobalance pcb
                       ON( esp.idespecialidad = pcb.idespecialidad AND pcb.idcentrobalance = ?  )
                       WHERE esp.idespecialidad IS NOT NULL $ADDWHERE
                       ORDER BY pcb.prioridad
                       OFFSET ?
                       LIMIT ? ";

        $arrayParamstotal = $arrayParametros;
        $arrayParametros[] = $params['start'];
        $arrayParametros[] = $params['limit'];
        $res = $conn->execute($sql, $arrayParametros);
        $data->data = $res->fetchAll(
            PDO::FETCH_ASSOC
        );
        $sql
            = "SELECT count(esp.idespecialidad) as total
                       FROM mod_datosmaestros.nom_especialidad esp
                       LEFT JOIN mod_planificacion.dat_prioridadcentrobalance pcb
                       ON( esp.idespecialidad = pcb.idespecialidad AND pcb.idcentrobalance = ?  )
                       WHERE esp.idespecialidad IS NOT NULL $ADDWHERE ";

        $data->total = $conn->execute($sql, $arrayParamstotal)->fetchAll(
            PDO::FETCH_ASSOC
        );
        $data->total = $data->total[0]['total'];
        if ($params['idcb'] == null) {
            foreach ($data->data as $key => $value) {
                $pri = ++$params['start'];
                if (!$value['prioridad']) {
                    $data->data[$key][prioridad] = $pri;
                }
            }
        }

        return $data;
    }

    public function asignarPrioridadPorDefecto($params)
    {

        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT *
                       FROM mod_datosmaestros.nom_especialidad esp
                       WHERE esp.idespecialidad IS NOT NULL
                       AND esp.idespecialidad NOT IN (SELECT pcb.idespecialidad
                       FROM mod_planificacion.dat_prioridadcentrobalance pcb
                                     WHERE pcb.idcentrobalance = ?) ";
        $arrayParametros[] = $params['idcb'];
        $res = $conn->execute($sql, $arrayParametros);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

        $arrayCollpriocb = new Doctrine_Collection(
            Doctrine:: getTable("DatPrioridadcentrobalance")
        );
        $i = 0;
        foreach ($data->data as $value) {
            $arrayCollpriocb[$i]->prioridad = $i + 1;
            $arrayCollpriocb[$i]->idcentrobalance = $params['idcb'];
            $arrayCollpriocb[$i]->idespecialidad = $value['idespecialidad'];
            $i++;
        }
        $arrayCollpriocb->save();
        return 21;
    }

    public function actualizarPrioridad($arrayprioridad)
    {
        $centrobalance = $arrayprioridad[0]->centrobalance;
        $model = new DatPrioridadcentrobalance();
        foreach ($arrayprioridad as $value) {
            $model->actualizarPrioridad(
                $value->idespecialidad, $value->prioridad, $centrobalance
            );
        }

        return 1;
    }

}
