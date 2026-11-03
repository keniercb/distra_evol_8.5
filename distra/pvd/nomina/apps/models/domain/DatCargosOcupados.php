<?php

class DatCargosOcupados extends BaseDatCargosOcupados
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomSituacionLaboral', array('local' => 'idsituacionlaboral', 'foreign' => 'idsituacionlaboral'));
        $this->hasOne('ConfPlantillaNominalCargo', array('local' => 'idcargo', 'foreign' => 'idcargo'));
    }

    public static function obtenerObj($idcargosocupados)
    {
        return Doctrine::getTable('DatCargosOcupados')->find($idcargosocupados);
    }

    public static function buscarAreaPersona($idpersona)
    {

        return Doctrine_Query::create()
            ->select('pn.idarea as idarea')
            ->from('DatCargosOcupados co')
            ->innerJoin('co.ConfPlantillaNominalCargo pnc ')
            ->innerJoin('pnc.ConfPlantillaNominal pn ')
            ->where("co.idpersona=? and pn.fechafin is null", array($idpersona))
            ->fetchArray();
    }

    /* Devuelve todas las personas que pertencen a un area determinada
     *
     * */
    public static function buscarPersonaAreas($idareas, $idestructura, $idpagoresultado)
    {
        $sql = " SELECT DISTINCT mod_nomina.dat_cargosocupados.idpersona,
                 mod_persona.dat_persona.nombre ||' '|| mod_persona.dat_persona.papel|| ' '|| mod_persona.dat_persona.sapel as nombreapellido,
                  mod_nomina.nom_areas.idarea,
                  mod_nomina.nom_areas.denominacion as area,
				  mod_persona.dat_docidentidad.numero as ci,
				  mod_nomina.dat_cargosocupados.idcargo as idcargo,
				  mod_nomina.conf_elementosalarialcargo.importe as salarioescala
                FROM
                  mod_nomina.dat_cargosocupados,
                  mod_nomina.nom_areascargos,
                  mod_nomina.conf_plantillanominalcargo,
                  mod_persona.dat_persona,
                  mod_nomina.nom_areas,
                  mod_nomina.conf_cargospagoporresultado,
				  mod_persona.dat_docidentidad,
				  mod_nomina.conf_elementosalarialcargo
                WHERE
                  mod_nomina.dat_cargosocupados.idcargo = mod_nomina.nom_areascargos.idcargo  AND
				  mod_persona.dat_docidentidad.idpersona = mod_nomina.dat_cargosocupados.idpersona  AND
                  mod_nomina.nom_areascargos.idcargo = mod_nomina.conf_cargospagoporresultado.idcargo AND
                  mod_nomina.nom_areascargos.idarea = mod_nomina.conf_cargospagoporresultado.idarea AND
                  mod_nomina.nom_areascargos.idarea = mod_nomina.nom_areas.idarea AND
                  mod_nomina.dat_cargosocupados.idpersona=mod_persona.dat_persona.idpersona and

                  mod_nomina.dat_cargosocupados.idcargo=mod_nomina.conf_elementosalarialcargo.idcargo and

                  mod_nomina.nom_areas.idarea in (" . implode(',', $idareas) . ")
                  and mod_nomina.nom_areas.idestructura = ? and mod_nomina.conf_cargospagoporresultado.idpagoporresultado = ?
				  and mod_persona.dat_docidentidad.principal = 1;
                  ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idestructura, $idpagoresultado));

    }

    /* Devuelve todas las personas que pertencen a las entidades de un area determinada
     *
     * */
    public static function buscarPersonaEntidadesArea($idareas, $idestructura, $idpagoresultado)
    {
        $sql = " SELECT DISTINCT mod_nomina.dat_cargosocupados.idpersona,
                 mod_persona.dat_persona.nombre ||' '|| mod_persona.dat_persona.papel|| ' '|| mod_persona.dat_persona.sapel as nombreapellido,
                  mod_nomina.nom_areas.idarea,mod_estructuracomp.dat_estructura.idestructura as identidad,
                  mod_nomina.nom_areas.denominacion ||' - '|| mod_estructuracomp.dat_estructura.denominacion as area,
				  mod_persona.dat_docidentidad.numero as ci
                FROM
                  mod_nomina.dat_cargosocupados,
                  mod_nomina.nom_areascargos,
                  mod_nomina.conf_plantillanominalcargo,
                  mod_persona.dat_persona,
                  mod_nomina.nom_areas,
                  mod_estructuracomp.dat_estructura,
                  mod_nomina.conf_cargospagoporresultado,
				  mod_persona.dat_docidentidad
                WHERE
                  mod_nomina.dat_cargosocupados.identidad = mod_nomina.nom_areascargos.idcargo  AND
                  mod_persona.dat_docidentidad.idpersona = mod_nomina.dat_cargosocupados.idpersona  AND
                  mod_nomina.nom_areascargos.idcargo = mod_nomina.conf_cargospagoporresultado.idcargo AND
                  mod_nomina.nom_areascargos.idarea = mod_nomina.conf_cargospagoporresultado.idarea AND
                  mod_nomina.nom_areascargos.idarea = mod_nomina.nom_areas.idarea AND
                  mod_nomina.dat_cargosocupados.idpersona=mod_persona.dat_persona.idpersona and
                  mod_nomina.nom_areas.idarea in (" . implode(',', $idareas) . ")
                  AND mod_estructuracomp.dat_estructura.idestructura = mod_nomina.nom_areascargos.idcargo
                  and mod_nomina.nom_areas.idestructura = ? and mod_nomina.conf_cargospagoporresultado.idpagoporresultado = ?
				  and mod_persona.dat_docidentidad.principal = 1;
                  ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idestructura, $idpagoresultado));

    }

    //Funcion para buscar la plantilla nominal de la persona
    public static function buscarPlantillaPersona($idpersona)
    {
        $sql = "SELECT
                 DISTINCT (dco.idpersona),dco.identidad,
                 (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idplantillanominal,
					(CASE WHEN dco.idplantillanominal is not null THEN (select cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.denominacion ELSE 'Sin plantilla nominal' END) as plantilla
                FROM
                  mod_nomina.dat_cargosocupados dco
                LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
                LEFT JOIN mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal)
                WHERE dco.idpersona = ?";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpersona));

    }

    public static function getIdpersonas($idcargo, $identidad)
    {

        //Devolviendo la cantidad total de los salarios especificos.
        /* $query = new Doctrine_Query ();
         $result = $query->select('idpersona')
                 ->from('DatCargosOcupados')
                 ->where("idcargo=? and identidad=?", array($idcargo,$identidad))
                 ->execute();
         return $result;*/
        return Doctrine_Query::create()
            ->select('idpersona')
            ->from('DatCargosOcupados ')
            ->where("idcargo=? and identidad=?", array($idcargo, $identidad))
            ->fetchArray();
    }

    public function obtenerPersonaOcupaCargo($idcargo)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('idpersona')
                ->from('DatCargosOcupados')
                ->where('idcargo = ?', array($idcargo))
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerCCostoPersona($idpersona, $identidad)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('dco.idcentrocosto')
                ->from('DatCargosOcupados dco')
                ->where('dco.idpersona = ? and dco.identidad = ?', array($idpersona, $identidad))
                ->execute();

            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerCentroCostoPersona($idpersona, $identidad)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('idcentrocosto')
                ->from('DatCargosOcupados')
                ->where('idpersona = ? and identidad = ?', array($idpersona, $identidad))
                ->fetchOne()['idcentrocosto'];


            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerIdCargosOcupadosPersonaCargoEntidad($idpersona, $identidad, $idcargo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('idcargosocupados')
            ->from('DatCargosOcupados')
            ->where('idpersona = ? and identidad = ? and idcargo = ?', array($idpersona, $identidad, $idcargo))
            ->fetchOne()->idcargosocupados;
        return $result;

    }

    public function dameCodigoCentroGrupo($idcentrocosto, $arrayCentroCostoEntidad)
    {

        foreach ($arrayCentroCostoEntidad as $kCdg => $vCdg) {
            if ($idcentrocosto == $vCdg->idcentrogrupo) {
                return $vCdg;
            }
        }
        return false;
    }

    public static function obtenerCentroCostoxCargoOcupado($idcargosocupados)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = new Doctrine_Query ();
        $result = $query->select('idcentrocosto')
            ->from('DatCargosOcupados')
            ->where("idcargosocupados=?", array($idcargosocupados))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public static function obtenerCentroCostoxCargoOcupadoText($idcargosocupados)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = Doctrine_Query::create()->select('idcentrocosto')
            ->from('DatCargosOcupados')
            ->where("idcargosocupados=?", array($idcargosocupados))
            ->fetchOne()
            ->idcentrocosto;
        return $query;
    }

    public static function tieneCentroCostoxCargoOcupado($idcargosocupados)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = Doctrine_Query::create()->select('count(idcentrocosto) AS cantidad')
            ->from('DatCargosOcupados')
            ->where("idcargosocupados=?", array($idcargosocupados))
            ->fetchOne()
            ->cantidad;
        return $query;
    }

    public static function tieneCentroCostoxIdpersona($idpersona)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = Doctrine_Query::create()->select('count(idplantillanominal) AS cantidad')
            ->from('DatCargosOcupados')
            ->where("idpersona=?", array($idpersona))
            ->fetchOne()
            ->cantidad;
        return $query;
    }

    public function obtenerListadoCargosOcupadosActual($idpersona, $identidad, $inicio = 0, $limite = 15)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT dco.*,  nsl.denominacion as denomsituacionlaboral,
            (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE - 1 END)  as idplantilla,
            ((CASE WHEN dco.idplantillanominal is not null THEN (  select cpx.denominacion from mod_nomina.conf_plantillanominal cpx    where cpx.idplantillanominal = dco.idplantillanominal )
                 WHEN cpn.denominacion <> '' THEN cpn.denominacion ELSE 'Sin plantilla nominal'   END)) as plantilla
      
        FROM mod_nomina.dat_cargosocupados dco  
        LEFT JOIN mod_nomina.nom_situacionlaboral nsl on (dco.idsituacionlaboral = nsl.idsituacionlaboral)
        LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
        LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal and cpn.identidad = $identidad)
        
        WHERE dco.idpersona = $idpersona and dco.identidad = $identidad";

        return $conn->fetchAll($sql);
    }

    public function obtenerListadoCargosOcupadosEntidad($identidad, $inicio = 0, $limite = 15)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('dco.idcargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero, dco.idpersonacuentabancariamn, dco.idpersonacuentabancariacuc')
                ->from('DatCargosOcupados dco')
                ->leftJoin('dco.NomSituacionLaboral nsl')
                ->where('identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($identidad))
                ->limit($limite)
                ->offset($inicio)
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerListadoTodosCargosOcupadosEntidad($identidad)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('dco.idcargosocupados')
                ->from('DatCargosOcupados dco')
                ->where('dco.identidad = ?', array($identidad))
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public static function obtenerIdCargosOcupadosPersona($idpersona, $identidad, $inicio = 0, $limite = 10)
    {

        return Doctrine_Query::create()->select('idcargo as idcargo')
            ->from('DatCargosOcupados as dco')
            ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
            ->limit($limite)
            ->offset($inicio)
            ->fetchArray();
    }

    public static function obtenerCargoOcupadoPersonaEntidad($idpersona, $identidad)
    {

        return Doctrine_Query::create()->select('idcargosocupados')
            ->from('DatCargosOcupados')
            ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
            ->fetchArray();
    }

    public static function obtenerIdCargosOcupadosPersonaEntidad($idpersona, $identidad, $idcargo)
    {
        return Doctrine_Query::create()->select('idcargosocupados AS idcargosocupados')
            ->from('DatCargosOcupados')
            ->where('idpersona = ? and identidad = ? and idcargo = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad, $idcargo))
            ->fetchOne()
            ->idcargosocupados;
    }

    public static function obtenerIdCargosXIdCargoOcupado($idcargosocupados)
    {
        return Doctrine_Query::create()->select('idcargo AS idcargo')
            ->from('DatCargosOcupados')
            ->where('idcargosocupados = ? ', array($idcargosocupados))
            ->fetchOne()
            ->idcargo;
    }

    public static function obtenerIdPersonaXIdCargoOcupado($idcargosocupados)
    {
        return Doctrine_Query::create()->select('idpersona AS idpersona')
            ->from('DatCargosOcupados')
            ->where('idcargosocupados = ? ', array($idcargosocupados))
            ->fetchOne()
            ->idpersona;
    }

    public function obtenerListadoCargosOcupadosHistorico($idpersona, $identidad, $inicio = 0, $limite = 15)
    {
        // try {
        //     $query = new Doctrine_Query();
        //     $result = $query->select('dco.idcargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
        //                             dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero')
        //         ->from('DatCargosOcupados dco')
        //         ->leftJoin('dco.NomSituacionLaboral nsl')
        //         ->where('idpersona = ? and identidad = ? and (fechavencimiento <= now())', array($idpersona, $identidad))
        //         ->limit($limite)
        //         ->offset($inicio)
        //         ->execute();
        //     return $result->toArray();
        // } catch (Doctrine_Exception $e) {
        //     throw $e;
        // }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT dco.*, nsl.denominacion as denomsituacionlaboral
            FROM mod_nomina.dat_cargosocupados dco
            LEFT JOIN mod_nomina.nom_situacionlaboral nsl on (nsl.idsituacionlaboral = dco.idsituacionlaboral) 
            WHERE dco.idpersona = $idpersona and dco.identidad = $identidad and dco.fechavencimiento <= now()::date;";
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function cantdCargosOcupadosxPersona($idpersona, $identidad)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('dco.idcargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero')
                ->from('DatCargosOcupados dco')
                ->leftJoin('dco.NomSituacionLaboral nsl')
                ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
                ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantdCargosOcupadosHistoricoxPersona($idpersona, $identidad)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('dco.idcargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero')
                ->from('DatCargosOcupados dco')
                ->leftJoin('dco.NomSituacionLaboral nsl')
                ->where('idpersona = ? and identidad = ? and (fechavencimiento <= now())', array($idpersona, $identidad))
                ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function verficarExistenciadelCargo($idpersona, $identidad, $idcargo, $idplantillanominal)
    {
        try {
            $query = new Doctrine_Query();
            if ($idcargo != null) {
                $result = $query//->select('idpersona')
                ->from('DatCargosOcupados')
                    ->where('idpersona = ? and identidad = ? and idcargo = ?', array($idpersona, $identidad, $idcargo))
                    ->count();
                if ($result == 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function verificarExistenciadelaSituacionLaboral($idpersona, $identidad, $idsituacionlaboral, $idplantillanominal)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->from('DatCargosOcupados')
                ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idsituacionlaboral = ?', array($idpersona, $identidad, $idplantillanominal, $idsituacionlaboral))
                ->count();
            if ($result == 0) {
                return false;
            } else {
                return true;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerListadoPersonas($identidad, $limit = 15, $start = 0)
    {
        try {
            $queryObj = Doctrine_Query::create()
                ->select('distinct(dco.idpersona) as idpersona')
                ->from('DatCargosOcupados dco')
                ->where('dco.identidad = ? and dco.fechavencimiento > now() or dco.fechavencimiento is null', $identidad)
                ->orderBy('dco.idpersona DESC')
                ->limit($limit)
                ->offset($start);
            //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
            $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'dco', 'p');
            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    public function obtenerListadoPersonasOcupanCargosEntidad($identidad, $limit = 15, $start = 0)
    {
        try {
            $queryObj = Doctrine_Query::create()
                ->select('dco.idpersona')
                ->from('DatCargosOcupados dco')
                ->orderBy('dco.idpersona DESC')
                ->where('dco.identidad = ?', array($identidad))
                ->limit($limit)
                ->offset($start);
            //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
            //$queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'dco','p');
            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $exc) {
            throw $e;
        }
    }

    public function obtenerCantidadPersonas($identidad)
    {
        try {
            $queryObj = Doctrine_Query::create()
                ->select('distinct(dco.idpersona) as idpersona')
                ->from('DatCargosOcupados dco')
                ->where('dco.identidad = ? and (dco.fechavencimiento > now() or dco.fechavencimiento is null)', $identidad)
                ->count();
            return $queryObj;
        } catch (Doctrine_Exception $exc) {
            throw $e;
        }
    }

    public function verficarExistenciadelCargoMod($idpersona, $identidad, $idcargo, $idcargosocupados, $idplantillanominal)
    {
        try {
            $query = new Doctrine_Query();
            if ($idcargo != null) {
                $result = $query//->select('idpersona')
                ->from('DatCargosOcupados')
                    ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idcargo = ? and idcargosocupados <> ?', array($idpersona, $identidad, $idplantillanominal, $idcargo, $idcargosocupados))
                    ->count();
                if ($result == 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function verificarExistenciadelaSituacionLaboralMod($idpersona, $identidad, $idsituacionlaboral, $idcargosocupados, $idplantillanominal)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query
                ->from('DatCargosOcupados')
                ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idsituacionlaboral = ? and idcargosocupados <> ?', array($idpersona, $identidad, $idplantillanominal, $idsituacionlaboral, $idcargosocupados))
                ->count();
            if ($result == 0) {
                return false;
            } else {
                return true;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /*Todas las personas que ocupan cargos en la entidad dada*/
    public function obtenerPersonasOcupanCargos($identidad)
    {
        $sql = "select distinct (idpersona), idcargosocupados, idcargo
					from mod_nomina.dat_cargosocupados 
					where identidad = ? and (fechavencimiento >= now() or fechavencimiento is null);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
    }

    public function obtenerIDPersonasOcupanCargos($identidad)
    {
        $conn = Doctrine_Manager::connection();
        $sql = "select distinct (idpersona)
					from mod_nomina.dat_cargosocupados 
					where identidad = $identidad and (fechavencimiento >= now() or fechavencimiento is null);";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    /*Cargos ocupados de las personas pasadas por parametros*/
    public function obtenerCargosOcupadosPersonas($arrPersonas, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select distinct (idpersona), idcargosocupados
					from mod_nomina.dat_cargosocupados 
					where identidad = ? and idpersona in (" . implode(',', $arrPersonas) . ") ;";//and (fechavencimiento >= now() or fechavencimiento is null)
        return $conn->fetchAll($sql, array($identidad));
    }

    public function obtenerLisPerSituacionServicio()
    {
        return Doctrine_Query::create()
            ->select('dco.idcargosocupados,idpersona')
            ->from('DatCargosOcupados dco')
            ->where('dco.idsituacionlaboral is not null')
            ->fetchArray();
    }

    /*Obtener todos los cargos ocupados dado un idsituacionlaboral */
    public function obtenerLisPerDadoIDSituacionServicio($idsituacionlaboral)
    {
        return Doctrine_Query::create()
            ->select('dco.*')
            ->from('DatCargosOcupados dco')
            ->where("dco.idsituacionlaboral= ?", array($idsituacionlaboral))
            ->fetchArray();
    }

    public function obtenerPersonasOcupanCargosPeriodoXCategoriasPersonal($identidad, $idperiodopago)
    {
        $sql = "select distinct (dco.idpersona), dco.idcargosocupados
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idcargosocupados)
					where dco.identidad = ? and (cesc.idperiodopago = ? or cesss.idperiodopago = ?) and (dco.fechavencimiento >= now() or dco.fechavencimiento is null);";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad, $idperiodopago, $idperiodopago));
    }

    /*Devuelve todas las personas que ocupan cargos que tienen configurado el periodo de pago que se pasa por parametro en la entidad dada*/
    public function obtenerPersonasOcupanCargosPeriodo($identidad, $idperiodopago)
    {
        $sql = "select distinct (dco.idpersona), dco.idcargosocupados
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo and cesc.idperiodopago = {$idperiodopago})
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idcargosocupados and cesss.idperiodopago = {$idperiodopago})
					where dco.identidad = ?;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
    }

    public function obtenerPersonasOcupanCargosPeriodoCategoriasPersonal($identidad, $idperiodopago, $arraycategorias)
    {
        $sql = "select distinct (dco.idpersona), dco.idcargosocupados
					from mod_nomina.dat_cargosocupados dco
					inner join mod_persona.dat_persona dp on (dp.idpersona = dco.idpersona)
					inner join mod_personaext.dat_categoria dpc on (dpc.idpersona = dp.idpersona)
					inner join mod_personaext.nom_categoriapersona ncp on (ncp.idcategoriapersona = dpc.idcategoriapersona)
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idcargosocupados)
					where dco.identidad = ? and (cesc.idperiodopago = ? or cesss.idperiodopago = ?) and (dco.fechavencimiento >= now() or dco.fechavencimiento is null) and (ncp.idcategoriapersona IN (" . implode(',', $arraycategorias) . ") ) ;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad, $idperiodopago, $idperiodopago));
    }
    /* datos de la categoria persona adaptados para trd
     *


     * */

    /*Devuelve todos los cargos y situaciones que tienen configurado en el periodo de pago que se pasa por parametro en la entidad dada de una persona*/
    public function obtenerCargosOcupadosPersonaPeriodo($identidad, $idpersona, $idperiodopago)
    {
        $sql = "select dco.*, nsl.denominacion as denomsituacionlaboral
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.nom_situacionlaboral nsl on (nsl.idsituacionlaboral = dco.idsituacionlaboral)
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idcargosocupados)
					where dco.identidad = ? and dco.idpersona = ? and (cesc.idperiodopago = ? or cesss.idperiodopago = ?) and (dco.fechavencimiento >= now() or dco.fechavencimiento is null);";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad, $idpersona, $idperiodopago, $idperiodopago));
    }

    public function obtenerPersonaElaborarPagoCargosOcupados($arridcargosocupados)
    {
        $sql = "select dco.*, nsl.denominacion as denomsituacionlaboral
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.nom_situacionlaboral nsl on (nsl.idsituacionlaboral = dco.idsituacionlaboral)
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idcargosocupados)
					where dco.idcargosocupados in (" . implode(',', $arridcargosocupados) . ");";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    /*Devuelve todos los conceptos de percepciones y descuentos asociados al cargo o situacion laboral*/
    public function obtenerConceptosPDAsociados($idcargosocupados)
    {
        $sql = "select * from mod_nomina.dat_cargosocupados where idcargosocupados = ? and (fechavencimiento >= now() or fechavencimiento is null);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rco = $conn->fetchAll($sql, array($idcargosocupados));
        if (count($rco) > 0) {
            if ($rco[0]['idsituacionlaboral'] != '') {
                $sql = "select idconceptopercepciondescuento
							from mod_nomina.conf_conceptpelementsalarialessituacionservicio 
							where idcargosocupados = ? and (fechafin >= now() or fechafin is NULL);";
                $a = array($idcargosocupados);
            } else {
                $sql = "select cesc.*, ccpds.idconceptopercepciondescuento
							from mod_nomina.conf_elementosalarialcargo cesc
							inner join mod_nomina.conf_conceptospdelementossalariales ccpds on (ccpds.idelementosalarialcargo = cesc.idelementosalarialcargo) 
							where cesc.idcargo = ? and (cesc.fechafin >= now() or cesc.fechafin is NULL);";
                $a = array($rco[0]['idcargo']);
            }
            $datos = $conn->fetchAll($sql, $a);
            $r->datos = $datos;
            if (count($datos) > 0)
                $r->resultado = 1;
            else
                $r->resultado = -1;

        } else {
            $r->resultado = -1;
        }

        return $r;
    }

    /*Devuelve la config de elementos salariales al cargo o a la situacion laboral*/
    public function obtenerConfElementosAsociados($idcargosocupados)
    {
        $sql = "select * from mod_nomina.dat_cargosocupados where idcargosocupados = ? and (fechavencimiento >= now() or fechavencimiento is null);";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rco = $conn->fetchAll($sql, array($idcargosocupados));
        $datos = null;
        if (count($rco) > 0) {
            if ($rco[0]['idsituacionlaboral'] != '') {
                $sql = "select *
							from mod_nomina.conf_elementosalarialsituacionservicio 
							where idcargoocupado = ? and (fechafin >= now() or fechafin is NULL);";
                $a = array($idcargosocupados);
                $datos = $conn->fetchAll($sql, $a);
                if (count($datos) > 0) {
                    //No hago nada
                } else {
                    $sql = "select *
							from mod_nomina.conf_elementosalarialcargo 
							where idcargo = ? and (fechafin >= now() or fechafin is NULL);";
                    $a = array($rco[0]['idcargo']);
                    $datos = $conn->fetchAll($sql, $a);
                }
            } else {
                $sql = "select *
							from mod_nomina.conf_elementosalarialcargo 
							where idcargo = ? and (fechafin >= now() or fechafin is NULL);";
                $a = array($rco[0]['idcargo']);
            }
            $datos = $conn->fetchAll($sql, $a);
            $r->datos = $datos;
            if (count($datos) > 0)
                $r->resultado = 1;
            else
                $r->resultado = -1;

        } else {
            $r->resultado = -1;
        }

        return $r;
    }

    public function obtenerPersonasNoOcupanCargosContenidasEnArr($identidad, $idplantillanominal, $cajacajero, $arrPersonasPeriodoPago, $tipomoneda = null)
    {
        $sql = "select distinct(dco.idpersona), dco.idcargosocupados, dco.idcargo, dco.idsituacionlaboral
					from mod_nomina.dat_cargosocupados dco
					where dco.identidad = ? and dco.fechaaplicacion <= now() and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)
					and dco.idcargo is null  and dco.idsituacionlaboral is not null and dco.idplantillanominal = ? and dco.idcajacajero = ? and dco.idpersona in(" . implode(',', $arrPersonasPeriodoPago) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($identidad, $idplantillanominal, $cajacajero));
        return $r;
    }

    /* public function obtenerPersonasNoOcupanCargosContenidasEnArr($identidad, $idplantillanominal, $cajacajero, $arrPersonasPeriodoPago){
         $sql = "select distinct(dco.idpersona), dco.idcargosocupados, dco.idcargo, dco.idsituacionlaboral
                     from mod_nomina.dat_cargosocupados dco
                     where dco.identidad = ? and dco.fechaaplicacion <= now() and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)
                     and dco.idcargo is null  and dco.idsituacionlaboral is not null and dco.idcajacajero = ? and dco.idpersona in(".implode(',',$arrPersonasPeriodoPago).");";
         $mg = Doctrine_Manager::getInstance();
         $conn = $mg->getCurrentConnection();
         $r = $conn->fetchAll($sql, array($identidad, $cajacajero));
         return $r;
     }*/
    public static function obtenerExisteCargoPersonaEntidad($idpersona, $identidad, $idcargo)
    {
        return Doctrine_Query::create()->select('count(idcargosocupados) AS cantidad')
            ->from('DatCargosOcupados')
            ->where('idpersona = ? and identidad = ? and idcargo = ?', array($idpersona, $identidad, $idcargo))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenerCantidadCargoPersonaEntidad($idpersona, $identidad)
    {
        return Doctrine_Query::create()->select('count(idcargosocupados) AS cantidad')
            ->from('DatCargosOcupados')
            ->where('idpersona = ? and identidad = ?', array($idpersona, $identidad))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenerIdCargosOcupadosPlantillaN($idpersona, $identidad, $inicio = 0, $limite = 10)
    {

        return Doctrine_Query::create()->select('idplantillanominal as idplantillanominal')
            ->from('DatCargosOcupados as dco')
            ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
            ->limit($limite)
            ->offset($inicio)
            ->fetchArray();
    }

    /*Busca todos los idcargosocupados dado la estructura y las personas que la ocupan*/
    public function obtenerCargosOcupadosPorPersonayEntidad($idestructura, $arrPersonas)
    {
        $sql = "select distinct(dco.idpersona), dco.idcargosocupados, dco.idcargo from mod_nomina.dat_cargosocupados dco
	       where dco.identidad = ? and dco.fechaaplicacion <= now() and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)
                and dco.idpersona in(" . implode(',', $arrPersonas) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idestructura));
    }

    public function verificarcargo($idpersona, $arrcargos)
    {
        $rcargos = implode(',', $arrcargos);

        $sql = "select sit.*,pe.idpersona
                from mod_persona.dat_situacionlaboral sit
                inner join  mod_persona.dat_personaentidad pe on (sit.idpersonaentidad = pe.idpersonaentidad)
                where pe.idpersona = ? and sit.idcargo in(" . $rcargos . ") and (sit.fhasta is null or sit.fhasta >= now())";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idpersona));
        return $r;
    }

    public static function obtenerPersonasxEntidadCargo($identidad, $idcargo)
    {

        return Doctrine_Query::create()->select('idpersona, idcargosocupados')
            ->from('DatCargosOcupados as dco')
            ->where('identidad = ? and idcargo = ?', array($identidad, $idcargo))
            ->fetchArray();
    }

    public static function obtenerPersonasxCargo($idcargo)
    {

        return Doctrine_Query::create()->select('idpersona')
            ->from('DatCargosOcupados as dco')
            ->where('idcargo = ?', array($idcargo))
            ->fetchArray();
    }

    public static function existeCargoFuerzaTrabajo($idpersona, $idcargo)
    {
        $sql = "select count (sit.idsituacionlaboralp)
                from mod_persona.dat_situacionlaboral sit
                inner join mod_persona.dat_personaentidad pe on(pe.idpersonaentidad = sit.idpersonaentidad)                
                where pe.idpersona = ? and sit.idcargo = ? and (sit.fhasta is null or sit.fhasta >= now())";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchOne($sql, array($idpersona, $idcargo));
        return $r;
    }

    public static function obtenerCargoFuerzaTrabajo($idpersona)
    {
        $sql = "select sit.idcargo
                from mod_persona.dat_situacionlaboral sit
                inner join mod_persona.dat_personaentidad pe on(pe.idpersonaentidad = sit.idpersonaentidad)                
                where pe.idpersona = ? and (sit.fhasta is null or sit.fhasta >= now())";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idpersona));
        return $r;
    }

    public static function obtenerCantidadCargoPersona($idpersona, $idcargo)
    {

        return Doctrine_Query::create()->select('idpersona, idcargosocupados')
            ->select('count(idcargosocupados) as cantidad')
            ->from('DatCargosOcupados as dco')
            ->where('idpersona = ? and idcargo = ?', array($idpersona, $idcargo))
            ->fetchOne()->cantidad;
    }

    public static function obtenerCargoPersonaEntidad($idpersona, $identidad)
    {

        return Doctrine_Query::create()
            ->select('dco.idcargo')
            ->from('DatCargosOcupados as dco')
            ->where('idpersona = ? and identidad = ?', array($idpersona, $identidad))
            ->fetchOne()->idcargo;
    }

    public static function obtenerIdCargoXIdCargoOcupado($idcargoocupado)
    {

        return Doctrine_Query::create()
            ->select('dco.idcargo')
            ->from('DatCargosOcupados as dco')
            ->where('idcargosocupados = ?', array($idcargoocupado))
            ->fetchOne()->idcargo;
    }

    public static function obtenerCargoOcupadoXIdPersonaCargo($idpersona, $idcargo)
    {

        return Doctrine_Query::create()
            ->select('dco.idcargosocupados')
            ->from('DatCargosOcupados as dco')
            ->where('dco.idpersona = ? and dco.idcargo = ?', array($idpersona, $idcargo))
            ->fetchOne()->idcargosocupados;
    }

    public function obtenerDatosCuentaBancaria($idcargoocupado){

        /*$sqldatoscuenta = "select datcban.idmoneda,datcban.numerocuenta,datcban.idtipoacreditacionsalario,tc.abreviatura from mod_personaext.dat_cuentabancaria datcban
          left join mod_personaext.nom_tipoacreditacionsalario tc on (tc.idtipoacreditacionsalario = datcban.idtipoacreditacionsalario)
          where datcban.idcuentabancaria =?;"; */

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlco = "SELECT dco.idpersonacuentabancariamn, datcban.idmoneda,datcban.numerocuenta,datcban.idtipoacreditacionsalario,tc.abreviatura FROM mod_nomina.dat_cargosocupados dco
                  inner join mod_personaext.dat_cuentabancaria datcban on datcban.idcuentabancaria = dco.idpersonacuentabancariamn
                  left join mod_personaext.nom_tipoacreditacionsalario tc on (tc.idtipoacreditacionsalario = datcban.idtipoacreditacionsalario)  
                  where dco.idcargosocupados = $idcargoocupado";
        $r = $conn->fetchAll($sqlco);
        return $r;   
    }

    public function modificarActivoPersona($idpersona, $activo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "UPDATE mod_nomina.dat_cargosocupados 
                SET activa = $activo
                WHERE idpersona = $idpersona;";
        $conn->execute($sql);

    }
}
