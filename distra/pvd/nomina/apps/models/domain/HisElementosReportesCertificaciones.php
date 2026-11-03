<?php

class HisElementosReportesCertificaciones extends BaseHisElementosReportesCertificaciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('HisReportesCertificaciones', array(
            'local' => 'idreportescertificaciones',
            'foreign' => 'idreportecertificacion',
            'refClass' => 'HisElementosReportesCertificaciones'
        ));

    }

    public static function obtenerObjDatElementosReportesCertificacionesDadoId($idhiselementosreportescertificaciones)
    {
        return Doctrine::getTable('HisElementosReportesCertificaciones')->find($idhiselementosreportescertificaciones);
    }

    public static function obteneridhiselementosreportescertificacionesXIdReporte($idreportescertificaciones)
    {
        return Doctrine_Query::create()->select('p.idhiselementosreportescertificaciones AS idhiselementosreportescertificaciones')
            ->from('HisElementosReportesCertificaciones p')
            ->where('p.idreportescertificaciones = ?', array($idreportescertificaciones))
            ->fetchArray();

    }

    public static function obtenerCabeceraReportesCertificacionesPersona($idreportescertificaciones)
    {
        $sql = "SELECT trc.denominacion,  rc.fechainicio,
       rc.fechafin, e.denominacion as entidad,e.codigo, rc.idusuario
  FROM mod_nomina.his_reportecertificacion rc
  inner join mod_nomina.conf_tiporeportescertificaciones  trc
  on(rc.idconfreportescertificaciones=trc.idconfreportescertificaciones)
  inner join mod_estructuracomp.dat_estructura e on(e.idestructura=rc.identidad)
  where rc.idreportecertificacion=?;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones));

        return $arregloElem;
    }

    public static function obtenerElementosReportesCertificacionesPersona($idreportescertificaciones)
    {
        $sql = "select erp.idhiselementosreportescertificaciones as idelementosreportescertificaciones,
		erp.idreportescertificaciones, erp.idelemento, erp.aprobado,hv.valor, 
		hv.idvariablesconfreportescertificaciones, (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) as nombreyapellidos
        from mod_nomina.his_elementosreportescertificaciones erp
        left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento)
        left join mod_nomina.his_variableselementosreportescertificaciones hv on (hv.idelementosreportescertificaciones = erp.idhiselementosreportescertificaciones)
        where idreportescertificaciones = ? order by nombreyapellidos ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones));
        $arrIdsElem = array();
        foreach ($arregloElem as $k => $e) {
            $arrIdsElem[] = $e['idelementosreportescertificaciones'];
        }

        $objVE = new HisVariablesElementosReportesCertificaciones();
        $arregloVE = $objVE->obtenerVariablesElementosReportesCertificaciones($arrIdsElem);
        $cont = 0;
        $arrayreturn = array();
        //print_r($arregloVE);die;
        foreach ($arregloElem as $i => &$e) {
            foreach ($arregloVE as $k => $ve) {
                if ($ve['idelementosreportescertificaciones'] == $e['idelementosreportescertificaciones'])
                    $e[$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
            }
        }


        return $arregloElem;

    }

    public static function obtenerElementosReportesCertificacionesPersonaPDF($idreportescertificaciones, $identidad)
    {
        $sql = "select erp.idhiselementosreportescertificaciones as idelementosreportescertificaciones,
		erp.idreportescertificaciones, erp.idelemento, erp.aprobado,hv.valor,
		hv.idvariablesconfreportescertificaciones, (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) as nombreyapellidos
        from mod_nomina.his_elementosreportescertificaciones erp
        left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento)
        left join mod_nomina.his_variableselementosreportescertificaciones hv on (hv.idelementosreportescertificaciones = erp.idhiselementosreportescertificaciones)
        where idreportescertificaciones = ? and dco.identidad = ? order by orden ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones, $identidad));
        $arrIdsElem = array();
        foreach ($arregloElem as $k => $e) {
            $arrIdsElem[] = $e['idelementosreportescertificaciones'];
        }

        $objVE = new HisVariablesElementosReportesCertificaciones();
        $arregloVE = $objVE->obtenerVariablesElementosReportesCertificaciones($arrIdsElem);
        $cont = 0;
        $arrayreturn = array();
        //print_r($arregloVE);die;
        foreach ($arregloElem as $i => &$e) {
            foreach ($arregloVE as $k => $ve) {
                if ($ve['idelementosreportescertificaciones'] == $e['idelementosreportescertificaciones'])
                    $e[$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
            }
        }


        return $arregloElem;

    }

    public static function obtenerElementosReportesCertificacionesBuscarPersona($idreportescertificaciones, $textobuscar)
    {
        $sql = "select erp.*, (dp.nombre ||' '|| dp.papel ||' '|| dp.sapel) as nombreyapellidos
        from mod_nomina.his_elementosreportescertificaciones erp
        left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento)
        where (idreportescertificaciones = ?) and (dp.nombre ilike '%$textobuscar%' or dp.snombre ilike '%$textobuscar%' or dp.papel ilike '%$textobuscar%' or dp.sapel ilike '%$textobuscar%') 
		order by nombreyapellidos;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arregloElem = $conn->fetchAll($sql, array($idreportescertificaciones));

        $arrIdsElem = array();
        foreach ($arregloElem as $k => $e) {
            $arrIdsElem[] = $e['idhiselementosreportescertificaciones'];
        }

        $objVE = new HisVariablesElementosReportesCertificaciones();
        $arregloVE = $objVE->obtenerVariablesElementosReportesCertificaciones($arrIdsElem);

        foreach ($arregloElem as $i => &$e) {
            foreach ($arregloVE as $k => $ve) {
                if ($ve['idhiselementosreportescertificaciones'] == $e['idhiselementosreportescertificaciones'])
                    $e[$ve['idvariablesconfreportescertificaciones']] = $ve['valor'];
            }
        }
        return $arregloElem;
    }

    public static function devolverElementosqueCoinciden($idreportescertificaciones, $arrEl)
    {
        $sql = "select *
        from mod_nomina.his_elementosreportescertificaciones erp
        where idreportescertificaciones = ? and idelemento in (" . implode(',', $arrEl) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idreportescertificaciones));

    }

    public function obtenerElementosReportesCertificaciones($idreportescertificaciones, $nivel = 1, $limite = 15, $inicio = 0)
    {
        if ($nivel == 1) {
            $sql = "select erp.*, (CASE WHEN dp.snombre is null or dp.snombre = '' THEN dp.nombre || ' ' || dp.papel || ' ' ||dp.sapel ELSE dp.nombre ||' '|| dp.snombre || ' ' || dp.papel || ' ' ||dp.sapel END) as  denominacion
			from mod_nomina.his_elementosreportescertificaciones erp
			left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento and dp.fechaeliminado is null)
			where idreportescertificaciones = ? and aprobado = 1 order by denominacion limit ?  offset ?;";

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            return $conn->fetchAll($sql, array($idreportescertificaciones, $limite, $inicio));
        } else {
            return array();
        }
    }

    public function cantidadElementosReportesCertificaciones($idreportescertificaciones, $nivel = 1)
    {
        if ($nivel == 1) {
            $sql = "select count(erp.*) as cantidad
			from mod_nomina.his_elementosreportescertificaciones erp
			left join mod_persona.dat_persona dp on (dp.idpersona = erp.idelemento and dp.fechaeliminado is null)
			where idreportescertificaciones = ? and aprobado = 1 ;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql, array($idreportescertificaciones));
            return $r[0]['cantidad'];
        } else {
            return 0;
        }
    }
}
