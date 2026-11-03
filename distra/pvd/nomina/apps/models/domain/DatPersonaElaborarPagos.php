<?php

class DatPersonaElaborarPagos extends BaseDatPersonaElaborarPagos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatElaborarPagos', array(
            'local' => 'idelaborarpagos',
            'foreign' => 'idelaborarpagos',
            'refClass' => 'DatPersonaElaborarPagos'
        ));

        $this->hasMany('NomCausasExclusionNomina', array(
            'local' => 'idcausaexclusion',
            'foreign' => 'idcausaexclusion',
            'refClass' => 'DatPersonaElaborarPagos'
        ));

        $this->hasMany('DatReportesCertificaciones', array(
            'local' => 'idreportescertificaciones',
            'foreign' => 'idreportescertificaciones',
            'refClass' => 'DatPersonaElaborarPagos'
        ));


    }

    public static function obtenerPersonaElaborarPagos($idelaborarpagos, $limit = 15, $start = 0, $text = '')
    {
        $limitCadena = ($start != null and $limit != null)? " limit $start offset $limit": " ";
        $sql = "select dpep.*, ddi.numero as ci,  nce.denominacion as causaexclusion, nfe.ordenunico,
                (CASE WHEN dp.snombre is null or dp.snombre = '' THEN dp.nombre || ' ' || dp.papel || ' ' || dp.sapel ELSE dp.nombre ||' '|| dp.snombre || ' ' || dp.papel || ' ' ||dp.sapel END) as  nombreyapellidos,
                (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN pln.idplantillanominal is not null THEN pln.idplantillanominal ELSE -1 END) as idplantillanominal,
                (CASE WHEN pln.idplantillanominal is not null AND pln.denominacion <> '' THEN pln.orden ||'-'|| pln.denominacion ELSE 'Sin plantilla nominal' END) as nombreplantilla
             
                from mod_nomina.dat_personaselaborarpagos dpep
                inner join mod_persona.dat_persona dp on (dp.idpersona = dpep.idpersona and dp.feliminado is null)
                inner join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona and ddi.principal = 1)
                left join mod_nomina.nom_causaexclusion nce on (nce.idcausaexclusion = dpep.idcausaexclusion) 
                LEFT JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dpep.idpersona)
                LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo)
                inner JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dco.idcargo)
                LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal) ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($text == '') {
            $sql .= "where idelaborarpagos = ?  ORDER BY nfe.ordenunico"/* . $limitCadena*/;  //print_r($sql);die;
            $r = $conn->fetchAll($sql, array($idelaborarpagos));
        } else {
            $arreglo = split(' ', $text);
            $or = '';
            $where = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . " dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
            $sql .= "where idelaborarpagos = $idelaborarpagos and ($where) ORDER BY nombreyapellidos;";
            $r = $conn->fetchAll($sql);
        }
        return $r;
    }

    public static function obtenerArrayIdPersonasElaborarPagos($idelaborarpagos){
        $sql = "select distinct dpep.idpersona from mod_nomina.dat_personaselaborarpagos dpep where dpep.idelaborarpagos = $idelaborarpagos";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }


    //Obtener personas excluidas
    public static function obtenerPersonaExcluidasElaborarPagos($idelaborarpagos)
    {
        $sql = "select dpep.*,  nce.denominacion as causaexclusion,
                (CASE WHEN dp.snombre is null or dp.snombre = '' THEN dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel ELSE dp.nombre ||' '|| dp.snombre || ' ' || dp.papel || ' ' ||dp.sapel END) as  nombreyapellidos
                from mod_nomina.dat_personaselaborarpagos	dpep
                inner join mod_persona.dat_persona dp on (dp.idpersona = dpep.idpersona and dp.feliminado is null)
                inner join mod_nomina.dat_elaborarpagos dep on (dep.idelaborarpagos = dpep.idelaborarpagos)
                left join mod_nomina.nom_causaexclusion nce on (nce.idcausaexclusion = dpep.idcausaexclusion)where dpep.excluido=1 and dep.idelaborarpagos = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idelaborarpagos));
        return $r;
    }


    public static function obtenerCantidadPersonaElaborarPagos($idelaborarpagos, $text = '')
    {

        $sql = "select  COUNT(*) AS cantidad
							from mod_nomina.dat_personaselaborarpagos dpep
							inner join mod_persona.dat_persona dp on (dp.idpersona = dpep.idpersona and dp.feliminado is null) ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($text == '') {
            $sql .= " where idelaborarpagos = ? ; ";
            $r = $conn->fetchAll($sql, array($idelaborarpagos));
        } else {
            $arreglo = split(' ', $text);
            $or = '';
            $where = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
            $sql .= " where idelaborarpagos = $idelaborarpagos and ($where) ; ";
            $r = $conn->fetchAll($sql);
        }
        return $r[0]['cantidad'];
    }

    public static function obtenerCantidadPersonaExcluidasElaborarPagos($idelaborarpagos, $text = '')
    {

        $sql = "select  COUNT(*) AS cantidad
							from mod_nomina.dat_personaselaborarpagos dpep
							inner join mod_persona.dat_persona dp on (dp.idpersona = dpep.idpersona and dp.feliminado is null) where dpep.excluido=1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($text == '') {
            $sql .= " where idelaborarpagos = ? ; ";
            $r = $conn->fetchAll($sql, array($idelaborarpagos));
        } else {
            $arreglo = split(' ', $text);
            $or = '';
            $where = '';
            for ($i = 0; $i < count($arreglo); $i++) {
                if ($arreglo[$i]) {
                    if ($where != '')
                        $or = 'or';
                    $where .= $or . "dp.nombre ilike '%$arreglo[$i]%' or dp.snombre ilike '%$arreglo[$i]%' or dp.papel ilike '%$arreglo[$i]%' or dp.sapel ilike '%$arreglo[$i]%' ";
                }
            }
            $sql .= " where idelaborarpagos = $idelaborarpagos and ($where) ; ";
            $r = $conn->fetchAll($sql);
        }
        return $r[0]['cantidad'];
    }

    public static function devolverPersonasNoCoinciden($idelaborarpagos, $arrIdsPersonas)
    {
        $sql = "select idpersona
							from mod_nomina.dat_personaselaborarpagos	
							where idelaborarpagos = ?  and idpersona in (" . implode(',', $arrIdsPersonas) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idelaborarpagos));

        if (count($r) > 0) { //Verifico que hubo coincidencias
            $a = array();
            foreach ($r as $k => $v) {
                $a[] = $v['idpersona'];
            }
            //Devuelvo todas las personas que no estan en el arreglo, porque no estan insertandas.
            return array_diff($arrIdsPersonas, $a);

        } else return $arrIdsPersonas;

        return $r;
    }

    //Devuelve todas las personas del periodo de pago que tengan la categoria que se pasa por parametro
    public static function obtenerPersonaElaborarPagosporCategoriasdePersonas($idelaborarpagos)
    {
        $sql = "select dpep.idpersona, dpepco.idcargosocupados
							from mod_nomina.dat_personaselaborarpagos	dpep
							left join mod_nomina.dat_personaelaborarpagoscargosocupados	dpepco on (dpepco.idpersonaelaborarpagos = dpep.idpersonaelaborarpagos)
							inner join mod_persona.dat_persona dp on (dp.idpersona = dpep.idpersona and dp.feliminado is null)
							where dpep.idelaborarpagos = ? and dpep.excluido = 0;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idelaborarpagos));

        return $r;
    }

    public static function obtenerPersonasNoExcluidas()
    {
        $sql = Doctrine_Query::create();
        return $sql->select('idpersona')
            ->from('DatPersonaElaborarPagos')
            ->where('excluido = 0')
            ->fetchArray();
    }
}
