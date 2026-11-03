<?php

class DatElemento extends BaseDatElemento {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapa', array('local' => 'idetapa', 'foreign' => 'idetapa'));
        $this->hasMany('DatElementovalor', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasMany('DatElementodoc', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasMany('DatElementotipomodelo', array('local' => 'idelemento', 'foreign' => 'idelemento'));
    }

    private function addWhereConParams(&$Where, &$params_query, $colum_cond, $param) {
        $Where.= " AND " . $colum_cond . $param;
    }

    public function salvar(DatElemento &$objDatelemento) {
        $objDatelemento->save();
        return $objDatelemento->idelemento;
    }

    public function getByid($idelemento) {
        return Doctrine::getTable('DatElemento')->find($idelemento);
    }

    public function Del($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion
                        from mod_planificacion.nom_datosnomenclador
                         INNER JOIN mod_planifinversiones.nom_nomenclador 
						 ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.nom_nomenclador.idnomenclador 
                        INNER JOIN mod_planifinversiones.dat_tipoinversionprograma 
						ON mod_planifinversiones.nom_nomenclador.idnomenclador = mod_planifinversiones.dat_tipoinversionprograma.iddatosnomenclador ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
    }

    public function ListarDoc($params) {
        $addwhere = "";
        foreach ($params['filtros'] as $p => $s) {
            if ($s != null) {
                if ($s['field'] == 'denominacion') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(detm.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT de.idelemento, detm.denominacion,  de.idelementodoc,de.iddocumentos,
                 degd.idelementodocgestordoc,degd.idetapaelementoinversion ,degd.idcontenido
    FROM mod_planifinversiones.dat_elementodoc  de                 
    INNER JOIN mod_datosmaestros.nom_docprim detm ON de.iddocumentos = detm.iddocumentos
    LEFT JOIN mod_planifinversiones.dat_etapaelementoinversion dei ON de.idelemento = dei.idelemento
    LEFT JOIN mod_planifinversiones.dat_elementodocgestordoc degd ON degd.idetapaelementoinversion = dei.idetapaelementoinversion
	WHERE dei.idetapaelementoinversion = " . $params['idelemento'] . "$addwhere";
        $datosListar = $conn->execute($sql);
        $datos->data = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        $total = "SELECT count(de.idelemento) total
    FROM mod_planifinversiones.dat_elementodoc  de                 
    INNER JOIN mod_datosmaestros.nom_docprim detm ON de.iddocumentos = detm.iddocumentos
    LEFT JOIN mod_planifinversiones.dat_etapaelementoinversion dei ON de.idelemento = dei.idelemento
    LEFT JOIN mod_planifinversiones.dat_elementodocgestordoc degd ON degd.idetapaelementoinversion = dei.idetapaelementoinversion
	WHERE dei.idetapaelementoinversion = " . $params['idelemento'] . "$addwhere
           ";
        $totaldat = $conn->execute($total);
        $tol = $totaldat->fetchAll(PDO::FETCH_ASSOC);
        $datos->total = $tol['total'];

        return $datos;
    }

    public function Add($params) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion
                        from mod_planificacion.nom_datosnomenclador
                         INNER JOIN mod_planifinversiones.nom_nomenclador 
						 ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.nom_nomenclador.idnomenclador 
                        INNER JOIN mod_planifinversiones.dat_tipoinversionprograma 
						ON mod_planifinversiones.nom_nomenclador.idnomenclador = mod_planifinversiones.dat_tipoinversionprograma.iddatosnomenclador ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
    }

    public function cargarElementoByidetapa($param) {
        $ADDWHERE = "";
        $condiciones = array();
        $p = $param['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'denelemento') {
                $condiciones[] = "upper(de.denominacion) LIKE " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'denominacion') {
                $condiciones[] = "upper(ntm.denominacion) LIKE  " . ("'%" . strtoupper($datos['data']['value']) . "%'");
            } else if ($datos['field'] == 'documento' && $datos['data']['value'] == 'Si') {
                $condiciones[] = "de.documento=1";
            } else if ($datos['field'] == 'documento' && $datos['data']['value'] == 'No') {
                $condiciones[] = "de.documento=0";
            }
        }
        $ADDWHERE = ' ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        $query = " SELECT de.idelemento, de.idetapa, de.documento, de.parametrosdinamicos, de.denominacion as denelemento, 
                detm.idtipomodelo, ntm.denominacion
            FROM mod_planifinversiones.dat_elemento de
            LEFT JOIN mod_planifinversiones.dat_elementotipomodelo detm ON de.idelemento = detm.idelemento
            LEFT JOIN mod_planificacion.nom_tipomodelo ntm ON ntm.idtipomodelo = detm.idtipomodelo
            WHERE de.idetapa = " . $param['idcomponente'] . "
            $ADDWHERE";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarElemt($params,$inv) {
        $conn = Doctrine_Manager::connection();
        if ($params['idinversion'] == 0) {
            $sql = "select
                mod_planifinversiones.dat_elemento.idelemento , 
                mod_planifinversiones.dat_elemento.parametrosdinamicos ,
                mod_planifinversiones.dat_elemento.documento,
                mod_planifinversiones.dat_etapainversion.idetapainversion idetapa

                        FROM  mod_planifinversiones.nom_tipoinversion 
                        inner join mod_planifinversiones.conf_formatoetapa on (mod_planifinversiones.conf_formatoetapa.idformatoetapa = mod_planifinversiones.nom_tipoinversion.idformatoetapa)
                        INNER JOIN mod_planifinversiones.dat_etapa ON (mod_planifinversiones.dat_etapa.idformatoetapa = mod_planifinversiones.conf_formatoetapa.idformatoetapa)
                        INNER JOIN mod_planifinversiones.dat_etapainversion ON (mod_planifinversiones.dat_etapainversion.idetapa = mod_planifinversiones.dat_etapa.idetapa)
                        inner join mod_planifinversiones.dat_elemento on (mod_planifinversiones.dat_elemento.idetapa = mod_planifinversiones.dat_etapainversion.idetapa)
                                where 
                                mod_planifinversiones.nom_tipoinversion.idtipoinversion = " . $params['idclasificacion'] . " and mod_planifinversiones.dat_etapainversion.idinversion = $inv";
        } else {
            $sql = "select
                mod_planifinversiones.dat_elemento.idelemento , 
                mod_planifinversiones.dat_elemento.parametrosdinamicos ,
                mod_planifinversiones.dat_elemento.documento,
                mod_planifinversiones.dat_etapainversion.idetapainversion idetapa

                        FROM  mod_planifinversiones.nom_tipoinversion 
                        inner join mod_planifinversiones.conf_formatoetapa on (mod_planifinversiones.conf_formatoetapa.idformatoetapa = mod_planifinversiones.nom_tipoinversion.idformatoetapa)
                        INNER JOIN mod_planifinversiones.dat_etapa ON (mod_planifinversiones.dat_etapa.idformatoetapa = mod_planifinversiones.conf_formatoetapa.idformatoetapa)
                        INNER JOIN mod_planifinversiones.dat_etapainversion ON (mod_planifinversiones.dat_etapainversion.idetapa = mod_planifinversiones.dat_etapa.idetapa)
                        inner join mod_planifinversiones.dat_elemento on (mod_planifinversiones.dat_elemento.idetapa = mod_planifinversiones.dat_etapainversion.idetapa)
                                where 
                                mod_planifinversiones.nom_tipoinversion.idtipoinversion = " . $params['idclasificacion'] . "
                                and mod_planifinversiones.dat_etapainversion.idinversion = " . $params['idinversion'] . "";
        }
        $datosListar = $conn->execute($sql);
        $datos->data = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDocumentoDadoEl($idelemento) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT e.idelemento,e.documento,e.parametrosdinamicos,e.denominacion,ed.idelementodoc,ed.iddocumentos
				FROM mod_planifinversiones.dat_elemento e
				LEFT JOIN mod_planifinversiones.dat_elementodoc ed ON ed.idelemento = e.idelemento
				WHERE e.idelemento = " . $idelemento;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function UpDocumento($parametros, $idelemento) {
        $query = new Doctrine_Query ();
        $query->update('DatElemento n')
                ->set('documento', $parametros['asso'])
                ->where('idelemento=? ', array($idelemento))
                ->execute();
    }

    public function getElementos() {
        $query = new Doctrine_Query();
        $datos = $query->select("de.idelemento, de.denominacion")
                ->from("DatElemento de")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $datos;
    }

    public function getElementosXEtapa($idetapa, $idmp, $idusd) {
        $sql_query = "Select elm.denominacion, elv.idmonedaentidad, el.idetapaelementoinversion,et.idinversion, et.idetapa, elm.idelemento,

coalesce ((elv.valor),0) as valormp,
coalesce ((elv1.valor),0) as valorusd

from mod_planifinversiones.dat_etapaelementoinversion el
inner join mod_planifinversiones.dat_elemento elm on(el.idelemento = elm.idelemento)
inner join mod_planifinversiones.dat_etapainversion et on(el.idetapainversion = et.idetapainversion)
left join mod_planifinversiones.dat_elementovalor elv on(elv.idelemento = el.idetapaelementoinversion and elv.idmonedaentidad in($idmp) )
left  join mod_planifinversiones.dat_elementovalor elv1 on(elv1.idelemento = el.idetapaelementoinversion and elv1.idmonedaentidad in ($idusd))
where el.idetapainversion = $idetapa";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
