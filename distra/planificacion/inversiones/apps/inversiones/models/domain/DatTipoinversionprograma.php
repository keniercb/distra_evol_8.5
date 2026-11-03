<?php

class DatTipoinversionprograma extends BaseDatTipoinversionprograma {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idtipoinversionprograma) {
        return Doctrine::getTable('DatTipoinversionprograma')->find($idtipoinversionprograma)->toArray();
    }

    private function addWhereConParams(&$Where, &$params_query, $colum_cond, $param) {
        $Where.= " AND " . $colum_cond . $param; //
    }

    public function getNomenclador($iddatonomenclador) {
        //SELECCIONO EL ESQUEMA Y LA TABLA DEL NIMENCLADOR
        $query = new Doctrine_Query ();
        $array = $query->select("n.iddatosnomenclador")
                ->from("DatTipoinversionprograma n")
                ->where('n.iddatosnomenclador = ?', $iddatonomenclador)
                ->offset(0)
                ->limit(20)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $array;
    }

    public function getArrayIdDatosGrupo($param, $total = null,$cargaDesdeGrid) {
        //SELECCIONO EL ESQUEMA Y LA TABLA DEL NIMENCLADOR

        $query1 = new Doctrine_Query ();
        $array1 = $query1->select("n.tabla,n.esquema,n.nombreidtabla,n.nombretablausa")
                ->from("NomNomenclador n")
                ->where('n.idnomenclador = ?', $param['idNomInversion'])
                ->execute();
        $query = new Doctrine_Query ();
        $addwhere = "";
        $offsetLimit = "";
        $having = "";
        $total = 0;
        $params_query = array();
        if ($param['filtros']) {
            foreach ($param['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($s['field'] == 'descripcion') {
                        self::addWhereConParams(
                                $addwhere, $params_query, "upper(mod_planificacion.nom_datosnomenclador.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                        );
                    } elseif ($s['field'] == 'denominacion') {
                        self::addWhereConParams(
                                $addwhere, $params_query, "upper(mod_planificacion.nom_datosnomenclador.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                        );
                    } elseif ($s['field'] == 'color') {
                        self::addWhereConParams(
                                $addwhere, $params_query, "upper(mod_planificacion.nom_datosnomenclador.color)  LIKE ", ("'%" . strtoupper($s['data']['value']) . "%'")
                        );
                    } elseif ($s['field'] == 'uso' && $s['data'] ['value'] == 'Si') {
                        $comparar = 1;
                        $having = "having case when mod_planifinversiones." . $array1[0]->nombretablausa . "." . $array1[0]->nombreidtabla . " is not null then 1 else 0 end " . "=" . $comparar;
                    } elseif ($s['field'] == 'uso' && $s['data'] ['value'] == 'No') {
                        $comparar = 0;
                        $having = "having case when mod_planifinversiones." . $array1[0]->nombretablausa . "." . $array1[0]->nombreidtabla . " is not null then 1 else 0 end " . "=" . $comparar;
                    }
                }
            }
        }
        if($param['start'] && $param['limit']){
            $offsetLimit = " OFFSET  {$param['start']}
                                    LIMIT  {$param['limit']}";
        }


        $array = $query->select("n.tabla,n.esquema,n.nombreidtabla,n.nombretablausa")
                ->from("NomNomenclador n")
                ->where('n.idnomenclador = ?', $param['idNomInversion'])
                ->execute();

        /*if ($param['_parent']) {
            $addwhere.= "and (select " . $array[0]->esquema . "." . $array[0]->tabla . ".".$array[0]->nombreidtabla.
                " from " . $array[0]->esquema . "." . $array[0]->tabla .
                " where " . $array[0]->esquema . "." . $array[0]->tabla . ".iddatosnomenclador = mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorpadre) = {$param['_parent']}";
        }*/
        //print_r($cargaDesdeGrid);die;
        $aliasNomenclador = "";
        if($cargaDesdeGrid == 1)
            $aliasNomenclador = " as iddatosnomenclador";

        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.descripcion, 
		/*mod_planificacion.nom_datosnomenclador.iddatosnomenclador,*/

        " . $array[0]->esquema . "." . $array[0]->tabla . ".".$array[0]->nombreidtabla. $aliasNomenclador.",
		/*mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorpadre as _parent,*/
		(select " . $array[0]->esquema . "." . $array[0]->tabla . ".".$array[0]->nombreidtabla." from " . $array[0]->esquema . "." . $array[0]->tabla . " where " . $array[0]->esquema . "." . $array[0]->tabla . ".iddatosnomenclador = mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorpadre) as _parent,
        case when (select count (mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorhijo) as cont
            from mod_planificacion.dat_datosnomencladordatosnomenclador
            inner join " . $array[0]->esquema . "." . $array[0]->tabla . "  on (" . $array[0]->esquema . "." . $array[0]->tabla . " .iddatosnomenclador = mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorhijo)
            where mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorpadre =
             mod_planificacion.nom_datosnomenclador.iddatosnomenclador) > 0 then 0 else 1 end as _is_leaf,


                mod_planificacion.nom_datosnomenclador.color,
		mod_planificacion.nom_datosnomenclador.denominacion,
                count(" . $array[0]->esquema . "." . $array[0]->tabla . ".iddatosnomenclador) as total,
                case when mod_planifinversiones." . $array[0]->nombretablausa . "." . $array[0]->nombreidtabla . " is not null then 1 else 0 end as uso
		from " . $array[0]->esquema . "." . $array[0]->tabla . " 
		INNER JOIN mod_planificacion.nom_datosnomenclador 
		ON (" . $array[0]->esquema . "." . $array[0]->tabla . ".iddatosnomenclador = mod_planificacion.nom_datosnomenclador.iddatosnomenclador)

		left join mod_planificacion.dat_datosnomencladordatosnomenclador on (mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorhijo = mod_planificacion.nom_datosnomenclador.iddatosnomenclador)

		left join mod_planifinversiones." . $array[0]->nombretablausa . " 
                ON (mod_planifinversiones." . $array[0]->nombretablausa . "." . $array[0]->nombreidtabla . " = " . $array[0]->esquema . "." . $array[0]->tabla . "." . $array[0]->nombreidtabla . ")	
		where " . $array[0]->esquema . "." . $array[0]->tabla . ".idnomenclador = " . $param['idNomInversion'] . "
		$addwhere
		Group by
		mod_planificacion.nom_datosnomenclador.descripcion, 
		mod_planificacion.nom_datosnomenclador.iddatosnomenclador,
		mod_planificacion.nom_datosnomenclador.color,
		mod_planificacion.nom_datosnomenclador.denominacion,
		mod_planificacion.dat_datosnomencladordatosnomenclador.iddatosnomencladorpadre,

		" . $array[0]->esquema . "." . $array[0]->tabla . ".".$array[0]->nombreidtabla." ,
                mod_planifinversiones." . $array[0]->nombretablausa . "." . $array[0]->nombreidtabla . " " . $having
        ;

        //print_r($sql);die;
        $data = $conn->execute($sql . $offsetLimit);
        $respuesta = $data->fetchAll(PDO::FETCH_ASSOC);
        $datos->data = $respuesta;

        $conn = Doctrine_Manager::connection();
        $sqltotal = "Select 
	     count(DISTINCT(" . $array[0]->esquema . "." . $array[0]->tabla . ".iddatosnomenclador)) as total
	     from " . $array[0]->esquema . "." . $array[0]->tabla . " 
	     INNER JOIN mod_planificacion.nom_datosnomenclador 
	     ON (" . $array[0]->esquema . "." . $array[0]->tabla . ".iddatosnomenclador = mod_planificacion.nom_datosnomenclador.iddatosnomenclador) 
	     left join mod_planifinversiones." . $array[0]->nombretablausa . " 
             ON (mod_planifinversiones." . $array[0]->nombretablausa . "." . $array[0]->nombreidtabla . " = " . $array[0]->esquema . "." . $array[0]->tabla . "." . $array[0]->nombreidtabla . ")	
	     where " . $array[0]->esquema . "." . $array[0]->tabla . ".idnomenclador = " . $param['idNomInversion'] . "
	     $addwhere ";
        $res = $conn->execute($sqltotal);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        $datos->total = $result[0] ['total'];
        return $datos;
    }

    public function adicionarNomenclador($iddatonomenclador, $idnomenclador) {
        $objdatonomenclador = new DatTipoinversionprograma();
        $objdatonomenclador->iddatosnomenclador = $iddatonomenclador;
        $objdatonomenclador->idnomenclador = $idnomenclador;
        $objdatonomenclador->save();
        return 1;
    }

    public function eliminarNomenclador($iddatonomenclador, $idnomenclador) {
        $conn = Doctrine_Manager::connection();

        $datos = implode(',', $iddatonomenclador);
        $result = "DELETE FROM mod_planifinversiones.dat_tipoinversionprograma 
	   WHERE (iddatosnomenclador IN (" . $datos . ") AND idnomenclador = " . $idnomenclador . ")";
        $cant = $conn->execute($result);
        if ($cant) {
            return true;
        } else {
            return false;
        }
    }

}
