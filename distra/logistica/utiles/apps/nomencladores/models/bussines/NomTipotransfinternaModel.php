<?php

class NomTipotransfinternaModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarNomenclador($array)
    {

        $obj = parent::insertarNomenclador($array, true);

        if (is_object($obj)) {
            if($array['pordefecto'])
            {
                $this->actualizarDefecto($obj->idtipotransfinterna);
            }
            if ($array['adicionados']) {
                $adicionados = explode(',', $array['adicionados']);
                foreach ($adicionados as $value) {
                    $o = new NomTipotransfinternaarea();
                    $o->iddeposito = $value;
                    $obj->NomTipotransfinternaarea[] = $o;
                    unset($o);
                }
            }
            $obj->save();
            return true;
        }
        return false;
    }

    public function actualizarDefecto($idtipotransfinterna)
    {
        Doctrine_Query::create()
            ->update('NomTipotransfinterna')
            ->set('pordefecto', 0)
            ->whereNotIn('idtipotransfinterna', array($idtipotransfinterna))
            ->execute();
    }

    public function modificarNomenclador($array)
    {

        $obj = parent::modificarNomenclador($array, true);
        if ($obj != -1 && $obj != -2) {
            $obj->save();
            if($array['pordefecto'])
            {
                $this->actualizarDefecto($obj->idtipotransfinterna);
            }
            if ($array['eliminados']) {
                Doctrine_Query::create()
                        ->delete()
                        ->from('NomTipotransfinternaarea')
                        ->where(
                                "idtipotransfinterna = ?
                        AND iddeposito in({$array['eliminados']})", array($array['idtipotransfinterna'])
                        )
                        ->execute();
            }

            if ($array['adicionados']) {
                $adicionados = explode(',', $array['adicionados']);
                $colect = new Doctrine_Collection('NomTipotransfinternaarea');
                foreach ($adicionados as $value) {
                    $o = new NomTipotransfinternaarea();
                    $o->iddeposito = $value;
                    $o->idtipotransfinterna = $obj->idtipotransfinterna;
                    $colect->add($o);
                }
                $colect->save();
            }
//            print_r($colect->toArray());die;
            return true;
        } else {
            return $obj;
        }
    }

    public function habilitarDesabiltarEntidad($array)
    {
        $arr = (!is_array($array['idnom'])) ? json_decode(
                        stripslashes($array['idnom'])
                ) : $array['idnom'];
        $qTipoares = Doctrine_Query::create()->select('ta.iddeposito')
                ->from('NomTipotransfinternaarea ta')
                ->whereIn('ta.idtipotransfinterna', $arr)
                ->fetchArray();
        $arrIdNomtipoArea = array();
        foreach ($qTipoares as $nTipoarea) {
            array_push($arrIdNomtipoArea, $nTipoarea['iddeposito']);
        }
        if ($array['habilitarentidad'] == 1) {
            parent::habilitarDesabiltarEntidad(
                    array(
                        'idnom' => $arrIdNomtipoArea,
                        'habilitarentidad' => 1,
                        'modelo' => 'NomTipotransfinternaarea',
                        'pkid' => 'iddeposito'
                    )
            );
        }
        return parent::habilitarDesabiltarEntidad($array);
    }

    public function buscarDatos($params, $cEstructura)
    {
     
        if ($params['excluir']) {
            $params['excluir'] = json_decode(stripcslashes($params['excluir']));
        }

        $sqlConfGeneral = " SELECT
            conf.idreservmob,
            conf.iddispensario,
            conf.idalmacenusuf,
            conf.idreserva,
            conf.idareaventa,
            conf.idalmacen,
            conf.idretenido
            FROM mod_logfarmacia.conf_generalfm conf
            WHERE conf.idestructura = {$cEstructura}";
        $conn = Zend_Registry::get('conexion');
        $sqlConfGeneral = $conn->execute($sqlConfGeneral)->fetchAll(PDO::FETCH_ASSOC);
        if (count($sqlConfGeneral) > 0) {
            $conndos = Zend_Registry::get('conexion');
            $datArray = $this->buscarDatosFor($sqlConfGeneral[0], $params);
            $datArray = implode(',', $datArray);
            if ($params['grid'] == "izq") {


                    $sql = " SELECT e.denominacion, e.idestructuraop as iddeposito, f.idconcepto, f.orden";

                    $from = " FROM mod_estructuracomp.nom_filaestruc f
                INNER JOIN mod_estructuracomp.dat_estructuraop e on f.idfila = e.idestructuraop";

                    $where = "  WHERE e.idestructuraop in ($datArray) ";

                    if ($params['modificar'] == "true") {
                        $where .= " and e.idestructuraop NOT IN (
                    SELECT iddeposito FROM mod_logfarmacia.nom_tipotransfinternaarea
                    where idtipotransfinterna = {$params['idtipotransfinterna']}
                    )";
                    }
                    if ($params['filtro']) {
                        $arr = json_decode(stripslashes($params['filtro']));
                        foreach ($arr as $arrfiltros) {
                            foreach ($arrfiltros as $key => $value) {
                                if ($key != 'signo' && $key != 'modelo') {
                                    if ($arrfiltros->signo) {
                                        $signo = explode(',', $arrfiltros->signo);
                                        if (trim($signo[0]) == 'in' || trim($signo[0]) == 'not in'
                                        ) {
                                            if ($signo[1] == 'select') {
                                                $arrFiltro [] = " m.{$params['idnom']} " . strtoupper(
                                                        $signo[0]
                                                    )
                                                    . " ( SELECT x.{$params['idnom']}
                                            FROM {$arrfiltros->modelo} x
                                            WHERE  {$key} = $value )";
                                            } else {
                                                $arrFiltro [] = " m.{$params['idnom']}
                                        {$signo[0]}( $value )";
                                            }
                                        } else {
                                            $signo = ($arrfiltros->signo) ? $arrfiltros->signo : " = ?";
                                            $arrFiltro [] = " $key $signo";
                                            $valores [] = $value;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $total = $conndos->execute($sql . $from . $where)->fetchAll(PDO::FETCH_ASSOC);

                    if ($params['limit']) {
                        $offset = " offset({$params['start']}) limit({$params['limit']})";
                    }
                    $sql = $conndos->execute($sql . $from . $where . $offset)->fetchAll(PDO::FETCH_ASSOC);

                    return array($sql, count($total));

            }

            if ($params['grid'] == "der") {
                $filter = json_decode(stripslashes($params['filtro']));
                $connder = Zend_Registry::get('conexion');
                if ($params['modificar'] == "true") {
                    $sql = " SELECT e.denominacion, e.idestructuraop as iddeposito, f.idconcepto, f.orden,
                nt.idtipotransfinterna";

                    $from = " FROM mod_estructuracomp.nom_filaestruc f
                INNER JOIN mod_estructuracomp.dat_estructuraop e on f.idfila = e.idestructuraop
                INNER JOIN mod_logfarmacia.nom_tipotransfinternaarea nt on e.idestructuraop = nt.iddeposito";

                    $where = "  WHERE  idtipotransfinterna = {$filter[0]->idtipotransfinterna}";
                    $total = $connder->execute($sql . $from . $where)->fetchAll(PDO::FETCH_ASSOC);
                    if ($params['limit']) {
                        $offset = " offset({$params['start']}) limit({$params['limit']})";
                    }

                    $sql = $connder->execute($sql . $from . $where . $offset)->fetchAll(PDO::FETCH_ASSOC);
                    return array($sql, $total);
                } else

                    return array();
            }
        }else {
            return array();
        }
    }

    public function buscarDatosFor($confgene, $params)
    {      $array = [];
        if ($confgene['idreservmob'] != null) {
            $array[] = $confgene['idreservmob'];
        }
        if ($confgene['iddispensario'] != null) {
            $array[] = $confgene['iddispensario'];
        }
        if ($confgene['idalmacenusuf'] != null) {
            $array[] = $confgene['idalmacenusuf'];
        }
        if ($confgene['idreserva'] != null) {
            $array[] = $confgene['idreserva'];
        }
        if ($confgene['idareaventa'] != null) {
            $array[] = $confgene['idareaventa'];
        }
        if ($confgene['idalmacen'] != "") {
            $array[] = $confgene['idalmacen'];
        }
        if ($confgene['idretenido'] != "") {
            $array[] = $confgene['idretenido'];
        }
        if ($params['excluir'] && count($params['excluir']) > 0) {
            $array = array_diff($array, $params['excluir']);
        }

        return (count($array) > 0) ? $array: array(0);
    }

}
