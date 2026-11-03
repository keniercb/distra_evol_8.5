<?php

class DatDesgloseentidadModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatDesgloseentidad $datDesgloseentidad) {
        $datDesgloseentidad->save();
    }

    public function Actualizar(DatDesgloseentidad $datDesgloseentidad) {
        $datDesgloseentidad->save();
    }

    public function Eliminar($datDesgloseentidad) {
        $datDesgloseentidad->delete();
    }

    public function GetGridInterfaces($ident, $orden, $iddn, $idpadrerama) {
        $query = new Doctrine_Query();
        /* mapear el caso en el un name del store del grid */
        $i = 0;
        $columnsHeadersnames = array();

        $columnsHeadersnames['config'][0]['esultimonivel'] = true;
        $columnsHeadersnames['config'][0]['sololectura'] = true;
        $columnsHeadersnames['st_idrama'] = array();
        $columnsHeadersnames['cm'] = array();
        $columnsHeadersnames['st'] = array();
        $columnsHeadersnames['st_id'] = array();

        switch ($orden) {
            case 0: {
                    return self ::CasoCero($columnsHeadersnames, $ident, $i);
                }
                break;
            default: {
                    return self::casoDefault($ident, $orden, $idpadrerama, $i);
                }
        }
        return array();
    }

    public function CasoCero($columnsHeadersnames, $ident, $i) {
        $queryDesglose = new Doctrine_Query();
        $denominacion = $queryDesglose
                        ->select('d.denominacion')
                        ->from('DatDesglose d')
                        ->addWhere('d.iddesglose = ?', $ident)
                        ->execute()->getFirst()->denominacion;

        $columnsHeadersnames['cm'][$i]['dataIndex'] = "porciento";
        /* temporal cambiar el nombre del destino en la IU usando el json caso de  que cambie el idioma */
        $columnsHeadersnames['cm'][$i]['header'] = $denominacion . ' (%)'; //'Desglose (%)';
        $columnsHeadersnames['cm'][$i]['width'] = strlen($denominacion . ' (%)') * 8.5; //100;
        $columnsHeadersnames['cm'][$i]['sortable'] = true;
        $columnsHeadersnames['cm'][$i]['editor'] = "";
        /* temporal cambier el nombre del header por el de un json */
        $columnsHeadersnames['cm'][$i]['tooltip'] = $denominacion . ' (%)';
        $columnsHeadersnames['st'][$i]['name'] = "porciento";
        $i++;
        $resultparcial = DatDesglosetiponomenclador::getDatDesglosetiponomenclador($ident);
        return self::auxiliarforeach($resultparcial, $columnsHeadersnames, $i);
    }

    public function auxiliarforeach($resultparcial, $columnsHeadersnames, $i) {
        foreach ($resultparcial as $valor) {
            $columnsHeadersnames['cm'][$i]['dataIndex'] = "idtn" . $valor->NomTiponomenclador->idtiponomenclador;
            $columnsHeadersnames['cm'][$i]['header'] = $valor->NomTiponomenclador->denominacion;
            $columnsHeadersnames['cm'][$i]['width'] = strlen($valor->NomTiponomenclador->denominacion) * 8.5; //100;
            $columnsHeadersnames['cm'][$i]['sortable'] = true;
            $columnsHeadersnames['cm'][$i]['editor'] = "";
            $columnsHeadersnames['cm'][$i]['tooltip'] = $valor->NomTiponomenclador->denominacion;
            //$columns_headers_names['cm'][$i]['disabled'] = true;
            $columnsHeadersnames['st'][$i]['name'] = "idtn" . $valor->NomTiponomenclador->idtiponomenclador;
            /* temporal eliminar esto aqui y en la IU */
            $columnsHeadersnames['st_id'][$i]['name'] = " ";
            $i++;
        }

        return $columnsHeadersnames;
    }

    public function casoDefault($ident, $orden, $idpadrerama, $i) {
        $query = new Doctrine_Query();
        $columnsHeadersnames['config'][0]['sololectura'] = false;
        $queryColumns = new Doctrine_Query();

        $idtiponomenclador = $queryColumns
                        ->from('DatDesglosetiponomenclador dtn')
                        ->addWhere('dtn.iddesglose = ?', $ident)
                        ->addWhere('dtn.orden = ?', $orden)
                        ->execute()->getFirst()->idtiponomenclador;
        $resultparcial = $query
                ->from('NomDatosnomenclador dn')
                ->addWhere('dn.idtiponomenclador = ?', $idtiponomenclador)
                ->orderby('dn.denominacion')
                ->execute();

        $columnsHeadersnames = self::auxiliarforeachcasedefault($resultparcial, $idpadrerama, $i, $columnsHeadersnames);

        $columnsHeadersnames['st_otrosids'][0]['name'] = "idpadre_fila_desglose";
        $columnsHeadersnames['st_otrosids'][1]['name'] = "iddesglosetiponomenclador";
        if (DatDesglose::getDatDesglosetiponomenclador($ident, $orden + 1)->iddesglosetiponomenclador != null
        ) {
            $columnsHeadersnames['config'][0]['esultimonivel'] = false;
        }
        return $columnsHeadersnames;
    }

    public function auxiliarforeachcasedefault($resultparcial, $idpadrerama, $i, $columnsHeadersnames) {
        foreach ($resultparcial as $valor) {
            $idrama = ($idpadrerama != null) ? $idpadrerama . "s" . $valor->iddatosnomenclador : $valor->iddatosnomenclador;
            $columnsHeadersnames['cm'][$i]['dataIndex'] = "_" . $valor->iddatosnomenclador . '_' . $idrama;
            $columnsHeadersnames['cm'][$i]['header'] = $valor->denominacion;
            $columnsHeadersnames['cm'][$i]['width'] = strlen($valor->denominacion) * 8.5; //100;
            $columnsHeadersnames['cm'][$i]['sortable'] = true;
            $columnsHeadersnames['cm'][$i]['editor'] = "";
            $columnsHeadersnames['cm'][$i]['tooltip'] = $valor->denominacion;
            //$columns_headers_names['cm'][$i]['disabled'] = true;
            $columnsHeadersnames['st'][$i]['name'] = "_" . $valor->iddatosnomenclador . '_' . $idrama;
            $columnsHeadersnames['st_id'][$i]['name'] = "__" . $valor->iddatosnomenclador;
            $columnsHeadersnames['st_idrama'][$i]['name'] = "idrama" . $valor->iddatosnomenclador;
            $i++;
        }
    }

    public function GetGridInterfazIntegracionConPlan($identidad, $idtipomodelo) {
        /* ALGORITMO
          1. Buscar una configuracion de desglose que coincida con la columnas nomencladas
          del plan seleccionado (Servicio de plan que dado un plan devuelva
          un array de idtiponomenclador de las columnas nomencladas del plan
          2.Construir las columnas
         */
        $modelPlan = new DatModeloModel();
        $arrayColumnasnomencladas = $modelPlan->servicioBp($idtipomodelo);
        $columnsHeadersnames = array();
        $columnsHeadersnames['config'][0]['esultimonivel'] = true;
        $columnsHeadersnames['config'][0]['ocultar'] = true;
        $columnsHeadersnames['cm'] = array();
        $columnsHeadersnames['st'] = array();
        $columnsHeadersnames['st_id'] = array();
        $columnsHeadersnames['st_idrama'] = array();
        if ($arrayColumnasnomencladas['idtiponomenclador'][0] == null) {
            return $columnsHeadersnames;
        }
        $iddesglose = DatDesglosetiponomenclador::buscarConfiguracionConColumnasNomencladas(
                        $arrayColumnasnomencladas['idtiponomenclador']
        ); //iddesglose
        if ($iddesglose == null) {
            return $columnsHeadersnames;
        }
        $resultparcial = DatDesglosetiponomenclador::getDatDesglosetiponomenclador($iddesglose);
        $query = new Doctrine_Query();
        /* Ejemplo: Codigo | Denominacion | Nivel Act. | Sector Rama | Destino |  */
        return self::foreachGetGridInterfazIntegracionConPlan($resultparcial, $columnsHeadersnames);
    }

    public function foreachGetGridInterfazIntegracionConPlan($resultparcial, $columnsHeadersnames) {
        $i = 0;
        foreach ($resultparcial as $valor) {
            $columnsHeadersnames['cm'][$i]['dataIndex'] = "idtn" . $valor->NomTiponomenclador->idtiponomenclador;
            $columnsHeadersnames['cm'][$i]['header'] = $valor->NomTiponomenclador->denominacion;
            $columnsHeadersnames['cm'][$i]['width'] = strlen($valor->NomTiponomenclador->denominacion) * 8.5; //100;
            $columnsHeadersnames['cm'][$i]['sortable'] = true;
            $columnsHeadersnames['cm'][$i]['editor'] = "";
            $columnsHeadersnames['cm'][$i]['tooltip'] = $valor->NomTiponomenclador->denominacion;
            $columnsHeadersnames['st'][$i]['name'] = "idtn" . $valor->NomTiponomenclador->idtiponomenclador;
            /* temporal eliminar esto aqui y en la IU */
            $columnsHeadersnames['st_id'][$i]['name'] = " ";
            $i++;
        }
    }

    public function listarDesgloseNivelesActividad($params, $escont = null) {
        $data = new stdClass();
        $data->data = array();
        $data->total = 0;
        $params ['idaprobacion_actividad'] = array(3, 4);
        $params['iddatosnomanclador'] = DatActespcomportamiento::obtenerIdDatosNom();
        $modeloAct = new DatActividadentidadModel();

        switch ($params['orden']) {
            case -1: { // listar niveles de actividad de la entidad
                    $data = $modeloAct->servDesglose_ListarActsNivActPorEntidad($params);
                }
                break;
            case 0: { //listar  consolidado
                    $data = $this->listarDesgloseConsolidado($params, $escont);
                }
                break;
            case 1: { // listar desglose del primer nivel
                    $data = $this->listarDesgloses($params, $escont);
                }
                break;
            default: { // listar desglose del nivel 2 o superior
                    $data = $this->listarDesglosesOrden2_O_Superior(
                            $params, $escont
                    );
                }
        }
        return $data;
    }

    public function listarDesgloseNivelesActividadConsolidados($params) {
        $modeloAct = new DatActividadentidadModel();
        return $modeloAct->servDesglose_listarNivelesActividadConsolidados(
                        $params
        );
    }

    private function auxiliarlistardesgloseforeachprim($strSubConsulta, $desglosetn) {
        return $strSubConsulta . " (SELECT SUM(subde.nivelactividaddesglose)
              FROM mod_planificacion.dat_desgloseentidad subde
              WHERE subde.iddesglosetiponomenclador = {$desglosetn['iddesglosetiponomenclador']}
              AND subde.idactividadentidad = ae.idactividadentidad
              AND subde.uridatosnomenclador IN (SELECT DISTINCT subde2.uridatosnomenclador
              FROM  mod_planificacion.dat_desgloseentidad subde2
              WHERE subde2.iddesglosetiponomenclador = subde.iddesglosetiponomenclador
              AND subde2.idactividadentidad IN ( SELECT ae2.idactividadentidad
              FROM mod_planificacion.dat_actividadentidad ae2
              WHERE ae2.identidad = ae.identidad AND ae2.idejercicio = ae.idejercicio) )
                ) AS idtn" . $desglosetn['idtiponomenclador'] . ",";
    }

    private function auxiliarlistardesgloseforeachseg($strConsultPorciento, $suma, $desglosetn, $params) {
        return $strConsultPorciento . $suma . "
             COALESCE ( (SELECT SUM(subde.nivelactividaddesglose)
              FROM mod_planificacion.dat_desgloseentidad subde
              WHERE subde.idejercicio = " . $params['idejercicio'] . " AND
              subde.iddesglosetiponomenclador = {$desglosetn['iddesglosetiponomenclador']}
              AND subde.idactividadentidad = ae.idactividadentidad
              AND subde.uridatosnomenclador IN (SELECT DISTINCT subde2.uridatosnomenclador
              FROM  mod_planificacion.dat_desgloseentidad subde2
              WHERE subde2.iddesglosetiponomenclador = subde.iddesglosetiponomenclador  AND subde2.idejercicio = "
                . $params['idejercicio'] . "
              AND subde2.idactividadentidad IN ( SELECT ae2.idactividadentidad
              FROM mod_planificacion.dat_actividadentidad ae2
              WHERE ae2.identidad = ae.identidad and ae2.idejercicio = ae.idejercicio) )
               ),0 ) ";
    }

    private function auxiliarlistardesgloseforeachterc($strSubConsultaHaving, $suma, $desglosetn, $params) {
        return $strSubConsultaHaving . "$suma COALESCE ( (SELECT SUM(subde.nivelactividaddesglose)
              FROM mod_planificacion.dat_desgloseentidad subde
              WHERE subde.idejercicio = " . $params['idejercicio'] . " AND
              subde.iddesglosetiponomenclador = {$desglosetn['iddesglosetiponomenclador']}
              AND subde.idactividadentidad = ae.idactividadentidad
              AND subde.uridatosnomenclador IN (SELECT DISTINCT subde2.uridatosnomenclador
              FROM  mod_planificacion.dat_desgloseentidad subde2
              WHERE subde2.iddesglosetiponomenclador = subde.iddesglosetiponomenclador  AND subde2.idejercicio = "
                . $params['idejercicio'] . " AND subde2.idactividadentidad IN ( SELECT ae2.idactividadentidad
              FROM mod_planificacion.dat_actividadentidad ae2 WHERE ae2.identidad = ae.identidad and
              ae2.idejercicio = ae.idejercicio) ) ),0 ) ";
    }

    private function auxiliarlistardesglosehavingprim($arrayIdtn, $idtn, $params) {
        return " COALESCE( (SELECT SUM( COALESCE(subde.nivelactividaddesglose,0))
                        FROM mod_planificacion.dat_desgloseentidad subde
                        WHERE subde.iddesglosetiponomenclador = {$arrayIdtn['idtn' . $idtn]}
                        AND subde.idactividadentidad = ae.idactividadentidad
                        AND subde.uridatosnomenclador IN (SELECT DISTINCT subde2.uridatosnomenclador
                       FROM  mod_planificacion.dat_desgloseentidad subde2
                       WHERE subde2.iddesglosetiponomenclador = subde.iddesglosetiponomenclador
                       AND subde2.idactividadentidad IN ( SELECT ae2.idactividadentidad
                       FROM mod_planificacion.dat_actividadentidad ae2
                       WHERE ae2.identidad = {$params['identidad']} ) )),0)";
    }

    private function auxiliarlistardesgloseconsultagrandeprim($strSubConsulta, $strConsultPorciento, $params, $WHERE, $having) {
        return " SELECT DISTINCT ae.idactividadentidad,a.idactividad,a.codigo,a.denominacion, a.descripcion,
                a.idespecialidad, ae.idaprobacion AS idaprobacionactent $strSubConsulta
        ( COALESCE(aem.nivelactividadmanual,0) +  COALESCE( aea.nivelactividadautomatico,0) +
            COALESCE( aep.nivelactividadproduccion,0) + ROUND(COALESCE(ae.ajuste, 0), 4)) AS nivelactividad,
                am.idmodelo,aed.iddatosnomenclador $strConsultPorciento
                FROM mod_planificacion.nom_actividad a
                LEFT JOIN mod_planificacion.dat_actividadmodelo am ON( am.idactividad= a.idactividad )
                INNER JOIN mod_planificacion.dat_actespcomportamiento aed ON( aed.idactividad = a.idactividad
            AND aed.idespecialidad = ? )
                INNER JOIN mod_planificacion.dat_actividadentidad ae
                ON ( aed.idactespcomportamiento= ae.idactespcomportamiento )
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON( ae.idactividadentidad = aem.idactividadentidad )
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                 ON( ae.idactividadentidad = aea.idactividadentidad )
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( ae.idactividadentidad = aep.idactividadentidad )
                INNER JOIN mod_planificacion.dat_norma n ON (a.idactividad = n.idactividad AND n.idejercicio =   "
                . $params['idejercicio'] . ") WHERE ae.identidad = ? AND
                ae.idejercicio = " . $params['idejercicio'] . "
        AND a.nivel = {$params['nivel']} AND a.normada = '1' AND a.estado = 1
        AND ( a.idaprobacion = 3 OR a.idaprobacion = 4 OR a.idaprobacion = 5 )
                $WHERE GROUP BY
                a.idactividad, a.codigo, a.denominacion,a.descripcion,idespecialidad, ae.idaprobacion,
                ae.idactividadentidad,ae.identidad,aem.nivelactividadmanual,aea.nivelactividadautomatico,
                aep.nivelactividadproduccion,am.idmodelo,aed.iddatosnomenclador,ae.idejercicio,ae.ajuste
                $having ORDER BY a.codigo LIMIT ? OFFSET ?";
    }

    private function auxiliarlistardesgloseconsultagrandesegund($arrayParametros, $params, $addwheretotal, $having) {
        return " SELECT count(alias.idactividadentidad) FROM(SELECT DISTINCT ae.idactividadentidad
         FROM mod_planificacion.nom_actividad a LEFT JOIN mod_planificacion.dat_actividadmodelo am ON(
         am.idactividad= a.idactividad )  INNER JOIN mod_planificacion.dat_actespcomportamiento
         aed ON( aed.idactividad = a.idactividad AND aed.idespecialidad = " . $arrayParametros[0] . " )
         INNER JOIN mod_planificacion.dat_actividadentidad ae ON ( aed.idactespcomportamiento= ae.idactespcomportamiento )
         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON( ae.idactividadentidad = aem.idactividadentidad )
         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON(ae.idactividadentidad = aea.idactividadentidad )
         LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON(ae.idactividadentidad = aep.idactividadentidad )
         INNER JOIN mod_planificacion.dat_norma n ON
         (a.idactividad = n.idactividad AND n.idejercicio = " . $params['idejercicio'] . " )
                WHERE ae.identidad = " . $arrayParametros[1] . "
                 AND ae.idejercicio = " . $params['idejercicio'] . "
                 AND a.nivel = {$params['nivel']} AND a.normada = '1' AND a.estado = 1
                 AND ( a.idaprobacion = 3 OR a.idaprobacion = 4 OR a.idaprobacion = 5 )$addwheretotal
                GROUP BY  ae.idactividadentidad,aem.nivelactividadmanual,aea.nivelactividadautomatico,
             aep.nivelactividadproduccion, ae.ajuste,ae.identidad,ae.idejercicio
                  $having) alias ";
    }

    private function listarDesgloseConsolidado($params, $escont) {
        $WHERE = "";
        $arrayParametros = array();
        $arrayParametrostotalpaginado = array();

        $strSubConsulta = "";
        $arraydesglosesTiponomenclador = DatDesglose:: getTodosDatDesglosetiponomenclador($params['ident']);
        $arrayIdentsTipoNom = array();
        $conn = Doctrine_Manager:: connection();

        $having = "";
        $andhavig = "";
        $addwheretotal = "";
        $strConsultPorciento = "";
        $suma = "";
        $cant = 0;
        $arrayCondhaving = array();
        $arrayIdtn = array();

        foreach ($arraydesglosesTiponomenclador as $desglosetn) {
            $strSubConsulta = self::auxiliarlistardesgloseforeachprim($strSubConsulta, $desglosetn);

            $arrayIdentsTipoNom[] = $desglosetn['idtiponomenclador'];
            $strConsultPorciento = self::auxiliarlistardesgloseforeachseg($strConsultPorciento, $suma, $desglosetn, $params);
            $suma = "+";
            $cant++;
            $arrayIdtn['idtn' . $desglosetn['idtiponomenclador']] = $desglosetn['iddesglosetiponomenclador'];
        }
        if ($strSubConsulta != '') {
            $strSubConsulta = ',' . $strSubConsulta;
        }
        if ($strConsultPorciento != '') {
            $strConsultPorciento = ",round( ( ({$strConsultPorciento}) *100 )/({$cant} *
            ( COALESCE(aem.nivelactividadmanual,0) +  COALESCE( aea.nivelactividadautomatico,0) +
            COALESCE( aep.nivelactividadproduccion,0) + ROUND(COALESCE(ae.ajuste, 0), 4))) ,2 ) as porciento ";
        }
        $arrayParametros[] = $params['idespecialidad'];
        $arrayParametrostotalpaginado[] = $params['idespecialidad'];

        $arrayParametros[] = $params['identidad'];
        $arrayParametrostotalpaginado[] = $params['identidad'];
        //* Filtros de la IU *
        $strSubConsultaHaving = "";
        foreach ($params['filtros'] as $filtro) {
            if ($filtro->field == 'codigo') {
                $WHERE = $WHERE . " AND a.codigo  LIKE ?";
                $addwheretotal .= " AND a.codigo  LIKE " . "'" . $filtro->data->value . "%'";
                $arrayParametros[] = $filtro->data->value . "%";
                $arrayParametrostotalpaginado[] = $filtro->data->value . "%";
            } elseif ($filtro->field == 'denominacion') {
                $WHERE = $WHERE . " AND upper(a.denominacion)  LIKE  ?";
                $addwheretotal .= " AND upper(a.denominacion) LIKE '" . ("%"
                        . strtoupper($filtro->data->value
                        ) . "%'");
                $arrayParametros[] = "%" . strtoupper($filtro->data->value)
                        . "%";
                $arrayParametrostotalpaginado[] = "%" . strtoupper(
                                $filtro->data->value
                        ) . "%";
            } elseif ($filtro->field == 'descripcion') {
                $WHERE = $WHERE . " AND upper(a.descripcion)  LIKE  ? ";
                $addwheretotal .= " AND upper(a.descripcion)   LIKE '" . ("%"
                        . strtoupper(
                                $filtro->data->value
                        ) . "%'");
                $arrayParametros[] = "%" . strtoupper($filtro->data->value)
                        . "%";
                $arrayParametrostotalpaginado[] = "%" . strtoupper(
                                $filtro->data->value
                        ) . "%";
            } elseif ($filtro->field == 'comportamiento') {
                $iddn = null;
                if ($filtro->data->value[0] == 'Compartida') {
                    $iddn = $params['iddatosnomanclador']['compartida'];
                } else {
                    if ($filtro->data->value[0] == 'Demandada') {
                        $iddn = $params['iddatosnomanclador']['demandada'];
                    } else {
                        $iddn = $params['iddatosnomanclador']['propia'];
                    }
                }
                $WHERE = $WHERE . " AND aed.iddatosnomenclador  =  {$iddn} ";
                $addwheretotal .= " AND aed.iddatosnomenclador = " . $iddn . "";
            } elseif ($filtro->field == 'denmodelo') {
                if ($filtro->data->value == '-') {
                    $WHERE = $WHERE . " AND am.idmodelo IS NULL";
                    $addwheretotal .= " AND am.idmodelo IS NULL ";
                } else {
                    $WHERE = $WHERE . " AND am.idmodelo = ?";
                    $addwheretotal .= " AND am.idmodelo = " . $filtro->data->value . "";
                    $arrayParametros[] = $filtro->data->value;
                    $arrayParametrostotalpaginado[] = $filtro->data->value;
                }
            } elseif ($filtro->field == 'denespecialidad') {
                $WHERE = $WHERE . " AND a.idespecialidad = ?";
                $addwheretotal .= " AND a.idespecialidad = "
                        . $filtro->data->value . "";
                $arrayParametros[] = $filtro->data->value;
                $arrayParametrostotalpaginado[] = $filtro->data->value;
            } elseif ($filtro->field == 'idaprobacionactent') {
                $aprob = " ae.idaprobacion = 1 ";
                if ($filtro->data->value[0] == "Si") {
                    $aprob = "  ae.idaprobacion = 3 ";
                } else {
                    if ($filtro->data->value[0] == "Rector") {
                        $aprob = " ae.idaprobacion >= 4 ";
                    }
                }
                $WHERE = $WHERE . " AND $aprob ";
                $addwheretotal .= " AND  " . $aprob . "";
            } elseif ($filtro->field == 'porciento') {
                $cond = " = ";
                if ($filtro->data->comparison == "gt") {
                    $cond = ">";
                } elseif ($filtro->data->comparison == "lt") {
                    $cond = "<";
                }
//                //construir mega consulta

                if ($strSubConsultaHaving == "") {
                    $suma = "";
                    $cant = 0;
                    foreach ($arraydesglosesTiponomenclador as $desglosetn) {
                        $cant++;
                        $strSubConsultaHaving = self::auxiliarlistardesgloseforeachterc(
                                        $strSubConsultaHaving, $suma, $desglosetn, $params);
                        $suma = "+";
                    }
                }

                if ($strSubConsultaHaving != "" && $cant > 0) {
                    $arrayCondhaving[] = "round(  ( ($strSubConsultaHaving)*100/({$cant} * ( COALESCE(aem.nivelactividadmanual,0) +
                         COALESCE( aea.nivelactividadautomatico,0) +  COALESCE( aep.nivelactividadproduccion,0)) +
                         ROUND(COALESCE(ae.ajuste, 0), 4)) ),2) {$cond} "
                            . $filtro->data->value;
                }
            } elseif (substr($filtro->field, 0, 4) == "idtn"
            ) { //field":"idtnNroX
                $idtn = intval(substr($filtro->field, 4));
                if ($idtn > 0) {
                    $cond = " = ";
                    if ($filtro->data->comparison == "gt") {
                        $cond = ">";
                    } elseif ($filtro->data->comparison == "lt") {
                        $cond = "<";
                    }
                    $arrayCondhaving[] = self::auxiliarlistardesglosehavingprim($arrayIdtn, $idtn, $params) .
                            $cond . doubleval($filtro->data->value);
                }
            } elseif ($filtro->field == "nivelactividad") {
                $cond = " = ";
                if ($filtro->data->comparison == "gt") {
                    $cond = ">";
                } elseif ($filtro->data->comparison == "lt") {
                    $cond = "<";
                }
                $addwhere = " AND ( COALESCE(aem.nivelactividadmanual,0) +  COALESCE( aea.nivelactividadautomatico,0) +
                    COALESCE( aep.nivelactividadproduccion,0) + ROUND(COALESCE(ae.ajuste, 0), 4)) {$cond} "
                        . $filtro->data->value . " ";
                $addwheretotal .= " AND ( COALESCE(aem.nivelactividadmanual,0) +
                 COALESCE( aea.nivelactividadautomatico,0) +  COALESCE( aep.nivelactividadproduccion,0) +
                 ROUND(COALESCE(ae.ajuste, 0), 4)) {$cond} "
                        . $filtro->data->value . " ";
                $WHERE = $WHERE . $addwhere;
            }
        }


        $having = " HAVING ( COALESCE(aem.nivelactividadmanual,0)
               +  COALESCE( aea.nivelactividadautomatico,0)
               +  COALESCE( aep.nivelactividadproduccion,0) + ROUND(COALESCE(ae.ajuste, 0), 4)) > 0";
        $andhavig = "";
        if ($arrayCondhaving[0] != null) {
            $having = $having . " AND ";
            foreach ($arrayCondhaving as $condhav) {
                $having = $having . $andhavig . $condhav;
                $andhavig = " AND ";
            }
        }

        $query = self::auxiliarlistardesgloseconsultagrandeprim($strSubConsulta, $strConsultPorciento, $params, $WHERE, $having);
        $arrayParametros[] = $params['limit'];
        $arrayParametros[] = $params['start'];

        if ($escont == null || $escont == false) {

            $res = $conn->execute($query, $arrayParametros);
            $data = new stdClass();
            $data->data = $res->fetchAll(PDO::FETCH_ASSOC);


            $arrayDenmodelos = array();
            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $arrayIdsactividades = array();
            foreach ($data->data as $indice => $actEntidad) {
                if ($arrayIdsactividades["id_"
                        . $actEntidad['idespecialidad']] == null
                ) {

                    $integrator = ZendExt_IoC::getInstance();
                    $arr = Array();
                    $arr[] = $actEntidad['idespecialidad'];
                    $especialidades = $integrator->metadatos->DameEspecialidadesPorArregloId($arr);
                    $arrayIdsactividades["id_"
                            . $actEntidad['idespecialidad']] = $especialidades[0]['denominacion'];
                }
                $data->data[$indice]['denespecialidad'] = $arrayIdsactividades["id_"
                        . $actEntidad['idespecialidad']];

                $data->data [$indice] ['comportamiento'] = 'propia'; //demandada compartida
                $data->data[$indice]['denmodelo'] = '-';
                if ($actEntidad['idmodelo'] != null) {
                    if ($arrayDenmodelos['den_' . $actEntidad['idmodelo']] == null
                    ) {
                        $denomodelo = Doctrine::getTable('DatModelo')->find(
                                        $actEntidad['idmodelo']
                                )->denominacion;
                        $arrayDenmodelos['den_' . $actEntidad['idmodelo']] = $denomodelo;
                    }
                    $data->data[$indice]['denmodelo'] = $arrayDenmodelos['den_'
                            . $actEntidad['idmodelo']];
                }

                $contIdtn = 0;
                foreach ($arrayIdentsTipoNom as $idTopoNom) {
                    if ($data->data[$indice]['idtn' . $idTopoNom] == null) {
                        $data->data[$indice]['idtn' . $idTopoNom] = 0;
                    }
                    $contIdtn++;
                }
                if ($actEntidad['iddatosnomenclador'] == $params['iddatosnomanclador']['demandada']
                ) {
                    $data->data [$indice] ['comportamiento'] = 'demandada'; //
                } else {
                    if ($actEntidad['iddatosnomenclador'] == $params['iddatosnomanclador']['compartida']
                    ) {
                        $data->data [$indice] ['comportamiento'] = 'compartida'; //
                    }
                }
            }
            unset($arrayIdsactividades);
            unset($arrayDenmodelos);
        }

        $conn = Doctrine_Manager:: connection();

        $query = self::auxiliarlistardesgloseconsultagrandesegund($arrayParametros, $params, $addwheretotal, $having);

        if ($escont == null || $escont == true) {

            $res = $conn->execute($query);
            $TOTAL = $res->fetchAll();
            $data->total = $TOTAL[0][0];
        }
        return $data;
    }

    private function listarDesgloses($params, $escont) {
        //$idejercicio, $identidad, $start, $limit,
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();
        $idtiponomenclador = DatDesglosetiponomenclador::getTipoNomenclador(
                        $params['ident'], $params['orden']
                )->idtiponomenclador;
        //* Buscar el TipoNomenclador *
        //* temporal implementar una funcion en NomDatosnomenclador, creo que ya existe *
        $columnasNomenclador = array();
        $queryColumnasNomenclador = new Doctrine_Query();
        $columnasNomenclador = $queryColumnasNomenclador
                        ->from('NomDatosnomenclador dn')->addWhere('dn.idtiponomenclador = ?', $idtiponomenclador)
                        ->orderBy('dn.iddatosnomenclador')->execute();
        $arrayIdramas = array();
        $desglosetiponomenclador = DatDesglose::getDatDesglosetiponomenclador(
                        $params['ident'], $params['orden']
        );
        $nroalias = 1;
        $arrayOrdencolumn = array();
        $orden = 1;

        foreach ($columnasNomenclador as $columnaNomenclador) {
            $_indice = $columnaNomenclador->iddatosnomenclador;
            $arrayIdramas[$_indice] = ($params['idpadrerama'] != null) ?
                    $params['idpadrerama'] . ","
                    . $columnaNomenclador->iddatosnomenclador : $columnaNomenclador->iddatosnomenclador;
            $arrayIdramas["coldin_" . $_indice . "_" . $_indice] = $columnaNomenclador->iddatosnomenclador;
            $arrayOrdencolumn["n__" . $orden++] = "_" . $columnaNomenclador->iddatosnomenclador . "_"
                    . $columnaNomenclador->iddatosnomenclador;
        }

        $query->from('NomActividad a')
                ->leftJoin("a.DatActividadmodelo am")
                ->innerJoin("a.DatActespcomportamiento aed ")
                ->innerJoin("aed.DatActividadentidad ae ")
                ->leftJoin('ae.DatActividadentidadmanual aem')
                ->leftJoin('ae.DatActividadentidadautomatico aea')
                ->leftJoin('ae.DatActividadentidadproduccion aep')
                ->innerJoin("a.DatNorma n ");

        $addwheretotal = "";
        foreach ($params['filtros'] as $filtro) {
            if ($filtro->field == 'codigo') {
                $query->addWhere(
                        "a.codigo LIKE " . ("'" . $filtro->data->value . "%'")
                );
                $addwheretotal .= " AND n.codigo  LIKE " . "'"
                        . $filtro->data->value . "%'";
            } elseif ($filtro->field == 'denominacion') {
                $query->addWhere(
                        "upper(a.denominacion) LIKE " . ("'%" . strtoupper(
                                $filtro->data->value
                        ) . "%'"
                        )
                );
                $addwheretotal .= " AND upper(n.denominacion) LIKE '" . ("%"
                        . strtoupper(
                                $filtro->data->value
                        ) . "%'");
            } elseif ($filtro->field == 'descripcion') {
                $query->addWhere(
                        "upper(a.descripcion) LIKE " . ("'%" . strtoupper(
                                $filtro->data->value
                        ) . "%'"
                        )
                );
                $addwheretotal .= " AND upper(n.descripcion)   LIKE '" . ("%"
                        . strtoupper(
                                $filtro->data->value
                        ) . "%'");
            } elseif ($filtro->field == 'comportamiento') {
                $iddn = $params['iddatosnomanclador']['propia'];
                if ($filtro->data->value[0] == "Demandada") {
                    $iddn = $params['iddatosnomanclador']['demandada'];
                } else {
                    if ($filtro->data->value[0] == "Compartida") {
                        $iddn = $params['iddatosnomanclador']['compartida'];
                    }
                }
                $query->addWhere("aed.iddatosnomenclador = {$iddn} ");
                $addwheretotal .= " AND d2.iddatosnomenclador = " . $iddn . "";
            } elseif ($filtro->field == 'denmodelo') {
                if ($filtro->data->value == '-') {
                    $query->addWhere("am.idmodelo IS NULL");
                    $addwheretotal .= " AND d.idmodelo IS NULL ";
                } else {
                    $query->addWhere("am.idmodelo = " . $filtro->data->value);
                    $addwheretotal .= " AND d.idmodelo = "
                            . $filtro->data->value . "";
                }
            } elseif ($filtro->field == 'idaprobacionactent') {
                $aprob = " = 1";
                if ($filtro->data->value[0] == "Si") {
                    $aprob = " = 3";
                } else {
                    if ($filtro->data->value[0] == "Rector") {
                        $aprob = " >= 4";
                    }
                }
                $query->addWhere("ae.idaprobacion $aprob ");
                $addwheretotal .= " AND d3.idaprobacion " . $aprob . "";
            } elseif ($filtro->field == 'denespecialidad') {
                $query->addWhere("a.idespecialidad = " . $filtro->data->value);
                $addwheretotal .= " AND n.idespecialidad = "
                        . $filtro->data->value . "";
            } elseif ($filtro->field == 'nivelactividad') {
                $cond = " = ";
                if ($filtro->data->comparison == "gt") {
                    $cond = ">";
                } elseif ($filtro->data->comparison == "lt") {
                    $cond = "<";
                }
                $query->addWhere(
                        " ( COALESCE(aem.nivelactividadmanual,0) +
                     COALESCE(aea.nivelactividadautomatico,0)+
                     COALESCE(aep.nivelactividadproduccion,0) +
      ROUND(COALESCE(ae.ajuste, 0), 4)) {$cond} " . $filtro->data->value
                );
                $addwheretotal
                        .= " AND ( COALESCE(d4.nivelactividadmanual,0)+
                                      COALESCE(d5.nivelactividadautomatico,0)+
                                      COALESCE(d6.nivelactividadproduccion,0)+
                                      ROUND(COALESCE(d3.ajuste, 0), 4)) "
                        . $cond . " " .
                        $filtro->data->value . "";
            } elseif ($arrayIdramas['coldin' . $filtro->field] != null) {
                $alias = "de" . $nroalias++;

                $cond = "=";
                if ($filtro->data->comparison == "gt") {
                    $cond = ">";
                } elseif ($filtro->data->comparison == "lt") {
                    $cond = "<";
                }


                $query->addWhere(
                        "COALESCE(( SELECT {$alias}.nivelactividaddesglose
                FROM DatDesgloseentidad {$alias}
                WHERE {$alias}.idactividadentidad = ae.idactividadentidad
                   AND {$alias}.iddesglosetiponomenclador = {$desglosetiponomenclador->iddesglosetiponomenclador}
                   AND {$alias}.iddesgloseentidad = {$alias}.idpadre
                   AND {$alias}.iddatosnomenclador = {$arrayIdramas['coldin' . $filtro->field]}
                   AND {$alias}.idejercicio = {$params['idejercicio']}
              OFFSET 0 LIMIT 1 ),0) {$cond} " . doubleval($filtro->data->value)
                );
            }
        }
        $query->addWhere('ae.idejercicio = ' . $params['idejercicio'])
                ->addWhere('ae.identidad = ' . $params['identidad'])
                ->addWhere('a.idaprobacion >=3 ')
                ->addWhere('aed.idespecialidad =' . $params['idespecialidad'])
                ->addWhere('a.estado = 1 ')//;
                ->addWhere('n.idejercicio = ' . $params['idejercicio']);


        $query->groupBy(self::groupbyarriba());
        $query->select(self::selectarriba());

        foreach ($columnasNomenclador as $columnaNomenclador) {
            $alias = "de" . $nroalias++;
            $aliasDos = "de" . $nroalias++;
            $query->addSelect(
                    " ( SELECT ({$alias}.iddesgloseentidad || '@'||{$alias}.nivelactividaddesglose ) as id_nad
                FROM DatDesgloseentidad {$alias}
               WHERE {$alias}.idactividadentidad = ae.idactividadentidad
                   AND {$alias}.iddesglosetiponomenclador = {$desglosetiponomenclador->iddesglosetiponomenclador}
                   AND {$alias}.iddesgloseentidad = {$alias}.idpadre
                   AND {$alias}.iddatosnomenclador = {$columnaNomenclador->iddatosnomenclador}
                   AND {$alias}.idejercicio = {$params['idejercicio']}
                   OFFSET 0 LIMIT 1
               ) as _" . $columnaNomenclador->iddatosnomenclador
            );
        }


        $query->orderby('a.codigo');

        $conn = Doctrine_Manager::connection();

        if ($escont == null || $escont == false) {

            $data->data = $conn->execute(
                    $query->getSqlQuery()
                    . " OFFSET {$params['start']} LIMIT {$params['limit']}"
            );
            $data->data = $data->data->fetchAll(PDO::FETCH_ASSOC);
        }

        if ($escont == null || $escont == true) {
            $querytotal = self::contarselectarriba($params, $addwheretotal);

            $data->total = $conn->execute($querytotal);
            $data->total = $data->total->fetchAll(PDO::FETCH_ASSOC);
            $data->total = $data->total[0]['count'];
        }
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $arrayIdsactividades = array();
        $arrayIdsmodelos = array();
        foreach ($data->data as $indice => $nivelactividad) {

            foreach ($nivelactividad as $kDos => $valor) {

                $data->data[$indice]["__" . $arrayIdramas["coldin" . $arrayOrdencolumn[$kDos]]] = null;
                $data->data[$indice][$arrayOrdencolumn[$kDos]] = "0";
                if ($arrayOrdencolumn[$kDos] != null && $valor) {
                    $data->data[$indice][$arrayOrdencolumn[$kDos]] = $valor;
                    if ($valor) {
                        $iddeNad = split("@", $valor);
                        $data->data[$indice][$arrayOrdencolumn[$kDos]] = $iddeNad[1];
                        $data->data[$indice]["__" . $arrayIdramas["coldin"
                                . $arrayOrdencolumn[$kDos]]] = $iddeNad[0];
                    }
                    unset($data->data[$indice][$kDos]);
                } else {

                }
            }
            $data->data[$indice]['idactividad'] = $nivelactividad['n__idactividad'];
            $data->data[$indice]['codigo'] = $nivelactividad['n__codigo'];
            $data->data[$indice]['denominacion'] = $nivelactividad['n__denominacion'];
            $data->data[$indice]['descripcion'] = $nivelactividad['n__descripcion'];
            $data->data[$indice]['idespecialidad'] = $nivelactividad['n__idespecialidad'];
            $data->data[$indice]['idmodelo'] = $nivelactividad['d2__idmodelo'];
            $data->data[$indice]['iddatosnomenclador'] = $nivelactividad['d2__iddatosnomenclador'];
            $data->data[$indice]['idactividadentidad'] = $nivelactividad['d3__idactividadentidad'];
            $data->data[$indice]['identidad'] = $nivelactividad['d3__identidad'];
            $data->data[$indice]['idejercicio'] = $nivelactividad['d3__idejercicio'];
            foreach ($columnasNomenclador as $columnaNomenclador) {
                $indiceIdrama = "idrama" . $columnaNomenclador->iddatosnomenclador;
                $data->data[$indice][$indiceIdrama] = $arrayIdramas[$columnaNomenclador->iddatosnomenclador];
            }
            $data->data[$indice]['nivelactividad'] = 0;
            if ($nivelactividad['d4__nivelactividadmanual']) {
                $data->data[$indice]['nivelactividad'] += $nivelactividad['d4__nivelactividadmanual'];
            }
            if ($nivelactividad['d5__nivelactividadautomatico']) {
                $data->data[$indice]['nivelactividad']+= $nivelactividad['d5__nivelactividadautomatico'];
            }
            if ($nivelactividad['d6__nivelactividadproduccion']) {
                $data->data[$indice]['nivelactividad']+= $nivelactividad['d6__nivelactividadproduccion'];
            }
            if ($nivelactividad['d3__ajuste']) {
                $data->data[$indice]['nivelactividad'] += $nivelactividad['d3__ajuste'];
            }

            $data->data[$indice] ['comportamiento'] = 'propia';

            if ($nivelactividad['d2__iddatosnomenclador'] == $params['iddatosnomanclador']['demandada']
            ) {
                ///iddatosnomenclador
                $data->data [$indice] ['comportamiento'] = 'demandada'; //
            } else {
                if ($nivelactividad['d2__iddatosnomenclador'] == $params['iddatosnomanclador']['compartida']
                ) {
                    $data->data [$indice] ['comportamiento'] = 'compartida'; //
                }
            }
            $data->data[$indice]['idaprobacionactent'] = $nivelactividad['d3__idaprobacion'];

            if ($nivelactividad ['d__idmodelo'] != null) {
                if ($arrayIdsmodelos['id' . $nivelactividad ['d__idmodelo']] == null
                ) {
                    $arrayIdsmodelos['id' . $nivelactividad ['d__idmodelo']] = Doctrine::getTable('DatModelo')->find(
                                    $nivelactividad ['d__idmodelo']
                            )->denominacion;
                }
                $data->data[$indice]['denmodelo'] = $arrayIdsmodelos['id' . $nivelactividad ['d__idmodelo']];
            } else {
                $data->data[$indice]['denmodelo'] = null;
            }
            if ($arrayIdsactividades["id_" . $nivelactividad['idespecialidad']] == null
            ) {
                $especialidades = $this->integrator->metadatos->EspecialidadById($nivelactividad['n__idespecialidad']);

                $arrayIdsactividades["id_" . $nivelactividad['n__idespecialidad']] = $especialidades[0]['denespecialidad'];
            }
            $data->data[$indice]['denespecialidad'] = $arrayIdsactividades["id_"
                    . $nivelactividad['n__idespecialidad']];
            $data->data[$indice]['idpadre_fila_desglose'] = null;
            $data->data[$indice]['iddesglosetiponomenclador'] = $desglosetiponomenclador->iddesglosetiponomenclador;
        }
        return $data;
    }

    public function contarselectarriba($params, $addwheretotal) {
        return "SELECT count(DISTINCT n.idactividad)
FROM mod_planificacion.nom_actividad n
LEFT JOIN mod_planificacion.dat_actividadmodelo d ON n.idactividad = d.idactividad
INNER JOIN mod_planificacion.dat_actespcomportamiento d2 ON n.idactividad = d2.idactividad
INNER JOIN mod_planificacion.dat_actividadentidad d3 ON d2.idactespcomportamiento = d3.idactespcomportamiento
LEFT JOIN mod_planificacion.dat_actividadentidadmanual d4 ON d3.idactividadentidad = d4.idactividadentidad
LEFT JOIN mod_planificacion.dat_actividadentidadautomatico d5 ON d3.idactividadentidad = d5.idactividadentidad
LEFT JOIN mod_planificacion.dat_actividadentidadproduccion d6 ON d3.idactividadentidad = d6.idactividadentidad
INNER JOIN mod_planificacion.dat_norma d7 ON n.idactividad = d7.idactividad
WHERE d3.idejercicio = " . $params['idejercicio'] . "
AND d3.identidad = " . $params['identidad'] . "
AND n.idaprobacion >= 3 AND d2.idespecialidad = " . $params['idespecialidad'] . "
AND n.estado = 1 AND d7.idejercicio = " . $params['idejercicio'] . " $addwheretotal";
    }

    private function groupbyarriba() {
        return 'a.idactividad, a.codigo,a.denominacion, a.descripcion, am.idactividadmodelo, am.idactividad,
             am.idmodelo, a.idespecialidad, aed.iddatosnomenclador, aed.idactespcomportamiento,ae.idactividadentidad,
             ae.identidad, ae.idejercicio,ae.idactividad, ae.idaprobacion, ae.version, ae.idactespcomportamiento,
             ae.ajuste, aem.idactividadentidad,aem.nivelactividadmanual, aem.version, aea.idactividadentidad,
             aea.idregla, aea.nivelactividadautomatico, aea.version, aep.idactividadentidad,
             aep.nivelactividadproduccion, aep.version';
    }

    private function selectarriba() {
        return "a.idactividad, a.codigo, a.denominacion, a.descripcion,am.idmodelo, a.idespecialidad,
        aed.iddatosnomenclador, ae.idactividadentidad,ae.identidad, ae.idejercicio, ae.idactividad,ae.idaprobacion,
        ae.version,ae.idactespcomportamiento, ae.ajuste,ROUND(COALESCE(ae.ajuste, 0), 4) as ajuste,
        aem.idactividadentidad,aem.nivelactividadmanual, aem.version, aea.idactividadentidad,aea.idregla,
        aea.nivelactividadautomatico, aea.version, aep.idactividadentidad, aep.nivelactividadproduccion,aep.version";
    }

    private function listarDesglosesOrden2_O_Superior($params, $escont) {
        $query = new Doctrine_Query();
        $nroalias = 1;
        $idtiponomenclador = DatDesglosetiponomenclador::getTipoNomenclador(
                        $params['ident'], $params['orden']
                )->idtiponomenclador;
        /* Buscar el TipoNomenclador */
        $columnasNomenclador = array();
        /* temporal cambiar esto por una funcion en NomDatosnomenclador  */
        $desglosetiponomenclador = DatDesglose::getDatDesglosetiponomenclador(
                        $params['ident'], $params['orden'] - 1
        );
        $queryColumnasNomenclador = new Doctrine_Query();
        $columnasNomenclador = $queryColumnasNomenclador
                ->from('NomDatosnomenclador dn')
                ->addWhere('dn.idtiponomenclador = ?', $idtiponomenclador)
                ->execute();
        $query->from('NomActividad a')
                ->innerJoin("a.DatActespcomportamiento aed ")
                ->leftJoin('a.DatActividadmodelo  am')
                ->innerJoin('aed.DatActividadentidad ae ')
                ->leftJoin("ae.DatDesgloseentidad dnae")
                ->addWhere(
                        "dnae.iddesglosetiponomenclador = " . $desglosetiponomenclador->iddesglosetiponomenclador . ""
                )
                ->addWhere("dnae.uridatosnomenclador LIKE '" . $params['idpadrerama'] . "'")
                ->addWhere(" dnae.iddatosnomenclador = " . $params['columna'])
                ->addWhere('ae.idejercicio = ' . $params['idejercicio'])
                ->addWhere('ae.identidad = ' . $params['identidad'])
                ->addWhere('aed.idespecialidad = ' . $params ['idespecialidad'])
                ->addWhere(
                        'a.idaprobacion >= ' . $params['idaprobacion_actividad'][0] .
                        ' AND a.idaprobacion <= ' . $params['idaprobacion_actividad'][1]
                )->addWhere('a.estado = 1');

        $arrayIdpadrerama = array();
        $arrayIdpadreramacopia = array();
        $arrayIdramas = array();
        foreach ($columnasNomenclador as $columnaNomenclador) {
            $_indice = $columnaNomenclador->iddatosnomenclador;
            $arrayIdpadrerama[$_indice] = str_replace(
                            ',', 's', $params['idpadrerama']
                    ) . "s"
                    . $columnaNomenclador->iddatosnomenclador;
            $arrayIdpadreramacopia[] = $params['idpadrerama'] . ","
                    . $columnaNomenclador->iddatosnomenclador;
            $arrayIdpadrerama['_' . $columnaNomenclador->iddatosnomenclador
                    . "_" . $arrayIdpadrerama[$_indice]] = $_indice;
        }
        $queryDesglosesHijos = new Doctrine_Query();
        $queryDesglosesHijos->from("DatDesgloseentidad dnae");
        $iddesglosetiponomenclador = DatDesglose::getDatDesglosetiponomenclador(
                        $params['ident'], $params['orden']
                )->iddesglosetiponomenclador;
        foreach ($params['filtros'] as $filtro) {
            if ($filtro->field == 'codigo') {
                $query->addWhere("a.codigo LIKE " . ("'" . $filtro->data->value . "%'"));
            } elseif ($filtro->field == 'denominacion') {
                $query->addWhere(
                        "upper(a.denominacion) LIKE ", ("'%" . strtoupper($filtro->data->value) . "%'")
                );
            } elseif ($filtro->field == 'denmodelo') {
                if ($filtro->data->value == '-') {
                    $query->addWhere("am.idmodelo IS NULL");
                } else {
                    $query->addWhere("am.idmodelo = " . $filtro->data->value);
                }
            } elseif ($filtro->field == 'idaprobacionactent') {
                $aprob = " = 1";
                if ($filtro->data->value[0] == "Si") {
                    $aprob = " = 3";
                } else {
                    if ($filtro->data->value[0] == "Rector") {
                        $aprob = " >= 4";
                    }
                }
                $query->addWhere("ae.idaprobacion $aprob");
            } elseif ($filtro->field == 'denespecialidad') {
                $query->addWhere("a.idespecialidad = " . $filtro->data->value);
            } elseif ($arrayIdpadrerama[$filtro->field] != null) {
                $alias = "de" . $nroalias++;
                $cond = "=";
                if ($filtro->data->comparison == "gt") {
                    $cond = ">";
                } elseif ($filtro->data->comparison == "lt") {
                    $cond = "<";
                }
                $partes = split('_', $filtro->field);
                $query->addWhere(
                        "( SELECT COALESCE({$alias}.nivelactividaddesglose,1)FROM DatDesgloseentidad {$alias}
                                    WHERE  {$alias}.idpadre = dnae.iddesgloseentidad
                                    AND {$alias}.uridatosnomenclador = '{$partes[2]}'
                                    ) {$cond} " . doubleval($filtro->data->value)
                );
            } elseif ($filtro->field == 'nivelactividad') {
                $cond = " = ";
                if ($filtro->data->comparison == "gt") {
                    $cond = ">";
                } elseif ($filtro->data->comparison == "lt") {
                    $cond = "<";
                }
                $query->addWhere(
                        " COALESCE(nivelactividaddesglose,0) {$cond} "
                        . $filtro->data->value
                );
            }
        }


        $query->select('COUNT(a.idactividad) as total');
        $sqlCount = $query->getSqlQuery();

        $conn = Doctrine_Manager::connection();
        if ($escont == null || $escont == false) {
            $query->select('a.*,aed.*,ae.*,am.*,dnae.*');
            $query->orderby('a.codigo');

            $data->data = $conn->execute(
                    $query->getSqlQuery()
                    . " OFFSET {$params['start']} LIMIT {$params['limit']} "
            );
            $data->data = $data->data->fetchAll(PDO::FETCH_ASSOC);
            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $arrayIdactividadentidad = array();
            $arraySeleccionpadres = array();

            if (false) {
                foreach ($data->data as $indice => $nivelactividad) {
                    unset($data->data[$indice]);
                    $data->data[$indice]["codigo"] = $nivelactividad['n__codigo'];
                    $data->data[$indice]["denominacion"] = $nivelactividad['n__denominacion'];
                    $data->data[$indice]["nivelactividad"] = $nivelactividad['d5__0'];
                }
            }


            foreach ($data->data as $indice => $nivelactividad) {
                unset($data->data[$indice]);
                $data->data[$indice]["idactividad"] = $nivelactividad['n__idactividad'];
                $data->data[$indice]["codigo"] = $nivelactividad['n__codigo'];
                $data->data[$indice]["denominacion"] = $nivelactividad['n__denominacion'];
                $data->data[$indice]["descripcion"] = $nivelactividad['n__descripcion'];
                $data->data[$indice]["codigo"] = $nivelactividad['n__codigo'];
                $data->data[$indice]["idespecialidad"] = $nivelactividad['n__idespecialidad'];

                $data->data[$indice]["idactividadentidad"] = $nivelactividad['d3__idactividadentidad'];
                $data->data[$indice]["identidad"] = $nivelactividad['d3__identidad'];
                $data->data[$indice]["idaprobacion"] = $nivelactividad['d3__idaprobacion'];
                $data->data[$indice]["nivelactividad"] = $nivelactividad['d4__nivelactividaddesglose'];
                $data->data [$indice] ['comportamiento'] = 'propia'; //
                if ($nivelactividad['d__iddatosnomenclador'] == $params['iddatosnomanclador']['demandada']
                ) {
                    $data->data [$indice] ['comportamiento'] = 'demandada'; //
                } else {
                    if ($nivelactividad['d__iddatosnomenclador'] == $params['iddatosnomanclador']['compartida']
                    ) {
                        $data->data [$indice] ['comportamiento'] = 'compartida';
                    }
                }
                $data->data[$indice]['idaprobacionactent'] = $nivelactividad['d3__idaprobacion'];
                if ($nivelactividad ['d2__idmodelo'] != null) {
                    $denomodelo = Doctrine::getTable('DatModelo')->find(
                                    $nivelactividad ['d2__idmodelo'])
                            ->denominacion;
                    $data->data[$indice]['denmodelo'] = $denomodelo;
                } else {
                    $data->data[$indice]['denmodelo'] = '-';
                }
                if ($arrayIdsactividades["id_" . $nivelactividad['n__idespecialidad']] == null
                ) {
                    $especialidades = $this->integrator->metadatos->EspecialidadById(
                            $nivelactividad['n__idespecialidad']
                    );
                    $arrayIdsactividades["id_" . $nivelactividad['n__idespecialidad']] = $especialidades[0]['denespecialidad'];
                }

                $data->data[$indice]['denespecialidad'] = $arrayIdsactividades["id_" . $nivelactividad['n__idespecialidad']];
//
                $arrayIdactividadentidad[] = $nivelactividad['d3__idactividadentidad'];
//                /* INICIALIZAR VALORES DE COLUMNAS */
                $data->data[$indice]["idpadre_fila_desglose"] = $nivelactividad['d4__iddesgloseentidad'];
                $data->data[$indice]['iddesglosetiponomenclador'] = $iddesglosetiponomenclador;
                $arraySeleccionpadres[] = $nivelactividad['d4__iddesgloseentidad'];
//
                /* 1. Inicializar todas las columnas de nomencladores en cero */
                foreach ($columnasNomenclador as $columnaNomenclador) {
                    $gUIONindicerama = $columnaNomenclador->iddatosnomenclador;
                    $arrayIddn[] = $columnaNomenclador->iddatosnomenclador;
                    $denoColumnanomenclador = "_" . $columnaNomenclador->iddatosnomenclador . '_'
                            . $arrayIdpadrerama[$gUIONindicerama];
                    $data->data[$indice][$denoColumnanomenclador] = '0';
                    /*                     * ************* */
                    $dobleguioniddnaenombrecolumna = "__" . $columnaNomenclador->iddatosnomenclador;
                    $data->data[$indice][$dobleguioniddnaenombrecolumna] = null;
                    $data->data[$indice]["idrama" . $gUIONindicerama] = $arrayIdpadrerama[$gUIONindicerama];
                }
            }
            //LISTAR NIVEL 2....N

            if ($arraySeleccionpadres[0] != null) {
                $queryDesglosesHijos->whereIn("dnae.idpadre", $arraySeleccionpadres);
                $queryDesglosesHijos->whereIn("dnae.idactividadentidad", $arrayIdactividadentidad);
                $queryDesglosesHijos->whereIn("dnae.uridatosnomenclador", $arrayIdpadreramacopia);
                $desglosesHijos = $queryDesglosesHijos
                                ->addWhere("dnae.idpadre <> dnae.iddesgloseentidad")
                                ->addWhere("dnae.iddesglosetiponomenclador = ?", $iddesglosetiponomenclador)
                                ->execute()->toArray(true);
                /* PASO 4. BUSCAR LOS DESGLOSES EXISTENTES */
                foreach ($data->data as $indiceNivelact => $datosColumna) {
                    /* 1. Asignar los valores almacenados de las columnas de nomencladores */
                    foreach (
                    $desglosesHijos as $indiceDesglose => $desgloseAlmacenado
                    ) {
                        if ($datosColumna['idpadre_fila_desglose'] . " " == $desgloseAlmacenado ['idpadre'] . " "
                        ) {
                            $_nombrecolumna = "_" . $desgloseAlmacenado ['iddatosnomenclador']
                                    . '_'
                                    . $arrayIdpadrerama[$desgloseAlmacenado ['iddatosnomenclador']];
                            $data->data[$indiceNivelact][$_nombrecolumna] = $desgloseAlmacenado['nivelactividaddesglose'];
                            /* Enviar los iddatonomecladoractividadentidad */
                            $dobleguioniddnaenombrecolumna = "__" . $desgloseAlmacenado ['iddatosnomenclador'];
                            $data->data[$indiceNivelact][$dobleguioniddnaenombrecolumna] = $desgloseAlmacenado['iddesgloseentidad'];
                            $indiceIdrama = "idrama" . $desgloseAlmacenado ['iddatosnomenclador'];
                            $data->data[$indiceNivelact][$indiceIdrama] = $desgloseAlmacenado ['idrama'];
                        }
                    }
                }
            }
        }
        if ($escont == null || $escont == true) {
            $data->total = $conn->execute($sqlCount);
            $data->total = $data->total->fetchAll(PDO::FETCH_ASSOC);
            $data->total = $data->total[0]['n__0'];
        }
        return $data;
    }

    public function gestionarDesglose(
    $identidad, $ident, $orden, $gUIONcolumna, $idpadrerama, $nivelesActividaddesglosados, $idejercicio
    ) {

        $modelNecesidadDesglose = new DatNecesidaddesgloseModel();
        $arrayDesgloseshijosaelim = array();
        $arrayIdact = array();
        foreach ($nivelesActividaddesglosados as $desglose) {
            $arrayIdact[] = $desglose->idactividad;
            $valorcolumna = floatval($desglose->nivelactividaddesglose);


            if ($desglose->iddesgloseentidad != null) {
                $viejoDesglose = Doctrine::getTable('DatDesgloseentidad')
                        ->find($desglose->iddesgloseentidad);
                if ($valorcolumna > 0) {
                    /* PASO 2.1 */
                    $arrayDesgloseshijosaelim[] = $viejoDesglose->iddesgloseentidad;
                    $viejoDesglose->nivelactividaddesglose = $valorcolumna;
                    $viejoDesglose->idejercicio = $idejercicio;
                    $this->Actualizar($viejoDesglose);
                    if (DatDesglosetiponomenclador::esUltimoNivel(
                                    $ident, $orden
                            )
                    ) {
                        $modelNecesidadDesglose->desglosarIndicador(
                                $viejoDesglose->iddesgloseentidad, $viejoDesglose->idactividadentidad, $viejoDesglose->nivelactividaddesglose, $desglose->idactividad, $nada, $idejercicio
                        );
                    }
                } else {
                    /* PASO 1 */
                    //$valorcolumna = '0';
                    $this->Eliminar($viejoDesglose);
                    /* Eliminar en cascada los desgloses de indicadores (Garantizado por la Base de Datos) */
                }
            } elseif ($valorcolumna > 0) {

                /* PASO 2.2 */
                $this->adicionarDesglose(
                        $ident, $orden, $valorcolumna, $desglose, $idpadrerama, $modelNecesidadDesglose, $idejercicio
                );
            }
        }


        if ($arrayDesgloseshijosaelim[0] != null) {
            $query = Doctrine_Query::create();
            $resultDos = $query->delete('DatDesgloseentidad')
                            ->from('DatDesgloseentidad')
                            ->whereIn('idpadre', $arrayDesgloseshijosaelim)
                            ->addWhere('idpadre <> iddesgloseentidad')->execute();
        }

        $strIdact = implode(",", $arrayIdact);


        $conn = Doctrine_Manager::connection();
        $sqlQuery = self::selectActividadesmetododeArriba($strIdact);
        $result = $conn->execute(
                        $sqlQuery, array($ident, $ident, $identidad, $idejercicio)
                )->fetchAll(PDO::FETCH_ASSOC);

        $arrayColldesglosecomp = new Doctrine_Collection(
                Doctrine:: getTable('DatDesglosecompleto')
        );
        $i = 0;

        $orWhere = '';
        $or = ' ';
        foreach ($result as $indice => $deComp) {
            if ($deComp['sum_niveldesglose'] == $deComp['sum_nivelact']) {
                if (!$deComp['idactentcompleto'] && !$deComp['idactentcompleto']
                ) {
                    $arrayColldesglosecomp[$i]->idactividadentidad = $deComp['idactividadentidad'];
                    $arrayColldesglosecomp[$i]->iddesglosetiponomenclador = $deComp['iddesglosetiponomenclador'];
                    $arrayColldesglosecomp[$i]->idejercicio = $idejercicio;
                    $i++;
                }
            } else {
                if ($deComp['idactentcompleto'] != null && $deComp['iddesglosetncompleto'] != null
                ) {
                    $orWhere .= $or . ' ( idactividadentidad = ' . $deComp['idactentcompleto']
                            . ' and iddesglosetiponomenclador = ' . $deComp['iddesglosetncompleto'] . ' ) ';
                    $or = ' OR ';
                }
            }
        }

        $arrayColldesglosecomp->save();

        if ($orWhere != '') {
            $query = Doctrine_Query::create();
            $query->delete('DatDesglosecompleto')->from('DatDesglosecompleto')
                    ->addWhere($orWhere)->execute();
        }

        return true;
    }

    private function selectActividadesmetododeArriba($strIdact) {

        return " SELECT ae.idactividadentidad,SUM( COALESCE (de.nivelactividaddesglose,0)) as sum_niveldesglose,
                  ( COALESCE(aea.nivelactividadautomatico,0)+COALESCE(aem.nivelactividadmanual,0)+
                  COALESCE(aep.nivelactividadproduccion,0) ) as sum_nivelact, dc.idactividadentidad as idactentcompleto,
                  dc.iddesglosetiponomenclador as iddesglosetncompleto,de.iddesglosetiponomenclador
                  FROM mod_planificacion.dat_actividadentidad ae
                  LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                  ON( aea.idactividadentidad = ae. idactividadentidad )
                  LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                  ON( aem.idactividadentidad = ae. idactividadentidad )
                  LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                   ON( aep.idactividadentidad = ae. idactividadentidad )
                  LEFT JOIN mod_planificacion.dat_desgloseentidad de
                  ON( ae.idactividadentidad = de. idactividadentidad AND de.iddesglosetiponomenclador =
                    ( SELECT dtn.iddesglosetiponomenclador FROM mod_planificacion.dat_desglosetiponomenclador dtn
                     WHERE  dtn.orden = ( SELECT MAX( dtn1.orden )
                     FROM mod_planificacion.dat_desglosetiponomenclador dtn1
                     WHERE dtn1.iddesglose = ? ) AND dtn.iddesglose = ? ) )
                     LEFT JOIN mod_planificacion.dat_desglosecompleto dc
                      ON( dc.idactividadentidad = ae.idactividadentidad )
                     WHERE ae.identidad= ? AND ae.idejercicio = ? AND ae.idactividad IN({$strIdact})
                     GROUP BY ae.idactividadentidad,aea.nivelactividadautomatico,aem.nivelactividadmanual,
                     aep.nivelactividadproduccion,dc.idactividadentidad,dc.iddesglosetiponomenclador,
                     de.iddesglosetiponomenclador";
    }

    private function adicionarDesglose(
    $iddesglose, $orden, $nivelactividaddesglose, $desglose, $idpadrerama, $modelNecesidadDesglose, $idejercicio
    ) {

        $nuevodesglose = new DatDesgloseentidad();
        $nuevodesglose->idactividadentidad = $desglose->idactividadentidad;
        $nuevodesglose->iddatosnomenclador = $desglose->iddatosnomenclador;
        $nuevodesglose->iddesglosetiponomenclador = $desglose->iddesglosetiponomenclador;
        $nuevodesglose->idpadre = $desglose->idpadre_fila_desglose;
        $nuevodesglose->nivelactividaddesglose = $nivelactividaddesglose;

        $nuevodesglose->idejercicio = $idejercicio;
        $nuevodesglose->save();
        /* Actualizar completamiento del desglose */
        if (DatDesglosetiponomenclador::esUltimoNivel($iddesglose, $orden)) {
            $modelNecesidadDesglose->desglosarIndicador(
                    $nuevodesglose->iddesgloseentidad, $nuevodesglose->idactividadentidad, $nuevodesglose->nivelactividaddesglose, $desglose->idactividad, false, $idejercicio
            );
        }

        return true;
    }

    public function buscar_eliminar_desglose($iddesgloseentidad) {
        $query = Doctrine_Query::create();
        $resultUno = $query->delete('DatNecesidaddesglose')
                        ->from('DatNecesidaddesglose')
                        ->where('iddesgloseentidad = ?', $iddesgloseentidad)->execute();

        $query = Doctrine_Query::create();
        $resultDos = $query->delete('DatDesgloseentidad')
                        ->from('DatDesgloseentidad')
                        ->where('iddesgloseentidad = ?', $iddesgloseentidad)->execute();

        return true;
    }

    public function buscarDesglose($idactividadentidad, $iddatosnomenclador) {
        $query = new Doctrine_Query();
        return $query->from('DatDesgloseentidad dnae')
                        ->where(
                                'dnae.idactividadentidad = ? AND dnae.iddatosnomenclador = ?', array($idactividadentidad, $iddatosnomenclador)
                        )->execute();
    }

    public function varhavingtotaluno() {
        return "AND (COALESCE( aem.nivelactividadmanual,0) + COALESCE( aea.nivelactividadautomatico,0) +
                COALESCE( aep.nivelactividadproduccion,0) + COALESCE( ae.ajuste,0) )";
    }

    public function varsubconsulta($desgloseTn, $params) {
        return "(SELECT SUM(subde.nivelactividaddesglose) FROM mod_planificacion.dat_desgloseentidad subde
                WHERE subde.iddesglosetiponomenclador = " . $desgloseTn['iddesglosetiponomenclador'] . "
                AND subde.idactividadentidad = ae.idactividadentidad AND subde.idejercicio = " . $params['idejercicio'] . "
                ) AS idtn" . $desgloseTn['idtiponomenclador'] . ",";
    }

    public function listarDesglosesNivActIntegracionPlan($params, $escont = null
    ) {
        /* ALGORITMO
          1. Buscar una configuracion de desglose que coincida con la columnas nomencladas
          del plan seleccionado (Servicio de plan que dado un plan devuelva
          un array de identificacodres las columnas nomencladas del plan, qeu seria del
         * tipo idtiponomenclador)
          2.Construir las columnas
         */
        $modelPlan = new DatModeloModel();
        $arrayColumnasnomencladas = $modelPlan->servicioBp(
                $params['idtipomodelo']
        );

        if ($arrayColumnasnomencladas['idtiponomenclador'][0] == null) {
            $data->data = array();
            $data->total = 0;
            return $data;
        }
        $iddesglose = DatDesglosetiponomenclador::buscarConfiguracionConColumnasNomencladas(
                        $arrayColumnasnomencladas['idtiponomenclador']
        ); //iddesglose
        if ($iddesglose == null) {
            $data->data = array();
            $data->total = 0;
            return $data;
        }
        $arrayParametros = array();
        $arrayParametrostotalpaginado = array();
        $WHERE = "";
        $HAVING = " Having true ";
        $codigo = null;
        $denominacion = null;
        $desc = null;
        $idesp = null;
        $HAVINGtotal = " Having true ";
        $havingTotalUno = " Having true ";
        $iddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();

        foreach ($params['filtros'] as $p => $s) {
            if ($s != null) {
                if ($s->data->type == numeric) {
                    $comparar = $s->data->comparison;
                }
                $p = $s->field;
                $s = $s->data->value;
                if ($p == 'codigo') {
                    $WHERE = $WHERE . " AND a.codigo  LIKE ?";
                    $codigo = "$s%";
                } elseif ($p == 'denominacion') {
                    $WHERE = $WHERE . " AND upper(a.denominacion)  LIKE ? ";
                    $denominacion = "%" . strtoupper($s) . "%";
                } elseif ($p == 'idejercicio') {
                    $WHERE = $WHERE . " AND ae.idejercicio = ? ";
                    $idejercicio = $s;
                } elseif ($p == 'descripcion') {
                    $WHERE = $WHERE . " AND upper(a.descripcion)  LIKE ? ";
                    $desc = "%" . strtoupper($s) . "%";
                } elseif ($p == 'comportamiento') {
                    $iddn = $iddatosnomanclador['propia'];
                    if ($s[0] == 'Demandada') {
                        $iddn = $iddatosnomanclador['demandada'];
                    } else {
                        if ($s[0] == 'Compartida') {
                            $iddn = $iddatosnomanclador['compartida'];
                        }
                    }
                    $WHERE = $WHERE . "AND aed.iddatosnomenclador = {$iddn} ";
                } elseif ($p == 'denespecialidad') {
                    $WHERE = $WHERE . "AND a.idespecialidad = ? ";
                    $idesp = $s;
                } elseif ($p == 'nivelactividad') {
                    if ($comparar == 'gt') {
                        $comparar = " > ";
                    } elseif ($comparar == 'eq') {
                        $comparar = " = ";
                    } else {
                        $comparar = " < ";
                    }
                    $HAVING .= " AND SUM(alias.nivelactividad)" . $comparar
                            . $s;
                    $havingTotalUno
                            .= self::varhavingtotaluno() . $comparar . $s;
                } elseif ($p == 'idtn5') {
                    if ($comparar == 'gt') {
                        $comparar = " > ";
                    } elseif ($comparar == 'eq') {
                        $comparar = " = ";
                    } else {
                        $comparar = " < ";
                    }
                    $HAVING .= " AND SUM( alias.idtn5 )" . $comparar . $s;
                    $HAVINGtotal .= " AND SUM( alias.idtn5 )" . $comparar . $s;
                } elseif ($p == 'idtn4') {
                    if ($comparar == 'gt') {
                        $comparar = " > ";
                    } elseif ($comparar == 'eq') {
                        $comparar = " = ";
                    } else {
                        $comparar = " < ";
                    }
                    $HAVING .= " AND SUM( alias.idtn4 )" . $comparar . $s;
                    $HAVINGtotal .= " AND SUM( alias.idtn4 )" . $comparar . $s;
                }
            }
        }

        $arrayDesglosesTiponomenclador = DatDesglose:: getTodosDatDesglosetiponomenclador($iddesglose);
        $arrayIdentsTipoNom [] = array();
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $strSubConsulta = "";
        $strConsultaConsolidacion = "";
        $strSubConsultatotal = "";
        foreach ($arrayDesglosesTiponomenclador as $desgloseTn) {
            $strSubConsulta = $strSubConsulta . self::varsubconsulta($desgloseTn, $params);
            $arrayIdentsTipoNom[] = $desgloseTn['idtiponomenclador'];
            $strConsultaConsolidacion = $strConsultaConsolidacion . " SUM( " . ("alias.idtn"
                    . $desgloseTn['idtiponomenclador']) . " ) as "
                    . ("idtn" . $desgloseTn['idtiponomenclador']) . ", ";
        }
        $arrayDesglosesTiponomenclador = null;

        if ($escont == null || $escont == false) {
            $conn = Doctrine_Manager:: connection();
            $query = self::consultaactividaddearriba($strConsultaConsolidacion, $strSubConsulta, $params, $WHERE, $HAVING);
        }

        $arrayParametrostotalpaginado[] = $params['idmodelo'];


        $arrayParametrostotalpaginado[] = $params['idespecialidad'];

        if ($codigo != null) {
            $arrayParametros[] = $codigo;
            $arrayParametrostotalpaginado[] = $codigo;
        }
        if ($denominacion != null) {
            $arrayParametros[] = $denominacion;
            $arrayParametrostotalpaginado[] = $denominacion;
        }
        if ($idejercicio != null) {
            $arrayParametros[] = $idejercicio;
            $arrayParametrostotalpaginado[] = $idejercicio;
        }
        if ($desc != null) {
            $arrayParametros[] = $desc;
            $arrayParametrostotalpaginado[] = $desc;
        }
        if ($idesp != null) {
            $arrayParametros[] = $idesp;
            $arrayParametrostotalpaginado[] = $idesp;
        }


        if ($escont == null || $escont == false) {

            $data->data = $conn->execute($query, $arrayParametros)->fetchAll();
            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $arrayIdsactividades = array();
            foreach ($data->data as $indice => $actEntidad) {
                if ($arrayIdsactividades["id_"
                        . $actEntidad['idespecialidad']] == null
                ) {
                    $especialidades = $this->nomenclador->selectParam(
                            'nom_especialidad', array('denespecialidad', 'codespecialidad'), 0, 0, "idespecialidad = " . $actEntidad['idespecialidad']
                    );
                    $arrayIdsactividades["id_"
                            . $actEntidad['idespecialidad']] = $especialidades[0]['denespecialidad'];
                }
                $data->data[$indice]['denespecialidad'] = $arrayIdsactividades["id_"
                        . $actEntidad['idespecialidad']];
                /* FORMULA DEL PORCIENTO
                  PorCiento = (SUMATORIA PARTES * 100) / CANT_PARTES * Nivel_Actividad
                 */
                foreach ($arrayIdentsTipoNom as $idTopoNom) {
                    if ($data->data[$indice]['idtn' . $idTopoNom] == null) {
                        $data->data[$indice]['idtn' . $idTopoNom] = 0;
                    }
                }
            }
        }

        if ($escont == null || $escont == true) {
            $conn = Doctrine_Manager:: connection();


            $query = " SELECT $strConsultaConsolidacion count(DISTINCT alias.idactividad)
                FROM ( SELECT DISTINCT $strSubConsulta a.idactividad
                FROM mod_planificacion.dat_actividadentidad ae
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                ON( ae.idactividadentidad = aem.idactividadentidad )
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON( ae.idactividadentidad = aea.idactividadentidad )
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( ae.idactividadentidad = aep.idactividadentidad )
                INNER JOIN mod_planificacion.dat_actespcomportamiento aed
                ON( aed.idactespcomportamiento = ae.idactespcomportamiento  )
                INNER JOIN mod_planificacion.nom_datosnomenclador dn
                ON( dn.iddatosnomenclador = aed.iddatosnomenclador  )
                INNER JOIN mod_planificacion.nom_actividad a
                ON( a.idactividad = aed.idactividad AND a.idaprobacion = 4 AND a.estado = 1  )
                 WHERE  ae.idejercicio = " . $params['idejercicio'] . " AND  ae.idactividad IN (
                SELECT am.idactividad FROM mod_planificacion.dat_actividadmodelo am
                WHERE am.idactividad = ae.idactividad AND  am.idmodelo = " . $params['idmodelo'] . "
                )
                AND aed.idespecialidad = " . $params['idespecialidad'] . "
                 AND (ae.idaprobacion = 3 OR ae.idaprobacion = 4)  AND ae.identidad = {$params['identidad']}
                $WHERE  group by ae.idactividadentidad, a.idactividad, aem.nivelactividadmanual,
                aea.nivelactividadautomatico,aep.nivelactividadproduccion,ae.ajuste
                $havingTotalUno) alias $HAVINGtotal";
            $res = $conn->execute($query, $arrayParametros);
            $TOTAL = $res->fetchAll();

            $data->total = $TOTAL[0]['count'];
        }

        return $data;
    }

    public function consultaactividaddearriba($strConsultaConsolidacion, $strSubConsulta, $params, $WHERE, $HAVING) {
        return " SELECT DISTINCT alias.idactividad,
                alias.codigo, alias.denominacion,alias.descripcion,SUM(alias.nivelactividad) as nivelactividad,
                $strConsultaConsolidacion  alias.idespecialidad,alias.uridatosnomenclador as comportamiento
                FROM ( SELECT DISTINCT ae.idactividadentidad, a.idactividad,a.codigo,a.denominacion,a.descripcion,
                a.idespecialidad,ae.idaprobacion AS idaprobacion_actividadentidad, dn.uridatosnomenclador,
                $strSubConsulta COALESCE( aem.nivelactividadmanual,0) +  COALESCE( aea.nivelactividadautomatico,0) +
                COALESCE( aep.nivelactividadproduccion,0) +COALESCE( ae.ajuste,0) as nivelactividad,
                 aem.nivelactividadmanual,aea.nivelactividadautomatico FROM mod_planificacion.dat_actividadentidad ae
                LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                 ON( ae.idactividadentidad = aem.idactividadentidad )
                LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                ON( ae.idactividadentidad = aea.idactividadentidad )
                LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                ON( ae.idactividadentidad = aep.idactividadentidad )
                INNER JOIN mod_planificacion.dat_actespcomportamiento aed
                 ON( aed.idactespcomportamiento = ae.idactespcomportamiento  )
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON( dn.iddatosnomenclador = aed.iddatosnomenclador)
                INNER JOIN mod_planificacion.nom_actividad a ON( a.idactividad = aed.idactividad
                AND a.idaprobacion = 4 AND a.estado = 1  )
                 WHERE  ae.idejercicio = " . $params['idejercicio'] . " AND ae.idactividad IN ( SELECT am.idactividad
                FROM mod_planificacion.dat_actividadmodelo am  WHERE am.idactividad = ae.idactividad
                AND  am.idmodelo = " . $params['idmodelo'] . " )
                AND aed.idespecialidad = " . $params['idespecialidad'] . " AND (ae.idaprobacion = 3
                OR ae.idaprobacion = 4)
                 AND ae.identidad = {$params['identidad']}  $WHERE ORDER BY a.codigo ) alias
                GROUP BY alias.idactividad, alias.codigo, alias.denominacion,alias.descripcion,
                alias.idespecialidad,alias.uridatosnomenclador
                $HAVING   LIMIT " . $params['limit'] . "  OFFSET " . $params['start'] . "";
    }

    public function eliminarDesgloces($params) {
        $arrayParametros = array();
        $arrayParametros[0] = $params['iddesglosetiponomenclador'];
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $arrayParametros[1] = $arrayIdejercicio[0]['idejercicio'];
        $arrayParametros[2] = $params['identidad'];
        $conn = Doctrine_Manager::connection();
        $query = self::eliminarDesgloceconsulta();
        $conn->execute($query, $arrayParametros);
        return true;
    }

    public function eliminarDesgloceconsulta() {
        return "DELETE FROM mod_planificacion.dat_desgloseentidad de
                         WHERE de.iddesglosetiponomenclador = ?
                         AND de.idejercicio = ? AND de.iddesgloseentidad
                         IN( SELECT de1.iddesgloseentidad
                             FROM mod_planificacion.dat_desgloseentidad de1
                             INNER JOIN mod_planificacion.dat_actividadentidad ae
                             ON(  ae.idactividadentidad = de1.idactividadentidad AND ae.identidad = ? )
                             WHERE de.iddesgloseentidad = de1.iddesgloseentidad ) ";
    }

    /*     * *** FUNCION DE INTEGRACION DE BASE DEL PLAN CON PLAN **** */

    public function actualizarPlan($params) {
        $modelPlan = new DatModeloModel();
        $arrayColumnasnomencladastablametadato = $modelPlan->servicioBp($params['idtipomodelo']);
        $arrayParametros = array();
        $arrayParametros[] = $params['idEstructura'];
        $arrayParametros[] = $params ['idmodelo'];
        $arrayParametros[] = $arrayColumnasnomencladastablametadato['idtabla'];
        $arrayParametros[] = $params ['iddesglose'];
        $arrayParametros[] = $params['idejercicio'];
        $arrayParametros[] = $params ['idespecialidad'];
        if ($params['tipoplan'] == 1)
            $arrayParametros[] = 'ip.precioventa';
        else
        if ($params['tipoplan'] == 0)
            $arrayParametros[] = 'ip.precio';


        $conn = Doctrine_Manager:: connection();

        $query = "select * from mod_planificacion.f_integraciondesglose11(?,?,?,?,?,?,?)";

        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();

        $idmodelo = $params ['idmodelo'];
        $tieneSalida = Doctrine::getTable('DatActividadmodelosalida')->findByDql("idmodelo = $idmodelo");


        if ($tieneSalida[0]->idmodelo != null) {
            $query = "select * from mod_planificacion.f_integraciondesglosesalida(?,?,?,?,?,?,?)";
            $res = $conn->execute($query, $arrayParametros);

            $result = $res->fetchAll();
        }
        return 1;
    }

    /*     * *** FIN FUNCION DE INTEGRACION DE BASE DEL PLAN CON PLAN **** */

    public function GetGridInterfazVistaPreviaPlan($idtipomodelo) {
        /* ALGORITMO
          1. Buscar una configuracion de desglose que coincida con la columnas nomencladas
          del plan seleccionado (Servicio de plan que dado un plan devuelva
          un array de idtiponomenclador de las columnas nomencladas del plan
          2.Construir las columnas
         */
        $modelPlan = new DatModeloModel();
        $arrayColumnasnomencladas = $modelPlan->servicioBp(
                $idtipomodelo
        ); //array('4','5');
        $columnsHeadersnames = array();
        $columnsHeadersnames['config'][0]['esultimonivel'] = true;
        $columnsHeadersnames['config'][0]['ocultar'] = true;
        $columnsHeadersnames['cm'] = array();
        $columnsHeadersnames['st'] = array();

        if ($arrayColumnasnomencladas['idtiponomenclador'][0] == null) {
            return $columnsHeadersnames;
        }
        $iddesglose = DatDesglosetiponomenclador::buscarConfiguracionConColumnasNomencladas(
                        $arrayColumnasnomencladas['idtiponomenclador']
        ); //iddesglose
        if ($iddesglose == null) {
            return $columnsHeadersnames;
        }
        $resultparcial = DatDesglosetiponomenclador::getDatDesglosetiponomenclador(
                        $iddesglose
        );
        $query = new Doctrine_Query();
        /* Ejemplo: Codigo | Num. Pieza | Denominacion | Descripcion | UM | Precio |
         * CentroBalance | Naturaleza | Necesidad | Importe | Sector Rama | Destino |  */
        $i = 0;
        foreach ($resultparcial as $valor) {
            $columnsHeadersnames['cm'][$i]['dataIndex'] = "idtn"
                    . $valor->NomTiponomenclador->idtiponomenclador;
            $columnsHeadersnames['cm'][$i]['header'] = $valor->NomTiponomenclador->denominacion;
            $columnsHeadersnames['cm'][$i]['width'] = strlen(
                            $valor->NomTiponomenclador->denominacion
                    ) * 8.5; //100;
            $columnsHeadersnames['cm'][$i]['sortable'] = true;
            $columnsHeadersnames['cm'][$i]['editor'] = "";
            $columnsHeadersnames['cm'][$i]['tooltip'] = $valor->NomTiponomenclador->denominacion;
            $columnsHeadersnames['st'][$i]['name'] = "idtn"
                    . $valor->NomTiponomenclador->idtiponomenclador;
            /* temporal eliminar esto aqui y en la IU */

            $i++;
        }
        return $columnsHeadersnames;
    }

    public function listarIndicadoresVistaPreviaPlan($params) {
        //temporal falta excluir indicadores directo al plan.


        $iddesglose = DatDesglosetiponomenclador::buscarConfiguracionConColumnasNomencladas(
                        $params['idstiponom']
        ); //iddesglose //$array_columnas_nomencladas['idtiponomenclador']
        if ($iddesglose == null) {
            $data->data = array();
            $data->total = 0;
            return $data;
        }
        $arrayParametros = array();
        $arrayParametrostotalpaginado = array();
        $WHERE = "";
        $ADDHAVING = "";
        $ptrParams = 0;
        foreach ($params as $p => $s) {
            if ($s != null) {
                if ($p == 'codigo') {
                    $WHERE = $WHERE
                            . " AND mod_planificacion.nom_indicador.codigo  LIKE ? ";
                    $arrayParametros[$ptrParams++] = "$s%";
                } elseif ($p == 'numeropieza') {
                    $WHERE = $WHERE
                            . " AND  upper(mod_planificacion.nom_indicador.numeropieza) LIKE ? ";
                    $arrayParametros[$ptrParams++] = strtoupper($s) . "%";
                } elseif ($p == 'denominacion') {
                    $WHERE = $WHERE
                            . " AND upper(mod_planificacion.nom_indicador.denominacion)  LIKE ? ";
                    $arrayParametros[$ptrParams++] = "%" . strtoupper($s)
                            . "%";
                } elseif ($p == 'descripcion') {
                    $WHERE = $WHERE
                            . " AND upper(mod_planificacion.nom_indicador.descripcion)  LIKE ? ";
                    $arrayParametros[$ptrParams++] = "%" . strtoupper($s)
                            . "%";
                } elseif ($p == 'idumedida') {
                    $WHERE = $WHERE
                            . " AND mod_planificacion.nom_indicador.idumedida = ? ";
                    $arrayParametros[$ptrParams++] = $s;
                } elseif ($p == 'idcentrobalance') {
                    $WHERE = $WHERE
                            . " AND mod_planificacion.dat_indicadorcentrobalance.identidaddatosnomenclador = ? ";
                    $arrayParametros[$ptrParams++] = $s;
                } elseif ($p == 'naturaleza') {
                    $WHERE = $WHERE
                            . " AND mod_planificacion.nom_indicador.naturaleza = ? ";
                    $arrayParametros[$ptrParams++] = $s;
                } elseif ($p == 'precio_eq' || $p == 'precio_gt' || $p == 'precio_lt'
                ) {
                    $cond = "=";
                    if ($p == 'precio_gt') {
                        $cond = ">";
                    } else {
                        if ($p == 'precio_lt') {
                            $cond = "<";
                        }
                    }
                    $WHERE = $WHERE
                            . " AND mod_planificacion.nom_indicador.precio {$cond} ? ";
                    $arrayParametros[$ptrParams++] = $s;
                } elseif ($p == 'necesidad_eq' || $p == 'necesidad_gt' || $p == 'necesidad_lt'
                ) {
                    $cond = "=";
                    if ($p == 'necesidad_gt') {
                        $cond = ">";
                    } else {
                        if ($p == 'necesidad_lt') {
                            $cond = "<";
                        }
                    }
                    $ADDHAVING = $ADDHAVING
                            . " AND SUM(foo.necesidad) {$cond} ? ";
                    $arrayParametros[$ptrParams++] = $s;
                } elseif ($p == 'importe_eq' || $p == 'importe_gt' || $p == 'importe_lt'
                ) {
                    $cond = "=";
                    if ($p == 'importe_gt') {
                        $cond = ">";
                    } else {
                        if ($p == 'importe_lt') {
                            $cond = "<";
                        }
                    }
                    $ADDHAVING = $ADDHAVING
                            . " AND ( SUM( foo.necesidad) * foo.precio ) {$cond} ? ";
                    $arrayParametros[$ptrParams++] = $s;
                }
            }
        }
        $arrayDesglosesTiponomenclador = DatDesglose:: getTodosDatDesglosetiponomenclador($iddesglose);
        $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idumedidaUNO = 129;
        $arrayDesglosesTiponomenclador = null;
        $conn = Doctrine_Manager:: connection();
        $query = " SELECT
                    foo.idindicador, SUM(foo.necesidad) AS necesidad,foo.uridatosnomenclador,foo.orden,foo.precio,
                    foo.idumedida,foo.identidaddatosnomenclador as idcentrobalance,foo.idespecialidad,foo.codigo,
                    foo.denominacion,  foo.numeropieza, foo.descripcion,foo.naturaleza,
                    ( foo.precio * SUM(foo.necesidad) ) as importe
                    FROM  (SELECT  mod_planificacion.dat_necesidaddesglose.idindicador,
                    (CASE WHEN mod_planificacion.nom_indicador.idumedida = {$idumedidaUNO} THEN
                    round (SUM(mod_planificacion.dat_necesidaddesglose.necesidad),0)ELSE
                    SUM(mod_planificacion.dat_necesidaddesglose.necesidad) END) AS necesidad,
                    mod_planificacion.dat_desgloseentidad.uridatosnomenclador,
                    mod_planificacion.dat_desglosetiponomenclador.orden,
                    mod_planificacion.nom_indicador.precio, mod_planificacion.nom_indicador.idumedida,
                    mod_planificacion.nom_indicador.codigo,mod_planificacion.nom_indicador.denominacion,
                    mod_planificacion.nom_indicador.numeropieza, mod_planificacion.nom_indicador.descripcion,
                    mod_planificacion.nom_indicador.naturaleza,
                    mod_planificacion.dat_indicadorcentrobalance.identidaddatosnomenclador,
                    mod_planificacion.dat_actespcomportamiento.idespecialidad,
                    mod_planificacion.dat_actividadentidad.identidad
                    FROM mod_planificacion.dat_actividadentidad
                    INNER JOIN mod_planificacion.dat_actividadmodelo
                    ON (mod_planificacion.dat_actividadentidad.idactividad =
                    mod_planificacion.dat_actividadmodelo.idactividad)
                    INNER JOIN mod_planificacion.dat_desgloseentidad
                    ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                    mod_planificacion.dat_desgloseentidad.idactividadentidad)
                    INNER JOIN mod_planificacion.dat_desglosetiponomenclador
                    ON (mod_planificacion.dat_desgloseentidad.iddesglosetiponomenclador =
                    mod_planificacion.dat_desglosetiponomenclador.iddesglosetiponomenclador)

                    INNER JOIN mod_planificacion.dat_desglosecompleto
                    ON ( (mod_planificacion.dat_actividadentidad.idactividadentidad =
                    mod_planificacion.dat_desglosecompleto.idactividadentidad)
		    AND (mod_planificacion.dat_desglosecompleto.iddesglosetiponomenclador =
		    mod_planificacion.dat_desglosetiponomenclador.iddesglosetiponomenclador) )

                    INNER JOIN mod_planificacion.dat_necesidaddesglose
                    ON (mod_planificacion.dat_necesidaddesglose.iddesgloseentidad =
                    mod_planificacion.dat_desgloseentidad.iddesgloseentidad)
                    INNER JOIN mod_planificacion.nom_indicador
                    ON (mod_planificacion.dat_necesidaddesglose.idindicador =
                    mod_planificacion.nom_indicador.idindicador)
                    LEFT OUTER JOIN mod_planificacion.dat_indicadormodelo
                    ON (mod_planificacion.dat_indicadormodelo.idindicador =
                    mod_planificacion.nom_indicador .idindicador)

                    INNER JOIN mod_planificacion.dat_indicadorcentrobalance
                    ON (mod_planificacion.nom_indicador.idindicador =
                     mod_planificacion.dat_indicadorcentrobalance.idindicador)
                    INNER JOIN mod_planificacion.dat_actespcomportamiento
                    ON (mod_planificacion.dat_actividadmodelo.idactividad =
                    mod_planificacion.dat_actespcomportamiento.idactividad)
                    INNER JOIN mod_planificacion.nom_actividad
                    ON (mod_planificacion.dat_actividadmodelo.idactividad = mod_planificacion.nom_actividad.idactividad)
                    AND (mod_planificacion.dat_actividadentidad.idactividad =
                    mod_planificacion.nom_actividad.idactividad)
                    WHERE
                    mod_planificacion.dat_actividadmodelo.idmodelo  = {$params['idmodelo']} AND
                    mod_planificacion.dat_desgloseentidad.ordender - mod_planificacion.dat_desgloseentidad.ordenizq = 1
                    AND  mod_planificacion.dat_desglosetiponomenclador.iddesglose = {$iddesglose} AND
                    mod_planificacion.nom_actividad.idespecialidad = {$params['idespecialidad']} AND
                    mod_planificacion.nom_actividad.estado = 1
                     AND  mod_planificacion.dat_actividadentidad.idaprobacion = 4 AND
                    mod_planificacion.dat_actividadentidad.idejercicio = {$arrayIdejercicio[0]['idejercicio']}
                    AND  mod_planificacion.nom_indicador.estado =1
                    $WHERE GROUP BY
                    mod_planificacion.dat_necesidaddesglose.idindicador,
                    mod_planificacion.dat_desgloseentidad.uridatosnomenclador,
                    mod_planificacion.dat_desglosetiponomenclador.orden,  mod_planificacion.nom_indicador.precio,
                    mod_planificacion.nom_indicador.idumedida,
                     mod_planificacion.dat_indicadorcentrobalance.identidaddatosnomenclador,
                    mod_planificacion.dat_actespcomportamiento.idespecialidad,
                    mod_planificacion.dat_actividadentidad.identidad,
                    mod_planificacion.nom_indicador.codigo,mod_planificacion.nom_indicador.denominacion,
                    mod_planificacion.nom_indicador.numeropieza,
                    mod_planificacion.nom_indicador.descripcion,      mod_planificacion.nom_indicador.naturaleza

                    HAVING MAX(mod_planificacion.dat_desglosetiponomenclador.orden) =
                    mod_planificacion.dat_desglosetiponomenclador.orden) as foo
                    WHERE foo.idespecialidad = {$params['idespecialidad']}  AND foo.necesidad <> 0

                    GROUP BY   foo.idindicador,foo.uridatosnomenclador,foo.orden,foo.precio,
                    foo.idumedida,foo.identidaddatosnomenclador,
                    foo.idespecialidad,foo.codigo,foo.denominacion,foo.numeropieza,foo.descripcion,foo.naturaleza
                    HAVING   MAX(foo.orden) = foo.orden $ADDHAVING OFFSET ? LIMIT ? ";


        $arrayParametrostotalpaginado = $arrayParametros;
        $arrayParametros[$ptrParams++] = $params['start'];
        $arrayParametros[$ptrParams++] = $params['limit'];
        $data->data = $conn->execute($query, $arrayParametros)->fetchAll();
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $query = new Doctrine_Query();
        $arrayDn = $query->from('NomDatosnomenclador dn')
                        ->whereIn('dn.idtiponomenclador', $params['idstiponom'])
                        ->execute()->toArray();

        $arrayDntmp = array();
        foreach ($arrayDn as $valorDn) {
            $arrayDntmp['id' . $valorDn['idtiponomenclador'] . 'id'
                    . $valorDn['iddatosnomenclador']] = $valorDn['denominacion'];
        }
        //temporal validar que $array_dn tenga al menos un valor
        foreach ($data->data as $indice => $valorInd) {
            $arrayColumnasdatosnom = explode(
                    ',', $valorInd['uridatosnomenclador']
            );
            foreach ($params['idstiponom'] as $valorIdtn) {
                $data->data[$indice]['idtn' . $valorIdtn] = "-";
                foreach ($arrayColumnasdatosnom as $valorIddn) {
                    if ($arrayDntmp['id' . $valorIdtn . 'id' . $valorIddn] != null
                    ) {
                        $data->data[$indice]['idtn' . $valorIdtn] = $arrayDntmp['id' . $valorIdtn . 'id'
                                . $valorIddn];
                    }
                }
            }
        }

        $query = " SELECT
                    COUNT( foo.idindicador ) as total
                    FROM
                    (SELECT
                    mod_planificacion.dat_necesidaddesglose.idindicador,
                    (CASE WHEN mod_planificacion.nom_indicador.idumedida = {$idumedidaUNO} THEN
                    round (SUM(mod_planificacion.dat_necesidaddesglose.necesidad),0)ELSE
                    SUM(mod_planificacion.dat_necesidaddesglose.necesidad) END) AS necesidad,
                    mod_planificacion.dat_desgloseentidad.uridatosnomenclador,
                    mod_planificacion.dat_desglosetiponomenclador.orden,
                    mod_planificacion.nom_indicador.precio,
                    mod_planificacion.nom_indicador.idumedida,
                    mod_planificacion.nom_indicador.codigo,
                    mod_planificacion.nom_indicador.denominacion,
                    mod_planificacion.nom_indicador.numeropieza,
                    mod_planificacion.nom_indicador.descripcion,
                    mod_planificacion.nom_indicador.naturaleza,
                    mod_planificacion.dat_indicadorcentrobalance.identidaddatosnomenclador,
                    mod_planificacion.dat_actespcomportamiento.idespecialidad,
                    mod_planificacion.dat_actividadentidad.identidad
                    FROM
                    mod_planificacion.dat_actividadentidad
                    INNER JOIN mod_planificacion.dat_actividadmodelo
                    ON (mod_planificacion.dat_actividadentidad.idactividad =
                    mod_planificacion.dat_actividadmodelo.idactividad)
                    INNER JOIN mod_planificacion.dat_desgloseentidad
                    ON (mod_planificacion.dat_actividadentidad.idactividadentidad =
                    mod_planificacion.dat_desgloseentidad.idactividadentidad)
                    INNER JOIN mod_planificacion.dat_desglosetiponomenclador
                    ON (mod_planificacion.dat_desgloseentidad.iddesglosetiponomenclador =
                    mod_planificacion.dat_desglosetiponomenclador.iddesglosetiponomenclador)
                    INNER JOIN mod_planificacion.dat_necesidaddesglose
                    ON (mod_planificacion.dat_necesidaddesglose.iddesgloseentidad =
                    mod_planificacion.dat_desgloseentidad.iddesgloseentidad)
                    INNER JOIN mod_planificacion.nom_indicador
                    ON (mod_planificacion.dat_necesidaddesglose.idindicador =
                    mod_planificacion.nom_indicador.idindicador)
                    INNER JOIN mod_planificacion.dat_indicadorcentrobalance
                    ON (mod_planificacion.nom_indicador.idindicador =
                    mod_planificacion.dat_indicadorcentrobalance.idindicador)
                    INNER JOIN mod_planificacion.dat_actespcomportamiento
                    ON (mod_planificacion.dat_actividadmodelo.idactividad =
                    mod_planificacion.dat_actespcomportamiento.idactividad)
                    INNER JOIN mod_planificacion.nom_actividad
                    ON (mod_planificacion.dat_actividadmodelo.idactividad = mod_planificacion.nom_actividad.idactividad)
                    AND (mod_planificacion.dat_actividadentidad.idactividad =
                    mod_planificacion.nom_actividad.idactividad)
                    WHERE
                    mod_planificacion.dat_actividadmodelo.idmodelo  = {$params['idmodelo']} AND
                    mod_planificacion.dat_desgloseentidad.ordender - mod_planificacion.dat_desgloseentidad.ordenizq = 1
                    AND mod_planificacion.dat_desglosetiponomenclador.iddesglose = {$iddesglose} AND
                    mod_planificacion.nom_actividad.idespecialidad = {$params['idespecialidad']} AND
                    mod_planificacion.nom_actividad.estado = 1 AND
                    mod_planificacion.dat_actividadentidad.idaprobacion = 4 AND
                    mod_planificacion.dat_actividadentidad.idejercicio = {$arrayIdejercicio[0]['idejercicio']} AND
                    mod_planificacion.nom_indicador.estado =1
                    $WHERE GROUP BY
                    mod_planificacion.dat_necesidaddesglose.idindicador,
                    mod_planificacion.dat_desgloseentidad.uridatosnomenclador,
                    mod_planificacion.dat_desglosetiponomenclador.orden,
                    mod_planificacion.nom_indicador.precio,
                    mod_planificacion.nom_indicador.idumedida,
                    mod_planificacion.dat_indicadorcentrobalance.identidaddatosnomenclador,
                    mod_planificacion.dat_actespcomportamiento.idespecialidad,
                    mod_planificacion.dat_actividadentidad.identidad,
                    mod_planificacion.nom_indicador.codigo,
                    mod_planificacion.nom_indicador.denominacion,
                    mod_planificacion.nom_indicador.numeropieza,
                    mod_planificacion.nom_indicador.descripcion,
                    mod_planificacion.nom_indicador.naturaleza

                    HAVING
                    MAX(mod_planificacion.dat_desglosetiponomenclador.orden) =
                    mod_planificacion.dat_desglosetiponomenclador.orden) as foo
                    WHERE
                    foo.idespecialidad = {$params['idespecialidad']}  AND foo.necesidad <> 0
                    GROUP BY foo.orden,foo.precio
                    HAVING MAX(foo.orden) = foo.orden $ADDHAVING";
        $TOTAL = $conn->execute($query, $arrayParametrostotalpaginado)
                ->fetchAll();
        $data->total = $TOTAL[0]['total'];
        return $data;
    }

    public function exportarAExcel($params) {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps
                . "/planificacion/planmeta/views/idioma/{$idioma}/bpdesglose/bpdesglose.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq [$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=desgloses.xls");
        header("Content-Transfer-Encoding: binary ");
        $cant = 0;
        if ($params['is_leaf'] == 'true') {
            if ($params['tipo'] == '3') {
                $cant = $this->listarDesglosesNivActIntegracionPlan(
                                $params, true
                        )->total;
            } else {
                $cant = $this->listarDesgloseNivelesActividad(
                                $params, true
                        )->total;
            }
        } else {

        }
        if ($params['tipo'] == 3) {
            $arrayColumnas = $this->GetGridInterfazIntegracionConPlan(
                    $params['identidad'], $params['idtipomodelo'], $params['columna'], $params['idpadrerama']
            );
        } else {
            $arrayColumnas = $this->GetGridInterfaces(
                    $params['ident'], $params['orden'], $params['columna'], $params['idpadrerama']
            );
        }
        echo '<caption> ' . $arrayEtiq['lbExportarDesgloses'] . ' '
        . $arrayEtiq['lbEntidad'] . ': '
        . $params['text_ent'] . ' </caption>';
        echo "<table border=1 cellspacing=0 width=60%>
        <tr>
             <th align=left>{$arrayEtiq['lbCodigo']}</th>
             <th align=left>{$arrayEtiq['lbDenominacion']}</th>
             <th align=left >{$arrayEtiq['lbNivel']}</th>
             <th align=left >{$arrayEtiq['lbComportamiento']}</th>
             <th align=left >{$arrayEtiq['lbEspecialidad']}</th>";
        if ($params['tipo'] != 3) {
            echo "<th align=left >{$arrayEtiq['lbAprobacion']}</th>
             <th align=left >{$arrayEtiq['lbPlan']}</th>";
        }
        if (is_array($arrayColumnas['cm'])) {
            foreach ($arrayColumnas['cm'] as $indice => $colum) {
                echo " <th align=left >{$colum['header']}</th>";
            }
        }
        echo "</tr>";
        $arrayIdsaprobacion = array();
        $arrayIdsaprobacion ['id_1'] = $arrayEtiq['lbNo'];
        $arrayIdsaprobacion ['id_3'] = $arrayEtiq['lbSi'];
        $arrayIdsaprobacion ['id_4'] = $arrayEtiq['lbRector'];
        $arrayIdsaprobacion ['id_5'] = $arrayEtiq['lbRector'];
        $arrayUriscomp = array();
        $arrayUriscomp ['propia'] = $arrayEtiq['lbPropia'];
        $arrayUriscomp ['demandada'] = $arrayEtiq['lbDemandada'];
        $arrayUriscomp ['compartida'] = $arrayEtiq['lbCompartida'];
        $cantxpag = 10000;
        $cantpag = (int) ($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            if ($params['is_leaf'] == 'true') {
                $params['start'] = $offset;
                $params['limit'] = $paso;
                if ($params['tipo'] == 3) {
                    $arrayDesgloses = $this->listarDesglosesNivActIntegracionPlan(
                                    $params, false
                            )->data;
                } else {
                    $arrayDesgloses = $this->listarDesgloseNivelesActividad(
                                    $params, false
                            )->data;
                }
            } else {
                //por implementar
            }
            foreach ($arrayDesgloses as $value) {
                if ($value['idaprobacion'] < 1) {
                    $value['idaprobacion'] = 1;
                }
                echo "<tr>
             <td align=right style=\"mso-number-format:'@';\">"
                . $value['codigo'] . "</td>
             <td align=left>" . $value['denominacion'] . "</td>
             <td align=right>" . number_format($value['nivelactividad'], '3', '.', ',') . "</td>
             <td align=right >" . $arrayUriscomp [$value['comportamiento']] . "</td>
             <td align=right >" . $value['denespecialidad'] . "</td>";
                if ($params['tipo'] != 3) {
                    echo "<td align=right >" . $arrayIdsaprobacion['id_'
                    . $value['idaprobacionactent']] . "</td>
             <td align=right >" . $value['denmodelo'] . "</td>";
                }
                if (is_array($arrayColumnas['cm'])) {
                    foreach ($arrayColumnas['cm'] as $indice => $colum) {
                        echo " <td align=right >" . number_format(
                                $value[$colum['dataIndex']], '3', '.', ','
                        ) . "</td>";
                    }
                }
                echo "</tr>";
            }
            $offset += $paso;
        }
        echo "</table>";
    }

}
