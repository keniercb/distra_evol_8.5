<?php

class DatFip extends BaseDatFip {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatElementos', array('local' => 'idfip', 'foreign' => 'idelemento')
        );
    }

    public function Buscar($idfip) {
        $temp = $this->conn->getTable('DatFip')->find($idfip);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query();
        $result = $query->from('DatFip')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query();
        $result = $query->from('DatFip')->limit($limite = 10)->offset(
                        $inicio = 0
                )->execute();
        return $result->toArray();
    }

    public function cantidadFIT() {
        $query = new Doctrine_Query();
        $result = $query->from('DatFip')->count();
        return $result;
    }

    public function cantidadfitfiltro($datos) {
        $cond = "";
        $cont = 0;

        if ($datos [0]) {
            $cond .= "de.denelemento like '%" . $datos [0] . "%'";
            $cont++;
        }
        if ($datos [1]) {
            if ($cont == 1) {
                $cond .= " AND df.fechaemision = '" . $datos [1] . "'";
                $cont++;
            } else {
                $cond .= "fechaemision = '" . $datos [1] . "'";
                $cont++;
            }
        }
        if ($datos [2]) {
            if ($cont > 0) {
                $cond .= " AND fechacumplio = '" . $datos [2] . "'";
            } else {
                $cond .= "fechacumplio = '" . $datos [2] . "'";
            }
        }
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos de')->innerJoin('de.DatFip df')
                        ->where($cond)->count();
        return $result;
    }

    public function GetDatosFip($idelemento) {
        $query = new Doctrine_Query();
        $result = $query->from('DatFip')->where("idfip = ?", $idelemento)
                ->execute();
        return $result->toArray();
    }

    //busqueda de los fip por la fecha
    public function FiltrarDatos(
    $idusuario, $denominacion, $fechainicio, $fechafin
    ) {
        $cond = "de.idusuariocrea = ?";

        if ($denominacion != '') {
            $den = "lower(de.denelemento) like '%" . strtolower($denominacion)
                    . "%'";
        }
        if ($fechainicio != '') {
            $fi = "df.fechaemision >= '" . $fechainicio . "'";
        }
        if ($fechafin != '') {
            $ff = "df.fechacumplio <= '" . $fechafin . "'";
        }
        $query = new Doctrine_Query();

        if ($den) {
            $cond .= ' AND ' . $den;
        }
        if ($fi) {
            $cond .= ' AND ' . $fi;
        }
        if ($ff) {
            $cond .= ' AND ' . $ff;
        }
        $result = $query->from('DatElementos de')->innerJoin('de.DatFip df')
                        ->where($cond, $idusuario)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->limit($limite)->offset($inicio)->execute();
        return $result;
    }

    public function CargarMisFips($idusuario) {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementos de')->innerJoin('de.DatFip df')
                        ->where('de.idusuariocrea = ?', $idusuario)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->limit($limite)->offset($inicio)->execute();
        return $result;
    }

    public function ObtenerFIP(
    $denominacion, $fechainicio, $fechafin, $arrayautores, $arrayinvolucrados, $offset, $limit
    ) {
        $cadenaautoresinvol = ' ';
        if (isset($arrayautores[0])) {
            $cadenaautoresinvol .= ' AND (';
            $totalautores = count($arrayautores);
            $operator = " OR ";
            foreach ($arrayautores as $key => $autor) {
                $idautor = $autor['idusuariocrea'];
                if ($key == $totalautores - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (e.idusuariocrea = '$idautor') "
                        . $operator;
            }
        }
        if (isset($arrayinvolucrados[0])) {
            if (isset($arrayautores[0])) {
                $cadenaautoresinvol .= " OR ";
            } else {
                $cadenaautoresinvol .= ' AND (';
            }
            $totalinvol = count($arrayinvolucrados);
            $operator = " OR ";
            foreach ($arrayinvolucrados as $key => $invol) {
                $idinvolucrado = $invol['idinvolucrado'];
                if ($key == $totalinvol - 1) {
                    $operator = " ";
                }
                $cadenaautoresinvol .= " (ei.idinvolucrado = '$idinvolucrado') "
                        . $operator;
            }
        }
        $cadenaautoresinvol .= ' )';
        $cadena = "SELECT distinct(e.idelemento),e.denelemento AS denominacion,
                e.descelemento,e.llevahistorial, e.idestadoaprob,
                e.estadocumplimiento,e.gradocumplimiento,e.activo AS srtactivo,
                e.idusuariocrea AS idautor,e.participante AS participantes,
                f.fechaemision AS fechainicio, f.fechacumplimiento AS fechafin  
                FROM mod_objetivos.dat_elementos e 
                INNER JOIN mod_objetivos.dat_fip f ON e.idelemento = f.idfip
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON ei.idelemento = e.idelemento
                WHERE e.idtipoelemento = '2' " . $cadenaautoresinvol;
        if ($denominacion != null) {
            $cadena .= " AND e.denelemento LIKE '%$denominacion%'  ";
        }
        if ($fechainicio != null) {
            $cadena .= " AND f.fechaemision >= '$fechainicio'  ";
        }
        if ($fechafin != null) {
            $cadena .= " AND f.fechacumplimiento <= '$fechafin'  ";
        }
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($offset == null) {
            $offset = 0;
        }
        $cadena .= " OFFSET(" . $offset . ") LIMIT(" . $limit . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado[] = $total;
        $resultado[] = $result;
        return $resultado;
    }

    public function ActualizarInfFip() {
        $query = new Doctrine_Query();
        $array = $this->getData();
        $idfip = $array['idfip'];
        $query->update('DatFip df');
        foreach ($array as $key => $value) {
            if (strlen((string) $value) > 0) {
                $definicion = $this->getTable()->getColumnDefinition($key);
                if ($definicion['type'] != 'numeric') {
                    $value = "'" . $value . "'";
                }
                $query->set('df.' . $key, $value);
            }
        }
        $query->where("df.idfip = $idfip")->execute();
    }

    //Tipos de FIP
    public function tiposFip($parametros) {

      $cadenainvolucrados='';

      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
        if (isset($parametros->arrayautores[0])) {
          $cadenainvolucrados
            .= " n.idusuariocrea IN ({$parametros->arrayautores}) ";
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " OR n.idusuariocrea IN ({$parametros->arrayinvolucrados})";
          }
        } elseif (isset($parametros->arrayinvolucrados[0])) {
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " n.idusuariocrea IN ({$parametros->arrayinvolucrados})";
          }
        }
        $cadenainvolucrados
          .= " ) ";

      }else{
        $cadenainvolucrados.= " AND n.idusuariocrea = {$parametros->idusuario} ";
      }

      $cadenaQUERY = " SELECT  n.idnomenclador,  n.dennomenclador
                        FROM mod_objetivos.nom_nomenclador n
                        WHERE n.tiponomenclador = 4
                        {$cadenainvolucrados}
                         ";


        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $result;
    }

    //Tipos de FIP
    public function cantFipPorTipo($parametros) {

      $cadenainvolucrados='';

      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
        if (isset($parametros->arrayautores[0])) {
          $cadenainvolucrados
            .= " (n.idusuariocrea IN ({$parametros->arrayautores}) 
                 AND e.idusuariocrea IN ({$parametros->arrayautores})) ";
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " OR (n.idusuariocrea IN ({$parametros->arrayinvolucrados}) 
                      OR e.idusuariocrea IN ({$parametros->arrayinvolucrados}))
              ";
          }
        } elseif (isset($parametros->arrayinvolucrados[0])) {
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " (n.idusuariocrea IN ({$parametros->arrayinvolucrados}) 
                      OR e.idusuariocrea IN ({$parametros->arrayinvolucrados})) ";
          }
        }
        $cadenainvolucrados
          .= " ) ";

      }else{
        $cadenainvolucrados.= " AND n.idusuariocrea = {$parametros->idusuario}
                        AND (e.idusuariocrea = {$parametros->idusuario}
                        OR i.idusuario = {$parametros->idusuario}) ";
      }

        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (f.fechaemision >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (f.fechacumplimiento <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->cumpl == 1) {
            $cadenaSelect = " SELECT  SUM (e.gradocumplimiento) ";
        } else {
            $cadenaSelect = " SELECT  COUNT (n.idnomenclador) ";
        }
        $cadenaQUERY = " FROM mod_objetivos.nom_nomenclador n
                        LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                        ON (n.idnomenclador = en.idnomenclador)

                        LEFT JOIN mod_objetivos.dat_elementos e
                        ON (e.idelemento = en.idelemento)

                        LEFT JOIN mod_objetivos.dat_fip f
                        ON (f.idfip = e.idelemento)

                        LEFT JOIN mod_objetivos.dat_grupo_nom_nomenclador g
                        ON (n.idnomenclador = g.idnomenclador)

                        LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                        ON (ei.idelemento = e.idelemento)
                        LEFT JOIN mod_objetivos.dat_involucrados i
                        ON (ei.idinvolucrado = i.idinvolucrado)

                        WHERE n.tiponomenclador = 4
                        AND n.idnomenclador = {$parametros->idnomenclador}

                        {$cadenainvolucrados}
                        {$cadenaFechaI} {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function cumplFip($parametros) {

      $cadenainvolucrados='';
      $joininvolucrados='';
      //***---filtro autor/involucrado---***//
      if (isset($parametros->arrayautores[0]) || isset($parametros->arrayinvolucrados[0])
      ) {
        $cadenainvolucrados
          .= " AND ( ";
        if (isset($parametros->arrayautores[0])) {
          $cadenainvolucrados
            .= " e.idusuariocrea IN ({$parametros->arrayautores}) ";
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " OR ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        } elseif (isset($parametros->arrayinvolucrados[0])) {
          if (isset($parametros->arrayinvolucrados[0])) {
            $cadenainvolucrados
              .= " ei.llaveinvolucrado IN ({$parametros->arrayinvolucrados})";
          }
        }
        $cadenainvolucrados
          .= " ) ";

        $joininvolucrados.=" LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei
                ON e.idelemento = ei.idelemento ";

      }else{
        $cadenainvolucrados.= " AND (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario})) ";
      }


        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (f.fechaemision >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (f.fechacumplimiento <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect = " SELECT COUNT(e.idelemento) ";

        $cadenaQUERY = " FROM mod_objetivos.dat_elementos e

                INNER JOIN mod_objetivos.dat_fip f
                ON (f.idfip = e.idelemento)
                
                $joininvolucrados

                WHERE e.gradocumplimiento = {$parametros->cumpl}

                {$cadenainvolucrados}

                {$cadenaFechaI} {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function parCumplFip($parametros) {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (f.fechaemision >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (f.fechacumplimiento <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect = " SELECT COUNT(e.idelemento) ";

        $cadenaQUERY = " FROM mod_objetivos.dat_elementos e

                INNER JOIN mod_objetivos.dat_fip f
                ON (f.idfip = e.idelemento)

                WHERE e.gradocumplimiento < 100 AND e.gradocumplimiento > 0

                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaFechaI} {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function atrazoFip($parametros) {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (f.fechaemision >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (f.fechacumplimiento <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect = " SELECT COUNT(e.idelemento) ";

        $cadenaQUERY = " FROM mod_objetivos.dat_elementos e

                INNER JOIN mod_objetivos.dat_fip f
                ON (f.idfip = e.idelemento)

                WHERE e.gradocumplimiento < 100
                AND f.fechacumplimiento < " . "'" . date('Y-m-d') . "'" . "

                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaFechaI} {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function enTiempo($parametros) {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (f.fechaemision >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (f.fechacumplimiento <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect = " SELECT COUNT(e.idelemento) ";

        $cadenaQUERY = " FROM mod_objetivos.dat_elementos e

                INNER JOIN mod_objetivos.dat_fip f
                ON (f.idfip = e.idelemento)

                WHERE e.gradocumplimiento < 100
                AND f.fechacumplimiento > " . "'" . date('Y-m-d') . "'" . "

                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaFechaI} {$cadenaFechaF} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
                PDO::FETCH_COLUMN
        );
        return $result;
    }

    public function obtenerReporteFIP1($params) {

        $conn = Doctrine_Manager::connection();

        $joinnom = '';

        $arrayidnom = implode(',', $params->arrayidnom);

        $arrayidautores = implode(',', $params->arrayidautores);
        $arrayidinvolucrados = implode(',', $params->arrayidinvolucrados);

        $condicion = " where ";
        $cadenaautoresinvol = " (e.idusuariocrea = {$params->idusuariosession} 
                            OR i.idusuario = {$params->idusuariosession}) ";

        if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
          if (isset($arrayidautores[0])) {
            $cadenaautoresinvol = " (e.idusuariocrea IN (" . $arrayidautores . ")";
            if (isset($arrayidinvolucrados[0])) {
              $cadenaautoresinvol .= " OR ";
            }
          }
          if (isset($arrayidinvolucrados[0])) {
            if (!isset($arrayidautores[0])) {
              $cadenaautoresinvol = " ";
            }
            $cadenaautoresinvol
              .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
          }
          $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
        }

        $condicion .= $cadenaautoresinvol;

        if ($params->fechainicio != '' && $params->fechafin != '') {
             $condicion .= " AND   ( (f.fechaemision <= '$params->fechainicio' AND f.fechacumplimiento >= '$params->fechainicio')  
                OR (f.fechaemision <= '$params->fechafin'                        AND f.fechacumplimiento >= '$params->fechafin')                   
                OR (f.fechaemision >= '$params->fechainicio'                         AND f.fechacumplimiento <= '$params->fechafin'))";
            
        } else if ($params->valuemeses!='' && $params->valueanno!=''){
            $condicion .= " AND (SELECT date_part('year', f.fechaemision)) = $params->valueanno
                    and (SELECT date_part('month', f.fechaemision)) = $params->valuemeses";
           
        }

        //cadena sql con los nomencladores
        if (isset($arrayidnom[0])) {
          $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                      ON e.idelemento = en.idelemento ";
          $condicion .= ' AND en.idnomenclador IN (' . $arrayidnom . ')';
        }

        if($params->fipcumplido == 1){
            $condicion .= ' AND e.gradocumplimiento = 100 ';
        }else{
            $condicion .= ' AND e.gradocumplimiento < 100 ';
        }

        if(isset($params->idtipofip)){
            $condicion .= " AND dennm.idnomenclador = $params->idtipofip ";
        }
    
        $query = " SELECT e.idelemento,
                e.denelemento as fip,     
                f.fechaemision,
                f.numfip,
                --f.fechacumplimiento,
                CONCAT (f.fechacumplimiento, ' / ',  e.estadocumplimiento,' (',e.gradocumplimiento,'%',')') as fechacumplimiento,
                e.gradocumplimiento,
                e.estadocumplimiento,
                e.dirigente,
                --f.emite,
                CONCAT (f.emite, ' / ',  e.descelemento) as emite,
                e.descelemento, 
                e.participante AS participantes ,
                e.dirigente AS dirigentes,
                (select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg( distinct dei.idinvolucrado),0)) as involucrados,
                f.fechacumplio,
                CASE WHEN p.idpersona is NULL THEN u.nombreusuario ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor, 
                array_to_string (
                  (select array (SELECT 
                  mod_objetivos.dat_observaciones_pdo.cuerpo
                FROM
                  mod_objetivos.dat_observaciones_pdo
                WHERE
                  mod_objetivos.dat_observaciones_pdo.idelemento = e.idelemento)),',', '')  as observaciones

                FROM mod_objetivos.dat_elementos e                
                INNER JOIN mod_objetivos.dat_fip f ON (f.idfip = e.idelemento)
                LEFT JOIN mod_flujotrabajo.dat_estado es ON (e.idestadoaprob = es.idestado)  
                left join  mod_objetivos.dat_elementos_dat_involucrados dei on (dei.idelemento = e.idelemento)  
                INNER JOIN mod_seguridad.seg_usuario u                ON u.idusuario = e.idusuariocrea                
                LEFT JOIN mod_persona.dat_persona p                ON u.idpersona = p.idpersona    
                LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                ON (ei.idelemento = e.idelemento) 
                LEFT JOIN mod_objetivos.dat_involucrados i 
                ON (ei.idinvolucrado = i.idinvolucrado)    
                
                left join mod_objetivos.dat_elementos_nom_nomenclador dennm on (dennm.idelemento = e.idelemento)    
                
                $joinnom    

                $condicion

                group by 

                e.idelemento,
                e.denelemento,     
                f.fechaemision,
                f.numfip,
                f.fechacumplimiento,
                e.gradocumplimiento,
                e.estadocumplimiento,
                e.dirigente,
                f.emite,
                e.descelemento, 
                e.participante,
                e.dirigente,
                f.fechacumplio,
                p.idpersona,
                u.nombreusuario,
                p.nombre,
                p.papel,
                p.sapel";

//        print_r($query);die;
        $result = $conn->execute($query)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $result;
    }
  public function obtenerReporteFIP2($params) {

        $conn = Doctrine_Manager::connection();

        $joinnom = '';

        $arrayidnom = implode(',', $params->arrayidnom);

        $arrayidautores = implode(',', $params->arrayidautores);
        $arrayidinvolucrados = implode(',', $params->arrayidinvolucrados);

        $condicion = " WHERE ";
        $cadenaautoresinvol = " (e.idusuariocrea = {$params->idusuariosession} 
                            OR i.idusuario = {$params->idusuariosession}
                            ) ";

        if (isset($arrayidautores[0]) || isset($arrayidinvolucrados[0])) {
          if (isset($arrayidautores[0])) {
            $cadenaautoresinvol = " (e.idusuariocrea IN (" . $arrayidautores . ")";
            if (isset($arrayidinvolucrados[0])) {
              $cadenaautoresinvol .= " OR ";
            }
          }
          if (isset($arrayidinvolucrados[0])) {
            if (!isset($arrayidautores[0])) {
              $cadenaautoresinvol = " ";
            }
            $cadenaautoresinvol
              .= " ei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
          }
          $cadenaautoresinvol .= (isset($arrayidautores[0])) ? ")" : "";
        }


        $condicion .= $cadenaautoresinvol;

        if ($params->fechainicio != '' && $params->fechafin != '') {
             $condicion1 = " AND   ( (f.fechaemision <= '$params->fechainicio' AND f.fechacumplimiento >= '$params->fechainicio')  
                OR (f.fechaemision <= '$params->fechafin'                        AND f.fechacumplimiento >= '$params->fechafin')                   
                OR (f.fechaemision >= '$params->fechainicio'                         AND f.fechacumplimiento <= '$params->fechafin'))";
             $condicion2 = " AND   ( (a.fechainicio <= '$params->fechainicio' AND a.fechafin >= '$params->fechainicio')  
                OR (a.fechainicio <= '$params->fechafin'                        AND a.fechafin >= '$params->fechafin')                   
                OR (a.fechainicio >= '$params->fechainicio'                         AND a.fechafin <= '$params->fechafin'))";
            
        } else if ($params->valuemeses!='' && $params->valueanno!=''){
            $condicion1 = " AND (SELECT date_part('year', f.fechaemision)) = $params->valueanno
                    and (SELECT date_part('month', f.fechaemision)) = $params->valuemeses";
            $condicion2 = " AND (SELECT date_part('year', a.fechainicio)) = $params->valueanno
                    and (SELECT date_part('month', a.fechainicio)) = $params->valuemeses";
           
        }

        //cadena sql con los nomencladores
        if (isset($arrayidnom[0])) {
          $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                            ON e.idelemento = en.idelemento ";
          $condicion .= ' AND en.idnomenclador IN (' . $arrayidnom . ')';
        }

        $query = " SELECT distinct(e.idelemento),
                    0 as orden ,
                    e.denelemento as fip,  
                    e.denelemento as elemento,    
                    f.fechacumplimiento - f.fechaemision as plazo,
                    e.dirigente AS dirigentes,
                    e.participante AS participantes 

                    FROM mod_objetivos.dat_elementos e                
                    INNER JOIN mod_objetivos.dat_fip f ON (f.idfip = e.idelemento)
                    LEFT JOIN mod_flujotrabajo.dat_estado es ON (e.idestadoaprob = es.idestado)     
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                    ON (ei.idelemento = e.idelemento) 
                
                    LEFT JOIN mod_objetivos.dat_involucrados i 
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    
                    $joinnom
                          
                    $condicion  $condicion1

                    union


                    SELECT distinct(e.idelemento),
                    1 as orden ,
                    ef.denelemento as fip,  
                    e.denelemento as elemento,    
                    f.fechacumplimiento - f.fechaemision as plazo,
                    e.dirigente AS dirigentes,
                    e.participante AS participantes
                    FROM mod_objetivos.dat_elementos e                
                    INNER JOIN mod_objetivos.dat_actividades a ON (a.idactividad = e.idelemento)     
                    INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee ON (e.idelemento = ee.idelementohijo ) 
                    INNER JOIN mod_objetivos.dat_elementos ef         on (ef.idelemento = ee.idelementopadre)        
                    INNER JOIN mod_objetivos.dat_fip f                 ON (f.idfip = ef.idelemento)    
                    LEFT JOIN mod_objetivos.dat_elementos_dat_involucrados ei 
                    ON (ei.idelemento = e.idelemento) 
                
                    LEFT JOIN mod_objetivos.dat_involucrados i 
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    
                    $joinnom
                    
                    $condicion   $condicion2
                    order by fip, orden
                    ";
//        print_r($query);die;
        $result = $conn->execute($query)->fetchAll(
                PDO::FETCH_ASSOC
        );
        return $result;
    }

  public function ControldeAcuerdos($datos) {

    $cadenaautoresinvol='';
    $arrayidnom = implode(',', $datos->arrayidnom);
    //cadena sql con los nomencladores
    if (isset($arrayidnom[0])) {
      $joinnom = " LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                    ON e.idelemento = en.idelemento ";
      $cadenanom = ' AND en.idnomenclador IN (' . $arrayidnom . ')';
    }

    $arrayidautores = implode(',', $datos->arrayidautores);
    $aux_involucrados =
      array_merge(
        $datos->arrayinvolucrados, $datos->arrayidinvolucrados
      );

    $arrayidinvolucrados = implode(',', $aux_involucrados);

    //cadena sql con posibles autores e involucrados

    if (isset($datos->arrayidautores[0]) && !isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " e.idusuariocrea IN (".$arrayidautores.") ";
    }
    else if (!isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " dei.llaveinvolucrado IN (" . $arrayidinvolucrados . ")";
    }
    else if (isset($datos->arrayidautores[0]) && isset($datos->arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " (e.idusuariocrea IN (".$arrayidautores.") 
                      OR dei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
    }
    else if (isset($arrayidinvolucrados[0])) {
      $cadenaautoresinvol
        .=  " (e.idusuariocrea IN (".$arrayidinvolucrados.") 
                      OR dei.llaveinvolucrado IN (" . $arrayidinvolucrados . "))";
    }

    $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
    $fechafinD = $datos->arraydatosreporte['fechafinD'];

    $wherefecha="";

    if ($fechainicioD != null && $fechafinD != null){
      $wherefecha=" AND ( f.fechaemision BETWEEN '$fechainicioD' AND '$fechafinD' or f.fechacumplimiento BETWEEN '$fechainicioD' AND '$fechafinD' ) 
                    --OR (f.fechaemision >= '$fechainicioD' OR f.fechacumplimiento >= '$fechainicioD')
                    --OR (f.fechaemision <= '$fechafinD' OR f.fechacumplimiento <= '$fechafinD')
                    ";
    }

    if ($fechainicioD != null && $fechafinD == null){
      $wherefecha=" AND ( f.fechaemision >= '$fechainicioD' ) ";
    }

    if ($fechainicioD == null && $fechafinD != null){
      $wherefecha=" AND ( f.fechacumplimiento <= '$fechafinD' ) ";
    }



    $conn = Doctrine_Manager::connection();

    $query = "  
              SELECT e.idelemento,
                    e.denelemento as fip,
                    ( select * from mod_objetivos.fa_devolver_nombres_involucrados (array_agg( dei.idinvolucrado),2))
                    as responsable,
                    f.fechacumplimiento,
                    f.fechaemision,
                    e.gradocumplimiento,
                    e.estadocumplimiento,
                    e.descelemento
                    
                    FROM mod_objetivos.dat_elementos e              
                    INNER JOIN mod_objetivos.dat_fip f ON (f.idfip = e.idelemento)
                    LEFT JOIN mod_flujotrabajo.dat_estado es ON (e.idestadoaprob = es.idestado)
                    inner join  mod_objetivos.dat_elementos_dat_involucrados dei on (dei.idelemento = e.idelemento)
                    inner join  mod_objetivos.dat_involucrados di on (di.idinvolucrado = dei.idinvolucrado)
                    left JOIN mod_seguridad.seg_usuario u                ON u.idusuario = di.idusuario           
                    LEFT JOIN mod_persona.dat_persona p                ON u.idpersona = p.idpersona 
                    $joinnom             
                    
                    where
                    
                    $cadenaautoresinvol
                    
                    $cadenanom
                    
                    $wherefecha
                    
                    --(f.fechaemision BETWEEN '01-09-2019' AND '30-09-2019' or f.fechacumplimiento BETWEEN '01-09-2019' and '30-09-2019')
                    
                    --or (f.fechaemision >= '01-01-2019' or f.fechacumplimiento >= '01-01-2019')
                    --or (f.fechaemision <= '31-01-2019' or f.fechacumplimiento <= '31-01-2019')
                    
                    group by
                    e.idelemento,
                    e.denelemento,
                    f.fechacumplimiento,
                    f.fechaemision
                    order by f.fechaemision, f.fechacumplimiento, e.denelemento
                    ";
//        print_r($query);die;
    $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }
}
