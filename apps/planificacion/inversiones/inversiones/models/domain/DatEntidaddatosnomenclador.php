<?php

/**
 * DatEntidaddatosnomenclador
 *
 *
 * @ author Drisis Silvia D�az Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatEntidaddatosnomenclador extends BaseDatEntidaddatosnomenclador {

    public function setUp() {
        parent::setUp();

        $this->hasOne('NomDatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany(
                'DatPlanificacion', array('local' => 'identidaddatosnomenclador', 'foreign' => 'idcentrobalance')
        );
        $this->hasMany(
                'DatIndicadorcentrobalance', array('local' => 'identidaddatosnomenclador', 'foreign' => 'identidaddatosnomenclador')
        );
        $this->hasMany(
                'DatAjustedemanda', array('local' => 'identidaddatosnomenclador', 'foreign' => 'identidaddatosnomenclador')
        );
        $this->hasMany(
                'DatPrioridadcentrobalance', array('local' => 'identidaddatosnomenclador', 'foreign' => 'idcentrobalance')
        );
        $this->hasMany(
                'DatControldivisaindicadormodelo', array('local' => 'identidaddatosnomenclador', 'foreign' => 'identidadautor')
        );
    }

    public function getEntidaddatosnomenclador($array_comport, $params) {
        $query = new Doctrine_Query ();
        $query_total = new Doctrine_Query ();
        $array = array();
        if (is_array($params['filtros'])) {
            $nroalias = 1;
            $array_alias_uris['cb'] = 'Centrodebalance';
            $array_alias_uris['oc'] = 'organoconsumidor';
            $array_alias_uris['oe'] = 'ejecutor';
            $array_alias_uris['rector'] = 'rectorbalance';
            $array_alias_uris['rectorniveles'] = 'Órganorectordeniveles';
            $WHERE = "";
            $and = "";
            foreach ($params['filtros'] as $datos) {

                if ($datos ['field'] == 'denominacion') {
                    $integrator = ZendExt_IoC::getInstance();
                    $array_ids_sentidad2 = Array();
                    $array_ids_sentidad = $integrator->metadatos->obtenerEstructurasFiltroDenom($params['iddominio'], $datos ['data'] ['value']);
                    if ($array_ids_sentidad[0] != null) {
                        if (count($array_ids_sentidad) != 0) {
                            foreach ($array_ids_sentidad as $indice => $val) {
                                $array_ids_sentidad2[] = $val['idfila'];
                                unset($array_ids_sentidad[$indice]);
                            }

                            $str_idsents = implode(",", $array_ids_sentidad2);
                        }
                        else
                            $str_idsents = '0';

                        $query->addWhere("d.identidad IN ({$str_idsents}) ");
                        $query_total->addWhere("d.identidad in ({$str_idsents}) ");
                        $and = "AND";
                    }
                    else {
                        return array();
                    }
                } elseif ($datos ['field'] == 'cb' || $datos ['field'] == 'oc' || $datos ['field'] == 'oe' || $datos ['field'] == 'rector' || $datos ['field'] == 'rectorniveles') {

                    $iddn = $array_comport[$array_alias_uris[$datos ['field']]];

                    $alias = $datos ['field'] . $nroalias;
                    $nroalias++;
                    $cond = " IS NULL ";
                    if ($datos ['data'] ['value'] == 'Si') {
                        $cond = "IS NOT NULL";
                    }
                    $query->addWhere(
                            "( (SELECT {$alias}.iddatosnomenclador FROM DatEntidaddatosnomenclador {$alias} WHERE {$alias}.identidad = d.identidad and {$alias}.iddatosnomenclador = {$iddn}) {$cond} )"
                    );
                    $query_total->addWhere(
                            "( (SELECT {$alias}.iddatosnomenclador FROM DatEntidaddatosnomenclador {$alias} WHERE {$alias}.identidad = d.identidad and {$alias}.iddatosnomenclador = {$iddn}) {$cond} )"
                    );
                }
            }
        }

        $query->addSelect('DISTINCT d.identidad as identidad');
        $query->addSelect(
                '(SELECT cb.iddatosnomenclador FROM DatEntidaddatosnomenclador cb WHERE cb.identidad = d.identidad AND cb.iddatosnomenclador = ? ) as cb'
        );
        $query->addSelect(
                '(SELECT oc.iddatosnomenclador FROM DatEntidaddatosnomenclador oc WHERE oc.identidad = d.identidad AND oc.iddatosnomenclador = ? ) as oc'
        );
        $query->addSelect(
                '(SELECT oe.iddatosnomenclador FROM DatEntidaddatosnomenclador oe WHERE oe.identidad = d.identidad AND oe.iddatosnomenclador = ? ) as oe'
        );
        $query->addSelect(
                '(SELECT rector.iddatosnomenclador FROM DatEntidaddatosnomenclador rector WHERE rector.identidad = d.identidad AND rector.iddatosnomenclador = ? ) as rector'
        );
        $query->addSelect(
                '(SELECT rectorniveles.iddatosnomenclador FROM DatEntidaddatosnomenclador rectorniveles WHERE rectorniveles.identidad = d.identidad AND rectorniveles.iddatosnomenclador = ? ) as rectorniveles'
        );
        $query->from('DatEntidaddatosnomenclador d');
        $conn = Doctrine_Manager::connection();
        $sql = $query->getSqlQuery() . " ORDER BY d.identidad OFFSET ? LIMIT ?";
        $data->data = $conn->execute(
                $sql, array(
            $array_comport['Centrodebalance'],
            $array_comport['organoconsumidor'],
            $array_comport['ejecutor'],
            $array_comport['rectorbalance'],
            $array_comport['rectorcalculoniveles'],
            $params['start'],
            $params['limit'])
        );
        $data->data = $data->data->fetchAll(PDO::FETCH_ASSOC);
        $query_total->select('COUNT( DISTINCT d.identidad ) as total');
        $query_total->from('DatEntidaddatosnomenclador d');
        $data->total = $conn->execute($query_total->getSqlQuery());
        $data->total = $data->total->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total[0]['d__0'];
        return $data;
    }

    public function getComportamientoDadoEntidad($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad, d.iddatosnomenclador')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=?', $identidad
                )->execute()->toArray();
        return $res;
    }

    public function getEntidadDadoComportamiento($idcomportamiento) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        'd.iddatosnomenclador=?', $idcomportamiento
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getComport($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.iddatosnomenclador')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=?', $identidad
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getEntidadesDadoIdPadre($idpadre) {
        $conn = Doctrine_Manager::connection();
        $query
                = "SELECT distinct entdanom.identidad, entdanom.identidaddatosnomenclador
                    FROM mod_datosmaestros.dat_indicadorcentrobalance incbl
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador  entdanom
                    ON incbl.identidaddatosnomenclador = entdanom.identidaddatosnomenclador 
                    WHERE incbl.idindicador = ?";
        return $data = $conn->execute($query, array($idpadre))->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEntidadDadoIdDatos($identidaddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidaddatosnomenclador=?', $identidaddatosnomenclador
                )->execute()->toArray();
        return $res;
    }

    public function IdEntidadExiste($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where('d.identidad=?', $identidad)
                        ->execute()->toArray();

        if ($res[0] != null) {
            return true;
        } else {
            return false;
        }
    }

    public function getIdentidaddatosnomenclador($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidaddatosnomenclador')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=? AND d.iddatosnomenclador=?', array($identidad, 1)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    //Obtiene el comportamiento de la entidad
    public function getIddatosnomenclador($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.iddatosnomenclador')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=? ', array($identidad)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    //SE OBTIENE UN ARREGLO CON LAS ENTIDADES QUE SON SOLAMENTE ORGANOS DEMANDANTES
    public function getEntDatNom($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidaddatosnomenclador')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=? AND d.iddatosnomenclador=?', array($identidad, 2)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getTodosLosOrganosDemandantes() {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        ' d.iddatosnomenclador=?', 2
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        foreach ($res as $key => $value) {
            $arreglo [$key] = $value['identidad'];
        }
        return $arreglo;
    }

    public function getCB() {
        $query = new Doctrine_Query ();
        $res = $query->from('DatEntidaddatosnomenclador d')->where('d.iddatosnomenclador=?', 1)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();
        return $res;
    }

    public function getCB1($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->from('DatEntidaddatosnomenclador d')->where(
                        'd.iddatosnomenclador=? And d.identidad=?', array(1, $identidad)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getOD() {
        $query = new Doctrine_Query ();
        $res = $query->from('DatEntidaddatosnomenclador d')->where('d.iddatosnomenclador=?', 2)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();
        return $res;
    }

    public function getIdDatosNom($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidaddatosnomenclador')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.identidad =? AND d.iddatosnomenclador=?', array($identidad, 1))//->getSqlQuery();
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getCentrosDeBalance($arridentidad) {
        $query = new Doctrine_Query ();
        //print_r($arridentidad);die;
        $res = $query->select('d.identidad,d.identidaddatosnomenclador')
                ->from('DatEntidaddatosnomenclador d')
                ->whereIn('d.identidad', $arridentidad)
                ->addwhere(' d.iddatosnomenclador=?', 1)
                ->fetchArray();

        return $res;
    }

    public function getIdsDatosNomemclador($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidaddatosnomenclador, d.identidad')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.iddatosnomenclador=?', array(1))
                        ->whereIn('d.identidad', $identidad)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getIdEntidadDadoIdDatoNom($identidaddatosnom) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.identidaddatosnomenclador=?', $identidaddatosnom)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function getIdDatosNomOD($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidaddatosnomenclador')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.identidad =? AND d.iddatosnomenclador=?', array($identidad, 2))
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function obtenerEntidadDatosNomenclador($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidaddatosnomenclador,d.iddatosnomenclador')->from('DatEntidaddatosnomenclador d')
                        ->where('d.identidad =? AND (d.iddatosnomenclador=? OR d.iddatosnomenclador=?) ', array($identidad, 1, 2))
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function IdEntidadExisteComp($identidad, $iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=? AND d.iddatosnomenclador=?', array($identidad, $iddatosnomenclador)
                )->execute()->toArray();
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    public function ExisteComp($iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')
                        ->from('DatEntidaddatosnomenclador d')
                        ->where('d.iddatosnomenclador=?', array($iddatosnomenclador))
                        ->execute()->toArray();
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    public function existeCentroBalance($identidad, $iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')
                        ->from('DatEntidaddatosnomenclador d')
                        ->innerJoin('d.DatIndicadorcentrobalance ed')
                        ->where('d.identidad=? AND d.iddatosnomenclador=? AND d.identidaddatosnomenclador=ed.identidaddatosnomenclador ', array($identidad, $iddatosnomenclador))
                        ->execute()->toArray();
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    public function ExisteRector($identidad, $iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad<>? AND d.iddatosnomenclador=?', array($identidad, $iddatosnomenclador)
                )->execute()->toArray();
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    public function ExisteCompRector($iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        ' d.iddatosnomenclador=?', array($iddatosnomenclador)
                )->execute()->toArray();
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    public function EliminarComp($identidad, $iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->delete('DatEntidaddatosnomenclador')->from('DatEntidaddatosnomenclador')->where(
                        'identidad=? AND iddatosnomenclador=?', array($identidad, $iddatosnomenclador)
                )->execute();
    }

    public function obtenerEntidades($identidad) {
        $query = new Doctrine_Query ();
        return $res = $query->select('d.identidaddatosnomenclador')->from('DatEntidaddatosnomenclador d')->where(
                        'd.iddatosnomenclador = ? AND d.identidad = ?', array(1, $identidad)
                )->execute()->toArray();
    }

    public function obtenerEntidadRectora() {

        $query = new Doctrine_Query ();
        $rectora = 'rectorbalance';
        $res = $query->select('d.identidad')
                        ->from(' DatEntidaddatosnomenclador d  ')
                        ->innerJoin(' d.NomDatosnomenclador ndn')
                        ->where('ndn.uridatosnomenclador =?', $rectora)
                        ->execute()->toArray();

        return $res;
    }

    public function IdEntidadExisteCompAux($identidad, $iddatosnomenclador) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=? AND d.iddatosnomenclador=?', array($identidad, $iddatosnomenclador)
                )->execute()->toArray();

        return $res;
    }

    public function IdEntidadExisteCompAux1($identidad) {
        $query = new Doctrine_Query ();
        $res = $query->select('d.identidad')->from('DatEntidaddatosnomenclador d')->where(
                        'd.identidad=? ', $identidad)->execute()->toArray();

        return $res;
    }

}

//fin clase DatEntidaddatosnomenclador
?>
