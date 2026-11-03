<?php

class DatEtapa extends BaseDatEtapa {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('ConfFormatoetapa', array('local' => 'idformatoetapa', 'foreign' => 'idformatoetapa'));
        $this->hasOne('DatFlujotrabajo', array('local' => 'idflujotrabajo', 'foreign' => 'idflujotrabajo'));
        $this->hasOne('NomEstadosft', array('local' => 'idestadoflujotrabajo', 'foreign' => 'idestadosft'));
        $this->hasOne('NomNombreetapa', array('local' => 'idnombreetapa', 'foreign' => 'idnombreetapa'));
        $this->hasMany('DatElemento', array('local' => 'idetapa', 'foreign' => 'idetapa'));
    }

    public function getByid($idetapa) {
        return Doctrine::getTable('DatEtapa')->find($idetapa);
    }

    public function AprobarDes($parametros) {
        $query = new Doctrine_Query ();
        $result = $query->update('DatEtapa n')
                ->set('aprobado', $parametros['idaprobado'])
                ->where('idetapa=? ', $parametros['idcomponente'][0])
                ->execute();
        return true;
    }

    public function cargarComponentesByIdFormatoEtapa($param) {
        $query = new Doctrine_Query();
        $p = $param['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denominacion') {
                $query->addWhere("upper(nn.denominacion)  LIKE '%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'etapa') {
                $query->addWhere(" dft.idflujotrabajo  =" . ($datos['data']['value']));
            } else if ($datos['field'] == 'orden') { {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $query->addWhere(" de.{$datos['field']} {$cond} ?", $datos['data']['value']);
                }
            }
        }
        $result = $query->select("de.*, nn.*, cf.*, dft.*")
                ->from("DatEtapa de")
                ->innerJoin("de.NomNombreetapa nn")
                ->innerJoin("de.ConfFormatoetapa cf")
                ->innerJoin("de.DatFlujotrabajo dft")
                ->addWhere("de.idformatoetapa=?", $param['idformatoetapa'])
                ->offset($param['start'])
                ->limit($param['limit'])
                ->orderby("de.orden")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function DatEtapaDesasociar($param) {
        $query = new Doctrine_Query();
        $query->delete()
                ->from('DatEtapa de')
                ->where("de.idnombreetapa =?", $param['idnombrecomponente'])
                ->execute();
        return true;
    }

    public static function flujoEnUso($idflujo) {
        $sql_query = "SELECT * FROM mod_planifinversiones.dat_etapa
        WHERE idflujotrabajo='$idflujo';";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function cambiarEstado($params) {
        $query = new Doctrine_Query ();
        $result = $query->update('DatEtapaInversion n')
                ->set('idestadoft', $params['estado'])
                ->where('idetapainversion=? ', array($params['idcomponenete']))
                ->execute();
        return true;
    }

    public function buscarCmp($param, $objInv) {
        $conn = Doctrine_Manager::connection();
        $sql = "select et.idetapa,ne.denominacion,
		estado.denominacion estado, estado.idestadosft,et.orden,
		mod_planifinversiones.dat_flujotrabajo.idflujotrabajo,
		et.idestadoflujotrabajo
					FROM mod_planifinversiones.dat_etapa et
					INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
					LEFT JOIN mod_planifinversiones.nom_estadosft estado ON (estado.idestadosft = et.idestadoflujotrabajo)
					INNER JOIN mod_planifinversiones.dat_flujotrabajo ON (mod_planifinversiones.dat_flujotrabajo.idflujotrabajo = et.idflujotrabajo)
					INNER JOIN mod_planifinversiones.conf_formatoetapa fe ON (et.idformatoetapa = fe.idformatoetapa)
					INNER JOIN mod_planifinversiones.nom_tipoinversion ON (fe.idformatoetapa = mod_planifinversiones.nom_tipoinversion.idformatoetapa)
					WHERE mod_planifinversiones.nom_tipoinversion.idtipoinversion = " . $param['idclasificacion'] . "
					Group by 
					estado, 
					estado.idestadosft,
					et.orden,
					et.idetapa,
					ne.denominacion,
					et.idestadoflujotrabajo,
					mod_planifinversiones.dat_flujotrabajo.idflujotrabajo
					order by et.orden ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ComponentPT($param) {
        $conn = Doctrine_Manager::connection();

        $sql = "select et.idetapa,ne.denominacion,
		trainicial.inicial,
		trainicial.idestadoinicial,et.orden,
		trainicial.idestadofinal,
		et.idflujotrabajo,
		et.idestadoflujotrabajo,trainicial.idtransicion
					FROM mod_planifinversiones.dat_etapa et
					INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
					INNER JOIN mod_planifinversiones.nom_estadosft estado ON (estado.idestadosft = et.idestadoflujotrabajo)
					INNER JOIN mod_planifinversiones.conf_formatoetapa fe ON (et.idformatoetapa = fe.idformatoetapa)
					INNER JOIN mod_planifinversiones.nom_tipoinversion ON (fe.idformatoetapa = mod_planifinversiones.nom_tipoinversion.idformatoetapa)
					INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.nom_tipoinversion.idtipoinversion = mod_planifinversiones.dat_inversion.idtipoinversion)
					INNER JOIN mod_planifinversiones.dat_flujotrabajo ON (mod_planifinversiones.dat_flujotrabajo.idflujotrabajo = et.idflujotrabajo)
					INNER JOIN mod_planifinversiones.dat_transicion trainicial ON (trainicial.idflujotrabajo = mod_planifinversiones.dat_flujotrabajo.idflujotrabajo)
					WHERE mod_planifinversiones.dat_inversion.idejercicio = " . $param['idejercicio'] . " AND mod_planifinversiones.dat_inversion.idestructuracomun = " . $param['identidad'] . " AND mod_planifinversiones.dat_inversion.idinversion = " . $param['idinversion'] . "
					
					Group by 
					et.idetapa,
					ne.denominacion,
					et.orden,
					et.idflujotrabajo,
					trainicial.idtransicion,
					trainicial.inicial
					order by et.orden ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ListarTracc($param) {
        $conn = Doctrine_Manager::connection();
        $orden = $param['orden'] + 1;
        $sql = "select et.idetapa,ne.denominacion,
		estado.denominacion estado, estado.idestadosft,trainicial.inicial,
		trainicial.idestadoinicial,et.orden,
		trainicial.idestadofinal,
		et.idestadoflujotrabajo,trainicial.idtransicion
					FROM mod_planifinversiones.dat_etapa et
					INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
					INNER JOIN mod_planifinversiones.conf_formatoetapa fe ON (et.idformatoetapa = fe.idformatoetapa)
					INNER JOIN mod_planifinversiones.nom_tipoinversion ON (fe.idformatoetapa = mod_planifinversiones.nom_tipoinversion.idformatoetapa)
					INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.nom_tipoinversion.idtipoinversion = mod_planifinversiones.dat_inversion.idtipoinversion)
					INNER JOIN mod_planifinversiones.dat_flujotrabajo ON (mod_planifinversiones.dat_flujotrabajo.idflujotrabajo = et.idflujotrabajo)
					INNER JOIN mod_planifinversiones.dat_transicion trainicial ON (trainicial.idflujotrabajo = mod_planifinversiones.dat_flujotrabajo.idflujotrabajo)
					INNER JOIN mod_planifinversiones.nom_estadosft estado ON (estado.idestadosft = trainicial.idestadoinicial)
					WHERE mod_planifinversiones.dat_inversion.idejercicio = " . $param['idejercicio'] . " AND mod_planifinversiones.dat_inversion.idestructuracomun = " . $param['identidad'] . " AND mod_planifinversiones.dat_inversion.idinversion = " . $param['idinversion'] . "
					Group by 
					et.idetapa,
					ne.denominacion,
					estado.idestadosft,
					et.orden,
					trainicial.idtransicion,
					trainicial.inicial,
					estado
					order by et.orden";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function BuscarTF($param) {
        $conn = Doctrine_Manager::connection();

        $sql = "SELECT 
                    dt.idtransicion AS idtra,
                    nt.idestadosft,
                    nt.denominacion AS deno,
                    dt.inicial,
                    nt.descripcion,
                    dt.idflujotrabajo,
                    dt.idestadoinicial,
                    dt.idestadofinal
                FROM
                    mod_planifinversiones.dat_transicion dt
                    INNER JOIN mod_planifinversiones.nom_estadosft nt ON (nt.idestadosft = dt.idestadofinal)
                WHERE
                    dt.idestadoinicial = " . $param['idestadoflujotrabajo'] . " AND 
                    dt.idflujotrabajo = " . $param['idflujotrabajo'] . "
                GROUP BY
                    idtra,
                    nt.idestadosft,
                    deno,
                    dt.inicial";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarEstadosPorId($param, $estFinal) {
        $conn = Doctrine_Manager::connection();
        $sql = "select et.idetapa idetapa,
		 estadof.idestadosft idestadosft,trainicial.inicial inicial,
		trainicial.idtransicion idtra,etapa.orden orden,
		estadof.denominacion deno
					FROM mod_planifinversiones.dat_etapainversion et
					INNER JOIN mod_planifinversiones.dat_etapa etapa ON ( etapa.idetapa = et.idetapa)
					INNER JOIN mod_planifinversiones.dat_flujotrabajo ON (mod_planifinversiones.dat_flujotrabajo.idflujotrabajo = etapa.idflujotrabajo)
					INNER JOIN mod_planifinversiones.dat_transicion trainicial ON (trainicial.idflujotrabajo = mod_planifinversiones.dat_flujotrabajo.idflujotrabajo)
					INNER JOIN mod_planifinversiones.dat_usuariotransicion usert ON (usert.idtransicion = trainicial.idtransicion)
					INNER JOIN mod_planifinversiones.nom_estadosft estadof ON (estadof.idestadosft = trainicial.idestadofinal)
					
					WHERE (et.idetapainversion = " . $param['idetapa'] . " and trainicial.idestadoinicial 
					= " . $estFinal[0] ['idestadosft'] . "
					and usert.idusuario = " . $param['idusuario'] . " and trainicial.idflujotrabajo 
					= " . $param['idflujotrabajo'] . ") or ( 
					et.idetapainversion =  " . $param['idetapa'] . " and trainicial.idtransicion 
					= " . $estFinal[0] ['idtra'] . " and
					trainicial.inicial = 1 
					and usert.idusuario = " . $param['idusuario'] . " and trainicial.idflujotrabajo
					= " . $param['idflujotrabajo'] . ")
					Group by 
					et.idetapa,
					estadof.idestadosft,
					etapa.orden,
					estadof.denominacion,
					trainicial.inicial,
					trainicial.idtransicion
					order by etapa.orden";
        print_r($sql);
        die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function listarEstados() {
        $query = new Doctrine_Query();
        return $query->select("de.*")
                        ->from("NomEstadosft de")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public static function flujosEtapa() {

        $sql_query = "SELECT idflujotrabajo FROM mod_planifinversiones.dat_etapa;";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getEtapasDadoEntidades($params, $entidades) {

        if ($entidades == '') {
            $ADDWHERE = "";
        } else {
            $ADDWHERE = " AND inv.idestructuracomun IN($entidades)";
        }

        if ($params->idsinversiones) {
            $ADDWHERE1 = " AND inv.idinversion IN($params->idsinversiones)";
        }

        if ($params->idforma) {
            $pos = strpos($params->idforma, ",");

            if ($pos === false) {
                $forma = DatFormapropiedad::getByid($params->idforma);
                $iddatosnomenclador = $forma['iddatosnomenclador'];
            } else {
                $formass = explode(",", $params->idforma);
                foreach ($formass as $key => $value) {
                    $formasss[$key] = $value;
                }
                $cont = count($formasss);
                foreach ($formasss as $key => $value1) {
                    if ($cont == 1) {
                        // $formas .= $value1;
                        $forma = DatFormapropiedad::getByid($value1);
                        $iddatosnomenclador .= $forma['iddatosnomenclador'];
                    } else {
                        $forma = DatFormapropiedad::getByid($value1);
                        $iddatosnomenclador .= $forma['iddatosnomenclador'] . ",";
                        $cont--;
                    }
                }
            }
            $ADDWHERE2 = "AND dn.iddatosnomenclador IN ($iddatosnomenclador)";
        } else {
            $ADDWHERE2 = "";
        }

        $sql_query = "Select ei.idetapa, net.denominacion ,inv.idinversion, inv.idformapropiedad, dn.iddatosnomenclador,ei.idetapainversion, net.idnombreetapa, inv.idestructuracomun    
            from mod_planifinversiones.dat_inversion inv 
            inner join mod_planifinversiones.dat_etapainversion ei on(inv.idinversion = ei.idinversion)
            inner join mod_planifinversiones.dat_etapa et on(et.idetapa = ei.idetapa)
            inner join mod_planifinversiones.nom_nombreetapa net on(net.idnombreetapa = et.idnombreetapa)
            inner join mod_planifinversiones.dat_formapropiedad fp on(inv.idformapropiedad = fp.idformapropiedad)
            inner join mod_planificacion.nom_datosnomenclador dn on(dn.iddatosnomenclador = fp.iddatosnomenclador) 
            where inv.idejercicio = $params->idejercicio  $ADDWHERE $ADDWHERE1 $ADDWHERE2";			
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
